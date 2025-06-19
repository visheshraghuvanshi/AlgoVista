
// src/app/visualizers/deque-operations/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'deque-operations',
  title: 'Deque Operations',
  category: 'Data Structures',
  difficulty: 'Easy',
  description: 'Double-ended queue (Deque) allowing element addition/removal from both ends.',
  longDescription: `A Deque (Double-Ended Queue), pronounced "deck", is an abstract data type that generalizes a queue. Unlike a standard queue where elements are added at one end (rear) and removed from the other (front), a deque allows elements to be added to or removed from *either* the front (head) or the back (tail). It is also sometimes called a head-tail linked list, though it can be implemented using arrays as well.

### Key Characteristics:
-   **Flexibility**: Combines the properties of both stacks (LIFO) and queues (FIFO).
-   **No Fixed End for Addition/Removal**: Operations can occur at both ends.

### Core Operations:
The names of operations can vary slightly depending on the programming language or library. Common operations include:

1.  **AddFront (or PushFront, AddHead, EnqueueFront)**: Adds an element to the front (head) of the deque.
    *   *How it works*: The new element becomes the new head. Existing elements shift (conceptually, if array-based) or pointers are updated (if list-based).
2.  **AddLast (or PushBack, AddTail, EnqueueRear)**: Adds an element to the back (tail) of the deque.
    *   *How it works*: The new element becomes the new tail.
3.  **RemoveFront (or PopFront, RemoveHead, DequeueFront)**: Removes and returns the element from the front (head) of the deque.
    *   *How it works*: The element after the original head becomes the new head. Returns an error or special value if the deque is empty.
4.  **RemoveLast (or PopBack, RemoveTail, DequeueRear)**: Removes and returns the element from the back (tail) of the deque.
    *   *How it works*: The element before the original tail becomes the new tail. Returns an error or special value if the deque is empty.
5.  **PeekFirst (or GetFront, Front)**: Returns the element at the front of the deque without removing it.
    *   Returns an error or special value if empty.
6.  **PeekLast (or GetBack, Rear)**: Returns the element at the back of the deque without removing it.
    *   Returns an error or special value if empty.
7.  **IsEmpty**: Checks if the deque contains no elements.
8.  **Size**: Returns the number of elements currently in the deque.

### Common Implementations:
-   **Doubly Linked List**: Each node points to the next and previous elements. Adding or removing from either end is O(1) as head and tail pointers allow direct access.
-   **Dynamic Array (often with a Circular Buffer)**: A resizable array can be used. To achieve O(1) amortized time for additions/removals at both ends, a circular buffer approach is often employed. This involves using head and tail indices that can wrap around the array, avoiding costly element shifting for most operations. Resizing the array (when full or too empty) can take O(N) time but is amortized over many O(1) operations.
    *AlgoVista visualizes a simple array-based implementation where \\\`unshift\\\` (addFront) and \\\`shift\\\` (removeFront) might have O(N) implications in a naive array.*

### Advantages:
-   Highly versatile, can function as a stack, a queue, or both.
-   Provides O(1) (amortized for efficient array, worst-case for linked list) time complexity for additions and removals at both ends, which is its main advantage over simple stacks or queues if such operations are needed.

### Disadvantages:
-   Naive array-based implementations (without circular buffer) can be inefficient (O(N)) for front operations.
-   Linked-list based implementations have the usual overhead of pointer storage.

### Common Use Cases:
-   Implementing a queue (using AddLast, RemoveFirst).
-   Implementing a stack (using AddLast, RemoveLast, or alternatively AddFirst, RemoveFirst).
-   Storing a list of "undo" operations in software, where new operations are added to one end and undone from the same end.
-   Certain types of job scheduling algorithms.
-   In graph algorithms like 0-1 Breadth-First Search (0-1 BFS), where edges of weight 0 are added to the front and edges of weight 1 to the back.
-   Palindrome checking (by adding characters to one end and comparing/removing from both ends).`,
  timeComplexities: {
    best: "All operations O(1) with Doubly Linked List or efficient Circular Array.",
    average: "All operations O(1) with Doubly Linked List or efficient Circular Array.",
    worst: "Add/Remove O(N) if using simple array and resizing/shifting, but typically O(1) for common implementations.",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    
