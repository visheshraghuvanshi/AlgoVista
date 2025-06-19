
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'heap-sort',
  title: 'Heap Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A comparison-based sorting algorithm that uses a binary heap data structure. In-place with O(n log n) complexity.',
  longDescription: `Heap Sort is an efficient, comparison-based, in-place sorting algorithm. It leverages a data structure called a **binary heap** (usually a max-heap for sorting in ascending order) to manage elements. The algorithm can be thought of as an improved version of selection sort: like selection sort, it divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element and moving it to the sorted region.

### How it Works:
The algorithm consists of two main phases:

**Phase 1: Build Max Heap**
1.  Convert the input array into a max heap. A max heap is a complete binary tree where the value of each node is greater than or equal to the values of its children. The largest element is always at the root of the heap.
2.  This can be done efficiently in O(N) time by starting from the last non-leaf node (index \\\`floor(N/2) - 1\\\`) and calling a \\\`heapifyDown\\\` (or \\\`siftDown\\\`) operation on each node up to the root.
    *   **\\\`heapifyDown(array, heapSize, rootIndex)\\\`**: This procedure ensures that the subtree rooted at \\\`rootIndex\\\` satisfies the max heap property, assuming its children's subtrees are already max heaps. It compares the root with its children, finds the largest among them, and if the root is not the largest, it swaps the root with the largest child and recursively calls \\\`heapifyDown\\\` on the affected child's subtree.

**Phase 2: Sort the Heap (Extract Max Elements)**
1.  The largest element in the array is now at the root (index 0) of the max heap.
2.  Swap the root element with the last element of the current heap (which is also the last element of the unsorted portion of the array). This moves the largest element to its final sorted position at the end of the array.
3.  Reduce the conceptual size of the heap by one (effectively excluding the now-sorted element from further heap operations).
4.  Call \\\`heapifyDown\\\` on the new root (index 0) of the reduced heap to restore the max heap property.
5.  Repeat steps 2-4 until the heap size becomes 1 (or 0). The array will then be sorted in ascending order.

### Characteristics:
-   **Comparison Sort**: Relies on comparisons between elements.
-   **In-Place**: Typically implemented as an in-place sort, meaning it requires only a small, constant amount of auxiliary memory (O(log N) to O(N) for the recursion call stack).
-   **Not Stable**: It does not preserve the relative order of equal elements. For example, if an array has two identical numbers, their order might be swapped after sorting.
-   **Time Complexity**: O(N log N) for all cases (best, average, and worst).
    *   Building the heap takes O(N) time.
    *   Each of the N-1 \\\`extractMax\\\` operations (swap + heapifyDown) takes O(log N) time.
-   **Space Complexity**: O(1) auxiliary space (if heapify is iterative or tail-call optimized) or O(log N) for the recursion stack.

### Example: Sorting \\\`arr = [4, 10, 3, 5, 1]\\\`
1.  **Build Max Heap**:
    *   Start heapifyDown from last non-leaf (index 1, value 10). No change.
    *   HeapifyDown from index 0 (value 4). Swap 4 with 10. arr becomes \\\`[10, 4, 3, 5, 1]\\\`. Then heapify 4: swap 4 with 5. arr becomes \\\`[10, 5, 3, 4, 1]\\\`. Heap is now \\\`[10, 5, 3, 4, 1]\\\`.
2.  **Sort Phase**:
    *   **N=5**: Swap arr[0](10) with arr[4](1) -> \\\`[1, 5, 3, 4, 10]\\\`. Heap size = 4. Heapify(arr, 4, 0) on \\\`[1, 5, 3, 4]\\\`. Resulting heap part: \\\`[5, 4, 3, 1]\\\`. Array becomes: \\\`[5, 4, 3, 1, 10]\\\`. (10 is sorted)
    *   **N=4**: Swap arr[0](5) with arr[3](1) -> \\\`[1, 4, 3, 5]\\\`. Heap size = 3. Heapify(arr, 3, 0) on \\\`[1, 4, 3]\\\`. Resulting heap part: \\\`[4, 1, 3]\\\`. Array becomes: \\\`[4, 1, 3, 5, 10]\\\`. (5, 10 are sorted)
    *   ...and so on.

### Advantages:
-   **Guaranteed O(N log N) Time Complexity**: Efficient and reliable for large datasets.
-   **In-Place Sorting**: Space efficient.

### Disadvantages:
-   **Not Stable**: Can change the relative order of equal elements.
-   **Poor Cache Performance**: Heap operations often jump around in memory, which can be less cache-friendly than algorithms like Merge Sort or Quick Sort on some architectures.
-   More complex to implement than simpler sorts like Insertion Sort.

### Common Use Cases:
-   When an in-place O(N log N) sort is required and stability is not a concern.
-   Used in priority queue implementations.
-   Good for situations where a guaranteed worst-case O(N log N) is needed, unlike Quick Sort which can degrade to O(N²).
-   The \\\`heapify\\\` process is useful for finding the k-th smallest/largest elements efficiently.
`,
  timeComplexities: {
    best: "O(N log N)",
    average: "O(N log N)",
    worst: "O(N log N)"
  },
  spaceComplexity: "O(1) (in-place algorithm, though O(log N) or O(N) for recursion stack if heapify is recursive and not optimized for tail calls)",
};
