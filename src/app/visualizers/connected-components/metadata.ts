
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'connected-components',
  title: 'Connected Components & SCCs',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Finds sets of interconnected vertices in an undirected graph, or Strongly Connected Components (SCCs) in a directed graph using Kosaraju\'s Algorithm.',
  longDescription: `Connected Components (CCs) and Strongly Connected Components (SCCs) are fundamental concepts in graph theory that describe how vertices in a graph are connected to each other.

### Undirected Graphs: Connected Components
In an **undirected graph**, a **connected component** is a subgraph in which any two vertices are connected to each other by paths, and which is connected to no additional vertices in the supergraph. In simpler terms, it's a part of the graph where you can reach any node from any other node within that part. An undirected graph can be composed of one or more disjoint connected components.

**Algorithm to Find Connected Components (using DFS or BFS):**
1.  **Initialization**:
    *   Maintain a \`visited\` array/set for all vertices, initialized to false.
    *   Initialize an empty list to store all found components (e.g., \`componentsList\`).
2.  **Iterate Through Vertices**: For each vertex \`u\` from 0 to V-1:
    a.  If \`u\` has not been visited:
        i.  Start a new graph traversal (DFS or BFS) from \`u\`.
        ii. All vertices reachable from \`u\` during this traversal belong to the same connected component.
        iii.Store these vertices as a new component in \`componentsList\`.
        iv. Mark all these visited vertices in the \`visited\` array.
3.  **Result**: \`componentsList\` will contain all connected components of the graph.
-   **Time Complexity**: O(V+E) because DFS/BFS visits each vertex and edge once.
-   **Space Complexity**: O(V+E) for graph representation, O(V) for visited array and recursion stack/queue.

### Directed Graphs: Strongly Connected Components (SCCs)
In a **directed graph**, a **Strongly Connected Component (SCC)** is a subgraph where for any pair of vertices \`u\` and \`v\` in the SCC, there is a directed path from \`u\` to \`v\` AND a directed path from \`v\` to \`u\`.

**Kosaraju's Algorithm to Find SCCs:**
This is a popular algorithm that uses two DFS passes.
1.  **First DFS Pass (on original graph G)**:
    a.  Perform a DFS traversal on the original graph G.
    b.  As each DFS recursive call for a vertex finishes, add that vertex to a stack (or list that acts like a stack). This effectively orders vertices by their finishing times (latest finishing time at the top of the stack).
2.  **Compute Transpose Graph (G_T)**:
    a.  Create a new graph G_T by reversing the direction of all edges in the original graph G.
3.  **Second DFS Pass (on G_T)**:
    a.  Initialize a \`visited\` array for G_T as all false.
    b.  While the stack (from step 1b) is not empty:
        i.  Pop a vertex \`u\` from the stack.
        ii. If \`u\` has not been visited in G_T:
            - Start a DFS traversal from \`u\` in the **transpose graph G_T**.
            - All vertices reachable from \`u\` in this DFS on G_T form a single Strongly Connected Component.
            - Store this component and mark its vertices as visited.
4.  **Result**: The collection of components found in step 3b constitutes all SCCs of the graph.
-   **Time Complexity**: O(V+E) (two DFS passes and graph transpose).
-   **Space Complexity**: O(V+E).

**Tarjan's Algorithm for SCCs:**
Another algorithm that finds SCCs in O(V+E) time using a single DFS pass. It maintains discovery times and low-link values for nodes to identify SCCs. It's often considered more complex to implement than Kosaraju's.

### Use Cases:
-   **Network Analysis**: Identifying clusters, reachability, or isolated parts of a network.
-   **Social Network Analysis**: Finding communities or groups.
-   **Prerequisite for other algorithms**: Many graph algorithms assume a connected graph or operate on individual components.
-   **Directed Graph Analysis**: SCCs can reveal cyclic dependencies or parts of a system where components are mutually dependent (e.g., in program call graphs or state machines). 2-SAT problem solutions often involve finding SCCs.

The AlgoVista visualizer for "Connected Components & SCCs" demonstrates the DFS-based approach for undirected graphs and Kosaraju's algorithm for directed graphs, showing the traversal, component formation, and relevant auxiliary data structures like the visited set and recursion stack/finishing order stack.
`,
  timeComplexities: {
    best: "O(V+E) for both undirected CC (DFS/BFS) and directed SCCs (Kosaraju's)",
    average: "O(V+E)",
    worst: "O(V+E)",
  },
  spaceComplexity: "O(V+E) for graph representation, O(V) for visited array/stack/recursion.",
};

