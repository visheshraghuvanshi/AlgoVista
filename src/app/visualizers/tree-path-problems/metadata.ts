
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'tree-path-problems',
  title: 'Tree Path Problems',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'Covers various problems related to finding or analyzing paths in trees, such as path sum, diameter, or specific node-to-node paths.',
  longDescription: 'Tree Path Problems involve algorithms that explore or analyze paths within tree data structures. Common examples include:\n\n- **Path Sum**: Determining if a root-to-leaf path exists that sums to a target value, or finding all such paths.\n- **Tree Diameter**: Finding the longest path between any two nodes in a tree. This path may or may not pass through the root.\n- **Lowest Common Ancestor (LCA)**: Finding the lowest node that has two given nodes as descendants (covered in its own visualizer).\n- **All Paths from Root to Leaf**: Enumerating all possible paths from the root node to every leaf node.\n\nThese problems often utilize Depth-First Search (DFS) traversal as a core technique to explore paths. Variations can involve binary trees, N-ary trees, and can include constraints on path properties (e.g., sum, length, specific node inclusion). Understanding how to traverse trees and accumulate path information is key to solving these types of problems.',
  timeComplexities: {
    best: "Varies (e.g., O(N) for many DFS-based path problems)",
    average: "Varies (e.g., O(N))",
    worst: "Varies (e.g., O(N))",
  },
  spaceComplexity: "O(H) for recursion stack (H = height of tree), O(N) in worst case (skewed tree). Some problems might require O(N) for storing paths.",
};
