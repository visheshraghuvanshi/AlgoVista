
import type { AlgorithmStep } from '@/types';

export const SHELL_SORT_LINE_MAP = {
  functionDeclaration: 1,
  getN: 2,
  outerLoopGap: 3, // Loop for gap sequence
  innerLoopI: 4,   // Loop from gap to n-1
  storeTemp: 5,    // Store arr[i] in temp
  innerLoopJ: 6,   // Loop for j (comparison and shift)
  compareAndShift: 7, // arr[j-gap] > temp
  shiftElement: 8,    // arr[j] = arr[j-gap]
  placeTemp: 9,       // arr[j] = temp (after inner j loop)
  innerLoopIEnd: 10,
  outerLoopGapEnd: 11,
  returnArr: 12,
  functionEnd: 13,
};

export const generateShellSortSteps = (arrToSort: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  if (!arrToSort || arrToSort.length === 0) {
    localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
    return localSteps;
  }

  const arr = [...arrToSort];
  const n = arr.length;
  const lm = SHELL_SORT_LINE_MAP;
  // No explicitly tracked sortedIndices for Shell Sort during passes, only at the end.

  const addStep = (
    line: number,
    currentArrState: number[],
    active: number[] = [],
    swapping: number[] = [], // Used for elements being shifted/compared
    message: string = "",
    processingRange: [number,number] | null = null, // Current gap sub-array conceptually
    pivotIdx: number | null = null // Can indicate the 'temp' element's original position
  ) => {
    localSteps.push({
      array: [...currentArrState],
      activeIndices: active,
      swappingIndices: swapping,
      sortedIndices: (line === lm.returnArr || line === lm.functionEnd) ? arr.map((_,idx) => idx) : [], // Only mark sorted at the very end
      currentLine: line,
      message,
      processingSubArrayRange: processingRange,
      pivotActualIndex: pivotIdx,
    });
  };

  addStep(lm.functionDeclaration, arr, [], [], "Start Shell Sort");
  addStep(lm.getN, arr, [], [], `n = ${n}`);

  // Start with a large gap, then reduce the gap (Knuth's sequence: h = 3*h + 1 is common, or simple n/2)
  // Using a simple n/2, n/4, ..., 1 sequence for visualization
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    addStep(lm.outerLoopGap, arr, [], [], `Current gap: ${gap}`);
    
    for (let i = gap; i < n; i += 1) {
      addStep(lm.innerLoopI, arr, [i], [], `Outer loop for current gap, i = ${i}`);
      let temp = arr[i];
      addStep(lm.storeTemp, arr, [i], [i], `Store arr[${i}] (value: ${temp}) in temp`, null, i);
      
      let j;
      addStep(lm.innerLoopJ, arr, [i], [i], `Inner loop (insertion for sub-array with gap ${gap}), j starts at ${i}`);
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        addStep(lm.compareAndShift, arr, [j - gap, j], [j], `Comparing arr[${j-gap}] (${arr[j-gap]}) with temp (${temp}). Since arr[${j-gap}] > temp, shift.`, null, i);
        arr[j] = arr[j - gap];
        addStep(lm.shiftElement, arr, [j], [j, j-gap], `Shift arr[${j-gap}] to arr[${j}]. arr[${j}] is now ${arr[j]}`, null, i);
      }
      arr[j] = temp;
      addStep(lm.placeTemp, arr, [j], [j], `Place temp (${temp}) at arr[${j}]`, null, i);
      addStep(lm.innerLoopIEnd, arr, [j], [], `Finished insertion for arr[${i}] within its gap-ed sub-array`);
    }
    addStep(lm.outerLoopGapEnd, arr, [], [], `Finished pass with gap: ${gap}`);
  }

  addStep(lm.returnArr, arr, [], [], "Array is sorted");
  addStep(lm.functionEnd, arr, [], [], "Shell Sort finished");
  return localSteps;
};
