
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'floyd-warshall',
  title: 'Floyd-Warshall Algorithm',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Finds all-pairs shortest paths in a weighted directed graph with positive or negative edge weights (but no negative cycles).',
  longDescription: `The Floyd-Warshall algorithm is an algorithm for finding the shortest paths in a directed weighted graph with positive or negative edge weights (but no negative-weight cycles). A single execution of the algorithm will find the lengths (summed weights) of the shortest paths between **all pairs of vertices**. It's a dynamic programming algorithm.

### How it Works:
The core idea is to iteratively consider all possible intermediate vertices for each pair of source and destination vertices.

1.  **Initialization**:
    *   Let \`V\` be the number of vertices in the graph.
    *   Create a distance matrix \`dist[V][V]\`.
    *   For each pair of vertices \`(i, j)\`:
        *   If \`i == j\`, \`dist[i][j] = 0\` (distance from a vertex to itself is 0).
        *   If there is a direct edge from \`i\` to \`j\` with weight \`w\`, then \`dist[i][j] = w\`.
        *   Otherwise (no direct edge), \`dist[i][j] = ∞\` (infinity).

2.  **Main Iteration (Dynamic Programming)**:
    *   Iterate with an intermediate vertex \`k\` from 0 to \`V-1\`.
    *   For each possible source vertex \`i\` from 0 to \`V-1\`.
    *   For each possible destination vertex \`j\` from 0 to \`V-1\`.
        *   Consider if the path from \`i\` to \`j\` through \`k\` is shorter than the current known shortest path from \`i\` to \`j\`.
        *   The path \`i -> k -> j\` has a length of \`dist[i][k] + dist[k][j]\`.
        *   Update \`dist[i][j]\`:
            \`dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])\`
    *   After iterating through all possible \`k\`, \`i\`, and \`j\`, the \`dist\` matrix will contain the shortest path distances between all pairs of vertices.

3.  **Negative Cycle Detection (Optional but important)**:
    *   After the main iterations, check the diagonal elements of the \`dist\` matrix.
    *   If \`dist[i][i] < 0\` for any vertex \`i\`, it indicates that there is a negative-weight cycle involving vertex \`i\` that is reachable from \`i\` and can be used to make the path to itself arbitrarily small. In such cases, the concept of "shortest path" might not be well-defined for all pairs, or the algorithm might need to report this.

### Characteristics:
-   **All-Pairs Shortest Paths**: Computes shortest paths between every pair of vertices.
-   **Dynamic Programming**: Builds up solutions by considering intermediate vertices.
-   **Handles Negative Weights**: Can correctly process graphs with negative edge weights, provided there are no negative-weight cycles. If negative cycles exist, it can detect them.
-   **Simple Implementation**: The triple nested loop structure is relatively straightforward to implement.

### Time and Space Complexity:
-   **Time Complexity**: O(V³), due to the three nested loops (for \`k\`, \`i\`, and \`j\`), each running \`V\` times.
-   **Space Complexity**: O(V²) for storing the distance matrix.

### Advantages:
-   Conceptually simple for an all-pairs shortest path algorithm.
-   Works with negative edge weights (unlike Dijkstra's algorithm when run V times from each source, which would fail with negative edges).
-   Can detect negative cycles.

### Disadvantages:
-   O(V³) time complexity can be slow for very large graphs compared to running Dijkstra's V times (O(V * (E + V log V)) with a Fibonacci heap) if edge weights are non-negative and the graph is sparse.
-   Requires O(V²) space, which can be prohibitive for very large V.

### Common Use Cases:
-   Finding shortest paths in dense graphs where E is close to V².
-   When negative edge weights are present (and no negative cycles are expected or need to be detected).
-   Computing the transitive closure of a graph (by setting edge weights to 1 and infinity to a large enough number, then checking reachability).
-   Inverting real matrices.
-   Network routing where understanding all-pairs shortest paths is necessary.

The AlgoVista visualizer shows the \`dist\` matrix being updated iteratively as different intermediate vertices \`k\` are considered.
`,
  timeComplexities: {
    best: "O(V³)",
    average: "O(V³)",
    worst: "O(V³)",
  },
  spaceComplexity: "O(V²) for storing the distance matrix.",
};
