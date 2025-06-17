
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'kadanes-algorithm',
  title: "Kadane's Algorithm",
  category: 'Arrays & Search',
  difficulty: 'Medium',
  description: 'Efficiently finds the maximum sum of a contiguous subarray within a one-dimensional array of numbers. Interactive visualization available.',
  longDescription: "Kadane's Algorithm is a dynamic programming approach to find the maximum sum of a contiguous subarray within a given one-dimensional array of numbers. It works by iterating through the array, keeping track of the maximum sum ending at the current position (current_max) and the overall maximum sum found so far (max_so_far).\\n\\nAlgorithm Steps:\\n1. Initialize `max_so_far = -Infinity` (or the first element of the array if handling all non-negative or mixed arrays differently) and `current_max = 0`.\\n2. Iterate through the array from left to right:\\n   a. Add the current element to `current_max`.\\n   b. If `current_max` is greater than `max_so_far`, update `max_so_far = current_max`.\\n   c. If `current_max` becomes negative, reset `current_max = 0` (as a negative sum subarray will not contribute to a larger maximum sum).\\n3. After iterating through the entire array, `max_so_far` will hold the maximum contiguous subarray sum. If all numbers are negative, `max_so_far` will hold the value of the largest (least negative) number in the array (or 0 if the problem statement defines the max sum of an empty subarray as 0).\\n\\nThis algorithm is known for its simplicity and O(N) time complexity.",
  timeComplexities: {
    best: "O(N)",
    average: "O(N)",
    worst: "O(N)",
  },
  spaceComplexity: "O(1)",
};

