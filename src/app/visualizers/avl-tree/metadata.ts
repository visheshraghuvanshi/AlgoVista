
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'avl-tree',
  title: 'AVL Tree Operations',
  category: 'Trees',
  difficulty: 'Hard',
  description: 'Self-balancing binary search tree that maintains a balanced height via rotations to ensure O(log n) operations.',
  longDescription: 'An AVL Tree is a self-balancing binary search tree (BST) where the difference between heights of left and right subtrees (balance factor) for any node cannot be more than one (i.e., -1, 0, or 1). This property ensures that the tree remains relatively balanced, guaranteeing O(log n) time complexity for search, insert, and delete operations in the worst-case scenarios.\n\nKey Properties:\n- It adheres to all properties of a Binary Search Tree.\n- The balance factor of every node must be in the set {-1, 0, 1}.\n- Balance Factor = height(left subtree) - height(right subtree).\n\nRotations for Balancing:\nWhen an insertion or deletion violates the AVL property (i.e., a node\'s balance factor becomes -2 or 2), the tree must be rebalanced. This is achieved through one or more tree rotations:\n1.  **Left Rotation (LL Imbalance Fix)**: Performed when a node becomes unbalanced due to an insertion into the right subtree of its right child. This is part of resolving a "Right-Right" case.\n2.  **Right Rotation (RR Imbalance Fix)**: Performed when a node becomes unbalanced due to an insertion into the left subtree of its left child. This is part of resolving a "Left-Left" case.\n3.  **Left-Right Rotation (LR Imbalance Fix)**: A double rotation (a Left rotation followed by a Right rotation) performed when a node becomes unbalanced due to an insertion into the right subtree of its left child.\n4.  **Right-Left Rotation (RL Imbalance Fix)**: A double rotation (a Right rotation followed by a Left rotation) performed when a node becomes unbalanced due to an insertion into the left subtree of its right child.\n\nEach insertion or deletion requires checking the balance factors of ancestors and performing rotations if necessary, all the way up to the root.\n\nUse Cases: AVL trees are used in scenarios where frequent lookups are required and data needs to be kept sorted, with a guarantee of O(log n) performance for all primary operations. They are suitable for databases, in-memory indexing, and situations where worst-case performance guarantees are more critical than the slightly higher constant factors associated with rebalancing compared to other structures like Red-Black trees for some operations.',
  timeComplexities: {
    best: "O(log n) for search, insert, delete",
    average: "O(log n) for search, insert, delete",
    worst: "O(log n) for search, insert, delete (guaranteed due to balancing)"
  },
  spaceComplexity: "O(n) for storage, O(log n) for recursion stack during operations.",
};
