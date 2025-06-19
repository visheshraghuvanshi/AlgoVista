
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'subarray-sum-problems',
  title: 'Subarray Sum Problems',
  category: 'Arrays & Search',
  difficulty: 'Medium',
  description: 'Covers various problems related to finding subarrays with specific sum properties, like a given sum or maximum sum (e.g., Kadane\'s).',
  longDescription: `Subarray Sum Problems form a common category of algorithmic challenges that involve finding a contiguous block of elements within an array whose sum meets certain criteria. These problems often test one's ability to use techniques like sliding window, prefix sums, or dynamic programming.

### Common Variants:

**1. Find a Subarray with a Given Sum (Positive Numbers Only)**
   - **Problem**: Given an array of non-negative integers, find a contiguous subarray that sums to a given target.
   - **Technique**: Sliding Window.
     1.  Initialize \`currentSum = 0\`, \`start = 0\`.
     2.  Iterate with an \`end\` pointer from 0 to N-1:
         a.  Add \`arr[end]\` to \`currentSum\`.
         b.  While \`currentSum > targetSum\` and \`start <= end\`:
             i.  Subtract \`arr[start]\` from \`currentSum\`.
             ii. Increment \`start\`.
         c.  If \`currentSum == targetSum\`, the subarray from \`start\` to \`end\` is a solution.
   - **Complexity**: O(N) time, O(1) space.
   - *Visualized as "Given Sum (Positive Nums Only)".*

**2. Find a Subarray with a Given Sum (Any Numbers - Positive, Negative, Zero)**
   - **Problem**: Given an array of integers (can include negatives), find a contiguous subarray that sums to a given target.
   - **Technique**: Prefix Sums with a Hash Map.
     1.  Initialize \`currentSum = 0\`, \`prefixSums = new Map()\`. Store \`prefixSums.set(0, -1)\` (to handle subarrays starting from index 0).
     2.  Iterate with an \`i\` pointer from 0 to N-1:
         a.  Add \`arr[i]\` to \`currentSum\`.
         b.  If \`prefixSums.has(currentSum - targetSum)\`, it means a subarray ending at \`i\` with the target sum exists. The start index is \`prefixSums.get(currentSum - targetSum) + 1\`.
         c.  Store \`prefixSums.set(currentSum, i)\`.
   - **Complexity**: O(N) time on average (due to HashMap), O(N) space for the HashMap.
   - *Visualized as "Given Sum (Any Nums)".*

**3. Maximum Subarray Sum (Kadane's Algorithm)**
   - **Problem**: Find the contiguous subarray with the largest sum.
   - **Technique**: Kadane's Algorithm.
     1.  Initialize \`maxSoFar = -Infinity\`, \`currentMax = 0\`.
     2.  Iterate through the array:
         a.  Add the current element to \`currentMax\`.
         b.  If \`currentMax > maxSoFar\`, update \`maxSoFar = currentMax\`.
         c.  If \`currentMax < 0\`, reset \`currentMax = 0\` (as a negative sum won't contribute positively to future subarrays).
   - **Complexity**: O(N) time, O(1) space.
   - *(Note: Kadane's Algorithm has its own dedicated visualizer page in AlgoVista for a more focused demonstration).*

### Why These Techniques?
-   **Sliding Window**: Efficient for positive numbers because adding a positive number always increases the sum, and removing one always decreases it, making the window adjustments predictable.
-   **Prefix Sums & Hash Map**: Handles negative numbers correctly because it looks for a previous sum state (\`currentSum - targetSum\`) that would result in the \`targetSum\` when combined with the elements up to the current point.
-   **Kadane's**: A specialized DP approach that cleverly discards negative-sum-ending subarrays.

These problems are excellent for understanding array manipulation, pointer techniques, and the application of auxiliary data structures like hash maps for optimization.`,
  timeComplexities: {
    best: "Varies (e.g., O(N) for Kadane's or sliding window)",
    average: "Varies (e.g., O(N) for HashMap approach)",
    worst: "Varies (e.g., O(N^2) for brute-force, O(N) for optimized methods)",
  },
  spaceComplexity: "Varies (e.g., O(1) for Kadane's, O(N) for prefix sum/HashMap)",
};
