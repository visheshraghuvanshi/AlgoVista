
import type { AlgorithmStep } from './types'; // Local import

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
  const arr = [...sortedArr]; 
  const n = arr.length;
  const lm = TWO_POINTERS_LINE_MAP;
  let pairFoundIndices: number[] = [];

  const addStep = (
    line: number,
    active: number[], 
    found: number[] = [], 
    message: string = "",
    currentArrState = [...arr],
    auxData?: Record<string, any>
  ) => {
    localSteps.push({
      array: currentArrState,
      activeIndices: active.filter(idx => idx >= 0 && idx < n),
      swappingIndices: [],
      sortedIndices: found.filter(idx => idx >= 0 && idx < n),
      currentLine: line,
      message,
      processingSubArrayRange: active.length === 2 ? [Math.min(active[0], active[1]), Math.max(active[0], active[1])] : (found.length === 2 ? [Math.min(found[0], found[1]), Math.max(found[0], found[1])] : null),
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

  let iteration = 0; 
  while (left < right && iteration < n * 2) {
    iteration++;
    addStep(lm.whileLoopStart, [left, right], [], `left (${left}) < right (${right}). Window: [arr[${left}]=${arr[left]}, arr[${right}]=${arr[right]}].`);
    
    const currentSum = arr[left] + arr[right];
    addStep(lm.calculateSum, [left, right], [], `Current Sum = arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${currentSum}.`, { currentSum, targetSum });
    
    addStep(lm.checkSumEqualsTarget, [left, right], [], `Is Current Sum (${currentSum}) === Target Sum (${targetSum})?`, { currentSum, targetSum });
    if (currentSum === targetSum) {
      pairFoundIndices = [left, right];
      addStep(lm.returnPair, [left, right], pairFoundIndices, `Yes. Pair found: (${arr[left]}, ${arr[right]}) at indices [${left}, ${right}].`, { currentSum, targetSum, result: `[${arr[left]}, ${arr[right]}]` });
      addStep(lm.functionEnd, [], pairFoundIndices, "Algorithm complete. Pair found.", {result: `[${arr[left]}, ${arr[right]}]`});
      return localSteps;
    }

    addStep(lm.checkSumLessThanTarget, [left, right], [], `Is Current Sum (${currentSum}) < Target Sum (${targetSum})?`, { currentSum, targetSum });
    if (currentSum < targetSum) {
      left++;
      addStep(lm.incrementLeft, [left, right], [], `Yes. Increment left pointer to ${left}.`, { currentSum, targetSum });
    } else {
      addStep(lm.elseBlock, [left, right], [], `No. Current Sum (${currentSum}) > Target Sum (${targetSum}). Decrement right pointer.`, { currentSum, targetSum });
      right--;
      addStep(lm.decrementRight, [left, right], [], `Decrement right pointer to ${right}.`, { currentSum, targetSum });
    }
  }
  addStep(lm.whileLoopEnd, [left, right], [], `Loop finished. left = ${left}, right = ${right}. Pointers crossed or met.`);
  addStep(lm.returnNotFound, [], [], `No pair found with sum ${targetSum}.`);
  addStep(lm.functionEnd, [], [], "Algorithm complete. No pair found.", {result: "Not Found"});
  return localSteps;
};
