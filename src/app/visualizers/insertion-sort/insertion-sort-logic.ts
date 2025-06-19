
import type { AlgorithmStep } from './types'; // Local import

export const INSERTION_SORT_LINE_MAP = { 
  functionDeclaration: 1, getN: 2, outerLoopStart: 3, keyAssignment: 4,  jAssignment: 5, whileLoopComment1: 6, whileLoopComment2: 7,  whileCondition: 8, shiftElement: 9, decrementJ: 10, whileLoopEnd: 11, placeKey: 12, outerLoopEnd: 13, returnArr: 14, functionEnd: 15,
};

export const generateInsertionSortSteps = (arrToSort: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  if (!arrToSort || arrToSort.length === 0) return localSteps;
  const arr = [...arrToSort];
  const n = arr.length;
  const lm = INSERTION_SORT_LINE_MAP;
  let localSortedIndices: number[] = [];

  const addStep = (line: number, active: number[] = [], swapping: number[] = [], message?: string, currentArrState = [...arr], processingRange:[number,number]|null = null, pivotIdx: number|null = null) => {
    localSteps.push({
      array: currentArrState,
      activeIndices: [...active],
      swappingIndices: [...swapping],
      sortedIndices: [...localSortedIndices].sort((a,b)=>a-b),
      currentLine: line,
      message,
      processingSubArrayRange: processingRange,
      pivotActualIndex: pivotIdx
    });
  };
  
  addStep(lm.functionDeclaration, [], [], "Start Insertion Sort");
  if (n === 0) {
    addStep(lm.returnArr); addStep(lm.functionEnd); return localSteps;
  }
  addStep(lm.getN);
  if (n > 0) localSortedIndices.push(0);

  for (let i = 1; i < n; i++) {
    addStep(lm.outerLoopStart, [i], [], `Iterating for element at index ${i}`);
    let key = arr[i];
    addStep(lm.keyAssignment, [i], [i], `key = arr[${i}] (value: ${key})`);
    let j = i - 1;
    addStep(lm.jAssignment, [i, j], [i], `j = ${j}`);
    addStep(lm.whileLoopComment1, [i,j], [i]); 
    addStep(lm.whileLoopComment2, [i,j], [i]);
    while (j >= 0 && arr[j] > key) {
      addStep(lm.whileCondition, [j, i], [i], `Comparing arr[${j}] (${arr[j]}) > key (${key})`);
      arr[j + 1] = arr[j];
      addStep(lm.shiftElement, [j, i], [j, j + 1], `Shift arr[${j}] (${arr[j]}) to arr[${j + 1}]`);
      j = j - 1;
      addStep(lm.decrementJ, [j < 0 ? i : j, i], [i], `Decrement j to ${j}`);
    }
    addStep(lm.whileLoopEnd, [j+1, i], [i], `End of while. Insert position for key (${key}) is index ${j+1}`);
    arr[j + 1] = key;
    addStep(lm.placeKey, [], [i, j + 1], `Place key (${key}) at arr[${j + 1}]`);
    localSortedIndices = Array.from({length: i + 1}, (_, k) => k);
    addStep(lm.outerLoopEnd, [], [], `Element at index ${i} sorted. Sorted: 0-${i}`);
  }
  localSortedIndices = arr.map((_, idx) => idx);
  addStep(lm.returnArr, [], [], "Array is sorted");
  addStep(lm.functionEnd, [], [], "Algorithm finished");
  return localSteps;
};
