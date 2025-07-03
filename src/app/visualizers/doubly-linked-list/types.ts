
// src/app/visualizers/doubly-linked-list/types.ts

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

// --- Visualizer-Specific Types for Doubly Linked List ---
export interface LinkedListNodeVisual {
  id: string;
  value: string | number;
  nextId: string | null;
  prevId?: string | null; // Specific to Doubly LL
  color?: string;
  textColor?: string;
  isHead?: boolean;
  isTail?: boolean; // Specific to Doubly LL
  isSlow?: boolean; 
  isFast?: boolean; 
  x?: number;
  y?: number;
}

export type LinkedListType = 'singly' | 'doubly' | 'circular';

export interface LinkedListAlgorithmStep {
  nodes: LinkedListNodeVisual[];
  headId: string | null;
  tailId?: string | null; // Specific to Doubly LL
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

import type { LucideIcon } from 'lucide-react';
import { ListPlus, Trash2, SearchCode, CornerDownLeft, CornerUpRight, Milestone, FastForward } from "lucide-react";


export const ALL_OPERATIONS_LOCAL: { value: LinkedListOperation; label: string; icon?: LucideIcon, needsValue?: boolean, needsSecondList?: boolean, needsPosition?: boolean }[] = [
  { value: 'init', label: 'Initialize/Set List', icon: ListPlus },
  { value: 'insertHead', label: 'Insert Head', icon: CornerUpRight, needsValue: true },
  { value: 'insertTail', label: 'Insert Tail', icon: CornerDownLeft, needsValue: true },
  { value: 'insertAtPosition', label: 'Insert At Position', icon: Milestone, needsValue: true, needsPosition: true },
  { value: 'deleteByValue', label: 'Delete by Value', icon: Trash2, needsValue: true },
  { value: 'deleteAtPosition', label: 'Delete At Position', icon: Trash2, needsPosition: true },
  // Add other DLL-specific operations if needed, or filter in the panel itself
  // For now, keeping it same as SLL available ops
];

// Props for LinkedListControlsPanel
export interface LinkedListControlsPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onOperationChange: (operation: LinkedListOperation, value?: string, positionOrSecondList?: string | number) => void;
  initialListValue: string;
  onInitialListValueChange: (value: string) => void;
  inputValue: string; 
  onInputValueChange: (value: string) => void;
  positionValue?: string; 
  onPositionValueChange?: (value: string) => void;
  secondListValue?: string; 
  onSecondListValueChange?: (value: string) => void;
  selectedOperation: LinkedListOperation | null;
  onSelectedOperationChange: (operation: LinkedListOperation) => void;
  availableOperations?: LinkedListOperation[]; 
  isPlaying: boolean;
  isFinished: boolean;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  isAlgoImplemented: boolean; 
  minSpeed: number;
  maxSpeed: number;
  steps: LinkedListAlgorithmStep[];
}
