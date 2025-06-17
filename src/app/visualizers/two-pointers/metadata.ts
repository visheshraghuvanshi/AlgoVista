
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'two-pointers',
  title: 'Two Pointers Technique',
  category: 'Arrays & Search',
  difficulty: 'Medium',
  description: 'An algorithmic technique that uses two pointers to iterate through a data structure, often an array or string, typically from opposite ends or in a synchronized manner.',
  longDescription: 'The Two Pointers technique is a common strategy for solving array and string problems. It involves using two integer pointers that typically traverse the data structure. The pointers can start from the ends of an array moving towards each other, or one pointer can move faster than the other, or they can both start at the beginning and move based on certain conditions.\\n\\nCommon Use Cases:\\n- **Finding Pairs in a Sorted Array**: Pointers start at both ends. If sum is too small, increment left pointer. If too large, decrement right pointer.\\n- **Reversing an Array/String**: Pointers start at ends and swap elements, moving towards the center.\\n- **Detecting Palindromes**: Pointers start at ends and compare characters, moving towards the center.\\n- **Removing Duplicates from a Sorted Array (in-place)**: One pointer (`i`) keeps track of the position for the next unique element, and another pointer (`j`) iterates through the array. If `arr[j]` is different from `arr[i-1]`, it\'s a new unique element.\\n- **Container With Most Water**: Two pointers at the ends of an array representing heights. Calculate area and move the pointer pointing to the shorter line inwards.\\n\\nThis technique often leads to O(N) time complexity solutions with O(1) space complexity for problems that might otherwise seem to require O(N^2) time.',
  timeComplexities: {
    best: "Varies (e.g., O(N) for pair sum in sorted array, O(1) if target is immediately found)",
    average: "Varies (e.g., O(N))",
    worst: "Varies (e.g., O(N))",
  },
  spaceComplexity: "Typically O(1) (in-place modification or constant extra space).",
};
