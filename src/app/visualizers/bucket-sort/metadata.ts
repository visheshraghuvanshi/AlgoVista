
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'bucket-sort',
  title: 'Bucket Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A distribution sort algorithm that works by distributing elements into a number of buckets, then sorting each bucket individually.',
  longDescription: `Bucket Sort, also known as bin sort, is a non-comparative sorting algorithm that operates by distributing elements from an input array into a finite number of "buckets" (or "bins"). Each bucket is then sorted individually, either using a different sorting algorithm (like Insertion Sort for small buckets due to its efficiency on nearly sorted or small data) or by recursively applying the bucket sort algorithm. Finally, the elements from the sorted buckets are gathered in order to form the final sorted array.

### How it Works:
1.  **Initialize Buckets**: Create an array of empty buckets. The number of buckets (\`k\`) can be chosen based on the input size, range of values, or a fixed number. A common choice is a number of buckets proportional to the number of elements (\`N\`).
2.  **Scatter (Distribution Pass)**:
    *   Iterate through the input array.
    *   For each element, determine which bucket it belongs to. This typically involves a mapping function that transforms the element's value into a bucket index.
        *   For example, if input values are uniformly distributed in the range \`[minVal, maxVal]\`, an element \`x\` could be placed into bucket index \`floor((x - minVal) / bucketRange)\`, where \`bucketRange = (maxVal - minVal + 1) / k\`.
        *   For floating-point numbers typically in \`[0, 1)\`, an element \`x\` might go into bucket \`floor(k * x)\`.
    *   Place the element into its corresponding bucket.

3.  **Sort Buckets**:
    *   Iterate through each bucket.
    *   Sort the elements within each non-empty bucket using a suitable sorting algorithm. Insertion sort is often chosen for this step because:
        *   It's efficient for small lists.
        *   If the input elements are relatively uniformly distributed, buckets are likely to be small.
        *   Buckets might already be nearly sorted.

4.  **Gather (Concatenation Pass)**:
    *   Iterate through the buckets in order (from bucket 0 to bucket k-1).
    *   Append the elements from each sorted bucket back into the original array (or a new output array) in sequence.

### Example: Sorting \`arr = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68]\` with 5 buckets (k=5). Assume values in \`[0,1)\`.
Bucket index = \`floor(5 * value)\`.
1.  **Initialize Buckets**: \`B0=[], B1=[], B2=[], B3=[], B4=[]\`
2.  **Scatter**:
    *   0.78 -> B3: \`floor(5*0.78) = 3\`
    *   0.17 -> B0: \`floor(5*0.17) = 0\`
    *   0.39 -> B1: \`floor(5*0.39) = 1\`
    *   ... and so on.
    *   After scattering:
        *   B0: \`[0.17, 0.12]\`
        *   B1: \`[0.39, 0.26, 0.21, 0.23]\`
        *   B2: \`[]\`
        *   B3: \`[0.78, 0.72, 0.68]\`
        *   B4: \`[0.94]\`
3.  **Sort Buckets** (e.g., using Insertion Sort):
    *   B0: \`[0.12, 0.17]\`
    *   B1: \`[0.21, 0.23, 0.26, 0.39]\`
    *   B2: \`[]\`
    *   B3: \`[0.68, 0.72, 0.78]\`
    *   B4: \`[0.94]\`
4.  **Gather**: Concatenate sorted buckets: \`[0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94]\`

### Characteristics:
-   **Distribution Sort**: Relies on distributing elements rather than direct comparisons between all elements.
-   **Stable**: Can be stable if the sorting algorithm used for individual buckets is stable and elements are added to buckets in their original order.
-   **Efficiency Depends on Distribution**: Performs best when input data is uniformly distributed across the possible range. If data is heavily skewed, performance can degrade.

### Advantages:
-   **Very Fast on Average for Uniform Data**: Can achieve O(N+k) average time complexity if the input is uniformly distributed and the bucket sort (e.g., Insertion Sort) is O(LengthOfBucket) on average for small buckets. If k is proportional to N, this can approach O(N).
-   Can be parallelized as each bucket can be sorted independently.

### Disadvantages:
-   **Performance Degrades with Skewed Data**: If all elements fall into a single bucket, the performance becomes that of the sorting algorithm used for the buckets (e.g., O(N²) for Insertion Sort).
-   **Space Complexity**: Requires O(N+k) space for the buckets themselves.
-   Typically works best for floating-point numbers or integers that can be easily mapped to a range. Complex objects require a good mapping function.

### Common Use Cases:
-   Sorting floating-point numbers that are uniformly distributed.
-   When input data distribution is known to be favorable.
-   As a component in other algorithms.
  `,
  timeComplexities: {
    best: "O(n+k) when input is uniformly distributed (n elements, k buckets).",
    average: "O(n+k) under assumption of uniform distribution.",
    worst: "O(n^2) if all elements fall into a single bucket and insertion sort is used for buckets. Or O(n log n) if a comparison sort like Merge Sort is used for buckets.",
  },
  spaceComplexity: "O(n+k) for buckets and auxiliary space for sorting buckets.",
};
