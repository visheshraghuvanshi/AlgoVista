"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { AlgorithmMetadata } from '@/types';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizerCard } from '@/components/algo-vista/visualizer-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ListFilter, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MOCK_ALGORITHMS: AlgorithmMetadata[] = [
  // SECTION I: Fundamentals
  { 
    slug: 'linear-search', 
    title: 'Linear Search', 
    category: 'Fundamentals', 
    difficulty: 'Easy', 
    description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched. A basic introduction to search operations.' 
  },
  { 
    slug: 'binary-search', 
    title: 'Binary Search', 
    category: 'Fundamentals', 
    difficulty: 'Easy', 
    description: 'Efficiently finds an item from a sorted list by repeatedly dividing the search interval in half. Introduces logarithmic time complexity.' 
  },
  { 
    slug: 'bubble-sort', 
    title: 'Bubble Sort', 
    category: 'Fundamentals', 
    difficulty: 'Easy', 
    description: 'A simple comparison-based sorting algorithm where adjacent elements are repeatedly compared and swapped. Good for understanding basic sorting loops.'
  },
  { 
    slug: 'selection-sort', 
    title: 'Selection Sort', 
    category: 'Fundamentals', 
    difficulty: 'Easy', 
    description: 'Repeatedly finds the minimum element from the unsorted part and puts it at the beginning. Simple to understand in-place sorting.'
  },
  { 
    slug: 'insertion-sort', 
    title: 'Insertion Sort', 
    category: 'Fundamentals', 
    difficulty: 'Easy', 
    description: 'Builds the final sorted array one item at a time by inserting each element into its proper place in the sorted part. Efficient for small or nearly sorted data.'
  },

  // SECTION II: Sorting Algorithms
  { 
    slug: 'merge-sort', 
    title: 'Merge Sort', 
    category: 'Sorting', 
    difficulty: 'Medium', 
    description: 'A divide-and-conquer algorithm that divides the array into halves, sorts them, and then merges them back together. Stable and efficient.'
  },
  { 
    slug: 'quick-sort', 
    title: 'Quick Sort', 
    category: 'Sorting', 
    difficulty: 'Medium', 
    description: 'A highly efficient divide-and-conquer sorting algorithm that picks an element as a pivot and partitions the array around the pivot.'
  },
  { 
    slug: 'heap-sort', 
    title: 'Heap Sort', 
    category: 'Sorting', 
    difficulty: 'Hard', 
    description: 'A comparison-based sorting technique based on a Binary Heap data structure. In-place with O(n log n) complexity.'
  },
  { 
    slug: 'counting-sort', 
    title: 'Counting Sort', 
    category: 'Sorting', 
    difficulty: 'Medium', 
    description: "An integer sorting algorithm that operates by counting the number of occurrences of each distinct key value. It's efficient when the range of input values (k) is not significantly larger than the number of items (n). It's not a comparison sort and is often used as a subroutine in Radix Sort. The algorithm involves creating a count array to store frequencies, then modifying it to store cumulative counts which determine the position of each element in the sorted output."
  },
  { 
    slug: 'radix-sort', 
    title: 'Radix Sort', 
    category: 'Sorting', 
    difficulty: 'Hard', 
    description: "A non-comparison integer sorting algorithm that sorts data with integer keys by grouping keys by individual digits (or bits) which share the same significant position and value. It processes numbers digit by digit, from least significant to most significant (LSD) or vice-versa (MSD). It typically uses a stable sorting algorithm, like Counting Sort, as a subroutine for sorting based on each digit."
  },
  { 
    slug: 'bucket-sort', 
    title: 'Bucket Sort', 
    category: 'Sorting', 
    difficulty: 'Medium', 
    description: "A distribution sort algorithm that works by distributing elements into a number of buckets. Each bucket is then sorted individually, either using a different sorting algorithm (like insertion sort) or by recursively applying bucket sort. Bucket Sort is efficient if the input data is uniformly distributed over a range, allowing for near linear time complexity in the average case."
  },
  { 
    slug: 'shell-sort', 
    title: 'Shell Sort', 
    category: 'Sorting', 
    difficulty: 'Medium', 
    description: "An in-place comparison sort and a generalization of insertion sort. It allows the exchange of items that are far apart by starting with a large gap, then progressively reducing the gap between elements to be compared. This makes it more efficient than simple insertion sort for larger datasets as it moves out-of-place elements more quickly towards their correct positions. The choice of gap sequence is crucial for its performance."
  },
  { 
    slug: 'cocktail-sort', 
    title: 'Cocktail Shaker Sort', 
    category: 'Sorting', 
    difficulty: 'Easy', 
    description: 'A variation of Bubble Sort that sorts in both directions on each pass through the list. It passes through the list from left to right, then from right to left, continuously swapping adjacent elements if they are in the wrong order.'
  },

  // SECTION III: Arrays & Search
  { 
    slug: 'jump-search', 
    title: 'Jump Search', 
    category: 'Arrays & Search', 
    difficulty: 'Easy', 
    description: 'A searching algorithm for sorted arrays that improves upon linear search by checking fewer elements. The basic idea is to "jump" ahead by fixed steps (block size, typically √n) and then perform a linear search within that block if the target element might be present.'
  },
  { 
    slug: 'ternary-search', 
    title: 'Ternary Search', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'A divide and conquer search algorithm that finds the position of an element in a sorted array. It divides the array into three parts and determines which part might contain the target. It is applicable to unimodal functions for finding maxima/minima.'
  },
  { 
    slug: 'kadanes-algorithm', 
    title: 'Kadane’s Algorithm', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'An efficient dynamic programming algorithm used to find the maximum sum contiguous subarray within a given one-dimensional array of numbers. It iterates through the array, keeping track of the maximum sum ending at the current position and the overall maximum sum found so far.'
  },
  { 
    slug: 'two-pointers', 
    title: 'Two Pointers Technique', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'A common and versatile technique for array traversal where two pointers iterate through the data structure, often from opposite ends or one fast and one slow, until they meet or a certain condition is satisfied. Useful for problems like finding pairs with a specific sum, reversing arrays, or detecting cycles.'
  },
  { 
    slug: 'sliding-window', 
    title: 'Sliding Window Technique', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'A technique used for efficiently finding a subarray or substring that satisfies given conditions. It involves maintaining a "window" of a certain size or properties that slides through the data structure, typically an array or string, adjusting its start and end points based on problem constraints.'
  },
  { 
    slug: 'dutch-national-flag', 
    title: 'Dutch National Flag Algorithm', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'An algorithm for sorting an array containing three distinct values (e.g., 0s, 1s, and 2s, often representing colors of the Dutch flag) in linear time and O(1) space. It partitions the array into three sections based on a pivot value (typically 1).'
  },
  { 
    slug: 'subarray-sum-problems', 
    title: 'Subarray Sum Variants', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'A class of problems focused on finding subarrays whose elements sum up to a target value, or possess specific sum-related properties (e.g., maximum sum, zero sum, sum closest to target). Techniques like prefix sums, Kadane\'s algorithm, or hash maps are often employed.'
  },

  // SECTION IV: Linked Lists
  {
    slug: 'singly-linked-list',
    title: 'Singly Linked List Ops',
    category: 'Linked List',
    difficulty: 'Easy',
    description: 'Explore fundamental operations like insertion, deletion, search, and traversal in a singly linked list. Understand how nodes connect in one direction.',
    longDescription: 'A Singly Linked List is a linear data structure where elements (nodes) are not stored at contiguous memory locations. Each node consists of two parts: data and a pointer (or link) to the next node in the sequence. The last node points to null, indicating the end of the list. Common operations include: insertion (at head, tail, or specific position), deletion (of head, tail, or a specific value/position), search (finding a node with a given value), and traversal (visiting all nodes). Time complexity for access/search is O(n). Insertion/deletion at the head is O(1), while at the tail it is O(n) unless a tail pointer is maintained (then O(1)).'
  },
  {
    slug: 'doubly-linked-list',
    title: 'Doubly Linked List Ops',
    category: 'Linked List',
    difficulty: 'Medium',
    description: 'Discover operations on doubly linked lists, where each node points to both next and previous nodes, enabling bidirectional traversal and more efficient deletions.',
    longDescription: 'A Doubly Linked List enhances the singly linked list by adding a pointer in each node to the previous node in the sequence, in addition to the next node pointer. This allows for bidirectional traversal (forward and backward). Operations like insertion and deletion can be more efficient if the node to be modified (or its neighbor) is known, as direct access to the previous node simplifies pointer updates. Search complexity remains O(n). Insertion/deletion at head or tail (if tail pointer is maintained) is O(1). Deletion of a known node (given a pointer to it) is O(1).'
  },
  {
    slug: 'circular-linked-list',
    title: 'Circular Linked List Ops',
    category: 'Linked List',
    difficulty: 'Medium',
    description: 'Learn about circular linked lists where the last node points back to the first, forming a loop. Useful for round-robin scenarios and continuous cycles.',
    longDescription: 'In a Circular Linked List, the `next` pointer of the last node points back to the first node (head) instead of null, forming a continuous loop. This structure can be singly or doubly linked. It is useful in applications that require cyclical processing or where the list should seamlessly wrap around, such as task schedulers or buffers. Traversal requires careful handling of termination conditions to avoid infinite loops. Operations like insertion and deletion need to correctly maintain the circular linkage, especially when modifying the head or tail.'
  },
  {
    slug: 'linked-list-reversal',
    title: 'Linked List Reversal',
    category: 'Linked List',
    difficulty: 'Medium',
    description: 'Visualize how to reverse the order of nodes in a linked list, a common interview problem. Both iterative (three-pointer) and recursive approaches are fundamental.',
    longDescription: 'Reversing a linked list means reordering its nodes so that the direction of links is inverted; the original tail becomes the new head, and the original head becomes the new tail. This can be achieved iteratively using three pointers (previous, current, next) to update `next` pointers in a single pass (O(n) time, O(1) space). Alternatively, a recursive approach can be used: reverse the rest of the list (from the second node onwards), then make the original second node point to the original first node, and set the original first node\'s `next` to null. The recursive solution also takes O(n) time but uses O(n) stack space due to recursion depth.'
  },
  {
    slug: 'linked-list-cycle-detection',
    title: 'Linked List Cycle Detection',
    category: 'Linked List',
    difficulty: 'Medium',
    description: "Detect if a linked list contains a cycle (i.e., a node points back to a previously visited node). Floyd's Tortoise and Hare algorithm is a classic solution.",
    longDescription: 'A cycle in a linked list occurs if, by following the `next` pointers, a node is encountered more than once. Floyd\'s Tortoise and Hare algorithm is an efficient method to detect such cycles. It uses two pointers: a "slow" pointer that moves one step at a time, and a "fast" pointer that moves two steps at a time. If the list contains a cycle, the fast pointer will eventually enter the cycle and lap the slow pointer (they will meet at some node within the cycle). If the fast pointer reaches the end of the list (null), no cycle exists. This algorithm runs in O(n) time complexity and O(1) space complexity.'
  },
  {
    slug: 'merge-sorted-linked-lists',
    title: 'Merge Sorted Linked Lists',
    category: 'Linked List',
    difficulty: 'Medium',
    description: 'Combine two already sorted linked lists into a single, new sorted linked list efficiently. This is a common sub-problem in algorithms like Merge Sort for lists.',
    longDescription: 'Merging two sorted linked lists involves creating a new list that contains all elements from both input lists, in sorted order. This can be done iteratively by maintaining pointers to the current nodes of both input lists. At each step, the node with the smaller value is appended to the merged list, and its respective pointer is advanced. This continues until one list is exhausted, after which the remaining portion of the other list is appended to the merged list. A recursive approach is also possible: compare the heads of both lists, the smaller one becomes the head of the merged list, and its `next` pointer is set to the result of merging its remainder with the other list. Both methods have a time complexity of O(n+m) (where n and m are lengths of the lists) and space complexity of O(1) for iterative (if reusing nodes) or O(n+m) for recursive (stack space) / new node creation.'
  },
  
  // SECTION V: Trees & Binary Trees
  { 
    slug: 'binary-tree-traversal', 
    title: 'Binary Tree Traversal', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'Fundamental methods (Inorder, Preorder, Postorder) to visit all nodes in a binary tree. Essential for many tree-based algorithms.',
    longDescription: 'Binary tree traversal refers to the process of visiting each node in a tree data structure exactly once. Common traversal methods include: Inorder (visit left subtree, root, then right subtree), Preorder (visit root, left subtree, then right subtree), and Postorder (visit left subtree, right subtree, then root). These traversals are typically implemented recursively and form the basis for many tree algorithms. For example, inorder traversal of a Binary Search Tree (BST) yields nodes in sorted order. Preorder can be used to create a copy of the tree or to get prefix expressions from expression trees. Postorder is useful for deleting nodes from a tree (children before parent) or getting postfix expressions. Time complexity for all is O(n) as each node is visited once. Space complexity is O(h) due to the recursion stack, where h is the height of the tree (O(log n) for balanced, O(n) for skewed).'
  },
  { 
    slug: 'binary-search-tree', 
    title: 'Binary Search Tree (BST)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'A sorted binary tree where each node\'s value is greater than all values in its left subtree and less than all values in its right subtree. Facilitates efficient search, insert, and delete.',
    longDescription: 'A Binary Search Tree (BST) is a node-based binary tree data structure which has the property: the left subtree of a node contains only nodes with keys lesser than the node’s key; the right subtree of a node contains only nodes with keys greater than the node’s key. Both the left and right subtrees must also be binary search trees. Operations include search, insert, delete, find min/max, successor/predecessor. Average time complexity for these operations is O(log n) if balanced, but O(n) in worst case (skewed tree). Inorder traversal of a BST yields elements in sorted order.'
  },
  { 
    slug: 'avl-tree', 
    title: 'AVL Tree', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'The first self-balancing Binary Search Tree. It maintains a balance factor for every node and performs rotations (LL, RR, LR, RL) to ensure O(log n) time complexity for operations.',
    longDescription: 'An AVL Tree is a self-balancing Binary Search Tree (BST) named after its inventors Adelson-Velsky and Landis. It maintains a balance factor for each node, which is the difference between the height of its left subtree and its right subtree. This factor must be -1, 0, or 1. If an insertion or deletion causes this property to be violated at any node, the tree performs rebalancing operations called rotations (single or double, such as LL, RR, LR, RL) to restore the balance. This strict balancing ensures that the height of the tree remains O(log n), guaranteeing O(log n) worst-case time complexity for search, insertion, and deletion operations, unlike a standard BST which can degrade to O(n).'
  },
  { 
    slug: 'red-black-tree', 
    title: 'Red-Black Tree', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'A self-balancing BST using node coloring (red/black) and specific rules to maintain balance, guaranteeing O(log n) performance. Widely used in system software.',
    longDescription: 'A Red-Black Tree is a type of self-balancing Binary Search Tree where each node stores an extra bit for denoting its color (red or black). By constraining the way nodes can be colored on any path from the root to a leaf, Red-Black Trees ensure that no path is more than twice as long as any other, so the tree remains approximately balanced. Key properties: 1. Every node is either red or black. 2. The root is black. 3. All leaves (NIL/sentinel nodes) are black. 4. If a node is red, then both its children are black. 5. Every simple path from a given node to any of its descendant leaves contains the same number of black nodes. Insertions and deletions may violate these properties, leading to "fixup" operations involving recoloring and rotations (left and right) to restore balance. These operations ensure O(log n) time complexity for search, insert, and delete. The complexity of the fixup logic, especially for deletion, is notable.'
  },
  { 
    slug: 'heap-operations', 
    title: 'Heap (Min/Max)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'A specialized tree that satisfies the heap property (parent nodes are ordered relative to children). Used for Priority Queues. Visualize insert, extract-min/max, heapify.',
    longDescription: 'A Heap is a complete binary tree that satisfies the heap property. In a Max-Heap, the value of each node is greater than or equal to the values of its children. In a Min-Heap, the value of each node is less than or equal to the values of its children. This structure makes heaps ideal for implementing Priority Queues. Key operations: `insert` (add an element and "heapify-up" or "bubble-up" to maintain heap property), `extractMax/Min` (remove the root, replace with last element, and "heapify-down" or "bubble-down"), `peek` (view root), `buildHeap` (create a heap from an unordered array in O(n) time). Heaps are often implemented using arrays for efficiency.'
  },
  { 
    slug: 'segment-tree', 
    title: 'Segment Tree (Conceptual)', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'A tree for storing information about intervals or segments. Allows efficient range queries (sum, min, max) and point updates in O(log n) time.',
    longDescription: 'A Segment Tree is a versatile tree data structure used for storing information about intervals or segments and performing efficient range queries and updates. Each node in the segment tree typically represents an interval [L, R]. Leaf nodes represent individual elements of an array, and internal nodes represent the union (or aggregate like sum, min, max) of their children\'s intervals. Common operations include: `build` (construct the tree from an array, O(n)), `query` (find sum/min/max over a range [L, R], O(log n)), and `update` (change the value of an element and update affected tree nodes, O(log n)). They are particularly useful for problems requiring frequent range queries on dynamic data.'
  },
  { 
    slug: 'trie', 
    title: 'Trie (Prefix Tree)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'A tree for efficient string retrieval (e.g., auto-completion). Each node represents a character; paths from root form prefixes. O(L) for search/insert (L=word length).',
    longDescription: 'A Trie, also known as a prefix tree or digital tree, is a tree-like data structure that stores a dynamic set of strings. Each node represents a character, and the path from the root to a node represents a prefix. A special marker (e.g., isEndOfWord flag) in a node can indicate the end of a complete word. Tries are highly efficient for operations like word insertion, search, and prefix-based search (e.g., "find all words starting with \'pre\'"). The time complexity for these operations is O(L), where L is the length of the string, independent of the number of strings stored. Space complexity can be high if the alphabet size is large and strings don\'t share many common prefixes.'
  },
  { 
    slug: 'huffman-coding', 
    title: 'Huffman Coding', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'Greedy algorithm for lossless data compression. Uses a Huffman Tree (binary tree based on character frequencies) to assign variable-length codes.',
    longDescription: 'Huffman Coding is a lossless data compression algorithm. It works by assigning variable-length binary codes to input characters based on their frequencies of occurrence. More frequent characters get shorter codes, and less frequent characters get longer codes. The process involves: 1. Calculating character frequencies. 2. Creating a leaf node for each character and its frequency, adding them to a min-priority queue. 3. Repeatedly extracting the two nodes with the smallest frequencies, creating a new internal node with their combined frequency, making them its children, and inserting the new node back into the priority queue. 4. The final node is the root of the Huffman Tree. 5. Traversing this tree (e.g., 0 for left, 1 for right) generates the prefix codes for each character.'
  },
  { 
    slug: 'lowest-common-ancestor', 
    title: 'Lowest Common Ancestor (LCA)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'The deepest node in a tree that has two given nodes as descendants. Efficient O(log N) or O(1) (with preprocessing) solutions exist.',
    longDescription: 'The Lowest Common Ancestor (LCA) of two nodes, `p` and `q`, in a tree is the deepest node that is an ancestor of both `p` and `q`. For a Binary Search Tree (BST), LCA can be found efficiently by traversing from the root: if both `p` and `q` are smaller than the current node, go left; if both are larger, go right; otherwise, the current node is the LCA. For a general binary tree, one common recursive approach is to find `p` or `q` in the left and right subtrees. If one is in the left and the other in the right, the current root is the LCA. If both are in one subtree, the LCA is in that subtree. If only one is found, that node is the LCA (assuming both nodes exist in the tree). Time complexity varies from O(h) to O(n) for simple traversal methods, but can be O(log n) or O(1) with preprocessing techniques like Euler tour + Range Minimum Query (RMQ).'
  },
  { 
    slug: 'tree-path-problems', 
    title: 'Tree Path Problems', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'A class of problems involving finding paths in trees, such as path sum, diameter, or path between two nodes. Often solved using DFS or BFS.',
    longDescription: 'Tree Path Problems encompass a variety of challenges related to paths within a tree structure. Common examples include: 1. **Path Sum**: Find if a root-to-leaf path sums to a target value. 2. **All Paths for a Sum**: Find all root-to-leaf paths that sum to a target. 3. **Diameter of a Binary Tree**: Find the length of the longest path between any two nodes (this path may or may not pass through the root). 4. **Path Between Two Nodes**: Find the sequence of nodes forming the path between two given nodes. These problems are typically solved using Depth-First Search (DFS) due to its natural ability to explore paths. BFS might be used if the shortest path in terms of edges is required. Complexities vary based on the specific problem and tree structure.'
  },

  // SECTION VI: Graph Algorithms
  { 
    slug: 'dfs', 
    title: 'Depth-First Search (DFS)', 
    category: 'Graphs', 
    difficulty: 'Medium', 
    description: 'Explores as far as possible along each branch before backtracking. Useful for path finding, cycle detection, and topological sorting.' 
  },
  { 
    slug: 'bfs', 
    title: 'Breadth-First Search (BFS)', 
    category: 'Graphs', 
    difficulty: 'Medium', 
    description: 'Traverses graph level by level, exploring all neighbors at the present depth. Finds the shortest path in unweighted graphs.' 
  },
  { 
    slug: 'dijkstra', 
    title: 'Dijkstra’s Algorithm', 
    category: 'Graphs', 
    difficulty: 'Hard', 
    description: 'Finds the shortest paths from a single source node to all other nodes in a weighted graph with non-negative edge weights.' 
  },
  { 
    slug: 'bellman-ford', 
    title: 'Bellman-Ford Algorithm', 
    category: 'Graphs', 
    difficulty: 'Hard', 
    description: 'Finds shortest paths from a single source vertex to all other vertices in a weighted digraph. Can handle negative edge weights and detect negative cycles.'
  },
  { 
    slug: 'floyd-warshall', 
    title: 'Floyd-Warshall Algorithm', 
    category: 'Graphs', 
    difficulty: 'Hard', 
    description: 'An algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but no negative cycles). Computes all-pairs shortest paths.'
  },
  { 
    slug: 'prims-algorithm', 
    title: 'Prim’s Algorithm', 
    category: 'Graphs', 
    difficulty: 'Hard', 
    description: 'A greedy algorithm that finds a minimum spanning tree (MST) for a weighted undirected graph.'
  },
  { 
    slug: 'kruskals-algorithm', 
    title: 'Kruskal’s Algorithm', 
    category: 'Graphs', 
    difficulty: 'Hard', 
    description: 'A greedy algorithm that finds a minimum spanning tree (MST) for a connected, undirected graph. Uses the Disjoint Set Union (DSU) data structure.'
  },
  { 
    slug: 'topological-sort', 
    title: 'Topological Sort', 
    category: 'Graphs', 
    difficulty: 'Medium', 
    description: 'A linear ordering of vertices such that for every directed edge from vertex u to vertex v, u comes before v in the ordering. For Directed Acyclic Graphs (DAGs).'
  },
  { 
    slug: 'graph-cycle-detection', 
    title: 'Cycle Detection in Graphs', 
    category: 'Graphs', 
    difficulty: 'Medium', 
    description: 'Algorithms to detect cycles in both directed and undirected graphs using DFS or other techniques.'
  },
  { 
    slug: 'connected-components', 
    title: 'Connected Components', 
    category: 'Graphs', 
    difficulty: 'Medium', 
    description: 'Algorithms (using BFS or DFS) to find all connected components in an undirected graph or strongly connected components in a directed graph.'
  },

  // SECTION VII: Recursion & Backtracking
  { 
    slug: 'tower-of-hanoi', 
    title: 'Tower of Hanoi', 
    category: 'Backtracking', 
    difficulty: 'Easy', 
    description: 'A classic mathematical puzzle involving moving disks between pegs. A great example of simple recursion.'
  },
  { 
    slug: 'n-queens-problem', 
    title: 'N-Queens Problem', 
    category: 'Backtracking', 
    difficulty: 'Medium', 
    description: 'The problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other. Visualizes the backtracking search.'
  },
  { 
    slug: 'sudoku-solver', 
    title: 'Sudoku Solver', 
    category: 'Backtracking', 
    difficulty: 'Hard', 
    description: 'A backtracking algorithm to solve Sudoku puzzles by trying to fill in digits and backtracking when a conflict is found.'
  },
  { 
    slug: 'rat-in-a-maze', 
    title: 'Rat in a Maze', 
    category: 'Backtracking', 
    difficulty: 'Medium', 
    description: 'Find a path for a rat to reach its destination in a maze, typically represented as a grid. Explores paths using backtracking.'
  },
  { 
    slug: 'permutations-subsets', 
    title: 'Permutations & Subsets', 
    category: 'Backtracking', 
    difficulty: 'Medium', 
    description: 'Generate all possible permutations or subsets of a given set of elements using recursive backtracking techniques.'
  },

  // SECTION VIII: Dynamic Programming
  { 
    slug: 'knapsack-0-1', 
    title: '0/1 Knapsack Problem', 
    category: 'Dynamic Programming', 
    difficulty: 'Medium', 
    description: 'Given a set of items, each with a weight and a value, determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible.'
  },
  { 
    slug: 'longest-common-subsequence', 
    title: 'Longest Common Subsequence (LCS)', 
    category: 'Dynamic Programming', 
    difficulty: 'Medium', 
    description: 'Find the longest subsequence common to all sequences in a set of sequences (often two sequences). Visualizes the DP table construction.'
  },
  { 
    slug: 'longest-increasing-subsequence', 
    title: 'Longest Increasing Subsequence (LIS)', 
    category: 'Dynamic Programming', 
    difficulty: 'Medium', 
    description: 'Find the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order.'
  },
  { 
    slug: 'edit-distance', 
    title: 'Edit Distance (Levenshtein Distance)', 
    category: 'Dynamic Programming', 
    difficulty: 'Medium', 
    description: 'Measures the similarity between two strings by counting the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one word into the other.'
  },
  { 
    slug: 'matrix-chain-multiplication', 
    title: 'Matrix Chain Multiplication', 
    category: 'Dynamic Programming', 
    difficulty: 'Hard', 
    description: 'Determine the optimal parenthesization of a product of N matrices to minimize the number of scalar multiplications.'
  },
  { 
    slug: 'coin-change', 
    title: 'Coin Change Problem', 
    category: 'Dynamic Programming', 
    difficulty: 'Medium', 
    description: 'Given a value N, if we want to make change for N cents, and we have infinite supply of each of S = { S1, S2, .. , Sm} valued coins, how many ways can we make the change?'
  },

  // SECTION IX: Math & Logic Algorithms
  { 
    slug: 'euclidean-gcd', 
    title: 'Euclidean Algorithm for GCD', 
    category: 'Math & Number Theory', 
    difficulty: 'Easy', 
    description: 'An efficient method for computing the greatest common divisor (GCD) of two integers. Visualizes the recursive steps.'
  },
  { 
    slug: 'sieve-of-eratosthenes', 
    title: 'Sieve of Eratosthenes', 
    category: 'Math & Number Theory', 
    difficulty: 'Easy', 
    description: 'An ancient algorithm for finding all prime numbers up to any given limit. Visualizes the process of marking multiples.'
  },
  { 
    slug: 'prime-factorization', 
    title: 'Prime Factorization', 
    category: 'Math & Number Theory', 
    difficulty: 'Easy', 
    description: 'Find the prime factors of a given integer. Visualizes trial division or other methods.'
  },
  { 
    slug: 'modular-exponentiation', 
    title: 'Modular Exponentiation', 
    category: 'Math & Number Theory', 
    difficulty: 'Medium', 
    description: 'Efficiently compute (base^exponent) % modulus. Important in cryptography. Visualizes the method of exponentiation by squaring.'
  },
  { 
    slug: 'base-conversions', 
    title: 'Base Conversions', 
    category: 'Math & Number Theory', 
    difficulty: 'Easy', 
    description: 'Convert numbers between different bases (e.g., binary, decimal, hexadecimal). Visualizes the division/multiplication process.'
  },

  // SECTION X: Core Data Structures
  { 
    slug: 'stack-queue', 
    title: 'Stack & Queue Operations', 
    category: 'Data Structures', 
    difficulty: 'Easy', 
    description: 'Illustrates LIFO (Stack) and FIFO (Queue) principles with basic operations like push, pop, enqueue, and dequeue. Fundamental data structures.'
  },
  { 
    slug: 'deque-operations', 
    title: 'Deque Operations', 
    category: 'Data Structures', 
    difficulty: 'Easy', 
    description: 'Visualize operations on a Double-Ended Queue (Deque), supporting element addition/removal from both ends.'
  },
  { 
    slug: 'priority-queue', 
    title: 'Priority Queue (Min/Max Heap)', 
    category: 'Data Structures', 
    difficulty: 'Medium', 
    description: 'A data structure that stores elements with associated priorities. Visualize insert and extract-min/max operations, typically implemented with a heap.'
  },
  { 
    slug: 'disjoint-set-union', 
    title: 'Disjoint Set Union (DSU)', 
    category: 'Data Structures', 
    difficulty: 'Medium', 
    description: 'A data structure that keeps track of a set of elements partitioned into a number of disjoint (non-overlapping) subsets. Visualizes find and union operations with path compression and union by rank/size.'
  },
  { 
    slug: 'hash-table', 
    title: 'Hash Table (Conceptual)', 
    category: 'Data Structures', 
    difficulty: 'Medium', 
    description: 'Visualize the concept of hashing, hash collisions, and collision resolution techniques (e.g., chaining, open addressing).'
  },
];

