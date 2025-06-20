
import type { ArrayAlgorithmStep } from './types'; 

export const BUBBLE_SORT_LINE_MAP = { 
  functionDeclaration: 1, getN: 2, declareSwappedVar: 3, doWhileStart: 4, setSwappedFalse: 5, forLoopStart: 6, compareComment: 7,  ifCondition: 8, swapComment: 9,  tempAssignment: 10, firstSwapAssign: 11, secondSwapAssign: 12, setSwappedTrue: 13, ifEnd: 14, forLoopEnd: 15, decrementN: 16, doWhileEndCondition: 17, returnArr: 18, functionEnd: 19,
};

export const generateBubbleSortSteps = (arrToSort: number[]): ArrayAlgorithmStep[] => {
  const localSteps: ArrayAlgorithmStep[] = [];
  if (!arrToSort || arrToSort.length === 0) {
    localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
    return localSteps;
  }
  const arr = [...arrToSort];
  let n = arr.length;
  let swapped;
  const localSortedIndices: number[] = [];
  const lm = BUBBLE_SORT_LINE_MAP;

  const addStep = (line: number, active: number[] = [], swapping: number[] = [], currentArrState = [...arr], processingRange: [number,number] | null = null, pivotIdx: number | null = null, message?: string) => {
    localSteps.push({
      array: currentArrState,
      activeIndices: [...active],
      swappingIndices: [...swapping],
      sortedIndices: [...localSortedIndices].sort((a,b)=>a-b),
      currentLine: line,
      message: message || "", // Default to empty string if no message
      processingSubArrayRange: processingRange,
      pivotActualIndex: pivotIdx
    });
  };

  addStep(lm.functionDeclaration, [], [], [...arr], null, null, "Start Bubble Sort"); 
  if (n === 0) { 
    addStep(lm.returnArr, [], [], [...arr], null, null, "Array is empty."); 
    addStep(lm.functionEnd, [], [], [...arr], null, null, "Algorithm finished."); 
    return localSteps;
  }
  
  addStep(lm.getN, [], [], [...arr], null, null, `n = ${n}.`); 
  addStep(lm.declareSwappedVar, [], [], [...arr], null, null, "Declare 'swapped' variable.");

  do {
    addStep(lm.doWhileStart, [], [], [...arr], null, null, "Start 'do-while' loop."); 
    swapped = false;
    addStep(lm.setSwappedFalse, [], [], [...arr], null, null, "Set swapped = false."); 

    for (let i = 0; i < n - 1; i++) {
      addStep(lm.forLoopStart, [i, i + 1], [], [...arr], null, null, `Outer loop: i = ${i}.`); 
      addStep(lm.compareComment, [i, i + 1], [], [...arr], null, null, `Comparing arr[${i}] and arr[${i+1}].`); 
      addStep(lm.ifCondition, [i, i + 1], [], [...arr], null, null, `Is arr[${i}] (${arr[i]}) > arr[${i+1}] (${arr[i+1]})?`); 
      if (arr[i] > arr[i + 1]) {
        addStep(lm.swapComment, [i, i + 1], [i, i + 1], [...arr], null, null, "Yes. Swap elements."); 
        addStep(lm.tempAssignment, [i, i + 1], [i, i + 1], [...arr], null, null, `temp = arr[${i}] (${arr[i]})`); 
        let temp = arr[i];
        arr[i] = arr[i + 1];
        addStep(lm.firstSwapAssign, [i, i + 1], [i, i + 1], [...arr], null, null, `arr[${i}] = arr[${i+1}] (${arr[i]}).`); 
        arr[i + 1] = temp;
        addStep(lm.secondSwapAssign, [i, i + 1], [i, i + 1], [...arr], null, null, `arr[${i+1}] = temp (${arr[i+1]}).`); 
        swapped = true;
        addStep(lm.setSwappedTrue, [], [], [...arr], null, null, "Set swapped = true."); 
      }
      addStep(lm.ifEnd, [], [], [...arr], null, null, "End of if block."); 
    }
    addStep(lm.forLoopEnd, [], [], [...arr], null, null, "End of inner for loop."); 

    if (n - 1 >= 0 && n -1 < arr.length) { 
      localSortedIndices.push(n - 1);
    }
    
    n--;
    addStep(lm.decrementN, [], [], [...arr], null, null, `Decrement n (elements to consider). n = ${n}. Element arr[${n}] is sorted.`); 
  } while (swapped && n > 0); 
  addStep(lm.doWhileEndCondition, [], [], [...arr], null, null, `Loop condition (swapped: ${swapped}, n: ${n}) not met. Loop ends.`); 

  // Ensure all remaining elements are marked as sorted
  const remainingUnsortedCount = arr.length - localSortedIndices.length;
  for(let k = 0; k < remainingUnsortedCount; k++) { 
      if(!localSortedIndices.includes(k)) localSortedIndices.push(k);
  }
  localSortedIndices.sort((a,b) => a-b); // Ensure sorted order for the sortedIndices array

  addStep(lm.returnArr, [], [], [...arr], null, null, "Array is sorted."); 
  addStep(lm.functionEnd, [], [], [...arr], null, null, "Algorithm finished."); 
  
  return localSteps;
};

