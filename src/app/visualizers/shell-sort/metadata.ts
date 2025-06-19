
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'shell-sort',
  title: 'Shell Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'An in-place comparison sort that is an improvement over insertion sort by allowing comparison and exchange of elements that are far apart.',
  longDescription: `Shell Sort, also known as Shell's method or shellsort, is an in-place comparison sort. It can be seen as either a generalization of sorting by exchange (bubble sort) or sorting by insertion (insertion sort). The method starts by sorting pairs of elements far apart from each other, then progressively reducing the gap between elements to be compared. Starting with far apart elements can move some out-of-place elements into position faster than a simple nearest neighbor exchange.

### How it Works:
1.  **Choose a Gap Sequence**: The algorithm's performance heavily depends on the sequence of gaps used. Common sequences include:
    *   Shell's original sequence: N/2, N/4, ..., 1 (where N is the number of elements). This is what's visualized.
    *   Knuth's sequence: h = 1; while (h < N/3) h = 3*h + 1; then h = (h-1)/3, ... , 1. (e.g., 1, 4, 13, 40, ...)
    *   Sedgewick's sequences, Ciura's sequence, and others, offer better worst-case performance.
2.  **Outer Loop (Iterate through Gaps)**: Start with the largest gap in the chosen sequence and work down to a gap of 1.
3.  **Gapped Insertion Sort**: For each gap value:
    *   Perform an insertion sort, but instead of comparing adjacent elements, compare elements that are \`gap\` positions apart.
    *   This means for each element \`arr[i]\` (starting from \`i = gap\` up to \`n-1\`), it is compared with \`arr[i-gap]\`, \`arr[i-2*gap]\`, and so on, until an element smaller than or equal to \`arr[i]\` is found, or the beginning of that "gapped sub-array" is reached.
    *   Elements are shifted \`gap\` positions to the right to make space, and \`arr[i]\` (stored in a temporary variable) is inserted into its correct gapped position.
    *   Effectively, this sorts \`gap\` interleaved sub-arrays. For example, with a gap of 5, elements at indices 0, 5, 10, ... form one sub-array; elements at 1, 6, 11, ... form another, and so on. Each of these sub-arrays is sorted using insertion sort logic.
4.  **Final Pass (Gap = 1)**: The last pass always uses a gap of 1. This is equivalent to a standard Insertion Sort. However, because the previous passes with larger gaps have moved elements closer to their final positions, the array is "h-sorted" for various \`h\`, and by the time gap=1, the array is substantially sorted. Insertion Sort is very efficient on nearly sorted arrays (O(N)).

### Example: Sorting \`arr = [35, 33, 42, 10, 14, 19, 27, 44]\` with gaps N/2, N/4, ..., 1 (Shell's original)
N = 8.
**Gap = 4 (N/2):**
- Compare arr[4](14) with arr[0](35). 14 < 35. Shift 35. Insert 14. -> \`[14, 33, 42, 10, 35, 19, 27, 44]\`
- Compare arr[5](19) with arr[1](33). 19 < 33. Shift 33. Insert 19. -> \`[14, 19, 42, 10, 35, 33, 27, 44]\`
- Compare arr[6](27) with arr[2](42). 27 < 42. Shift 42. Insert 27. -> \`[14, 19, 27, 10, 35, 33, 42, 44]\`
- Compare arr[7](44) with arr[3](10). 44 > 10. No shift.
Array after gap 4: \`[14, 19, 27, 10, 35, 33, 42, 44]\`

**Gap = 2 (N/4):**
- (Iterate through elements starting from index 2, comparing with elements 2 positions behind)
- ... (multiple gapped insertion sort comparisons and swaps) ...
- Array becomes more sorted. E.g., \`[14, 10, 19, 33, 27, 35, 42, 44]\` (conceptual after some steps)

**Gap = 1 (N/8):**
- This is a standard Insertion Sort on the (now nearly sorted) array.
- ... (final comparisons and shifts) ...
- Final sorted array: \`[10, 14, 19, 27, 33, 35, 42, 44]\`

### Characteristics:
-   **In-Place**: Modifies the array directly, requiring O(1) auxiliary space (excluding space for gap sequence generation if dynamic).
-   **Not Stable**: The relative order of equal elements may change.
-   **Adaptive**: Performance is better if the array is partially sorted.

### Advantages:
-   Significantly faster than simple O(N²) sorts like Insertion Sort or Bubble Sort for moderately sized arrays.
-   Relatively simple to implement compared to O(N log N) algorithms like Merge Sort or Quick Sort.
-   Good performance for "medium" sized arrays (e.g., a few thousand elements).

### Disadvantages:
-   **Time Complexity is Gap-Sequence Dependent**: The worst-case and average-case time complexities depend heavily on the chosen gap sequence. Poor gap sequences can lead to O(N²) performance. Optimal gap sequences are an area of research, but many known good ones (like Sedgewick's) achieve O(N^(4/3)) or O(N^(3/2)) in the worst case.
-   Not as fast as O(N log N) algorithms for very large datasets.
-   Mathematical analysis of its performance is complex.

### Common Use Cases:
-   Embedded systems or situations where code simplicity and reasonable performance (better than O(N²)) are desired without the overhead or recursion depth of Quick Sort/Merge Sort.
-   Used in the \`uClibc\` C standard library and historically in the Linux kernel.
-   When a "good enough" sort for medium data that's better than insertion sort is needed, and an in-place algorithm is preferred.
  `,
  timeComplexities: {
    best: "O(n log n) (depends on gap sequence)",
    average: "O(n (log n)²) or O(n^(3/2)) (depends on gap sequence)",
    worst: "O(n²) (Shell's original gaps), O(n (log n)²) (Pratt's gaps for specific sequences)",
  },
  spaceComplexity: "O(1) (in-place).",
};
