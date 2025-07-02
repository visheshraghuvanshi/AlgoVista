
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'longest-increasing-subsequence',
  title: 'Longest Increasing Subsequence (LIS)',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Finds the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order.',
  longDescription: `The Longest Increasing Subsequence (LIS) problem is to find the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order. A subsequence is derived from an array by deleting some or no elements without changing the order of the remaining elements. For example, the LIS for \`{10, 22, 9, 33, 21, 50, 41, 60, 80}\` is \`{10, 22, 33, 50, 60, 80}\`, and its length is 6.

### Approaches:

**1. Dynamic Programming (O(N²)) - Visualized by AlgoVista**
   -   **Define Subproblem**: Let \`dp[i]\` be the length of the LIS ending at index \`i\` and including \`arr[i]\` as the last element.
   -   **Initialization**: Initialize \`dp[i] = 1\` for all \`i\`, because each element itself is an LIS of length 1.
   -   **Recurrence Relation**: For each element \`arr[i]\`, iterate through all previous elements \`arr[j]\` (where \`j < i\`):
       *   If \`arr[i] > arr[j]\`, it means \`arr[i]\` can extend the LIS ending at \`arr[j]\`.
       *   So, \`dp[i] = max(dp[i], 1 + dp[j])\`. We take the maximum because \`arr[i]\` could potentially extend multiple previous LISs, and we want the longest one.
   -   **Result**: The length of the overall LIS of the array is the maximum value in the \`dp\` array after iterating through all elements.
   -   **Example for \`[3, 10, 2, 1, 20]\`**:
       *   \`dp = [1, 1, 1, 1, 1]\`
       *   \`i=0 (val=3)\`: \`dp[0]=1\`. \`maxLen=1\`.
       *   \`i=1 (val=10)\`: \`j=0 (val=3)\`. \`10>3\`. \`dp[1] = max(1, 1+dp[0]=2) = 2\`. \`maxLen=2\`.
       *   \`i=2 (val=2)\`: \`j=0 (val=3)\`. \`2!>3\`. \`j=1 (val=10)\`. \`2!>10\`. \`dp[2]=1\`. \`maxLen=2\`.
       *   \`i=3 (val=1)\`: \`j=0..2\`. No \`arr[j] < 1\`. \`dp[3]=1\`. \`maxLen=2\`.
       *   \`i=4 (val=20)\`:
           *   \`j=0 (val=3)\`. \`20>3\`. \`dp[4]=max(1, 1+dp[0]=2)=2\`.
           *   \`j=1 (val=10)\`. \`20>10\`. \`dp[4]=max(2, 1+dp[1]=3)=3\`.
           *   \`j=2 (val=2)\`. \`20>2\`. \`dp[4]=max(3, 1+dp[2]=2)=3\`.
           *   \`j=3 (val=1)\`. \`20>1\`. \`dp[4]=max(3, 1+dp[3]=2)=3\`.
           *   \`maxLen=3\`.
       *   Result: 3. The LIS could be \`{3, 10, 20}\`.

**2. Optimized Dynamic Programming with Binary Search (Patience Sorting based - O(N log N))**
   -   This more efficient approach maintains an array, say \`tails\`, where \`tails[i]\` stores the smallest possible tail of all increasing subsequences of length \`i+1\`.
   -   Iterate through the input array. For each number \`x\`:
       *   If \`x\` is greater than all tails (i.e., \`x > tails[tails.length - 1]\`), append \`x\` to \`tails\`. This means \`x\` extends the longest LIS found so far.
       *   Otherwise, find the smallest tail in \`tails\` that is greater than or equal to \`x\` (using binary search, e.g., \`lower_bound\`). Replace that tail with \`x\`. This step is crucial: by replacing a larger tail with a smaller one (\`x\`), we are essentially saying that we found a way to achieve an increasing subsequence of the same length but with a smaller ending element. This provides more opportunities for future elements to extend this subsequence.
   -   The length of the \`tails\` array at the end is the length of the LIS.
   -   **Note**: The \`tails\` array itself does not directly represent an LIS, but its length gives the LIS length. Reconstructing an actual LIS with this method requires additional bookkeeping (e.g., storing predecessors).

### Characteristics (O(N²) DP):
-   **Optimal Substructure**: The LIS ending at index \`i\` depends on LISs ending at previous indices.
-   **Overlapping Subproblems**: Subproblems (calculating LIS ending at a particular \`arr[j]\`) might be used to compute LISs for multiple subsequent \`arr[i]\`.

### Advantages:
-   The O(N²) DP is conceptually simpler to understand than the O(N log N) approach.
-   Guaranteed to find the correct length.

### Disadvantages:
-   O(N²) time complexity can be slow for large arrays. The O(N log N) method is preferred for performance.

### Common Use Cases:
-   Analyzing sequences in bioinformatics (e.g., gene sequences).
-   Stock market trend analysis (finding the longest period of increasing stock prices).
-   Various optimization problems where an ordered subsequence is relevant.
-   Data compression and string algorithms.

The AlgoVista visualizer demonstrates the O(N²) dynamic programming approach, showing the DP table construction and how \`dp[i]\` values are derived.
`,
  timeComplexities: {
    best: "O(N²)",
    average: "O(N²)",
    worst: "O(N²)",
  },
  spaceComplexity: "O(N) for the DP array.",
};
