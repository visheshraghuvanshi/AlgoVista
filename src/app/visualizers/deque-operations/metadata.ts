// src/app/visualizers/deque-operations/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'deque-operations',
  title: 'Deque Operations',
  category: 'Data Structures',
  difficulty: 'Easy',
  description: 'Double-ended queue (Deque) allowing element addition/removal from both ends.',
  longDescription: 'A Deque (Double-Ended Queue), pronounced "deck", is an abstract data type that generalizes a queue, for which elements can be added to or removed from either the front (head) or back (tail). It is also often called a head-tail linked list.\n\nKey Operations:\n- **AddFirst (or PushFront)**: Adds an item to the front of the deque.\n- **AddLast (or PushBack)**: Adds an item to the rear of the deque.\n- **RemoveFirst (or PopFront)**: Removes and returns the item from the front of the deque.\n- **RemoveLast (or PopBack)**: Removes and returns the item from the rear of the deque.\n- **PeekFirst (or GetFront)**: Returns the front item without removing it.\n- **PeekLast (or GetBack)**: Returns the rear item without removing it.\n- **IsEmpty**: Checks if the deque is empty.\n- **Size**: Returns the number of elements in the deque.\n\nCommon Implementations: Doubly Linked Lists or dynamic arrays (often with a circular buffer approach for efficiency).\nUse Cases: Implementing a queue (using AddLast, RemoveFirst), implementing a stack (using AddLast, RemoveLast or AddFirst, RemoveFirst), storing a list of undo operations, certain types of job scheduling, breadth-first search on a grid where edge weights are 0 or 1 (0-1 BFS).',
  timeComplexities: {
    best: "All operations O(1) with Doubly Linked List or efficient Circular Array.",
    average: "All operations O(1) with Doubly Linked List or efficient Circular Array.",
    worst: "Add/Remove O(N) if using simple array and resizing/shifting, but typically O(1) for common implementations.",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    
