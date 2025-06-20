
import type { DSUStep } from './types'; // Local import

export const DSU_LINE_MAP = {
  // Constructor
  constructorStart: 1,
  initParentLoop: 2, // Conceptual for parent[i] = i
  initRankLoop: 3,   // Conceptual for rank[i] = 0

  // Find
  findFuncStart: 4,
  findBaseCase: 5,   // if (parent[i] === i)
  findReturnParent: 6, // Conceptual, as it's part of the base case line
  findRecursiveCall: 7,
  findPathCompression: 8,
  findReturnResult: 9, // Final result of the find operation

  // Union
  unionFuncStart: 10,
  unionFindRootI: 11,
  unionFindRootJ: 12,
  unionCheckSameSet: 13,
  unionRankCompare1: 14, // if (rank[rootI] < rank[rootJ])
  unionSetParent1: 15,   // parent[rootI] = rootJ
  unionRankCompare2: 16, // else if (rank[rootI] > rank[rootJ])
  unionSetParent2: 17,   // parent[rootJ] = rootI
  unionRankEqual: 18,    // else (ranks are equal)
  unionSetParent3: 19,   // parent[rootJ] = rootI
  unionIncrementRank: 20, // rank[rootI]++
  unionReturnTrue: 21,
  unionReturnFalse: 22,  // Already in same set
};


const addStep = (
  localSteps: DSUStep[],
  line: number | null,
  parentArr: number[],
  rankArr: number[],
  operation: DSUStep['operation'],
  elements: number[], // e.g., [i] for find, [i,j] for union
  message: string,
  root1?: number,
  root2?: number,
  pathCompressedNodes?: number[],
  activeInArray?: number[]
) => {
  localSteps.push({
    parentArray: [...parentArr],
    rankArray: [...rankArr],
    operation,
    elementsInvolved: [...elements],
    message,
    currentLine: line,
    root1,
    root2,
    pathCompressedNodes: pathCompressedNodes ? [...pathCompressedNodes] : undefined,
    activeIndices: activeInArray || [],
  });
};

