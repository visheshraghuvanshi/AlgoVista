
import type { NQueensStep } from './types'; // Local import

export const N_QUEENS_LINE_MAP = {
  solveNQueensFunc: 1, // Main function solveNQueens(n)
  // isSafe function (lines 5-16 in JS snippet of NQueensCodePanel)
  isSafeFuncStart: 5,
  checkRowConflict: 6, 
  checkUpperDiagonalConflict: 7, 
  checkLowerDiagonalConflict: 8, 
  isSafeReturnTrue: 9,  
  isSafeReturnFalse: 10, 

  // solve (recursive helper) function (lines 18-32 in JS snippet)
  solveUtilFuncStart: 18, // solve(col)
  baseCaseColEqualsN: 19, // if (col === n)
  addSolutionAndReturnTrue: 20, 
  loopTryRowsInCol: 21, // for (let i = 0; i < n; i++)
  callIsSafe: 22, // if (isSafe(i, col))
  placeQueenOnBoard: 23, // board[i][col] = 1;
  recursiveCallSolveUtil: 24, // if (solve(col + 1))
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
  currentQueen?: { row: number; col: number; action: 'place' | 'remove' | 'checking_safe' | 'backtracking_from' | 'try_move' | 'blocked' | 'goal_reached' | 'stuck' },
  isSafeResult?: boolean,
  allSolutions?: number[][][],
  isSolutionFoundOverall?: boolean
) => {
  steps.push({
    array: [], 
    activeIndices: currentQueen ? [currentQueen.row, currentQueen.col] : [],
    swappingIndices: [],
    sortedIndices: [], 
    board: boardState.map(row => [...row]), 
    currentCell: currentQueen, // Map to currentCell as per NQueensStep type
    foundSolutions: allSolutions ? allSolutions.map(sol => sol.map(r => [...r])) : undefined,
    isSafe: isSafeResult,
    message,
    currentLine: line,
    solutionFound: isSolutionFoundOverall, // Explicitly pass overall solution status
  });
};

export const generateNQueensSteps = (N: number): NQueensStep[] => {
  const localSteps: NQueensStep[] = [];
  const board: number[][] = Array(N).fill(0).map(() => Array(N).fill(0));
  const solutions: number[][][] = [];
  const lm = N_QUEENS_LINE_MAP;
  let initialBoardState = board.map(row => [...row]); // Store initial state for panel

  addStep(localSteps, board, lm.solveNQueensFunc, `Starting N-Queens for N=${N}. Board initialized.`, undefined, undefined, undefined, false);

  function isSafe(row: number, col: number): boolean {
    addStep(localSteps, board,initialBoardState, lm.isSafeFuncStart, `isSafe(row=${row}, col=${col})?`, { row, col, action: 'checking_safe' });
    
    addStep(localSteps, board,initialBoardState, lm.checkRowConflict, `Checking row ${row} for conflicts to the left of col ${col}.`, { row, col, action: 'checking_safe' });
    for (let i = 0; i < col; i++) {
      if (board[row][i] === 1) {
        addStep(localSteps, board, initialBoardState, lm.isSafeReturnFalse, `Conflict in row ${row} at [${row},${i}]. Not safe.`, { row, col, action: 'checking_safe' }, false);
        return false;
      }
    }
    
    addStep(localSteps, board, initialBoardState, lm.checkUpperDiagonalConflict, `Checking upper-left diagonal from [${row},${col}].`, { row, col, action: 'checking_safe' });
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) {
        addStep(localSteps, board, initialBoardState, lm.isSafeReturnFalse, `Conflict on upper-left diagonal at [${i},${j}]. Not safe.`, { row, col, action: 'checking_safe' }, false);
        return false;
      }
    }
    
    addStep(localSteps, board, initialBoardState, lm.checkLowerDiagonalConflict, `Checking lower-left diagonal from [${row},${col}].`, { row, col, action: 'checking_safe' });
    for (let i = row, j = col; i < N && j >= 0; i++, j--) {
      if (board[i][j] === 1) {
        addStep(localSteps, board, initialBoardState, lm.isSafeReturnFalse, `Conflict on lower-left diagonal at [${i},${j}]. Not safe.`, { row, col, action: 'checking_safe' }, false);
        return false;
      }
    }
    addStep(localSteps, board, initialBoardState, lm.isSafeReturnTrue, `Position [${row},${col}] is safe.`, { row, col, action: 'checking_safe' }, true);
    return true;
  }

  function solveNQueensUtil(col: number): boolean {
    addStep(localSteps, board, initialBoardState, lm.solveUtilFuncStart, `solveUtil(col=${col}). Attempting to place queen in column ${col}.`);
    if (col >= N) {
      addStep(localSteps, board, initialBoardState, lm.baseCaseColEqualsN, `Base Case: All ${N} columns filled (col=${col}).`);
      solutions.push(board.map(r => [...r]));
      addStep(localSteps, board, initialBoardState, lm.addSolutionAndReturnTrue, `Solution found and added. Total solutions: ${solutions.length}.`, undefined, undefined, solutions, true);
      return true; 
    }

    let foundSolutionThisPath = false;
    for (let i = 0; i < N; i++) { 
      addStep(localSteps, board, initialBoardState, lm.loopTryRowsInCol, `Trying to place queen at [${i},${col}].`, {row:i, col, action:'checking_safe'});
      const safeCheckResult = isSafe(i, col);
      if (safeCheckResult) {
        board[i][col] = 1;
        addStep(localSteps, board, initialBoardState, lm.placeQueenOnBoard, `Safe to place queen at [${i},${col}]. Placed.`, { row:i, col, action: 'place' }, true);

        addStep(localSteps, board, initialBoardState, lm.recursiveCallSolveUtil, `Recursive call: solveUtil(col=${col + 1}).`);
        if (solveNQueensUtil(col + 1)) {
          foundSolutionThisPath = true;
        }
        
        board[i][col] = 0; 
        addStep(localSteps, board, initialBoardState, lm.backtrackRemoveQueen, `Backtracking: Removing queen from [${i},${col}].`, { row:i, col, action: 'remove' });
      } else {
         addStep(localSteps, board, initialBoardState, lm.callIsSafe, `Position [${i},${col}] is NOT safe. Trying next row.`, {row:i, col, action:'checking_safe'}, false);
      }
       addStep(localSteps, board, initialBoardState, lm.endIfIsSafe, `Finished checking/processing row ${i} for column ${col}.`);
    }
    addStep(localSteps, board, initialBoardState, lm.endLoopTryRows, `Finished all rows for column ${col}.`);
    if (!foundSolutionThisPath && col !==0) {
        addStep(localSteps, board, initialBoardState, lm.returnFalseFromSolveUtil, `No solution found by placing queen in column ${col} with current board state. Backtracking further if applicable.`);
    }
    return foundSolutionThisPath;
  }
  
  addStep(localSteps, board, initialBoardState, lm.initialSolveCall, `Initial call to solveNQueensUtil(col=0).`);
  solveNQueensUtil(0); 

  if (solutions.length > 0) {
    // Display the first found solution for the "final" step message.
    // The UI on the page allows cycling through all found solutions.
    addStep(localSteps, solutions[0], initialBoardState, lm.returnFinalSolutions, `N-Queens complete. Found ${solutions.length} solution(s). Displaying one.`, undefined, undefined, solutions, true);
  } else {
    addStep(localSteps, board, initialBoardState, lm.returnFinalSolutions, "N-Queens complete. No solutions found.", undefined, undefined, solutions, false);
  }
  return localSteps;
};

