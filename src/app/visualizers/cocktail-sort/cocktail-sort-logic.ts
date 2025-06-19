
import type { AlgorithmStep } from './types'; // Local import

export const COCKTAIL_SORT_LINE_MAP = {
  functionDeclaration: 1,
  initializeSwappedStartEnd: 2,
  doWhileLoopStart: 3,
  setSwappedFalse: 4,
  forwardPassLoop: 5,
  compareForward: 6,
  swapForward: 7,
  setSwappedTrueForward: 8,
  endIfForward: 9,
  forwardPassEnd: 10,
  checkIfNoSwaps: 11,
  breakLoop: 12,
  setSwappedFalseAgain: 13,
  decrementEnd: 14,
  backwardPassLoop: 15,
  compareBackward: 16,
  swapBackward: 17,
  setSwappedTrueBackward: 18,
  endIfBackward: 19,
  backwardPassEnd: 20,
  incrementStart: 21,
  doWhileCondition: 22,
  returnArr: 23,
  functionEnd: 24,
};

export const generateCocktailSortSteps = (arrToSort: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  if (!arrToSort || arrToSort.length === 0) {
    localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
    return localSteps;
  }

  const arr = [...arrToSort];
  const n = arr.length;
  const lm = COCKTAIL_SORT_LINE_MAP;
  const localSortedIndices: number[] = [];

  const addStep = (
    line: number,
    active: number[] = [],
    swapping: number[] = [],
    message: string = "",
    currentArrState = [...arr]
  ) => {
    localSteps.push({
      array: [...currentArrState],
      activeIndices,
      swappingIndices,
      sortedIndices: [...localSortedIndices].sort((a, b) => a - b),
      currentLine: line,
      message,
      processingSubArrayRange: null,
      pivotActualIndex: null,
    });
  };

  addStep(lm.functionDeclaration, [], [], "Start Cocktail Shaker Sort");
  
  let swapped = true;
  let start = 0;
  let end = n - 1;
  addStep(lm.initializeSwappedStartEnd, [], [], `Initialize swapped=true, start=${start}, end=${end}`);

  addStep(lm.doWhileLoopStart);
  do {
    addStep(lm.setSwappedFalse, [], [], "Set swapped to false for this pass");
    swapped = false;

    addStep(lm.forwardPassLoop, [], [], `Forward pass from index ${start} to ${end - 1}`);
    for (let i = start; i < end; i++) {
      addStep(lm.compareForward, [i, i + 1], [], `Comparing arr[${i}] (${arr[i]}) and arr[${i + 1}] (${arr[i + 1]})`);
      if (arr[i] > arr[i + 1]) {
        addStep(lm.swapForward, [i, i+1], [i, i+1], `Swapping arr[${i}] (${arr[i]}) and arr[${i+1}] (${arr[i+1]})`);
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        addStep(lm.swapForward, [i, i+1], [], `Swapped. Array: [${arr.join(',')}]`);
        swapped = true;
        addStep(lm.setSwappedTrueForward);
      }
      addStep(lm.endIfForward);
    }
    addStep(lm.forwardPassLoop, [], [], "Forward pass finished");
    if (!localSortedIndices.includes(end) && end >=0 && end < n) localSortedIndices.push(end);


    addStep(lm.checkIfNoSwaps, [], [], "Check if any swaps occurred in forward pass");
    if (!swapped) {
      addStep(lm.breakLoop, [], [], "No swaps, array is sorted. Break loop.");
      break;
    }

    addStep(lm.setSwappedFalseAgain, [], [], "Set swapped to false for backward pass");
    swapped = false;
    
    addStep(lm.decrementEnd, [], [], `Decrement end to ${end - 1}. Largest element now at index ${end}`);
    end--;


    addStep(lm.backwardPassLoop, [], [], `Backward pass from index ${end - 1} down to ${start}`);
    for (let i = end - 1; i >= start; i--) {
      addStep(lm.compareBackward, [i, i + 1], [], `Comparing arr[${i}] (${arr[i]}) and arr[${i + 1}] (${arr[i + 1]})`);
      if (arr[i] > arr[i + 1]) {
        addStep(lm.swapBackward, [i, i+1], [i, i+1], `Swapping arr[${i}] (${arr[i]}) and arr[${i+1}] (${arr[i+1]})`);
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        addStep(lm.swapBackward, [i, i+1], [], `Swapped. Array: [${arr.join(',')}]`);
        swapped = true;
        addStep(lm.setSwappedTrueBackward);
      }
       addStep(lm.endIfBackward);
    }
    addStep(lm.backwardPassLoop, [], [], "Backward pass finished");
    if (!localSortedIndices.includes(start) && start >=0 && start < n) localSortedIndices.push(start);


    addStep(lm.incrementStart, [], [], `Increment start to ${start + 1}. Smallest element now at index ${start}`);
    start++;
    addStep(lm.doWhileCondition, [], [], `Loop continues if swapped is true. swapped=${swapped}`);
  } while (swapped);
  
  for(let k=0; k<n; k++) {
    if(!localSortedIndices.includes(k)) localSortedIndices.push(k);
  }
  localSortedIndices.sort((a,b)=>a-b);

  addStep(lm.returnArr, [], [], "Array is sorted");
  addStep(lm.functionEnd, [], [], "Algorithm finished");
  return localSteps;
};
