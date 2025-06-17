
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'dijkstra',
  title: "Dijkstra's Algorithm",
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Finds the shortest paths from a single source node to all other nodes in a graph with non-negative edge weights. Interactive visualization available.',
  longDescription: "Dijkstra's algorithm is a classic algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks. It was conceived by computer scientist Edsger W. Dijkstra in 1956 and published three years later.\n\nThe algorithm exists in many variants; Dijkstra's original variant found the shortest path between two given nodes, but a more common variant fixes a single node as the \"source\" node and finds shortest paths from the source to all other nodes in the graph, producing a shortest-path tree.\n\nAlgorithm Steps:\n1. Initialize distances: Set the distance to the source node as 0 and all other nodes as infinity.\n2. Priority Queue: Maintain a priority queue of nodes to visit, ordered by their current shortest distance from the source.\n3. Process Nodes: While the priority queue is not empty:\n   a. Extract the node `u` with the smallest distance from the priority queue.\n   b. For each neighbor `v` of `u`: Calculate the distance from the source to `v` through `u`. If this path is shorter than the current known distance to `v`, update `v`'s distance and add/update `v` in the priority queue.\n4. Finalization: Once a node is extracted from the priority queue, its shortest distance from the source is considered final.\n\nDijkstra's algorithm is guaranteed to find the shortest path in graphs with non-negative edge weights. For graphs with negative edge weights, other algorithms like Bellman-Ford must be used.",
  timeComplexities: {
    best: "O(E + V log V) with a binary heap or Fibonacci heap",
    average: "O(E + V log V) with a binary heap or Fibonacci heap",
    worst: "O(V^2) with an adjacency matrix and no priority queue, or O(E + V log V) with a priority queue",
  },
  spaceComplexity: "O(V + E) for graph storage, O(V) for distances and priority queue.",
};
