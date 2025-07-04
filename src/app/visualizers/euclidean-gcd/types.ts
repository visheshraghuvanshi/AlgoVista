
// src/app/visualizers/euclidean-gcd/types.ts
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

// Euclidean GCD specific step type
export interface EuclideanGcdStep {
  array: []; // Not directly used for bar visualization
  activeIndices: number[];    
  swappingIndices: number[];  
  sortedIndices: number[];    
  currentLine: number | null; 
  message?: string;           
  auxiliaryData?: {
    a: number;
    b: number;
    remainder?: number;
    equation?: string; 
    gcd?: number;
    message?: string; 
  };
}
