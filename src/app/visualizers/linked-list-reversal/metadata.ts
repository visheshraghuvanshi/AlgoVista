
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'linked-list-reversal',
  title: 'Linked List Reversal',
  category: 'Linked List',
  difficulty: 'Easy',
  description: "Reverses a linked list, typically using iterative or recursive methods. Interactive visualization available.",
  longDescription: "Reversing a linked list involves changing the direction of its pointers so that the last node becomes the new head and the first node becomes the new tail. This can be achieved iteratively by maintaining three pointers (previous, current, next) or recursively. In the iterative approach, you traverse the list, and for each node, you store its next node, make its `next` pointer point to `previous`, and then move `previous` and `current` one step forward. The recursive approach involves reversing the rest of the list and then linking the current head to the end of the reversed rest. It's a common interview question and a good exercise for understanding pointer manipulation.",
  timeComplexities: { 
    best: "O(N)", 
    average: "O(N)", 
    worst: "O(N)" 
  }, // N is the number of nodes
  spaceComplexity: "Iterative: O(1), Recursive: O(N) for recursion stack.",
};
