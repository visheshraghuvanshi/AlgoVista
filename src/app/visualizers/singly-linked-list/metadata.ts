
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

**1. Traversal:**
   - Start from the \`head\` node.
   - Visit the current node (e.g., read its data).
   - Move to the next node using the \`next\` pointer.
   - Repeat until the \`next\` pointer is \`null\`.

**2. Insertion:**
   - **At the Head (O(1))**:
     1. Create a new node with the given data.
     2. Set the \`next\` pointer of the new node to point to the current \`head\`.
     3. Update the \`head\` of the list to be the new node.
   - **At the Tail (O(N) without tail pointer, O(1) with tail pointer):**
     1. Create a new node.
     2. If the list is empty, make the new node the \`head\`.
     3. Otherwise, traverse to the last node (where \`current.next\` is \`null\`).
     4. Set the \`next\` pointer of the current last node to the new node.
     5. (If maintaining a tail pointer, update it to the new node).
   - **At a Specific Position (O(N) on average):**
     1. Traverse the list to find the node *before* the desired insertion position.
     2. Create a new node.
     3. Set the new node's \`next\` pointer to the node currently at the target position.
     4. Set the previous node's \`next\` pointer to the new node.

**3. Deletion:**
   - **At the Head (O(1))**:
     1. If the list is not empty, store the current \`head\`'s \`next\` node.
     2. Update the \`head\` to be this stored \`next\` node.
     3. (Optionally, free the memory of the old head).
   - **By Value/Position (O(N) on average):**
     1. Traverse the list to find the node to be deleted and also keep track of its \`previous\` node.
     2. If the node is found:
        - If it's the head, handle as "Delete at Head".
        - Otherwise, set \`previous.next = current.next\` (bypassing the \`current\` node).
     3. (Optionally, free the memory of the deleted node).

**4. Search (O(N) on average/worst):**
   - Start from the \`head\`.
   - Traverse the list, comparing each node's data with the target value.
   - If found, return the node or its index. If not found after traversing the whole list, indicate failure.

### Characteristics:
-   **Dynamic Size**: Can easily grow or shrink.
-   **Sequential Access**: Elements are accessed sequentially starting from the head. Random access to an element at a specific index takes O(N) time.
-   **No Wasted Memory from Pre-allocation**: Memory is allocated per node, unlike arrays which might have unused allocated space.

### Advantages:
-   Dynamic size.
-   Efficient insertions and deletions at the beginning of the list (O(1) for head operations).
-   Can be more memory-efficient than arrays if the list size changes frequently and significantly, as it doesn't require contiguous memory.

### Disadvantages:
-   Slow random access (O(N)) to elements.
-   Requires extra memory for storing the \`next\` pointers (overhead per node).
-   Reverse traversal is not straightforward or efficient (requires O(N) or modification of the list).

### Common Use Cases:
-   Implementing other data structures like stacks and queues.
-   Situations where insertions/deletions at the beginning are frequent.
-   When the size of the list is unknown beforehand or changes dynamically.
-   Polynomial representation.`,
  timeComplexities: {
    best: "Access/Search: O(N) (O(1) if head), Insertion: O(1) (head) / O(N) (tail/middle), Deletion: O(1) (head) / O(N) (tail/middle)",
    average: "Access/Search: O(N), Insertion: O(N), Deletion: O(N)",
    worst: "Access/Search: O(N), Insertion: O(N), Deletion: O(N)",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
    
