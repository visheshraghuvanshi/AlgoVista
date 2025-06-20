
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'avl-tree',
  title: 'AVL Tree Operations',
  category: 'Trees',
  difficulty: 'Hard',
  description: 'Self-balancing binary search tree that maintains balance factor via rotations (LL, RR, LR, RL) to ensure O(log n) operations.',
  longDescription: `An AVL Tree (named after its inventors Adelson-Velsky and Landis) is a self-balancing Binary Search Tree (BST). In an AVL tree, the heights of the two child subtrees of any node differ by at most one; if at any time they differ by more than one, rebalancing is done to restore this property. This height difference is called the **balance factor**.

The balance factor of a node is calculated as \`height(left subtree) - height(right subtree)\`. For an AVL tree, this factor must always be -1, 0, or 1.
- A balance factor of **-1** means the right subtree is one level taller.
- A balance factor of **0** means both subtrees have the same height (or are null, typically height -1 or 0).
- A balance factor of **+1** means the left subtree is one level taller.

If an insertion or deletion causes the balance factor of any node to become -2 or +2, the tree is considered unbalanced at that node and requires **rotations** to restore balance.

### Core BST Properties (also apply to AVL Trees):
1.  **Left Child Property**: The value of any node in the left subtree of a node \`X\` is less than the value of node \`X\`.
2.  **Right Child Property**: The value of any node in the right subtree of a node \`X\` is greater than the value of node \`X\`.
3.  **Recursive Property**: Both the left and right subtrees of every node must also be binary search trees.
4.  **No Duplicates**: Typically, AVL trees (like standard BSTs) do not allow duplicate values. Our visualizer follows this convention; if a duplicate is inserted, it's ignored or the operation is rejected.

### Rotations for Rebalancing:
When an imbalance occurs (balance factor becomes -2 or +2), specific rotations are performed:
1.  **Left-Left (LL) Imbalance (Grandparent Balance Factor +2, Parent Balance Factor +1 or 0)**:
    *   Problem: A node is too heavy on its left side, and its left child is also left-heavy or balanced.
    *   Corrected by a **single Right Rotation** at the grandparent (the unbalanced node).
2.  **Right-Right (RR) Imbalance (Grandparent Balance Factor -2, Parent Balance Factor -1 or 0)**:
    *   Problem: A node is too heavy on its right side, and its right child is also right-heavy or balanced.
    *   Corrected by a **single Left Rotation** at the grandparent.
3.  **Left-Right (LR) Imbalance (Grandparent Balance Factor +2, Parent Balance Factor -1)**:
    *   Problem: A node is left-heavy, but its left child is right-heavy (forming a "zig-zag" or "triangle").
    *   Corrected by a **double rotation**: First, a **Left Rotation** at the parent node (the left child of the grandparent), transforming it into an LL imbalance. Then, a **Right Rotation** at the grandparent node.
4.  **Right-Left (RL) Imbalance (Grandparent Balance Factor -2, Parent Balance Factor +1)**:
    *   Problem: A node is right-heavy, but its right child is left-heavy.
    *   Corrected by a **double rotation**: First, a **Right Rotation** at the parent node (the right child of the grandparent), transforming it into an RR imbalance. Then, a **Left Rotation** at the grandparent node.

### Operations:
-   **Search (O(log N))**: Same as a standard BST. The balanced nature guarantees O(log N) height.
-   **Insert (O(log N))**:
    1.  Perform a standard BST insertion. The new node is always a leaf.
    2.  Traverse back up from the new node's parent to the root. For each ancestor:
        a.  Update its height.
        b.  Calculate its balance factor.
        c.  If an imbalance is detected at an ancestor, perform the appropriate rotation(s) (LL, RR, LR, or RL) based on its balance factor and the balance factor of its child on the taller side. For AVL tree insertions, at most **one** set of rotations (either a single or a double rotation) is needed to restore the balance of the entire tree. Once a rotation is performed, the heights along the path to the root are such that no further imbalances will occur higher up from that single insertion.
-   **Delete (O(log N))**:
    1.  Perform a standard BST deletion (handling 0, 1, or 2 children cases, potentially involving finding an inorder successor/predecessor).
    2.  Traverse back up from the parent of the physically removed/modified node to the root.
    3.  For each ancestor: update height, check balance factor, and perform rotations if needed. Unlike insertion, deletion might require **multiple rebalancing operations** (rotations) along the path to the root because a deletion can shorten a subtree, potentially causing imbalances at multiple ancestor levels.

### Advantages:
-   **Guaranteed O(log N) performance** for all primary operations (search, insert, delete) due to strict balancing. This makes it reliable for time-sensitive applications.
-   Faster lookups on average than Red-Black trees because they are more rigidly balanced, resulting in a slightly smaller height (though Red-Black trees often have better insertion/deletion performance due to fewer rotations on average).

### Disadvantages:
-   **More complex implementation** than standard BSTs due to height tracking, balance factor calculation, and rotation logic.
-   Insertions and deletions can be slightly slower than in Red-Black trees in some cases because AVL rotations might occur more frequently to maintain the strict balance, and double rotations are more complex than single rotations.

AlgoVista's AVL Tree visualizer demonstrates these operations, highlighting node comparisons, height/balance factor updates, and the rebalancing rotations step-by-step.
`,
  timeComplexities: {
    best: "O(log n) for search, insert, delete",
    average: "O(log n) for search, insert, delete",
    worst: "O(log n) for search, insert, delete (guaranteed due to balancing)"
  },
  spaceComplexity: "O(n) for storage, O(log n) for recursion stack during operations.",
};
