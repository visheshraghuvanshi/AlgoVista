
import type { AlgorithmStep } from '@/types';

export const KADANES_ALGORITHM_LINE_MAP = {
  functionDeclaration: 1,
  initMaxSoFar_NegativeInfinity: 2, 
  initCurrentMax_Zero: 3,
  // Optional lines for tracking subarray indices, if implemented in code panel:
  // initStart: 4, 
  // initEnd: 5,
  // initCurrentStart: 6,
  loopStart: 4, // Adjusted line numbers for a simpler snippet focus
  addToCurrentMax: 5, 
  checkCurrentMaxGreaterThanMaxSoFar: 6, 
  updateMaxSoFar: 7, 
  // updateStartEnd: (Optional)
  checkCurrentMaxNegative: 8, 
  resetCurrentMax: 9, 
  // resetCurrentStart: (Optional)
  loopEnd: 10,
  handleAllNegativeOrEmpty: 11, // Conceptual step for all negative handling
  returnMaxSoFar: 12,
  functionEnd: 13,
};


export const generateKadanesAlgorithmSteps = (arrInput: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  const arr = [...arrInput];
  const n = arr.length;
  const lm = KADANES_ALGORITHM_LINE_MAP;

  let overallMaxSubarrayIndices: [number, number] | null = null;

  const addStep = (
    line: number,
    active: number[] = [], 
    currentMaxVal: number,
    maxSoFarVal: number,
    currentSubarrayRange: [number, number] | null = null, 
    message: string = "",
    currentArrState = [...arr]
  ) => {
    let finalMaxSubarrayElements: number[] = [];
    if(overallMaxSubarrayIndices) {
      for(let k = overallMaxSubarrayIndices[0]; k <= overallMaxSubarrayIndices[1]; k++) {
        finalMaxSubarrayElements.push(k);
      }
    }

    localSteps.push({
      array: currentArrState,
      activeIndices: active.filter(idx => idx >=0 && idx < n),
      swappingIndices: [], 
      sortedIndices: finalMaxSubarrayElements, 
      currentLine: line,
      message: `${message} (currentMax: ${currentMaxVal}, maxSoFar: ${maxSoFarVal === -Infinity ? "-∞" : maxSoFarVal})`,
      processingSubArrayRange: currentSubarrayRange,
      pivotActualIndex: null, // Not used
      auxiliaryData: { currentMax: currentMaxVal, maxSoFar: maxSoFarVal === -Infinity ? "-∞" : maxSoFarVal }
    });
  };

  addStep(lm.functionDeclaration, [], 0, -Infinity, null, "Start Kadane's Algorithm.");

  if (n === 0) {
    addStep(lm.handleAllNegativeOrEmpty, [], 0, 0, null, "Array is empty. Max sum is 0 (for empty subarray).");
    addStep(lm.returnMaxSoFar, [], 0, 0, null, "Return 0.");
    addStep(lm.functionEnd, [], 0, 0, null);
    return localSteps;
  }
  
  let maxSoFar = -Infinity;
  addStep(lm.initMaxSoFar_NegativeInfinity, [], 0, maxSoFar, null, "Initialize maxSoFar = -Infinity.");
  
  let currentMax = 0;
  addStep(lm.initCurrentMax_Zero, [], currentMax, maxSoFar, null, "Initialize currentMax = 0.");
  
  let currentStart = 0; 

  for (let i = 0; i < n; i++) {
    const currentElementMessage = `Processing element arr[${i}] = ${arr[i]}.`;
    // Determine currentSubarrayRange for the message before currentMax is updated with arr[i]
    let displayRangeForMessage: [number,number] | null = null;
    if (currentMax > 0) { // If currentMax was positive, the subarray continues
        displayRangeForMessage = [currentStart, i-1];
    } else if (arr[i] > 0 && currentMax === 0) { // If currentMax was 0 and arr[i] is positive, it's the start of a new potential subarray
         displayRangeForMessage = null; // No existing range to display before adding arr[i]
    }


    addStep(lm.loopStart, [i], currentMax, maxSoFar, displayRangeForMessage, currentElementMessage);
    
    currentMax += arr[i];
    if(currentMax - arr[i] <= 0 && arr[i] > currentMax) { // currentMax was negative or zero, and arr[i] starts a new positive sum
        currentStart = i;
    }


    addStep(lm.addToCurrentMax, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `Add arr[${i}] to currentMax.`);

    addStep(lm.checkCurrentMaxGreaterThanMaxSoFar, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `Is currentMax (${currentMax}) > maxSoFar (${maxSoFar === -Infinity ? "-∞" : maxSoFar})?`);
    if (currentMax > maxSoFar) {
      maxSoFar = currentMax;
      overallMaxSubarrayIndices = [currentStart, i]; 
      addStep(lm.updateMaxSoFar, [i], currentMax, maxSoFar, [currentStart, i], `Yes. Update maxSoFar = ${maxSoFar}. Max subarray identified: arr[${currentStart}..${i}].`);
    } else {
       addStep(lm.checkCurrentMaxGreaterThanMaxSoFar, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `No.`);
    }

    addStep(lm.checkCurrentMaxNegative, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `Is currentMax (${currentMax}) < 0?`);
    if (currentMax < 0) {
      currentMax = 0;
      addStep(lm.resetCurrentMax, [i], currentMax, maxSoFar, null, `Yes. Reset currentMax = 0.`);
      currentStart = i + 1; 
    } else {
        addStep(lm.checkCurrentMaxNegative, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `No. currentMax is not negative.`);
    }
     addStep(lm.loopEnd, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `End of iteration for index ${i}.`);
  }
  

  if (maxSoFar === -Infinity && n > 0) { // All numbers were negative or single zero
    let largestSingleElement = arr[0];
    let largestSingleElementIndex = 0;
    for (let k = 1; k < n; k++) {
      if (arr[k] > largestSingleElement) {
        largestSingleElement = arr[k];
        largestSingleElementIndex = k;
      }
    }
    maxSoFar = largestSingleElement;
    overallMaxSubarrayIndices = [largestSingleElementIndex, largestSingleElementIndex];
    addStep(lm.handleAllNegativeOrEmpty, [largestSingleElementIndex], 0, maxSoFar, overallMaxSubarrayIndices, `All numbers non-positive. Max sum is the largest element: ${maxSoFar}.`);
  }

  // If maxSoFar is still 0 after processing (e.g., from all negatives and reset, or just an array of 0s), 
  // and we want to ensure a non-empty subarray if specified by problem variant,
  // or if all were negative and overallMaxSubarrayIndices is still null.
  if (maxSoFar === 0 && n > 0 && (overallMaxSubarrayIndices === null || (arr.every(num => num <= 0) && !arr.includes(0)) ) ) {
    // This logic handles if the problem implies "if all numbers are negative, return the largest negative number"
    // If standard Kadane's allows empty subarray (sum 0), then maxSoFar=0 could be correct.
    // The current implementation handles the largest single negative via the -Infinity initialization and subsequent updates.
    // This specific check might be redundant if maxSoFar was initialized to arr[0] for non-empty arrays.
    // However, the current JS code snippet initializes maxSoFar to -Infinity.
  }


  addStep(lm.returnMaxSoFar, [], currentMax, maxSoFar, overallMaxSubarrayIndices, `Maximum subarray sum found. Result: ${maxSoFar}.`);
  addStep(lm.functionEnd, [], currentMax, maxSoFar, overallMaxSubarrayIndices);
  return localSteps;
};

