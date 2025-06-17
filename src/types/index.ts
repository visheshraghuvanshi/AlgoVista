
export type AlgorithmCategory = 'Sorting' | 'Searching' | 'Graph' | 'Tree' | 'Recursion' | 'Dynamic Programming' | 'Data Structures' | 'Other';
export type AlgorithmDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface AlgorithmMetadata {
  slug: string;
  title: string;
  category: AlgorithmCategory;
  difficulty: AlgorithmDifficulty;
  description: string;
  longDescription?: string; 
  tags?: string[]; 
  codeSnippets?: {
    [language: string]: string[]; // Allow any language key
  };
  pseudocode?: string[];
}

export type AlgorithmStep = {
  array: number[];
  activeIndices: number[]; 
  swappingIndices: number[]; 
  sortedIndices: number[]; 
  currentLine: number | null;
  message?: string; 
  processingSubArrayRange?: [number, number] | null; 
  pivotActualIndex?: number | null;
};
