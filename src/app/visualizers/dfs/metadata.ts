
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'dfs',
  title: 'Depth-First Search (DFS)',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Traverses a graph by exploring as far as possible along each branch before backtracking. Used for pathfinding, cycle detection, and topological sorting.',
  longDescription: 'Depth-First Search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (or an arbitrary node in a graph) and explores as far as possible along each branch before backtracking.\n\nAlgorithm Steps (Recursive for a graph):\n1. Mark the current node `u` as visited.\n2. Process node `u` (e.g., add to result list, check property).\n3. For each unvisited neighbor `v` of `u`:\n   a. Recursively call DFS on `v`.\n\nIterative DFS can be implemented using a stack:\n1. Initialize a stack and a visited set.\n2. Push the starting node onto the stack.\n3. While the stack is not empty:\n   a. Pop a node `u` from the stack.\n   b. If `u` has not been visited:\n      i. Mark `u` as visited.\n      ii. Process node `u`.\n      iii. Push all unvisited neighbors of `u` onto the stack (often in reverse order of how they appear in adjacency list to mimic recursive behavior).\n\nDFS is used in many graph algorithms, including finding connected components, cycle detection, topological sorting, and solving puzzles like mazes.',
  timeComplexities: { best: "O(1) (source is target/first node)", average: "O(V+E)", worst: "O(V+E)" },
  spaceComplexity: "O(V) for recursion stack (worst case, skewed tree/path graph) or explicit stack.",
};
