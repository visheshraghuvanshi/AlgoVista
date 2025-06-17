
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'segment-tree',
  title: 'Segment Tree Operations',
  category: 'Trees',
  difficulty: 'Hard',
  description: 'A tree data structure for storing information about intervals or segments. Efficiently allows querying and updating segment sums, minimums, maximums, etc.',
  longDescription: 'A Segment Tree is a versatile tree data structure used for storing information about intervals or segments. Each node in the segment tree represents an interval or segment of an array. It is particularly useful for range queries (e.g., find the sum of elements in a range, find the minimum/maximum in a range) and point updates on an array in logarithmic time.\\n\\nBuilding a Segment Tree:\\n- The tree is typically a complete binary tree.\\n- Leaf nodes represent individual elements of the input array.\\n- Each internal node represents the union (or merge) of its children\'s intervals. The value stored in an internal node depends on the operation (e.g., sum of children for range sum queries, min/max for range min/max queries).\\n- Construction takes O(N) time.\\n\\nKey Operations:\\n- **Query (Range Query)**: To query an interval [L, R), traverse the tree. If a node\'s segment is completely within [L, R), use its value. If it partially overlaps, recurse on its children. If it doesn\'t overlap, ignore it. O(log N) time.\\n- **Update (Point Update)**: To update an element at index `i` to a new value, update the corresponding leaf node. Then, recursively update all its ancestors up to the root. O(log N) time.\\n\\nSegment trees can be implemented iteratively or recursively. Iterative implementations are often more space-efficient for the tree array (using `2*N` space where N is array size, with leaves at `N` to `2N-1`).\\n\\nUse Cases: Range Sum Queries (RSQ), Range Minimum/Maximum Queries (RMQ), problems involving dynamic updates and queries on array segments.',
  timeComplexities: {
    best: "Build: O(N), Query: O(log N), Update: O(log N)",
    average: "Build: O(N), Query: O(log N), Update: O(log N)",
    worst: "Build: O(N), Query: O(log N), Update: O(log N)",
  },
  spaceComplexity: "O(N) for the tree structure (typically 2N or 4N elements in array representation).",
};
