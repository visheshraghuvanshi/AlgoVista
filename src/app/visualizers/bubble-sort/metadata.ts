
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'bubble-sort',
  title: 'Bubble Sort',
  category: 'Fundamentals',
  difficulty: 'Easy',
  description: 'A simple comparison-based sorting algorithm where adjacent elements are repeatedly compared and swapped.',
  longDescription: 'Bubble Sort is a straightforward sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed, which indicates that the list is sorted. While simple to understand and implement, Bubble Sort is inefficient for large lists and is primarily used for educational purposes or for very small datasets. An optimization can be made where if no swaps occur during a pass, the algorithm can terminate early as the array is already sorted.',
  timeComplexities: {
    best: "O(n)",       // When the array is already sorted (with optimization)
    average: "O(n²)",
    worst: "O(n²)",    // When the array is sorted in reverse order
  },
  spaceComplexity: "O(1)", // In-place sorting algorithm
};
