// src/app/visualizers/prims-algorithm/types.ts
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

// Graph specific types (can be shared or localized if variations needed)
export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
  isStartNode?: boolean;
  distance?: number | typeof Infinity; // For pathfinding algorithms / Prim's key value
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
    type: 'queue' | 'stack' | 'set' | 'table' | 'info'; 
    label: string; 
    values: any;   
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
  onStartNodeChange?: (value: string) => void;
  startNodeValue?: string;
  showStartNodeInput?: boolean;
  onNumVerticesChange?: (value: string) => void;
  numVerticesValue?: string;
  showNumVerticesInput?: boolean;
  isPlaying: boolean;
  isFinished: boolean;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  isAlgoImplemented: boolean;
  minSpeed: number;
  maxSpeed: number;
  graphInputPlaceholder?: string;
  startNodeInputPlaceholder?: string;
  numVerticesInputPlaceholder?: string;
  onExecute?: () => void;
  executeButtonText?: string;
}
