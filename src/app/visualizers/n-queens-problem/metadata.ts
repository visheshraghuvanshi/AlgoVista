
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'n-queens-problem',
  title: 'N-Queens Problem',
  category: 'Backtracking',
  difficulty: 'Medium',
  description: 'Places N chess queens on an N×N chessboard so that no two queens threaten each other. A classic backtracking problem.',
  longDescription: `The N-Queens problem is the challenge of placing N non-attacking chess queens on an N×N chessboard. This means that no two queens should share the same row, column, or either of the two main diagonals. It's a classic example of a problem that can be solved efficiently using a technique called **backtracking**.

### How it Works (Backtracking Approach):
The general idea is to place queens one by one in different columns, starting from the leftmost column. When attempting to place a queen in a column, we try each row. If a row is found where a queen can be placed safely (without being attacked by already placed queens), we mark this position and recursively try to place queens in the next column. If we are not able to place a queen in the current column (i.e., no row is safe), we "backtrack": we remove the queen from its current position in the previous column and try the next available safe row in that previous column.

**Detailed Algorithm Steps:**

1.  **Start Function (\`solveNQueens(N)\`)**:
    *   Initializes an N×N board, often represented by a 2D array, with all cells empty (e.g., marked with 0).
    *   Calls a recursive helper function, say \`solveUtil(board, currentCol)\`, usually starting with \`currentCol = 0\`.
    *   This function will store all valid board configurations (solutions).

2.  **Recursive Helper Function (\`solveUtil(board, currentCol)\`)**:
    *   **Base Case**: If \`currentCol >= N\` (i.e., we have successfully placed queens in all columns from 0 to N-1), it means a complete solution has been found.
        *   Add a copy of the current \`board\` configuration to the list of solutions.
        *   Return (often \`true\` if finding only one solution, or just continue to find all solutions).
    *   **Recursive Step**: Iterate through each \`row\` (from 0 to N-1) in the \`currentCol\`:
        a.  **Check Safety**: Call an \`isSafe(board, row, currentCol)\` function. This function checks if placing a queen at \`(row, currentCol)\` is valid (i.e., it doesn't conflict with queens already placed in columns 0 to \`currentCol - 1\`).
        b.  **Place Queen**: If \`isSafe\` returns true:
            i.  Place a queen on \`board[row][currentCol]\` (e.g., set cell value to 1).
            ii. **Recurse**: Call \`solveUtil(board, currentCol + 1)\` to try and place queens in the next column.
            iii. **Backtrack**: After the recursive call returns (regardless of whether it found a solution down that path or not, if we are searching for *all* solutions), **remove the queen** from \`board[row][currentCol]\` (e.g., set cell value back to 0). This is the crucial backtracking step. It "undoes" the current choice, allowing the loop to try placing the queen in the next row of the \`currentCol\`, or for previous columns to try different placements.
    *   **Return**: If the loop finishes without finding a placement in the current column that leads to a full solution (for this branch of recursion), the function effectively returns (e.g., returns \`false\` if it were designed to stop after one solution and this path didn't yield one).

3.  **Safety Check Function (\`isSafe(board, row, col)\`)**:
    *   This function checks if a queen placed at \`(row, col)\` is attacked by any other queen already on the board in columns \`0\` to \`col-1\`.
    *   **Check Row Conflict**: Iterate \`c\` from \`0\` to \`col-1\`. If \`board[row][c]\` has a queen, it's not safe.
    *   **Check Upper-Left Diagonal Conflict**: Iterate with \`r = row-1, c = col-1\` decrementing both. If \`board[r][c]\` has a queen, it's not safe.
    *   **Check Lower-Left Diagonal Conflict**: Iterate with \`r = row+1, c = col-1\` (incrementing \`r\`, decrementing \`c\`). If \`board[r][c]\` has a queen, it's not safe.
    *   If no conflicts are found, return \`true\`; otherwise, return \`false\`.

### Characteristics:
-   **Backtracking**: The core of the algorithm. If a path doesn't lead to a solution, it "backtracks" to a previous decision point and tries a different option.
-   **State-Space Search**: Explores the space of possible queen placements.
-   **Time Complexity**: The number of valid solutions can vary. In the worst case, it explores a significant portion of an N! search space, but pruning due to safety checks makes it better. It's roughly O(N!), though more precise bounds are complex. For a fixed N like 8, it's constant, but the constant is large.
-   **Space Complexity**: O(N²) for storing the board, and O(N) for the recursion call stack depth.

### Use Cases:
-   Classic example for teaching backtracking and recursion.
-   Constraint satisfaction problems.
-   Puzzles and game AI.

The AlgoVista N-Queens visualizer shows the board, the queen placements being tried, the safety checks, and the backtracking process.
`,
  timeComplexities: {
    best: "O(N!) in worst case (exploring permutations)",
    average: "O(N!)",
    worst: "O(N!)"
  },
  spaceComplexity: "O(N^2) for board, O(N) for recursion stack.",
};
