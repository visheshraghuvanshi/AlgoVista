
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
  parsedNodes: { value: string | number, id: string }[],
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
    if (currentId === currentHeadId && currentId === currentTailId) color = NODE_COLORS.head; // Single node is both
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
      nodes: createVisualDLLNodes(initialParsed, actualListNodes, headId, tailId, activeNodeId, newNodeId),
      headId, tailId, currentLine: line, message, auxiliaryPointers: auxPointers, operation, status: opStatus,
    });
  };

  let currentOpMessage = `Starting ${operation}`;
  if(value !== undefined) currentOpMessage += ` with value ${value}`;
  if(position !== undefined) currentOpMessage += ` at position ${position}`;
  addStep(lineMap.start || 0, currentOpMessage);


  switch (operation) {
    case 'init':
      addStep(lineMap.end, `Doubly List initialized: ${initialListString || '(empty)'}`);
      break;
    case 'insertHead':
      if (value === undefined) { addStep(lineMap.end, "Error: Value missing.", undefined, undefined, undefined, 'failure'); break; }
      const newHeadNodeId = generateNodeId(value);
      addStep(lineMap.newNode, `New node ${value}`, undefined, newHeadNodeId);
      actualListNodes.set(newHeadNodeId, { value, nextId: headId, prevId: null });
      if (headId) {
        actualListNodes.get(headId)!.prevId = newHeadNodeId;
      } else {
        tailId = newHeadNodeId; // List was empty
      }
      headId = newHeadNodeId;
      addStep(lineMap.linkNewNode, `Linking node. Head: ${value}, Tail: ${tailId ? actualListNodes.get(tailId)?.value : 'null'}`, headId, newHeadNodeId);
      addStep(lineMap.end, `Inserted ${value} at head.`, undefined,undefined,undefined,'success');
      break;
    case 'insertTail':
      if (value === undefined) { addStep(lineMap.end, "Error: Value missing.", undefined, undefined, undefined, 'failure'); break; }
      const newTailNodeId = generateNodeId(value);
      addStep(lineMap.newNode, `New node ${value}`, undefined, newTailNodeId);
      actualListNodes.set(newTailNodeId, {value, nextId: null, prevId: tailId });
      if(tailId) {
        actualListNodes.get(tailId)!.nextId = newTailNodeId;
      } else {
        headId = newTailNodeId; // List was empty
      }
      tailId = newTailNodeId;
      addStep(lineMap.linkNewNode, `Linking node. Head: ${headId ? actualListNodes.get(headId)?.value : 'null'}, Tail: ${value}`, tailId, newTailNodeId);
      addStep(lineMap.end, `Inserted ${value} at tail.`, undefined,undefined,undefined,'success');
      break;
    case 'insertAtPosition':
      if (value === undefined || position === undefined) { addStep(lineMap.end, "Error: Value or position missing.", undefined, undefined, undefined, 'failure'); break; }
      if (position < 0) { addStep(lineMap.end, "Error: Position cannot be negative.", undefined, undefined, undefined, 'failure'); break; }

      const newNodeAtPosId = generateNodeId(value);
      addStep(lineMap.newNode, `New node ${value} for position ${position}.`, undefined, newNodeAtPosId);
      actualListNodes.set(newNodeAtPosId, {value, nextId: null, prevId: null});

      if (position === 0) { // Insert at head
        addStep(lineMap.posZeroCheck, `Position 0. Inserting at head.`, undefined, newNodeAtPosId);
        actualListNodes.get(newNodeAtPosId)!.nextId = headId;
        if (headId) actualListNodes.get(headId)!.prevId = newNodeAtPosId;
        else tailId = newNodeAtPosId; // List was empty
        headId = newNodeAtPosId;
        addStep(lineMap.end, `Inserted ${value} at head (position 0).`, headId, newNodeAtPosId, undefined, 'success');
      } else {
        let current = headId;
        let count = 0;
        addStep(lineMap.initTraverse, `Traversing to position ${position}.`, current);
        while (current && count < position) {
          addStep(lineMap.traverseLoop, `At index ${count}, node ${actualListNodes.get(current)?.value}. Target pos: ${position}.`, current);
          current = actualListNodes.get(current)!.nextId;
          count++;
        }
        // current is now the node at target position, or null if pos is out of bounds (append)
        if (current) { // Insert before current
          const prevNodeId = actualListNodes.get(current)!.prevId;
          addStep(lineMap.linkMiddle, `Inserting ${value} before ${actualListNodes.get(current)?.value}.`, current, newNodeAtPosId);
          actualListNodes.get(newNodeAtPosId)!.nextId = current;
          actualListNodes.get(newNodeAtPosId)!.prevId = prevNodeId;
          actualListNodes.get(current)!.prevId = newNodeAtPosId;
          if (prevNodeId) actualListNodes.get(prevNodeId)!.nextId = newNodeAtPosId;
          else headId = newNodeAtPosId; // current was head
           addStep(lineMap.end, `Inserted ${value} at position ${position}.`, current, newNodeAtPosId, undefined, 'success');
        } else { // Position is at the end or list was shorter
          addStep(lineMap.updateTailAtEnd, `Position ${position} is at or after end. Inserting at tail.`, tailId, newNodeAtPosId);
          if (tailId) actualListNodes.get(tailId)!.nextId = newNodeAtPosId;
          else headId = newNodeAtPosId; // List was empty
          actualListNodes.get(newNodeAtPosId)!.prevId = tailId;
          tailId = newNodeAtPosId;
          addStep(lineMap.end, `Inserted ${value} at tail (position ${count}).`, tailId, newNodeAtPosId, undefined, 'success');
        }
      }
      break;
    case 'deleteAtPosition':
      if (position === undefined) { addStep(lineMap.end, "Error: Position missing.", undefined,undefined,undefined,'failure'); break; }
      if (!headId) { addStep(lineMap.emptyCheck, "List empty.", undefined,undefined,undefined,'failure'); break; }
      if (position < 0 ) { addStep(lineMap.end, "Error: Position negative.", undefined,undefined,undefined,'failure'); break; }

      if (position === 0) { // Delete head
        const deletedId = headId;
        addStep(lineMap.posZeroCheck, `Position 0. Deleting head ${actualListNodes.get(headId)?.value}.`, headId);
        headId = actualListNodes.get(headId)!.nextId;
        if (headId) actualListNodes.get(headId)!.prevId = null;
        else tailId = null; // List became empty
        actualListNodes.delete(deletedId);
        addStep(lineMap.end, `Deleted head.`, headId, undefined,undefined,'success');
      } else {
        let current = headId;
        let count = 0;
        addStep(lineMap.initTraverse, `Traversing to position ${position}.`, current);
        while (current && count < position) {
           addStep(lineMap.traverseLoop, `At index ${count}, node ${actualListNodes.get(current)?.value}. Target pos: ${position}.`, current);
           current = actualListNodes.get(current)!.nextId;
           count++;
        }
        if (current) { // Node at position found
          const deletedId = current;
          const prevNodeId = actualListNodes.get(current)!.prevId;
          const nextNodeId = actualListNodes.get(current)!.nextId;
          addStep(lineMap.deleteNode, `Deleting node ${actualListNodes.get(current)?.value} at position ${position}.`, current);
          if (prevNodeId) actualListNodes.get(prevNodeId)!.nextId = nextNodeId;
          if (nextNodeId) actualListNodes.get(nextNodeId)!.prevId = prevNodeId;
          if (current === tailId) tailId = prevNodeId; // Update tail if last node deleted
          actualListNodes.delete(deletedId);
          addStep(lineMap.end, `Deleted node at position ${position}.`, undefined,undefined,undefined,'success');
        } else {
           addStep(lineMap.posNotFound, `Position ${position} out of bounds. Nothing deleted. List length ${count}.`, undefined,undefined,undefined,'failure');
        }
      }
      break;

    case 'deleteByValue':
      if (value === undefined) { addStep(lineMap.end, "Error: Value missing.", undefined,undefined,undefined,'failure'); break; }
      if (!headId) { addStep(lineMap.emptyCheck, "List empty.",undefined,undefined,undefined,'failure'); break; }
      
      let currentDelVal = headId;
      addStep(lineMap.start, `Deleting value ${value}. Starting search.`, currentDelVal);
      while(currentDelVal && actualListNodes.get(currentDelVal)?.value != value) { // Use loose comparison
          addStep(lineMap.loop, `Current ${actualListNodes.get(currentDelVal)?.value} != ${value}. Move next.`, currentDelVal);
          currentDelVal = actualListNodes.get(currentDelVal)!.nextId;
      }
      if (currentDelVal) { // Found
          addStep(lineMap.checkMatch, `Value ${value} found.`, currentDelVal);
          const nodeToDelete = actualListNodes.get(currentDelVal)!;
          const prevId = nodeToDelete.prevId;
          const nextId = nodeToDelete.nextId;
          if (prevId) {
              actualListNodes.get(prevId)!.nextId = nextId;
              addStep(lineMap.updatePrevNext, `prev.next = current.next`, prevId);
          } else { // Deleting head
              headId = nextId;
              addStep(lineMap.updateHead, `New head: ${nextId ? actualListNodes.get(nextId)?.value : 'null'}`, nextId);
          }
          if (nextId) {
              actualListNodes.get(nextId)!.prevId = prevId;
              addStep(lineMap.updateNextPrev, `next.prev = current.prev`, nextId);
          } else { // Deleting tail
              tailId = prevId;
              addStep(lineMap.updateTail, `New tail: ${prevId ? actualListNodes.get(prevId)?.value : 'null'}`, prevId);
          }
          actualListNodes.delete(currentDelVal);
          addStep(lineMap.endFound, `Deleted ${value}.`, undefined,undefined,undefined,'success');
      } else {
          addStep(lineMap.endNotFound, `Value ${value} not found.`, undefined,undefined,undefined,'failure');
      }
      break;
    default:
      addStep(0, `Operation ${operation} visualization not fully implemented for Doubly LL.`);
  }
  return localSteps;
};

