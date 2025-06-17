
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'connected-components',
  title: 'Connected Components & SCCs',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Finds sets of interconnected vertices in an undirected graph, or Strongly Connected Components (SCCs) in a directed graph using Kosaraju\'s Algorithm.',
  longDescription: 'Connected Components (CCs) in an undirected graph are subgraphs in which any two vertices are connected to each other by paths, and which are connected to no additional vertices in the supergraph. For directed graphs, the concept is Strongly Connected Components (SCCs), where for any two vertices u and v in an SCC, there is a path from u to v and a path from v to u.\n\n**Undirected Graphs (Connected Components):**\nFinding CCs is typically done using graph traversal algorithms like Breadth-First Search (BFS) or Depth-First Search (DFS). The algorithm iterates through all vertices. If a vertex hasn\'t been visited, start a traversal from it. All vertices reachable form one connected component. Mark all visited vertices and repeat until all vertices are visited.\n\n**Directed Graphs (Strongly Connected Components - Kosaraju\'s Algorithm):**\nKosaraju\'s algorithm finds SCCs in O(V+E) time.\n1.  **First DFS Pass (on original graph):** Perform DFS on the original graph. Keep track of the finishing times of each vertex (or add nodes to a stack/list in the order they finish their recursive calls).\n2.  **Compute Transpose Graph:** Create a new graph G_T where all edge directions are reversed from the original graph G.\n3.  **Second DFS Pass (on transpose graph G_T):** Process vertices in decreasing order of their finishing times (obtained from step 1, e.g., by popping from the stack). For each unvisited vertex in this order, perform a DFS on G_T. All vertices visited in one such DFS traversal form a single Strongly Connected Component.\n\nUse Cases: Network analysis (finding clusters or isolated parts), social network analysis, checking if a directed graph can be made strongly connected, and as a preprocessing step for other graph algorithms like 2-satisfiability.',
  timeComplexities: {
    best: "O(V+E) for both undirected CC (DFS/BFS) and directed SCCs (Kosaraju's)",
    average: "O(V+E)",
    worst: "O(V+E)",
  },
  spaceComplexity: "O(V+E) for graph representation, O(V) for visited array/stack/recursion.",
};

    