
// src/app/visualizers/coin-change/coin-change-logic.ts
import type { DPAlgorithmStep } from './types'; // Local import

export type CoinChangeProblemType = 'minCoins' | 'numWays';

export const COIN_CHANGE_LINE_MAPS: Record<CoinChangeProblemType, Record<string, number>> = {
  minCoins: {
    funcDeclare: 1,
    initDPTable: 2, // dp = new Array(amount + 1).fill(Infinity);
    setBaseCase: 3, // dp[0] = 0;
    outerLoopAmount: 4, // for (let i = 1; i <= amount; i++)
    innerLoopCoins: 5, // for (const coin of coins)
    checkCoinCondition: 6, // if (coin <= i && dp[i - coin] !== Infinity)
    updateDPMin: 7, // dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    endInnerLoop: 8, // Conceptual
    endOuterLoop: 9, // Conceptual
    returnResult: 10, // return dp[amount] === Infinity ? -1 : dp[amount];
    funcEnd: 11,
  },
  numWays: {
    funcDeclare: 1,
    initDPTable: 2, // dp = new Array(amount + 1).fill(0);
    setBaseCase: 3, // dp[0] = 1;
    outerLoopCoins: 4, // for (const coin of coins)
    innerLoopAmount: 5, // for (let i = coin; i <= amount; i++)
    updateDPWays: 6, // dp[i] += dp[i - coin];
    endInnerLoop: 7, // Conceptual
    endOuterLoop: 8, // Conceptual
    returnResult: 9, // return dp[amount];
    funcEnd: 10,
  },
};

const INFINITY_REPRESENTATION = Number.MAX_SAFE_INTEGER; // For minCoins

const addStep = (
  localSteps: DPAlgorithmStep[],
  line: number | null,
  dpTableState: number[],
  problemType: CoinChangeProblemType,
  message: string,
  currentAmountIdx?: number,
  currentCoinVal?: number,
  highlighted?: {col: number, type: 'current' | 'dependency' | 'result'}[], // Using col for 1D index
  auxData?: Record<string, any>
) => {
  localSteps.push({
    dpTable: [...dpTableState].map(val => val === INFINITY_REPRESENTATION ? Infinity : val), // Display Infinity properly
    currentIndices: { amount: currentAmountIdx, coin: currentCoinVal },
    highlightedCells: highlighted,
    message,
    currentLine: line,
    auxiliaryData: {...auxData, problemType, infinityVal: INFINITY_REPRESENTATION, coins: auxData?.coins || [] },
  });
};

