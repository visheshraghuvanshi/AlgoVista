
// src/app/visualizers/deque-operations/deque-logic.ts
import type { DequeAlgorithmStep } from './types'; // Local, more specific type

export const DEQUE_LINE_MAP = {
  classDef: 1,
  constructor: 2,
  addFrontStart: 3,
  addFrontOp: 4, 
  addRearStart: 5,
  addRearOp: 6,   
  removeFrontStart: 7,
  removeFrontCheckEmpty: 8,
  removeFrontOp: 9, 
  removeRearStart: 10,
  removeRearCheckEmpty: 11,
  removeRearOp: 12,  
  peekFrontStart: 13,
  peekFrontCheckEmpty: 14,
  peekFrontReturn: 15,
  peekRearStart: 16,
  peekRearCheckEmpty: 17,
  peekRearReturn: 18,
  isEmpty: 19,
  size: 20,
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
  let processedValForOperation: string | number | null | undefined = undefined;
  let lastOpMessageForSummary = operation; // Default to operation name

  const addStep = (
    line: number | null,
    currentArrState: (string | number)[],
    activeIdx: number[] = [], 
    msg: string = message,
    opSummary?: string, // More specific summary for the current step/operation
    valProcessedThisStep?: string | number | null | undefined // Value processed in this specific step
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
      lastOperation: opSummary || operation, // Use specific summary if provided, else general operation
      processedValue: valProcessedThisStep, // Use specific value for this step
    });
  };
  
  addStep(null, deque, [], `Initial state for Deque ${operation}. Deque: [${deque.join(', ')}]`, "Initialize");

  switch (operation) {
    case 'addFront':
      if (value === undefined) { addStep(null, deque, [], "Error: Value undefined for addFront.", "Error", null); return localSteps; }
      message = `Adding "${value}" to front...`;
      addStep(lm.addFrontStart, deque, [], message, operation, value);
      processedValForOperation = value;
      deque.unshift(value);
      lastOpMessageForSummary = `Added "${value}" to front`;
      addStep(lm.addFrontOp, deque, [0], `${message} Added "${value}".`, lastOpMessageForSummary, processedValForOperation);
      break;
    case 'addRear':
      if (value === undefined) { addStep(null, deque, [], "Error: Value undefined for addRear.", "Error", null); return localSteps; }
      message = `Adding "${value}" to rear...`;
      addStep(lm.addRearStart, deque, [], message, operation, value);
      processedValForOperation = value;
      deque.push(value);
      lastOpMessageForSummary = `Added "${value}" to rear`;
      addStep(lm.addRearOp, deque, [deque.length - 1], `${message} Added "${value}".`, lastOpMessageForSummary, processedValForOperation);
      break;
    case 'removeFront':
      message = "Removing from front...";
      addStep(lm.removeFrontStart, deque, deque.length > 0 ? [0] : [], message, operation);
      addStep(lm.removeFrontCheckEmpty, deque, deque.length > 0 ? [0] : [], `${message} Is deque empty? (${deque.length === 0})`, operation);
      if (deque.length === 0) {
        addStep(null, deque, [], `${message} Deque is empty. Cannot remove.`, "Remove Front Failed", null);
        processedValForOperation = null;
        lastOpMessageForSummary = "Remove Front Failed (Empty)";
      } else {
        processedValForOperation = deque.shift();
        lastOpMessageForSummary = `Removed "${processedValForOperation}" from front`;
        addStep(lm.removeFrontOp, deque, [], `${message} Removed "${processedValForOperation}".`, lastOpMessageForSummary, processedValForOperation);
      }
      break;
    case 'removeRear':
      message = "Removing from rear...";
      addStep(lm.removeRearStart, deque, deque.length > 0 ? [deque.length - 1] : [], message, operation);
      addStep(lm.removeRearCheckEmpty, deque, deque.length > 0 ? [deque.length - 1] : [], `${message} Is deque empty? (${deque.length === 0})`, operation);
      if (deque.length === 0) {
        addStep(null, deque, [], `${message} Deque is empty. Cannot remove.`, "Remove Rear Failed", null);
        processedValForOperation = null;
        lastOpMessageForSummary = "Remove Rear Failed (Empty)";
      } else {
        processedValForOperation = deque.pop();
        lastOpMessageForSummary = `Removed "${processedValForOperation}" from rear`;
        addStep(lm.removeRearOp, deque, [], `${message} Removed "${processedValForOperation}".`, lastOpMessageForSummary, processedValForOperation);
      }
      break;
    case 'peekFront':
      message = "Peeking front...";
      addStep(lm.peekFrontStart, deque, deque.length > 0 ? [0] : [], message, operation);
      addStep(lm.peekFrontCheckEmpty, deque, deque.length > 0 ? [0] : [], `${message} Is deque empty? (${deque.length === 0})`, operation);
      if (deque.length === 0) {
        addStep(null, deque, [], `${message} Deque is empty.`, "Peek Front Failed", null);
        processedValForOperation = null;
        lastOpMessageForSummary = "Peek Front Failed (Empty)";
      } else {
        processedValForOperation = deque[0];
        lastOpMessageForSummary = `Peeked front: "${processedValForOperation}"`;
        addStep(lm.peekFrontReturn, deque, [0], `${message} Front is "${processedValForOperation}".`, lastOpMessageForSummary, processedValForOperation);
      }
      break;
    case 'peekRear':
      message = "Peeking rear...";
      addStep(lm.peekRearStart, deque, deque.length > 0 ? [deque.length-1] : [], message, operation);
      addStep(lm.peekRearCheckEmpty, deque, deque.length > 0 ? [deque.length-1] : [], `${message} Is deque empty? (${deque.length === 0})`, operation);
      if (deque.length === 0) {
        addStep(null, deque, [], `${message} Deque is empty.`, "Peek Rear Failed", null);
        processedValForOperation = null;
        lastOpMessageForSummary = "Peek Rear Failed (Empty)";
      } else {
        processedValForOperation = deque[deque.length - 1];
        lastOpMessageForSummary = `Peeked rear: "${processedValForOperation}"`;
        addStep(lm.peekRearReturn, deque, [deque.length - 1], `${message} Rear is "${processedValForOperation}".`, lastOpMessageForSummary, processedValForOperation);
      }
      break;
  }
  // Final conclusive step with the outcome
  addStep(null, deque, [], `${operation.charAt(0).toUpperCase() + operation.slice(1)} operation finished. ${lastOpMessageForSummary}`, lastOpMessageForSummary, processedValForOperation);
  return localSteps;
};

export const createInitialPriorityQueue = (): any[] => { 
  return [];
};


    