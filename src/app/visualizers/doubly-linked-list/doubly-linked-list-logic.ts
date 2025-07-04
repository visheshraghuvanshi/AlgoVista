
import type { LinkedListAlgorithmStep, LinkedListNodeVisual } from './types'; // Local import

// Conceptual Line Maps - adjust based on actual code snippets shown
export const DOUBLY_LL_LINE_MAPS: Record<string, Record<string, number>> = {
  insertHead: { start: 1, newNode: 2, emptyCheck: 3, setHeadTail: 4, linkNewNode: 5, updateHead: 6, end: 7 },
  insertTail: { start: 1, newNode: 2, emptyCheck: 3, setHeadTail: 4, linkNewNode: 5, updateTail: 6, end: 7 },
  insertAtPosition: {
    func: 1, newNode: 2, posZeroCheck: 3, initTraverse: 4, traverseLoop: 5,
    linkMiddle: 6, linkNewPrev: 7, linkNewNext: 8, linkCurrentPrev: 9, linkPrevNext: 10,
    updateTailAtEnd: 11, posNotFound: 12, end: 13,
  },
  deleteByValue: { 
    start: 1, loop: 2, checkMatch: 3, 
    updatePrevNext: 4, updateNextPrev: 5, 
    updateHead: 6, updateTail: 7, 
    endFound: 8, endNotFound: 9 
  },
  deleteAtPosition: {
    func: 1, emptyCheck: 2, posZeroCheck: 3, // delete head
    initTraverse: 4, traverseLoop: 5,
    deleteNode: 6, // prev.next = current.next; if current.next, current.next.prev = prev
    updateTailIfDeleted: 7, posNotFound: 8, end: 9,
  },
  traverse: { start: 1, loop: 2, processNode: 3, moveNext: 4, end: 5 }, 
  init: { start: 1, loop: 2, insertCall: 3, end: 4}
};

const NODE_COLORS = { default: "hsl(var(--secondary))", active: "hsl(var(--primary))", new: "hsl(var(--accent))", head: "hsl(var(--ring))", tail: "hsl(var(--ring))" };

let nodeIdCounter = 1000; 
const generateNodeId = (val: string | number) => `dll-node-${String(val).replace(/\s/g, '_')}-${nodeIdCounter++}`;

export function parseDLLInput(input: string): { value: string | number, id: string }[] {
  if (input.trim() === '') return [];
  return input.split(',').map(s => s.trim()).filter(s => s !== '').map(valStr => {
    const num = Number(valStr);
    const value = isNaN(num) ? valStr : num;
    return { value, id: generateNodeId(value) };
  });
}

function createVisualDLLNodes(
  actualListMap: Map<string, { value: string | number, nextId: string | null, prevId: string | null }>,
  currentHeadId: string | null,
  currentTailId: string | null,
  activeNodeId?: string | null,
  newNodeId?: string | null
): LinkedListNodeVisual[] {
  const visualNodes: LinkedListNodeVisual[] = [];
  let currentId = currentHeadId;
  const visitedForRender = new Set<string>();

  while(currentId && !visitedForRender.has(currentId)){
    visitedForRender.add(currentId);
    const nodeData = actualListMap.get(currentId);
    if(!nodeData) break;

    let color = NODE_COLORS.default;
    if (currentId === activeNodeId) color = NODE_COLORS.active;
    if (currentId === newNodeId) color = NODE_COLORS.new;
    if (currentId === currentHeadId && currentId === currentTailId) color = NODE_COLORS.head;
    else if (currentId === currentHeadId) color = NODE_COLORS.head;
    else if (currentId === currentTailId) color = NODE_COLORS.tail;


    visualNodes.push({
      id: currentId,
      value: nodeData.value,
      prevId: nodeData.prevId,
      nextId: nodeData.nextId,
      color: color,
      isHead: currentId === currentHeadId,
      isTail: currentId === currentTailId,
    });
    currentId = nodeData.nextId;
  }
  return visualNodes;
}

