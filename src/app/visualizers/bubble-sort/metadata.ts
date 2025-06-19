
// src/app/visualizers/bubble-sort/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'bubble-sort',
  title: 'Bubble Sort',
  category: 'Fundamentals',
  difficulty: 'Easy',
  description: 'A simple comparison-based sorting algorithm where adjacent elements are repeatedly compared and swapped.',
  longDescription: `Bubble Sort is a straightforward comparison-based sorting algorithm. It operates by repeatedly stepping through the list, comparing each pair of adjacent items, and swapping them if they are in the wrong order (e.g., for ascending sort, if the left element is greater than the right). This process is repeated until no swaps are needed during a full pass, which indicates that the list is sorted. The larger values "bubble" to the end of the list with each pass.

### How it Works:
1.  **Outer Loop (Passes)**: Iterate from the end of the array towards the beginning. Each pass aims to place the next largest unsorted element into its correct final position.
2.  **Inner Loop (Comparisons & Swaps)**: For each pass, iterate from the beginning of the array up to the current end of the unsorted portion.
    a.  Compare the current element (\`array[j]\`) with the next element (\`array[j+1]\`).
    b.  If \`array[j] > array[j+1]\` (for ascending order), swap them.
3.  **Optimization**: A flag can be used to track if any swaps occurred during a pass. If a full pass completes with no swaps, the array is already sorted, and the algorithm can terminate early. This improves the best-case time complexity.
4.  **Sorted Portion Grows**: After each full pass of the inner loop, the largest element among the unsorted elements "bubbles up" to its correct sorted position at the end of the unsorted part of the array. The effective size of the unsorted portion of the array decreases by one with each pass.

### Example:
Sorting \`arr = [5, 1, 4, 2, 8]\`
**Pass 1:**
- (5,1) -> swap: [1,5,4,2,8]
- (5,4) -> swap: [1,4,5,2,8]
- (5,2) -> swap: [1,4,2,5,8]
- (5,8) -> no swap: [1,4,2,5,8] (8 is now in sorted position)
**Pass 2:** (consider up to index 3)
- (1,4) -> no swap: [1,4,2,5,8]
- (4,2) -> swap: [1,2,4,5,8]
- (4,5) -> no swap: [1,2,4,5,8] (5 is now in sorted position)
... and so on.

### Characteristics:
-   **Simplicity**: Very easy to understand and implement.
-   **In-place**: It sorts the array using only a constant amount of extra memory (O(1) auxiliary space).
-   **Stable**: It preserves the relative order of equal elements. If two elements have the same value, their original order will be maintained after sorting.

### Advantages:
-   Easy to implement.
-   Space efficient (O(1) auxiliary space).
-   Stable sort.
-   Efficient for nearly sorted lists (best-case O(N) with optimization).

### Disadvantages:
-   Very inefficient for large, unsorted datasets due to its O(N²) average and worst-case time complexity. Many comparisons and swaps are often needed.
-   Generally outperformed by more advanced sorting algorithms like Merge Sort, Quick Sort, or Heap Sort for larger inputs.

### When to Use:
-   Primarily for educational purposes to introduce sorting concepts.
-   For very small datasets where its simplicity might outweigh its inefficiency.
-   When the input array is already "almost sorted," as its O(N) best-case performance can be advantageous.`,
  timeComplexities: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(1)",
};
    
