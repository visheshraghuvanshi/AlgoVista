// src/app/visualizers/priority-queue/types.ts

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

// Priority Queue specific types
export interface PriorityQueueItem {
  value: string | number;
  priority: number;
}

export interface PriorityQueueStep {
  heapArray: PriorityQueueItem[]; // Represents the heap structure (array-based)
  operation: 'enqueue' | 'dequeue' | 'peek' | 'init';
  processedItem?: PriorityQueueItem | null; // Item that was enqueued, dequeued, or peeked
  message?: string;
  currentLine: number | null;
  activeHeapIndices?: number[]; // Indices in heapArray being actively processed (e.g., during heapify)
  
  // Common fields from AlgorithmStep (if needed for generic components, otherwise can be omitted if PQ panel is highly specific)
  activeIndices: number[]; // Can be mapped to activeHeapIndices if needed by generic panel
  swappingIndices: number[];
  sortedIndices: number[];
  array?: (string | number)[]; // Could be heapArray or not used
}

