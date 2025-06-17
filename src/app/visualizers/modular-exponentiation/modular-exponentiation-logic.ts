
import type { AlgorithmStep } from '@/types'; // Using generic AlgorithmStep, auxiliaryData will hold state

export const MODULAR_EXP_LINE_MAP = {
  funcDeclare: 1,
  initResult: 2,
  baseModModulus: 3,
  whileExponentPositive: 4,
  ifExponentOdd: 5,
  updateResult: 6,
  updateExponent: 7,
  updateBase: 8,
  returnResult: 9,
  funcEnd: 10,
};

export interface ModularExponentiationStep extends AlgorithmStep {
  auxiliaryData: {
    base: number;
    exponent: number;
    modulus: number;
    result: number;
    currentOperationDescription?: string; // e.g., "Exponent is odd, update result"
  };
}

export const generateModularExponentiationSteps = (
  initialBase: number,
  initialExponent: number,
  modulus: number
): ModularExponentiationStep[] => {
  const localSteps: ModularExponentiationStep[] = [];
  const lm = MODULAR_EXP_LINE_MAP;

  const addStep = (
    line: number | null,
    baseVal: number,
    expVal: number,
    resVal: number,
    message: string,
    opDesc?: string
  ) => {
    localSteps.push({
      array: [], // Not used for this visualization
      activeIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      currentLine: line,
      message: message,
      auxiliaryData: {
        base: baseVal,
        exponent: expVal,
        modulus: modulus,
        result: resVal,
        currentOperationDescription: opDesc,
      },
    });
  };

  if (modulus <= 0) {
      addStep(null, initialBase, initialExponent, 0, "Modulus must be positive.", "Error");
      return localSteps;
  }
  if (initialExponent < 0) {
       addStep(null, initialBase, initialExponent, 0, "Exponent must be non-negative for this implementation.", "Error");
      return localSteps;
  }


  addStep(lm.funcDeclare, initialBase, initialExponent, 0, `Modular Exponentiation: (${initialBase}^${initialExponent}) % ${modulus}`);

  let result = 1;
  addStep(lm.initResult, initialBase, initialExponent, result, `Initialize result = 1.`);

  let base = initialBase % modulus;
  addStep(lm.baseModModulus, base, initialExponent, result, `Reduce base: ${initialBase} % ${modulus} = ${base}.`);
  if (base < 0) base += modulus; // Ensure base is positive if initialBase % modulus is negative

  let exponent = initialExponent;

  addStep(lm.whileExponentPositive, base, exponent, result, `Loop while exponent (${exponent}) > 0.`);
  while (exponent > 0) {
    addStep(lm.ifExponentOdd, base, exponent, result, `Is exponent (${exponent}) odd?`);
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
      if (result < 0) result += modulus; // Ensure result is positive
      addStep(lm.updateResult, base, exponent, result, `Yes. Update result = (result * base) % modulus = ${result}.`, `result = (${localSteps[localSteps.length-2].auxiliaryData.result} * ${base}) % ${modulus}`);
    } else {
      addStep(lm.ifExponentOdd, base, exponent, result, `No. Exponent is even.`, `exponent % 2 !== 1`);
    }

    exponent = Math.floor(exponent / 2);
    addStep(lm.updateExponent, base, exponent, result, `Update exponent = floor(exponent / 2) = ${exponent}.`, `exponent = floor(${localSteps[localSteps.length-1].auxiliaryData.exponent} / 2)`);
    
    if (exponent > 0) { // Only update base if exponent is still > 0 for next iteration
        const oldBase = base;
        base = (base * base) % modulus;
        if (base < 0) base += modulus; // Ensure base is positive
        addStep(lm.updateBase, base, exponent, result, `Update base = (base * base) % modulus = ${base}.`, `base = (${oldBase} * ${oldBase}) % ${modulus}`);
    } else {
        addStep(lm.updateBase, base, exponent, result, `Exponent is 0, base update not needed for next loop iteration.`);
    }
     addStep(lm.whileExponentPositive, base, exponent, result, `Loop condition: exponent (${exponent}) > 0?`);
  }
  
  addStep(lm.returnResult, base, exponent, result, `Exponent is 0. Loop ends. Final result: ${result}.`);
  addStep(lm.funcEnd, base, exponent, result, "Algorithm complete.");
  return localSteps;
};
    
