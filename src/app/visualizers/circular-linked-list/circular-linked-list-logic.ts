
import type { LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';

export const CIRCULAR_LL_LINE_MAPS: Record<string, Record<string, number>> = {
  insertHead: { start: 1, newNode: 2, emptyCheck: 3, pointToSelf: 4, findTailLoop: 5, linkNewToHead: 6, linkTailToNew: 7, updateHead: 8, end: 9 },
  insertAtPosition: {
    func: 1, newNode: 2, posZeroCheck: 3, initTraverse: 4, traverseLoop: 5, 
    insertAfterPrev: 6, updateTailNextIfInsertingAfterTail: 7, // Special for circular
    posNotFound: 8, end: 9,
  },
  deleteAtPosition: {
    func: 1, emptyCheck: 2, singleNodeDelete: 3, posZeroCheck: 4, 
    findNodeToDelete: 5, traverseLoop: 6, 
    deleteNodeLogic: 7, updateTailNextIfDeletingHeadOrTailReferenced: 8, 
    posNotFound: 9, end: 10,
  },
  traverse: { start: 1, emptyCheck: 2, initCurrent: 3, doWhileLoop: 4, processNode: 5, moveNext: 6, loopCondition: 7, end: 8 },
  init: { start: 1, loop: 2, insertCall: 3, end: 4}
};

const NODE_COLORS = { default: "hsl(var(--secondary))", active: "hsl(var(--primary))", new: "hsl(var(--accent))", head: "hsl(var(--ring))" };

let nodeIdCounter = 2000;
const generateNodeId = (val: string | number) => `cll-node-${String(val).replace(/\s/g, '_')}-${nodeIdCounter++}`;

export function parseCLLInput(input: string): { value: string | number, id: string }[] {
    if (input.trim() === '') return [];
    return input.split(',').map(s => s.trim()).filter(s => s !== '').map(valStr => {
        const num = Number(valStr);
        const value = isNaN(num) ? valStr : num;
        return { value, id: generateNodeId(value) };
    });
}

function createVisualCLLNodes(
  actualListMap: Map<string, { value: string | number, nextId: string | null }>,
  currentHeadId: string | null,
  activeNodeId?: string | null,
  newNodeId?: string | null
): LinkedListNodeVisual[] {
    if (!currentHeadId || actualListMap.size === 0) return [];
    
    const visualNodes: LinkedListNodeVisual[] = [];
    let currentVisId: string | null = currentHeadId;
    const visitedInRender = new Set<string>(); // Prevent infinite loop for bad cycle in render
    
    do {
        if (!currentVisId || visitedInRender.has(currentVisId)) break;
        visitedInRender.add(currentVisId);
        const nodeData = actualListMap.get(currentVisId);
        if(!nodeData) break;

        let color = NODE_COLORS.default;
        if (currentVisId === activeNodeId) color = NODE_COLORS.active;
        if (currentVisId === newNodeId) color = NODE_COLORS.new;
        if (currentVisId === currentHeadId) color = NODE_COLORS.head;

        visualNodes.push({
            id: currentVisId,
            value: nodeData.value,
            nextId: nodeData.nextId,
            color: color,
            isHead: currentVisId === currentHeadId,
        });
        currentVisId = nodeData.nextId;
    } while (currentVisId !== currentHeadId && currentVisId !== null);

    return visualNodes;
}

export const generateCircularLinkedListSteps = (
  initialListString: string,
  operation: string,
  value?: string | number,
  position?: number
): LinkedListAlgorithmStep[] => {
  const localSteps: LinkedListAlgorithmStep[] = [];
  nodeIdCounter = 2000;
  
  const initialParsed = parseCLLInput(initialListString);
  const actualListNodes = new Map<string, { value: string | number; nextId: string | null }>();
  let headId: string | null = null;

  if(initialParsed.length > 0) {
    headId = initialParsed[0].id;
    initialParsed.forEach((pNode, index) => {
        actualListNodes.set(pNode.id, {
            value: pNode.value,
            nextId: index < initialParsed.length - 1 ? initialParsed[index + 1].id : headId // Last points to head
        });
    });
  }

  const lineMap = CIRCULAR_LL_LINE_MAPS[operation] || CIRCULAR_LL_LINE_MAPS.init;

  const addStep = (line: number, message: string, activeNodeId?: string | null, newNodeId?: string | null, auxPointers?: Record<string, string | null>, opStatus?: 'success'|'failure'|'info') => {
    localSteps.push({
      nodes: createVisualCLLNodes(actualListNodes, headId, activeNodeId, newNodeId),
      headId, currentLine: line, message, auxiliaryPointers: auxPointers, operation, status: opStatus,
    });
  };
  
  let currentOpMessage = `Starting ${operation}`;
  if(value !== undefined) currentOpMessage += ` with value ${value}`;
  if(position !== undefined) currentOpMessage += ` at position ${position}`;
  addStep(lineMap.start || 0, currentOpMessage);

  switch(operation) {
    case 'init':
      addStep(lineMap.end, `Circular List initialized: ${initialListString || '(empty)'}`);
      break;
    case 'insertHead':
      if (value === undefined) { addStep(lineMap.end, "Error: Value missing.", undefined, undefined, undefined, 'failure'); break; }
      const newHeadNodeId = generateNodeId(value);
      addStep(lineMap.newNode, `New node ${value}`, undefined, newHeadNodeId);
      if (!headId) {
        headId = newHeadNodeId;
        actualListNodes.set(headId, { value, nextId: headId }); // Points to itself
        addStep(lineMap.pointToSelf, `${value} points to itself. Head is ${value}.`, headId, newHeadNodeId);
      } else {
        let current = headId;
        while(actualListNodes.get(current)!.nextId !== headId) {
            current = actualListNodes.get(current)!.nextId!;
        } // current is now tail
        addStep(lineMap.findTailLoop, `Found tail: ${actualListNodes.get(current)?.value}`, current);
        actualListNodes.set(newHeadNodeId, {value, nextId: headId });
        actualListNodes.get(current)!.nextId = newHeadNodeId; // Tail points to new head
        headId = newHeadNodeId; // Update head
        addStep(lineMap.linkNewToHead, `New node points to old head. Tail points to new head.`, headId, newHeadNodeId);
      }
      addStep(lineMap.end, `Inserted ${value} at head.`, undefined, undefined, undefined, 'success');
      break;
    
    case 'insertAtPosition':
      if (value === undefined || position === undefined) { addStep(lineMap.end, "Error: Value or position missing.", undefined, undefined, undefined, 'failure'); break; }
      if (position < 0) { addStep(lineMap.end, "Error: Position cannot be negative.", undefined, undefined, undefined, 'failure'); break; }
      
      const newNodeAtCLLPosId = generateNodeId(value);
      addStep(lineMap.newNode, `New node ${value} for position ${position}.`, undefined, newNodeAtCLLPosId);
      actualListNodes.set(newNodeAtCLLPosId, {value, nextId: null}); // Temp nextId

      if (!headId) { // Empty list
        if (position === 0) {
            headId = newNodeAtCLLPosId;
            actualListNodes.get(headId)!.nextId = headId;
            addStep(lineMap.posZeroCheck, `Empty list. Inserted ${value} at pos 0. Head is ${value}.`, headId, newNodeAtCLLPosId, undefined, 'success');
        } else {
            addStep(lineMap.posNotFound, "Empty list & pos > 0. Invalid.", undefined,undefined,undefined,'failure');
        }
      } else if (position === 0) { // Insert at head of non-empty list
         let tail = headId;
         while(actualListNodes.get(tail)!.nextId !== headId) tail = actualListNodes.get(tail)!.nextId!;
         actualListNodes.get(newNodeAtCLLPosId)!.nextId = headId;
         actualListNodes.get(tail)!.nextId = newNodeAtCLLPosId;
         headId = newNodeAtCLLPosId;
         addStep(lineMap.posZeroCheck, `Inserted ${value} at head (pos 0).`, headId, newNodeAtCLLPosId, undefined, 'success');
      } else {
        let current = headId;
        let prev = null;
        let count = 0;
        addStep(lineMap.initTraverse, `Traversing to position ${position}.`, current);
        do {
            if (count === position) break;
            prev = current;
            current = actualListNodes.get(current)!.nextId;
            count++;
            if (current === headId && count < position) { // Cycled through without reaching position
                 addStep(lineMap.posNotFound, `Position ${position} is out of bounds (list length ${count}). Cannot insert.`, undefined,undefined,undefined,'failure');
                 actualListNodes.delete(newNodeAtCLLPosId); // Clean up unused new node
                 return localSteps;
            }
            addStep(lineMap.traverseLoop, `At index ${count-1}, node ${actualListNodes.get(prev!)?.value}. Target pos: ${position}.`, prev);
        } while (current !== headId || count < position); // Ensure we check up to specified position even if it means wrapping

        if (count === position) { // Found correct spot or appending logically
            actualListNodes.get(newNodeAtCLLPosId)!.nextId = current; // current could be head if inserting at end of cycle
            actualListNodes.get(prev!)!.nextId = newNodeAtCLLPosId;
            addStep(lineMap.insertAfterPrev, `Inserted ${value} at position ${position}.`, prev, newNodeAtCLLPosId, undefined, 'success');
        } else { // Position out of bounds logic
            addStep(lineMap.posNotFound, `Position ${position} is out of bounds (list length ${count}). Appending as new tail.`, undefined, newNodeAtCLLPosId, undefined, 'info');
            let tail = headId; while(actualListNodes.get(tail)!.nextId !== headId) tail = actualListNodes.get(tail)!.nextId!;
            actualListNodes.get(tail)!.nextId = newNodeAtCLLPosId;
            actualListNodes.get(newNodeAtCLLPosId)!.nextId = headId;
            addStep(lineMap.updateTailNextIfInsertingAfterTail, `Appended ${value}. Tail now points to new node, new node points to head.`, tail, newNodeAtCLLPosId, undefined, 'success');
        }
      }
      break;

    case 'deleteAtPosition':
        if (position === undefined) { addStep(lineMap.end, "Error: Position missing.", undefined,undefined,undefined,'failure'); break; }
        if (!headId) { addStep(lineMap.emptyCheck, "List empty.", undefined,undefined,undefined,'failure'); break; }
        if (position < 0) { addStep(lineMap.end, "Error: Position negative.", undefined,undefined,undefined,'failure'); break; }
        
        let currentDelPos = headId;
        let prevDelPos = null;
        let countDelPos = 0;

        if (actualListNodes.get(headId)!.nextId === headId && position === 0) { // Single node list
            addStep(lineMap.singleNodeDelete, `Deleting the only node ${actualListNodes.get(headId)?.value}.`, headId);
            actualListNodes.delete(headId);
            headId = null;
            addStep(lineMap.end, `List is now empty.`, undefined,undefined,undefined,'success');
            break;
        }
        
        addStep(lineMap.findNodeToDelete, `Traversing to position ${position} for deletion.`, currentDelPos);
        // Find node to delete AND its predecessor (which is tail if deleting head)
        let tailFinder = headId;
        while(actualListNodes.get(tailFinder)!.nextId !== headId) {
            tailFinder = actualListNodes.get(tailFinder)!.nextId!;
        }
        prevDelPos = tailFinder; // Initially assume prev is the actual tail if deleting head
        
        if (position === 0) { // Deleting head
            addStep(lineMap.posZeroCheck, `Deleting head ${actualListNodes.get(headId)?.value}.`, headId);
            const deletedId = headId;
            headId = actualListNodes.get(headId)!.nextId;
            actualListNodes.get(prevDelPos)!.nextId = headId; // Tail points to new head
            actualListNodes.delete(deletedId);
            addStep(lineMap.end, `Deleted head. New head is ${headId ? actualListNodes.get(headId)?.value : 'null'}. Tail points to new head.`, headId,undefined,undefined,'success');
        } else {
            currentDelPos = headId; // Reset current for traversal
            prevDelPos = null;
            for(countDelPos = 0; countDelPos < position; countDelPos++){
                if (actualListNodes.get(currentDelPos)!.nextId === headId && countDelPos < position -1){ // Reached end before finding position
                     addStep(lineMap.posNotFound, `Position ${position} out of bounds. List length ${countDelPos+1}.`, undefined,undefined,undefined,'failure');
                     return localSteps;
                }
                prevDelPos = currentDelPos;
                currentDelPos = actualListNodes.get(currentDelPos)!.nextId!;
                 addStep(lineMap.traverseLoop, `At index ${countDelPos}, node ${actualListNodes.get(prevDelPos!)?.value}. Target pos: ${position}.`, prevDelPos);
            }
             // currentDelPos is now the node to delete, prevDelPos is its predecessor
            if (currentDelPos) {
                addStep(lineMap.deleteNodeLogic, `Node to delete at pos ${position} is ${actualListNodes.get(currentDelPos)?.value}.`, currentDelPos);
                actualListNodes.get(prevDelPos!)!.nextId = actualListNodes.get(currentDelPos)!.nextId;
                if (currentDelPos === headId && actualListNodes.get(currentDelPos)!.nextId === headId) { // Very specific: deleting the only node via non-zero pos if logic allows
                    headId = null;
                } else if (actualListNodes.get(prevDelPos!)!.nextId === headId && currentDelPos === headId) {
                    // This case means we looped around and prev is now tail, current is head (deleting head via non-zero pos)
                    // This should have been caught by pos === 0 case, but as a safeguard:
                    headId = actualListNodes.get(headId)!.nextId; // new head
                }
                actualListNodes.delete(currentDelPos);
                addStep(lineMap.end, `Deleted node at position ${position}.`, prevDelPos,undefined,undefined,'success');
            } else {
                 addStep(lineMap.posNotFound, `Position ${position} out of bounds (list length was ${countDelPos}). Nothing deleted.`, undefined,undefined,undefined,'failure');
            }
        }
        break;

    case 'traverse':
        if(!headId) { addStep(lineMap.emptyCheck, "List empty.", undefined, undefined, undefined, 'info'); break; }
        addStep(lineMap.initCurrent, "Traversing list.", headId);
        let currentTravId: string | null = headId;
        let travCount = 0; 
        const maxTrav = actualListNodes.size + 2; // Safety break for traversal
        do {
            if (!currentTravId || travCount > maxTrav) break;
            const currentNode = actualListNodes.get(currentTravId);
            if (!currentNode) break;
            addStep(lineMap.processNode, `Visiting ${currentNode.value}`, currentTravId);
            currentTravId = currentNode.nextId;
            travCount++;
        } while (currentTravId !== headId && currentTravId !== null);
        if(currentTravId === headId && actualListNodes.size > 0) addStep(lineMap.loopCondition, `Back to head ${actualListNodes.get(headId)?.value}. Traversal complete.`, headId);
        else if (currentTravId === null && actualListNodes.size > 0) addStep(lineMap.loopCondition, `Reached null (should not happen in valid CLL). Traversal ended.`, undefined);
        else addStep(lineMap.loopCondition, `Traversal ended.`, undefined);
        break;
    default:
      addStep(0, `Operation ${operation} viz not fully implemented for Circular LL.`);
  }
  return localSteps;
};

