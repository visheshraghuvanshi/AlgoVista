
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'topological-sort',
  title: 'Topological Sort',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Linearly orders the vertices of a directed acyclic graph (DAG) such that for every directed edge from vertex u to vertex v, u comes before v in the ordering.',
  longDescription: 'Topological Sort is a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge (u, v), vertex u comes before vertex v in the ordering. If the graph contains a cycle, it has no topological sort.\\n\\nCommon Algorithms:\\n1.  **Kahn\'s Algorithm (BFS-based)**:\\n    a. Compute the in-degree (number of incoming edges) for each vertex.\\n    b. Initialize a queue with all vertices having an in-degree of 0.\\n    c. While the queue is not empty:\\n       i. Dequeue a vertex `u` and add it to the topological sort result.\\n       ii. For each neighbor `v` of `u`:\\n          - Decrement in-degree of `v`.\\n          - If in-degree of `v` becomes 0, enqueue `v`.\\n    d. If the count of visited nodes in the sort is not equal to the total number of nodes, the graph has a cycle.\\n\n2.  **DFS-based Algorithm**:\\n    a. Perform a Depth First Search (DFS) traversal of the graph.\\n    b. After visiting all descendants of a node (i.e., upon finishing the recursive call for a node), add the node to the front of a list (or to the end of a list which is then reversed).\\n    c. During DFS, if a back edge is detected (an edge to an already visited node that is currently in the recursion stack), the graph has a cycle, and a topological sort is not possible.\\n\\nUse Cases: Task scheduling (e.g., course prerequisites, build system dependencies), resolving symbol dependencies in linkers.',
  timeComplexities: {
    best: "O(V+E)", // V = vertices, E = edges
    average: "O(V+E)",
    worst: "O(V+E)",
  },
  spaceComplexity: "O(V+E) for graph representation, O(V) for in-degree array/queue/stack.",
};
