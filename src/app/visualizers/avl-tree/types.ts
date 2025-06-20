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
  value: string | number | null; // Formatted as "Val (H:h, BF:bf)" by logic
  x: number;
  y: number;
  color?: string; 
  textColor?: string;
  height?: number; 
  balanceFactor?: number; 
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
  unbalancedNodeId?: string | null;
  rotationType?: 'LL' | 'RR' | 'LR' | 'RL' | null;
  nodesInvolvedInRotation?: string[]; 
  auxiliaryData?: {
    finalGraphState?: AVLTreeGraph; 
    [key: string]: any;
  } | null;
}

// Internal representation for AVL logic
export interface AVLNodeInternal {
  id: string;
  value: number;
  height: number;
  leftId: string | null;
  rightId: string | null;
  parentId: string | null; 
}

export interface AVLTreeGraph {
  rootId: string | null;
  nodesMap: Map<string, AVLNodeInternal>;
}

export type AVLOperationType = 'build' | 'insert' | 'delete' | 'search' | 'structure';
