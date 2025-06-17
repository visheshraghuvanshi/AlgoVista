
import type { AlgorithmStep } from '@/types';

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

// Modified AlgorithmStep to better suit Sieve's needs
export interface SieveAlgorithmStep extends AlgorithmStep {
  // 'array' will represent the boolean prime markings:
  // 0: not prime (initially or marked composite)
  // 1: prime (initially)
  // 2: current prime `p` being processed
  // 3: current multiple `i` being marked
  auxiliaryData?: {
    limitN: number;
    currentP?: number;
    currentMultiple?: number;
    primesFound?: number[];
    message?: string;
  };
}


export const generateSieveSteps = (limitN: number): SieveAlgorithmStep[] => {
  const localSteps: SieveAlgorithmStep[] = [];
  const lm = SIEVE_LINE_MAP;

  const addStep = (
    line: number | null,
    currentIsPrimeArray: number[], // 0=composite/uninit, 1=prime, 2=current P, 3=current multiple
    message: string,
    currentPVal?: number,
    currentMultipleVal?: number,
    primesList?: number[],
  ) => {
    localSteps.push({
      array: [...currentIsPrimeArray], // This represents the sieve itself for visualization
      activeIndices: [], // Can highlight P and currentMultiple in the vis panel based on auxData
      swappingIndices: [],
      sortedIndices: [], // Not directly applicable
      currentLine: line,
      message: message,
      auxiliaryData: {
        limitN: limitN,
        currentP: currentPVal,
        currentMultiple: currentMultipleVal,
        primesFound: primesList ? [...primesList] : undefined,
        message: message,
      },
    });
  };

  if (limitN < 2) {
    addStep(null, [], "Limit must be at least 2 to find primes.", undefined, undefined, []);
    return localSteps;
  }

  // Represents isPrime: 0 = false (not prime/marked), 1 = true (potentially prime)
  // For visualization, we'll use this array directly
  let SieveArrayRepresentation = new Array(limitN + 1).fill(1); 
  SieveArrayRepresentation[0] = 0;
  SieveArrayRepresentation[1] = 0;

  addStep(lm.funcDeclare, [...SieveArrayRepresentation], `Sieve for n = ${limitN}. Initialize all true.`);
  addStep(lm.initPrimeArray, [...SieveArrayRepresentation], `Boolean array 'prime' created size ${limitN + 1}.`);
  addStep(lm.mark01NotPrime, [...SieveArrayRepresentation], `Mark 0 and 1 as not prime.`);

  for (let p = 2; p * p <= limitN; p++) {
    const stepP = p; // Capture p for this iteration
    SieveArrayRepresentation = SieveArrayRepresentation.map((val, idx) => idx === stepP ? 2 : (val === 2 ? 1 : val) ); // Mark p, reset old p
    addStep(lm.outerLoopP, [...SieveArrayRepresentation], `Outer loop: p = ${stepP}. Check if prime[${stepP}] is true.`, stepP);
    
    if (SieveArrayRepresentation[stepP] === 2 || (stepP > 2 && SieveArrayRepresentation[stepP] === 1) ) { // Check if SieveArrayRepresentation[p] is prime (1 or 2 if current p)
      addStep(lm.checkIfPrimeP, [...SieveArrayRepresentation], `${stepP} is prime. Mark its multiples.`, stepP);
      SieveArrayRepresentation = SieveArrayRepresentation.map((val, idx) => idx === stepP ? 1 : val); // Reset p to prime after check
      
      for (let i = p * p; i <= limitN; i += p) {
        SieveArrayRepresentation = SieveArrayRepresentation.map((val, idx) => idx === stepP ? 2 : (idx === i ? 3 : (val === 2 || val === 3 ? 1 : val)) ); // Mark p and multiple
        addStep(lm.innerLoopMarkMultiples, [...SieveArrayRepresentation], `Marking multiple: ${i} of ${stepP}.`, stepP, i);
        SieveArrayRepresentation[i] = 0; // Mark as composite
        addStep(lm.markComposite, [...SieveArrayRepresentation], `Marked ${i} as not prime.`, stepP, i);
      }
      SieveArrayRepresentation = SieveArrayRepresentation.map(val => (val===2 || val===3) ? 1 : val); // Clear temporary visual markers for p and i
      addStep(lm.innerLoopMarkMultiples, [...SieveArrayRepresentation], `Finished marking multiples of ${stepP}.`, stepP);
    } else {
       SieveArrayRepresentation = SieveArrayRepresentation.map((val, idx) => idx === stepP ? 0 : (val === 2 ? 1 : val) ); // Mark p as not prime if it was skipped, reset old p
       addStep(lm.checkIfPrimeP, [...SieveArrayRepresentation], `${stepP} is not prime (already marked). Skip.`, stepP);
    }
  }
   SieveArrayRepresentation = SieveArrayRepresentation.map(val => (val===2 || val===3) ? 1 : val); // Clear any remaining visual markers
   addStep(lm.outerLoopP, [...SieveArrayRepresentation], `Outer loop finished.`);

  const primesFound: number[] = [];
  addStep(lm.collectPrimesLoop, [...SieveArrayRepresentation], `Collecting prime numbers...`, undefined, undefined, primesFound);
  for (let p = 2; p <= limitN; p++) {
    if (SieveArrayRepresentation[p] === 1) {
      primesFound.push(p);
      addStep(lm.checkAndAddPrime, [...SieveArrayRepresentation], `${p} is prime. Added to list. Primes: [${primesFound.join(', ')}]`, undefined, undefined, primesFound);
    }
  }
  addStep(lm.returnPrimes, [...SieveArrayRepresentation], `Sieve complete. Primes found: ${primesFound.length}.`, undefined, undefined, primesFound);
  return localSteps;
};
