
import type { AlgorithmStep } from '@/types'; // Use generic AlgorithmStep

// Adjusted StackQueueAlgorithmStep for Deque specific needs if any (can reuse for now)
export interface DequeAlgorithmStep extends AlgorithmStep {
  // 'array' field from AlgorithmStep will hold deque elements
  frontIndex?: number; 
  rearIndex?: number;  
  operationType: 'deque'; // Distinguish from stack/queue if needed
  lastOperation?: string; 
  processedValue?: string | number | null | undefined; 
}

export const DEQUE_LINE_MAP = {
  // Conceptual based on array implementation
  classDef: 1,
  constructor: 2,
  addFrontStart: 3,
  addFrontOp: 4, // e.g., unshift
  addFrontEnd: 5,
  addRearStart: 6,
  addRearOp: 7,   // e.g., push
  addRearEnd: 8,
  removeFrontStart: 9,
  removeFrontCheckEmpty: 10,
  removeFrontOp: 11, // e.g., shift
  removeFrontEnd: 12,
  removeRearStart: 13,
  removeRearCheckEmpty: 14,
  removeRearOp: 15,  // e.g., pop
  removeRearEnd: 16,
  peekFrontStart: 17,
  peekFrontCheckEmpty: 18,
  peekFrontReturn: 19,
  peekFrontEnd: 20,
  peekRearStart: 21,
  peekRearCheckEmpty: 22,
  peekRearReturn: 23,
  peekRearEnd: 24,
  isEmpty: 25,
  size: 26,
};

export const generateDequeSteps = (
  currentDequeArray: (string | number)[],
  operation: 'addFront' | 'addRear' | 'removeFront' | 'removeRear' | 'peekFront' | 'peekRear',
  value?: string | number
): DequeAlgorithmStep[] => {
  const localSteps: DequeAlgorithmStep[] = [];
  let deque = [...currentDequeArray];
  const lm = DEQUE_LINE_MAP;
  let message = "";
  let processedVal: string | number | null | undefined = undefined;

  const addStep = (
    line: number | null,
    currentArrState: (string | number)[],
    activeIdx: number[] = [], // Can highlight front/rear or element being processed
    msg: string = message,
    lastOpMsg?: string,
  ) => {
    localSteps.push({
      array: [...currentArrState],
      activeIndices: activeIdx,
      swappingIndices: [],
      sortedIndices: [],
      currentLine: line,
      message: msg,
      frontIndex: currentArrState.length > 0 ? 0 : -1,
      rearIndex: currentArrState.length > 0 ? currentArrState.length - 1 : -1,
      operationType: 'deque',
      lastOperation: lastOpMsg,
      processedValue: processedVal,
    });
  };
  
  addStep(null, deque, [], `Initial state for Deque ${operation}. Deque: [${deque.join(', ')}]`);

  switch (operation) {
    case 'addFront':
      if (value === undefined) { addStep(null, deque, [], "Error: Value undefined for addFront."); return localSteps; }
      message = `Adding ${value} to front...`;
      addStep(lm.addFrontStart, deque, [], message);
      processedVal = value;
      deque.unshift(value);
      addStep(lm.addFrontOp, deque, [0], `${message} Added ${value}.`, `Added ${value} to front`);
      addStep(lm.addFrontEnd, deque, [0], `AddFront complete. Deque: [${deque.join(', ')}]`);
      break;
    case 'addRear':
      if (value === undefined) { addStep(null, deque, [], "Error: Value undefined for addRear."); return localSteps; }
      message = `Adding ${value} to rear...`;
      addStep(lm.addRearStart, deque, [], message);
      processedVal = value;
      deque.push(value);
      addStep(lm.addRearOp, deque, [deque.length - 1], `${message} Added ${value}.`, `Added ${value} to rear`);
      addStep(lm.addRearEnd, deque, [deque.length - 1], `AddRear complete. Deque: [${deque.join(', ')}]`);
      break;
    case 'removeFront':
      message = "Removing from front...";
      addStep(lm.removeFrontStart, deque, deque.length > 0 ? [0] : [], message);
      addStep(lm.removeFrontCheckEmpty, deque, deque.length > 0 ? [0] : [], `${message} Is deque empty? (${deque.length === 0})`);
      if (deque.length === 0) {
        addStep(null, deque, [], `${message} Deque is empty. Cannot remove.`);
        processedVal = null;
      } else {
        processedVal = deque.shift();
        addStep(lm.removeFrontOp, deque, [], `${message} Removed ${processedVal}.`, `Removed ${processedVal} from front`);
      }
      addStep(lm.removeFrontEnd, deque, [], `RemoveFront complete. Deque: [${deque.join(', ')}]`);
      break;
    case 'removeRear':
      message = "Removing from rear...";
      addStep(lm.removeRearStart, deque, deque.length > 0 ? [deque.length - 1] : [], message);
      addStep(lm.removeRearCheckEmpty, deque, deque.length > 0 ? [deque.length - 1] : [], `${message} Is deque empty? (${deque.length === 0})`);
      if (deque.length === 0) {
        addStep(null, deque, [], `${message} Deque is empty. Cannot remove.`);
        processedVal = null;
      } else {
        processedVal = deque.pop();
        addStep(lm.removeRearOp, deque, [], `${message} Removed ${processedVal}.`, `Removed ${processedVal} from rear`);
      }
      addStep(lm.removeRearEnd, deque, [], `RemoveRear complete. Deque: [${deque.join(', ')}]`);
      break;
    case 'peekFront':
      message = "Peeking front...";
      addStep(lm.peekFrontStart, deque, deque.length > 0 ? [0] : [], message);
      addStep(lm.peekFrontCheckEmpty, deque, deque.length > 0 ? [0] : [], `${message} Is deque empty? (${deque.length === 0})`);
      if (deque.length === 0) {
        addStep(null, deque, [], `${message} Deque is empty.`);
        processedVal = null;
      } else {
        processedVal = deque[0];
        addStep(lm.peekFrontReturn, deque, [0], `${message} Front is ${processedVal}.`, `Peeked front: ${processedVal}`);
      }
      addStep(lm.peekFrontEnd, deque, deque.length > 0 ? [0] : [], `PeekFront complete.`);
      break;
    case 'peekRear':
      message = "Peeking rear...";
      addStep(lm.peekRearStart, deque, deque.length > 0 ? [deque.length-1] : [], message);
      addStep(lm.peekRearCheckEmpty, deque, deque.length > 0 ? [deque.length-1] : [], `${message} Is deque empty? (${deque.length === 0})`);
      if (deque.length === 0) {
        addStep(null, deque, [], `${message} Deque is empty.`);
        processedVal = null;
      } else {
        processedVal = deque[deque.length - 1];
        addStep(lm.peekRearReturn, deque, [deque.length - 1], `${message} Rear is ${processedVal}.`, `Peeked rear: ${processedVal}`);
      }
      addStep(lm.peekRearEnd, deque, deque.length > 0 ? [deque.length-1] : [], `PeekRear complete.`);
      break;
  }
  return localSteps;
};
