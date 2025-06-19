
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'lowest-common-ancestor',
  title: 'Lowest Common Ancestor (LCA)',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'Finds the lowest node in a tree that has two given nodes as descendants.',
  longDescription: `The Lowest Common Ancestor (LCA) of two nodes \`p\` and \`q\` in a tree is the lowest (deepest) node that has both \`p\` and \`q\` as descendants (where we allow a node to be a descendant of itself). Finding the LCA is a common problem in tree data structures with various applications.

### Approaches for Binary Trees (as visualized):

**1. Path Finding (Visualized by AlgoVista for general Binary Trees):**
   -   **Find Paths**: Perform two separate traversals (e.g., Depth-First Search) from the root to find the path to node \`p\` and the path to node \`q\`. Store these paths as sequences of nodes.
   -   **Compare Paths**: Iterate through both paths simultaneously, starting from the root. The last node that is common to both paths is the LCA.
   -   **Time Complexity**: O(N) in the worst case to find both paths (N is the number of nodes). Comparing paths takes O(H) where H is the height of the tree. So, overall O(N).
   -   **Space Complexity**: O(H) to store the paths and for the recursion stack during DFS. In the worst case (skewed tree), H can be N.

**2. Recursive Single Pass Approach (More Common for interviews/general binary trees):**
   -   **Base Cases**:
       *   If the current node is \`null\`, return \`null\`.
       *   If the current node's value is equal to \`p.value\` or \`q.value\`, return the current node (as a node can be an ancestor of itself).
   -   **Recursive Calls**:
       *   Recursively search for \`p\` and \`q\` in the left subtree (\`left_lca\`).
       *   Recursively search for \`p\` and \`q\` in the right subtree (\`right_lca\`).
   -   **Determine LCA**:
       *   If both \`left_lca\` and \`right_lca\` are non-null, it means \`p\` is in one subtree and \`q\` is in the other. Thus, the current node is the LCA. Return the current node.
       *   If only \`left_lca\` is non-null, it means both \`p\` and \`q\` are in the left subtree (or one of them is the current node and the other is in the left). Return \`left_lca\`.
       *   If only \`right_lca\` is non-null, similarly return \`right_lca\`.
       *   If both are \`null\`, neither \`p\` nor \`q\` was found in the subtrees of the current node. Return \`null\`.
   -   **Time Complexity**: O(N), as it visits each node at most once.
   -   **Space Complexity**: O(H) for the recursion stack.

### Approaches for Binary Search Trees (BSTs):
Because of the BST property, the LCA can be found more efficiently (without finding full paths):
-   Start from the root.
-   If both \`p.value\` and \`q.value\` are smaller than the current node's value, the LCA must be in the left subtree. Recurse on the left child.
-   If both \`p.value\` and \`q.value\` are larger than the current node's value, the LCA must be in the right subtree. Recurse on the right child.
-   Otherwise (if the current node's value is between \`p.value\` and \`q.value\`, or if the current node is \`p\` or \`q\`), the current node is the LCA.
-   **Time Complexity**: O(H), which is O(log N) for a balanced BST and O(N) for a skewed BST.
-   **Space Complexity**: O(H) for recursion stack (or O(1) for iterative version).

### Advanced Techniques (for general trees and many queries, not typically visualized at introductory level):
-   **Euler Tour + Range Minimum Query (RMQ)**: Preprocess the tree to find an Euler tour (a path that traverses each edge twice) and the depths of nodes at each point in the tour. LCA queries can then be answered in O(1) time after O(N log N) or O(N) preprocessing for the RMQ data structure.
-   **Binary Lifting (Sparse Table)**: Precompute \`parent[i][j]\` (the 2^j-th ancestor of node \`i\`). After O(N log N) preprocessing, LCA of two nodes can be found in O(log N) time per query by "lifting" pointers.

### Common Use Cases:
-   Analyzing phylogenetic trees (evolutionary relationships).
-   Network routing (finding common meeting points or routers).
-   File system hierarchies (finding the nearest common directory for two files).
-   Computational biology (e.g., comparing gene sequences).

AlgoVista's visualizer primarily demonstrates the **Path Finding** approach for general binary trees.
`,
  timeComplexities: { 
      best: "Path Finding: O(N), Recursive Single Pass: O(N), BST: O(H)", 
      average: "Path Finding: O(N), Recursive Single Pass: O(N), BST (balanced): O(log N)", 
      worst: "Path Finding: O(N), Recursive Single Pass: O(N), BST (skewed): O(N)" 
  },
  spaceComplexity: "Path Finding/Recursive: O(H) for recursion stack. Preprocessing methods have higher space.",
};
