
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
  currentMaze: number[][], // Original maze definition
  solutionBoard: number[][], // The path being built
  line: number | null,
  message: string,
  currentQueen?: { row: number; col: number; action: 'place' | 'remove' | 'checking_safe' | 'backtracking_from' | 'try_move' | 'blocked' | 'goal_reached' | 'stuck' },
  isSafeResult?: boolean,
  isSolutionFoundOverall?: boolean
) => {
  // Combine maze and solution for visualization: 0=wall, 1=path, 2=solution path
  const visualBoard = currentMaze.map((row, rIdx) => 
    row.map((cell, cIdx) => {
      if (solutionBoard[rIdx][cIdx] === 1) return 2; // Path taken
      return cell; // Original maze (0 for wall, 1 for open path)
    })
  );

  steps.push({
    maze: visualBoard,
    initialBoard: currentMaze.map(row => [...row]), // Pass a copy of the original maze for the panel
    currentPosition: currentQueen,
    action: currentQueen?.action,
    isSafe: isSafeResult,
    message,
    currentLine: line,
    solutionFound: isSolutionFoundOverall,
    activeIndices: currentQueen ? [currentQueen.row, currentQueen.col] : [],
    swappingIndices: [],
    sortedIndices: [],
  });
};

export const generateRatInAMazeSteps = (mazeInput: number[][]): RatInAMazeStep[] => {
  const localSteps: RatInAMazeStep[] = [];
  const N = mazeInput.length;
  if (N === 0) {
    addStep(localSteps, mazeInput, [], null, "Maze is empty.");
    return localSteps;
  }
  const M = mazeInput[0].length;
  if (M === 0) {
    addStep(localSteps, mazeInput, [], null, "Maze row is empty.");
    return localSteps;
  }

  const solution: number[][] = Array(N).fill(0).map(() => Array(M).fill(0));
  const lm = RAT_IN_MAZE_LINE_MAP;
  
  // Pass the original mazeInput for initialBoard parameter in addStep
  addStep(localSteps, mazeInput, solution, lm.solveMazeFunc, `Starting Rat in a Maze. Size: ${N}x${M}.`, undefined, undefined, false);
  addStep(localSteps, mazeInput, solution, lm.initSolutionMatrix, "Initialize solution matrix with 0s.", undefined, undefined, false);

  function isSafe(row: number, col: number): boolean {
    addStep(localSteps, mazeInput, solution, lm.isSafeFuncStart, `isSafe(row=${row}, col=${col})?`, { row, col, action: 'checking_safe' });
    
    let safe = row >= 0 && row < N && col >= 0 && col < M;
    addStep(localSteps, mazeInput, solution, lm.isSafeCheckBounds, safe ? `Bounds check OK` : `Out of bounds`, {row, col, action: 'checking_safe'});
    safe = safe && mazeInput[row][col] === 1; // Check against original maze for walls
    addStep(localSteps, mazeInput, solution, lm.isSafeCheckWall, safe ? `Cell is an open path` : `Cell is a wall`, {row, col, action: 'checking_safe'});
    safe = safe && solution[row][col] === 0; // Check against solution board for current path
    addStep(localSteps, mazeInput, solution, lm.isSafeCheckVisited, safe ? `Cell is not on current path` : `Cell is on current path`, {row, col, action: 'checking_safe'});
    
    const finalSafeMessage = safe ? `Cell [${row},${col}] is safe.` : `Cell [${row},${col}] is NOT safe.`;
    const safeLine = safe ? lm.isSafeReturnTrue : lm.isSafeReturnFalse;
    addStep(localSteps, mazeInput, solution, safeLine, finalSafeMessage, { row, col, action: safe ? 'checking_safe' : 'blocked' }, safe);
    return safe;
  }

  function solveMazeUtil(row: number, col: number): boolean {
    addStep(localSteps, mazeInput, solution, lm.solveUtilFuncStart, `solveMazeUtil(row=${row}, col=${col})`, { row, col, action: 'try_move' });

    if (row === N - 1 && col === M - 1 && mazeInput[row][col] === 1) {
      addStep(localSteps, mazeInput, solution, lm.baseCaseGoalReached, `Goal reached at [${row},${col}]!`, { row, col, action: 'goal_reached' });
      solution[row][col] = 1;
      addStep(localSteps, mazeInput, solution, lm.markGoalInSolution, `Mark [${row},${col}] in solution. Path found.`, { row, col, action: 'mark_path' }, undefined, true); // Solution found
      // lm.returnTrueGoal is effectively the state after marking and confirming goal
      return true;
    }

    addStep(localSteps, mazeInput, solution, lm.checkIfSafeCurrent, `Checking if current cell [${row},${col}] is safe.`, { row, col, action: 'checking_safe' });
    if (isSafe(row, col)) {
      solution[row][col] = 1;
      addStep(localSteps, mazeInput, solution, lm.markCurrentInSolution, `Mark [${row},${col}] as part of path.`, { row, col, action: 'mark_path' });

      // Try moving right
      addStep(localSteps, mazeInput, solution, lm.tryMoveRight, `Try moving RIGHT to [${row},${col + 1}].`, { row, col, action: 'try_move' });
      if (solveMazeUtil(row, col + 1)) {
        addStep(localSteps, mazeInput, solution, lm.returnTrueFromRight, `Path found via RIGHT move from [${row},${col}].`, { row, col });
        return true;
      }

      // Try moving down
      addStep(localSteps, mazeInput, solution, lm.tryMoveDown, `RIGHT move from [${row},${col}] failed. Try moving DOWN to [${row + 1},${col}].`, { row, col, action: 'try_move' });
      if (solveMazeUtil(row + 1, col)) {
         addStep(localSteps, mazeInput, solution, lm.returnTrueFromDown, `Path found via DOWN move from [${row},${col}].`, { row, col });
        return true;
      }
      
      // If considering all 4 directions, add Up and Left here similarly.

      solution[row][col] = 0; // Backtrack
      addStep(localSteps, mazeInput, solution, lm.backtrackUnmark, `No path from [${row},${col}]. Backtrack: unmark.`, { row, col, action: 'backtrack_remove' });
      addStep(localSteps, mazeInput, solution, lm.returnFalseBacktrack, `Return false from [${row},${col}].`, { row, col });
      return false;
    }
    // lm.returnFalseNotSafe is covered by the isSafe call itself adding a step
    return false; 
  }
  
  addStep(localSteps, mazeInput, solution, lm.initialSolveCall, `Initial call to solveMazeUtil(0,0).`, {row:0, col:0, action:'try_move'});
  const solutionExists = solveMazeUtil(0, 0);
  
  if (solutionExists) {
    addStep(localSteps, mazeInput, solution, lm.returnSolutionOrNull, "Algorithm Complete: Solution Found!", undefined, undefined, undefined, true);
  } else {
    addStep(localSteps, mazeInput, solution, lm.returnSolutionOrNull, "Algorithm Complete: No solution exists for this maze.", undefined, undefined, undefined, false);
  }
  return localSteps;
};

