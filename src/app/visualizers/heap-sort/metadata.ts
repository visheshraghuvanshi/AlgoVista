
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'heap-sort',
  title: 'Heap Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A comparison-based sorting algorithm that uses a binary heap data structure. In-place with O(n log n) complexity.',
  longDescription: 'Heap Sort is a comparison-based sorting technique based on a Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place the maximum element at the end. We repeat the same process for the remaining elements.\n\nAlgorithm Steps:\n1. **Build Max Heap**: Rearrange the input array into a max heap. A max heap is a complete binary tree where the value of each internal node is greater than or equal to the values of its children.\n2. **Sort**: Repeatedly extract the maximum element from the heap (which is always the root) and move it to the end of the array. After each extraction, the heap size is reduced, and the heap property is restored for the remaining elements.\n   a. Swap the root (maximum element) with the last element of the heap.\n   b. Reduce the heap size by one.\n   c. Call heapify on the root of the reduced heap to maintain the max heap property.\n\nHeap sort is an in-place algorithm but is not stable. It has a guaranteed O(n log n) time complexity in all cases (best, average, and worst).',
  timeComplexities: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)"
  },
  spaceComplexity: "O(1) (in-place algorithm, though O(log n) or O(n) for recursion stack if heapify is recursive and not optimized for tail calls)",
};
