
// src/app/visualizers/circular-linked-list/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'circular-linked-list',
  title: 'Circular Linked List Ops',
  category: 'Linked List',
  difficulty: 'Easy',
  description: 'Operations on circular linked lists where the last node points back to the first, forming a circle. Interactive visualization available.',
  longDescription: `A Circular Linked List is a variation of a linked list in which the last node's \`next\` pointer points back to the first node (the \`head\`) of the list, forming a circle or loop. Unlike standard linear linked lists, there is no \`null\` at the end. This structure can be implemented as either a singly circular linked list (each node has only a \`next\` pointer) or a doubly circular linked list (each node has both \`next\` and \`prev\` pointers, with the head's \`prev\` pointing to the tail and the tail's \`next\` pointing to the head). Our visualizer primarily focuses on the singly circular variant.

### Key Properties:
-   **Cyclical Structure**: The list forms a continuous loop. Traversing from any node will eventually lead back to that starting node.
-   **No Null End**: The last node does not point to \`null\`; it points to the \`head\`.
-   **Access Point**: Any node can theoretically serve as an access point to the list, though a \`head\` pointer (or sometimes a pointer to the last element, which makes accessing both head and tail O(1)) is commonly maintained.

### How it Works (Key Operations for Singly Circular Linked List):

**1. Traversal:**
   - Start from the \`head\`.
   - Visit the current node.
   - Move to \`current.next\`.
   - Repeat until \`current\` becomes equal to the \`head\` again. Care must be taken to handle the first node correctly to ensure the loop terminates. A common way is to use a \`do-while\` loop or check \`current.next != head\` inside a \`while\` loop after processing the head.

**2. Insertion:**
   - **At the Head (becomes the new head):**
     1. Create a new node.
     2. If the list is empty: New node points to itself, and \`head\` points to it.
     3. If the list is not empty:
        a. Traverse to find the last node (the one whose \`next\` currently points to the \`head\`).
        b. Make the new node's \`next\` point to the current \`head\`.
        c. Make the last node's \`next\` point to the new node.
        d. Update \`head\` to be the new node.
   - **At the Tail (after the current last node):**
     1. Create a new node.
     2. If the list is empty: (Same as inserting at head).
     3. If not empty:
        a. Traverse to find the last node.
        b. Make the new node's \`next\` point to the current \`head\`.
        c. Make the last node's \`next\` point to the new node.
        (The new node effectively becomes the new last node).

**3. Deletion:**
   - **Of the Head Node:**
     1. If it's the only node, set \`head\` to \`null\`.
     2. Otherwise, find the last node.
     3. Make the last node's \`next\` point to \`head.next\`.
     4. Update \`head = head.next\`.
   - **Of any other node:**
     1. Traverse to find the node to be deleted (\`current\`) and its \`previous\` node.
     2. Set \`previous.next = current.next\`.
     3. If deleting the node that the "tail" (last node before update) was pointing to as head, ensure the tail's next pointer is updated correctly if the list structure changes significantly (e.g. if head was deleted).

### Advantages:
-   The entire list can be traversed starting from any node.
-   Useful for applications that require a round-robin or cyclical processing of items (e.g., scheduling tasks in a loop, managing resources in a circular buffer).
-   Can implement queues efficiently if a pointer to the last node is maintained (enqueue at tail, dequeue from head's next, then update last's next to new head).

### Disadvantages:
-   Care must be taken during traversal and manipulation to avoid infinite loops, especially checking for the end condition correctly.
-   Operations like finding the last node (if only head is known) still take O(N) time.

### Common Use Cases:
-   Implementing circular buffers or queues.
-   Round-robin scheduling in operating systems.
-   Game development for representing cyclical paths or player turns.
-   Applications where data is processed in a continuous loop.`,
  timeComplexities: {
    best: "Access (head): O(1), Insert/Delete (head): O(1) (if last node ref maintained) or O(N), Traverse: O(N)",
    average: "Access/Search: O(N), Insert/Delete: O(N)",
    worst: "Access/Search: O(N), Insert/Delete: O(N)",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    
