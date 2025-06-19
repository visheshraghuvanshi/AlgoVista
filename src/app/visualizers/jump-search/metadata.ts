
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'jump-search',
  title: 'Jump Search',
  category: 'Arrays & Search',
  difficulty: 'Easy',
  description: 'A searching algorithm for sorted arrays that checks fewer elements than linear search by jumping ahead by fixed steps. Interactive visualization available.',
  longDescription: `Jump Search (also known as Block Search) is a searching algorithm designed for **sorted arrays**. The fundamental idea is to reduce the number of comparisons compared to a linear search by jumping ahead by fixed steps, and then performing a linear search within a smaller block once the target element's potential block is identified.

### How it Works:
1.  **Prerequisite**: The array must be sorted (typically in ascending order).
2.  **Determine Block Size (Jump Step)**:
    *   A common choice for the block size (or jump step), let's call it \`m\`, is \`sqrt(N)\`, where N is the number of elements in the array. This block size is considered optimal in terms of minimizing the total number of comparisons in the worst case for this algorithm.
3.  **Jumping Phase**:
    *   Start at index 0.
    *   Repeatedly jump by \`m\` steps: check \`arr[0]\`, \`arr[m]\`, \`arr[2m]\`, ..., \`arr[km]\`.
    *   Continue jumping as long as \`arr[km] < targetValue\`.
    *   If, during a jump, \`arr[km] >= targetValue\` or if the jump goes beyond the array bounds, the block where the target *might* exist has been found. This block is between the previous jump point (\`arr[(k-1)m]\`) and the current jump point (\`arr[km]\`).

4.  **Linear Search Phase**:
    *   Once the block is identified (say, from index \`prev_jump\` to \`current_jump\`), perform a linear search for the \`targetValue\` within this smaller block.
    *   Start searching from \`arr[prev_jump]\` up to \`arr[min(current_jump, N-1)]\`.
    *   If the target is found, return its index.

5.  **Not Found**:
    *   If the jumping phase goes beyond the array bounds before finding a block where \`arr[km] >= targetValue\`, and the last checked element was still less than the target, the target is not in the array.
    *   If the linear search within the identified block completes without finding the target, the target is not in the array.
    *   Typically, return -1 or an equivalent indicator if the target is not found.

### Example:
Search for \`target = 55\` in \`arr = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610]\`. (N=16)
1.  Block size \`m = floor(sqrt(16)) = 4\`.
2.  **Jumping**:
    *   Check \`arr[0]\` (0). \`0 < 55\`.
    *   Jump to \`arr[0 + 4 - 1] = arr[3]\` (value 2). \`2 < 55\`. Previous jump point was index before 0.
    *   Jump to \`arr[3 + 4] = arr[7]\` (value 13). \`13 < 55\`. Previous jump point index was 3.
    *   Jump to \`arr[7 + 4] = arr[11]\` (value 89). \`89 > 55\`. Target is in block between index before 7 (i.e. from index 7) and index 11. The last jump point where value was less than target was index 7 (value 13). The current jump went to index 11 (value 89). So the target, if present, is in the block \`arr[7...11]\`. More precisely, linear search from \`arr[prev_jump_index + 1]\` which is \`arr[7+1=8]\` or just from prev (index 7 for the elements between arr[7] and arr[11]). The algorithm often searches from previous jump point index.
    Correct block identification: The block is between \`arr[prev = 7]\` and \`arr[step = 11]\`.
3.  **Linear Search**: Linearly search from \`arr[7]\` up to \`arr[min(11, 15)]\`.
    *   \`arr[7] = 13 != 55\`
    *   \`arr[8] = 21 != 55\`
    *   \`arr[9] = 34 != 55\`
    *   \`arr[10] = 55 == 55\`. Target found at index 10.

### Characteristics:
-   **Requires Sorted Array**: Like binary and ternary search.
-   **Trade-off**: Makes fewer comparisons than linear search but more than binary search.
-   **Optimal Block Size**: The choice of block size affects performance. \`sqrt(N)\` is optimal, leading to approximately \`sqrt(N)\` jumps and then up to \`sqrt(N)\` linear comparisons in the worst case, totaling roughly \`2*sqrt(N)\` comparisons.

### Advantages:
-   Faster than Linear Search.
-   Simpler to implement than Binary Search for some.
-   Can be useful in situations where jumping back is expensive, as it only jumps forward and then linearly scans a small block.

### Disadvantages:
-   Slower than Binary Search (O(log N) vs O(√N)).
-   Requires a sorted array.

### When to Use:
-   When the data is sorted and random access is available.
-   When Binary Search is too complex to implement or when the cost of jumping far back (as binary search might) is higher than a short linear scan.
-   More of a theoretical interest or for specific system characteristics where its jump-then-scan pattern might be beneficial over binary search's halving pattern. In most practical scenarios with arrays in memory, binary search is preferred due to its better time complexity.

The AlgoVista visualizer for Jump Search demonstrates the jumping phase and the subsequent linear search within the identified block.`,
  timeComplexities: {
    best: "O(1)", // Target is found at the first jump point
    average: "O(√n)",
    worst: "O(√n)",
  },
  spaceComplexity: "O(1)",
};
