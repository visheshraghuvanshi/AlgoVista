
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

AlgoVista now covers a wide range of topics, from fundamental sorting and searching algorithms to complex tree and graph traversals, dynamic programming, and various data structure operations.
    `
  },
  "getting-started/how-to-use": {
    title: "How to Use AlgoVista",
    content: `
Using AlgoVista is designed to be intuitive:

1.  **Navigate to Visualizers**: From the main navigation, select "Visualizers" to see the list of available algorithms and data structures.
2.  **Choose a Topic**: Click on any card (e.g., "Bubble Sort", "Binary Search Tree", "DFS") to open its dedicated interactive page.
3.  **Interact with the Visualizer**:
    *   **Input Data**: Most visualizers will have input field(s) where you can provide your own data (e.g., a comma-separated list of numbers for sorting, values for tree nodes, graph structure strings). Default data is usually provided.
    *   **Control Panel**: Use the control buttons:
        *   **Play/Pause**: Start or pause the step-by-step animation.
        *   **Step**: Manually advance the algorithm one step at a time.
        *   **Reset/Execute**: Resets the visualization to its initial state with the current input or executes the selected operation.
    *   **Animation Speed**: Adjust the slider to control how fast the animation plays.
4.  **Understand the Components**:
    *   **Visualization Panel**: This is the main area where the data structure or algorithm's state is animated (e.g., array bars changing, tree nodes highlighting, graph traversals).
    *   **Code Panel**: Displays conceptual code (often in multiple languages like JavaScript, Python, Java, C++) corresponding to the algorithm being visualized. The currently executing line or block of code is typically highlighted.
    *   **Algorithm Details Card**: Found below the visualizer, this card provides:
        *   A detailed description of the algorithm/data structure.
        *   Time and Space Complexity analysis (Best, Average, Worst cases).
        *   Common use cases.
