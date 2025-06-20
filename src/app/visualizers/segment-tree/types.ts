
// src/app/visualizers/segment-tree/types.ts
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

// Segment Tree Specific Types
export interface AlgorithmStep {
  array: number[]; // Represents the segment tree array 
  activeIndices: number[];    // Indices in the segment tree array being actively processed/highlighted
  swappingIndices: number[];  // Not typically used for segment tree
  sortedIndices: number[];    // Not typically used for segment tree
  currentLine: number | null; 
  message?: string;           
  processingSubArrayRange?: [number, number] | null; // Original array range for query/update context
  pivotActualIndex?: number | null; // Not used
  auxiliaryData?: {
    operation?: SegmentTreeOperation;
    inputArray?: number[]; // Original input array
    queryLeft?: number;
    queryRight?: number;
    queryResult?: number;
    updateIndex?: number;
    updateValue?: number;
    currentL?: number; // For query internal state
    currentR?: number; // For query internal state
    currentQueryResult?: number; // For query internal state
    [key: string]: any;
  } | null;
}

export type SegmentTreeOperation = 'build' | 'query' | 'update';

export interface VisualizationPanelProps {
  data: number[]; // The segment tree array itself
  activeIndices?: number[];
  originalInputArray?: number[]; // To display alongside the tree
  processingSubArrayRange?: [number, number] | null; // To highlight on original array
  originalArraySize?: number; // N, for layout calculation
}


    