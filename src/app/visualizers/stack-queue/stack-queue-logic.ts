// src/app/visualizers/stack-queue/stack-queue-logic.ts
import type { AlgorithmStep } from '@/types'; // Using generic AlgorithmStep from global for now
// If StackQueueAlgorithmStep becomes very different, define it locally.

// For now, let's define StackQueueAlgorithmStep locally to match the page's expectation.
export interface StackQueueAlgorithmStep extends AlgorithmStep {
  array: (string | number)[]; // Represents the stack or queue
  topIndex?: number; // For stack visualization
  frontIndex?: number; // For queue visualization
  rearIndex?: number; // For queue visualization
  operationType: 'stack' | 'queue';
  lastOperation?: string; 
  processedValue?: string | number | null | undefined; 
}


export const STACK_LINE_MAP = {
  classDef: 1, 
  constructor: 2, 
  pushStart: 3, 
  pushToArray: 4, 
  pushEnd: 5, 
  popStart: 6, 
  popCheckEmpty: 7, 
  popFromArray: 8, 
  popEnd: 9, 
  peekStart: 10, 
  peekCheckEmpty: 11, 
  peekReturnTop: 12, 
  peekEnd: 13, 
  isEmpty: 14, 
  size: 15, 
};

export const QUEUE_LINE_MAP = {
  classDef: 17, 
  constructor: 18, 
  enqueueStart: 19, 
  enqueueToArray: 20, 
  enqueueEnd: 21, 
  dequeueStart: 22, 
  dequeueCheckEmpty: 23, 
  dequeueFromArray: 24, 
  dequeueEnd: 25, 
  frontStart: 26, 
  frontCheckEmpty: 27, 
  frontReturnFirst: 28, 
  frontEnd: 29, 
  isEmpty: 30, 
  size: 31, 
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

  addStep(null, stack, [], `Initial state for Stack ${operation}. Stack: [${stack.join(', ')}]`);

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

export const generateQueueSteps = (
  currentQueueArray: (string | number)[],
  operation: 'enqueue' | 'dequeue' | 'front',
  value?: string | number
): StackQueueAlgorithmStep[] => {
  const localSteps: StackQueueAlgorithmStep[] = [];
  let queue = [...currentQueueArray];
  const lm = QUEUE_LINE_MAP;
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
      frontIndex: currentArrState.length > 0 ? 0 : -1,
      rearIndex: currentArrState.length > 0 ? currentArrState.length - 1 : -1,
      operationType: 'queue',
      lastOperation: lastOpMsg,
      processedValue: processedVal,
    });
  };

  addStep(null, queue, [], `Initial state for Queue ${operation}. Queue: [${queue.join(', ')}]`);

  switch (operation) {
    case 'enqueue':
      if (value === undefined) {
        addStep(null, queue, [], "Error: Value undefined for enqueue.");
        return localSteps;
      }
      message = `Enqueuing ${value}...`;
      addStep(lm.enqueueStart, queue, [], message);
      processedVal = value;
      queue.push(value); 
      addStep(lm.enqueueToArray, queue, [queue.length - 1], `${message} Added ${value} to rear.`, `Enqueued ${value}`);
      addStep(lm.enqueueEnd, queue, [queue.length - 1], `Enqueue ${value} complete. Queue: [${queue.join(', ')}]`);
      break;
    case 'dequeue':
      message = "Dequeuing from queue...";
      addStep(lm.dequeueStart, queue, queue.length > 0 ? [0] : [], message);
      addStep(lm.dequeueCheckEmpty, queue, queue.length > 0 ? [0] : [], `${message} Is queue empty? (${queue.length === 0})`);
      if (queue.length === 0) {
        addStep(null, queue, [], `${message} Queue is empty. Cannot dequeue.`);
        processedVal = null;
      } else {
        processedVal = queue.shift(); 
        addStep(lm.dequeueFromArray, queue, [], `${message} Dequeued ${processedVal} from front.`, `Dequeued ${processedVal}`);
      }
      addStep(lm.dequeueEnd, queue, [], `Dequeue complete. Queue: [${queue.join(', ')}]`);
      break;
    case 'front':
      message = "Peeking front of queue...";
      addStep(lm.frontStart, queue, queue.length > 0 ? [0] : [], message);
      addStep(lm.frontCheckEmpty, queue, queue.length > 0 ? [0] : [], `${message} Is queue empty? (${queue.length === 0})`);
      if (queue.length === 0) {
        addStep(null, queue, [], `${message} Queue is empty. Nothing at front.`);
        processedVal = null;
      } else {
        processedVal = queue[0];
        addStep(lm.frontReturnFirst, queue, [0], `${message} Front element is ${processedVal}.`, `Front is ${processedVal}`);
      }
      addStep(lm.frontEnd, queue, queue.length > 0 ? [0] : [], `Front peek complete. Queue: [${queue.join(', ')}]`);
      break;
  }
  return localSteps;
};
