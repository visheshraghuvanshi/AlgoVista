
// src/app/visualizers/lowest-common-ancestor/types.ts
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

// --- LCA Specific Types (re-using Tree types from global for now, can be localized) ---
export interface BinaryTreeNodeVisual {
  id: string;
  value: string | number | null;
  x: number;
  y: number;
  color?: string;
  textColor?: string;
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
  traversalPath: (string | number)[]; // Can represent path to P or Q, or common path
  currentLine: number | null;
  message?: string;
  currentProcessingNodeId?: string | null; // Node being visited by DFS
  auxiliaryData?: {
    targetP?: string | number;
    targetQ?: string | number;
    pathP?: string[]; // Array of node IDs
    pathQ?: string[]; // Array of node IDs
    lcaNodeId?: string | null;
    lcaValue?: string | number | null;
    lcaHighlightIds?: string[]; // [pId, qId, lcaId]
    currentPathNodeIds?: string[]; // For findPathDFS
    pathFound?: boolean; // For LCA result
    [key: string]: any;
  } | null;
}

// From lca-logic.ts
export interface TreeInternalNode {
  id: string;
  value: string | number;
  leftId: string | null;
  rightId: string | null;
}
