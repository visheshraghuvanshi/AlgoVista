
// src/app/visualizers/insertion-sort/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'insertion-sort',
  title: 'Insertion Sort',
  category: 'Fundamentals',
  difficulty: 'Easy',
  description: 'Builds the final sorted array one item at a time by inserting each element into its proper place in the sorted part. Efficient for small or nearly sorted data.',
  longDescription: `Insertion Sort is a simple, in-place comparison-based sorting algorithm that builds the final sorted array (or list) one item at a time. It iterates through an input array and removes one element per iteration, finds the place the element belongs in the sorted part of the array, and then inserts it there.

### How it Works:
1.  **Iterate Through Unsorted Part**: Start from the second element of the array (index 1), as the first element (index 0) is trivially considered sorted by itself. Let the current element being considered be the \`key\`.
2.  **Compare and Shift**: Compare the \`key\` with the elements in the sorted portion (which is to its left, i.e., elements from index 0 up to \`i-1\`).
    *   Move elements of the sorted portion that are greater than the \`key\` one position to their right to make space for the \`key\`.
    *   This is done by starting from the element just before the \`key\` (at index \`j = i-1\`) and moving backwards (\`j--\`) as long as \`arr[j] > key\` and \`j >= 0\`.
3.  **Insert Key**: Once the correct position is found (either the beginning of the array is reached, or an element smaller than or equal to the \`key\` is found), insert the \`key\` into that position.
4.  **Repeat**: Repeat steps 1-3 for all elements in the array. With each iteration \`i\`, the subarray \`arr[0...i]\` becomes sorted.

### Example:
Sorting \`arr = [5, 1, 4, 2, 8]\`
**i = 1 (key = 1):**
- Compare 1 with 5. 5 > 1. Shift 5 to right: \`[5, 5, 4, 2, 8]\`. j becomes -1.
- Insert 1 at j+1 (index 0): \`[1, 5, 4, 2, 8]\`. Sorted part: \`[1, 5]\`
**i = 2 (key = 4):**
- Compare 4 with 5. 5 > 4. Shift 5 to right: \`[1, 5, 5, 2, 8]\`. j becomes 0.
- Compare 4 with 1. 1 < 4. Stop.
- Insert 4 at j+1 (index 1): \`[1, 4, 5, 2, 8]\`. Sorted part: \`[1, 4, 5]\`
... and so on.

### Characteristics:
-   **Simplicity**: Easy to understand and implement.
-   **In-place**: Requires only a constant amount of extra memory (O(1) auxiliary space).
-   **Stable**: Preserves the relative order of equal elements.
-   **Adaptive**: Efficient for data sets that are already substantially sorted. If the array is nearly sorted, insertion sort performs close to O(N) time.

### Advantages:
-   Simple implementation.
-   Efficient for small data sets.
-   More efficient in practice than other simple quadratic (O(N²)) algorithms like selection sort or bubble sort for small N.
-   Adaptive: efficient for data sets that are already substantially sorted (best-case O(N)).
-   Stable sort.
-   In-place.

### Disadvantages:
-   Inefficient for large, unsorted datasets, with an average and worst-case time complexity of O(N²).

### When to Use:
-   When the input array is small.
-   When the input array is nearly sorted (it can be very fast in this scenario).
-   As a subroutine in more complex sorting algorithms, like Timsort (used in Python and Java) or Introsort, for sorting small partitions.`,
  timeComplexities: {
    best: "O(n)",       // When the array is already sorted
    average: "O(n²)",
    worst: "O(n²)",    // When the array is sorted in reverse order
  },
  spaceComplexity: "O(1)", // In-place sorting algorithm
};
    
