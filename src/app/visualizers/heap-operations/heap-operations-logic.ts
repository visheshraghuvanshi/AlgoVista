import type { TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from '@/types';

export type HeapOperationType = 'buildMinHeap' | 'insertMinHeap' | 'extractMin' | 'classDefinition';

// Line maps should correspond to the specific operation snippets
export const HEAP_OPERATION_LINE_MAPS: Record<HeapOperationType, Record<string, number>> = {
  classDefinition: { /* general class lines */ },
  buildMinHeap: {
    func: 1, copyArray: 2, firstNonLeaf: 3, loop: 4, callHeapifyDown: 5, endLoop: 6,
    // Plus heapifyDown lines if shown inline, or refer to extractMin's map
  },
  insertMinHeap: {
    func: 1, push: 2, callHeapifyUp: 3,
    heapifyUpFunc: 4, getParent: 5, whileLoop: 6, swap: 7, updateIndex: 8, updateParent: 9, endWhile: 10, endHeapifyUp: 11,
  },
  extractMin: {
    func: 1, checkEmpty: 2, checkSingle: 3, storeMin: 4, moveLastToRoot: 5, callHeapifyDown: 6, returnMin: 7,
    heapifyDownFunc: 8, initSmallest: 9, getLeft: 10, getRight: 11, checkLeft: 12, updateSmallestLeft: 13,
    checkRight: 14, updateSmallestRight: 15, ifSmallestNotIndex: 16, swap: 17, recurseHeapifyDown: 18, endIf: 19, endHeapifyDown: 20,
  },
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  active: "hsl(var(--primary))",      // Node being actively processed/compared
  swapping: "hsl(var(--accent))",     // Nodes involved in a swap
  path: "hsl(var(--primary)/0.7)",    // Path for heapify-up/down
};
const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  path: "hsl(var(--primary))",
};

// Helper to map heap array to tree nodes for visualization
function mapHeapToTreeNodes(
    heapArray: number[],
    activeIndex?: number,
    swappingIndices: number[] = [],
    pathIndices: number[] = [] // For heapify paths
): { nodes: BinaryTreeNodeVisual[], edges: BinaryTreeEdgeVisual[] } {
  if (heapArray.length === 0) return { nodes: [], edges: [] };

  const visualNodes: BinaryTreeNodeVisual[] = [];
  const visualEdges: BinaryTreeEdgeVisual[] = [];
  
  const X_SPACING_BASE = 60; 
  const Y_SPACING = 50;
  const SVG_WIDTH = 600; // Assumed width for root positioning

  function positionNode(index: number, x: number, y: number, levelWidth: number) {
    if (index >= heapArray.length) return;

    let color = NODE_COLORS.default;
    if (swappingIndices.includes(index)) color = NODE_COLORS.swapping;
    else if (activeIndex === index) color = NODE_COLORS.active;
    else if (pathIndices.includes(index)) color = NODE_COLORS.path;

    visualNodes.push({
      id: `heapnode-${index}`,
      value: heapArray[index],
      x, y, color,
      leftId: (2 * index + 1 < heapArray.length) ? `heapnode-${2 * index + 1}` : null,
      rightId: (2 * index + 2 < heapArray.length) ? `heapnode-${2 * index + 2}` : null,
    });

    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;
    const nextLevelWidth = levelWidth / 2;

    if (leftChildIndex < heapArray.length) {
      const childX = x - nextLevelWidth / 2; // Adjust based on dynamic spacing
      visualEdges.push({
        id: `edge-${index}-${leftChildIndex}`, sourceId: `heapnode-${index}`, targetId: `heapnode-${leftChildIndex}`,
        color: (pathIndices.includes(index) && pathIndices.includes(leftChildIndex)) ? EDGE_COLORS.path : EDGE_COLORS.default
      });
      positionNode(leftChildIndex, childX, y + Y_SPACING, nextLevelWidth);
    }
    if (rightChildIndex < heapArray.length) {
      const childX = x + nextLevelWidth / 2; // Adjust
      visualEdges.push({
        id: `edge-${index}-${rightChildIndex}`, sourceId: `heapnode-${index}`, targetId: `heapnode-${rightChildIndex}`,
        color: (pathIndices.includes(index) && pathIndices.includes(rightChildIndex)) ? EDGE_COLORS.path : EDGE_COLORS.default
      });
      positionNode(rightChildIndex, childX, y + Y_SPACING, nextLevelWidth);
    }
  }
  // Initial call to position nodes, starting with the root (index 0)
  // The initial levelWidth can be the SVG_WIDTH or some factor of it.
  positionNode(0, SVG_WIDTH / 2, 50, SVG_WIDTH * 0.8); 
  
  // Normalize x coordinates to ensure tree is centered and fits if too wide
    if (visualNodes.length > 0) {
        const minX = Math.min(...visualNodes.map(n => n.x));
        const maxX = Math.max(...visualNodes.map(n => n.x));
        const treeWidth = maxX - minX;
        const currentCenterX = minX + treeWidth / 2;
        const desiredCenterX = SVG_WIDTH / 2;
        const shiftX = desiredCenterX - currentCenterX;

        let scaleFactor = 1;
        if (treeWidth > SVG_WIDTH * 0.95) { // If tree is wider than viewport
            scaleFactor = (SVG_WIDTH * 0.95) / treeWidth;
        }

        visualNodes.forEach(node => {
            node.x = desiredCenterX + (node.x - currentCenterX) * scaleFactor;
            node.y = node.y * scaleFactor + (SVG_WIDTH * (1-scaleFactor) * 0.1); // also scale Y and adjust start
        });
    }

  return { nodes: visualNodes, edges: visualEdges };
}


