
import type { AlgorithmStep } from './types'; // Local import

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
  activeWindow: [number, number] | null, // [start, end] inclusive
  message: string,
  auxData?: Record<string, any>,
  foundSubarrayIndices?: number[] // Highlight the overall best subarray found
) => {
  localSteps.push({
    array: [...currentArr],
    activeIndices: activeWindow ? [activeWindow[0], activeWindow[1]] : [],
    swappingIndices: [],
    sortedIndices: foundSubarray || [], 
    currentLine: line,
    message,
    processingSubArrayRange: activeWindow,
    pivotActualIndex: null,
    auxiliaryData: auxData,
  });
};

export function generateMaxSumFixedKSteps(arr: number[], k: number): AlgorithmStep[] {
  const localSteps: AlgorithmStep[] = [];
  const lm = SLIDING_WINDOW_LINE_MAPS.maxSumFixedK;
  const n = arr.length;

  addStep(localSteps, lm.funcDeclare, arr, null, `Finding max sum subarray of size ${k}.`);

  if (k <= 0 || k > n) {
    addStep(localSteps, lm.paramCheck, arr, null, "Invalid k value. Must be 0 < k <= array length.", { maxSum: 0 });
    addStep(localSteps, lm.returnMaxSum, arr, null, "Return 0.", { maxSum: 0 });
    return localSteps;
  }

  let maxSum = -Infinity;
  addStep(localSteps, lm.initMaxSum, arr, null, "Initialize maxSum = -Infinity.", { currentWindowSum: 0, maxSum: "-Infinity" });
  let windowSum = 0;
  addStep(localSteps, lm.initWindowSum, arr, null, "Initialize windowSum = 0.", { currentWindowSum: windowSum, maxSum: "-Infinity" });
  
  let bestWindow: [number, number] | null = null;

  addStep(localSteps, lm.firstWindowLoop, arr, null, `Calculating sum of first window (indices 0 to ${k-1}).`);
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
    addStep(localSteps, lm.addToWindowSum, arr, [0, i], `Add arr[${i}] (${arr[i]}) to windowSum. windowSum = ${windowSum}.`, { currentWindowSum: windowSum, maxSum: "-Infinity" });
  }
  maxSum = windowSum;
  bestWindow = [0, k-1];
  addStep(localSteps, lm.setInitialMaxSum, arr, [0, k-1], `First window sum is ${windowSum}. Set maxSum = ${maxSum}. Current best window: [0, ${k-1}]`, { currentWindowSum: windowSum, maxSum, foundSubarrayIndices: bestWindow ? Array.from({length: bestWindow[1]-bestWindow[0]+1}, (_,j)=>bestWindow![0]+j) : [] });

  addStep(localSteps, lm.slideWindowLoop, arr, [0,k-1], "Sliding window through the rest of the array.");
  for (let i = k; i < n; i++) {
    // Current window is arr[i-k+1 ... i]
    const currentWindowStart = i - k + 1;
    const currentWindowEnd = i;
    
    windowSum += arr[i] - arr[i - k];
    addStep(localSteps, lm.updateWindowSum, arr, [currentWindowStart, currentWindowEnd], `Slide window: Add arr[${i}] (${arr[i]}), remove arr[${i-k}] (${arr[i-k]}). windowSum = ${windowSum}.`, { currentWindowSum: windowSum, maxSum, window_start: currentWindowStart, window_end: currentWindowEnd });
    
    addStep(localSteps, lm.updateMaxSum, arr, [currentWindowStart, currentWindowEnd], `Is new windowSum (${windowSum}) > maxSum (${maxSum})?`, { currentWindowSum: windowSum, maxSum, window_start: currentWindowStart, window_end: currentWindowEnd });
    if (windowSum > maxSum) {
        maxSum = windowSum;
        bestWindow = [currentWindowStart, currentWindowEnd];
        addStep(localSteps, lm.updateMaxSum, arr, [currentWindowStart, currentWindowEnd], `Yes. Update maxSum = ${maxSum}. Best window: [${currentWindowStart}, ${currentWindowEnd}]`, { currentWindowSum: windowSum, maxSum, window_start: currentWindowStart, window_end: currentWindowEnd, foundSubarrayIndices: bestWindow ? Array.from({length: bestWindow[1]-bestWindow[0]+1}, (_,j)=>bestWindow![0]+j) : [] });
    } else {
        addStep(localSteps, lm.updateMaxSum, arr, [currentWindowStart, currentWindowEnd], `No. maxSum remains ${maxSum}.`, { currentWindowSum: windowSum, maxSum, window_start: currentWindowStart, window_end: currentWindowEnd, foundSubarrayIndices: bestWindow ? Array.from({length: bestWindow[1]-bestWindow[0]+1}, (_,j)=>bestWindow![0]+j) : [] });
    }
  }
  addStep(localSteps, lm.returnMaxSum, arr, bestWindow ? [bestWindow[0], bestWindow[1]] : null, `Finished. Max sum is ${maxSum}.`, { maxSum, foundSubarrayIndices: bestWindow ? Array.from({length: bestWindow[1]-bestWindow[0]+1}, (_,j)=>bestWindow![0]+j) : [] });
  addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.");
  return localSteps;
}

