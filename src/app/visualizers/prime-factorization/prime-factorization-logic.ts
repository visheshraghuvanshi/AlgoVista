
import type { AlgorithmStep } from '@/types';

export const PRIME_FACTORIZATION_LINE_MAP = {
  funcDeclare: 1,
  initFactorsArray: 2,
  whileDivisibleBy2: 3,
  add2ToFactors: 4,
  divideBy2: 5,
  loopForOddDivisors: 6,
  whileDivisibleByI: 7,
  addIToFactors: 8,
  divideByI: 9,
  checkRemainingN: 10,
  addRemainingNToFactors: 11,
  returnFactors: 12,
};

// Specific step type for Prime Factorization
export interface PrimeFactorizationStep extends AlgorithmStep {
  auxiliaryData: {
    originalN: number;
    currentN: number;
    currentDivisor: number | null;
    factors: number[];
    message: string;
  };
}

export const generatePrimeFactorizationSteps = (num: number): PrimeFactorizationStep[] => {
  const localSteps: PrimeFactorizationStep[] = [];
  const lm = PRIME_FACTORIZATION_LINE_MAP;
  let currentN = num;
  const factors: number[] = [];

  const addStep = (
    line: number | null,
    divisor: number | null,
    message: string
  ) => {
    localSteps.push({
      array: [], // Not directly visualized as an array
      activeIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      currentLine: line,
      message: message,
      auxiliaryData: {
        originalN: num,
        currentN: currentN,
        currentDivisor: divisor,
        factors: [...factors],
        message: message,
      },
    });
  };

  if (num <= 1) {
    addStep(null, null, `${num} has no prime factors (or is 1).`);
    return localSteps;
  }
  
  addStep(lm.funcDeclare, null, `Starting Prime Factorization for ${num}.`);
  addStep(lm.initFactorsArray, null, `Initialize factors list as empty.`);

  addStep(lm.whileDivisibleBy2, 2, `Check divisibility by 2. n = ${currentN}.`);
  while (currentN % 2 === 0) {
    factors.push(2);
    addStep(lm.add2ToFactors, 2, `Found factor 2. Factors: [${factors.join(', ')}].`);
    currentN /= 2;
    addStep(lm.divideBy2, 2, `Divide n by 2. n is now ${currentN}.`);
    addStep(lm.whileDivisibleBy2, 2, `Check divisibility by 2 again. n = ${currentN}.`);
  }
   addStep(lm.whileDivisibleBy2, 2, `n (${currentN}) is no longer divisible by 2.`);


  addStep(lm.loopForOddDivisors, 3, `Checking odd divisors from 3 up to sqrt(n). Current n = ${currentN}.`);
  for (let i = 3; i * i <= currentN; i += 2) {
    addStep(lm.loopForOddDivisors, i, `Current divisor i = ${i}. Check divisibility. n = ${currentN}.`);
    addStep(lm.whileDivisibleByI, i, `Check divisibility by ${i}.`);
    while (currentN % i === 0) {
      factors.push(i);
      addStep(lm.addIToFactors, i, `Found factor ${i}. Factors: [${factors.join(', ')}].`);
      currentN /= i;
      addStep(lm.divideByI, i, `Divide n by ${i}. n is now ${currentN}.`);
      addStep(lm.whileDivisibleByI, i, `Check divisibility by ${i} again.`);
    }
    addStep(lm.whileDivisibleByI, i, `n (${currentN}) is no longer divisible by ${i}.`);
  }
   addStep(lm.loopForOddDivisors, null, `Finished checking odd divisors up to sqrt(n). Current n = ${currentN}.`);

  addStep(lm.checkRemainingN, null, `Check if remaining n (${currentN}) > 2.`);
  if (currentN > 2) {
    factors.push(currentN);
    addStep(lm.addRemainingNToFactors, currentN, `Remaining n (${currentN}) is a prime factor. Factors: [${factors.join(', ')}].`);
  }

  addStep(lm.returnFactors, null, `Prime factorization complete. Factors: [${factors.join(', ')}].`);
  return localSteps;
};
