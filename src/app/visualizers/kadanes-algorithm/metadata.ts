
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'kadanes-algorithm',
  title: "Kadane's Algorithm",
  category: 'Arrays & Search',
  difficulty: 'Medium',
  description: 'Efficiently finds the maximum sum of a contiguous subarray within a one-dimensional array of numbers. Interactive visualization available.',
  longDescription: `Kadane's Algorithm is an efficient dynamic programming approach to solve the "maximum subarray sum" problem. Given a one-dimensional array of numbers (which can be positive, negative, or zero), the task is to find a contiguous subarray (a subarray that consists of consecutive elements) that has the largest possible sum.

### How it Works:
The algorithm iterates through the array, keeping track of two main variables:
1.  **\`current_max\` (or \`max_ending_here\`)**: The maximum sum of a subarray ending at the current position \`i\`.
2.  **\`max_so_far\` (or \`global_max\`)**: The overall maximum sum found for any subarray encountered so far.

The core idea is that for each element \`arr[i]\`, the maximum subarray ending at \`i\` is either:
    *   Just \`arr[i]\` itself (if the \`current_max\` sum ending at \`i-1\` was negative or zero, starting a new subarray from \`arr[i]\` is better).
    *   Or, \`arr[i] + current_max\` (sum ending at \`i-1\`) (if extending the previous subarray results in a larger sum).
    This is often simplified to: \`current_max = Math.max(arr[i], current_max + arr[i])\` or, more commonly in Kadane's standard form, \`current_max += arr[i]\` followed by a check to reset \`current_max\` if it becomes negative.

**Algorithm Steps:**
1.  **Initialization**:
    *   Initialize \`max_so_far\` to a very small number (e.g., negative infinity, or the first element if the array is non-empty and non-empty subarrays are required).
    *   Initialize \`current_max\` to 0.
    *   (Optional, for tracking subarray indices): Initialize \`start_index = 0\`, \`end_index = 0\`, \`current_start_index = 0\`.

2.  **Iteration**: Loop through the array from the first element to the last (index \`i\`):
    a.  **Add Current Element**: Add \`arr[i]\` to \`current_max\`.
        *   \`current_max = current_max + arr[i]\`
    b.  **Update Overall Maximum**: If \`current_max\` is greater than \`max_so_far\`, update \`max_so_far\` and potentially the \`start_index\` and \`end_index\`.
        *   \`if (current_max > max_so_far) { max_so_far = current_max; /* update end_index = i; start_index = current_start_index; */ } \`
    c.  **Reset if Negative**: If \`current_max\` becomes negative, it means the subarray ending at the current position \`i\` contributes negatively to any future subarray. Thus, we reset \`current_max\` to 0 and consider starting a new potential subarray from the next element \`i+1\`.
        *   \`if (current_max < 0) { current_max = 0; /* current_start_index = i + 1; */ }\`

3.  **Result**: After iterating through the entire array, \`max_so_far\` will hold the maximum sum of any contiguous subarray.

**Handling All Negative Numbers:**
-   If the standard Kadane's (which resets \`current_max\` to 0) is used and all numbers in the array are negative, \`max_so_far\` might end up as 0 (if initialized to 0 and empty subarray is allowed) or the initial negative infinity.
-   If a non-empty subarray is required, and all numbers are negative, the result should be the largest (least negative) single element in the array. A slight modification or a post-loop check is needed: if \`max_so_far\` is still indicating no positive sum was found (e.g., it's less than or equal to the initial \`current_max\` of 0 when all numbers are negative), then find the maximum single element in the array. The visualizer attempts to handle this by showing the largest single element if \`max_so_far\` is still negative infinity at the end.

### Example: \`arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\`
-   **Init**: \`max_so_far = -Infinity\`, \`current_max = 0\`
-   **i=0, arr[0]=-2**: \`current_max = -2\`. \`max_so_far = -2\`. \`current_max < 0\`, so \`current_max = 0\`.
-   **i=1, arr[1]=1**: \`current_max = 1\`. \`max_so_far = 1\`.
-   **i=2, arr[2]=-3**: \`current_max = 1 - 3 = -2\`. \`max_so_far\` (1) is not updated. \`current_max < 0\`, so \`current_max = 0\`.
-   **i=3, arr[3]=4**: \`current_max = 4\`. \`max_so_far = 4\`.
-   **i=4, arr[4]=-1**: \`current_max = 4 - 1 = 3\`. \`max_so_far\` (4) is not updated.
-   **i=5, arr[5]=2**: \`current_max = 3 + 2 = 5\`. \`max_so_far = 5\`.
-   **i=6, arr[6]=1**: \`current_max = 5 + 1 = 6\`. \`max_so_far = 6\`.
-   **i=7, arr[7]=-5**: \`current_max = 6 - 5 = 1\`. \`max_so_far\` (6) is not updated.
-   **i=8, arr[8]=4**: \`current_max = 1 + 4 = 5\`. \`max_so_far\` (6) is not updated.
-   **End**: Result is \`max_so_far = 6\`. (Subarray: [4, -1, 2, 1])

### Characteristics:
-   **Dynamic Programming**: It uses the optimal substructure property: the maximum subarray ending at position \`i\` is related to the maximum subarray ending at \`i-1\`.
-   **Greedy Choice**: At each step, it decides whether to extend the current subarray or start a new one.

### Advantages:
-   **Extremely Efficient**: O(N) time complexity.
-   **Simple to Implement**: Requires only a few variables.
-   **Space Efficient**: O(1) auxiliary space.

### Disadvantages:
-   Only finds the sum, not the indices of the subarray unless explicitly tracked.
-   Standard version finds the maximum sum; variations are needed for problems like "maximum product subarray."

### Common Use Cases:
-   Finding the period of maximum profit in stock trading.
-   Image processing (e.g., finding the brightest region in an image).
-   Any problem that can be mapped to finding the maximum sum of a contiguous sequence.
  `,
  timeComplexities: {
    best: "O(N)",
    average: "O(N)",
    worst: "O(N)",
  },
  spaceComplexity: "O(1)",
};
