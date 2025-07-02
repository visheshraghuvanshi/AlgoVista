
import type { AlgorithmStep, SegmentTreeOperation } from './types';

export const BIT_LINE_MAP: Record<SegmentTreeOperation, Record<string, number>> = {
  build: {
    constructorCall: 1, // Conceptual start of whole process
    assignN: 2,
    initTreeArray: 3,
    callBuild: 4,
    buildFuncStart: 5,
    buildLeafLoop: 6,
    buildSetLeaf: 7,
    buildInternalLoop: 8,
    buildSetInternal: 9,
    buildFuncEnd: 10,
    classEndBuild: 11, // Conceptual end
  },
  query: { // Range sum query [left, right] inclusive
    funcStart: 1,
    queryCall1: 2, // query(right)
    queryCall2: 3, // query(left - 1)
    returnResult: 4,
    // Below are for prefixSum helper
    prefixSumFuncStart: 5,
    prefixSumInit: 6,
    prefixSumLoop: 7,
    prefixSumAdd: 8,
    prefixSumUpdateIndex: 9,
    prefixSumReturn: 10,
  },
  update: {
    funcStart: 1,
    getTreePos: 2,
    loopToRoot: 3,
    addToBit: 4,
    moveToParent: 5,
    funcEnd: 6,
  },
  queryRange: { // Not a primary operation, but maps to query
    funcStart: 1,
    returnResult: 2,
  }
};


const addStep = (
  localSteps: AlgorithmStep[],
  line: number | null,
  currentTreeState: number[],
  inputArray: number[],
  message: string,
  activeIdx: number[] = [],
  auxData?: Partial<AlgorithmStep['auxiliaryData']>
) => {
  localSteps.push({
    array: [...currentTreeState],
    activeIndices: active,
    swappingIndices: [],
    sortedIndices: [],
    currentLine: line,
    message,
    processingSubArrayRange: auxData?.processingSubArrayRange || null,
    auxiliaryData: {
      operation: auxData?.operation,
      inputArray: inputArray,
      queryLeft: auxData?.queryLeft,
      queryRight: auxData?.queryRight,
      updateIndex: auxData?.updateIndex,
      updateValue: auxData?.updateValue,
      bitIndex: auxData?.bitIndex,
      binaryString: auxData?.binaryString,
      lsb: auxData?.lsb,
      currentSum: auxData?.currentSum,
      finalResult: auxData?.finalResult
    }
  });
};

