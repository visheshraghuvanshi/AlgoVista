
import type { AlgorithmStep } from '@/types';

// Specific step type for Tower of Hanoi
export interface TowerOfHanoiStep extends AlgorithmStep {
  pegStates: { [key: string]: number[] }; // e.g., { A: [3,2,1], B: [], C: [] }
  lastMove?: { disk: number; fromPeg: string; toPeg: string };
  numDisks: number;
}

export const TOWER_OF_HANOI_LINE_MAP = {
  funcDeclare: 1,
  baseCaseN1: 2,
  logMoveN1: 3, // console.log for base case move
  returnBase: 4,
  recursiveCall1: 5, // Move n-1 from source to auxiliary
  logMoveN: 6,       // Move nth disk from source to target
  recursiveCall2: 7, // Move n-1 from auxiliary to target
  funcEnd: 8,        // End of main recursive function (conceptual)
};

let stepCounter = 0;

function addStep(
  steps: TowerOfHanoiStep[],
  numDisksGlobal: number,
  currentPegStates: { [key: string]: number[] },
  line: number | null,
  message: string,
  move?: { disk: number; fromPeg: string; toPeg: string }
) {
  // Deep clone pegStates to avoid mutation issues across steps
  const clonedPegStates: { [key: string]: number[] } = {};
  for (const peg in currentPegStates) {
    clonedPegStates[peg] = [...currentPegStates[peg]];
  }

  steps.push({
    // Standard AlgorithmStep fields (array is not directly used here)
    array: [], // Not applicable for Tower of Hanoi in this way
    activeIndices: move ? [move.disk] : [], // Highlight the disk being moved
    swappingIndices: [],
    sortedIndices: [], // Not applicable
    // TowerOfHanoiStep specific fields
    pegStates: clonedPegStates,
    lastMove: move,
    numDisks: numDisksGlobal,
    currentLine: line,
    message: message || (move ? `Move disk ${move.disk} from ${move.fromPeg} to ${move.toPeg}` : "Step"),
  });
  stepCounter++;
}

export const generateTowerOfHanoiSteps = (
  numDisks: number,
  source: string = 'A',
  auxiliary: string = 'B',
  target: string = 'C'
): TowerOfHanoiStep[] => {
  const localSteps: TowerOfHanoiStep[] = [];
  stepCounter = 0;

  const pegs: { [key: string]: number[] } = { A: [], B: [], C: [] };
  pegs[source] = Array.from({ length: numDisks }, (_, i) => numDisks - i); // Initialize source peg

  addStep(localSteps, numDisks, pegs, null, `Initial state: ${numDisks} disks on peg ${source}.`);

  function hanoiRecursive(
    n: number,
    currentSource: string,
    currentAuxiliary: string,
    currentTarget: string
  ) {
    addStep(localSteps, numDisks, pegs, TOWER_OF_HANOI_LINE_MAP.funcDeclare, `hanoi(${n}, ${currentSource}, ${currentAuxiliary}, ${currentTarget})`);
    if (n === 1) {
      addStep(localSteps, numDisks, pegs, TOWER_OF_HANOI_LINE_MAP.baseCaseN1, `Base case: n=1. Moving disk 1.`);
      const diskToMove = pegs[currentSource].pop()!;
      pegs[currentTarget].push(diskToMove);
      addStep(localSteps, numDisks, pegs, TOWER_OF_HANOI_LINE_MAP.logMoveN1, `Move disk 1 from ${currentSource} to ${currentTarget}.`, { disk: 1, fromPeg: currentSource, toPeg: currentTarget });
      addStep(localSteps, numDisks, pegs, TOWER_OF_HANOI_LINE_MAP.returnBase, `Return from hanoi(1, ...).`);
      return;
    }

    addStep(localSteps, numDisks, pegs, TOWER_OF_HANOI_LINE_MAP.recursiveCall1, `Recursive call: Move ${n-1} disks from ${currentSource} to ${currentAuxiliary} using ${currentTarget}.`);
    hanoiRecursive(n - 1, currentSource, currentTarget, currentAuxiliary);
    
    addStep(localSteps, numDisks, pegs, TOWER_OF_HANOI_LINE_MAP.logMoveN1 -1, `Returned from moving ${n-1} disks to auxiliary peg ${currentAuxiliary}.`);


    const diskN = pegs[currentSource].pop()!;
    pegs[currentTarget].push(diskN);
    addStep(localSteps, numDisks, pegs, TOWER_OF_HANOI_LINE_MAP.logMoveN, `Move disk ${n} (value: ${diskN}) from ${currentSource} to ${currentTarget}.`, { disk: n, fromPeg: currentSource, toPeg: currentTarget });

    addStep(localSteps, numDisks, pegs, TOWER_OF_HANOI_LINE_MAP.recursiveCall2, `Recursive call: Move ${n-1} disks from ${currentAuxiliary} to ${currentTarget} using ${currentSource}.`);
    hanoiRecursive(n - 1, currentAuxiliary, currentSource, currentTarget);
    addStep(localSteps, numDisks, pegs, TOWER_OF_HANOI_LINE_MAP.logMoveN1-1, `Returned from moving ${n-1} disks to target peg ${currentTarget}.`);
    addStep(localSteps, numDisks, pegs, TOWER_OF_HANOI_LINE_MAP.funcEnd, `End hanoi(${n}, ...).`);
  }

  hanoiRecursive(numDisks, source, auxiliary, target);
  addStep(localSteps, numDisks, pegs, null, `Tower of Hanoi complete. All ${numDisks} disks moved to peg ${target}.`);
  return localSteps;
};

