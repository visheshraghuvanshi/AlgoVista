
import type { AlgorithmStep } from '@/types';

export const HEAP_SORT_LINE_MAP = {
  heapSortStart: 1,
  getN: 2,
  buildHeapLoopStart: 3,
  callHeapifyBuild: 4,
  buildHeapLoopEnd: 5,
  extractLoopStart: 6,
  swapRootWithEnd: 7,
  markAsSorted: 8, // Conceptual line for visualization after swap
  callHeapifyExtract: 9,
  extractLoopEnd: 10,
  returnArr: 11,
  heapSortEnd: 12,
  heapifyStart: 13,
  initLargest: 14,
  getLeftChild: 15,
  getRightChild: 16,
  compareLeftWithLargest: 17,
  updateLargestWithLeft: 18,
  endCompareLeft: 19,
  compareRightWithLargest: 20,
  updateLargestWithRight: 21,
  endCompareRight: 22,
  ifLargestNotRoot: 23,
  swapWithLargest: 24,
  recursiveHeapifyCall: 25,
  endIfLargestNotRoot: 26,
  heapifyEnd: 27,
};

export const generateHeapSortSteps = (arrToSort: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  if (!arrToSort || arrToSort.length === 0) {
    localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
    return localSteps;
  }

  const arr = [...arrToSort];
  const n = arr.length;
  const lm = HEAP_SORT_LINE_MAP;
  const currentGlobalSortedIndices: number[] = [];

  const addStep = (
    line: number,
    currentArrState: number[],
    active: number[] = [],
    swapping: number[] = [],
    message: string = "",
    processingRange: [number, number] | null = null, // Used to show current heap range
    pivotIdx: number | null = null // Not typically used for heap sort visualization in this way
  ) => {
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
  };

  function heapify(currentArr: number[], heapSize: number, rootIdx: number) {
    addStep(lm.heapifyStart, currentArr, [rootIdx], [], `heapify(arr, heapSize=${heapSize}, root=${rootIdx})`, [0, heapSize -1]);
    
    let largest = rootIdx;
    addStep(lm.initLargest, currentArr, [rootIdx], [], `largest = ${rootIdx}`, [0, heapSize - 1]);
    
    const l = 2 * rootIdx + 1;
    const r = 2 * rootIdx + 2;
    addStep(lm.getLeftChild, currentArr, [rootIdx, l], [], `left child index = ${l}`, [0, heapSize - 1]);
    addStep(lm.getRightChild, currentArr, [rootIdx, r], [], `right child index = ${r}`, [0, heapSize - 1]);

    addStep(lm.compareLeftWithLargest, currentArr, [l, largest], [], `Compare left child arr[${l}] with arr[${largest}]`, [0, heapSize - 1]);
    if (l < heapSize && currentArr[l] > currentArr[largest]) {
      largest = l;
      addStep(lm.updateLargestWithLeft, currentArr, [l, rootIdx], [], `Left child is larger. largest = ${largest}`, [0, heapSize - 1]);
    }
    addStep(lm.endCompareLeft, currentArr, [rootIdx], [], `End_compare_left. largest = ${largest}`, [0, heapSize - 1]);

    addStep(lm.compareRightWithLargest, currentArr, [r, largest], [], `Compare right child arr[${r}] with arr[${largest}]`, [0, heapSize - 1]);
    if (r < heapSize && currentArr[r] > currentArr[largest]) {
      largest = r;
      addStep(lm.updateLargestWithRight, currentArr, [r, rootIdx], [], `Right child is larger. largest = ${largest}`, [0, heapSize - 1]);
    }
    addStep(lm.endCompareRight, currentArr, [rootIdx], [], `End_compare_right. largest = ${largest}`, [0, heapSize - 1]);
    
    addStep(lm.ifLargestNotRoot, currentArr, [largest, rootIdx], [], `Is largest (${largest}) different from root (${rootIdx})?`, [0, heapSize - 1]);
    if (largest !== rootIdx) {
      addStep(lm.swapWithLargest, currentArr, [rootIdx, largest], [rootIdx, largest], `Yes. Swap arr[${rootIdx}] (${currentArr[rootIdx]}) with arr[${largest}] (${currentArr[largest]})`, [0, heapSize - 1]);
      [currentArr[rootIdx], currentArr[largest]] = [currentArr[largest], currentArr[rootIdx]];
      addStep(lm.swapWithLargest, currentArr, [rootIdx, largest], [], `Swapped. Array: [${currentArr.slice(0, heapSize).join(',')}]`, [0, heapSize - 1]);

      addStep(lm.recursiveHeapifyCall, currentArr, [largest], [], `Recursively call heapify on affected subtree (root=${largest})`, [0, heapSize - 1]);
      heapify(currentArr, heapSize, largest);
    }
    addStep(lm.endIfLargestNotRoot, currentArr, [rootIdx],[], `End_if_largest_not_root.`,[0,heapSize-1]);
    addStep(lm.heapifyEnd, currentArr, [rootIdx], [], `heapify for root=${rootIdx} finished.`, [0, heapSize - 1]);
  }

  addStep(lm.heapSortStart, arr, [], [], "Starting Heap Sort");
  addStep(lm.getN, arr, [], [], `n = ${n}`);

  // Build max heap
  addStep(lm.buildHeapLoopStart, arr, [], [], "Phase 1: Build Max Heap");
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    addStep(lm.buildHeapLoopStart, arr, [i], [], `Building heap: calling heapify for root index ${i}`, [0, n-1]);
    addStep(lm.callHeapifyBuild, arr, [i], [], `Call heapify(arr, n=${n}, i=${i})`, [0, n-1]);
    heapify(arr, n, i);
  }
  addStep(lm.buildHeapLoopEnd, arr, [], [], "Max Heap built.", [0, n-1]);

  // Extract elements from heap one by one
  addStep(lm.extractLoopStart, arr, [], [], "Phase 2: Extract elements from heap");
  for (let i = n - 1; i > 0; i--) {
    addStep(lm.extractLoopStart, arr, [0, i], [], `Extracting max: current heap size is ${i+1}. Processing index ${i}.`, [0, i]);
    
    addStep(lm.swapRootWithEnd, arr, [0, i], [0, i], `Swap root arr[0] (${arr[0]}) with arr[${i}] (${arr[i]})`, [0, i]);
    [arr[0], arr[i]] = [arr[i], arr[0]];
    addStep(lm.swapRootWithEnd, arr, [0, i], [], `Swapped. arr[${i}] is now ${arr[i]}.`, [0, i]);

    if (!currentGlobalSortedIndices.includes(i)) currentGlobalSortedIndices.push(i);
    currentGlobalSortedIndices.sort((a,b) => a-b); // Keep it sorted for consistent display
    addStep(lm.markAsSorted, arr, [i], [], `Element arr[${i}] (${arr[i]}) is now in sorted position.`, null);
    
    addStep(lm.callHeapifyExtract, arr, [0], [], `Call heapify on reduced heap (size=${i}, root=0)`, [0, i-1]);
    heapify(arr, i, 0); // Call heapify on the reduced heap
  }
  addStep(lm.extractLoopEnd, arr, [], [], "Extraction phase finished.");
  
  // The 0th element is also sorted by now
  if (n > 0 && !currentGlobalSortedIndices.includes(0)) currentGlobalSortedIndices.push(0);
  currentGlobalSortedIndices.sort((a,b)=>a-b);

  addStep(lm.returnArr, arr, [], [], "Array is sorted", null);
  addStep(lm.heapSortEnd, arr, [], [], "Heap Sort finished", null);
  return localSteps;
};
