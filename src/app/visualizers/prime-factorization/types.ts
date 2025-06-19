
// src/app/visualizers/prime-factorization/types.ts
import type { AlgorithmStep as GlobalAlgorithmStep } from '@/types';

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

// Specific step type for Prime Factorization, extending the global one might be complex
// due to different focus. So, defining a more specific local type.
export interface PrimeFactorizationStep {
  array: []; // Not directly used for number display here
  activeIndices: number[]; // Can be used if we need to highlight current divisor in a list of potential divisors
  swappingIndices: number[]; // Not used
  sortedIndices: number[]; // Not used
  currentLine: number | null; 
  message?: string;           
  auxiliaryData: {
    originalN: number;
    currentN: number;
    currentDivisor: number | null;
    factors: number[];
    message: string;
  };
}

