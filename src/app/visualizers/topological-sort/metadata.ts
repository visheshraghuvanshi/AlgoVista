
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'topological-sort',
  title: 'Topological Sort',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Linearly orders the vertices of a directed acyclic graph (DAG) such that for every directed edge from vertex u to vertex v, u comes before v in the ordering.',
  longDescription: `Topological Sort or Topological Ordering of a Directed Acyclic Graph (DAG) is a linear ordering of its vertices such that for every directed edge from vertex \`u\` to vertex \`v\`, vertex \`u\` comes before vertex \`v\` in the ordering. Essentially, it's a way to "flatten" a DAG into a sequence while respecting its dependencies.

A topological sort is **not possible** if the graph contains a cycle, because a cycle implies a circular dependency (e.g., A depends on B, B depends on C, and C depends on A) which cannot be linearly ordered.

### How it Works (Kahn's Algorithm - BFS-based):
This is one of the common algorithms for topological sorting.

1.  **Compute In-degrees**:
    *   For each vertex in the graph, calculate its in-degree: the number of incoming edges.
2.  **Initialize Queue**:
    *   Create an empty queue.
    *   Add all vertices with an in-degree of 0 to this queue. These are the nodes with no prerequisites.
3.  **Process Queue**:
    *   Initialize an empty list or array, \`sortedOrder\`, to store the result.
    *   Initialize a counter for visited nodes, \`visitedCount = 0\`.
    *   While the queue is not empty:
        a.  **Dequeue**: Remove a vertex \`u\` from the front of the queue.
        b.  **Add to Result**: Add \`u\` to the \`sortedOrder\` list.
        c.  Increment \`visitedCount\`.
        d.  **Update Neighbors**: For each neighbor \`v\` of \`u\` (i.e., for each edge \`u -> v\`):
            i.  Decrement the in-degree of \`v\` by 1 (since \`u\` has now been "processed").
            ii. If the in-degree of \`v\` becomes 0, enqueue \`v\` (as all its prerequisites are now met).
4.  **Check for Cycles**:
    *   After the loop finishes, if \`visitedCount\` is not equal to the total number of vertices in the graph, it means the graph has at least one cycle, and thus a topological sort is not possible.
    *   Otherwise, the \`sortedOrder\` list contains a valid topological sort.

### How it Works (DFS-based Algorithm):
Another common approach uses Depth-First Search.
1.  **Initialization**:
    *   Create an empty stack to store the sorted vertices.
    *   Create a \`visited\` set and a \`recursionStack\` set (or boolean arrays) to keep track of node states during DFS. \`recursionStack\` helps detect cycles.
2.  **DFS Traversal**:
    *   For each vertex \`u\` in the graph:
        *   If \`u\` has not been visited, call a recursive DFS helper function \`dfsUtil(u)\`.
3.  **DFSUtil(\`u\`)**:
    a.  Mark \`u\` as visited and add it to the \`recursionStack\`.
    b.  For each neighbor \`v\` of \`u\`:
        i.  If \`v\` is not visited, recursively call \`dfsUtil(v)\`. If this recursive call indicates a cycle was found, propagate that information up.
        ii. Else if \`v\` is currently in the \`recursionStack\`, a cycle is detected. A topological sort is not possible.
    c.  After visiting all neighbors (i.e., after all recursive calls for \`u\`'s children have returned), remove \`u\` from the \`recursionStack\`.
    d.  Push \`u\` onto the main stack (for the topological sort).
4.  **Result**: If no cycles were detected, the contents of the stack, when popped one by one (or if the list was built by prepending), will give a topological sort.

### Characteristics:
-   **Only for DAGs**: Topological sort is defined only for Directed Acyclic Graphs.
-   **Not Unique**: A graph can have multiple valid topological sorts.
-   **Linear Ordering**: Produces a linear sequence of vertices.

### Advantages of Kahn's Algorithm:
-   Relatively straightforward to implement using BFS concepts.
-   Naturally detects cycles if the final count of sorted nodes is less than the total number of nodes.

### Advantages of DFS-based Algorithm:
-   Can also detect cycles during the traversal.
-   Often implemented recursively, which can be elegant for graph traversals.

### Time and Space Complexity (for both Kahn's and DFS-based):
-   **Time Complexity**: O(V+E), where V is the number of vertices and E is the number of edges. This is because each vertex and each edge is processed a constant number of times.
-   **Space Complexity**: O(V+E) for storing the graph (e.g., adjacency list). Additional O(V) space is needed for the in-degree array and queue (Kahn's) or for the visited array and recursion stack/explicit stack (DFS).

### Common Use Cases:
-   **Task Scheduling**: Ordering tasks where some tasks must be completed before others (e.g., course prerequisites, software build dependencies).
-   **Dependency Resolution**: In package managers or compilers to determine the correct order of operations.
-   **Critical Path Analysis**: In project management.
-   **Spreadsheet Cell Evaluation**: Determining the order in which to calculate cell values that depend on each other.

The AlgoVista visualizer for Topological Sort typically demonstrates Kahn's algorithm, showing the in-degrees, the queue, and the resulting sorted order.
`,
  timeComplexities: {
    best: "O(V+E)",
    average: "O(V+E)",
    worst: "O(V+E)",
  },
  spaceComplexity: "O(V+E) for graph representation, O(V) for in-degree array/queue/stack.",
};
