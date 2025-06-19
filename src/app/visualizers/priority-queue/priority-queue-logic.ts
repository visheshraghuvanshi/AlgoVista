
import type { PriorityQueueStep, PriorityQueueItem } from './types'; // Local import

// Conceptual Min-Heap based Priority Queue
export const PRIORITY_QUEUE_LINE_MAP = {
  // General
  classDef: 1,
  constructor: 2,
  // Helper methods (conceptual lines for code panel - actual steps are within ops)
  getParentIndex: 3, getLeftChildIndex: 4, getRightChildIndex: 5, swap: 6,

  // Enqueue (Insert into heap)
  enqueueStart: 7,
  enqueuePushToArray: 8,
  enqueueCallHeapifyUp: 9,
  // enqueueEnd: 10, // Implicit step

  // Heapify Up (part of enqueue)
  heapifyUpStart: 10, // Adjusted to be unique
  heapifyUpGetParent: 11,
  heapifyUpLoop: 12, 
  heapifyUpSwap: 13,
  heapifyUpUpdateIndex: 14,
  heapifyUpUpdateParent: 15, 
  heapifyUpLoopEnd: 16,
  // heapifyUpEnd: 18, // Implicit

  // Dequeue (Extract Min from heap)
  dequeueStart: 17, // Adjusted
  dequeueCheckEmpty: 18,
  // dequeueReturnNullIfEmpty: 21, // Implicit in message
  dequeueCheckSingleElement: 19,
  dequeuePopSingle: 20,
  dequeueStoreMin: 21,
  dequeueMoveLastToRoot: 22,
  dequeueCallHeapifyDown: 23,
  dequeueReturnMin: 24,
  // dequeueEnd: 28, // Implicit

  // Heapify Down (part of dequeue)
  heapifyDownStart: 25, // Adjusted
  heapifyDownInitSmallest: 26,
  heapifyDownGetChildren: 27, 
  heapifyDownCheckLeft: 28, 
  heapifyDownUpdateSmallestLeft: 29,
  heapifyDownCheckRight: 30, 
  heapifyDownUpdateSmallestRight: 31,
  heapifyDownIfSmallestNotIndex: 32,
  heapifyDownSwap: 33,
  heapifyDownRecurse: 34, 
  heapifyDownEndIf: 35,
  // heapifyDownEnd: 40, // Implicit

  // Peek
  peekStart: 36, // Adjusted
  peekCheckEmpty: 37,
  // peekReturnNullIfEmpty: 43, // Implicit
  peekReturnTop: 38,
  // peekEnd: 45, // Implicit
};

const addStep = (
  steps: PriorityQueueStep[],
  line: number | null,
  heap: PriorityQueueItem[],
  operation: PriorityQueueStep['operation'],
  message: string,
  activeHeapIndices?: number[],
  processedItem?: PriorityQueueItem | null
) => {
  steps.push({
    heapArray: heap.map(item => ({ ...item })), // Deep copy items
    operation,
    processedItem,
    message,
    currentLine: line,
    activeHeapIndices: activeHeapIndices || [],
    // Unused AlgorithmStep fields
    activeIndices: [], swappingIndices: [], sortedIndices: [],
  });
};

// Helper: Min-Heapify Up
function heapifyUp(heap: PriorityQueueItem[], index: number, localSteps: PriorityQueueStep[], opType: PriorityQueueStep['operation']) {
  const lm = PRIORITY_QUEUE_LINE_MAP;
  addStep(localSteps, lm.heapifyUpStart, heap, opType, `HeapifyUp starting at index ${index} (value: ${heap[index]?.value}, prio: ${heap[index]?.priority}).`, [index]);
  let currentIndex = index;
  let parentIndex = Math.floor((currentIndex - 1) / 2);
  addStep(localSteps, lm.heapifyUpGetParent, heap, opType, `Parent of ${currentIndex} is ${parentIndex}.`, [currentIndex, parentIndex]);

  while (currentIndex > 0 && heap[currentIndex].priority < heap[parentIndex].priority) {
    addStep(localSteps, lm.heapifyUpLoop, heap, opType, `Loop: index ${currentIndex} > 0 AND prio(${heap[currentIndex].priority}) < prio(${heap[parentIndex].priority}). Swap needed.`, [currentIndex, parentIndex]);
    [heap[currentIndex], heap[parentIndex]] = [heap[parentIndex], heap[currentIndex]]; // Swap
    addStep(localSteps, lm.heapifyUpSwap, heap, opType, `Swapped items at index ${currentIndex} and ${parentIndex}.`, [currentIndex, parentIndex]);
    currentIndex = parentIndex;
    addStep(localSteps, lm.heapifyUpUpdateIndex, heap, opType, `Current index moved to ${currentIndex}.`, [currentIndex]);
    parentIndex = Math.floor((currentIndex - 1) / 2);
    addStep(localSteps, lm.heapifyUpUpdateParent, heap, opType, `New parent index is ${parentIndex}.`, [currentIndex, parentIndex]);
  }
  addStep(localSteps, lm.heapifyUpLoopEnd, heap, opType, `HeapifyUp loop condition false or index is 0.`, [currentIndex]);
  // addStep(localSteps, lm.heapifyUpEnd, heap, opType, `HeapifyUp complete for original index ${index}.`);
}

