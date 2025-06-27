
import type { NQueensStep } from './types'; // Local import

export const N_QUEENS_LINE_MAP = {
  solveNQueensFunc: 1,
  // isSafe function
  isSafeFuncStart: 5,
  checkRowConflict: 6,
  checkUpperDiagonalConflict: 7,
  checkLowerDiagonalConflict: 8,
  isSafeReturnTrue: 9,

  // solve (recursive helper) function
  solveUtilFuncStart: 18,
  baseCaseColEqualsN: 19,
  addSolutionAndReturnTrue: 20,
  loopTryRowsInCol: 21,
  callIsSafe: 22,
  placeQueenOnBoard: 23,
  recursiveCallSolveUtil: 24,
  backtrackRemoveQueen: 26,
  endIfIsSafe: 27,
  endLoopTryRows: 28,
  returnFalseFromSolveUtil: 29,
  
  initialSolveCall: 31,
  returnFinalSolutions: 32,
};


const addStep = (
  steps: NQueensStep[],
  boardState: number[][],
  line: number | null,
  message: string,
  currentCell?: { row: number; col: number; action: 'place' | 'remove' | 'checking_safe' | 'backtracking_from' | 'try_move' },
  isSafeResult?: boolean,
  allSolutions?: number[][][],
  isSolutionFoundOverall?: boolean
) => {
  steps.push({
    board: boardState.map(row => [...row]), 
    currentCell,
    isSafe: isSafeResult,
    message,
    currentLine: line,
    solutionFound: isSolutionFoundOverall,
    foundSolutions: allSolutions ? allSolutions.map(sol => sol.map(r => [...r])) : undefined,
  });
};

export const generateNQueensSteps = (N: number): NQueensStep[] => {
  const localSteps: NQueensStep[] = [];
  const board: number[][] = Array(N).fill(0).map(() => Array(N).fill(0));
  const solutions: number[][][] = [];
  const lm = N_QUEENS_LINE_MAP;

  addStep(localSteps, board, lm.solveNQueensFunc, `Starting N-Queens for N=${N}. Board initialized.`);

  function isSafe(row: number, col: number): boolean {
    addStep(localSteps, board, lm.isSafeFuncStart, `isSafe(row=${row}, col=${col})?`, { row, col, action: 'checking_safe' });
    
    // Check column upwards
    addStep(localSteps, board, lm.checkRowConflict, `Checking column ${col} upwards.`, { row, col, action: 'checking_safe' });
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) {
        addStep(localSteps, board, lm.checkRowConflict, `Conflict in column at [${i},${col}]. Not safe.`, { row, col, action: 'checking_safe' }, false);
        return false;
      }
    }
    
    // Check upper-left diagonal
    addStep(localSteps, board, lm.checkUpperDiagonalConflict, `Checking upper-left diagonal from [${row},${col}].`, { row, col, action: 'checking_safe' });
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) {
        addStep(localSteps, board, lm.checkUpperDiagonalConflict, `Conflict on upper-left diagonal at [${i},${j}]. Not safe.`, { row, col, action: 'checking_safe' }, false);
        return false;
      }
    }
    
    // Check upper-right diagonal
    addStep(localSteps, board, lm.checkLowerDiagonalConflict, `Checking upper-right diagonal from [${row},${col}].`, { row, col, action: 'checking_safe' });
    for (let i = row, j = col; i >= 0 && j < N; i--, j++) {
      if (board[i][j] === 1) {
        addStep(localSteps, board, lm.checkLowerDiagonalConflict, `Conflict on upper-right diagonal at [${i},${j}]. Not safe.`, { row, col, action: 'checking_safe' }, false);
        return false;
      }
    }
    addStep(localSteps, board, lm.isSafeReturnTrue, `Position [${row},${col}] is safe.`, { row, col, action: 'checking_safe' }, true);
    return true;
  }

  // Places queens row by row
  function solveNQueensUtil(row: number) {
    addStep(localSteps, board, lm.solveUtilFuncStart, `solveUtil(row=${row}). Attempting to place queen in row ${row}.`);
    if (row >= N) {
      addStep(localSteps, board, lm.baseCaseColEqualsN, `Base Case: All ${N} rows filled. Solution found!`);
      solutions.push(board.map(r => [...r]));
      addStep(localSteps, board, lm.addSolutionAndReturnTrue, `Solution added. Total solutions: ${solutions.length}. Backtracking to find more.`, undefined, undefined, solutions, true);
      return; 
    }

    for (let col = 0; col < N; col++) { 
      addStep(localSteps, board, lm.loopTryRowsInCol, `Trying column ${col} for row ${row}.`, {row:row, col, action:'try_move'});
      const safeCheckResult = isSafe(row, col);
      addStep(localSteps, board, lm.callIsSafe, `Is [${row},${col}] safe? ${safeCheckResult}.`, {row, col, action: 'checking_safe'}, safeCheckResult);
      if (safeCheckResult) {
        board[row][col] = 1;
        addStep(localSteps, board, lm.placeQueenOnBoard, `Placed queen at [${row},${col}].`, { row:row, col, action: 'place' }, true);

        addStep(localSteps, board, lm.recursiveCallSolveUtil, `Recursive call: solveUtil(row=${row + 1}).`);
        solveNQueensUtil(row + 1);
        
        // Backtrack
        addStep(localSteps, board, lm.backtrackRemoveQueen, `Backtracking from [${row},${col}]. Removing queen to explore other options.`, { row,col, action: 'remove' });
        board[row][col] = 0; 
        addStep(localSteps, board, lm.backtrackRemoveQueen, `Queen removed from [${row},${col}].`, { row,col, action: 'remove' });
      }
    }
     addStep(localSteps, board, lm.returnFalseFromSolveUtil, `Finished all columns for row ${row}. Returning from this call.`);
  }
  
  addStep(localSteps, board, lm.initialSolveCall, `Initial call to solveNQueensUtil(row=0).`);
  solveNQueensUtil(0); 

  if (solutions.length > 0) {
    addStep(localSteps, solutions[0], lm.returnFinalSolutions, `N-Queens complete. Found ${solutions.length} solution(s). Displaying first solution.`, undefined, undefined, solutions, true);
  } else {
    addStep(localSteps, board, lm.returnFinalSolutions, "N-Queens complete. No solutions found.", undefined, undefined, solutions, false);
  }
  return localSteps;
};
