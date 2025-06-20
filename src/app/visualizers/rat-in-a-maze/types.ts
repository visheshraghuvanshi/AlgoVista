
// src/app/visualizers/rat-in-a-maze/types.ts
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

// Rat in a Maze specific step type (replaces usage of SudokuStep)
export interface RatInAMazeStep {
  maze: number[][]; // Visual board: 0=wall, 1=path, 2=solution path taken
  initialBoard: number[][] | null; // Original maze (0s and 1s)
  currentPosition?: { row: number; col: number; };
  action?: 'try_move' | 'mark_path' | 'backtrack_remove' | 'goal_reached' | 'stuck' | 'blocked' | 'checking_safe';
  isSafe?: boolean; // Result of isSafe check for currentPosition
  solutionFound?: boolean;
  message: string;
  currentLine: number | null;
  // Common AlgorithmStep fields (less relevant for maze but for consistency)
  activeIndices?: number[]; // Can map to [row, col]
  swappingIndices?: number[];
  sortedIndices?: number[];
  auxiliaryData?: Record<string, any> | null;
}

