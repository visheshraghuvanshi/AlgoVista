
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'longest-common-subsequence',
  title: 'Longest Common Subsequence (LCS)',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Finds the longest subsequence common to two sequences. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.',
  longDescription: 'The Longest Common Subsequence (LCS) problem is to find the longest subsequence present in given two sequences. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous. For example, "abc", "abg", "bdf", "aeg", "acefg", .. etc are subsequences of "abcdefg". The LCS problem is a classic computer science problem, the basis of data comparison programs such as the diff utility, and has applications in computational linguistics and bioinformatics.\\n\\nAlgorithm Steps (Dynamic Programming):\\n1. Create a DP table `dp[m+1][n+1]`, where `m` is length of string1 and `n` is length of string2.\\n2. `dp[i][j]` will store the length of the LCS of `string1[0...i-1]` and `string2[0...j-1]`\\n3. Base Cases: `dp[i][0] = 0` for all `i`, and `dp[0][j] = 0` for all `j` (LCS of any string with an empty string is 0).\\n4. Fill the table: For each `dp[i][j]`:\\n   - If `string1[i-1] == string2[j-1]`, then `dp[i][j] = 1 + dp[i-1][j-1]`\\n   - Else, `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`\\n5. The value `dp[m][n]` is the length of the LCS.\\n\\nTo reconstruct the actual LCS, one can backtrack from `dp[m][n]` by following the choices made at each step.',
  timeComplexities: {
    best: "O(m*n)",
    average: "O(m*n)",
    worst: "O(m*n)",
  },
  spaceComplexity: "O(m*n) for DP table, can be optimized to O(min(m,n)) if only length is needed.",
};
