
import type { LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';

// Conceptual Line Maps - adjust based on actual code snippets shown
export const SINGLY_LL_LINE_MAPS: Record<string, Record<string, number>> = {
  insertHead: {
    classDef: 1, 
    constructor: 2,
    insertHeadFunc: 3,
    newNode: 4,
    linkNewNode: 5,
    updateHead: 6,
    end: 7,
  },
  insertTail: {
    insertTailFunc: 1,
    newNode: 2,
    emptyCheck: 3,
    assignHead: 4,
    initCurrent: 5,
    findTailLoop: 6,
    moveCurrent: 7,
    assignNext: 8,
    end: 9,
  },
  deleteByValue: {
    deleteFunc: 1,
    emptyCheck: 2,
    headMatch: 3,
    updateHeadDelete: 4,
    initCurrentPrev: 5,
    findNodeLoop: 6,
    checkMatchInLoop: 7,
    updateNext: 8, 
    returnFound: 9,
    moveCurrentPrevInLoop: 10,
    returnNull: 11, 
    end: 12,
  },
   search: {
    searchFunc: 1,
    initCurrentIndex: 2,
    loop: 3,
    checkMatch: 4,
    returnFound: 5, 
    moveCurrentSearch: 6,
    incrementIndex: 7,
    returnNullSearch: 8, 
    end: 9,
  },
  traverse: {
    traverseFunc: 1,
    initCurrentResult: 2,
    loop: 3,
    processNode: 4, 
    moveNext: 5,
    returnResult: 6,
    end: 7,
  },
  insertAtPosition: {
    func: 1,
    newNode: 2,
    posZeroCheck: 3, // if (pos === 0) -> insertHead logic
    initTraverse: 4, // current, prev, count
    traverseLoop: 5,
    movePointers: 6,
    posFoundInsert: 7, // prev.next = newNode; newNode.next = current;
    posNotFound: 8, // If loop finishes and pos not reached (append or error)
    end: 9,
  },
  deleteAtPosition: {
    func: 1,
    emptyCheck: 2,
    posZeroCheck: 3, // Delete head
    initTraverse: 4,
    traverseLoop: 5,
    movePointers: 6,
    posFoundDelete: 7, // prev.next = current.next;
    posNotFound: 8,
    end: 9,
  },
  init: { 
    start: 1,
    loop: 2, 
    insertCall: 3,
    end: 4,
  }
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  active: "hsl(var(--primary))", 
  new: "hsl(var(--accent))",      
  deleted: "hsl(var(--destructive))", 
  head: "hsl(var(--ring))",       
  searched: "hsl(var(--accent))", 
};
const TEXT_COLORS = {
  default: "hsl(var(--secondary-foreground))",
  active: "hsl(var(--primary-foreground))",
  new: "hsl(var(--accent-foreground))",
  head: "hsl(var(--primary-foreground))",
};


let nodeIdCounter = 0;
const generateNodeId = (val: string | number) => `sll-node-${String(val).replace(/\s/g, '_')}-${nodeIdCounter++}`;

export function parseStringToListNodes(input: string): { value: string | number, id: string }[] {
  if (input.trim() === '') return [];
  return input.split(',')
    .map(s => s.trim())
    .filter(s => s !== '')
    .map(valStr => {
      const num = Number(valStr);
      const value = isNaN(num) ? valStr : num; 
      return { value, id: generateNodeId(value) };
    });
}

function createVisualNodesFromCurrentState(
  actualListNodes: Map<string, { value: string | number; nextId: string | null }>,
  currentHeadId: string | null,
  activeNodeId?: string | null,
  specialHighlightId?: string | null, 
  specialHighlightType?: 'new' | 'deleted' | 'searched'
): LinkedListNodeVisual[] {
  const visualNodes: LinkedListNodeVisual[] = [];
  let currentId = currentHeadId;
  const visited = new Set<string>(); 

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    const nodeData = actualListNodes.get(currentId);
    if (!nodeData) break;

    let color = NODE_COLORS.default;
    if (currentId === currentHeadId) color = NODE_COLORS.head;
    if (currentId === activeNodeId) color = NODE_COLORS.active;
    if (currentId === specialHighlightId) {
      if (specialHighlightType === 'new') color = NODE_COLORS.new;
      else if (specialHighlightType === 'deleted') color = NODE_COLORS.deleted;
      else if (specialHighlightType === 'searched') color = NODE_COLORS.searched;
    }

    visualNodes.push({
      id: currentId,
      value: nodeData.value,
      nextId: nodeData.nextId,
      color: color,
      isHead: currentId === currentHeadId,
    });
    currentId = nodeData.nextId;
  }
  return visualNodes;
}


