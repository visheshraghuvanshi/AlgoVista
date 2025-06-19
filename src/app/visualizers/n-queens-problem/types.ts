
// src/app/visualizers/n-queens-problem/types.ts
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

// N-Queens specific step type
export interface NQueensStep {
  board: number[][]; // Represents the N x N board, e.g., 1 for Queen, 0 for empty
  currentQueen?: { row: number; col: number; action: 'place' | 'remove' | 'checking_safe' | 'backtracking_from' | 'try_move' | 'blocked' | 'goal_reached' | 'stuck' };
  foundSolutions?: number[][][]; // Array of found board states
  isSafe?: boolean;
  message: string;
  currentLine: number | null;
  // Minimal common fields from global AlgorithmStep, if needed by shared components
  array?: number[]; // Not directly used
  activeIndices?: number[]; // Can represent currentQueen's [row, col]
  swappingIndices?: number[]; // Not used
  sortedIndices?: number[]; // Not used
  solutionFound?: boolean; // To indicate if final solution is found
  initialBoard?: number[][] | null; // To distinguish original cells in Sudoku like problems
}
