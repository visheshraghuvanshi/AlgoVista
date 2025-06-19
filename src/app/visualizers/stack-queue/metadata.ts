
// src/app/visualizers/stack-queue/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'stack-queue',
  title: 'Stack & Queue Operations',
  category: 'Data Structures',
  difficulty: 'Easy',
  description: 'Fundamental linear data structures: Stack (LIFO) and Queue (FIFO). Both are now interactive!',
  longDescription: `Stacks and Queues are fundamental linear data structures used to store collections of elements. They differ primarily in the order in which elements are accessed and removed.

### Stack (LIFO - Last-In, First-Out)
A stack operates on the LIFO principle: the last element added to the stack is the first one to be removed. Imagine a stack of plates; you add plates to the top and remove plates from the top.

**Key Operations:**
1.  **Push (or Add)**: Adds an element to the "top" of the stack.
    *   *How it works*: The new element becomes the new top.
2.  **Pop (or Remove)**: Removes and returns the element from the "top" of the stack.
    *   *How it works*: The element below the current top (if any) becomes the new top. An error or special value is returned if the stack is empty.
3.  **Peek (or Top)**: Returns the element at the "top" of the stack without removing it.
    *   *How it works*: Useful for inspecting the next element to be popped. An error or special value is returned if the stack is empty.
4.  **IsEmpty**: Checks if the stack contains no elements.
5.  **Size**: Returns the number of elements currently in the stack.

**Common Implementations:**
-   **Array (Dynamic or Fixed-size)**: Push and pop operations typically involve adding/removing from one end of the array (e.g., the end with the highest index). Resizing may be needed for dynamic arrays.
-   **Linked List**: Push and pop operations involve adding/removing from the head of the list.

**Use Cases:**
-   Function call management in programming (the call stack).
-   Undo/redo mechanisms in applications.
-   Expression evaluation (e.g., converting infix to postfix, evaluating postfix expressions).
-   Depth-First Search (DFS) in graph and tree traversal (using an explicit stack for the iterative version).
-   Validating parentheses or HTML tags.

### Queue (FIFO - First-In, First-Out)
A queue operates on the FIFO principle: the first element added to the queue is the first one to be removed. Imagine a line of people waiting for a service; the first person in line is served first.

**Key Operations:**
1.  **Enqueue (or Add/Offer)**: Adds an element to the "rear" (or "back", "tail") of the queue.
    *   *How it works*: The new element becomes the new rear.
2.  **Dequeue (or Remove/Poll)**: Removes and returns the element from the "front" (or "head") of the queue.
    *   *How it works*: The element that was second in line (if any) becomes the new front. An error or special value is returned if the queue is empty.
3.  **Front (or Peek)**: Returns the element at the "front" of the queue without removing it.
    *   *How it works*: Useful for inspecting the next element to be dequeued. An error or special value is returned if the queue is empty.
4.  **IsEmpty**: Checks if the queue contains no elements.
5.  **Size**: Returns the number of elements currently in the queue.

**Common Implementations:**
-   **Array (often a Circular Array/Buffer)**: Enqueueing adds to one end, dequeuing removes from the other. Circular arrays are efficient to avoid shifting elements.
-   **Linked List**: Enqueueing adds to the tail, dequeuing removes from the head. Requires pointers to both head and tail for O(1) operations.
-   **Using Two Stacks**: A less common but possible implementation.

**Use Cases:**
-   Managing requests in order (e.g., print queues, server request handling).
-   Breadth-First Search (BFS) in graph and tree traversal.
-   Buffers in data streaming.
-   Simulating waiting lines.
-   CPU task scheduling.

Both data structures are crucial building blocks in computer science and software development.`,
  timeComplexities: {
    best: "Stack (Array/LL): Push O(1), Pop O(1), Peek O(1). Queue (LL/Circular Array): Enqueue O(1), Dequeue O(1), Peek O(1).",
    average: "Stack (Array/LL): Push O(1), Pop O(1), Peek O(1). Queue (LL/Circular Array): Enqueue O(1), Dequeue O(1), Peek O(1).",
    worst: "Stack (Dynamic Array Push O(N) amortized if resize), Queue (Simple Array Dequeue O(N)). LL/Circular Array generally O(1) for core ops.",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    
