
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
2.  **No Duplicates**: Typically, RBTs do not allow duplicate values.

### Red-Black Properties:
In addition to BST properties, RBTs must satisfy these five properties:
1.  **Color Property**: Every node is either red or black.
2.  **Root Property**: The root of the tree is always black.
3.  **Leaf Property**: Every leaf (NIL node) is black. NIL nodes are conceptual external nodes, often implemented as a single sentinel object, that represent the "missing" children of actual leaf nodes in the user's data.
4.  **Red Property**: If a node is red, then both its children must be black. (This implies no two red nodes can be adjacent on any simple path, though a red node can have a red parent if it's a violation being fixed).
5.  **Black-Height Property**: For each node, all simple paths from that node to descendant NIL leaves contain the same number of black nodes. This common number of black nodes is called the black-height of the node.

### How it Works (Insert and Delete):
-   **Insertion**:
    1.  Perform a standard BST insertion, coloring the new node **red**.
    2.  If this insertion violates any Red-Black properties (typically the Red Property if the parent is also red, or the Root Property if the new node is the root), call an \`insertFixup\` procedure.
    3.  **\`insertFixup\`**: This procedure uses a series of **recolorings** and **rotations** (left rotation, right rotation) to restore the Red-Black properties. It iteratively moves up the tree, considering different cases based on the color of the new node's parent, uncle (parent's sibling), and grandparent.
        *   **Case 1 (Uncle is RED)**: Recolor parent, uncle to BLACK, grandparent to RED. Move up to grandparent.
        *   **Case 2 (Uncle is BLACK, new node is an "inner" child - forms a triangle)**: Rotate parent to make it a "line" case. This transforms into Case 3.
        *   **Case 3 (Uncle is BLACK, new node is an "outer" child - forms a line)**: Recolor parent and grandparent, then rotate grandparent.
    4.  Finally, the root is always colored black.

-   **Deletion**:
    1.  Perform a standard BST deletion. The node physically removed might be the target node (if it has 0 or 1 child) or its inorder successor (if it has 2 children). Let \`y\` be the node spliced out, and \`x\` be the child that takes \`y\`'s original position (can be NIL).
    2.  If the color of \`y\` (the effectively removed node or its replacement's original color if values were moved) was **BLACK**, the Red-Black properties might be violated (specifically, the Black-Height property or the Root Property if \`x\` is the new root and red). Call a \`deleteFixup\` procedure on \`x\`.
    3.  **\`deleteFixup\`**: This is more complex than insert fixup, involving cases based on the color of \`x\` and its sibling \`w\`, and the colors of \`w\`'s children. It also uses recolorings and rotations to restore properties.
        *   Various cases handle scenarios where \`x\`'s sibling \`w\` is red or black, and the colors of \`w\`'s children.
    4.  If \`x\` is red at the end of the loop or initially, it's simply colored black to ensure black-height.

### Advantages:
-   **Guaranteed O(log N) worst-case time complexity** for search, insert, and delete.
-   Generally good performance in practice.
-   Less rigidly balanced than AVL trees, so insertions and deletions may require fewer rotations on average, though the fixup logic can be more complex.

### Disadvantages:
-   Implementation is significantly more complex than standard BSTs or even AVL trees due to the number of cases in fixup procedures.
-   Higher constant factors in operations compared to BSTs (but better worst-case).

### Common Use Cases:
-   The underlying data structure for many standard library implementations of ordered maps and sets (e.g., \`std::map\` and \`std::set\` in C++, \`TreeMap\` and \`TreeSet\` in Java).
-   CPU process schedulers (e.g., Completely Fair Scheduler in Linux uses RBTs).
-   Anywhere an ordered collection with guaranteed logarithmic time performance for modifications and lookups is needed.
`,
  timeComplexities: {
    best: "O(log n) for Search, Insert, Delete",
    average: "O(log n) for Search, Insert, Delete",
    worst: "O(log n) for Search, Insert, Delete (guaranteed)"
  },
  spaceComplexity: "O(n) for storage. O(log n) for recursion stack if recursive implementations are used for fixups (though often iterative).",
};
