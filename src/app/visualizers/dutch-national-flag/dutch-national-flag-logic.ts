
import type { AlgorithmStep } from './types'; // Local import

export const DUTCH_NATIONAL_FLAG_LINE_MAP = {
  functionDeclaration: 1,
  initLowMidHigh: 2,
  whileMidLEHigh: 3,
  switchCase0: 4, // case 0:
  swapLowMid: 5,
  incrementLowMid: 6,
  breakCase0: 7, // Not an actual line, but end of case 0 block for highlighting
  switchCase1: 8, // case 1:
  incrementMid: 9,
  breakCase1: 10, // End of case 1 block
  switchCase2: 11, // case 2:
  swapMidHigh: 12,
  decrementHigh: 13,
  breakCase2: 14, // End of case 2 block
  endSwitch: 15, // Conceptual end of switch/if-else block
  whileLoopEnd: 16,
  returnArr: 17,
  functionEnd: 18,
};

export const generateDutchNationalFlagSteps = (arrInput: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  const arr = [...arrInput];
  const n = arr.length;
  const lm = DUTCH_NATIONAL_FLAG_LINE_MAP;

  const addStep = (
    line: number,
    currentArrState: number[],
    lowPtr: number,
    midPtr: number,
    highPtr: number,
    swapping: number[] = [],
    message: string = ""
  ) => {
    // Determine sorted sections for visualization
    // 0s are from 0 to low-1
    // 1s are from low to mid-1
    // 2s are from high+1 to n-1
    const sortedIndices: number[] = [];
    for (let i = 0; i < lowPtr; i++) sortedIndices.push(i);
    // Elements from low to mid-1 are considered "processed 1s" but might not be "fully sorted" if mid is still moving
    // for (let i = lowPtr; i < midPtr; i++) sortedIndices.push(i); // Optional: color 1s section
    for (let i = highPtr + 1; i < n; i++) sortedIndices.push(i);

    localSteps.push({
      array: [...currentArrState],
      activeIndices: [lowPtr, midPtr, highPtr].filter(ptr => ptr >= 0 && ptr < n),
      swappingIndices: swapping,
      sortedIndices: sortedIndices.sort((a,b) => a - b),
      currentLine: line,
      message,
      processingSubArrayRange: [lowPtr, highPtr], // The unknown region
      auxiliaryData: {
        low: lowPtr,
        mid: midPtr,
        high: highPtr,
        currentPointers: { low: lowPtr, mid: midPtr, high: highPtr }
      }
    });
  };

  addStep(lm.functionDeclaration, arr, 0, 0, n -1, "Start Dutch National Flag Sort.");

  if (n === 0) {
    addStep(lm.returnArr, arr, 0, 0, -1, "Array is empty.");
    addStep(lm.functionEnd, arr, 0, 0, -1);
    return localSteps;
  }
  
  let low = 0, mid = 0, high = n - 1;
  addStep(lm.initLowMidHigh, arr, low, mid, high, [], `Initialize: low=${low}, mid=${mid}, high=${high}.`);

  let iteration = 0; 
  while (mid <= high && iteration < n * 3 + 5) { 
    iteration++; // Safety break
    addStep(lm.whileMidLEHigh, arr, low, mid, high, [mid], `Loop: mid (${mid}) <= high (${high}). Current arr[mid]=${arr[mid]}.`);
    
    const currentMidVal = arr[mid];

    if (currentMidVal === 0) {
      addStep(lm.switchCase0, arr, low, mid, high, [low, mid], `arr[mid] is 0.`);
      addStep(lm.swapLowMid, arr, low, mid, high, [low, mid], `Swap arr[low] (${arr[low]}) with arr[mid] (${arr[mid]}).`);
      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      addStep(lm.swapLowMid, arr, low, mid, high, [low, mid], `Swapped. Array: [${arr.join(', ')}].`);
      low++; mid++;
      addStep(lm.incrementLowMid, arr, low, mid, high, [], `Increment low to ${low}, mid to ${mid}.`);
    } else if (currentMidVal === 1) {
      addStep(lm.switchCase1, arr, low, mid, high, [mid], `arr[mid] is 1. No swap needed.`);
      mid++;
      addStep(lm.incrementMid, arr, low, mid, high, [mid-1], `Increment mid to ${mid}.`);
    } else { // currentMidVal === 2
      addStep(lm.switchCase2, arr, low, mid, high, [mid, high], `arr[mid] is 2.`);
      addStep(lm.swapMidHigh, arr, low, mid, high, [mid, high], `Swap arr[mid] (${arr[mid]}) with arr[high] (${arr[high]}).`);
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      addStep(lm.swapMidHigh, arr, low, mid, high, [mid, high], `Swapped. Array: [${arr.join(', ')}].`);
      high--;
      addStep(lm.decrementHigh, arr, low, mid, high, [], `Decrement high to ${high}. Mid stays, element at mid will be re-evaluated.`);
    }
    addStep(lm.endSwitch, arr, low, mid, high, [], `End of decisions for element previously at mid.`);
  }
  addStep(lm.whileLoopEnd, arr, low, mid, high, [], `Loop finished. mid=${mid}, high=${high}.`);
  
  // Final step to mark all as sorted
  const finalSortedIndices = Array.from({length: n}, (_, k) => k);
  addStep(lm.returnArr, arr, low, mid, high, [], "Array is sorted.");
  addStep(lm.functionEnd, arr, low, mid, high, []);
  return localSteps;
};