const ALL_CATEGORIES = Array.from(new Set(MOCK_ALGORITHMS.map(algo => algo.category))).sort();
const ALL_DIFFICULTIES: Array<AlgorithmMetadata['difficulty']> = ['Easy', 'Medium', 'Hard'];
const ALL_FILTER_SENTINEL_VALUE = "__all__";


export default function VisualizersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<AlgorithmMetadata['difficulty'] | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredAlgorithms = useMemo(() => {
    return MOCK_ALGORITHMS.filter(algo => {
      const matchesSearch = searchTerm.trim() === '' ||
        algo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        algo.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || algo.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || algo.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  };
  
  const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty;

  if (!isClient) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-12 text-center">
                    <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
                        Explore Visualizers
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Loading interactive visualizations...
                    </p>
                </div>
                 <div className="sticky top-16 bg-background/90 dark:bg-background/80 backdrop-blur-md z-40 py-4 mb-8 rounded-lg shadow">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="h-10 bg-muted rounded-md lg:col-span-2"></div>
                            <div className="h-10 bg-muted rounded-md"></div>
                            <div className="h-10 bg-muted rounded-md"></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-64 bg-card rounded-xl shadow-lg"></div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            Explore Visualizers
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Dive into interactive visualizations of data structures and algorithms. Choose a topic below to get started.
          </p>
        </div>

        <div className="sticky top-[calc(theme(spacing.16)+1px)] bg-background/95 dark:bg-background/90 backdrop-blur-md z-40 py-4 mb-8 rounded-lg shadow-md border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search algorithms (e.g., Merge Sort, BFS)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                  aria-label="Search algorithms"
                />
              </div>
              <div>
                <Select
                  value={selectedCategory || ALL_FILTER_SENTINEL_VALUE}
                  onValueChange={(value) => {
                    setSelectedCategory(value === ALL_FILTER_SENTINEL_VALUE ? null : value);
                  }}
                >
                  <SelectTrigger className="w-full" aria-label="Filter by category">
                    <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_FILTER_SENTINEL_VALUE}>All Categories</SelectItem>
                    {ALL_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedDifficulty || ALL_FILTER_SENTINEL_VALUE}
                  onValueChange={(value) => {
                    setSelectedDifficulty(value === ALL_FILTER_SENTINEL_VALUE ? null : value as AlgorithmMetadata['difficulty'] | null);
                  }}
                >
                  <SelectTrigger className="w-full" aria-label="Filter by difficulty">
                    <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_FILTER_SENTINEL_VALUE}>All Difficulties</SelectItem>
                    {ALL_DIFFICULTIES.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="md:col-start-2 lg:col-start-auto text-sm text-muted-foreground hover:text-primary dark:hover:text-accent">
                  <XCircle className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {filteredAlgorithms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredAlgorithms.map(algo => (
              <VisualizerCard key={algo.slug} algorithm={algo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground font-semibold">No visualizers match your criteria.</p>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filters.</p>
             {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters} className="mt-4 text-primary dark:text-accent">
                   Clear all filters
                </Button>
              )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
    

    
