
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'counting-sort',
  title: 'Counting Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A non-comparison integer sorting algorithm that operates by counting the number of objects that have each distinct key value.',
  longDescription: `Counting Sort is a non-comparative integer sorting algorithm that operates by counting the number of occurrences of each distinct element in the input array. This count information is then used to determine the positions of each element in the sorted output array. It's highly efficient for inputs where the range of values (k) is not significantly larger than the number of elements (n). It's important to note that this algorithm is typically used for sorting non-negative integers.

### How it Works:
1.  **Find Range (Max Value)**: Determine the maximum value (\`maxVal\`) in the input array. This defines the range of values the elements can take (typically from 0 to \`maxVal\` if non-negative integers are assumed).
2.  **Initialize Count Array**: Create an auxiliary array, often called \`count[]\`, of size \`maxVal + 1\`. Initialize all its elements to 0. This array will store the frequency of each element from the input array.
3.  **Store Frequencies**: Iterate through the input array (\`arr[]\`). For each element \`x\` in \`arr[]\`, increment \`count[x]\`. After this step, \`count[i]\` will hold the number of times element \`i\` appears in the input array.
4.  **Modify Count Array (Cumulative Counts)**: Iterate through the \`count[]\` array (starting from the second element). For each index \`i\`, update \`count[i] = count[i] + count[i-1]\`. Now, \`count[i]\` stores the number of elements less than or equal to \`i\`. This modified \`count[]\` array effectively gives the final sorted position (plus one, if 0-indexed) for each element.
5.  **Build Output Array**:
    *   Create an output array (\`output[]\`) of the same size as the input array.
    *   Iterate through the input array \`arr[]\` **in reverse order** (from the last element to the first). This reverse iteration is crucial for maintaining stability if Counting Sort is used as a subroutine in Radix Sort.
    *   For each element \`arr[i]\`:
        a.  Place \`arr[i]\` into \`output[count[arr[i]] - 1]\`. The \`-1\` is because array indices are 0-based.
        b.  Decrement \`count[arr[i]]\` by 1. This ensures that if there are duplicate elements, they are placed in preceding positions in the output array.
6.  **Copy to Original Array**: Copy the sorted elements from \`output[]\` back to the original array \`arr[]\`.

### Characteristics:
-   **Non-Comparative**: It does not compare elements with each other like Bubble Sort, Merge Sort, etc. Its sorting is based on keys (the integer values themselves).
-   **Stable**: It preserves the relative order of equal elements if implemented carefully (especially the reverse iteration in step 5).
-   **Integer Sorting**: Primarily designed for sorting integers, or data that can be mapped to integers within a reasonable range.
-   **Not In-Place (Typically)**: Requires auxiliary arrays (\`count[]\` and \`output[]\`), so its space complexity is not O(1).

### Example: Sorting \`arr = [4, 2, 2, 8, 3, 3, 1]\`
1.  Max value = 8. Count array size = 9 (indices 0-8).
2.  Initialize Count Array: \`[0,0,0,0,0,0,0,0,0]\`
3.  Store Frequencies:
    *   arr[0]=4 -> count[4]++ -> \`count = [0,0,0,0,1,0,0,0,0]\`
    *   arr[1]=2 -> count[2]++ -> \`count = [0,0,1,0,1,0,0,0,0]\`
    *   arr[2]=2 -> count[2]++ -> \`count = [0,0,2,0,1,0,0,0,0]\`
    *   ...and so on. After all elements: \`count = [0,1,2,2,1,0,0,0,1]\` (count[0]=0, count[1]=1, count[2]=2, count[3]=2, count[4]=1, ..., count[8]=1)
4.  Modify (Cumulative Counts):
    *   count[1]+=count[0] -> 1
    *   count[2]+=count[1] -> 2+1 = 3
    *   count[3]+=count[2] -> 2+3 = 5
    *   count[4]+=count[3] -> 1+5 = 6
    *   ... Final count: \`[0,1,3,5,6,6,6,6,7]\` (meaning: 1 one, 3 numbers <=2, 5 numbers <=3, etc.)
5.  Build Output (Iterate \`arr\` backwards):
    *   i=6, arr[6]=1. Output pos = count[1]-1 = 0. output[0]=1. count[1]-- (becomes 0).
    *   i=5, arr[5]=3. Output pos = count[3]-1 = 4. output[4]=3. count[3]-- (becomes 4).
    *   i=4, arr[4]=3. Output pos = count[3]-1 = 3. output[3]=3. count[3]-- (becomes 3).
    *   ...and so on. Output will be \`[1,2,2,3,3,4,8]\`.
6.  Copy output to original arr.

### Advantages:
-   **Very Fast**: Linear time complexity O(N+K) when K (range of input values) is not significantly larger than N.
-   **Stable Sort**.

### Disadvantages:
-   **Not General-Purpose**: Only efficient for data with a limited range of (typically integer) keys.
-   **High Space Complexity**: Requires O(N+K) space, which can be large if K is large.
-   Not suitable for sorting data with floating-point numbers or complex objects without a clear integer mapping.

### Common Use Cases:
-   Sorting integers within a specific, relatively small range.
-   As a subroutine in Radix Sort to sort digits.
-   When the keys are small integers.`,
  timeComplexities: {
    best: "O(N+K)",    // N is number of elements, K is range of input
    average: "O(N+K)",
    worst: "O(N+K)",
  },
  spaceComplexity: "O(N+K) for count and output arrays.",
};
