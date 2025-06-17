
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'disjoint-set-union',
  title: 'Disjoint Set Union (DSU)',
  category: 'Data Structures',
  difficulty: 'Medium',
  description: 'A data structure that tracks a set of elements partitioned into a number of disjoint (non-overlapping) subsets. Also known as Union-Find.',
  longDescription: 'Disjoint Set Union (DSU), also known as Union-Find or Merge-Find set, is a data structure that keeps track of a set of elements partitioned into a number of disjoint (non-overlapping) subsets. It provides two main operations:\n\n1.  **Find**: Determine which subset a particular element is in. This operation can be used for checking if two elements are in the same subset.\n2.  **Union**: Join two subsets into a single subset.\n\nA common application is to keep track of connected components of a graph. It is also used in Kruskal\'s algorithm for finding Minimum Spanning Trees.\n\n**Implementation Details & Optimizations:**\n- Each subset is typically represented as a tree, with the root of the tree being the representative (or identifier) of the subset.\n- **Parent Array**: An array `parent[]` is used where `parent[i]` stores the parent of element `i`. If `parent[i] == i`, then `i` is the root of its tree (representative of its set).\n\n- **Union by Rank (or Height)**: When performing a union, make the root of the shorter tree point to the root of the taller tree. This helps keep the trees relatively flat, improving Find operation performance.\n- **Union by Size**: Similar to Union by Rank, but uses the size (number of nodes) of the trees to decide which tree becomes a subtree of the other. Attach the root of the smaller tree to the root of the larger tree.\n- **Path Compression**: During a Find operation, when traversing up from an element to find its root, make each node on the path point directly to the root. This flattens the tree structure significantly, speeding up future Find operations.\n\nWith both Union by Rank/Size and Path Compression, the amortized time complexity for Find and Union operations becomes nearly constant, specifically O(α(N)), where α(N) is the inverse Ackermann function, which is extremely slow-growing (effectively O(1) for all practical purposes).',
  timeComplexities: {
    best: "Find/Union: O(1) (amortized with path compression and union by rank/size).",
    average: "Find/Union: O(α(N)) (inverse Ackermann function, effectively constant).",
    worst: "Find/Union: O(α(N)). Naive implementation can be O(N) for Find.",
  },
  spaceComplexity: "O(N) for storing the parent (and optionally rank/size) arrays.",
};
    