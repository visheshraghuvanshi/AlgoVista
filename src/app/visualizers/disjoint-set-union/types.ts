// src/app/visualizers/disjoint-set-union/types.ts
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

// DSU specific step type
export interface DSUStep {
  parentArray: number[];
  rankArray?: number[]; // Optional, for union by rank
  sizeArray?: number[]; // Optional, for union by size
  operation: 'initial' | 'find' | 'union';
  elementsInvolved: number[]; // e.g., [i] for find, [i,j] for union
  root1?: number; // Root of first element in union/find
  root2?: number; // Root of second element in union
  pathCompressedNodes?: number[]; // Nodes whose parents were updated during path compression
  message: string;
  currentLine: number | null;
  // For potential compatibility with a generic panel that uses array-based visuals
  array?: number[]; // Not directly used for typical DSU forest viz
  activeIndices?: number[]; // Can highlight elementsInvolved
  swappingIndices?: number[];
  sortedIndices?: number[];
}
