
export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  children?: NavItem[];
  icon?: React.ElementType; // Optional icon component
}

export const docsNavigation: NavItem[] = [
  {
    title: "📘 Getting Started",
    children: [
      { title: "What is AlgoVista?", href: "/docs/getting-started/what-is-algovista" },
      { title: "How to Use", href: "/docs/getting-started/how-to-use" },
      { title: "Features Overview", href: "/docs/getting-started/features-overview" },
      { title: "FAQ", href: "/docs/getting-started/faq" },
    ],
  },
  {
    title: "⚙️ Algorithms Visualized",
    children: [
      { title: "Time and Space Complexity", href: "/docs/algorithms-visualized/time-and-space-complexity" },
      {
        title: "Fundamentals & Basic Search",
        children: [
          { title: "Linear Search", href: "/docs/algorithms-visualized/fundamentals/linear-search" },
          { title: "Binary Search", href: "/docs/algorithms-visualized/fundamentals/binary-search" },
          { title: "Jump Search", href: "/docs/algorithms-visualized/arrays-and-search/jump-search" },
          { title: "Ternary Search", href: "/docs/algorithms-visualized/arrays-and-search/ternary-search" },
        ]
      },
      {
        title: "Sorting Algorithms",
        children: [
          { title: "Bubble Sort", href: "/docs/algorithms-visualized/sorting/bubble-sort" },
          { title: "Selection Sort", href: "/docs/algorithms-visualized/sorting/selection-sort" },
          { title: "Insertion Sort", href: "/docs/algorithms-visualized/sorting/insertion-sort" },
          { title: "Merge Sort", href: "/docs/algorithms-visualized/sorting/merge-sort" },
          { title: "Quick Sort", href: "/docs/algorithms-visualized/sorting/quick-sort" },
          { title: "Heap Sort", href: "/docs/algorithms-visualized/sorting/heap-sort" },
          { title: "Counting Sort", href: "/docs/algorithms-visualized/sorting/counting-sort" },
          { title: "Radix Sort", href: "/docs/algorithms-visualized/sorting/radix-sort" },
          { title: "Bucket Sort", href: "/docs/algorithms-visualized/sorting/bucket-sort" },
          { title: "Shell Sort", href: "/docs/algorithms-visualized/sorting/shell-sort" },
          { title: "Cocktail Shaker Sort", href: "/docs/algorithms-visualized/sorting/cocktail-sort" },
        ],
      },
      {
        title: "Array Techniques",
        children: [
            { title: "Kadane's Algorithm", href: "/docs/algorithms-visualized/arrays-and-search/kadanes-algorithm" },
            { title: "Two Pointers Technique", href: "/docs/algorithms-visualized/arrays-and-search/two-pointers" },
            { title: "Sliding Window Technique", href: "/docs/algorithms-visualized/arrays-and-search/sliding-window" },
            { title: "Dutch National Flag", href: "/docs/algorithms-visualized/arrays-and-search/dutch-national-flag" },
            { title: "Subarray Sum Problems", href: "/docs/algorithms-visualized/arrays-and-search/subarray-sum-problems" },
        ]
      },
      {
        title: "Trees",
        children: [
          { title: "Binary Tree Basics", href: "/docs/algorithms-visualized/trees/binary-tree-basics" },
          { title: "Binary Tree Traversals", href: "/docs/algorithms-visualized/trees/binary-tree-traversal" },
          { title: "Binary Search Tree (BST) Ops", href: "/docs/algorithms-visualized/trees/binary-search-tree" },
          { title: "AVL Tree Operations", href: "/docs/algorithms-visualized/trees/avl-tree" },
          { title: "Red-Black Tree Operations", href: "/docs/algorithms-visualized/trees/red-black-tree" },
          { title: "Heap Operations (Min-Heap)", href: "/docs/algorithms-visualized/trees/heap-operations" },
          { title: "Lowest Common Ancestor (LCA)", href: "/docs/algorithms-visualized/trees/lowest-common-ancestor" },
          { title: "Tree Path Sum (Root-to-Leaf)", href: "/docs/algorithms-visualized/trees/tree-path-problems" },
          { title: "Morris Traversal (Inorder)", href: "/docs/algorithms-visualized/trees/morris-traversal" },
        ],
      },
      {
        title: "Graphs",
        children: [
          { title: "DFS vs BFS", href: "/docs/algorithms-visualized/graphs/dfs-vs-bfs" },
          { title: "Depth-First Search (DFS)", href: "/docs/algorithms-visualized/graphs/dfs" },
          { title: "Breadth-First Search (BFS)", href: "/docs/algorithms-visualized/graphs/bfs" },
          { title: "Weighted Graphs", href: "/docs/algorithms-visualized/graphs/weighted-graphs" },
          { title: "Dijkstra's Algorithm", href: "/docs/algorithms-visualized/graphs/dijkstra" },
          { title: "Bellman-Ford Algorithm", href: "/docs/algorithms-visualized/graphs/bellman-ford" },
          { title: "Floyd-Warshall Algorithm", href: "/docs/algorithms-visualized/graphs/floyd-warshall" },
          { title: "Prim's Algorithm (MST)", href: "/docs/algorithms-visualized/graphs/prims-algorithm" },
          { title: "Kruskal's Algorithm (MST)", href: "/docs/algorithms-visualized/graphs/kruskals-algorithm" },
          { title: "Topological Sort (Kahn's)", href: "/docs/algorithms-visualized/graphs/topological-sort" },
          { title: "Graph Cycle Detection", href: "/docs/algorithms-visualized/graphs/graph-cycle-detection" },
          { title: "Connected Components & SCCs", href: "/docs/algorithms-visualized/graphs/connected-components" },
        ],
      },
      {
        title: "Backtracking",
        children: [
          { title: "How Recursion Works", href: "/docs/algorithms-visualized/backtracking/how-recursion-works" },
          { title: "N-Queens Problem", href: "/docs/algorithms-visualized/backtracking/n-queens-problem" },
          { title: "Sudoku Solver", href: "/docs/algorithms-visualized/backtracking/sudoku-solver" },
          { title: "Rat in a Maze", href: "/docs/algorithms-visualized/backtracking/rat-in-a-maze" },
          { title: "Permutations & Subsets", href: "/docs/algorithms-visualized/backtracking/permutations-subsets" },
          { title: "Tower of Hanoi", href: "/docs/algorithms-visualized/backtracking/tower-of-hanoi" },
        ],
      },
      {
        title: "Dynamic Programming",
        children: [
          { title: "Memoization vs Tabulation", href: "/docs/algorithms-visualized/dynamic-programming/memoization-vs-tabulation" },
          { title: "0/1 Knapsack Problem", href: "/docs/algorithms-visualized/dynamic-programming/knapsack-0-1" },
          { title: "Longest Common Subsequence (LCS)", href: "/docs/algorithms-visualized/dynamic-programming/longest-common-subsequence" },
          { title: "Longest Increasing Subsequence (LIS)", href: "/docs/algorithms-visualized/dynamic-programming/longest-increasing-subsequence" },
          { title: "Edit Distance (Levenshtein)", href: "/docs/algorithms-visualized/dynamic-programming/edit-distance" },
          { title: "Matrix Chain Multiplication", href: "/docs/algorithms-visualized/dynamic-programming/matrix-chain-multiplication" },
          { title: "Coin Change Problem", href: "/docs/algorithms-visualized/dynamic-programming/coin-change" },
        ],
      },
       {
        title: "Math & Number Theory",
        children: [
          { title: "Euclidean Algorithm (GCD)", href: "/docs/algorithms-visualized/math-and-number-theory/euclidean-gcd" },
          { title: "Sieve of Eratosthenes", href: "/docs/algorithms-visualized/math-and-number-theory/sieve-of-eratosthenes" },
          { title: "Prime Factorization", href: "/docs/algorithms-visualized/math-and-number-theory/prime-factorization" },
          { title: "Modular Exponentiation", href: "/docs/algorithms-visualized/math-and-number-theory/modular-exponentiation" },
          { title: "Base Conversions", href: "/docs/algorithms-visualized/math-and-number-theory/base-conversions" },
        ]
      },
    ],
  },
  {
    title: "🧱 Data Structures Visualized",
    children: [
      {
        title: "Linear Data Structures",
        children: [
          { title: "Stack Operations", href: "/docs/data-structures-visualized/linear/stack-queue" }, // Reuse stack-queue page
          { title: "Queue Operations", href: "/docs/data-structures-visualized/linear/stack-queue" }, // Points to same page, section can clarify
          { title: "Deque Operations", href: "/docs/data-structures-visualized/linear/deque-operations" },
        ]
      },
      {
        title: "Linked Lists",
        children: [
          { title: "Singly Linked List", href: "/docs/data-structures-visualized/linked-lists/singly-linked-list" },
          { title: "Doubly Linked List", href: "/docs/data-structures-visualized/linked-lists/doubly-linked-list" },
          { title: "Circular Linked List", href: "/docs/data-structures-visualized/linked-lists/circular-linked-list" },
          { title: "Linked List Reversal", href: "/docs/data-structures-visualized/linked-lists/linked-list-reversal" },
          { title: "Linked List Cycle Detection", href: "/docs/data-structures-visualized/linked-lists/linked-list-cycle-detection" },
          { title: "Merge Sorted Linked Lists", href: "/docs/data-structures-visualized/linked-lists/merge-sorted-linked-lists" },
        ],
      },
      {
        title: "Trees & Heaps", // Combined as Heaps are tree-based
        children: [
          // Tree structures themselves are covered in "Algorithms Visualized > Trees"
          { title: "Priority Queue (Min-Heap)", href: "/docs/data-structures-visualized/trees-and-heaps/priority-queue" },
          { title: "Segment Tree", href: "/docs/data-structures-visualized/trees-and-heaps/segment-tree" },
          { title: "Trie (Prefix Tree)", href: "/docs/data-structures-visualized/trees-and-heaps/trie" },
          { title: "Binary Indexed Tree (BIT)", href: "/docs/data-structures-visualized/trees-and-heaps/binary-indexed-tree" },
        ]
      },
      {
        title: "Other Specialized Structures",
        children: [
          { title: "Disjoint Set Union (DSU)", href: "/docs/data-structures-visualized/specialized/disjoint-set-union" },
          { title: "Hash Table Operations", href: "/docs/data-structures-visualized/specialized/hash-table" },
          { title: "Top K Elements (using Heap)", href: "/docs/data-structures-visualized/specialized/top-k-elements" },
        ]
      }
    ]
  },
  {
    title: "🧪 Playground Help",
    children: [
      { title: "How to use Custom Input", href: "/docs/playground-help/custom-input" },
      { title: "Step Control Features", href: "/docs/playground-help/step-control" },
      { title: "Animation Speed Tips", href: "/docs/playground-help/animation-speed" },
    ],
  },
  {
    title: "🛠️ Developer/Contributor",
    children: [
      { title: "Folder Structure", href: "/docs/developer-contributor/folder-structure" },
      { title: "How to Add a Visualizer", href: "/docs/developer-contributor/add-visualizer" },
      { title: "Tech Stack Used", href: "/docs/developer-contributor/tech-stack" },
    ],
  },
];
