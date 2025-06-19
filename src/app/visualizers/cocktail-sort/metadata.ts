
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'cocktail-sort',
  title: 'Cocktail Shaker Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  description: 'A bidirectional bubble sort, improving slightly on bubble sort by sorting in both directions each pass. Interactive visualization available.',
  longDescription: 'Cocktail Shaker Sort, also known as bidirectional bubble sort, cocktail sort, shaker sort (which can also refer to a variant of selection sort), ripple sort, shuffle sort, or shuttle sort, is a variation of bubble sort that is both a stable sorting algorithm and a comparison sort. The algorithm differs from bubble sort in that it sorts in both directions on each pass through the list. This sorting algorithm is only marginally more difficult to implement than bubble sort, and solves the problem of turtles (slow-moving items) in bubble sort. It provides only minor performance improvements, and like bubble sort, is not of practical interest for large datasets.',
  timeComplexities: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(1)",
};
