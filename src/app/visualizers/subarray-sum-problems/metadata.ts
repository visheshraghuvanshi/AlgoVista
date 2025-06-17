
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'subarray-sum-problems',
  title: 'Subarray Sum Problems',
  category: 'Arrays & Search',
  difficulty: 'Medium',
  description: 'Covers various problems related to finding subarrays with specific sum properties, like a given sum or maximum sum (e.g., Kadane\'s).',
  longDescription: 'Subarray Sum Problems encompass a variety of challenges in array manipulation, often requiring techniques like sliding window, prefix sums, or dynamic programming (like Kadane\'s algorithm for maximum subarray sum). Common tasks include finding if a subarray with a given sum exists, counting such subarrays, or finding the subarray with the maximum possible sum. The choice of algorithm depends on constraints such as whether array elements are positive, negative, or mixed, and whether the subarray must be contiguous.\\n\\nKey Techniques:\\n- **Sliding Window**: Efficient for problems involving contiguous subarrays with positive numbers where the window size can expand or shrink based on the current sum.\\n- **Prefix Sums & Hash Maps**: Useful for problems with both positive and negative numbers, or when looking for subarrays that sum to a specific target `k`. By storing prefix sums `P[i]` (sum from index 0 to `i`), a subarray sum `arr[j..i]` can be found as `P[i] - P[j-1]`. A hash map can store prefix sums encountered and their indices to quickly find if `P[i] - k` has occurred before.\\n- **Kadane\'s Algorithm**: A specific dynamic programming approach for finding the maximum sum of a contiguous subarray. (Note: Kadane\'s Algorithm has its own dedicated visualizer page.)\\n\\nThese problems are common in coding interviews and competitive programming.',
  timeComplexities: {
    best: "Varies (e.g., O(N) for Kadane's or sliding window)",
    average: "Varies (e.g., O(N) for HashMap approach)",
    worst: "Varies (e.g., O(N^2) for brute-force, O(N) for optimized methods)",
  },
  spaceComplexity: "Varies (e.g., O(1) for Kadane's, O(N) for prefix sum/HashMap)",
};
