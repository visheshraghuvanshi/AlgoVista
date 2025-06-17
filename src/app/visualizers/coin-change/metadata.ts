
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'coin-change',
  title: 'Coin Change Problem',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Finds the minimum number of coins or the number of ways to make a certain amount using a given set of coin denominations.',
  longDescription: 'The Coin Change Problem involves finding the optimal way to make a specific amount using a given set of coin denominations. There are typically two main variations:\n\n1.  **Minimum Coins**: Find the minimum number of coins required to make the target amount. If it\'s not possible to make the amount, return -1 or infinity.\n    *   **Approach**: Dynamic Programming. Let `dp[i]` be the minimum number of coins needed to make amount `i`. The recurrence relation is `dp[i] = min(dp[i], dp[i - coin] + 1)` for each coin in the denominations, provided `coin <= i`.\n    *   Base case: `dp[0] = 0` (zero coins to make amount 0).\n\n2.  **Number of Ways**: Find the total number of distinct ways to make the target amount using an unlimited supply of each coin denomination.\n    *   **Approach**: Dynamic Programming. Let `dp[i]` be the number of ways to make amount `i`. The recurrence relation when considering a new coin `c` is `dp[i] = dp[i] + dp[i - c]`. To avoid overcounting combinations, iterate through coins one by one and update the `dp` table for amounts that can be formed by including the current coin.\n    *   Base case: `dp[0] = 1` (one way to make amount 0 - by choosing no coins).\n\nBoth variations typically use a bottom-up DP approach, building up the solution for smaller amounts to solve for the target amount. The problem assumes an infinite supply of each coin denomination unless specified otherwise (as in the 0/1 Knapsack variant where each item/coin can be used at most once).',
  timeComplexities: {
    best: "O(N*W)",
    average: "O(N*W)",
    worst: "O(N*W)",
  },
  spaceComplexity: "O(W) where N is the number of coin denominations and W is the target amount (for the DP array).",
};
