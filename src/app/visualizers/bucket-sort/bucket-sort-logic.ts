
import type { BucketSortStep, BucketSortBucket } from './types'; // Local import

// Line mapping is conceptual as Bucket Sort can vary, esp. the sub-sort.
// This map focuses on the main phases and iterative bucket sort using insertion sort.
export const BUCKET_SORT_LINE_MAP = {
  funcDeclare: 1,
  handleEmpty: 2,
  initBuckets: 3, // Create n empty buckets
  // bucketLoopInit: 4, // for (let i = 0; i < numBuckets; i++) buckets[i] = []; (Implicit in initBuckets)
  scatterLoop: 5,    // for (let i = 0; i < n; i++)
  calculateBucketIndex: 6, // const bucketIdx = Math.floor((arr[i] / (maxVal + 1)) * numBuckets);
  placeInBucket: 7,  // buckets[bucketIdx].push(arr[i]);
  sortBucketsLoop: 8, // for (let i = 0; i < numBuckets; i++)
  callSortOnBucket: 9, // insertionSort(buckets[i]); // (Conceptual sub-call)
  // Insertion Sort within bucket (conceptual highlights, not full step-by-step)
  bucketSortInnerLoopStart: 10, // Inner loop of IS
  bucketSortCompareShift: 11,   // Comparison and shift in IS
  bucketSortPlaceTemp: 12,      // Placing element in IS
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
  element?: number, // Element being scattered or processed in sub-sort
  currentPhase?: BucketSortStep['phase']
) => {
  steps.push({
    array: [...currentArrState],
    activeIndices: activeIndices || [],
    swappingIndices: [], 
    sortedIndices: (line === BUCKET_SORT_LINE_MAP.returnArr) ? currentArrState.map((_,i) => i) : [],
    currentLine: line,
    message,
    buckets: bucketStates ? bucketStates.map(b => ({...b, elements: [...b.elements]})) : undefined,
    currentElement: element,
    currentBucketIndex: currentBucketIdx,
    phase: currentPhase,
    auxiliaryData: { 
        ...(bucketStates && { bucketsDisplay: bucketStates.map(b => `B${b.id}: [${b.elements.join(',')}]`).join('; ') }),
        ...(currentBucketIdx !== undefined && { processingBucket: currentBucketIdx }),
    }
  });
};

function conceptualInsertionSortForBucket(bucket: number[], bucketId: number, mainArr: number[], allBuckets: BucketSortBucket[], localSteps: BucketSortStep[]) {
  const lm = BUCKET_SORT_LINE_MAP;
  if (bucket.length <= 1) {
    addStep(localSteps, lm.callSortOnBucket, mainArr, `Bucket ${bucketId} has ${bucket.length} element(s), considered sorted.`, allBuckets, [], bucketId, undefined, 'sorting_buckets');
    const sortedBucket = allBuckets.find(b => b.id === bucketId);
    if (sortedBucket) sortedBucket.isSorted = true;
    return;
  }

  addStep(localSteps, lm.callSortOnBucket, mainArr, `Sorting Bucket ${bucketId}: [${bucket.join(',')}] using Insertion Sort.`, allBuckets, [], bucketId, undefined, 'sorting_buckets');
  for (let i = 1; i < bucket.length; i++) {
    let key = bucket[i];
    let j = i - 1;
    addStep(localSteps, lm.bucketSortInnerLoopStart, mainArr, `Bucket ${bucketId} IS: Outer loop i=${i}, key=${key}.`, allBuckets.map(b => b.id === bucketId ? {...b, elements:[...bucket]} : b), [], bucketId, key, 'sorting_buckets');
    while (j >= 0 && bucket[j] > key) {
      addStep(localSteps, lm.bucketSortCompareShift, mainArr, `Bucket ${bucketId} IS: Compare ${bucket[j]} > ${key}. Shift ${bucket[j]}.`, allBuckets.map(b => b.id === bucketId ? {...b, elements:[...bucket]} : b), [], bucketId, bucket[j], 'sorting_buckets');
      bucket[j + 1] = bucket[j];
      j = j - 1;
    }
    bucket[j + 1] = key;
    addStep(localSteps, lm.bucketSortPlaceTemp, mainArr, `Bucket ${bucketId} IS: Place key ${key} at index ${j+1}. Bucket: [${bucket.join(',')}]`, allBuckets.map(b => b.id === bucketId ? {...b, elements:[...bucket]} : b), [], bucketId, key, 'sorting_buckets');
  }
  const sortedBucket = allBuckets.find(b => b.id === bucketId);
  if (sortedBucket) sortedBucket.isSorted = true;
  addStep(localSteps, lm.callSortOnBucket, mainArr, `Bucket ${bucketId} sorted: [${bucket.join(',')}]`, allBuckets, [], bucketId, undefined, 'sorting_buckets');
}


