
import type { BITAlgorithmStep, BITOperationType } from './types';

export const BIT_LINE_MAP: Record<string, Record<string, number>> = {
  structure: {
    classDef: 1, constructor: 2, initTree: 3, buildCall: 4, endConstructor: 5,
  },
  build: { // Conceptual lines for iterative build using updates
    funcStart: 6, loop: 7, callUpdate: 8, loopEnd: 9,
  },
  update: {
    funcStart: 10, loopStart: 11, addToTree: 12, updateIndex: 13, loopEnd: 14,
  },
  query: {
    funcStart: 15, initSum: 16, loopStart: 17, addToSum: 18, updateIndex: 19, loopEnd: 20, returnSum: 21,
  },
  queryRange: {
    funcStart: 22, checkRange: 23, calculateRangeSum: 24, returnRangeSum: 25,
  },
};

const addStep = (
  steps: BITAlgorithmStep[],
  line: number | null,
  bitArr: number[],
  origArr: number[] | undefined,
  opType: BITOperationType,
  message: string,
  currIdx?: number, // 0-based for original array, 1-based for BIT logic index
  currVal?: number, // Value from original array or delta
  activeBITIdxs?: number[], // 1-based indices in BIT array
  queryRes?: number,
  rangeVal?: {start: number, end: number},
  auxData?: Record<string, any>
) => {
  steps.push({
    bitArray: [...bitArr],
    originalArray: origArr ? [...origArr] : undefined,
    operation: opType,
    currentIndex: currIdx,
    currentValue: currVal,
    delta: opType === 'update' ? currVal : undefined,
    queryResult: queryRes,
    range: rangeVal,
    message,
    currentLine: line,
    activeBitIndices: activeBITIdxs,
    // Generic fields
    activeIndices: currIdx !== undefined && !isBitIndex(currIdx, opType) ? [currIdx] : [],
    swappingIndices: [],
    sortedIndices: [],
    auxiliaryData: auxData,
  });
};

// Helper to determine if an index refers to BIT or original array based on context
function isBitIndex(index: number, operation: BITOperationType): boolean {
    return operation === 'update' || operation === 'query';
}


// --- BIT Logic (1-based indexing for operations) ---
function updateBIT(bit: number[], size: number, index: number, delta: number, steps: BITAlgorithmStep[], origArr?: number[]) {
  const lm = BIT_LINE_MAP.update;
  addStep(steps, lm.funcStart, bit, origArr, 'update', `Update(index=${index}, delta=${delta})`, index, delta, [index]);
  let currentIdx = index; // Use 1-based index for BIT logic
  while (currentIdx <= size) {
    addStep(steps, lm.loopStart, bit, origArr, 'update', `Loop: index ${currentIdx} <= size ${size}.`, index, delta, [currentIdx]);
    bit[currentIdx] += delta;
    addStep(steps, lm.addToTree, bit, origArr, 'update', `tree[${currentIdx}] += ${delta}. New value: ${bit[currentIdx]}.`, index, delta, [currentIdx]);
    currentIdx += currentIdx & (-currentIdx); // Add LSB
    addStep(steps, lm.updateIndex, bit, origArr, 'update', `Update index to ${currentIdx} (index + LSB).`, index, delta, [currentIdx]);
  }
  addStep(steps, lm.loopEnd, bit, origArr, 'update', `Update loop finished.`, index, delta);
}

function queryBIT(bit: number[], index: number, steps: BITAlgorithmStep[], origArr?: number[]): number {
  const lm = BIT_LINE_MAP.query;
  addStep(steps, lm.funcStart, bit, origArr, 'query', `Query(index=${index}) - prefix sum up to ${index}.`, index, undefined, [index]);
  let sum = 0;
  addStep(steps, lm.initSum, bit, origArr, 'query', `Initialize sum = 0.`, index, undefined, [], undefined, undefined, {currentSum: sum});
  let currentIdx = index; // Use 1-based index for BIT logic
  while (currentIdx > 0) {
    addStep(steps, lm.loopStart, bit, origArr, 'query', `Loop: index ${currentIdx} > 0.`, index, undefined, [currentIdx], undefined, undefined, {currentSum: sum});
    sum += bit[currentIdx];
    addStep(steps, lm.addToSum, bit, origArr, 'query', `sum += tree[${currentIdx}] (${bit[currentIdx]}). New sum = ${sum}.`, index, undefined, [currentIdx], undefined, undefined, {currentSum: sum});
    currentIdx -= currentIdx & (-currentIdx); // Subtract LSB
    addStep(steps, lm.updateIndex, bit, origArr, 'query', `Update index to ${currentIdx} (index - LSB).`, index, undefined, [currentIdx], undefined, undefined, {currentSum: sum});
  }
  addStep(steps, lm.loopEnd, bit, origArr, 'query', `Query loop finished.`, index, undefined, [], undefined, undefined, {currentSum: sum});
  addStep(steps, lm.returnSum, bit, origArr, 'query', `Return sum = ${sum}.`, index, undefined, [], sum);
  return sum;
}

