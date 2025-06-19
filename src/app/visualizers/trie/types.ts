
// src/app/visualizers/trie/types.ts
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

// --- Trie Specific Types ---
export interface TrieNodeInternal {
  id: string;
  char: string | null; // Character represented by the edge leading to this node
  isEndOfWord: boolean;
  children: Map<string, string>; // char -> childNodeId
  parentId?: string | null; // For easier traversal or display if needed
  depth?: number;
  visualColor?: string; // For temporary highlights like "newly created"
}

export interface TrieNodeVisual {
  id: string;
  label: string; // Character to display on the node
  x: number;
  y: number;
  isEndOfWord: boolean;
  color: string; // Node fill color
  textColor?: string;
}

export interface TrieEdgeVisual {
  id: string;
  sourceId: string;
  targetId: string;
  color?: string;
}

export interface TrieStep {
  nodes: TrieNodeVisual[];
  edges: TrieEdgeVisual[];
  operation: 'insert' | 'search' | 'startsWith' | 'init';
  currentWord?: string;
  currentCharIndex?: number;
  currentNodeId?: string | null; // ID of the trie node currently being processed
  pathTakenIds?: string[]; // IDs of nodes along the current traversal path
  message?: string;
  found?: boolean; // Result of search or startsWith
  currentLine: number | null;
  auxiliaryData?: Record<string, any> | null; // For other data, e.g., list of inserted words
}

export type TrieOperationType = 'insert' | 'search' | 'startsWith' | 'init';

