
import type { AlgorithmStep } from './types'; // Local import

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
  active: number[] = [], 
  auxData?: Record<string, string | number | null> 
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
    inputArray: number[], 
    currentTreeState: number[], 
    nVal: number, 
    queryLeft?: number, queryRight?: number, 
    updateIdx?: number, updateVal?: number   
): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  const n = nVal; 
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
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.callBuild, tree, "Building tree from input.");
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.buildFuncStart, tree, "Start build process.");

    addStep(localSteps, SEGMENT_TREE_LINE_MAP.buildLeafLoop, tree, "Copying input array elements to leaf nodes of the segment tree.");
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
    tree = [...currentTreeState]; 
    if (queryLeft === undefined || queryRight === undefined || n === 0) {
      addStep(localSteps, null, tree, "Invalid query parameters or tree not built.");
      return localSteps;
    }
    let l = queryLeft;
    let r = queryRight;
    let result = 0;
    const initialL = l, initialR = r; // For message
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryFuncStart, tree, `Querying sum for original range [${initialL}, ${initialR})`, [], {result: 0, L: l, R: r});
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryInitResult, tree, `Initialize result = 0.`, [], {result, L: l, R: r});
    
    l += n; 
    r += n;
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryAdjustLR, tree, `Adjust L=${l}, R=${r} for tree array. Querying nodes.`, [l,r-1], {result, L: l, R: r});

    const activeQueryIndices: number[] = [];

    for (; l < r; l = Math.floor(l/2), r = Math.floor(r/2)) {
      activeQueryIndices.length = 0; // Clear for this iteration
      if (l % 2 === 1) activeQueryIndices.push(l);
      if (r % 2 === 1) activeQueryIndices.push(r-1);
      if (l < r && Math.floor(l/2) !== l && Math.floor(r/2) !== r) { // Add parents if they will be checked
          if (!activeQueryIndices.includes(Math.floor(l/2))) activeQueryIndices.push(Math.floor(l/2));
          if (!activeQueryIndices.includes(Math.floor(r/2))) activeQueryIndices.push(Math.floor(r/2));
      }

      addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryLoop, tree, `Loop: L=${l}, R=${r}. Result=${result}. Iterating.`, [...activeQueryIndices], {result, L: l, R: r});
      if (l % 2 === 1) { 
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryIfLeftOdd, tree, `L (${l}) is odd. Include tree[${l}] (${tree[l]}) in sum.`, [l, ...activeQueryIndices.filter(idx => idx !== l)], {result, L: l, R: r});
        result += tree[l++];
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryAddLeft, tree, `result = ${result}. Increment L to ${l}.`, [l-1], {result, L: l, R: r});
      }
      if (r % 2 === 1) { 
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryIfRightOdd, tree, `R (${r}) is odd. Decrement R to ${r-1}. Include tree[${r-1}] (${tree[r-1]}) in sum.`, [r-1, ...activeQueryIndices.filter(idx => idx !== r-1)], {result, L: l, R: r});
        result += tree[--r]; 
        addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryAddRight, tree, `result = ${result}. R is now ${r}.`, [r], {result, L: l, R: r});
      }
    }
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryReturnResult, tree, `Query complete. Sum for range [${initialL}, ${initialR}) is ${result}.`, [], {result, L: initialL, R: initialR});
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.queryFuncEnd, tree, "Query function finished.");

  } else if (operation === 'update') {
    tree = [...currentTreeState];
    if (updateIdx === undefined || updateVal === undefined || n === 0) {
      addStep(localSteps, null, tree, "Invalid update parameters or tree not built.");
      return localSteps;
    }
    let pos = updateIdx + n;
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateFuncStart, tree, `Updating original index ${updateIdx} (tree leaf pos ${pos}) to value ${updateVal}.`, [pos]);
    
    tree[pos] = updateVal;
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateSetLeaf, tree, `Set leaf tree[${pos}] = ${updateVal}.`, [pos]);

    while (pos > 1) {
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateLoopToRoot, tree, `Propagating update upwards. Current tree node pos: ${pos}`, [pos]);
      pos = Math.floor(pos / 2);
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateMoveToParent, tree, `Move to parent: tree node pos = ${pos}.`, [pos]);
      tree[pos] = tree[pos * 2] + tree[pos * 2 + 1];
      addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateSetParent, tree, 
              `Update parent tree[${pos}] = tree[${pos*2}] (${tree[pos*2]}) + tree[${pos*2+1}] (${tree[pos*2+1]}) = ${tree[pos]}.`, [pos, pos*2, pos*2+1]);
    }
    addStep(localSteps, SEGMENT_TREE_LINE_MAP.updateFuncEnd, tree, "Update complete.");
  }
  
  return localSteps;
}
