
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'counting-sort',
  title: 'Counting Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A non-comparison integer sorting algorithm that operates by counting the number of objects that have each distinct key value.',
  longDescription: 'Counting sort is an algorithm for sorting a collection of objects according to keys that are small positive integers. It operates by counting the number of objects that have each distinct key value, and then using arithmetic on those counts to determine the positions of each key value in the output sequence. Its running time is linear in the number of items and the difference between the maximum and minimum key values (the range k), so it is only suitable for direct use in situations where the variation in keys is not significantly greater than the number of items. It is often used as a subroutine in other sorting algorithms, such as radix sort.\n\nAlgorithm Steps:\n1. Find the maximum element (maxVal) in the input array to determine the range of values (0 to maxVal).\n2. Create a count array (or frequency array) of size maxVal + 1, initialized to all zeros. This array will store the frequency of each element.\n3. Iterate through the input array and for each element, increment its corresponding count in the count array.\n4. Modify the count array such that each element at each index stores the sum of previous counts. This gives the cumulative count, indicating the position of elements in the output array.\n5. Create an output array of the same size as the input array.\n6. Iterate through the input array in reverse order (to maintain stability). For each element, find its position in the output array using the (now modified) count array, place the element, and decrement its count in the count array.\n7. Copy the elements from the output array back to the original input array.\n\nCounting sort is stable, meaning that numbers with the same value appear in the output array in the same order as they do in the input array.',
  timeComplexities: {
    best: "O(n+k)",    // n is number of elements, k is range of input
    average: "O(n+k)",
    worst: "O(n+k)",
  },
  spaceComplexity: "O(n+k) for count and output arrays.",
};
