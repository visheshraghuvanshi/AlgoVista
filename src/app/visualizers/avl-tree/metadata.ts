
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'avl-tree',
  title: 'AVL Tree Operations',
  category: 'Trees',
  difficulty: 'Hard',
  description: 'Self-balancing binary search tree that maintains a balanced height via rotations to ensure O(log n) operations.',
  longDescription: `An AVL Tree (named after its inventors Adelson-Velsky and Landis) is a self-balancing Binary Search Tree (BST). In an AVL tree, the heights of the two child subtrees of any node differ by at most one; if at any time they differ by more than one, rebalancing is done to restore this property. This balance factor ensures that operations like search, insert, and delete maintain an O(log N) time complexity in the worst case, where N is the number of nodes in the tree.

### Core BST Properties (also apply to AVL Trees):
1.  **Left Child Property**: The value of any node in the left subtree of a node \`X\` is less than the value of node \`X\`.
2.  **Right Child Property**: The value of any node in the right subtree of a node \`X\` is greater than the value of node \`X\`.
3.  **Recursive Property**: Both the left and right subtrees of every node must also be binary search trees.
4.  **No Duplicates**: Typically, AVL trees (like BSTs) do not allow duplicate values.

### AVL Specific Property: Balance Factor
-   For every node, the **balance factor** is defined as: \`height(left subtree) - height(right subtree)\`.
-   In a valid AVL tree, the balance factor of every node must be -1, 0, or 1.
-   If an insertion or deletion causes any node's balance factor to become -2 or 2, the tree is considered unbalanced at that node, and rebalancing operations (rotations) are performed to restore the AVL property.

### How Rebalancing Works (Rotations):
When an imbalance occurs, the tree performs one or more **rotations** to restore balance. There are four main types of imbalances that require specific rotation strategies:

1.  **Left-Left (LL) Imbalance**: Occurs when a new node is inserted into the left subtree of the left child of an unbalanced node (the "grandparent"). Corrected by a **single right rotation** at the grandparent.
    *   Example: Grandparent's balance factor becomes +2, and its left child's balance factor is +1.
2.  **Right-Right (RR) Imbalance**: Occurs when a new node is inserted into the right subtree of the right child of an unbalanced node. Corrected by a **single left rotation** at the grandparent.
    *   Example: Grandparent's balance factor becomes -2, and its right child's balance factor is -1.
3.  **Left-Right (LR) Imbalance**: Occurs when a new node is inserted into the right subtree of the left child of an unbalanced node. Corrected by a **double rotation**:
    *   First, a **left rotation** at the left child of the grandparent.
    *   Then, a **right rotation** at the grandparent itself.
    *   Example: Grandparent's balance factor becomes +2, and its left child's balance factor is -1.
4.  **Right-Left (RL) Imbalance**: Occurs when a new node is inserted into the left subtree of the right child of an unbalanced node. Corrected by a **double rotation**:
    *   First, a **right rotation** at the right child of the grandparent.
    *   Then, a **left rotation** at the grandparent itself.
    *   Example: Grandparent's balance factor becomes -2, and its right child's balance factor is +1.

### Operations:
-   **Search**: Same as a standard BST, O(log N) due to the height balance.
-   **Insert**:
    1.  Perform a standard BST insertion.
    2.  Traverse back up from the new node to the root, updating heights and checking balance factors.
    3.  If an imbalance is detected, perform the appropriate rotation(s) at the unbalanced node. Only one set of rotations (single or double) is typically needed to restore balance after an insertion.
-   **Delete**:
    1.  Perform a standard BST deletion.
    2.  Traverse back up from the parent of the deleted node (or the node that replaced it) to the root, updating heights and checking balance factors.
    3.  If an imbalance is detected, perform rotations. Deletion might require multiple rotations along the path to the root to restore balance.

### Advantages:
-   **Guaranteed O(log N) performance** for search, insert, and delete operations, even in the worst case. This makes them more predictable than standard BSTs which can degrade to O(N).
-   Faster lookups than Red-Black trees because they are more strictly balanced (though insertions/deletions might be slightly slower due to more frequent rotations).

### Disadvantages:
-   **More complex implementation** than standard BSTs due to the need for height tracking, balance factor calculation, and rotation logic.
-   Insertions and deletions can be slower than in other self-balancing trees (like Red-Black trees) in some cases because AVL rotations are more rigid and may occur more frequently to maintain the strict balance factor.
-   Higher constant factors in operations compared to less strictly balanced trees.

### Common Use Cases:
-   Databases and file systems where frequent lookups are critical and guaranteed performance is needed.
-   Situations where data is frequently inserted and deleted, but search performance must remain logarithmic.
-   Memory management systems.
-   Any application requiring an ordered set or map with efficient worst-case operation times.
`,
  timeComplexities: {
    best: "O(log n) for search, insert, delete",
    average: "O(log n) for search, insert, delete",
    worst: "O(log n) for search, insert, delete (guaranteed due to balancing)"
  },
  spaceComplexity: "O(n) for storage, O(log n) for recursion stack during operations.",
};
