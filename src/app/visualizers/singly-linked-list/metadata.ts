
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

### How it Works (Key Operations):

**1. Traversal (O(N)):**
   - Start from the \`head\` node.
   - Visit the current node (e.g., read its data).
   - Move to the next node using the \`next\` pointer.
   - Repeat until the \`next\` pointer is \`null\` (i.e., the current node is the last node or the list is empty).

**2. Insertion:**
   - **At the Head (O(1))**:
     1. Create a new node with the given data.
     2. Set the \`next\` pointer of the new node to point to the current \`head\`.
     3. Update the \`head\` of the list to be the new node.
   - **At the Tail (O(N) without tail pointer, O(1) with tail pointer):**
     1. Create a new node.
     2. If the list is empty, make the new node the \`head\` and return.
     3. Otherwise, traverse to the last node (the node whose \`next\` pointer is \`null\`).
     4. Set the \`next\` pointer of this current last node to the new node.
     5. (If a separate \`tail\` pointer is maintained, update it to point to the new node).
   - **At a Specific Position (O(N) on average):**
     1. To insert at position \`k\`, traverse the list to find the node at position \`k-1\` (the predecessor).
     2. Create a new node.
     3. Set the new node's \`next\` pointer to point to the predecessor's current \`next\` node (which will be the node at position \`k\`).
     4. Set the predecessor's \`next\` pointer to the new node.
     5. Handle edge cases: inserting at position 0 (same as insert at head) or inserting beyond the list's length (often treated as insert at tail).

**3. Deletion:**
   - **At the Head (O(1))**:
     1. If the list is not empty, store the current \`head\`'s \`next\` node.
     2. Update the \`head\` to be this stored \`next\` node.
     3. (Optionally, free the memory of the old head node).
   - **By Value (O(N) on average):**
     1. Traverse the list, keeping track of the \`current\` node and its \`previous\` node.
     2. If the \`current\` node's data matches the value to be deleted:
        - If it's the head node, update \`head = head.next\`.
        - Otherwise, set \`previous.next = current.next\` (bypassing the \`current\` node).
        - (Optionally, free memory).
        - Return success.
     3. If the end of the list is reached without finding the value, return failure.
   - **At a Specific Position (O(N) on average):**
     1. Traverse to find the node *before* the one at the target position (\`k-1\`).
     2. Let this be \`previousNode\`. The node to delete is \`previousNode.next\`.
     3. Set \`previousNode.next = previousNode.next.next\`.
     4. Handle edge case: deleting the head (position 0).

**4. Search (O(N) on average/worst):**
   - Start from the \`head\`.
   - Traverse the list, comparing each node's data with the target value.
   - If found, return the node or its index (or a boolean).
   - If the end of the list is reached without finding the target, indicate failure.

### Characteristics:
-   **Dynamic Size**: Can easily grow or shrink as elements are added or removed.
-   **Sequential Access**: Elements must be accessed sequentially starting from the head. Direct access to an element by index takes O(N) time.
-   **Memory Allocation**: Memory for each node is typically allocated dynamically, so nodes may not be in contiguous memory locations.
-   **No Wasted Space from Pre-allocation**: Unlike arrays, linked lists don't need a large contiguous block of memory pre-allocated.

### Advantages:
-   Efficient insertions and deletions at the beginning of the list (O(1) for head operations).
-   Dynamic size makes it flexible for varying amounts of data.
-   Can be more memory-efficient in terms of overall system fragmentation compared to large static arrays if elements are frequently added/removed.

### Disadvantages:
-   **Slow Random Access**: Accessing an element by its index (e.g., the 5th element) requires traversing from the head, taking O(N) time in the worst case.
-   **Extra Memory for Pointers**: Each node requires additional memory to store the \`next\` pointer, which can be a significant overhead if the data stored in each node is small.
-   **Reverse Traversal**: Traversing the list in reverse order is not directly possible with a singly linked list (it would require O(N) operations or modifying the list).

### Common Use Cases:
-   Implementing other data structures like stacks and queues.
-   Situations where insertions and deletions at the beginning (or end, if a tail pointer is maintained) are frequent.
-   When the size of the list is unknown beforehand or changes dynamically and unpredictably.
-   Adjacency lists for graph representation.
-   Managing lists of items where the order is important but frequent random access is not.`,
  timeComplexities: {
    best: "Access/Search: O(N) (O(1) if head), Insertion: O(1) (head) / O(N) (tail/middle), Deletion: O(1) (head) / O(N) (tail/middle)",
    average: "Access/Search: O(N), Insertion: O(N), Deletion: O(N)",
    worst: "Access/Search: O(N), Insertion: O(N), Deletion: O(N)",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    
