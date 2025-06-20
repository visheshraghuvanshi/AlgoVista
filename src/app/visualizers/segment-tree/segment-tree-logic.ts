
import type { AlgorithmStep, SegmentTreeOperation } from './types'; // Local import

// Line numbers for an iterative array-based segment tree
export const SEGMENT_TREE_LINE_MAP: Record<SegmentTreeOperation, Record<string, number>> = {
  build: {
    funcStart: 1,      // constructor(inputArray) or build(inputArray)
    assignN: 2,        // this.n = inputArray.length;
    initTreeArray: 3,  // this.tree = new Array(2 * this.n);
    copyLeavesLoop: 4, // for (let i = 0; i < n; i++)
    setLeafNode: 5,    //   this.tree[n + i] = inputArray[i];
    buildInternalLoop: 6, // for (let i = n - 1; i > 0; --i)
    setInternalNode: 7,//   this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1]; (sum example)
    funcEnd: 8,
  },
  query: { // Range sum query [L, R)
    funcStart: 1,
    initResult: 2,     // let result = 0; (or identity for other ops)
    adjustLRToTree: 3, // l += n; r += n;
    loopLR: 4,         // for (; l < r; l >>=1, r >>=1)
    checkLeftOdd: 5,   // if (l % 2 === 1)
    addLeftToResult: 6,//   result += tree[l++];
    checkRightOdd: 7,  // if (r % 2 === 1)
    addRightToResult: 8,//   result += tree[--r];
    returnResult: 9,
    funcEnd: 10,
  },
  update: { // Point update
    funcStart: 1,
    getTreePos: 2,     // let pos = index + n;
    updateLeaf: 3,     // tree[pos] = value;
    loopToRoot: 4,     // while (pos > 1)
    moveToParent: 5,   // pos = Math.floor(pos / 2);
    updateParentNode: 6,// tree[pos] = tree[pos * 2] + tree[pos * 2 + 1];
    funcEnd: 7,
  },
};

function addStep(
  localSteps: AlgorithmStep[],
  line: number | null,
  currentTreeState: number[],
  message: string = "",
  active: number[] = [], 
  auxData?: Partial<AlgorithmStep['auxiliaryData']> 
) {
  localSteps.push({
    array: [...currentTreeState], // Represents the segment tree array
    activeIndices: active.filter(idx => idx >= 0 && idx < currentTreeState.length),
    swappingIndices: [],
    sortedIndices: [], 
    currentLine: line,
    message,
    processingSubArrayRange: auxData?.processingSubArrayRange || null,
    pivotActualIndex: null,
    auxiliaryData: { 
        operation: auxData?.operation,
        inputArray: auxData?.inputArray,
        queryLeft: auxData?.queryLeft,
        queryRight: auxData?.queryRight,
        queryResult: auxData?.queryResult,
        updateIndex: auxData?.updateIndex,
        updateValue: auxData?.updateValue,
        currentL: auxData?.currentL,
        currentR: auxData?.currentR,
        currentQueryResult: auxData?.currentQueryResult,
        ...(auxData || {}), 
    },
  });
}

