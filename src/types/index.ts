
export type AlgorithmCategory = 'Sorting' | 'Searching' | 'Graph' | 'Tree' | 'Recursion' | 'Dynamic Programming' | 'Data Structures' | 'Other' | 'Fundamentals' | 'Arrays & Search' | 'Linked List' | 'Trees' | 'Graphs' | 'Backtracking' | 'Math & Number Theory';
export type AlgorithmDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface AlgorithmTimeComplexities {
  best: string;
  average: string;
  worst: string;
}

export interface AlgorithmMetadata {
  slug: string;
  title: string;
  category: AlgorithmCategory;
  difficulty: AlgorithmDifficulty;
  description: string; // Short description for card
  longDescription?: string; // Detailed explanation for individual page
  timeComplexities?: AlgorithmTimeComplexities;
  spaceComplexity?: string;
  tags?: string[];
  codeSnippets?: {
    [language: string]: string[];
  };
  pseudocode?: string[];
}

// For array-based algorithms (sorting, searching)
export type ArrayAlgorithmStep = {
  array: number[];
  activeIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  currentLine: number | null;
  message?: string;
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
  auxiliaryData?: Record<string, string | number | null>; // For Kadane's, Segment Tree query result etc.
};

// For graph-based algorithms
export interface GraphNode {
  id: string;
  label: string;
  x: number; // For layout
  y: number; // For layout
  color: string; // To indicate state: e.g., default, visiting, visited, in_queue/stack
  isStartNode?: boolean;
  distance?: number | string; // For algorithms like Dijkstra
}

export interface GraphEdge {
  id: string; // e.g., "sourceId-targetId"
  source: string; // source node id
  target: string; // target node id
  color: string; // To indicate state: e.g., default, traversed
  weight?: number; // For weighted graphs
  isDirected?: boolean; // Default to undirected unless specified
}

export interface GraphAlgorithmStep {
  nodes: GraphNode[];
  edges: GraphEdge[];
  auxiliaryData?: {
    type: 'queue' | 'stack' | 'set' | 'distances' | 'path';
    label: string;
    values: string[] | { [key: string]: string | number };
  }[];
  currentLine: number | null;
  message?: string;
}

// Types for Binary Tree Traversal
export interface BinaryTreeNodeVisual {
  id: string;
  value: string | number | null;
  x: number;
  y: number;
  color: string; // Visual fill color (can be for state highlighting)
  textColor?: string; // Explicit text color
  nodeColor?: 'RED' | 'BLACK' | string; // Specific RBT color or other type
  leftId?: string | null;
  rightId?: string | null;
}

export interface BinaryTreeEdgeVisual {
  id: string;
  sourceId: string;
  targetId: string;
  color?: string;
}

export interface TreeAlgorithmStep {
  nodes: BinaryTreeNodeVisual[];
  edges: BinaryTreeEdgeVisual[];
  traversalPath: (string | number)[];
  currentLine: number | null;
  message?: string;
  currentProcessingNodeId?: string | null;
  auxiliaryData?: Record<string, string | number | null>;
}

// Types for Linked List Visualizations
export interface LinkedListNodeVisual {
  id: string; // Unique ID for the node (e.g., value or index-based)
  value: string | number;
  nextId?: string | null; // ID of the next node
  prevId?: string | null; // ID of the previous node (for DoublyLinkedList)
  color: string; // For highlighting: default, active, new, deleted
  isHead?: boolean;
  isTail?: boolean; // For DLL or SLL with tail pointer
  isSlow?: boolean; // For cycle detection
  isFast?: boolean; // For cycle detection
  x?: number; // Position for rendering
  y?: number; // Position for rendering
}

export type LinkedListType = 'singly' | 'doubly' | 'circular';

export interface LinkedListAlgorithmStep {
  nodes: LinkedListNodeVisual[]; // Current state of the list
  headId?: string | null;
  tailId?: string | null; // For DLL or SLL with tail pointer
  currentLine: number | null;
  message?: string;
  auxiliaryPointers?: Record<string, string | null>; // e.g., { current: 'node-1', prevNode: null, nextNode: 'node-2' }
  operation?: string; // e.g., 'insert-head', 'delete-value', 'reverse', 'detect-cycle-move'
  status?: 'success' | 'failure' | 'info'; // For operation outcomes
  isCycleDetected?: boolean;
  mergedListNodes?: LinkedListNodeVisual[]; // For merge operations
}


// Union type if needed, or components can just expect one type.
// For now, page components will manage which step type they use.
export type AlgorithmStep = ArrayAlgorithmStep; // Default alias
// Graph algorithm pages will use GraphAlgorithmStep directly.
// Tree algorithm pages will use TreeAlgorithmStep directly.
// Linked list pages will use LinkedListAlgorithmStep directly.

