// src/app/visualizers/euclidean-gcd/euclidean-gcd-logic.ts
import type { AlgorithmStep } from '@/types'; // Use global for now
import type { EuclideanGcdStep } from './types'; // Local, more specific type

export const EUCLIDEAN_GCD_LINE_MAP = {
  funcDeclare: 1,       
  whileLoop: 2,         
  storeTemp: 3,         
  calculateRemainder: 4,
  updateA: 5,           
  whileLoopEnd: 6,      
  returnA: 7,           
  funcEnd: 8,           
};

export const generateEuclideanGcdSteps = (initialA: number, initialB: number): EuclideanGcdStep[] => {
  const localSteps: EuclideanGcdStep[] = [];
  const lm = EUCLIDEAN_GCD_LINE_MAP;

  let a = Math.abs(initialA); 
  let b = Math.abs(initialB);

  if (b > a) { 
    [a, b] = [b, a];
  }
  
  const originalA = a; 
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
      array: [], 
      activeIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      currentLine: line,
      message: message, 
      auxiliaryData: {
        a: currentA,
        b: currentB,
        remainder: remainderVal,
        equation: equation,
        gcd: gcdVal,
        message: message, 
      },
    });
  };

  addStep(lm.funcDeclare, a, b, `Starting Euclidean Algorithm for GCD(${originalA}, ${originalB}). Initial a=${a}, b=${b}.`);

  if (b === 0) { 
    addStep(lm.whileLoop, a, b, `Initial b is 0.`);
    addStep(lm.returnA, a, b, `GCD is a = ${a}.`, undefined, undefined, a);
    addStep(lm.funcEnd, a, b, `Algorithm finished. GCD(${originalA}, ${originalB}) = ${a}.`);
    return localSteps;
  }

  let iteration = 0;
  const maxIterations = 100; 

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