export const generateHeapSteps = (
  heapDataRef: React.MutableRefObject<number[]>, // Use ref to modify underlying array
  operation: HeapOperationType,
  value?: number,
  initialArrayString?: string // Only for buildHeap
): TreeAlgorithmStep[] => {
  const localSteps: TreeAlgorithmStep[] = [];
  let currentHeapArray = heapDataRef.current; // Get current heap array
  let lineMap = HEAP_OPERATION_LINE_MAPS[operation];

  const addStep = (
    line: number | null,
    message: string,
    activeIndex?: number,
    swappingIndices: number[] = [],
    pathIndices: number[] = [],
    currentProcessingIdOverride?: string | null,
  ) => {
    const { nodes, edges } = mapHeapToTreeNodes([...currentHeapArray], activeIndex, swappingIndices, pathIndices);
    localSteps.push({
      nodes,
      edges,
      traversalPath: pathIndices.map(idx => currentHeapArray[idx]), // Can represent heapify path values
      currentLine: line,
      message,
      currentProcessingNodeId: currentProcessingIdOverride !== undefined ? currentProcessingIdOverride : (activeIndex !== undefined ? `heapnode-${activeIndex}` : null),
    });
  };
  
  // ---- MinHeapifyUp ----
  function heapifyUp(index: number) {
    lineMap = HEAP_OPERATION_LINE_MAPS.insertMinHeap;
    addStep(lineMap.heapifyUpFunc, `HeapifyUp starting at index ${index} (value: ${currentHeapArray[index]})`, index, [], [index]);
    let parentIndex = Math.floor((index - 1) / 2);
    addStep(lineMap.getParent, `Parent index of ${index} is ${parentIndex}`, index, [], [index, parentIndex]);

    let path = [index];
    while (index > 0 && currentHeapArray[index] < currentHeapArray[parentIndex]) {
      path.push(parentIndex);
      addStep(lineMap.whileLoop, `While ${index} > 0 && arr[${index}] (${currentHeapArray[index]}) < arr[${parentIndex}] (${currentHeapArray[parentIndex]})`, index, [], [...path]);
      
      addStep(lineMap.swap, `Swap arr[${index}] (${currentHeapArray[index]}) with arr[${parentIndex}] (${currentHeapArray[parentIndex]})`, parentIndex, [index, parentIndex], [...path]);
      [currentHeapArray[index], currentHeapArray[parentIndex]] = [currentHeapArray[parentIndex], currentHeapArray[index]];
      addStep(lineMap.swap, `Swapped. Array: [${currentHeapArray.join(',')}]`, parentIndex, [index, parentIndex], [...path]);
      
      index = parentIndex;
      addStep(lineMap.updateIndex, `Update index to ${index}`, index, [], [...path]);
      parentIndex = Math.floor((index - 1) / 2);
      addStep(lineMap.updateParent, `Update parentIndex to ${parentIndex}`, index, [], [...path]);
    }
    addStep(lineMap.endWhile, `HeapifyUp loop condition false or index is 0. Path: ${path.map(i=>currentHeapArray[i]).join('->')}`, index,[],[...path]);
    addStep(lineMap.endHeapifyUp, `HeapifyUp for index ${index} finished.`, index,[],[...path]);
  }

  // ---- MinHeapifyDown ----
  function heapifyDown(index: number) {
    lineMap = HEAP_OPERATION_LINE_MAPS.extractMin;
    addStep(lineMap.heapifyDownFunc, `HeapifyDown starting at index ${index} (value: ${currentHeapArray[index]})`, index, [], [index]);
    let smallest = index;
    let path = [index];

    while (true) {
        addStep(lineMap.initSmallest, `Set smallest = current index ${index}`, index, [], [...path]);
        smallest = index; // Re-assign smallest to current index for this iteration
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        addStep(lineMap.getLeft, `Left child index of ${index} is ${left}`, index, [], [...path, left]);
        addStep(lineMap.getRight, `Right child index of ${index} is ${right}`, index, [], [...path, right]);

        if (left < currentHeapArray.length) {
             addStep(lineMap.checkLeft, `Is left (${left}) in heap and arr[${left}] (${currentHeapArray[left]}) < arr[smallest] (${currentHeapArray[smallest]})?`, left, [], [...path, left]);
            if (currentHeapArray[left] < currentHeapArray[smallest]) {
                smallest = left;
                addStep(lineMap.updateSmallestLeft, `Yes. Update smallest to ${smallest} (left child).`, smallest, [], [...path, smallest]);
            }
        }
        if (right < currentHeapArray.length) {
            addStep(lineMap.checkRight, `Is right (${right}) in heap and arr[${right}] (${currentHeapArray[right]}) < arr[smallest] (${currentHeapArray[smallest]})?`, right, [], [...path, right, smallest]); // smallest might have changed
            if (currentHeapArray[right] < currentHeapArray[smallest]) {
                smallest = right;
                addStep(lineMap.updateSmallestRight, `Yes. Update smallest to ${smallest} (right child).`, smallest, [], [...path, smallest]);
            }
        }
        
        addStep(lineMap.ifSmallestNotIndex, `Is smallest (${smallest}) !== index (${index})?`, index, [], [...path, smallest]);
        if (smallest !== index) {
            path.push(smallest);
            addStep(lineMap.swap, `Yes. Swap arr[${index}] (${currentHeapArray[index]}) with arr[${smallest}] (${currentHeapArray[smallest]})`, smallest, [index, smallest], [...path]);
            [currentHeapArray[index], currentHeapArray[smallest]] = [currentHeapArray[smallest], currentHeapArray[index]];
            addStep(lineMap.swap, `Swapped. Array: [${currentHeapArray.join(',')}]`, smallest, [index, smallest], [...path]);
            index = smallest; // Continue heapifying down from the new position of the swapped element
            addStep(lineMap.recurseHeapifyDown, `Continue heapifyDown from new index ${index}.`, index, [], [...path]);
        } else {
            addStep(lineMap.endIf, `No. Smallest is current index. Heap property holds for this subtree.`, index, [], [...path]);
            break; // Heap property is satisfied for this subtree
        }
    }
    addStep(lineMap.endHeapifyDown, `HeapifyDown for original index finished. Path: ${path.map(i=>currentHeapArray[i]).join('->')}`, undefined, [], [...path]);
  }


  // ---- Operation Dispatch ----
  switch (operation) {
    case 'buildMinHeap':
      lineMap = HEAP_OPERATION_LINE_MAPS.buildMinHeap;
      if (initialArrayString) {
        currentHeapArray = initialArrayString.split(',').map(s=>s.trim()).filter(s=>s!=='').map(Number).filter(n => !isNaN(n));
        heapDataRef.current = [...currentHeapArray]; // Update ref
      }
      addStep(lineMap.func, `Building Min-Heap from: [${currentHeapArray.join(',')}]`);
      if (currentHeapArray.length > 0) {
        const firstNonLeafIndex = Math.floor(currentHeapArray.length / 2) - 1;
        addStep(lineMap.firstNonLeaf, `First non-leaf index: ${firstNonLeafIndex}`);
        for (let i = firstNonLeafIndex; i >= 0; i--) {
          addStep(lineMap.loop, `Calling heapifyDown for index ${i}`, i);
          heapifyDown(i); // Modifies currentHeapArray (via heapDataRef.current)
        }
        addStep(lineMap.endLoop, `Build Min-Heap complete. Heap: [${currentHeapArray.join(',')}]`);
      } else {
        addStep(null, `Build Min-Heap: Array is empty.`);
      }
      break;

    case 'insertMinHeap':
      lineMap = HEAP_OPERATION_LINE_MAPS.insertMinHeap;
      if (value === undefined) {
        addStep(null, "Error: No value provided for insert.");
        break;
      }
      addStep(lineMap.func, `Insert ${value} into Min-Heap.`);
      currentHeapArray.push(value);
      heapDataRef.current = [...currentHeapArray];
      addStep(lineMap.push, `Pushed ${value}. Array: [${currentHeapArray.join(',')}]`, currentHeapArray.length - 1);
      addStep(lineMap.callHeapifyUp, `Calling HeapifyUp for index ${currentHeapArray.length - 1}.`, currentHeapArray.length - 1);
      heapifyUp(currentHeapArray.length - 1);
      addStep(null, `Insert ${value} complete. Heap: [${currentHeapArray.join(',')}]`);
      break;

    case 'extractMin':
      lineMap = HEAP_OPERATION_LINE_MAPS.extractMin;
      addStep(lineMap.func, `Extract Min from Min-Heap.`);
      if (currentHeapArray.length === 0) {
        addStep(lineMap.checkEmpty, "Heap is empty. Cannot extract.");
        break;
      }
      const min = currentHeapArray[0];
      if (currentHeapArray.length === 1) {
        currentHeapArray.pop();
        heapDataRef.current = [...currentHeapArray];
        addStep(lineMap.checkSingle, `Heap has one element. Popped ${min}. Heap: [${currentHeapArray.join(',')}]`);
        break;
      }
      addStep(lineMap.storeMin, `Min element is ${min} (at root).`, 0);
      currentHeapArray[0] = currentHeapArray.pop()!;
      heapDataRef.current = [...currentHeapArray];
      addStep(lineMap.moveLastToRoot, `Moved last element (${currentHeapArray[0]}) to root. Array: [${currentHeapArray.join(',')}]`, 0);
      addStep(lineMap.callHeapifyDown, `Calling HeapifyDown for root (index 0).`, 0);
      heapifyDown(0);
      addStep(lineMap.returnMin, `Extracted ${min}. Heap: [${currentHeapArray.join(',')}]`);
      break;
    
    case 'classDefinition':
        addStep(null, "Displaying Heap class structure. Select an operation.");
        break;
  }
  return localSteps;
};
