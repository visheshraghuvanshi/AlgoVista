
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'doubly-linked-list',
  title: 'Doubly Linked List Operations',
  category: 'Linked List',
  difficulty: 'Easy',
  description: 'Performs operations like insertion, deletion on a list where nodes have pointers to both next and previous nodes. Interactive visualization available.',
  longDescription: 'A Doubly Linked List (DLL) is a type of linked list where each node, in addition to storing data and a pointer to the next node, also stores a pointer to the previous node in the sequence. This bidirectional linkage allows for more flexible traversal and manipulation compared to a singly linked list.\n\nKey Properties:\n- Each node has three fields: data, a pointer to the next node (next), and a pointer to the previous node (prev).\n- The list has a head pointer (to the first node) and often a tail pointer (to the last node) for O(1) insertions/deletions at both ends.\n- The `prev` pointer of the head node is typically null, and the `next` pointer of the tail node is also null.\n\nKey Operations:\n- **Insertion**: Can occur at the head (O(1)), at the tail (O(1) if tail pointer maintained), or at a specific position (O(N) on average to find position).\n- **Deletion**: Can occur at the head (O(1)), at the tail (O(1) if tail pointer maintained), or by value/position (O(N) on average). Deletion is simpler than in SLL once the node is found because its predecessor is directly accessible.\n- **Search**: Requires traversing the list (O(N) on average and worst case).\n- **Traversal**: Can be done both forwards (using `next` pointers) and backwards (using `prev` pointers).\n\nAdvantages: Bidirectional traversal, easier deletion of a node once found (no need to find its predecessor by traversing from head).\nDisadvantages: Requires more memory per node (for the extra `prev` pointer), more complex pointer manipulations during insertion/deletion.',
  timeComplexities: {
    best: "Access (head/tail): O(1), Insert/Delete (head/tail): O(1), Search: O(N)",
    average: "Access/Search: O(N), Insert/Delete (middle): O(N)",
    worst: "Access/Search: O(N), Insert/Delete (middle): O(N)",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
