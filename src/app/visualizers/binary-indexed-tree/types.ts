
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

// Specific types for Binary Indexed Tree
export type SegmentTreeOperation = 'build' | 'update' | 'query' | 'queryRange';

export interface AlgorithmStep {
  array: number[]; // Main array being visualized (the BIT array)
  activeIndices: number[];    
  swappingIndices: number[]; // Not used
  sortedIndices: number[];    // Not used
  currentLine: number | null; 
  message?: string;           
  processingSubArrayRange?: [number, number] | null; 
  pivotActualIndex?: number | null; 
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
    currentQueryResult?: number;
    // BIT specific
    lsb?: number;
    binaryString?: string;
    bitIndex?: number; // The current 1-based index in the BIT being processed
    finalTree?: number[];
    [key: string]: any;
  } | null;
}

// Props for VisualizationPanel
export interface VisualizationPanelProps {
  data: number[];
  activeIndices?: number[];
  originalInputArray: number[];
  originalArraySize: number;
  processingSubArrayRange?: [number, number] | null;
  auxiliaryData?: AlgorithmStep['auxiliaryData'];
}
