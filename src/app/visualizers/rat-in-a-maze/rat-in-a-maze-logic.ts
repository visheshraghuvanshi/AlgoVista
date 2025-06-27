
import type { RatInAMazeStep } from './types'; // Local import

export const RAT_IN_MAZE_LINE_MAP = {
  solveMazeFunc: 1,
  initSolutionMatrix: 2,
  isSafeFuncStart: 3,
  isSafeCheckBounds: 4,
  isSafeCheckWall: 5,
  isSafeCheckVisited: 6, // In solution path
  isSafeReturnTrue: 7,
  isSafeReturnFalse: 8,
  solveUtilFuncStart: 9,
  baseCaseGoalReached: 10,
  markGoalInSolution: 11,
  returnTrueGoal: 12,
  checkIfSafeCurrent: 13,
  markCurrentInSolution: 14,
  tryMoveRight: 15,
  recursiveCallRight: 16,
  returnTrueFromRight: 17,
  tryMoveDown: 18,
  recursiveCallDown: 19,
  returnTrueFromDown: 20,
  backtrackUnmark: 21,
  returnFalseBacktrack: 22,
  returnFalseNotSafe: 23, // If initial isSafe(row,col) is false
  initialSolveCall: 24,
  returnSolutionOrNull: 25, // Now refers to the final conditional messages
};


const addStep = (
  steps: RatInAMazeStep[],
  boardState: number[][],
  initialBoardState: number[][] | null,
  line: number | null,
  message: string,
  currentCell?: { row: number; col: number; action: 'place' | 'remove' | 'checking_safe' | 'backtracking_from' | 'try_move' | 'blocked' | 'goal_reached' | 'stuck' },
  isSafeResult?: boolean,
  isSolutionFoundOverall?: boolean
) => {
  // Combine maze and solution for visualization: 0=wall, 1=path, 2=solution path taken
  const visualBoard = initialBoardState!.map((row, rIdx) => 
    row.map((cell, cIdx) => {
      if (boardState[rIdx][cIdx] === 1) return 2; // Path taken
      return cell; // Original maze (0 for wall, 1 for open path)
    })
  );

  steps.push({
    maze: visualBoard,
    initialBoard: initialBoardState ? initialBoardState.map(row => [...row]) : null,
    currentPosition: currentCell,
    action: currentCell?.action,
    isSafe: isSafeResult,
    message,
    currentLine: line,
    solutionFound: isSolutionFoundOverall,
    activeIndices: currentCell ? [currentCell.row, currentCell.col] : [],
    swappingIndices: [],
    sortedIndices: [],
  });
};

