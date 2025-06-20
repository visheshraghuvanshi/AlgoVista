
// src/app/visualizers/dutch-national-flag/types.ts
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
  array: number[]; // Array of 0s, 1s, 2s
  activeIndices: number[];    // Highlights low, mid, high pointers
  swappingIndices: number[];  // Highlights elements being swapped
  sortedIndices: number[];    // Can be used to indicate finalized 0s and 2s sections
  currentLine: number | null; 
  message?: string;           
  processingSubArrayRange?: [number, number] | null; // Not typically used for DNF like for QuickSort
  pivotActualIndex?: number | null; // Not used
  auxiliaryData?: {
    low?: number;
    mid?: number;
    high?: number;
    currentPointers?: { low: number; mid: number; high: number; }; // Explicit storage for pointers
    [key: string]: any;
  } | null;
}

// Props for VisualizationPanel
export interface VisualizationPanelProps {
  data: number[];
  activeIndices?: number[]; // Will hold [low, mid, high]
  swappingIndices?: number[];
  sortedIndices?: number[]; // Used to distinguish 0s, 1s, 2s areas
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
  auxiliaryData?: AlgorithmStep['auxiliaryData']; // To get pointer values
}

// Props for SortingControlsPanel (reused)
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

