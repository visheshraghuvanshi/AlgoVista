
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

// Specific types for Binary Indexed Tree
export type BITOperationType = 'build' | 'update' | 'query' | 'queryRange';

export interface BITAlgorithmStep {
  bitArray: number[];         // The BIT itself (1-indexed conceptually, stored 0-indexed with tree[0] unused)
  originalArray?: number[];   // The original array (0-indexed) for context
  operation: BITOperationType;
  currentIndex?: number;      // 0-based index in originalArray or 1-based for BIT operations logic
  currentValue?: number;      // Value being processed from original array (for build)
  delta?: number;             // Value for update operation
  queryResult?: number;       // Result of a query operation
  range?: { start: number; end: number }; // For range query
  message?: string;
  currentLine: number | null;
  activeBitIndices?: number[];// 1-based indices in BIT being accessed/modified
  // Common AlgorithmStep fields (less relevant but for consistency if needed by generic panel)
  activeIndices?: number[];     // Can map to original array index
  swappingIndices?: number[];
  sortedIndices?: number[];
  auxiliaryData?: Record<string, any>; // For additional info like sum_so_far during query
}

    