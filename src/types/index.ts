
// This file will now primarily contain types used by the global visualizer listing page
// and the metadataRegistry. Individual visualizer pages will have their own local types.ts.

export type AlgorithmCategory = 'Sorting' | 'Searching' | 'Graph' | 'Tree' | 'Recursion' | 'Dynamic Programming' | 'Data Structures' | 'Other' | 'Fundamentals' | 'Arrays & Search' | 'Linked List' | 'Trees' | 'Graphs' | 'Backtracking' | 'Math & Number Theory';
export type AlgorithmDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface AlgorithmTimeComplexities {
  best: string;
  average: string;
  worst: string;
}

// This AlgorithmMetadata type is kept here because it's used by
// src/app/visualizers/page.tsx (the listing page) and src/app/visualizers/metadataRegistry.ts
export interface AlgorithmMetadata {
  slug: string;
  title: string;
  category: AlgorithmCategory;
  difficulty: AlgorithmDifficulty;
  description: string; // Short description for card
  longDescription?: string; // Detailed explanation for individual page
  timeComplexities?: AlgorithmTimeComplexities;
  spaceComplexity?: string;
  tags?: string[];
  // codeSnippets and pseudocode are part of local AlgorithmMetadata if needed by the page itself
}

// Generic AlgorithmStep - individual visualizers will define more specific step types locally
// This generic one might still be useful for the top-level visualizer page if it needs a common type.
export interface AlgorithmStep {
  array: number[] | string[]; // Main data array
  activeIndices: number[];    // Indices being actively processed/compared
  swappingIndices: number[];  // Indices involved in a swap animation
  sortedIndices: number[];    // Indices of elements in their final sorted position
  currentLine: number | null; // Line number in the code panel to highlight
  message?: string;           // Description of the current step
  processingSubArrayRange?: [number, number] | null; // For algos like QuickSort, MergeSort
  pivotActualIndex?: number | null; // For QuickSort pivot
  auxiliaryData?: Record<string, any> | null; // For any other data needed by specific visualizers (e.g. temp arrays in merge sort, pointers in list algos)
}


// Graph-related types might still be useful globally if any non-visualizer page handles graph data.
// For now, assuming visualizers will define these locally.
// Example:
// export interface GraphNode { ... }
// export interface GraphEdge { ... }
// export interface GraphAlgorithmStep { ... }

// Similarly for Tree, LinkedList, DP, etc. types.
// If a type is ONLY used by one visualizer and its direct components,
// it should be in that visualizer's local types.ts.

// Types that were very specific and are now moved to local `types.ts` files:
// - ArrayAlgorithmStep (though a generic AlgorithmStep is kept above)
// - BinaryTreeNodeVisual
// - BinaryTreeEdgeVisual
// - TreeAlgorithmStep
// - LinkedListNodeVisual
// - LinkedListType
// - LinkedListAlgorithmStep
// - NQueensStep
// - RatInAMazeStep
// - SudokuStep
// - DSUStep
// - HashTableStep, HashTableEntry, HashValue
// - PriorityQueueItem, PriorityQueueStep
// - DPAlgorithmStep (a more specific one might exist locally too)
// - SieveAlgorithmStep
// - ModularExponentiationStep
// - CountingSortStep
// - BucketSortBucket, BucketSortStep
// - Huffman Types (FrequencyItem, NodeForPQ, CodeItem, HuffmanStep)
// - Trie Types (NodeInternal, NodeVisual, EdgeVisual, TrieStep)
// The components consuming these (e.g., page.tsx) will import them locally.
