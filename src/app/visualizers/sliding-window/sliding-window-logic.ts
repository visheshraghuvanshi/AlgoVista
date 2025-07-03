
import type { AlgorithmStep } from './types';

export type SlidingWindowProblemType = 'maxSumFixedK' | 'minLengthSumTarget';

export const SUBARRAY_SUM_LINE_MAPS: Record<SlidingWindowProblemType, Record<string, number>> = {
  maxSumFixedK: {
    funcDeclare: 1,
    paramCheck: 2,
    initMaxSum: 3,
    initWindowSum: 4,
    firstWindowLoop: 5,
    addToWindowSum: 6,
    setInitialMaxSum: 8, // Line 8 in JS snippet
    slideWindowLoop: 9,
    updateWindowSum: 10,
    updateMaxSum: 11,
    returnMaxSum: 13,
    funcEnd: 14,
  },
  minLengthSumTarget: {
    funcDeclare: 1,
    initMinLength: 2,
    initWindowSum: 3,
    initWindowStart: 4,
    outerLoopEnd: 5,
    addToWindowSumOuter: 6,
    innerLoopWhileSumGeTarget: 7,
    updateMinLength: 8,
    subtractFromWindowSumInner: 9,
    incrementWindowStartInner: 10,
    returnMinLength: 13,
    funcEnd: 14,
  },
};

const addStep = (
  localSteps: AlgorithmStep[],
  line: number | null,
  currentArr: number[],
  activeWindowOrIndices: number[],
  message: string,
  auxData?: Record<string, any>,
  foundSubarrayIndices?: number[] | null
) => {
  const isWindowRange = activeWindowOrIndices.length === 2 && auxData?.problemType !== 'anyNumbers';
  const processingRange: [number, number] | null = isWindowRange 
    ? [Math.min(...activeWindowOrIndices), Math.max(...activeWindowOrIndices)] 
    : null;
    
  localSteps.push({
    array: [...currentArr],
    activeIndices: activeWindowOrIndices.filter(idx => idx >= 0 && idx < currentArr.length),
    swappingIndices: [],
    sortedIndices: foundSubarrayIndices || [], 
    currentLine: line,
    message,
    processingSubArrayRange: processingRange,
    pivotActualIndex: null,
    auxiliaryData: auxData,
  });
};

export function generateMaxSumFixedKSteps(arr: number[], k: number): AlgorithmStep[] {
  const localSteps: AlgorithmStep[] = [];
  const lm = SUBARRAY_SUM_LINE_MAPS.maxSumFixedK;
  const n = arr.length;
  let foundIndicesFinal: number[] | null = [];

  addStep(localSteps, lm.funcDeclare, arr, [], `Finding max sum subarray of size ${k}.`, { k });

  if (k <= 0 || k > n) {
    addStep(localSteps, lm.paramCheck, arr, [], "Invalid k. Must be 0 < k <= array length.", { k });
    return localSteps;
  }

  let maxSum = -Infinity;
  addStep(localSteps, lm.initMaxSum, arr, [], "Initialize maxSum = -Infinity.", { currentWindowSum: 0, maxSum: "-Infinity", k });
  let windowSum = 0;
  addStep(localSteps, lm.initWindowSum, arr, [], "Initialize windowSum = 0.", { currentWindowSum: windowSum, maxSum: "-Infinity", k });
  
  let bestWindow: [number, number] | null = null;

  addStep(localSteps, lm.firstWindowLoop, arr, [0, k-1], `Calculating sum of first window (indices 0 to ${k-1}).`, {currentWindowSum: windowSum, maxSum: "-Infinity", k});
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
    addStep(localSteps, lm.addToWindowSum, arr, [0, i], `Add arr[${i}] (${arr[i]}) to windowSum. windowSum = ${windowSum}.`, { currentWindowSum: windowSum, maxSum: "-Infinity", k });
  }
  maxSum = windowSum;
  bestWindow = [0, k-1];
  foundIndicesFinal = Array.from({length: bestWindow[1]-bestWindow[0]+1}, (_,j)=>bestWindow![0]+j);
  addStep(localSteps, lm.setInitialMaxSum, arr, [0, k-1], `First window sum is ${windowSum}. Set maxSum = ${maxSum}. Best window: [0, ${k-1}]`, { currentWindowSum: windowSum, maxSum, k }, foundIndicesFinal);

  addStep(localSteps, lm.slideWindowLoop, arr, [0, k-1], "Sliding window through the rest of the array.", { k });
  for (let i = k; i < n; i++) {
    const currentWindowStart = i - k + 1;
    const currentWindowEnd = i;
    
    windowSum += arr[i] - arr[i - k];
    addStep(localSteps, lm.updateWindowSum, arr, [currentWindowStart, currentWindowEnd], `Slide window: Add arr[${i}] (${arr[i]}), remove arr[${i-k}] (${arr[i-k]}). windowSum = ${windowSum}.`, { currentWindowSum: windowSum, maxSum, windowStart: currentWindowStart, windowEnd: currentWindowEnd, k }, foundIndicesFinal);
    
    addStep(localSteps, lm.updateMaxSum, arr, [currentWindowStart, currentWindowEnd], `Is new windowSum (${windowSum}) > maxSum (${maxSum})?`, { currentWindowSum: windowSum, maxSum, windowStart: currentWindowStart, windowEnd: currentWindowEnd, k }, foundIndicesFinal);
    if (windowSum > maxSum) {
        maxSum = windowSum;
        bestWindow = [currentWindowStart, currentWindowEnd];
        foundIndicesFinal = Array.from({length: bestWindow[1]-bestWindow[0]+1}, (_,j)=>bestWindow![0]+j);
        addStep(localSteps, lm.updateMaxSum, arr, [currentWindowStart, currentWindowEnd], `Yes. Update maxSum = ${maxSum}. Best window: [${currentWindowStart}, ${currentWindowEnd}]`, { currentWindowSum: windowSum, maxSum, windowStart: currentWindowStart, windowEnd: currentWindowEnd, k }, foundIndicesFinal);
    }
  }
  addStep(localSteps, lm.returnMaxSum, arr, bestWindow ? [bestWindow[0], bestWindow[1]] : [], `Finished. Max sum is ${maxSum}.`, { maxSum, k }, foundIndicesFinal);
  addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.", {}, foundIndicesFinal);
  return localSteps;
}

