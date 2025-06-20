
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'dutch-national-flag',
  title: 'Dutch National Flag Problem',
  category: 'Arrays & Search',
  difficulty: 'Medium',
  description: 'Sorts an array of 0s, 1s, and 2s in a single pass using three pointers. An in-place partitioning algorithm.',
  longDescription: `The Dutch National Flag problem, proposed by Edsger Dijkstra, involves sorting an array containing three distinct types of elements (often represented as colors like red, white, and blue, or numbers like 0, 1, and 2) into their respective groups in-place and in a single pass.

### Problem Statement
Given an array of 0s, 1s, and 2s, arrange them such that all 0s come first, followed by all 1s, and then all 2s.

Example: \`[2, 0, 2, 1, 1, 0]\` should become \`[0, 0, 1, 1, 2, 2]\`.

### Core Logic - Three Pointers
The algorithm uses three pointers:
-   \`low\`: Points to the boundary of the 0s section. Everything to the left of \`low\` is a 0.
-   \`mid\`: Points to the current element being considered.
-   \`high\`: Points to the boundary of the 2s section. Everything to the right of \`high\` is a 2.

**Invariants Maintained During Iteration:**
1.  \`arr[0...low-1]\` contains all 0s.
2.  \`arr[low...mid-1]\` contains all 1s.
3.  \`arr[mid...high]\` is the unsorted section being processed.
4.  \`arr[high+1...n-1]\` contains all 2s.

**Algorithm Steps:**
1.  Initialize \`low = 0\`, \`mid = 0\`, \`high = arr.length - 1\`.
2.  Iterate while \`mid <= high\`:
    *   **If \`arr[mid] === 0\`**:
        *   Swap \`arr[low]\` with \`arr[mid]\`.
        *   Increment both \`low\` and \`mid\`.
    *   **If \`arr[mid] === 1\`**:
        *   Increment \`mid\` (the element is in its correct relative group).
    *   **If \`arr[mid] === 2\`**:
        *   Swap \`arr[mid]\` with \`arr[high]\`.
        *   Decrement \`high\` (do not increment \`mid\` because the element swapped from \`high\` to \`mid\`'s position has not yet been processed).
3.  The loop terminates when \`mid\` crosses \`high\`, and the array is sorted according to the Dutch National Flag arrangement.

### Characteristics:
-   **In-Place**: Sorts the array using O(1) auxiliary space.
-   **Single Pass**: Each element is visited at most a few times (related to swaps).
-   **Efficient Partitioning**: A specific case of 3-way partitioning.

### Advantages:
-   Optimal time complexity for this specific problem (O(N)).
-   Space efficient.

### Disadvantages:
-   Specific to problems where elements can be categorized into three distinct groups based on a pivot or known values.

### Common Use Cases:
-   Partitioning step in 3-way Quick Sort.
-   Sorting arrays with a small, fixed number of distinct values.
-   Problems requiring grouping of elements with specific properties.

The AlgoVista visualizer demonstrates the movement of the \`low\`, \`mid\`, and \`high\` pointers, the comparisons, and the swap operations.`,
  timeComplexities: {
    best: "O(N)",
    average: "O(N)",
    worst: "O(N)",
  },
  spaceComplexity: "O(1)",
};

