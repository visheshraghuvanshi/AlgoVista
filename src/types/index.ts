
export interface AlgorithmMetadata {
  slug: string;
  title: string;
  category: 'Sorting' | 'Searching' | 'Graph' | 'Tree' | 'Recursion' | 'Dynamic Programming' | 'Data Structures';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  longDescription?: string; // For individual page later
  tags?: string[]; // Additional tags
}
