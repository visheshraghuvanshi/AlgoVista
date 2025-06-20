
import type { AlgorithmMetadata } from './types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'binary-indexed-tree',
  title: 'Binary Indexed Tree (BIT)',
  category: 'Data Structures', 
  difficulty: 'Medium',
  description: 'A data structure that efficiently calculates prefix sums (or other range queries) and supports point updates on an array.',
  longDescription: `A Binary Indexed Tree (BIT), also known as a Fenwick Tree, is a data structure that can efficiently update elements and calculate prefix sums in an array of numbers. Its primary advantage over a naive array is its ability to perform both operations in O(log N) time, where N is the size of the array.

### Core Idea:
Each node in the BIT stores the sum of a certain range of elements from the original array. The key insight is how these ranges are defined:
-   A node at index \`idx\` in the BIT stores the sum of elements from \`idx - LSB(idx) + 1\` to \`idx\` of the original array (using 1-based indexing for BIT).
-   \`LSB(idx)\` is the least significant bit of \`idx\` (e.g., \`LSB(6) = LSB(110_binary) = 010_binary = 2\`). It can be calculated as \`idx & (-idx)\`.

This structure allows for efficient updates and queries by traversing "up" or "down" the conceptual tree.

### Key Operations:
(Assuming 1-based indexing for the BIT array \`tree[]\` and the input array indices)

1.  **Update (\`update(index, delta)\`)**: Adds \`delta\` to the element at \`index\` in the original array and updates the BIT.
    *   To update \`tree[index]\`, you add \`delta\` to it.
    *   Then, you move to the "parent" or "next responsible node" by adding the LSB of the current index: \`index = index + LSB(index)\`.
    *   Repeat this process until \`index\` goes beyond the size of the BIT.
    *   **Time Complexity**: O(log N)

2.  **Query (\`query(index)\`)**: Calculates the prefix sum of the original array up to \`index\` (i.e., sum of \`arr[1]...arr[index]\`).
    *   Initialize \`sum = 0\`.
    *   Start from \`tree[index]\` and add its value to \`sum\`.
    *   Move to the "previous responsible node" by subtracting the LSB of the current index: \`index = index - LSB(index)\`.
    *   Repeat this process until \`index\` becomes 0.
    *   **Time Complexity**: O(log N)

3.  **Range Sum Query (\`queryRange(left, right)\`)**: Calculates the sum of elements from \`left\` to \`right\` in the original array.
    *   This is typically done as \`query(right) - query(left - 1)\`.
    *   **Time Complexity**: O(log N) (due to two query operations).

4.  **Build BIT**:
    *   Initialize a BIT array of size N+1 with all zeros.
    *   Iterate through the original input array. For each element \`arr[i]\` at original 0-based index \`i\`, call \`update(i+1, arr[i])\` on the BIT.
    *   **Time Complexity**: O(N log N) if built this way.
    *   (A more efficient O(N) build method exists by directly calculating BIT node values based on children, but the update-based build is simpler to conceptualize with basic operations).

### Array Representation:
-   The BIT is typically stored in an array of size N+1 (for 1-based indexing convenience).
-   \`tree[0]\` is often unused.

### Advantages:
-   **Efficient Updates and Prefix Queries**: Both are O(log N).
-   **Space Efficient**: Requires only O(N) space, the same as the original array if it needed to be stored, or O(N) for the BIT itself if operating on conceptual values.

### Disadvantages:
-   Can be less intuitive to understand than simpler structures like prefix sum arrays.
-   Primarily designed for point updates and prefix sum queries. Range updates require extensions or different structures (like Segment Trees with Lazy Propagation).

### Common Use Cases:
-   Problems requiring frequent prefix sum calculations and point updates on an array (e.g., in competitive programming).
-   Counting inversions in an array.
-   Implementing 2D BITs for 2D range sum queries.
-   Dynamic frequency counting.

The AlgoVista visualizer for BIT demonstrates the structure of the BIT array and how the update and query operations traverse it by manipulating indices using LSB operations.
`,
  timeComplexities: {
    best: "Build: O(N log N) or O(N), Update: O(log N), Query: O(log N)",
    average: "Build: O(N log N) or O(N), Update: O(log N), Query: O(log N)",
    worst: "Build: O(N log N) or O(N), Update: O(log N), Query: O(log N)",
  },
  spaceComplexity: "O(N) for the BIT array.",
};

    