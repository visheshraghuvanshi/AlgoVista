
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'shell-sort',
  title: 'Shell Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'An in-place comparison sort that is an improvement over insertion sort by allowing comparison and exchange of elements that are far apart.',
  longDescription: 'Shell Sort, also known as Shell\'s method or shellsort, is an in-place comparison sort. It can be seen as either a generalization of sorting by exchange (bubble sort) or sorting by insertion (insertion sort). The method starts by sorting pairs of elements far apart from each other, then progressively reducing the gap between elements to be compared. Starting with far apart elements can move some out-of-place elements into position faster than a simple nearest neighbor exchange.\n\nThe specific sequence of gaps used is crucial to the algorithm\'s efficiency. Common sequences include Shell\'s original sequence (N/2, N/4, ..., 1), Knuth\'s sequence (1, 4, 13, 40, ...), Sedgewick\'s sequence, and others. The final pass, with a gap of 1, is essentially an insertion sort, but by then, the array is expected to be substantially sorted, making insertion sort efficient.\n\nWhile not as fast as O(n log n) algorithms like Merge Sort or Quick Sort in the worst case for arbitrary inputs, Shell Sort is a relatively simple algorithm to implement and performs significantly better than O(n²) algorithms like Bubble Sort or Insertion Sort on average.',
  timeComplexities: {
    best: "O(n log n) (depends on gap sequence)",
    average: "O(n (log n)²) or O(n^(3/2)) (depends on gap sequence)",
    worst: "O(n²) (Shell's original gaps), O(n (log n)²) (Pratt's gaps)",
  },
  spaceComplexity: "O(1) (in-place).",
};

