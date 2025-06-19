
// src/app/visualizers/binary-search/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'binary-search',
  title: 'Binary Search',
  category: 'Fundamentals',
  difficulty: 'Easy',
  description: 'Efficiently finds an item from a sorted list by repeatedly dividing the search interval in half.',
  longDescription: `Binary Search is a highly efficient searching algorithm used to find the position of a target value within a **sorted** array or list. It works by repeatedly dividing the search interval in half. If the value of the search key is less than the item in the middle of the interval, the search narrows to the lower half. Otherwise, the search narrows to the upper half. This process continues until the value is found or the interval is empty.

### How it Works:
1.  **Prerequisite**: The array/list must be sorted.
2.  **Initialize Pointers**: Set two pointers, \`left\` to the first index (0) and \`right\` to the last index (n-1) of the array.
3.  **Loop**: While \`left <= right\`:
    a.  **Calculate Midpoint**: Find the middle index: \`mid = left + floor((right - left) / 2)\`. Using this formula helps prevent potential overflow if \`left\` and \`right\` are very large numbers, compared to \`(left + right) / 2\`.
    b.  **Compare**:
        i.  If \`array[mid] == target\`, the target is found. Return \`mid\`.
        ii. If \`array[mid] < target\`, the target, if present, must be in the right half. Update \`left = mid + 1\`.
        iii.If \`array[mid] > target\`, the target, if present, must be in the left half. Update \`right = mid - 1\`.
4.  **Not Found**: If the loop finishes (i.e., \`left > right\`), the target is not in the array. Return an indicator like -1 or null.

### Example:
Searching for \`target = 7\` in sorted \`arr = [1, 3, 4, 5, 7, 9]\`
-   \`left = 0\`, \`right = 5\`. \`mid = 0 + floor((5-0)/2) = 2\`. \`arr[2] = 4\`. \`4 < 7\`. \`left = 2 + 1 = 3\`.
-   \`left = 3\`, \`right = 5\`. \`mid = 3 + floor((5-3)/2) = 4\`. \`arr[4] = 7\`. \`7 == 7\`. Target found! Return index 4.

### Characteristics:
-   **Divide and Conquer**: It's a classic example of a divide and conquer algorithm.
-   **Efficiency**: Significantly faster than linear search for large arrays.
-   **Requires Sorted Data**: This is a critical prerequisite. If the data is not sorted, binary search will not work correctly.

### Advantages:
-   Very efficient for searching in large sorted datasets (O(log N) time complexity).
-   Simple concept to understand.

### Disadvantages:
-   Requires the input array to be sorted. The cost of sorting (e.g., O(N log N)) might outweigh the benefits of binary search if the array is searched only once or a few times.
-   Less suitable for data structures that do not offer random access (e.g., linked lists, without modifications).

### When to Use:
-   When searching frequently in a large, static sorted array.
-   As a subroutine in other algorithms (e.g., finding the insertion point in some data structures, lower_bound/upper_bound operations).`,
  timeComplexities: {
    best: "O(1)",    // Target is the middle element in the first check
    average: "O(log n)",
    worst: "O(log n)", // Target is not present or found at the end of search
  },
  spaceComplexity: "O(1) (Iterative), O(log n) (Recursive due to stack space)",
};
    
