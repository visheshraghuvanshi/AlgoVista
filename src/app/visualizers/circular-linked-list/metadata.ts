
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'circular-linked-list',
  title: 'Circular Linked List Ops',
  category: 'Linked List',
  difficulty: 'Easy',
  description: 'Operations on circular linked lists where the last node points back to the first, forming a circle. Interactive visualization available.',
  longDescription: 'A Circular Linked List is a variation of a linked list in which the last node points back to the first node (head), forming a circle. There is no NULL at the end of the list. This structure can be singly or doubly circular.\\n\\nKey Properties:\\n- The list forms a cycle: traversing from any node will eventually lead back to that node.\\n- The concept of a "tail" pointing to null is absent. Instead, a pointer to the head (or any node) allows access to the entire list.\\n- Useful for applications where the list needs to be treated as a continuous loop, like round-robin scheduling or certain types of buffers.\\n\\nKey Operations (Singly Circular):\\n- **Insertion at Head**: Create a new node. Find the last node (which points to the current head). Make the new node point to the current head. Make the last node point to the new head. Update the head to be the new node.\\n- **Insertion at Tail**: Create a new node. Find the last node. Make the new node point to the head. Make the last node point to the new node. (If maintaining a tail pointer, this can be O(1)).\\n- **Deletion**: Similar to singly linked lists, but care must be taken to update the pointer of the node that was previously pointing to the head if the head is deleted, or the pointer of the last node if it points to the deleted node.\\n- **Traversal**: Start from the head (or any node) and traverse until you reach the starting node again.\\n\\nAdvantages: Any node can be a starting point. Useful for continuous looping applications.\\nDisadvantages: Can lead to infinite loops if not handled carefully during traversal or modification.',
  timeComplexities: {
    best: "Access (head): O(1), Insert/Delete (head): O(1) (if last node ref maintained) or O(N), Traverse: O(N)",
    average: "Access/Search: O(N), Insert/Delete: O(N)",
    worst: "Access/Search: O(N), Insert/Delete: O(N)",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
