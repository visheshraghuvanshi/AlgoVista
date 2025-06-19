// src/app/visualizers/deque-operations/types.ts
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

// Deque-specific step type
export interface DequeAlgorithmStep {
  array: (string | number)[]; // Represents the deque elements
  activeIndices: number[];    
  swappingIndices: number[];  
  sortedIndices: number[];    
  currentLine: number | null; 
  message?: string;           
  frontIndex?: number; 
  rearIndex?: number;  
  operationType: 'deque';
  lastOperation?: string; 
  processedValue?: string | number | null | undefined; 
}
