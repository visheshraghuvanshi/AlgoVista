
// src/app/visualizers/ternary-search/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'ternary-search',
  title: 'Ternary Search',
  category: 'Arrays & Search',
  difficulty: 'Easy',
  description: 'A divide and conquer search algorithm that finds an item in a sorted array by dividing it into three parts.',
  longDescription: `Ternary Search is a divide and conquer search algorithm, similar in concept to binary search, but it divides the search space into three parts instead of two. It is used to find the position of a target value within a **sorted** array.

### How it Works (for searching in a sorted array):
1.  **Prerequisite**: The array must be sorted (typically in ascending order).
2.  **Initialize Pointers**: Set two pointers, \`left\` to the first index (0) and \`right\` to the last index (n-1) of the array.
3.  **Loop**: While \`left <= right\`:
    a.  **Calculate Division Points (Midpoints)**: Divide the current search range \`[left, right]\` into three (approximately) equal parts using two midpoints:
        -   \`mid1 = left + floor((right - left) / 3)\`
        -   \`mid2 = right - floor((right - left) / 3)\`
        These points divide the array into: \`[left...mid1]\`, \`[mid1+1...mid2-1]\`, \`[mid2...right]\`.
    b.  **Compare with Target**:
        i.  If \`array[mid1] == target\`, the target is found at \`mid1\`. Return \`mid1\`.
        ii. If \`array[mid2] == target\`, the target is found at \`mid2\`. Return \`mid2\`.
    c.  **Reduce Search Space**: Based on the comparisons, discard two-thirds of the array and continue searching in the remaining one-third:
        i.  If \`target < array[mid1]\`, the target must be in the first third (if present). Update \`right = mid1 - 1\`.
        ii. Else if \`target > array[mid2]\`, the target must be in the third third (if present). Update \`left = mid2 + 1\`.
        iii.Else (\`array[mid1] < target < array[mid2]\`), the target must be in the middle third (if present). Update \`left = mid1 + 1\` and \`right = mid2 - 1\`.
4.  **Not Found**: If the loop finishes (i.e., \`left > right\`), the target is not in the array. Return an indicator like -1.

### Example:
Searching for \`target = 13\` in sorted \`arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]\`
- \`left = 0, right = 15\`
- \`mid1 = 0 + (15-0)//3 = 5\`. \`arr[5] = 6\`.
- \`mid2 = 15 - (15-0)//3 = 10\`. \`arr[10] = 11\`.
- Target (13) > \`arr[mid2]\` (11). So, \`left = mid2 + 1 = 11\`. New range \`[11, 15]\`.
- \`left = 11, right = 15\`
- \`mid1 = 11 + (15-11)//3 = 11 + 1 = 12\`. \`arr[12] = 13\`.
- Target (13) == \`arr[mid1]\` (13). Found! Return index 12.

### Characteristics:
-   **Divide and Conquer**: Divides the problem into three smaller subproblems.
-   **Requires Sorted Data**: Like binary search, the array must be sorted.
-   **Complexity**: Time complexity is O(log₃N). While asymptotically similar to O(log₂N) of binary search (as log₃N = log₂N / log₂3), ternary search generally performs more comparisons per iteration than binary search.

### Advantages:
-   Conceptually extends the divide-and-conquer idea of binary search.

### Disadvantages:
-   **Generally Slower than Binary Search for Arrays**: Although both are logarithmic, binary search reduces the search space by half with one comparison (or two in some implementations), while ternary search reduces it by two-thirds but requires two comparisons (with \`arr[mid1]\` and \`arr[mid2]\`). This often makes binary search faster in practice for array searching.
-   **Less Common for Array Searching**: Due to binary search usually being more efficient for this specific task.

### Primary Use Case (Unimodal Functions):
Ternary search is more prominently used for finding the extremum (maximum or minimum) of a **unimodal function** over a continuous domain or a discrete set of points. A unimodal function is one that, over a given range, first strictly increases and then strictly decreases, or vice-versa. In this context, by evaluating the function at two points (\`m1\` and \`m2\`), one can determine which two-thirds of the interval does *not* contain the extremum.

For array searching, binary search is almost always preferred. The visualizer demonstrates its application on a sorted array for educational comparison.`,
  timeComplexities: {
    best: "O(1)",
    average: "O(log₃n)",
    worst: "O(log₃n)",
  },
  spaceComplexity: "O(1) (Iterative), O(log₃n) (Recursive due to stack space)",
};
    
