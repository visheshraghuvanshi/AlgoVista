// src/app/visualizers/linked-list-cycle-detection/types.ts

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

export interface AlgorithmDetailsProps {
  title: string;
  description: string;
  timeComplexities: AlgorithmTimeComplexities;
  spaceComplexity: string;
}

// --- Visualizer-Specific Types for Linked List Cycle Detection ---
export interface LinkedListNodeVisual {
  id: string;
  value: string | number;
  nextId: string | null;
  // Make x/y optional as they are calculated during rendering
  x?: number;
  y?: number;
  // Specific for this visualizer
  isSlow?: boolean;
  isFast?: boolean;
  isMeetingPoint?: boolean;
  isHead?: boolean;
  color?: string; // General color override if needed
}

export interface LinkedListAlgorithmStep {
  nodes: LinkedListNodeVisual[];
  headId: string | null;
  actualCycleNodeId: string | null; // The node the tail points to
  currentLine: number | null;
  message: string;
  auxiliaryPointers: {
    slow: string | null;
    fast: string | null;
  };
  isCycleDetected?: boolean;
}
