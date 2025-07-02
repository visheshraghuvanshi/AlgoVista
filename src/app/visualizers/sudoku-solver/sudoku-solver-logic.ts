
import type { SudokuStep } from './types'; // Local import

export const SUDOKU_LINE_MAP = {
  solveSudokuFunc: 1,
  findEmptyFunc: 2, // Conceptual start of helper
  isSafeFunc: 3,    // Conceptual start of helper
  solveRecursiveFunc: 4,
  callFindEmpty: 5,
  baseCaseSolved: 6,
  getEmptyRowCol: 7,
  loopTryNumbers: 8,
  callIsSafe: 9,
  placeNumber: 10,
  recursiveCallSolve: 11,
  backtrackRemoveNumber: 12,
  returnFalseNoSolutionFromCell: 13,
  initialSolveCallAndReturn: 14,
  // Detailed isSafe lines
  isSafeCheckRow: 16,
  isSafeCheckCol: 17,
  isSafeCheckSubgrid: 18,
  isSafeStartSubgridLoop: 19,
  isSafeReturnTrue: 20,
};


const addStep = (
  steps: SudokuStep[],
  boardState: number[][],
  initialBoardState: number[][] | null,
  line: number | null,
  message: string,
  currentCell?: SudokuStep['currentCell'],
  isSafeResult?: boolean,
  isSolutionFound?: boolean
) => {
  steps.push({
    board: boardState.map(row => [...row]), 
    initialBoard: initialBoardState, // No need to clone, it's static
    currentCell,
    isSafe: isSafeResult,
    message,
    currentLine: line,
    solutionFound: isSolutionFound,
  });
};


export const generateSudokuSteps = (initialBoard: number[][]): SudokuStep[] => {
  const localSteps: SudokuStep[] = [];
  const board = initialBoard.map(row => [...row]); 
  const N = 9;
  const lm = SUDOKU_LINE_MAP;
  let solutionWasFound = false;

  addStep(localSteps, board, initialBoard, lm.solveSudokuFunc, `Starting Sudoku Solver.`);

  function findEmpty(): [number, number] | null {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (board[r][c] === 0) {
          addStep(localSteps, board, initialBoard, lm.callFindEmpty, `Empty cell found at [${r},${c}]`, {row:r, col:c, action: 'find_empty'});
          return [r, c];
        }
      }
    }
    return null;
  }

  function isSafe(row: number, col: number, num: number): boolean {
    addStep(localSteps, board, initialBoard, lm.isSafeFunc, `isSafe(row=${row}, col=${col}, num=${num})?`, {row,col,num,action:'check_safe'});

    // Check row
    addStep(localSteps, board, initialBoard, lm.isSafeCheckRow, `Checking row ${row} for ${num}.`, {row,col,num,action:'check_safe'});
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) {
        addStep(localSteps, board, initialBoard, lm.isSafeFunc, `Conflict in row ${row} at col ${x}. Not safe.`, {row,col,num,action:'check_safe'}, false);
        return false;
      }
    }
    // Check column
    addStep(localSteps, board, initialBoard, lm.isSafeCheckCol, `Checking column ${col} for ${num}.`, {row,col,num,action:'check_safe'});
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) {
        addStep(localSteps, board, initialBoard, lm.isSafeFunc, `Conflict in col ${col} at row ${x}. Not safe.`, {row,col,num,action:'check_safe'}, false);
        return false;
      }
    }
    // Check 3x3 subgrid
    addStep(localSteps, board, initialBoard, lm.isSafeCheckSubgrid, `Checking 3x3 subgrid for ${num}.`, {row,col,num,action:'check_safe'});
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        addStep(localSteps, board, initialBoard, lm.isSafeStartSubgridLoop, `Checking cell [${i + startRow}, ${j + startCol}]`, {row,col,num,action:'check_safe'});
        if (board[i + startRow][j + startCol] === num) {
          addStep(localSteps, board, initialBoard, lm.isSafeFunc, `Conflict in subgrid. Not safe.`, {row,col,num,action:'check_safe'}, false);
          return false;
        }
      }
    }
    addStep(localSteps, board, initialBoard, lm.isSafeReturnTrue, `Position [${row},${col}] is safe for ${num}.`, {row,col,num,action:'check_safe'}, true);
    return true;
  }

  function solve(): boolean {
    addStep(localSteps, board, initialBoard, lm.solveRecursiveFunc, "solve() called. Finding next empty cell...");
    const emptySpot = findEmpty();
    
    if (!emptySpot) {
      addStep(localSteps, board, initialBoard, lm.baseCaseSolved, "Base Case: No empty cells left. Puzzle solved!", undefined, undefined, true);
      solutionWasFound = true;
      return true; 
    }
    
    const [row, col] = emptySpot;
    addStep(localSteps, board, initialBoard, lm.getEmptyRowCol, `Processing empty cell [${row},${col}].`, {row,col,action:'find_empty'});

    for (let num = 1; num <= 9; num++) {
      addStep(localSteps, board, initialBoard, lm.loopTryNumbers, `Trying number ${num} for cell [${row},${col}].`, {row,col,num,action:'try_num'});
      
      const safeCheckResult = isSafe(row, col, num);
      if (safeCheckResult) {
        addStep(localSteps, board, initialBoard, lm.callIsSafe, `Position [${row},${col}] is safe for ${num}. Placing number.`, {row,col,num,action:'check_safe'}, true);
        board[row][col] = num;
        addStep(localSteps, board, initialBoard, lm.placeNumber, `Placed ${num} at [${row},${col}].`, {row,col,num,action:'place_num'}, true);

        addStep(localSteps, board, initialBoard, lm.recursiveCallSolve, `Recursive call: solve()`, {row,col,num,action:'place_num'});
        if (solve()) {
          return true;
        }

        addStep(localSteps, board, initialBoard, lm.backtrackRemoveNumber, `Backtrack: solution not found with ${num} at [${row},${col}]. Resetting cell to 0.`, {row,col,num,action:'backtrack_remove'});
        board[row][col] = 0; 
      }
    }
    addStep(localSteps, board, initialBoard, lm.returnFalseNoSolutionFromCell, `No valid number (1-9) works for [${row},${col}]. This path fails. Backtracking...`, {row,col,action:'backtrack_remove'});
    return false; 
  }
  
  addStep(localSteps, board, initialBoard, lm.initialSolveCallAndReturn, "Initial call to solve().");
  solve(); 

  if (solutionWasFound) {
    addStep(localSteps, board, initialBoard, lm.initialSolveCallAndReturn, "Sudoku Solved!", undefined, undefined, true);
  } else {
    addStep(localSteps, board, initialBoard, lm.initialSolveCallAndReturn, "No solution found for this Sudoku puzzle.", undefined, undefined, false);
  }
  return localSteps;
};

