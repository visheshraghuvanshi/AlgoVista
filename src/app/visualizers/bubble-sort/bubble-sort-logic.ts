
import type { AlgorithmStep } from '@/types';

export const BUBBLE_SORT_LINE_MAP = { 
  functionDeclaration: 1, getN: 2, declareSwappedVar: 3, doWhileStart: 4, setSwappedFalse: 5, forLoopStart: 6, compareComment: 7,  ifCondition: 8, swapComment: 9,  tempAssignment: 10, firstSwapAssign: 11, secondSwapAssign: 12, setSwappedTrue: 13, ifEnd: 14, forLoopEnd: 15, decrementN: 16, doWhileEndCondition: 17, returnArr: 18, functionEnd: 19,
};

export const generateBubbleSortSteps = (arrToSort: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  if (!arrToSort || arrToSort.length === 0) return localSteps;
  const arr = [...arrToSort];
  let n = arr.length;
  let swapped;
  const localSortedIndices: number[] = [];
  const lm = BUBBLE_SORT_LINE_MAP;

  const addStep = (line: number, active: number[] = [], swapping: number[] = [], currentArrState = [...arr], processingRange: [number,number] | null = null, pivotIdx: number | null = null) => {
    localSteps.push({
      array: currentArrState,
      activeIndices: [...active],
      swappingIndices: [...swapping],
      sortedIndices: [...localSortedIndices].sort((a,b)=>a-b),
      currentLine: line,
      processingSubArrayRange: processingRange,
      pivotActualIndex: pivotIdx
    });
  };

  addStep(lm.functionDeclaration); 
  if (n === 0) { 
    addStep(lm.returnArr); 
    addStep(lm.functionEnd); 
    return localSteps;
  }
  
  addStep(lm.getN); 
  addStep(lm.declareSwappedVar);

  do {
    addStep(lm.doWhileStart); 
    swapped = false;
    addStep(lm.setSwappedFalse); 

    for (let i = 0; i < n - 1; i++) {
      addStep(lm.forLoopStart, [i, i + 1]); 
      addStep(lm.compareComment, [i, i + 1]); 
      addStep(lm.ifCondition, [i, i + 1]); 
      if (arr[i] > arr[i + 1]) {
        addStep(lm.swapComment, [i, i + 1], [i, i + 1]); 
        addStep(lm.tempAssignment, [i, i + 1], [i, i + 1]); 
        let temp = arr[i];
        arr[i] = arr[i + 1];
        addStep(lm.firstSwapAssign, [i, i + 1], [i, i + 1]); 
        arr[i + 1] = temp;
        addStep(lm.secondSwapAssign, [i, i + 1], [i, i + 1]); 
        swapped = true;
        addStep(lm.setSwappedTrue); 
      }
      addStep(lm.ifEnd); 
    }
    addStep(lm.forLoopEnd); 

    if (n - 1 >= 0 && n -1 < arr.length) { 
      localSortedIndices.push(n - 1);
    }
    
    n--;
    addStep(lm.decrementN); 
  } while (swapped && n > 0); 
  addStep(lm.doWhileEndCondition); 

  const remainingUnsortedCount = arr.length - localSortedIndices.length;
  for(let k = 0; k < remainingUnsortedCount; k++) { 
      if(!localSortedIndices.includes(k)) localSortedIndices.push(k);
  }
  localSortedIndices.sort((a,b) => a-b);

  addStep(lm.returnArr, [], [], [...arr], null, null); 
  addStep(lm.functionEnd, [], [], [...arr], null, null); 
  
  return localSteps;
};
