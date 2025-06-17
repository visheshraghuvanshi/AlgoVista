
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'quick-sort',
  title: 'Quick Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A highly efficient divide-and-conquer sorting algorithm that picks a pivot and partitions the array around it.',
  longDescription: 'Quick Sort is a divide-and-conquer algorithm that works by selecting a \'pivot\' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively. This can be done in-place, requiring small additional amounts of memory to perform the sorting.\\n\\nAlgorithm Steps (Lomuto partition scheme):\n1. Pick a pivot element (e.g., last element).\n2. Partition the array: Rearrange the array so that all elements smaller than the pivot come before it, and all elements greater come after it. The pivot is now in its final sorted position.\n3. Recursively apply the above steps to the sub-array of elements with smaller values and separately to the sub-array of elements with greater values.\\n\\nThe choice of pivot and partitioning strategy significantly affects Quick Sort\'s performance. While its average-case complexity is O(n log n), its worst-case is O(n²), which can occur with poor pivot choices on already sorted or nearly sorted data.',
  timeComplexities: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(log n) (average recursion stack), O(n) (worst-case recursion stack)",
};