export const generateSinglyLinkedListSteps = (
  initialListString: string,
  operation: string,
  value?: string | number, 
  position?: number
): LinkedListAlgorithmStep[] => {
  const localSteps: LinkedListAlgorithmStep[] = [];
  nodeIdCounter = 0; 
  
  const initialParsed = parseStringToListNodes(initialListString);
  const actualListNodes = new Map<string, { value: string | number; nextId: string | null }>();
  initialParsed.forEach((pNode, index) => {
    actualListNodes.set(pNode.id, {
      value: pNode.value,
      nextId: index < initialParsed.length - 1 ? initialParsed[index + 1].id : null,
    });
  });
  let headId: string | null = initialParsed.length > 0 ? initialParsed[0].id : null;
  
  const lineMap = SINGLY_LL_LINE_MAPS[operation] || SINGLY_LL_LINE_MAPS.init;

  const addStep = (
    line: number,
    message: string,
    activeNodeId?: string | null,
    specialNodeId?: string | null,
    specialType?: 'new' | 'deleted' | 'searched',
    auxPointers?: Record<string, string | null>,
    opStatus?: 'success' | 'failure' | 'info'
  ) => {
    localSteps.push({
      nodes: createVisualNodesFromCurrentState(actualListNodes, headId, activeNodeId, specialNodeId, specialType),
      headId: headId,
      currentLine: line,
      message,
      auxiliaryPointers: auxPointers,
      operation,
      status: opStatus,
    });
  };
  
  let currentOpMessage = `Starting ${operation}`;
  if(value !== undefined) currentOpMessage += ` with value ${value}`;
  if(position !== undefined) currentOpMessage += ` at position ${position}`;
  addStep(lineMap.start || 0, currentOpMessage);

  switch (operation) {
    case 'init':
      addStep(lineMap.end, `List initialized: ${initialListString || '(empty)'}`);
      break;

    case 'insertHead':
      if (value === undefined) { addStep(lineMap.end, "Error: No value for insertHead.", undefined, undefined, undefined, undefined, 'failure'); break; }
      const newHeadNodeId = generateNodeId(value);
      addStep(lineMap.newNode, `New node with value ${value}`, undefined, newHeadNodeId, 'new');
      actualListNodes.set(newHeadNodeId, { value, nextId: headId });
      headId = newHeadNodeId;
      addStep(lineMap.linkNewNode, `Linking new node. New head: ${value}`, headId, newHeadNodeId, 'new');
      addStep(lineMap.updateHead, `Head updated.`, headId, newHeadNodeId, 'new');
      addStep(lineMap.end, `Inserted ${value} at head.`, undefined, undefined, undefined, undefined, 'success');
      break;
    
    case 'insertTail':
      if (value === undefined) { addStep(lineMap.end, "Error: No value for insertTail.", undefined, undefined, undefined, undefined, 'failure'); break; }
      const newTailNodeId = generateNodeId(value);
      addStep(lineMap.newNode, `New node with value ${value}`, undefined, newTailNodeId, 'new');
      if (!headId) {
        addStep(lineMap.emptyCheck, `List empty. New node is head.`, undefined, newTailNodeId, 'new');
        actualListNodes.set(newTailNodeId, { value, nextId: null });
        headId = newTailNodeId;
        addStep(lineMap.assignHead, `Head is now ${value}`, headId, newTailNodeId, 'new');
      } else {
        let currentId = headId;
        addStep(lineMap.initCurrent, `Finding tail. Start at head: ${actualListNodes.get(currentId)?.value}`, currentId);
        while (actualListNodes.get(currentId)?.nextId) {
           addStep(lineMap.findTailLoop, `Current: ${actualListNodes.get(currentId)?.value}. Moving next.`, currentId);
           currentId = actualListNodes.get(currentId)!.nextId!;
        }
        addStep(lineMap.findTailLoop, `Tail found: ${actualListNodes.get(currentId)?.value}.`, currentId);
        actualListNodes.get(currentId)!.nextId = newTailNodeId;
        actualListNodes.set(newTailNodeId, { value, nextId: null });
        addStep(lineMap.assignNext, `Attaching new node ${value} to tail.`, currentId, newTailNodeId, 'new');
      }
      addStep(lineMap.end, `Inserted ${value} at tail.`, undefined, undefined, undefined, undefined, 'success');
      break;
    
    case 'insertAtPosition':
      if (value === undefined || position === undefined) { addStep(lineMap.end, "Error: Value or position missing.", undefined, undefined, undefined, undefined, 'failure'); break; }
      if (position < 0) { addStep(lineMap.end, "Error: Position cannot be negative.", undefined, undefined, undefined, undefined, 'failure'); break; }
      
      const newNodeAtPosId = generateNodeId(value);
      addStep(lineMap.newNode, `New node with value ${value} for position ${position}.`, undefined, newNodeAtPosId, 'new');
      
      if (position === 0) { // Insert at head
        addStep(lineMap.posZeroCheck, `Position 0. Inserting at head.`, undefined, newNodeAtPosId, 'new');
        actualListNodes.set(newNodeAtPosId, { value, nextId: headId });
        headId = newNodeAtPosId;
        addStep(lineMap.end, `Inserted ${value} at head (position 0).`, headId, newNodeAtPosId, 'new', undefined, 'success');
      } else {
        let current = headId;
        let prev = null;
        let count = 0;
        addStep(lineMap.initTraverse, `Traversing to position ${position}.`, current);
        while (current && count < position) {
          addStep(lineMap.traverseLoop, `At index ${count}, node ${actualListNodes.get(current)?.value}. Target pos: ${position}.`, current);
          prev = current;
          current = actualListNodes.get(current)!.nextId;
          count++;
          addStep(lineMap.movePointers, `Moved to index ${count}. Prev: ${prev ? actualListNodes.get(prev)?.value : 'null'}, Current: ${current ? actualListNodes.get(current)?.value : 'null'}.`, current, undefined, undefined, {prev, current});
        }
        if (count === position) { // Found position (or end of list if pos >= length)
          actualListNodes.set(newNodeAtPosId, { value, nextId: current });
          if(prev) actualListNodes.get(prev)!.nextId = newNodeAtPosId;
          else headId = newNodeAtPosId; // Should be covered by pos === 0, but for safety if pos > 0 and prev is null (empty list start scenario)
          addStep(lineMap.posFoundInsert, `Inserted ${value} at position ${position}.`, prev, newNodeAtPosId, 'new', undefined, 'success');
        } else {
          addStep(lineMap.posNotFound, `Position ${position} is out of bounds (list length ${count}). Appending to tail.`, undefined, newNodeAtPosId, 'new', undefined, 'info');
          // Effectively insertTail if position is out of bounds but non-negative
           if (prev) { // If list was not empty
                actualListNodes.get(prev)!.nextId = newNodeAtPosId;
                actualListNodes.set(newNodeAtPosId, { value, nextId: null });
            } else { // List was empty, this becomes head
                actualListNodes.set(newNodeAtPosId, { value, nextId: null });
                headId = newNodeAtPosId;
            }
             addStep(lineMap.end, `Appended ${value} as list length was ${count}.`, undefined, undefined, undefined, undefined, 'success');
        }
      }
      break;

    case 'deleteAtPosition':
        if (position === undefined) { addStep(lineMap.end, "Error: Position missing.", undefined, undefined, undefined, undefined, 'failure'); break; }
        if (position < 0) { addStep(lineMap.end, "Error: Position cannot be negative.", undefined, undefined, undefined, undefined, 'failure'); break; }
        if (!headId) { addStep(lineMap.emptyCheck, "List empty. Cannot delete.", undefined, undefined, undefined, undefined, 'failure'); break; }

        let deletedNodeId: string | null = null;
        if (position === 0) {
            addStep(lineMap.posZeroCheck, "Position 0. Deleting head.", headId);
            deletedNodeId = headId;
            headId = actualListNodes.get(headId)!.nextId;
            if(deletedNodeId) actualListNodes.delete(deletedNodeId);
            addStep(lineMap.end, `Deleted head. New head: ${headId ? actualListNodes.get(headId)?.value : 'null'}.`, headId, deletedNodeId, 'deleted', undefined, 'success');
        } else {
            let current = headId;
            let prev = null;
            let count = 0;
            addStep(lineMap.initTraverse, `Traversing to position ${position} for deletion.`, current);
            while (current && count < position) {
                addStep(lineMap.traverseLoop, `At index ${count}, node ${actualListNodes.get(current)?.value}. Target pos: ${position}.`, current);
                prev = current;
                current = actualListNodes.get(current)!.nextId;
                count++;
                 addStep(lineMap.movePointers, `Moved to index ${count}.`, current, undefined, undefined, {prev, current});
            }
            if (current && count === position) { // Node to delete found
                deletedNodeId = current;
                addStep(lineMap.posFoundDelete, `Node to delete at pos ${position} is ${actualListNodes.get(current)?.value}.`, current, deletedNodeId, 'deleted');
                if (prev) actualListNodes.get(prev)!.nextId = actualListNodes.get(current)!.nextId;
                if(deletedNodeId) actualListNodes.delete(deletedNodeId);
                addStep(lineMap.end, `Deleted node at position ${position}.`, prev, deletedNodeId, 'deleted', undefined, 'success');
            } else {
                addStep(lineMap.posNotFound, `Position ${position} is out of bounds. Nothing deleted. List length ${count}.`, undefined, undefined, undefined, undefined, 'failure');
            }
        }
        break;

    case 'deleteByValue':
      if (value === undefined) { addStep(lineMap.end, "Error: No value for delete.", undefined, undefined, undefined, undefined, 'failure'); break; }
      if (!headId) { addStep(lineMap.emptyCheck, "List empty. Cannot delete.", undefined, undefined, undefined, undefined, 'failure'); break; }
      
      if (actualListNodes.get(headId)?.value == value) {
        const deletedId = headId;
        addStep(lineMap.headMatch, `Value ${value} found at head.`, headId, deletedId, 'deleted');
        headId = actualListNodes.get(headId)!.nextId;
        actualListNodes.delete(deletedId);
        addStep(lineMap.updateHeadDelete, `Deleted head. New head: ${headId ? actualListNodes.get(headId)?.value : 'null'}.`, headId, undefined, undefined, undefined, 'success');
        break;
      }
      
      let currentDel = headId;
      let prevDel: string | null = null; // Initialize prevDel to null
      let foundDel = false;
      addStep(lineMap.initCurrentPrev, "Searching for node to delete.", currentDel);
      while(currentDel && actualListNodes.get(currentDel)?.value != value) {
        addStep(lineMap.findNodeLoop, `Current: ${actualListNodes.get(currentDel)?.value}. Not ${value}.`, currentDel);
        prevDel = currentDel;
        currentDel = actualListNodes.get(currentDel)!.nextId;
        addStep(lineMap.moveCurrentPrevInLoop, "Moving to next node.", currentDel, undefined, undefined, {prev: prevDel, current: currentDel});
      }
      if(currentDel) { 
        const deletedId = currentDel;
        addStep(lineMap.checkMatchInLoop, `Node with value ${value} found.`, currentDel, deletedId, 'deleted');
        if(prevDel) actualListNodes.get(prevDel)!.nextId = actualListNodes.get(currentDel)!.nextId;
        actualListNodes.delete(deletedId);
        addStep(lineMap.updateNext, `Linking previous node to next.`, prevDel, undefined, undefined, {prev: prevDel, next: actualListNodes.get(prevDel!)?.nextId}, 'success');
        foundDel = true;
      } else {
        addStep(lineMap.returnNull, `Value ${value} not found.`, undefined, undefined, undefined, undefined, 'failure');
      }
      addStep(lineMap.end, `Delete operation for ${value} complete.`);
      break;

    case 'search':
      if (value === undefined) { addStep(lineMap.end, "Error: No value for search.", undefined, undefined, undefined, undefined, 'failure'); break; }
      if (!headId) { addStep(lineMap.end, "List empty. Cannot search.", undefined, undefined, undefined, undefined, 'failure'); break; }
      
      let searchCurrent = headId;
      let searchIndex = 0;
      addStep(lineMap.initCurrentIndex, `Searching for ${value}. Start at head.`, searchCurrent);
      while(searchCurrent) {
        addStep(lineMap.loop, `Current node: ${actualListNodes.get(searchCurrent)?.value} at index ${searchIndex}.`, searchCurrent);
        if(actualListNodes.get(searchCurrent)?.value == value) {
          addStep(lineMap.returnFound, `Value ${value} found at index ${searchIndex}.`, searchCurrent, searchCurrent, 'searched', undefined, 'success');
          addStep(lineMap.end, "Search complete.");
          return localSteps;
        }
        addStep(lineMap.moveCurrentSearch, `Not ${value}. Moving to next.`, searchCurrent);
        searchCurrent = actualListNodes.get(searchCurrent)!.nextId;
        searchIndex++;
      }
      addStep(lineMap.returnNullSearch, `Value ${value} not found.`, undefined, undefined, undefined, undefined, 'failure');
      addStep(lineMap.end, "Search complete.");
      break;

    case 'traverse':
       if (!headId) { addStep(lineMap.end, "List empty. Nothing to traverse.", undefined, undefined, undefined, undefined, 'info'); break; }
       let travCurrent = headId;
       addStep(lineMap.initCurrentResult, "Starting traversal.", travCurrent);
       while(travCurrent) {
           const nodeData = actualListNodes.get(travCurrent)!;
           addStep(lineMap.processNode, `Visiting node ${nodeData.value}.`, travCurrent);
           travCurrent = nodeData.nextId;
           if(travCurrent) addStep(lineMap.moveNext, "Moving to next node.", travCurrent);
       }
       addStep(lineMap.returnResult, "Traversal complete."); 
       break;

    default:
      addStep(0, `Operation ${operation} visualization not fully implemented.`);
  }
  return localSteps;
};

