
import type { AlgorithmStep } from './types'; // Local import

export const JUMP_SEARCH_LINE_MAP = {
  functionDeclaration: 1,
  getN: 2,
  handleEmptyArray: 3,
  calculateBlockSize: 4,
  initPrev: 5,
  initStepVar: 6, // let step = blockSize; (conceptual, actual block end)
  
  jumpingLoopCondition: 7, // while (sortedArr[Math.min(step, n) - 1] < target)
  jumpingBlockCheck: 8,    // The comparison inside the while
  updatePrevToStep: 9,     // prev = step;
  updateStepByBlockSize: 10,// step += blockSize;
  checkPrevOutOfBounds: 11, // if (prev >= n) return -1;
  
  linearSearchLoopCondition: 12, // while (sortedArr[prev] < target)
  linearSearchElementCheck: 13, // The comparison inside the while
  incrementPrevLinear: 14,      // prev++;
  checkPrevEqualsStepOrN: 15,  // if (prev == Math.min(step, n)) return -1;
  
  finalCheckIfFound: 16,        // if (sortedArr[prev] == target)
  returnFound: 17,
  returnNotFound: 18,
  functionEnd: 19,
};

export const generateJumpSearchSteps = (sortedArrToSearch: number[], target: number): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  // Jump search requires a sorted array.
  const arr = [...sortedArrToSearch].sort((a, b) => a - b); 
  const n = arr.length;
  const lm = JUMP_SEARCH_LINE_MAP;

  let finalFoundIndex = -1;
  let finalSearchRange: [number, number] | null = null;

  const addStep = (
    line: number,
    active: number[] = [],
    found: number[] = [], // For the target index if found
    processingRange: [number, number] | null = null, // [start, end] of current block or search space
    message: string = "",
    currentArrState = [...arr]
  ) => {
    localSteps.push({
      array: currentArrState,
      activeIndices: active.filter(idx => idx >=0 && idx < n),
      swappingIndices: [], // Not used
      sortedIndices: found.filter(idx => idx >=0 && idx < n), // Used for found item
      currentLine: line,
      message,
      processingSubArrayRange: processingRange,
      pivotActualIndex: null,
    });
  };

  addStep(lm.functionDeclaration, [], [], null, "Start Jump Search. Array automatically sorted.");
  addStep(lm.getN, [], [], null, `n = ${n}.`);
  if (n === 0) {
    addStep(lm.handleEmptyArray, [], [], null, "Array is empty. Target not found.");
    finalSearchRange = null; // No range for empty array
    addStep(lm.returnNotFound, [], [], finalSearchRange, "Target not found.");
    addStep(lm.functionEnd, [], (finalFoundIndex !== -1 ? [finalFoundIndex] : []), finalSearchRange, "Algorithm finished.");
    return localSteps;
  }

  let blockSize = Math.floor(Math.sqrt(n));
  addStep(lm.calculateBlockSize, [], [], null, `Block size (jump step) = floor(sqrt(${n})) = ${blockSize}`);

  let prev = 0;
  addStep(lm.initPrev, [prev], [], null, `Initialize prev = ${prev}`);
  
  let step = blockSize;
  let currentBlockEndVisual = Math.min(step, n) -1;
  finalSearchRange = [prev, currentBlockEndVisual];
  addStep(lm.initStepVar, [currentBlockEndVisual], [], finalSearchRange, `Initial block to check ends at index ~${currentBlockEndVisual}.`);
  
  // Phase 1: Jumping to find the block
  let iteration = 0;
  while (iteration < n + 5) { // Safety break
    iteration++;
    const blockEndIndex = Math.min(step, n) - 1;
    
    if (blockEndIndex < 0) { 
        addStep(lm.returnNotFound, [], [], null, "Block end index invalid. Target likely not found.");
        finalSearchRange = null;
        addStep(lm.functionEnd, [], (finalFoundIndex !== -1 ? [finalFoundIndex] : []), finalSearchRange, "Algorithm finished.");
        return localSteps;
    }
    finalSearchRange = [prev, blockEndIndex];
    addStep(lm.jumpingLoopCondition, [blockEndIndex], [], finalSearchRange, `Checking block ending at index ${blockEndIndex}.`);
    addStep(lm.jumpingBlockCheck, [blockEndIndex], [], finalSearchRange, `Is arr[${blockEndIndex}] (${arr[blockEndIndex]}) < target (${target})?`);
    
    if (arr[blockEndIndex] < target) {
      prev = step;
      addStep(lm.updatePrevToStep, [prev > 0 ? prev-1 : prev], [], finalSearchRange, `Yes. Update prev to ${prev}.`); // Highlight prev for context
      step += blockSize;
      currentBlockEndVisual = Math.min(step, n) -1;
      addStep(lm.updateStepByBlockSize, [currentBlockEndVisual < 0 ? 0 : currentBlockEndVisual], [], [prev, currentBlockEndVisual], `Jump to next block. New block ends at index ~${currentBlockEndVisual}.`);

      addStep(lm.checkPrevOutOfBounds, [prev > 0 ? prev-1 : prev], [], [prev, currentBlockEndVisual], `Is prev (${prev}) >= n (${n})?`);
      if (prev >= n) {
        addStep(lm.returnNotFound, [], [], [n-1, n-1], "Target not found (jumped past array end).");
        finalSearchRange = [n-1,n-1];
        addStep(lm.functionEnd, [], (finalFoundIndex !== -1 ? [finalFoundIndex] : []), finalSearchRange, "Algorithm finished.");
        return localSteps;
      }
    } else {
      addStep(lm.jumpingBlockCheck, [blockEndIndex], [], finalSearchRange, `No. Target may be in block [${prev}..${blockEndIndex}].`);
      break; 
    }
  }
  const linearSearchStart = prev;
  const linearSearchEnd = Math.min(step, n) - 1; // This could be blockEndIndex from previous loop
  finalSearchRange = [linearSearchStart, linearSearchEnd];


  addStep(lm.linearSearchLoopCondition, [linearSearchStart], [], finalSearchRange, `Starting linear search in block [${linearSearchStart}..${linearSearchEnd}]`);
  
  iteration = 0; 
  while (iteration < n + 5) {
    iteration++;
     if (prev > linearSearchEnd || prev >= n) { // prev is the current linear search index
        addStep(lm.returnNotFound, [], [], finalSearchRange, `Linear search exhausted block [${linearSearchStart}..${linearSearchEnd}]. Target not found.`);
        addStep(lm.functionEnd, [], (finalFoundIndex !== -1 ? [finalFoundIndex] : []), finalSearchRange, "Algorithm finished.");
        return localSteps;
    }

    addStep(lm.linearSearchLoopCondition, [prev], [], finalSearchRange, `Checking arr[${prev}]...`);
    addStep(lm.linearSearchElementCheck, [prev], [], finalSearchRange, `Is arr[${prev}] (${arr[prev]}) < target (${target})?`);

    if (arr[prev] < target) {
      prev++;
      addStep(lm.incrementPrevLinear, [prev], [], finalSearchRange, `Yes. Increment prev to ${prev}.`);
      
      addStep(lm.checkPrevEqualsStepOrN, [prev], [], finalSearchRange, `Is prev (${prev}) now at end of current block search limit (${Math.min(step, n)})?`);
      if (prev === Math.min(step, n)) { 
        addStep(lm.returnNotFound, [], [], finalSearchRange, `Target not found (linear search reached end of block [${linearSearchStart}..${linearSearchEnd}]).`);
        addStep(lm.functionEnd, [], (finalFoundIndex !== -1 ? [finalFoundIndex] : []), finalSearchRange, "Algorithm finished.");
        return localSteps;
      }
    } else {
      addStep(lm.linearSearchElementCheck, [prev], [], finalSearchRange, `No. arr[${prev}] is not less than target.`);
      break;
    }
  }

  addStep(lm.finalCheckIfFound, [prev], [], finalSearchRange, `Final check: Is arr[${prev}] (${prev < n ? arr[prev] : 'out of bounds'}) === target (${target})?`);
  if (prev < n && arr[prev] === target) {
    finalFoundIndex = prev;
    finalSearchRange = [prev, prev]; // Highlight only the found item
    addStep(lm.returnFound, [prev], [prev], finalSearchRange, `Target ${target} found at index ${prev}.`);
  } else {
    addStep(lm.returnNotFound, [], [], finalSearchRange, `Target ${target} not found.`);
  }
  addStep(lm.functionEnd, [], (finalFoundIndex !== -1 ? [finalFoundIndex] : []), finalSearchRange, "Algorithm finished.");
  return localSteps;
};


    