5.  **Explore Documentation**: Use this Docs section (\`/docs\`) to delve deeper into theoretical concepts, understand algorithm categories, or get help with platform features.

### Tips for Effective Learning
-   **Start with Fundamentals**: If you're new, begin with simpler algorithms like Linear Search or Bubble Sort before moving to more complex ones.
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
-   **Interactive Visualizations**: Dynamic, step-by-step animations for a wide variety of algorithms and data structures.
-   **Synchronized Code Highlighting**: See conceptual code (in JavaScript, Python, Java, C++) execute in sync with visual changes.
-   **Customizable Input**: Test algorithms with your own datasets or use the provided defaults.
-   **Animation Controls**: Play, pause, step forward, and reset animations.
-   **Adjustable Animation Speed**: Control the visualization pace.
-   **Algorithm Details**: In-depth explanations, complexity analysis, and use cases for each topic.
-   **Categorized Content**: Visualizers are organized by common categories like Sorting, Trees, Graphs, Dynamic Programming, etc.
-   **Search & Filter**: Easily find specific visualizers on the main listing page.

### Platform Features
-   **Responsive Design**: Use AlgoVista on desktops, tablets, or mobile devices.
-   **Light/Dark Mode**: Choose your preferred viewing theme.
-   **Clear Navigation**: Intuitive site structure.
-   **Comprehensive Documentation**: Detailed explanations of algorithms and platform usage within this section.

### For Developers (Future/Conceptual)
-   **Open Source**: AlgoVista is planned as an open-source project. Check [GitHub](https://github.com/visheshraghuvanshi/AlgoVista).
-   **Modular Structure**: Designed for easier addition of new visualizers.

We are continuously working to expand the library of visualizers and enhance platform features!
    ` 
  },
  "getting-started/faq": { 
    title: "Frequently Asked Questions", 
    content: `
Here are some common questions about AlgoVista:

**Q: Who is AlgoVista for?**
A: AlgoVista is for CS students, self-taught developers, engineers prepping for interviews, and educators.

**Q: Is AlgoVista free?**
A: Yes, it's completely free.

**Q: What's the tech stack?**
A: Next.js (App Router), React, TypeScript, Tailwind CSS, Shadcn/UI, Lucide React. Genkit may be used for future AI features.

**Q: How can I contribute?**
A: Check our [GitHub repository](https://github.com/visheshraghuvanshi/AlgoVista) for contribution guidelines (when available).

**Q: Found an issue or have a suggestion?**
A: Report via GitHub issues or the [Contact](/contact) page.

**Q: Offline use?**
A: Currently web-based only.

**Q: Complexity analysis accuracy?**
A: Based on standard implementations. Specifics can vary.
    ` 
  },
  "algorithms-visualized/time-and-space-complexity": {
    title: "Time and Space Complexity",
    content: `
Understanding time and space complexity is fundamental to analyzing algorithms.

### ⏳ Time Complexity
Measures time taken as a function of input size (N), using Big O notation (worst-case).
-   **O(1)**: Constant time. E.g., array index access.
-   **O(log N)**: Logarithmic time. E.g., Binary Search.
-   **O(N)**: Linear time. E.g., Traversing an array.
-   **O(N log N)**: Log-Linear. E.g., Merge Sort, Heap Sort.
-   **O(N²)**: Quadratic time. E.g., Bubble Sort, Selection Sort.
-   **O(2^N)**: Exponential time. E.g., Naive recursive Fibonacci.
-   **O(N!)**: Factorial time. E.g., Brute-force Traveling Salesperson.

### 💾 Space Complexity
Measures memory used relative to input size.
-   **O(1)**: Constant space (auxiliary). E.g., In-place Bubble Sort.
-   **O(N)**: Linear space. E.g., Copying an array, recursion stack for path graph DFS.
-   **O(N²)**: Quadratic space. E.g., Adjacency matrix.

Complexities help predict performance as data scales, guiding algorithm choice.
    `
  },
  // Placeholders for all newly added visualizer docs
  // Fundamentals & Basic Search
  "algorithms-visualized/fundamentals/linear-search": { title: "Linear Search", content: "Linear Search documentation is coming soon!" },
  "algorithms-visualized/fundamentals/binary-search": { title: "Binary Search", content: "Binary Search documentation is coming soon!" },
  "algorithms-visualized/arrays-and-search/jump-search": { title: "Jump Search", content: "Jump Search documentation is coming soon!" },
  "algorithms-visualized/arrays-and-search/ternary-search": { title: "Ternary Search", content: "Ternary Search documentation is coming soon!" },
  // Sorting
  "algorithms-visualized/sorting/bubble-sort": { title: "Bubble Sort", content: "Bubble Sort documentation is coming soon!" },
  "algorithms-visualized/sorting/selection-sort": { title: "Selection Sort", content: "Selection Sort documentation is coming soon!" },
  "algorithms-visualized/sorting/insertion-sort": { title: "Insertion Sort", content: "Insertion Sort documentation is coming soon!" },
  "algorithms-visualized/sorting/merge-sort": { title: "Merge Sort", content: "Merge Sort documentation is coming soon!" },
  "algorithms-visualized/sorting/quick-sort": { title: "Quick Sort", content: "Quick Sort documentation is coming soon!" },
  "algorithms-visualized/sorting/heap-sort": { title: "Heap Sort", content: "Heap Sort documentation is coming soon!" },
  "algorithms-visualized/sorting/counting-sort": { title: "Counting Sort", content: "Counting Sort documentation is coming soon!" },
  "algorithms-visualized/sorting/radix-sort": { title: "Radix Sort", content: "Radix Sort documentation is coming soon!" },
  "algorithms-visualized/sorting/bucket-sort": { title: "Bucket Sort", content: "Bucket Sort documentation is coming soon!" },
  "algorithms-visualized/sorting/shell-sort": { title: "Shell Sort", content: "Shell Sort documentation is coming soon!" },
  "algorithms-visualized/sorting/cocktail-sort": { title: "Cocktail Shaker Sort", content: "Cocktail Shaker Sort documentation is coming soon!" },
  // Array Techniques
  "algorithms-visualized/arrays-and-search/kadanes-algorithm": { title: "Kadane's Algorithm", content: "Kadane's Algorithm documentation is coming soon!" },
  "algorithms-visualized/arrays-and-search/two-pointers": { title: "Two Pointers Technique", content: "Two Pointers Technique documentation is coming soon!" },
  "algorithms-visualized/arrays-and-search/sliding-window": { title: "Sliding Window Technique", content: "Sliding Window Technique documentation is coming soon!" },
  "algorithms-visualized/arrays-and-search/dutch-national-flag": { title: "Dutch National Flag Problem", content: "Dutch National Flag Problem documentation is coming soon!" },
  "algorithms-visualized/arrays-and-search/subarray-sum-problems": { title: "Subarray Sum Problems", content: "Subarray Sum Problems documentation is coming soon!" },
  // Trees
  "algorithms-visualized/trees/binary-tree-basics": { title: "Binary Tree Basics", content: "Binary Tree Basics documentation is coming soon!" },
  "algorithms-visualized/trees/binary-tree-traversal": { title: "Binary Tree Traversals", content: "Binary Tree Traversals documentation is coming soon!" },
  "algorithms-visualized/trees/binary-search-tree": { title: "Binary Search Tree (BST) Ops", content: "BST Operations documentation is coming soon!" },
  "algorithms-visualized/trees/avl-tree": { title: "AVL Tree Operations", content: "AVL Tree Operations documentation is coming soon!" },
  "algorithms-visualized/trees/red-black-tree": { title: "Red-Black Tree Operations", content: "Red-Black Tree Operations documentation is coming soon!" },
  "algorithms-visualized/trees/heap-operations": { title: "Heap Operations (Min-Heap)", content: "Heap Operations documentation is coming soon!" },
  "algorithms-visualized/trees/lowest-common-ancestor": { title: "Lowest Common Ancestor (LCA)", content: "LCA documentation is coming soon!" },
  "algorithms-visualized/trees/tree-path-problems": { title: "Tree Path Sum (Root-to-Leaf)", content: "Tree Path Sum documentation is coming soon!" },
  "algorithms-visualized/trees/morris-traversal": { title: "Morris Traversal (Inorder)", content: "Morris Traversal documentation is coming soon!" },
  // Graphs
  "algorithms-visualized/graphs/dfs-vs-bfs": { title: "DFS vs BFS", content: "DFS vs BFS documentation details coming soon!" },
  "algorithms-visualized/graphs/dfs": { title: "Depth-First Search (DFS)", content: "DFS documentation is coming soon!" },
  "algorithms-visualized/graphs/bfs": { title: "Breadth-First Search (BFS)", content: "BFS documentation is coming soon!" },
  "algorithms-visualized/graphs/weighted-graphs": { title: "Weighted Graphs", content: "Weighted Graphs documentation details coming soon!" },
  "algorithms-visualized/graphs/dijkstra": { title: "Dijkstra's Algorithm", content: "Dijkstra's Algorithm documentation is coming soon!" },
  "algorithms-visualized/graphs/bellman-ford": { title: "Bellman-Ford Algorithm", content: "Bellman-Ford Algorithm documentation is coming soon!" },
  "algorithms-visualized/graphs/floyd-warshall": { title: "Floyd-Warshall Algorithm", content: "Floyd-Warshall Algorithm documentation is coming soon!" },
  "algorithms-visualized/graphs/prims-algorithm": { title: "Prim's Algorithm (MST)", content: "Prim's Algorithm documentation is coming soon!" },
  "algorithms-visualized/graphs/kruskals-algorithm": { title: "Kruskal's Algorithm (MST)", content: "Kruskal's Algorithm documentation is coming soon!" },
  "algorithms-visualized/graphs/topological-sort": { title: "Topological Sort (Kahn's)", content: "Topological Sort documentation is coming soon!" },
  "algorithms-visualized/graphs/graph-cycle-detection": { title: "Graph Cycle Detection", content: "Graph Cycle Detection documentation is coming soon!" },
  "algorithms-visualized/graphs/connected-components": { title: "Connected Components & SCCs", content: "Connected Components & SCCs documentation is coming soon!" },
  // Backtracking
  "algorithms-visualized/backtracking/how-recursion-works": { title: "How Recursion Works", content: "Details on recursion coming soon!" },
  "algorithms-visualized/backtracking/n-queens-problem": { title: "N-Queens Problem", content: "N-Queens Problem documentation is coming soon!" },
  "algorithms-visualized/backtracking/sudoku-solver": { title: "Sudoku Solver", content: "Sudoku Solver documentation is coming soon!" },
  "algorithms-visualized/backtracking/rat-in-a-maze": { title: "Rat in a Maze", content: "Rat in a Maze documentation is coming soon!" },
  "algorithms-visualized/backtracking/permutations-subsets": { title: "Permutations & Subsets", content: "Permutations & Subsets documentation is coming soon!" },
  "algorithms-visualized/backtracking/tower-of-hanoi": { title: "Tower of Hanoi", content: "Tower of Hanoi documentation is coming soon!" },
  // Dynamic Programming
  "algorithms-visualized/dynamic-programming/memoization-vs-tabulation": { title: "Memoization vs Tabulation", content: "Details on DP approaches coming soon!" },
  "algorithms-visualized/dynamic-programming/knapsack-0-1": { title: "0/1 Knapsack Problem", content: "0/1 Knapsack documentation is coming soon!" },
  "algorithms-visualized/dynamic-programming/longest-common-subsequence": { title: "Longest Common Subsequence (LCS)", content: "LCS documentation is coming soon!" },
  "algorithms-visualized/dynamic-programming/longest-increasing-subsequence": { title: "Longest Increasing Subsequence (LIS)", content: "LIS documentation is coming soon!" },
  "algorithms-visualized/dynamic-programming/edit-distance": { title: "Edit Distance (Levenshtein)", content: "Edit Distance documentation is coming soon!" },
  "algorithms-visualized/dynamic-programming/matrix-chain-multiplication": { title: "Matrix Chain Multiplication", content: "MCM documentation is coming soon!" },
  "algorithms-visualized/dynamic-programming/coin-change": { title: "Coin Change Problem", content: "Coin Change documentation is coming soon!" },
  // Math & Number Theory
  "algorithms-visualized/math-and-number-theory/euclidean-gcd": { title: "Euclidean Algorithm (GCD)", content: "Euclidean GCD documentation is coming soon!" },
  "algorithms-visualized/math-and-number-theory/sieve-of-eratosthenes": { title: "Sieve of Eratosthenes", content: "Sieve of Eratosthenes documentation is coming soon!" },
  "algorithms-visualized/math-and-number-theory/prime-factorization": { title: "Prime Factorization", content: "Prime Factorization documentation is coming soon!" },
  "algorithms-visualized/math-and-number-theory/modular-exponentiation": { title: "Modular Exponentiation", content: "Modular Exponentiation documentation is coming soon!" },
  "algorithms-visualized/math-and-number-theory/base-conversions": { title: "Base Conversions", content: "Base Conversions documentation is coming soon!" },
  // Data Structures Visualized
  "data-structures-visualized/linear/stack-queue": { title: "Stack & Queue Operations", content: "Stack & Queue Operations documentation is coming soon!" },
  "data-structures-visualized/linear/deque-operations": { title: "Deque Operations", content: "Deque Operations documentation is coming soon!" },
  "data-structures-visualized/linked-lists/singly-linked-list": { title: "Singly Linked List", content: "Singly Linked List documentation is coming soon!" },
  "data-structures-visualized/linked-lists/doubly-linked-list": { title: "Doubly Linked List", content: "Doubly Linked List documentation is coming soon!" },
  "data-structures-visualized/linked-lists/circular-linked-list": { title: "Circular Linked List", content: "Circular Linked List documentation is coming soon!" },
  "data-structures-visualized/linked-lists/linked-list-reversal": { title: "Linked List Reversal", content: "Linked List Reversal documentation is coming soon!" },
  "data-structures-visualized/linked-lists/linked-list-cycle-detection": { title: "Linked List Cycle Detection", content: "Linked List Cycle Detection documentation is coming soon!" },
  "data-structures-visualized/linked-lists/merge-sorted-linked-lists": { title: "Merge Sorted Linked Lists", content: "Merge Sorted Linked Lists documentation is coming soon!" },
  "data-structures-visualized/trees-and-heaps/priority-queue": { title: "Priority Queue (Min-Heap)", content: "Priority Queue documentation is coming soon!" },
  "data-structures-visualized/trees-and-heaps/segment-tree": { title: "Segment Tree", content: "Segment Tree documentation is coming soon!" },
  "data-structures-visualized/trees-and-heaps/trie": { title: "Trie (Prefix Tree)", content: "Trie documentation is coming soon!" },
  "data-structures-visualized/trees-and-heaps/binary-indexed-tree": { title: "Binary Indexed Tree (BIT)", content: "BIT documentation is coming soon!" },
  "data-structures-visualized/specialized/disjoint-set-union": { title: "Disjoint Set Union (DSU)", content: "DSU documentation is coming soon!" },
  "data-structures-visualized/specialized/hash-table": { title: "Hash Table Operations", content: "Hash Table documentation is coming soon!" },
  "data-structures-visualized/specialized/top-k-elements": { title: "Top K Elements (using Heap)", content: "Top K Elements documentation is coming soon!" },
  // Playground Help
  "playground-help/custom-input": { 
    title: "How to Use Custom Input", 
    content: "Details on custom input for visualizers coming soon!" 
  },
  "playground-help/step-control": { 
    title: "Step Control Features", 
    content: "Explanation of step controls coming soon!" 
  },
  "playground-help/animation-speed": { 
    title: "Animation Speed Tips", 
    content: "Tips for adjusting animation speed coming soon!" 
  },
  // Developer/Contributor
  "developer-contributor/folder-structure": { 
    title: "Project Folder Structure", 
    content: `
The project follows a standard Next.js (App Router) structure.
Key directories:
- \`src/app/visualizers/[algorithm-slug]/\`: Each visualizer has its own folder containing:
  - \`page.tsx\`: Main component.
  - \`*VisualizationPanel.tsx\`: Renders the visual elements.
  - \`*CodePanel.tsx\`: Displays code snippets.
  - \`*-logic.ts\`: Core algorithm and step generation.
  - \`metadata.ts\`: Title, description, complexity.
  - \`types.ts\`: Local TypeScript types.
  - \`AlgorithmDetailsCard.tsx\`: Localized details card.
- \`src/app/visualizers/metadataRegistry.ts\`: Central list of all visualizers.
- \`src/components/\`: Shared UI components.
- \`src/lib/docs-content.ts\`: Content for these documentation pages.
- \`src/app/docs/docs-navigation.ts\`: Structure for the documentation sidebar.
    `
  },
  "developer-contributor/add-visualizer": { 
    title: "How to Add a New Visualizer", 
    content: "A guide on adding new visualizers will be detailed here. It involves creating the necessary files within a new slug-based folder under `/src/app/visualizers/`, implementing the logic, UI, and metadata, then registering it." 
  },
  "developer-contributor/tech-stack": { 
    title: "Technology Stack Used", 
    content: `
AlgoVista is built with:
- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/UI**
- **Lucide React (Icons)**
- (Potentially Framer Motion for advanced animations)
- (Potentially Genkit for AI features)
    ` 
  },
};

// Ensure all keys in docsNavigation have corresponding entries in docsContentBySlug
// This is a placeholder and should be filled with actual content for each page.
// Example:
// "algorithms-visualized/sorting/selection-sort": { title: "Selection Sort", content: "Selection Sort content coming soon..." },
// ... and so on for all items in docsNavigation.
// For now, I will create placeholders for any missing items.

import { docsNavigation, type NavItem } from '@/app/docs/docs-navigation';

function getAllSlugs(navItems: NavItem[]): string[] {
  let slugs: string[] = [];
  navItems.forEach(item => {
    if (item.href && item.href.startsWith('/docs/')) {
      slugs.push(item.href.substring('/docs/'.length));
    }
    if (item.children) {
      slugs = slugs.concat(getAllSlugs(item.children));
    }
  });
  return slugs;
}

const allDefinedSlugs = getAllSlugs(docsNavigation);

allDefinedSlugs.forEach(slug => {
  if (!docsContentBySlug[slug]) {
    const titleParts = slug.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Coming Soon";
    docsContentBySlug[slug] = {
      title: titleParts,
      content: `${titleParts} documentation is coming soon! Check back later for more details on this topic.`
    };
  }
});
