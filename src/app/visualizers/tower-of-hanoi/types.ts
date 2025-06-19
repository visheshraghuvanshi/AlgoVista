// src/app/visualizers/tower-of-hanoi/types.ts
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

// Tower of Hanoi specific step type
export interface TowerOfHanoiStep {
  pegStates: { [key: string]: number[] }; 
  lastMove?: { disk: number; fromPeg: string; toPeg: string };
  numDisks: number;
  currentLine: number | null;
  message?: string;
  // Minimal common fields, can add more if needed by a generic panel.
  // For ToH, array, activeIndices etc. are not directly applicable from generic AlgorithmStep
  array: []; // Empty or not used
  activeIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
}
