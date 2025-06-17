
import type { AlgorithmStep } from '@/types';

export const RADIX_SORT_LINE_MAP = {
  // Main Radix Sort Function
  radixSortFuncStart: 1,
  getMaxVal: 2,
  outerLoopExpStart: 3, // for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10)
  callCountingSortForRadix: 4,
  outerLoopExpEnd: 5, // Conceptual end of exp loop
  returnArrRadix: 6, // return arr; (from radixSort)
  radixSortFuncEnd: 7,

  // Counting Sort Subroutine (Conceptual Lines)
  countingSortSubFuncStart: 8, // function countingSortForRadix(arr, exp) {
  getNCountingSort: 9,        // const n = arr.length;
  initOutputArrayCounting: 10, // const output = new Array(n);
  initCountArrayCounting: 11,  // const count = new Array(10).fill(0);

  countOccurrencesLoopStart: 12, // for (let i = 0; i < n; i++) {
  getDigitForCount: 13,         // count[Math.floor(arr[i] / exp) % 10]++;
  incrementDigitCount: 14,      // count[digit]++;
  countOccurrencesLoopEnd: 15,

  modifyCountLoopStart: 16,     // for (let i = 1; i < 10; i++) {
  cumulativeCount: 17,          // count[i] += count[i - 1];
  modifyCountLoopEnd: 18,

  buildOutputLoopStart: 19,     // for (let i = n - 1; i >= 0; i--) {
  getDigitForOutput: 20,        // Math.floor(arr[i] / exp) % 10
  placeInOutput: 21,            // output[count[digit] - 1] = arr[i];
  decrementDigitCount: 22,      // count[digit]--;
  buildOutputLoopEnd: 23,

  copyOutputToArrLoopStart: 24, // for (let i = 0; i < n; i++) {
  assignToOriginalArr: 25,      // arr[i] = output[i];
  copyOutputToArrLoopEnd: 26,
  countingSortSubFuncEnd: 27,   // } (end of countingSortForRadix)
};


