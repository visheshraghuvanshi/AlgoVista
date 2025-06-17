
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'permutations-subsets',
  title: 'Permutations & Subsets',
  category: 'Backtracking',
  difficulty: 'Medium',
  description: 'Generates all possible permutations or subsets (powerset) of a given set of elements, typically using backtracking.',
  longDescription: 'Permutations and Subsets are fundamental combinatorial problems often solved using backtracking or recursive techniques.\n\n**Permutations**: A permutation of a set of distinct items is an arrangement of those items into a particular sequence or order. For a set of N items, there are N! (N factorial) possible permutations.\nAlgorithm (Backtracking):\n1. For each element in the input set:\n   a. If the element is not already in the current permutation, add it.\n   b. Recursively generate permutations for the remaining elements.\n   c. Backtrack: remove the element to try other possibilities.\n2. When the current permutation has the same number of elements as the input set, a complete permutation is found.\n\n**Subsets (Powerset)**: The powerset of a set S is the set of all subsets of S, including the empty set and S itself. For a set of N items, there are 2^N possible subsets.\nAlgorithm (Backtracking/Recursive):\n1. For each element in the input set, decide whether to include it in the current subset or not.\n2. Base Case: When all elements have been considered, the current subset is one of the possibilities.\n3. Recursive Step: \n   a. Explore subsets including the current element.\n   b. Explore subsets excluding the current element.\nAlternative (Iterative for Subsets):\nStart with an empty set in the result. For each element in the input set, iterate through the current subsets in the result and create new subsets by adding the current element to each of them.\n\nUse Cases: Solving puzzles, generating test cases, exploring all possible configurations in search problems.',
  timeComplexities: {
    best: "Permutations: O(N*N!), Subsets: O(N*2^N) (to generate all)",
    average: "Permutations: O(N*N!), Subsets: O(N*2^N)",
    worst: "Permutations: O(N*N!), Subsets: O(N*2^N)"
  },
  spaceComplexity: "Permutations: O(N) for recursion stack (excluding output storage of O(N*N!)). Subsets: O(N) for recursion stack (excluding output storage of O(N*2^N)).",
};
