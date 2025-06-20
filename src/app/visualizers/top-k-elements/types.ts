
// src/app/visualizers/top-k-elements/types.ts
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

// Specific types for Top K Elements
export interface PriorityQueueItem { // Re-using from global Priority Queue for consistency
  value: number;
  priority: number; // For Top K, priority is the value itself
}

export interface TopKAlgorithmStep {
  inputArray: number[];       // The original input array
  heap: PriorityQueueItem[];  // Current state of the min-heap (stores {value, priority:value})
  currentElement?: number;    // The element from inputArray being processed
  operation?: 'add_to_heap' | 'compare_with_heap_min' | 'replace_heap_min' | 'skip_element' | 'finalize';
  comparison?: string;        // e.g., "5 > heap.min (2)"
  result?: number[];          // The final top K elements
  message?: string;
  currentLine: number | null;
  activeIndices: number[];    // Index in inputArray being processed
  activeHeapIndices?: number[]; // Indices in heap array being affected (e.g., root, swapped element)
  processedItem?: PriorityQueueItem | null; // Item added/removed/compared from heap
}


    