
import type { SieveAlgorithmStep } from './types';

export const SIEVE_LINE_MAP = {
  funcDeclare: 1,
  initPrimeArray: 2,
  mark01NotPrime: 3,
  outerLoopP: 4,
  checkIfPrimeP: 5,
  innerLoopMarkMultiples: 6,
  markComposite: 7,
  collectPrimesLoop: 8,
  checkAndAddPrime: 9,
  returnPrimes: 10,
};

const addStep = (
  steps: SieveAlgorithmStep[],
  sieveState: number[], // 0 for composite, 1 for prime, 2 for currentP, 3 for currentMultiple
  line: number | null,
  message: string,
  limitN: number,
  currentPVal?: number,
  currentMultipleVal?: number,
  primesList?: number[]
) => {
  steps.push({
    array: [...sieveState],
    activeIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    currentLine: line,
    message: message,
    auxiliaryData: {
      limitN: limitN,
      currentP: currentPVal,
      currentMultiple: currentMultipleVal,
      primesFound: primesList ? [...primesList] : [],
      message: message,
    },
  });
};

export const generateSieveSteps = (limitN: number): SieveAlgorithmStep[] => {
  const localSteps: SieveAlgorithmStep[] = [];
  const lm = SIEVE_LINE_MAP;

  let isPrime = new Array(limitN + 1).fill(1); // Using numbers for state: 1=true, 0=false
  
  addStep(localSteps, isPrime, lm.funcDeclare, `Starting Sieve for n = ${limitN}.`, limitN);
  
  isPrime[0] = 0;
  isPrime[1] = 0;
  addStep(localSteps, isPrime, lm.mark01NotPrime, "Mark 0 and 1 as not prime.", limitN);

  for (let p = 2; p * p <= limitN; p++) {
    addStep(localSteps, isPrime, lm.outerLoopP, `Outer loop: p = ${p}.`, limitN, p);
    
    if (isPrime[p] === 1) {
      addStep(localSteps, isPrime, lm.checkIfPrimeP, `p=${p} is prime. Marking its multiples starting from p*p.`, limitN, p);
      for (let i = p * p; i <= limitN; i += p) {
        addStep(localSteps, isPrime, lm.innerLoopMarkMultiples, `Marking multiple of ${p}: ${i}.`, limitN, p, i);
        isPrime[i] = 0;
        addStep(localSteps, isPrime, lm.markComposite, `${i} marked as not prime.`, limitN, p, i);
      }
      addStep(localSteps, isPrime, lm.innerLoopMarkMultiples, `Finished marking multiples of ${p}.`, limitN, p);
    } else {
       addStep(localSteps, isPrime, lm.checkIfPrimeP, `p=${p} is already marked as not prime. Skip.`, limitN, p);
    }
  }

  addStep(localSteps, lm.outerLoopP, isPrime, `Finished marking multiples up to sqrt(${limitN}).`, limitN);

  const primesFound: number[] = [];
  addStep(localSteps, isPrime, lm.collectPrimesLoop, "Collecting all remaining marked primes...", limitN, undefined, undefined, primesFound);
  for (let p = 2; p <= limitN; p++) {
    if (isPrime[p] === 1) {
      primesFound.push(p);
      addStep(localSteps, isPrime, lm.checkAndAddPrime, `${p} is prime. Added to list.`, limitN, p, undefined, primesFound);
    }
  }
  addStep(localSteps, isPrime, lm.returnPrimes, `Sieve complete. Found ${primesFound.length} primes.`, limitN, undefined, undefined, primesFound);

  return localSteps;
};
