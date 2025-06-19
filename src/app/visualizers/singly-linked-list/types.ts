
// Local types for Singly Linked List Visualizer

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

// --- Visualizer-Specific Types ---
export interface LinkedListNodeVisual {
  id: string;
  value: string | number;
  nextId: string | null;
  prevId?: string | null; // Optional for doubly linked list
  color?: string;
  textColor?: string;
  isHead?: boolean;
  isTail?: boolean; // Optional for doubly linked list tail pointer
  isSlow?: boolean; // For Floyd's cycle detection
  isFast?: boolean; // For Floyd's cycle detection
  x?: number;
  y?: number;
}

export type LinkedListType = 'singly' | 'doubly' | 'circular';

export interface LinkedListAlgorithmStep {
  nodes: LinkedListNodeVisual[];
  headId: string | null;
  tailId?: string | null; // Optional, for DLL
  currentLine: number | null;
  message?: string;
  auxiliaryPointers?: Record<string, string | null | undefined>; // e.g., { current: 'node-id', prev: 'node-id-2' }
  operation?: string; // e.g., 'insertHead', 'deleteTail', 'search'
  isCycleDetected?: boolean; // For cycle detection algorithms
  status?: 'success' | 'failure' | 'info'; // To indicate operation outcome
}

// For LinkedListControlsPanel (copied locally)
export type LinkedListOperation = 
  | 'init'
  | 'insertHead' | 'insertTail' | 'insertAtPosition' 
  | 'deleteHead' | 'deleteTail' | 'deleteByValue' | 'deleteAtPosition'
  | 'search' 
  | 'reverse'
  | 'detectCycle'
  | 'merge' 
  | 'traverse';

export const ALL_OPERATIONS_LOCAL: { value: LinkedListOperation; label: string; icon?: React.ElementType, needsValue?: boolean, needsSecondList?: boolean, needsPosition?: boolean }[] = [
  { value: 'init', label: 'Initialize/Set List' },
  { value: 'insertHead', label: 'Insert Head', needsValue: true },
  { value: 'insertTail', label: 'Insert Tail', needsValue: true },
  { value: 'insertAtPosition', label: 'Insert At Position', needsValue: true, needsPosition: true },
  { value: 'deleteByValue', label: 'Delete by Value', needsValue: true },
  { value: 'deleteAtPosition', label: 'Delete At Position', needsPosition: true },
  { value: 'search', label: 'Search Value', needsValue: true },
  { value: 'traverse', label: 'Traverse List' },
];
