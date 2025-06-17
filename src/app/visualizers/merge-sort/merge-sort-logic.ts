
import type { AlgorithmStep } from '@/types';

export const MERGE_SORT_LINE_MAP = {
  mergeSortBase: 1, 
  baseCaseReturn: 2, 
  calculateMiddle: 3, 
  recursiveCallLeft: 4, 
  recursiveCallRight: 5, 
  callMerge: 6, 
  mergeSortEnd: 7, 
  mergeFunction: 8, 
  calcLeftSize: 9, 
  calcRightSize: 10, 
  createLeftArray: 11, 
  createRightArray: 12, 
  copyToLeftArray: 13, 
  copyToRightArray: 14, 
  initMergePointers: 15, 
  mergeLoopStart: 16, 
  compareLvsR: 17, 
  copyFromL: 18, 
  elseBlock: 19, 
  copyFromR: 20, 
  endIfElse: 21, 
  incrementK: 22, 
  mergeLoopEnd: 23, 
  copyRemainingL: 24, 
  copyRemainingR: 25, 
  mergeFunctionEnd: 26, 
  initialCallComment: 27, 
};

export const generateMergeSortSteps = (arrToSort: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  if (!arrToSort || arrToSort.length === 0) {
    localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
    return localSteps;
  }
  
  const arr = [...arrToSort];
  const lm = MERGE_SORT_LINE_MAP;

  function addStep(
      line: number,
      currentArrState: number[],
      active: number[] = [],
      swapping: number[] = [],
      sorted: number[] = [],
      message: string = "",
      processingRange: [number, number] | null = null,
  ) {
      localSteps.push({
          array: [...currentArrState],
          activeIndices: active,
          swappingIndices: swapping,
          sortedIndices: sorted,
          currentLine: line,
          message,
          processingSubArrayRange: processingRange,
          pivotActualIndex: null, // Not used in Merge Sort
      });
  }

  function merge(currentArr: number[], low: number, mid: number, high: number, currentSortedGlobal: number[]) {
      addStep(lm.mergeFunction, currentArr, [], [], [...currentSortedGlobal], `Merging subarray [${low}..${high}]`, [low, high]);
      
      const leftSize = mid - low + 1;
      addStep(lm.calcLeftSize, currentArr, [], [], [...currentSortedGlobal], `Left half size: ${leftSize}`, [low, high]);
      const rightSize = high - mid;
      addStep(lm.calcRightSize, currentArr, [], [], [...currentSortedGlobal], `Right half size: ${rightSize}`, [low, high]);

      const L = new Array(leftSize);
      const R = new Array(rightSize);
      addStep(lm.createLeftArray, currentArr, [], [], [...currentSortedGlobal], `Creating temp left array`, [low, high]);
      addStep(lm.createRightArray, currentArr, [], [], [...currentSortedGlobal], `Creating temp right array`, [low, high]);

      for (let i = 0; i < leftSize; i++) L[i] = currentArr[low + i];
      addStep(lm.copyToLeftArray, currentArr, Array.from({length: leftSize}, (_,k)=>low+k), [], [...currentSortedGlobal], `Copying to temp left array`, [low, high]);
      
      for (let j = 0; j < rightSize; j++) R[j] = currentArr[mid + 1 + j];
      addStep(lm.copyToRightArray, currentArr, Array.from({length: rightSize}, (_,k)=>mid+1+k), [], [...currentSortedGlobal], `Copying to temp right array`, [low, high]);

      let i = 0, j = 0, k = low;
      addStep(lm.initMergePointers, currentArr, [low+i, mid+1+j], [], [...currentSortedGlobal], `Initializing merge pointers i=${i}, j=${j}, k=${k}`, [low, high]);

      while (i < leftSize && j < rightSize) {
          addStep(lm.mergeLoopStart, currentArr, [low + i, mid + 1 + j], [], [...currentSortedGlobal], `Comparing L[${i}] (${L[i]}) and R[${j}] (${R[j]})`, [low, high]);
          addStep(lm.compareLvsR, currentArr, [low+i, mid+1+j], [], [...currentSortedGlobal], `Is L[${i}] (${L[i]}) <= R[${j}] (${R[j]})?`, [low,high]);
          if (L[i] <= R[j]) {
              currentArr[k] = L[i];
              addStep(lm.copyFromL, currentArr, [low+i], [k], [...currentSortedGlobal], `Copying L[${i}] (${L[i]}) to arr[${k}]`, [low, high]);
              i++;
          } else {
              addStep(lm.elseBlock, currentArr, [low+i, mid+1+j], [], [...currentSortedGlobal], `No, L[${i}] > R[${j}]`, [low,high]);
              currentArr[k] = R[j];
              addStep(lm.copyFromR, currentArr, [mid+1+j], [k], [...currentSortedGlobal], `Copying R[${j}] (${R[j]}) to arr[${k}]`, [low, high]);
              j++;
          }
          addStep(lm.endIfElse, currentArr, [], [k], [...currentSortedGlobal], `arr[${k}] is now ${currentArr[k]}`, [low,high]);
          k++;
          addStep(lm.incrementK, currentArr, [], [], [...currentSortedGlobal], `Increment k to ${k}`, [low, high]);
      }
      addStep(lm.mergeLoopEnd, currentArr, [], [], [...currentSortedGlobal], `Merge loop finished`, [low, high]);

      while (i < leftSize) {
          currentArr[k] = L[i];
          addStep(lm.copyRemainingL, currentArr, [low+i], [k], [...currentSortedGlobal], `Copying remaining L[${i}] (${L[i]}) to arr[${k}]`, [low, high]);
          i++; k++;
      }
      while (j < rightSize) {
          currentArr[k] = R[j];
          addStep(lm.copyRemainingR, currentArr, [mid+1+j], [k], [...currentSortedGlobal], `Copying remaining R[${j}] (${R[j]}) to arr[${k}]`, [low, high]);
          j++; k++;
      }
      
      for(let l_idx = low; l_idx <= high; l_idx++) {
          if (!currentSortedGlobal.includes(l_idx)) currentSortedGlobal.push(l_idx);
      }
      currentSortedGlobal.sort((a,b)=>a-b);
      addStep(lm.mergeFunctionEnd, currentArr, [], [], [...currentSortedGlobal], `Subarray [${low}..${high}] merged and sorted`, [low, high]);
  }

  function mergeSortRecursive(currentArr: number[], low: number, high: number, currentSortedGlobal: number[]) {
      addStep(lm.mergeSortBase, currentArr, [], [], [...currentSortedGlobal], `mergeSort(arr, ${low}, ${high})`, [low, high]);
      if (low >= high) {
          addStep(lm.baseCaseReturn, currentArr, [], [], [...currentSortedGlobal], `Base case: low (${low}) >= high (${high}). Return.`, [low, high]);
          if(low === high && !currentSortedGlobal.includes(low)) currentSortedGlobal.push(low); 
          return;
      }
      const middle = Math.floor(low + (high - low) / 2);
      addStep(lm.calculateMiddle, currentArr, [], [], [...currentSortedGlobal], `Middle calculated: ${middle}`, [low, high]);
      
      addStep(lm.recursiveCallLeft, currentArr, [], [], [...currentSortedGlobal], `Recursive call for left half: [${low}..${middle}]`, [low, high]);
      mergeSortRecursive(currentArr, low, middle, currentSortedGlobal);
      
      addStep(lm.recursiveCallRight, currentArr, [], [], [...currentSortedGlobal], `Recursive call for right half: [${middle + 1}..${high}]`, [low, high]);
      mergeSortRecursive(currentArr, middle + 1, high, currentSortedGlobal);
      
      addStep(lm.callMerge, currentArr, [], [], [...currentSortedGlobal], `Call merge for [${low}..${high}]`, [low, high]);
      merge(currentArr, low, middle, high, currentSortedGlobal);
      addStep(lm.mergeSortEnd, currentArr, [], [], [...currentSortedGlobal], `Finished mergeSort for [${low}..${high}]`, [low,high]);
  }
  
  const globalSortedIndices: number[] = [];
  addStep(lm.initialCallComment, arr, [], [], [], "Initial call to Merge Sort for the whole array", [0, arr.length - 1]);
  mergeSortRecursive(arr, 0, arr.length - 1, globalSortedIndices);
  addStep(lm.mergeFunctionEnd, arr, [], [], arr.map((_, i) => i), "Array is sorted", null); 
  return localSteps;
};