export const generateBucketSortSteps = (arrToSort: number[], numBucketsParam?: number): BucketSortStep[] => {
  const localSteps: BucketSortStep[] = [];
  const lm = BUCKET_SORT_LINE_MAP;

  if (!arrToSort || arrToSort.length === 0) {
    addStep(localSteps, lm.handleEmpty, [], "Input array is empty.", undefined, undefined, undefined, undefined, 'initial');
    return localSteps;
  }
  
  let arr = [...arrToSort];
  const n = arr.length;
  const numBuckets = numBucketsParam || Math.max(1, Math.floor(Math.sqrt(n))) || 5; 

  addStep(localSteps, lm.funcDeclare, arr, `Starting Bucket Sort with ${numBuckets} buckets.`, undefined, undefined, undefined, undefined, 'initial');

  const buckets: BucketSortBucket[] = Array.from({ length: numBuckets }, (_, i) => ({ id: i, elements: [], isSorted: false }));
  addStep(localSteps, lm.initBuckets, arr, `Initialized ${numBuckets} empty buckets.`, buckets, undefined, undefined, undefined, 'scattering');
  
  let maxValue = 0;
  let minValue = 0;
  if (n > 0) {
    maxValue = Math.max(...arr);
    minValue = Math.min(...arr); // Used for range-based distribution
    if (arr.some(x => x < 0)) {
        addStep(localSteps, lm.scatterLoop, arr, "Error: Bucket Sort (this version) expects non-negative numbers.", buckets, undefined, undefined, undefined, 'scattering');
        return localSteps; 
    }
  }
  
  addStep(localSteps, lm.scatterLoop, arr, "Distributing elements into buckets.", buckets, undefined, undefined, undefined, 'scattering');
  for (let i = 0; i < n; i++) {
    const element = arr[i];
    let bucketIdx = 0;
    // More robust distribution for integers, ensures elements go into correct buckets for non-0 min values
    // If maxValue and minValue are same, all elements go to bucket 0 if numBuckets is 1, otherwise might need adjustment.
    // For simplicity with visualizer focusing on 0-max, using the (value / (maxVal+1)) * numBuckets approach
    if (maxValue > 0) {
        bucketIdx = Math.floor((element / (maxValue + 1)) * numBuckets);
    } else if (element === 0 && maxValue === 0) {
        bucketIdx = 0;
    }
    // Clamp bucketIdx to be within [0, numBuckets - 1]
    bucketIdx = Math.max(0, Math.min(bucketIdx, numBuckets - 1));


    addStep(localSteps, lm.calculateBucketIndex, arr, `Element arr[${i}]=${element}. Calculated bucket index: ${bucketIdx}.`, buckets, [i], bucketIdx, element, 'scattering');
    buckets[bucketIdx].elements.push(element);
    addStep(localSteps, lm.placeInBucket, arr, `Placed ${element} into bucket ${bucketIdx}. Buckets updated.`, buckets.map(b => ({...b, elements:[...b.elements]})), [i], bucketIdx, element, 'scattering');
  }
   addStep(localSteps, lm.scatterLoop, arr, "Finished distributing elements.", buckets, undefined, undefined, undefined, 'scattering');

  addStep(localSteps, lm.sortBucketsLoop, arr, "Sorting individual buckets.", buckets, undefined, undefined, undefined, 'sorting_buckets');
  for (let i = 0; i < numBuckets; i++) {
    conceptualInsertionSortForBucket(buckets[i].elements, i, arr, buckets, localSteps);
  }
  addStep(localSteps, lm.sortBucketsLoop, arr, "All buckets sorted.", buckets, undefined, undefined, undefined, 'sorting_buckets');

  let outputIndex = 0;
  const outputArrDisplay = new Array(n).fill(undefined); 
  addStep(localSteps, lm.gatherLoop, outputArrDisplay, "Gathering sorted elements from buckets into output.", buckets, [], undefined, undefined, 'gathering');
  for (let i = 0; i < numBuckets; i++) {
    addStep(localSteps, lm.gatherLoop, outputArrDisplay, `Processing bucket ${i}.`, buckets, [], i, undefined, 'gathering');
    for (let j = 0; j < buckets[i].elements.length; j++) {
      arr[outputIndex] = buckets[i].elements[j];
      outputArrDisplay[outputIndex] = arr[outputIndex]; 
      addStep(localSteps, lm.placeFromBucketToOutput, outputArrDisplay, `arr[${outputIndex}] = bucket[${i}][${j}] (${arr[outputIndex]}).`, buckets, [outputIndex], i, arr[outputIndex], 'gathering');
      outputIndex++;
    }
  }
  addStep(localSteps, lm.gatherLoop, arr, "All elements gathered. Array is sorted.", buckets.map(b => ({...b, isSorted: true})), undefined, undefined, undefined, 'gathering');
  
  addStep(localSteps, lm.returnArr, arr, "Bucket Sort complete.", undefined, undefined, undefined, undefined, 'complete');
  addStep(localSteps, lm.funcEnd, arr, "Algorithm finished.", undefined, undefined, undefined, undefined, 'complete');
  return localSteps;
};
