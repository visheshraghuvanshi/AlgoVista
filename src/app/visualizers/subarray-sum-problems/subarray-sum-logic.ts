
import type { AlgorithmStep } from './types'; // Local import

export type SubarraySumProblemType = 'positiveOnly' | 'anyNumbers';

export const SUBARRAY_SUM_LINE_MAPS: Record<SubarraySumProblemType, Record<string, number>> = {
  positiveOnly: { // Sliding Window for positive numbers
    funcDeclare: 1,
    initVars: 2, // currentSum, start
    loopEnd: 3,
    addToCurrentSum: 4,
    whileSumTooLarge: 5,
    subtractFromSum: 6,
    incrementStart: 7,
    checkSumEqualsTarget: 8,
    returnSubarray: 9,
    returnNull: 10,
    funcEnd: 11,
  },
  anyNumbers: { // Prefix Sum + HashMap for any numbers
    funcDeclare: 1,
    initVars: 2, // currentSum, prefixSums Map
    setInitialPrefixSum: 3,
    loopI: 4,
    addToCurrentSum: 5,
    checkMapForComplement: 6,
    returnSubarray: 7,
    storePrefixSumInMap: 8,
    returnNull: 9,
    funcEnd: 10,
  },
};

const addStep = (
  localSteps: AlgorithmStep[],
  line: number | null,
  currentArr: number[],
  activeWindowOrIndices: number[],
  message: string,
  auxData?: Record<string, any>,
  foundSubarrayIndices?: number[] | null // Array of indices for the found subarray
) => {
  localSteps.push({
    array: [...currentArr],
    activeIndices: activeWindowOrIndices.filter(idx => idx >=0 && idx < currentArr.length),
    swappingIndices: [],
    sortedIndices: foundSubarrayIndices || [], 
    currentLine: line,
    message,
    processingSubArrayRange: activeWindowOrIndices.length === 2 ? [activeWindowOrIndices[0], activeWindowOrIndices[1]] : (foundSubarrayIndices && foundSubarrayIndices.length > 0 ? [foundSubarrayIndices[0], foundSubarrayIndices[foundSubarrayIndices.length -1]] : null),
    pivotActualIndex: null,
    auxiliaryData: auxData,
  });
};

export function generateFindSubarraySumPositiveSteps(arr: number[], targetSum: number): AlgorithmStep[] {
  const localSteps: AlgorithmStep[] = [];
  const lm = SUBARRAY_SUM_LINE_MAPS.positiveOnly;
  const n = arr.length;
  let foundIndicesFinal: number[] | null = null;

  addStep(localSteps, lm.funcDeclare, arr, [], `Find subarray with sum ${targetSum} (positive nums). Array: [${arr.join(', ')}]`);

  let currentSum = 0;
  let start = 0;
  addStep(localSteps, lm.initVars, arr, [], `Initialize: currentSum = 0, start = 0.`, { currentSum, start, targetSum });

  for (let end = 0; end < n; end++) {
    addStep(localSteps, lm.loopEnd, arr, [start, end], `Outer loop: end = ${end}. Considering arr[${end}]=${arr[end]}. Current window [${start}..${end}].`, { currentSum, start, end, targetSum });
    currentSum += arr[end];
    addStep(localSteps, lm.addToCurrentSum, arr, [start, end], `Added arr[${end}] to sum. currentSum = ${currentSum}.`, { currentSum, start, end, targetSum });

    while (currentSum > targetSum && start <= end) {
      addStep(localSteps, lm.whileSumTooLarge, arr, [start, end], `currentSum (${currentSum}) > targetSum (${targetSum}). Shrinking window from start.`, { currentSum, start, end, targetSum });
      currentSum -= arr[start];
      addStep(localSteps, lm.subtractFromSum, arr, [start, end], `Subtracted arr[${start}] (${arr[start]}) from sum. currentSum = ${currentSum}.`, { currentSum, start, end, targetSum });
      start++;
      addStep(localSteps, lm.incrementStart, arr, [start, end], `Incremented start to ${start}. Window now [${start}..${end}].`, { currentSum, start, end, targetSum });
    }
    
    addStep(localSteps, lm.checkSumEqualsTarget, arr, [start, end], `Is currentSum (${currentSum}) === targetSum (${targetSum})?`, { currentSum, start, end, targetSum });
    if (currentSum === targetSum && start <=end) { 
        const found = arr.slice(start, end + 1);
        foundIndicesFinal = Array.from({length: end - start + 1}, (_, k) => start + k);
        addStep(localSteps, lm.returnSubarray, arr, foundIndicesFinal, `Yes! Subarray [${found.join(',')}] (indices ${start}-${end}) found with sum ${targetSum}.`, { currentSum, start, end, targetSum, result: `[${found.join(',')}] from index ${start} to ${end}` }, foundIndicesFinal);
        addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.", {result: `[${found.join(',')}]`}, foundIndicesFinal);
        return localSteps;
    }
  }
  addStep(localSteps, lm.returnNull, arr, [], `No subarray found with sum ${targetSum}.`, { currentSum, start, targetSum, result: "Not Found" }, null);
  addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.", {result: "Not Found"}, null);
  return localSteps;
}

