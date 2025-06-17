
import type { DPAlgorithmStep } from '@/types';

export const EDIT_DISTANCE_LINE_MAP = {
  functionDeclare: 1,
  getLengths: 2,
  initDPTable: 3,
  // dpTableMapComment: 4, (Conceptual)
  baseCaseLoopI: 5, // for (let i = 0; i <= m; i++) dp[i][0] = i;
  baseCaseLoopJ: 6, // for (let j = 0; j <= n; j++) dp[0][j] = j;
  outerLoopI: 7,    // for (let i = 1; i <= m; i++)
  innerLoopJ: 8,    //   for (let j = 1; j <= n; j++)
  checkCharsMatch: 9, // if (str1[i - 1] === str2[j - 1])
  setFromDiagonal: 10, // dp[i][j] = dp[i - 1][j - 1];
  elseCharsNoMatch: 11,
  setFromMinOperations: 12, // dp[i][j] = 1 + Math.min(...)
  // Conceptual sub-lines for min:
  // minInsert: 12.1 (dp[i][j-1])
  // minDelete: 12.2 (dp[i-1][j])
  // minReplace: 12.3 (dp[i-1][j-1])
  endInnerLoop: 13,
  endOuterLoop: 14,
  returnResult: 15, // return dp[m][n];
  funcEnd: 16,
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
    auxiliaryData: { ...auxData, str1, str2 }, // Include strings for context in visualization
  });
};

export const generateEditDistanceSteps = (str1: string, str2: string): DPAlgorithmStep[] => {
  const localSteps: DPAlgorithmStep[] = [];
  const m = str1.length;
  const n = str2.length;
  const lm = EDIT_DISTANCE_LINE_MAP;

  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  addStep(localSteps, lm.functionDeclare, dp, str1, str2, `Calculating Edit Distance for "${str1}" and "${str2}".`);
  addStep(localSteps, lm.getLengths, dp, str1, str2, `String lengths: m=${m} (for "${str1}"), n=${n} (for "${str2}").`);
  addStep(localSteps, lm.initDPTable, dp, str1, str2, `DP table [${m+1}x${n+1}] initialized.`);

  // Base cases
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
    addStep(localSteps, lm.baseCaseLoopI, dp, str1, str2, `Base Case: dp[${i}][0] = ${i} (deleting ${i} chars from str1 to get empty).`, {i, j:0}, [{row:i, col:0, type:'current'}]);
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
    addStep(localSteps, lm.baseCaseLoopJ, dp, str1, str2, `Base Case: dp[0][${j}] = ${j} (inserting ${j} chars to empty str1 to get str2 prefix).`, {i:0, j}, [{row:0, col:j, type:'current'}]);
  }

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    addStep(localSteps, lm.outerLoopI, dp, str1, str2, `Outer loop: Processing char str1[${i-1}]='${str1[i-1]}' (row i=${i}).`);
    for (let j = 1; j <= n; j++) {
      addStep(localSteps, lm.innerLoopJ, dp, str1, str2, `  Inner loop: Processing char str2[${j-1}]='${str2[j-1]}' (col j=${j}). Cell dp[${i}][${j}].`, {i,j}, [{row:i, col:j, type:'current'}]);
      
      const cost = (str1[i - 1] === str2[j - 1]) ? 0 : 1;
      addStep(localSteps, lm.checkCharsMatch, dp, str1, str2, `  Compare str1[${i-1}] ('${str1[i-1]}') and str2[${j-1}] ('${str2[j-1]}'). Cost = ${cost}.`, {i,j}, [{row:i, col:j, type:'current'}, {row:i-1,col:j-1, type:'dependency'}]);

      if (cost === 0) { // Characters match
        dp[i][j] = dp[i - 1][j - 1];
        addStep(localSteps, lm.setFromDiagonal, dp, str1, str2, `  Chars match. dp[${i}][${j}] = dp[${i-1}][${j-1}] = ${dp[i][j]}.`, {i,j}, [{row:i, col:j, type:'current'}, {row:i-1, col:j-1, type:'dependency'}]);
      } else { // Characters don't match
        addStep(localSteps, lm.elseCharsNoMatch, dp, str1, str2, `  Chars don't match. Consider insert, delete, replace.`, {i,j}, [{row:i, col:j, type:'current'}]);
        const insertCost = dp[i][j - 1];    // Cost of inserting str2[j-1]
        const deleteCost = dp[i - 1][j];    // Cost of deleting str1[i-1]
        const replaceCost = dp[i - 1][j - 1]; // Cost of replacing str1[i-1] with str2[j-1]
        
        dp[i][j] = 1 + Math.min(insertCost, deleteCost, replaceCost);
        addStep(localSteps, lm.setFromMinOperations, dp, str1, str2, 
          `  dp[${i}][${j}] = 1 + min(insert:dp[${i}][${j-1}]=${insertCost}, delete:dp[${i-1}][${j}]=${deleteCost}, replace:dp[${i-1}][${j-1}]=${replaceCost}) = ${dp[i][j]}.`, 
          {i,j}, [{row:i,col:j, type:'current'}, {row:i,col:j-1, type:'dependency'}, {row:i-1,col:j, type:'dependency'}, {row:i-1,col:j-1, type:'dependency'}]
        );
      }
    }
    addStep(localSteps, lm.endInnerLoop, dp, str1, str2, `  Finished inner loop for i=${i}.`);
  }
  addStep(localSteps, lm.endOuterLoop, dp, str1, str2, `Finished all calculations.`);

  const result = dp[m][n];
  addStep(localSteps, lm.returnResult, dp, str1, str2, `Edit Distance is dp[${m}][${n}] = ${result}.`, undefined, [{row:m, col:n, type:'result'}], {resultValue: result});
  addStep(localSteps, lm.funcEnd, dp, str1, str2, "Algorithm complete.");
  return localSteps;
};

    