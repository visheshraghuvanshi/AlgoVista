
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'bellman-ford',
  title: 'Bellman-Ford Algorithm',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Finds shortest paths from a single source to all other vertices in a weighted digraph, capable of handling negative edge weights and detecting negative cycles.',
  longDescription: 'The Bellman-Ford algorithm is an algorithm that computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. It is slower than Dijkstra\'s algorithm for the same problem, but more versatile as it is capable of handling graphs in which some of the edge weights are negative numbers.\n\nAlgorithm Steps:\n1. Initialize distances from the source to all other vertices as infinite and distance to the source itself as 0. Create an array `predecessor[]` and initialize it to null.\n2. Relax all edges |V| - 1 times. For each edge (u, v) with weight w, if `dist[u] + w < dist[v]`, then update `dist[v] = dist[u] + w` and `predecessor[v] = u`.\n3. After |V| - 1 iterations, if there are no negative weight cycles, the shortest paths are found. To detect negative weight cycles, iterate through all edges one more time. If any distance is updated, then a negative weight cycle reachable from the source exists.\n\nThe algorithm iteratively relaxes edges, meaning it finds shorter paths by going through intermediate vertices. If after V-1 iterations, we can still relax an edge, it implies a negative cycle that can be traversed indefinitely to reduce the path cost.\n\nUse Cases: Routing algorithms in computer networks, especially where edge costs can represent desirability (and thus be negative), and for problems where negative cycles need to be detected.',
  timeComplexities: {
    best: "O(VE)",
    average: "O(VE)",
    worst: "O(VE)",
  },
  spaceComplexity: "O(V) for storing distances and predecessors.",
};
