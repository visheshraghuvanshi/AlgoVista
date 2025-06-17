
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'prims-algorithm',
  title: "Prim's Algorithm",
  category: 'Graphs',
  difficulty: 'Medium',
  description: "Finds a minimum spanning tree (MST) for a weighted undirected graph by growing the tree one edge at a time, starting from an arbitrary vertex.",
  longDescription: "Prim's algorithm is a greedy algorithm that finds a minimum spanning tree (MST) for a weighted undirected graph. It works by starting with an arbitrary vertex and greedily adding the cheapest edge connecting a vertex in the MST to a vertex not yet in the MST, until all vertices are included.\\n\\nAlgorithm Steps:\\n1. Initialize an MST with an arbitrary starting vertex.\\n2. Maintain a set of edges that connect vertices in the MST to vertices outside the MST (often using a priority queue to store these edges, ordered by weight).\\n3. While the MST doesn't include all vertices:\\n   a. Select the minimum-weight edge from the set of edges connecting the MST to an outside vertex.\\n   b. Add this edge and the new vertex to the MST.\\n   c. Update the set of connecting edges by adding new edges from the newly added vertex to its neighbors (if those neighbors are not yet in the MST) and removing any edges that now form a cycle (i.e., connect two vertices already in the MST - though this is naturally handled by only considering edges to outside vertices).\\n\\nPrim's algorithm is similar to Dijkstra's algorithm for shortest paths. It guarantees finding an MST.\\n\\nUse Cases: Network design, circuit design, and anytime a minimum-cost connection of all points is needed.",
  timeComplexities: {
    best: "O(E log V) with a binary heap, or O(E + V log V) with a Fibonacci heap.",
    average: "O(E log V) with a binary heap.",
    worst: "O(V^2) with adjacency matrix and no priority queue, or O(E log V) with binary heap.",
  },
  spaceComplexity: "O(V+E) for graph representation, O(V) for priority queue/visited set.",
};
