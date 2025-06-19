
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'matrix-chain-multiplication',
  title: 'Matrix Chain Multiplication',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Determines the optimal parenthesization for a sequence of matrix multiplications to minimize the total number of scalar multiplications.',
  longDescription: `Matrix Chain Multiplication (MCM) is a classic optimization problem that can be solved using dynamic programming. Given a sequence (chain) of matrices \`A1, A2, ..., An\`, the goal is to find the most efficient way to multiply these matrices. The problem is not to actually perform the multiplications, but merely to decide the sequence of multiplications. Matrix multiplication is associative, meaning \`(AB)C = A(BC)\`, so the final result is the same regardless of parenthesization. However, the number of scalar multiplications required can vary significantly based on the chosen order.

For example, if we have three matrices A (10x30), B (30x5), and C (5x60):
-   \`(AB)C\`: Cost of AB = 10\*30\*5 = 1500. Resulting matrix is 10x5. Cost of (AB)C = 10\*5\*60 = 3000. Total = 1500 + 3000 = 4500.
-   \`A(BC)\`: Cost of BC = 30\*5\*60 = 9000. Resulting matrix is 30x60. Cost of A(BC) = 10\*30\*60 = 18000. Total = 9000 + 18000 = 27000.
Clearly, the first parenthesization is more efficient.

### How it Works (Dynamic Programming):
1.  **Input**: An array \`p\` of dimensions, where \`p[i-1] x p[i]\` are the dimensions of matrix \`A_i\`. So, if there are \`n\` matrices, the array \`p\` will have \`n+1\` elements.
2.  **Define Subproblem**: Let \`dp[i][j]\` be the minimum number of scalar multiplications needed to compute the product of matrices \`A_i * A_{i+1} * ... * A_j\`.
3.  **Initialization (Base Cases)**:
    *   Create a 2D table \`dp\` of size \`(n+1) x (n+1)\` (if using 1-based indexing for matrices A1 to An).
    *   For any single matrix \`A_i\`, the cost of multiplication is 0. So, \`dp[i][i] = 0\` for all \`i\` from 1 to \`n\`.

4.  **Recurrence Relation (Fill DP Table)**:
    The table is filled based on the chain length \`L\`.
    *   Iterate for chain length \`L\` from 2 to \`n\` (length of the subchain of matrices).
    *   For each \`L\`, iterate for the starting matrix \`i\` from 1 to \`n - L + 1\`.
        *   The ending matrix \`j\` is then \`i + L - 1\`.
        *   To calculate \`dp[i][j]\`, we need to find the optimal split point \`k\` (where \`i <= k < j\`). The split divides the product \`A_i...A_j\` into \`(A_i...A_k) * (A_{k+1}...A_j)\`.
        *   The cost of this particular split is:
            \`cost = dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j]\`
            (The term \`p[i-1] * p[k] * p[j]\` is the cost of multiplying the two resulting matrices: \`(p[i-1] x p[k])\` and \`(p[k] x p[j])\`).
        *   \`dp[i][j]\` is the minimum of these costs over all possible split points \`k\`:
            \`dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j])\` for \`k\` from \`i\` to \`j-1\`.
            (Initialize \`dp[i][j]\` to infinity before the inner loop for \`k\`).

5.  **Result**: The minimum number of scalar multiplications for the entire chain \`A_1...A_n\` is \`dp[1][n]\`.

### Characteristics:
-   **Optimal Substructure**: The optimal solution to multiplying \`A_i...A_j\` contains optimal solutions to subproblems \`A_i...A_k\` and \`A_{k+1}...A_j\`.
-   **Overlapping Subproblems**: Subproblems (e.g., cost of multiplying \`A_2 A_3\`) are solved multiple times in a naive recursive approach. DP stores these results.

### Advantages:
-   Guaranteed to find the most efficient parenthesization.
-   Systematic way to explore all possibilities efficiently.

### Disadvantages:
-   **Time Complexity**: O(N³) due to three nested loops (\`L\`, \`i\`, \`k\`).
-   **Space Complexity**: O(N²) for the DP table.

### Common Use Cases:
-   **Compiler Optimization**: Optimizing the order of matrix multiplications in generated code.
-   **Operations Research**: Problems involving finding optimal ways to combine sequential operations.
-   Evaluating expression trees with associative operators where operation costs vary.

The AlgoVista visualizer demonstrates the filling of the DP table, showing how each \`dp[i][j]\` cell is computed by considering different split points \`k\`.`,
  timeComplexities: {
    best: "O(N³)",    // N = number of matrices
    average: "O(N³)",
    worst: "O(N³)",
  },
  spaceComplexity: "O(N²) for the DP table.",
};
