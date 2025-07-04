
// src/app/visualizers/linked-list-reversal/linked-list-reversal-logic.ts
import type { LinkedListAlgorithmStep, LinkedListNodeVisual } from './types'; // Local import

export const REVERSAL_ITERATIVE_LINE_MAP = {
  funcDeclare: 1,
  initPrev: 2,
  initCurrent: 3,
  initNext: 4,
  whileLoop: 5,
  storeNext: 6,
  reversePointer: 7,
  movePrev: 8,
  moveCurrent: 9,
  loopEnd: 10,
  returnPrev: 11,
};

// Recursive map is more conceptual for visualization steps
export const REVERSAL_RECURSIVE_LINE_MAP = {
  funcDeclare: 1,
  baseCase: 2,
  returnHeadBase: 3,
  recursiveCall: 4,
  reverseLink1: 5, // head.next.next = head
  setNullNext: 6,  // head.next = null
  returnRest: 7,
};

let nodeIdCounter = 3000;
const generateNodeId = (val: string | number) => `llr-node-${val}-${nodeIdCounter++}`;

export function parseListString(input: string): { value: string | number, id: string }[] {
    if (input.trim() === '') return [];
    return input.split(',').map(s => s.trim()).filter(s => s !== '').map(valStr => {
        const num = Number(valStr);
        const value = isNaN(num) ? valStr : num;
        return { value, id: generateNodeId(value) };
    });
}

// Global state for step generation, reset for each call
let localSteps: LinkedListAlgorithmStep[];
let listNodes: Map<string, { value: string | number, nextId: string | null }>;
let headId: string | null;

function createVisualNodesFromCurrentState(
  auxPointers: Record<string, string | null> = {}
): LinkedListNodeVisual[] {
  const visualNodes: LinkedListNodeVisual[] = [];
  let currentId = headId;
  const visited = new Set<string>();

  // This part of the logic handles the rendering of nodes that are still part of the "forward" list
  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    const nodeData = listNodes.get(currentId);
    if (!nodeData) break;
    visualNodes.push({
      id: currentId,
      value: nodeData.value,
      nextId: nodeData.nextId,
      isHead: currentId === headId,
    });
    currentId = nodeData.nextId;
  }
  
  // This part handles rendering nodes that are already reversed and pointed to by 'prev'
  let prevPtr = auxPointers.prev;
  while(prevPtr && !visited.has(prevPtr)) {
      visited.add(prevPtr);
      const nodeData = listNodes.get(prevPtr);
      if(!nodeData) break;
      visualNodes.unshift({ // Add to the beginning to maintain visual order
          id: prevPtr,
          value: nodeData.value,
          nextId: nodeData.nextId,
          isHead: prevPtr === headId,
      });
      prevPtr = nodeData.nextId;
  }

  // Assign colors and positions based on final arrangement
  return visualNodes.map((node, index) => {
    let color = "hsl(var(--secondary))";
    let textColor = "hsl(var(--secondary-foreground))";
    if (auxPointers.current === node.id) { color = "hsl(var(--primary))"; textColor = "hsl(var(--primary-foreground))"; }
    else if (auxPointers.prev === node.id) { color = "hsl(var(--accent))"; textColor = "hsl(var(--accent-foreground))"; }
    else if (auxPointers.nextNode === node.id) { color = "hsl(var(--ring))"; textColor = "hsl(var(--primary-foreground))";}
    else if (node.isHead) { color = "hsl(var(--ring))"; textColor = "hsl(var(--primary-foreground))"; }
    
    return {
        ...node,
        color, textColor,
        x: 20 + index * 80,
        y: 100
    };
  });
}

function addStep(
  line: number,
  message: string,
  auxPointers: Record<string, string | null> = {},
  opStatus?: 'success' | 'failure' | 'info'
) {
  localSteps.push({
    nodes: createVisualNodesFromCurrentState(auxPointers),
    headId: headId,
    currentLine: line,
    message,
    auxiliaryPointers: auxPointers,
    operation: 'reversal',
    status: opStatus,
  });
}

function generateIterativeSteps() {
    const lm = REVERSAL_ITERATIVE_LINE_MAP;
    addStep(lm.funcDeclare, "Start iterative reversal.", { head: headId });
    
    let prev: string | null = null;
    let current: string | null = headId;
    let nextNode: string | null = null;

    addStep(lm.initPrev, "Initialize prev = null.", { head: headId, current, prev, nextNode });
    addStep(lm.initCurrent, "Initialize current = head.", { head: headId, current, prev, nextNode });
    addStep(lm.initNext, "Initialize nextNode = null.", { head: headId, current, prev, nextNode });

    while (current !== null) {
      addStep(lm.whileLoop, `Loop: current is ${listNodes.get(current)?.value || 'null'}`, { head: headId, current, prev, nextNode });
      
      const currentData = listNodes.get(current)!;
      nextNode = currentData.nextId;
      addStep(lm.storeNext, `Store nextNode = current.next (${nextNode ? listNodes.get(nextNode)?.value : 'null'})`, { head: headId, current, prev, nextNode });
      
      currentData.nextId = prev;
      addStep(lm.reversePointer, `Reverse pointer: current.next = prev (${prev ? listNodes.get(prev)?.value : 'null'})`, { head: headId, current, prev, nextNode });
      
      prev = current;
      addStep(lm.movePrev, `Move prev forward. prev is now ${listNodes.get(prev)?.value}.`, { head: headId, current, prev, nextNode });
      
      current = nextNode;
      addStep(lm.moveCurrent, `Move current forward. current is now ${current ? listNodes.get(current)?.value : 'null'}.`, { head: headId, current, prev, nextNode });
    }
    addStep(lm.loopEnd, "Loop finished. current is null.", { head: headId, current, prev, nextNode });
    
    headId = prev; 
    addStep(lm.returnPrev, `New head is prev (${headId ? listNodes.get(headId)?.value : 'null'}). Reversal complete.`, { head: headId }, 'success');
}

