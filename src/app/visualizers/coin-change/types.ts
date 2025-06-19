
// src/app/visualizers/coin-change/types.ts
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

// Specific DPAlgorithmStep for Coin Change (1D DP Table)
export interface DPAlgorithmStep {
  dpTable: number[]; // Represents the 1D DP table
  currentIndices?: { amount?: number; coin?: number }; // i (currentAmount), coinValue
  highlightedCells?: Array<{
    row: number; // Will typically be 0 for 1D visualization representing the DP array
    col: number; // Index in the 1D dpTable
    type: 'current' | 'dependency' | 'result';
  }>;
  message?: string;
  currentLine: number | null;
  resultValue?: number | string | null; // Final result (min coins or num ways)
  auxiliaryData?: {
    coins?: number[];
    amount?: number;
    problemType?: string;
    infinityVal?: number; // For minCoins, the value representing infinity
    currentCalculation?: string; // To show how dp[i] is being calculated
    [key: string]: any;
  } | null;
  // Generic fields from global AlgorithmStep that might be less relevant here
  array?: number[]; // Can be used to show original coins input array if needed
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
  dpTableDimensions?: { rows: number, cols: number }; // For 1D, cols would be length
}

// CoinChangeProblemType is defined in coin-change-logic.ts
// but could be moved here if preferred for centralization of types.
// export type CoinChangeProblemType = 'minCoins' | 'numWays';
