
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'kruskals-algorithm',
  title: "Kruskal's Algorithm",
  category: 'Graphs',
  difficulty: 'Medium',
  description: "Finds a minimum spanning tree (MST) for a connected, undirected graph by adding edges in increasing order of weight, avoiding cycles.",
  longDescription: `Kruskal's algorithm is a greedy algorithm that finds a Minimum Spanning Tree (MST) for a connected, weighted, and undirected graph. An MST is a subgraph that connects all vertices together, without any cycles, and with the minimum possible total edge weight. If the graph is not connected, Kruskal's algorithm finds a Minimum Spanning Forest (a collection of MSTs, one for each connected component).

### How it Works:
The algorithm processes edges in increasing order of their weights. For each edge, it decides whether adding it to the current set of chosen edges (which form the MST being built) will create a cycle. If it doesn't create a cycle, the edge is added; otherwise, it's discarded.

1.  **Sort Edges**: Create a list of all edges in the graph. Sort these edges in non-decreasing order of their weights.
2.  **Initialize MST**: Start with an empty set of edges for the MST.
3.  **Initialize Disjoint Set Union (DSU)**: Create a DSU data structure where each vertex initially belongs to its own separate set (component). The DSU will be used to efficiently check if adding an edge connects two previously disconnected components or if it would form a cycle within an existing component.
4.  **Iterate Through Sorted Edges**: For each edge \`(u, v)\` with weight \`w\` in the sorted list:
    a.  **Check for Cycle**: Use the DSU's \`find\` operation to determine the sets (representatives or roots) of vertices \`u\` and \`v\`.
        *   Let \`rootU = find(u)\` and \`rootV = find(v)\`.
    b.  **Add to MST if No Cycle**: If \`rootU\` is not equal to \`rootV\`, it means vertices \`u\` and \`v\` belong to different connected components. Adding the edge \`(u, v)\` will not form a cycle.
        i.  Add the edge \`(u, v)\` to the MST.
        ii. Perform the \`union(u, v)\` operation in the DSU to merge the two components connected by this edge.
        iii. Increment a counter for the number of edges added to the MST.
    c.  If \`rootU == rootV\`, adding edge \`(u, v)\` would form a cycle, so discard this edge.
5.  **Termination**: Repeat step 4 until \`V-1\` edges have been added to the MST (where \`V\` is the number of vertices in the graph). If the graph is connected, this will result in a complete MST. If fewer than \`V-1\` edges are added after considering all edges, the original graph was not connected.

### Key Data Structure: Disjoint Set Union (DSU)
-   **\`find(i)\`**: Returns the representative (root) of the set containing element \`i\`. Path compression optimization is often used here.
-   **\`union(i, j)\`**: Merges the sets containing elements \`i\` and \`j\`. Union by rank or union by size optimizations are used to keep the DSU trees flat, ensuring nearly constant time for operations on average.

### Characteristics:
-   **Greedy Algorithm**: At each step, it greedily picks the smallest weight edge that doesn't form a cycle.
-   **Works on Undirected Graphs**: Suitable for finding MSTs in undirected graphs.
-   **Output**: A set of edges that form the MST.

### Time and Space Complexity:
-   **Time Complexity**: Dominated by sorting the edges, which is O(E log E). The DSU operations (E calls to \`find\` and up to V-1 calls to \`union\`) with path compression and union by rank/size take nearly constant time on average, so their total contribution is roughly O(E α(V)), where α is the very slow-growing inverse Ackermann function (effectively O(E)). Thus, overall complexity is typically O(E log E) or O(E log V) if E is much larger than V.
-   **Space Complexity**: O(V+E) for storing the graph (edges and vertices) and O(V) for the DSU data structure.

### Advantages:
-   Conceptually simpler than Prim's algorithm for some.
-   Can be very efficient, especially for sparse graphs where E is not much larger than V.
-   Easily adaptable to finding MSTs in disconnected graphs (results in a Minimum Spanning Forest).

### Disadvantages:
-   Requires sorting all edges first, which can be the bottleneck.

### Common Use Cases:
-   **Network Design**: Connecting a set of points (e.g., cities, computers) with a network of minimum total length/cost.
-   **Clustering**: Can be used in algorithms like single-linkage clustering.
-   **Approximation Algorithms**: For problems like the Steiner Tree problem.
-   Circuit design and image segmentation.

The AlgoVista visualizer shows the edges being considered in sorted order and the DSU sets merging as edges are added to the MST.
`,
  timeComplexities: { 
    best: "O(E log E) or O(E log V) due to edge sorting", 
    average: "O(E log E) or O(E log V)", 
    worst: "O(E log E) or O(E log V)" 
  },
  spaceComplexity: "O(V+E) for storing graph and DSU structure.",
};
