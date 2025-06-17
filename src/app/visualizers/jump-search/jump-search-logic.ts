
import type { AlgorithmStep } from '@/types';

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
      activeIndices: active.filter(idx => idx >= 0 && idx < n),
      swappingIndices: [], // Not used
      sortedIndices: found.filter(idx => idx >= 0 && idx < n), // Used for found item
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
    addStep(lm.returnNotFound);
    addStep(lm.functionEnd);
    return localSteps;
  }

  let blockSize = Math.floor(Math.sqrt(n));
  addStep(lm.calculateBlockSize, [], [], null, `Block size (jump step) = floor(sqrt(${n})) = ${blockSize}`);

  let prev = 0;
  addStep(lm.initPrev, [prev], [], null, `Initialize prev = ${prev}`);
  
  // 'step' in the JS code is the end of the current block being jumped to.
  let step = blockSize;
  addStep(lm.initStepVar, [Math.min(step, n) - 1], [], [prev, Math.min(step, n) - 1], `Initial block to check ends at index ~${Math.min(step,n)-1}.`);
  
  // Phase 1: Jumping to find the block
  let iteration = 0;
  while (iteration < n + 5) { // Safety break
    iteration++;
    const blockEndIndex = Math.min(step, n) - 1;
    if (blockEndIndex < prev && prev < n) { // step might not have advanced if block size is 0 or 1
       // This means target is likely in current small block or not found
       addStep(lm.jumpingLoopCondition, [prev], [], [prev, prev], `Block end index ${blockEndIndex} is not advancing. Checking current 'prev'.`);
       break;
    }
     if (blockEndIndex < 0) { // Should only happen if n=0, handled above, or blockSize=0
        addStep(lm.returnNotFound, [], [], null, "Block end index invalid. Target likely not found.");
        addStep(lm.functionEnd);
        return localSteps;
    }


    addStep(lm.jumpingLoopCondition, [blockEndIndex], [], [prev, blockEndIndex], `Checking block ending at index ${blockEndIndex}.`);
    addStep(lm.jumpingBlockCheck, [blockEndIndex], [], [prev, blockEndIndex], `Is arr[${blockEndIndex}] (${arr[blockEndIndex]}) < target (${target})?`);
    
    if (arr[blockEndIndex] < target) {
      prev = step;
      addStep(lm.updatePrevToStep, [prev], [], null, `Yes. Update prev = ${prev}.`);
      step += blockSize;
      addStep(lm.updateStepByBlockSize, [Math.min(step, n) -1], [], [prev, Math.min(step, n) -1], `Jump to next block. New block ends at index ~${Math.min(step,n)-1}.`);

      addStep(lm.checkPrevOutOfBounds, [prev], [], null, `Is prev (${prev}) >= n (${n})?`);
      if (prev >= n) {
        addStep(lm.returnNotFound, [], [], null, "Target not found (jumped past array end).");
        addStep(lm.functionEnd);
        return localSteps;
      }
    } else {
      addStep(lm.jumpingBlockCheck, [blockEndIndex], [], [prev, blockEndIndex], `No. Target may be in block [${prev}..${blockEndIndex}].`);
      break; 
    }
  }
  const linearSearchStart = prev;
  const linearSearchEnd = Math.min(step, n) - 1;

  // Phase 2: Linear search in the identified block
  addStep(lm.linearSearchLoopCondition, [linearSearchStart], [], [linearSearchStart, linearSearchEnd], `Starting linear search in block [${linearSearchStart}..${linearSearchEnd}]`);
  
  iteration = 0; // Reset safety counter
  while (iteration < n + 5) {
    iteration++;
     if (prev > linearSearchEnd || prev >= n) {
        addStep(lm.returnNotFound, [], [], [linearSearchStart, linearSearchEnd], `Linear search exhausted block. Target not found.`);
        addStep(lm.functionEnd);
        return localSteps;
    }

    addStep(lm.linearSearchLoopCondition, [prev], [], [linearSearchStart, linearSearchEnd], `Checking arr[${prev}]...`);
    addStep(lm.linearSearchElementCheck, [prev], [], [linearSearchStart, linearSearchEnd], `Is arr[${prev}] (${arr[prev]}) < target (${target})?`);

    if (arr[prev] < target) {
      prev++;
      addStep(lm.incrementPrevLinear, [prev], [], [linearSearchStart, linearSearchEnd], `Yes. Increment prev to ${prev}.`);
      
      addStep(lm.checkPrevEqualsStepOrN, [prev], [], [linearSearchStart, linearSearchEnd], `Is prev (${prev}) now at end of current block search limit (${Math.min(step, n)})?`);
      if (prev === Math.min(step, n)) { // prev has reached the start of the next block or end of array
        addStep(lm.returnNotFound, [], [], [linearSearchStart, linearSearchEnd], `Target not found (linear search reached end of block).`);
        addStep(lm.functionEnd);
        return localSteps;
      }
    } else {
      addStep(lm.linearSearchElementCheck, [prev], [], [linearSearchStart, linearSearchEnd], `No. arr[${prev}] is not less than target.`);
      break;
    }
  }

  // Final check
  addStep(lm.finalCheckIfFound, [prev], [], [linearSearchStart, linearSearchEnd], `Final check: Is arr[${prev}] (${prev < n ? arr[prev] : 'out of bounds'}) === target (${target})?`);
  if (prev < n && arr[prev] === target) {
    addStep(lm.returnFound, [prev], [prev], null, `Target ${target} found at index ${prev}.`);
  } else {
    addStep(lm.returnNotFound, [], [], null, `Target ${target} not found.`);
  }
  addStep(lm.functionEnd);
  return localSteps;
};

