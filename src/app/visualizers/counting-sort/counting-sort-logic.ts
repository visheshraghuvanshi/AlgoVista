
import type { CountingSortStep } from './types'; // Local import

export const COUNTING_SORT_LINE_MAP = {
  funcDeclare: 1,
  handleEmptyOrNull: 2,
  findMax: 3,
  initCountArray: 4,
  populateCountArrayLoop: 5,
  incrementCount: 6,
  modifyCountArrayLoop: 7,
  cumulativeCount: 8,
  initOutputArray: 9,
  buildOutputArrayLoop: 10,
  placeInOutput: 11,
  decrementCount: 12,
  copyToOriginalLoop: 13,
  assignToOriginal: 14,
  returnArr: 15,
  funcEnd: 16,
};

const addStep = (
  steps: CountingSortStep[],
  line: number | null,
  inputArrayState: number[],
  message: string,
  countArr?: number[],
  outputArr?: number[],
  activeIdx?: number[], // For input/output array processing
  countIdx?: number,    // For count array processing
  element?: number      // Element being processed
) => {
  steps.push({
    array: [...inputArrayState],
    activeIndices: activeIdx || [],
    swappingIndices: [],
    sortedIndices: (line === COUNTING_SORT_LINE_MAP.returnArr) ? inputArrayState.map((_,i) => i) : [],
    currentLine: line,
    message,
    countArray: countArr ? [...countArr] : undefined,
    outputArray: outputArr ? [...outputArr] : undefined,
    currentElement: element,
    currentIndex: activeIdx && activeIdx.length > 0 ? activeIdx[0] : undefined,
    currentCountIndex: countIdx,
    auxiliaryData: { // Store arrays for panel display
        ...(countArr && {countArrayDisplay: [...countArr].map(c => c === undefined ? '_' : c).join(', ')}),
        ...(outputArr && {outputArrayDisplay: [...outputArr].map(o => o === undefined ? '_' : o).join(', ')}),
    }
  });
};

export const generateCountingSortSteps = (arrToSort: number[]): CountingSortStep[] => {
  const localSteps: CountingSortStep[] = [];
  const lm = COUNTING_SORT_LINE_MAP;

  if (!arrToSort || arrToSort.length === 0) {
    addStep(localSteps, lm.handleEmptyOrNull, [], "Input array is empty or null.");
    return localSteps;
  }
  const arr = [...arrToSort];
  const n = arr.length;

  addStep(localSteps, lm.funcDeclare, arr, "Starting Counting Sort.");
  
  // Find max value to determine range
  let maxVal = arr[0];
  for (let i = 1; i < n; i++) {
    if (arr[i] > maxVal) maxVal = arr[i];
  }
  addStep(localSteps, lm.findMax, arr, `Max value in array is ${maxVal}. Range for count array is 0 to ${maxVal}.`);

  // Initialize count array
  const count = new Array(maxVal + 1).fill(0);
  addStep(localSteps, lm.initCountArray, arr, `Count array of size ${maxVal + 1} initialized to zeros.`, count);

  // Populate count array
  addStep(localSteps, lm.populateCountArrayLoop, arr, "Populating count array with frequencies.", count);
  for (let i = 0; i < n; i++) {
    count[arr[i]]++;
    addStep(localSteps, lm.incrementCount, arr, `Processing element arr[${i}]=${arr[i]}. Increment count[${arr[i]}].`, count, undefined, [i], arr[i], arr[i]);
  }
  addStep(localSteps, lm.populateCountArrayLoop, arr, "Finished populating count array.", count);

  // Modify count array to store cumulative counts
  addStep(localSteps, lm.modifyCountArrayLoop, arr, "Modifying count array to store cumulative counts.", count);
  for (let i = 1; i <= maxVal; i++) {
    count[i] += count[i - 1];
    addStep(localSteps, lm.cumulativeCount, arr, `count[${i}] = count[${i}] + count[${i-1}] = ${count[i]}.`, count, undefined, undefined, i, count[i]);
  }
  addStep(localSteps, lm.modifyCountArrayLoop, arr, "Finished modifying count array for positions.", count);

  // Initialize output array
  const output = new Array(n);
  addStep(localSteps, lm.initOutputArray, arr, "Initializing output array.", count, output);

  // Build output array
  addStep(localSteps, lm.buildOutputArrayLoop, arr, "Building output array using count array positions (iterating input from end).", count, output);
  for (let i = n - 1; i >= 0; i--) {
    const currentElement = arr[i];
    const positionInOutput = count[currentElement] - 1;
    output[positionInOutput] = currentElement;
    addStep(localSteps, lm.placeInOutput, arr, `Placing arr[${i}]=${currentElement} at output[${positionInOutput}].`, count, output, [i], positionInOutput, currentElement);
    count[currentElement]--;
    addStep(localSteps, lm.decrementCount, arr, `Decrement count[${currentElement}] to ${count[currentElement]}.`, count, output, [i], currentElement, currentElement);
  }
  addStep(localSteps, lm.buildOutputArrayLoop, arr, "Output array built.", count, output);

  // Copy output array to original array
  addStep(localSteps, lm.copyToOriginalLoop, output, "Copying sorted elements from output array to original array.", count, output);
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    addStep(localSteps, lm.assignToOriginal, arr, `arr[${i}] = output[${i}] = ${arr[i]}.`, count, output, [i]);
  }
  addStep(localSteps, lm.copyToOriginalLoop, arr, "Copying complete.", count, output);
  
  addStep(localSteps, lm.returnArr, arr, "Counting Sort complete. Array is sorted.");
  addStep(localSteps, lm.funcEnd, arr, "Algorithm finished.");
  return localSteps;
};

