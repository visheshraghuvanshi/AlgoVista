
import type { RatInAMazeStep } from './types'; // Local import

export const RAT_IN_MAZE_LINE_MAP = {
  mainFuncStart: 1,
  initVisitedAndPaths: 2,
  checkStartIsSafe: 3,
  initialSolveCall: 4,
  
  solveUtilFuncStart: 5,
  baseCaseGoalReached: 6,
  addPathToSolutions: 7,
  returnFromBaseCase: 8,

  loopDirections: 9,
  getNextMove: 10,
  checkIsSafe: 11,
  markVisited: 12,
  recursiveCall: 13,
  backtrackUnmark: 14,
  
  isSafeFuncStart: 15,
  isSafeCheckBounds: 16,
  isSafeCheckWall: 17,
  isSafeCheckVisited: 18,
  isSafeReturn: 19,
};


const addStep = (
  steps: RatInAMazeStep[],
  maze: number[][],
  solutionPathBoard: number[][],
  line: number | null,
  message: string,
  currentPos: { row: number; col: number; },
  currentPathStr: string,
  solutionsFound: string[],
  action: RatInAMazeStep['action']
) => {
  // Visual board: 0=wall, 1=path, 2=current solution path
  const visualBoard = maze.map((row, rIdx) => 
    row.map((cell, cIdx) => {
      if (solutionPathBoard[rIdx][cIdx] === 1) return 2;
      return cell;
    })
  );

  steps.push({
    maze: visualBoard,
    solutionPath: currentPathStr,
    currentPosition: currentPos,
    action,
    message,
    currentLine: line,
    foundSolutions: [...solutionsFound],
  });
};

export const generateRatInAMazeSteps = (mazeInput: number[][]): RatInAMazeStep[] => {
  const localSteps: RatInAMazeStep[] = [];
  const N = mazeInput.length;
  if (N === 0) return localSteps;
  const M = mazeInput[0].length;
  
  const solutionPathBoard: number[][] = Array(N).fill(0).map(() => Array(M).fill(0));
  const solutions: string[] = [];
  const lm = RAT_IN_MAZE_LINE_MAP;
  
  addStep(localSteps, mazeInput, solutionPathBoard, lm.mainFuncStart, `Starting Rat in a Maze. Size: ${N}x${M}.`, {row: 0, col: 0}, "", solutions, 'try_move');

  function solveUtil(r: number, c: number, path: string) {
    addStep(localSteps, mazeInput, solutionPathBoard, lm.solveUtilFuncStart, `solve(row=${r}, col=${c}, path="${path}")`, {row: r, col: c}, path, solutions, 'try_move');
    
    // Base Case: Destination Reached
    if (r === N - 1 && c === M - 1) {
      addStep(localSteps, mazeInput, solutionPathBoard, lm.baseCaseGoalReached, `Goal reached at [${r},${c}]!`, {row: r, col: c}, path, solutions, 'goal_reached');
      solutions.push(path);
      addStep(localSteps, mazeInput, solutionPathBoard, lm.addPathToSolutions, `Path "${path}" added. Solutions: ${solutions.length}.`, {row: r, col: c}, path, solutions, 'goal_reached');
      addStep(localSteps, mazeInput, solutionPathBoard, lm.returnFromBaseCase, `Returning from goal to find other paths.`, {row: r, col: c}, path, solutions, 'goal_reached');
      return;
    }

    // Mark current cell as part of the solution path
    solutionPathBoard[r][c] = 1;
    addStep(localSteps, mazeInput, solutionPathBoard, lm.markVisited, `Mark [${r},${c}] as part of current path.`, {row: r, col: c}, path, solutions, 'mark_path');
    
    // Directions: Down, Left, Right, Up
    const directions = "DLRU";
    const dr = [1, 0, 0, -1];
    const dc = [0, -1, 1, 0];

    for (let i = 0; i < 4; i++) {
      const nextR = r + dr[i];
      const nextC = c + dc[i];
      const nextDir = directions[i];

      addStep(localSteps, mazeInput, solutionPathBoard, lm.loopDirections, `Trying to move ${nextDir} to [${nextR},${nextC}].`, {row:r, col:c}, path, solutions, 'try_move');
      
      const isMoveSafe = nextR >= 0 && nextR < N && nextC >= 0 && nextC < M && mazeInput[nextR][nextC] === 1 && solutionPathBoard[nextR][nextC] === 0;
      addStep(localSteps, mazeInput, solutionPathBoard, lm.isSafeCheckBounds, `isSafe([${nextR},${nextC}])? -> ${isMoveSafe}`, {row: nextR, col: nextC}, path, solutions, 'check_safe');
      
      if (isMoveSafe) {
        addStep(localSteps, mazeInput, solutionPathBoard, lm.recursiveCall, `Move ${nextDir} is safe. Recursive call.`, {row:nextR, col:nextC}, path, solutions, 'try_move');
        solveUtil(nextR, nextC, path + nextDir);
      }
    }
    
    // Backtrack
    solutionPathBoard[r][c] = 0;
    addStep(localSteps, mazeInput, solutionPathBoard, lm.backtrackUnmark, `Backtrack from [${r},${c}]. Unmarking path.`, {row: r, col: c}, path.slice(0,-1), solutions, 'backtrack');
  }

  if (mazeInput[0][0] === 1) {
    addStep(localSteps, mazeInput, solutionPathBoard, lm.initialSolveCall, `Initial call to solve(0,0).`, {row: 0, col: 0}, "", solutions, 'try_move');
    solveUtil(0, 0, "");
  } else {
    addStep(localSteps, mazeInput, solutionPathBoard, null, `Start position [0,0] is blocked. No solution possible.`, {row: 0, col: 0}, "", solutions, 'stuck');
  }

  const finalMessage = solutions.length > 0 ? `Finished. Found ${solutions.length} solution(s).` : "Finished. No solution exists.";
  addStep(localSteps, mazeInput, solutionPathBoard, null, finalMessage, {row: N-1, col: M-1}, "", solutions, solutions.length > 0 ? 'goal_reached' : 'stuck');
  
  return localSteps;
};
