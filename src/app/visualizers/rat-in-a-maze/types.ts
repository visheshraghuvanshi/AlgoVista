
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

// Rat in a Maze specific step type
export interface RatInAMazeStep {
  maze: number[][]; // 0 for wall, 1 for path, 2 for solution path
  currentPosition?: { row: number; col: number; };
  action?: 'try_move' | 'mark_path' | 'backtrack' | 'goal_reached' | 'stuck' | 'blocked';
  message: string;
  currentLine: number | null;
  // Common AlgorithmStep fields
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  solutionFound?: boolean; // To indicate if final solution is found
}
