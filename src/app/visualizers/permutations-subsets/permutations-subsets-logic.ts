
import type { ArrayAlgorithmStep } from '@/types';

export type PermutationsSubsetsProblemType = 'permutations' | 'subsets';

// Conceptual line maps - these might need to be more detailed based on the exact code shown
export const PERMUTATIONS_LINE_MAP = {
  funcDeclare: 1,
  initResult: 2,
  backtrackFuncDeclare: 3,
  baseCasePermutation: 4,
  pushPermutation: 5,
  returnFromBaseCase: 6,
  loopElements: 7,
  addToCurrentPerm: 8,
  filterRemaining: 9,
  recursiveCall: 10,
  backtrackPop: 11,
  initialCall: 12,
  returnResult: 13,
};

export const SUBSETS_LINE_MAP = {
  funcDeclare: 1,
  initResult: 2,
  backtrackFuncDeclare: 3,
  pushCurrentSubset: 4,
  loopFromIndex: 5,
  includeElement: 6,
  recursiveCallSubset: 7,
  backtrackPopSubset: 8,
  initialCallSubset: 9,
  returnResultSubset: 10,
};


const addStep = (
  localSteps: ArrayAlgorithmStep[],
  line: number | null,
  currentCombination: (string | number)[],
  remainingElements: (string | number)[], // For permutations
  elementsBeingConsidered: (string | number)[], // For subsets (the rest of the input array)
  results: (string | number)[][],
  message: string,
  problemType: PermutationsSubsetsProblemType
) => {
  localSteps.push({
    array: [...currentCombination], // Current permutation/subset being built
    activeIndices: problemType === 'permutations' 
                    ? elementsBeingConsidered.map(el => currentCombination.indexOf(el)).filter(idx => idx !== -1) // Highlight elements in current permutation
                    : elementsBeingConsidered.map(el => currentCombination.indexOf(el)).filter(idx => idx !== -1), // Highlight elements in current subset
    swappingIndices: [],
    sortedIndices: [], // Could be used to mark a newly added result visually if needed
    currentLine: line,
    message,
    auxiliaryData: {
      results: results.map(r => [...r]),
      remaining: problemType === 'permutations' ? [...remainingElements] : undefined,
      nextToConsider: problemType === 'subsets' ? [...elementsBeingConsidered] : undefined,
    },
  });
};

// --- Permutations ---
export const generatePermutationsSteps = (elements: (string | number)[]): ArrayAlgorithmStep[] => {
  const localSteps: ArrayAlgorithmStep[] = [];
  const results: (string | number)[][] = [];
  const lm = PERMUTATIONS_LINE_MAP;

  addStep(localSteps, lm.funcDeclare, [], [...elements], [], [], "Start Permutations generation.", 'permutations');
  addStep(localSteps, lm.initResult, [], [...elements], [], results, "Initialize results list.", 'permutations');

  function backtrackPermute(currentPerm: (string|number)[], remaining: (string|number)[]) {
    addStep(localSteps, lm.backtrackFuncDeclare, [...currentPerm], [...remaining], [...currentPerm], results, `backtrack([${currentPerm.join(',')}], [${remaining.join(',')}])`, 'permutations');
    
    if (remaining.length === 0) {
      addStep(localSteps, lm.baseCasePermutation, [...currentPerm], [...remaining], [...currentPerm], results, `Base case: No elements remaining. Permutation found.`, 'permutations');
      results.push([...currentPerm]);
      addStep(localSteps, lm.pushPermutation, [...currentPerm], [...remaining], [...currentPerm], results, `Add [${currentPerm.join(',')}] to results. Results count: ${results.length}`, 'permutations');
      addStep(localSteps, lm.returnFromBaseCase, [...currentPerm], [...remaining], [...currentPerm], results, `Return from base case.`, 'permutations');
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      const nextElement = remaining[i];
      addStep(localSteps, lm.loopElements, [...currentPerm], [...remaining], [...currentPerm, nextElement], results, `Loop: Try element '${nextElement}' from remaining.`, 'permutations');
      
      currentPerm.push(nextElement);
      addStep(localSteps, lm.addToCurrentPerm, [...currentPerm], [...remaining], [...currentPerm], results, `Add '${nextElement}' to current permutation: [${currentPerm.join(',')}].`, 'permutations');
      
      const nextRemaining = remaining.filter((_, index) => index !== i);
      addStep(localSteps, lm.filterRemaining, [...currentPerm], [...nextRemaining], [...currentPerm], results, `New remaining: [${nextRemaining.join(',')}].`, 'permutations');
      
      addStep(localSteps, lm.recursiveCall, [...currentPerm], [...nextRemaining], [...currentPerm], results, `Recursive call with current: [${currentPerm.join(',')}] and remaining: [${nextRemaining.join(',')}].`, 'permutations');
      backtrackPermute(currentPerm, nextRemaining);
      
      currentPerm.pop();
      addStep(localSteps, lm.backtrackPop, [...currentPerm], [...remaining], [...currentPerm], results, `Backtrack: Remove last element. Current: [${currentPerm.join(',')}]. Remaining for this loop: [${remaining.join(',')}].`, 'permutations');
    }
  }
  
  addStep(localSteps, lm.initialCall, [], [...elements], [], results, `Initial call to backtrack([], [${elements.join(',')}])`, 'permutations');
  backtrackPermute([], elements);
  addStep(localSteps, lm.returnResult, [], [], [], results, `Permutations generation complete. Found ${results.length} permutations.`, 'permutations');
  return localSteps;
};


