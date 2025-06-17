
import type { LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';

// Conceptual Line Maps - adjust based on actual code snippets shown
export const SINGLY_LL_LINE_MAPS: Record<string, Record<string, number>> = {
  insertHead: {
    classDef: 1, // Node class
    constructor: 2, // SLL constructor
    insertHeadFunc: 3,
    newNode: 4,
    linkNewNode: 5,
    updateHead: 6,
    end: 7,
  },
  insertTail: {
    // classDef...
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
    updateNext: 8, // prev.next = current.next
    returnFound: 9,
    moveCurrentPrevInLoop: 10,
    returnNull: 11, // Not found
    end: 12,
  },
  search: {
    searchFunc: 1,
    initCurrentIndex: 2,
    loop: 3,
    checkMatch: 4,
    returnFound: 5, // return { node, index }
    moveCurrentSearch: 6,
    incrementIndex: 7,
    returnNullSearch: 8, // Not found
    end: 9,
  },
  traverse: {
    traverseFunc: 1,
    initCurrentResult: 2,
    loop: 3,
    processNode: 4, // e.g., add to result array
    moveNext: 5,
    returnResult: 6,
    end: 7,
  },
  init: { // For initializing from an array
    start: 1,
    loop: 2, // if inserting one by one
    insertCall: 3,
    end: 4,
  }
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  active: "hsl(var(--primary))", // General active node (e.g., current in traversal)
  new: "hsl(var(--accent))",      // Newly inserted node
  deleted: "hsl(var(--destructive))", // Node being deleted
  head: "hsl(var(--ring))",       // Distinct color for head
  searched: "hsl(var(--accent))", // Highlight for search operations
};
const TEXT_COLORS = {
  default: "hsl(var(--secondary-foreground))",
  active: "hsl(var(--primary-foreground))",
  new: "hsl(var(--accent-foreground))",
  head: "hsl(var(--primary-foreground))",
};


let nodeIdCounter = 0;
const generateNodeId = (val: string | number) => `sll-node-${val}-${nodeIdCounter++}`;

export function parseStringToListNodes(input: string): { value: string | number, id: string }[] {
  if (input.trim() === '') return [];
  return input.split(',')
    .map(s => s.trim())
    .filter(s => s !== '')
    .map(valStr => {
      const num = Number(valStr);
      const value = isNaN(num) ? valStr : num; // Allow string or number values
      return { value, id: generateNodeId(value) };
    });
}

function createVisualNodesFromCurrentState(
  actualListNodes: Map<string, { value: string | number; nextId: string | null }>,
  currentHeadId: string | null,
  activeNodeId?: string | null,
  specialHighlightId?: string | null, // For new/deleted/found node
  specialHighlightType?: 'new' | 'deleted' | 'searched'
): LinkedListNodeVisual[] {
  const visualNodes: LinkedListNodeVisual[] = [];
  let currentId = currentHeadId;
  const visited = new Set<string>(); // Basic cycle detection for safety during rendering

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
  value?: string | number // For operations needing a value
): LinkedListAlgorithmStep[] => {
  const localSteps: LinkedListAlgorithmStep[] = [];
  nodeIdCounter = 0; // Reset for fresh IDs for this operation sequence
  
  // Initialize actual list structure from initialListString for this operation
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
  addStep(lineMap.start, currentOpMessage);

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
      
      let current = headId;
      let prev = null;
      let found = false;
      addStep(lineMap.initCurrentPrev, "Searching for node to delete.", current);
      while(current && actualListNodes.get(current)?.value != value) {
        addStep(lineMap.findNodeLoop, `Current: ${actualListNodes.get(current)?.value}. Not ${value}.`, current);
        prev = current;
        current = actualListNodes.get(current)!.nextId;
        addStep(lineMap.moveCurrentPrevInLoop, "Moving to next node.", current, undefined, undefined, {prev, current});
      }
      if(current) { // Node found
        const deletedId = current;
        addStep(lineMap.checkMatchInLoop, `Node with value ${value} found.`, current, deletedId, 'deleted');
        if(prev) actualListNodes.get(prev)!.nextId = actualListNodes.get(current)!.nextId;
        actualListNodes.delete(deletedId);
        addStep(lineMap.updateNext, `Linking previous node to next.`, prev, undefined, undefined, {prev, next: actualListNodes.get(prev!)?.nextId}, 'success');
        found = true;
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
       addStep(lineMap.returnResult, "Traversal complete."); // Result array not explicitly stored in step for now
       break;

    default:
      addStep(0, `Operation ${operation} visualization not fully implemented.`);
  }
  return localSteps;
};
