
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'n-queens-problem',
  title: 'N-Queens Problem',
  category: 'Backtracking',
  difficulty: 'Medium',
  description: 'Places N chess queens on an N×N chessboard so that no two queens threaten each other. A classic backtracking problem.',
  longDescription: `The N-Queens problem is the challenge of placing N non-attacking chess queens on an N×N chessboard. This means that no two queens should share the same row, column, or either of the two main diagonals. It's a classic example of a problem that can be solved efficiently using a technique called **backtracking**.

### How it Works (Optimized Backtracking):
The general idea is to place queens one by one in different columns for each row, starting from the top row. The key optimization is to check if a position is safe in O(1) time instead of scanning the board repeatedly.

**Algorithm Steps:**
1.  **Start Function (\`solveNQueens(N)\`)**:
    *   Initializes an N×N board with empty cells.
    *   Creates boolean arrays to track which columns and diagonals are under attack:
        *   \`cols[c]\`: True if a queen is in column \`c\`.
        *   \`diag1[r+c]\`: True if a queen is on the primary diagonal (\`r+c\` is constant).
        *   \`diag2[r-c+N-1]\`: True if a queen is on the secondary diagonal (\`r-c\` is constant, offset by \`N-1\` to avoid negative indices).
    *   Calls a recursive helper function, say \`solve(row)\`, usually starting with \`row = 0\`.

2.  **Recursive Helper Function (\`solve(row)\`)**:
    *   **Base Case**: If \`row == N\`, all queens have been placed successfully. A solution is found. Store it and return.
    *   **Recursive Step**: Iterate through each \`col\` (from 0 to N-1) in the current \`row\`:
        a.  **Check Safety (O(1))**: Check if \`cols[col]\`, \`diag1[row+col]\`, and \`diag2[row-c+N-1]\` are all \`false\`.
        b.  **Place and Recurse**: If it's safe:
            i.  Place a queen on \`board[row][col]\`.
            ii. Mark the corresponding column and diagonals as under attack (set them to \`true\`).
            iii. **Recurse**: Call \`solve(row + 1)\` to try and place a queen in the next row.
            iv. **Backtrack**: After the recursive call returns (regardless of its success), "un-place" the queen. Remove the queen from \`board[row][col]\` and reset the column and diagonal trackers for that position to \`false\`. This opens up the position for future exploration in other branches of the recursion.

3.  **Result**: The algorithm explores the entire search space, finding all possible valid configurations of N queens on the board.

### Characteristics:
-   **Backtracking**: The core of the algorithm. If a path doesn't lead to a solution, it "backtracks" to a previous decision point and tries a different option.
-   **State-Space Search**: Explores the space of possible queen placements.
-   **Time Complexity**: O(N!), as it explores permutations of queen placements, though heavily pruned. Each step's safety check is O(1).
-   **Space Complexity**: O(N²) for storing the board for visualization. The optimized logic itself uses O(N) space for the attack-tracking arrays and the recursion stack.

### Use Cases:
-   Classic example for teaching backtracking and recursion.
-   Constraint satisfaction problems.
-   Puzzles and game AI.`,
  timeComplexities: {
    best: "O(N!)",
    average: "O(N!)",
    worst: "O(N!)"
  },
  spaceComplexity: "O(N^2) for board, or O(N) for optimized state tracking and recursion.",
};

    