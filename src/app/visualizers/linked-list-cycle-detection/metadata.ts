
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'linked-list-cycle-detection',
  title: 'Linked List Cycle Detection',
  category: 'Linked List',
  difficulty: 'Medium',
  description: "Detects cycles in a linked list using Floyd's Tortoise and Hare algorithm.",
  longDescription: `A cycle in a linked list occurs when a node's \`next\` pointer points back to a previous node in the list, creating a loop. Detecting such cycles is a common problem. **Floyd's Tortoise and Hare algorithm** is an efficient method to solve this.

### How Floyd's Tortoise and Hare Algorithm Works:
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

**Checking for Empty or Single-Node List**:
-   If the list is empty (\\\`head\\\` is \\\`null\\\`) or has only one node (\\\`head.next\\\` is \\\`null\\\`), it cannot have a cycle. These are base cases that should be handled, typically by returning \\\`false\\\` (no cycle).

### Why it Works:
-   If there's no cycle, the fast pointer reaches the end first.
-   If there's a cycle, imagine the fast pointer is some distance \`k\` behind the slow pointer within the cycle of length \`L\`. In each step, the fast pointer gains one position on the slow pointer (fast moves 2, slow moves 1). So, the fast pointer will catch the slow pointer in \`L-k\` (or \`k\` depending on how you measure) steps within the cycle.

### Characteristics:
-   **Efficient**: Uses only two pointers.
-   **No Extra Data Structure**: Operates in-place.

### Time and Space Complexity:
-   **Time Complexity**: O(N), where N is the number of nodes in the list.
    *   If there's no cycle, the fast pointer traverses the list.
    *   If there is a cycle, let the cycle start after \`k\` nodes and have length \`L\`. The pointers will meet within at most \`L\` steps after the slow pointer enters the cycle. The slow pointer takes \`k\` steps to enter the cycle. So, total steps are in the order of N.
-   **Space Complexity**: O(1), as it only uses a constant amount of extra space for the two pointers.

### Common Use Cases:
-   Detecting infinite loops in data structures.
-   Finding the starting point of a cycle in a linked list (a variation of this algorithm).
-   Problems involving sequences where a repeating pattern or loop needs to be identified.

The AlgoVista visualizer demonstrates the movement of the slow and fast pointers and highlights when they meet if a cycle exists.`,
  timeComplexities: {
    best: "O(N)", // N is the number of nodes
    average: "O(N)",
    worst: "O(N)",
  },
  spaceComplexity: "O(1)",
};
