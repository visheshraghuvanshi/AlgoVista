
import type { AlgorithmMetadata } from './types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'morris-traversal',
  title: 'Morris Traversal (Inorder)',
  category: 'Trees',
  difficulty: 'Hard',
  description: 'An in-place binary tree traversal algorithm that uses O(1) extra space (excluding output) by temporarily modifying tree pointers to create "threads".',
  longDescription: `Morris Traversal is a clever tree traversal algorithm (most commonly for Inorder, but adaptable for Preorder) that achieves O(1) auxiliary space complexity, meaning it doesn't use recursion (which uses call stack space) or an explicit stack. It does this by temporarily modifying the tree structure to create "threads" that allow it to find its way back up the tree after visiting a left subtree.

### How Morris Inorder Traversal Works:
The core idea is to find the inorder predecessor of the current node. The inorder predecessor is the rightmost node in the left subtree of the current node.

1.  **Initialization**: Start with \`current = root\`. Initialize an empty list for the traversal result.

2.  **Main Loop**: While \`current\` is not null:
    a.  **No Left Child**: If \`current.left\` is null:
        i.  Visit \`current\` (add its value to the result).
        ii. Move to the right child: \`current = current.right\`.
    b.  **Has Left Child**: If \`current.left\` is not null:
        i.  **Find Inorder Predecessor**: Start from \`current.left\` and go as far right as possible without going back to \`current\` (if a thread already exists). Let this be \`predecessor\`.
            \`predecessor = current.left;\`
            \`while (predecessor.right !== null && predecessor.right !== current)\`
                \`predecessor = predecessor.right;\`
        ii. **Establish or Remove Thread**:
            -   **If \`predecessor.right\` is null (No thread exists)**:
                1.  Create a thread: \`predecessor.right = current\`.
                2.  Move to the left child to process the left subtree: \`current = current.left\`.
            -   **If \`predecessor.right\` is \`current\` (Thread exists, meaning left subtree is processed)**:
                1.  Remove the thread: \`predecessor.right = null\`.
                2.  Visit \`current\` (add its value to the result).
                3.  Move to the right child to process the right subtree: \`current = current.right\`.

3.  **Result**: The traversal is complete when \`current\` becomes null. The accumulated list contains the inorder sequence.

### Why it Works:
-   When \`current\` has a left child, the algorithm finds its inorder predecessor.
-   If no thread exists from the predecessor to \`current\`, a thread is created (\`predecessor.right = current\`), and the algorithm moves to \`current.left\` to process the left subtree.
-   When the left subtree is fully processed, the traversal will eventually return to \`current\` via the thread established on the predecessor.
-   At this point, the thread (\`predecessor.right = current\`) is detected. This signals that the left subtree of \`current\` has been visited. Now, \`current\` itself is visited, the thread is removed (restoring the tree structure), and the algorithm moves to \`current.right\`.

### Characteristics:
-   **In-Place (Space)**: O(1) auxiliary space (if we don't count the output list). The tree pointers are modified but restored.
-   **Time Complexity**: O(N) because each edge is traversed at most twice (once to go down, once to go up via thread or normal parent link which is implicit). Finding the predecessor for each node with a left child takes time, but it's amortized across the traversal. Each node is effectively visited a constant number of times.
-   **Complex Pointer Manipulation**: More complex to understand and implement than standard recursive or stack-based traversals due to the pointer modifications and restorations.

### Advantages:
-   **Space Efficiency**: The primary advantage is O(1) auxiliary space.

### Disadvantages:
-   **Complexity**: Harder to implement correctly.
-   **Temporarily Modifies Tree**: The tree structure is altered during traversal, which might be an issue if the tree is being accessed concurrently (though not typical for basic traversal scenarios).

### Use Cases:
-   Situations where stack space is extremely limited (e.g., embedded systems with small memory).
-   When an in-place, stackless traversal is a strict requirement.
-   As an advanced tree traversal technique to understand.

The AlgoVista visualizer for Morris Traversal shows the \`current\` pointer, the process of finding the inorder predecessor, the creation and removal of threads (temporary links), and the order in which nodes are visited.
`,
  timeComplexities: {
    best: "O(N)",
    average: "O(N)",
    worst: "O(N)",
  },
  spaceComplexity: "O(1) (excluding space for output list). Tree pointers are modified temporarily.",
};

    