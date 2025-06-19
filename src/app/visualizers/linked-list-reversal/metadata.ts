
// src/app/visualizers/linked-list-reversal/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'linked-list-reversal',
  title: 'Linked List Reversal',
  category: 'Linked List',
  difficulty: 'Easy',
  description: "Reverses a linked list, typically using iterative or recursive methods. Interactive visualization available.",
  longDescription: `Reversing a linked list is a common and fundamental operation. It involves changing the direction of the \`next\` pointers of the nodes in the list so that the original tail becomes the new head, and the original head becomes the new tail (pointing to \`null\`). This can be achieved using iterative or recursive approaches. This visualizer demonstrates both for a singly linked list.

### How it Works:

**1. Iterative Reversal:**
   - This method typically uses three pointers: \`previous\`, \`current\`, and \`nextNode\`.
   - **Initialization**:
     - \`previous\` is initialized to \`null\` (this will become the new tail's \`next\`).
     - \`current\` is initialized to the \`head\` of the list.
     - \`nextNode\` is used to temporarily store the \`next\` node before its link is reversed.
   - **Traversal and Reversal**:
     1. While \`current\` is not \`null\`:
        a. Store \`current.next\` in \`nextNode\`.
        b. Reverse the link: \`current.next = previous\`.
        c. Move pointers one step forward: \`previous = current\`, then \`current = nextNode\`.
   - **Update Head**: After the loop, \`previous\` will be pointing to the new head of the reversed list. Update the list's \`head\` pointer to \`previous\`.
   - **Time Complexity**: O(N) because each node is visited once.
   - **Space Complexity**: O(1) because only a few extra pointers are used.

**2. Recursive Reversal:**
   - This method relies on the call stack to manage the reversal process.
   - **Base Case**:
     - If the \`head\` is \`null\` or \`head.next\` is \`null\` (list is empty or has only one node), the list is already "reversed" in a sense, so return the \`head\`.
   - **Recursive Step**:
     1. Recursively call the reverse function for the rest of the list: \`rest = reverseRecursive(head.next)\`. This call will eventually return the new head of the reversed sublist.
     2. After the recursive call returns, \`head.next\` (the node that was originally after \`head\`) is now the tail of the reversed \`rest\` of the list. Make its \`next\` pointer point back to \`head\`: \`head.next.next = head\`.
     3. Set the original \`head\`'s \`next\` pointer to \`null\`, as it will become the new tail of the fully reversed list (or an intermediate tail during recursion).
     4. Return \`rest\` (the new head of the fully reversed list).
   - **Time Complexity**: O(N) because each node is visited once.
   - **Space Complexity**: O(N) due to the recursion call stack, which can go as deep as the number of nodes in the list in the worst case (a skewed list).

### Advantages & Disadvantages:
-   **Iterative**: Generally more space-efficient (O(1) space) and often preferred in production environments due to no risk of stack overflow for very long lists. Can be slightly less intuitive to grasp initially.
-   **Recursive**: Can be more concise and elegant to write if the recursive structure is clear. However, it uses O(N) stack space, which can be an issue for very long lists.

### Common Use Cases:
-   Fundamental list manipulation task.
-   Component in other algorithms (e.g., checking for palindromic linked lists).
-   Common interview question to test understanding of pointers and recursion/iteration.`,
  timeComplexities: { 
    best: "O(N)", 
    average: "O(N)", 
    worst: "O(N)" 
  }, // N is the number of nodes
  spaceComplexity: "Iterative: O(1), Recursive: O(N) for recursion stack.",
};
    