// Helper: Min-Heapify Down
function heapifyDown(heap: PriorityQueueItem[], index: number, localSteps: PriorityQueueStep[], opType: PriorityQueueStep['operation']) {
  const lm = PRIORITY_QUEUE_LINE_MAP;
  addStep(localSteps, lm.heapifyDownStart, heap, opType, `HeapifyDown starting at index ${index} (value: ${heap[index]?.value}, prio: ${heap[index]?.priority}).`, [index]);
  let currentIndex = index;
  const size = heap.length;

  while (true) {
    let smallest = currentIndex;
    const leftChildIdx = 2 * currentIndex + 1;
    const rightChildIdx = 2 * currentIndex + 2;
    addStep(localSteps, lm.heapifyDownInitSmallest, heap, opType, `Set smallest = current index ${currentIndex}. Left child: ${leftChildIdx}, Right child: ${rightChildIdx}.`, [currentIndex, leftChildIdx, rightChildIdx]);

    if (leftChildIdx < size) {
        addStep(localSteps, lm.heapifyDownCheckLeft, heap, opType, `Check left child: index ${leftChildIdx} < size ${size} AND prio(${heap[leftChildIdx].priority}) < prio(${heap[smallest].priority})?`, [currentIndex, leftChildIdx]);
        if (heap[leftChildIdx].priority < heap[smallest].priority) {
            smallest = leftChildIdx;
            addStep(localSteps, lm.heapifyDownUpdateSmallestLeft, heap, opType, `Left child is smaller. Smallest is now ${smallest}.`, [currentIndex, smallest]);
        }
    }
    if (rightChildIdx < size) {
        addStep(localSteps, lm.heapifyDownCheckRight, heap, opType, `Check right child: index ${rightChildIdx} < size ${size} AND prio(${heap[rightChildIdx].priority}) < prio(${heap[smallest].priority})?`, [currentIndex, rightChildIdx, smallest]);
        if (heap[rightChildIdx].priority < heap[smallest].priority) {
            smallest = rightChildIdx;
            addStep(localSteps, lm.heapifyDownUpdateSmallestRight, heap, opType, `Right child is smaller. Smallest is now ${smallest}.`, [currentIndex, smallest]);
        }
    }
    addStep(localSteps, lm.heapifyDownIfSmallestNotIndex, heap, opType, `Is smallest (${smallest}) !== current index (${currentIndex})?`, [currentIndex, smallest]);
    if (smallest !== currentIndex) {
      [heap[currentIndex], heap[smallest]] = [heap[smallest], heap[currentIndex]]; // Swap
      addStep(localSteps, lm.heapifyDownSwap, heap, opType, `Swapped items at index ${currentIndex} and ${smallest}.`, [currentIndex, smallest]);
      currentIndex = smallest; // Move down
      addStep(localSteps, lm.heapifyDownRecurse, heap, opType, `Continue heapifyDown from new index ${currentIndex}.`, [currentIndex]);
    } else {
      addStep(localSteps, lm.heapifyDownEndIf, heap, opType, "Smallest is current index. Heap property restored for this path.", [currentIndex]);
      break; // Heap property satisfied
    }
  }
  // addStep(localSteps, lm.heapifyDownEnd, heap, opType, `HeapifyDown complete for original index ${index}.`);
}


