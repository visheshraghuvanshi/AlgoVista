
// src/app/visualizers/circular-linked-list/types.ts

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

// --- Visualizer-Specific Types for Circular Linked List ---
export interface LinkedListNodeVisual {
  id: string;
  value: string | number;
  nextId: string | null;
  prevId?: string | null; 
  color?: string;
  textColor?: string;
  isHead?: boolean;
  isTail?: boolean; 
  isSlow?: boolean; 
  isFast?: boolean; 
  x?: number;
  y?: number;
}

export type LinkedListType = 'singly' | 'doubly' | 'circular';

export interface LinkedListAlgorithmStep {
  nodes: LinkedListNodeVisual[];
  headId: string | null;
  tailId?: string | null;
  currentLine: number | null;
  message?: string;
  auxiliaryPointers?: Record<string, string | null | undefined>; 
  operation?: string;
  isCycleDetected?: boolean;
  status?: 'success' | 'failure' | 'info';
}

// Operations for LinkedListControlsPanel
export type LinkedListOperation = 
  | 'init'
  | 'insertHead' | 'insertTail' | 'insertAtPosition' 
  | 'deleteHead' | 'deleteTail' | 'deleteByValue' | 'deleteAtPosition'
  | 'search' 
  | 'reverse'
  | 'detectCycle'
  | 'merge' 
  | 'traverse';

import { ListPlus, Trash2, SearchCode, Shuffle, GitMerge, LocateFixed, ListOrdered, CornerDownLeft, CornerUpRight, Milestone, FastForward } from "lucide-react";

export const ALL_OPERATIONS_LOCAL: { value: LinkedListOperation; label: string; icon?: React.ElementType, needsValue?: boolean, needsSecondList?: boolean, needsPosition?: boolean }[] = [
  { value: 'init', label: 'Initialize/Set List', icon: ListPlus },
  { value: 'insertHead', label: 'Insert Head', icon: CornerUpRight, needsValue: true },
  { value: 'insertTail', label: 'Insert Tail', icon: CornerDownLeft, needsValue: true },
  { value: 'insertAtPosition', label: 'Insert At Position', icon: Milestone, needsValue: true, needsPosition: true },
  { value: 'deleteByValue', label: 'Delete by Value', icon: Trash2, needsValue: true },
  { value: 'deleteAtPosition', label: 'Delete At Position', icon: Trash2, needsPosition: true },
  { value: 'search', label: 'Search Value', icon: SearchCode, needsValue: true },
  { value: 'traverse', label: 'Traverse List', icon: FastForward },
];
