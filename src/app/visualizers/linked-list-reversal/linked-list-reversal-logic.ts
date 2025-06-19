
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

function createVisualNodesFromState(
  nodeMap: Map<string, { value: string | number, nextId: string | null }>,
  currentHeadId: string | null,
  auxPointers: Record<string, string | null> = {}
): LinkedListNodeVisual[] {
  const visualNodes: LinkedListNodeVisual[] = [];
  let currentId = currentHeadId;
  const visited = new Set<string>();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    const nodeData = nodeMap.get(currentId);
    if (!nodeData) break;

    let color = "hsl(var(--secondary))";
    if (auxPointers.current === currentId) color = "hsl(var(--primary))";
    if (auxPointers.prev === currentId) color = "hsl(var(--accent))";
    if (auxPointers.nextNode === currentId) color = "hsl(var(--ring))";


    visualNodes.push({
      id: currentId,
      value: nodeData.value,
      nextId: nodeData.nextId,
      color: color,
      isHead: currentId === currentHeadId,
    });
    currentId = nodeData.nextId;
  }
  if(visualNodes.length === 0 && nodeMap.size > 0 && currentHeadId === null) {
      // This can happen if head is null after reversal completion
  }
  return visualNodes;
}


export const generateLinkedListReversalSteps = (
  initialListString: string,
  type: 'iterative' | 'recursive'
): LinkedListAlgorithmStep[] => {
  const localSteps: LinkedListAlgorithmStep[] = [];
  nodeIdCounter = 3000; // Reset counter
  const parsedInitialNodes = parseListString(initialListString);
  
  const listNodes = new Map<string, { value: string | number, nextId: string | null }>();
  parsedInitialNodes.forEach((pNode, index) => {
    listNodes.set(pNode.id, {
      value: pNode.value,
      nextId: index < parsedInitialNodes.length - 1 ? parsedInitialNodes[index + 1].id : null,
    });
  });
  let headId: string | null = parsedInitialNodes.length > 0 ? parsedInitialNodes[0].id : null;

  const addStep = (line: number, message: string, currentAuxPointers?: Record<string, string | null>) => {
    localSteps.push({
      nodes: createVisualNodesFromState(listNodes, headId, currentAuxPointers),
      headId: headId,
      currentLine: line,
      message,
      auxiliaryPointers: currentAuxPointers,
      operation: `reversal-${type}`,
    });
  };

  if (type === 'iterative') {
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
      addStep(lm.reversePointer, `Reverse: current.next = prev (${prev ? listNodes.get(prev)?.value : 'null'})`, { head: headId, current, prev, nextNode });
      
      prev = current;
      addStep(lm.movePrev, `Move prev = current (${listNodes.get(prev)?.value})`, { head: headId, current, prev, nextNode });
      
      current = nextNode;
      addStep(lm.moveCurrent, `Move current = nextNode (${current ? listNodes.get(current)?.value : 'null'})`, { head: headId, current, prev, nextNode });
    }
    addStep(lm.loopEnd, "Loop finished. current is null.", { head: headId, current, prev, nextNode });
    
    headId = prev; 
    addStep(lm.returnPrev, `New head is prev (${headId ? listNodes.get(headId)?.value : 'null'}). Reversal complete.`, { head: headId });

  } else { 
    const lm = REVERSAL_RECURSIVE_LINE_MAP;
    
    function reverseRecursiveHelper(currentRecursiveHeadId: string | null): string | null {
        addStep(lm.funcDeclare, `Call reverseRecursive(${currentRecursiveHeadId ? listNodes.get(currentRecursiveHeadId)?.value : 'null'})`, { currentRecHead: currentRecursiveHeadId });
        
        const currentRecursiveNodeData = currentRecursiveHeadId ? listNodes.get(currentRecursiveHeadId) : null;

        if (!currentRecursiveHeadId || !currentRecursiveNodeData || !currentRecursiveNodeData.nextId) {
            addStep(lm.baseCase, `Base case: head or head.next is null.`, { currentRecHead: currentRecursiveHeadId });
            addStep(lm.returnHeadBase, `Return current head: ${currentRecursiveHeadId ? listNodes.get(currentRecursiveHeadId)?.value : 'null'}`, { newHeadFromBase: currentRecursiveHeadId });
            return currentRecursiveHeadId;
        }

        const nextNodeForRecCallId = currentRecursiveNodeData.nextId;
        addStep(lm.recursiveCall, `Recursive call: reverseRecursive(${listNodes.get(nextNodeForRecCallId)?.value})`, { currentRecHead: currentRecursiveHeadId, nextRecCall: nextNodeForRecCallId });
        const restId = reverseRecursiveHelper(nextNodeForRecCallId); 

        const originalNextNodeData = listNodes.get(nextNodeForRecCallId)!;
        originalNextNodeData.nextId = currentRecursiveHeadId; 
         listNodes.set(nextNodeForRecCallId, originalNextNodeData); 
        addStep(lm.reverseLink1, `head.next.next = head ((${listNodes.get(nextNodeForRecCallId)?.value}).next = ${listNodes.get(currentRecursiveHeadId)?.value})`, { currentRecHead: currentRecursiveHeadId, newTailOfRest: nextNodeForRecCallId });

        currentRecursiveNodeData.nextId = null; 
        listNodes.set(currentRecursiveHeadId, currentRecursiveNodeData); 
        addStep(lm.setNullNext, `head.next = null ((${listNodes.get(currentRecursiveHeadId)?.value}).next = null)`, { currentRecHead: currentRecursiveHeadId });
        
        addStep(lm.returnRest, `Return new head of reversed list: ${restId ? listNodes.get(restId)?.value : 'null'}`, { propagatedHead: restId });
        return restId;
    }

    headId = reverseRecursiveHelper(headId);
    addStep(lm.funcDeclare, "Recursive reversal complete.", { head: headId });
  }
  return localSteps;
};
