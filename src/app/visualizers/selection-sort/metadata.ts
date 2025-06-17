
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'selection-sort',
  title: 'Selection Sort',
  category: 'Fundamentals',
  difficulty: 'Easy',
  description: 'Repeatedly finds the minimum element from the unsorted part of the list and puts it at the beginning.',
  longDescription: 'Selection Sort is an in-place comparison sorting algorithm. It divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire input list. The algorithm proceeds by finding the smallest (or largest, depending on sorting order) element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element (putting it in sorted order), and moving the sublist boundaries one element to the right.',
  timeComplexities: {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(1)", // In-place sorting algorithm
};
