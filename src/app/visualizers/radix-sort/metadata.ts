
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'radix-sort',
  title: 'Radix Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'A non-comparison integer sorting algorithm that sorts data with integer keys by grouping keys by individual digits sharing the same significant position.',
  longDescription: `Radix Sort is a non-comparative sorting algorithm that works on integers (or data that can be mapped to integers, like strings). It sorts data digit by digit, starting from the least significant digit (LSD) to the most significant digit (MSD), or vice-versa (MSD Radix Sort). The LSD approach is more common.

### How it Works (LSD Radix Sort):
1.  **Find Maximum Value**: Determine the maximum value in the input array. This helps determine the number of digits in the largest number, which dictates how many passes of sorting are needed.
2.  **Iterate by Digit Place**: For each digit place (units, tens, hundreds, etc.), starting from the least significant digit:
    a.  **Stable Sort**: Use a stable sorting algorithm (typically Counting Sort) to sort the array elements based *only* on the current digit being considered. Stability is crucial because it ensures that if two numbers have the same digit at the current place, their relative order from previous passes (based on less significant digits) is maintained.
    b.  **Counting Sort for a Digit**:
        i.  Create a \`count\` array (size 10 for decimal digits 0-9) to store the frequency of each digit.
        ii. Iterate through the input array. For each number, extract the current significant digit (e.g., using \`(number / exp) % 10\`, where \`exp\` is 1, 10, 100,...). Increment the count for this digit in the \`count\` array.
        iii. Modify the \`count\` array to store the cumulative sum of counts. \`count[i]\` will now store the position where the last number with digit \`i\` should go in the output array.
        iv. Create an \`output\` array. Iterate through the input array *in reverse* (to maintain stability). For each number, find its current significant digit. Place the number in \`output[count[digit] - 1]\`. Decrement \`count[digit]\`.
        v.  Copy the \`output\` array back to the original input array.
3.  **Repeat**: Increment the exponent (\`exp *= 10\`) to move to the next significant digit and repeat step 2 until all digit places of the maximum number have been processed.

### Example: Sorting \`[170, 45, 75, 90, 802, 24, 2, 66]\`
Max value is 802 (3 digits).
**Pass 1 (Units Digit, exp = 1):**
- Digits: 0, 5, 5, 0, 2, 4, 2, 6
- After Counting Sort by units digit: \`[170, 90, 802, 2, 24, 45, 75, 66]\`
    * (0s: 170, 90)
    * (2s: 802, 2)
    * (4s: 24)
    * (5s: 45, 75)
    * (6s: 66)

**Pass 2 (Tens Digit, exp = 10):**
- Input for this pass: \`[170, 90, 802, 2, 24, 45, 75, 66]\`
- Tens Digits (0 for numbers < 10): 7, 9, 0, 0, 2, 4, 7, 6
- After Counting Sort by tens digit: \`[802, 2, 24, 45, 66, 170, 75, 90]\` (order within same tens digit is preserved from Pass 1 due to stable sort, e.g., 802 before 2 because 80**2** came before **2**).

**Pass 3 (Hundreds Digit, exp = 100):**
- Input for this pass: \`[802, 2, 24, 45, 66, 170, 75, 90]\`
- Hundreds Digits (0 for numbers < 100): 8, 0, 0, 0, 0, 1, 0, 0
- After Counting Sort by hundreds digit: \`[2, 24, 45, 66, 75, 90, 170, 802]\`

Array is now sorted.

### Characteristics:
-   **Non-Comparative**: Does not compare elements directly.
-   **Stable**: If the underlying sort (Counting Sort) is stable, Radix Sort is stable.
-   **Integer Sorting**: Primarily for integers, but can be adapted for strings or other data types that can be mapped to integer keys or have fixed-size components.

### Advantages:
-   **Fast for Certain Data**: Can be faster than O(N log N) comparison sorts when the number of digits/keys (\`d\`) is small and the range of digit values (\`k\`, base of numbers) is also small. Time complexity is O(d \* (N + k)).
-   Linear time if \`d\` is constant and \`k\` is O(N).

### Disadvantages:
-   **Not General-Purpose**: Less flexible than comparison sorts. Primarily for integers or fixed-size keys.
-   **Space Complexity**: Can be high (O(N+k)) due to Counting Sort.
-   The constant factor (\`d\`) can be large for numbers with many digits (e.g., 64-bit integers).

### Common Use Cases:
-   Sorting integers, especially when the range of numbers or the number of digits is manageable.
-   Used in specialized applications like suffix array construction.
-   Historically used in card-sorting machines.
  `,
  timeComplexities: {
    best: "O(d*(n+k))", // d = number of digits, n = number of elements, k = base (range of digit values, e.g., 10 for decimal)
    average: "O(d*(n+k))",
    worst: "O(d*(n+k))",
  },
  spaceComplexity: "O(n+k) for Counting Sort as a subroutine.",
};
