
import type { SudokuStep } from './types'; // Local import

export const SUDOKU_LINE_MAP = {
  solveSudokuFunc: 1,
  findEmptyFunc: 2, 
  isSafeFunc: 3,    
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
  // Detailed isSafe lines (if used in more granular steps)
  isSafeCheckRow: 15,
  isSafeCheckCol: 16,
  isSafeCheckSubgrid: 17,
  isSafeReturnTrue: 18,
};

const addStep = (
  localSteps: SudokuStep[],
  line: number | null,
  boardState: number[][],
  initialBoardState: number[][] | null,
  message: string,
  currentCell?: SudokuStep['currentCell'],
  isSafeResult?: boolean,
  isSolutionFound?: boolean
) => {
  localSteps.push({
    board: boardState.map(row => [...row]),
    initialBoard: initialBoardState ? initialBoardState.map(row => [...row]) : null,
    currentCell,
    isSafe: isSafeResult,
    message,
    currentLine: line,
    solutionFound: isSolutionFound,
    activeIndices: currentCell ? [currentCell.row, currentCell.col] : [],
    swappingIndices: [],
    sortedIndices: [],
  });
};


export const generateSudokuSteps = (initialBoard: number[][]): SudokuStep[] => {
  const localSteps: SudokuStep[] = [];
  const board = initialBoard.map(row => [...row]); 
  const N = 9;
  const lm = SUDOKU_LINE_MAP;

  addStep(localSteps, lm.solveSudokuFunc, board, initialBoard, "Starting Sudoku Solver.");

  function findEmpty(): [number, number] | null {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        addStep(localSteps, lm.callFindEmpty, board, initialBoard, `Finding empty cell: Checking [${r},${c}]`, {row:r, col:c, action: 'find_empty'});
        if (board[r][c] === 0) {
          addStep(localSteps, lm.callFindEmpty, board, initialBoard, `Empty cell found at [${r},${c}]`, {row:r, col:c, action: 'find_empty'});
          return [r, c];
        }
      }
    }
    addStep(localSteps, lm.callFindEmpty, board, initialBoard, "No empty cells found.");
    return null;
  }

  function isSafe(row: number, col: number, num: number): boolean {
    addStep(localSteps, lm.isSafeFunc, board, initialBoard, `isSafe(row=${row}, col=${col}, num=${num})?`, {row,col,num,action:'check_safe'});

    addStep(localSteps, lm.isSafeCheckRow, board, initialBoard, `Checking row ${row} for ${num}.`, {row,col,num,action:'check_safe'});
    for (let x = 0; x < N; x++) {
      if (board[row][x] === num) {
        addStep(localSteps, lm.isSafeFunc, board, initialBoard, `Conflict in row ${row} at col ${x}. Not safe.`, {row,col,num,action:'check_safe'}, false);
        return false;
      }
    }
    addStep(localSteps, lm.isSafeCheckCol, board, initialBoard, `Checking column ${col} for ${num}.`, {row,col,num,action:'check_safe'});
    for (let x = 0; x < N; x++) {
      if (board[x][col] === num) {
        addStep(localSteps, lm.isSafeFunc, board, initialBoard, `Conflict in col ${col} at row ${x}. Not safe.`, {row,col,num,action:'check_safe'}, false);
        return false;
      }
    }
    addStep(localSteps, lm.isSafeCheckSubgrid, board, initialBoard, `Checking 3x3 subgrid for ${num}.`, {row,col,num,action:'check_safe'});
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) {
          addStep(localSteps, lm.isSafeFunc, board, initialBoard, `Conflict in subgrid. Not safe.`, {row,col,num,action:'check_safe'}, false);
          return false;
        }
      }
    }
    addStep(localSteps, lm.isSafeReturnTrue, board, initialBoard, `Position [${row},${col}] is safe for ${num}.`, {row,col,num,action:'check_safe'}, true);
    return true;
  }

  function solve(): boolean {
    addStep(localSteps, lm.solveRecursiveFunc, board, initialBoard, "Recursive solve() called.");
    const emptySpot = findEmpty();
    
    if (!emptySpot) {
      addStep(localSteps, lm.baseCaseSolved, board, initialBoard, "Base Case: No empty cells. Puzzle solved!", undefined, undefined, true);
      return true; 
    }
    
    const [row, col] = emptySpot;
    addStep(localSteps, lm.getEmptyRowCol, board, initialBoard, `Processing empty cell [${row},${col}].`, {row,col,action:'find_empty'});

    for (let num = 1; num <= 9; num++) {
      addStep(localSteps, lm.loopTryNumbers, board, initialBoard, `Trying number ${num} for cell [${row},${col}].`, {row,col,num,action:'try_num'});
      const safeCheckResult = isSafe(row, col, num);
      if (safeCheckResult) {
        board[row][col] = num;
        addStep(localSteps, lm.placeNumber, board, initialBoard, `Placed ${num} at [${row},${col}].`, {row,col,num,action:'place_num'}, true);

        addStep(localSteps, lm.recursiveCallSolve, board, initialBoard, `Recursive call solve() for next empty cell.`, {row,col,num,action:'place_num'});
        if (solve()) {
          return true;
        }

        board[row][col] = 0;
        addStep(localSteps, lm.backtrackRemoveNumber, board, initialBoard, `Backtrack: Removed ${num} from [${row},${col}].`, {row,col,num,action:'backtrack_remove'});
      }
    }
    addStep(localSteps, lm.returnFalseNoSolutionFromCell, board, initialBoard, `No number (1-9) works for [${row},${col}]. Backtracking further.`, {row,col,action:'backtrack_remove'});
    return false; 
  }

  addStep(localSteps, lm.initialSolveCallAndReturn, board, initialBoard, "Initial call to solve().");
  if (solve()) {
    addStep(localSteps, lm.initialSolveCallAndReturn, board, initialBoard, "Sudoku Solved!", undefined, undefined, true);
  } else {
    addStep(localSteps, lm.initialSolveCallAndReturn, board, initialBoard, "No solution exists for this Sudoku puzzle.", undefined, undefined, false);
  }
  return localSteps;
};
