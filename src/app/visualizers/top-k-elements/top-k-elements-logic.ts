
import type { TopKAlgorithmStep, PriorityQueueItem } from './types';

// Conceptual line mapping for the high-level logic
export const TOP_K_ELEMENTS_LINE_MAP = {
  funcDeclare: 1,
  initHeap: 2,
  loopNums: 3,
  checkHeapSizeLessThanK: 4,
  enqueueToHeap: 5,
  checkNumGreaterThanHeapMin: 6,
  dequeueFromHeap: 7,
  enqueueLargerNum: 8,
  loopEnd: 9,
  getResultFromHeap: 10,
  funcEnd: 11,
};

// Min-Heap (Priority Queue Item version for consistency with PQ visualizer types)
class MinHeap {
  heap: PriorityQueueItem[] = [];

  private getParentIdx(i: number) { return Math.floor((i - 1) / 2); }
  private getLeftChildIdx(i: number) { return 2 * i + 1; }
  private getRightChildIdx(i: number) { return 2 * i + 2; }
  private swap(i1: number, i2: number) { [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]]; }

  enqueue(value: number) { // For Top K, priority is the value itself
    this.heap.push({ value, priority: value });
    this._heapifyUp(this.heap.length - 1);
  }

  dequeue(): PriorityQueueItem | null {
    if (this.isEmpty()) return null;
    if (this.heap.length === 1) return this.heap.pop()!;
    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this._heapifyDown(0);
    return min;
  }

  peek(): PriorityQueueItem | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  isEmpty() { return this.heap.length === 0; }
  size() { return this.heap.length; }
  toArray(): number[] { return this.heap.map(item => item.value).sort((a, b) => a - b); } // Return values, sorted for consistency if needed

  _heapifyUp(index: number) {
    let current = index;
    let parent = this.getParentIdx(current);
    while (current > 0 && this.heap[current].priority < this.heap[parent].priority) {
      this.swap(current, parent);
      current = parent;
      parent = this.getParentIdx(current);
    }
  }

  _heapifyDown(index: number) {
    let current = index;
    while (true) {
      let smallest = current;
      const left = this.getLeftChildIdx(current);
      const right = this.getRightChildIdx(current);
      if (left < this.size() && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
      if (right < this.size() && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
      if (smallest !== current) {
        this.swap(current, smallest);
        current = smallest;
      } else break;
    }
  }
}

export const generateTopKElementsSteps = (nums: number[], k: number): TopKAlgorithmStep[] => {
  const localSteps: TopKAlgorithmStep[] = [];
  const lm = TOP_K_ELEMENTS_LINE_MAP;
  const minHeap = new MinHeap();

  const addStep = (
    line: number | null,
    message: string,
    op?: TopKAlgorithmStep['operation'],
    currentNum?: number,
    compMsg?: string,
    activeIdx?: number,
    processedItem?: PriorityQueueItem | null,
  ) => {
    localSteps.push({
      inputArray: [...nums],
      heap: minHeap.heap.map(item => ({...item})), // Deep copy of heap items
      currentElement: currentNum,
      operation: op,
      comparison: compMsg,
      message,
      currentLine: line,
      activeIndices: activeIdx !== undefined ? [activeIdx] : [],
      activeHeapIndices: [], // Could highlight heap root or swapped elements if heap ops were detailed
      processedItem,
    });
  };

  addStep(lm.funcDeclare, `Finding ${k} largest elements in [${nums.join(', ')}].`);
  addStep(lm.initHeap, "Initialize a min-heap of size K.", 'initialize_heap');

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    addStep(lm.loopNums, `Processing element: ${num} (at index ${i}).`, 'iterate_input', num, undefined, i);
    
    addStep(lm.checkHeapSizeLessThanK, `Is heap size (${minHeap.size()}) < K (${k})?`, 'compare_heap_size', num, undefined, i);
    if (minHeap.size() < k) {
      minHeap.enqueue(num);
      addStep(lm.enqueueToHeap, `Heap size < K. Enqueue ${num}. Heap: [${minHeap.toArray().join(', ')}]`, 'add_to_heap', num, undefined, i, {value: num, priority: num});
    } else {
      const heapMin = minHeap.peek();
      addStep(lm.checkNumGreaterThanHeapMin, `Heap full. Is current num (${num}) > heap.peek() (${heapMin?.value})?`, 'compare_with_heap_min', num, `${num} > ${heapMin?.value}`, i, heapMin);
      if (heapMin && num > heapMin.value) {
        const dequeuedItem = minHeap.dequeue();
        addStep(lm.dequeueFromHeap, `Yes. Dequeue ${dequeuedItem?.value}. Heap: [${minHeap.toArray().join(', ')}]`, 'replace_heap_min', num, undefined, i, dequeuedItem);
        minHeap.enqueue(num);
        addStep(lm.enqueueLargerNum, `Enqueue ${num}. Heap: [${minHeap.toArray().join(', ')}]`, 'replace_heap_min', num, undefined, i, {value: num, priority: num});
      } else {
         addStep(lm.checkNumGreaterThanHeapMin, `No. Current num (${num}) is not greater than heap min (${heapMin?.value}). Skip.`, 'skip_element', num, undefined, i, heapMin);
      }
    }
  }
  addStep(lm.loopEnd, "Finished iterating through input array.", 'finalize');
  
  const result = minHeap.toArray().sort((a, b) => b - a); // Final result sorted largest to smallest
  addStep(lm.getResultFromHeap, `Final Top K elements (from heap, sorted): [${result.join(', ')}]`, 'finalize', undefined, undefined, undefined, undefined);
  localSteps[localSteps.length-1].result = result; // Attach final result
  addStep(lm.funcEnd, `Algorithm complete. Top ${k} elements found.`, 'finalize');
  localSteps[localSteps.length-1].result = result;

  return localSteps;
};


    