export function generateMinLengthSumTargetSteps(arr: number[], targetSum: number): AlgorithmStep[] {
  const localSteps: AlgorithmStep[] = [];
  const lm = SLIDING_WINDOW_LINE_MAPS.minLengthSumTarget;
  const n = arr.length;
  
  addStep(localSteps, lm.funcDeclare, arr, null, `Finding min length subarray with sum >= ${targetSum}.`);
  
  let minLength = Infinity;
  addStep(localSteps, lm.initMinLength, arr, null, "Initialize minLength = Infinity.", { currentWindowSum: 0, minLength: "Infinity", windowStart: 0 });
  let windowSum = 0;
  addStep(localSteps, lm.initWindowSum, arr, null, "Initialize windowSum = 0.", { currentWindowSum: windowSum, minLength: "Infinity", windowStart: 0 });
  let windowStart = 0;
  addStep(localSteps, lm.initWindowStart, arr, null, `Initialize windowStart = 0.`, { windowStart, currentWindowSum: windowSum, minLength: "Infinity" });

  let bestSubarray: [number, number] | null = null;

  for (let windowEnd = 0; windowEnd < n; windowEnd++) {
    addStep(localSteps, lm.outerLoopEnd, arr, [windowStart, windowEnd], `Expand window: windowEnd = ${windowEnd}. Add arr[${windowEnd}] (${arr[windowEnd]}).`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength });
    windowSum += arr[windowEnd];
    addStep(localSteps, lm.addToWindowSumOuter, arr, [windowStart, windowEnd], `arr[${windowEnd}] added. windowSum = ${windowSum}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength });

    while (windowSum >= targetSum) {
      addStep(localSteps, lm.innerLoopWhileSumGeTarget, arr, [windowStart, windowEnd], `windowSum (${windowSum}) >= targetSum (${targetSum}). Valid window found.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength });
      const currentLength = windowEnd - windowStart + 1;
      if (currentLength < minLength) {
          minLength = currentLength;
          bestSubarray = [windowStart, windowEnd];
      }
      addStep(localSteps, lm.updateMinLength, arr, [windowStart, windowEnd], `Current window length: ${currentLength}. Update minLength if smaller. minLength = ${minLength === Infinity ? "Infinity" : minLength}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength, foundSubarrayIndices: bestSubarray ? Array.from({length: bestSubarray[1]-bestSubarray[0]+1}, (_,j)=>bestSubarray![0]+j) : [] });
      
      windowSum -= arr[windowStart];
      addStep(localSteps, lm.subtractFromWindowSumInner, arr, [windowStart, windowEnd], `Shrink window: Subtract arr[${windowStart}] (${arr[windowStart]}) from windowSum. windowSum = ${windowSum}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength });
      windowStart++;
      addStep(localSteps, lm.incrementWindowStartInner, arr, [windowStart, windowEnd], `Increment windowStart to ${windowStart}.`, { windowStart, windowEnd, currentWindowSum: windowSum, minLength: minLength === Infinity ? "Infinity" : minLength });
    }
  }
  const finalMinLength = minLength === Infinity ? 0 : minLength;
  addStep(localSteps, lm.returnMinLength, arr, bestSubarray ? [bestSubarray[0], bestSubarray[1]] : null, `Finished. Min length is ${finalMinLength}.`, { minLength: finalMinLength, foundSubarrayIndices: bestSubarray ? Array.from({length: bestSubarray[1]-bestSubarray[0]+1}, (_,j)=>bestSubarray![0]+j) : [] });
  addStep(localSteps, lm.funcEnd, arr, [], "Algorithm complete.");
  return localSteps;
}

