
import type { BucketSortStep, BucketSortBucket } from '@/types';

// Line mapping is conceptual as Bucket Sort can vary, esp. the sub-sort.
// This map focuses on the main phases and iterative bucket sort using insertion sort.
export const BUCKET_SORT_LINE_MAP = {
  funcDeclare: 1,
  handleEmpty: 2,
  initBuckets: 3, // Create n empty buckets
  bucketLoopInit: 4, // for (let i = 0; i < numBuckets; i++) buckets[i] = [];
  scatterLoop: 5,    // for (let i = 0; i < n; i++)
  calculateBucketIndex: 6, // const bucketIdx = Math.floor(arr[i] * numBuckets / (maxValue + 1));
  placeInBucket: 7,  // buckets[bucketIdx].push(arr[i]);
  sortBucketsLoop: 8, // for (let i = 0; i < numBuckets; i++)
  callSortOnBucket: 9, // insertionSort(buckets[i]); // (Conceptual sub-call)
  // Insertion Sort within bucket (conceptual highlights, not full step-by-step)
  bucketSortInnerLoopStart: 10,
  bucketSortCompareShift: 11,
  bucketSortPlaceTemp: 12,
  // End Insertion Sort
  gatherLoop: 13, // int index = 0; for (let i=0; i<numBuckets; i++)
  gatherInnerLoop: 14, // for (let j=0; j<buckets[i].length; j++)
  placeFromBucketToOutput: 15, // arr[index++] = buckets[i][j];
  returnArr: 16,
  funcEnd: 17,
};

const addStep = (
  steps: BucketSortStep[],
  line: number | null,
  currentArrState: number[], // Main array state (or output being built)
  message: string,
  bucketStates?: BucketSortBucket[],
  activeIndices?: number[], // For main array processing
  currentBucketIdx?: number, // For highlighting bucket being processed
  element?: number // Element being scattered or processed in sub-sort
) => {
  steps.push({
    array: [...currentArrState],
    activeIndices: activeIndices || [],
    swappingIndices: [], // Might be used if sub-sort animation is detailed
    sortedIndices: (line === BUCKET_SORT_LINE_MAP.returnArr) ? currentArrState.map((_,i) => i) : [],
    currentLine: line,
    message,
    buckets: bucketStates ? bucketStates.map(b => ({...b, elements: [...b.elements]})) : undefined,
    currentElement: element,
    currentBucketIndex: currentBucketIdx,
    auxiliaryData: { // For panel display
        ...(bucketStates && { bucketsDisplay: bucketStates.map(b => `B${b.id}: [${b.elements.join(',')}]`).join('; ') }),
        ...(currentBucketIdx !== undefined && { processingBucket: currentBucketIdx }),
    }
  });
};

// Simplified Insertion Sort for buckets (only a few steps per bucket for visualization)
function conceptualInsertionSortForBucket(bucket: number[], bucketId: number, mainArr: number[], allBuckets: BucketSortBucket[], localSteps: BucketSortStep[]) {
  const lm = BUCKET_SORT_LINE_MAP;
  if (bucket.length <= 1) {
    addStep(localSteps, lm.callSortOnBucket, mainArr, `Bucket ${bucketId} has ${bucket.length} element(s), already sorted.`, allBuckets, [], bucketId);
    return;
  }

  addStep(localSteps, lm.callSortOnBucket, mainArr, `Sorting Bucket ${bucketId}: [${bucket.join(',')}] using Insertion Sort.`, allBuckets, [], bucketId);
  // Simulate a few key steps of insertion sort for the bucket for visualization
  for (let i = 1; i < bucket.length; i++) {
    let key = bucket[i];
    let j = i - 1;
    addStep(localSteps, lm.bucketSortInnerLoopStart, mainArr, `Bucket ${bucketId} IS: Outer loop i=${i}, key=${key}.`, allBuckets.map(b => b.id === bucketId ? {...b, elements:[...bucket]} : b), [], bucketId, key);
    while (j >= 0 && bucket[j] > key) {
      addStep(localSteps, lm.bucketSortCompareShift, mainArr, `Bucket ${bucketId} IS: Compare ${bucket[j]} > ${key}. Shift ${bucket[j]}.`, allBuckets.map(b => b.id === bucketId ? {...b, elements:[...bucket]} : b), [], bucketId, bucket[j]);
      bucket[j + 1] = bucket[j];
      j = j - 1;
    }
    bucket[j + 1] = key;
    addStep(localSteps, lm.bucketSortPlaceTemp, mainArr, `Bucket ${bucketId} IS: Place key ${key} at index ${j+1}. Bucket: [${bucket.join(',')}]`, allBuckets.map(b => b.id === bucketId ? {...b, elements:[...bucket]} : b), [], bucketId, key);
  }
  const sortedBucket = allBuckets.find(b => b.id === bucketId);
  if (sortedBucket) sortedBucket.isSorted = true;
  addStep(localSteps, lm.callSortOnBucket, mainArr, `Bucket ${bucketId} sorted: [${bucket.join(',')}]`, allBuckets, [], bucketId);
}


