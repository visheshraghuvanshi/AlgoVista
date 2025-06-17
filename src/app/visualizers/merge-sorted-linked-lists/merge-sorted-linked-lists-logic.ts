
import type { LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';

export const MERGE_ITERATIVE_LINE_MAP = {
  funcDeclare: 1, initDummy: 2, initTail: 3, whileLoop: 4, compareL1L2: 5,
  linkL1: 6, moveL1: 7, linkL2: 8, moveL2: 9, moveTail: 10, appendRemaining: 11, returnMerged: 12,
};
export const MERGE_RECURSIVE_LINE_MAP = {
  funcDeclare: 1, baseL1Null: 2, baseL2Null: 3, compareL1L2: 4,
  linkL1Recurse: 5, returnL1: 6, linkL2Recurse: 7, returnL2: 8,
};

let nodeIdCounter = 5000;
const generateNodeId = (val: string | number) => `llm-node-${val}-${nodeIdCounter++}`;

export function parseListStringForMerge(input: string): { value: string | number, id: string }[] {
    if (input.trim() === '') return [];
    return input.split(',').map(s => s.trim()).filter(s => s !== '').map(valStr => {
        const num = Number(valStr);
        const value = isNaN(num) ? valStr : num; // Allow string or number values
        return { value, id: generateNodeId(value) }; 
    }).sort((a,b) => (a.value as number) - (b.value as number)); // Ensure lists are sorted for merge logic
}

function createVisualNodesForMerge(
  nodeMap: Map<string, { value: string | number, nextId: string | null }>,
  listHeadId: string | null,
  auxPointers: Record<string, string | null> = {}
): LinkedListNodeVisual[] {
  const visualNodes: LinkedListNodeVisual[] = [];
  let currentId = listHeadId;
  const visited = new Set<string>();
  let xPos = 0;

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    const nodeData = nodeMap.get(currentId);
    if (!nodeData) break;

    let color = "hsl(var(--secondary))";
    if (auxPointers.l1 === currentId) color = "hsl(var(--blue-500))"; // Use a distinct color for l1 pointer
    if (auxPointers.l2 === currentId) color = "hsl(var(--green-500))"; // Distinct for l2
    if (auxPointers.tail === currentId || auxPointers.mergedCurrent === currentId) color = "hsl(var(--accent))";
    
    visualNodes.push({
      id: currentId, value: nodeData.value, nextId: nodeData.nextId, color,
      isHead: currentId === listHeadId,
      x: 20 + xPos * 80, y: 100, // Simple horizontal layout for merged list
    });
    currentId = nodeData.nextId;
    xPos++;
  }
  return visualNodes;
}