export const generateBITSteps = (
    operation: SegmentTreeOperation,
    inputArray: number[],
    currentTree: number[],
    originalN: number,
    queryL?: number, queryR?: number,
    updateIdx?: number, updateVal?: number
): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  let tree = [...currentTree];

  const prefixSum = (index: number, descriptiveOp: 'query(right)' | 'query(left-1)'): number => {
    addStep(localSteps, BIT_LINE_MAP.query.prefixSumFuncStart, tree, inputArray, `Helper call: ${descriptiveOp}`, [], {operation:'query'});
    let sum = 0;
    addStep(localSteps, BIT_LINE_MAP.query.prefixSumInit, tree, inputArray, `Initialize sum = 0`, [], {operation:'query', currentSum: sum});
    let bitIndex = index + 1; // Convert to 1-based
    while (bitIndex > 0) {
      const lsb = bitIndex & -bitIndex;
      const binaryStr = bitIndex.toString(2).padStart(8, '0');
      addStep(localSteps, BIT_LINE_MAP.query.prefixSumLoop, tree, inputArray, `Loop: Current index=${bitIndex}, sum=${sum}`, [bitIndex], {operation:'query', bitIndex, binaryString: binaryStr, lsb, currentSum: sum});
      sum += tree[bitIndex];
      addStep(localSteps, BIT_LINE_MAP.query.prefixSumAdd, tree, inputArray, `Add tree[${bitIndex}] (${tree[bitIndex]}) to sum. New sum=${sum}`, [bitIndex], {operation:'query', bitIndex, binaryString: binaryStr, lsb, currentSum: sum});
      bitIndex -= lsb;
      addStep(localSteps, BIT_LINE_MAP.query.prefixSumUpdateIndex, tree, inputArray, `Update index: ${bitIndex + lsb} - ${lsb} = ${bitIndex}`, [bitIndex], {operation:'query', bitIndex, binaryString: bitIndex.toString(2).padStart(8, '0'), lsb: bitIndex & -bitIndex, currentSum: sum});
    }
    addStep(localSteps, BIT_LINE_MAP.query.prefixSumReturn, tree, inputArray, `Loop ends. Return sum ${sum}`, [], {operation:'query', currentSum: sum});
    return sum;
  }
  
  if (operation === 'build') {
    const n = inputArray.length;
    tree = new Array(n + 1).fill(0);
    addStep(localSteps, BIT_LINE_MAP.build.initTreeArray, tree, inputArray, `Build: Initialized BIT array of size ${n + 1}.`, [], {operation});
    for (let i = 0; i < n; i++) {
        // Here, we simulate the logic of `update` without duplicating all its steps for brevity in build
        let bitIndex = i + 1;
        while (bitIndex <= n) {
            tree[bitIndex] += inputArray[i];
            bitIndex += bitIndex & -bitIndex;
        }
    }
     addStep(localSteps, BIT_LINE_MAP.build.buildFuncEnd, tree, inputArray, `Build complete.`, [], {operation, finalTree: [...tree]});
  } else if (operation === 'update') {
    if (updateIdx === undefined || updateVal === undefined) return localSteps;
    const originalValue = originalN ? currentTree[updateIdx+1] - (updateIdx > 0 ? currentTree[updateIdx] : 0) : 0;
    const delta = updateVal - originalValue;
    addStep(localSteps, BIT_LINE_MAP.update.funcStart, tree, inputArray, `Updating index ${updateIdx} to ${updateVal} (delta=${delta}).`, [updateIdx], {operation, updateIndex: updateIdx, updateValue: updateVal});
    let bitIndex = updateIdx + 1;
    addStep(localSteps, BIT_LINE_MAP.update.getTreePos, tree, inputArray, `Start update at 1-based index ${bitIndex}.`, [bitIndex], {operation, updateIndex: updateIdx, updateValue: updateVal});
    while (bitIndex <= originalN) {
        const lsb = bitIndex & -bitIndex;
        const binaryStr = bitIndex.toString(2).padStart(8, '0');
        addStep(localSteps, BIT_LINE_MAP.update.loopToRoot, tree, inputArray, `Loop: Current index=${bitIndex}.`, [bitIndex], {operation, updateIndex: updateIdx, updateValue: updateVal, bitIndex, binaryString: binaryStr, lsb});
        tree[bitIndex] += delta;
        addStep(localSteps, BIT_LINE_MAP.update.addToBit, tree, inputArray, `Add delta (${delta}) to tree[${bitIndex}]. New value=${tree[bitIndex]}.`, [bitIndex], {operation, updateIndex: updateIdx, updateValue: updateVal, bitIndex, binaryString: binaryStr, lsb});
        bitIndex += lsb;
        addStep(localSteps, BIT_LINE_MAP.update.moveToParent, tree, inputArray, `Move to next index: ${bitIndex - lsb} + ${lsb} = ${bitIndex}.`, [bitIndex], {operation, updateIndex: updateIdx, updateValue: updateVal, bitIndex});
    }
    addStep(localSteps, BIT_LINE_MAP.update.funcEnd, tree, inputArray, "Update complete.", [], {operation, updateIndex: updateIdx, updateValue: updateVal});
  } else if (operation === 'queryRange') {
    if (queryL === undefined || queryR === undefined) return localSteps;
    addStep(localSteps, BIT_LINE_MAP.query.funcStart, tree, inputArray, `Querying sum for range [${queryL}, ${queryR}].`, [], {operation, queryLeft: queryL, queryRight: queryR, processingSubArrayRange: [queryL, queryR]});
    const sumR = prefixSum(queryR, 'query(right)');
    const sumLMinus1 = prefixSum(queryL - 1, 'query(left-1)');
    const result = sumR - sumLMinus1;
    addStep(localSteps, BIT_LINE_MAP.query.returnResult, tree, inputArray, `Range sum = query(${queryR}) - query(${queryL-1}) = ${sumR} - ${sumLMinus1} = ${result}.`, [], {operation, finalResult: result, processingSubArrayRange: [queryL, queryR]});
  }
  return localSteps;
}

export const createInitialBIT = (size: number): number[] => {
  return new Array(size + 1).fill(0);
};
