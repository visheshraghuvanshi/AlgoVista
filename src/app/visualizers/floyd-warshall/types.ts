// src/app/visualizers/floyd-warshall/types.ts
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

// Using DPAlgorithmStep type
export interface DPAlgorithmStep {
  dpTable: number[][] | number[]; // Can be 1D or 2D DP table
  dpTableDimensions?: { rows: number; cols: number }; // For 2D tables
  currentIndices?: { [key: string]: number | undefined }; // e.g., { i: 1, j: 2, k: 0 }
  highlightedCells?: Array<{
    row: number;
    col: number;
    type: 'current' | 'dependency' | 'result' | 'path';
  }>;
  message?: string;
  currentLine: number | null;
  resultValue?: number | string | null; // Final result of the DP calculation
  selectedItems?: Array<{weight: number, value: number}>; // For Knapsack item reconstruction
  auxiliaryData?: Record<string, any> | null;
  // Generic fields not always used by DP visualizers but kept for potential AlgorithmStep union
  array?: number[];
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
}
