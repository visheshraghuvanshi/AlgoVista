
import type { AlgorithmStep } from '@/types';

export interface EuclideanGcdStep extends AlgorithmStep {
  auxiliaryData?: {
    a: number;
    b: number;
    remainder?: number;
    equation?: string; // e.g., "a = q*b + r"
    gcd?: number;
    message?: string; // Specific message for this step in aux display
  };
}

export const EUCLIDEAN_GCD_LINE_MAP = {
  funcDeclare: 1,       // function gcdIterative(a, b) {
  whileLoop: 2,         //   while (b !== 0) {
  storeTemp: 3,         //     let temp = b;
  calculateRemainder: 4,//     b = a % b;
  updateA: 5,           //     a = temp;
  whileLoopEnd: 6,      //   }
  returnA: 7,           //   return a;
  funcEnd: 8,           // }
};

export const generateEuclideanGcdSteps = (initialA: number, initialB: number): EuclideanGcdStep[] => {
  const localSteps: EuclideanGcdStep[] = [];
  const lm = EUCLIDEAN_GCD_LINE_MAP;

  let a = Math.abs(initialA); // Ensure positive values for standard algorithm
  let b = Math.abs(initialB);

  if (b > a) { // Ensure a >= b initially for typical presentation
    [a, b] = [b, a];
  }
  
  const originalA = a; // Keep original for final message
  const originalB = b;

  const addStep = (
    line: number | null,
    currentA: number,
    currentB: number,
    message: string,
    equation?: string,
    remainderVal?: number,
    gcdVal?: number
  ) => {
    localSteps.push({
      array: [], // Not used directly for bar visualization
      activeIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      currentLine: line,
      message: message, // Main step message for code panel sync
      auxiliaryData: {
        a: currentA,
        b: currentB,
        remainder: remainderVal,
        equation: equation,
        gcd: gcdVal,
        message: message, // Also include in aux for panel display consistency
      },
    });
  };

  addStep(lm.funcDeclare, a, b, `Starting Euclidean Algorithm for GCD(${originalA}, ${originalB}). Initial a=${a}, b=${b}.`);

  if (b === 0) { // Handle case where b is initially zero (GCD is a)
    addStep(lm.whileLoop, a, b, `Initial b is 0.`);
    addStep(lm.returnA, a, b, `GCD is a = ${a}.`, undefined, undefined, a);
    addStep(lm.funcEnd, a, b, `Algorithm finished. GCD(${originalA}, ${originalB}) = ${a}.`);
    return localSteps;
  }

  let iteration = 0;
  const maxIterations = 100; // Safety break

  while (b !== 0 && iteration < maxIterations) {
    iteration++;
    addStep(lm.whileLoop, a, b, `Loop: b (${b}) is not 0. Current a=${a}, b=${b}.`);
    
    const tempB = b;
    addStep(lm.storeTemp, a, b, `Store b (${b}) in temp. temp = ${tempB}.`);
    
    const remainder = a % b;
    const quotient = Math.floor(a / b);
    const eqString = `${a} = ${quotient} * ${b} + ${remainder}`;
    addStep(lm.calculateRemainder, a, b, `Calculate remainder: ${a} % ${b} = ${remainder}. Equation: ${eqString}`, eqString, remainder);
    
    a = tempB;
    b = remainder;
    addStep(lm.updateA, a, b, `Update a = temp (${tempB}), b = remainder (${remainder}). New a=${a}, b=${b}.`, eqString, remainder);
  }
  addStep(lm.whileLoopEnd, a, b, `Loop terminated. b is ${b}.`);

  if (iteration >= maxIterations) {
    addStep(null, a, b, "Max iterations reached. Algorithm terminated for safety.");
  } else {
    addStep(lm.returnA, a, b, `GCD is a = ${a}.`, undefined, undefined, a);
  }
  
  addStep(lm.funcEnd, a, b, `Algorithm finished. GCD(${originalA}, ${originalB}) = ${a}.`);
  return localSteps;
};
