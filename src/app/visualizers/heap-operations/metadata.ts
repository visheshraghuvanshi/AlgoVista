
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'heap-operations',
  title: 'Heap Operations',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'Illustrates fundamental heap operations like insert, extract-min/max, and heapify on a binary heap data structure.',
  longDescription: `A **Heap** is a specialized tree-based data structure that satisfies the **heap property**. It's typically implemented as an array and visualized as a complete binary tree.

### Types of Heaps:
-   **Min-Heap**: For any given node C, if P is a parent of C, then the key (the value) of P is less than or equal to the key of C. The smallest element is always at the root.
-   **Max-Heap**: For any given node C, if P is a parent of C, then the key of P is greater than or equal to the key of C. The largest element is always at the root.

Our visualizer primarily demonstrates a **Min-Heap**.

### How it Works (Key Operations for Min-Heap):

**1. Insert (O(log N))**
   -   Add the new element to the end of the heap (the first available spot at the bottom level, typically the end of the array).
   -   **Heapify-Up (or Bubble-Up, Percolate-Up)**: Compare the added element with its parent. If it's smaller than its parent (violating min-heap property), swap them. Repeat this process with the new parent until the element is in its correct position (i.e., it's not smaller than its parent, or it becomes the root).

**2. Extract-Min (O(log N))**
   -   The minimum element is always at the root of the Min-Heap.
   -   Store the root element (this is the minimum to be returned).
   -   Move the last element of the heap to the root position.
   -   Remove the last element (conceptually shortening the heap).
   -   **Heapify-Down (or Bubble-Down, Percolate-Down)**: The new root might violate the min-heap property. Compare it with its children. If it's larger than any of its children, swap it with the smaller of its children. Repeat this process down the tree until the element is in its correct position (i.e., it's smaller than or equal to both its children, or it becomes a leaf node).

**3. Build-Heap (O(N))**
   -   Converts an unsorted array into a heap.
   -   A common efficient method is to start from the last non-leaf node (index \`floor(N/2) - 1\` in a 0-indexed array) and call \`heapifyDown\` on each node up to the root (index 0).
   -   Processing in this reverse order ensures that when \`heapifyDown\` is called on a node, its subtrees are already heaps.

**4. Peek-Min (O(1))**
   -   Returns the minimum element (the root) without removing it.

### Array Implementation Details (0-indexed):
For a node at index \`i\`:
-   Parent: \`floor((i - 1) / 2)\`
-   Left Child: \`2 * i + 1\`
-   Right Child: \`2 * i + 2\`

### Characteristics:
-   **Complete Binary Tree**: All levels are filled except possibly the last one, which is filled from left to right. This allows for efficient array-based representation.
-   **Heap Property**: Min-heap or Max-heap property is maintained.

### Advantages:
-   **Efficient Priority Queue**: Finding the min/max element is O(1) (peek). Adding and removing elements are O(log N).
-   **Efficient Build-Heap**: Can be built from an array in O(N) time.
-   Used as the basis for Heap Sort (O(N log N) sorting algorithm).

### Disadvantages:
-   Searching for an arbitrary element is O(N) as there's no specific order beyond the heap property relative to children/parent.
-   Not a stable sort if used for Heap Sort.

### Common Use Cases:
-   **Priority Queues**: Most common application. Tasks or events are processed based on priority.
-   **Heap Sort**: An efficient comparison-based sorting algorithm.
-   **Graph Algorithms**: Used in algorithms like Dijkstra's (for shortest paths) and Prim's (for Minimum Spanning Trees) to efficiently select the next vertex/edge to process.
-   Finding the k-th smallest/largest element in a collection.

AlgoVista demonstrates the Insert, Extract-Min, and Build-Heap operations on a Min-Heap, visualizing the array as a complete binary tree and highlighting the heapify-up and heapify-down processes.`,
  timeComplexities: {
    best: "Insert: O(1) (amortized best for some heap variants), Extract-Min/Max: O(log N), BuildHeap: O(N)",
    average: "Insert: O(log N), Extract-Min/Max: O(log N), BuildHeap: O(N)",
    worst: "Insert: O(log N), Extract-Min/Max: O(log N), BuildHeap: O(N)"
  },
  spaceComplexity: "O(N) for storing elements. O(log N) for recursion stack in recursive heapify, O(1) for iterative.",
};
