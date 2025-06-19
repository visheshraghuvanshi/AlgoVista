
// src/app/visualizers/kadanes-algorithm/types.ts
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
  activeIndices: number[];    
  swappingIndices: number[];  
  sortedIndices: number[];    // Used to highlight the max subarray found
  currentLine: number | null; 
  message?: string;           
  processingSubArrayRange?: [number, number] | null; // To highlight current subarray being considered
  pivotActualIndex?: number | null; 
  auxiliaryData?: {
    currentMax?: number | string;
    maxSoFar?: number | string;
    [key: string]: any; // For other potential data like start/end indices of subarrays
  } | null;
}

// Props for VisualizationPanel
export interface VisualizationPanelProps {
  data: number[];
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
}

// Props for SortingControlsPanel (though Kadane's isn't sorting, it uses array input)
export interface SortingControlsPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onInputChange: (value: string) => void;
  inputValue: string;
  isPlaying: boolean;
  isFinished: boolean;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  isAlgoImplemented: boolean;
  minSpeed: number;
  maxSpeed: number;
}
