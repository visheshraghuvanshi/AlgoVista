
// src/app/visualizers/matrix-chain-multiplication/types.ts
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

// Specific DPAlgorithmStep for Matrix Chain Multiplication
export interface DPAlgorithmStep {
  dpTable: number[][] | number[]; // For MCM, dpTable is 2D
  dpTableDimensions?: { rows: number; cols: number }; 
  currentIndices?: { [key: string]: number | undefined }; // e.g., { L: chainLength, i: startMatrix, j: endMatrix, k: splitPoint }
  highlightedCells?: Array<{
    row: number; // Corresponds to 'i' in dp[i][j]
    col: number; // Corresponds to 'j' in dp[i][j]
    type: 'current' | 'dependency' | 'result';
  }>;
  message?: string;
  currentLine: number | null;
  resultValue?: number | string | null; 
  auxiliaryData?: Record<string, any> | null; // For pArray (dimensions), nMatrices, costCalculation string
  // Generic fields
  array?: number[];
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
}
