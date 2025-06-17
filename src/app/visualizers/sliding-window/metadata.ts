
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'sliding-window',
  title: 'Sliding Window Technique',
  category: 'Arrays & Search',
  difficulty: 'Medium',
  description: 'A computational technique that uses a "window" of a fixed or variable size that slides over a data structure, typically an array or string, to solve problems efficiently.',
  longDescription: 'The Sliding Window technique is an algorithmic paradigm that is used to solve problems involving a contiguous subarray or substring of a given size, or problems that require finding a subarray/substring that satisfies certain conditions. It typically involves maintaining a "window" (a range of elements) and sliding this window across the data structure one element at a time. The window can be of fixed size or variable size.\\n\\nKey Ideas:\\n- Maintain two pointers, `start` and `end`, defining the current window.\\n- Expand the window by moving `end`.\\n- Shrink the window from `start` when a condition is met (e.g., window sum exceeds target, or window size constraint is violated).\\n- Update results based on the current window\'s properties.\\n\\nCommon Problems Solved with Sliding Window:\\n- Finding the maximum sum subarray of a fixed size `k`.\\n- Finding the smallest subarray with a sum greater than or equal to a given value.\\n- Finding the longest substring with `k` distinct characters.\\n- Counting occurrences of anagrams of a pattern in a text.\\n\\nThis technique often helps reduce the time complexity from O(N^2) or O(N^3) to O(N).',
  timeComplexities: {
    best: "Varies (e.g., O(n) for fixed-size window, O(n) for many variable-size window problems)",
    average: "Varies (typically O(n))",
    worst: "Varies (typically O(n), but can be O(n*k) or O(n^2) if inner operations are costly)"
  },
  spaceComplexity: "Typically O(1) or O(k) where k is alphabet size or window size if storing window elements.",
};
