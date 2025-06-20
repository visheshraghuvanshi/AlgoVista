
import type { AlgorithmMetadata } from './types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'top-k-elements',
  title: 'Top K Elements (Heap)',
  category: 'Data Structures', // Or "Sorting" if focusing on selection aspect
  difficulty: 'Medium',
  description: 'Finds the K largest (or smallest) elements in a collection, often using a min-heap (for K largest) or max-heap (for K smallest).',
  longDescription: `The "Top K Elements" problem involves finding the K elements with the highest (or lowest) values from a given collection of N elements. A common and efficient approach uses a heap data structure.

### Finding K Largest Elements (using a Min-Heap of size K):
1.  **Initialize Min-Heap**: Create a min-heap that can store up to K elements.
2.  **Iterate Through Input**: For each element \`num\` in the input array:
    a.  **Heap Not Full**: If the heap currently has fewer than K elements, add \`num\` to the heap.
    b.  **Heap Full, Current Element Larger**: If the heap already has K elements AND \`num\` is greater than the smallest element currently in the heap (which is the root of the min-heap, i.e., \`heap.peek()\`), then:
        i.  Remove the smallest element from the heap (\`heap.extractMin()\`).
        ii. Add \`num\` to the heap.
    c.  **Heap Full, Current Element Smaller or Equal**: If the heap has K elements and \`num\` is less than or equal to the heap's minimum, do nothing (this \`num\` cannot be among the K largest).
3.  **Result**: After iterating through all N input elements, the min-heap will contain the K largest elements from the input array. The root of the heap will be the Kth largest element.

### Finding K Smallest Elements (using a Max-Heap of size K):
The logic is analogous:
1.  Initialize a max-heap of size K.
2.  Iterate:
    a.  If heap size < K, add element.
    b.  If heap size == K AND current element < heap.peek() (max element in heap), then extract max and add current element.
3.  Result: Max-heap contains K smallest elements.

### Why this Works (for K Largest):
-   The min-heap always stores the K largest elements encountered *so far*.
-   When a new element arrives, it's compared against the *smallest* of these K largest elements (the heap's root).
-   If the new element is even larger than this smallest-of-the-current-top-K, then the smallest one is no longer among the true top K, so it's removed, and the new, larger element takes its place in the group of K largest seen.

### Time and Space Complexity:
-   **Time Complexity**: O(N log K). For each of the N elements, heap operations (insert, extract-min followed by insert) take O(log K) time because the heap size is bounded by K.
-   **Space Complexity**: O(K) to store the K elements in the heap.

This approach is more efficient than sorting the entire array (O(N log N)) and then picking the top K, especially if K is much smaller than N.

The AlgoVista visualizer for Top K Elements demonstrates finding the K largest elements using a min-heap.
`,
  timeComplexities: {
    best: "O(N log K)",
    average: "O(N log K)",
    worst: "O(N log K)",
  },
  spaceComplexity: "O(K) for the heap.",
};

    