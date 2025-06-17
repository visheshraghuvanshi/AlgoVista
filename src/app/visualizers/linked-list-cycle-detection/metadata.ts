
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'linked-list-cycle-detection',
  title: 'Linked List Cycle Detection',
  category: 'Linked List',
  difficulty: 'Medium',
  description: "Detects cycles in a linked list using Floyd's Tortoise and Hare algorithm.",
  longDescription: "Floyd's Tortoise and Hare algorithm is a pointer algorithm that uses two pointers which move through the sequence at different speeds. A \"tortoise\" pointer moves one step at a time, and a \"hare\" pointer moves two steps at a time. If there is a cycle in the list, the hare will eventually enter the cycle and catch up to the tortoise from behind. If there is no cycle, the hare will reach the end of the list.\n\nAlgorithm Steps:\n1. Initialize two pointers, `slow` (tortoise) and `fast` (hare), both to the head of the list.\n2. Move `slow` one step at a time (`slow = slow.next`).\n3. Move `fast` two steps at a time (`fast = fast.next.next`).\n4. If `fast` reaches the end of the list (null) or `fast.next` is null, there is no cycle.\n5. If `slow` and `fast` meet at any point, a cycle is detected.\n\nThis algorithm is efficient as it uses O(1) extra space and O(N) time complexity.",
  timeComplexities: {
    best: "O(N)", // N is the number of nodes
    average: "O(N)",
    worst: "O(N)",
  },
  spaceComplexity: "O(1)",
};