// --- Subsets (Powerser) ---
export const generateSubsetsSteps = (elements: (string | number)[]): ArrayAlgorithmStep[] => {
  const localSteps: ArrayAlgorithmStep[] = [];
  const results: (string | number)[][] = [];
  const lm = SUBSETS_LINE_MAP;

  addStep(localSteps, lm.funcDeclare, [], [], [...elements], results, "Start Subsets (Powerser) generation.", 'subsets');
  addStep(localSteps, lm.initResult, [], [], [...elements], results, "Initialize results list.", 'subsets');

  function backtrackSubsets(startIndex: number, currentSubset: (string|number)[]) {
    addStep(localSteps, lm.backtrackFuncDeclare, [...currentSubset], [], elements.slice(startIndex), results, `backtrack(index=${startIndex}, currentSubset=[${currentSubset.join(',')}])`, 'subsets');
    
    results.push([...currentSubset]);
    addStep(localSteps, lm.pushCurrentSubset, [...currentSubset], [], elements.slice(startIndex), results, `Add current subset [${currentSubset.join(',')}] to results. Results count: ${results.length}`, 'subsets');

    for (let i = startIndex; i < elements.length; i++) {
      addStep(localSteps, lm.loopFromIndex, [...currentSubset], [], elements.slice(i), results, `Loop: Consider element '${elements[i]}' at index ${i}.`, 'subsets');
      
      currentSubset.push(elements[i]);
      addStep(localSteps, lm.includeElement, [...currentSubset], [], elements.slice(i + 1), results, `Include '${elements[i]}'. Current subset: [${currentSubset.join(',')}].`, 'subsets');
      
      addStep(localSteps, lm.recursiveCallSubset, [...currentSubset], [], elements.slice(i + 1), results, `Recursive call with index=${i + 1}, subset=[${currentSubset.join(',')}].`, 'subsets');
      backtrackSubsets(i + 1, currentSubset);
      
      currentSubset.pop();
      addStep(localSteps, lm.backtrackPopSubset, [...currentSubset], [], elements.slice(i), results, `Backtrack: Remove last element. Current subset: [${currentSubset.join(',')}]. Next in loop is index ${i+1} (if any).`, 'subsets');
    }
  }
  
  addStep(localSteps, lm.initialCallSubset, [], [], [...elements], results, `Initial call to backtrack(0, [])`, 'subsets');
  backtrackSubsets(0, []);
  addStep(localSteps, lm.returnResultSubset, [], [], [], results, `Subset generation complete. Found ${results.length} subsets.`, 'subsets');
  return localSteps;
};
