
// src/app/visualizers/selection-sort/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'selection-sort',
  title: 'Selection Sort',
  category: 'Fundamentals',
  difficulty: 'Easy',
  description: 'Repeatedly finds the minimum element from the unsorted part of the list and puts it at the beginning.',
  longDescription: `Selection Sort is an in-place comparison sorting algorithm. It divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list, and a sublist of the remaining unsorted items that occupy the rest of the list. Initially, the sorted sublist is empty, and the unsorted sublist is the entire input list.

### How it Works:
The algorithm proceeds by finding the smallest (or largest, depending on sorting order) element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element (thus putting it in its correct sorted position), and then moving the sublist boundaries one element to the right.

1.  **Outer Loop (Passes)**: Iterate from the first element to the second-to-last element of the array. Let the current index be \`i\`. This index \`i\` marks the beginning of the unsorted part of the array and the position where the next smallest element should be placed.
2.  **Inner Loop (Finding Minimum)**: In each pass \`i\`, assume the element at \`arr[i]\` is the minimum. Iterate from \`j = i + 1\` to the end of the array.
    a.  Compare \`arr[j]\` with the current minimum element found so far in this pass.
    b.  If \`arr[j]\` is smaller, update the index of the minimum element (\`minIndex = j\`).
3.  **Swap**: After the inner loop completes, \`minIndex\` will hold the index of the smallest element in the unsorted portion (\`arr[i...n-1]\`). Swap the element at \`arr[i]\` with the element at \`arr[minIndex]\`. This places the smallest element of the unsorted part at its correct sorted position.
4.  **Repeat**: The sorted portion of the array grows by one element from the left with each pass. The process repeats until all elements are sorted.

### Example:
Sorting \`arr = [64, 25, 12, 22, 11]\`
**Pass 1 (i=0):**
- Min element in \`[64, 25, 12, 22, 11]\` is 11 at index 4.
- Swap \`arr[0]\` (64) with \`arr[4]\` (11). Array becomes: \`[11, 25, 12, 22, 64]\`. (11 is sorted)
**Pass 2 (i=1):**
- Min element in \`[25, 12, 22, 64]\` (unsorted part) is 12 at index 2.
- Swap \`arr[1]\` (25) with \`arr[2]\` (12). Array becomes: \`[11, 12, 25, 22, 64]\`. (11, 12 are sorted)
... and so on.

### Characteristics:
-   **Simplicity**: Easy to understand and implement.
-   **In-place**: Requires only a constant amount of extra memory (O(1) auxiliary space).
-   **Not Stable**: It does not preserve the relative order of equal elements. This is because elements might be swapped over long distances.
-   **Number of Swaps**: Makes at most N-1 swaps, which can be advantageous if swaps are very expensive operations.

### Advantages:
-   Simple to implement.
-   Performs well on small lists.
-   Minimal number of swaps (O(N) swaps), which can be useful if write operations are costly.

### Disadvantages:
-   Inefficient for large datasets with a time complexity of O(N²) in all cases (best, average, worst) due to the nested loops for comparisons.
-   Not adaptive; its performance doesn't improve if the array is partially sorted.

### When to Use:
-   For educational purposes.
-   When memory space is limited (O(1) auxiliary space).
-   When the number of swaps needs to be minimized.
-   For small datasets where the O(N²) complexity is not a bottleneck.`,
  timeComplexities: {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(1)", // In-place sorting algorithm
};
    
