
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

// N-Queens specific step type, tailored for the optimized backtracking approach
export interface NQueensStep {
  board: number[][]; // Represents the N x N board, e.g., 1 for Queen, 0 for empty
  currentCell?: { 
    row: number; 
    col: number; 
    action: 'try_place' | 'place_safe' | 'place_unsafe' | 'backtrack_remove' | 'solution_found' | 'stuck';
  };
  isSafe?: boolean;
  solutionFound?: boolean; // True if a full solution is found in this step
  foundSolutionsCount: number;
  message: string;
  currentLine: number | null;
  // Auxiliary data to show the state of the optimized check arrays
  auxiliaryData?: {
    cols: boolean[];
    diag1: boolean[];
    diag2: boolean[];
  } | null;
}


    