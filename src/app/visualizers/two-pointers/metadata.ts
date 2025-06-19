
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'two-pointers',
  title: 'Two Pointers Technique',
  category: 'Arrays & Search',
  difficulty: 'Medium',
  description: 'An algorithmic technique that uses two pointers to iterate through a data structure, often an array or string, typically from opposite ends or in a synchronized manner.',
  longDescription: `The Two Pointers technique is a common and efficient strategy for solving problems involving arrays or strings, particularly when they are sorted or when specific pairwise properties are sought. It involves using two integer pointers that typically traverse the data structure, often in a way that converges, diverges, or moves in a synchronized fashion.

### How it Works:
The exact mechanics depend on the problem, but common patterns include:

1.  **Pointers from Opposite Ends (Converging)**:
    *   Initialize one pointer (\`left\`) at the beginning of the array and another (\`right\`) at the end.
    *   Move the pointers towards each other based on certain conditions until they meet or cross.
    *   **Use Case Example**: Finding a pair of elements in a *sorted array* that sum up to a target value.
        *   If \`arr[left] + arr[right] == target\`, a pair is found.
        *   If \`arr[left] + arr[right] < target\`, increment \`left\` to increase the sum.
        *   If \`arr[left] + arr[right] > target\`, decrement \`right\` to decrease the sum.

2.  **Fast and Slow Pointers**:
    *   Two pointers start at the same position (or nearby) but move at different speeds.
    *   **Use Case Example**: Detecting cycles in a linked list (Floyd's Tortoise and Hare algorithm), finding the middle of a linked list.

3.  **Pointers for Windowing (Sliding Window - related but often distinct category)**:
    *   Two pointers (\`start\` and \`end\`) define a "window" over a segment of the array/string.
    *   The \`end\` pointer expands the window, and the \`start\` pointer shrinks it when certain conditions are met.
    *   **Use Case Example**: Finding the smallest subarray whose sum is greater than or equal to a target value.

4.  **Pointers for Partitioning/Merging**:
    *   Used in algorithms like Quick Sort (partitioning step) or merging sorted arrays.
    *   Pointers keep track of different segments or positions in the arrays being processed.

### Advantages of Two Pointers:
-   **Efficiency**: Often reduces the time complexity of a problem from O(N²) (e.g., using nested loops) to O(N) because each element is typically visited once or a constant number of times by the pointers.
-   **Space Complexity**: Usually results in O(1) auxiliary space, as the operations are performed in-place or with a few extra variables.
-   **Simplicity**: For many problems, the two-pointer logic can be quite intuitive once the pattern is understood.

### Common Prerequisites/Conditions:
-   For many two-pointer problems (like finding a pair with a target sum), the array needs to be **sorted** first. The cost of sorting (e.g., O(N log N)) should be considered part of the overall solution if the input isn't already sorted.
-   The problem structure must lend itself to the idea of narrowing down a search space or processing elements based on the interaction of two positions.

### Example (Find Pair with Target Sum in Sorted Array):
Given \`arr = [1, 2, 4, 7, 11, 15]\` and \`targetSum = 9\`.
1.  \`left = 0\` (arr[0]=1), \`right = 5\` (arr[5]=15). \`sum = 1 + 15 = 16\`.
2.  \`16 > 9\`, so decrement \`right\`. \`left = 0\`, \`right = 4\` (arr[4]=11). \`sum = 1 + 11 = 12\`.
3.  \`12 > 9\`, so decrement \`right\`. \`left = 0\`, \`right = 3\` (arr[3]=7). \`sum = 1 + 7 = 8\`.
4.  \`8 < 9\`, so increment \`left\`. \`left = 1\` (arr[1]=2), \`right = 3\` (arr[3]=7). \`sum = 2 + 7 = 9\`.
5.  \`9 == 9\`. Pair found: (2, 7).

The visualizer for "Two Pointers" often demonstrates the "Find Pair with Target Sum" scenario.

### Common Use Cases:
-   Finding pairs in a sorted array with a specific sum.
-   Reversing an array or string.
-   Detecting palindromes.
-   Removing duplicates from a sorted array.
-   Container With Most Water problem.
-   Squaring a sorted array and keeping it sorted.
-   Three Sum problem (often by fixing one element and using two pointers on the rest).`,
  timeComplexities: {
    best: "Varies (e.g., O(N) for pair sum in sorted array, O(1) if target is immediately found)",
    average: "Varies (e.g., O(N))",
    worst: "Varies (e.g., O(N))",
  },
  spaceComplexity: "Typically O(1) (in-place modification or constant extra space).",
};

