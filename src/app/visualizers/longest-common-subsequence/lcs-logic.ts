
import type { DPAlgorithmStep } from '@/types';

export const LCS_LINE_MAP = {
  functionDeclare: 1,
  getLengths: 2,
  initDPTable: 3,
  // dpTableMapComment: 4, (Conceptual)
  // Base cases dp[i][0]=0 and dp[0][j]=0 are implicit with init to 0
  outerLoopI: 4,    // for (let i = 1; i <= m; i++)
  innerLoopJ: 5,    //   for (let j = 1; j <= n; j++)
  checkCharsMatch: 6, // if (str1[i - 1] === str2[j - 1])
  setFromDiagonalPlus1: 7, // dp[i][j] = 1 + dp[i - 1][j - 1];
  elseCharsNoMatch: 8,
  setFromMaxAboveOrLeft: 9, // dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
  endInnerLoop: 10,
  endOuterLoop: 11,
  returnResult: 12, // return dp[m][n];
  // Optional: Backtracking logic for LCS string (lines 14-25)
  funcEnd: 13,
};

const addStep = (
  localSteps: DPAlgorithmStep[],
  line: number | null,
  dpTableState: number[][],
  str1: string,
  str2: string,
  message: string,
  currentItemIndices?: { i: number; j: number },
  highlighted?: { row: number; col: number; type: 'current' | 'dependency' | 'result' }[],
  auxData?: Record<string, any>
) => {
  localSteps.push({
    dpTable: dpTableState.map(row => [...row]),
    dpTableDimensions: { rows: str1.length + 1, cols: str2.length + 1 },
    currentIndices: currentItemIndices,
    highlightedCells: highlighted,
    message,
    currentLine: line,
    auxiliaryData: { ...auxData, str1, str2 },
  });
};

export const generateLCSSteps = (str1: string, str2: string): DPAlgorithmStep[] => {
  const localSteps: DPAlgorithmStep[] = [];
  const m = str1.length;
  const n = str2.length;
  const lm = LCS_LINE_MAP;

  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  addStep(localSteps, lm.functionDeclare, dp, str1, str2, `Finding LCS for "${str1}" and "${str2}".`);
  addStep(localSteps, lm.getLengths, dp, str1, str2, `String lengths: m=${m}, n=${n}.`);
  addStep(localSteps, lm.initDPTable, dp, str1, str2, `DP table [${m+1}x${n+1}] initialized to 0s (base cases).`);

  for (let i = 1; i <= m; i++) {
    addStep(localSteps, lm.outerLoopI, dp, str1, str2, `Outer loop: Processing char str1[${i-1}]='${str1[i-1]}' (row i=${i}).`);
    for (let j = 1; j <= n; j++) {
      addStep(localSteps, lm.innerLoopJ, dp, str1, str2, `  Inner loop: Processing char str2[${j-1}]='${str2[j-1]}' (col j=${j}). Cell dp[${i}][${j}].`, {i,j}, [{row:i, col:j, type:'current'}]);
      
      addStep(localSteps, lm.checkCharsMatch, dp, str1, str2, `  Compare str1[${i-1}] ('${str1[i-1]}') and str2[${j-1}] ('${str2[j-1]}').`, {i,j}, [{row:i, col:j, type:'current'}, {row:i-1,col:j-1, type:'dependency'}]);
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
        addStep(localSteps, lm.setFromDiagonalPlus1, dp, str1, str2, `  Chars match. dp[${i}][${j}] = 1 + dp[${i-1}][${j-1}] = ${dp[i][j]}.`, {i,j}, [{row:i, col:j, type:'current'}, {row:i-1, col:j-1, type:'dependency'}]);
      } else {
        addStep(localSteps, lm.elseCharsNoMatch, dp, str1, str2, `  Chars don't match. Take max of top or left.`, {i,j}, [{row:i, col:j, type:'current'}]);
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        addStep(localSteps, lm.setFromMaxAboveOrLeft, dp, str1, str2, 
          `  dp[${i}][${j}] = max(dp[${i-1}][${j}]=${dp[i-1][j]}, dp[${i}][${j-1}]=${dp[i][j-1]}) = ${dp[i][j]}.`, 
          {i,j}, [{row:i,col:j, type:'current'}, {row:i-1,col:j, type:'dependency'}, {row:i,col:j-1, type:'dependency'}]
        );
      }
    }
    addStep(localSteps, lm.endInnerLoop, dp, str1, str2, `  Finished inner loop for i=${i}.`);
  }
  addStep(localSteps, lm.endOuterLoop, dp, str1, str2, `Finished all calculations.`);

  const lcsLength = dp[m][n];
  
  // Backtrack to find one LCS string
  let lcsString = "";
  let r = m, c = n;
  const lcsPathCells: {row:number, col:number, type:'result'}[] = [];
  while (r > 0 && c > 0) {
    lcsPathCells.push({row:r, col:c, type:'result'}); // Add current cell to path
    if (str1[r-1] === str2[c-1]) {
      lcsString = str1[r-1] + lcsString;
      r--; c--;
    } else if (dp[r-1][c] > dp[r][c-1]) {
      r--;
    } else {
      c--;
    }
  }
   // Add final path highlight step
  addStep(localSteps, lm.returnResult, dp, str1, str2, `LCS Length is dp[${m}][${n}] = ${lcsLength}. Reconstructed LCS: "${lcsString}".`, undefined, lcsPathCells, {resultValue: lcsLength, lcsString});


  addStep(localSteps, lm.funcEnd, dp, str1, str2, "Algorithm complete.");
  return localSteps;
};

    