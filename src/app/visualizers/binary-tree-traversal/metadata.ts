
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'binary-tree-traversal',
  title: 'Binary Tree Traversals',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'Explores nodes of a binary tree in specific orders: Inorder, Preorder, and Postorder. Interactive step-by-step visualization available.',
  longDescription: 'Binary tree traversal refers to the process of visiting all the nodes of a tree in a specific order. There are three main types of depth-first traversals:\n\n1.  **Inorder (Left, Root, Right)**: Visits the left subtree, then the root, then the right subtree. For a Binary Search Tree (BST), inorder traversal visits nodes in non-decreasing order.\n2.  **Preorder (Root, Left, Right)**: Visits the root, then the left subtree, then the right subtree. Useful for creating a copy of the tree or getting prefix expressions.\n3.  **Postorder (Left, Right, Root)**: Visits the left subtree, then the right subtree, then the root. Useful for deleting a tree (delete children before parent) or getting postfix expressions.\n\nThese traversals are fundamental operations for processing data stored in binary trees and form the basis for many other tree algorithms.',
  timeComplexities: {
    best: "O(N)",
    average: "O(N)",
    worst: "O(N)",
  },
  spaceComplexity: "O(H) for recursion stack, where H is the height of the tree. In the worst case (skewed tree), H can be N. Iterative traversals using an explicit stack also take O(H) space.",
};