export const generateBITSteps = (
  currentBITState: { bitArray: number[], originalArraySize: number },
  operation: BITOperationType,
  inputArrayForBuild?: number[],
  opIndex?: number, // 0-based for original array, 1-based for BIT logical operations
  opValue?: number, // Delta for update
  opRangeEnd?: number // 0-based for original array
): BITAlgorithmStep[] => {
  const localSteps: BITAlgorithmStep[] = [];
  let { bitArray, originalArraySize } = currentBITState;
  bitArray = [...bitArray]; // Work on a copy
  const N = originalArraySize; // Conceptual size of original array

  addStep(localSteps, null, bitArray, inputArrayForBuild, operation, `Operation: ${operation}`);

  switch (operation) {
    case 'build':
      if (!inputArrayForBuild || inputArrayForBuild.length === 0) {
        addStep(localSteps, null, [], [], operation, "Build: Input array is empty. BIT remains empty/uninitialized.");
        return localSteps;
      }
      originalArraySize = inputArrayForBuild.length; // Update N based on input
      bitArray = new Array(originalArraySize + 1).fill(0);
      addStep(localSteps, BIT_LINE_MAP.structure.initTree, bitArray, inputArrayForBuild, operation, `Build: Initialized BIT of size ${originalArraySize + 1} with zeros.`);
      
      addStep(localSteps, BIT_LINE_MAP.build.funcStart, bitArray, inputArrayForBuild, operation, `Building BIT from array [${inputArrayForBuild.join(', ')}].`);
      for (let i = 0; i < originalArraySize; i++) {
        addStep(localSteps, BIT_LINE_MAP.build.loop, bitArray, inputArrayForBuild, operation, `Processing inputArr[${i}] = ${inputArrayForBuild[i]}. Call update(${i+1}, ${inputArrayForBuild[i]}).`, i, inputArrayForBuild[i]);
        updateBIT(bitArray, originalArraySize, i + 1, inputArrayForBuild[i], localSteps, inputArrayForBuild);
      }
      addStep(localSteps, BIT_LINE_MAP.build.loopEnd, bitArray, inputArrayForBuild, operation, "BIT build complete.");
      break;
    case 'update':
      if (opIndex === undefined || opValue === undefined || N === 0) {
        addStep(localSteps, null, bitArray, undefined, operation, "Update: Invalid parameters or BIT not built.");
        return localSteps;
      }
      // User provides 0-based index, convert to 1-based for BIT logic
      updateBIT(bitArray, N, opIndex + 1, opValue, localSteps, undefined);
      addStep(localSteps, null, bitArray, undefined, operation, `Update complete: index ${opIndex} (original) by ${opValue}.`);
      break;
    case 'query':
      if (opIndex === undefined || N === 0) {
        addStep(localSteps, null, bitArray, undefined, operation, "Query: Invalid index or BIT not built.");
        return localSteps;
      }
      const prefixSum = queryBIT(bitArray, opIndex + 1, localSteps, undefined); // User 0-based, logic 1-based
      addStep(localSteps, null, bitArray, undefined, operation, `Query complete: Prefix sum up to index ${opIndex} is ${prefixSum}.`, opIndex, undefined, [], prefixSum);
      break;
    case 'queryRange':
      if (opIndex === undefined || opRangeEnd === undefined || N === 0 || opIndex > opRangeEnd || opIndex < 0 || opRangeEnd >= N) {
        addStep(localSteps, null, bitArray, undefined, operation, "Query Range: Invalid range or BIT not built.");
        return localSteps;
      }
      const lmRange = BIT_LINE_MAP.queryRange;
      addStep(localSteps, lmRange.funcStart, bitArray, undefined, operation, `Querying range sum for [${opIndex}..${opRangeEnd}].`, undefined, undefined, [], undefined, {start: opIndex, end: opRangeEnd});
      
      const sumUpToRight = queryBIT(bitArray, opRangeEnd + 1, localSteps, undefined);
      addStep(localSteps, lmRange.calculateRangeSum, bitArray, undefined, operation, `  Calculated sum up to right bound (${opRangeEnd}): ${sumUpToRight}.`, undefined, undefined, [], sumUpToRight, {start: opIndex, end: opRangeEnd});
      
      const sumUpToLeftMinus1 = opIndex > 0 ? queryBIT(bitArray, opIndex, localSteps, undefined) : 0;
      if (opIndex > 0) {
        addStep(localSteps, lmRange.calculateRangeSum, bitArray, undefined, operation, `  Calculated sum up to left bound - 1 (${opIndex - 1}): ${sumUpToLeftMinus1}.`, undefined, undefined, [], sumUpToLeftMinus1, {start: opIndex, end: opRangeEnd});
      } else {
         addStep(localSteps, lmRange.calculateRangeSum, bitArray, undefined, operation, `  Left bound is 0, so sum up to left-1 is 0.`, undefined, undefined, [], sumUpToLeftMinus1, {start: opIndex, end: opRangeEnd});
      }
      
      const rangeSum = sumUpToRight - sumUpToLeftMinus1;
      addStep(localSteps, lmRange.returnRangeSum, bitArray, undefined, operation, `Range sum [${opIndex}..${opRangeEnd}] is ${rangeSum}.`, undefined, undefined, [], rangeSum, {start: opIndex, end: opRangeEnd});
      break;
  }
  return localSteps;
};

export const createInitialBIT = (size: number): { bitArray: number[], originalArraySize: number } => {
  return { bitArray: new Array(size + 1).fill(0), originalArraySize: size };
};


    
