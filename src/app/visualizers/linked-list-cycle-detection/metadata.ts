
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'linked-list-cycle-detection',
  title: 'Linked List Cycle Detection',
  category: 'Linked List',
  difficulty: 'Medium',
  description: "Detects cycles in a linked list using Floyd's Tortoise and Hare algorithm.",
  longDescription: `A cycle in a linked list occurs when a node's \`next\` pointer points back to a previous node in the list, creating a loop. Detecting such cycles is a common problem. **Floyd's Tortoise and Hare algorithm** is an efficient method to solve this.

### How it Works:
The algorithm uses two pointers that traverse the list at different speeds:
1.  **Slow Pointer (Tortoise)**: Moves one step at a time (\`slow = slow.next\`).
2.  **Fast Pointer (Hare)**: Moves two steps at a time (\`fast = fast.next.next\`).

**Algorithm Steps:**
1.  **Initialization**:
    *   Initialize both \`slow\` and \`fast\` pointers to the \`head\` of the linked list.
2.  **Traversal and Detection**:
    *   Move \`slow\` by one node and \`fast\` by two nodes in each iteration.
    *   **If there is a cycle**: The \`fast\` pointer will eventually enter the cycle. Since it's moving faster, it will catch up to the \`slow\` pointer from behind, and they will meet at some node within the cycle.
    *   **If there is no cycle**: The \`fast\` pointer (or \`fast.next\`) will reach the end of the list (\`null\`) before any meeting occurs.
3.  **Termination Conditions**:
    *   The loop continues as long as \`fast\` is not \`null\` AND \`fast.next\` is not \`null\`. If either of these conditions becomes false, it means the end of the list has been reached without detecting a cycle.
    *   If \`slow == fast\` at any point during the traversal (after their initial placement at the head and subsequent moves), a cycle is detected.

### Time and Space Complexity:
-   **Time Complexity**: O(N), where N is the number of nodes in the list.
-   **Space Complexity**: O(1), as it only uses a constant amount of extra space for the two pointers.

The AlgoVista visualizer demonstrates the movement of the slow and fast pointers and highlights when they meet if a cycle exists.`,
  timeComplexities: {
    best: "O(N)",
    average: "O(N)",
    worst: "O(N)",
  },
  spaceComplexity: "O(1)",
};
