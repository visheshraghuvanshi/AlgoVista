
import type { DPAlgorithmStep } from '@/types';

export const MCM_LINE_MAP = {
  funcDeclare: 1,
  getNMatrices: 2,
  initDPTable: 3,
  // sTableInit: 4, // Optional for reconstructing
  baseCaseLoopL1: 5, // dp[i][i] = 0 for L=1 implicitly handled by init
  outerLoopL: 6,     // for (let L = 2...) chain length
  innerLoopI: 7,     // for (let i = 1...) start of chain
  calculateJ: 8,     // j = i + L - 1;
  initDpIJInfinity: 9,
  loopKCut: 10,      // for (let k = i; k < j...) split point
  calculateCost: 11,
  checkIfCostSmaller: 12,
  updateDpIJ: 13,
  // updateS_IJ: 14, // Optional
  endLoopK: 15,
  endInnerLoopI: 16,
  endOuterLoopL: 17,
  returnResult: 18,
  funcEnd: 19,
};

const addStep = (
  localSteps: DPAlgorithmStep[],
  line: number | null,
  dpTableState: number[][],
  pArray: number[], // Dimensions array
  message: string,
  currentL?: number,
  currentI?: number,
  currentJ?: number,
  currentK?: number,
  highlighted?: {row: number, col: number, type: 'current' | 'dependency' | 'result'}[],
  auxData?: Record<string, any>
) => {
  const nMatrices = pArray.length - 1;
  localSteps.push({
    dpTable: dpTableState.map(row => [...row]),
    dpTableDimensions: { rows: nMatrices + 1, cols: nMatrices + 1 }, // 1-indexed for matrices
    currentIndices: { L: currentL, i: currentI, j: currentJ, k: currentK },
    highlightedCells: highlighted,
    message,
    currentLine: line,
    auxiliaryData: { ...auxData, pArray: [...pArray], nMatrices },
  });
};

export const generateMCMSteps = (p: number[]): DPAlgorithmStep[] => {
  const localSteps: DPAlgorithmStep[] = [];
  const n = p.length - 1; // Number of matrices
  if (n <= 0) {
    addStep(localSteps, null, [], p, "No matrices to multiply or invalid dimensions array.");
    return localSteps;
  }
  const lm = MCM_LINE_MAP;

  // dp[i][j] = Minimum scalar multiplications for A_i...A_j
  // Using 1-based indexing for matrices, so dp table is (n+1)x(n+1)
  const dp: number[][] = Array(n + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  addStep(localSteps, lm.funcDeclare, dp, p, `Optimizing Matrix Chain Multiplication for ${n} matrices. Dimensions p: [${p.join(', ')}].`);
  addStep(localSteps, lm.getNMatrices, dp, p, `Number of matrices (n) = ${n}.`);
  addStep(localSteps, lm.initDPTable, dp, p, `DP table dp[${n+1}x${n+1}] initialized. dp[i][i]=0 (cost for single matrix).`);

  // L is chain length
  for (let L = 2; L <= n; L++) {
    addStep(localSteps, lm.outerLoopL, dp, p, `Chain Length L = ${L}.`, L);
    for (let i = 1; i <= n - L + 1; i++) {
      const j = i + L - 1;
      addStep(localSteps, lm.innerLoopI, dp, p, `  Subchain A[${i}]...A[${j}]. (i=${i}, j=${j}).`, L, i, j);
      
      dp[i][j] = Infinity;
      addStep(localSteps, lm.initDpIJInfinity, dp, p, `    Initialize dp[${i}][${j}] = Infinity.`, L, i, j, undefined, [{row:i, col:j, type:'current'}]);

      for (let k = i; k < j; k++) {
        addStep(localSteps, lm.loopKCut, dp, p, `      Split k = ${k}: (A[${i}]...A[${k}]) * (A[${k+1}]...A[${j}]).`, L, i, j, k, [{row:i, col:j, type:'current'}]);
        
        const cost = dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j];
        const costCalculationMsg = `dp[${i}][${k}] (${dp[i][k]}) + dp[${k+1}][${j}] (${dp[k+1][j]}) + p[${i-1}]*p[${k}]*p[${j}] (${p[i-1]}*${p[k]}*${p[j]}) = ${cost}`;
        addStep(localSteps, lm.calculateCost, dp, p, `        Cost = ${costCalculationMsg}.`, L, i, j, k, [{row:i,col:j, type:'current'}, {row:i,col:k, type:'dependency'}, {row:k+1,col:j, type:'dependency'}], {costCalculation: costCalculationMsg});
        
        addStep(localSteps, lm.checkIfCostSmaller, dp, p, `        Is cost (${cost}) < current dp[${i}][${j}] (${dp[i][j]})?`, L, i, j, k, [{row:i,col:j, type:'current'}]);
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          addStep(localSteps, lm.updateDpIJ, dp, p, `          Yes. Update dp[${i}][${j}] = ${dp[i][j]}.`, L, i, j, k, [{row:i,col:j, type:'current'}, {row:i,col:k, type:'dependency'}, {row:k+1,col:j, type:'dependency'}]);
        } else {
            addStep(localSteps, lm.updateDpIJ, dp, p, `          No. dp[${i}][${j}] remains ${dp[i][j]}.`, L, i, j, k, [{row:i,col:j, type:'current'}]);
        }
      }
       addStep(localSteps, lm.endLoopK, dp, p, `    Finished splits for dp[${i}][${j}]. dp[${i}][${j}] = ${dp[i][j]}.`, L, i, j, undefined, [{row:i,col:j, type:'result'}]);
    }
     addStep(localSteps, lm.endInnerLoopI, dp, p, `  Finished all subchains of length ${L}.`, L);
  }
   addStep(localSteps, lm.endOuterLoopL, dp, p, `All chain lengths processed.`);

  const minMultiplications = dp[1][n];
  addStep(localSteps, lm.returnResult, dp, p, `Minimum scalar multiplications: dp[1][${n}] = ${minMultiplications}.`, undefined, undefined, undefined, undefined, [{row:1, col:n, type:'result'}], {resultValue: minMultiplications});
  addStep(localSteps, lm.funcEnd, dp, p, "Algorithm complete.", undefined, undefined, undefined, undefined, undefined, {resultValue: minMultiplications});
  return localSteps;
};
    