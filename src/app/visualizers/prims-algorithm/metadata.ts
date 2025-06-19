
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'prims-algorithm',
  title: "Prim's Algorithm",
  category: 'Graphs',
  difficulty: 'Medium',
  description: "Finds a minimum spanning tree (MST) for a weighted undirected graph by growing the tree one edge at a time, starting from an arbitrary vertex.",
  longDescription: `Prim's algorithm is a greedy algorithm that finds a Minimum Spanning Tree (MST) for a connected, weighted, and undirected graph. An MST is a subgraph that connects all the vertices together, without any cycles and with the minimum possible total edge weight. If the graph is not connected, it finds an MST for one of the connected components.

### How it Works:
The algorithm builds the MST one vertex at a time, starting from an arbitrary vertex. At each step, it adds the cheapest possible connection (edge) from the set of vertices already in the MST to a vertex not yet in the MST.

1.  **Initialization**:
    *   Choose an arbitrary starting vertex (e.g., vertex 0).
    *   Initialize a \`key\` array (or map) to store the minimum weight of an edge connecting each vertex \`v\` to a vertex already in the MST. Set \`key[startVertex] = 0\` and \`key[v] = ∞\` for all other vertices \`v\`.
    *   Initialize a \`parent\` array (or map) to store the parent of each vertex in the MST. \`parent[startVertex] = null\` or -1.
    *   Initialize a boolean array \`mstSet[V]\` to keep track of vertices already included in the MST. All false initially.
    *   A min-priority queue (PQ) is used to efficiently select the vertex with the minimum key value that is not yet in the MST. Add the starting vertex to the PQ with key 0.

2.  **Iteration**: While the MST does not include all V vertices (or while the PQ is not empty and less than V-1 edges are in MST):
    a.  **Extract Minimum**: Extract the vertex \`u\` from the priority queue that has the minimum \`key\` value among all vertices not yet in \`mstSet\`.
    b.  **Add to MST**: Add vertex \`u\` to \`mstSet\`.
    c.  **Add Edge to MST Result**: If \`parent[u]\` is not null (i.e., \`u\` is not the start vertex), the edge \`(parent[u], u)\` with weight \`key[u]\` is part of the MST. Add it to the result.
    d.  **Update Neighbors**: For each neighbor \`v\` of \`u\`:
        i.  If \`v\` is not yet in \`mstSet\` AND the weight of the edge \`(u,v)\` is less than the current \`key[v]\`:
            -   Update \`key[v] = weight(u,v)\`.
            -   Set \`parent[v] = u\`.
            -   Add \`v\` to the priority queue with its new key \`key[v]\` (or update its priority if it's already in the PQ).

3.  **Completion**: The algorithm terminates when V-1 edges have been added to the MST (for a connected graph of V vertices) or when the PQ becomes empty.

### Characteristics:
-   **Greedy Algorithm**: At each step, it makes a locally optimal choice (picking the cheapest edge to an unvisited vertex).
-   **Works on Connected Graphs**: If the graph is not connected, it will find an MST for the connected component containing the start vertex.
-   **Undirected Graphs**: Typically applied to undirected graphs. For directed graphs, algorithms like Chu-Liu/Edmonds' algorithm are used for minimum spanning arborescences.

### Time and Space Complexity:
-   **Time Complexity**: Depends on the priority queue implementation:
    *   Using a binary heap (common): O(E log V) or O((V+E) log V).
    *   Using a Fibonacci heap: O(E + V log V) (better for dense graphs, but more complex).
    *   Using a simple array and linear scan for min key: O(V²).
-   **Space Complexity**: O(V+E) for graph representation, O(V) for key, parent, mstSet arrays, and the priority queue.

### Advantages:
-   Guaranteed to find an MST.
-   Relatively easy to understand the greedy approach.
-   Can be efficient with appropriate priority queue implementations.

### Disadvantages:
-   Performance can be slower than Kruskal's for very sparse graphs if a V² implementation is used or if edge sorting for Kruskal's is highly optimized.

### Common Use Cases:
-   **Network Design**: Designing networks (e.g., roads, pipelines, communication networks) to connect all points with minimum cost.
-   **Clustering**: Can be used as a step in some clustering algorithms.
-   **Approximation Algorithms**: For harder problems like the Traveling Salesperson Problem.
-   Circuit design.

The AlgoVista visualizer demonstrates Prim's algorithm, highlighting the current vertex being processed, edges being considered, and the growing MST.
`,
  timeComplexities: { 
    best: "O(E log V) with a binary heap, or O(E + V log V) with a Fibonacci heap.", 
    average: "O(E log V) with a binary heap.", 
    worst: "O(V^2) with adjacency matrix and no priority queue, or O(E log V) with binary heap." 
  },
  spaceComplexity: "O(V+E) for graph representation, O(V) for priority queue/visited set.",
};
