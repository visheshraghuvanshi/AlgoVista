
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'merge-sort',
  title: 'Merge Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A divide-and-conquer algorithm that sorts by recursively dividing the array and merging sorted subarrays.',
  longDescription: `Merge Sort is an efficient, stable, comparison-based sorting algorithm that exemplifies the **divide and conquer** paradigm. The fundamental idea is to break down a problem into smaller, more manageable subproblems, solve those subproblems recursively, and then combine their solutions to solve the original problem.

### How it Works:
The process involves two main phases:
1.  **Divide**:
    *   If the given array has zero or one element, it is considered already sorted, and the process stops for this segment (this is the base case of the recursion).
    *   Otherwise, the unsorted array is divided into two (approximately) equal halves.
    *   This division process is applied recursively to both halves until all subarrays contain only a single element.

2.  **Conquer (Merge)**:
    *   Once the base case is reached for all subarrays (i.e., all subarrays have a single element), the algorithm starts merging these sorted subarrays back together.
    *   Two sorted subarrays are merged to produce a larger sorted subarray. This merge operation is the core of the algorithm:
        a.  Create temporary arrays (e.g., \`L[]\` and \`R[]\`) to hold the elements of the two subarrays to be merged.
        b.  Initialize three pointers: \`i\` for \`L[]\`, \`j\` for \`R[]\`, and \`k\` for the original array segment \`arr[]\` where the merged result will be placed.
        c.  Compare \`L[i]\` and \`R[j]\`. The smaller of the two is copied to \`arr[k]\`.
        d.  Increment the pointer of the array from which the element was copied (\`i\` or \`j\`) and also increment \`k\`.
        e.  Repeat step (c-d) until all elements from one of the temporary arrays have been copied.
        f.  Copy any remaining elements from the other temporary array (if any) to \`arr[]\`.
    *   This merging process continues up the recursion tree until the entire original array is merged into a single sorted array.

### Characteristics:
-   **Divide and Conquer**: Clearly follows this algorithmic strategy.
-   **Stable Sort**: It maintains the relative order of equal elements, meaning if two elements have the same value, their order in the input array will be preserved in the sorted output array.
-   **Not In-Place (Typically)**: Standard implementations require O(N) auxiliary space to store the temporary arrays used during the merge step. While in-place merge sort algorithms exist, they are significantly more complex and may not be stable or as performant in practice.
-   **Predictable Performance**: The time complexity is consistently O(N log N) for all cases.

### Example: Sorting \`arr = [38, 27, 43, 3, 9, 82, 10]\`
1.  **Divide**:
    *   \`[38, 27, 43, 3]\` and \`[9, 82, 10]\`
    *   \`[38, 27]\`, \`[43, 3]\` and \`[9, 82]\`, \`[10]\`
    *   \`[38]\`, \`[27]\`, \`[43]\`, \`[3]\` and \`[9]\`, \`[82]\`, \`[10]\` (base cases, all sorted)
2.  **Merge**:
    *   Merge \`[38]\` and \`[27]\` -> \`[27, 38]\`
    *   Merge \`[43]\` and \`[3]\` -> \`[3, 43]\`
    *   Merge \`[9]\` and \`[82]\` -> \`[9, 82]\`
    *   \`[10]\` is already sorted.
    *   Merge \`[27, 38]\` and \`[3, 43]\` -> \`[3, 27, 38, 43]\`
    *   Merge \`[9, 82]\` and \`[10]\` -> \`[9, 10, 82]\`
    *   Merge \`[3, 27, 38, 43]\` and \`[9, 10, 82]\` -> \`[3, 9, 10, 27, 38, 43, 82]\` (Final sorted array)

### Advantages:
-   **Guaranteed O(N log N) Time Complexity**: Performs consistently well regardless of the initial order of elements (best, average, and worst cases are all O(N log N)).
-   **Stable**: Preserves the original order of equal elements.
-   **Efficient for External Sorting**: Its sequential access pattern during merging makes it suitable for sorting large datasets that do not fit entirely into memory (e.g., sorting files on disk).
-   Parallelizable due to its divide-and-conquer nature.

### Disadvantages:
-   **Space Complexity**: Requires O(N) auxiliary space for the temporary arrays used in the merge step. This can be a significant drawback for memory-constrained systems or very large arrays that could otherwise be sorted in-place (though O(1) auxiliary space versions exist, they are complex).
-   **Slower for Small Datasets**: Compared to simpler O(N²) algorithms like Insertion Sort, Merge Sort has higher constant factor overheads, making it less efficient for very small arrays. This is why hybrid sorting algorithms (like Timsort) often switch to Insertion Sort for small subarrays.

### Common Use Cases:
-   General-purpose sorting when stability and guaranteed performance are critical.
-   Sorting linked lists (as it doesn't rely on random access and can merge linked lists efficiently).
-   Used as a subroutine in other algorithms (e.g., external sorting).
-   Often a part of standard library sorting functions in various programming languages, sometimes in a hybrid form.`,
  timeComplexities: {
    best: "O(N log N)",
    average: "O(N log N)",
    worst: "O(N log N)",
  },
  spaceComplexity: "O(N) due to the auxiliary space used for merging.",
};
