
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'bfs',
  title: 'Breadth-First Search (BFS)',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Traverses a graph level by level, exploring all neighbors at the present depth prior to moving on to nodes at the next depth level. Used to find shortest paths in unweighted graphs.',
  longDescription: `Breadth-First Search (BFS) is a fundamental algorithm for traversing or searching tree or graph data structures. It starts at a selected "source" node and explores all of its neighbors at the present depth (i.e., distance from the source) before moving on to the nodes at the next depth level. This "level-by-level" exploration makes BFS particularly useful for finding the shortest path in terms of number of edges in an unweighted graph.

### How it Works:
BFS systematically explores the graph using a **queue** to manage the order in which nodes are visited.

1.  **Initialization**:
    *   Choose a starting (source) vertex \`s\`.
    *   Create an empty queue.
    *   Create a \`visited\` set or boolean array to keep track of nodes that have been visited or added to the queue, to prevent processing them multiple times and to avoid infinite loops in graphs with cycles.
    *   (Optional for pathfinding) Initialize a \`distance\` array/map (dist[s] = 0, others = infinity) and a \`predecessor\` array/map (pred[s] = null).

2.  **Enqueue Start Node**:
    *   Add the source vertex \`s\` to the queue.
    *   Mark \`s\` as visited.

3.  **Loop (Process Queue)**:
    *   While the queue is not empty:
        a.  **Dequeue**: Remove a vertex \`u\` from the front of the queue.
        b.  **Process \`u\`**: Perform the desired operation on \`u\` (e.g., add to a result list, check if it's a target node).
        c.  **Explore Neighbors**: For each neighbor \`v\` of \`u\` in the graph:
            i.  If \`v\` has not been visited:
                - Mark \`v\` as visited.
                - (If tracking distance/path) Set \`distance[v] = distance[u] + 1\` and \`predecessor[v] = u\`.
                - Enqueue \`v\`.

4.  **Completion**:
    *   If the queue becomes empty, all reachable nodes from the source have been visited.
    *   If the graph is disconnected and you need to explore all components, the main BFS process can be wrapped in a loop that iterates through all vertices, starting a new BFS traversal if an unvisited vertex is found.

### Example: Graph \`A-B, A-C, B-D, C-D\` starting at A
1.  Queue: \`[A]\`, Visited: \`{A}\`
2.  Dequeue A. Process A. Queue: \`[]\`.
    Neighbors of A: B, C.
    Enqueue B (Visited: \`{A,B}\`). Queue: \`[B]\`
    Enqueue C (Visited: \`{A,B,C}\`). Queue: \`[B, C]\`
3.  Dequeue B. Process B. Queue: \`[C]\`.
    Neighbors of B: A, D. A is visited.
    Enqueue D (Visited: \`{A,B,C,D}\`). Queue: \`[C, D]\`
4.  Dequeue C. Process C. Queue: \`[D]\`.
    Neighbors of C: A, D. A is visited. D is visited.
5.  Dequeue D. Process D. Queue: \`[]\`.
    Neighbors of D: B, C. Both visited.
6.  Queue empty. Traversal order (processing order): A, B, C, D.

### Characteristics:
-   **Level-Order Traversal**: Visits nodes layer by layer.
-   **FIFO (First-In, First-Out)**: Uses a queue.
-   **Completeness**: Guaranteed to find a path if one exists (in finite graphs).
-   **Optimality**: Finds the shortest path in terms of number of edges in unweighted graphs.

### Advantages:
-   Guaranteed to find the shortest path in unweighted graphs.
-   Relatively simple to implement.
-   Can be used to find all reachable nodes.

### Disadvantages:
-   **Space Complexity**: In the worst case (e.g., a "bushy" graph where many nodes are at the same shallow depth), the queue can store up to O(V) nodes.
-   Not suitable for finding shortest paths in weighted graphs (Dijkstra's or Bellman-Ford are used for that).

### Common Use Cases:
-   **Shortest Path in Unweighted Graphs**: Finding the minimum number of edges between two nodes.
-   **Web Crawlers**: Exploring websites level by level.
-   **Network Broadcasting**: Simulating how information spreads through a network.
-   **Finding Connected Components**: In an undirected graph.
-   **Testing Bipartiteness**: Checking if a graph can be colored with two colors such that no two adjacent vertices have the same color.
-   **Solving Puzzles**: Like finding the shortest way out of a maze.

The AlgoVista BFS visualizer shows the state of the queue, the set of visited nodes, and highlights the current node being processed and its neighbors.
`,
  timeComplexities: { best: "O(1) (source is target)", average: "O(V+E)", worst: "O(V+E)" },
  spaceComplexity: "O(V) for queue and visited set.",
};

