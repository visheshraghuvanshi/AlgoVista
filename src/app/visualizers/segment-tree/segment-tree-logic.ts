
import type { AlgorithmStep } from '@/types';

// Line numbers refer to the 'build' snippet in SegmentTreeCodePanel.tsx
export const SEGMENT_TREE_LINE_MAP = {
  constructorCall: 1, // Conceptual start of SegmentTree class instantiation
  assignN: 2,
  initTreeArray: 3,
  callBuild: 4,       // Line where `this.build(inputArray)` is called in constructor
  buildFuncStart: 5,  // `build(arr) {`
  buildLeafLoop: 6,   // `for (let i = 0; i < this.n; i++)`
  buildSetLeaf: 7,    // `this.tree[this.n + i] = arr[i];`
  buildInternalLoop: 8, // `for (let i = this.n - 1; i > 0; --i)`
  buildSetInternal: 9,// `this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];`
  buildFuncEnd: 10,   // Closing brace of build function
  classEnd: 11,       // Closing brace of SegmentTree class
};

export const generateSegmentTreeBuildSteps = (inputArray: number[]): AlgorithmStep[] => {
  const localSteps: AlgorithmStep[] = [];
  const n = inputArray.length;
  if (n === 0) {
    localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Input array is empty." });
    return localSteps;
  }

  // Segment tree array size will be 2*n for iterative sum tree (1-indexed internally, but 0-indexed for visualization array)
  // For visualization, we'll use 0-indexed for the 'tree' array shown to user.
  // The typical iterative segment tree uses 1-based indexing for easier parent/child calculation (parent=i/2, children=2i, 2i+1)
  // and stores leaves starting from index n.
  // So, tree array size is 2n. tree[n...2n-1] are leaves. tree[1...n-1] are internal. tree[0] unused.
  // For visualization, we'll map this to a 0-indexed array display of size 2n.
  
  const treeVisArray = new Array(2 * n).fill(0); // Array to show user
  const lm = SEGMENT_TREE_LINE_MAP;

  const addStep = (
    line: number | null,
    currentTreeState: number[],
    active: number[] = [], // Indices in treeVisArray being actively worked on
    message: string = ""
  ) => {
    localSteps.push({
      array: [...currentTreeState], // This will be the segment tree array
      activeIndices: active,
      swappingIndices: [],
      sortedIndices: [], // Not directly applicable for ST build in the same way as sorting
      currentLine: line,
      message,
      processingSubArrayRange: null, 
      pivotActualIndex: null,
    });
  };

  addStep(lm.constructorCall, treeVisArray, [], "SegmentTree constructor called.");
  addStep(lm.assignN, treeVisArray, [], `n (input array length) = ${n}.`);
  addStep(lm.initTreeArray, treeVisArray, [], `Segment tree array initialized (size ${2*n}).`);
  addStep(lm.callBuild, treeVisArray, [], "Calling build method.");
  addStep(lm.buildFuncStart, treeVisArray, [], "Starting build process.");

  // Phase 1: Insert leaf nodes
  addStep(lm.buildLeafLoop, treeVisArray, [], "Copying input array elements to leaf nodes of the segment tree.");
  for (let i = 0; i < n; i++) {
    treeVisArray[n + i] = inputArray[i];
    addStep(lm.buildSetLeaf, treeVisArray, [n + i], `Set leaf tree[${n + i}] = ${inputArray[i]} (from input[${i}])`);
  }
  addStep(lm.buildLeafLoop, treeVisArray, [], "Finished copying leaf nodes.");

  // Phase 2: Build internal nodes
  addStep(lm.buildInternalLoop, treeVisArray, [], "Building internal nodes from bottom up.");
  for (let i = n - 1; i > 0; --i) { // Iterate from n-1 down to 1 (1-based parent indices)
    // Children of 1-based parent 'i' are '2*i' and '2*i + 1'.
    // These correspond to 0-based indices (i-1) for parent, (2*i-1) and (2*i) for children if we were mapping a 1-based array.
    // BUT, our treeVisArray stores 1-based tree in 0-based array starting at index 0.
    // The common iterative segment tree stores leaves at [n, 2n-1] and internal nodes at [1, n-1].
    // If tree[i] is parent, children are tree[2*i] and tree[2*i+1].
    // Let's assume our `treeVisArray` follows this structure but is 0-indexed.
    // This means `treeVisArray[n+i]` is leaf for input `arr[i]`.
    // Parent `treeVisArray[i]` has children `treeVisArray[2*i]` and `treeVisArray[2*i+1]`
    // For loop `i = n - 1; i > 0; --i`: This corresponds to parents in the 1-indexed segment tree internal nodes.
    // treeVisArray[i] here is an internal node (using 1-based segment tree indexing concept).
    // Its children are treeVisArray[2*i] and treeVisArray[2*i+1].
    
    // This visualization will be more direct if we map the typical 1-indexed array to our 0-indexed display.
    // So, if code logic is `tree[i] = tree[2*i] + tree[2*i+1]`, for display:
    // `treeVisArray[i]` is what we are calculating.
    // `treeVisArray[2*i]` and `treeVisArray[2*i+1]` are its children.
    // The loop `for (let i = n - 1; i > 0; --i)` refers to the *indices of the segment tree array being filled*, not indices of the original input array.
    
    const leftChildIdxDisplay = 2 * i;       // Child index in 1-based logic
    const rightChildIdxDisplay = 2 * i + 1;   // Child index in 1-based logic
    
    // These indices must be valid for treeVisArray which has 2n elements.
    // If our treeVisArray is conceptually 1-indexed from treeVisArray[1] to treeVisArray[2n-1],
    // then treeVisArray[i] (parent) = treeVisArray[2i] + treeVisArray[2i+1]
    
    // Let's stick to the standard iterative segment tree build:
    // Leaves are at tree[n] to tree[2n-1]. Parents are from tree[n-1] down to tree[1].
    // For a 0-indexed `treeVisArray` of size 2*n that mirrors this:
    //   Leaves are at treeVisArray[n] ... treeVisArray[2*n - 1]
    //   Internal nodes are treeVisArray[1] ... treeVisArray[n-1]
    //   treeVisArray[0] is often unused or stores a dummy value. Let's assume it's unused for sum.
    //   The loop `for (let i = n - 1; i > 0; --i)` will populate treeVisArray[i].
    //   Children of treeVisArray[i] are treeVisArray[2*i] and treeVisArray[2*i+1].

    if ( (2*i + 1) < 2*n ) { // Ensure children are within bounds
        treeVisArray[i] = treeVisArray[2*i] + treeVisArray[2*i + 1];
         addStep(lm.buildSetInternal, treeVisArray, [i, 2*i, 2*i+1], 
                `Set internal node tree[${i}] = tree[${2*i}] (${treeVisArray[2*i]}) + tree[${2*i+1}] (${treeVisArray[2*i+1]}) = ${treeVisArray[i]}`);
    } else if (2*i < 2*n) { // Only left child might exist if 2n is odd, though for sum typically full tree
        treeVisArray[i] = treeVisArray[2*i]; // Should not happen for sum with 2*n size
         addStep(lm.buildSetInternal, treeVisArray, [i, 2*i], 
                `Set internal node tree[${i}] = tree[${2*i}] (${treeVisArray[2*i]}) (right child out of bounds)`);
    }
  }
  addStep(lm.buildInternalLoop, treeVisArray, [], "Finished building internal nodes.");
  addStep(lm.buildFuncEnd, treeVisArray, [], "Segment tree build complete.");
  addStep(lm.classEnd, treeVisArray, [], "SegmentTree structure ready."); // Conceptual end

  return localSteps;
};
