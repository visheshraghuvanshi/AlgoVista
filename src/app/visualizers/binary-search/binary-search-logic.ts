
import type { ArrayAlgorithmStep } from './types'; // Local import

export const BINARY_SEARCH_LINE_MAP = {
  functionDeclaration: 1,
  initLowHigh: 2,
  whileLoopStart: 3,
  calculateMid: 4,
  checkMidEqualsTarget: 5,
  returnFoundMid: 6,
  checkTargetGreater: 7, 
  updateLow: 8,
  elseBlock: 9, 
  updateHigh: 10,
  whileLoopEnd: 12, 
  returnNotFound: 13,
  functionEnd: 14,
  arraySortComment: 15, 
};

export const generateBinarySearchSteps = (sortedArrToSearch: number[], target: number): ArrayAlgorithmStep[] => {
  const localSteps: ArrayAlgorithmStep[] = [];
  const arr = [...sortedArrToSearch]; // Assume arr is already sorted from page component
  const n = arr.length;
  const lm = BINARY_SEARCH_LINE_MAP;

  const addStep = (
    line: number,
    active: number[] = [], 
    found: number[] = [],  
    processingRange: [number, number] | null = null,
    message: string = "",
    currentArrState = [...arr]
  ) => {
    localSteps.push({
      array: currentArrState,
      activeIndices: [...active].filter(idx => idx >=0 && idx < n), 
      swappingIndices: [], 
      sortedIndices: [...found], 
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
    addStep(lm.whileLoopStart, [low, high], [], [low, high], `Searching in [${low}..${high}]. low=${low}, high=${high}`);
    const mid = Math.floor(low + (high - low) / 2);
    addStep(lm.calculateMid, [low, mid, high], [], [low, high], `Calculate mid = ${mid}. arr[mid]=${arr[mid]}`);
    
    addStep(lm.checkMidEqualsTarget, [low, mid, high], [], [low, high], `Is arr[mid] (${arr[mid]}) === target (${target})?`);
    if (arr[mid] === target) {
      addStep(lm.returnFoundMid, [mid], [mid], [low, high], `Target ${target} found at index ${mid}.`);
      addStep(lm.functionEnd, [], [mid]); 
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
  addStep(lm.functionEnd); 
  return localSteps;
};
