
import type { AlgorithmStep } from './types'; // Local import

export const SELECTION_SORT_LINE_MAP = {
  functionDeclaration: 1,
  getN: 2,
  outerLoopStart: 3,
  minIdxInitialization: 4,
  innerLoopStart: 5,
  comparison: 6,
  updateMinIdx: 7,
  innerLoopEnd: 8,
  swapComment: 9, // Updated to line 10 in JS snippet
  swapOperation: 10, // Updated to line 11 in JS snippet
  outerLoopEnd: 11, // Updated to line 12 in JS snippet
  returnArr: 12, // Updated to line 13 in JS snippet
  functionEnd: 13, // Updated to line 14 in JS snippet
};

export const generateSelectionSortSteps = (arrToSort: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  if (!arrToSort || arrToSort.length === 0) {
    localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
    return localSteps;
  }
  const arr = [...arrToSort];
  const n = arr.length;
  const lm = SELECTION_SORT_LINE_MAP;
  const localSortedIndices: number[] = [];

  const addStep = (
    line: number,
    currentArrState: number[],
    active: number[] = [],
    swapping: number[] = [],
    message: string = ""
  ) => {
    localSteps.push({
      array: [...currentArrState],
      activeIndices: [...active],
      swappingIndices: [...swapping],
      sortedIndices: [...localSortedIndices].sort((a,b)=>a-b),
      currentLine: line,
      message,
      processingSubArrayRange: null,
      pivotActualIndex: null,
    });
  };

  addStep(lm.functionDeclaration, arr, [], [], "Start Selection Sort");
  if (n === 0) {
    addStep(lm.returnArr, arr);
    addStep(lm.functionEnd, arr);
    return localSteps;
  }
  addStep(lm.getN, arr);

  for (let i = 0; i < n - 1; i++) {
    addStep(lm.outerLoopStart, arr, [i], [], `Outer loop: i = ${i}. Finding minimum in arr[${i}..${n-1}]`);
    let min_idx = i;
    addStep(lm.minIdxInitialization, arr, [i, min_idx], [], `Initialize min_idx = ${i}`);

    for (let j = i + 1; j < n; j++) {
      addStep(lm.innerLoopStart, arr, [j, min_idx], [], `Inner loop: j = ${j}. Comparing arr[${j}] with arr[min_idx]`);
      addStep(lm.comparison, arr, [j, min_idx], [], `Is arr[${j}] (${arr[j]}) < arr[min_idx] (${arr[min_idx]})?`);
      if (arr[j] < arr[min_idx]) {
        min_idx = j;
        addStep(lm.updateMinIdx, arr, [j, min_idx], [], `Yes. Update min_idx = ${j}`);
      }
    }
    addStep(lm.innerLoopEnd, arr, [i, min_idx], [], `Inner loop finished. Minimum found at index ${min_idx} (value: ${arr[min_idx]})`);

    // For JS snippet, line 10 is comment, 11 is swap. We'll map to 11 for the action.
    addStep(lm.swapComment, arr, [i, min_idx], [], `Swap arr[${i}] with arr[min_idx] (if different).`);
    if (min_idx !== i) { 
        addStep(lm.swapOperation, arr, [i, min_idx], [i, min_idx], `Swapping arr[${i}] (${arr[i]}) and arr[${min_idx}] (${arr[min_idx]})`);
        [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
        addStep(lm.swapOperation, arr, [i, min_idx], [], `Swapped. arr[${i}] is now ${arr[i]}`);
    } else {
        addStep(lm.swapOperation, arr, [i, min_idx], [], `No swap needed as arr[${i}] is already the minimum in unsorted part.`);
    }
    
    localSortedIndices.push(i);
    addStep(lm.outerLoopEnd, arr, [], [], `Element arr[${i}] (${arr[i]}) is now sorted.`);
  }
  
  if (n > 0) {
    localSortedIndices.push(n - 1);
  }
  localSortedIndices.sort((a,b)=>a-b);

  addStep(lm.returnArr, arr, [], [], "Array is sorted");
  addStep(lm.functionEnd, arr, [], [], "Algorithm finished");
  return localSteps;
};
