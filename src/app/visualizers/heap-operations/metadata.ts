
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'heap-operations',
  title: 'Heap Operations',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'Illustrates fundamental heap operations like insert, extract-min/max, and heapify on a binary heap data structure.',
  longDescription: `A Heap is a specialized tree-based data structure that satisfies the heap property. In a Min-Heap, for any given node C, if P is a parent of C, then the key (the value) of P is less than or equal to the key of C. In a Max-Heap, the key of P is greater than or equal to the key of C. The heap is typically implemented as an array and is a complete binary tree.\n\nKey Operations:\n- **Insert**: Adds a new key to the heap. This involves adding the element to the end of the heap (bottom level, leftmost available spot) and then "heapifying-up" (or bubbling-up/percolating-up) to restore the heap property.\n- **Extract-Min (for Min-Heap) / Extract-Max (for Max-Heap)**: Removes and returns the element with the minimum (or maximum) value, which is always the root. This involves replacing the root with the last element in the heap, then "heapifying-down" (or bubbling-down/percolating-down) from the root to restore the heap property.\n- **Heapify-Up**: After an insertion, if a node violates the heap property with its parent, it is swapped with its parent. This process continues until the node is in its correct place or becomes the root.\n- **Heapify-Down**: After an extraction (or during heap construction), if a node violates the heap property with its children, it is swapped with its smaller (for Min-Heap) or larger (for Max-Heap) child. This process continues down the tree until the node is in its correct place or becomes a leaf.\n- **Build-Heap**: Creates a heap from an unsorted array of elements. This can be done efficiently in O(N) time by starting from the last non-leaf node and calling heapify-down on each node up to the root.\n\nUse Cases: Priority queues (most common application), Heap Sort algorithm, graph algorithms like Dijkstra's and Prim's (using heaps as priority queues).`,
  timeComplexities: {
    best: "Insert: O(1) (amortized best for some heap variants), Extract-Min/Max: O(log N), BuildHeap: O(N)",
    average: "Insert: O(log N), Extract-Min/Max: O(log N), BuildHeap: O(N)",
    worst: "Insert: O(log N), Extract-Min/Max: O(log N), BuildHeap: O(N)"
  },
  spaceComplexity: "O(N) for storing elements. O(log N) for recursion stack in recursive heapify, O(1) for iterative.",
};

