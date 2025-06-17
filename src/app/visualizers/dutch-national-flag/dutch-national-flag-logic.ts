
import type { AlgorithmStep } from '@/types';

export const DUTCH_NATIONAL_FLAG_LINE_MAP = {
  functionDeclaration: 1,
  initLowMidHigh: 2,
  whileMidLEHigh: 3,
  switchCase0: 4, // case 0:
  swapLowMid: 5,
  incrementLowMid: 6,
  breakCase0: 7,
  switchCase1: 8, // case 1:
  incrementMid: 9,
  breakCase1: 10,
  switchCase2: 11, // case 2:
  swapMidHigh: 12,
  decrementHigh: 13,
  breakCase2: 14,
  endSwitch: 15, // Conceptual end of switch
  whileLoopEnd: 16,
  returnArr: 17,
  functionEnd: 18,
};

export const generateDutchNationalFlagSteps = (arrInput: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  // Ensure arr contains only 0, 1, 2. Filter out others.
  // This function assumes valid input (0,1,2) as filtering is done in page.tsx
  const arr = [...arrInput];
  const n = arr.length;
  const lm = DUTCH_NATIONAL_FLAG_LINE_MAP;

  let sortedZerosEnd = -1;
  let sortedTwosStart = n;

  const addStep = (
    line: number,
    activePtrs: {low: number, mid: number, high: number} | null = null,
    swapping: number[] = [],
    message: string = "",
    currentArrState = [...arr]
  ) => {
    const currentSortedIndices: number[] = [];
    for(let k=0; k <= sortedZerosEnd; k++) currentSortedIndices.push(k);
    for(let k=sortedTwosStart; k < n; k++) currentSortedIndices.push(k);
    
    // Active indices for visualization are the pointers l, m, h
    const activeDisplayIndices = activePtrs ? [activePtrs.low, activePtrs.mid, activePtrs.high].filter(idx => idx >=0 && idx < n) : [];

    localSteps.push({
      array: currentArrState,
      activeIndices: activeDisplayIndices,
      swappingIndices: swapping,
      sortedIndices: currentSortedIndices.sort((a,b)=>a-b),
      currentLine: line,
      message,
      // Show the 'unknown' region between low and high (exclusive of low, inclusive of high for processing)
      processingSubArrayRange: activePtrs ? [activePtrs.low, activePtrs.high] : null, 
      pivotActualIndex: null, 
    });
  };

  addStep(lm.functionDeclaration, null, [], "Start Dutch National Flag Sort (for 0s, 1s, 2s).");

  if (n === 0) {
    addStep(lm.returnArr, null, [], "Array is empty.");
    addStep(lm.functionEnd);
    return localSteps;
  }
  
  let low = 0, mid = 0, high = n - 1;
  addStep(lm.initLowMidHigh, {low,mid,high}, [], `Initialize low=${low}, mid=${mid}, high=${high}.`);

  let iteration = 0; 
  while (mid <= high && iteration < n * 3 + 5) { 
    iteration++;
    addStep(lm.whileMidLEHigh, {low,mid,high}, [], `mid (${mid}) <= high (${high}). Current element arr[${mid}]=${arr[mid]}.`);
    
    const currentMidVal = arr[mid];

    if (currentMidVal === 0) {
      addStep(lm.switchCase0, {low,mid,high}, [low,mid], `arr[${mid}] is 0. Swap arr[${low}] (${arr[low]}) with arr[${mid}] (${arr[mid]}).`);
      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      addStep(lm.swapLowMid, {low,mid,high}, [low,mid], `Swapped.`);
      
      sortedZerosEnd = low; 
      low++; mid++;
      addStep(lm.incrementLowMid, {low,mid,high}, [], `Increment low to ${low}, mid to ${mid}.`);
      addStep(lm.breakCase0, {low,mid,high});
    } else if (currentMidVal === 1) {
      addStep(lm.switchCase1, {low,mid,high}, [mid], `arr[${mid}] is 1. No swap needed.`);
      mid++;
      addStep(lm.incrementMid, {low,mid,high}, [mid-1], `Increment mid to ${mid}.`);
      addStep(lm.breakCase1, {low,mid,high});
    } else { // currentMidVal === 2
      addStep(lm.switchCase2, {low,mid,high}, [mid,high], `arr[${mid}] is 2. Swap arr[${mid}] (${arr[mid]}) with arr[${high}] (${arr[high]}).`);
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      addStep(lm.swapMidHigh, {low,mid,high}, [mid,high], `Swapped.`);
      
      sortedTwosStart = high; 
      high--;
      addStep(lm.decrementHigh, {low,mid,high}, [], `Decrement high to ${high}.`);
      addStep(lm.breakCase2, {low,mid,high});
    }
    addStep(lm.endSwitch, {low,mid,high}, [], `End of decisions for arr[${mid-1 >= low ? mid-1 : low}].`);
  }
  addStep(lm.whileLoopEnd, {low,mid,high}, [], `Loop finished. mid=${mid}, high=${high}.`);
  
  // Final pass to mark all as sorted
  const finalSorted = Array.from({length: n}, (_,k)=>k);
  addStep(lm.returnArr, null, [], "Array is sorted.", finalSorted);
  addStep(lm.functionEnd, null, [], "", finalSorted);
  return localSteps;
};

