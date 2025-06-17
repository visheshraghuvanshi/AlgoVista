
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
    title: 'Singly Linked List', 
    category: 'Linked List', 
    difficulty: 'Easy', 
    description: 'A linear data structure where elements are stored in nodes, and each node points to the next node in the sequence. Covers basic operations like insertion (head, tail, specific position), deletion, search, and traversal. Emphasizes understanding node navigation and pointer manipulation in one direction. Accessing elements by index is O(n), while insertion/deletion at the head is O(1). Insertion/deletion at the tail is O(n) without a tail pointer, or O(1) with one.'
  },
  { 
    slug: 'doubly-linked-list', 
    title: 'Doubly Linked List', 
    category: 'Linked List', 
    difficulty: 'Medium', 
    description: 'A linked list where each node contains a data part and two pointers: one to the next node and one to the previous node. This allows traversal in both directions. Covers insertion, deletion, search, and traversal, highlighting the advantages (e.g., O(1) deletion if node is known) and complexities of managing two pointers. Access/search is O(n). Insertion/deletion at head/tail is O(1).'
  },
  { 
    slug: 'circular-linked-list', 
    title: 'Circular Linked List', 
    category: 'Linked List', 
    difficulty: 'Medium', 
    description: 'A linked list where the last node points back to the first node (or a head node in some implementations), forming a circle. Can be singly or doubly circular. Useful in applications requiring round-robin scheduling or continuous looping. Traversal requires careful handling of termination conditions to avoid infinite loops. Operations like insertion and deletion are similar to linear lists but need to maintain the circular link.'
  },
  { 
    slug: 'linked-list-reversal', 
    title: 'Linked List Reversal', 
    category: 'Linked List', 
    difficulty: 'Medium', 
    description: 'The process of reversing the order of nodes in a linked list. Explores iterative (using three pointers: prev, current, next) and recursive approaches for reversing a singly linked list. A fundamental manipulation technique testing pointer understanding.'
  },
  { 
    slug: 'linked-list-cycle-detection', 
    title: 'Linked List Cycle Detection', 
    category: 'Linked List', 
    difficulty: 'Medium', 
    description: 'Algorithms to determine if a linked list contains a cycle (i.e., a node points back to a previously visited node). Focuses on Floyd\'s Tortoise and Hare algorithm (two-pointer technique) for efficient cycle detection in O(n) time and O(1) space.'
  },
  { 
    slug: 'merge-sorted-linked-lists', 
    title: 'Merge Two Sorted Linked Lists', 
    category: 'Linked List', 
    difficulty: 'Medium', 
    description: 'Combining two sorted linked lists into a single, new sorted linked list. Explores iterative and recursive approaches to merge the lists while maintaining sorted order by comparing elements node by node. A common interview problem demonstrating pointer manipulation and recursion/iteration.'
  },


  // SECTION V: Trees & Binary Trees
  { 
    slug: 'binary-tree-traversal', 
    title: 'Binary Tree Traversal', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'Fundamental methods to visit all nodes in a binary tree. Inorder (Left-Root-Right) typically used for BSTs to get sorted order. Preorder (Root-Left-Right) useful for copying trees or prefix expressions. Postorder (Left-Right-Root) used for deleting trees or postfix expressions. Visualizing these recursive traversals is key to understanding tree manipulation.' 
  },
  { 
    slug: 'binary-search-tree', 
    title: 'Binary Search Tree (BST)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'A node-based binary tree data structure which has the property: the left subtree of a node contains only nodes with keys lesser than the node’s key; the right subtree of a node contains only nodes with keys greater than the node’s key. Both the left and right subtrees must also be binary search trees. Operations include search, insert, delete, find min/max, successor/predecessor. Average time complexity for these operations is O(log n) if balanced, but O(n) in worst case (skewed tree).'
  },
  { 
    slug: 'avl-tree', 
    title: 'AVL Tree', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'The first self-balancing Binary Search Tree. It maintains a balance factor (height difference between left and right subtrees) of -1, 0, or 1 for every node. After insertions or deletions, if the balance factor is violated, tree rotations (LL, RR, LR, RL) are performed to restore balance, ensuring O(log n) time complexity for all operations.'
  },
  { 
    slug: 'red-black-tree', 
    title: 'Red-Black Tree', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'A self-balancing Binary Search Tree where each node has an extra bit for storing color (red or black). By enforcing properties regarding node coloring and path lengths, it maintains a balanced structure, guaranteeing O(log n) time for search, insert, and delete operations. Complex but widely used (e.g., in C++ STL map/set).'
  },
  { 
    slug: 'heap-operations', 
    title: 'Heap (Min/Max)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'A specialized tree-based data structure that satisfies the heap property: in a Max-Heap, for any given node C, if P is a parent node of C, then the key of P is greater than or equal to the key of C. In a Min-Heap, the key of P is less than or equal to the key of C. Primarily used for implementing Priority Queues. Operations include insert (O(log n)), delete-min/max (O(log n)), and heapify (O(n) to build from array, O(log n) for single node adjustment).'
  },
  { 
    slug: 'segment-tree', 
    title: 'Segment Tree (Conceptual)', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'A tree data structure for storing information about intervals or segments. Each node in the segment tree represents an interval. It allows querying which of the stored segments contain a given point, or what is the sum/min/max over a given range. Efficient for range queries (O(log n)) and updates (O(log n)). Often used in competitive programming.'
  },
  { 
    slug: 'trie', 
    title: 'Trie (Prefix Tree)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'A tree-like data structure (k-ary tree) used for efficient retrieval of keys in a dataset of strings. Each node represents a character, and paths from the root to a node represent prefixes. Nodes can mark the end of a word. Useful for auto-completion, spell checking, and IP routing. Search, insert, and delete operations typically take O(L) time, where L is the length of the string.'
  },
  { 
    slug: 'huffman-coding', 
    title: 'Huffman Coding', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'A greedy algorithm for lossless data compression. It assigns variable-length codes to input characters, lengths of the assigned codes are based on the frequencies of corresponding characters. The most frequent character gets the smallest code and the least frequent character gets the largest code. It constructs a Huffman Tree (a binary tree where all leaves are input characters) to generate these codes.'
  },
  { 
    slug: 'lowest-common-ancestor', 
    title: 'Lowest Common Ancestor (LCA)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'The Lowest Common Ancestor (LCA) of two nodes n1 and n2 in a tree is the lowest (i.e., deepest) node that has both n1 and n2 as descendants. Efficient algorithms exist for finding LCA in O(log N) or O(1) with preprocessing. Important in problems involving paths and relationships in trees.'
  },
  { 
    slug: 'tree-path-problems', 
    title: 'Tree Path Problems', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'A collection of problems involving finding paths in trees. Examples include: finding a path between two nodes, finding the diameter of a tree (longest path), finding all paths that sum to a specific value, or checking if a path exists. Often solved using DFS or BFS traversal techniques.'
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
    

    