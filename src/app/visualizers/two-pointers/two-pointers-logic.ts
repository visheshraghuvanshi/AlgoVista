
import type { AlgorithmStep } from '@/types';

export const TWO_POINTERS_LINE_MAP = {
  functionDeclaration: 1,
  initPointers: 2,
  whileLoopStart: 3,
  calculateSum: 4,
  checkSumEqualsTarget: 5,
  returnPair: 6,
  checkSumLessThanTarget: 7,
  incrementLeft: 8,
  elseBlock: 9, // sum > target
  decrementRight: 10,
  whileLoopEnd: 11,
  returnNotFound: 12,
  functionEnd: 13,
};

export const generateTwoPointersPairSumSteps = (sortedArr: number[], targetSum: number): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  // Ensure array is sorted (as it's a prerequisite for this two-pointer approach)
  const arr = [...sortedArr].sort((a, b) => a - b);
  const n = arr.length;
  const lm = TWO_POINTERS_LINE_MAP;

  const addStep = (
    line: number,
    active: number[], // [leftPointer, rightPointer]
    found: number[] = [], // [leftIndex, rightIndex] if pair is found
    message: string = "",
    currentArrState = [...arr],
    auxData?: Record<string, any>
  ) => {
    localSteps.push({
      array: currentArrState,
      activeIndices: active.filter(idx => idx >= 0 && idx < n),
      swappingIndices: [],
      sortedIndices: found.filter(idx => idx >= 0 && idx < n), // Use sortedIndices to highlight found pair
      currentLine: line,
      message,
      processingSubArrayRange: active.length === 2 ? [active[0], active[1]] : null,
      pivotActualIndex: null,
      auxiliaryData: auxData
    });
  };

  addStep(lm.functionDeclaration, [], [], `Finding pair with sum ${targetSum} in sorted array.`);
  
  if (n < 2) {
    addStep(lm.returnNotFound, [], [], "Array has less than 2 elements. No pair possible.");
    addStep(lm.functionEnd, [], [], "Algorithm complete.");
    return localSteps;
  }

  let left = 0;
  let right = n - 1;
  addStep(lm.initPointers, [left, right], [], `Initialize left = ${left}, right = ${right}.`);

  let iteration = 0; // Safety break for visualization
  while (left < right && iteration < n * 2) {
    iteration++;
    addStep(lm.whileLoopStart, [left, right], [], `left (${left}) < right (${right}). Current window: [${arr[left]}, ${arr[right]}].`);
    
    const currentSum = arr[left] + arr[right];
    addStep(lm.calculateSum, [left, right], [], `Calculate sum: arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${currentSum}.`, { currentSum });
    
    addStep(lm.checkSumEqualsTarget, [left, right], [], `Is currentSum (${currentSum}) === targetSum (${targetSum})?`, { currentSum });
    if (currentSum === targetSum) {
      addStep(lm.returnPair, [left, right], [left, right], `Yes. Pair found: (${arr[left]}, ${arr[right]}) at indices [${left}, ${right}].`, { currentSum, result: `[${arr[left]}, ${arr[right]}]` });
      addStep(lm.functionEnd, [], [left, right], "Algorithm complete.");
      return localSteps;
    }

    addStep(lm.checkSumLessThanTarget, [left, right], [], `Is currentSum (${currentSum}) < targetSum (${targetSum})?`, { currentSum });
    if (currentSum < targetSum) {
      left++;
      addStep(lm.incrementLeft, [left, right], [], `Yes. Increment left to ${left}.`, { currentSum });
    } else {
      addStep(lm.elseBlock, [left, right], [], `No. currentSum (${currentSum}) > targetSum (${targetSum}). Decrement right.`, { currentSum });
      right--;
      addStep(lm.decrementRight, [left, right], [], `Decrement right to ${right}.`, { currentSum });
    }
  }
  addStep(lm.whileLoopEnd, [left, right], [], `Loop finished. left = ${left}, right = ${right}.`);
  addStep(lm.returnNotFound, [], [], `No pair found with sum ${targetSum}.`);
  addStep(lm.functionEnd, [], [], "Algorithm complete.");
  return localSteps;
};
