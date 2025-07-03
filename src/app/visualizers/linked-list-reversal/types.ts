// src/app/visualizers/linked-list-reversal/types.ts

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

// --- Visualizer-Specific Types for Linked List Reversal ---
export interface LinkedListNodeVisual {
  id: string;
  value: string | number;
  nextId: string | null;
  // Make x/y optional as they are calculated during rendering
  x?: number;
  y?: number;
  color?: string;
  isHead?: boolean;
}

export interface LinkedListAlgorithmStep {
  nodes: LinkedListNodeVisual[];
  headId: string | null;
  currentLine: number | null;
  message: string;
  auxiliaryPointers: {
    prev: string | null;
    current: string | null;
    nextNode: string | null;
    // For recursive viz
    currentRecHead?: string | null;
    restOfListHead?: string | null;
  };
  status?: 'success' | 'failure' | 'info';
}

export type ReversalType = 'iterative' | 'recursive' | 'init';