export const generateSegmentTreeSteps = (
    operation: SegmentTreeOperation,
    inputArray: number[], 
    currentTree: number[], 
    originalN: number, 
    queryL?: number, queryR?: number, 
    updateIdx?: number, updateVal?: number   
): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  let tree: number[];
  const n = originalN; 

  if (operation === 'build') {
    if (inputArray.length === 0) {
      addStep(localSteps, null, [], "Input array is empty for build operation.", [], {operation, inputArray: []});
      return localSteps;
    }
    const N_build = inputArray.length; 
    tree = new Array(2 * N_build).fill(0);
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.build.funcStart, tree, "Building Segment Tree (Sum).", [], {operation, inputArray});
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.build.assignN, tree, `Original array size n = ${N_build}. Tree array size 2*n = ${2*N_build}.`, [], {operation, inputArray});
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.build.initTreeArray, tree, `Tree array initialized.`, [], {operation, inputArray});

    addStep(localSteps, SEGMENT_TREE_LINE_MAP.build.copyLeavesLoop, tree, "Copying input to leaf nodes.", [], {operation, inputArray});
    for (let i = 0; i < N_build; i++) {
      tree[N_build + i] = inputArray[i];
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.build.setLeafNode, tree, `Leaf: tree[${N_build + i}] = inputArray[${i}] (${inputArray[i]})`, [N_build + i], {operation, inputArray});
    }
     addStep(localSteps, SEGMENT_TREE_LINE_MAP.build.copyLeavesLoop, tree, "Finished copying leaves.", [], {operation, inputArray});

    addStep(localSteps, SEGMENT_TREE_LINE_MAP.build.buildInternalLoop, tree, "Building internal nodes (parents).", [], {operation, inputArray});
    for (let i = N_build - 1; i > 0; --i) {
      tree[i] = tree[i * 2] + tree[i * 2 + 1]; 
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.build.setInternalNode, tree, 
        `Internal: tree[${i}] = tree[${i*2}] (${tree[i*2]}) + tree[${i*2+1}] (${tree[i*2+1]}) = ${tree[i]}`, 
        [i, i*2, i*2+1], {operation, inputArray});
    }
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.build.buildInternalLoop, tree, "Finished building internal nodes.", [], {operation, inputArray});
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.build.funcEnd, tree, "Segment Tree build complete.", [], {operation, inputArray, finalTree: [...tree]});

  } else if (operation === 'query') {
    tree = [...currentTree]; 
    if (queryL === undefined || queryR === undefined || n === 0) {
      addStep(localSteps, null, tree, "Query error: Invalid parameters or tree not built.", [], {operation, inputArray});
      return localSteps;
    }
    let l = queryL;
    let r = queryR;
    let result = 0; 
    const initialL = l, initialR = r; 
    
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.query.funcStart, tree, `Querying sum for original range [${initialL}, ${initialR}). Original array size n=${n}.`, [], {operation, queryLeft:initialL, queryRight:initialR, currentL:l, currentR:r, currentQueryResult:result, inputArray});
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.query.initResult, tree, `Initialize query result = ${result}.`, [], {operation, queryLeft:initialL, queryRight:initialR, currentL:l, currentR:r, currentQueryResult:result, inputArray});
    
    l += n; 
    r += n;
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.query.adjustLRToTree, tree, `Adjust L=${l}, R=${r} for tree array. Querying tree nodes.`, [l,r-1], {operation, queryLeft:initialL, queryRight:initialR, currentL:l, currentR:r, currentQueryResult:result, processingSubArrayRange: [initialL, initialR-1], inputArray});

    for (; l < r; l = Math.floor(l/2), r = Math.floor(r/2)) {
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.query.loopLR, tree, `Loop: L=${l}, R=${r}. Current query result=${result}.`, [l,r-1], {operation, queryLeft:initialL, queryRight:initialR, currentL:l, currentR:r, currentQueryResult:result, processingSubArrayRange: [initialL, initialR-1], inputArray});
      if (l % 2 === 1) { 
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.query.checkLeftOdd, tree, `L (${l}) is odd. Include tree[${l}] (${tree[l]}) in sum.`, [l], {operation, queryLeft:initialL, queryRight:initialR, currentL:l, currentR:r, currentQueryResult:result, processingSubArrayRange: [initialL, initialR-1], inputArray});
        result += tree[l++];
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.query.addLeftToResult, tree, `Result = ${result}. Increment L to ${l}.`, [l-1], {operation, queryLeft:initialL, queryRight:initialR, currentL:l, currentR:r, currentQueryResult:result, processingSubArrayRange: [initialL, initialR-1], inputArray});
      }
      if (r % 2 === 1) { 
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.query.checkRightOdd, tree, `R (${r}) is odd. Decrement R to ${r-1}. Include tree[${r-1}] (${tree[r-1]}) in sum.`, [r-1], {operation, queryLeft:initialL, queryRight:initialR, currentL:l, currentR:r, currentQueryResult:result, processingSubArrayRange: [initialL, initialR-1], inputArray});
        result += tree[--r]; 
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.query.addRightToResult, tree, `Result = ${result}. R is now ${r}.`, [r], {operation, queryLeft:initialL, queryRight:initialR, currentL:l, currentR:r, currentQueryResult:result, processingSubArrayRange: [initialL, initialR-1], inputArray});
      }
    }
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.query.returnResult, tree, `Query complete. Sum for original range [${initialL}, ${initialR}) is ${result}.`, [], {operation, queryResult:result, processingSubArrayRange: [initialL, initialR-1], inputArray});
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.query.funcEnd, tree, "Query function finished.", [], {operation, queryResult:result, queryLeft:initialL, queryRight:initialR, processingSubArrayRange: [initialL, initialR-1], inputArray});

  } else if (operation === 'update') {
    tree = [...currentTree];
    if (updateIdx === undefined || updateVal === undefined || n === 0 || updateIdx < 0 || updateIdx >= n) {
      addStep(localSteps, null, tree, "Update error: Invalid parameters or tree not built.", [], {operation, inputArray});
      return localSteps;
    }
    let pos = updateIdx + n; 
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.update.funcStart, tree, `Updating original index ${updateIdx} (tree leaf pos ${pos}) to new value ${updateVal}.`, [pos], {operation, updateIndex: updateIdx, updateValue: updateVal, processingSubArrayRange: [updateIdx, updateIdx], inputArray});
    
    tree[pos] = updateVal;
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.update.updateLeaf, tree, `Set leaf tree[${pos}] = ${updateVal}.`, [pos], {operation, updateIndex: updateIdx, updateValue: updateVal, processingSubArrayRange: [updateIdx, updateIdx], inputArray});

    addStep(localSteps, SEGMENT_TREE_LINE_MAP.update.loopToRoot, tree, `Propagating update upwards from leaf ${pos}.`, [pos], {operation, updateIndex: updateIdx, updateValue: updateVal, inputArray});
    while (pos > 1) {
      pos = Math.floor(pos / 2);
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.update.moveToParent, tree, `Move to parent: tree node pos = ${pos}.`, [pos, pos*2, pos*2+1], {operation, updateIndex: updateIdx, updateValue: updateVal, inputArray});
      tree[pos] = tree[pos * 2] + tree[pos * 2 + 1]; 
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.update.updateParentNode, tree, 
              `Update parent tree[${pos}] = tree[${pos*2}] (${tree[pos*2]}) + tree[${pos*2+1}] (${tree[pos*2+1]}) = ${tree[pos]}.`, 
              [pos, pos*2, pos*2+1], {operation, updateIndex: updateIdx, updateValue: updateVal, inputArray});
    }
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.update.loopToRoot, tree, `Finished propagating update to root.`, [1], {operation, updateIndex: updateIdx, updateValue: updateVal, inputArray});
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.update.funcEnd, tree, `Update at original index ${updateIdx} to value ${updateVal} complete. Tree recomputed.`, [updateIdx + n], {operation, updateIndex: updateIdx, updateValue: updateVal, processingSubArrayRange: [updateIdx, updateIdx], finalUpdatedTree: [...tree], inputArray});
  }
  
  return localSteps;
}


    