export const generateRatInAMazeSteps = (mazeInput: number[][]): RatInAMazeStep[] => {
  const localSteps: RatInAMazeStep[] = [];
  const N = mazeInput.length;
  if (N === 0) {
    addStep(localSteps, [], [], null, "Maze is empty.");
    return localSteps;
  }
  const M = mazeInput[0].length;
  if (M === 0) {
    addStep(localSteps, [], [], null, "Maze row is empty.");
    return localSteps;
  }

  const solution: number[][] = Array(N).fill(0).map(() => Array(M).fill(0));
  const lm = RAT_IN_MAZE_LINE_MAP;
  
  addStep(localSteps, solution, mazeInput, lm.solveMazeFunc, `Starting Rat in a Maze. Size: ${N}x${M}.`, undefined, undefined, false);
  addStep(localSteps, solution, mazeInput, lm.initSolutionMatrix, "Initialize solution matrix with 0s.", undefined, undefined, false);

  function isSafe(row: number, col: number): boolean {
    addStep(localSteps, solution, mazeInput, lm.isSafeFuncStart, `isSafe(row=${row}, col=${col})?`, { row, col, action: 'checking_safe' });
    
    let safe = row >= 0 && row < N && col >= 0 && col < M;
    addStep(localSteps, solution, mazeInput, lm.isSafeCheckBounds, safe ? `Bounds check OK` : `Out of bounds`, {row, col, action: 'checking_safe'});
    safe = safe && mazeInput[row][col] === 1; // Check against original maze for walls
    addStep(localSteps, solution, mazeInput, lm.isSafeCheckWall, safe ? `Cell is an open path` : `Cell is a wall`, {row, col, action: 'checking_safe'});
    safe = safe && solution[row][col] === 0; // Check against solution board for current path
    addStep(localSteps, solution, mazeInput, lm.isSafeCheckVisited, safe ? `Cell is not on current path` : `Cell is on current path`, {row, col, action: 'checking_safe'});
    
    const finalSafeMessage = safe ? `Cell [${row},${col}] is safe.` : `Cell [${row},${col}] is NOT safe.`;
    const safeLine = safe ? lm.isSafeReturnTrue : lm.isSafeReturnFalse;
    addStep(localSteps, solution, mazeInput, safeLine, finalSafeMessage, { row, col, action: safe ? 'checking_safe' : 'blocked' }, safe);
    return safe;
  }

  function solveMazeUtil(row: number, col: number): boolean {
    addStep(localSteps, solution, mazeInput, lm.solveUtilFuncStart, `solveMazeUtil(row=${row}, col=${col})`, { row, col, action: 'try_move' });

    if (row === N - 1 && col === M - 1 && mazeInput[row][col] === 1) {
      addStep(localSteps, solution, mazeInput, lm.baseCaseGoalReached, `Goal reached at [${row},${col}]!`, { row, col, action: 'goal_reached' });
      solution[row][col] = 1;
      addStep(localSteps, solution, mazeInput, lm.markGoalInSolution, `Mark [${row},${col}] in solution. Path found.`, { row, col, action: 'mark_path' }, undefined, true);
      return true;
    }

    addStep(localSteps, solution, mazeInput, lm.checkIfSafeCurrent, `Checking if current cell [${row},${col}] is safe.`, { row, col, action: 'checking_safe' });
    if (isSafe(row, col)) {
      solution[row][col] = 1;
      addStep(localSteps, solution, mazeInput, lm.markCurrentInSolution, `Mark [${row},${col}] as part of path.`, { row, col, action: 'mark_path' });

      // Try moving right
      addStep(localSteps, solution, mazeInput, lm.tryMoveRight, `Try moving RIGHT to [${row},${col + 1}].`, { row, col, action: 'try_move' });
      if (solveMazeUtil(row, col + 1)) {
        addStep(localSteps, solution, mazeInput, lm.returnTrueFromRight, `Path found via RIGHT move from [${row},${col}].`, { row, col });
        return true;
      }

      // Try moving down
      addStep(localSteps, solution, mazeInput, lm.tryMoveDown, `RIGHT move from [${row},${col}] failed. Try moving DOWN to [${row + 1},${col}].`, { row, col, action: 'try_move' });
      if (solveMazeUtil(row + 1, col)) {
         addStep(localSteps, solution, mazeInput, lm.returnTrueFromDown, `Path found via DOWN move from [${row},${col}].`, { row, col });
        return true;
      }
      
      solution[row][col] = 0; // Backtrack
      addStep(localSteps, solution, mazeInput, lm.backtrackUnmark, `No path from [${row},${col}]. Backtrack: unmark.`, { row, col, action: 'backtrack_remove' });
      addStep(localSteps, solution, mazeInput, lm.returnFalseBacktrack, `Return false from [${row},${col}].`, { row, col });
      return false;
    }
    return false; 
  }
  
  addStep(localSteps, solution, mazeInput, lm.initialSolveCall, `Initial call to solveMazeUtil(0,0).`);
  const solutionExists = solveMazeUtil(0, 0);
  
  if (solutionExists) {
    addStep(localSteps, solution, mazeInput, lm.returnSolutionOrNull, "Algorithm Complete: Solution Found!", undefined, undefined, undefined, true);
  } else {
    addStep(localSteps, solution, mazeInput, lm.returnSolutionOrNull, "Algorithm Complete: No solution exists for this maze.", undefined, undefined, undefined, false);
  }
  return localSteps;
};