export const generateRadixSortSteps = (arrToSort: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  if (!arrToSort || arrToSort.length === 0) {
    localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
    return localSteps;
  }
  
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
      message: string = "",
      auxData?: Record<string, any> 
  ) => {
      localSteps.push({
          array: [...currentArrState],
          activeIndices: active,
          swappingIndices: [], // Radix sort itself doesn't swap in main array, counting sort does internally
          sortedIndices: (line === lm.radixSortFuncEnd) ? arr.map((_,i) => i) : [],
          currentLine: line,
          message,
          processingSubArrayRange: [0, n-1], // Radix sort always considers the full array for each pass
          pivotActualIndex: null,
          auxiliaryData: auxData,
      });
  }

  // --- Counting Sort Subroutine (Detailed Steps) ---
  function countingSortForRadix(currentArr: number[], exp: number, passNum: number) {
    addStep(lm.countingSortSubFuncStart, currentArr, [], `(Pass ${passNum}, Counting Sort for exp=${exp}) Start subroutine.`, {exponent: exp});
    
    const countN = currentArr.length; // n for counting sort scope
    addStep(lm.getNCountingSort, currentArr, [], `(CS Pass ${passNum}) n = ${countN}.`, {exponent: exp});

    const output = new Array(countN).fill(0);
    addStep(lm.initOutputArrayCounting, currentArr, [], `(CS Pass ${passNum}) Initialize output array (size ${countN}).`, {exponent: exp, outputArray: [...output]});
    
    const count = new Array(10).fill(0);
    addStep(lm.initCountArrayCounting, currentArr, [], `(CS Pass ${passNum}) Initialize count array (size 10 for digits 0-9).`, {exponent: exp, countArray: [...count], outputArray: [...output]});

    // Store count of occurrences in count[]
    addStep(lm.countOccurrencesLoopStart, currentArr, [], `(CS Pass ${passNum}) Counting occurrences of each digit.`, {exponent: exp, countArray: [...count], outputArray: [...output]});
    for (let i = 0; i < countN; i++) {
      const digit = Math.floor(currentArr[i] / exp) % 10;
      addStep(lm.getDigitForCount, currentArr, [i], `(CS Pass ${passNum}) arr[${i}]=${currentArr[i]}. Digit for exp ${exp} is ${digit}.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentDigitProcessing: digit});
      count[digit]++;
      addStep(lm.incrementDigitCount, currentArr, [i], `(CS Pass ${passNum}) Increment count[${digit}]. Count array: [${count.join(', ')}].`, {exponent: exp, countArray: [...count], outputArray: [...output], currentDigitProcessing: digit});
    }
    addStep(lm.countOccurrencesLoopEnd, currentArr, [], `(CS Pass ${passNum}) Finished counting occurrences. Count array: [${count.join(', ')}].`, {exponent: exp, countArray: [...count], outputArray: [...output]});

    // Change count[i] so that count[i] now contains actual position of this digit in output array
    addStep(lm.modifyCountLoopStart, currentArr, [], `(CS Pass ${passNum}) Modifying count array for cumulative positions.`, {exponent: exp, countArray: [...count], outputArray: [...output]});
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
      addStep(lm.cumulativeCount, currentArr, [i], `(CS Pass ${passNum}) count[${i}] = count[${i-1}] + (original count of ${i}) = ${count[i]}.`, {exponent: exp, countArray: [...count], outputArray: [...output]});
    }
    addStep(lm.modifyCountLoopEnd, currentArr, [], `(CS Pass ${passNum}) Cumulative count array: [${count.join(', ')}].`, {exponent: exp, countArray: [...count], outputArray: [...output]});

    // Build the output array
    addStep(lm.buildOutputLoopStart, currentArr, [], `(CS Pass ${passNum}) Building output array (iterating input from end for stability).`, {exponent: exp, countArray: [...count], outputArray: [...output]});
    for (let i = countN - 1; i >= 0; i--) {
      const digit = Math.floor(currentArr[i] / exp) % 10;
      addStep(lm.getDigitForOutput, currentArr, [i], `(CS Pass ${passNum}) arr[${i}]=${currentArr[i]}. Digit=${digit}. Output position: count[${digit}]-1 = ${count[digit]-1}.`, {exponent: exp, countArray: [...count], outputArray: [...output]});
      output[count[digit] - 1] = currentArr[i];
      addStep(lm.placeInOutput, currentArr, [i], `(CS Pass ${passNum}) Placed ${currentArr[i]} into output[${count[digit]-1}]. Output: [${output.join(', ')}].`, {exponent: exp, countArray: [...count], outputArray: [...output]});
      count[digit]--;
      addStep(lm.decrementDigitCount, currentArr, [i], `(CS Pass ${passNum}) Decrement count[${digit}] to ${count[digit]}.`, {exponent: exp, countArray: [...count], outputArray: [...output]});
    }
    addStep(lm.buildOutputLoopEnd, currentArr, [], `(CS Pass ${passNum}) Output array built: [${output.join(', ')}].`, {exponent: exp, countArray: [...count], outputArray: [...output]});

    // Copy the output array to arr[], so that arr[] now contains sorted numbers according to current digit
    addStep(lm.copyOutputToArrLoopStart, currentArr, [], `(CS Pass ${passNum}) Copying sorted output back to main array.`, {exponent: exp, countArray: [...count], outputArray: [...output]});
    for (let i = 0; i < countN; i++) {
      currentArr[i] = output[i];
      // Add step for each element copy for very fine-grained view if needed, or just one after loop
    }
    addStep(lm.assignToOriginalArr, currentArr, [], `(CS Pass ${passNum}) Main array updated: [${currentArr.join(', ')}].`, {exponent: exp, countArray: [...count], outputArray: [...output]}); // Using assignToOriginalArr for message context
    addStep(lm.countingSortSubFuncEnd, currentArr, [], `(CS Pass ${passNum}) Counting Sort for exp=${exp} finished.`);
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
    addStep(lm.outerLoopExpStart, arr, [], [], `Radix Sort Pass ${passNumber}: Sorting by digit with exponent ${exp}.`, {exponent: exp});
    countingSortForRadix(arr, exp, passNumber); // arr is modified in-place
    addStep(lm.outerLoopExpEnd, arr, [], [], `Finished Radix Sort Pass ${passNumber}. Array: [${arr.join(', ')}].`, {exponent: exp});
    passNumber++;
  }
  
  addStep(lm.returnArrRadix, arr, [], [], "Radix Sort complete. Array is sorted.");
  addStep(lm.radixSortFuncEnd, arr, [], [], "Algorithm finished.");
  return localSteps;
};
