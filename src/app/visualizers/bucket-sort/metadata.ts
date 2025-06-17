
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'bucket-sort',
  title: 'Bucket Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A distribution sort algorithm that works by distributing elements into a number of buckets, then sorting each bucket individually.',
  longDescription: 'Bucket Sort, or bin sort, is a sorting algorithm that works by distributing the elements of an array into a number of buckets. Each bucket is then sorted individually, either using a different sorting algorithm (like insertion sort for small buckets) or by recursively applying the bucket sort algorithm.\n\nAlgorithm Steps:\n1.  **Set up an array of initially empty buckets.** The number of buckets can be chosen based on the range of input values or a fixed number.\n2.  **Scatter**: Go over the original array, putting each object in its bucket. This is typically done by mapping the value of the element to a bucket index. For example, if values range from 0 to 1 and there are 10 buckets, an element `x` could go into bucket `floor(x * 10)`.\n3.  **Sort each non-empty bucket.** This can be done using another sorting algorithm (e.g., insertion sort is common for its efficiency on small or nearly-sorted lists) or by recursively calling bucket sort.\n4.  **Gather**: Visit the buckets in order and put all elements back into the original array.\n\nBucket sort is most effective when the input data is uniformly distributed over a range. Its performance degrades if data is clustered, leading to some buckets having many elements and others being empty.\n\nUse Cases: Useful when input is uniformly distributed. Can be very fast for such data. Often used for sorting floating-point numbers.',
  timeComplexities: {
    best: "O(n+k) when input is uniformly distributed (n elements, k buckets).",
    average: "O(n+k) under assumption of uniform distribution.",
    worst: "O(n^2) if all elements fall into a single bucket and insertion sort is used for buckets. Or O(n log n) if a comparison sort like Merge Sort is used for buckets.",
  },
  spaceComplexity: "O(n+k) for buckets and auxiliary space for sorting buckets.",
};
