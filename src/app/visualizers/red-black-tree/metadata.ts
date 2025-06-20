
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'red-black-tree',
  title: 'Red-Black Tree Operations',
  category: 'Trees',
  difficulty: 'Hard',
  description: 'A self-balancing binary search tree that maintains balance using node colors (red or black) and specific rotation/recoloring rules upon insertion and deletion.',
  longDescription: `A Red-Black Tree (RBT) is a type of self-balancing Binary Search Tree (BST) where each node has an extra bit for storing color ("red" or "black"). By ensuring that specific properties related to these colors are maintained, RBTs guarantee that any path from the root to any NIL leaf (conceptual null children) is not more than twice as long as any other such path. This property ensures that the tree remains approximately balanced, leading to O(log N) time complexity for search, insert, and delete operations in the worst case, where N is the number of nodes.

### Core BST Properties (also apply to RBTs):
1.  **Order Property**: For any node \`x\`, all values in its left subtree are less than \`x.value\`, and all values in its right subtree are greater than \`x.value\`.
2.  **No Duplicates**: Typically, RBTs do not allow duplicate values. Our visualizer ignores duplicate insertions.

### Red-Black Properties:
In addition to BST properties, RBTs must satisfy these five properties:
1.  **Color Property**: Every node is either red or black.
2.  **Root Property**: The root of the tree is always black.
3.  **Leaf Property**: Every leaf (NIL node) is black. NIL nodes are conceptual external nodes, often implemented as a single sentinel object, that represent the "missing" children of actual leaf nodes in the user's data. All paths from a node to its descendant NIL leaves must contain the same number of black nodes.
4.  **Red Property**: If a node is red, then both its children must be black. (This implies no two red nodes can be adjacent on any simple path, unless it's a temporary violation during fixup).
5.  **Black-Height Property**: For each node, all simple paths from that node to descendant NIL leaves contain the same number of black nodes. This common number of black nodes is called the black-height of the node.

### How it Works (Insert and Delete):
-   **Insertion**:
    1.  Perform a standard BST insertion, coloring the new node **RED**.
    2.  If this insertion violates any Red-Black properties (typically the Red Property if the parent is also red, or the Root Property if the new node is the root), call an \\\`insertFixup\\\` procedure.
    3.  **\\\`insertFixup\\\`**: This procedure uses a series of **recolorings** and **rotations** (left rotation, right rotation) to restore the Red-Black properties. It iteratively moves up the tree, considering different cases based on the color of the new node's parent, uncle (parent's sibling), and grandparent. The goal is to resolve "red-red" violations or root color violations.
        *   **Case 1 (Uncle is RED)**: Recolor parent and uncle to BLACK, grandparent to RED. Move up to grandparent as the new node of interest (\\\`z\\\`).
        *   **Case 2 (Uncle is BLACK, new node \\\`z\\\` forms a "triangle" with parent and grandparent)**: Rotate the parent to transform this into Case 3 (a "line" configuration).
        *   **Case 3 (Uncle is BLACK, new node \\\`z\\\` forms a "line" with parent and grandparent)**: Recolor parent and grandparent, then rotate the grandparent. This usually resolves the issue at this level.
    4.  Finally, the root of the entire tree is always colored BLACK.

-   **Deletion**:
    1.  Perform a standard BST deletion. The node physically removed might be the target node (if it has 0 or 1 child) or its inorder successor (if it has 2 children). Let \\\`y\\\` be the node that was effectively removed or moved (if it's the successor whose value was copied), and \\\`x\\\` be the child that takes \\\`y\\\`'s original position (this \\\`x\\\` could be a NIL node).
    2.  If the color of \\\`y\\\` (the effectively removed node or its replacement's original color if values were moved) was **BLACK**, the Red-Black properties might be violated. This is because removing a black node can disrupt the black-height property and potentially other rules. A \\\`deleteFixup\\\` procedure is called on \\\`x\\\`.
    3.  **\\\`deleteFixup\\\`**: This is generally more complex than insert fixup, involving several cases based on the color of \\\`x\\\` and its sibling \\\`w\\\`, and the colors of \\\`w\\\`'s children. It uses recolorings and rotations to restore properties, aiming to ensure that all paths maintain the same black-height and other RBT rules. The fixup continues iteratively or recursively until properties are restored, typically moving "extra blackness" up the tree or resolving it with rotations and recoloring.
    4.  If \\\`x\\\` is red at the end of the fixup loop or was red initially (and its parent became NIL making \\\`x\\\` the root), it's simply colored BLACK.

### Rotations:
-   **Left Rotation** on node \`x\`: Assumes \`x.right\` is not NIL. \`x.right\` (let's call it \`y\`) becomes the new root of the subtree. \`x\` becomes \`y\`'s left child. \`y\`'s original left child becomes \`x\`'s new right child. Pointers (parent, left, right) are updated accordingly.
-   **Right Rotation** on node \`y\`: Assumes \`y.left\` is not NIL. \`y.left\` (let's call it \`x\`) becomes the new root. \`y\` becomes \`x\`'s right child. \`x\`'s original right child becomes \`y\`'s new left child.

### Advantages:
-   **Guaranteed O(log N) worst-case time complexity** for search, insert, and delete.
-   Generally good performance in practice for dynamic sets.
-   Fewer rotations on average compared to AVL trees for insertions and deletions, though the fixup logic can be more involved with more cases to consider.

### Disadvantages:
-   Implementation is significantly more complex than standard BSTs and often more complex than AVL trees due to the intricate fixup rules.
-   Higher constant factors in operations compared to unbalanced BSTs (but offers a much better worst-case guarantee).

### Common Use Cases:
-   The underlying data structure for many standard library implementations of ordered maps and sets (e.g., \\\`std::map\\\` and \\\`std::set\\\` in C++, \\\`TreeMap\\\` and \\\`TreeSet\\\` in Java).
-   CPU process schedulers (e.g., the Completely Fair Scheduler in Linux uses RBTs).
-   Anywhere an ordered collection with guaranteed logarithmic time performance for modifications and lookups is needed, and where the slightly more relaxed balance (compared to AVL) leading to potentially fewer restructuring operations is acceptable.

The AlgoVista Red-Black Tree visualizer demonstrates insertion (including fixup cases involving recoloring and rotations) and search operations. Delete is conceptually outlined due to its complexity but not fully animated step-by-step in the fixup phase.
`,
  timeComplexities: {
    best: "O(log n) for Search, Insert, Delete",
    average: "O(log n) for Search, Insert, Delete",
    worst: "O(log n) for Search, Insert, Delete (guaranteed)"
  },
  spaceComplexity: "O(n) for storage. O(log n) for recursion stack if recursive implementations are used for fixups (though often iterative).",
};
