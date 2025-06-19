
// src/app/visualizers/linear-search/types.ts

// Common metadata types
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

// Props for the locally copied AlgorithmDetailsCard
export interface AlgorithmDetailsProps {
  title: string;
  description: string;
  timeComplexities: AlgorithmTimeComplexities;
  spaceComplexity: string;
}

// Specific Step Type for this visualizer (Array-based)
export interface ArrayAlgorithmStep {
  array: number[];
  activeIndices: number[];    // Indices being actively processed/compared
  swappingIndices: number[];  // Indices involved in a swap animation (not used by linear search)
  sortedIndices: number[];    // Indices of elements in their final sorted position (used to highlight found item)
  currentLine: number | null; // Line number in the code panel to highlight
  message?: string;           // Description of the current step
  processingSubArrayRange?: [number, number] | null; // Not typically used by linear search
  pivotActualIndex?: number | null; // Not used by linear search
  auxiliaryData?: Record<string, any> | null;
}

// Props for SearchingControlsPanel (specific to this context if needed, or use global)
export interface SearchingControlsPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onInputChange: (value: string) => void;
  inputValue: string;
  onTargetValueChange: (value: string) => void;
  targetValue: string;
  isPlaying: boolean;
  isFinished: boolean;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  isAlgoImplemented: boolean;
  minSpeed: number;
  maxSpeed: number;
  targetInputLabel?: string;
  targetInputPlaceholder?: string;
}

// Props for VisualizationPanel (specific to this context if needed, or use global)
export interface VisualizationPanelProps {
  data: number[];
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
}
