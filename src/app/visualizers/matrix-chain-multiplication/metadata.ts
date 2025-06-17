
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'matrix-chain-multiplication',
  title: 'Matrix Chain Multiplication',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Determines the optimal parenthesization for a sequence of matrix multiplications to minimize the total number of scalar multiplications.',
  longDescription: 'Matrix Chain Multiplication is a classic dynamic programming problem. Given a sequence of matrices, the goal is to find the most efficient way (minimum number of scalar multiplications) to multiply these matrices. The problem is not actually to perform the multiplications, but merely to decide the sequence of the matrix multiplications involved. There are many options because matrix multiplication is associative. In other words, no matter how the product is parenthesized, the result will remain the same. For example, if we have four matrices A, B, C, and D, we would have: (ABC)D = (AB)(CD) = A(BCD) = A(BC)D = ... However, the order in which we parenthesize the product affects the number of simple arithmetic operations needed to compute the product, or the efficiency.\n\nAlgorithm Steps (Dynamic Programming):\n1. Let `p` be an array where `p[i-1] x p[i]` is the dimension of matrix A_i.\n2. Create a DP table `dp[n][n]` where `n` is the number of matrices. `dp[i][j]` will store the minimum number of scalar multiplications needed to compute the product A_i...A_j.\n3. Base Cases: `dp[i][i] = 0` for all `i` (cost of multiplying a single matrix is 0).\n4. Fill the table: Iterate for chain length `L` from 2 to `n`. For each `L`, iterate for `i` from 1 to `n-L+1`. Let `j = i+L-1`.\n   `dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j])` for `k` from `i` to `j-1`.\n5. The value `dp[1][n]` (or `dp[0][n-1]` if 0-indexed) is the minimum number of scalar multiplications.\n\nUse Cases: Compiler design for optimizing code, operations research.',
  timeComplexities: {
    best: "O(N³)",    // N = number of matrices
    average: "O(N³)",
    worst: "O(N³)",
  },
  spaceComplexity: "O(N²) for the DP table.",
};
