
import type { AlgorithmStep } from '@/types';

export type SlidingWindowProblemType = 'maxSumFixedK' | 'minLengthSumTarget';

export const SLIDING_WINDOW_LINE_MAPS: Record<SlidingWindowProblemType, Record<string, number>> = {
  maxSumFixedK: {
    funcDeclare: 1,
    paramCheck: 2,
    initMaxSum: 3,
    initWindowSum: 4,
    firstWindowLoop: 5,
    addToWindowSum: 6,
    setInitialMaxSum: 7,
    slideWindowLoop: 8,
    updateWindowSum: 9,
    updateMaxSum: 10,
    returnMaxSum: 11,
    funcEnd: 12,
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
    returnMinLength: 11,
    funcEnd: 12,
  },
};

const addStep = (
  localSteps: AlgorithmStep[],
  line: number | null,
  currentArr: number[],
  active: number[], // Can be window [start, end]
  message: string,
  auxData?: Record<string, any>
) => {
  localSteps.push({
    array: [...currentArr],
    activeIndices: active.filter(idx => idx >=0 && idx < currentArr.length), // Highlight window
    swappingIndices: [],
    sortedIndices: auxData?.foundSubarrayIndices || [], // Highlight found subarray
    currentLine: line,
    message,
    processingSubArrayRange: active.length === 2 ? [active[0], active[1]] : null,
    auxiliaryData: auxData,
  });
};

export function generateMaxSumFixedKSteps(arr: number[], k: number): AlgorithmStep[] {
  const localSteps: AlgorithmStep[] = [];
  const lm = SLIDING_WINDOW_LINE_MAPS.maxSumFixedK;
  const n = arr.length;

  addStep(localSteps, lm.funcDeclare, arr, [], `Finding max sum subarray of size ${k}.`);

  if (k <= 0 || k > n) {
    addStep(localSteps, lm.paramCheck, arr, [], "Invalid k value.", { maxSum: 0 });
    addStep(localSteps, lm.returnMaxSum, arr, [], "Return 0.", { maxSum: 0 });
    return localSteps;
  }

  let maxSum = -Infinity;
  addStep(localSteps, lm.initMaxSum, arr, [], "Initialize maxSum = -Infinity.", { currentWindowSum: 0, maxSum });
  let windowSum = 0;
  addStep(localSteps, lm.initWindowSum, arr, [], "Initialize windowSum = 0.", { currentWindowSum: windowSum, maxSum });

  addStep(localSteps, lm.firstWindowLoop, arr, [], `Calculating sum of first window (size ${k}).`);
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
    addStep(localSteps, lm.addToWindowSum, arr, Array.from({length: i + 1}, (_, j) => j), `Add arr[${i}] (${arr[i]}) to windowSum. windowSum = ${windowSum}.`, { currentWindowSum: windowSum, maxSum });
  }
  maxSum = windowSum;
  addStep(localSteps, lm.setInitialMaxSum, arr, Array.from({length: k}, (_, j) => j), `First window sum is ${windowSum}. Set maxSum = ${maxSum}.`, { currentWindowSum: windowSum, maxSum });

  addStep(localSteps, lm.slideWindowLoop, arr, [], "Sliding window through the rest of the array.");
  for (let i = k; i < n; i++) {
    windowSum += arr[i] - arr[i - k];
    addStep(localSteps, lm.updateWindowSum, arr, Array.from({length: k}, (_, j) => i - k + 1 + j), `Slide window: add arr[${i}] (${arr[i]}), remove arr[${i-k}] (${arr[i-k]}). windowSum = ${windowSum}.`, { currentWindowSum: windowSum, maxSum });
    
    if (windowSum > maxSum) {
        maxSum = windowSum;
    }
    addStep(localSteps, lm.updateMaxSum, arr, Array.from({length: k}, (_, j) => i - k + 1 + j), `Update maxSum if needed. Current maxSum = ${maxSum}.`, { currentWindowSum: windowSum, maxSum, foundSubarrayIndices: maxSum === windowSum ? Array.from({length:k}, (_,j) => i-k+1+j) : undefined });
  }
  addStep(localSteps, lm.returnMaxSum, arr, [], `Finished. Max sum is ${maxSum}.`, { maxSum });
  addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.");
  return localSteps;
}

export function generateMinLengthSumTargetSteps(arr: number[], targetSum: number): AlgorithmStep[] {
  const localSteps: AlgorithmStep[] = [];
  const lm = SLIDING_WINDOW_LINE_MAPS.minLengthSumTarget;
  const n = arr.length;
  
  addStep(localSteps, lm.funcDeclare, arr, [], `Finding min length subarray with sum >= ${targetSum}.`);
  
  let minLength = Infinity;
  addStep(localSteps, lm.initMinLength, arr, [], "Initialize minLength = Infinity.", { currentWindowSum: 0, minLength: "Infinity" });
  let windowSum = 0;
  addStep(localSteps, lm.initWindowSum, arr, [], "Initialize windowSum = 0.", { currentWindowSum: windowSum, minLength: "Infinity" });
  let windowStart = 0;
  addStep(localSteps, lm.initWindowStart, arr, [], `Initialize windowStart = 0.`, { windowStart, currentWindowSum: windowSum, minLength: "Infinity" });

  let bestSubarray: [number, number] | null = null;

  for (let windowEnd = 0; windowEnd < n; windowEnd++) {
    addStep(localSteps, lm.outerLoopEnd, arr, [windowStart, windowEnd], `Expand window: windowEnd = ${windowEnd}. Processing arr[${windowEnd}] (${arr[windowEnd]}).`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength });
    windowSum += arr[windowEnd];
    addStep(localSteps, lm.addToWindowSumOuter, arr, [windowStart, windowEnd], `Add arr[${windowEnd}] to windowSum. windowSum = ${windowSum}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength });

    while (windowSum >= targetSum) {
      addStep(localSteps, lm.innerLoopWhileSumGeTarget, arr, [windowStart, windowEnd], `windowSum (${windowSum}) >= targetSum (${targetSum}). Shrink window.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength });
      const currentLength = windowEnd - windowStart + 1;
      if (currentLength < minLength) {
          minLength = currentLength;
          bestSubarray = [windowStart, windowEnd];
      }
      addStep(localSteps, lm.updateMinLength, arr, [windowStart, windowEnd], `Update minLength if currentLength (${currentLength}) is smaller. minLength = ${minLength === Infinity ? "Infinity" : minLength}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength, foundSubarrayIndices: bestSubarray ? Array.from({length: bestSubarray[1]-bestSubarray[0]+1}, (_,j)=>bestSubarray![0]+j) : [] });
      
      windowSum -= arr[windowStart];
      addStep(localSteps, lm.subtractFromWindowSumInner, arr, [windowStart, windowEnd], `Subtract arr[${windowStart}] (${arr[windowStart]}) from windowSum. windowSum = ${windowSum}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength });
      windowStart++;
      addStep(localSteps, lm.incrementWindowStartInner, arr, [windowStart, windowEnd], `Increment windowStart to ${windowStart}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength });
    }
  }
  const finalMinLength = minLength === Infinity ? 0 : minLength;
  addStep(localSteps, lm.returnMinLength, arr, bestSubarray ? Array.from({length: bestSubarray[1]-bestSubarray[0]+1}, (_,j)=>bestSubarray![0]+j) : [], `Finished. Min length is ${finalMinLength}.`, { minLength: finalMinLength, foundSubarrayIndices: bestSubarray ? Array.from({length: bestSubarray[1]-bestSubarray[0]+1}, (_,j)=>bestSubarray![0]+j) : [] });
  addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.");
  return localSteps;
}

    