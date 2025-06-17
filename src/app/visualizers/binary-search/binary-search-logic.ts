
import type { AlgorithmStep } from '@/types';

export const BINARY_SEARCH_LINE_MAP = {
  functionDeclaration: 1,
  initLowHigh: 2,
  whileLoopStart: 3,
  calculateMid: 4,
  checkMidEqualsTarget: 5,
  returnFoundMid: 6,
  checkTargetGreater: 7, // This corresponds to the "else if (sortedArr[mid] < target)"
  updateLow: 8,
  elseBlock: 9, // This corresponds to the "else" part
  updateHigh: 10,
  // Line 11 is the closing brace for the inner "else"
  whileLoopEnd: 12, // This is the closing brace for the while loop
  returnNotFound: 13,
  functionEnd: 14,
  arraySortComment: 15, // "Note: Input array must be sorted."
};

export const generateBinarySearchSteps = (sortedArrToSearch: number[], target: number): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  // Assume arr is already sorted. The page component should handle sorting.
  const arr = [...sortedArrToSearch];
  const n = arr.length;
  const lm = BINARY_SEARCH_LINE_MAP;

  const addStep = (
    line: number,
    active: number[] = [], // Typically [low, mid, high] or relevant indices
    found: number[] = [],  // [foundIndex] if target is found
    processingRange: [number, number] | null = null,
    message: string = "",
    currentArrState = [...arr]
  ) => {
    localSteps.push({
      array: currentArrState,
      activeIndices: [...active].filter(idx => idx >=0 && idx < n), // Ensure valid indices
      swappingIndices: [], // Not used
      sortedIndices: [...found], // Repurposed for found item
      currentLine: line,
      message,
      processingSubArrayRange: processingRange,
      pivotActualIndex: null,
    });
  };
  
  addStep(lm.functionDeclaration, [], [], null, "Start Binary Search");

  if (n === 0) {
    addStep(lm.returnNotFound, [], [], null, "Array is empty, target not found.");
    addStep(lm.functionEnd);
    return localSteps;
  }

  let low = 0;
  let high = n - 1;
  addStep(lm.initLowHigh, [low, high], [], [low, high], `Initialize low=${low}, high=${high}`);

  let iteration = 0; // Safety break
  while (low <= high && iteration < n + 5) {
    iteration++;
    addStep(lm.whileLoopStart, [low, high], [], [low, high], `Searching. low=${low}, high=${high}`);
    const mid = Math.floor(low + (high - low) / 2);
    addStep(lm.calculateMid, [low, mid, high], [], [low, high], `Calculate mid = ${mid}. arr[mid]=${arr[mid]}`);
    
    addStep(lm.checkMidEqualsTarget, [low, mid, high], [], [low, high], `Is arr[mid] (${arr[mid]}) === target (${target})?`);
    if (arr[mid] === target) {
      addStep(lm.returnFoundMid, [mid], [mid], [low, high], `Target ${target} found at index ${mid}.`);
      addStep(lm.functionEnd, [], [mid]); // Use functionEnd, not arraySortComment here
      return localSteps;
    }

    addStep(lm.checkTargetGreater, [low, mid, high], [], [low, high], `Is arr[mid] (${arr[mid]}) < target (${target})?`);
    if (arr[mid] < target) {
      low = mid + 1;
      addStep(lm.updateLow, [low, mid, high], [], [low, high], `Yes. Update low to ${low}.`);
    } else {
      addStep(lm.elseBlock, [low,mid,high], [], [low,high], `No. arr[mid] > target.`);
      high = mid - 1;
      addStep(lm.updateHigh, [low, mid, high], [], [low, high], `Update high to ${high}.`);
    }
  }
  addStep(lm.whileLoopEnd, [low,high], [], [low, high], `Loop finished. low (${low}) > high (${high}).`);
  addStep(lm.returnNotFound, [], [], null, `Target ${target} not found.`);
  addStep(lm.functionEnd); // Use functionEnd, not arraySortComment here
  return localSteps;
};