export function generateMinLengthSumTargetSteps(arr: number[], targetSum: number): AlgorithmStep[] {
  const localSteps: AlgorithmStep[] = [];
  const lm = SUBARRAY_SUM_LINE_MAPS.minLengthSumTarget;
  const n = arr.length;
  let foundIndicesFinal: number[] | null = null;

  addStep(localSteps, lm.funcDeclare, arr, [], `Find min length subarray with sum >= ${targetSum}.`);

  let minLength = Infinity;
  addStep(localSteps, lm.initMinLength, arr, [], "Initialize minLength = Infinity.", { currentWindowSum: 0, minLength: "Infinity", windowStart: 0, targetSum });
  let windowSum = 0;
  addStep(localSteps, lm.initWindowSum, arr, [], "Initialize windowSum = 0.", { currentWindowSum: windowSum, minLength: "Infinity", windowStart: 0, targetSum });
  let windowStart = 0;
  addStep(localSteps, lm.initWindowStart, arr, [], `Initialize windowStart = 0.`, { windowStart, currentWindowSum: windowSum, minLength: "Infinity", targetSum });

  let bestSubarray: [number, number] | null = null;

  for (let windowEnd = 0; windowEnd < n; windowEnd++) {
    addStep(localSteps, lm.outerLoopEnd, arr, [windowStart, windowEnd], `Expand window: windowEnd = ${windowEnd}. Add arr[${windowEnd}]=${arr[windowEnd]}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength, targetSum });
    windowSum += arr[windowEnd];
    addStep(localSteps, lm.addToWindowSumOuter, arr, [windowStart, windowEnd], `arr[${windowEnd}] added. windowSum = ${windowSum}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength, targetSum });

    while (windowSum >= targetSum) {
      addStep(localSteps, lm.innerLoopWhileSumGeTarget, arr, [windowStart, windowEnd], `windowSum (${windowSum}) >= targetSum (${targetSum}). Valid window found.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength, targetSum });
      const currentLength = windowEnd - windowStart + 1;
      if (currentLength < minLength) {
          minLength = currentLength;
          bestSubarray = [windowStart, windowEnd];
          foundIndicesFinal = Array.from({length: bestSubarray[1]-bestSubarray[0]+1}, (_,j)=>bestSubarray![0]+j);
      }
      addStep(localSteps, lm.updateMinLength, arr, [windowStart, windowEnd], `Current window length: ${currentLength}. Update minLength if smaller. minLength = ${minLength === Infinity ? "Infinity" : minLength}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength, targetSum }, foundIndicesFinal);
      
      windowSum -= arr[windowStart];
      addStep(localSteps, lm.subtractFromWindowSumInner, arr, [windowStart, windowEnd], `Shrink window: Subtract arr[${windowStart}] (${arr[windowStart]}) from sum. windowSum = ${windowSum}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength, targetSum }, foundIndicesFinal);
      windowStart++;
      addStep(localSteps, lm.incrementWindowStartInner, arr, [windowStart, windowEnd], `Increment windowStart to ${windowStart}. Window now [${start > windowEnd ? 'empty' : `${start}..${windowEnd}` }].`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength, targetSum }, foundIndicesFinal);
    }
  }
  const finalMinLength = minLength === Infinity ? 0 : minLength;
  addStep(localSteps, lm.returnMinLength, arr, bestSubarray, `Finished. Min length is ${finalMinLength}.`, { minLength: finalMinLength, targetSum }, foundIndicesFinal);
  addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.", {}, foundIndicesFinal);
  return localSteps;
}
