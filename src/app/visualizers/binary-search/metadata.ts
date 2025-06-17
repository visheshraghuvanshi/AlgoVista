
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'binary-search',
  title: 'Binary Search',
  category: 'Fundamentals',
  difficulty: 'Easy',
  description: 'Efficiently finds an item from a sorted list by repeatedly dividing the search interval in half.',
  longDescription: 'Binary Search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing the search interval in half. If the value of the search key is less than the item in the middle of the interval, narrow the interval to the lower half. Otherwise, narrow it to the upper half. This process is repeated until the value is found or the interval is empty. Binary Search is a cornerstone of computer science, showcasing the power of divide and conquer. It requires the input array to be sorted beforehand. Its logarithmic time complexity makes it highly efficient for large datasets compared to linear search.',
  timeComplexities: {
    best: "O(1)",    // Target is the middle element in the first check
    average: "O(log n)",
    worst: "O(log n)", // Target is not present or found at the end of search
  },
  spaceComplexity: "O(1) (Iterative), O(log n) (Recursive due to stack space)",
};
