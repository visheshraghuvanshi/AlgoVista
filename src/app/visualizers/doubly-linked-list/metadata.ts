
// src/app/visualizers/doubly-linked-list/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'doubly-linked-list',
  title: 'Doubly Linked List Operations',
  category: 'Linked List',
  difficulty: 'Easy',
  description: 'Performs operations like insertion, deletion on a list where nodes have pointers to both next and previous nodes. Interactive visualization available.',
  longDescription: `A Doubly Linked List (DLL) is a type of linked list where each node, in addition to storing data and a pointer to the next node (\`next\`), also stores a pointer to the previous node (\`prev\`) in the sequence. This bidirectional linkage allows for more flexible traversal and manipulation compared to a singly linked list.

### Node Structure:
Each node typically contains:
1.  **Data**: The value stored in the node.
2.  **Next Pointer**: Reference to the next node in the list.
3.  **Previous Pointer**: Reference to the previous node in the list.

The list usually maintains pointers to the **head** (first node) and often a **tail** (last node) for efficient O(1) operations at both ends.
- The \`prev\` pointer of the head node is typically \`null\`.
- The \`next\` pointer of the tail node is typically \`null\`.

### How it Works (Key Operations):

**1. Traversal (O(N)):**
   - **Forward**: Start from the \`head\` and follow \`next\` pointers until \`null\`.
   - **Backward**: Start from the \`tail\` and follow \`prev\` pointers until \`null\`.

**2. Insertion:**
   - **At the Head (O(1))**:
     1. Create a new node.
     2. Set new node's \`next\` to current \`head\`.
     3. If current \`head\` exists, set \`head.prev\` to the new node.
     4. Update \`head\` to be the new node.
     5. If the list was empty, also set \`tail\` to the new node.
   - **At the Tail (O(1) if tail pointer is maintained):**
     1. Create a new node.
     2. Set new node's \`prev\` to current \`tail\`.
     3. If current \`tail\` exists, set \`tail.next\` to the new node.
     4. Update \`tail\` to be the new node.
     5. If the list was empty, also set \`head\` to the new node.
   - **At a Specific Position (e.g., before a given node 'current') (O(N) to find position, O(1) to link):**
     1. Create a new node.
     2. Link new node: \`newNode.next = current\`, \`newNode.prev = current.prev\`.
     3. Update surrounding links:
        - If \`current.prev\` exists, \`current.prev.next = newNode\`.
        - Else (inserting before current head), \`head = newNode\`.
     4. \`current.prev = newNode\`.

**3. Deletion:**
   - **Of a specific node \`nodeToDelete\` (O(1) if node reference is known, O(N) to find it otherwise):**
     1. If \`nodeToDelete.prev\` exists, set \`nodeToDelete.prev.next = nodeToDelete.next\`.
     2. Else (deleting head), update \`head = nodeToDelete.next\`.
     3. If \`nodeToDelete.next\` exists, set \`nodeToDelete.next.prev = nodeToDelete.prev\`.
     4. Else (deleting tail), update \`tail = nodeToDelete.prev\`.
     5. (Free memory of \`nodeToDelete\`).
     6. If list becomes empty (\`head\` is null), set \`tail\` to null.

**4. Search (O(N) on average/worst):**
   - Can start from \`head\` (forward) or \`tail\` (backward if searching from end is beneficial).
   - Traverse until the node is found or the end of the search direction is reached.

### Characteristics:
-   **Bidirectional Traversal**: Can be traversed forwards and backwards easily.
-   **Efficient Deletion**: If a pointer to the node to be deleted is available, deletion is O(1).
-   **Efficient End Operations**: O(1) insertion/deletion at both ends if \`head\` and \`tail\` pointers are tracked.

### Advantages:
-   Flexible traversal in both directions.
-   Efficient deletion of a node if its reference is known (O(1)).
-   Efficient insertions and deletions at both ends of the list.

### Disadvantages:
-   **More Memory per Node**: Each node requires an extra \`prev\` pointer.
-   **More Complex Pointer Manipulations**: Insertions and deletions involve updating more pointers.

### Common Use Cases:
-   Implementing browser history (back and forward navigation).
-   Undo/redo functionality in applications.
-   Used in certain data structures like LRU (Least Recently Used) caches.
-   Implementing deques (double-ended queues).`,
  timeComplexities: {
    best: "Access (head/tail): O(1), Insert/Delete (head/tail): O(1), Search: O(N)",
    average: "Access/Search: O(N), Insert/Delete (middle): O(N)",
    worst: "Access/Search: O(N), Insert/Delete (middle): O(N)",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    
