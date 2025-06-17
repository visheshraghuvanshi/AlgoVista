
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'n-queens-problem',
  title: 'N-Queens Problem',
  category: 'Backtracking',
  difficulty: 'Medium',
  description: 'Places N chess queens on an N×N chessboard so that no two queens threaten each other. A classic backtracking problem.',
  longDescription: 'The N-Queens problem is the challenge of placing N non-attacking chess queens on an N×N chessboard. This means that no two queens should share the same row, column, or diagonal.\\n\\nAlgorithm Steps (Backtracking):\\n1. Start in the leftmost column.\\n2. If all queens are placed, return true (solution found).\\n3. Try all rows in the current column. For each tried row:\\n   a. If the queen can be placed safely in this row and column (i.e., it doesn\\\'t attack any other queens placed so far), mark this [row, column] as part of the solution and recursively check if placing queen here leads to a solution by calling the function for the next column.\\n   b. If placing the queen in [row, column] leads to a solution, return true.\\n   c. If placing queen doesn\\\'t lead to a solution, then unmark this [row, column] (Backtrack) and try other rows.\\n4. If all rows have been tried and nothing worked, return false to trigger backtracking.\\n\\nUse Cases: Demonstrates a fundamental backtracking approach, used in puzzles, constraint satisfaction problems, and resource allocation scenarios.',
  timeComplexities: {
    best: "O(N!) in worst case (exploring permutations)",
    average: "O(N!)",
    worst: "O(N!)"
  },
  spaceComplexity: "O(N^2) for board, O(N) for recursion stack.",
};
