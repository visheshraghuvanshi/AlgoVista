
import type { AlgorithmStep } from './types'; // Local import

export const RADIX_SORT_LINE_MAP = {
  // Main Radix Sort Function
  radixSortFuncStart: 1,
  getMaxVal: 3, // Adjusted to match JS snippet line where maxVal is used.
  outerLoopExpStart: 4, 
  callCountingSortForRadix: 5,
  outerLoopExpEnd: 6, 
  returnArrRadix: 7, 
  radixSortFuncEnd: 8,

  // Counting Sort Subroutine (Conceptual Lines - these are relative to the start of countingSortForRadix)
  countingSortSubFuncStart: 10, 
  getNCountingSort: 11,        
  initOutputArrayCounting: 12, 
  initCountArrayCounting: 13,  

  countOccurrencesLoopStart: 15, 
  getDigitForCount: 16,         
  incrementDigitCount: 17,      
  countOccurrencesLoopEnd: 18, // Conceptual

  modifyCountLoopStart: 20,     
  cumulativeCount: 21,          
  modifyCountLoopEnd: 22, // Conceptual

  buildOutputLoopStart: 24,     
  getDigitForOutput: 25,        
  placeInOutput: 26,            
  decrementDigitCount: 27,      
  buildOutputLoopEnd: 28, // Conceptual

  copyOutputToArrLoopStart: 30, 
  assignToOriginalArr: 31,      
  copyOutputToArrLoopEnd: 32, // Conceptual
  countingSortSubFuncEnd: 33,   
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
          swappingIndices: [],
          sortedIndices: (line === lm.radixSortFuncEnd) ? arr.map((_,i) => i) : [],
          currentLine: line,
          message,
          processingSubArrayRange: [0, n-1], 
          pivotActualIndex: null,
          auxiliaryData: auxData,
      });
  }

  // --- Counting Sort Subroutine (Detailed Steps) ---
  function countingSortForRadix(currentArr: number[], exp: number, passNum: number) {
    addStep(lm.countingSortSubFuncStart, currentArr, [], `(Pass ${passNum}, Counting Sort for exp=${exp}) Start subroutine.`, {exponent: exp, currentPassCountingSort: true});
    
    const countN = currentArr.length; 
    addStep(lm.getNCountingSort, currentArr, [], `(CS Pass ${passNum}) n = ${countN}.`, {exponent: exp, currentPassCountingSort: true});

    const output = new Array(countN).fill(0);
    addStep(lm.initOutputArrayCounting, currentArr, [], `(CS Pass ${passNum}) Initialize output array (size ${countN}).`, {exponent: exp, outputArray: [...output], currentPassCountingSort: true});
    
    const count = new Array(10).fill(0);
    addStep(lm.initCountArrayCounting, currentArr, [], `(CS Pass ${passNum}) Initialize count array (size 10 for digits 0-9).`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true});

    addStep(lm.countOccurrencesLoopStart, currentArr, [], `(CS Pass ${passNum}) Counting occurrences of each digit.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true});
    for (let i = 0; i < countN; i++) {
      const digit = Math.floor(currentArr[i] / exp) % 10;
      addStep(lm.getDigitForCount, currentArr, [i], `(CS Pass ${passNum}) arr[${i}]=${currentArr[i]}. Digit for exp ${exp} is ${digit}.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentDigitProcessing: digit, currentPassCountingSort: true, activeCountIndex: digit});
      count[digit]++;
      addStep(lm.incrementDigitCount, currentArr, [i], `(CS Pass ${passNum}) Increment count[${digit}]. Count array: [${count.join(', ')}].`, {exponent: exp, countArray: [...count], outputArray: [...output], currentDigitProcessing: digit, currentPassCountingSort: true, activeCountIndex: digit});
    }
    addStep(lm.countOccurrencesLoopEnd, currentArr, [], `(CS Pass ${passNum}) Finished counting occurrences.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true});

    addStep(lm.modifyCountLoopStart, currentArr, [], `(CS Pass ${passNum}) Modifying count array for cumulative positions.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true});
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
      addStep(lm.cumulativeCount, currentArr, [i], `(CS Pass ${passNum}) count[${i}] = prev_count[${i}] + count[${i-1}] = ${count[i]}.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true, activeCountIndex: i});
    }
    addStep(lm.modifyCountLoopEnd, currentArr, [], `(CS Pass ${passNum}) Cumulative count array ready.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true});

    addStep(lm.buildOutputLoopStart, currentArr, [], `(CS Pass ${passNum}) Building output array (iterating input from end).`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true});
    for (let i = countN - 1; i >= 0; i--) {
      const digit = Math.floor(currentArr[i] / exp) % 10;
      addStep(lm.getDigitForOutput, currentArr, [i], `(CS Pass ${passNum}) arr[${i}]=${currentArr[i]}. Digit=${digit}. Output pos: count[${digit}]-1 = ${count[digit]-1}.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true, activeOutputIndex: count[digit]-1});
      output[count[digit] - 1] = currentArr[i];
      addStep(lm.placeInOutput, currentArr, [i], `(CS Pass ${passNum}) Placed ${currentArr[i]} into output[${count[digit]-1}].`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true, activeOutputIndex: count[digit]-1});
      count[digit]--;
      addStep(lm.decrementDigitCount, currentArr, [i], `(CS Pass ${passNum}) Decrement count[${digit}] to ${count[digit]}.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true, activeCountIndex: digit});
    }
    addStep(lm.buildOutputLoopEnd, currentArr, [], `(CS Pass ${passNum}) Output array built.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true});

    addStep(lm.copyOutputToArrLoopStart, output, [], `(CS Pass ${passNum}) Copying sorted output back to main array.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true});
    for (let i = 0; i < countN; i++) {
      currentArr[i] = output[i];
    }
    addStep(lm.assignToOriginalArr, currentArr, [], `(CS Pass ${passNum}) Main array updated.`, {exponent: exp, countArray: [...count], outputArray: [...output], currentPassCountingSort: true});
    addStep(lm.countingSortSubFuncEnd, currentArr, [], `(CS Pass ${passNum}) Counting Sort for exp=${exp} finished.`);
  }

  // --- Radix Sort Main Logic ---
  addStep(lm.radixSortFuncStart, arr, [], "Starting Radix Sort.");
  if (n === 0) {
    addStep(lm.radixSortFuncEnd, arr, [], "Array is empty.");
    return localSteps;
  }

  const maxVal = Math.max(...arr);
  addStep(lm.getMaxVal, arr, [], `Maximum value: ${maxVal}.`);

  let passNumber = 1;
  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
    addStep(lm.outerLoopExpStart, arr, [], `Radix Sort Pass ${passNumber}: Sorting by digit with exponent ${exp}.`, {exponent: exp});
    countingSortForRadix(arr, exp, passNumber); 
    addStep(lm.outerLoopExpEnd, arr, [], `Finished Radix Sort Pass ${passNumber}.`, {exponent: exp});
    passNumber++;
  }
  
  addStep(lm.returnArrRadix, arr, [], "Radix Sort complete. Array is sorted.");
  addStep(lm.radixSortFuncEnd, arr, [], "Algorithm finished.");
  return localSteps;
};
