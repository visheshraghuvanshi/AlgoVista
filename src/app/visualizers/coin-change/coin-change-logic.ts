
import type { DPAlgorithmStep } from '@/types';

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
    auxiliaryData: {...auxData, problemType, infinityVal: INFINITY_REPRESENTATION },
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
    addStep(localSteps, lm.funcDeclare, dp, problemType, `Solving Min Coins for amount ${amount} with coins [${coins.join(', ')}].`);
    addStep(localSteps, lm.initDPTable, dp, problemType, `DP table (size ${amount+1}) initialized to Infinity.`);
    dp[0] = 0;
    addStep(localSteps, lm.setBaseCase, dp, problemType, "Base case: dp[0] = 0 (0 coins for amount 0).", 0, undefined, [{col:0, type:'current'}]);

    for (let i = 1; i <= amount; i++) {
      addStep(localSteps, lm.outerLoopAmount, dp, problemType, `Calculating min coins for amount i = ${i}.`, i, undefined, [{col:i, type:'current'}]);
      for (const coin of coins) {
        addStep(localSteps, lm.innerLoopCoins, dp, problemType, `  Considering coin = ${coin}.`, i, coin, [{col:i, type:'current'}]);
        if (coin <= i && dp[i - coin] !== INFINITY_REPRESENTATION) {
          let calcMsg = `  Coin ${coin} <= amount ${i}. dp[${i-coin}] (${dp[i-coin] === INFINITY_REPRESENTATION ? '∞' : dp[i-coin]}) + 1`;
          const potentialNewMin = dp[i-coin] + 1;
          addStep(localSteps, lm.checkCoinCondition, dp, problemType, calcMsg, i, coin, [{col:i, type:'current'}, {col: i-coin, type:'dependency'}]);
          if (potentialNewMin < dp[i]) {
            dp[i] = potentialNewMin;
            calcMsg += ` = ${dp[i]}. This is < current dp[${i}] (∞ or previous value). Update dp[${i}] = ${dp[i]}.`;
          } else {
            calcMsg += ` = ${potentialNewMin}. This is NOT < current dp[${i}] (${dp[i] === INFINITY_REPRESENTATION ? '∞' : dp[i]}). No update.`;
          }
          addStep(localSteps, lm.updateDPMin, dp, problemType, calcMsg, i, coin, [{col:i, type:'current'}, {col: i-coin, type:'dependency'}], {currentCalculation: calcMsg});
        } else {
          addStep(localSteps, lm.checkCoinCondition, dp, problemType, `  Coin ${coin} > amount ${i} OR dp[${i-coin}] is Infinity. Cannot use this coin.`, i, coin, [{col:i, type:'current'}, {col: i-coin, type:'dependency'}]);
        }
      }
      addStep(localSteps, lm.endOuterLoop, dp, problemType, `Finished calculations for amount i = ${i}. dp[${i}] = ${dp[i] === INFINITY_REPRESENTATION ? '∞' : dp[i]}.`, i, undefined, [{col:i, type:'result'}]);
    }
    const result = dp[amount] === INFINITY_REPRESENTATION ? -1 : dp[amount];
    addStep(localSteps, lm.returnResult, dp, problemType, `Min coins for amount ${amount}: ${result === -1 ? 'Not Possible' : result}.`, undefined, undefined, [{col:amount, type:'result'}], {resultValue: result});

  } else { // numWays
    dp = Array(amount + 1).fill(0);
    addStep(localSteps, lm.funcDeclare, dp, problemType, `Solving Number of Ways for amount ${amount} with coins [${coins.join(', ')}].`);
    addStep(localSteps, lm.initDPTable, dp, problemType, `DP table (size ${amount+1}) initialized to 0.`);
    dp[0] = 1;
    addStep(localSteps, lm.setBaseCase, dp, problemType, "Base case: dp[0] = 1 (1 way for amount 0 - use no coins).", 0, undefined, [{col:0, type:'current'}]);

    for (const coin of coins) {
      addStep(localSteps, lm.outerLoopCoins, dp, problemType, `Considering coin = ${coin}.`, undefined, coin);
      for (let i = coin; i <= amount; i++) {
        let calcMsg = `  Amount i = ${i}. Add ways from dp[${i-coin}] (${dp[i-coin]}) to current dp[${i}] (${dp[i]}).`;
        addStep(localSteps, lm.innerLoopAmount, dp, problemType, calcMsg, i, coin, [{col:i, type:'current'}, {col:i-coin, type:'dependency'}]);
        dp[i] += dp[i - coin];
        calcMsg += ` New dp[${i}] = ${dp[i]}.`;
        addStep(localSteps, lm.updateDPWays, dp, problemType, calcMsg, i, coin, [{col:i, type:'current'}, {col:i-coin, type:'dependency'}], {currentCalculation: `dp[${i}] = ${dp[i]-dp[i-coin]} + dp[${i-coin}] = ${dp[i]}`});
      }
      addStep(localSteps, lm.endOuterLoop, dp, problemType, `Finished processing coin ${coin}.`);
    }
    const result = dp[amount];
    addStep(localSteps, lm.returnResult, dp, problemType, `Number of ways for amount ${amount}: ${result}.`, undefined, undefined, [{col:amount, type:'result'}], {resultValue: result});
  }
  
  addStep(localSteps, lm.funcEnd, dp, problemType, "Algorithm complete.");
  return localSteps;
};


    