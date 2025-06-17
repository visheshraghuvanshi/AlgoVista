
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'kruskals-algorithm',
  title: "Kruskal's Algorithm",
  category: 'Graphs',
  difficulty: 'Medium',
  description: "Finds a minimum spanning tree (MST) for a connected, undirected graph by adding edges in increasing order of weight, avoiding cycles.",
  longDescription: "Kruskal's algorithm finds a minimum spanning tree (MST) for a weighted undirected graph. It sorts all the edges in non-decreasing order of their weight. Then, it picks edges one by one and adds them to the MST if adding the current edge does not form a cycle with the MST formed so far. A Disjoint Set Union (DSU) data structure is commonly used to efficiently detect cycles.\\n\\nAlgorithm Steps:\\n1. Sort all edges in the graph by non-decreasing weight.\\n2. Initialize an empty MST.\\n3. Initialize a DSU structure with each vertex as a separate set.\\n4. Iterate through the sorted edges. For each edge (u, v) with weight w:\\n   a. If `find(u)` is not equal to `find(v)` (i.e., u and v are in different components), add the edge (u,v) to the MST and perform `union(u,v)` in the DSU.\\n   b. Continue until V-1 edges have been added to the MST (where V is the number of vertices), or all edges have been processed.\\n5. If V-1 edges are added, the MST is complete. Otherwise, the graph is not connected.\\n\\nUse Cases: Network design (e.g., laying cables to connect points with minimum cost), clustering, image segmentation.",
  timeComplexities: { 
    best: "O(E log E) or O(E log V) due to edge sorting", 
    average: "O(E log E) or O(E log V)", 
    worst: "O(E log E) or O(E log V)" 
  },
  spaceComplexity: "O(V+E) for storing graph and DSU structure.",
};
