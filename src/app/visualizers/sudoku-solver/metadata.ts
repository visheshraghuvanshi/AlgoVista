
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'sudoku-solver',
  title: 'Sudoku Solver',
  category: 'Backtracking',
  difficulty: 'Medium',
  description: 'Solves Sudoku puzzles using a backtracking algorithm to fill a 9x9 grid according to Sudoku rules.',
  longDescription: "Sudoku is a logic-based, combinatorial number-placement puzzle. The objective is to fill a 9×9 grid with digits so that each column, each row, and each of the nine 3×3 subgrids that compose the grid contain all of the digits from 1 to 9. The puzzle is typically solved using backtracking.\n\nAlgorithm Steps (Backtracking):\n1. Find an empty cell (a cell with 0).\n2. If no empty cell is found, the puzzle is solved, return true.\n3. For numbers from 1 to 9:\n   a. Try placing the number in the empty cell.\n   b. Check if this placement is valid (i.e., the number doesn't violate Sudoku rules in the current row, column, or 3x3 subgrid).\n   c. If valid, recursively call the solve function for the next empty cell.\n      i. If the recursive call returns true, it means a solution is found, so return true.\n   d. If the number doesn't lead to a solution (recursive call returns false), backtrack: reset the cell to 0 and try the next number.\n4. If all numbers (1-9) have been tried and none lead to a solution for the current empty cell, return false (this triggers backtracking in the previous call).\n\nUse Cases: Puzzles, constraint satisfaction problems.",
  timeComplexities: {
    best: "O(1) (if already solved or simple), Average/Worst: O(9^m) where m is number of empty cells",
    average: "O(9^m)", // m is number of empty cells
    worst: "O(9^m)"   // m is number of empty cells
  },
  spaceComplexity: "O(N^2) for board, O(N^2) for recursion stack (N=9).",
};
