
// src/app/visualizers/sliding-window/types.ts
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

export interface AlgorithmStep {
  array: number[];
  activeIndices: number[];    // Can be used for start/end pointers
  swappingIndices: number[];  // Not used
  sortedIndices: number[];    // Used to highlight the final result subarray
  currentLine: number | null; 
  message?: string;           
  processingSubArrayRange?: [number, number] | null; // This is the primary window highlight
  pivotActualIndex?: number | null; // Not used
  auxiliaryData?: {
    windowStart?: number;
    windowEnd?: number;
    currentSum?: number;
    maxSum?: number;
    minLength?: number | string;
    targetSum?: number;
    k?: number;
    foundSubarrayIndices?: number[];
    [key: string]: any;
  } | null;
}

export interface VisualizationPanelProps {
  data: number[];
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
}
