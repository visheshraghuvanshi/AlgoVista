
// src/app/visualizers/priority-queue/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'priority-queue',
  title: 'Priority Queue',
  category: 'Data Structures',
  difficulty: 'Easy', // Re-categorized to Easy for basic operations understanding
  description: 'An abstract data type where each element has a "priority" associated with it. Elements with higher priorities are served before elements with lower priorities.',
  longDescription: `A Priority Queue is an abstract data type similar to a regular queue or stack, but where each element additionally has a "priority" associated with it. In a priority queue, an element with high priority is served before an element with low priority. If two elements have the same priority, they are usually served according to their order in the queue (FIFO behavior, though this depends on the specific implementation detail).

This visualizer demonstrates a **Min-Priority Queue**, where elements with *lower* priority values are considered "higher priority" and are served first.

### Key Operations:
1.  **Insert/Enqueue (item, priority)**: Adds an item to the queue with an associated priority.
    *   *How it works (Heap-based)*: The new item is added to the end of the heap array. Then, a "heapify-up" (or bubble-up) operation is performed to move the item up the heap until the min-heap property is restored (parent's priority is less than or equal to children's priorities).
2.  **Extract-Min/Dequeue**: Removes and returns the element with the lowest priority value (highest priority) from the queue.
    *   *How it works (Heap-based)*: The item at the root of the heap (which has the minimum priority) is removed. The last element in the heap array is moved to the root. Then, a "heapify-down" (or bubble-down) operation is performed to move this element down the heap until the min-heap property is restored.
3.  **Peek/Front**: Returns the element with the lowest priority value without removing it.
    *   *How it works (Heap-based)*: Simply returns the item at the root of the heap (index 0 of the array).
4.  **IsEmpty**: Checks if the queue contains no elements.
5.  **Size**: Returns the number of elements currently in the queue.

### Common Implementations:
-   **Unsorted Array/List**:
    *   Enqueue: O(1) (add to end).
    *   Extract-Min: O(N) (scan entire array to find min).
-   **Sorted Array/List**:
    *   Enqueue: O(N) (find correct position and insert).
    *   Extract-Min: O(1) (remove from front if sorted ascending by priority).
-   **Binary Heap (Min-Heap or Max-Heap)**: This is the most common and generally efficient implementation.
    *   Enqueue: O(log N)
    *   Extract-Min/Max: O(log N)
    *   Peek: O(1)
-   **Self-Balancing Binary Search Tree**: Can also achieve O(log N) for primary operations.

The AlgoVista visualizer demonstrates a Priority Queue conceptually implemented using a **Min-Heap** (represented as an array), focusing on the enqueue, dequeue, and peek operations.

### Use Cases:
-   **Dijkstra's Algorithm**: To efficiently select the next vertex with the smallest tentative distance.
-   **Prim's Algorithm**: To select the next edge with the minimum weight to add to the MST.
-   **Huffman Coding**: To build the Huffman tree by repeatedly merging nodes with the lowest frequencies.
-   **Event-Driven Simulation**: To manage events based on their scheduled times.
-   **Task Scheduling in Operating Systems**: To manage processes based on their priorities.
-   A* search algorithm.`,
  timeComplexities: {
    best: "Heap-based: Enqueue O(1) (amortized), Extract O(log N).",
    average: "Heap-based: Enqueue O(log N), Extract O(log N).",
    worst: "Heap-based: Enqueue O(log N), Extract O(log N). (Array-based can be O(N)).",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    
