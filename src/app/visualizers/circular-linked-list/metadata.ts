
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

**1. Traversal (O(N)):**
   - Start from the \`head\`.
   - Visit the current node.
   - Move to \`current.next\`.
   - Repeat until \`current\` becomes equal to the \`head\` again. Care must be taken to handle the first node correctly to ensure the loop terminates. A common way is to use a \`do-while\` loop: process the current node, then move to next, and continue as long as \`current != head\`. For an empty list, this condition should not be entered.

**2. Insertion:**
   - **At the Head (becomes the new head) (O(N) without tail pointer, O(1) with tail pointer):**
     1. Create a new node.
     2. If the list is empty: New node's \`next\` points to itself, and \`head\` points to it.
     3. If the list is not empty:
        a. Traverse to find the last node (the one whose \`next\` currently points to the original \`head\`). Let this be \`tailNode\`.
        b. Make the new node's \`next\` point to the current \`head\`.
        c. Make \`tailNode.next\` point to the new node.
        d. Update \`head\` to be the new node.
   - **At a Specific Position (O(N)):**
     1. If position is 0, use "Insert at Head".
     2. Otherwise, traverse to the node *before* the desired insertion position (\`prevNode\`).
     3. Create a new node.
     4. Set \`newNode.next = prevNode.next\`.
     5. Set \`prevNode.next = newNode\`.
     6. If inserting at the logical end (i.e., after the current \`tailNode\` but before it loops back to \`head\`), ensure the new node becomes the new tail and points back to head.

**3. Deletion:**
   - **Of the Head Node (O(N) without tail pointer, O(1) with):**
     1. If it's the only node: Set \`head\` to \`null\`.
     2. Otherwise:
        a. Traverse to find the last node (\`tailNode\`).
        b. Store \`head.next\` (this will be the new head).
        c. Set \`tailNode.next\` to \`head.next\`.
        d. Update \`head = head.next\`.
        e. (Free memory of old head).
   - **Of any other node (O(N)):**
     1. Traverse to find the node to be deleted (\`targetNode\`) and its \`previousNode\`.
     2. Set \`previousNode.next = targetNode.next\`.
     3. (Free memory of \`targetNode\`). If \`targetNode\` was the tail, \`previousNode\` becomes the new tail and must point to the head.

### Advantages:
-   The entire list can be traversed starting from any node, and traversal can continue indefinitely.
-   Useful for applications that require a round-robin or cyclical processing of items (e.g., scheduling tasks in a loop, managing resources in a circular buffer).
-   Can implement queues efficiently if a pointer to the last node (tail that points to head) is maintained. Insertion at tail and deletion from head (head.next) become O(1).

### Disadvantages:
-   Care must be taken during traversal and manipulation to avoid infinite loops, especially checking for the end condition (returning to the head) correctly.
-   Operations like finding the last node (if only head is known and no tail pointer is maintained) still take O(N) time.
-   If not handled carefully, a simple loop checking for \`null\` will run infinitely.

### Common Use Cases:
-   Implementing circular buffers or queues.
-   Round-robin scheduling in operating systems (e.g., time-sharing for processes).
-   Turn-based games where players take turns in a cycle.
-   Applications where data is processed in a continuous loop or items are repeatedly cycled through (e.g., a media playlist).
-   Sometimes used in computer graphics for representing cyclical structures.`,
  timeComplexities: {
    best: "Access (head): O(1), Insert/Delete (head): O(1) (if last node ref maintained) or O(N), Traverse: O(N)",
    average: "Access/Search: O(N), Insert/Delete: O(N)",
    worst: "Access/Search: O(N), Insert/Delete: O(N)",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    
