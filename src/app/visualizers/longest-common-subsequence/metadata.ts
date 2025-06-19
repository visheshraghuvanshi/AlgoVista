
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'longest-common-subsequence',
  title: 'Longest Common Subsequence (LCS)',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Finds the longest subsequence common to two sequences. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.',
  longDescription: `The Longest Common Subsequence (LCS) problem is a classic computer science problem that aims to find the longest subsequence present in two given sequences (often strings). A subsequence is derived from another sequence by deleting some or no elements without changing the order of the remaining elements. For example, "ACE" is a subsequence of "ABCDE". The LCS is one of the longest such subsequences common to both input sequences.

### How it Works (Dynamic Programming):
The most common approach to solve the LCS problem is using dynamic programming.

1.  **Define Subproblem**: Let \`text1\` be string X of length \`m\`, and \`text2\` be string Y of length \`n\`.
    Let \`dp[i][j]\` be the length of the LCS of the prefix \`X[0...i-1]\` (first \`i\` characters of X) and \`Y[0...j-1]\` (first \`j\` characters of Y).

2.  **Initialization (Base Cases)**:
    *   Create a 2D table \`dp\` of size \`(m+1) x (n+1)\`.
    *   Initialize the first row and first column of \`dp\` to 0s.
        *   \`dp[i][0] = 0\` for all \`i\` (LCS of any prefix of X with an empty string is 0).
        *   \`dp[0][j] = 0\` for all \`j\` (LCS of an empty string with any prefix of Y is 0).

3.  **Recurrence Relation (Fill DP Table)**:
    Iterate \`i\` from 1 to \`m\` and \`j\` from 1 to \`n\`:
    *   **If \`X[i-1] == Y[j-1]\`** (characters match):
        The current characters are part of the LCS. So, the length of LCS is 1 plus the LCS of the preceding prefixes.
        \`dp[i][j] = 1 + dp[i-1][j-1]\`
    *   **If \`X[i-1] != Y[j-1]\`** (characters do not match):
        The LCS does not include both current characters simultaneously. It must be the LCS of either:
        1.  \`X[0...i-2]\` and \`Y[0...j-1]\` (i.e., \`dp[i-1][j]\`) OR
        2.  \`X[0...i-1]\` and \`Y[0...j-2]\` (i.e., \`dp[i][j-1]\`)
        So, we take the maximum of these two:
        \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\`

4.  **Result**: The length of the LCS of \`text1\` and \`text2\` is found in \`dp[m][n]\`.

### Reconstructing the LCS String:
To find the actual LCS string (not just its length), you can backtrack through the \`dp\` table starting from \`dp[m][n]\`:
1.  If \`text1[i-1] == text2[j-1]\`, this character is part of the LCS. Prepend it to the result string and move diagonally up-left to \`dp[i-1][j-1]\`.
2.  Else (if characters don't match), compare \`dp[i-1][j]\` and \`dp[i][j-1]\`:
    *   If \`dp[i-1][j] > dp[i][j-1]\`, move up to \`dp[i-1][j]\`.
    *   Else (if \`dp[i][j-1] >= dp[i-1][j]\`), move left to \`dp[i][j-1]\`.
3.  Repeat until \`i\` or \`j\` becomes 0.

### Example: \`text1 = "AGGTAB"\`, \`text2 = "GXTXAYB"\`
DP Table would be (m+1)x(n+1) = 7x8.
\`dp[m][n]\` will give the length. Backtracking will give "GTAB".

### Characteristics:
-   **Optimal Substructure**: The solution to the problem depends on solutions to subproblems.
-   **Overlapping Subproblems**: Subproblems are solved multiple times in a naive recursive approach, which DP avoids by storing results.

### Advantages:
-   Guaranteed to find the optimal solution (longest common subsequence).
-   Systematic approach.

### Disadvantages:
-   **Space Complexity**: O(m\*n) for the DP table. This can be optimized to O(min(m,n)) if only the length is required, by only keeping track of the previous row (or column). Reconstructing the path usually requires the full table or more complex techniques.

### Common Use Cases:
-   **Diff Utilities**: Comparing files (like Unix \`diff\`) to find differences. The lines not part of LCS are the differences.
-   **Bioinformatics**: Comparing DNA or protein sequences to find similarities.
-   **Version Control Systems**: Used in merging algorithms.
-   **Spell Checkers/Text Editing**: Suggesting corrections or measuring string similarity.

The AlgoVista visualizer demonstrates the DP table construction and optionally the backtracking for string reconstruction.`,
  timeComplexities: {
    best: "O(m*n)",
    average: "O(m*n)",
    worst: "O(m*n)",
  },
  spaceComplexity: "O(m*n) for DP table. Can be optimized to O(min(m,n)) if only length is needed.",
};