export const generateCoinChangeSteps = (
  coins: number[],
  amount: number,
  problemType: CoinChangeProblemType
): DPAlgorithmStep[] => {
  const localSteps: DPAlgorithmStep[] = [];
  const lm = COIN_CHANGE_LINE_MAPS[problemType];
  
  let dp: number[];

  if (problemType === 'minCoins') {
    dp = Array(amount + 1).fill(INFINITY_REPRESENTATION);
    addStep(localSteps, lm.funcDeclare, dp, problemType, `Solving Min Coins for amount ${amount} with coins [${coins.join(', ')}].`, undefined, undefined, [], {coins, amount});
    addStep(localSteps, lm.initDPTable, dp, problemType, `DP table (size ${amount+1}) initialized to Infinity.`, undefined, undefined, [], {coins, amount});
    dp[0] = 0;
    addStep(localSteps, lm.setBaseCase, dp, problemType, "Base case: dp[0] = 0 (0 coins for amount 0).", 0, undefined, [{col:0, type:'current'}], {coins, amount});

    for (let i = 1; i <= amount; i++) {
      addStep(localSteps, lm.outerLoopAmount, dp, problemType, `Calculating min coins for amount i = ${i}.`, i, undefined, [{col:i, type:'current'}], {coins, amount});
      for (const coin of coins) {
        addStep(localSteps, lm.innerLoopCoins, dp, problemType, `  Considering coin = ${coin}.`, i, coin, [{col:i, type:'current'}], {coins, amount});
        if (coin <= i && dp[i - coin] !== INFINITY_REPRESENTATION) {
          let calcMsg = `  Coin ${coin} <= amount ${i}. dp[${i-coin}] (${dp[i-coin] === INFINITY_REPRESENTATION ? '∞' : dp[i-coin]}) + 1`;
          const potentialNewMin = dp[i-coin] + 1;
          addStep(localSteps, lm.checkCoinCondition, dp, problemType, calcMsg, i, coin, [{col:i, type:'current'}, {col: i-coin, type:'dependency'}], {coins, amount, currentCalculation: `${dp[i-coin] === INFINITY_REPRESENTATION ? '∞' : dp[i-coin]} + 1 vs dp[${i}]=${dp[i] === INFINITY_REPRESENTATION ? '∞' : dp[i]}`});
          if (potentialNewMin < dp[i]) {
            dp[i] = potentialNewMin;
            calcMsg = `    Update dp[${i}] = ${dp[i]}. (Was ${dp[i] === potentialNewMin ? (potentialNewMin === INFINITY_REPRESENTATION ? '∞' : dp[i-coin]+1) : (dp[i-coin]+1 < dp[i] ? dp[i-coin]+1 : dp[i]) })`; // Message for after update
          } else {
            calcMsg = `    No update to dp[${i}]. Potential sum ${potentialNewMin} is not less than current ${dp[i] === INFINITY_REPRESENTATION ? '∞' : dp[i]}.`;
          }
          addStep(localSteps, lm.updateDPMin, dp, problemType, calcMsg, i, coin, [{col:i, type:'result'}, {col: i-coin, type:'dependency'}], {coins, amount, currentCalculation: `${dp[i-coin] === INFINITY_REPRESENTATION ? '∞' : dp[i-coin]} + 1`});
        } else {
          addStep(localSteps, lm.checkCoinCondition, dp, problemType, `  Coin ${coin} > amount ${i} OR dp[${i-coin}] is Infinity. Cannot use this coin for current sum.`, i, coin, [{col:i, type:'current'}, {col: i-coin, type:'dependency'}], {coins, amount});
        }
      }
      addStep(localSteps, lm.endOuterLoop, dp, problemType, `Finished calculations for amount i = ${i}. dp[${i}] = ${dp[i] === INFINITY_REPRESENTATION ? '∞' : dp[i]}.`, i, undefined, [{col:i, type:'result'}], {coins, amount});
    }
    const result = dp[amount] === INFINITY_REPRESENTATION ? -1 : dp[amount];
    addStep(localSteps, lm.returnResult, dp, problemType, `Min coins for amount ${amount}: ${result === -1 ? 'Not Possible' : result}.`, undefined, undefined, [{col:amount, type:'result'}], {coins, amount, resultValue: result});

  } else { // numWays
    dp = Array(amount + 1).fill(0);
    addStep(localSteps, lm.funcDeclare, dp, problemType, `Solving Number of Ways for amount ${amount} with coins [${coins.join(', ')}].`, undefined, undefined, [], {coins, amount});
    addStep(localSteps, lm.initDPTable, dp, problemType, `DP table (size ${amount+1}) initialized to 0.`, undefined, undefined, [], {coins, amount});
    dp[0] = 1;
    addStep(localSteps, lm.setBaseCase, dp, problemType, "Base case: dp[0] = 1 (1 way for amount 0 - use no coins).", 0, undefined, [{col:0, type:'current'}], {coins, amount});

    for (const coin of coins) {
      addStep(localSteps, lm.outerLoopCoins, dp, problemType, `Considering coin = ${coin}.`, undefined, coin, [], {coins, amount});
      for (let i = coin; i <= amount; i++) {
        let calcMsg = `  Amount i = ${i}. Add ways from dp[${i-coin}] (${dp[i-coin]}) to current dp[${i}] (${dp[i]}).`;
        addStep(localSteps, lm.innerLoopAmount, dp, problemType, calcMsg, i, coin, [{col:i, type:'current'}, {col:i-coin, type:'dependency'}], {coins, amount, currentCalculation: `dp[${i}] (old=${dp[i]}) + dp[${i-coin}] (${dp[i-coin]})`});
        dp[i] += dp[i - coin];
        calcMsg = `    New dp[${i}] = ${dp[i]}.`;
        addStep(localSteps, lm.updateDPWays, dp, problemType, calcMsg, i, coin, [{col:i, type:'result'}, {col:i-coin, type:'dependency'}], {coins, amount, currentCalculation: `dp[${i}] = ${dp[i]}`});
      }
      addStep(localSteps, lm.endOuterLoop, dp, problemType, `Finished processing coin ${coin}.`, undefined, coin, [], {coins, amount});
    }
    const result = dp[amount];
    addStep(localSteps, lm.returnResult, dp, problemType, `Number of ways for amount ${amount}: ${result}.`, undefined, undefined, [{col:amount, type:'result'}], {coins, amount, resultValue: result});
  }
  
  addStep(localSteps, lm.funcEnd, dp, problemType, "Algorithm complete.");
  return localSteps;
};
