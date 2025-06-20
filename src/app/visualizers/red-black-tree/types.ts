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
  value: string | number | null; // Value to display (can be just the number or "NIL")
  x: number;
  y: number;
  color?: string; // Fill color for the node (e.g., from RBT_NODE_COLORS)
  textColor?: string; // Text color for the node value
  nodeColor?: 'RED' | 'BLACK' | 'NIL'; // The actual RBT color property for logic
  leftId?: string | null;
  rightId?: string | null;
  // Optional for RBT display if needed directly
  height?: number; 
  balanceFactor?: number; 
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
  traversalPath: (string | number)[]; // Path taken during search, or nodes involved in fixup
  currentLine: number | null;
  message?: string;
  currentProcessingNodeId?: string | null; 
  rotationType?: 'LL' | 'RR' | 'LR' | 'RL' | 'Left' | 'Right' | 'None' | null; // For rotations
  recolorNodes?: Array<{ id: string; newColor: 'RED' | 'BLACK' }>; // Nodes being recolored
  doubleBlackNodeId?: string | null; // For delete fixup visualization
  uncleColor?: 'RED' | 'BLACK' | null; // For insert fixup context
  auxiliaryData?: {
    finalGraphState?: RBTreeGraph; // To update the main tree ref after an operation
    [key: string]: any;
  } | null;
}

// Internal representation for RBT logic
export interface RBTNodeInternal {
  id: string;
  value: number | null; 
  color: boolean; // true for RED, false for BLACK
  leftId: string | null;
  rightId: string | null;
  parentId: string | null;
  isDoubleBlack?: boolean; // For delete fixup visualization
}

export interface RBTreeGraph {
  rootId: string | null;
  nodesMap: Map<string, RBTNodeInternal>;
  nilNodeId: string; // ID of the sentinel NIL node
}

export type RBTOperationType = 'build' | 'insert' | 'search' | 'delete' | 'structure';
