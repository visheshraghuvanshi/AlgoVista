// src/app/visualizers/permutations-subsets/types.ts
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

// Re-using generic ArrayAlgorithmStep as the core data is array-like
export interface ArrayAlgorithmStep {
  array: (string | number)[]; // Current permutation or subset being built
  activeIndices: number[];    // Can indicate current element being considered or added
  swappingIndices: number[];  // Not typically used for these problems
  sortedIndices: number[];    // Can highlight a completed permutation/subset in the results list
  currentLine: number | null; 
  message?: string;           
  processingSubArrayRange?: [number, number] | null; 
  pivotActualIndex?: number | null; 
  auxiliaryData?: {
    results?: (string | number)[][]; // List of all found permutations/subsets
    remaining?: (string | number)[]; // For permutations: elements yet to be placed
    nextToConsider?: (string | number)[]; // For subsets: elements from input array to consider next
    [key: string]: any;
  } | null;
}

// For VisualizationPanel props if it becomes specific
export interface PermutationsSubsetsVisualizationPanelProps {
  step: ArrayAlgorithmStep | null;
  problemType: 'permutations' | 'subsets';
  originalInputSet: (string | number)[];
}