export const generatePriorityQueueSteps = (
  currentHeap: PriorityQueueItem[],
  operation: 'enqueue' | 'dequeue' | 'peek',
  itemValue?: string | number,
  itemPriority?: number
): PriorityQueueStep[] => {
  const localSteps: PriorityQueueStep[] = [];
  let heap = currentHeap.map(item => ({ ...item })); // Deep copy
  const lm = PRIORITY_QUEUE_LINE_MAP;
  let message = "";
  let processedItem: PriorityQueueItem | null = null;

  addStep(localSteps, null, heap, operation, `Initial state for PQ ${operation}.`);

  switch (operation) {
    case 'enqueue':
      if (itemValue === undefined || itemPriority === undefined) {
        addStep(localSteps, null, heap, operation, "Error: Value or priority undefined for enqueue.");
        return localSteps;
      }
      const newItem: PriorityQueueItem = { value: itemValue, priority: itemPriority };
      processedItem = newItem;
      message = `Enqueuing item "${itemValue}" with priority ${itemPriority}...`;
      addStep(localSteps, lm.enqueueStart, heap, operation, message, [], newItem);
      
      heap.push(newItem);
      addStep(localSteps, lm.enqueuePushToArray, heap, operation, `Added item to end of heap array. Heap size: ${heap.length}.`, [heap.length - 1], newItem);
      
      addStep(localSteps, lm.enqueueCallHeapifyUp, heap, operation, `Calling HeapifyUp for last element (index ${heap.length - 1}).`, [heap.length - 1]);
      heapifyUp(heap, heap.length - 1, localSteps, operation);
      
      // addStep(localSteps, lm.enqueueEnd, heap, operation, `Enqueue of "${itemValue}" (prio ${itemPriority}) complete.`);
      break;

    case 'dequeue':
      message = "Dequeuing (extracting min priority item)...";
      addStep(localSteps, lm.dequeueStart, heap, operation, message);
      
      addStep(localSteps, lm.dequeueCheckEmpty, heap, operation, `Is PQ empty? (size: ${heap.length})`);
      if (heap.length === 0) {
        addStep(localSteps, lm.dequeueStart, heap, operation, "PQ is empty. Cannot dequeue."); // Use dequeueStart for 'no operation' message
        processedItem = null;
        break;
      }
      
      processedItem = heap[0];
      addStep(localSteps, lm.dequeueStoreMin, heap, operation, `Min priority item is "${processedItem.value}" (prio ${processedItem.priority}).`, [0], processedItem);

      if (heap.length === 1) {
        heap.pop();
        addStep(localSteps, lm.dequeuePopSingle, heap, operation, `PQ had one element. Popped. PQ is now empty.`, [], processedItem);
      } else {
        heap[0] = heap.pop()!; // Move last element to root
        addStep(localSteps, lm.dequeueMoveLastToRoot, heap, operation, `Moved last element to root. Root is now "${heap[0]?.value}" (prio ${heap[0]?.priority}).`, [0], processedItem);
        
        addStep(localSteps, lm.dequeueCallHeapifyDown, heap, operation, `Calling HeapifyDown for root (index 0).`, [0]);
        heapifyDown(heap, 0, localSteps, operation);
      }
      addStep(localSteps, lm.dequeueReturnMin, heap, operation, `Dequeued item "${processedItem.value}".`);
      // addStep(localSteps, lm.dequeueEnd, heap, operation, "Dequeue complete.");
      break;

    case 'peek':
      message = "Peeking front (min priority item)...";
      addStep(localSteps, lm.peekStart, heap, operation, message, heap.length > 0 ? [0] : []);
      addStep(localSteps, lm.peekCheckEmpty, heap, operation, `Is PQ empty? (size: ${heap.length})`, heap.length > 0 ? [0] : []);
      if (heap.length === 0) {
        addStep(localSteps, lm.peekStart, heap, operation, "PQ is empty. Nothing to peek."); // Use peekStart for 'no operation' message
        processedItem = null;
      } else {
        processedItem = heap[0];
        addStep(localSteps, lm.peekReturnTop, heap, operation, `Front item is "${processedItem.value}" (prio ${processedItem.priority}).`, [0], processedItem);
      }
      // addStep(localSteps, lm.peekEnd, heap, operation, "Peek complete.", heap.length > 0 ? [0] : []);
      break;
  }
  addStep(localSteps, null, heap, operation, `${operation.charAt(0).toUpperCase() + operation.slice(1)} operation finished.`);
  return localSteps;
};

export const createInitialPriorityQueue = (): PriorityQueueItem[] => {
  return [];
};

