
import type { AlgorithmStep } from '@/types';

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
  foundSubarray?: number[] | null
) => {
  localSteps.push({
    array: [...currentArr],
    activeIndices: activeWindowOrIndices.filter(idx => idx >= 0 && idx < currentArr.length),
    swappingIndices: [],
    sortedIndices: foundSubarray || [], // Highlight the found subarray
    currentLine: line,
    message,
    processingSubArrayRange: activeWindowOrIndices.length === 2 ? [activeWindowOrIndices[0], activeWindowOrIndices[1]] : null,
    auxiliaryData: auxData,
  });
};

export function generateFindSubarraySumPositiveSteps(arr: number[], targetSum: number): AlgorithmStep[] {
  const localSteps: AlgorithmStep[] = [];
  const lm = SUBARRAY_SUM_LINE_MAPS.positiveOnly;
  const n = arr.length;

  addStep(localSteps, lm.funcDeclare, arr, [], `Finding subarray with sum ${targetSum} (positive numbers).`);

  let currentSum = 0;
  let start = 0;
  addStep(localSteps, lm.initVars, arr, [], `Initialize currentSum = 0, start = 0.`, { currentSum, start });

  for (let end = 0; end < n; end++) {
    addStep(localSteps, lm.loopEnd, arr, [start, end], `Outer loop: end = ${end}. Processing arr[${end}] (${arr[end]}).`, { currentSum, start, end });
    currentSum += arr[end];
    addStep(localSteps, lm.addToCurrentSum, arr, [start, end], `Add arr[${end}] to currentSum. currentSum = ${currentSum}.`, { currentSum, start, end });

    while (currentSum > targetSum && start <= end) {
      addStep(localSteps, lm.whileSumTooLarge, arr, [start, end], `currentSum (${currentSum}) > targetSum (${targetSum}). Shrink window.`, { currentSum, start, end });
      currentSum -= arr[start];
      addStep(localSteps, lm.subtractFromSum, arr, [start, end], `Subtract arr[${start}] (${arr[start]}) from currentSum. currentSum = ${currentSum}.`, { currentSum, start, end });
      start++;
      addStep(localSteps, lm.incrementStart, arr, [start, end], `Increment start to ${start}.`, { currentSum, start, end });
    }
    
    addStep(localSteps, lm.checkSumEqualsTarget, arr, [start, end], `Is currentSum (${currentSum}) === targetSum (${targetSum})?`, { currentSum, start, end });
    if (currentSum === targetSum && start <=end) { // Ensure non-empty for sum 0 case
        const found = arr.slice(start, end + 1);
        addStep(localSteps, lm.returnSubarray, arr, [], `Yes. Subarray [${found.join(',')}] found from index ${start} to ${end}.`, { currentSum, start, end, result: `[${found.join(',')}]` }, Array.from({length: end - start + 1}, (_, k) => start + k));
        addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.");
        return localSteps;
    }
  }
  addStep(localSteps, lm.returnNull, arr, [], `No subarray found with sum ${targetSum}.`, { currentSum, start });
  addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.");
  return localSteps;
}

export function generateFindSubarraySumAnySteps(arr: number[], targetSum: number): AlgorithmStep[] {
  const localSteps: AlgorithmStep[] = [];
  const lm = SUBARRAY_SUM_LINE_MAPS.anyNumbers;
  const n = arr.length;

  addStep(localSteps, lm.funcDeclare, arr, [], `Finding subarray with sum ${targetSum} (any numbers).`);

  let currentSum = 0;
  const prefixSums = new Map<number, number>(); // Map: sum -> index
  addStep(localSteps, lm.initVars, arr, [], `Initialize currentSum = 0, prefixSums map.`, { currentSum, prefixSums: Object.fromEntries(prefixSums) });
  
  prefixSums.set(0, -1); // Base case for subarrays starting at index 0
  addStep(localSteps, lm.setInitialPrefixSum, arr, [], `Set prefixSums[0] = -1 (base case).`, { currentSum, prefixSums: Object.fromEntries(prefixSums) });

  for (let i = 0; i < n; i++) {
    addStep(localSteps, lm.loopI, arr, [i], `Loop: i = ${i}. Processing arr[${i}] (${arr[i]}).`, { currentSum, prefixSums: Object.fromEntries(prefixSums), currentIndex: i });
    currentSum += arr[i];
    addStep(localSteps, lm.addToCurrentSum, arr, [i], `Add arr[${i}] to currentSum. currentSum = ${currentSum}.`, { currentSum, prefixSums: Object.fromEntries(prefixSums), currentIndex: i });

    const complement = currentSum - targetSum;
    addStep(localSteps, lm.checkMapForComplement, arr, [i], `Check if prefixSums map contains complement (${complement}) = currentSum (${currentSum}) - targetSum (${targetSum}).`, { currentSum, prefixSums: Object.fromEntries(prefixSums), currentIndex: i, complement });
    if (prefixSums.has(complement)) {
      const startIndex = prefixSums.get(complement)! + 1;
      const endIndex = i;
      const found = arr.slice(startIndex, endIndex + 1);
      addStep(localSteps, lm.returnSubarray, arr, [], `Yes. Complement found. Subarray [${found.join(',')}] from index ${startIndex} to ${endIndex}.`, { currentSum, prefixSums: Object.fromEntries(prefixSums), currentIndex: i, result: `[${found.join(',')}]` }, Array.from({length: endIndex - startIndex + 1}, (_, k) => startIndex + k));
      addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.");
      return localSteps;
    }
    
    prefixSums.set(currentSum, i);
    addStep(localSteps, lm.storePrefixSumInMap, arr, [i], `Store currentSum (${currentSum}) with index ${i} in prefixSums map.`, { currentSum, prefixSums: Object.fromEntries(prefixSums), currentIndex: i });
  }

  addStep(localSteps, lm.returnNull, arr, [], `No subarray found with sum ${targetSum}.`, { currentSum, prefixSums: Object.fromEntries(prefixSums) });
  addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.");
  return localSteps;
}

    