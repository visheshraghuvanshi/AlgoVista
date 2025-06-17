
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'merge-sort',
  title: 'Merge Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A divide-and-conquer algorithm that sorts by recursively dividing the array and merging sorted subarrays.',
  longDescription: 'Merge Sort is an efficient, stable, comparison-based sorting algorithm. It works on the divide and conquer principle. First, the unsorted list is divided into N sublists, each containing one element (a list of one element is considered sorted). Then, it repeatedly merges sublists to produce new sorted sublists until there is only one sublist remaining. This will be the sorted list.\\n\\nAlgorithm Steps:\\n1. Divide the unsorted list into two approximately equal halves.\\n2. Recursively sort each half.\\n3. Merge the two sorted halves back into a single sorted list.\\nThe merge operation is the key process: it takes two smaller sorted arrays and combines them into a single, sorted new array.',
  timeComplexities: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
  },
  spaceComplexity: "O(n) due to the auxiliary space used for merging.",
};
