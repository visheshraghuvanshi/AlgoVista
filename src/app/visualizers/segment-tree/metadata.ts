
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'segment-tree',
  title: 'Segment Tree Operations',
  category: 'Trees',
  difficulty: 'Hard', 
  description: 'A tree data structure for storing information about intervals or segments. Efficiently allows querying and updating segment sums, minimums, maximums, etc.',
  longDescription: `A Segment Tree is a versatile tree data structure, typically a binary tree, used for storing information about intervals or segments of an array. It allows for efficient querying of properties over these segments (e.g., sum, minimum, maximum, GCD) and updating individual elements of the array.

### Core Idea:
-   Each node in the segment tree represents an interval of the original array.
-   The **root node** represents the entire array (e.g., interval \\\`[0, N-1]\\\`).
-   Each **leaf node** represents a single element of the array (e.g., node for \\\`arr[i]\\\` covers interval \\\`[i, i]\\\`).
-   Each **internal node** stores aggregate information about the union of its children's intervals. For example, if a node represents the interval \\\`[L, R]\\\`, its left child might represent \\\`[L, M]\\\` and its right child \\\`[M+1, R]\\\`, where \\\`M = floor((L+R)/2)\\\`. The value in the internal node would be the result of combining its children's values (e.g., sum of children's sums, min of children's mins).

### Array Representation (Common - Iterative Version):
Segment trees are often implemented using an array for efficiency (similar to heaps). The iterative implementation visualized here is common in competitive programming.
-   If the original array has N elements, the segment tree array (\\\`tree[]\\\`) usually has size \\\`2*N\\\`.
-   **Leaf nodes** (original array elements) are stored at indices \\\`N\\\` to \\\`2N-1\\\` in the tree array. So, \\\`inputArray[i]\\\` corresponds to \\\`tree[N+i]\\\`.
-   **Internal nodes** are stored at indices \\\`1\\\` to \\\`N-1\\\`.
-   The **root** is at index \\\`1\\\`.
-   For an internal node at index \\\`p\\\`:
    *   Its left child is at index \\\`2*p\\\`.
    *   Its right child is at index \\\`2*p + 1\\\`.
    *   Its parent is at index \\\`floor(p/2)\\\`.

### Building the Segment Tree (Iterative, O(N)):
1.  **Place Leaves**: Copy the elements of the input array into the leaf positions of the segment tree array: \\\`tree[N+i] = inputArray[i]\\\` for \\\`i\\\` from 0 to N-1.
2.  **Compute Internal Nodes**: Iterate backwards from \\\`N-1\\\` down to \\\`1\\\`. For each node \\\`p\\\`, compute its value based on its children: \\\`tree[p] = combine(tree[2*p], tree[2*p + 1])\\\`. The \\\`combine\\\` operation depends on the query type (e.g., addition for sum queries, \`Math.min\` for min queries).

### Point Update (Iterative, O(log N)):
To update the value of an element at index \\\`idx\\\` in the original array to \\\`newValue\\\`:
1.  Calculate the corresponding leaf position in the segment tree: \\\`pos = N + idx\\\`.
2.  Update the leaf: \\\`tree[pos] = newValue\\\`.
3.  Traverse upwards from this leaf to the root, recomputing the value of each parent. While \\\`pos > 1\\\`:
    *   \\\`pos = floor(pos / 2)\\\` (move to parent).
    *   \\\`tree[pos] = combine(tree[2*pos], tree[2*pos + 1])\\\`.

### Range Query (Iterative, O(log N)):
To query an interval \\\`[L, R)\\\` (L inclusive, R exclusive) in the original array:
1.  Adjust \\\`L\\\` and \\\`R\\\` to correspond to leaf positions in the segment tree array: \\\`L += N\\\`, \\\`R += N\\\`.
2.  Initialize \\\`result\\\` (e.g., 0 for sum, infinity for min).
3.  Iterate while \\\`L < R\\\`:
    *   If \\\`L\\\` is odd (i.e., \\\`L % 2 === 1\\\`), it means \\\`tree[L]\\\` is a right child, and its segment is fully contained in the current query range. Combine \\\`tree[L]\\\` with \\\`result\\\`, then increment \\\`L\\\` (\\\`L++\\\`) to move past it.
    *   If \\\`R\\\` is odd (i.e., \\\`R % 2 === 1\\\`), it means \\\`tree[R-1]\` (the left sibling of the node \\\`R\` conceptually points to) is fully contained. Decrement \\\`R\\\` (\\\`R--\\\`) to consider \\\`tree[R]\\\` (which is now the left sibling), combine \\\`tree[R]\\\` with \\\`result\\\`.
    *   Move \\\`L\\\` and \\\`R\\\` to their parents: \\\`L = floor(L/2)\\\`, \\\`R = floor(R/2)\\\`.
4.  Return \\\`result\\\`.

### Advantages:
-   Efficient range queries and point updates (both O(log N)).
-   Versatile: Can be adapted for various range operations (sum, min, max, GCD, etc.) by changing the combination logic.

### Disadvantages:
-   Can be more complex to implement than simple array iteration for some problems.
-   Requires more space (O(N)) than the original array.
-   Range updates (updating all elements in a range, e.g., add X to all elements in \\\`[L,R)\\\`) require more advanced techniques like **lazy propagation** to remain efficient (O(log N) for range updates). The basic segment tree shown here supports O(N) range updates if done naively by updating each element.

### Common Use Cases:
-   **Range Sum Queries (RSQ)**: Find the sum of elements in a given range.
-   **Range Minimum/Maximum Queries (RMQ)**: Find the min/max element in a range.
-   Problems in competitive programming involving dynamic array queries.
-   Computational geometry.
-   Database indexing for range searches.

The AlgoVista visualizer focuses on the iterative array-based implementation for Sum Segment Trees, showing the tree's array representation and how build, query, and update operations traverse and modify it.`,
  timeComplexities: {
    best: "Build: O(N), Query: O(log N), Update: O(log N)",
    average: "Build: O(N), Query: O(log N), Update: O(log N)",
    worst: "Build: O(N), Query: O(log N), Update: O(log N)",
  },
  spaceComplexity: "O(N) for the tree structure (typically 2N elements in array representation).",
};


    