
import type { LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';

export const CIRCULAR_LL_LINE_MAPS: Record<string, Record<string, number>> = {
  insertHead: { start: 1, newNode: 2, emptyCheck: 3, pointToSelf: 4, findTailLoop: 5, linkNewToHead: 6, linkTailToNew: 7, updateHead: 8, end: 9 },
  traverse: { start: 1, emptyCheck: 2, initCurrent: 3, doWhileLoop: 4, processNode: 5, moveNext: 6, loopCondition: 7, end: 8 },
  init: { start: 1, loop: 2, insertCall: 3, end: 4}
};

const NODE_COLORS = { default: "hsl(var(--secondary))", active: "hsl(var(--primary))", new: "hsl(var(--accent))", head: "hsl(var(--ring))" };

let nodeIdCounter = 2000;
const generateNodeId = (val: string | number) => `cll-node-${val}-${nodeIdCounter++}`;

export function parseCLLInput(input: string): { value: string | number, id: string }[] {
    if (input.trim() === '') return [];
    return input.split(',').map(s => s.trim()).filter(s => s !== '').map(valStr => {
        const num = Number(valStr);
        const value = isNaN(num) ? valStr : num;
        return { value, id: generateNodeId(value) };
    });
}

// Simplified visual node creation for CLL. Visualization relies on listType prop in panel.
function createVisualCLLNodes(
  parsedNodes: { value: string | number, id: string }[],
  currentHeadId: string | null,
  activeNodeId?: string | null,
  newNodeId?: string | null
): LinkedListNodeVisual[] {
    if (parsedNodes.length === 0) return [];
    return parsedNodes.map((pNode, index) => ({
        id: pNode.id,
        value: pNode.value,
        nextId: (parsedNodes.length > 0) ? (index < parsedNodes.length - 1 ? parsedNodes[index+1].id : currentHeadId) : null, // Last points to head
        color: pNode.id === activeNodeId ? NODE_COLORS.active : (pNode.id === newNodeId ? NODE_COLORS.new : (pNode.id === currentHeadId ? NODE_COLORS.head : NODE_COLORS.default)),
        isHead: pNode.id === currentHeadId,
    }));
}

export const generateCircularLinkedListSteps = (
  initialListString: string,
  operation: string,
  value?: string | number
): LinkedListAlgorithmStep[] => {
  const localSteps: LinkedListAlgorithmStep[] = [];
  nodeIdCounter = 2000;
  let currentParsedNodes = parseCLLInput(initialListString);
  let headId: string | null = currentParsedNodes.length > 0 ? currentParsedNodes[0].id : null;
  const lineMap = CIRCULAR_LL_LINE_MAPS[operation] || CIRCULAR_LL_LINE_MAPS.init;

  const addStep = (line: number, message: string, activeNodeId?: string | null, newNodeId?: string | null, auxPointers?: Record<string, string | null>) => {
    localSteps.push({
      nodes: createVisualCLLNodes(currentParsedNodes, headId, activeNodeId, newNodeId),
      headId, currentLine: line, message, auxiliaryPointers: auxPointers, operation,
    });
  };
  
  addStep(lineMap.start, `Starting ${operation}`);

  switch(operation) {
    case 'init':
      addStep(lineMap.end, `Circular List initialized: ${initialListString || '(empty)'}`);
      break;
    case 'insertHead':
      if (value === undefined) { addStep(lineMap.end, "Error: Value missing.", undefined, undefined, {status: 'failure'}); break; }
      const newHead = { value, id: generateNodeId(value) };
      addStep(lineMap.newNode, `New node ${value}`, undefined, newHead.id);
      if (!headId) {
        headId = newHead.id;
        currentParsedNodes = [newHead];
        // Visual nodes nextId updated in createVisualCLLNodes to point to self if only node
        addStep(lineMap.pointToSelf, `${value} points to itself. Head is ${value}.`, headId, newHead.id);
      } else {
        const oldHeadVisualId = headId;
        const tailNode = currentParsedNodes[currentParsedNodes.length - 1]; // Assuming currentParsedNodes reflects actual list order for tail finding
        
        currentParsedNodes = [newHead, ...currentParsedNodes];
        headId = newHead.id;

        addStep(lineMap.linkNewToHead, `New node ${value}.next points to old head ${oldHeadVisualId ? currentParsedNodes.find(n=>n.id===oldHeadVisualId)?.value : 'ERROR'}.`, headId, newHead.id);
        // The tail's nextId will be updated by createVisualCLLNodes logic to point to new head.
        addStep(lineMap.linkTailToNew, `Old tail (${tailNode.value}) now points to new head (${value}).`, tailNode.id, newHead.id);
        addStep(lineMap.updateHead, `Head updated to ${value}.`, headId, newHead.id);
      }
      addStep(lineMap.end, `Inserted ${value} at head.`);
      break;
    case 'traverse':
        if(!headId) { addStep(lineMap.end, "List empty.", undefined, undefined, {status: 'info'}); break; }
        addStep(lineMap.start, "Traversing list.");
        let currentId = headId;
        let count = 0; // Safety break
        do {
            const currentNode = currentParsedNodes.find(n => n.id === currentId);
            if (!currentNode || count > currentParsedNodes.length * 2) break;
            addStep(lineMap.processNode, `Visiting ${currentNode.value}`, currentId);
            const nextNodeIndex = (currentParsedNodes.findIndex(n => n.id === currentId) + 1) % currentParsedNodes.length;
            currentId = currentParsedNodes[nextNodeIndex]?.id;
            count++;
        } while (currentId !== headId && currentId !== null);
        if(currentId === headId && currentParsedNodes.length > 0) addStep(lineMap.processNode, `Visiting ${currentParsedNodes.find(n=>n.id===headId)?.value} (back to head)`, headId); // Process head one last time
        addStep(lineMap.end, "Traversal complete.");
        break;
    default:
      addStep(0, `Operation ${operation} viz not fully implemented for Circular LL.`);
  }
  return localSteps;
};
