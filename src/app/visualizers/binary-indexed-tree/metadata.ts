
import type { AlgorithmMetadata } from './types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'binary-indexed-tree',
  title: 'Binary Indexed Tree (BIT)',
  category: 'Data Structures', 
  difficulty: 'Hard',
  description: 'A data structure that allows efficient updates and prefix sum queries in an array, using bitwise operations.',
  longDescription: `A Binary Indexed Tree (BIT), also known as a Fenwick Tree, is a data structure that can efficiently update elements and calculate prefix sums in an array of numbers. Its primary advantage over a naive array is its ability to perform both operations in O(log N) time, where N is the size of the array.

### Core Idea:
Each node in the BIT stores the sum of a certain range of elements from the original array. The key insight is how these ranges are defined based on the binary representation of indices (using 1-based indexing for the BIT):
-   A node at index \`i\` in the BIT stores the sum of elements from \`i - LSB(i) + 1\` to \`i\` of the original array.
-   \`LSB(i)\` is the value of the least significant bit of \`i\` (e.g., for i=6 (110), LSB is 2 (010)). It can be calculated as \`i & -i\`.

### Key Operations (1-based indexing for logic):
1.  **Update(\`index\`, \`delta\`)**: Adds \`delta\` to the element at \`index\` and updates all responsible BIT nodes.
    *   Traverse upwards from the leaf: \`index = index + LSB(index)\`.
    *   At each step, add \`delta\` to \`BIT[index]\`.
    *   **Time Complexity**: O(log N)

2.  **Query(\`index\`)**: Calculates the prefix sum of the original array up to \`index\`.
    *   Traverse downwards from the node: \`index = index - LSB(index)\`.
    *   At each step, add \`BIT[index]\` to a running sum.
    *   **Time Complexity**: O(log N)

3.  **Range Sum Query (\`queryRange(left, right)\`)**:
    *   Calculated as \`query(right) - query(left - 1)\`.
    *   **Time Complexity**: O(log N)

### Advantages:
-   **Efficient Updates and Prefix Queries**: Both are O(log N).
-   **Space Efficient**: Requires only O(N) space for the BIT itself.
-   Often has lower constant factors and is simpler to implement than a Segment Tree.

The AlgoVista visualizer for BIT demonstrates the structure of the BIT array and how the update and query operations traverse it by manipulating indices using bitwise LSB operations. A special panel shows the bitwise calculations for each step.`,
  timeComplexities: {
    best: "Build: O(N log N) or O(N), Update: O(log N), Query: O(log N)",
    average: "Build: O(N log N) or O(N), Update: O(log N), Query: O(log N)",
    worst: "Build: O(N log N) or O(N), Update: O(log N), Query: O(log N)",
  },
  spaceComplexity: "O(N) for the BIT array.",
};
