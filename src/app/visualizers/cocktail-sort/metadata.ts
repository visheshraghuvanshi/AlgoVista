
// src/app/visualizers/cocktail-sort/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'cocktail-sort',
  title: 'Cocktail Shaker Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  description: 'A bidirectional bubble sort, improving slightly on bubble sort by sorting in both directions each pass. Interactive visualization available.',
  longDescription: `Cocktail Shaker Sort, also known as bidirectional bubble sort, cocktail sort, shaker sort, ripple sort, shuffle sort, or shuttle sort, is a variation of bubble sort that is both a stable sorting algorithm and a comparison sort. The algorithm differs from bubble sort in that it sorts in both directions on each pass through the list.

### How it Works:
The algorithm extends bubble sort by operating in two directions.

1.  **Forward Pass (Bubble Up)**:
    *   Similar to a standard bubble sort pass, iterate from left to right.
    *   Compare adjacent elements and swap them if they are in the wrong order (e.g., if \`arr[i] > arr[i+1]\` for ascending sort).
    *   This pass moves the largest unsorted element to its correct position at the end of the current unsorted section.
    *   After the first forward pass, the rightmost boundary of the unsorted section shrinks.

2.  **Backward Pass (Bubble Down)**:
    *   After the forward pass, iterate from right to left (from the new end of the unsorted section towards the beginning).
    *   Compare adjacent elements and swap them if they are in the wrong order (e.g., if \`arr[i-1] > arr[i]\`).
    *   This pass moves the smallest unsorted element to its correct position at the beginning of the current unsorted section.
    *   After the backward pass, the leftmost boundary of the unsorted section expands.

3.  **Repeat**: Continue alternating forward and backward passes. The range of the unsorted portion of the array shrinks from both ends with each full (forward + backward) pass.

4.  **Termination**: The algorithm terminates when a full pass (either forward or backward, or a combined forward-then-backward pass) completes with no swaps, indicating the array is sorted. The boundaries (\`start\` and \`end\`) of the unsorted region will eventually meet or cross.

### Example:
Sorting \`arr = [5, 1, 4, 2, 8]\`
**Pass 1 (Forward):**
- \`[1,5,4,2,8]\` -> \`[1,4,5,2,8]\` -> \`[1,4,2,5,8]\`. (8 is sorted)
**Pass 1 (Backward), range [0..3]:**
- \`arr[2](5)\` vs \`arr[3](2)\` -> swap. Array is now \`[1,4,2,5,8]\`. (Conceptual intermediate, after 5,2 swap)
- \`arr[1](4)\` vs \`arr[2](2)\` -> swap. Array becomes \`[1,2,4,5,8]\`.
- \`arr[0](1)\` vs \`arr[1](2)\` -> no swap.
- Array after Pass 1 (Bwd): \`[1, 2, 4, 5, 8]\`. (1 is sorted)
New range for Pass 2: \`start=1\`, \`end=3\`.

**Pass 2 (Forward), range [1..2] (elements at indices 1,2,3):**
- (arr[1]=2, arr[2]=4) -> no swap.
- (arr[2]=4, arr[3]=5) -> no swap. (5 is sorted, effectively)
**Pass 2 (Backward), range [1..1]:**
- (No comparisons as range is too small or effectively end=start)

The algorithm terminates when no swaps occur in a full forward and backward pass.

### Characteristics:
-   **In-Place**: Sorts the array using O(1) auxiliary space.
-   **Stable**: Preserves the relative order of equal elements.
-   **Bidirectional**: Addresses the "turtles" problem of bubble sort (where small elements at the end of the list are slow to move to the beginning) by also bubbling small elements to the start.

### Advantages:
-   Slightly more efficient than standard Bubble Sort due to the bidirectional passes, especially on lists with "turtles".
-   Still relatively simple to understand and implement.

### Disadvantages:
-   Time complexity is still O(N²) in the average and worst cases, making it inefficient for large datasets.
-   Outperformed by more advanced O(N log N) algorithms.

### When to Use:
-   Educational purposes.
-   Small datasets.
-   Situations where a slight improvement over Bubble Sort is desired without significantly increasing implementation complexity.`,
  timeComplexities: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(1)",
};
    
