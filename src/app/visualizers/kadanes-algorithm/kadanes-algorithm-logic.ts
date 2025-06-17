
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
    addStep(lm.handleAllNegativeOrEmpty, [], 0, 0, null, "Array is empty. Max sum is 0.");
    addStep(lm.returnMaxSoFar, [], 0, 0, null, "Return 0.");
    addStep(lm.functionEnd);
    return localSteps;
  }
  
  let maxSoFar = -Infinity;
  // If you want max_so_far to be the first element if non-empty, initialize here:
  // maxSoFar = arr[0]; overallMaxSubarrayIndices = [0,0]; // if problem allows this interpretation for all neg arrays
  addStep(lm.initMaxSoFar_NegativeInfinity, [], 0, maxSoFar, null, "Initialize maxSoFar = -Infinity.");
  
  let currentMax = 0;
  addStep(lm.initCurrentMax_Zero, [], currentMax, maxSoFar, null, "Initialize currentMax = 0.");
  
  let currentStart = 0; 

  for (let i = 0; i < n; i++) {
    const currentElementMessage = `Processing element arr[${i}] = ${arr[i]}.`;
    addStep(lm.loopStart, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i-1] : (arr[i] > 0 && currentMax === 0 ? [i,i-1] : null), currentElementMessage);
    
    currentMax += arr[i];
    // If currentMax became positive by adding arr[i], and it was 0, this is new start
    if(currentMax - arr[i] === 0 && arr[i] > 0 && currentMax > 0) {
      currentStart = i;
    } else if (currentMax - arr[i] < 0 && currentMax > 0){ // currentMax was negative, now positive
      currentStart = i;
    }

    addStep(lm.addToCurrentMax, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `Add arr[${i}] to currentMax.`);

    addStep(lm.checkCurrentMaxGreaterThanMaxSoFar, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `Is currentMax (${currentMax}) > maxSoFar (${maxSoFar === -Infinity ? "-∞" : maxSoFar})?`);
    if (currentMax > maxSoFar) {
      maxSoFar = currentMax;
      overallMaxSubarrayIndices = [currentStart, i]; 
      addStep(lm.updateMaxSoFar, [i], currentMax, maxSoFar, [currentStart, i], `Yes. Update maxSoFar = ${maxSoFar}. Max subarray: arr[${currentStart}..${i}].`);
    } else {
       addStep(lm.checkCurrentMaxGreaterThanMaxSoFar, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `No.`);
    }

    addStep(lm.checkCurrentMaxNegative, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `Is currentMax (${currentMax}) < 0?`);
    if (currentMax < 0) {
      currentMax = 0;
      addStep(lm.resetCurrentMax, [i], currentMax, maxSoFar, null, `Yes. Reset currentMax = 0.`);
      currentStart = i + 1; 
      // Add step for resetting currentStart if it's part of LINE_MAP
      // addStep(lm.resetCurrentStart, [i], currentMax, maxSoFar, null, `Potential new subarray starts at index ${currentStart}.`);
    } else {
        addStep(lm.checkCurrentMaxNegative, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `No. currentMax is not negative.`);
    }
     addStep(lm.loopEnd, [i], currentMax, maxSoFar, currentMax > 0 ? [currentStart, i] : null, `End of iteration for index ${i}.`);
  }
  

  // Handle case where all numbers are negative. maxSoFar would be the largest single negative number.
  // The previous logic already correctly finds the largest single element if currentMax never surpasses it.
  // But if strict Kadane's (resetting to 0) makes maxSoFar stay -Infinity for all-negative arrays, we fix it.
  if (maxSoFar === -Infinity && n > 0) {
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
    addStep(lm.handleAllNegativeOrEmpty, [largestSingleElementIndex], 0, maxSoFar, overallMaxSubarrayIndices, `All numbers are negative. Max sum is the largest element: ${maxSoFar}.`);
  }


  addStep(lm.returnMaxSoFar, [], currentMax, maxSoFar, overallMaxSubarrayIndices, `Algorithm finished. Return maxSoFar: ${maxSoFar}.`);
  addStep(lm.functionEnd, [], currentMax, maxSoFar, overallMaxSubarrayIndices);
  return localSteps;
};

