
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'linear-search',
  title: 'Linear Search',
  category: 'Fundamentals',
  difficulty: 'Easy',
  description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
  longDescription: 'Linear Search sequentially checks each element of a list or array until a match for the target value is found, or until the entire list has been traversed. It is one of the simplest searching algorithms. The process begins at the first element and proceeds to the next, comparing each element with the target. If a match is found, the algorithm typically returns the index of the element. If the end of the list is reached without finding the target, it indicates that the target is not present in the list. Linear search can be applied to unsorted lists as well as sorted ones, though for sorted lists, more efficient algorithms like binary search are usually preferred. Its simplicity makes it a good starting point for understanding search concepts.',
  timeComplexities: {
    best: "O(1)", // Target is the first element
    average: "O(n)", // Target is in the middle on average
    worst: "O(n)", // Target is the last element or not present
  },
  spaceComplexity: "O(1)", // Only a few variables needed for iteration
};
