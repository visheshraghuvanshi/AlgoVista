
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'sieve-of-eratosthenes',
  title: 'Sieve of Eratosthenes',
  category: 'Math & Number Theory',
  difficulty: 'Medium',
  description: 'An ancient algorithm for finding all prime numbers up to a specified integer.',
  longDescription: `The Sieve of Eratosthenes is a highly efficient ancient algorithm for finding all prime numbers up to any given limit. It does so by iteratively marking as composite (i.e., not prime) the multiples of each prime, starting with the first prime number, 2.

### How it Works (Optimized):
1.  **Create a Boolean Array**: Create a list, \`isPrime\`, of size \`n + 1\`, where all entries are initially set to \`true\`. \`isPrime[i]\` will be false if \`i\` is not prime, and true otherwise. Mark 0 and 1 as not prime.
2.  **Iterate and Mark**:
    *   Start with \`p = 2\`, the first prime.
    *   While \`p*p <= n\`:
        *   If \`isPrime[p]\` is still \`true\`, then \`p\` is a prime number.
        *   Mark all multiples of \`p\` from \`p*p\` up to \`n\` as not prime (set \`isPrime[i] = false\`). The reason we start from \`p*p\` is that smaller multiples of \`p\` (like \`2*p\`, \`3*p\`, ...) would have already been marked by smaller primes (like 2, 3, ...).
        *   Find the next number greater than \`p\` that is still marked as \`true\`. This is the next prime to process.

3.  **Collect Primes**: After the loop finishes, all indices \`i\` for which \`isPrime[i]\` is \`true\` are the prime numbers up to \`n\`.

### Example: Find primes up to 10
1.  \`isPrime\` = [F, F, T, T, T, T, T, T, T, T, T] (indices 0-10)
2.  **p = 2**: It's prime. Start marking from \`2*2=4\`. Mark 4, 6, 8, 10 as false.
    \`isPrime\` = [F, F, T, T, F, T, F, T, F, T, F]
3.  **p = 3**: It's prime. Start marking from \`3*3=9\`. Mark 9 as false.
    \`isPrime\` = [F, F, T, T, F, T, F, T, F, F, F]
4.  **Next p is 4**, but \`isPrime[4]\` is false. Skip.
5.  **Next p is 5**. But \`5*5 = 25 > 10\`. The outer loop condition \`p*p <= n\` fails. Stop.
6.  **Result**: The indices that are still true are 2, 3, 5, 7. These are the primes.

### Time and Space Complexity:
-   **Time Complexity**: O(N log log N). This is a significant improvement over testing each number for primality.
-   **Space Complexity**: O(N) to store the boolean array.`,
  timeComplexities: {
    best: "O(n log log n)",
    average: "O(n log log n)",
    worst: "O(n log log n)",
  },
  spaceComplexity: "O(n) for storing the boolean array of markings.",
};
