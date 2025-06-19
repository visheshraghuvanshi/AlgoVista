
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'segment-tree',
  title: 'Segment Tree Operations',
  category: 'Trees',
  difficulty: 'Hard', // Corrected difficulty based on previous discussions if it was medium
  description: 'A tree data structure for storing information about intervals or segments. Efficiently allows querying and updating segment sums, minimums, maximums, etc.',
  longDescription: `A Segment Tree is a versatile tree data structure, typically a binary tree, used for storing information about intervals or segments of an array. It allows for efficient querying of properties over these segments (e.g., sum, minimum, maximum, GCD) and updating individual elements of the array.

### Core Idea:
-   Each node in the segment tree represents an interval of the original array.
-   The **root node** represents the entire array (e.g., interval \\\`[0, N-1]\\\`).
-   Each **leaf node** represents a single element of the array (e.g., node for \\\`arr[i]\\\` covers interval \\\`[i, i]\\\`).
-   Each **internal node** stores aggregate information about the union of its children's intervals. For example, if a node represents the interval \\\`[L, R]\\\`, its left child might represent \\\`[L, M]\\\` and its right child \\\`[M+1, R]\\\`, where \\\`M = floor((L+R)/2)\\\`. The value in the internal node would be the result of combining its children's values (e.g., sum of children's sums, min of children's mins).

### Array Representation (Common):
Segment trees are often implemented using an array for efficiency (similar to heaps).
-   If the original array has N elements, the segment tree array usually needs about \\\`2*N\\\` or \\\`4*N\\\` space (for 1-based or 0-based indexing and to accommodate a complete binary tree structure).
-   In an iterative, 1-indexed array implementation often used for simplicity in competitive programming (as visualized here):
    *   Leaf nodes (original array elements) are stored at indices \\\`N\\\` to \\\`2N-1\\\`.
    *   Internal nodes are at indices \\\`1\\\` to \\\`N-1\\\`.
    *   The parent of node \\\`i\\\` is at \\\`floor(i/2)\\\`.
    *   The children of node \\\`i\\\` are at \\\`2*i\\\` and \\\`2*i + 1\\\`.

### Building the Segment Tree (O(N)):
1.  **Place Leaves**: Copy the elements of the input array into the leaf positions of the segment tree array (e.g., \\\`tree[N+i] = inputArray[i]\\\`).
2.  **Compute Internal Nodes**: Iterate from \\\`N-1\\\` down to \\\`1\\\`. For each node \\\`i\\\`, compute its value based on its children: \\\`tree[i] = combine(tree[2*i], tree[2*i + 1])\\\`. The \\\`combine\\\` operation depends on the query type (e.g., addition for sum queries).

### Point Update (O(log N)):
To update the value of an element at index \\\`idx\\\` in the original array:
1.  Update the corresponding leaf node in the segment tree: \\\`tree[N+idx] = newValue\\\`.
2.  Traverse upwards from this leaf to the root, recomputing the value of each parent based on its (now possibly changed) children: \\\`pos = floor(pos/2)\\\`, \\\`tree[pos] = combine(tree[2*pos], tree[2*pos+1])\\\`.

### Range Query (O(log N)):
To query an interval \\\`[L, R)\\\` (L inclusive, R exclusive) in the original array:
1.  Adjust \\\`L\\\` and \\\`R\\\` to correspond to leaf positions in the segment tree array: \\\`L += N\\\`, \\\`R += N\\\`.
2.  Initialize \\\`result\\\` (e.g., 0 for sum, infinity for min).
3.  Iterate while \\\`L < R\\\`:
    *   If \\\`L\\\` is odd (it's a right child), its value contributes to the range. Combine \\\`tree[L]\\\` with \\\`result\\\`, then move \\\`L\\\` to the parent of its right sibling (\\\`L++\\\` then \\\`L = floor(L/2)\\\` effectively, or simply \\\`L++\\\` and next iteration handles parent).
    *   If \\\`R\\\` is odd (it's a right child), its left sibling \\\`tree[R-1]\\\` contributes. Combine \\\`tree[R-1]\\\` with \\\`result\\\`, then move \\\`R\\\` to its parent (\\\`R--\\\` then \\\`R = floor(R/2)\\\`).
    *   Move \\\`L\\\` and \\\`R\\\` to their parents: \\\`L = floor(L/2)\\\`, \\\`R = floor(R/2)\\\`.
4.  Return \\\`result\\\`.
(The exact loop structure for iterative query can vary slightly but aims to cover the range by including maximal segments fully contained within the query range.)

### Advantages:
-   Efficient range queries and point updates (both O(log N)).
-   Versatile: Can be adapted for various range operations (sum, min, max, GCD, etc.) by changing the combination logic.

### Disadvantages:
-   Can be more complex to implement than simple array iteration for some problems.
-   Requires more space (O(N)) than the original array.
-   Range updates (updating all elements in a range) require more advanced techniques like lazy propagation to remain efficient.

### Common Use Cases:
-   **Range Sum Queries (RSQ)**: Find the sum of elements in a given range.
-   **Range Minimum/Maximum Queries (RMQ)**: Find the min/max element in a range.
-   Problems in competitive programming involving dynamic array queries.
-   Computational geometry.
-   Database indexing for range searches.

The AlgoVista visualizer focuses on the iterative array-based implementation for Sum Segment Trees.`,
  timeComplexities: {
    best: "Build: O(N), Query: O(log N), Update: O(log N)",
    average: "Build: O(N), Query: O(log N), Update: O(log N)",
    worst: "Build: O(N), Query: O(log N), Update: O(log N)",
  },
  spaceComplexity: "O(N) for the tree structure (typically 2N or 4N elements in array representation).",
};
