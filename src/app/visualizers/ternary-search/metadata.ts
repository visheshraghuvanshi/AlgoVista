
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'ternary-search',
  title: 'Ternary Search',
  category: 'Arrays & Search',
  difficulty: 'Easy',
  description: 'A divide and conquer search algorithm that finds an item in a sorted array by dividing it into three parts.',
  longDescription: 'Ternary Search is a decrease and conquer search algorithm that finds the position of a target value within a sorted array. It determines which third of the array the target might lie in and then continues searching in that third. Similar to binary search, but it divides the array into three parts instead of two.\\n\\nAlgorithm Steps (for a sorted array):\n1. Initialize `left = 0` and `right = n-1`.\n2. While `left <= right`:\n   a. Calculate `mid1 = left + (right - left) / 3`.\n   b. Calculate `mid2 = right - (right - left) / 3`.\n   c. If `arr[mid1] == target`, return `mid1`.\n   d. If `arr[mid2] == target`, return `mid2`.\n   e. If `target < arr[mid1]`, then `right = mid1 - 1` (search in the first third).\n   f. Else if `target > arr[mid2]`, then `left = mid2 + 1` (search in the third third).\n   g. Else (target is between `arr[mid1]` and `arr[mid2]`), then `left = mid1 + 1` and `right = mid2 - 1` (search in the middle third).\n3. If the target is not found, return -1.\n\nTernary search is generally slower than binary search as it makes more comparisons per iteration and reduces the search space by a smaller factor. It\'s more often applied to finding the extremum (minimum or maximum) of a unimodal function rather than searching in sorted arrays.',
  timeComplexities: {
    best: "O(1)",
    average: "O(log₃n)",
    worst: "O(log₃n)",
  },
  spaceComplexity: "O(1) (Iterative), O(log₃n) (Recursive due to stack space)",
};