export function generateFindSubarraySumAnySteps(arr: number[], targetSum: number): AlgorithmStep[] {
  const localSteps: AlgorithmStep[] = [];
  const lm = SUBARRAY_SUM_LINE_MAPS.anyNumbers;
  const n = arr.length;
  let foundIndicesFinal: number[] | null = null;

  addStep(localSteps, lm.funcDeclare, arr, [], `Find subarray with sum ${targetSum} (any numbers). Array: [${arr.join(', ')}]`);

  let currentSum = 0;
  const prefixSums = new Map<number, number>(); 
  addStep(localSteps, lm.initVars, arr, [], `Initialize: currentSum = 0, prefixSums map = {}.`, { currentSum, prefixSums: {}, targetSum });
  
  prefixSums.set(0, -1); 
  addStep(localSteps, lm.setInitialPrefixSum, arr, [], `Set prefixSums[0] = -1 (base for subarrays starting at index 0).`, { currentSum, prefixSums: {0:-1}, targetSum });

  for (let i = 0; i < n; i++) {
    addStep(localSteps, lm.loopI, arr, [i], `Loop: i = ${i}. Processing arr[${i}]=${arr[i]}.`, { currentSum, prefixSums: Object.fromEntries(prefixSums), currentIndex: i, targetSum });
    currentSum += arr[i];
    addStep(localSteps, lm.addToCurrentSum, arr, [i], `Added arr[${i}] to sum. currentSum = ${currentSum}.`, { currentSum, prefixSums: Object.fromEntries(prefixSums), currentIndex: i, targetSum });

    const complement = currentSum - targetSum;
    addStep(localSteps, lm.checkMapForComplement, arr, [i], `Check if prefixSums map contains complement (${complement}) = currentSum (${currentSum}) - targetSum (${targetSum}).`, { currentSum, prefixSums: Object.fromEntries(prefixSums), currentIndex: i, complement, targetSum });
    if (prefixSums.has(complement)) {
      const startIndex = prefixSums.get(complement)! + 1;
      const endIndex = i;
      const found = arr.slice(startIndex, endIndex + 1);
      foundIndicesFinal = Array.from({length: endIndex - startIndex + 1}, (_, k) => startIndex + k);
      addStep(localSteps, lm.returnSubarray, arr, foundIndicesFinal, `Yes! Complement found. Subarray [${found.join(',')}] (indices ${startIndex}-${endIndex}) has sum ${targetSum}.`, { currentSum, prefixSums: Object.fromEntries(prefixSums), currentIndex: i, result: `[${found.join(',')}] from index ${startIndex} to ${endIndex}` }, foundIndicesFinal);
      addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.", {result: `[${found.join(',')}]`}, foundIndicesFinal);
      return localSteps;
    }
    
    prefixSums.set(currentSum, i);
    addStep(localSteps, lm.storePrefixSumInMap, arr, [i], `Store currentSum (${currentSum}) with index ${i} in prefixSums map.`, { currentSum, prefixSums: Object.fromEntries(prefixSums), currentIndex: i, targetSum });
  }

  addStep(localSteps, lm.returnNull, arr, [], `No subarray found with sum ${targetSum}.`, { currentSum, prefixSums: Object.fromEntries(prefixSums), targetSum, result: "Not Found" }, null);
  addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.", {result: "Not Found"}, null);
  return localSteps;
}

