
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'sudoku-solver',
  title: 'Sudoku Solver',
  category: 'Backtracking',
  difficulty: 'Medium',
  description: 'Solves Sudoku puzzles using a backtracking algorithm to fill a 9x9 grid according to Sudoku rules.',
  longDescription: `Sudoku is a logic-based, combinatorial number-placement puzzle. The objective is to fill a 9×9 grid with digits so that each column, each row, and each of the nine 3×3 subgrids (also called "boxes" or "blocks") that compose the grid contain all of the digits from 1 to 9. The puzzle setter provides a partially completed grid, which for a well-posed puzzle has a unique solution.

This problem is a classic example of a **Constraint Satisfaction Problem** that can be solved efficiently using a **backtracking** algorithm.

### How it Works (Backtracking Algorithm):

1.  **Find an Empty Cell**: Scan the grid (e.g., row by row, then column by column) to find the next empty cell (a cell typically represented by 0 or a placeholder).
    *   If no empty cells are found, the Sudoku puzzle is completely filled, meaning a solution has been found. The algorithm terminates successfully.

2.  **Try Numbers**: For the found empty cell at \`(row, col)\`, try placing numbers from 1 to 9 one by one.
    a.  For each number \`num\` (from 1 to 9):
        i.  **Check Safety (\`isSafe(board, row, col, num)\`)**: Before placing \`num\`, check if it's valid according to Sudoku rules:
            *   **Row Check**: Ensure \`num\` is not already present in the current \`row\`.
            *   **Column Check**: Ensure \`num\` is not already present in the current \`col\`.
            *   **3x3 Subgrid Check**: Ensure \`num\` is not already present in the 3x3 subgrid that \`(row, col)\` belongs to. The starting row of the subgrid is \`row - row % 3\` and the starting column is \`col - col % 3\`.
        ii. **Place and Recurse**: If \`num\` is safe to place at \`(row, col)\`:
            - Place \`num\` in \`board[row][col]\`.
            - Recursively call the main solving function to try and solve the rest of the puzzle with this placement (i.e., find the next empty cell and repeat the process).
            - If the recursive call returns \`true\` (meaning the rest of the puzzle was successfully solved with \`num\` at \`(row, col)\`), then this path leads to a solution. Propagate \`true\` back up the call stack.
        iii. **Backtrack**: If the recursive call returns \`false\` (meaning placing \`num\` at \`(row, col)\` did not lead to a solution for the rest of the puzzle), then \`num\` was a wrong choice for this cell. **Remove \`num\`** from \`board[row][col]\` (reset it to 0). This is the backtracking step. The loop then continues to try the next number (from \`num+1\` to 9) for the cell \`(row, col)\`.

3.  **No Valid Number Found**: If the loop from 1 to 9 completes for the current empty cell \`(row, col)\` and none of the numbers lead to a solution, it means a previous placement was incorrect. The function returns \`false\`, triggering backtracking in the caller function (the one that placed a number in the *previous* empty cell).

### Characteristics:
-   **Recursive**: The solution naturally lends itself to a recursive implementation.
-   **Depth-First Search**: It explores one possibility as far as it can go before backtracking.
-   **Pruning**: The \`isSafe\` check effectively prunes branches of the search space that would violate Sudoku rules.

### Time and Space Complexity:
-   **Time Complexity**: In the worst case, the algorithm might explore many possibilities. A loose upper bound is O(9^m), where \`m\` is the number of empty cells, as each empty cell could potentially try 9 numbers. However, due to constraints, the actual search space is much smaller. For a standard 9x9 Sudoku, solutions are typically found very quickly.
-   **Space Complexity**: O(N²) for storing the board (where N=9 for a standard Sudoku). The recursion call stack depth can also go up to \`m\` (number of empty cells) in the worst case, so O(N²) if \`m\` is proportional to N².

### Use Cases:
-   Solving Sudoku puzzles (obviously!).
-   Demonstrating backtracking as a problem-solving technique.
-   Can be adapted for other constraint satisfaction problems.

The AlgoVista Sudoku Solver visualizes the process of finding empty cells, trying numbers, checking safety, placing numbers, and backtracking when a path doesn't lead to a solution.`,
  timeComplexities: {
    best: "O(1) (if already solved or simple), Average/Worst: O(9^m) where m is number of empty cells",
    average: "O(9^m)", // m is number of empty cells
    worst: "O(9^m)"   // m is number of empty cells
  },
  spaceComplexity: "O(N^2) for board, O(N^2) for recursion stack (N=9).",
};
