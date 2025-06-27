
// src/app/visualizers/singly-linked-list/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'singly-linked-list',
  title: 'Singly Linked List Operations',
  category: 'Linked List',
  difficulty: 'Easy',
  description: 'Performs basic operations like insertion, deletion, search, and traversal on a singly linked list. Interactive visualization available.',
  longDescription: `A Singly Linked List is a fundamental linear data structure where elements are stored in nodes. Each node contains two fields:
1.  **Data**: The actual value or payload stored in the node.
2.  **Next Pointer (or Link)**: A reference to the next node in the sequence. The last node's next pointer is typically \`null\`, indicating the end of the list.

The list is accessed starting from the first node, called the **head**.

### Key Operations:

**1. Traversal (Time: O(N))**
   - Start from the \`head\` node.
   - Visit the current node (e.g., read its data).
   - Move to the next node using the \`next\` pointer.
   - Repeat until the current node is \`null\`.

**2. Insertion**
   - **At the Head (Time: O(1))**: Create a new node, set its \`next\` to the current head, and update the head to be the new node. This is very efficient.
   - **At the Tail (Time: O(N))**: Traverse the entire list to find the last node, then update its \`next\` pointer to the new node. This is inefficient without a direct pointer to the tail.
   - **At a Specific Position (Time: O(N))**: Traverse to the node *before* the target position, then update pointers to insert the new node.

**3. Deletion**
   - **At the Head (Time: O(1))**: Simply update the \`head\` pointer to \`head.next\`.
   - **By Value (Time: O(N))**: Traverse the list to find the node with the target value, keeping track of the previous node to update its \`next\` pointer.
   - **At a Specific Position (Time: O(N))**: Traverse to the node *before* the target position and update pointers.

**4. Search (Time: O(N))**
   - Start from the \`head\` and traverse the list, comparing each node's data with the target value until it's found or the list ends.

### Characteristics:
-   **Dynamic Size**: Easily grows or shrinks.
-   **Sequential Access**: No random access; elements must be accessed in order from the head.
-   **Memory Allocation**: Nodes are dynamically allocated and not necessarily contiguous in memory.

### Advantages:
-   Efficient insertions and deletions at the beginning of the list (O(1)).
-   Flexible size without pre-allocation waste.

### Disadvantages:
-   Slow random access (O(N)).
-   Requires extra memory for pointers.
-   Traversing backwards is not possible.

### Common Use Cases:
-   Implementing other data structures like stacks and queues.
-   Situations where insertions/deletions at the beginning are frequent.
-   Managing adjacency lists for graph representations.`,
  timeComplexities: {
    best: "Access/Search: O(1) (at head), Insertion: O(1) (at head), Deletion: O(1) (at head)",
    average: "Access/Search: O(N), Insertion: O(N), Deletion: O(N)",
    worst: "Access/Search: O(N), Insertion: O(N), Deletion: O(N)",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    

