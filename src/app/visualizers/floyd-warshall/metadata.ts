
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'floyd-warshall',
  title: 'Floyd-Warshall Algorithm',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Finds all-pairs shortest paths in a weighted directed graph with positive or negative edge weights (but no negative cycles).',
  longDescription: 'The Floyd-Warshall algorithm is an algorithm for finding shortest paths in a directed weighted graph with positive or negative edge weights (but no negative cycles). A single execution of the algorithm will find the lengths (summed weights) of shortest paths between all pairs of vertices. Although it does not return details of the paths themselves, it is possible to reconstruct paths with simple modifications to the algorithm.\\n\\nAlgorithm Steps:\\n1. Initialize a distance matrix `dist[V][V]` where `dist[i][j]` is the weight of the direct edge from `i` to `j`, or infinity if no direct edge exists. `dist[i][i]` is 0.\\n2. Iterate `k` from 0 to `V-1` (representing intermediate vertices).\\n3. For each `k`, iterate `i` from 0 to `V-1` (representing source vertices).\\n4. For each `i`, iterate `j` from 0 to `V-1` (representing destination vertices).\\n5. Update `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.\\nAfter the loops complete, `dist[i][j]` will hold the shortest path distance from `i` to `j`.\\n\\nUse Cases: Finding all-pairs shortest paths, transitive closure of a graph, inverting real matrices, finding optimal routing.',
  timeComplexities: {
    best: "O(V³)",
    average: "O(V³)",
    worst: "O(V³)",
  },
  spaceComplexity: "O(V²) for storing the distance matrix.",
};
