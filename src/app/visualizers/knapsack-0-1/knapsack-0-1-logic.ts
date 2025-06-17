
import type { DPAlgorithmStep } from '@/types';

export const KNAPSACK_LINE_MAP = {
  funcDeclare: 1,
  getN: 2,
  initDPTable: 3,
  outerLoopItems: 4, // for (let i = 1...)
  innerLoopCapacity: 5, // for (let w = 1...)
  checkWeightCondition: 6, // if (weights[i-1] <= w)
  calcWithItem: 7, // dp[i][w] = Math.max(...)
  calcWithoutItem: 8, // else dp[i][w] = dp[i-1][w]
  endInnerLoop: 9, // Conceptual end of w loop
  endOuterLoop: 10, // Conceptual end of i loop
  returnResult: 11,
  funcEnd: 12,
};

interface KnapsackItem { weight: number; value: number; }

const addStep = (
  localSteps: DPAlgorithmStep[],
  line: number | null,
  dpTableState: number[][],
  numItems: number,
  capacity: number,
  message: string,
  currentItemIndex?: number, // 1-based index for item
  currentCapacityVal?: number,
  highlighted?: {row: number, col: number, type: 'current' | 'dependency' | 'result'}[],
  auxData?: Record<string, any>
) => {
  localSteps.push({
    dpTable: dpTableState.map(row => [...row]),
    dpTableDimensions: { rows: numItems + 1, cols: capacity + 1 },
    currentIndices: { item: currentItemIndex, capacity: currentCapacityVal },
    highlightedCells: highlighted,
    message,
    currentLine: line,
    auxiliaryData: auxData,
  });
};

export const generateKnapsack01Steps = (
  items: KnapsackItem[],
  capacity: number
): DPAlgorithmStep[] => {
  const localSteps: DPAlgorithmStep[] = [];
  const n = items.length;
  const lm = KNAPSACK_LINE_MAP;

  // dp[i][w] will be the max value using first i items with capacity w
  // Dimensions: (n+1) x (capacity+1)
  const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  addStep(localSteps, lm.funcDeclare, dp, n, capacity, `Initializing 0/1 Knapsack. Items: ${n}, Capacity: ${capacity}.`, undefined, undefined, undefined, {items});
  addStep(localSteps, lm.initDPTable, dp, n, capacity, "DP table initialized with 0s (base cases).");

  for (let i = 1; i <= n; i++) {
    const currentItem = items[i - 1]; // 0-indexed item
    addStep(localSteps, lm.outerLoopItems, dp, n, capacity, `Processing Item ${i} (weight: ${currentItem.weight}, value: ${currentItem.value}).`, i, undefined, [{row:i, col:0, type:'current'}], {items});
    for (let w = 1; w <= capacity; w++) {
      let decision = "";
      let highlightedDeps: {row: number, col: number, type: 'dependency'}[] = [];

      addStep(localSteps, lm.innerLoopCapacity, dp, n, capacity, `  Capacity w = ${w}.`, i, w, [{row:i, col:w, type:'current'}], {items});
      
      addStep(localSteps, lm.checkWeightCondition, dp, n, capacity, `  Item ${i} weight (${currentItem.weight}) <= current capacity w (${w})?`, i, w, [{row:i, col:w, type:'current'}], {items});
      if (currentItem.weight <= w) {
        const valueWithItem = currentItem.value + dp[i - 1][w - currentItem.weight];
        const valueWithoutItem = dp[i - 1][w];
        highlightedDeps.push({row:i-1, col:w-currentItem.weight, type:'dependency'});
        highlightedDeps.push({row:i-1, col:w, type:'dependency'});

        addStep(localSteps, lm.calcWithItem, dp, n, capacity, 
          `  Yes. Max between: 
             1. Including item ${i} (value ${currentItem.value} + dp[${i-1}][${w-currentItem.weight}] = ${valueWithItem})
             2. Excluding item ${i} (dp[${i-1}][${w}] = ${valueWithoutItem})`,
          i, w, [{row:i, col:w, type:'current'}, ...highlightedDeps], {items, valWith: valueWithItem, valWithout: valueWithoutItem}
        );
        
        if (valueWithItem > valueWithoutItem) {
          dp[i][w] = valueWithItem;
          decision = `Included Item ${i}. dp[${i}][${w}] = ${dp[i][w]}.`;
        } else {
          dp[i][w] = valueWithoutItem;
          decision = `Excluded Item ${i}. dp[${i}][${w}] = ${dp[i][w]}.`;
        }
      } else {
        highlightedDeps.push({row:i-1, col:w, type:'dependency'});
        addStep(localSteps, lm.calcWithoutItem, dp, n, capacity, `  No. Item ${i} weight (${currentItem.weight}) > w (${w}). Cannot include.`, i, w, [{row:i, col:w, type:'current'}, ...highlightedDeps], {items});
        dp[i][w] = dp[i - 1][w];
        decision = `Cannot include Item ${i}. dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}.`;
      }
      addStep(localSteps, lm.calcWithItem, dp, n, capacity, `  ${decision}`, i, w, [{row:i, col:w, type:'result'}, ...highlightedDeps], {items, currentDecision: decision});
    }
    addStep(localSteps, lm.endOuterLoop, dp, n, capacity, `Finished processing Item ${i}.`, i, undefined, undefined, {items});
  }
  
  const maxValue = dp[n][capacity];
  addStep(localSteps, lm.returnResult, dp, n, capacity, `Knapsack solved. Maximum value: ${maxValue}.`, undefined, undefined, [{row:n, col:capacity, type:'result'}], {items, resultValue: maxValue});
  
  // Reconstruct selected items
  let w = capacity;
  const selected: KnapsackItem[] = [];
  for(let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i-1][w]) { // Item i was included
          selected.unshift(items[i-1]);
          w -= items[i-1].weight;
      }
  }
  addStep(localSteps, lm.funcEnd, dp, n, capacity, `Selected items for max value: ${selected.map(it => `(w:${it.weight},v:${it.value})`).join(', ') || 'None'}.`, undefined, undefined, undefined, {items, resultValue: maxValue, selectedItems: selected});

  return localSteps;
};


    