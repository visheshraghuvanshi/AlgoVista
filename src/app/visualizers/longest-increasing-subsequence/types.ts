
// src/app/visualizers/longest-increasing-subsequence/types.ts
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

// Specific DPAlgorithmStep for LIS (if different from global or other DP problems)
// Using a general DPAlgorithmStep structure here.
export interface DPAlgorithmStep {
  dpTable: number[][] | number[]; // For LIS (N^2), dpTable is 1D
  dpTableDimensions?: { rows: number; cols: number }; 
  currentIndices?: { [key: string]: number | undefined }; // e.g., { i: 1, j: 0 } for LIS N^2
  highlightedCells?: Array<{
    row: number; // For 2D, use 0 for 1D
    col: number; // Index in the 1D dpTable for LIS
    type: 'current' | 'dependency' | 'result';
  }>;
  message?: string;
  currentLine: number | null;
  resultValue?: number | string | null; 
  auxiliaryData?: Record<string, any> | null; // For inputArray, current maxLength
  // Generic fields not always used by DP visualizers but kept for potential AlgorithmStep union
  array?: number[]; // The input array for LIS
  activeIndices?: number[]; // Indices in input array being actively compared
  swappingIndices?: number[]; // Not used
  sortedIndices?: number[]; // Not directly used for LIS length problem
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
}
