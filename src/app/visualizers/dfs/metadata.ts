
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'dfs',
  title: 'Depth-First Search (DFS)',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Traverses a graph by exploring as far as possible along each branch before backtracking. Used for pathfinding, cycle detection, and topological sorting.',
  longDescription: `Depth-First Search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at a chosen root node (or an arbitrary node in a graph, often called the "source" node) and explores as far as possible along each branch before backtracking. This means it goes deep into one path, and when it can go no further (reaches a dead end or an already visited node in the current path), it backtracks to the previous node to explore other unvisited branches.

### How it Works (Graph Traversal):

**Core Idea**: Prioritize depth. Explore one branch completely before moving to another.

**Recursive Approach (Common for Conceptual Understanding):**
1.  **Initialization**:
    *   Pick a starting vertex \`u\`.
    *   Maintain a \`visited\` set or array to keep track of visited vertices to avoid processing them multiple times and to prevent infinite loops in cyclic graphs.
2.  **DFSUtil(\`u\`)**:
    a.  Mark vertex \`u\` as visited.
    b.  Process vertex \`u\` (e.g., add it to a traversal list, check a property).
    c.  For each adjacent vertex \`v\` of \`u\`:
        i.  If \`v\` has not been visited, recursively call \`DFSUtil(v)\`.
3.  **Handling Disconnected Graphs**: If the graph might be disconnected, the main DFS function will iterate through all vertices. If a vertex hasn't been visited yet, it calls \`DFSUtil\` on it to start a new traversal from that component.

**Iterative Approach (Using a Stack):**
This is often preferred for very deep graphs to avoid stack overflow errors that can occur with deep recursion.
1.  **Initialization**:
    *   Create an empty stack.
    *   Create a \`visited\` set.
    *   Push the starting vertex \`s\` onto the stack.
2.  **Loop**: While the stack is not empty:
    a.  Pop a vertex \`u\` from the top of the stack.
    b.  If \`u\` has not been visited:
        i.  Mark \`u\` as visited.
        ii. Process \`u\`.
        iii.For each neighbor \`v\` of \`u\` (often pushed in reverse order of how they appear in the adjacency list to mimic the path taken by recursive DFS):
            - If \`v\` has not been visited, push \`v\` onto the stack.
3.  **Handling Disconnected Graphs**: Similar to the recursive approach, iterate through all vertices and start an iterative DFS if a vertex is unvisited.

### Example: Graph \`A-B, A-C, B-D, C-D\` starting at A (Iterative with stack)
1.  Stack: \`[A]\`, Visited: \`{}\`
2.  Pop A. Stack: \`[]\`. Visited: \`{A}\`. Process A. Neighbors of A are B, C. Push C, then B (to process B first). Stack: \`[C, B]\`
3.  Pop B. Stack: \`[C]\`. Visited: \`{A, B}\`. Process B. Neighbors of B are A, D. A is visited. Push D. Stack: \`[C, D]\`
4.  Pop D. Stack: \`[C]\`. Visited: \`{A, B, D}\`. Process D. Neighbors of D are B, C. B is visited. C is not (yet processed from stack). Push C. Stack: \`[C, C]\` (or just \`[C]\` if only pushing if unvisited).
5.  Pop C. Stack: \`[C]\`. Visited: \`{A, B, D, C}\`. Process C. Neighbors of C are A, D. Both visited.
6.  Pop C (if duplicate was pushed). Stack: \`[]\`. C already visited.
7.  Stack empty. Traversal order (processing order): A, B, D, C.

### Characteristics:
-   **Path Exploration**: Tends to find longer paths quickly.
-   **Backtracking**: Fundamental to its operation.
-   **Memory Usage (Stack)**: Can be O(V) in the worst case for the recursion stack (e.g., a path graph) or the explicit stack.
-   **Completeness**: Will find all reachable nodes from a source.

### Advantages:
-   **Simpler to Implement Recursively**: The recursive version is often very concise.
-   **Space Efficient (Sometimes)**: If the graph is "bushy" and not very deep, the stack depth might be less than the breadth of a BFS queue.
-   **Good for Path Finding**: If a solution is expected to be deep in the search space.
-   **Foundation for Other Algorithms**: Used in topological sort, finding strongly connected components, cycle detection.

### Disadvantages:
-   **Not for Shortest Paths**: Does not guarantee finding the shortest path in unweighted graphs (BFS does).
-   **Potential Stack Overflow**: Recursive implementations can lead to stack overflow on very deep graphs.

### Common Use Cases:
-   **Finding Paths**: Determining if a path exists between two nodes.
-   **Cycle Detection**: Identifying cycles in both directed and undirected graphs (by checking for back-edges).
-   **Topological Sorting**: Ordering vertices in a Directed Acyclic Graph (DAG).
-   **Finding Connected Components**: Grouping vertices that are reachable from each other (especially Strongly Connected Components in directed graphs).
-   **Solving Puzzles**: Such as mazes or Sudoku.
-   **Generating Permutations/Combinations**: By exploring a decision tree.

The AlgoVista DFS visualizer typically shows the iterative stack-based approach, highlighting the current node being processed, the contents of the stack, and the set of visited nodes.
`,
  timeComplexities: { best: "O(1) (source is target/first node if only pathfinding)", average: "O(V+E)", worst: "O(V+E)" },
  spaceComplexity: "O(V) for recursion stack (worst case, skewed tree/path graph) or explicit stack.",
};