export const generateBucketSortSteps = (arrToSort: number[], numBucketsParam?: number): BucketSortStep[] => {
  const localSteps: BucketSortStep[] = [];
  const lm = BUCKET_SORT_LINE_MAP;

  if (!arrToSort || arrToSort.length === 0) {
    addStep(localSteps, lm.handleEmpty, [], "Input array is empty.");
    return localSteps;
  }
  // Bucket Sort typically assumes input is uniformly distributed in [0, 1) or can be mapped to it.
  // For general integers, we need a max value to normalize, or a fixed number of buckets.
  // For visualization, we'll assume non-negative integers and use maxVal for scaling if numBuckets isn't fixed.
  // Or use a fixed number of buckets (e.g., 5 or sqrt(n)) and distribute based on range.

  let arr = [...arrToSort];
  const n = arr.length;
  const numBuckets = numBucketsParam || Math.max(1, Math.floor(Math.sqrt(n))) || 5; // Default to sqrt(n) buckets or 5

  addStep(localSteps, lm.funcDeclare, arr, `Starting Bucket Sort with ${numBuckets} buckets.`);

  const buckets: BucketSortBucket[] = Array.from({ length: numBuckets }, (_, i) => ({ id: i, elements: [], isSorted: false }));
  addStep(localSteps, lm.initBuckets, arr, `Initialized ${numBuckets} empty buckets.`, buckets);
  
  // Find max value for scaling if needed (for uniform distribution assumption for bucket index)
  let maxValue = 0;
  if (n > 0) {
    maxValue = Math.max(...arr);
    if (arr.some(x => x < 0)) {
        addStep(localSteps, lm.scatterLoop, arr, "Error: Bucket Sort (this version) expects non-negative numbers.", buckets);
        return localSteps; // Or handle negative numbers with an offset
    }
  }
  
  // Scatter elements into buckets
  addStep(localSteps, lm.scatterLoop, arr, "Distributing elements into buckets.", buckets);
  for (let i = 0; i < n; i++) {
    const element = arr[i];
    // Simple distribution: (element / (maxValue + 1)) * numBuckets
    // Ensure bucketIdx is within [0, numBuckets - 1]
    let bucketIdx = 0;
    if (maxValue > 0) { // Avoid division by zero if maxVal is 0 (e.g. array of all 0s)
        bucketIdx = Math.floor((element / (maxValue + 1)) * numBuckets);
    } else if (element === 0 && maxValue === 0) { // Handle array of all zeros
        bucketIdx = 0;
    }
    bucketIdx = Math.min(bucketIdx, numBuckets - 1); // Ensure it doesn't exceed last bucket index

    addStep(localSteps, lm.calculateBucketIndex, arr, `Element arr[${i}]=${element}. Calculated bucket index: ${bucketIdx}.`, buckets, [i], bucketIdx, element);
    buckets[bucketIdx].elements.push(element);
    addStep(localSteps, lm.placeInBucket, arr, `Placed ${element} into bucket ${bucketIdx}.`, buckets.map(b => ({...b, elements:[...b.elements]})), [i], bucketIdx, element);
  }
   addStep(localSteps, lm.scatterLoop, arr, "Finished distributing elements.", buckets);

  // Sort individual buckets
  addStep(localSteps, lm.sortBucketsLoop, arr, "Sorting individual buckets.", buckets);
  for (let i = 0; i < numBuckets; i++) {
    conceptualInsertionSortForBucket(buckets[i].elements, i, arr, buckets, localSteps);
    // After conceptual sort, mark bucket as sorted for visualization
    const currentBucketVisual = buckets.find(b => b.id === i);
    if(currentBucketVisual) currentBucketVisual.isSorted = true;
  }
  addStep(localSteps, lm.sortBucketsLoop, arr, "All buckets sorted.", buckets);

  // Gather elements from buckets
  let outputIndex = 0;
  const outputArrDisplay = new Array(n).fill(undefined); // For visualizing gathering
  addStep(localSteps, lm.gatherLoop, outputArrDisplay, "Gathering sorted elements from buckets.", buckets, [], undefined, undefined);
  for (let i = 0; i < numBuckets; i++) {
    addStep(localSteps, lm.gatherLoop, outputArrDisplay, `Processing bucket ${i}.`, buckets, [], i);
    for (let j = 0; j < buckets[i].elements.length; j++) {
      arr[outputIndex] = buckets[i].elements[j];
      outputArrDisplay[outputIndex] = arr[outputIndex]; // Update visual output
      addStep(localSteps, lm.placeFromBucketToOutput, outputArrDisplay, `arr[${outputIndex}] = bucket[${i}][${j}] (${arr[outputIndex]}).`, buckets, [outputIndex], i, arr[outputIndex]);
      outputIndex++;
    }
  }
  addStep(localSteps, lm.gatherLoop, arr, "All elements gathered. Array is sorted.", buckets.map(b => ({...b, isSorted: true})));
  
  addStep(localSteps, lm.returnArr, arr, "Bucket Sort complete.");
  addStep(localSteps, lm.funcEnd, arr, "Algorithm finished.");
  return localSteps;
};
