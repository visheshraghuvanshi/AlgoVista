
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'merge-sorted-linked-lists',
  title: 'Merge Sorted Linked Lists',
  category: 'Linked List',
  difficulty: 'Medium',
  description: 'Merges two sorted linked lists into a single sorted linked list. Now with interactive visualization!',
  longDescription: 'Merging two sorted linked lists involves creating a new sorted list that contains all the elements from both input lists. This can be done iteratively or recursively. The core idea is to compare the heads of both lists, pick the smaller one to be the next node in the merged list, and advance the pointer of the list from which the node was taken. This process is repeated until one of the lists is exhausted, at which point the remaining portion of the other list is appended to the merged list.\\n\\nIterative Approach:\\n1. Create a dummy head node for the merged list to simplify edge cases.\\n2. Maintain a `tail` pointer for the merged list, initially pointing to the dummy head.\\n3. While both input lists (`l1`, `l2`) have nodes:\\n   a. If `l1.data < l2.data`, append `l1` to `tail.next`, and advance `l1`.\n   b. Else, append `l2` to `tail.next`, and advance `l2`.\n   c. Advance `tail` to the newly added node.\\n4. Once one list is empty, append the rest of the other list to `tail.next`.\\n5. Return `dummyHead.next`.\\n\\nRecursive Approach:\\n1. Base cases: If either list is null, return the other list.\\n2. If `l1.data < l2.data`, the result is `l1` followed by the merge of `l1.next` and `l2`. So, set `l1.next = merge(l1.next, l2)` and return `l1`.\\n3. Else, the result is `l2` followed by the merge of `l1` and `l2.next`. So, set `l2.next = merge(l1, l2.next)` and return `l2`.',
  timeComplexities: {
    best: "O(N+M)", // N and M are lengths of the two lists
    average: "O(N+M)",
    worst: "O(N+M)",
  },
  spaceComplexity: "Iterative: O(1), Recursive: O(N+M) for recursion stack in worst case.",
};
