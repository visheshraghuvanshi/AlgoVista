
import type { NQueensStep } from './types'; // Local import

export const N_QUEENS_LINE_MAP = {
  solveNQueensFunc: 1, // Main function solveNQueens(n)
  // isSafe function (lines 5-16 in JS snippet of NQueensCodePanel)
  isSafeFuncStart: 5,
  checkRowConflict: 6, // Corresponds to "Check this row on left side" and its loop
  checkUpperDiagonalConflict: 7, // Corresponds to "Check upper diagonal on left side" and its loop
  checkLowerDiagonalConflict: 8, // Corresponds to "Check lower diagonal on left side" and its loop
  isSafeReturnTrue: 9,  // Conceptual line for "return true;" from isSafe
  isSafeReturnFalse: 10, // Conceptual line for any "return false;" from isSafe

  // solve (recursive helper) function (lines 18-32 in JS snippet)
  solveUtilFuncStart: 18, // solve(col)
  baseCaseColEqualsN: 19, // if (col === n)
  addSolutionAndReturnTrue: 20, // solutions.push(...); return true;
  loopTryRowsInCol: 21, // for (let i = 0; i < n; i++)
  callIsSafe: 22, // if (isSafe(i, col))
  placeQueenOnBoard: 23, // board[i][col] = 1;
  recursiveCallSolveUtil: 24, // if (solve(col + 1))
  // returnTrueFromRecursive: 25, // return true; (if only one solution is needed)
  backtrackRemoveQueen: 26, // board[i][col] = 0; (backtrack)
  endIfIsSafe: 27, // End of if (isSafe) block
  endLoopTryRows: 28, // End of for loop for rows
  returnFalseFromSolveUtil: 29, // return false; (if no row works in this col)
  
  initialSolveCall: 31, // solve(0);
  returnFinalSolutions: 32, // return solutions;
};


const addStep = (
  steps: NQueensStep[],
  boardState: number[][],
  line: number | null,
  message: string,
  currentQueen?: { row: number; col: number; action: 'place' | 'remove' | 'checking_safe' | 'backtracking_from' },
  isSafeResult?: boolean,
  allSolutions?: number[][][]
) => {
  steps.push({
    array: [], 
    activeIndices: currentQueen ? [currentQueen.row, currentQueen.col] : [],
    swappingIndices: [],
    sortedIndices: [], 
    board: boardState.map(row => [...row]), 
    currentQueen,
    foundSolutions: allSolutions ? allSolutions.map(sol => sol.map(r => [...r])) : undefined,
    isSafe: isSafeResult,
    message,
    currentLine: line,
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
    
    addStep(localSteps, board, lm.checkRowConflict, `Checking row ${row} for conflicts to the left of col ${col}.`, { row, col, action: 'checking_safe' });
    for (let i = 0; i < col; i++) {
      if (board[row][i] === 1) {
        addStep(localSteps, board, lm.isSafeReturnFalse, `Conflict in row ${row} at [${row},${i}]. Not safe.`, { row, col, action: 'checking_safe' }, false);
        return false;
      }
    }
    
    addStep(localSteps, board, lm.checkUpperDiagonalConflict, `Checking upper-left diagonal from [${row},${col}].`, { row, col, action: 'checking_safe' });
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) {
        addStep(localSteps, board, lm.isSafeReturnFalse, `Conflict on upper-left diagonal at [${i},${j}]. Not safe.`, { row, col, action: 'checking_safe' }, false);
        return false;
      }
    }
    
    addStep(localSteps, board, lm.checkLowerDiagonalConflict, `Checking lower-left diagonal from [${row},${col}].`, { row, col, action: 'checking_safe' });
    for (let i = row, j = col; i < N && j >= 0; i++, j--) {
      if (board[i][j] === 1) {
        addStep(localSteps, board, lm.isSafeReturnFalse, `Conflict on lower-left diagonal at [${i},${j}]. Not safe.`, { row, col, action: 'checking_safe' }, false);
        return false;
      }
    }
    addStep(localSteps, board, lm.isSafeReturnTrue, `Position [${row},${col}] is safe.`, { row, col, action: 'checking_safe' }, true);
    return true;
  }

  function solveNQueensUtil(col: number): boolean {
    addStep(localSteps, board, lm.solveUtilFuncStart, `solveUtil(col=${col}). Attempting to place queen in column ${col}.`);
    if (col >= N) {
      addStep(localSteps, board, lm.baseCaseColEqualsN, `Base Case: All ${N} columns filled (col=${col}).`);
      solutions.push(board.map(r => [...r]));
      addStep(localSteps, board, lm.addSolutionAndReturnTrue, `Solution found and added. Total solutions: ${solutions.length}.`, undefined, undefined, solutions);
      return true; 
    }

    let foundSolutionThisPath = false;
    for (let i = 0; i < N; i++) { 
      addStep(localSteps, board, lm.loopTryRowsInCol, `Trying to place queen at [${i},${col}].`, {row:i, col, action:'checking_safe'});
      if (isSafe(i, col)) {
        board[i][col] = 1;
        addStep(localSteps, board, lm.placeQueenOnBoard, `Safe to place queen at [${i},${col}]. Placed.`, { row:i, col, action: 'place' }, true);

        addStep(localSteps, board, lm.recursiveCallSolveUtil, `Recursive call: solveUtil(col=${col + 1}).`);
        if (solveNQueensUtil(col + 1)) {
          foundSolutionThisPath = true;
        }
        
        board[i][col] = 0; 
        addStep(localSteps, board, lm.backtrackRemoveQueen, `Backtracking: Removing queen from [${i},${col}].`, { row:i, col, action: 'remove' });
      } else {
         addStep(localSteps, board, lm.callIsSafe, `Position [${i},${col}] is NOT safe. Trying next row.`, {row:i, col, action:'checking_safe'}, false);
      }
       addStep(localSteps, board, lm.endIfIsSafe, `Finished checking/processing row ${i} for column ${col}.`);
    }
    addStep(localSteps, board, lm.endLoopTryRows, `Finished all rows for column ${col}.`);
    if (!foundSolutionThisPath && col !==0) { // Avoid "no solution" message if it's the very first column and no solution is found overall until the end
        addStep(localSteps, board, lm.returnFalseFromSolveUtil, `No solution found starting from placing queen in column ${col} with current board state. Backtracking further if applicable.`);
    }
    return foundSolutionThisPath;
  }
  
  addStep(localSteps, board, lm.initialSolveCall, `Initial call to solveNQueensUtil(col=0).`);
  solveNQueensUtil(0); 

  if (solutions.length > 0) {
    addStep(localSteps, solutions[solutions.length-1], lm.returnFinalSolutions, `N-Queens complete. Found ${solutions.length} solution(s). Displaying one.`, undefined, undefined, solutions);
  } else {
    addStep(localSteps, board, lm.returnFinalSolutions, "N-Queens complete. No solutions found.", undefined, undefined, solutions);
  }
  return localSteps;
};
