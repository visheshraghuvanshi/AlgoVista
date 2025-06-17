
import type { LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';

// Conceptual Line Maps - adjust based on actual code snippets shown
export const SINGLY_LL_LINE_MAPS: Record<string, Record<string, number>> = {
  insertHead: {
    start: 1,
    newNode: 2,
    linkNewNode: 3,
    updateHead: 4,
    end: 5,
  },
  insertTail: {
    start: 1,
    newNode: 2,
    emptyCheck: 3,
    assignHead: 4,
    findTailLoop: 5,
    assignNext: 6,
    end: 7,
  },
  deleteByValue: {
    start: 1,
    emptyCheck: 2,
    headMatch: 3,
    updateHeadDelete: 4,
    findNodeLoop: 5,
    nodeFound: 6,
    updateNext: 7,
    returnNull: 8, // Not found
    end: 9,
  },
  search: {
    start: 1,
    loop: 2,
    checkMatch: 3,
    returnFound: 4,
    moveNext: 5,
    returnNull: 6, // Not found
    end: 7,
  },
  traverse: {
    start: 1,
    loop: 2,
    processNode: 3, // e.g., add to result array
    moveNext: 4,
    end: 5,
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
  active: "hsl(var(--primary))",
  new: "hsl(var(--accent))",
  deleted: "hsl(var(--destructive))",
  head: "hsl(var(--ring))",
};
const TEXT_COLORS = {
  default: "hsl(var(--secondary-foreground))",
  active: "hsl(var(--primary-foreground))",
  new: "hsl(var(--accent-foreground))",
  head: "hsl(var(--primary-foreground))",
};


let nodeIdCounter = 0;
const generateNodeId = (val: string | number) => `node-${val}-${nodeIdCounter++}`;

export function parseStringToListNodes(input: string): { value: string | number, id: string }[] {
  if (input.trim() === '') return [];
  return input.split(',')
    .map(s => s.trim())
    .filter(s => s !== '')
    .map(valStr => {
      const num = Number(valStr);
      const value = isNaN(num) ? valStr : num;
      return { value, id: generateNodeId(value) }; // Give unique ID early
    });
}

function createVisualNodes(
  parsedNodes: { value: string | number, id: string }[],
  currentHeadId: string | null,
  activeNodeId?: string | null,
  newNodeId?: string | null,
  deletedNodeId?: string | null
): LinkedListNodeVisual[] {
  const visualNodes: LinkedListNodeVisual[] = [];
  let tempHead = currentHeadId;
  const idMap = new Map(parsedNodes.map(p => [p.id, p])); // For quick lookup

  // Reconstruct the list order from head for visualization
  const orderedNodeIds: string[] = [];
  let currentId = tempHead;
  const visited = new Set<string>(); // For cycle detection in case of bad logic
  while(currentId && !visited.has(currentId)) {
    orderedNodeIds.push(currentId);
    visited.add(currentId);
    // This part is tricky as actual list structure is not directly passed
    // We rely on the parsedNodes array and headId.
    // For visualization, we'll infer nextId from array order IF currentHeadId aligns with parsedNodes[0].id
    // This simplified logic assumes parsedNodes reflects current list state to some extent.
    // A more robust step generator would maintain the actual list structure.
    const currentIndexInParsed = parsedNodes.findIndex(p => p.id === currentId);
    if (currentIndexInParsed !== -1 && currentIndexInParsed < parsedNodes.length - 1) {
       // Attempt to find the "next" from the original parsed order if we don't have explicit links yet
       // This is a simplification. Real steps would pass the current list structure.
       const nextInParsed = parsedNodes[currentIndexInParsed + 1];
       currentId = nextInParsed ? nextInParsed.id : null;
    } else {
        currentId = null; // End of list or couldn't infer
    }
  }
   // If orderedNodeIds is empty but parsedNodes is not, it means headId was bad or list is empty.
   // Fallback to just using parsedNodes order if head-based reconstruction fails
   const nodesToRender = orderedNodeIds.length > 0 ? orderedNodeIds.map(id => idMap.get(id)!) : parsedNodes;


  nodesToRender.forEach((pNode, index) => {
    let color = NODE_COLORS.default;
    if (pNode.id === activeNodeId) color = NODE_COLORS.active;
    if (pNode.id === newNodeId) color = NODE_COLORS.new;
    if (pNode.id === deletedNodeId) color = NODE_COLORS.deleted;

    visualNodes.push({
      id: pNode.id,
      value: pNode.value,
      nextId: (index < nodesToRender.length - 1) ? nodesToRender[index+1].id : null,
      color: color,
      isHead: pNode.id === currentHeadId,
    });
  });
  return visualNodes;
}


export const generateSinglyLinkedListSteps = (
  initialListString: string,
  operation: string,
  value?: string | number
): LinkedListAlgorithmStep[] => {
  const localSteps: LinkedListAlgorithmStep[] = [];
  nodeIdCounter = 0; // Reset for fresh IDs
  let currentParsedNodes = parseStringToListNodes(initialListString);
  let headId: string | null = currentParsedNodes.length > 0 ? currentParsedNodes[0].id : null;
  const lineMap = SINGLY_LL_LINE_MAPS[operation] || SINGLY_LL_LINE_MAPS.init;

  const addStep = (
    line: number,
    message: string,
    activeNodeId?: string | null,
    newNodeId?: string | null,
    deletedNodeId?: string | null,
    auxPointers?: Record<string, string | null>
  ) => {
    localSteps.push({
      nodes: createVisualNodes(currentParsedNodes, headId, activeNodeId, newNodeId, deletedNodeId),
      headId: headId,
      currentLine: line,
      message,
      auxiliaryPointers: auxPointers,
      operation,
    });
  };

  addStep(lineMap.start, `Starting ${operation}`);

  switch (operation) {
    case 'init':
      // Initial state is already based on currentParsedNodes
      addStep(lineMap.end, `List initialized with: ${initialListString || '(empty)'}`);
      break;

    case 'insertHead':
      if (value === undefined) {
        addStep(lineMap.end, "Error: No value provided for insertHead.", undefined, undefined, undefined, {status: 'failure'});
        break;
      }
      const newHeadNode = { value, id: generateNodeId(value) };
      addStep(lineMap.newNode, `Creating new node with value ${value}`, undefined, newHeadNode.id);
      
      const oldHeadId = headId;
      currentParsedNodes = [newHeadNode, ...currentParsedNodes]; // Prepend
      headId = newHeadNode.id;
      
      addStep(lineMap.linkNewNode, `Linking new node. Next of ${value} points to ${oldHeadId ? currentParsedNodes.find(n=>n.id===oldHeadId)?.value : 'null'}`, newHeadNode.id, newHeadNode.id);
      addStep(lineMap.updateHead, `Updating head to new node ${value}`, headId, newHeadNode.id);
      addStep(lineMap.end, `Inserted ${value} at head.`);
      break;
    
    case 'insertTail':
      if (value === undefined) {
         addStep(lineMap.end, "Error: No value provided for insertTail.", undefined, undefined, undefined, {status: 'failure'});
        break;
      }
      const newTailNode = { value, id: generateNodeId(value) };
      addStep(lineMap.newNode, `Creating new node with value ${value}`, undefined, newTailNode.id);

      if (!headId) {
        addStep(lineMap.emptyCheck, `List is empty. New node becomes head.`, undefined, newTailNode.id);
        currentParsedNodes = [newTailNode];
        headId = newTailNode.id;
        addStep(lineMap.assignHead, `Head is now ${value}`, headId, newTailNode.id);
      } else {
        addStep(lineMap.findTailLoop, `Finding tail of the list...`, headId);
        let currentId = headId;
        let tailIdx = 0;
        for(let i=0; i<currentParsedNodes.length; i++){
            if(currentParsedNodes[i].id === currentId){
                 addStep(lineMap.findTailLoop, `Current node: ${currentParsedNodes[i].value}`, currentId);
                 if(i === currentParsedNodes.length - 1) { // Found tail
                     tailIdx = i;
                     break;
                 }
                 currentId = currentParsedNodes[i+1]?.id; // Simplified: assumes next in array
            }
        }
        currentParsedNodes.push(newTailNode); // Append
        addStep(lineMap.assignNext, `Attaching new node ${value} to tail ${currentParsedNodes[tailIdx].value}`, currentParsedNodes[tailIdx].id, newTailNode.id);
      }
      addStep(lineMap.end, `Inserted ${value} at tail.`);
      break;

    case 'deleteByValue':
      if (value === undefined) {
        addStep(lineMap.end, "Error: No value provided for deleteByValue.", undefined, undefined, undefined, {status: 'failure'});
        break;
      }
      if (!headId) {
        addStep(lineMap.emptyCheck, `List is empty. Cannot delete.`, undefined, undefined, undefined, {status: 'failure'});
        break;
      }
      addStep(lineMap.start, `Attempting to delete value ${value}.`);
      if (currentParsedNodes[0].id === headId && currentParsedNodes[0].value == value) { // Using == for type flexibility
        const deletedNode = currentParsedNodes[0];
        addStep(lineMap.headMatch, `Value ${value} found at head.`, headId, undefined, deletedNode.id);
        headId = currentParsedNodes[1] ? currentParsedNodes[1].id : null;
        currentParsedNodes.shift();
        addStep(lineMap.updateHeadDelete, `Deleted head. New head is ${headId ? currentParsedNodes[0]?.value : 'null'}.`, headId, undefined, deletedNode.id);
      } else {
        let found = false;
        let prevNodeId: string | null = null;
        for (let i = 0; i < currentParsedNodes.length; i++) {
          const currentNode = currentParsedNodes[i];
          addStep(lineMap.findNodeLoop, `Checking node ${currentNode.value}`, currentNode.id);
          if (currentNode.value == value) {
            const deletedNode = currentNode;
            addStep(lineMap.nodeFound, `Value ${value} found.`, currentNode.id, undefined, deletedNode.id);
            if (prevNodeId) {
              // Find previous node in array and conceptually update its 'next'
            }
            currentParsedNodes.splice(i, 1); // Remove from array
            found = true;
            addStep(lineMap.updateNext, `Deleted node ${value}. Previous node now points to next.`, prevNodeId, undefined, deletedNode.id);
            break;
          }
          prevNodeId = currentNode.id;
        }
        if (!found) {
          addStep(lineMap.returnNull, `Value ${value} not found in list.`, undefined, undefined, undefined, {status: 'failure'});
        }
      }
      addStep(lineMap.end, `Deletion attempt for ${value} complete.`);
      break;

    case 'search':
      if (value === undefined) {
         addStep(lineMap.end, "Error: No value provided for search.", undefined, undefined, undefined, {status: 'failure'});
        break;
      }
      if (!headId) {
        addStep(lineMap.end, `List is empty. Cannot search.`, undefined, undefined, undefined, {status: 'failure'});
        break;
      }
      addStep(lineMap.start, `Searching for value ${value}.`);
      let searchCurrentId = headId;
      let foundAtIndex = -1;
      for(let i=0; i < currentParsedNodes.length; i++) {
          const node = currentParsedNodes[i];
          if(node.id !== searchCurrentId) continue; // Only process if it's part of logical list from head

          addStep(lineMap.loop, `Checking node ${node.value} at index ${i}`, node.id);
          if(node.value == value) {
              addStep(lineMap.returnFound, `Value ${value} found at index ${i}.`, node.id);
              foundAtIndex = i;
              break;
          }
          addStep(lineMap.moveNext, `Value not ${value}. Moving to next.`, node.id);
          searchCurrentId = (i < currentParsedNodes.length - 1) ? currentParsedNodes[i+1]?.id : null;
      }
      if(foundAtIndex === -1) {
          addStep(lineMap.returnNull, `Value ${value} not found.`, undefined, undefined, undefined, {status: 'failure'});
      }
      addStep(lineMap.end, `Search for ${value} complete.`);
      break;
    
    case 'traverse':
        if(!headId) {
            addStep(lineMap.end, "List is empty. Nothing to traverse.", undefined, undefined, undefined, {status: 'info'});
            break;
        }
        addStep(lineMap.start, "Starting traversal.");
        let traverseCurrentId = headId;
        for(let i=0; i < currentParsedNodes.length; i++){
            const node = currentParsedNodes[i];
            if(node.id !== traverseCurrentId) continue; // Safety: ensure we're on the logical path
            
            addStep(lineMap.processNode, `Visiting node ${node.value}`, node.id);
            traverseCurrentId = (i < currentParsedNodes.length -1) ? currentParsedNodes[i+1]?.id : null;
             if(traverseCurrentId) {
                addStep(lineMap.moveNext, `Moving to next node.`, node.id);
            }
        }
        addStep(lineMap.end, "Traversal complete.");
        break;

    default:
      addStep(0, `Operation ${operation} not implemented for visualization.`);
  }
  return localSteps;
};

// Simplified logic for other list types for now (focus on Singly first)
export const generateDoublyLinkedListSteps = (initialListString: string, operation: string, value?: string | number) => generateSinglyLinkedListSteps(initialListString, operation, value);
export const generateCircularLinkedListSteps = (initialListString: string, operation: string, value?: string | number) => generateSinglyLinkedListSteps(initialListString, operation, value);
export const generateLinkedListReversalSteps = (initialListString: string) => generateSinglyLinkedListSteps(initialListString, 'reverse');
export const generateCycleDetectionSteps = (initialListString: string, cyclePoint?: number) => generateSinglyLinkedListSteps(initialListString, 'detectCycle');
export const generateMergeSortedListsSteps = (list1String: string, list2String: string) => generateSinglyLinkedListSteps(`${list1String},${list2String}`, 'merge'); // Very simplified merge
