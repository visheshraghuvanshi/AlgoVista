
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'graph-cycle-detection',
  title: 'Graph Cycle Detection',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Detects cycles in directed and undirected graphs using algorithms like DFS.',
  longDescription: `Cycle detection is a fundamental problem in graph theory. An algorithm for cycle detection aims to determine if a given graph contains at least one cycle—a path that starts and ends at the same vertex, traversing distinct edges. The approach to detect cycles differs between undirected and directed graphs.

### Undirected Graphs
In an undirected graph, a cycle exists if, during a Depth-First Search (DFS) traversal, we encounter a vertex that is already visited and is **not** the parent of the current vertex in the DFS tree.
This indicates a "back edge" to an already visited ancestor that isn't the immediate parent, thus forming a cycle.

**DFS Approach for Undirected Graphs:**
1.  **Initialization**:
    *   Maintain a \`visited\` array/set to keep track of visited vertices.
    *   For each vertex \`u\`, if it hasn't been visited, start a DFS from \`u\`.
2.  **DFSUtil(\`u\`, \`parent\`)**:
    a.  Mark \`u\` as visited.
    b.  For each neighbor \`v\` of \`u\`:
        i.  If \`v\` has not been visited:
            - Recursively call \`DFSUtil(v, u)\`. If this call returns \`true\` (cycle found), then propagate \`true\`.
        ii. Else if \`v\` is visited **and** \`v\` is not the \`parent\` of \`u\`:
            - A cycle is detected. Return \`true\`.
    c.  If no cycle is found through \`u\`'s neighbors, return \`false\`.
3.  If the DFS completes for all components without returning \`true\`, the graph is acyclic.

**Union-Find (Disjoint Set Union) Approach for Undirected Graphs:**
1. Iterate through all edges (u, v) of the graph.
2. For each edge, if find(u) == find(v) (i.e., u and v are already in the same set/component), then adding this edge forms a cycle.
3. Otherwise, perform union(u, v).
This is often used in algorithms like Kruskal's to avoid adding edges that form cycles.

### Directed Graphs
In a directed graph, a cycle exists if DFS encounters a "back edge"—an edge pointing from the current node to an ancestor node that is still in the current recursion stack (i.e., its DFS call has not yet finished).

**DFS Approach for Directed Graphs:**
1.  **Initialization**:
    *   Maintain a \`visited\` array/set (marks nodes for which DFS has completed or started).
    *   Maintain a \`recursionStack\` array/set (marks nodes currently in the recursion path of the active DFS traversal).
2.  **DFSUtil(\`u\`)**:
    a.  Mark \`u\` as visited AND add \`u\` to the \`recursionStack\`.
    b.  For each neighbor \`v\` of \`u\`:
        i.  If \`v\` has not been visited:
            - Recursively call \`DFSUtil(v)\`. If this call returns \`true\` (cycle found), propagate \`true\`.
        ii. Else if \`v\` is currently in the \`recursionStack\`:
            - A cycle is detected (back edge to an ancestor in the current DFS path). Return \`true\`.
    c.  Remove \`u\` from the \`recursionStack\` (as DFS for \`u\` and its descendants is complete for this path).
    d.  Return \`false\`.
3.  **Main Loop**: Iterate through all vertices. If a vertex \`i\` is not visited, call \`DFSUtil(i)\`. If any call returns \`true\`, a cycle exists.

### Characteristics:
-   **DFS is Key**: Both approaches heavily rely on Depth-First Search.
-   **State Tracking**: Requires careful tracking of node states (visited, parent in DFS tree for undirected; visited, recursion stack for directed).

### Time and Space Complexity (using DFS):
-   **Time Complexity**: O(V+E), where V is the number of vertices and E is the number of edges, as DFS visits each vertex and edge once.
-   **Space Complexity**: O(V) for storing the \`visited\` and \`recursionStack\` arrays/sets, and for the recursion call stack depth in the worst case (e.g., a path graph).

### Use Cases:
-   **Prerequisite for Topological Sort**: Topological sort is only possible on Directed Acyclic Graphs (DAGs). Cycle detection is the first step.
-   **Detecting Deadlocks**: In operating systems or concurrent programming, resource allocation graphs can be checked for cycles to find deadlocks.
-   **Dependency Analysis**: In build systems or software engineering, circular dependencies indicate an unresolvable build order.
-   **Network Routing**: Detecting routing loops.
-   **General Graph Analysis**: Understanding the structure and properties of a graph.

The AlgoVista visualizer demonstrates the DFS-based approaches for both undirected and directed graphs, highlighting the visited nodes, recursion stack (for directed), and the back edge that forms a cycle.
`,
  timeComplexities: {
    best: "O(V+E) using DFS",
    average: "O(V+E) using DFS",
    worst: "O(V+E) using DFS",
  },
  spaceComplexity: "O(V) for visited array and recursion stack (DFS). For Union-Find, O(V) for parent array.",
};

