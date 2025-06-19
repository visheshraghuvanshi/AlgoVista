
// src/app/visualizers/red-black-tree/types.ts
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

// --- Red-Black Tree Specific Types ---
export interface BinaryTreeNodeVisual {
  id: string;
  value: string | number | null; // Can be formatted string for display
  x: number;
  y: number;
  color?: string; // General fill color for the node (e.g., highlight)
  textColor?: string; // Text color for the node value
  nodeColor?: 'RED' | 'BLACK' | 'NIL'; // Specific RBT color property
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
  auxiliaryData?: Record<string, any> | null;
}

// From red-black-tree-logic.ts
export interface RBTNodeInternal {
  id: string;
  value: number | null; 
  color: boolean; // true for RED, false for BLACK
  leftId: string | null;
  rightId: string | null;
  parentId: string | null;
  depth?: number; 
  visualColor?: string; // For temporary highlights like "created"
}

export interface RBTreeGraph {
  rootId: string | null;
  nodesMap: Map<string, RBTNodeInternal>;
  nilNodeId: string; 
}

export type RBTOperationType = 'build' | 'insert' | 'search' | 'delete' | 'structure';

```