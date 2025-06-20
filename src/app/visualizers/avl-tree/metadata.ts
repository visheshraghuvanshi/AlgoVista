
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'avl-tree',
  title: 'AVL Tree Operations',
  category: 'Trees',
  difficulty: 'Hard',
  description: 'Self-balancing binary search tree that maintains a balanced height via rotations to ensure O(log n) operations.',
  longDescription: `An AVL Tree (named after its inventors Adelson-Velsky and Landis) is a self-balancing Binary Search Tree (BST). In an AVL tree, the heights of the two child subtrees of any node differ by at most one; if at any time they differ by more than one, rebalancing is done to restore this property. This balance factor ensures that operations like search, insert, and delete maintain an O(log N) time complexity in the worst case, where N is the number of nodes in the tree.

The **balance factor** of a node is calculated as \`height(left subtree) - height(right subtree)\`. For an AVL tree, this factor must always be -1, 0, or 1.
- A balance factor of -1 means the right subtree is one level taller.
- A balance factor of 0 means both subtrees have the same height.
- A balance factor of +1 means the left subtree is one level taller.
If the balance factor becomes -2 or +2, the tree is unbalanced at that node and requires rotations to restore balance.

### Core BST Properties (also apply to AVL Trees):
1.  **Left Child Property**: The value of any node in the left subtree of a node \`X\` is less than the value of node \`X\`.
2.  **Right Child Property**: The value of any node in the right subtree of a node \`X\` is greater than the value of node \`X\`.
3.  **Recursive Property**: Both the left and right subtrees of every node must also be binary search trees.
4.  **No Duplicates**: Typically, AVL trees (like BSTs) do not allow duplicate values. Our visualizer follows this convention; if a duplicate is inserted, it's ignored.

### Rotations for Rebalancing:
When an imbalance occurs due to an insertion or deletion, the tree performs one or more **rotations** to restore balance. There are four main types of imbalances that require specific rotation strategies:

1.  **Left-Left (LL) Imbalance (Causes Balance Factor +2)**:
    *   Occurs when a new node is inserted into the left subtree of the left child of an unbalanced node (the "grandparent"). The grandparent's balance factor becomes +2, and its left child's balance factor is typically +1.
    *   **Correction**: A **single right rotation** at the grandparent.

2.  **Right-Right (RR) Imbalance (Causes Balance Factor -2)**:
    *   Occurs when a new node is inserted into the right subtree of the right child of an unbalanced node. The grandparent's balance factor becomes -2, and its right child's balance factor is typically -1.
    *   **Correction**: A **single left rotation** at the grandparent.

3.  **Left-Right (LR) Imbalance (Causes Balance Factor +2)**:
    *   Occurs when a new node is inserted into the right subtree of the left child of an unbalanced node. Grandparent's balance factor becomes +2, but its left child's balance factor is -1.
    *   **Correction**: A **double rotation**:
        1.  First, a **left rotation** at the left child of the grandparent. This transforms the LR imbalance into an LL imbalance.
        2.  Then, a **right rotation** at the grandparent itself (as in the LL case).

4.  **Right-Left (RL) Imbalance (Causes Balance Factor -2)**:
    *   Occurs when a new node is inserted into the left subtree of the right child of an unbalanced node. Grandparent's balance factor becomes -2, but its right child's balance factor is +1.
    *   **Correction**: A **double rotation**:
        1.  First, a **right rotation** at the right child of the grandparent. This transforms the RL imbalance into an RR imbalance.
        2.  Then, a **left rotation** at the grandparent itself (as in the RR case).

### Operations:
-   **Search**: Same as a standard BST. Time complexity is O(log N) due to the guaranteed height balance of O(log N).
-   **Insert**:
    1.  Perform a standard BST insertion.
    2.  Traverse back up from the new node's parent to the root. For each ancestor:
        a.  Update its height.
        b.  Calculate its balance factor.
        c.  If an imbalance is detected, perform the appropriate rotation(s) (LL, RR, LR, or RL).
    3.  For AVL tree insertions, at most one set of rotations (either a single or a double rotation) is needed to restore the balance of the entire tree.
-   **Delete**:
    1.  Perform a standard BST deletion.
    2.  Traverse back up from the parent of the physically removed/modified node to the root.
    3.  For each ancestor: update height, check balance factor, and perform rotations if needed.
    4.  Deletion might require multiple rotations along the path to the root.

### Advantages:
-   **Guaranteed O(log N) performance** for all primary operations (search, insert, delete).
-   Faster lookups on average than Red-Black trees because they are more strictly balanced, leading to a slightly smaller height.

### Disadvantages:
-   **More complex implementation** due to height tracking, balance factor calculation, and rotation logic.
-   Insertions and deletions can be slightly slower than in Red-Black trees in some cases because AVL rotations might occur more frequently to maintain the strict balance.

### Common Use Cases:
-   Databases and file systems where frequent lookups are critical and guaranteed logarithmic performance is essential.
-   Situations requiring an ordered set or map with efficient worst-case operation times where the stricter balance is preferred.

AlgoVista's AVL Tree visualizer demonstrates these operations, highlighting node comparisons, height/balance factor updates, and the rebalancing rotations.
`,
  timeComplexities: {
    best: "O(log n) for search, insert, delete",
    average: "O(log n) for search, insert, delete",
    worst: "O(log n) for search, insert, delete (guaranteed due to balancing)"
  },
  spaceComplexity: "O(n) for storage, O(log n) for recursion stack during operations.",
};
