
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'longest-increasing-subsequence',
  title: 'Longest Increasing Subsequence (LIS)',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: "Finds the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order.",
  longDescription: "The Longest Increasing Subsequence (LIS) problem is to find the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order. For example, the LIS for {10, 22, 9, 33, 21, 50, 41, 60, 80} is {10, 22, 33, 41, 60, 80}, and its length is 6.\n\nThere are multiple approaches to solve this problem:\n1.  **Dynamic Programming (O(N^2))**: Let `dp[i]` be the length of the LIS ending at index `i` such that `arr[i]` is the last element of the LIS. Then, `dp[i] = 1 + max(dp[j])` where `0 <= j < i` and `arr[j] < arr[i]`. If no such `j` exists, `dp[i] = 1`. The overall LIS length is the maximum value in the `dp` array.\n2.  **Patience Sorting / Binary Search (O(N log N))**: This more efficient approach maintains an array (say, `tails`) where `tails[i]` stores the smallest tail of all increasing subsequences of length `i+1`. When processing a new number `x` from the input array, if `x` is greater than all tails, append it to `tails`, effectively extending the LIS. Otherwise, find the smallest tail in `tails` that is greater than or equal to `x` and replace it with `x`. This ensures that we keep track of the smallest possible tail for subsequences of a certain length, allowing for potentially longer subsequences later. The length of `tails` at the end is the length of the LIS.\n\nUse Cases: Analyzing sequences in bioinformatics, stock market trend analysis, and various other optimization problems.",
  timeComplexities: {
    best: "O(N log N) (using patience sorting/binary search)",
    average: "O(N log N) or O(N^2) (depending on method)",
    worst: "O(N^2) (simple DP) or O(N log N) (optimized DP/patience sorting)"
  },
  spaceComplexity: "O(N) for DP array or tails array.",
};
