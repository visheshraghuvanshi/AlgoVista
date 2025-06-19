
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'avl-tree',
  title: 'AVL Tree Operations',
  category: 'Trees',
  difficulty: 'Hard',
  description: 'Self-balancing binary search tree that maintains a balanced height via rotations to ensure O(log n) operations.',
  longDescription: `An AVL Tree (named after its inventors Adelson-Velsky and Landis) is a self-balancing Binary Search Tree (BST). In an AVL tree, the heights of the two child subtrees of any node differ by at most one; if at any time they differ by more than one, rebalancing is done to restore this property. This balance factor ensures that operations like search, insert, and delete maintain an O(log N) time complexity in the worst case, where N is the number of nodes in the tree.

### Core BST Properties (also apply to AVL Trees):
1.  **Left Child Property**: The value of any node in the left subtree of a node \\\`X\\\` is less than the value of node \\\`X\\\`.
2.  **Right Child Property**: The value of any node in the right subtree of a node \\\`X\\\` is greater than the value of node \\\`X\\\`.
3.  **Recursive Property**: Both the left and right subtrees of every node must also be binary search trees.
4.  **No Duplicates**: Typically, AVL trees (like BSTs) do not allow duplicate values. Our visualizer follows this convention; if a duplicate is inserted, it's ignored.

### AVL Specific Property: Balance Factor
-   For every node, the **balance factor** is defined as: \\\`height(left subtree) - height(right subtree)\\\`.
-   The height of a node is the length of the longest path from that node to a leaf (a NIL node, conceptually, has height 0, a leaf with value has height 1).
-   In a valid AVL tree, the balance factor of every node must be -1, 0, or 1.
-   If an insertion or deletion causes any node's balance factor to become -2 or 2, the tree is considered unbalanced at that node, and rebalancing operations (rotations) are performed to restore the AVL property.

### How Rebalancing Works (Rotations):
When an imbalance occurs, the tree performs one or more **rotations** to restore balance. There are four main types of imbalances that require specific rotation strategies:

1.  **Left-Left (LL) Imbalance**: Occurs when a new node is inserted into the left subtree of the left child of an unbalanced node (the "grandparent"). This causes the grandparent's balance factor to become +2, and its left child's balance factor is typically +1 (or 0 if the new node replaced a NIL, but still maintains the LL characteristic path from grandparent).
    *   **Correction**: A **single right rotation** at the grandparent.

2.  **Right-Right (RR) Imbalance**: Occurs when a new node is inserted into the right subtree of the right child of an unbalanced node. The grandparent's balance factor becomes -2, and its right child's balance factor is typically -1 (or 0).
    *   **Correction**: A **single left rotation** at the grandparent.

3.  **Left-Right (LR) Imbalance**: Occurs when a new node is inserted into the right subtree of the left child of an unbalanced node. Grandparent's balance factor becomes +2, but its left child's balance factor is -1.
    *   **Correction**: A **double rotation**:
        1.  First, a **left rotation** at the left child of the grandparent. This transforms the LR imbalance into an LL imbalance.
        2.  Then, a **right rotation** at the grandparent itself (as in the LL case).

4.  **Right-Left (RL) Imbalance**: Occurs when a new node is inserted into the left subtree of the right child of an unbalanced node. Grandparent's balance factor becomes -2, but its right child's balance factor is +1.
    *   **Correction**: A **double rotation**:
        1.  First, a **right rotation** at the right child of the grandparent. This transforms the RL imbalance into an RR imbalance.
        2.  Then, a **left rotation** at the grandparent itself (as in the RR case).

### Operations:
-   **Search**: Same as a standard BST. Time complexity is O(log N) due to the guaranteed height balance of O(log N).
-   **Insert**:
    1.  Perform a standard BST insertion to place the new node as a leaf.
    2.  Traverse back up from the new node to the root. For each ancestor:
        a.  Update its height.
        b.  Calculate its balance factor.
        c.  If an imbalance is detected (balance factor is -2 or 2), perform the appropriate rotation(s) (LL, RR, LR, or RL) at the unbalanced node.
    3.  Importantly, for AVL tree insertions, at most one set of rotations (either a single or a double rotation) is needed to restore the balance of the entire tree. Once an imbalance is fixed at the lowest unbalanced ancestor, the heights of its ancestors might change, but their balance factors will remain valid or be restored.
-   **Delete**:
    1.  Perform a standard BST deletion. This might involve removing a leaf, a node with one child, or a node with two children (in which case it's replaced by its inorder successor/predecessor, and then that successor/predecessor is deleted).
    2.  Traverse back up from the parent of the physically removed node (or the node that took its place) to the root.
    3.  For each ancestor: update height, check balance factor, and perform rotations if needed.
    4.  Unlike insertion, deletion in an AVL tree might require multiple rotations along the path to the root to restore balance, as a single rotation might not fix height changes propagated further up. The process continues until the root is reached or balance is restored at all levels.

### Advantages:
-   **Guaranteed O(log N) performance** for search, insert, and delete operations, even in the worst case. This makes them more predictable than standard BSTs which can degrade to O(N).
-   Faster lookups than Red-Black trees on average because they are more strictly balanced, leading to a slightly smaller height.

### Disadvantages:
-   **More complex implementation** than standard BSTs due to the need for height tracking, balance factor calculation, and rotation logic.
-   Insertions and deletions can be slightly slower than in other self-balancing trees (like Red-Black trees) in some cases because AVL rotations may occur more frequently to maintain the strict balance factor of -1, 0, or 1.
-   Higher constant factors in operations compared to less strictly balanced trees.

### Common Use Cases:
-   Databases and file systems where frequent lookups are critical and guaranteed logarithmic performance is essential.
-   Situations where data is frequently inserted and deleted, but search performance must remain consistently fast.
-   Any application requiring an ordered set or map with efficient worst-case operation times where the stricter balance of AVL (potentially leading to slightly faster searches than RBTs) is preferred over the potentially fewer rotations of RBTs during modifications.

AlgoVista's AVL Tree visualizer demonstrates these operations, highlighting node comparisons, height/balance factor updates, and the rebalancing rotations.`,
  timeComplexities: {
    best: "O(log n) for search, insert, delete",
    average: "O(log n) for search, insert, delete",
    worst: "O(log n) for search, insert, delete (guaranteed due to balancing)"
  },
  spaceComplexity: "O(n) for storage, O(log n) for recursion stack during operations.",
};
