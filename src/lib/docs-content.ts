
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

### Why AlgoVista?

- **Interactive Visualizations**: See algorithms in action, step-by-step.
- **Code Syncing**: Understand the link between visual steps and the underlying code.
- **Custom Input**: Test algorithms with your own data.
- **Modern Experience**: Clean, intuitive interface with dark mode.

We believe that visual learning is key to truly grasping how data structures and algorithms work.
    `
  },
  "getting-started/how-to-use": {
    title: "How to Use AlgoVista",
    content: `
Navigating and using AlgoVista is straightforward:

1.  **Explore Visualizers**: Head to the [Visualizers](/visualizers) page to see all available algorithms.
2.  **Select an Algorithm**: Click on any algorithm card to go to its dedicated visualization page.
3.  **Interact**:
    *   **Input Data**: Many visualizers allow you to provide custom input (e.g., an array of numbers, a graph structure).
    *   **Controls**: Use the play, pause, step forward, and reset buttons to control the animation.
    *   **Animation Speed**: Adjust the animation speed slider for a comfortable pace.
4.  **Understand**:
    *   **Visualization Panel**: This is where the algorithm's actions are animated.
    *   **Code Panel**: Shows a conceptual implementation of the algorithm, with the current line of execution highlighted.
    *   **Details Card**: Provides information about the algorithm's properties, time/space complexity, and use cases.
5.  **Learn More**: Use these docs to understand the concepts more deeply.

### Tips for Effective Learning

-   **Start Simple**: Begin with fundamental algorithms like Linear Search or Bubble Sort.
-   **Experiment**: Use custom inputs to see how algorithms behave with different data.
-   **Predict**: Before stepping through, try to predict what the algorithm will do next.
-   **Correlate**: Pay attention to how the visual changes correspond to the highlighted code.
    `
  },
  "algorithms-visualized/time-and-space-complexity": {
    title: "Time and Space Complexity",
    content: `
Understanding time and space complexity is crucial for analyzing algorithms.

### ⏳ Time Complexity

Time complexity quantifies the amount of time taken by an algorithm to run as a function of the length of the input. It's usually expressed using Big O notation (e.g., O(N), O(N log N), O(N²)).

-   **O(1) - Constant Time**: The algorithm takes the same amount of time regardless of input size. Example: Accessing an array element by index.
-   **O(log N) - Logarithmic Time**: Time increases logarithmically with input size. Common in algorithms that divide the problem in half repeatedly. Example: Binary Search.
-   **O(N) - Linear Time**: Time increases linearly with input size. Example: Traversing an array or linked list.
-   **O(N log N) - Log-Linear Time**: Common in efficient sorting algorithms. Example: Merge Sort, Heap Sort.
-   **O(N²) - Quadratic Time**: Time increases quadratically. Common in algorithms with nested loops over the input. Example: Bubble Sort, Selection Sort (simple implementations).
-   **O(2^N) - Exponential Time**: Time grows very rapidly. Often seen in brute-force algorithms for combinatorial problems. Example: Recursive Fibonacci without memoization.
-   **O(N!) - Factorial Time**: Time grows extremely rapidly. Example: Traveling Salesperson Problem (brute-force).

### 💾 Space Complexity

Space complexity quantifies the amount of memory space taken by an algorithm to run as a function of the length of the input. It also uses Big O notation.

-   **O(1) - Constant Space**: The algorithm uses a fixed amount of memory, regardless of input size (auxiliary space). Example: In-place sorting algorithms like Bubble Sort (if not counting input array).
-   **O(N) - Linear Space**: Memory usage grows linearly with input size. Example: Storing a copy of the input array, or a recursion stack for a recursive algorithm that goes N levels deep.
-   **O(N²) - Quadratic Space**: Memory usage grows quadratically. Example: Storing an adjacency matrix for a graph with N vertices.

Understanding these complexities helps in choosing the most efficient algorithm for a given problem and predicting its performance.
    `
  },
  // Placeholder for other sections - can be populated later
  "getting-started/features-overview": { title: "Features Overview", content: "Content coming soon..." },
  "getting-started/faq": { title: "FAQ", content: "Content coming soon..." },
  "algorithms-visualized/sorting/bubble-sort": { title: "Bubble Sort", content: "Content coming soon..." },
  "algorithms-visualized/sorting/merge-sort": { title: "Merge Sort", content: "Content coming soon..." },
  "algorithms-visualized/sorting/quick-sort": { title: "Quick Sort", content: "Content coming soon..." },
  "algorithms-visualized/trees/binary-tree-basics": { title: "Binary Tree Basics", content: "Content coming soon..." },
  "algorithms-visualized/trees/traversals-explained": { title: "Traversals Explained", content: "Content coming soon..." },
  "algorithms-visualized/trees/bst-properties": { title: "BST Properties", content: "Content coming soon..." },
  "algorithms-visualized/graphs/dfs-vs-bfs": { title: "DFS vs BFS", content: "Content coming soon..." },
  "algorithms-visualized/graphs/weighted-graphs": { title: "Weighted Graphs", content: "Content coming soon..." },
  "algorithms-visualized/graphs/dijkstras-algo": { title: "Dijkstra’s Algo", content: "Content coming soon..." },
  "algorithms-visualized/backtracking/how-recursion-works": { title: "How Recursion Works", content: "Content coming soon..." },
  "algorithms-visualized/backtracking/n-queens-problem": { title: "N-Queens Problem", content: "Content coming soon..." },
  "algorithms-visualized/dynamic-programming/memoization-vs-tabulation": { title: "Memoization vs Tabulation", content: "Content coming soon..." },
  "playground-help/custom-input": { title: "How to use Custom Input", content: "Content coming soon..." },
  "playground-help/step-control": { title: "Step Control Features", content: "Content coming soon..." },
  "playground-help/animation-speed": { title: "Animation Speed Tips", content: "Content coming soon..." },
  "developer-contributor/folder-structure": { title: "Folder Structure", content: "Content coming soon..." },
  "developer-contributor/add-visualizer": { title: "How to Add a Visualizer", content: "Content coming soon..." },
  "developer-contributor/tech-stack": { title: "Tech Stack Used", content: "Content coming soon..." },
};