function generateRecursiveSteps() {
    const lm = REVERSAL_RECURSIVE_LINE_MAP;
    
    function reverseRecursiveHelper(currentRecursiveHeadId: string | null, depth: number = 0): string | null {
        const currentRecNodeVal = currentRecursiveHeadId ? listNodes.get(currentRecursiveHeadId)?.value : 'null';
        addStep(lm.funcDeclare, `Call reverse(head=${currentRecNodeVal}) at depth ${depth}`, { currentRecHead: currentRecursiveHeadId, head_val: currentRecNodeVal });
        
        const currentRecursiveNodeData = currentRecursiveHeadId ? listNodes.get(currentRecursiveHeadId) : null;

        if (!currentRecursiveHeadId || !currentRecursiveNodeData || !currentRecursiveNodeData.nextId) {
            addStep(lm.baseCase, `Base case: head (${currentRecNodeVal}) or head.next is null.`, { currentRecHead: currentRecursiveHeadId, head_val: currentRecNodeVal });
            addStep(lm.returnHeadBase, `Return new head: ${currentRecNodeVal}.`, { newHeadFromBase: currentRecursiveHeadId, head_val: currentRecNodeVal });
            return currentRecursiveHeadId;
        }

        const nextNodeForRecCallId = currentRecursiveNodeData.nextId;
        const nextNodeForRecCallVal = listNodes.get(nextNodeForRecCallId)?.value;
        addStep(lm.recursiveCall, `Recursive call: reverse(head.next -> node ${nextNodeForRecCallVal})`, { currentRecHead: currentRecursiveHeadId, nextRecCall: nextNodeForRecCallId, head_val: currentRecNodeVal, next_val: nextNodeForRecCallVal });
        const restId = reverseRecursiveHelper(nextNodeForRecCallId, depth + 1);

        const originalNextNodeData = listNodes.get(nextNodeForRecCallId)!;
        originalNextNodeData.nextId = currentRecursiveHeadId; 
        listNodes.set(nextNodeForRecCallId, originalNextNodeData); 
        addStep(lm.reverseLink1, `Reverse link: (${nextNodeForRecCallVal}).next now points to (${currentRecNodeVal}).`, { currentRecHead: currentRecursiveHeadId, newTailOfRest: nextNodeForRecCallId, head_val: currentRecNodeVal, next_val: nextNodeForRecCallVal });

        currentRecursiveNodeData.nextId = null; 
        listNodes.set(currentRecursiveHeadId, currentRecursiveNodeData); 
        addStep(lm.setNullNext, `Set (${currentRecNodeVal}).next to null (becomes new tail or intermediate tail).`, { currentRecHead: currentRecursiveHeadId, head_val: currentRecNodeVal });
        
        const restVal = restId ? listNodes.get(restId)?.value : 'null';
        addStep(lm.returnRest, `Return new head of reversed sublist: ${restVal}.`, { propagatedHead: restId, head_val: restVal });
        return restId;
    }

    addStep(lm.funcDeclare, "Start recursive reversal.", { head: headId });
    headId = reverseRecursiveHelper(headId);
    const finalHeadVal = headId ? listNodes.get(headId)?.value : 'null';
    addStep(lm.returnRest, `Recursive reversal complete. Final new head is ${finalHeadVal}.`, { head: headId }, 'success');
}


export const generateLinkedListReversalSteps = (
  initialListString: string,
  type: 'iterative' | 'recursive'
): LinkedListAlgorithmStep[] => {
  localSteps = [];
  nodeIdCounter = 3000; 
  const parsedInitialNodes = parseListString(initialListString);
  
  listNodes = new Map<string, { value: string | number; nextId: string | null }>();
  parsedInitialNodes.forEach((pNode, index) => {
    listNodes.set(pNode.id, {
      value: pNode.value,
      nextId: index < parsedInitialNodes.length - 1 ? parsedInitialNodes[index + 1].id : null,
    });
  });
  headId = parsedInitialNodes.length > 0 ? parsedInitialNodes[0].id : null;

  if (type === 'iterative') {
    generateIterativeSteps();
  } else {
    generateRecursiveSteps();
  }
  
  return localSteps;
};