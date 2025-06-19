
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'binary-search-tree',
  title: 'Binary Search Tree Operations',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'Supports insertion, search, and deletion in a binary search tree. Visualizes node comparisons and structural changes.',
  longDescription: `A Binary Search Tree (BST) is a node-based binary tree data structure which has the following properties:
-   The left subtree of a node contains only nodes with keys lesser than the node’s key.
-   The right subtree of a node contains only nodes with keys greater than the node’s key.
-   Both the left and right subtrees must also be binary search trees.
-   There should be no duplicate nodes (or a consistent rule for handling them, e.g., duplicates go to the right).

### How it Works (Key Operations):

**1. Search (Average: O(log N), Worst: O(N))**
   - Start at the root.
   - If the tree is empty or the current node's value matches the target, the search ends.
   - If the target value is less than the current node's value, recursively search the left subtree.
   - If the target value is greater than the current node's value, recursively search the right subtree.

**2. Insertion (Average: O(log N), Worst: O(N))**
   - Start at the root.
   - If the tree is empty, the new node becomes the root.
   - Traverse the tree:
     - If the new value is less than the current node's value, go to the left child.
     - If the new value is greater than the current node's value, go to the right child.
     - If a null child is encountered (left or right), insert the new node there.
   - Duplicates are typically not allowed or are handled by a specific rule (e.g., inserted into the right subtree, or incrementing a count on an existing node). Our visualizer generally disallows duplicates for simplicity.

**3. Deletion (Average: O(log N), Worst: O(N))**
   This is the most complex operation. There are three cases for the node to be deleted (\`X\`):
   -   **Case 1: \`X\` has no children (is a leaf node).**
       -   Simply remove \`X\` by setting its parent's corresponding child pointer to null.
   -   **Case 2: \`X\` has one child.**
       -   Replace \`X\` with its child. Update the parent of \`X\` to point to \`X\`'s child, and update the child's parent pointer to \`X\`'s parent.
   -   **Case 3: \`X\` has two children.**
       1.  Find the **inorder successor** of \`X\`. The inorder successor is the smallest node in \`X\`'s right subtree. (Alternatively, the inorder predecessor, largest in the left subtree, can be used).
       2.  Copy the value of the inorder successor to \`X\`.
       3.  Recursively delete the inorder successor from its original position (the inorder successor will have at most one right child, reducing to Case 1 or Case 2).

### Characteristics:
-   **Ordered Structure**: Values are stored in a way that allows for efficient searching.
-   **Inorder Traversal Yields Sorted Data**: Traversing a BST inorder (Left-Root-Right) visits nodes in ascending order of their values.
-   **Performance Depends on Balance**: Operations are efficient (O(log N)) if the tree is balanced. If the tree becomes skewed (e.g., due to inserting elements in sorted order), performance can degrade to O(N), similar to a linked list.

### Advantages:
-   Efficient average-case time complexity for search, insert, and delete operations (O(log N)).
-   Keeps elements sorted, allowing for efficient range queries and inorder traversal.
-   Simpler to implement than self-balancing trees like AVL or Red-Black trees.

### Disadvantages:
-   Worst-case performance is O(N) if the tree becomes unbalanced.
-   No guarantee of logarithmic performance without balancing mechanisms.

### Common Use Cases:
-   Implementing lookup tables (dictionaries, maps) where keys are ordered.
-   Symbol tables in compilers.
-   Can be used to implement sets.
-   Often a foundational structure for understanding more complex tree-based data structures.

AlgoVista visualizes these core operations, highlighting the nodes being compared or modified and the structural changes that occur.`,
  timeComplexities: {
    best: "Search/Insert/Delete: O(log n) (balanced tree)",
    average: "Search/Insert/Delete: O(log n)",
    worst: "Search/Insert/Delete: O(n) (skewed tree)"
  },
  spaceComplexity: "O(n) for storing the tree. O(h) for recursion stack during operations (h=height of tree), which is O(log n) for balanced trees and O(n) for skewed trees.",
};
