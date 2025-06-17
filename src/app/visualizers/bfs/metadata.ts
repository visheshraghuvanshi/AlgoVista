
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'bfs',
  title: 'Breadth-First Search (BFS)',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Traverses a graph level by level, exploring all neighbors at the present depth prior to moving on to nodes at the next depth level. Used to find shortest paths in unweighted graphs.',
  longDescription: 'Breadth-First Search (BFS) is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root (or some arbitrary node of a graph, sometimes referred to as a "search key") and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.\n\nAlgorithm Steps (for a graph):\n1. Initialize a queue and a visited set.\n2. Add the starting node to the queue and mark it as visited.\n3. While the queue is not empty:\n   a. Dequeue a node `u`.\n   b. Process node `u` (e.g., add to result list, check if it\'s the target).\n   c. For each neighbor `v` of `u`:\n      i. If `v` has not been visited:\n         - Mark `v` as visited.\n         - Enqueue `v`.\n\nBFS is often used to find the shortest path in terms of number of edges between two nodes in an unweighted graph. It can also be used to find connected components, or as a building block for more complex graph algorithms.',
  timeComplexities: { best: "O(1) (source is target)", average: "O(V+E)", worst: "O(V+E)" },
  spaceComplexity: "O(V)",
};
