
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'lowest-common-ancestor',
  title: 'Lowest Common Ancestor (LCA)',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'Finds the lowest node in a tree that has two given nodes as descendants.',
  longDescription: 'The Lowest Common Ancestor (LCA) of two nodes p and q in a tree is the lowest (deepest) node that has both p and q as descendants (where we allow a node to be a descendant of itself).\\n\\n**Approaches for Binary Trees:**\\n1.  **Recursive Approach**: Traverse the tree. If the current node is one of p or q, it\'s a candidate for LCA. If recursive calls to left and right subtrees both return non-null values, then the current node is the LCA. Otherwise, if only one subtree returns a non-null value, that value is the LCA. If both are null, neither p nor q is found in this subtree.\\n2.  **Path Finding**: Find the path from root to p and root to q. Store these paths. Traverse both paths to find the last common node. This is the LCA.\\n\\n**Approaches for Binary Search Trees (BSTs):**\\nBecause of the BST property, the LCA can be found more efficiently.\\n- Start from the root. If both p and q are smaller than the current node, the LCA must be in the left subtree. If both are larger, it must be in the right subtree. If one is smaller and one is larger, or if the current node is p or q, then the current node is the LCA.\\n\\n**Advanced Techniques (for general trees and many queries):**\\n- **Euler Tour + Range Minimum Query (RMQ)**: Preprocess the tree to find an Euler tour and node depths. LCA queries can then be answered in O(1) time after O(N log N) or O(N) preprocessing.\\n- **Binary Lifting**: Precompute `parent[i][j]` (2^j-th ancestor of node i). LCA can be found in O(log N) time per query after O(N log N) preprocessing.\\n\\nUse Cases: Analyzing phylogenetic trees, network routing, file system hierarchies.',
  timeComplexities: { 
      best: "Binary Tree: O(N), BST: O(H) (H=height)", 
      average: "Binary Tree: O(N), BST: O(log N) (balanced)", 
      worst: "Binary Tree: O(N), BST: O(N) (skewed). Preprocessing: O(1)/O(log N) per query after setup." 
  },
  spaceComplexity: "O(H) for recursion stack. Preprocessing may take O(N log N) or O(N) space.",
};
    