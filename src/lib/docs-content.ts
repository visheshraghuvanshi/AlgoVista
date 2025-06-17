
export interface DocPageContent {
  title: string;
  content: string;
}

export const docsContentBySlug: Record<string, DocPageContent> = {
  "getting-started/what-is-algovista": {
    title: "What is AlgoVista?",
    content: `
AlgoVista is an interactive platform designed to help you visualize and understand data structures and algorithms.
Our goal is to make learning these complex computer science concepts intuitive, engaging, and accessible for everyone.

### Key Motivations
- **Visual Learning**: We believe that seeing algorithms in action, step-by-step with synchronized code, is crucial for building strong mental models.
- **Interactive Engagement**: Move beyond passive reading. Test algorithms with your own data, control animation speed, and see the logic unfold.
- **Modern Experience**: Enjoy a clean, intuitive interface designed with current web standards, including light/dark modes and responsive design.

AlgoVista aims to bridge the gap between abstract theoretical knowledge and practical understanding.
    `
  },
  "getting-started/how-to-use": {
    title: "How to Use AlgoVista",
    content: `
Using AlgoVista is designed to be intuitive:

1.  **Navigate to Visualizers**: From the main navigation, select "Visualizers" to see the list of available algorithms and data structures.
2.  **Choose an Algorithm**: Click on any card (e.g., "Bubble Sort", "Binary Search Tree") to open its dedicated interactive page.
3.  **Interact with the Visualizer**:
    *   **Input Data**: Most visualizers will have an input field where you can provide your own data (e.g., a comma-separated list of numbers for sorting, a graph structure). Default data is usually provided.
    *   **Control Panel**: Use the control buttons:
        *   **Play/Pause**: Start or pause the step-by-step animation.
        *   **Step**: Manually advance the algorithm one step at a time.
        *   **Reset**: Resets the visualization to its initial state with the current input, or to default input.
    *   **Animation Speed**: Adjust the slider to control how fast the animation plays.
4.  **Understand the Components**:
    *   **Visualization Panel**: This is the main area where the data structure or algorithm's state is animated (e.g., array bars changing, tree nodes highlighting).
    *   **Code Panel**: Displays conceptual code (often in multiple languages like JavaScript, Python, Java, C++) corresponding to the algorithm being visualized. The currently executing line or block of code is typically highlighted.
    *   **Algorithm Details Card**: Found below the visualizer, this card provides:
        *   A detailed description of the algorithm/data structure.
        *   Time and Space Complexity analysis (Best, Average, Worst cases).
        *   Common use cases.
5.  **Explore Documentation**: Use this Docs section (/docs) to delve deeper into theoretical concepts, understand algorithm categories, or get help with platform features.

### Tips for Effective Learning
-   **Start with Fundamentals**: If you're new, begin with simpler algorithms like Linear Search or Bubble Sort before moving to more complex ones like Red-Black Trees or Dijkstra's.
-   **Experiment with Inputs**: Try various inputs: sorted, reverse-sorted, small, large (within limits), edge cases (empty, single element) to see how algorithms respond.
-   **Predict and Verify**: Before clicking "Step" or "Play", try to predict what the algorithm will do next. Then, observe if your prediction was correct.
-   **Connect Visuals to Code**: Actively switch your focus between the visualization panel and the highlighted code in the code panel to understand how the visual changes map to the code logic.
-   **Read the Details**: Don't skip the Algorithm Details card; it provides crucial context and theoretical backing.
    `
  },
  "getting-started/features-overview": { 
    title: "Features Overview", 
    content: `
AlgoVista offers a range of features to enhance your learning experience:

### Core Features
-   **Interactive Visualizations**: Dynamic, step-by-step animations for a variety of algorithms and data structures.
-   **Synchronized Code Highlighting**: See the conceptual code execute in sync with the visual changes. Multiple languages (JavaScript, Python, Java, C++) are often provided.
-   **Customizable Input**: Test algorithms with your own datasets or use the provided defaults.
-   **Animation Controls**: Play, pause, step forward, and reset animations at your convenience.
-   **Adjustable Animation Speed**: Control the pace of the visualization to match your learning speed.
-   **Algorithm Details**: Comprehensive explanations, complexity analysis (time and space), and use cases for each algorithm.

### Platform Features
-   **Responsive Design**: Access AlgoVista on desktop, tablet, or mobile devices.
-   **Light/Dark Mode**: Choose your preferred theme for comfortable viewing.
-   **Clear Navigation**: Easily find visualizers and documentation.
-   **Detailed Documentation**: This very section acts as a textbook companion to the visualizers, explaining concepts and platform usage.

### For Developers (Future/Conceptual)
-   **Open Source**: AlgoVista is planned as an open-source project, welcoming community contributions.
-   **Extensible Framework**: Designed to make adding new visualizers relatively straightforward (see Developer Docs).

We are continuously working to add more algorithms, features, and improve the platform. Your feedback is welcome!
    ` 
  },
  "getting-started/faq": { 
    title: "Frequently Asked Questions", 
    content: `
Here are some common questions about AlgoVista:

**Q: Who is AlgoVista for?**
A: AlgoVista is for anyone interested in learning data structures and algorithms, including:
    - Computer Science students.
    - Self-taught developers.
    - Engineers preparing for technical interviews.
    - Educators looking for visual teaching aids.

**Q: Is AlgoVista free to use?**
A: Yes, AlgoVista is completely free to use.

**Q: What technologies is AlgoVista built with?**
A: AlgoVista is built using modern web technologies, primarily:
    - **Next.js**: A React framework for server-side rendering and static site generation.
    - **React**: A JavaScript library for building user interfaces.
    - **TypeScript**: For static typing and improved code quality.
    - **Tailwind CSS**: A utility-first CSS framework for styling.
    - **Shadcn/UI**: For pre-built, accessible UI components.
    - **Lucide React**: For icons.
    - **Framer Motion** (planned): For some complex animations.
    (The backend for AI-assisted features, if any, would use technologies like Genkit.)

**Q: How can I contribute to AlgoVista?**
A: AlgoVista is envisioned as an open-source project. You can check out our [GitHub repository](https://github.com/visheshraghuvanshi/AlgoVista) for contribution guidelines (once established). We welcome contributions for new visualizers, bug fixes, documentation improvements, and feature suggestions.

**Q: An algorithm seems to be missing or not working correctly. What should I do?**
A: Please report any issues or suggest new algorithms via our GitHub repository's issue tracker (if available) or through the contact methods listed on the [Contact](/contact) page.

**Q: Can I use AlgoVista offline?**
A: Currently, AlgoVista is a web-based platform and requires an internet connection. Offline capabilities might be considered for future development.

**Q: How accurate are the time/space complexity details?**
A: We strive for accuracy based on common analyses of these algorithms. However, complexities can vary based on specific implementation details (e.g., iterative vs. recursive, choice of underlying data structures for helpers like priority queues). The provided complexities are typical for standard implementations.
    ` 
  },
  "algorithms-visualized/time-and-space-complexity": {
    title: "Time and Space Complexity",
    content: `
Understanding time and space complexity is fundamental to analyzing algorithms and choosing the most efficient one for a given task.

### ⏳ Time Complexity
Time complexity measures the amount of time an algorithm takes to run as a function of the size of its input (usually denoted as 'N'). It's typically expressed using **Big O notation**, which describes the upper bound or worst-case scenario.

-   **O(1) - Constant Time**: Execution time is constant, regardless of input size.
    *   *Example*: Accessing an array element by index, pushing/popping from a stack (usually).
-   **O(log N) - Logarithmic Time**: Execution time grows logarithmically with input size. Often occurs when the problem size is halved in each step.
    *   *Example*: Binary search in a sorted array.
-   **O(N) - Linear Time**: Execution time grows linearly with input size.
    *   *Example*: Traversing an array or linked list, linear search.
-   **O(N log N) - Log-Linear (or Linearithmic) Time**: Often found in efficient sorting algorithms that use divide-and-conquer.
    *   *Example*: Merge Sort, Heap Sort, Quick Sort (average case).
-   **O(N²) - Quadratic Time**: Execution time grows quadratically. Typically involves nested loops iterating over the input size.
    *   *Example*: Bubble Sort, Selection Sort, Insertion Sort (worst/average cases).
-   **O(N³) - Cubic Time**: Execution time grows cubically. Example: Naive matrix multiplication.
-   **O(2^N) - Exponential Time**: Execution time doubles with each addition to the input data set. Very slow for larger N.
    *   *Example*: Recursive Fibonacci calculation without memoization, some brute-force solutions to combinatorial problems.
-   **O(N!) - Factorial Time**: Execution time grows factorially. Extremely slow; only feasible for very small N.
    *   *Example*: Brute-force solution to the Traveling Salesperson Problem.

### 💾 Space Complexity
Space complexity measures the total amount of memory space an algorithm uses, relative to the input size. It includes both the space for input values and any auxiliary space used by the algorithm.

-   **O(1) - Constant Space**: The algorithm uses a fixed amount of extra space, regardless of input size.
    *   *Example*: In-place sorting algorithms like Bubble Sort (if only considering auxiliary space).
-   **O(N) - Linear Space**: Extra space usage grows linearly with input size.
    *   *Example*: Creating a copy of an input array, recursion stack for DFS/BFS on a path graph.
-   **O(N²) - Quadratic Space**: Extra space usage grows quadratically.
    *   *Example*: Storing an adjacency matrix for a graph.

**Why does it matter?**
Complexities help predict how an algorithm will perform as data scales. An O(N²) algorithm might be fine for N=100, but terrible for N=1,000,000, whereas an O(N log N) algorithm would handle the larger input much more gracefully.
    `
  },
  "algorithms-visualized/sorting/bubble-sort": { 
    title: "Bubble Sort", 
    content: `
Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order (e.g., for ascending order, if the left element is greater than the right). The pass through the list is repeated until no swaps are needed, which indicates that the list is sorted.

### How it Works
1.  **Iterate through the array**: Start from the first element.
2.  **Compare adjacent elements**: Compare the current element with the next element.
3.  **Swap if necessary**: If the current element is greater than the next element (for ascending sort), swap them.
4.  **Repeat for the pass**: Continue this process for all adjacent pairs in the current pass. After the first pass, the largest element will have "bubbled" to its correct position at the end of the array.
5.  **Reduce array size conceptually**: For subsequent passes, the last element of the previous pass is already in its sorted position, so the iteration can stop one element earlier.
6.  **Optimization**: If a full pass through the array occurs with no swaps, the array is sorted, and the algorithm can terminate early.

### Characteristics
-   **In-place**: It sorts the array using only a constant amount of extra memory.
-   **Stable**: It preserves the relative order of equal elements.
-   **Time Complexity**:
    *   Worst Case: O(N²) (e.g., reverse-sorted array)
    *   Average Case: O(N²)
    *   Best Case: O(N) (if array is already sorted and optimization is used)
-   **Space Complexity**: O(1) (auxiliary)

While simple to understand and implement, Bubble Sort is inefficient for large datasets compared to algorithms like Merge Sort or Quick Sort. It's primarily used for educational purposes or for very small lists.
    ` 
  },
  "algorithms-visualized/sorting/merge-sort": { 
    title: "Merge Sort", 
    content: `
Merge Sort is an efficient, stable, comparison-based sorting algorithm. It employs the **divide and conquer** strategy.

### How it Works
1.  **Divide**: If the list has more than one element, split the list into two (approximately) equal halves.
2.  **Conquer**: Recursively sort each half. If a half has only one element, it's considered sorted (this is the base case for the recursion).
3.  **Combine (Merge)**: Merge the two sorted halves back into a single, sorted list. This merge step is crucial:
    *   Create temporary arrays for the left and right halves.
    *   Compare elements from the left and right temporary arrays one by one.
    *   Copy the smaller element into the original array.
    *   Advance the pointer in the array from which the element was copied.
    *   Repeat until one temporary array is exhausted.
    *   Copy any remaining elements from the non-exhausted temporary array into the original array.

### Characteristics
-   **Stable**: Preserves the relative order of equal elements.
-   **Not In-place**: Typically requires O(N) auxiliary space for the merging process.
-   **Time Complexity**: O(N log N) in all cases (best, average, and worst). This is because the list is always divided into two halves, and the merge process takes linear time for each level of recursion.
-   **Space Complexity**: O(N) due to the temporary arrays used during merging. Some in-place merge variations exist but are more complex.

Merge Sort is highly predictable and efficient for large datasets. It's also the basis for external sorting.
    ` 
  },
  "algorithms-visualized/sorting/quick-sort": { 
    title: "Quick Sort", 
    content: `
Quick Sort is a highly efficient, comparison-based, divide and conquer sorting algorithm.

### How it Works (Lomuto Partition Scheme Example)
1.  **Choose a Pivot**: Select an element from the array as the pivot. Common choices include the first element, last element (as visualized here), median-of-three, or a random element.
2.  **Partition**: Rearrange the array elements such that all elements smaller than the pivot are moved to its left, and all elements greater than the pivot are moved to its right. Elements equal to the pivot can go on either side. After partitioning, the pivot is in its final sorted position.
    *   The Lomuto partition scheme typically uses the last element as the pivot. It maintains an index \`i\` (initially \`low - 1\`) for the "smaller element region".
    *   It iterates from \`j = low\` to \`high - 1\`. If \`arr[j]\` is less than the pivot, \`i\` is incremented, and \`arr[i]\` is swapped with \`arr[j]\`.
    *   Finally, the pivot (originally at \`arr[high]\`) is swapped with \`arr[i + 1]\`. The index \`i + 1\` is the pivot's final position.
3.  **Conquer (Recurse)**: Recursively apply Quick Sort to the sub-array of elements to the left of the pivot and to the sub-array of elements to the right of the pivot.

### Characteristics
-   **Not Stable**: Does not necessarily preserve the relative order of equal elements.
-   **In-place (typically)**: Can be implemented to sort in-place, requiring O(log N) auxiliary space for the recursion call stack on average.
-   **Time Complexity**:
    *   Worst Case: O(N²) (occurs with poor pivot choices, e.g., on an already sorted array if the first or last element is always chosen as pivot).
    *   Average Case: O(N log N).
    *   Best Case: O(N log N) (occurs when partitions are well-balanced).
-   **Space Complexity**: O(log N) on average (due to recursion stack depth). O(N) in the worst case.

Quick Sort is often faster in practice than other O(N log N) algorithms like Merge Sort due to smaller constant factors and good cache performance, especially with good pivot selection strategies (e.g., randomized pivot, median-of-three).
    ` 
  },
  "algorithms-visualized/trees/binary-tree-basics": { 
    title: "Binary Tree Basics", 
    content: `
A **Binary Tree** is a hierarchical tree data structure in which each node has at most two children, which are referred to as the *left child* and the *right child*.

### Key Terminology
-   **Node**: The fundamental part of a tree, containing data and pointers to its children.
-   **Root**: The topmost node in a tree. It has no parent.
-   **Edge**: A link between a parent node and a child node.
-   **Child**: A node directly connected to another node when moving away from the root.
-   **Parent**: The converse notion of a child.
-   **Leaf Node (or External Node)**: A node with no children.
-   **Internal Node**: A node with at least one child.
-   **Depth of a Node**: The number of edges from the root to the node. The root has depth 0.
-   **Height of a Node**: The number of edges on the longest path from the node to a leaf.
-   **Height of a Tree**: The height of its root node (or -1/0 for an empty tree, depending on convention).
-   **Subtree**: A tree consisting of a node and all its descendants.
-   **Full Binary Tree**: A binary tree in which every node has either 0 or 2 children.
-   **Complete Binary Tree**: A binary tree in which all levels are completely filled except possibly the last level, which is filled from left to right.
-   **Perfect Binary Tree**: A binary tree in which all internal nodes have two children and all leaf nodes are at the same level.

### Common Operations
-   **Insertion**: Adding a new node.
-   **Deletion**: Removing a node.
-   **Search**: Finding a node with a specific value.
-   **Traversal**: Visiting all nodes in a specific order (e.g., Inorder, Preorder, Postorder, Level-order).

Binary trees are fundamental in computer science and form the basis for more specialized tree structures like Binary Search Trees (BSTs), AVL Trees, Red-Black Trees, Heaps, etc.
    ` 
  },
  "algorithms-visualized/trees/traversals-explained": { 
    title: "Binary Tree Traversals Explained", 
    content: `
Tree traversal is the process of visiting (e.g., checking, updating, or printing) each node in a tree data structure, exactly once. For binary trees, there are several common ways to traverse the nodes, primarily categorized as Depth-First Traversals (DFS) and Breadth-First Traversal (BFS).

### Depth-First Traversals (DFS)
DFS explores as far as possible along each branch before backtracking.

1.  **Inorder Traversal (Left, Root, Right)**
    *   Algorithm:
        1.  Traverse the left subtree by recursively calling the inorder function.
        2.  Visit the root node.
        3.  Traverse the right subtree by recursively calling the inorder function.
    *   *Use Case*: For a Binary Search Tree (BST), inorder traversal visits the nodes in non-decreasing order (sorted order).

2.  **Preorder Traversal (Root, Left, Right)**
    *   Algorithm:
        1.  Visit the root node.
        2.  Traverse the left subtree by recursively calling the preorder function.
        3.  Traverse the right subtree by recursively calling the preorder function.
    *   *Use Cases*: Creating a copy of the tree, getting prefix expressions (Polish notation).

3.  **Postorder Traversal (Left, Right, Root)**
    *   Algorithm:
        1.  Traverse the left subtree by recursively calling the postorder function.
        2.  Traverse the right subtree by recursively calling the postorder function.
        3.  Visit the root node.
    *   *Use Cases*: Deleting a tree (delete children before deleting the parent), getting postfix expressions (Reverse Polish notation).

### Breadth-First Traversal (BFS)
BFS, also known as Level-Order Traversal, visits all nodes at a given depth before moving to the nodes at the next depth level.
-   Algorithm:
    1.  Create an empty queue.
    2.  Enqueue the root node.
    3.  While the queue is not empty:
        a.  Dequeue a node and visit it.
        b.  Enqueue its left child (if it exists).
        c.  Enqueue its right child (if it exists).
-   *Use Cases*: Finding the shortest path between two nodes in an unweighted graph (trees are a type of graph), level-by-level processing.

AlgoVista provides visualizations for Inorder, Preorder, and Postorder traversals.
    ` 
  },
  "algorithms-visualized/trees/bst-properties": { 
    title: "Binary Search Tree (BST) Properties", 
    content: `
A **Binary Search Tree (BST)** is a special type of binary tree that adheres to specific ordering properties for its node values. These properties allow for efficient searching, insertion, and deletion operations.

### Core BST Properties
1.  **Left Child Property**: The value of any node in the left subtree of a node \`X\` is less than or equal to the value of node \`X\`. (Some definitions strictly require "less than," while others allow "less than or equal to" to handle duplicates, often placing equal values in the right subtree).
2.  **Right Child Property**: The value of any node in the right subtree of a node \`X\` is greater than or equal to the value of node \`X\`. (Similarly, "greater than" or "greater than or equal to").
3.  **Recursive Property**: Both the left and right subtrees of every node must also be binary search trees.
4.  **No (or Handled) Duplicates**: Typically, BSTs do not allow duplicate values. If duplicates are allowed, a consistent rule is applied (e.g., always insert duplicates into the right subtree). Our visualizers generally assume no duplicates for simplicity, or a consistent rule for insertion.

### Implications of BST Properties
-   **Efficient Search (Average Case O(log N))**: To search for a value, you start at the root. If the target value is less than the current node's value, you go to the left child; if greater, you go to the right child. This process eliminates half of the remaining tree at each step in a balanced tree.
-   **Sorted Traversal**: An inorder traversal (Left-Root-Right) of a BST visits the nodes in ascending (sorted) order of their values.
-   **Finding Min/Max**: The minimum value is found by traversing left from the root until a null left child is reached. The maximum value is found by traversing right.

### Operations
-   **Search**: As described above, comparing the target with the current node and deciding to go left or right.
-   **Insert**: Similar to search. Traverse the tree to find the correct empty spot (null child) where the new value should be inserted as a leaf node, maintaining BST properties.
-   **Delete**: The most complex operation.
    1.  Node is a leaf: Simply remove it.
    2.  Node has one child: Replace the node with its child.
    3.  Node has two children: Find its inorder successor (smallest value in its right subtree) or inorder predecessor (largest value in its left subtree). Copy the successor/predecessor's value to the node to be deleted. Then, delete the successor/predecessor (which now has 0 or 1 child, reducing to one of the simpler cases).

### Balance
The efficiency of BST operations (O(log N)) relies on the tree being relatively **balanced**. If the tree becomes skewed (e.g., resembling a linked list due to sorted insertions), worst-case performance can degrade to O(N). Self-balancing BSTs like AVL Trees and Red-Black Trees address this issue by performing rotations and recolorings to maintain balance.
    ` 
  },
  "algorithms-visualized/graphs/dfs-vs-bfs": { 
    title: "DFS vs BFS in Graphs", 
    content: `
Depth-First Search (DFS) and Breadth-First Search (BFS) are two fundamental graph traversal algorithms. They explore nodes in a graph, but in different orders.

### 🌊 Breadth-First Search (BFS)
-   **Strategy**: Explores the graph layer by layer. It visits all neighbors of a node at the current depth before moving on to nodes at the next depth level.
-   **Data Structure**: Uses a **Queue** to keep track of nodes to visit.
-   **Process**:
    1.  Start at a source node, add it to the queue, and mark it as visited.
    2.  While the queue is not empty:
        a.  Dequeue a node \`u\`.
        b.  Process \`u\`.
        c.  For each unvisited neighbor \`v\` of \`u\`: Mark \`v\` as visited and enqueue \`v\`.
-   **Use Cases**:
    *   Finding the shortest path between two nodes in an **unweighted** graph.
    *   Finding connected components in an undirected graph.
    *   Testing bipartiteness of a graph.
    *   Web crawlers often use BFS to explore pages level by level.

### 🌲 Depth-First Search (DFS)
-   **Strategy**: Explores as far as possible along each branch before backtracking. It goes deep into one branch, then backtracks to explore other branches.
-   **Data Structure**: Uses a **Stack** (either implicitly via recursion or explicitly with an iterative approach) to keep track of nodes to visit.
-   **Process (Recursive)**:
    1.  Start at a source node \`u\`, mark it as visited, and process it.
    2.  For each unvisited neighbor \`v\` of \`u\`: Recursively call DFS on \`v\`.
-   **Process (Iterative)**:
    1.  Start at a source node, push it onto the stack.
    2.  While the stack is not empty:
        a.  Pop a node \`u\`.
        b.  If \`u\` has not been visited: Mark \`u\` visited and process it.
        c.  Push all unvisited neighbors of \`u\` onto the stack (often in reverse order to mimic recursion).
-   **Use Cases**:
    *   Detecting cycles in a graph (both directed and undirected).
    *   Topological sorting of a Directed Acyclic Graph (DAG).
    *   Finding connected components (especially Strongly Connected Components in directed graphs).
    *   Solving puzzles like mazes or finding paths.

### Comparison
| Feature             | BFS                                     | DFS                                          |
|---------------------|-----------------------------------------|----------------------------------------------|
| **Exploration**     | Level by level (shallowest first)       | Branch by branch (deepest first)             |
| **Data Structure**  | Queue (FIFO)                            | Stack (LIFO - implicit or explicit)          |
| **Shortest Path**   | Finds shortest path in unweighted graphs | Not guaranteed to find shortest path       |
| **Space Complexity**| Can be O(W) where W is max width of graph | O(H) where H is max height/depth of graph  |
| **Completeness**    | Guaranteed to find a solution if one exists (finite graphs) | Guaranteed (finite graphs)                 |
| **Optimality**      | Optimal for unweighted shortest path    | Optimal for pathfinding if solution is deep |

Both algorithms have a time complexity of O(V+E) where V is the number of vertices and E is the number of edges, when implemented with an adjacency list.
    ` 
  },
  "algorithms-visualized/graphs/weighted-graphs": { 
    title: "Weighted Graphs", 
    content: `
A **Weighted Graph** is a graph where each edge is assigned a numerical weight or cost. This weight can represent various metrics depending on the problem, such as:
-   Distance or length (e.g., in road networks)
-   Time (e.g., travel time between locations)
-   Cost (e.g., cost of a connection in a network)
-   Capacity (e.g., bandwidth of a communication link)
-   Probability or reliability

Weighted graphs can be **directed** (edges have a direction) or **undirected** (edges are bidirectional).

### Representation
Weighted graphs are typically represented using:
1.  **Adjacency Matrix**: A 2D matrix \`adj[V][V]\` where \`adj[i][j]\` stores the weight of the edge from vertex \`i\` to vertex \`j\`. If no edge exists, it can store a special value like infinity (or 0 if weights are strictly positive and 0 implies no edge). Space: O(V²).
2.  **Adjacency List**: An array of lists, where \`adj[i]\` contains a list of pairs \`(neighbor, weight)\` for all vertices \`neighbor\` adjacent to vertex \`i\`. Space: O(V+E). This is usually more efficient for sparse graphs.

AlgoVista often uses a string format for input like \`0:1(5),2(3);1:2(1)\` which represents:
-   Vertex 0 has an edge to vertex 1 with weight 5.
-   Vertex 0 has an edge to vertex 2 with weight 3.
-   Vertex 1 has an edge to vertex 2 with weight 1.

### Common Problems on Weighted Graphs
-   **Shortest Path Problems**:
    *   **Single Source Shortest Path (SSSP)**: Finding the shortest path from a single source vertex to all other vertices.
        *   *Dijkstra's Algorithm*: For graphs with non-negative edge weights.
        *   *Bellman-Ford Algorithm*: For graphs that may contain negative edge weights (can also detect negative cycles).
    *   **All-Pairs Shortest Path (APSP)**: Finding the shortest paths between all pairs of vertices.
        *   *Floyd-Warshall Algorithm*: Works for graphs with positive or negative edge weights (but no negative cycles).
        *   Running SSSP from each vertex (e.g., Dijkstra N times if non-negative weights).
-   **Minimum Spanning Tree (MST)**: Finding a subgraph that connects all vertices with the minimum possible total edge weight, without forming any cycles.
    *   *Prim's Algorithm*
    *   *Kruskal's Algorithm*
-   **Network Flow Problems**: (e.g., Max Flow Min Cut)
-   **Traveling Salesperson Problem (TSP)**: Finding the shortest possible route that visits each city exactly once and returns to the origin city.

The weights on edges add a layer of complexity and enable modeling a wider range of real-world scenarios.
    ` 
  },
  "algorithms-visualized/graphs/dijkstras-algo": { 
    title: "Dijkstra’s Algorithm", 
    content: `
Dijkstra's Algorithm finds the shortest paths from a single source vertex to all other vertices in a **weighted graph with non-negative edge weights**.

### How it Works
1.  **Initialization**:
    *   Set the distance to the source node as 0.
    *   Set the distances to all other nodes as infinity.
    *   Create a set of visited nodes (initially empty) or mark all nodes as unvisited.
    *   Often, a predecessor array is maintained to reconstruct the shortest paths.
2.  **Priority Queue (Min-Heap)**: Maintain a priority queue (min-heap) of nodes to visit, ordered by their current shortest tentative distance from the source. Initially, it contains the source node with distance 0.
3.  **Iteration**: While the priority queue is not empty:
    a.  **Extract Minimum**: Extract the node \`u\` with the smallest tentative distance from the priority queue.
    b.  **Mark Visited**: Add \`u\` to the set of visited nodes (or mark it as visited). Its distance is now considered final.
    c.  **Relax Edges**: For each neighbor \`v\` of \`u\` that has not been visited:
        i.  Calculate the distance from the source to \`v\` through \`u\`: \`distance(u) + weight(u, v)\`.
        ii. If this calculated distance is shorter than the current known distance to \`v\`:
            - Update \`distance(v)\` to this new shorter distance.
            - Set \`predecessor(v) = u\`.
            - Add \`v\` to the priority queue with its new distance (or update its priority if it's already in the queue).
4.  **Completion**: Once the priority queue is empty or all reachable nodes have been visited, the algorithm terminates. The \`distances\` array contains the shortest path lengths from the source.

### Key Points
-   **Greedy Algorithm**: At each step, it picks the locally optimal choice (the unvisited node with the smallest tentative distance).
-   **Non-Negative Weights**: Crucially, Dijkstra's algorithm only works correctly if all edge weights are non-negative. If negative weights are present (but no negative cycles), the Bellman-Ford algorithm should be used. If negative cycles exist, shortest paths may not be well-defined.
-   **Data Structures for PQ**:
    *   Binary Heap: Results in O((V+E) log V) or O(E log V) time.
    *   Fibonacci Heap: Can improve to O(E + V log V) time.
    *   Simple Array (for dense graphs): O(V²) time.

AlgoVista visualizes Dijkstra's, showing the priority queue state (conceptually), distance updates, and the growing set of visited nodes.
    ` 
  },
  "algorithms-visualized/backtracking/how-recursion-works": { 
    title: "How Recursion Works", 
    content: `
Recursion is a powerful programming technique where a function calls itself to solve a smaller instance of the same problem. It's a way of thinking about problems by breaking them down into self-similar subproblems.

### Core Components of a Recursive Function
1.  **Base Case(s)**:
    *   This is the simplest version of the problem that can be solved directly, without further recursion.
    *   It's crucial for stopping the recursion and preventing infinite loops.
    *   A recursive function must have at least one base case.
    *   *Example*: In factorial(n), the base case is when n=0 or n=1, returning 1.

2.  **Recursive Step (or Recursive Call)**:
    *   This is where the function calls itself with a modified input that moves it closer to a base case.
    *   The function breaks the problem down into smaller, self-similar subproblems.
    *   It assumes that the recursive call on the smaller subproblem will return the correct result.
    *   The function then combines the result of the recursive call(s) with its own processing to solve the current instance of the problem.
    *   *Example*: In factorial(n), the recursive step is \`n * factorial(n-1)\`.

### How the Call Stack Manages Recursion
When a function is called, a new **stack frame** is created on the **call stack**. This frame stores:
-   Local variables of the function.
-   Parameters passed to the function.
-   The return address (where execution should resume after the function completes).

For recursive calls:
1.  Each recursive call creates a new stack frame on top of the stack.
2.  When a base case is reached, that function call returns, and its stack frame is popped off.
3.  Execution resumes in the previous function call (the caller), which then uses the returned value to compute its own result.
4.  This process continues until the original call returns.

### Example: Factorial
\`\`\`
function factorial(n) {
  // Base Case
  if (n === 0 || n === 1) {
    return 1;
  }
  // Recursive Step
  else {
    return n * factorial(n - 1);
  }
}
\`\`\`
If we call \`factorial(3)\`:
1.  \`factorial(3)\` calls \`factorial(2)\`. Stack: [\`factorial(3)\`]
2.  \`factorial(2)\` calls \`factorial(1)\`. Stack: [\`factorial(3)\`, \`factorial(2)\`]
3.  \`factorial(1)\` hits base case, returns 1. Stack: [\`factorial(3)\`, \`factorial(2)\`] -> pops \`factorial(1)\` frame.
4.  \`factorial(2)\` receives 1, computes \`2 * 1 = 2\`, returns 2. Stack: [\`factorial(3)\`] -> pops \`factorial(2)\` frame.
5.  \`factorial(3)\` receives 2, computes \`3 * 2 = 6\`, returns 6. Stack: [] -> pops \`factorial(3)\` frame.

### Advantages of Recursion
-   Can lead to elegant and concise solutions for problems that have a recursive structure (e.g., tree traversals, divide and conquer algorithms).
-   Often easier to understand for problems that naturally break down into smaller, identical subproblems.

### Disadvantages of Recursion
-   **Stack Overflow**: If the recursion is too deep (too many nested calls without hitting a base case), it can exhaust the call stack memory, leading to a stack overflow error.
-   **Performance Overhead**: Function calls can have more overhead (time and memory for stack frames) compared to iterative solutions for some problems.
-   **Redundant Computations**: Naive recursive solutions can sometimes recompute the same subproblems multiple times (e.g., recursive Fibonacci). This can be addressed with memoization (Dynamic Programming).

Many recursive algorithms can be converted to iterative solutions using an explicit stack.
    ` 
  },
  "algorithms-visualized/backtracking/n-queens-problem": { 
    title: "N-Queens Problem", 
    content: `
The N-Queens problem is a classic combinatorial problem that involves placing N chess queens on an N×N chessboard such that no two queens threaten each other. This means no two queens can be on the same row, column, or diagonal.

It's a great example of a problem solvable using **backtracking**.

### Backtracking Approach
The general idea is to place queens one by one in different columns, starting from the leftmost column. When placing a queen in a column, we check for clashes with already placed queens. If a row is found where a queen can be placed safely, we mark this row and recursively try to place queens in the next column. If we are not able to place a queen in the current column (i.e., no row is safe), we backtrack to the previous column and try a different row for the queen placed there.

1.  **Start Function**: A main function initializes an empty N×N board (e.g., all 0s). It calls a recursive utility function, usually starting with column 0.
2.  **Recursive Utility Function** (e.g., \`solve(board, currentCol)\`):
    *   **Base Case**: If \`currentCol >= N\`, all N queens have been placed successfully. A solution is found. Add the board configuration to a list of solutions. Return \`true\` (if finding one solution) or continue (if finding all).
    *   **Recursive Step**: For each \`row\` from 0 to N-1 in the \`currentCol\`:
        a.  **Check Safety**: Call an \`isSafe(board, row, currentCol)\` function to check if placing a queen at \`(row, currentCol)\` is safe (i.e., it doesn't conflict with queens already placed in columns 0 to \`currentCol - 1\`).
        b.  **Place Queen**: If it's safe, place a queen on \`board[row][currentCol]\` (e.g., set to 1).
        c.  **Recurse**: Call \`solve(board, currentCol + 1)\` to try and place queens in the next column.
            *   If the recursive call returns \`true\` (meaning it led to a solution), then propagate \`true\` up (if only one solution is needed). For finding all solutions, we don't necessarily stop here.
        d.  **Backtrack**: If the recursive call returns \`false\` (or if we are finding all solutions and have finished exploring this path), remove the queen from \`board[row][currentCol]\` (e.g., set back to 0). This is the backtracking step – undoing the choice to explore other possibilities.
    *   **Return False**: If no row in the \`currentCol\` leads to a solution, return \`false\` from this call.

3.  **isSafe Function** (\`isSafe(board, row, col)\`):
    *   Check the current \`row\` to the left of \`col\`.
    *   Check the upper-left diagonal from \`(row, col)\`.
    *   Check the lower-left diagonal from \`(row, col)\`.
    *   If any queen is found in these positions, return \`false\`. Otherwise, return \`true\`. (No need to check the column to the right or other diagonals as queens are placed column by column).

The N-Queens visualizer demonstrates this backtracking process, showing where queens are tried, placed, and removed.
    ` 
  },
  "algorithms-visualized/dynamic-programming/memoization-vs-tabulation": { 
    title: "Memoization vs. Tabulation in DP", 
    content: `
Dynamic Programming (DP) is an algorithmic technique for solving complex problems by breaking them down into simpler subproblems. It's particularly useful for optimization problems and problems with overlapping subproblems. There are two main approaches to implement DP: Memoization (Top-Down) and Tabulation (Bottom-Up).

### Overlapping Subproblems
Both methods are effective when a problem has overlapping subproblems. This means that the same subproblem is encountered and solved multiple times if a naive recursive approach is used. DP optimizes this by storing the results of subproblems so they don't need to be recomputed.

### 🧠 Memoization (Top-Down Approach)
-   **Concept**: Starts with the original problem and breaks it down recursively. If a subproblem is encountered for the first time, its solution is computed and stored (memoized) in a lookup table (e.g., an array or hash map). If the same subproblem is encountered again, the stored result is simply retrieved.
-   **Implementation**: Usually implemented with recursion. The recursive function first checks if the result for the current state is already memoized. If yes, it returns the stored value. If no, it computes the result, stores it, and then returns it.
-   **Pros**:
    *   Often more intuitive to write, as it directly follows the recursive structure of the problem.
    *   Only solves subproblems that are actually needed to solve the main problem.
-   **Cons**:
    *   Can lead to stack overflow for very deep recursion if not careful (though often mitigated by the fact that subproblems are solved only once).
    *   Overhead of recursive function calls.

**Example (Fibonacci with Memoization):**
\`\`\`
memo = {}
function fib_memo(n) {
  if n in memo: return memo[n]
  if n <= 1: return n
  result = fib_memo(n-1) + fib_memo(n-2)
  memo[n] = result
  return result
}
\`\`\`

### 📝 Tabulation (Bottom-Up Approach)
-   **Concept**: Solves the problem by starting from the smallest subproblems and iteratively building up solutions to larger subproblems until the solution to the original problem is found. Results are stored in a table (e.g., an array or 2D array).
-   **Implementation**: Usually implemented with iteration (loops). The table is filled in a specific order, ensuring that when solving for \`dp[i]\`, the solutions for all necessary smaller subproblems (e.g., \`dp[i-1]\`, \`dp[i-2]\`) have already been computed.
-   **Pros**:
    *   Avoids recursion overhead and potential stack overflow issues.
    *   Can sometimes be more space-efficient if only a few previous rows/columns of the DP table are needed (space optimization).
    *   The order of computation is explicit.
-   **Cons**:
    *   May solve subproblems that are not actually required for the final solution (though this is often not a significant issue if all subproblems up to the target are indeed related).
    *   Can sometimes be less intuitive to formulate the iterative solution and table filling order.

**Example (Fibonacci with Tabulation):**
\`\`\`
function fib_tab(n) {
  if n <= 1: return n
  dp_table = array of size (n+1)
  dp_table[0] = 0
  dp_table[1] = 1
  for i from 2 to n:
    dp_table[i] = dp_table[i-1] + dp_table[i-2]
  return dp_table[n]
}
\`\`\`

### Which to Choose?
-   If the recursive structure is natural and the number of states is manageable, **memoization** can be easier to implement.
-   If the problem has a clear order of subproblems or if recursion depth is a concern, **tabulation** is often preferred.
-   Both typically yield the same time complexity for a given DP problem, as they solve each unique subproblem only once.

The AlgoVista visualizers for Dynamic Programming problems (like Knapsack, LCS, Edit Distance) primarily demonstrate the **tabulation** (bottom-up) approach by showing the DP table being filled.
    ` 
  },
  "playground-help/custom-input": { 
    title: "How to Use Custom Input", 
    content: `
Many visualizers in AlgoVista allow you to provide your own custom input data to see how algorithms perform. This is a great way to test edge cases or understand behavior with specific datasets.

### General Steps:
1.  **Locate the Input Field(s)**: On a visualizer page (e.g., Bubble Sort, Binary Search Tree), look for input fields in the "Controls & Input" card.
    *   For array-based algorithms (sorting, searching), this is usually a single input field labeled "Input Array" or similar.
    *   For graph algorithms, there might be an input for "Graph Data" (adjacency list format) and often a "Start Node".
    *   For tree algorithms, it might be "Tree Input" (level-order comma-separated) and potentially values for nodes P and Q (like in LCA).
    *   For DP problems, you might find inputs for strings, item weights/values, or target amounts.

2.  **Enter Your Data**:
    *   **Arrays**: Typically, enter comma-separated numbers (e.g., \`5,1,9,3,7\`). Some visualizers might specify if only positive numbers or specific ranges are best for visualization.
    *   **Strings**: Enter the string directly (e.g., for Edit Distance or LCS).
    *   **Graphs (Adjacency List Format)**: A common format is \`nodeID:neighbor1,neighbor2;nodeID2:neighbor3\`. For weighted graphs, it's often \`nodeID:neighbor1(weight1),neighbor2(weight2)\`. Pay close attention to the placeholder text for the specific format.
    *   **Trees (Level-Order Comma-Separated)**: Input values level by level, from left to right. Use \`null\` or leave empty for missing children. Example: \`5,3,8,1,4,null,9\` represents a tree where 5 is root, 3 is left child, 8 is right, etc.
    *   **Specific Values**: For operations like "Insert Value" or "Target Sum", enter the single value required.

3.  **Apply Input / Run Algorithm**:
    *   **Automatic Update**: For some visualizers (like sorting or simple array searches), changing the input in the "Input Array" field might automatically re-generate the visualization steps and reset the animation.
    *   **Execute Button**: For others, especially those with multiple input fields or operations (like graph algorithms, tree operations, DP problems), you'll need to click an "Execute Operation", "Run Algorithm", "Solve", or similarly named button after setting your inputs.

### Input Validation and Errors:
-   AlgoVista tries to validate your input. If the format is incorrect or values are out of the expected range for the visualizer:
    *   A **toast notification** will usually appear with an error message (e.g., "Invalid Input", "Graph format incorrect").
    *   The visualization panel might show an empty state or an error message.
-   **Pay attention to placeholder text** in input fields; it often gives clues about the expected format.
-   For algorithms that require specific input types (e.g., non-negative numbers for Counting Sort, sorted arrays for Binary Search initially), the platform might automatically process or sort your input and notify you, or it might expect you to provide it correctly.

### Example: Custom Input for Bubble Sort
1.  Go to the Bubble Sort visualizer.
2.  In the "Input Array" field, change the default \`5,1,9,3,7,4,6,2,8\` to your own list, e.g., \`10,50,20,40,30\`.
3.  The visualization and steps should automatically update to reflect your new array. You can then play or step through the sorting process for your custom data.

Experimenting with different inputs is a key part of learning with AlgoVista!
    ` 
  },
  "playground-help/step-control": { 
    title: "Step Control Features", 
    content: `
AlgoVista's visualizers provide controls to help you understand algorithms at your own pace. These typically include:

### ▶️ Play
-   **Action**: Starts or resumes the automatic, step-by-step animation of the algorithm.
-   **Usage**: Click "Play" to watch the algorithm execute. The speed of the animation is determined by the "Animation Speed" slider.
-   **State**: Becomes a "Pause" button while playing. Disabled if the algorithm is finished or if no steps are generated (e.g., invalid input).

### ⏸️ Pause
-   **Action**: Pauses the currently running animation.
-   **Usage**: Click "Pause" to stop the automatic progression and examine the current state. You can then use "Step" or "Play" again.
-   **State**: Appears when the animation is playing.

### ⏭️ Step (Step Forward)
-   **Action**: Manually advances the algorithm by one single step.
-   **Usage**: Use this to carefully observe each decision and change the algorithm makes. It's great for detailed analysis.
-   **State**: Disabled if the animation is playing, if the algorithm is finished, or if no steps are available.

### 🔄 Reset
-   **Action**: Resets the visualization and algorithm state.
    *   For most visualizers, this means re-processing the current input data from the beginning, generating fresh steps.
    *   For some visualizers with multiple inputs (like "Initial Array" and "Operation Value"), it might reset all inputs to their default values and re-initialize.
-   **Usage**: Use this to start over with the same input or after changing input values.
-   **State**: Usually enabled, but might be disabled during an active animation if it could cause an inconsistent state.

### Slider Animation Speed
-   **Action**: Controls the delay between automatic steps when "Play" is active.
-   **Usage**:
    *   Slide to the **left** (towards the "slower" icon, often a rotated FastForward or a Snail) for a **longer delay** (slower animation).
    *   Slide to the **right** (towards the "faster" icon) for a **shorter delay** (faster animation).
    *   The current delay in milliseconds is usually displayed.
-   **State**: Typically enabled, but might be disabled while the animation is playing for some visualizers to prevent rapid changes.

### Other Controls (Algorithm-Specific)
Some visualizers might have additional controls:
-   **Execute Operation / Solve / Find Button**: For algorithms where you set up inputs (e.g., graph, target value) and then explicitly trigger the computation.
-   **Input Fields**: For entering arrays, graph data, target values, string inputs, etc.
-   **Select Dropdowns**: For choosing algorithm variants (e.g., "Iterative" vs. "Recursive" merge for linked lists) or problem types (e.g., "Max Sum" vs. "Min Length" for Sliding Window).

These controls are designed to give you flexibility in how you observe and interact with the algorithms.
    ` 
  },
  "playground-help/animation-speed": { 
    title: "Animation Speed Tips", 
    content: `
Controlling the animation speed is key to getting the most out of AlgoVista's visualizers. The "Animation Speed" slider allows you to adjust the delay between steps when the algorithm is playing automatically.

### How it Works
-   The slider typically represents a delay in **milliseconds (ms)**.
-   **Slower Speed (Longer Delay)**: Sliding to the left (often indicated by an icon like a snail or a reversed fast-forward symbol) increases the delay between steps. This is useful for:
    *   Understanding complex algorithms where many things change in a single conceptual "step."
    *   Carefully observing pointer movements or data comparisons.
    *   When you are first learning an algorithm.
-   **Faster Speed (Shorter Delay)**: Sliding to the right (often indicated by a fast-forward symbol) decreases the delay, making the animation play more quickly. This is useful for:
    *   Getting a quick overview of an algorithm's flow once you understand the basics.
    *   Visualizing algorithms on larger datasets where many steps are involved.
    *   Reviewing an algorithm you're already familiar with.

### Finding the Right Speed
-   **Start Slow**: When learning a new algorithm, begin with a slower speed (e.g., 800ms - 1500ms delay) to ensure you can follow each step.
-   **Gradually Increase**: As you become more comfortable, you can increase the speed.
-   **Pause and Step**: Remember that you can always pause the animation and use the "Step" button for very detailed inspection, regardless of the animation speed setting.
-   **Algorithm Dependent**: Some algorithms have very quick "micro-steps" while others have more involved operations per visualized step. You might find different speeds work better for different visualizers.
    *   *Example*: A simple array scan in Linear Search might be fine at a faster speed, while complex rotations in an AVL tree might benefit from a slower pace.

### Typical Range
-   **Minimum Speed (e.g., 50ms - 200ms delay)**: Very fast, almost a blur for complex steps. Good for a quick high-level run-through.
-   **Medium Speed (e.g., 500ms - 1000ms delay)**: A common default, offering a balance between observation and progression.
-   **Maximum Speed (e.g., 1500ms - 3000ms delay)**: Very slow, allowing detailed observation of each transition.

Experiment with the slider to find the speed that best suits your learning style and the complexity of the algorithm you're visualizing.
    ` 
  },
  "developer-contributor/folder-structure": { 
    title: "Project Folder Structure", 
    content: `
Understanding the project's folder structure is helpful for navigation and contributions. AlgoVista (a Next.js application) generally follows a standard structure with some specific conventions for visualizers.

\`\`\`plaintext
/
├── public/               # Static assets (images, fonts not handled by Next/font)
├── src/
│   ├── app/              # Next.js App Router: pages, layouts, API routes
│   │   ├── (main-routes)/  # Group for top-level pages like about, contact
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── ...
│   │   ├── docs/           # Documentation pages and layout
│   │   │   ├── […slug]/page.tsx
│   │   │   └── layout.tsx
│   │   │   └── page.tsx      # Redirects to first doc page
│   │   ├── visualizers/    # Core directory for all algorithm visualizers
│   │   │   ├── (group)/      # Optional: Grouping by category (e.g., sorting, trees)
│   │   │   │   └── [algorithm-slug]/
│   │   │   │       ├── page.tsx                # Main page component for the visualizer
│   │   │   │       ├── *CodePanel.tsx          # Code display component
│   │   │   │       ├── *VisualizationPanel.tsx # Animation/display component
│   │   │   │       ├── *-logic.ts              # Algorithm logic, step generation
│   │   │   │       └── metadata.ts             # Title, description, complexity etc.
│   │   │   ├── metadataRegistry.ts # Central registry for all visualizer metadata
│   │   │   └── page.tsx            # Main visualizers listing page
│   │   ├── globals.css       # Global styles, Tailwind directives
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Homepage
│   ├── components/         # Reusable UI components
│   │   ├── algo-vista/     # Components specific to AlgoVista visualizers (e.g., controls)
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   └── ui/             # Generic UI components (Button, Card - often from Shadcn/UI)
│   ├── hooks/              # Custom React hooks (e.g., useToast)
│   ├── lib/                # Utility functions, helper libraries
│   │   ├── docs-content.ts # Markdown content for docs
│   │   └── utils.ts
│   ├── styles/             # (Alternative for more CSS, if not all in globals.css)
│   └── types/              # TypeScript type definitions (e.g., AlgorithmMetadata, AlgorithmStep)
├── .env.local            # Environment variables (local)
├── .eslintrc.json        # ESLint configuration
├── .gitignore
├── components.json       # Shadcn/UI configuration
├── next.config.ts        # Next.js configuration
├── package.json
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
\`\`\`

### Key Directories for Visualizer Development
-   **\`src/app/visualizers/[algorithm-slug]/\`**: Each new visualizer gets its own subdirectory here.
    -   \`page.tsx\`: The main React component for the visualizer page, handling state, controls, and layout.
    -   \`AlgorithmNameCodePanel.tsx\`: Displays the code snippets for the algorithm.
    -   \`AlgorithmNameVisualizationPanel.tsx\`: Renders the actual visual representation.
    -   \`algorithm-name-logic.ts\`: Contains the core algorithm implementation and the step generation logic for visualization.
    -   \`metadata.ts\`: Exports an \`AlgorithmMetadata\` object with details about the algorithm.
-   **\`src/app/visualizers/metadataRegistry.ts\`**: Imports all individual \`metadata.ts\` files and exports a combined list used by the main visualizers listing page.
-   **\`src/types/index.ts\`**: Defines shared TypeScript interfaces like \`AlgorithmStep\`, \`GraphNode\`, etc.
-   **\`src/components/algo-vista/\`**: Contains shared components specifically designed for the visualizers, such as control panels or common visualization elements.

This structure aims for modularity and makes it easier to add new visualizers.
    ` 
  },
  "developer-contributor/add-visualizer": { 
    title: "How to Add a New Visualizer", 
    content: `
Adding a new algorithm visualizer to AlgoVista involves several steps. Here's a high-level guide:

**1. Plan Your Visualizer**
    *   **Choose an Algorithm/Data Structure**: Select what you want to visualize.
    *   **Define Visualization Steps**: Think about how the algorithm progresses and what states need to be shown at each step. This is crucial for the \`*-logic.ts\` file.
    *   **Design the Visual Representation**: How will the data be displayed? (e.g., bars for arrays, nodes and edges for graphs/trees).
    *   **Identify Key Code Segments**: What parts of the conceptual code should be highlighted during animation?

**2. Create Files and Folder Structure**
    *   Under \`src/app/visualizers/\`, create a new directory for your algorithm (e.g., \`my-new-sort\`).
    *   Inside this directory, create the following essential files:
        *   \`page.tsx\`: The main Next.js page component. This will manage state, import other components, and lay out the page.
        *   \`MyNewSortVisualizationPanel.tsx\`: A React component to render the visual elements (e.g., using SVGs, divs). It will receive data for the current step.
        *   \`MyNewSortCodePanel.tsx\`: A React component to display code snippets, with highlighting for the current line/block.
        *   \`my-new-sort-logic.ts\`: A TypeScript file containing:
            *   The core algorithm logic.
            *   A function to generate an array of "steps" (\`AlgorithmStep\` or a more specific type like \`ArrayAlgorithmStep\`, \`GraphAlgorithmStep\`). Each step object should capture the state of the data and any relevant highlighting information for that point in the algorithm.
            *   A \`LINE_MAP\` constant mapping conceptual code lines to numbers for synchronization.
        *   \`metadata.ts\`: Exports an \`AlgorithmMetadata\` object containing the title, description, category, difficulty, complexities, etc.

**3. Implement the Logic (`*-logic.ts`)**
    *   Write the actual algorithm.
    *   Instrument your algorithm to produce an array of "step" objects. Each step should capture:
        *   The current state of the data structure (e.g., array contents, graph nodes/edges, tree structure).
        *   Indices or elements to highlight (active, swapping, sorted, pivot, current pointers, etc.).
        *   The conceptual line number in the code to be highlighted.
        *   A message describing the current action.
        *   Any auxiliary data needed for the visualization panel (e.g., current sum, queue/stack contents).

**4. Build the Visualization Panel (`*VisualizationPanel.tsx`)**
    *   This component takes the current step data as a prop.
    *   Render the data visually (e.g., map array elements to bars, graph nodes to circles, tree nodes appropriately).
    *   Use the highlighting information from the step data to style elements (e.g., change colors, add borders).

**5. Build the Code Panel (`*CodePanel.tsx`)**
    *   Store conceptual code snippets (JavaScript, Python, Java, C++) as arrays of strings.
    *   Use the current line number from the step data to highlight the corresponding line(s) in the displayed code.
    *   Implement language selection using Tabs.
    *   Ensure the code area is scrollable.

**6. Create the Page Component (`page.tsx`)**
    *   Manage state for the visualizer: input values, current step index, animation speed, play/pause state.
    *   Handle user interactions from control panels (e.g., play, pause, step, reset, input changes).
    *   Call your logic function to generate steps when inputs change or reset is triggered.
    *   Pass data to the Visualization and Code panels.
    *   Include an \`AlgorithmDetailsCard\` using your metadata.
    *   Use a suitable controls panel (e.g., \`SortingControlsPanel\`, \`GraphControlsPanel\`, or create a new one if needed).

**7. Register Metadata**
    *   Import your new algorithm's metadata from \`[algorithm-slug]/metadata.ts\` into \`src/app/visualizers/metadataRegistry.ts\`.
    *   Add it to the \`allAlgorithmMetadata\` array. This makes it appear on the main visualizers listing page.

**8. Style and Refine**
    *   Use Tailwind CSS and Shadcn/UI components for styling.
    *   Ensure responsiveness and accessibility.
    *   Test thoroughly with various inputs and edge cases.

**Tips:**
-   **Start Simple**: Break down the task. Get a basic version of the algorithm logic and visualization working first, then add more detail.
-   **Reuse Components**: Leverage existing components from \`src/components/algo-vista/\` or \`src/components/ui/\` where possible.
-   **Clear Steps**: Make your step generation logic produce clear, distinct states for the animation.
-   **Refer to Existing Visualizers**: Use the code for existing visualizers (e.g., Bubble Sort, DFS) as a template and guide.

This process involves both algorithmic thinking and frontend development. Good luck!
    ` 
  },
  "developer-contributor/tech-stack": { 
    title: "Technology Stack", 
    content: `
AlgoVista is built with a modern, robust technology stack chosen for developer experience, performance, and scalability.

### Core Framework & Language
-   **Next.js (App Router)**: The primary React framework. We leverage the App Router for features like:
    *   Server Components and Client Components for optimized rendering.
    *   Route Handlers for API endpoints (if any).
    *   Layouts for shared UI.
    *   File-system based routing.
-   **React**: The JavaScript library for building user interfaces. We use functional components and hooks extensively.
-   **TypeScript**: Superset of JavaScript that adds static typing, improving code quality, maintainability, and developer tooling.

### Styling & UI
-   **Tailwind CSS**: A utility-first CSS framework that allows for rapid UI development directly in the markup. It's highly customizable.
-   **Shadcn/UI**: A collection of beautifully designed, accessible, and reusable UI components built on top of Radix UI primitives and Tailwind CSS. This includes components like Buttons, Cards, Dialogs, Selects, etc.
-   **Lucide React**: Provides a comprehensive set of simply beautiful open-source icons.
-   **CSS Variables**: Used extensively for theming (light/dark modes) and consistent styling, integrated with Tailwind.

### State Management & Animation
-   **React Hooks (\`useState\`, \`useEffect\`, \`useCallback\`, \`useRef\`)**: For most local component state and side effects.
-   **Zustand / React Context API** (Considered/Potentially Used): For more complex global state management if needed, though local state is preferred where possible.
-   **Framer Motion** (Planned/Considered): For more complex and fluid animations, especially for dynamic transitions in visualizations that go beyond simple CSS transitions.

### Development & Build Tools
-   **Node.js & npm/yarn/pnpm**: For package management and running development scripts.
-   **ESLint & Prettier**: For code linting and formatting to maintain code consistency.
-   **Vercel**: The platform AlgoVista is often deployed on, providing seamless integration with Next.js for hosting, serverless functions, and CI/CD.

### Generative AI (If Applicable for AI-Assisted Features)
-   **Genkit (by Google)**: An open-source TypeScript/JavaScript framework for building production-ready AI-powered features and applications. If AlgoVista incorporates AI (e.g., for explaining code, generating problem variations), Genkit would be the chosen tool.
    *   Integrates with models like Gemini.
    *   Provides tools for flow management, observability, and deployment.

This stack allows for a modern, efficient, and enjoyable development process, resulting in a fast and interactive user experience.
    ` 
  },
};

