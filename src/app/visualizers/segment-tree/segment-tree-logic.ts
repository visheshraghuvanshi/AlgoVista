
import type { AlgorithmStep } from '@/types';

// Line numbers adjusted for a combined view if a single panel shows different ops
export const SEGMENT_TREE_LINE_MAP = {
  // Build (lines 1-11 in a conceptual SegmentTree class structure)
  constructorCall: 1, 
  assignN: 2,
  initTreeArray: 3,
  callBuild: 4,       
  buildFuncStart: 5,  
  buildLeafLoop: 6,   
  buildSetLeaf: 7,    
  buildInternalLoop: 8, 
  buildSetInternal: 9,
  buildFuncEnd: 10,   
  classEndBuild: 11,      

  // Query (lines 1-12 in a conceptual query method)
  queryFuncStart: 12,
  queryInitResult: 13,
  queryAdjustLR: 14,
  queryLoop: 15,
  queryIfLeftOdd: 16,
  queryAddLeft: 17,
  queryIfRightOdd: 18,
  queryAddRight: 19,
  queryReturnResult: 20,
  queryFuncEnd: 21,

  // Update (lines 1-7 in a conceptual update method)
  updateFuncStart: 22,
  updateGoToLeaf: 23,
  updateSetLeaf: 24,
  updateLoopToRoot: 25,
  updateMoveToParent: 26,
  updateSetParent: 27,
  updateFuncEnd: 28,
};

export type SegmentTreeOperation = 'build' | 'query' | 'update';

function addStep(
  localSteps: AlgorithmStep[],
  line: number | null,
  currentTreeState: number[],
  message: string = "",
  active: number[] = [], // Indices in treeVisArray being actively worked on
  auxData?: Record<string, string | number> // For query result, etc.
) {
  localSteps.push({
    array: [...currentTreeState],
    activeIndices: active,
    swappingIndices: [],
    sortedIndices: [], 
    currentLine: line,
    message,
    processingSubArrayRange: null, 
    pivotActualIndex: null,
    auxiliaryData: auxData,
  });
}

export const generateSegmentTreeSteps = (
    operation: SegmentTreeOperation,
    inputArray: number[], // Used for 'build', ignored for query/update on existing tree
    currentTreeState: number[], // The existing segment tree array for query/update
    nVal: number, // Original input array size, needed for all ops
    queryLeft?: number, queryRight?: number, // For 'query'
    updateIdx?: number, updateVal?: number   // For 'update'
): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  const n = nVal; // Size of the original input array
  let tree: number[];

  if (operation === 'build') {
    if (inputArray.length === 0) {
      addStep(localSteps, null, [], "Input array is empty for build.");
      return localSteps;
    }
    tree = new Array(2 * n).fill(0);
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.constructorCall, tree, "SegmentTree constructor called.");
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.assignN, tree, `n (input array length) = ${n}.`);
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.initTreeArray, tree, `Segment tree array initialized (size ${2*n}).`);
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.callBuild, tree, "Calling build method.");
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.buildFuncStart, tree, "Starting build process.");

    addStep(localSteps, SEGMENT_TREE_LINE_MAP.buildLeafLoop, tree, "Copying input array elements to leaf nodes.");
    for (let i = 0; i < n; i++) {
      tree[n + i] = inputArray[i];
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.buildSetLeaf, tree, `Set leaf tree[${n + i}] = ${inputArray[i]} (from input[${i}])`, [n+i]);
    }
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.buildLeafLoop, tree, "Finished copying leaf nodes.");

    addStep(localSteps, SEGMENT_TREE_LINE_MAP.buildInternalLoop, tree, "Building internal nodes from bottom up.");
    for (let i = n - 1; i > 0; --i) {
      tree[i] = tree[2 * i] + tree[2 * i + 1];
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.buildSetInternal, tree, 
              `Set internal node tree[${i}] = tree[${2*i}] (${tree[2*i]}) + tree[${2*i+1}] (${tree[2*i+1]}) = ${tree[i]}`, [i, 2*i, 2*i+1]);
    }
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.buildInternalLoop, tree, "Finished building internal nodes.");
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.buildFuncEnd, tree, "Segment tree build complete.");

  } else if (operation === 'query') {
    tree = [...currentTreeState]; // Use existing tree
    if (queryLeft === undefined || queryRight === undefined || n === 0) {
      addStep(localSteps, null, tree, "Invalid query parameters or tree not built.");
      return localSteps;
    }
    let l = queryLeft;
    let r = queryRight;
    let result = 0;
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryFuncStart, tree, `Querying sum for range [${l}, ${r})`, [l+n, r+n-1]);
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryInitResult, tree, `Initialize result = 0. Current query range [${l}, ${r})`, [], {result});
    
    l += n; // Adjust to leaf positions
    r += n;
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryAdjustLR, tree, `Adjust L=${l}, R=${r} for tree array.`, [l,r-1]);

    for (; l < r; l = Math.floor(l/2), r = Math.floor(r/2)) {
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryLoop, tree, `Loop: L=${l}, R=${r}. Iterate.`, [l,r-1], {result});
      if (l % 2 === 1) { // If left is odd, it's a right child, include it
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryIfLeftOdd, tree, `L (${l}) is odd. Include tree[${l}] (${tree[l]}) in sum.`, [l], {result});
        result += tree[l++];
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryAddLeft, tree, `result = ${result}. Increment L to ${l}.`, [l-1], {result});
      }
      if (r % 2 === 1) { // If right is odd, it's a right child, include its left sibling (which is tree[--r])
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryIfRightOdd, tree, `R (${r}) is odd. Decrement R to ${r-1}. Include tree[${r-1}] (${tree[r-1]}) in sum.`, [r-1], {result});
        result += tree[--r]; 
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryAddRight, tree, `result = ${result}.`, [r], {result});
      }
    }
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryReturnResult, tree, `Query complete. Sum for range [${queryLeft}, ${queryRight}) is ${result}.`, [], {result});
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryFuncEnd, tree, "Query function finished.");

  } else if (operation === 'update') {
    tree = [...currentTreeState];
    if (updateIdx === undefined || updateVal === undefined || n === 0) {
      addStep(localSteps, null, tree, "Invalid update parameters or tree not built.");
      return localSteps;
    }
    let pos = updateIdx + n;
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateFuncStart, tree, `Updating index ${updateIdx} (tree pos ${pos}) to value ${updateVal}.`, [pos]);
    
    tree[pos] = updateVal;
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateSetLeaf, tree, `Set leaf tree[${pos}] = ${updateVal}.`, [pos]);

    while (pos > 1) {
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateLoopToRoot, tree, `Propagating update upwards. Current pos: ${pos}`, [pos]);
      pos = Math.floor(pos / 2);
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateMoveToParent, tree, `Move to parent: pos = ${pos}.`, [pos]);
      tree[pos] = tree[pos * 2] + tree[pos * 2 + 1];
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateSetParent, tree, 
              `Update parent tree[${pos}] = tree[${pos*2}] (${tree[pos*2]}) + tree[${pos*2+1}] (${tree[pos*2+1]}) = ${tree[pos]}.`, [pos, pos*2, pos*2+1]);
    }
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateFuncEnd, tree, "Update complete.");
  }
  
  return localSteps;
};
