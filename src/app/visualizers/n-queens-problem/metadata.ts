
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'n-queens-problem',
  title: 'N-Queens Problem',
  category: 'Backtracking',
  difficulty: 'Medium',
  description: 'Places N chess queens on an N×N chessboard so that no two queens threaten each other. A classic backtracking problem.',
  longDescription: `The N-Queens problem is the challenge of placing N non-attacking chess queens on an N×N chessboard. This means that no two queens should share the same row, column, or either of the two main diagonals. It's a classic example of a problem that can be solved efficiently using a technique called **backtracking**.

### How it Works (Backtracking Approach):
The general idea is to place queens one by one in different columns for each row, starting from the top row. When attempting to place a queen in a row, we try each column. If a column is found where a queen can be placed safely (without being attacked by already placed queens in previous rows), we mark this position and recursively try to place a queen in the next row. If we are not able to place a queen in the current row (i.e., no column is safe), we "backtrack": we remove the queen from its current position in the previous row and try the next available safe column in that previous row.

**Detailed Algorithm Steps:**

1.  **Start Function (\`solveNQueens(N)\`)**:
    *   Initializes an N×N board, often represented by a 2D array, with all cells empty (e.g., marked with 0).
    *   Calls a recursive helper function, say \`solveUtil(board, currentRow)\`, usually starting with \`currentRow = 0\`.
    *   This function will store all valid board configurations (solutions).

2.  **Recursive Helper Function (\`solveUtil(board, row)\`)**:
    *   **Base Case**: If \`row >= N\` (i.e., we have successfully placed queens in all rows from 0 to N-1), it means a complete solution has been found.
        *   Add a copy of the current \`board\` configuration to the list of solutions.
        *   Return (often \`true\` if finding only one solution, or just continue to find all solutions).
    *   **Recursive Step**: Iterate through each \`col\` (from 0 to N-1) in the \`row\`:
        a.  **Check Safety**: Call an \`isSafe(board, row, col)\` function. This function checks if placing a queen at \`(row, col)\` is valid (i.e., it doesn't conflict with queens already placed in rows 0 to \`row - 1\`).
        b.  **Place and Recurse**: If \`isSafe\` returns true:
            i.  Place a queen on \`board[row][col]\`.
            ii. **Recurse**: Call \`solveUtil(board, row + 1)\` to try and place a queen in the next row.
            iii. **Backtrack**: After the recursive call returns (regardless of whether it found a solution down that path or not, if we are searching for *all* solutions), **remove the queen** from \`board[row][col]\`. This is the crucial backtracking step. It "undoes" the current choice, allowing the loop to try placing the queen in the next column of the \`row\`.
    *   **Return**: If the loop finishes without finding a placement in the current row that leads to a full solution (for this branch of recursion), the function effectively returns.

3.  **Safety Check Function (\`isSafe(board, row, col)\`)**:
    *   This function checks if a queen placed at \`(row, col)\` is attacked by any other queen already on the board in rows \`0\` to \`row-1\`.
    *   **Check Column Conflict**: Iterate upwards from the current row in the same column.
    *   **Check Upper-Left Diagonal Conflict**: Iterate diagonally up and to the left.
    *   **Check Upper-Right Diagonal Conflict**: Iterate diagonally up and to the right.
    *   If no conflicts are found, return \`true\`; otherwise, return \`false\`.

### Characteristics:
-   **Backtracking**: The core of the algorithm. If a path doesn't lead to a solution, it "backtracks" to a previous decision point and tries a different option.
-   **State-Space Search**: Explores the space of possible queen placements.
-   **Time Complexity**: The number of valid solutions can vary. In the worst case, it explores a significant portion of an N! search space, but pruning due to safety checks makes it better. It's roughly O(N!).
-   **Space Complexity**: O(N²) for storing the board, and O(N) for the recursion call stack depth.

### Use Cases:
-   Classic example for teaching backtracking and recursion.
-   Constraint satisfaction problems.
-   Puzzles and game AI.`,
  timeComplexities: {
    best: "O(N!)",
    average: "O(N!)",
    worst: "O(N!)"
  },
  spaceComplexity: "O(N^2) for board and recursion stack.",
};