export const generateDoublyLinkedListSteps = (
  initialListString: string,
  operation: string,
  value?: string | number,
  position?: number // For insert/delete at position
): LinkedListAlgorithmStep[] => {
  const localSteps: LinkedListAlgorithmStep[] = [];
  nodeIdCounter = 1000; 
  const initialParsed = parseDLLInput(initialListString);
  
  const actualListNodes = new Map<string, { value: string | number; nextId: string | null; prevId: string | null }>();
  let headId: string | null = null;
  let tailId: string | null = null;

  if (initialParsed.length > 0) {
    headId = initialParsed[0].id;
    tailId = initialParsed[initialParsed.length - 1].id;
    initialParsed.forEach((pNode, index) => {
      actualListNodes.set(pNode.id, {
        value: pNode.value,
        nextId: index < initialParsed.length - 1 ? initialParsed[index + 1].id : null,
        prevId: index > 0 ? initialParsed[index - 1].id : null,
      });
    });
  }
  
  const lineMap = DOUBLY_LL_LINE_MAPS[operation] || DOUBLY_LL_LINE_MAPS.init;

  const addStep = (line: number, message: string, activeNodeId?: string | null, newNodeId?: string | null, auxPointers?: Record<string, string | null>, opStatus?: 'success' | 'failure' | 'info') => {
    localSteps.push({
      nodes: createVisualDLLNodes(actualListNodes, headId, tailId, activeNodeId, newNodeId),
      headId, tailId, currentLine: line, message, auxiliaryPointers: auxPointers, operation, status: opStatus,
    });
  };

  let currentOpMessage = `Starting ${operation}`;
  if(value !== undefined) currentOpMessage += ` with value ${value}`;
  if(position !== undefined) currentOpMessage += ` at position ${position}`;
  addStep(lineMap.start || 0, currentOpMessage);


  switch (operation) {
    case 'init':
      addStep(lineMap.end, `Doubly List initialized: ${initialListString || '(empty)'}. Head: ${headId ? actualListNodes.get(headId)?.value : 'null'}, Tail: ${tailId ? actualListNodes.get(tailId)?.value : 'null'}.`, undefined, undefined, {head: headId, tail: tailId}, 'info');
      break;
    case 'insertHead':
      if (value === undefined) { addStep(lineMap.end, "Error: Value missing.", undefined, undefined, undefined, 'failure'); break; }
      const newHeadNodeId = generateNodeId(value);
      addStep(lineMap.newNode, `New node ${value}`, undefined, newHeadNodeId);
      actualListNodes.set(newHeadNodeId, { value, nextId: headId, prevId: null });
      if (headId) {
        actualListNodes.get(headId)!.prevId = newHeadNodeId;
      } else { // List was empty
        tailId = newHeadNodeId; 
      }
      headId = newHeadNodeId;
      addStep(lineMap.linkNewNode, `Linking node. Head is now ${value}. ${tailId ? `Tail: ${actualListNodes.get(tailId)?.value}` : ''}`, headId, newHeadNodeId, {head: headId, tail: tailId}, 'success');
      break;
    case 'insertTail':
      if (value === undefined) { addStep(lineMap.end, "Error: Value missing.", undefined, undefined, undefined, 'failure'); break; }
      const newTailNodeId = generateNodeId(value);
      addStep(lineMap.newNode, `New node ${value}`, undefined, newTailNodeId);
      actualListNodes.set(newTailNodeId, {value, nextId: null, prevId: tailId });
      if(tailId) {
        actualListNodes.get(tailId)!.nextId = newTailNodeId;
      } else { // List was empty
        headId = newTailNodeId;
      }
      tailId = newTailNodeId;
      addStep(lineMap.linkNewNode, `Linking node. ${headId ? `Head: ${actualListNodes.get(headId)?.value}` : ''}. Tail is now ${value}`, tailId, newTailNodeId, {head: headId, tail: tailId}, 'success');
      break;
    case 'insertAtPosition':
      if (value === undefined || position === undefined) { addStep(lineMap.end, "Error: Value or position missing.", undefined, undefined, undefined, 'failure'); break; }
      if (position < 0) { addStep(lineMap.end, "Error: Position cannot be negative.", undefined, undefined, undefined, 'failure'); break; }

      const newNodeAtPosId = generateNodeId(value);
      addStep(lineMap.newNode, `New node ${value} for position ${position}.`, undefined, newNodeAtPosId);
      actualListNodes.set(newNodeAtPosId, {value, nextId: null, prevId: null});

      if (position === 0) { 
        actualListNodes.get(newNodeAtPosId)!.nextId = headId;
        if (headId) actualListNodes.get(headId)!.prevId = newNodeAtPosId;
        else tailId = newNodeAtPosId; 
        headId = newNodeAtPosId;
        addStep(lineMap.end, `Inserted ${value} at head (position 0).`, headId, newNodeAtPosId, {head:headId, tail:tailId}, 'success');
      } else {
        let current = headId;
        let count = 0;
        while (current && count < position) { current = actualListNodes.get(current)!.nextId; count++; }
        
        if (current) { // Insert before current
          const prevNodeId = actualListNodes.get(current)!.prevId;
          actualListNodes.get(newNodeAtPosId)!.nextId = current;
          actualListNodes.get(newNodeAtPosId)!.prevId = prevNodeId;
          actualListNodes.get(current)!.prevId = newNodeAtPosId;
          if (prevNodeId) actualListNodes.get(prevNodeId)!.nextId = newNodeAtPosId;
          else headId = newNodeAtPosId; 
           addStep(lineMap.end, `Inserted ${value} at position ${position}.`, current, newNodeAtPosId, {head:headId, tail:tailId}, 'success');
        } else if (count === position) { // Insert at tail
          if (tailId) actualListNodes.get(tailId)!.nextId = newNodeAtPosId;
          else headId = newNodeAtPosId; 
          actualListNodes.get(newNodeAtPosId)!.prevId = tailId;
          tailId = newNodeAtPosId;
          addStep(lineMap.end, `Inserted ${value} at tail (position ${count}).`, tailId, newNodeAtPosId, {head:headId, tail:tailId}, 'success');
        } else {
            addStep(lineMap.posNotFound, `Position ${position} out of bounds. Cannot insert.`, undefined, undefined, {head:headId, tail:tailId}, 'failure');
            actualListNodes.delete(newNodeAtPosId);
        }
      }
      break;
    case 'deleteAtPosition':
      if (position === undefined) { addStep(lineMap.end, "Error: Position missing.", undefined,undefined,undefined,'failure'); break; }
      if (!headId) { addStep(lineMap.emptyCheck, "List empty.", undefined,undefined,undefined,'failure'); break; }
      if (position < 0 ) { addStep(lineMap.end, "Error: Position negative.", undefined,undefined,undefined,'failure'); break; }

      let nodeToDeleteId: string | null = headId;
      for(let i=0; i < position && nodeToDeleteId; i++) {
        nodeToDeleteId = actualListNodes.get(nodeToDeleteId)?.nextId || null;
      }

      if (nodeToDeleteId) {
        const nodeToDelete = actualListNodes.get(nodeToDeleteId)!;
        addStep(lineMap.deleteNode, `Node to delete: ${nodeToDelete.value} at position ${position}.`, nodeToDeleteId);
        const prevId = nodeToDelete.prevId;
        const nextId = nodeToDelete.nextId;
        if (prevId) actualListNodes.get(prevId)!.nextId = nextId;
        else headId = nextId; 
        if (nextId) actualListNodes.get(nextId)!.prevId = prevId;
        else tailId = prevId; 
        actualListNodes.delete(nodeToDeleteId);
        addStep(lineMap.end, `Deleted node at position ${position}. Head: ${headId?actualListNodes.get(headId)?.value:'null'}, Tail: ${tailId?actualListNodes.get(tailId)?.value:'null'}.`, headId || tailId, undefined, {head:headId, tail:tailId}, 'success');
      } else {
         addStep(lineMap.posNotFound, `Position ${position} out of bounds. Nothing deleted.`, undefined,undefined,{head:headId, tail:tailId}, 'failure');
      }
      break;

    case 'deleteByValue':
      if (value === undefined) { addStep(lineMap.end, "Error: Value missing.",undefined,undefined,{head:headId, tail:tailId},'failure'); break; }
      if (!headId) { addStep(lineMap.emptyCheck, "List empty.",undefined,undefined,{head:headId, tail:tailId},'failure'); break; }
      
      let currentDelVal = headId;
      while(currentDelVal && actualListNodes.get(currentDelVal)?.value != value) {
          currentDelVal = actualListNodes.get(currentDelVal)!.nextId;
      }
      if (currentDelVal) {
          const nodeToDelete = actualListNodes.get(currentDelVal)!;
          addStep(lineMap.checkMatch, `Value ${value} found. Deleting node ${nodeToDelete.value}.`, currentDelVal);
          const prevId = nodeToDelete.prevId;
          const nextId = nodeToDelete.nextId;
          if (prevId) actualListNodes.get(prevId)!.nextId = nextId;
          else headId = nextId;
          if (nextId) actualListNodes.get(nextId)!.prevId = prevId;
          else tailId = prevId;
          actualListNodes.delete(currentDelVal);
          addStep(lineMap.endFound, `Deleted ${value}. Head: ${headId?actualListNodes.get(headId)?.value:'null'}, Tail: ${tailId?actualListNodes.get(tailId)?.value:'null'}.`, headId||tailId, undefined, {head:headId, tail:tailId}, 'success');
      } else {
          addStep(lineMap.endNotFound, `Value ${value} not found.`, undefined,undefined,{head:headId, tail:tailId}, 'failure');
      }
      break;
    default:
      addStep(0, `Operation ${operation} visualization not fully implemented for Doubly LL.`);
  }
  return localSteps;
};