export const generateMergeSortedListsSteps = (
  list1String: string,
  list2String: string,
  type: 'iterative' | 'recursive'
): LinkedListAlgorithmStep[] => {
  const localSteps: LinkedListAlgorithmStep[] = [];
  nodeIdCounter = 5000; // Reset ID counter
  const parsedL1 = parseListStringForMerge(list1String);
  const parsedL2 = parseListStringForMerge(list2String);

  const l1Map = new Map<string, { value: string | number, nextId: string | null }>();
  parsedL1.forEach((p, i) => l1Map.set(p.id, { value: p.value, nextId: i < parsedL1.length - 1 ? parsedL1[i+1].id : null }));
  let l1HeadId: string | null = parsedL1.length > 0 ? parsedL1[0].id : null;

  const l2Map = new Map<string, { value: string | number, nextId: string | null }>();
  parsedL2.forEach((p, i) => l2Map.set(p.id, { value: p.value, nextId: i < parsedL2.length - 1 ? parsedL2[i+1].id : null }));
  let l2HeadId: string | null = parsedL2.length > 0 ? parsedL2[0].id : null;
  
  // This map will hold all nodes that become part of the merged list.
  const mergedListMap = new Map<string, { value: string | number, nextId: string | null }>();
  let mergedHeadId: string | null = null;
  
  const addStep = (line: number, message: string, currentL1: string|null, currentL2: string|null, currentTailOfMerged: string|null, displayMap?: Map<string, { value: string | number, nextId: string | null }>, displayHead?: string|null) => {
    const nodesToShow = createVisualNodesForMerge(displayMap || mergedListMap, displayHead || mergedHeadId, { l1: currentL1, l2: currentL2, tail: currentTailOfMerged });
    localSteps.push({
      nodes: nodesToShow, 
      headId: displayHead || mergedHeadId,
      currentLine: line, message, 
      auxiliaryPointers: { l1: currentL1, l2: currentL2, tail: currentTailOfMerged,
         l1_val: currentL1 ? (l1Map.get(currentL1)?.value?.toString() || 'null') : 'null',
         l2_val: currentL2 ? (l2Map.get(currentL2)?.value?.toString() || 'null') : 'null',
         tail_val: currentTailOfMerged ? (mergedListMap.get(currentTailOfMerged)?.value?.toString() || 'null') : 'null'
      }, 
      operation: `merge-${type}`
    });
  };

  if (type === 'iterative') {
    const lm = MERGE_ITERATIVE_LINE_MAP;
    addStep(lm.funcDeclare, "Start Iterative Merge.", l1HeadId, l2HeadId, null);

    const dummyNodeId = generateNodeId('dummy');
    mergedListMap.set(dummyNodeId, { value: 'dummy', nextId: null });
    let tailId: string = dummyNodeId; // Tail of the merged list
    addStep(lm.initDummy, "Create dummy head for merged list.", l1HeadId, l2HeadId, tailId);
    addStep(lm.initTail, "Initialize tail pointer to dummy.", l1HeadId, l2HeadId, tailId);

    let currentL1Id = l1HeadId;
    let currentL2Id = l2HeadId;

    while (currentL1Id && currentL2Id) {
      addStep(lm.whileLoop, "Comparing elements from L1 and L2.", currentL1Id, currentL2Id, tailId);
      const l1Node = l1Map.get(currentL1Id)!;
      const l2Node = l2Map.get(currentL2Id)!;
      addStep(lm.compareL1L2, `Compare L1 (${l1Node.value}) and L2 (${l2Node.value}).`, currentL1Id, currentL2Id, tailId);

      if ((l1Node.value as number) < (l2Node.value as number)) {
        mergedListMap.get(tailId)!.nextId = currentL1Id; // Link
        if(!mergedListMap.has(currentL1Id)) mergedListMap.set(currentL1Id, l1Node); // Add to merged map
        addStep(lm.linkL1, `L1 is smaller. Link ${l1Node.value} to merged list.`, currentL1Id, currentL2Id, tailId);
        tailId = currentL1Id;
        currentL1Id = l1Node.nextId;
        addStep(lm.moveL1, `Move L1 pointer.`, currentL1Id, currentL2Id, tailId);
      } else {
        mergedListMap.get(tailId)!.nextId = currentL2Id; // Link
        if(!mergedListMap.has(currentL2Id)) mergedListMap.set(currentL2Id, l2Node);
        addStep(lm.linkL2, `L2 is smaller or equal. Link ${l2Node.value} to merged list.`, currentL1Id, currentL2Id, tailId);
        tailId = currentL2Id;
        currentL2Id = l2Node.nextId;
        addStep(lm.moveL2, `Move L2 pointer.`, currentL1Id, currentL2Id, tailId);
      }
      if (mergedHeadId === null && mergedListMap.get(dummyNodeId)!.nextId) mergedHeadId = mergedListMap.get(dummyNodeId)!.nextId;
      addStep(lm.moveTail, `Move tail pointer to ${mergedListMap.get(tailId)?.value}.`, currentL1Id, currentL2Id, tailId);
    }
    
    const remainingId = currentL1Id || currentL2Id;
    const remainingMap = currentL1Id ? l1Map : l2Map;
    mergedListMap.get(tailId!)!.nextId = remainingId; // Append rest
    // Add all remaining nodes from the non-empty list to mergedListMap for rendering
    let tempCurrent = remainingId;
    while(tempCurrent) {
        if(remainingMap.has(tempCurrent) && !mergedListMap.has(tempCurrent)) mergedListMap.set(tempCurrent, remainingMap.get(tempCurrent)!);
        else if (!remainingMap.has(tempCurrent)) break; 
        tempCurrent = remainingMap.get(tempCurrent)!.nextId;
    }

    addStep(lm.appendRemaining, `Append remaining nodes from ${currentL1Id ? 'L1' : (currentL2Id ? 'L2' : 'none')}.`, currentL1Id, currentL2Id, tailId);
    
    mergedHeadId = mergedListMap.get(dummyNodeId)!.nextId; // Final head
    mergedListMap.delete(dummyNodeId); // Clean up dummy

    addStep(lm.returnMerged, "Iterative merge complete.", null, null, null);
  } else { // Recursive
    const lm = MERGE_RECURSIVE_LINE_MAP;
    
    function mergeRecursiveHelper(h1: string | null, h2: string | null): string | null {
        addStep(lm.funcDeclare, `Call: mergeRecursive(${h1 ? l1Map.get(h1)?.value : 'null'}, ${h2 ? l2Map.get(h2)?.value : 'null'})`, h1, h2, null);
        if (!h1) { addStep(lm.baseL1Null, `L1 is null, return L2.`, h1, h2, null); return h2; }
        if (!h2) { addStep(lm.baseL2Null, `L2 is null, return L1.`, h1, h2, null); return h1; }

        const n1 = l1Map.get(h1)!;
        const n2 = l2Map.get(h2)!;
        addStep(lm.compareL1L2, `Compare L1 (${n1.value}) and L2 (${n2.value})`, h1, h2, null);
        
        let resultNodeId: string | null;
        if ((n1.value as number) < (n2.value as number)) {
            addStep(lm.linkL1Recurse, `L1 smaller. L1.next = merge(L1.next, L2). Recurse.`, h1, h2, null);
            const nextMergedHeadId = mergeRecursiveHelper(n1.nextId, h2);
            l1Map.get(h1)!.nextId = nextMergedHeadId; // Actual link for the call stack return
            if(!mergedListMap.has(h1)) mergedListMap.set(h1, l1Map.get(h1)!); // Add to map for rendering
            // Ensure nodes from returned sub-list are in mergedMap too
            let temp = nextMergedHeadId;
            while(temp && !mergedListMap.has(temp)){
                if(l1Map.has(temp)) mergedListMap.set(temp, l1Map.get(temp)!);
                else if(l2Map.has(temp)) mergedListMap.set(temp, l2Map.get(temp)!);
                else break;
                temp = mergedListMap.get(temp)!.nextId;
            }
            resultNodeId = h1;
            addStep(lm.returnL1, `Return L1 (${n1.value}) as current merged head.`, h1, h2, resultNodeId, mergedListMap, resultNodeId);
        } else {
            addStep(lm.linkL2Recurse, `L2 smaller/equal. L2.next = merge(L1, L2.next). Recurse.`, h1, h2, null);
            const nextMergedHeadId = mergeRecursiveHelper(h1, n2.nextId);
            l2Map.get(h2)!.nextId = nextMergedHeadId;
            if(!mergedListMap.has(h2)) mergedListMap.set(h2, l2Map.get(h2)!);
            let temp = nextMergedHeadId;
             while(temp && !mergedListMap.has(temp)){
                if(l1Map.has(temp)) mergedListMap.set(temp, l1Map.get(temp)!);
                else if(l2Map.has(temp)) mergedListMap.set(temp, l2Map.get(temp)!);
                else break;
                temp = mergedListMap.get(temp)!.nextId;
            }
            resultNodeId = h2;
            addStep(lm.returnL2, `Return L2 (${n2.value}) as current merged head.`, h1, h2, resultNodeId, mergedListMap, resultNodeId);
        }
        return resultNodeId;
    }
    mergedHeadId = mergeRecursiveHelper(l1HeadId, l2HeadId);
    addStep(lm.funcDeclare, "Recursive merge complete.", null, null, null, mergedListMap, mergedHeadId);
  }
  return localSteps;
};
