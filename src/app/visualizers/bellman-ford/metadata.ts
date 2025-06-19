
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'bellman-ford',
  title: 'Bellman-Ford Algorithm',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Finds shortest paths from a single source to all other vertices in a weighted digraph, capable of handling negative edge weights and detecting negative cycles.',
  longDescription: `The Bellman-Ford algorithm is an algorithm that computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. It is slower than Dijkstra's algorithm for the same problem (when edge weights are non-negative), but more versatile as it is capable of handling graphs in which some of the edge weights are negative numbers.

### How it Works:
The algorithm iteratively relaxes edges, meaning it finds shorter paths by going through intermediate vertices.

1.  **Initialization**:
    *   Initialize the distance from the source vertex \`s\` to all other vertices \`v\` as infinity (\`dist[v] = ∞\`).
    *   Initialize the distance from the source to itself as 0 (\`dist[s] = 0\`).
    *   Initialize a predecessor array \`pred[v]\` to null for all vertices.

2.  **Relaxation Iterations**:
    *   Repeat the following \`|V| - 1\` times (where \`|V|\` is the number of vertices in the graph):
        *   For each edge \`(u, v)\` with weight \`w\` in the graph:
            *   If \`dist[u] + w < dist[v]\`, then a shorter path to \`v\` has been found through \`u\`.
            *   Update \`dist[v] = dist[u] + w\`.
            *   Update \`pred[v] = u\`.
    *   The reason for \`|V| - 1\` iterations is that the shortest path can have at most \`|V| - 1\` edges (assuming no cycles). Each iteration effectively finds shortest paths of at most one more edge.

3.  **Negative Cycle Detection**:
    *   After \`|V| - 1\` iterations, if there are no negative-weight cycles reachable from the source, the shortest paths are found.
    *   To detect negative-weight cycles, perform one more iteration of relaxation over all edges:
        *   For each edge \`(u, v)\` with weight \`w\`:
            *   If \`dist[u] + w < dist[v]\`, it means that a shorter path was found *after* \`|V| - 1\` iterations. This can only happen if there is a negative-weight cycle reachable from the source that involves edge \`(u,v)\`.
            *   In such a case, the "shortest path" is not well-defined, as one could traverse the negative cycle indefinitely to reduce the path cost. The algorithm typically reports the existence of such a cycle.

### Characteristics:
-   **Handles Negative Weights**: Unlike Dijkstra's, Bellman-Ford works correctly with negative edge weights.
-   **Detects Negative Cycles**: Can identify if the graph contains a negative-weight cycle reachable from the source.
-   **Slower than Dijkstra's**: For graphs with only non-negative weights, Dijkstra's is generally faster.

### Time and Space Complexity:
-   **Time Complexity**: O(VE), where V is the number of vertices and E is the number of edges. The outer loop runs V-1 times, and the inner loop iterates through all E edges. The negative cycle detection adds one more E pass.
-   **Space Complexity**: O(V) for storing distances and predecessors.

### Use Cases:
-   Routing algorithms in computer networks where edge costs can represent desirability (and thus potentially be negative), such as some distance-vector routing protocols.
-   Finding shortest paths when negative edge weights are present.
-   Detecting arbitrage opportunities in financial markets (modeled as negative cycles).
-   Problems where negative cycles need to be identified.

The AlgoVista visualizer demonstrates these relaxation steps and the final check for negative cycles.
`,
  timeComplexities: {
    best: "O(VE)",
    average: "O(VE)",
    worst: "O(VE)",
  },
  spaceComplexity: "O(V) for storing distances and predecessors.",
};
