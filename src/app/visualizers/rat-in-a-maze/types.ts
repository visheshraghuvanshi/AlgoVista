
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
  maze: number[][]; // Visual board: 0=wall, 1=path, 2=current solution path
  solutionPath: string; // e.g., "DDRRDR"
  currentPosition: { row: number; col: number; };
  action: 'try_move' | 'mark_path' | 'backtrack' | 'goal_reached' | 'stuck';
  message: string;
  currentLine: number | null;
  foundSolutions: string[];
}
