
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'edit-distance',
  title: 'Edit Distance (Levenshtein)',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Calculates the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one word into another.',
  longDescription: 'The Levenshtein distance (a common type of Edit Distance) is a string metric for measuring the difference between two sequences. Informally, the Levenshtein distance between two words is the minimum number of single-character edits (insertions, deletions or substitutions) required to change one word into the other.\\n\\nAlgorithm Steps (Dynamic Programming):\\n1. Create a DP table `dp[m+1][n+1]`, where `m` is length of string1 and `n` is length of string2.\\n2. `dp[i][j]` will store the edit distance between the first `i` characters of string1 and the first `j` characters of string2.\\n3. Base Cases:\\n   - `dp[i][0] = i`: Cost of deleting `i` characters from string1 to get an empty string.\\n   - `dp[0][j] = j`: Cost of inserting `j` characters into an empty string1 to get string2.\\n4. Fill the table: For each `dp[i][j]`:\\n   - If `string1[i-1] == string2[j-1]`, then `dp[i][j] = dp[i-1][j-1]` (no cost for matching characters).\\n   - Else, `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])` (cost of delete, insert, or replace respectively).\\n5. The value `dp[m][n]` is the edit distance.\\n\\nUse Cases: Spell checking, DNA sequencing, plagiarism detection, information retrieval.',
  timeComplexities: {
    best: "O(m*n)",
    average: "O(m*n)",
    worst: "O(m*n)",
  },
  spaceComplexity: "O(m*n), can be optimized to O(min(m,n))",
};
