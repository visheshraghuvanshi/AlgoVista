// src/app/visualizers/stack-queue/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'stack-queue',
  title: 'Stack & Queue Operations',
  category: 'Data Structures',
  difficulty: 'Easy',
  description: 'Fundamental linear data structures: Stack (LIFO) and Queue (FIFO). Both are now interactive!',
  longDescription: 'Stacks and Queues are fundamental linear data structures that differ in how elements are added and removed.\n\n**Stack (LIFO - Last-In, First-Out):**\nImagine a stack of plates. You can only add a new plate to the top, and you can only remove the topmost plate. This is the LIFO principle. Interactive visualization for Push, Pop, and Peek is available.\nKey Operations:\n- **Push**: Adds an item to the top of the stack.\n- **Pop**: Removes and returns the item from the top of the stack.\n- **Peek/Top**: Returns the top item without removing it.\n- **IsEmpty**: Checks if the stack is empty.\nCommon Implementations: Arrays (dynamic or fixed-size) or Linked Lists.\nUse Cases: Function call management (call stack), undo mechanisms, expression evaluation (infix to postfix), depth-first search (DFS).\n\n**Queue (FIFO - First-In, First-Out):**\nImagine a queue of people waiting for a service. The first person to join is the first person to be served. This is the FIFO principle. Interactive visualization for Enqueue, Dequeue, and Front (Peek) is available.\nKey Operations:\n- **Enqueue (or Add/Offer)**: Adds an item to the rear (end) of the queue.\n- **Dequeue (or Remove/Poll)**: Removes and returns the item from the front (head) of the queue.\n- **Front/Peek**: Returns the front item without removing it.\n- **IsEmpty**: Checks if the queue is empty.\nCommon Implementations: Arrays (circular arrays are efficient) or Linked Lists.\nUse Cases: Task scheduling, breadth-first search (BFS), print queues, message queues, simulating waiting lines.',
  timeComplexities: {
    best: "Stack (Array/LL): Push O(1), Pop O(1), Peek O(1). Queue (LL/Circular Array): Enqueue O(1), Dequeue O(1), Peek O(1).",
    average: "Stack (Array/LL): Push O(1), Pop O(1), Peek O(1). Queue (LL/Circular Array): Enqueue O(1), Dequeue O(1), Peek O(1).",
    worst: "Stack (Dynamic Array Push O(N) amortized if resize), Queue (Simple Array Dequeue O(N)). LL/Circular Array generally O(1) for core ops.",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    
