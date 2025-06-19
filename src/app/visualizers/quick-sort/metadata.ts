
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'quick-sort',
  title: 'Quick Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A highly efficient divide-and-conquer sorting algorithm that picks a pivot and partitions the array around it.',
  longDescription: `Quick Sort is a highly efficient, comparison-based, in-place sorting algorithm that uses a **divide and conquer** strategy. It's one of the most widely used sorting algorithms due to its good average-case performance.

### How it Works:
The core idea is to select an element from the array as a **pivot** and then partition the other elements into two sub-arrays according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.

**1. Choose a Pivot:**
   - An element is chosen from the array to be the pivot. Common strategies include:
     *   Picking the first element.
     *   Picking the last element (common in Lomuto partition scheme, visualized here).
     *   Picking a random element.
     *   Picking the median of three elements (e.g., first, middle, last).
   - The choice of pivot significantly impacts performance. A good pivot ideally splits the array into roughly equal halves.

**2. Partitioning:**
   - The array is rearranged so that all elements smaller than the pivot are placed to its left, and all elements greater than the pivot are placed to its right. Elements equal to the pivot can go on either side or be grouped.
   - After partitioning, the pivot element is in its final sorted position.
   - **Lomuto Partition Scheme (Example):**
     a.  The last element \\\`arr[high]\\\` is chosen as the pivot.
     b.  An index \\\`i\\\` (the "wall" or "swap index") is initialized to \\\`low - 1\\\`.
     c.  Iterate with index \\\`j\\\` from \\\`low\\\` to \\\`high - 1\\\`.
     d.  If \\\`arr[j]\\\` is less than (or equal to, depending on implementation) the pivot:
         i.  Increment \\\`i\\\`.
         ii. Swap \\\`arr[i]\\\` with \\\`arr[j]\\\`.
     e.  After the loop, swap the pivot element (\\\`arr[high]\\\`) with \\\`arr[i + 1]\\\`.
     f.  The pivot is now at index \\\`i + 1\\\`, which is its correct sorted position. Return this index.
   - **Hoare Partition Scheme** is another common partitioning method that often performs better by using two pointers that move from both ends of the array towards the center.

**3. Conquer (Recursive Calls):**
   - After partitioning, the pivot is in its correct place.
   - Recursively apply Quick Sort to the sub-array of elements to the left of the pivot (elements smaller than the pivot).
   - Recursively apply Quick Sort to the sub-array of elements to the right of the pivot (elements greater than the pivot).

**Base Case for Recursion:**
-   The recursion stops when a sub-array has zero or one element, as such arrays are already sorted.

### Characteristics:
-   **Divide and Conquer**: Yes.
-   **In-Place**: Typically implemented as an in-place sort, meaning it requires only a small, constant amount of auxiliary memory (O(log N) to O(N) for the recursion call stack).
-   **Not Stable**: It does not preserve the relative order of equal elements. For example, if an array has two identical numbers, their order might be swapped after sorting.
-   **Adaptive**: Performance can vary based on pivot selection and initial data order.

### Example: Sorting \\\`arr = [7, 2, 1, 6, 8, 5, 3, 4]\\\` with pivot as last element (Lomuto)
1.  **Initial Call**: \\\`quickSort([7, 2, 1, 6, 8, 5, 3, 4], 0, 7)\\\`. Pivot = 4.
    *   Partition: \\\`i\\\` starts at -1.
        *   j=0, arr[0]=7 > 4.
        *   j=1, arr[1]=2 < 4. i=0. Swap arr[0](7) and arr[1](2) -> \\\`[2, 7, 1, 6, 8, 5, 3, 4]\\\`
        *   j=2, arr[2]=1 < 4. i=1. Swap arr[1](7) and arr[2](1) -> \\\`[2, 1, 7, 6, 8, 5, 3, 4]\\\`
        *   j=3, arr[3]=6 > 4.
        *   j=4, arr[4]=8 > 4.
        *   j=5, arr[5]=5 > 4.
        *   j=6, arr[6]=3 < 4. i=2. Swap arr[2](7) and arr[6](3) -> \\\`[2, 1, 3, 6, 8, 5, 7, 4]\\\`
    *   End of loop. Swap pivot arr[7](4) with arr[i+1]=arr[3](6) -> \\\`[2, 1, 3, 4, 8, 5, 7, 6]\\\`. Pivot (4) is at index 3.
2.  **Recursive Calls**:
    *   \\\`quickSort([2, 1, 3], 0, 2)\\\` (left sub-array)
    *   \\\`quickSort([8, 5, 7, 6], 4, 7)\\\` (right sub-array)
    ...and so on.

### Advantages:
-   **Fast on Average**: O(N log N) average time complexity, making it one of the fastest comparison sorts.
-   **In-Place**: Requires minimal extra space (for recursion stack).
-   Low constant factor overhead in its operations.

### Disadvantages:
-   **Worst-Case O(N²)**: Occurs if pivot selection is consistently poor (e.g., always picking the smallest or largest element in an already sorted or reverse-sorted array). This leads to highly unbalanced partitions.
-   **Not Stable**: As mentioned, does not preserve the order of equal elements.
-   Recursive nature can lead to stack overflow for very large arrays if not implemented carefully (e.g., with tail call optimization or conversion to an iterative version).

### Common Use Cases:
-   Widely used in practice due to its good average-case performance.
-   Many standard library sort functions use variations of Quick Sort (often hybrid algorithms like Introsort, which switches to Heap Sort for worst-case scenarios and Insertion Sort for small partitions).
-   Problems requiring efficient in-place sorting.`,
  timeComplexities: {
    best: "O(N log N) (balanced partitions)",
    average: "O(N log N)",
    worst: "O(N²) (unbalanced partitions)",
  },
  spaceComplexity: "O(log N) (average recursion stack), O(N) (worst-case recursion stack)",
};
