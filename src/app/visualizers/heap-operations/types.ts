
// src/app/visualizers/heap-operations/types.ts
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

// --- Heap Operations Specific Types ---
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
  traversalPath: (string | number)[]; // Can represent heapify path values
  currentLine: number | null;
  message?: string;
  currentProcessingNodeId?: string | null;
  auxiliaryData?: Record<string, any> | null;
}

export type HeapOperationType = 'buildMinHeap' | 'insertMinHeap' | 'extractMin' | 'classDefinition';

