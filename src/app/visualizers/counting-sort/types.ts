
// src/app/visualizers/counting-sort/types.ts
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

// Specific Step Type for Counting Sort
export interface CountingSortStep {
  array: number[]; // Input array / Current state of main array being sorted
  activeIndices: number[]; // Index in input array or output array being processed
  swappingIndices: number[]; // Not typically used directly by Counting sort for main array
  sortedIndices: number[]; // Indices in the main array that are confirmed sorted
  currentLine: number | null;
  message?: string;
  countArray?: number[]; // The frequency or cumulative count array
  outputArray?: number[]; // The temporary output array
  currentElement?: number; // Element from input array being processed
  currentIndex?: number; // Index of currentElement in input or output array
  currentCountIndex?: number; // Index in countArray being accessed/modified
  auxiliaryData?: Record<string, any> | null;
}


// Props for the local VisualizationPanel
export interface VisualizationPanelProps {
  data: number[];
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
}

// Props for the local SortingControlsPanel
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
