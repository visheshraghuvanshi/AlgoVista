
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
        title: "Sorting",
        children: [
          { title: "Bubble Sort", href: "/docs/algorithms-visualized/sorting/bubble-sort" },
          { title: "Merge Sort", href: "/docs/algorithms-visualized/sorting/merge-sort" },
          { title: "Quick Sort", href: "/docs/algorithms-visualized/sorting/quick-sort" },
        ],
      },
      {
        title: "Trees",
        children: [
          { title: "Binary Tree Basics", href: "/docs/algorithms-visualized/trees/binary-tree-basics" },
          { title: "Traversals Explained", href: "/docs/algorithms-visualized/trees/traversals-explained" },
          { title: "BST Properties", href: "/docs/algorithms-visualized/trees/bst-properties" },
        ],
      },
      {
        title: "Graphs",
        children: [
          { title: "DFS vs BFS", href: "/docs/algorithms-visualized/graphs/dfs-vs-bfs" },
          { title: "Weighted Graphs", href: "/docs/algorithms-visualized/graphs/weighted-graphs" },
          { title: "Dijkstra’s Algo", href: "/docs/algorithms-visualized/graphs/dijkstras-algo" },
        ],
      },
      {
        title: "Backtracking",
        children: [
          { title: "How Recursion Works", href: "/docs/algorithms-visualized/backtracking/how-recursion-works" },
          { title: "N-Queens Problem", href: "/docs/algorithms-visualized/backtracking/n-queens-problem" },
        ],
      },
      {
        title: "Dynamic Programming",
        children: [
          { title: "Memoization vs Tabulation", href: "/docs/algorithms-visualized/dynamic-programming/memoization-vs-tabulation" },
        ],
      },
    ],
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
