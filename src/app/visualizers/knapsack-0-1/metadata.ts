
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'knapsack-0-1',
  title: '0/1 Knapsack Problem',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Given items with weights and values, determine the items to include in a knapsack to maximize total value without exceeding weight capacity. Each item can either be included or not (0/1).',
  longDescription: 'The 0/1 Knapsack Problem is a classic optimization problem. You are given a set of items, each with a weight and a value. You need to determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit (knapsack capacity) and the total value is as large as possible. The "0/1" property means that for each item, you either take the whole item or leave it; you cannot take a fractional part of an item or multiple copies of the same item type (unless multiple identical items are given as distinct items in the input).\\n\\nAlgorithm Steps (Dynamic Programming - Iterative):\\n1. Create a DP table `dp[n+1][W+1]`, where `n` is the number of items and `W` is the knapsack capacity.\\n2. `dp[i][w]` will store the maximum value that can be obtained using the first `i` items with a maximum weight capacity of `w`.\\n3. Base Cases:\\n   - `dp[0][w] = 0` for all `w` (no items, no value).\\n   - `dp[i][0] = 0` for all `i` (no capacity, no value).\\n4. Fill the table: For each item `i` (from 1 to `n`) and for each weight `w` (from 1 to `W`):\\n   - If `weight[i-1] <= w` (current item can be included):\\n     `dp[i][w] = max(value[i-1] + dp[i-1][w - weight[i-1]], dp[i-1][w])`\\n     This means `dp[i][w]` is the maximum of: (value of current item + max value from remaining capacity with previous items) OR (max value without including current item).\\n   - Else (current item is too heavy to include):\\n     `dp[i][w] = dp[i-1][w]` (value is the same as not including this item).\\n5. The value `dp[n][W]` is the maximum value that can be obtained.\\n\\nTo reconstruct which items were chosen, one can backtrack through the DP table starting from `dp[n][W]`.',
  timeComplexities: {
    best: "O(N*W)",    // N = number of items, W = knapsack capacity
    average: "O(N*W)",
    worst: "O(N*W)",
  },
  spaceComplexity: "O(N*W) for the DP table. Can be optimized to O(W) if only the maximum value is needed, not the items themselves, by using only two rows (or one row) of the DP table.",
};
