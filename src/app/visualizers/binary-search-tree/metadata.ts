
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'binary-search-tree',
  title: 'Binary Search Tree Operations',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'Supports insertion, search, and deletion in a binary search tree. Visualizes node comparisons and structural changes.',
  longDescription: 'A Binary Search Tree (BST) is a node-based binary tree data structure which has the following properties:\n- The left subtree of a node contains only nodes with keys lesser than the node’s key.\n- The right subtree of a node contains only nodes with keys greater than the node’s key.\n- The left and right subtree each must also be a binary search tree.\n- There must be no duplicate nodes (or a consistent rule for handling them, e.g., always in the right subtree).\n\n**Key Operations:**\n- **Search**: Starts from the root. If the target value is less than the current node\'s value, go left; if greater, go right. Repeat until the value is found or a null child is reached (value not in tree).\n- **Insert**: Similar to search. Traverse the tree to find the correct position for the new value. If the value is less than the current node, go left; otherwise, go right. Insert the new node as a leaf when a null child is reached.\n- **Delete**: This is the most complex operation. Three cases:\n    1. **Node to be deleted is a leaf**: Simply remove it (set parent\'s child pointer to null).\n    2. **Node to be deleted has one child**: Replace the node with its child.\n    3. **Node to be deleted has two children**: Find its inorder successor (smallest value in its right subtree) or inorder predecessor (largest value in its left subtree). Copy the successor/predecessor\'s value to the node to be deleted. Then, delete the successor/predecessor (which will now have 0 or 1 child, reducing to one of the simpler cases).\n\nBSTs provide efficient average-case time complexity for search, insert, and delete operations, making them useful for dynamic sets and lookup tables. However, their worst-case performance can degrade to O(N) if the tree becomes unbalanced (skewed), resembling a linked list. Balanced BSTs like AVL or Red-Black trees address this issue.',
  timeComplexities: {
    best: "Search/Insert/Delete: O(log n) (balanced tree)",
    average: "Search/Insert/Delete: O(log n)",
    worst: "Search/Insert/Delete: O(n) (skewed tree)"
  },
  spaceComplexity: "O(n) for storing the tree. O(h) for recursion stack during operations (h=height of tree), which is O(log n) for balanced trees and O(n) for skewed trees.",
};

