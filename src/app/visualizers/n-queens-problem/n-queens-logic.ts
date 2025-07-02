
import type { NQueensStep } from './types';

// O(1) safety check version
export const N_QUEENS_LINE_MAP = {
  mainFuncStart: 1,
  initHelperArrays: 2, // cols, diag1, diag2
  callSolveUtil: 3,
  
  solveUtilFuncStart: 4,
  baseCaseRowEqualsN: 5,
  addSolution: 6,
  returnFromBase: 7,

  loopCols: 8,
  checkIsSafe: 9,
  placeQueenAndMark: 10,
  recursiveCall: 11,
  backtrackRemoveAndUnmark: 12,
  returnFalseFromLoop: 13,
};

const addStep = (
  steps: NQueensStep[],
  board: number[][],
  cols: boolean[],
  diag1: boolean[],
  diag2: boolean[],
  line: number,
  message: string,
  currentCell?: NQueensStep['currentCell'],
  isSafeResult?: boolean,
  solutionsFound?: number[][][]
) => {
  steps.push({
    board: board.map(row => [...row]),
    currentLine: line,
    message,
    currentCell,
    isSafe: isSafeResult,
    foundSolutionsCount: solutionsFound ? solutionsFound.length : 0,
    solutionFound: !!solutionsFound && solutionsFound.length > 0,
    auxiliaryData: {
      cols: [...cols],
      diag1: [...diag1],
      diag2: [...diag2],
    }
  });
};

export const generateNQueensSteps = (N: number): NQueensStep[] => {
  const localSteps: NQueensStep[] = [];
  const board: number[][] = Array(N).fill(0).map(() => Array(N).fill(0));
  const solutions: number[][][] = [];
  const lm = N_QUEENS_LINE_MAP;

  // For optimized O(1) checking
  const cols = new Array(N).fill(false);
  const diag1 = new Array(2 * N - 1).fill(false); // r + c
  const diag2 = new Array(2 * N - 1).fill(false); // r - c + (N-1)

  addStep(localSteps, board, cols, diag1, diag2, lm.mainFuncStart, `Starting N-Queens for N=${N}.`);
  addStep(localSteps, board, cols, diag1, diag2, lm.initHelperArrays, 'Initializing helper arrays for O(1) safety checks.');

  function solve(row: number) {
    addStep(localSteps, board, cols, diag1, diag2, lm.solveUtilFuncStart, `solve(row=${row}). Trying to place a queen.`, { row, col: -1, action: 'try_place' });
    
    if (row === N) {
      addStep(localSteps, board, cols, diag1, diag2, lm.baseCaseRowEqualsN, 'Base Case: Reached row N. Solution found!', undefined, true);
      solutions.push(board.map(r => [...r]));
      addStep(localSteps, board, cols, diag1, diag2, lm.addSolution, `Solution ${solutions.length} added.`, undefined, true, solutions);
      addStep(localSteps, board, cols, diag1, diag2, lm.returnFromBase, 'Returning from base case to find more solutions.', undefined, true, solutions);
      return;
    }

    for (let col = 0; col < N; col++) {
      addStep(localSteps, board, cols, diag1, diag2, lm.loopCols, `Trying cell [${row},${col}]...`, { row, col, action: 'try_place' });
      
      const isCellSafe = !(cols[col] || diag1[row + col] || diag2[row - col + N - 1]);
      addStep(localSteps, board, cols, diag1, diag2, lm.checkIsSafe, `Is [${row},${col}] safe? -> ${isCellSafe}`, { row, col, action: 'check_safe' }, isCellSafe);

      if (isCellSafe) {
        board[row][col] = 1;
        cols[col] = true;
        diag1[row + col] = true;
        diag2[row - col + N - 1] = true;
        addStep(localSteps, board, cols, diag1, diag2, lm.placeQueenAndMark, `Placed queen at [${row},${col}]. Updated helper arrays.`, { row, col, action: 'place_safe' }, true);
        
        addStep(localSteps, board, cols, diag1, diag2, lm.recursiveCall, `Recurse: solve(row=${row + 1})`, { row, col, action: 'place_safe' });
        solve(row + 1);

        board[row][col] = 0;
        cols[col] = false;
        diag1[row + col] = false;
        diag2[row - col + N - 1] = false;
        addStep(localSteps, board, cols, diag1, diag2, lm.backtrackRemoveAndUnmark, `Backtrack: Removed queen from [${row},${col}]. Reset helper arrays.`, { row, col, action: 'backtrack_remove' });
      }
    }
    addStep(localSteps, board, cols, diag1, diag2, lm.returnFalseFromLoop, `Finished all columns for row ${row}. Returning.`, { row, col: N-1, action: 'stuck' });
  }

  addStep(localSteps, board, cols, diag1, diag2, lm.callSolveUtil, 'Initial call to solve(0).');
  solve(0);

  if (solutions.length > 0) {
    addStep(localSteps, solutions[0], cols, diag1, diag2, lm.returnFinalSolutions, `Found ${solutions.length} solution(s). Showing first solution.`, undefined, true, solutions);
  } else {
    addStep(localSteps, board, cols, diag1, diag2, lm.returnFinalSolutions, `No solution found for N=${N}.`, undefined, false, solutions);
  }

  return localSteps;
};

    