
import type { AlgorithmStep } from '@/types';

export const QUICK_SORT_LINE_MAP = {
  quickSortBase: 1, 
  quickSortCondition: 2, 
  callPartition: 3, 
  recursiveCallLeft: 4, 
  recursiveCallRight: 5, 
  quickSortConditionEnd: 6, 
  quickSortEnd: 7, 
  partitionBase: 8, 
  setPivot: 9, 
  setI: 10, 
  partitionLoopStart: 11, 
  compareElementWithPivot: 12, 
  incrementI: 13, 
  swapIJ: 14, 
  compareElementEnd: 15, 
  partitionLoopEnd: 16, 
  swapPivotToMiddle: 17, 
  returnPI: 18, 
  partitionEnd: 19, 
  initialCallComment: 20, 
};

export const generateQuickSortSteps = (arrToSort: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  if (!arrToSort || arrToSort.length === 0) {
    localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
    return localSteps;
  }

  const arr = [...arrToSort];
  const lm = QUICK_SORT_LINE_MAP;
  const currentGlobalSortedIndices: number[] = [];

  function addStep(
      line: number,
      currentArrState: number[],
      active: number[] = [],
      swapping: number[] = [],
      message: string = "",
      processingRange: [number, number] | null = null,
      pivotIdx: number | null = null
  ) {
      localSteps.push({
          array: [...currentArrState],
          activeIndices: active,
          swappingIndices: swapping,
          sortedIndices: [...currentGlobalSortedIndices].sort((a,b)=>a-b),
          currentLine: line,
          message,
          processingSubArrayRange: processingRange,
          pivotActualIndex: pivotIdx,
      });
  }

  function partition(currentArr: number[], low: number, high: number) {
      addStep(lm.partitionBase, currentArr, [], [], `Partitioning subarray [${low}..${high}]`, [low, high]);
      const pivotValue = currentArr[high];
      addStep(lm.setPivot, currentArr, [high], [], `Pivot selected: arr[${high}] = ${pivotValue}`, [low, high], high);
      
      let i = low - 1;
      addStep(lm.setI, currentArr, [high], [], `i initialized to ${i}`, [low, high], high);

      for (let j = low; j < high; j++) {
          addStep(lm.partitionLoopStart, currentArr, [j, high], [], `Comparing arr[${j}] (${currentArr[j]}) with pivot (${pivotValue})`, [low, high], high);
          addStep(lm.compareElementWithPivot, currentArr, [j, high], [], `Is arr[${j}] (${currentArr[j]}) < pivot (${pivotValue})?`, [low,high], high);
          if (currentArr[j] < pivotValue) {
              i++;
              addStep(lm.incrementI, currentArr, [j, high], [], `Yes. Increment i to ${i}`, [low, high], high);
              
              addStep(lm.swapIJ, currentArr, [i,j,high], [i,j], `Swap arr[${i}] (${currentArr[i]}) and arr[${j}] (${currentArr[j]})`, [low, high], high);
              [currentArr[i], currentArr[j]] = [currentArr[j], currentArr[i]];
              addStep(lm.swapIJ, currentArr, [i,j,high], [i,j], `Swapped. Array: [${currentArr.slice(low, high+1).join(',')}]`, [low, high], high); 
          } else {
               addStep(lm.compareElementWithPivot, currentArr, [j, high], [], `No. arr[${j}] (${currentArr[j]}) not < pivot.`, [low, high], high);
          }
          addStep(lm.compareElementEnd, currentArr, [j,high], [], `End of comparison for j=${j}`, [low,high],high);
      }
      addStep(lm.partitionLoopEnd, currentArr, [high], [], `Partition loop finished. i = ${i}`, [low, high], high);

      addStep(lm.swapPivotToMiddle, currentArr, [i+1, high], [i+1, high], `Swap pivot arr[${high}] (${currentArr[high]}) with arr[${i+1}] (${currentArr[i+1]})`, [low, high], high);
      [currentArr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      const partitionIndex = i + 1;
      addStep(lm.swapPivotToMiddle, currentArr, [partitionIndex], [partitionIndex], `Pivot swapped. Partition index pi = ${partitionIndex}. Array: [${currentArr.slice(low,high+1).join(',')}]`, [low, high], partitionIndex);
      
      if (!currentGlobalSortedIndices.includes(partitionIndex)) currentGlobalSortedIndices.push(partitionIndex);
      addStep(lm.returnPI, currentArr, [], [], `Pivot at ${partitionIndex} is in sorted position.`, [low, high], partitionIndex);
      addStep(lm.partitionEnd, currentArr, [], [], `End partition for [${low}..${high}]`, [low,high], partitionIndex);
      return partitionIndex;
  }

  function quickSortRecursive(currentArr: number[], low: number, high: number) {
      addStep(lm.quickSortBase, currentArr, [], [], `quickSort(arr, ${low}, ${high})`, [low, high]);
      if (low < high) {
          addStep(lm.quickSortCondition, currentArr, [], [], `low (${low}) < high (${high}). Proceed.`, [low, high]);
          
          const pi = partition(currentArr, low, high);
          addStep(lm.callPartition, currentArr, [], [], `Partition index pi = ${pi}`, [low, high], pi);

          addStep(lm.recursiveCallLeft, currentArr, [], [], `Recursive call for left part: [${low}..${pi-1}]`, [low, pi-1], null);
          quickSortRecursive(currentArr, low, pi - 1);
          
          addStep(lm.recursiveCallRight, currentArr, [], [], `Recursive call for right part: [${pi+1}..${high}]`, [pi+1, high], null);
          quickSortRecursive(currentArr, pi + 1, high);
      } else {
          addStep(lm.quickSortCondition, currentArr, [], [], `Base case: low (${low}) not < high (${high}). Return.`, [low, high]);
          for (let k_idx = low; k_idx <= high; k_idx++) {
              if (k_idx >=0 && k_idx < currentArr.length && !currentGlobalSortedIndices.includes(k_idx)) {
                  currentGlobalSortedIndices.push(k_idx);
              }
          }
      }
      addStep(lm.quickSortEnd, currentArr, [], [], `Finished quickSort for [${low}..${high}]`, [low, high]);
  }
  
  addStep(lm.initialCallComment, arr, [], [], "Initial call to Quick Sort for the whole array", [0, arr.length - 1]);
  quickSortRecursive(arr, 0, arr.length - 1);
  
  for(let k=0; k < arr.length; k++) {
      if(!currentGlobalSortedIndices.includes(k)) currentGlobalSortedIndices.push(k);
  }
  currentGlobalSortedIndices.sort((a,b)=>a-b);
  addStep(lm.quickSortEnd, arr, [], [], "Array is sorted", null, null);
  return localSteps;
};
