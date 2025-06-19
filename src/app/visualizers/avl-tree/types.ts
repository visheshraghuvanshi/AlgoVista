
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
  value: string | number | null; // Can be formatted string for AVL (e.g., "val (H:h, B:b)")
  x: number;
  y: number;
  color?: string;
  textColor?: string;
  leftId?: string | null;
  rightId?: string | null;
  nodeColor?: 'RED' | 'BLACK'; // For RBT compatibility if panel is shared initially, less relevant for pure AVL
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
  traversalPath: (string | number)[]; // Often node values or IDs
  currentLine: number | null;
  message?: string;
  currentProcessingNodeId?: string | null; // ID of node being processed
  auxiliaryData?: Record<string, any> | null;
}

// From avl-tree-logic.ts
export interface AVLNodeInternal {
  id: string;
  value: number;
  height: number;
  leftId: string | null;
  rightId: string | null;
  parentId: string | null; 
}

```