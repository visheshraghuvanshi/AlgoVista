import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'disjoint-set-union',
  title: 'Disjoint Set Union (DSU)',
  category: 'Data Structures',
  difficulty: 'Medium',
  description: 'A data structure that tracks a set of elements partitioned into a number of disjoint (non-overlapping) subsets. Also known as Union-Find.',
  longDescription: `Disjoint Set Union (DSU), also known as Union-Find or Merge-Find set, is a data structure that maintains a collection of disjoint (non-overlapping) dynamic sets. Each set is typically identified by a representative element from that set. DSU provides two primary operations:

1.  **\`Find(i)\`**: Determines the representative (or "root") of the set to which element \`i\` belongs. This operation can be used to check if two elements are in the same set (i.e., if \`Find(i) == Find(j)\`).
2.  **\`Union(i, j)\`**: Merges the two sets containing elements \`i\` and \`j\` into a single new set. If \`i\` and \`j\` are already in the same set, the \`Union\` operation does nothing.

### Implementation Details:
DSU is commonly implemented using a **forest** of trees, where each tree represents a set, and the root of the tree is the representative of that set.

-   **Parent Array**: An array (let's call it \`parent[]\`) is used to store the parent of each element. If \`parent[i] == i\`, then element \`i\` is the root of its tree (and thus the representative of its set). Initially, each element is its own parent: \`parent[i] = i\` for all elements \`i\`.

### Optimizations:
To make \`Find\` and \`Union\` operations highly efficient (nearly constant time on average), two key optimizations are used:

1.  **Path Compression (for \`Find\`)**:
    *   When performing a \`Find(i)\` operation, after finding the root of the set containing \`i\`, all nodes along the path from \`i\` to the root are made to point directly to the root.
    *   This dramatically flattens the trees in the forest, significantly speeding up future \`Find\` operations for those elements and their descendants.
    *   **Recursive Implementation**: \`if (parent[i] == i) return i; parent[i] = Find(parent[i]); return parent[i];\`

2.  **Union by Rank (or Union by Size)**:
    *   This optimization is used during the \`Union(i, j)\` operation to keep the trees in the forest relatively flat (shallow).
    *   **Union by Rank**: Each root node maintains a "rank" (an upper bound on its height). When merging two sets, the root of the tree with the smaller rank is made a child of the root of the tree with the larger rank. If ranks are equal, one is chosen arbitrarily to be the parent, and its rank is incremented.
    *   **Union by Size**: Each root node stores the size (number of elements) of its set. When merging, the root of the smaller set is made a child of the root of the larger set.
    *   Both heuristics help prevent the trees from becoming too "stringy" or deep, which would degrade \`Find\` performance.

### With Both Optimizations:
When both Path Compression and Union by Rank/Size are used, the amortized time complexity for both \`Find\` and \`Union\` operations becomes O(α(N)), where α(N) is the **inverse Ackermann function**. This function grows extremely slowly (e.g., α(N) < 5 for any N that can be practically stored in a computer's memory). For all practical purposes, it's considered nearly constant time, often approximated as O(1) amortized.

### Example Operations:
Consider elements 0, 1, 2, 3. Initially: parent = [0,1,2,3] (each is its own root).
1.  \`Union(0, 1)\`: \`Find(0)=0\`, \`Find(1)=1\`. They are different. Assume rank[0]=rank[1]=0. Make 0 parent of 1. parent becomes \`[0,0,2,3]\`. rank[0] becomes 1.
2.  \`Union(2, 3)\`: \`Find(2)=2\`, \`Find(3)=3\`. Different. Make 2 parent of 3. parent becomes \`[0,0,2,2]\`. rank[2] becomes 1.
3.  \`Union(0, 2)\`:
    *   \`Find(0)\` (or \`Find(1)\`) returns 0.
    *   \`Find(2)\` (or \`Find(3)\`) returns 2.
    *   They are different. Assume rank[0]=1, rank[2]=1. Make 0 parent of 2. parent becomes \`[0,0,0,2]\`. rank[0] becomes 2. (Or \`parent[0]=2\`, rank[2]++)
    *   Now, all elements {0,1,2,3} are in the same set with root 0 (or 2).

### Time and Space Complexity:
-   **Initialization**: O(N) to create the initial sets.
-   **Find**: O(α(N)) amortized with optimizations.
-   **Union**: O(α(N)) amortized with optimizations (includes two Find calls).
-   **Space Complexity**: O(N) for storing the parent array (and rank/size array if used).

### Use Cases:
-   **Kruskal's Algorithm for Minimum Spanning Trees**: To check if adding an edge forms a cycle.
-   **Finding Connected Components in a Graph**: Efficiently determine if two vertices are in the same component.
-   **Network Connectivity Problems**: Determining if nodes in a network are connected.
-   **Cycle Detection in Undirected Graphs**.
-   Image segmentation.

The AlgoVista DSU visualizer shows the parent array and often a forest representation of the sets, highlighting changes during Find (path compression) and Union operations.`,
  timeComplexities: {
    best: "Find/Union: O(1) (amortized with path compression and union by rank/size).",
    average: "Find/Union: O(α(N)) (inverse Ackermann function, effectively constant).",
    worst: "Find/Union: O(α(N)). Naive implementation can be O(N) for Find.",
  },
  spaceComplexity: "O(N) for storing the parent (and optionally rank/size) arrays.",
};
