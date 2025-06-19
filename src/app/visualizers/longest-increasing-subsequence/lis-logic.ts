
import type { DPAlgorithmStep } from './types'; // Local import

export const LIS_LINE_MAP_N2 = {
  funcDeclare: 1,
  handleEmpty: 2,
  initDpArray: 3,
  initMaxLength: 4,
  outerLoopI: 5,
  innerLoopJ: 6,
  checkCondition: 7,
  updateDpI: 8,
  updateMaxLength: 9,
  returnMaxLength: 10,
  funcEnd: 11,
};

const addStep = (
  localSteps: DPAlgorithmStep[],
  line: number | null,
  inputArray: number[],
  dpTableState: number[],
  message: string,
  currentI?: number,
  currentJ?: number,
  maxLength?: number
) => {
  const highlighted: DPAlgorithmStep['highlightedCells'] = [];
  if (currentI !== undefined) highlighted.push({ row: 0, col: currentI, type: 'current' }); // Use col for 1D index
  if (currentJ !== undefined) highlighted.push({ row: 0, col: currentJ, type: 'dependency' });

  localSteps.push({
    dpTable: [...dpTableState], // This will be the 1D dp array
    dpTableDimensions: { rows: 1, cols: dpTableState.length },
    currentIndices: { i: currentI, j: currentJ },
    highlightedCells: highlighted,
    message,
    currentLine: line,
    auxiliaryData: { inputArray: [...inputArray], maxLength: maxLength === -Infinity ? "-∞" : maxLength },
    resultValue: maxLength === -Infinity ? undefined : maxLength, // Final result is maxLength
  });
};

export const generateLIS_N2_Steps = (nums: number[]): DPAlgorithmStep[] => {
  const localSteps: DPAlgorithmStep[] = [];
  const n = nums.length;
  const lm = LIS_LINE_MAP_N2;

  addStep(localSteps, lm.funcDeclare, nums, [], `Finding Longest Increasing Subsequence for [${nums.join(', ')}].`);

  if (n === 0) {
    addStep(localSteps, lm.handleEmpty, nums, [], "Array is empty. LIS length is 0.", undefined, undefined, 0);
    addStep(localSteps, lm.funcEnd, nums, [], "Algorithm complete.", undefined, undefined, 0);
    return localSteps;
  }

  // dp[i] will store the length of the LIS ending at index i
  const dp: number[] = new Array(n).fill(1);
  addStep(localSteps, lm.initDpArray, nums, dp, `Initialize dp array of size ${n} with all 1s.`);

  let maxLength = 1;
  addStep(localSteps, lm.initMaxLength, nums, dp, `Initialize maxLength = 1.`, undefined, undefined, maxLength);

  for (let i = 0; i < n; i++) { 
    addStep(localSteps, lm.outerLoopI, nums, dp, `Outer loop: i = ${i}. Processing nums[${i}] = ${nums[i]}.`, i, undefined, maxLength);
    for (let j = 0; j < i; j++) {
      addStep(localSteps, lm.innerLoopJ, nums, dp, `  Inner loop: j = ${j}. Checking nums[${j}] = ${nums[j]}.`, i, j, maxLength);
      addStep(localSteps, lm.checkCondition, nums, dp, `  Is nums[${i}] (${nums[i]}) > nums[${j}] (${nums[j]})?`, i, j, maxLength);
      if (nums[i] > nums[j]) {
        const potentialDpI = dp[j] + 1;
        addStep(localSteps, lm.checkCondition, nums, dp, `  Yes. Is dp[${i}] (${dp[i]}) < dp[${j}] (${dp[j]}) + 1 (${potentialDpI})?`, i, j, maxLength);
        if (dp[i] < potentialDpI) {
          dp[i] = potentialDpI;
          addStep(localSteps, lm.updateDpI, nums, dp, `    Update dp[${i}] = ${dp[i]}.`, i, j, maxLength);
        } else {
            addStep(localSteps, lm.updateDpI, nums, dp, `    No update to dp[${i}].`, i, j, maxLength);
        }
      } else {
         addStep(localSteps, lm.checkCondition, nums, dp, `  No. Condition nums[${i}] > nums[${j}] is false.`, i, j, maxLength);
      }
    }
    addStep(localSteps, lm.updateMaxLength, nums, dp, `  Check if new maxLength: Math.max(${maxLength}, dp[${i}]=${dp[i]})`, i, undefined, maxLength);
    if (dp[i] > maxLength) {
      maxLength = dp[i];
      addStep(localSteps, lm.updateMaxLength, nums, dp, `  maxLength updated to ${maxLength}.`, i, undefined, maxLength);
    }
  }
  addStep(localSteps, lm.returnMaxLength, nums, dp, `LIS calculation complete. Max length is ${maxLength}.`, undefined, undefined, maxLength);
  addStep(localSteps, lm.funcEnd, nums, dp, "Algorithm complete.", undefined, undefined, maxLength);
  return localSteps;
};
    
