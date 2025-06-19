// src/app/visualizers/hash-table/types.ts
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

// Hash Table specific types
export type HashValue = string | number;
export type HashTableEntry = [HashValue, HashValue]; // [key, value]

export interface HashTableStep {
  buckets: HashTableEntry[][]; // Array of buckets, each bucket is an array of entries (for chaining)
  tableSize: number;
  operation: 'insert' | 'search' | 'delete' | 'init';
  currentKey?: HashValue;
  currentValue?: HashValue; // For insert
  hashIndex?: number; // Index where currentKey hashes to
  foundValue?: HashValue | null; // For search result (null if not found)
  message?: string;
  currentLine: number | null;
  activeBucketIndex?: number | null; // Bucket being accessed/modified
  activeEntry?: HashTableEntry | null; // Entry being checked/modified within a bucket

  // Common AlgorithmStep fields (may not all be directly used by a specific HashTable panel)
  activeIndices: number[]; // Can map to activeBucketIndex if needed by generic panel
  swappingIndices: number[];
  sortedIndices: number[];
  array?: (string|number)[]; // Not typically used by HashTable panel
}
