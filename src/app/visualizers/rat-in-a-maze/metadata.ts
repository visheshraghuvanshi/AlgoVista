
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

1.  **Define the Maze and Visited Matrix**:
    *   **Maze (\`maze[][]\`)**: The input N×M matrix where \`maze[r][c] = 1\` means the cell is open, and \`maze[r][c] = 0\` means it's blocked.
    *   **Visited Matrix (\`visited[][]\`)**: An N×M matrix of the same dimensions, initialized to all \`false\`. This is crucial to prevent the rat from moving in circles and re-visiting the same cell in the *current* path.

2.  **Start at the Source**: The rat begins at the source cell (e.g., \`maze[0][0]\`).

3.  **Recursive Solver Function** (e.g., \`solveUtil(currentRow, currentCol, currentPath)\`):
    a.  **Base Case (Destination Reached)**:
        *   If \`(currentRow, currentCol)\` is the destination cell (e.g., \`(N-1, M-1)\`):
            *   A solution is found. Add the \`currentPath\` string to a list of solutions. Return.
    b.  **Check Validity (Is Safe to Move?)**:
        *   Before moving to a cell \`(r, c)\`, check if it's a valid move using an \`isSafe(r, c)\` function:
            *   Is \`(r, c)\` within the maze boundaries?
            *   Is \`maze[r][c]\` an open path (value 1)?
            *   Has \`(r, c)\` already been visited in the current path (\`!visited[r][c]\`)?
    c.  **Explore Paths (D, L, R, U)**:
        i.  **Mark Current Cell**: If the current cell is valid, mark it as visited: \`visited[currentRow][currentCol] = true\`.
        ii. **Try Moving**: For each possible direction (Down, Left, Right, Up):
            -   Calculate the coordinates of the next cell.
            -   Check if the next cell is safe using \`isSafe()\`.
            -   If safe, recursively call \`solveUtil(nextRow, nextCol, currentPath + directionChar)\`.
        iii. **Backtrack**: After exploring all directions from the current cell, **un-mark** the current cell: \`visited[currentRow][currentCol] = false\`. This is the crucial backtracking step. It allows the current cell to be part of a *different* path found later.

4.  **Initial Call**: The main function calls \`solveUtil(sourceRow, sourceCol, "")\`. After the function returns, the list of solutions will contain all possible paths.

### Characteristics:
-   **Depth-First Exploration**: The algorithm explores one path as far as possible.
-   **Backtracking**: The core of the algorithm. If a path doesn't lead to a solution, it "backtracks" to a previous decision point and tries a different option.
-   **State-Space Search**: Explores the space of possible paths.

### Time and Space Complexity:
-   **Time Complexity**: In the worst case, the algorithm might explore many possibilities. A loose upper bound is O(4^(N\*M)) since each of the N\*M cells has at most 4 choices. However, pruning due to walls and visited cells makes the actual performance much better on most mazes.
-   **Space Complexity**: O(N\*M) for storing the visited matrix and for the recursion call stack in the worst case (e.g., a path that visits every cell).

The AlgoVista visualizer shows the rat's current position, the path being built, and highlights cells being considered or backtracked from.`,
  timeComplexities: {
    best: "O(N*M) if a path is found quickly.",
    average: "Exponential in worst-case scenarios, e.g. O(4^(N*M)).",
    worst: "Exponential, depending on maze structure and allowed moves."
  },
  spaceComplexity: "O(N*M) for the visited matrix and recursion stack depth.",
};
