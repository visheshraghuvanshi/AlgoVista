
// src/app/visualizers/sieve-of-eratosthenes/types.ts
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

// Sieve specific step type
export interface SieveAlgorithmStep extends GlobalAlgorithmStep {
  // 'array' will represent the boolean prime markings:
  // 0: not prime (initially or marked composite)
  // 1: prime (initially)
  // We can use auxiliaryData to be more explicit about state
  auxiliaryData: {
    limitN: number;
    currentP?: number;
    currentMultiple?: number;
    primesFound: number[];
    message?: string;
  };
}
