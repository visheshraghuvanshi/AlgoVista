
// src/app/visualizers/bucket-sort/types.ts
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

export interface BucketSortBucket {
  id: number;
  elements: number[];
  isSorted?: boolean; // To indicate if this bucket has been processed by sub-sort
}

export interface BucketSortStep {
  array: number[]; // Main array (or output being built)
  activeIndices: number[]; // For main array element being scattered or placed
  swappingIndices: number[]; // Not directly used by top-level bucket sort
  sortedIndices: number[]; // Indices in the main array that are confirmed sorted (after gathering)
  currentLine: number | null;
  message?: string;
  buckets?: BucketSortBucket[]; // Array of buckets and their contents
  currentElement?: number; // Element being scattered
  currentBucketIndex?: number; // Bucket being scattered to, or sorted, or gathered from
  phase?: 'scattering' | 'sorting_buckets' | 'gathering' | 'complete' | 'initial';
  auxiliaryData?: Record<string, any> | null;
}

// Props for SortingControlsPanel
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

// Props for BucketSortCodePanel (if needed specifically, else use general from page)
// export interface BucketSortCodePanelProps { ... }

// Props for BucketSortVisualizationPanel (if needed specifically)
// export interface BucketSortVisualizationPanelProps { ... }
