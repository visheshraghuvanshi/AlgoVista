
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'priority-queue',
  title: 'Priority Queue',
  category: 'Data Structures',
  difficulty: 'Medium',
  description: 'An abstract data type where each element has a "priority" associated with it. Elements with higher priorities are served before elements with lower priorities.',
  longDescription: 'A Priority Queue is an abstract data type similar to a regular queue or stack, but where each element additionally has a "priority" associated with it. In a priority queue, an element with high priority is served before an element with low priority. If two elements have the same priority, they are usually served according to their order in the queue (FIFO).\n\nKey Operations:\n- **Insert/Enqueue**: Adds an item to the queue with an associated priority.\n- **Extract-Max (or Extract-Min)**: Removes and returns the element with the highest (or lowest) priority.\n- **Peek-Max (or Peek-Min)**: Returns the element with the highest (or lowest) priority without removing it.\n- **Increase-Key (or Decrease-Key)**: Changes the priority of an element in the queue.\n- **IsEmpty**: Checks if the queue is empty.\n\nCommon Implementations:\n- **Unsorted Array/List**: Insert O(1), Extract-Max O(N).\n- **Sorted Array/List**: Insert O(N), Extract-Max O(1).\n- **Binary Heap (Min-Heap or Max-Heap)**: Insert O(log N), Extract-Max/Min O(log N). This is the most common and efficient general-purpose implementation.\n- **Self-Balancing Binary Search Tree**: Can also achieve O(log N) for operations.\n\nUse Cases: Dijkstra\'s algorithm (to find shortest paths), Prim\'s algorithm (for MST), Huffman coding (for data compression), event-driven simulation, task scheduling by priority in operating systems.',
  timeComplexities: {
    best: "Heap-based: Insert O(1) (amortized best for some heap variants), Extract O(log N).",
    average: "Heap-based: Insert O(log N), Extract O(log N).",
    worst: "Heap-based: Insert O(log N), Extract O(log N). (Array-based can be O(N) for some ops).",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    