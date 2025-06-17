
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'connected-components',
  title: 'Connected Components',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Finds sets of interconnected vertices in an undirected graph, or strongly connected components in a directed graph.',
  longDescription: "Connected Components (CCs) in an undirected graph are subgraphs in which any two vertices are connected to each other by paths, and which are connected to no additional vertices in the supergraph. For directed graphs, the concept is Strongly Connected Components (SCCs), where for any two vertices u and v in an SCC, there is a path from u to v and a path from v to u.\n\n**Undirected Graphs:**\nFinding connected components in an undirected graph is typically done using graph traversal algorithms like Breadth-First Search (BFS) or Depth-First Search (DFS). The algorithm iterates through all vertices. If a vertex hasn't been visited, start a traversal (BFS or DFS) from it. All vertices reachable from this starting vertex form one connected component. Mark all visited vertices and repeat until all vertices are visited.\n\n**Directed Graphs (Strongly Connected Components):**\nFinding SCCs is more complex and usually involves algorithms like:\n1.  **Kosaraju's Algorithm**: Involves two DFS passes. First DFS on the original graph to get finishing times. Second DFS on the transpose graph (edges reversed), processing vertices in decreasing order of their finishing times. Each tree in the DFS forest of the transpose graph is an SCC.\n2.  **Tarjan's Algorithm**: Uses a single DFS pass. It maintains discovery times and low-link values for nodes to detect SCCs using a stack of visited nodes.\n\nUse Cases: Network analysis (finding clusters), social network analysis, map routing (identifying reachable areas), and as a preprocessing step for other graph algorithms.",
  timeComplexities: {
    best: "O(V+E) for both undirected CC and directed SCCs (Kosaraju/Tarjan)",
    average: "O(V+E)",
    worst: "O(V+E)",
  },
  spaceComplexity: "O(V+E) for graph representation, O(V) for visited array/stack.",
};

