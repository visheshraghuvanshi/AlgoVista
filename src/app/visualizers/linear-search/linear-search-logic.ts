
import type { ArrayAlgorithmStep } from './types'; // Local import

export const LINEAR_SEARCH_LINE_MAP = {
  functionDeclaration: 1,
  loopStart: 2,
  checkElement: 3,
  returnFound: 4,
  loopEnd: 5,
  returnNotFound: 6,
  functionEnd: 7,
};

export const generateLinearSearchSteps = (arrToSearch: number[], target: number): ArrayAlgorithmStep[] => {
  const localSteps: ArrayAlgorithmStep[] = [];
  if (!arrToSearch) return localSteps;
  const arr = [...arrToSearch];
  const n = arr.length;
  const lm = LINEAR_SEARCH_LINE_MAP;

  const addStep = (
    line: number,
    active: number[] = [],
    found: number[] = [],
    message: string = "",
    currentArrState = [...arr]
  ) => {
    localSteps.push({
      array: currentArrState,
      activeIndices: [...active],
      swappingIndices: [], 
      sortedIndices: [...found], 
      currentLine: line,
      message,
      processingSubArrayRange: null,
      pivotActualIndex: null,
    });
  };

  addStep(lm.functionDeclaration, [], [], "Start Linear Search");
  if (n === 0) {
    addStep(lm.returnNotFound, [], [], "Array is empty, target not found.");
    addStep(lm.functionEnd);
    return localSteps;
  }

  for (let i = 0; i < n; i++) {
    addStep(lm.loopStart, [i], [], `Checking element at index ${i}`);
    addStep(lm.checkElement, [i], [], `Is arr[${i}] (${arr[i]}) === target (${target})?`);
    if (arr[i] === target) {
      addStep(lm.returnFound, [i], [i], `Target ${target} found at index ${i}.`);
      addStep(lm.functionEnd, [], [i]);
      return localSteps;
    }
  }
  addStep(lm.loopEnd, [], [], `Looped through all elements.`);
  addStep(lm.returnNotFound, [], [], `Target ${target} not found in the array.`);
  addStep(lm.functionEnd);
  return localSteps;
};
