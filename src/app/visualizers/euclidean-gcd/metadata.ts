
// src/app/visualizers/euclidean-gcd/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'euclidean-gcd',
  title: 'Euclidean Algorithm for GCD',
  category: 'Math & Number Theory',
  difficulty: 'Easy',
  description: 'Efficiently finds the greatest common divisor (GCD) of two integers. Now with interactive step-by-step visualization!',
  longDescription: `The Euclidean Algorithm is an efficient and ancient method for computing the Greatest Common Divisor (GCD) of two integers, say \`a\` and \`b\`. The GCD is the largest positive integer that divides both \`a\` and \`b\` without leaving a remainder. This algorithm was first described by Euclid in his Elements around 300 BC.

### Core Principle:
The algorithm is based on the principle that the greatest common divisor of two numbers does not change if the larger number is replaced by its difference with the smaller number. This process is repeated until one of the numbers becomes zero, at which point the other number is the GCD.
A more efficient version, commonly used today, relies on the property: \`gcd(a, b) = gcd(b, a mod b)\`, where \`a mod b\` is the remainder when \`a\` is divided by \`b\`.

### How it Works (Iterative Version using Remainders):
1.  **Input**: Two non-negative integers, \`a\` and \`b\`. For the algorithm, we typically assume \`a >= b\`. If not, they can be swapped, or the first step of \`a mod b\` will handle it. For simplicity, often positive integers are used.
2.  **Loop**: While \`b\` is not equal to 0:
    a.  Store the current value of \`b\` in a temporary variable, say \`temp = b\`.
    b.  Update \`b\` to be the remainder of \`a\` divided by \`b\` (i.e., \`b = a % b\`).
    c.  Update \`a\` to be the value stored in \`temp\` (i.e., \`a = temp\`).
3.  **Result**: When \`b\` becomes 0, the value of \`a\` at that point is the GCD of the original two numbers.

### Example: GCD(48, 18)
-   Initial: \`a = 48\`, \`b = 18\`
-   **Iteration 1**:
    -   \`b\` (18) is not 0.
    -   \`temp = 18\`.
    -   \`b = 48 % 18 = 12\`.
    -   \`a = 18\`.
    -   Now: \`a = 18\`, \`b = 12\`.
-   **Iteration 2**:
    -   \`b\` (12) is not 0.
    -   \`temp = 12\`.
    -   \`b = 18 % 12 = 6\`.
    -   \`a = 12\`.
    -   Now: \`a = 12\`, \`b = 6\`.
-   **Iteration 3**:
    -   \`b\` (6) is not 0.
    -   \`temp = 6\`.
    -   \`b = 12 % 6 = 0\`.
    -   \`a = 6\`.
    -   Now: \`a = 6\`, \`b = 0\`.
-   **Loop Terminates**: \`b\` is 0.
-   **Result**: GCD is \`a = 6\`.

### Characteristics:
-   **Efficiency**: Very efficient, especially for large numbers. Its time complexity is logarithmic with respect to the smaller of the two numbers.
-   **Simplicity**: The algorithm is conceptually simple and easy to implement both iteratively and recursively.

### Recursive Version:
\`\`\`
gcd(a, b):
  if b == 0:
    return a
  else:
    return gcd(b, a % b)
\`\`\`

### Advantages:
-   Guaranteed to find the GCD.
-   Much faster than methods like prime factorization for finding GCD, especially for large numbers.

### Disadvantages:
-   Primarily for finding GCD; other methods might be needed if prime factors are also required.

### Applications:
-   Reducing fractions to their simplest form.
-   Cryptography (e.g., as part of the RSA algorithm through the Extended Euclidean Algorithm).
-   Solving Diophantine equations (equations where only integer solutions are sought).
-   Checking if two numbers are coprime (their GCD is 1).

The AlgoVista visualizer demonstrates the iterative version with remainders.`,
  timeComplexities: {
    best: "O(log min(a,b))",
    average: "O(log min(a,b))",
    worst: "O(log min(a,b))",
  },
  spaceComplexity: "O(1) for iterative, O(log min(a,b)) for recursive due to stack space.",
};
    
