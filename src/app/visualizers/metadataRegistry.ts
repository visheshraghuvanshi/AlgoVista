
import type { AlgorithmMetadata } from '@/types';

// Fundamentals
import { algorithmMetadata as linearSearchMeta } from './linear-search/metadata';
import { algorithmMetadata as binarySearchMeta } from './binary-search/metadata';
import { algorithmMetadata as bubbleSortMeta } from './bubble-sort/metadata';
import { algorithmMetadata as selectionSortMeta } from './selection-sort/metadata';
import { algorithmMetadata as insertionSortMeta } from './insertion-sort/metadata';

// Sorting
import { algorithmMetadata as mergeSortMeta } from './merge-sort/metadata';
import { algorithmMetadata as quickSortMeta } from './quick-sort/metadata';
import { algorithmMetadata as heapSortMeta } from './heap-sort/metadata';
import { algorithmMetadata as countingSortMeta } from './counting-sort/metadata';
import { algorithmMetadata as radixSortMeta } from './radix-sort/metadata';
import { algorithmMetadata as bucketSortMeta } from './bucket-sort/metadata';
import { algorithmMetadata as shellSortMeta } from './shell-sort/metadata';
import { algorithmMetadata as cocktailSortMeta } from './cocktail-sort/metadata';

// Arrays & Search
import { algorithmMetadata as jumpSearchMeta } from './jump-search/metadata';
import { algorithmMetadata as ternarySearchMeta } from './ternary-search/metadata';
import { algorithmMetadata as kadanesAlgorithmMeta } from './kadanes-algorithm/metadata';
import { algorithmMetadata as twoPointersMeta } from './two-pointers/metadata';
import { algorithmMetadata as slidingWindowMeta } from './sliding-window/metadata';
import { algorithmMetadata as dutchNationalFlagMeta } from './dutch-national-flag/metadata';
import { algorithmMetadata as subarraySumProblemsMeta } from './subarray-sum-problems/metadata';

// Linked List
import { algorithmMetadata as singlyLinkedListMeta } from './singly-linked-list/metadata';
import { algorithmMetadata as doublyLinkedListMeta } from './doubly-linked-list/metadata';
import { algorithmMetadata as circularLinkedListMeta } from './circular-linked-list/metadata';
import { algorithmMetadata as linkedListReversalMeta } from './linked-list-reversal/metadata';
import { algorithmMetadata as linkedListCycleDetectionMeta } from './linked-list-cycle-detection/metadata';
import { algorithmMetadata as mergeSortedLinkedListsMeta } from './merge-sorted-linked-lists/metadata';

// Trees
import { algorithmMetadata as binaryTreeTraversalMeta } from './binary-tree-traversal/metadata';
import { algorithmMetadata as binarySearchTreeMeta } from './binary-search-tree/metadata';
import { algorithmMetadata as avlTreeMeta } from './avl-tree/metadata';
import { algorithmMetadata as redBlackTreeMeta } from './red-black-tree/metadata';
import { algorithmMetadata as heapOperationsMeta } from './heap-operations/metadata';
import { algorithmMetadata as segmentTreeMeta } from './segment-tree/metadata';
import { algorithmMetadata as trieMeta } from './trie/metadata';
import { algorithmMetadata as huffmanCodingMeta } from './huffman-coding/metadata';
import { algorithmMetadata as lowestCommonAncestorMeta } from './lowest-common-ancestor/metadata';
import { algorithmMetadata as treePathProblemsMeta } from './tree-path-problems/metadata';

// Graphs
import { algorithmMetadata as dfsMeta } from './dfs/metadata';
import { algorithmMetadata as bfsMeta } from './bfs/metadata';
import { algorithmMetadata as dijkstraMeta } from './dijkstra/metadata';
import { algorithmMetadata as bellmanFordMeta } from './bellman-ford/metadata';
import { algorithmMetadata as floydWarshallMeta } from './floyd-warshall/metadata';
import { algorithmMetadata as primsAlgorithmMeta } from './prims-algorithm/metadata';
import { algorithmMetadata as kruskalsAlgorithmMeta } from './kruskals-algorithm/metadata';
import { algorithmMetadata as topologicalSortMeta } from './topological-sort/metadata';
import { algorithmMetadata as graphCycleDetectionMeta } from './graph-cycle-detection/metadata';
import { algorithmMetadata as connectedComponentsMeta } from './connected-components/metadata';

// Backtracking
import { algorithmMetadata as towerOfHanoiMeta } from './tower-of-hanoi/metadata';
import { algorithmMetadata as nQueensProblemMeta } from './n-queens-problem/metadata';
import { algorithmMetadata as sudokuSolverMeta } from './sudoku-solver/metadata';
import { algorithmMetadata as ratInAMazeMeta } from './rat-in-a-maze/metadata';
import { algorithmMetadata as permutationsSubsetsMeta } from './permutations-subsets/metadata';