export const generateDSUSteps = (
  numElements: number,
  operation: 'initial' | 'find' | 'union',
  element1: number, // Primary element for find, or first element for union
  element2: number, // Second element for union (ignored for find/initial)
  currentDSU?: { parent: number[], rank: number[] } 
): DSUStep[] => {
  const localSteps: DSUStep[] = [];
  const lm = DSU_LINE_MAP;
  let parent: number[];
  let rank: number[];

  if (operation === 'initial' || !currentDSU || currentDSU.parent.length !== numElements) {
    parent = Array(numElements).fill(0).map((_, i) => i);
    rank = Array(numElements).fill(0);
    addStep(localSteps, lm.constructorStart, parent, rank, 'initial', [], `DSU initialized with ${numElements} elements. Parents set to self, ranks to 0.`);
    if (operation === 'initial') return localSteps;
  } else {
    parent = [...currentDSU.parent];
    rank = [...currentDSU.rank];
  }

  // Recursive Find with Path Compression
  // isOuterCall helps to log the "Start Find" message only for the top-level call
  const findWithPathCompression = (i: number, path: number[] = [], isOuterCall: boolean = false): number => {
    if (isOuterCall) {
      addStep(localSteps, lm.findFuncStart, parent, rank, 'find', [i], `Find(${i}): Start.`, undefined, undefined, undefined, [i]);
    }
    
    path.push(i); // Add current node to path being traversed
    if (!isOuterCall) { // For recursive calls, show the current path context
        addStep(localSteps, lm.findFuncStart, parent, rank, 'find', [i], `Find(${i}): Recursing. Path: ${path.join('->')}. Checking parent[${i}].`, undefined, undefined, undefined, [i]);
    }

    if (parent[i] === i) {
      addStep(localSteps, lm.findBaseCase, parent, rank, 'find', [i], `Find(${i}): Base case. parent[${i}] (${parent[i]}) === ${i}. Root found: ${i}.`, i);
      return i;
    }

    addStep(localSteps, lm.findRecursiveCall, parent, rank, 'find', [i], `Find(${i}): parent[${i}] (${parent[i]}) !== ${i}. Recursive call on parent: Find(${parent[i]}).`, undefined, undefined, undefined, [i, parent[i]]);
    const root = findWithPathCompression(parent[i], [...path], false); // Pass copy of path for isolated recursive calls

    if (parent[i] !== root) {
      const oldParent = parent[i];
      parent[i] = root; // Path compression
      addStep(localSteps, lm.findPathCompression, parent, rank, 'find', [i], `Find(${i}): Path compression. Updated parent[${i}] from ${oldParent} to ${root}.`, root, undefined, [i], [i, oldParent, root]);
    }
    return root;
  };

  if (operation === 'find') {
    const root = findWithPathCompression(element1, [], true);
    addStep(localSteps, lm.findReturnResult, parent, rank, 'find', [element1], `Find(${element1}) completed. Root is ${root}.`, root);
  } else if (operation === 'union') {
    addStep(localSteps, lm.unionFuncStart, parent, rank, 'union', [element1, element2], `Operation: Union(${element1}, ${element2})`);
    
    addStep(localSteps, lm.unionFindRootI, parent, rank, 'union', [element1], `Find root of ${element1}.`);
    const root1 = findWithPathCompression(element1, [], true);
    addStep(localSteps, lm.unionFindRootI, parent, rank, 'union', [element1], `Root of ${element1} is ${root1}.`);

    addStep(localSteps, lm.unionFindRootJ, parent, rank, 'union', [element2], `Find root of ${element2}.`);
    const root2 = findWithPathCompression(element2, [], true);
    addStep(localSteps, lm.unionFindRootJ, parent, rank, 'union', [element2], `Root of ${element2} is ${root2}.`);

    addStep(localSteps, lm.unionCheckSameSet, parent, rank, 'union', [element1, element2], `Are roots different? (${root1} !== ${root2})`, root1, root2);
    if (root1 !== root2) {
      if (rank[root1] < rank[root2]) {
        addStep(localSteps, lm.unionRankCompare1, parent, rank, 'union', [root1, root2], `Rank[${root1}] (${rank[root1]}) < Rank[${root2}] (${rank[root2]}). Set parent[${root1}] = ${root2}.`, root1, root2);
        parent[root1] = root2;
        addStep(localSteps, lm.unionSetParent1, parent, rank, 'union', [root1, root2], `Parent of ${root1} is now ${root2}. Union successful.`, root1, root2);
      } else if (rank[root1] > rank[root2]) {
        addStep(localSteps, lm.unionRankCompare2, parent, rank, 'union', [root1, root2], `Rank[${root1}] (${rank[root1]}) > Rank[${root2}] (${rank[root2]}). Set parent[${root2}] = ${root1}.`, root1, root2);
        parent[root2] = root1;
        addStep(localSteps, lm.unionSetParent2, parent, rank, 'union', [root1, root2], `Parent of ${root2} is now ${root1}. Union successful.`, root1, root2);
      } else {
        addStep(localSteps, lm.unionRankEqual, parent, rank, 'union', [root1, root2], `Ranks are equal (Rank[${root1}]=${rank[root1]}). Set parent[${root2}] = ${root1}.`, root1, root2);
        parent[root2] = root1;
        addStep(localSteps, lm.unionSetParent3, parent, rank, 'union', [root1, root2], `Parent of ${root2} is now ${root1}.`);
        rank[root1]++;
        addStep(localSteps, lm.unionIncrementRank, parent, rank, 'union', [root1, root2], `Increment Rank[${root1}] to ${rank[root1]}. Union successful.`, root1, root2);
      }
      addStep(localSteps, lm.unionReturnTrue, parent, rank, 'union', [element1, element2], `Union operation complete.`, root1, root2);
    } else {
      addStep(localSteps, lm.unionReturnFalse, parent, rank, 'union', [element1, element2], `${element1} and ${element2} are already in the same set (root: ${root1}). No union performed.`, root1, root2);
    }
  }

  return localSteps;
};

