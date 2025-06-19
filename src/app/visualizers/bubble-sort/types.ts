
// Local types for Bubble Sort Visualizer

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
  codeSnippets?: {
    [language: string]: string[];
  };
  pseudocode?: string[];
}

// Specific for array-based algorithms like Bubble Sort
export interface ArrayAlgorithmStep {
  array: number[];
  activeIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  currentLine: number | null;
  message?: string;
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
  auxiliaryData?: Record<string, any> | null;
}

// Props for the locally copied AlgorithmDetailsCard
export interface AlgorithmDetailsProps {
  title: string;
  description: string;
  timeComplexities: AlgorithmTimeComplexities; // Uses locally defined sub-type
  spaceComplexity: string;
}
