
import type { LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';

export const CYCLE_DETECTION_LINE_MAP = {
  funcDeclare: 1,
  emptyOrSingleCheck: 2,
  returnFalseEmpty: 3,
  initSlow: 4,
  initFast: 5,
  whileLoop: 6,
  moveSlow: 7,
  moveFast: 8,
  checkMeet: 9,
  returnTrueCycle: 10,
  returnFalseNoCycle: 11,
};

let nodeIdCounter = 4000;
const generateNodeId = (val: string | number) => `llcd-node-${val}-${nodeIdCounter++}`;

export function parseListStringWithCycle(input: string, cycleConnectsToValue?: string | number): { nodes: { value: string | number, id: string }[], headId: string | null, actualCycleNodeId: string | null } {
    if (input.trim() === '') return { nodes: [], headId: null, actualCycleNodeId: null };
    const parsedNodes = input.split(',').map(s => s.trim()).filter(s => s !== '').map(valStr => {
        const num = Number(valStr);
        const value = isNaN(num) ? valStr : num;
        return { value, id: generateNodeId(value) };
    });

    let actualCycleNodeId: string | null = null;
    if (cycleConnectsToValue !== undefined && parsedNodes.length > 0) {
        const cycleTargetNode = parsedNodes.find(n => n.value == cycleConnectsToValue); // Use == for type flexibility
        if (cycleTargetNode) {
            actualCycleNodeId = cycleTargetNode.id;
        }
    }
    return { nodes: parsedNodes, headId: parsedNodes.length > 0 ? parsedNodes[0].id : null, actualCycleNodeId };
}

function createVisualNodesForCycleDetection(
  parsedNodes: { value: string | number, id: string }[],
  actualList: Map<string, { value: string | number, nextId: string | null }>, // The true list structure
  currentHeadId: string | null,
  slowId: string | null,
  fastId: string | null
): LinkedListNodeVisual[] {
  const visualNodes: LinkedListNodeVisual[] = [];
  const renderedIds = new Set<string>();

  let currentRenderId = currentHeadId;
  let positionX = 0; // Simple X positioning for now

  // Render the main chain first
  while(currentRenderId && !renderedIds.has(currentRenderId) && positionX < parsedNodes.length * 2) { // Limit rendering length
    renderedIds.add(currentRenderId);
    const nodeData = actualList.get(currentRenderId);
    if(!nodeData) break;

    visualNodes.push({
      id: currentRenderId,
      value: nodeData.value,
      nextId: nodeData.nextId,
      color: "hsl(var(--secondary))",
      isHead: currentRenderId === currentHeadId,
      isSlow: currentRenderId === slowId,
      isFast: currentRenderId === fastId,
      x: 20 + positionX * 80, // Adjust spacing as needed
      y: 100,
    });
    currentRenderId = nodeData.nextId;
    positionX++;
  }
  
  // If there's a cycle and the fast pointer is on a node not yet rendered (part of the cycle deeper in)
  // This part is tricky for a simple linear layout, real cycle visualization needs graph layout
  if(fastId && !renderedIds.has(fastId) && actualList.has(fastId)){
     const fastNodeData = actualList.get(fastId)!;
      visualNodes.push({
        id: fastId, value: fastNodeData.value, nextId: fastNodeData.nextId,
        color: "hsl(var(--secondary))", isFast: true,
        x: 20 + positionX * 80, y: 100
      });
  }


  return visualNodes;
}


export const generateCycleDetectionSteps = (
  listString: string,
  cycleConnectsToValue?: string | number
): LinkedListAlgorithmStep[] => {
  const localSteps: LinkedListAlgorithmStep[] = [];
  nodeIdCounter = 4000;
  const { nodes: parsedNodes, headId: initialHeadId, actualCycleNodeId } = parseListStringWithCycle(listString, cycleConnectsToValue);

  const listNodesMap = new Map<string, { value: string | number, nextId: string | null }>();
  parsedNodes.forEach((pNode, index) => {
    listNodesMap.set(pNode.id, {
      value: pNode.value,
      nextId: index < parsedNodes.length - 1 ? parsedNodes[index + 1].id : (actualCycleNodeId || null),
    });
  });
  
  let headId = initialHeadId;

  const addStep = (line: number, message: string, slowId: string | null, fastId: string | null, cycleDetected?: boolean) => {
    localSteps.push({
      nodes: createVisualNodesForCycleDetection(parsedNodes, listNodesMap, headId, slowId, fastId),
      headId, currentLine: line, message,
      auxiliaryPointers: { slow: slowId, fast: fastId },
      isCycleDetected: cycleDetected,
      operation: 'detectCycle',
    });
  };

  const lm = CYCLE_DETECTION_LINE_MAP;
  addStep(lm.funcDeclare, "Start Cycle Detection (Floyd's)", headId, headId);

  if (!headId || !listNodesMap.get(headId)?.nextId) {
    addStep(lm.emptyOrSingleCheck, "List is empty or has only one node.", null, null);
    addStep(lm.returnFalseEmpty, "No cycle possible. Return false.", null, null, false);
    return localSteps;
  }

  let slow = headId;
  let fast = headId;
  addStep(lm.initSlow, "Initialize slow pointer to head.", slow, fast);
  addStep(lm.initFast, "Initialize fast pointer to head.", slow, fast);

  let iterations = 0; // Safety break for visualization
  const maxIterations = parsedNodes.length * 3; 

  while (fast !== null && listNodesMap.get(fast)?.nextId !== null && iterations < maxIterations) {
    const fastNodeData = listNodesMap.get(fast)!;
    const fastNextNodeData = listNodesMap.get(fastNodeData.nextId!)
    
    addStep(lm.whileLoop, `Loop: Fast is ${fastNodeData.value}, Fast.next is ${fastNextNodeData ? fastNextNodeData.value : 'null'}`, slow, fast);
    
    slow = listNodesMap.get(slow!)!.nextId;
    addStep(lm.moveSlow, `Move slow to ${slow ? listNodesMap.get(slow)?.value : 'null'}`, slow, fast);

    fast = fastNextNodeData ? fastNextNodeData.nextId : null; // fast moves two steps
    addStep(lm.moveFast, `Move fast to ${fast ? listNodesMap.get(fast)?.value : 'null'}`, slow, fast);

    if (slow !== null && slow === fast) {
      addStep(lm.checkMeet, "Slow and Fast pointers met!", slow, fast);
      addStep(lm.returnTrueCycle, "Cycle detected! Return true.", slow, fast, true);
      return localSteps;
    }
    addStep(lm.checkMeet, "Pointers did not meet yet.", slow, fast);
    iterations++;
  }
    if (iterations >= maxIterations) {
       addStep(lm.returnFalseNoCycle, "Max iterations reached (safety break). Assuming no cycle or very long list.", slow, fast, false);
    } else {
       addStep(lm.returnFalseNoCycle, "Fast pointer reached end. No cycle. Return false.", slow, fast, false);
    }
  return localSteps;
};
