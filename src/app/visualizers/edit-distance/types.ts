
// src/app/visualizers/edit-distance/types.ts
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

// Specific DPAlgorithmStep for Edit Distance
export interface DPAlgorithmStep {
  dpTable: number[][] | number[]; // For Edit Distance, dpTable is 2D
  dpTableDimensions?: { rows: number; cols: number }; 
  currentIndices?: { [key: string]: number | undefined }; // e.g., { i: 1, j: 2 }
  highlightedCells?: Array<{
    row: number;
    col: number;
    type: 'current' | 'dependency' | 'result';
  }>;
  message?: string;
  currentLine: number | null;
  resultValue?: number | string | null; 
  auxiliaryData?: Record<string, any> | null; // For str1, str2
  // Generic fields not always used by DP visualizers but kept for potential AlgorithmStep union
  array?: number[];
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
}
