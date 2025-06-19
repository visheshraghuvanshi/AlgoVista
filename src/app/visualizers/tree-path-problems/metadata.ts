
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'tree-path-problems',
  title: 'Tree Path Sum (Root-to-Leaf)',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'Finds if a root-to-leaf path exists in a binary tree such that the sum of node values along the path equals a given target sum.',
  longDescription: `The Root-to-Leaf Path Sum problem is a common tree traversal challenge where the goal is to determine if there exists a path from the root node to any leaf node such that the sum of the values of all nodes along that path equals a given target sum.

A **leaf node** is defined as a node that has no children (both its left and right child pointers are null).

### How it Works (DFS-based Recursive Approach):

The problem is typically solved using a Depth-First Search (DFS) traversal. The core idea is to explore each possible root-to-leaf path while keeping track of the sum of node values encountered so far along the current path.

1.  **Base Cases for Recursion**:
    *   If the current node is \`null\` (i.e., we've gone beyond a leaf or the tree is empty), this path is invalid. Return \`false\`.
    *   If the current node is a **leaf node**:
        *   Check if the current node's value, when added to the sum accumulated so far from its ancestors, equals the \`targetSum\`. (Alternatively, subtract the current node's value from the \`targetSum\` passed down and check if the result is 0 at the leaf).
        *   If it matches, a valid path is found. Return \`true\`.
        *   Otherwise, this leaf path doesn't sum to the target. Return \`false\`.

2.  **Recursive Step**:
    *   For a non-leaf node, subtract its value from the \`targetSum\` to get the \`remainingSum\` that needs to be found in its subtrees. (Or, if passing accumulated sum, add current node's value to it).
    *   Recursively call the path sum function for the left child, passing the \`remainingSum\` (or updated accumulated sum).
    *   Recursively call the path sum function for the right child, passing the \`remainingSum\` (or updated accumulated sum).
    *   If *either* of these recursive calls returns \`true\`, it means a path summing to the target was found in one of the subtrees. Therefore, the current node is part of a valid path. Return \`true\`.
    *   If both recursive calls return \`false\`, no such path exists through the current node. Return \`false\`.

### Example: Tree: Root=5, LeftChild=4, RightChild=8, TargetSum=22
Path to P for 22 (example from LeetCode 112):
\`\`\`
    5
   / \\
  4   8
 /   / \\
11  13  4
/ \\      \\
7   2      1
\`\`\`
Target Sum = 22

1.  \`hasPathSum(node=5, currentPathSum=0, target=22)\`: \`currentPathSum + 5 = 5\`. Try children with remaining target \`22-5=17\`.
2.  Call \`hasPathSum(node=4, currentPathSum=5, target=22)\` (left): \`currentPathSum + 4 = 9\`. Try children with remaining target \`22-9=13\`.
3.  Call \`hasPathSum(node=11, currentPathSum=9, target=22)\` (left-left): \`currentPathSum + 11 = 20\`. Try children with remaining target \`22-20=2\`.
4.  Call \`hasPathSum(node=7, currentPathSum=20, target=22)\` (left-left-left): Leaf. \`currentPathSum + 7 = 27\`. \`27 != 22\`. Return \`false\`.
5.  Call \`hasPathSum(node=2, currentPathSum=20, target=22)\` (left-left-right): Leaf. \`currentPathSum + 2 = 22\`. \`22 == 22\`. Return \`true\`.
6.  Since call for node 2 returned \`true\`, node 11 returns \`true\`.
7.  Since call for node 11 returned \`true\`, node 4 returns \`true\`.
8.  Since call for node 4 returned \`true\`, node 5 returns \`true\`.
Result: Path exists (e.g., 5 -> 4 -> 11 -> 2).

### Characteristics:
-   **DFS Traversal**: Explores each branch fully before backtracking.
-   **State Management**: The key is to manage the \`currentSum\` or \`remainingSum\` correctly as the recursion unwinds.

### Advantages:
-   Relatively straightforward to implement using recursion.
-   Visits each node at most once, leading to efficient time complexity.

### Disadvantages:
-   The recursive approach uses stack space proportional to the height of the tree, which can be O(N) in the worst case (for a skewed tree). An iterative DFS approach using an explicit stack can also be used.

### Common Use Cases:
-   Standard tree problem often asked in interviews.
-   Can be adapted to find all paths that sum to a target, or paths with max/min sums, etc.
-   Useful in scenarios where decisions are made based on accumulated values along a path in a hierarchical structure.

The AlgoVista visualizer for this problem shows the DFS traversal, the current path being explored, the sum accumulated so far (or remaining sum needed), and highlights the final path if one is found.
`,
  timeComplexities: {
    best: "O(N) in the best case (path found quickly).",
    average: "O(N) as it visits each node at most once.",
    worst: "O(N) as it visits each node at most once.",
  },
  spaceComplexity: "O(H) for recursion stack, where H is the height of the tree. In the worst case (skewed tree), H can be N.",
};
