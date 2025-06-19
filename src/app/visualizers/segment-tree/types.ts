
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

// Segment Tree Specific Types (re-using generic AlgorithmStep for array visualization)
export interface AlgorithmStep {
  array: number[]; // Represents the segment tree array or input array
  activeIndices: number[];    
  swappingIndices: number[];  
  sortedIndices: number[];    
  currentLine: number | null; 
  message?: string;           
  processingSubArrayRange?: [number, number] | null; 
  pivotActualIndex?: number | null; 
  auxiliaryData?: Record<string, any> | null; // To store things like current exponent, count array, output array
}

// For SegmentTreeCodePanel and page logic
export type SegmentTreeOperation = 'build' | 'query' | 'update';

// For local Visualization Panel
export interface VisualizationPanelProps {
  data: number[]; 
  activeIndices?: number[];
}

```