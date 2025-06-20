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
  value: string | number | null; // The primary value of the node
  height: number;               // Height of the node
  balanceFactor: number;        // Balance factor of the node
  x: number;
  y: number;
  color?: string; 
  textColor?: string;
  leftId?: string | null;
  rightId?: string | null;
  // nodeColor specific to RBT, not typically used in basic AVL visual
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
  currentProcessingNodeId?: string | null; // Node being actively processed/compared
  unbalancedNodeId?: string | null;        // ID of the first unbalanced node found
  rotationType?: 'LL' | 'RR' | 'LR' | 'RL' | 'None' | null; // Type of rotation performed or needed
  nodesInvolvedInRotation?: string[]; // IDs of nodes directly involved in a rotation (e.g., x, y, z)
  auxiliaryData?: {
    finalGraphState?: AVLTreeGraph; // To update the main tree ref after an operation
    [key: string]: any;
  } | null;
}

// Internal representation for AVL logic
export interface AVLNodeInternal {
  id: string;
  value: number;
  height: number;
  balanceFactor?: number; // Optional here, but calculated and stored
  leftId: string | null;
  rightId: string | null;
  parentId: string | null; 
}

export interface AVLTreeGraph {
  rootId: string | null;
  nodesMap: Map<string, AVLNodeInternal>;
  // NIL node not typically explicit in AVL like in RBT, but could be if using sentinels
}

export type AVLOperationType = 'build' | 'insert' | 'delete' | 'search' | 'structure';
```