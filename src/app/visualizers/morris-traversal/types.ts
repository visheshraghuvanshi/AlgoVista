
// src/app/visualizers/morris-traversal/types.ts
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
  description: string;
  longDescription?: string;
  timeComplexities?: AlgorithmTimeComplexities;
  spaceComplexity?: string;
  tags?: string[];
}

export interface AlgorithmDetailsProps {
  title: string;
  description: string;
  timeComplexities: AlgorithmTimeComplexities;
  spaceComplexity: string;
}

// --- Morris Traversal Specific Types (re-using Tree types from global/other visualizers) ---
export interface BinaryTreeNodeVisual {
  id: string;
  value: string | number | null;
  x: number;
  y: number;
  color?: string;
  textColor?: string;
  leftId?: string | null;
  rightId?: string | null;
  // Morris-specific visual cues if needed (e.g., isPredecessor, isThreaded)
  isCurrent?: boolean;
  isPredecessor?: boolean;
}

export interface BinaryTreeEdgeVisual {
  id: string;
  sourceId: string;
  targetId: string;
  color?: string;
  isThread?: boolean; // To visually distinguish temporary threads
}

export interface TreeAlgorithmStep {
  nodes: BinaryTreeNodeVisual[];
  edges: BinaryTreeEdgeVisual[];
  traversalPath: (string | number)[]; // Nodes visited in Inorder sequence
  currentLine: number | null;
  message?: string;
  currentProcessingNodeId?: string | null; // The 'current' pointer in Morris traversal
  predecessorNodeId?: string | null;     // The 'predecessor' pointer
  auxiliaryData?: {
    operation?: 'find_predecessor' | 'make_thread' | 'visit_node' | 'remove_thread' | 'move_right' | 'move_left' | 'complete';
    [key: string]: any;
  } | null;
}

    