// src/app/visualizers/base-conversions/types.ts
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

// Base Conversions specific step type
export interface BaseConversionStep {
  array: []; // Not directly used for bar visualization, but part of generic step
  activeIndices: number[];    
  swappingIndices: number[];  
  sortedIndices: number[];    
  currentLine: number | null; 
  message?: string;           
  auxiliaryData: {
    originalNumber: string;
    fromBase: number;
    toBase: number;
    currentValue: string | number; // Current digit or number being processed
    intermediateResult?: string; // e.g., current string being built, or current decimal sum
    finalResult?: string;
    equation?: string; // e.g., "2 * 16^1 + 10 * 16^0 = 42"
    message: string; // For specific messages related to this step in aux data
  };
}