// Dynamic Programming
import { algorithmMetadata as knapsack01Meta } from './knapsack-0-1/metadata';
import { algorithmMetadata as longestCommonSubsequenceMeta } from './longest-common-subsequence/metadata';
import { algorithmMetadata as longestIncreasingSubsequenceMeta } from './longest-increasing-subsequence/metadata';
import { algorithmMetadata as editDistanceMeta } from './edit-distance/metadata';
import { algorithmMetadata as matrixChainMultiplicationMeta } from './matrix-chain-multiplication/metadata';
import { algorithmMetadata as coinChangeMeta } from './coin-change/metadata';

// Math & Number Theory
import { algorithmMetadata as euclideanGcdMeta } from './euclidean-gcd/metadata';
import { algorithmMetadata as sieveOfEratosthenesMeta } from './sieve-of-eratosthenes/metadata';
import { algorithmMetadata as primeFactorizationMeta } from './prime-factorization/metadata';
import { algorithmMetadata as modularExponentiationMeta } from './modular-exponentiation/metadata';
import { algorithmMetadata as baseConversionsMeta } from './base-conversions/metadata';

// Other Data Structures
import { algorithmMetadata as stackQueueMeta } from './stack-queue/metadata';
import { algorithmMetadata as dequeOperationsMeta } from './deque-operations/metadata';
import { algorithmMetadata as priorityQueueMeta } from './priority-queue/metadata';
import { algorithmMetadata as disjointSetUnionMeta } from './disjoint-set-union/metadata';
import { algorithmMetadata as hashTableMeta } from './hash-table/metadata';


export const allAlgorithmMetadata: AlgorithmMetadata[] = [
  // Fundamentals
  linearSearchMeta,
  binarySearchMeta,
  bubbleSortMeta,
  selectionSortMeta,
  insertionSortMeta,

  // Sorting
  mergeSortMeta,
  quickSortMeta,
  heapSortMeta,
  countingSortMeta,
  radixSortMeta,
  bucketSortMeta,
  shellSortMeta,
  cocktailSortMeta,

  // Arrays & Search
  jumpSearchMeta,
  ternarySearchMeta,
  kadanesAlgorithmMeta,
  twoPointersMeta,
  slidingWindowMeta,
  dutchNationalFlagMeta,
  subarraySumProblemsMeta,

  // Linked List
  singlyLinkedListMeta,
  doublyLinkedListMeta,
  circularLinkedListMeta,
  linkedListReversalMeta,
  linkedListCycleDetectionMeta,
  mergeSortedLinkedListsMeta,

  // Trees
  binaryTreeTraversalMeta,
  binarySearchTreeMeta,
  avlTreeMeta, // Added AVL Tree
  redBlackTreeMeta,
  heapOperationsMeta,
  segmentTreeMeta,
  trieMeta,
  huffmanCodingMeta,
  lowestCommonAncestorMeta,
  treePathProblemsMeta,

  // Graphs
  dfsMeta,
  bfsMeta,
  dijkstraMeta,
  bellmanFordMeta,
  floydWarshallMeta,
  primsAlgorithmMeta,
  kruskalsAlgorithmMeta,
  topologicalSortMeta,
  graphCycleDetectionMeta,
  connectedComponentsMeta,

  // Backtracking
  towerOfHanoiMeta,
  nQueensProblemMeta,
  sudokuSolverMeta,
  ratInAMazeMeta,
  permutationsSubsetsMeta,

  // Dynamic Programming
  knapsack01Meta,
  longestCommonSubsequenceMeta,
  longestIncreasingSubsequenceMeta,
  editDistanceMeta,
  matrixChainMultiplicationMeta,
  coinChangeMeta,

  // Math & Number Theory
  euclideanGcdMeta,
  sieveOfEratosthenesMeta,
  primeFactorizationMeta,
  modularExponentiationMeta,
  baseConversionsMeta,

  // Other Data Structures
  stackQueueMeta,
  dequeOperationsMeta,
  priorityQueueMeta,
  disjointSetUnionMeta,
  hashTableMeta,

].sort((a, b) => {
    // Prioritize 'Fundamentals'
    if (a.category === 'Fundamentals' && b.category !== 'Fundamentals') return -1;
    if (a.category !== 'Fundamentals' && b.category === 'Fundamentals') return 1;
    // Then sort by category
    const categoryComparison = a.category.localeCompare(b.category);
    if (categoryComparison !== 0) return categoryComparison;
    // Then by title within category
    return a.title.localeCompare(b.title);
});
