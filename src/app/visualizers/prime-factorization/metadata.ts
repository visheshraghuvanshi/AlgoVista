
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'prime-factorization',
  title: 'Prime Factorization',
  category: 'Math & Number Theory',
  difficulty: 'Easy',
  description: 'Finds the prime numbers that multiply together to make the original number.',
  longDescription: `Prime factorization is the process of finding which prime numbers multiply together to make the original number. A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

The **Fundamental Theorem of Arithmetic** states that every integer greater than 1 either is a prime number itself or can be represented as a product of prime numbers, and that, moreover, this representation is unique, up to the order of the factors.

### How it Works (Trial Division Method):
This is a common and relatively simple method for prime factorization.

1.  **Handle Factor 2**:
    *   While the number \`n\` is divisible by 2, add 2 to the list of prime factors and divide \`n\` by 2 (i.e., \`n = n / 2\`). This handles all occurrences of the prime factor 2.

2.  **Iterate for Odd Factors**:
    *   After step 1, \`n\` must be odd. Now, iterate with a divisor \`i\` starting from 3 up to \`sqrt(n)\`.
    *   In each iteration, increment \`i\` by 2 (to check only odd numbers, as all even factors have been removed).
    *   While \`n\` is divisible by the current \`i\`:
        *   Add \`i\` to the list of prime factors.
        *   Divide \`n\` by \`i\` (i.e., \`n = n / i\`).

3.  **Handle Remaining Prime**:
    *   After the loop in step 2, if \`n\` is still greater than 2, then the remaining value of \`n\` must be a prime number itself (it's the largest prime factor). Add this remaining \`n\` to the list of factors. This case occurs when the original number has a prime factor larger than its square root.

### Example: Prime factorization of 84
1.  Initial: \`n = 84\`, \`factors = []\`
2.  **Handle Factor 2**:
    *   \`84 % 2 == 0\`. Add 2 to factors. \`factors = [2]\`. \`n = 84 / 2 = 42\`.
    *   \`42 % 2 == 0\`. Add 2 to factors. \`factors = [2, 2]\`. \`n = 42 / 2 = 21\`.
    *   \`21 % 2 != 0\`. Stop dividing by 2.
3.  **Iterate for Odd Factors** (\`n = 21\`):
    *   Start \`i = 3\`.
    *   \`i*i = 9 <= 21\`.
    *   \`21 % 3 == 0\`. Add 3 to factors. \`factors = [2, 2, 3]\`. \`n = 21 / 3 = 7\`.
    *   \`7 % 3 != 0\`.
    *   Increment \`i\` to 5.
    *   \`i*i = 25 > 7\` (current \`n\`). The loop for \`i\` terminates.
4.  **Handle Remaining Prime**:
    *   Current \`n = 7\`. Since \`7 > 2\`, add 7 to factors. \`factors = [2, 2, 3, 7]\`.
5.  **Result**: Prime factors of 84 are \`[2, 2, 3, 7]\`. (84 = 2² * 3 * 7)

### Characteristics:
-   **Trial Division**: The core of this method.
-   **Optimization**: Only checking divisibility up to \`sqrt(n)\` significantly speeds up the process. Checking only odd divisors (after handling 2) further optimizes.

### Time and Space Complexity:
-   **Time Complexity**: O(sqrt(N)) in the worst case, where N is the number to be factorized. This occurs if N is prime or a product of two large primes.
-   **Space Complexity**: O(log N) in the worst case for storing the prime factors (e.g., if N is a power of 2, like 2^k, it has k = log₂N factors).

### Applications:
-   Cryptography (e.g., RSA algorithm relies on the difficulty of factoring large numbers).
-   Number theory problems.
-   Simplifying fractions.
-   Finding GCD (Greatest Common Divisor) and LCM (Least Common Multiple).

The AlgoVista visualizer for Prime Factorization shows the number being divided and the factors being collected step-by-step.`,
  timeComplexities: {
    best: "O(log n) if n is a power of 2",
    average: "O(sqrt(n)) using trial division",
    worst: "O(sqrt(n)) using trial division",
  },
  spaceComplexity: "O(log n) for storing factors (in the worst case, like 2*3*5*...)",
};
    
