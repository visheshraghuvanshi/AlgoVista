
// src/app/visualizers/huffman-coding/types.ts
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

// --- Huffman Coding Specific Types ---
export interface HuffmanFrequencyItem {
  id: string; // Unique ID for frequency item
  char: string;
  freq: number;
}

export interface HuffmanNodeForPQ {
  id: string; // Unique ID for this node in the PQ/tree construction phase
  char: string | null; // Null for internal nodes
  freq: number;
  leftId: string | null;
  rightId: string | null;
}

export interface HuffmanCodeItem {
  char: string;
  code: string;
}

// Re-using Binary Tree visualization types from global/types.ts
export interface BinaryTreeNodeVisual {
  id: string;
  value: string | number | null;
  char?: string | null; // For Huffman nodes
  freq?: number;       // For Huffman nodes
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

export interface HuffmanStep {
  phase: 'frequency_calculation' | 'pq_initialization' | 'tree_construction' | 'code_generation' | 'finished';
  message: string;
  currentLine: number | null;

  nodes?: BinaryTreeNodeVisual[]; // For Huffman tree visualization
  edges?: BinaryTreeEdgeVisual[]; // For Huffman tree visualization
  
  frequencies?: HuffmanFrequencyItem[];
  priorityQueueState?: HuffmanNodeForPQ[]; // Array representation of min-heap
  huffmanCodes?: HuffmanCodeItem[];
  
  currentProcessingNodeId?: string | null; // ID of HuffmanNodeForPQ or BinaryTreeNodeVisual
  activeNodeIds?: string[]; // e.g., nodes being dequeued from PQ
  mergedNodeId?: string | null; // ID of the newly created internal node
  currentPathForCode?: string; // e.g., "010" while generating codes

  // Unused generic AlgorithmStep fields
  traversalPath?: (string | number)[]; 
}
