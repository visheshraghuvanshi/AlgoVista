
// src/app/visualizers/graph-cycle-detection/types.ts
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

// Graph specific types
export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
  isStartNode?: boolean;
  distance?: number | typeof Infinity;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  color?: string;
  isDirected?: boolean;
}

export interface GraphAlgorithmStep {
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentLine: number | null;
  message?: string;
  auxiliaryData?: Array<{
    type: 'set' | 'stack'; // For visited, recursionStack, current DFS path
    label: string;
    values: string[];
  }>;
  array?: number[] | string[];
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  processingSubArrayRange?: [number, number] | null;
  pivotActualIndex?: number | null;
}

// For GraphControlsPanel props
export interface GraphControlsPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onGraphInputChange: (value: string) => void;
  graphInputValue: string;
  showStartNodeInput?: boolean;
  isPlaying: boolean;
  isFinished: boolean;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  isAlgoImplemented: boolean;
  minSpeed: number;
  maxSpeed: number;
  graphInputPlaceholder?: string;
  onExecute?: () => void; 
  executeButtonText?: string;
}
