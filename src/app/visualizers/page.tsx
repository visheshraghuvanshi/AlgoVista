
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
    description: 'An integer sorting algorithm that operates by counting the number of objects that have each distinct key value. Not comparison-based.'
  },
  { 
    slug: 'radix-sort', 
    title: 'Radix Sort', 
    category: 'Sorting', 
    difficulty: 'Hard', 
    description: 'A non-comparison integer sorting algorithm that sorts data with integer keys by grouping keys by individual digits which share the same significant position and value.'
  },
  { 
    slug: 'bucket-sort', 
    title: 'Bucket Sort', 
    category: 'Sorting', 
    difficulty: 'Medium', 
    description: 'Distributes elements into a number of buckets, each bucket is then sorted individually, either using a different sorting algorithm or recursively applying bucket sort.'
  },
  { 
    slug: 'shell-sort', 
    title: 'Shell Sort', 
    category: 'Sorting', 
    difficulty: 'Medium', 
    description: 'An in-place comparison sort. It can be seen as either a generalization of sorting by exchange (bubble sort) or sorting by insertion (insertion sort).'
  },
  { 
    slug: 'cocktail-sort', 
    title: 'Cocktail Shaker Sort', 
    category: 'Sorting', 
    difficulty: 'Easy', 
    description: 'A variation of Bubble Sort that sorts in both directions on each pass through the list.'
  },

  // SECTION III: Searching & Array Techniques
  { 
    slug: 'jump-search', 
    title: 'Jump Search', 
    category: 'Arrays & Search', 
    difficulty: 'Easy', 
    description: 'A searching algorithm for sorted arrays. The basic idea is to check fewer elements by jumping ahead by fixed steps.'
  },
  { 
    slug: 'ternary-search', 
    title: 'Ternary Search', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'A decrease and conquer search algorithm that specifies the position of an element in a sorted array by recursively dividing the array into three parts.'
  },
  { 
    slug: 'kadanes-algorithm', 
    title: 'Kadane’s Algorithm', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'Used to find the maximum sum subarray within a given one-dimensional array of numbers.'
  },
  { 
    slug: 'two-pointers', 
    title: 'Two Pointers Technique', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'A common technique for array traversal where two pointers iterate through the data structure until one or both meet certain conditions.'
  },
  { 
    slug: 'sliding-window', 
    title: 'Sliding Window Technique', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'A technique used for finding a subarray or substring that satisfies given conditions by maintaining a window of a certain size or properties.'
  },
  { 
    slug: 'dutch-national-flag', 
    title: 'Dutch National Flag Algorithm', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'An algorithm for sorting an array containing three distinct values (e.g., 0s, 1s, and 2s) in linear time.'
  },
  { 
    slug: 'subarray-sum-problems', 
    title: 'Subarray Sum Problems', 
    category: 'Arrays & Search', 
    difficulty: 'Medium', 
    description: 'A class of problems involving finding subarrays that sum to a target value or have specific sum properties (e.g., max sum, zero sum).'
  },

  // SECTION IV: Linked Lists
  { 
    slug: 'linked-list-operations', 
    title: 'Linked List Operations', 
    category: 'Linked List', 
    difficulty: 'Medium', 
    description: 'Visualize core operations like insertion, deletion, search, reversal, and loop detection in Singly, Doubly, and Circular Linked Lists. Understand node navigation and pointer manipulation.'
  },

  // SECTION V: Trees & Binary Trees
  { 
    slug: 'binary-tree-traversal', 
    title: 'Binary Tree Traversal', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'Visualize Inorder, Preorder, and Postorder traversals for binary trees. Essential for understanding tree data structures.' 
  },
  { 
    slug: 'binary-search-tree', 
    title: 'Binary Search Tree (BST)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'Operations like insertion, deletion, search, find min/max in a Binary Search Tree. Understand its properties and advantages for searching.'
  },
  { 
    slug: 'avl-tree', 
    title: 'AVL Tree', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'A self-balancing Binary Search Tree. Visualize rotations (LL, RR, LR, RL) that maintain balance during insertions and deletions.'
  },
  { 
    slug: 'red-black-tree', 
    title: 'Red-Black Tree', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'Another self-balancing Binary Search Tree that uses node coloring (red/black) to ensure balance and efficient operations.'
  },
  { 
    slug: 'heap-operations', 
    title: 'Heap (Min/Max)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'Visualize operations like insert, delete-min/max, and heapify in a Min-Heap or Max-Heap. Foundation for Priority Queues and Heap Sort.'
  },
  { 
    slug: 'segment-tree', 
    title: 'Segment Tree (Conceptual)', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'A tree data structure for storing information about intervals or segments. Efficient for range queries and updates.'
  },
  { 
    slug: 'trie', 
    title: 'Trie (Prefix Tree)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'A tree-like data structure used for efficient retrieval of keys in a dataset of strings. Visualize insertions and searches for prefixes.'
  },
  { 
    slug: 'huffman-coding', 
    title: 'Huffman Coding', 
    category: 'Trees', 
    difficulty: 'Hard', 
    description: 'An algorithm for lossless data compression. Visualize the construction of the Huffman Tree and encoding/decoding processes.'
  },
  { 
    slug: 'lowest-common-ancestor', 
    title: 'Lowest Common Ancestor (LCA)', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'Find the lowest common ancestor of two nodes in a binary tree or BST. Various approaches visualized.'
  },
  { 
    slug: 'tree-path-problems', 
    title: 'Tree Path Problems', 
    category: 'Trees', 
    difficulty: 'Medium', 
    description: 'A collection of problems related to finding paths in trees, such as path sum, diameter, or specific node-to-node paths.'
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

    