
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
  returnSolutionOrNull: 25,
};

const addStep = (
  localSteps: RatInAMazeStep[],
  line: number | null,
  currentMaze: number[][],
  solutionBoard: number[][], // The path being built
  message: string,
  ratPos?: { row: number; col: number },
  action?: RatInAMazeStep['action']
) => {
  // Combine maze and solution for visualization: 0=wall, 1=path, 2=solution path
  const visualBoard = currentMaze.map((row, rIdx) => 
    row.map((cell, cIdx) => {
      if (solutionBoard[rIdx][cIdx] === 1) return 2; // Path taken
      return cell; // Original maze (0 for wall, 1 for open path)
    })
  );

  localSteps.push({
    maze: visualBoard,
    currentPosition: ratPos,
    action,
    message,
    currentLine: line,
    activeIndices: ratPos ? [ratPos.row, ratPos.col] : [], // For generic panel if used
    swappingIndices: [],
    sortedIndices: [],
    auxiliaryData: {
        currentRatRow: ratPos?.row,
        currentRatCol: ratPos?.col,
        status: action
    }
  });
};

export const generateRatInAMazeSteps = (maze: number[][]): RatInAMazeStep[] => {
  const localSteps: RatInAMazeStep[] = [];
  const N = maze.length;
  if (N === 0) {
    addStep(localSteps, null, maze, [], "Maze is empty.");
    return localSteps;
  }
  const M = maze[0].length;
  if (M === 0) {
    addStep(localSteps, null, maze, [], "Maze row is empty.");
    return localSteps;
  }

  const solution: number[][] = Array(N).fill(0).map(() => Array(M).fill(0));
  const lm = RAT_IN_MAZE_LINE_MAP;

  addStep(localSteps, lm.solveMazeFunc, maze, solution, `Starting Rat in a Maze. Size: ${N}x${M}.`);
  addStep(localSteps, lm.initSolutionMatrix, maze, solution, "Initialize solution matrix with 0s.");

  function isSafe(row: number, col: number): boolean {
    addStep(localSteps, lm.isSafeFuncStart, maze, solution, `isSafe(row=${row}, col=${col})?`, { row, col, action: 'checking_safe' });
    let safe = row >= 0 && row < N && col >= 0 && col < M;
    addStep(localSteps, lm.isSafeCheckBounds, maze, solution, safe ? `Bounds check OK` : `Out of bounds`, {row, col, action: 'checking_safe'});
    safe = safe && maze[row][col] === 1;
    addStep(localSteps, lm.isSafeCheckWall, maze, solution, safe ? `Cell is an open path` : `Cell is a wall`, {row, col, action: 'checking_safe'});
    safe = safe && solution[row][col] === 0;
    addStep(localSteps, lm.isSafeCheckVisited, maze, solution, safe ? `Cell is not on current path` : `Cell is on current path`, {row, col, action: 'checking_safe'});
    addStep(localSteps, safe ? lm.isSafeReturnTrue : lm.isSafeReturnFalse, maze, solution, safe ? `Cell [${row},${col}] is safe.` : `Cell [${row},${col}] is NOT safe.`, { row, col, action: safe ? 'checking_safe' : 'blocked' }, safe);
    return safe;
  }

  function solveMazeUtil(row: number, col: number): boolean {
    addStep(localSteps, lm.solveUtilFuncStart, maze, solution, `solveMazeUtil(row=${row}, col=${col})`, { row, col, action: 'try_move' });

    if (row === N - 1 && col === M - 1 && maze[row][col] === 1) {
      addStep(localSteps, lm.baseCaseGoalReached, maze, solution, `Goal reached at [${row},${col}]!`, { row, col, action: 'goal_reached' });
      solution[row][col] = 1;
      addStep(localSteps, lm.markGoalInSolution, maze, solution, `Mark [${row},${col}] in solution. Path found.`, { row, col, action: 'mark_path' });
      addStep(localSteps, lm.returnTrueGoal, maze, solution, `Returning True - GOAL REACHED!`, {row, col, action: 'goal_reached'});
      return true;
    }

    addStep(localSteps, lm.checkIfSafeCurrent, maze, solution, `Checking if current cell [${row},${col}] is safe to move to.`, { row, col, action: 'checking_safe' });
    if (isSafe(row, col)) {
      solution[row][col] = 1;
      addStep(localSteps, lm.markCurrentInSolution, maze, solution, `Mark [${row},${col}] as part of path.`, { row, col, action: 'mark_path' });

      // Try moving right
      addStep(localSteps, lm.tryMoveRight, maze, solution, `Try moving RIGHT to [${row},${col + 1}].`, { row, col, action: 'try_move' });
      if (solveMazeUtil(row, col + 1)) {
        addStep(localSteps, lm.recursiveCallRight, maze, solution, `Recursive call solveMazeUtil(${row}, ${col+1}) for RIGHT move.`, {row, col, action: 'try_move'});
        addStep(localSteps, lm.returnTrueFromRight, maze, solution, `Path found via RIGHT move from [${row},${col}].`, { row, col });
        return true;
      }

      // Try moving down
      addStep(localSteps, lm.tryMoveDown, maze, solution, `RIGHT move from [${row},${col}] failed or path not found. Try moving DOWN to [${row + 1},${col}].`, { row, col, action: 'try_move' });
      if (solveMazeUtil(row + 1, col)) {
        addStep(localSteps, lm.recursiveCallDown, maze, solution, `Recursive call solveMazeUtil(${row+1}, ${col}) for DOWN move.`, {row, col, action: 'try_move'});
        addStep(localSteps, lm.returnTrueFromDown, maze, solution, `Path found via DOWN move from [${row},${col}].`, { row, col });
        return true;
      }

      solution[row][col] = 0;
      addStep(localSteps, lm.backtrackUnmark, maze, solution, `No path from [${row},${col}]. Backtrack: unmark.`, { row, col, action: 'backtrack_remove' });
      addStep(localSteps, lm.returnFalseBacktrack, maze, solution, `Return false from [${row},${col}].`, { row, col });
      return false;
    }
    addStep(localSteps, lm.returnFalseNotSafe, maze, solution, `Cell [${row},${col}] is not safe or already part of this path attempt. Return false.`, { row, col, action: 'blocked' });
    return false;
  }

  addStep(localSteps, lm.initialSolveCall, maze, solution, `Initial call to solveMazeUtil(0,0).`, {row:0, col:0, action:'try_move'});
  if (solveMazeUtil(0, 0)) {
    addStep(localSteps, maze, solution, "Solution Found!", undefined, 'goal_reached', undefined, true);
  } else {
    addStep(localSteps, maze, solution, "No solution exists for this maze.", undefined, 'stuck', undefined, false);
  }
  addStep(localSteps, lm.returnSolutionOrNull, maze, solution, "Algorithm complete.");
  return localSteps;
};
