
import type { AlgorithmStep } from '@/types';

export const KADANES_ALGORITHM_LINE_MAP = {
  functionDeclaration: 1,
  initMaxSoFar_NegativeInfinity: 2, // For general case, allowing all negative numbers
  initCurrentMax_Zero: 3,
  // For finding the start and end of the subarray (optional extension)
  // initStart: 4, 
  // initEnd: 5,
  // initCurrentStart: 6,
  loopStart: 7, // for (let i = 0; i < arr.length; i++)
  addToCurrentMax: 8, // currentMax += arr[i];
  checkCurrentMaxGreaterThanMaxSoFar: 9, // if (currentMax > maxSoFar)
  updateMaxSoFar: 10, // maxSoFar = currentMax;
  // updateStartEnd: 11, // start = currentStart; end = i;
  checkCurrentMaxNegative: 12, // if (currentMax < 0)
  resetCurrentMax: 13, // currentMax = 0;
  // resetCurrentStart: 14, // currentStart = i + 1;
  loopEnd: 15,
  handleAllNegativeOrEmpty: 16, // if (maxSoFar === -Infinity && arr.length > 0) or similar check
  returnMaxSoFar: 17,
  functionEnd: 18,
};

export const generateKadanesAlgorithmSteps = (arrInput: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  const arr = [...arrInput];
  const n = arr.length;
  const lm = KADANES_ALGORITHM_LINE_MAP;

  // For Kadane's, 'processingSubArrayRange' can show the current positive sum subarray
  // 'pivotActualIndex' can show maxSoFar if it's a single element, or just not used.
  // 'sortedIndices' can show the elements of the overall maxSoFar subarray.
  let overallMaxSubarrayIndices: [number, number] | null = null;


  const addStep = (
    line: number,
    active: number[] = [], // Current element arr[i]
    currentMaxVal: number,
    maxSoFarVal: number,
    currentSubarrayRange: [number, number] | null = null, // [start, end] of current positive sum segment
    message: string = "",
    currentArrState = [...arr]
  ) => {
    let finalSortedIndices: number[] = [];
    if(overallMaxSubarrayIndices) {
      for(let k = overallMaxSubarrayIndices[0]; k <= overallMaxSubarrayIndices[1]; k++) {
        finalSortedIndices.push(k);
      }
    }

    localSteps.push({
      array: currentArrState,
      activeIndices: active.filter(idx => idx >=0 && idx < n),
      swappingIndices: [], // Not used
      sortedIndices: finalSortedIndices, // To highlight the max subarray found so far
      currentLine: line,
      message: `${message} (currentMax: ${currentMaxVal}, maxSoFar: ${maxSoFarVal === -Infinity ? "-∞" : maxSoFarVal})`,
      processingSubArrayRange: currentSubarrayRange,
      pivotActualIndex: null,
    });
  };

  addStep(lm.functionDeclaration, [], 0, -Infinity, null, "Start Kadane's Algorithm");

  if (n === 0) {
    addStep(lm.handleAllNegativeOrEmpty, [], 0, 0, null, "Array is empty. Max sum is 0 (or as per problem spec).");
    addStep(lm.returnMaxSoFar, [], 0, 0, null, "Return 0.");
    addStep(lm.functionEnd);
    return localSteps;
  }
  
  let maxSoFar = -Infinity;
  addStep(lm.initMaxSoFar_NegativeInfinity, [], 0, maxSoFar, null, "Initialize maxSoFar = -Infinity.");
  let currentMax = 0;
  addStep(lm.initCurrentMax_Zero, [], currentMax, maxSoFar, null, "Initialize currentMax = 0.");
  
  let currentStart = 0; // For tracking start of current positive subarray

  for (let i = 0; i < n; i++) {
    addStep(lm.loopStart, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i-1] : null, `Processing element arr[${i}] = ${arr[i]}.`);
    
    currentMax += arr[i];
    addStep(lm.addToCurrentMax, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `Add arr[${i}] to currentMax.`);

    addStep(lm.checkCurrentMaxGreaterThanMaxSoFar, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `Is currentMax (${currentMax}) > maxSoFar (${maxSoFar === -Infinity ? "-∞" : maxSoFar})?`);
    if (currentMax > maxSoFar) {
      maxSoFar = currentMax;
      overallMaxSubarrayIndices = [currentStart, i]; // Update overall max subarray
      addStep(lm.updateMaxSoFar, [i], currentMax, maxSoFar, [currentStart, i], `Yes. Update maxSoFar = ${maxSoFar}. Max subarray is now arr[${currentStart}..${i}].`);
    } else {
       addStep(lm.checkCurrentMaxGreaterThanMaxSoFar, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `No.`);
    }

    addStep(lm.checkCurrentMaxNegative, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `Is currentMax (${currentMax}) < 0?`);
    if (currentMax < 0) {
      currentMax = 0;
      addStep(lm.resetCurrentMax, [i], currentMax, maxSoFar, null, `Yes. Reset currentMax = 0.`);
      currentStart = i + 1; // Next potential subarray starts after this element
      addStep(lm.resetCurrentMax, [i], currentMax, maxSoFar, null, `Potential new subarray starts at index ${currentStart}.`);
    } else {
        addStep(lm.checkCurrentMaxNegative, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `No. currentMax is not negative.`);
    }
  }
  addStep(lm.loopEnd, [], currentMax, maxSoFar, overallMaxSubarrayIndices, "Loop finished.");

  // Handle cases like all negative numbers, where maxSoFar might still be -Infinity
  // or if problem requires 0 for all negative/empty array.
  // The current logic correctly finds the largest sum, which could be negative.
  if (maxSoFar === -Infinity && n > 0) { // Should have been updated if any element exists. This implies error or all elements are -Infinity.
    // This case means all numbers were so deeply negative that currentMax never became positive to update maxSoFar from -Infinity
    // A common requirement is to return the largest single element if all sums are negative.
    let largestSingle = arr[0];
    let largestSingleIdx = 0;
    for(let k=1; k<n; k++) {
        if(arr[k] > largestSingle) {
            largestSingle = arr[k];
            largestSingleIdx = k;
        }
    }
    maxSoFar = largestSingle;
    overallMaxSubarrayIndices = [largestSingleIdx, largestSingleIdx];
    addStep(lm.handleAllNegativeOrEmpty, [largestSingleIdx], 0, maxSoFar, overallMaxSubarrayIndices, `All numbers are negative or edge case. Max sum is the largest element: ${maxSoFar}.`);
  }


  addStep(lm.returnMaxSoFar, [], currentMax, maxSoFar, overallMaxSubarrayIndices, `Return maxSoFar: ${maxSoFar}.`);
  addStep(lm.functionEnd);
  return localSteps;
};
