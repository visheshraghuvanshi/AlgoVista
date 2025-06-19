
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'coin-change',
  title: 'Coin Change Problem',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Finds the minimum number of coins or the number of ways to make a certain amount using a given set of coin denominations.',
  longDescription: `The Coin Change Problem is a classic problem in computer science that asks for the optimal way to make a specific amount of money using a given set of coin denominations. There are several variations, with two of the most common being:

1.  **Minimum Coins Problem (Coin Change - Fewest Coins)**:
    *   **Goal**: Find the minimum number of coins required to make a target amount. Each coin denomination has an unlimited supply.
    *   **Example**: Given coins \`[1, 2, 5]\` and amount \`11\`, the minimum number of coins is 3 (e.g., 5+5+1).
    *   **Approach (Dynamic Programming - Bottom-Up)**:
        1.  Create a DP array, \`dp\`, of size \`amount + 1\`. \`dp[i]\` will store the minimum number of coins needed to make amount \`i\`.
        2.  Initialize \`dp[0] = 0\` (zero coins are needed to make amount 0).
        3.  Initialize all other \`dp[i]\` values to infinity (or a very large number).
        4.  Iterate from \`i = 1\` to \`amount\`:
            For each \`coin\` in the given denominations:
            If \`coin <= i\` and \`dp[i - coin]\` is not infinity (meaning amount \`i - coin\` is reachable):
            \`dp[i] = min(dp[i], 1 + dp[i - coin])\`
            (This means the minimum coins for amount \`i\` is either its current value or 1 (for the current \`coin\`) plus the minimum coins needed for the remaining amount \`i - coin\`).
        5.  The result is \`dp[amount]\`. If \`dp[amount]\` is still infinity, the amount cannot be made.

2.  **Number of Ways Problem (Coin Change - Combinations)**:
    *   **Goal**: Find the total number of distinct ways to make a target amount using an unlimited supply of each coin denomination. The order of coins does not matter.
    *   **Example**: Given coins \`[1, 2, 5]\` and amount \`5\`, ways are:
        *   \`1+1+1+1+1\`
        *   \`1+1+1+2\`
        *   \`1+2+2\`
        *   \`5\`
        Total 4 ways.
    *   **Approach (Dynamic Programming - Bottom-Up)**:
        1.  Create a DP array, \`dp\`, of size \`amount + 1\`. \`dp[i]\` will store the number of ways to make amount \`i\`.
        2.  Initialize \`dp[0] = 1\` (there is one way to make amount 0: by using no coins).
        3.  Initialize all other \`dp[i]\` values to 0.
        4.  Iterate through each \`coin\` in the denominations:
            For each amount \`i\` from \`coin\` to \`amount\`:
            \`dp[i] = dp[i] + dp[i - coin]\`
            (This means the number of ways to make amount \`i\` using the current \`coin\` is added to the ways of making amount \`i\` without using this \`coin\` but using previous coins). The outer loop for coins ensures that each coin's contribution is considered systematically to avoid overcounting combinations.
        5.  The result is \`dp[amount]\`.

### Characteristics:
-   **Optimal Substructure**: The solution to the main problem can be constructed from optimal solutions to its subproblems.
-   **Overlapping Subproblems**: The same subproblems (e.g., min coins for a smaller amount) are encountered multiple times, making DP suitable.

### Time and Space Complexity (for both common variants):
-   **Time Complexity**: O(N\*W), where N is the number of coin denominations and W is the target amount. This is due to iterating through amounts and then through coins (or vice-versa).
-   **Space Complexity**: O(W) for the DP array.

### Use Cases:
-   Financial applications (making change).
-   Resource allocation problems.
-   Inventory management.
-   Any problem that involves finding optimal combinations or counts under constraints with discrete items.

AlgoVista visualizes these DP approaches by showing the DP table being filled step-by-step.`,
  timeComplexities: {
    best: "O(N*W)",
    average: "O(N*W)",
    worst: "O(N*W)",
  },
  spaceComplexity: "O(W) where N is the number of coin denominations and W is the target amount (for the DP array).",
};
