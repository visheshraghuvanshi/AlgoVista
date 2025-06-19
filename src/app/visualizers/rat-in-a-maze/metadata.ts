
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'rat-in-a-maze',
  title: 'Rat in a Maze',
  category: 'Backtracking',
  difficulty: 'Medium',
  description: 'A backtracking algorithm to find a path for a rat to reach its destination in a maze from a source.',
  longDescription: `Rat in a Maze is a classic backtracking problem. The puzzle involves a maze, typically represented as a 2D binary matrix, where some cells are open (path) and some are blocked (wall). A rat starts at a source cell (usually top-left, e.g., \`[0][0]\`) and needs to reach a destination cell (usually bottom-right, e.g., \`[N-1][M-1]\`). The rat can only move in certain directions (commonly right and down, but sometimes all four cardinal directions are allowed).

### How it Works (Backtracking Algorithm):
The core idea is to explore possible paths recursively. If a path leads to a dead end or a blocked cell, the algorithm "backtracks" to a previous decision point and tries an alternative path.

1.  **Define the Maze and Solution Matrix**:
    *   **Maze (\`maze[][]\`)**: The input N×M matrix where \`maze[r][c] = 1\` means the cell is open, and \`maze[r][c] = 0\` means it's blocked.
    *   **Solution Matrix (\`sol[][]\`)**: An N×M matrix of the same dimensions, initialized to all 0s. When a cell \`(r,c)\` is part of the path to the solution, \`sol[r][c]\` is set to 1.

2.  **Start at the Source**: The rat begins at the source cell (e.g., \`maze[0][0]\`).

3.  **Recursive Solver Function** (e.g., \`solveUtil(currentRow, currentCol)\`):
    a.  **Base Case (Destination Reached)**:
        *   If \`(currentRow, currentCol)\` is the destination cell (e.g., \`(N-1, M-1)\`):
            *   Mark \`sol[currentRow][currentCol] = 1\`.
            *   A solution path has been found. Return \`true\`.
    b.  **Check Validity (Is Safe to Move?)**:
        *   Before moving to a cell \`(r, c)\`, check if it's a valid move using an \`isSafe(r, c)\` function:
            *   Is \`(r, c)\` within the maze boundaries?
            *   Is \`maze[r][c]\` an open path (value 1)?
            *   Has \`sol[r][c]\` already been visited as part of the *current* path (value 0 in \`sol\` matrix)? This prevents cycles in paths if all directions are allowed.
        *   If the current cell \`(currentRow, currentCol)\` itself is not safe (this check is usually done before the recursive call by the caller), return \`false\`.
    c.  **Explore Paths**:
        i.  **Mark Current Cell**: If \`(currentRow, currentCol)\` is safe and not yet part of the current solution path, mark it as part of the path: \`sol[currentRow][currentCol] = 1\`.
        ii. **Try Moving (e.g., Down then Right)**:
            -   Attempt to move **Down**: Recursively call \`solveUtil(currentRow + 1, currentCol)\`. If this call returns \`true\`, it means a path was found through the Downward move. Propagate \`true\` upwards.
            -   If Downward move didn't lead to a solution, attempt to move **Right**: Recursively call \`solveUtil(currentRow, currentCol + 1)\`. If this returns \`true\`, propagate \`true\`.
            -   (If other directions like Up and Left are allowed, they would be tried here as well, typically after checking they are not the cell from which the rat just came to avoid trivial backtracking).
        iii. **Backtrack**: If none of the attempted moves (Down, Right, etc.) from \`(currentRow, currentCol)\` lead to a solution (i.e., all recursive calls returned \`false\`):
            -   Unmark the current cell from the solution path: \`sol[currentRow][currentCol] = 0\`. This is the "backtracking" step – undoing the choice.
            -   Return \`false\` to the caller, indicating this path from the previous cell was a dead end.
    d.  **Not Safe**: If the initial check in \`solveUtil\` finds \`(currentRow, currentCol)\` is not safe, return \`false\`.

4.  **Initial Call**: The main function calls \`solveUtil(sourceRow, sourceCol)\`. If it returns \`true\`, the \`sol\` matrix contains a path. If \`false\`, no path exists.

### Characteristics:
-   **Depth-First Exploration**: The algorithm explores one path as far as possible.
-   **State Reversal**: Backtracking involves reverting to a previous state when a dead end is hit.
-   **Multiple Solutions**: The algorithm can be modified to find all possible paths by not returning \`true\` immediately upon finding a solution but continuing to explore other branches (and collecting all valid \`sol\` matrices).

### Time and Space Complexity:
-   **Time Complexity**: In the worst case, the algorithm might explore all possible paths. If the rat can move in \`k\` directions, and the maze is roughly N×M, the complexity can be exponential, e.g., O(k^(NM)). However, for many practical mazes, pruning due to walls and already visited path cells reduces this significantly.
-   **Space Complexity**: O(N\*M) for storing the solution matrix, and O(N\*M) for the recursion call stack in the worst case (e.g., a path that visits every cell).

### Use Cases:
-   Finding paths in mazes or grids.
-   Illustrating the backtracking algorithmic paradigm.
-   Solving puzzles like Sudoku or N-Queens (which are variations of constraint satisfaction with backtracking).
-   Pathfinding in simple AI or robotics.

The AlgoVista visualizer shows the rat's current position, the path being built in the solution matrix, and highlights cells being considered or backtracked from.
`,
  timeComplexities: {
    best: "O(N*M) if a path is found quickly.",
    average: "Exponential in worst-case scenarios, e.g. O(2^(N*M)) or O(4^(N*M)) if multiple directions allowed.",
    worst: "Exponential, depending on maze structure and allowed moves."
  },
  spaceComplexity: "O(N*M) for the solution matrix and recursion stack depth.",
};
