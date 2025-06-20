// src/app/visualizers/avl-tree/types.ts
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

// --- AVL Tree Specific Types ---
export interface BinaryTreeNodeVisual {
  id: string;
  value: string | number | null; // Formatted as "Val (H:h, B:bf)"
  x: number;
  y: number;
  color?: string; // For highlighting states like active, path, rotated
  textColor?: string;
  leftId?: string | null;
  rightId?: string | null;
  // nodeColor might be used if extending for RBT-like visuals, but less critical for AVL color-coding
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
  traversalPath: (string | number)[]; // Often node values or IDs on the current DFS path
  currentLine: number | null;
  message?: string;
  currentProcessingNodeId?: string | null; // ID of node being actively processed
  auxiliaryData?: Record<string, any> | null; // For balance factors, rotation types etc.
}

// Internal representation for AVL logic
export interface AVLNodeInternal {
  id: string;
  value: number;
  height: number;
  // balanceFactor: number; // Calculated on the fly, not stored directly
  leftId: string | null;
  rightId: string | null;
  parentId: string | null; 
}

export type AVLOperationType = 'build' | 'insert' | 'delete' | 'search' | 'structure';
