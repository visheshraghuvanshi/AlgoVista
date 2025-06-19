
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'binary-tree-traversal',
  title: 'Binary Tree Traversals',
  category: 'Trees',
  difficulty: 'Medium', // Difficulty can be subjective; some consider core traversals easy, but understanding recursion/stack usage is medium.
  description: 'Explores nodes of a binary tree in specific orders: Inorder, Preorder, and Postorder. Interactive step-by-step visualization available.',
  longDescription: `Binary tree traversal is the process of visiting (e.g., checking, updating, or printing) each node in a tree data structure, exactly once, in a systematic way. For binary trees, there are several common ways to traverse the nodes, primarily categorized as Depth-First Traversals (DFS) and Breadth-First Traversal (BFS). This visualizer focuses on the three main DFS traversals.

### Core Idea of DFS Traversals:
Depth-First Search explores as far as possible along each branch before backtracking.

**1. Inorder Traversal (Left, Root, Right)**
   - **Algorithm**:
     1.  Recursively traverse the left subtree.
     2.  Visit the current (root) node.
     3.  Recursively traverse the right subtree.
   - **Order of Visit**: Left Child -> Root -> Right Child.
   - **Use Case**: For a Binary Search Tree (BST), an inorder traversal visits the nodes in non-decreasing (sorted) order of their values. This is very useful for verifying BST properties or extracting elements in sorted sequence.
   - **Example**: For a tree with root 5, left child 3, right child 8:
     - Visit left subtree of 3 (if any)
     - Visit 3
     - Visit right subtree of 3 (if any)
     - Visit 5 (root)
     - Visit left subtree of 8 (if any)
     - Visit 8
     - Visit right subtree of 8 (if any)

**2. Preorder Traversal (Root, Left, Right)**
   - **Algorithm**:
     1.  Visit the current (root) node.
     2.  Recursively traverse the left subtree.
     3.  Recursively traverse the right subtree.
   - **Order of Visit**: Root -> Left Child -> Right Child.
   - **Use Cases**:
     *   Creating a copy of the tree (prefix copy).
     *   Obtaining the prefix expression (Polish notation) of an expression tree.
     *   Used in some algorithms where processing the parent before children is important (e.g., pathfinding from root).

**3. Postorder Traversal (Left, Right, Root)**
   - **Algorithm**:
     1.  Recursively traverse the left subtree.
     2.  Recursively traverse the right subtree.
     3.  Visit the current (root) node.
   - **Order of Visit**: Left Child -> Right Child -> Root.
   - **Use Cases**:
     *   Deleting a tree (you need to delete children before deleting the parent node to avoid dangling pointers or memory leaks).
     *   Obtaining the postfix expression (Reverse Polish notation) of an expression tree.
     *   Used in computations where children's values are needed before the parent's value can be determined.

### Implementation:
-   **Recursive**: The most natural way to implement DFS traversals due to their inherent recursive definition. The call stack implicitly manages the backtracking.
-   **Iterative (using a Stack)**: DFS traversals can also be implemented iteratively using an explicit stack to mimic the behavior of the recursion call stack.
    *   *Preorder (Iterative)*: Push root. While stack not empty: pop, visit, push right child, push left child.
    *   *Inorder (Iterative)*: Push nodes while going left. When null, pop, visit, go right.
    *   *Postorder (Iterative)*: Can be done using two stacks, or one stack with a trick (process root after both children, e.g., push root, then root.right, then root.left, then process in reverse of what's popped; or mark visited state).

### Time and Space Complexity (for all three DFS traversals):
-   **Time Complexity**: O(N), where N is the number of nodes in the tree, because each node is visited exactly once.
-   **Space Complexity**:
    *   **Recursive**: O(H) in the average case (for a balanced tree) and O(N) in the worst case (for a skewed tree, where H is the height of the tree), due to the recursion call stack.
    *   **Iterative**: O(H) or O(N) for the explicit stack, similar to the recursive version.

AlgoVista provides visualizations that step through the recursive calls and node visits for Inorder, Preorder, and Postorder traversals.
`,
  timeComplexities: {
    best: "O(N)",
    average: "O(N)",
    worst: "O(N)",
  },
  spaceComplexity: "O(H) for recursion stack, where H is the height of the tree. In the worst case (skewed tree), H can be N. Iterative traversals using an explicit stack also take O(H) space.",
};
