
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'radix-sort',
  title: 'Radix Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A non-comparison integer sorting algorithm that sorts data with integer keys by grouping keys by individual digits sharing the same significant position.',
  longDescription: 'Radix Sort is a non-comparative sorting algorithm that sorts integers by processing individual digits. It groups keys by the individual digits which share the same significant position and value. For Radix Sort to work correctly, the sorting algorithm used to sort the digits (typically Counting Sort) must be stable.\\n\\nAlgorithm Steps (LSD - Least Significant Digit Radix Sort):\n1. Find the maximum number in the array to know the number of digits (passes required).\\n2. For each digit position, starting from the least significant digit (LSD) to the most significant digit (MSD):\\n   a. Sort the input array using a stable sorting algorithm (like Counting Sort) based on the current digit.\\n\\nExample: Sort [170, 45, 75, 90, 802, 24, 2, 66]\n- Pass 1 (LSD - units digit): Sort by units digit. Use Counting Sort. Result: [170, 90, 802, 2, 24, 45, 75, 66]\n- Pass 2 (tens digit): Sort by tens digit. Result: [802, 2, 24, 45, 66, 170, 75, 90]\n- Pass 3 (hundreds digit): Sort by hundreds digit. Result: [2, 24, 45, 66, 75, 90, 170, 802]\n\nRadix Sort is efficient for large numbers of integers with a relatively small range of digits or key lengths.',
  timeComplexities: {
    best: "O(d*(n+k))", // d = number of digits, n = number of elements, k = base (range of digit values, e.g., 10 for decimal)
    average: "O(d*(n+k))",
    worst: "O(d*(n+k))",
  },
  spaceComplexity: "O(n+k) for Counting Sort as a subroutine.",
};
