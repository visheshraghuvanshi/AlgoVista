
import type { AlgorithmStep } from './types'; // Local import

export const TERNARY_SEARCH_LINE_MAP = {
  functionDeclaration: 1,
  initLeftRight: 2,
  whileLoopStart: 3,
  calculateMid1: 4,
  calculateMid2: 5,
  checkMid1EqualsTarget: 6,
  returnFoundMid1: 7,
  checkMid2EqualsTarget: 8,
  returnFoundMid2: 9,
  checkTargetLessMid1: 10,
  updateRightToMid1: 11,
  checkTargetGreaterMid2: 12,
  updateLeftToMid2: 13,
  elseBlockUpdateLeftRight: 14, 
  whileLoopEnd: 15,
  returnNotFound: 16,
  functionEnd: 17,
};

export const generateTernarySearchSteps = (sortedArrToSearch: number[], target: number): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  const arr = [...sortedArrToSearch].sort((a, b) => a - b); 
  const n = arr.length;
  const lm = TERNARY_SEARCH_LINE_MAP;

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
      activeIndices: active.filter(idx => idx >=0 && idx < n),
      swappingIndices: [],
      sortedIndices: found.filter(idx => idx >=0 && idx < n),
      currentLine: line,
      message,
      processingSubArrayRange: processingRange,
      pivotActualIndex: null,
    });
  };
  
  addStep(lm.functionDeclaration, [], [], null, "Start Ternary Search. Array automatically sorted.");

  if (n === 0) {
    addStep(lm.returnNotFound, [], [], null, "Array is empty, target not found.");
    addStep(lm.functionEnd);
    return localSteps;
  }

  let left = 0;
  let right = n - 1;
  addStep(lm.initLeftRight, [left, right], [], [left, right], `Initialize left=${left}, right=${right}`);

  let iteration = 0;
  while (left <= right && iteration < n + 5) { 
    iteration++;
    addStep(lm.whileLoopStart, [left, right], [], [left, right], `Searching in [${left}..${right}]. left=${left}, right=${right}`);
    
    if (left > right) { 
      addStep(lm.whileLoopStart, [], [], [left,right], `left (${left}) > right (${right}), loop terminates.`);
      break;
    }

    const mid1 = left + Math.floor((right - left) / 3);
    addStep(lm.calculateMid1, [left, mid1, right], [], [left, right], `Calculate mid1 = ${mid1}. arr[mid1]=${arr[mid1]}`);
    const mid2 = right - Math.floor((right - left) / 3);
    addStep(lm.calculateMid2, [left, mid1, mid2, right], [], [left, right], `Calculate mid2 = ${mid2}. arr[mid2]=${arr[mid2]}`);
    
    addStep(lm.checkMid1EqualsTarget, [mid1], [], [left, right], `Is arr[mid1] (${arr[mid1]}) === target (${target})?`);
    if (arr[mid1] === target) {
      addStep(lm.returnFoundMid1, [mid1], [mid1], [left, right], `Target ${target} found at index ${mid1}.`);
      addStep(lm.functionEnd, [], [mid1]);
      return localSteps;
    }
    
    addStep(lm.checkMid2EqualsTarget, [mid2], [], [left, right], `Is arr[mid2] (${arr[mid2]}) === target (${target})?`);
    if (arr[mid2] === target) {
      addStep(lm.returnFoundMid2, [mid2], [mid2], [left, right], `Target ${target} found at index ${mid2}.`);
      addStep(lm.functionEnd, [], [mid2]);
      return localSteps;
    }

    addStep(lm.checkTargetLessMid1, [mid1], [], [left, right], `Is target (${target}) < arr[mid1] (${arr[mid1]})?`);
    if (target < arr[mid1]) {
      right = mid1 - 1;
      addStep(lm.updateRightToMid1, [left, right], [], [left, right], `Yes. Update right to ${right}. Search in [${left}..${right}].`);
    } else {
      addStep(lm.checkTargetLessMid1, [mid1], [], [left,right], `No. Target not less than arr[mid1].`);
      addStep(lm.checkTargetGreaterMid2, [mid2], [], [left, right], `Is target (${target}) > arr[mid2] (${arr[mid2]})?`);
      if (target > arr[mid2]) {
        left = mid2 + 1;
        addStep(lm.updateLeftToMid2, [left, right], [], [left, right], `Yes. Update left to ${left}. Search in [${left}..${right}].`);
      } else {
        addStep(lm.checkTargetGreaterMid2, [mid2], [], [left,right], `No. Target not greater than arr[mid2].`);
        left = mid1 + 1;
        right = mid2 - 1;
        addStep(lm.elseBlockUpdateLeftRight, [left, right], [], [left, right], `Target is between arr[mid1] and arr[mid2]. Update left=${left}, right=${right}. Search in [${left}..${right}].`);
      }
    }
  }
  addStep(lm.whileLoopEnd, [left,right], [], [left, right], `Loop finished. left=${left}, right=${right}.`);
  addStep(lm.returnNotFound, [], [], null, `Target ${target} not found.`);
  addStep(lm.functionEnd);
  return localSteps;
};
