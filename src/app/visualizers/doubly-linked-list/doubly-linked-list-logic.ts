
import type { LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';

// Conceptual Line Maps - adjust based on actual code snippets shown
export const DOUBLY_LL_LINE_MAPS: Record<string, Record<string, number>> = {
  insertHead: { start: 1, newNode: 2, emptyCheck: 3, setHeadTail: 4, linkNewNode: 5, updateHead: 6, end: 7 },
  insertTail: { start: 1, newNode: 2, emptyCheck: 3, setHeadTail: 4, linkNewNode: 5, updateTail: 6, end: 7 },
  deleteByValue: { start: 1, loop: 2, checkMatch: 3, updatePrevNext: 4, updateNextPrev: 5, updateHead: 6, updateTail: 7, endFound: 8, endNotFound: 9 },
  traverse: { start: 1, loop: 2, processNode: 3, moveNext: 4, end: 5 }, // Simplified for forward traversal
  init: { start: 1, loop: 2, insertCall: 3, end: 4}
};

const NODE_COLORS = { default: "hsl(var(--secondary))", active: "hsl(var(--primary))", new: "hsl(var(--accent))", head: "hsl(var(--ring))", tail: "hsl(var(--ring))" };

let nodeIdCounter = 1000; // Start from a different range to avoid clashes if sharing panel with SLL
const generateNodeId = (val: string | number) => `dll-node-${val}-${nodeIdCounter++}`;

export function parseDLLInput(input: string): { value: string | number, id: string }[] {
  if (input.trim() === '') return [];
  return input.split(',').map(s => s.trim()).filter(s => s !== '').map(valStr => {
    const num = Number(valStr);
    const value = isNaN(num) ? valStr : num;
    return { value, id: generateNodeId(value) };
  });
}

// This is a simplified visual node creation for DLL. A real step generator would maintain full list structure.
function createVisualDLLNodes(
  parsedNodes: { value: string | number, id: string }[],
  currentHeadId: string | null,
  currentTailId: string | null,
  activeNodeId?: string | null,
  newNodeId?: string | null
): LinkedListNodeVisual[] {
  if (parsedNodes.length === 0) return [];
  
  return parsedNodes.map((pNode, index) => {
    let color = NODE_COLORS.default;
    if (pNode.id === activeNodeId) color = NODE_COLORS.active;
    if (pNode.id === newNodeId) color = NODE_COLORS.new;
    if (pNode.id === currentHeadId) color = NODE_COLORS.head;
    if (pNode.id === currentTailId && currentHeadId !== currentTailId) color = NODE_COLORS.tail; // Avoid double coloring single node

    return {
      id: pNode.id,
      value: pNode.value,
      // For visualization, prev/next are based on array order if not explicitly known from a true list structure
      prevId: index > 0 ? parsedNodes[index - 1].id : null,
      nextId: index < parsedNodes.length - 1 ? parsedNodes[index + 1].id : null,
      color: color,
      isHead: pNode.id === currentHeadId,
      isTail: pNode.id === currentTailId,
    };
  });
}

export const generateDoublyLinkedListSteps = (
  initialListString: string,
  operation: string,
  value?: string | number
): LinkedListAlgorithmStep[] => {
  const localSteps: LinkedListAlgorithmStep[] = [];
  nodeIdCounter = 1000; // Reset
  let currentParsedNodes = parseDLLInput(initialListString);
  let headId: string | null = currentParsedNodes.length > 0 ? currentParsedNodes[0].id : null;
  let tailId: string | null = currentParsedNodes.length > 0 ? currentParsedNodes[currentParsedNodes.length - 1].id : null;
  const lineMap = DOUBLY_LL_LINE_MAPS[operation] || DOUBLY_LL_LINE_MAPS.init;

  const addStep = (line: number, message: string, activeNodeId?: string | null, newNodeId?: string | null, auxPointers?: Record<string, string | null>) => {
    localSteps.push({
      nodes: createVisualDLLNodes(currentParsedNodes, headId, tailId, activeNodeId, newNodeId),
      headId, tailId, currentLine: line, message, auxiliaryPointers: auxPointers, operation,
    });
  };

  addStep(lineMap.start, `Starting ${operation}`);

  switch (operation) {
    case 'init':
      addStep(lineMap.end, `Doubly List initialized: ${initialListString || '(empty)'}`);
      break;
    case 'insertHead':
      if (value === undefined) { addStep(lineMap.end, "Error: Value missing.", undefined, undefined, {status: 'failure'}); break; }
      const newHead = { value, id: generateNodeId(value) };
      addStep(lineMap.newNode, `New node ${value}`, undefined, newHead.id);
      if (!headId) {
        headId = newHead.id; tailId = newHead.id;
        currentParsedNodes = [newHead];
        addStep(lineMap.setHeadTail, `List was empty. ${value} is head & tail.`, headId, newHead.id);
      } else {
        // currentParsedNodes.find(n=>n.id===headId)!.prevId = newHead.id; // This needs actual list manipulation for prevId
        currentParsedNodes = [newHead, ...currentParsedNodes];
        const oldHeadVisualId = headId; // Store for message
        headId = newHead.id;
        addStep(lineMap.linkNewNode, `Linking ${value}. New head.next=${oldHeadVisualId}, oldHead.prev=${headId}`, headId, newHead.id);
        addStep(lineMap.updateHead, `Head updated to ${value}`, headId, newHead.id);
      }
      addStep(lineMap.end, `Inserted ${value} at head.`);
      break;
    // ... Implement other DLL operations similarly, focusing on visualization changes ...
    // For brevity, other operations will be simplified placeholders
     case 'traverse':
        if(!headId) { addStep(lineMap.end, "List empty.", undefined, undefined, {status: 'info'}); break; }
        addStep(lineMap.start, "Traversing list forward.");
        let currentId = headId;
        for(let i=0; i<currentParsedNodes.length; i++){
            if(currentParsedNodes[i].id === currentId) {
                 addStep(lineMap.processNode, `Visiting ${currentParsedNodes[i].value}`, currentId);
                 currentId = (i < currentParsedNodes.length - 1) ? currentParsedNodes[i+1].id : null;
            } else { break; } // Should not happen in simple array backed viz
        }
        addStep(lineMap.end, "Traversal complete.");
        break;
    default:
      addStep(0, `Operation ${operation} visualization not fully implemented for Doubly LL.`);
  }
  return localSteps;
};
