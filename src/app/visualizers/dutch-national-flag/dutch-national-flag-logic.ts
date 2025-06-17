
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
  // Ensure arr contains only 0, 1, 2. Filter out others or throw error.
  // For visualization, we assume valid input, or the component can pre-process.
  const arr = [...arrInput].filter(num => [0,1,2].includes(num));
  const n = arr.length;
  const lm = DUTCH_NATIONAL_FLAG_LINE_MAP;

  // sortedIndices will track finalized 0s and 2s regions
  let sortedZerosEnd = -1;
  let sortedTwosStart = n;

  const addStep = (
    line: number,
    active: number[] = [], // Current low, mid, high pointers
    swapping: number[] = [],
    message: string = "",
    currentArrState = [...arr]
  ) => {
    const currentSortedIndices: number[] = [];
    for(let k=0; k <= sortedZerosEnd; k++) currentSortedIndices.push(k);
    for(let k=sortedTwosStart; k < n; k++) currentSortedIndices.push(k);
    
    localSteps.push({
      array: currentArrState,
      activeIndices: active.filter(idx => idx >=0 && idx < n),
      swappingIndices: swapping,
      sortedIndices: currentSortedIndices.sort((a,b)=>a-b),
      currentLine: line,
      message,
      processingSubArrayRange: [sortedZerosEnd + 1, sortedTwosStart - 1], // The 'unknown' or '1s' region
      pivotActualIndex: null, // Not a typical pivot algorithm like QuickSort
    });
  };

  addStep(lm.functionDeclaration, [], [], "Start Dutch National Flag Sort (for 0s, 1s, 2s).");

  if (n === 0) {
    addStep(lm.returnArr, [], [], "Array is empty.");
    addStep(lm.functionEnd);
    return localSteps;
  }
  
  let low = 0, mid = 0, high = n - 1;
  addStep(lm.initLowMidHigh, [low, mid, high], [], `Initialize low=${low}, mid=${mid}, high=${high}.`);

  let iteration = 0; // Safety break for visualization
  while (mid <= high && iteration < n * 3) { // Max operations roughly 2*n swaps/pointer moves
    iteration++;
    addStep(lm.whileMidLEHigh, [low, mid, high], [], `mid (${mid}) <= high (${high}). Current element arr[${mid}]=${arr[mid]}.`);
    
    const currentMidVal = arr[mid];
    let swapped = false;

    if (currentMidVal === 0) {
      addStep(lm.switchCase0, [low, mid, high], [], `arr[${mid}] is 0.`);
      addStep(lm.swapLowMid, [low, mid], [low, mid], `Swap arr[${low}] (${arr[low]}) with arr[${mid}] (${arr[mid]}).`);
      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      swapped = true;
      addStep(lm.swapLowMid, [low, mid], [], `Swapped.`);
      
      sortedZerosEnd = low; // The element at 'low' is now a confirmed 0
      low++; mid++;
      addStep(lm.incrementLowMid, [low, mid, high], [], `Increment low to ${low}, mid to ${mid}.`);
      addStep(lm.breakCase0);
    } else if (currentMidVal === 1) {
      addStep(lm.switchCase1, [low, mid, high], [], `arr[${mid}] is 1.`);
      mid++;
      addStep(lm.incrementMid, [low, mid, high], [], `Increment mid to ${mid}.`);
      addStep(lm.breakCase1);
    } else { // currentMidVal === 2
      addStep(lm.switchCase2, [low, mid, high], [], `arr[${mid}] is 2.`);
      addStep(lm.swapMidHigh, [mid, high], [mid, high], `Swap arr[${mid}] (${arr[mid]}) with arr[${high}] (${arr[high]}).`);
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      swapped = true;
      addStep(lm.swapMidHigh, [mid, high], [], `Swapped.`);
      
      sortedTwosStart = high; // The element at 'high' is now a confirmed 2
      high--;
      addStep(lm.decrementHigh, [low, mid, high], [], `Decrement high to ${high}.`);
      addStep(lm.breakCase2);
    }
    addStep(lm.endSwitch, [low, mid, high], [], `End of switch for arr[${swapped ? (currentMidVal === 0 ? low-1 : mid) : mid-1}].`);
  }
  addStep(lm.whileLoopEnd, [low, mid, high], [], `Loop finished. mid=${mid}, high=${high}.`);
  
  // Final pass to mark all as sorted
  const finalSorted = Array.from({length: n}, (_,k)=>k);
  addStep(lm.returnArr, [], [], "Array is sorted.", finalSorted);
  addStep(lm.functionEnd, [], [], "", finalSorted);
  return localSteps;
};
