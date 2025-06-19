
// src/app/visualizers/sudoku-solver/types.ts
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

// Sudoku specific step type
export interface SudokuStep {
  board: number[][]; // 9x9 Sudoku board
  initialBoard?: number[][] | null; // To distinguish original numbers
  currentCell?: {
    row: number;
    col: number;
    num?: number; // Number being tried
    action: 'find_empty' | 'try_num' | 'place_num' | 'backtrack_remove' | 'check_safe' | 'solution_found' | 'no_solution';
  };
  isSafe?: boolean; // Result of isSafe check for currentCell.num
  solutionFound?: boolean;
  message: string;
  currentLine: number | null;
  // Common AlgorithmStep fields (less relevant for Sudoku board but for consistency)
  activeIndices?: number[]; // Can map to [row, col]
  swappingIndices?: number[];
  sortedIndices?: number[];
}
