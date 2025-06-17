
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'rat-in-a-maze',
  title: 'Rat in a Maze',
  category: 'Backtracking',
  difficulty: 'Medium',
  description: 'A backtracking algorithm to find a path for a rat to reach its destination in a maze from a source.',
  longDescription: 'Rat in a Maze is a classic backtracking problem. Given a maze represented as a binary matrix where 0 represents a blocked cell and 1 represents an open cell, a rat starts at source (0,0) and has to reach the destination (N-1, M-1). The rat can move in certain directions (e.g., right and down).\\n\\nAlgorithm Steps (Backtracking):\\n1. Start from the source cell (0,0) and try to move towards the destination cell (N-1, M-1).\\n2. Create a solution matrix of the same size as the maze, initialized to all 0s.\\n3. If the current cell is invalid (out of bounds, or a wall), return false.\\n4. Mark the current cell as part of the solution path in the solution matrix.\\n5. If the current cell is the destination cell, a path is found, return true.\\n6. Try moving in allowed directions (e.g., first Down, then Right):\\n   a. If moving in a direction leads to a solution (recursive call returns true), then return true.\\n7. If none of the moves lead to a solution, backtrack: unmark the current cell from the solution path (set it back to 0) and return false.\\n\\nThis problem demonstrates how backtracking explores all possible paths to find a solution, pruning paths that do not lead to the destination.',
  timeComplexities: {
    best: "O(N*M) if a path is found quickly.",
    average: "Exponential in worst-case scenarios, e.g. O(2^(N*M)) or O(4^(N*M)) if multiple directions allowed.",
    worst: "Exponential, depending on maze structure and allowed moves."
  },
  spaceComplexity: "O(N*M) for the solution matrix and recursion stack depth.",
};
