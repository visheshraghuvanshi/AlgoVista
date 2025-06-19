// src/app/visualizers/tower-of-hanoi/tower-of-hanoi-logic.ts
import type { AlgorithmStep } from '@/types'; // Use global for now
import type { TowerOfHanoiStep } from './types'; // Local, more specific type

export const TOWER_OF_HANOI_LINE_MAP = {
  funcDeclare: 1,
  baseCaseN1: 2,
  logMoveN1: 3, 
  returnBase: 4,
  recursiveCall1: 5, 
  logMoveN: 6,       
  recursiveCall2: 7, 
  funcEnd: 8,        
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
  const clonedPegStates: { [key: string]: number[] } = {};
  for (const peg in currentPegStates) {
    clonedPegStates[peg] = [...currentPegStates[peg]];
  }

  steps.push({
    array: [], 
    activeIndices: move ? [move.disk] : [], 
    swappingIndices: [],
    sortedIndices: [], 
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
  pegs[source] = Array.from({ length: numDisks }, (_, i) => numDisks - i); 

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
