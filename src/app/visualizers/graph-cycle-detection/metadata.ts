
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'graph-cycle-detection',
  title: 'Graph Cycle Detection',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Detects cycles in directed and undirected graphs using algorithms like DFS.',
  longDescription: 'Cycle detection is a fundamental problem in graph theory. An algorithm for cycle detection can determine if a given graph contains at least one cycle.\n\n**Undirected Graphs:**\nA cycle exists in an undirected graph if there is a back edge during a Depth First Search (DFS) traversal. A back edge is an edge that connects a vertex to an ancestor in the DFS tree (excluding its parent).\n- **DFS Approach**: Keep track of visited vertices and the parent of the current vertex in the DFS traversal. If an adjacent vertex is visited and is not the parent of the current vertex, then there is a cycle.\n- **Union-Find Approach**: For each edge (u, v), if u and v are already in the same set (i.e., find(u) == find(v)), then adding this edge forms a cycle.\n\n**Directed Graphs:**\nA cycle exists in a directed graph if there is a back edge during DFS. A back edge in a directed graph connects a vertex to an ancestor in the DFS tree that is currently in the recursion stack.\n- **DFS Approach**: Maintain two sets of visited vertices: `visited` (all nodes visited so far) and `recursionStack` (nodes currently in the recursion path for the current DFS traversal). If an adjacent vertex is already in the `recursionStack`, then a cycle is detected.\n\nUse Cases: Detecting deadlocks in operating systems, verifying dependencies in build systems, network routing loop detection, and as a subroutine in other graph algorithms like topological sort (which is only possible for DAGs - Directed Acyclic Graphs).',
  timeComplexities: {
    best: "O(V+E) using DFS",
    average: "O(V+E) using DFS",
    worst: "O(V+E) using DFS",
  },
  spaceComplexity: "O(V) for visited array and recursion stack (DFS). For Union-Find, O(V) for parent array.",
};
