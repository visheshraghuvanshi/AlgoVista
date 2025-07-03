import type { LinkedListAlgorithmStep, LinkedListNodeVisual } from './types';

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

function createVisualNodes(
  listMap: Map<string, { value: string | number, nextId: string | null }>,
  headId: string | null,
  slowId: string | null,
  fastId: string | null,
  isMeetingPoint: boolean = false
): LinkedListNodeVisual[] {
  const visualNodes: LinkedListNodeVisual[] = [];
  let currentId = headId;
  const visited = new Set<string>(); 

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    const nodeData = listMap.get(currentId);
    if (!nodeData) break;

    visualNodes.push({
      id: currentId,
      value: nodeData.value,
      nextId: nodeData.nextId,
      isHead: currentId === headId,
      isSlow: currentId === slowId,
      isFast: currentId === fastId,
      isMeetingPoint: isMeetingPoint && currentId === slowId,
    });
    currentId = nodeData.nextId;
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
  
  const headId = initialHeadId;

  const addStep = (line: number | null, message: string, slowId: string | null, fastId: string | null, cycleDetected?: boolean) => {
    localSteps.push({
      nodes: createVisualNodes(listNodesMap, headId, slowId, fastId, cycleDetected),
      headId,
      actualCycleNodeId,
      currentLine: line,
      message,
      auxiliaryPointers: { slow: slowId, fast: fastId },
      isCycleDetected: cycleDetected,
    });
  };

  const lm = CYCLE_DETECTION_LINE_MAP;
  addStep(lm.funcDeclare, "Start Cycle Detection (Floyd's Algorithm).", null, null);

  if (!headId || !listNodesMap.get(headId)?.nextId) {
    addStep(lm.emptyOrSingleCheck, "List is empty or has only one node.", null, null, false);
    addStep(lm.returnFalseEmpty, "No cycle possible. Return false.", null, null, false);
    return localSteps;
  }

  let slow = headId;
  let fast = headId;
  addStep(lm.initSlow, "Initialize 'slow' pointer to head.", slow, fast);
  addStep(lm.initFast, "Initialize 'fast' pointer to head.", slow, fast);

  let iterations = 0;
  const maxIterations = parsedNodes.length * 2 + 5;

  while (fast !== null && listNodesMap.get(fast)?.nextId !== null && iterations < maxIterations) {
    iterations++;
    const fastNodeData = listNodesMap.get(fast)!;
    const fastNextNodeData = listNodesMap.get(fastNodeData.nextId!);
    addStep(lm.whileLoop, `Loop continues: fast is at ${fastNodeData.value}, fast.next is at ${fastNextNodeData?.value ?? 'null'}.`, slow, fast);
    
    slow = listNodesMap.get(slow!)!.nextId;
    addStep(lm.moveSlow, `Move slow by 1 step to ${slow ? listNodesMap.get(slow)?.value : 'null'}.`, slow, fast);

    fast = fastNextNodeData ? fastNextNodeData.nextId : null;
    addStep(lm.moveFast, `Move fast by 2 steps to ${fast ? listNodesMap.get(fast)?.value : 'null'}.`, slow, fast);

    addStep(lm.checkMeet, `Check if slow (${slow ? listNodesMap.get(slow)?.value : 'null'}) == fast (${fast ? listNodesMap.get(fast)?.value : 'null'}).`, slow, fast);
    if (slow !== null && slow === fast) {
      addStep(lm.returnTrueCycle, "Pointers met! Cycle detected.", slow, fast, true);
      return localSteps;
    }
  }
  
  if (iterations >= maxIterations) {
    addStep(lm.returnFalseNoCycle, "Max iterations reached. Assuming no cycle or error.", slow, fast, false);
  } else {
    addStep(lm.returnFalseNoCycle, "Fast pointer reached the end of the list. No cycle found.", slow, fast, false);
  }
  return localSteps;
};
