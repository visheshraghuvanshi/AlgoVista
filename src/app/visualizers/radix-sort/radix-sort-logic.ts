
import type { AlgorithmStep } from '@/types';

export const RADIX_SORT_LINE_MAP = {
  // Main Radix Sort Function
  radixSortFuncStart: 1,
  getMaxVal: 2,
  outerLoopExp: 3, // for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10)
  callCountingSortForRadix: 4,
  radixSortFuncEnd: 5,

  // Counting Sort Subroutine (Conceptual Lines)
  countingSortSubFuncStart: 6,
  initOutputAndCount: 7,
  countOccurrencesLoop: 8,
  incrementDigitCount: 9,
  modifyCountLoop: 10,
  cumulativeCount: 11,
  buildOutputLoop: 12,
  placeInOutput: 13,
  decrementDigitCount: 14,
  copyOutputToArrLoop: 15,
  assignToOriginalArr: 16,
  countingSortSubFuncEnd: 17,
};


export const generateRadixSortSteps = (arrToSort: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  if (!arrToSort || arrToSort.length === 0) {
    localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
    return localSteps;
  }
  
  // Radix sort typically works with non-negative integers.
  // This implementation will assume non-negative for simplicity of visualization.
  if (arrToSort.some(num => num < 0)) {
    localSteps.push({ array: arrToSort, activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Radix Sort (this version) expects non-negative integers." });
    return localSteps;
  }

  const arr = [...arrToSort];
  const n = arr.length;
  const lm = RADIX_SORT_LINE_MAP;

  const addStep = (
      line: number,
      currentArrState: number[],
      active: number[] = [],
      swapping: number[] = [], // Not typically used directly in top-level Radix viz
      message: string = "",
      processingSubArrayRange: [number, number] | null = null, // Can show full array as processing
      auxData?: Record<string, any> // For current exponent (digit place)
  ) => {
      localSteps.push({
          array: [...currentArrState],
          activeIndices: active,
          swappingIndices: swapping,
          sortedIndices: (line === lm.radixSortFuncEnd) ? arr.map((_,i) => i) : [], // Mark sorted at the very end
          currentLine: line,
          message,
          processingSubArrayRange: processingSubArrayRange || [0, n-1],
          pivotActualIndex: null, // Not used
          auxiliaryData: auxData,
      });
  }

  // --- Counting Sort Subroutine (Simplified for Radix Steps) ---
  function countingSortForRadix(currentArr: number[], exp: number, passNum: number) {
    addStep(lm.callCountingSortForRadix, currentArr, [], [], `Calling Counting Sort for digit place (exp = ${exp}), Pass ${passNum}`, null, {exponent: exp});
    
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);
    addStep(lm.initOutputAndCount, currentArr, [], [], `(Counting Sort) Initialized output and count arrays.`, null, {exponent: exp});

    // Store count of occurrences in count[]
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(currentArr[i] / exp) % 10;
      addStep(lm.countOccurrencesLoop, currentArr, [i], [], `(Counting Sort) Counting digit for arr[${i}]=${currentArr[i]}. Digit is ${digit}.`, null, {exponent: exp, currentDigit: digit});
      count[digit]++;
    }
    addStep(lm.countOccurrencesLoop, currentArr, [], [], `(Counting Sort) Finished counting occurrences for this digit.`, null, {exponent: exp, countArray: [...count]});


    // Change count[i] so that count[i] now contains actual
    // position of this digit in output array
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
    addStep(lm.modifyCountLoop, currentArr, [], [], `(Counting Sort) Modified count array to store cumulative positions.`, null, {exponent: exp, countArray: [...count]});

    // Build the output array
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(currentArr[i] / exp) % 10;
      addStep(lm.buildOutputLoop, currentArr, [i], [], `(Counting Sort) Placing arr[${i}]=${currentArr[i]} into output array. Digit=${digit}, Position=${count[digit]-1}.`, null, {exponent: exp});
      output[count[digit] - 1] = currentArr[i];
      count[digit]--;
    }
    addStep(lm.buildOutputLoop, currentArr, [], [], `(Counting Sort) Output array built for this digit.`, null, {exponent: exp, outputArray: [...output]});

    // Copy the output array to arr[], so that arr[] now
    // contains sorted numbers according to current digit
    for (let i = 0; i < n; i++) {
      currentArr[i] = output[i];
    }
    addStep(lm.copyOutputToArrLoop, currentArr, [], [], `(Counting Sort) Copied output back to main array for Pass ${passNum}. Array state after sorting by this digit.`, null, {exponent: exp});
    addStep(lm.countingSortSubFuncEnd, currentArr, [], [], `(Counting Sort) Subroutine finished for exp=${exp}.`);
  }

  // --- Radix Sort Main Logic ---
  addStep(lm.radixSortFuncStart, arr, [], [], "Starting Radix Sort.");
  if (n === 0) {
    addStep(lm.radixSortFuncEnd, arr, [], [], "Array is empty.");
    return localSteps;
  }

  const maxVal = Math.max(...arr);
  addStep(lm.getMaxVal, arr, [], [], `Maximum value in array: ${maxVal}.`);

  let passNumber = 1;
  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
    addStep(lm.outerLoopExp, arr, [], [], `Radix Sort Pass ${passNumber}: Sorting by digit with exponent ${exp} (1s, 10s, 100s, etc.).`, null, {exponent: exp});
    countingSortForRadix(arr, exp, passNumber);
    passNumber++;
  }
  
  addStep(lm.radixSortFuncEnd, arr, [], [], "Radix Sort complete. Array is sorted.");
  return localSteps;
};
