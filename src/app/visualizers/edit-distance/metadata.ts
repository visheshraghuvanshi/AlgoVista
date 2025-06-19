
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'edit-distance',
  title: 'Edit Distance (Levenshtein)',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Calculates the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one word into another.',
  longDescription: `The Levenshtein distance, a common type of Edit Distance, is a string metric for measuring the similarity between two sequences. Informally, the Levenshtein distance between two words is the minimum number of single-character edits required to change one word into the other. These edits can be:
1.  **Insertion**: Adding a character.
2.  **Deletion**: Removing a character.
3.  **Substitution**: Replacing one character with another.

Each of these operations typically has a cost of 1.

### How it Works (Dynamic Programming):
The problem is solved using a 2D dynamic programming table, \`dp[m+1][n+1]\`, where \`m\` is the length of the first string (\`str1\`) and \`n\` is the length of the second string (\`str2\`).
The cell \`dp[i][j]\` stores the edit distance between the first \`i\` characters of \`str1\` (i.e., \`str1[0...i-1]\`) and the first \`j\` characters of \`str2\` (i.e., \`str2[0...j-1]\`).

**1. Initialization (Base Cases):**
   -   \`dp[0][0] = 0\` (Distance between two empty strings is 0).
   -   \`dp[i][0] = i\` for \`i\` from 1 to \`m\`. This is the cost of deleting \`i\` characters from \`str1\` to transform it into an empty string.
   -   \`dp[0][j] = j\` for \`j\` from 1 to \`n\`. This is the cost of inserting \`j\` characters into an empty string to form the prefix of \`str2\`.

**2. Recurrence Relation (Fill DP Table):**
   Iterate \`i\` from 1 to \`m\` and \`j\` from 1 to \`n\`:
   -   **If \`str1[i-1] == str2[j-1]\`** (current characters match):
       No operation is needed for these characters. The cost is the same as the edit distance of the preceding substrings.
       \`dp[i][j] = dp[i-1][j-1]\`
   -   **If \`str1[i-1] != str2[j-1]\`** (current characters do not match):
       We need to perform one operation (insert, delete, or substitute). We choose the operation that results in the minimum cost:
       *   **Insert**: Insert \`str2[j-1]\` into \`str1\`. Cost = \`1 + dp[i][j-1]\` (cost to transform \`str1[0...i-1]\` to \`str2[0...j-2]\`, plus 1 for insertion).
       *   **Delete**: Delete \`str1[i-1]\` from \`str1\`. Cost = \`1 + dp[i-1][j]\` (cost to transform \`str1[0...i-2]\` to \`str2[0...j-1]\`, plus 1 for deletion).
       *   **Substitute**: Replace \`str1[i-1]\` with \`str2[j-1]\`. Cost = \`1 + dp[i-1][j-1]\` (cost to transform \`str1[0...i-2]\` to \`str2[0...j-2]\`, plus 1 for substitution).
       So, \`dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\`

**3. Result:**
   The value at \`dp[m][n]\` contains the Levenshtein distance between \`str1\` and \`str2\`.

### Example: \`str1 = "kitten"\`, \`str2 = "sitting"\`
1.  \`dp[0][0]=0\`, first row \`[0,1,2,3,4,5,6,7]\`, first col \`[0,1,2,3,4,5,6]\`.
2.  \`dp[1][1]\` (k,s): \`s != k\`. \`1 + min(dp[0][1]=1, dp[1][0]=1, dp[0][0]=0) = 1+0=1\`. (Substitute k->s)
3.  ... and so on.
4.  Final \`dp[6][7]\` would be 3.
    (kitten -> sitten (s k by s) -> sittin (e by i) -> sitting (add g))

### Characteristics:
-   **Optimal Substructure**: The solution to the problem depends on solutions to smaller subproblems.
-   **Overlapping Subproblems**: Subproblems (calculating edit distance for prefixes) are reused multiple times.

### Advantages:
-   Provides a standard way to measure string similarity.
-   Guaranteed to find the minimum number of edits.

### Disadvantages:
-   **Space Complexity**: O(m\*n) for the DP table. Can be optimized to O(min(m,n)) if only the distance is needed, not the actual edit operations (by only keeping track of the previous row or column).

### Common Use Cases:
-   **Spell Checking**: Suggesting corrections for misspelled words.
-   **Bioinformatics**: Comparing DNA or protein sequences to find similarities and evolutionary distances.
-   **Plagiarism Detection**: Identifying similarities between documents.
-   **Information Retrieval**: Fuzzy string searching.
-   **File Synchronization and Diff Utilities**: Identifying changes between versions of a file.

The AlgoVista visualizer demonstrates the construction of the DP table step-by-step.`,
  timeComplexities: {
    best: "O(m*n)",
    average: "O(m*n)",
    worst: "O(m*n)",
  },
  spaceComplexity: "O(m*n), can be optimized to O(min(m,n))",
};
