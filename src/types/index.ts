
export type AlgorithmCategory = 'Sorting' | 'Searching' | 'Graph' | 'Tree' | 'Recursion' | 'Dynamic Programming' | 'Data Structures' | 'Other';
export type AlgorithmDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface AlgorithmMetadata {
  slug: string;
  title: string;
  category: AlgorithmCategory;
  difficulty: AlgorithmDifficulty;
  description: string;
  longDescription?: string; 
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
  color: string;
  leftId?: string | null; // ID of the left child
  rightId?: string | null; // ID of the right child
}

export interface BinaryTreeEdgeVisual {
  id: string; // e.g., "parentId-childId"
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
}


// Union type if needed, or components can just expect one type.
// For now, page components will manage which step type they use.

// Alias for clarity in component props
export type AlgorithmStep = ArrayAlgorithmStep; // For sorting/searching pages
// Graph algorithm pages will use GraphAlgorithmStep directly.
// Tree algorithm pages will use TreeAlgorithmStep directly.

