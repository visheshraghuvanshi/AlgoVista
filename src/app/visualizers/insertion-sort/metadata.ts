
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'insertion-sort',
  title: 'Insertion Sort',
  category: 'Fundamentals',
  difficulty: 'Easy',
  description: 'Builds the final sorted array one item at a time by inserting each element into its proper place in the sorted part. Efficient for small or nearly sorted data.',
  longDescription: 'Insertion Sort is a simple sorting algorithm that builds the final sorted array (or list) one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort. However, insertion sort provides several advantages: simple implementation, efficient for (quite) small data sets, adaptive (efficient for data sets that are already substantially sorted: the time complexity is O(nk) when each element in the input is no more than k places away from its sorted position), and stable (does not change the relative order of elements with equal keys).',
  timeComplexities: {
    best: "O(n)",       // When the array is already sorted
    average: "O(n²)",
    worst: "O(n²)",    // When the array is sorted in reverse order
  },
  spaceComplexity: "O(1)", // In-place sorting algorithm
};
