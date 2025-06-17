
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'singly-linked-list',
  title: 'Singly Linked List Operations',
  category: 'Linked List',
  difficulty: 'Easy',
  description: 'Performs basic operations like insertion, deletion, search, and traversal on a singly linked list. Interactive visualization available.',
  longDescription: 'A Singly Linked List is a linear data structure where elements are stored in nodes. Each node contains two fields: data and a pointer (or link) to the next node in the sequence. The list is accessed starting from the first node, called the head. The last node points to null, indicating the end of the list.\n\nKey Operations:\n- **Insertion**: Can occur at the head (O(1)), at the tail (O(N) without a tail pointer, O(1) with a tail pointer), or at a specific position (O(N) on average).\n- **Deletion**: Can occur at the head (O(1)), at the tail (O(N) to find the new tail), or by value/position (O(N) on average to find the node).\n- **Search**: Requires traversing the list from the head (O(N) on average and worst case).\n- **Traversal**: Visiting each node in the list, usually starting from the head (O(N)).\n\nAdvantages: Dynamic size, efficient insertions/deletions at the beginning.\nDisadvantages: Slow random access (O(N)), extra memory for pointers, reverse traversal is not straightforward.',
  timeComplexities: {
    best: "Access/Search: O(N) (O(1) if head), Insertion: O(1) (head) / O(N) (tail/middle), Deletion: O(1) (head) / O(N) (tail/middle)",
    average: "Access/Search: O(N), Insertion: O(N), Deletion: O(N)",
    worst: "Access/Search: O(N), Insertion: O(N), Deletion: O(N)",
  },
  spaceComplexity: "O(N) for storing N elements.",
};
