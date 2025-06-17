
import type { AlgorithmStep } from '@/types'; // Reusing ArrayAlgorithmStep for stack/queue

export interface StackQueueAlgorithmStep extends AlgorithmStep {
  topIndex?: number; // For stack visualization
  frontIndex?: number; // For queue visualization
  rearIndex?: number; // For queue visualization
  operationType: 'stack' | 'queue';
  lastOperation?: string; // e.g., "Pushed 5", "Popped 3", "Enqueued 7"
  processedValue?: string | number | null; // Value that was pushed, popped, enqueued, dequeued
}


export const STACK_LINE_MAP = {
  pushStart: 1, // Conceptual: push(element) {
  pushToArray: 2, // this.items.push(element);
  pushEnd: 3, // }
  popStart: 4, // pop() {
  popCheckEmpty: 5, // if (this.isEmpty()) return null;
  popFromArray: 6, // return this.items.pop();
  popEnd: 7, // }
  peekStart: 8, // peek() {
  peekCheckEmpty: 9, // if (this.isEmpty()) return null;
  peekReturnTop: 10, // return this.items[this.items.length - 1];
  peekEnd: 11, // }
  constructor: 12, // constructor() { this.items = []; }
  isEmpty: 13, // isEmpty() { return this.items.length === 0; }
  size: 14, // size() { return this.items.length; }
};

export const generateStackSteps = (
  currentStackArray: (string | number)[],
  operation: 'push' | 'pop' | 'peek',
  value?: string | number
): StackQueueAlgorithmStep[] => {
  const localSteps: StackQueueAlgorithmStep[] = [];
  let stack = [...currentStackArray];
  const lm = STACK_LINE_MAP;
  let message = "";
  let processedVal: string | number | null | undefined = undefined;

  const addStep = (
    line: number | null,
    currentArrState: (string | number)[],
    activeIdx: number[] = [],
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
      topIndex: currentArrState.length > 0 ? currentArrState.length - 1 : -1,
      operationType: 'stack',
      lastOperation: lastOpMsg,
      processedValue: processedVal,
    });
  };

  addStep(null, stack, [], `Initial state for ${operation}. Stack: [${stack.join(', ')}]`);

  switch (operation) {
    case 'push':
      if (value === undefined) {
        addStep(null, stack, [], "Error: Value undefined for push.");
        return localSteps;
      }
      message = `Pushing ${value}...`;
      addStep(lm.pushStart, stack, [], message);
      processedVal = value;
      stack.push(value);
      addStep(lm.pushToArray, stack, [stack.length - 1], `${message} Added ${value}.`, `Pushed ${value}`);
      addStep(lm.pushEnd, stack, [stack.length - 1], `Push ${value} complete. Stack: [${stack.join(', ')}]`);
      break;
    case 'pop':
      message = "Popping from stack...";
      addStep(lm.popStart, stack, stack.length > 0 ? [stack.length - 1] : [], message);
      addStep(lm.popCheckEmpty, stack, stack.length > 0 ? [stack.length - 1] : [], `${message} Is stack empty? (${stack.length === 0})`);
      if (stack.length === 0) {
        addStep(null, stack, [], `${message} Stack is empty. Cannot pop.`);
        processedVal = null;
      } else {
        processedVal = stack.pop();
        addStep(lm.popFromArray, stack, [], `${message} Popped ${processedVal}.`, `Popped ${processedVal}`);
      }
      addStep(lm.popEnd, stack, stack.length > 0 ? [stack.length - 1] : [], `Pop complete. Stack: [${stack.join(', ')}]`);
      break;
    case 'peek':
      message = "Peeking top of stack...";
      addStep(lm.peekStart, stack, stack.length > 0 ? [stack.length - 1] : [], message);
      addStep(lm.peekCheckEmpty, stack, stack.length > 0 ? [stack.length - 1] : [], `${message} Is stack empty? (${stack.length === 0})`);
      if (stack.length === 0) {
        addStep(null, stack, [], `${message} Stack is empty. Nothing to peek.`);
        processedVal = null;
      } else {
        processedVal = stack[stack.length - 1];
        addStep(lm.peekReturnTop, stack, [stack.length - 1], `${message} Top element is ${processedVal}.`, `Peeked ${processedVal}`);
      }
      addStep(lm.peekEnd, stack, stack.length > 0 ? [stack.length - 1] : [], `Peek complete. Stack: [${stack.join(', ')}]`);
      break;
  }
  return localSteps;
};

// Queue logic will be added in a future step
export const generateQueueSteps = (
  currentQueueArray: (string | number)[],
  operation: 'enqueue' | 'dequeue' | 'front',
  value?: string | number
): StackQueueAlgorithmStep[] => {
  const localSteps: StackQueueAlgorithmStep[] = [];
   localSteps.push({
      array: [...currentQueueArray], activeIndices: [], swappingIndices: [], sortedIndices: [],
      currentLine: null, message: "Queue operations not yet visually implemented.", operationType: 'queue'
  });
  return localSteps;
};
    