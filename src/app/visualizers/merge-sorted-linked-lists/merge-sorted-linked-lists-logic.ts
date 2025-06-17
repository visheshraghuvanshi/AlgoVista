
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
        const value = isNaN(num) ? valStr : num;
        return { value, id: generateNodeId(value) }; // Ensure unique IDs
    }).sort((a,b) => (a.value as number) - (b.value as number)); // Assume lists are sorted, sort if not for consistency
}

// Simplified: Visualizes one list at a time or the merged list
function createVisualNodesForMerge(
  nodeMap: Map<string, { value: string | number, nextId: string | null }>,
  listHeadId: string | null,
  auxPointers: Record<string, string | null> = {}
): LinkedListNodeVisual[] {
  const visualNodes: LinkedListNodeVisual[] = [];
  let currentId = listHeadId;
  const visited = new Set<string>();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    const nodeData = nodeMap.get(currentId);
    if (!nodeData) break;

    let color = "hsl(var(--secondary))";
    if (auxPointers.l1 === currentId || auxPointers.l2 === currentId) color = "hsl(var(--primary))";
    if (auxPointers.tail === currentId || auxPointers.mergedCurrent === currentId) color = "hsl(var(--accent))";
    
    visualNodes.push({
      id: currentId, value: nodeData.value, nextId: nodeData.nextId, color,
      isHead: currentId === listHeadId,
    });
    currentId = nodeData.nextId;
  }
  return visualNodes;
}

export const generateMergeSortedListsSteps = (
  list1String: string,
  list2String: string,
  type: 'iterative' | 'recursive'
): LinkedListAlgorithmStep[] => {
  const localSteps: LinkedListAlgorithmStep[] = [];
  nodeIdCounter = 5000; // Reset
  const parsedL1 = parseListStringForMerge(list1String);
  const parsedL2 = parseListStringForMerge(list2String);

  const l1Map = new Map<string, { value: string | number, nextId: string | null }>();
  parsedL1.forEach((p, i) => l1Map.set(p.id, { value: p.value, nextId: i < parsedL1.length - 1 ? parsedL1[i+1].id : null }));
  let l1HeadId: string | null = parsedL1.length > 0 ? parsedL1[0].id : null;

  const l2Map = new Map<string, { value: string | number, nextId: string | null }>();
  parsedL2.forEach((p, i) => l2Map.set(p.id, { value: p.value, nextId: i < parsedL2.length - 1 ? parsedL2[i+1].id : null }));
  let l2HeadId: string | null = parsedL2.length > 0 ? parsedL2[0].id : null;
  
  const mergedListMap = new Map<string, { value: string | number, nextId: string | null }>();
  let mergedHeadId: string | null = null;
  
  // AddStep needs to handle showing L1, L2, and Merged list.
  // For simplicity, this example might just show the merged list as it's built.
  // Or, it could show all three with auxiliary pointers indicating current nodes in L1, L2.
  const addStep = (line: number, message: string, aux?: Record<string, string | null>) => {
    // This visualization is complex. For now, focus on merged list + aux pointers for l1,l2 heads.
    const nodesToShow = createVisualNodesForMerge(mergedListMap, mergedHeadId, aux);
    // We could also add L1 and L2 nodes to nodesToShow with different Y offsets if panel supported it well.
    // For now, the message and aux pointers will have to imply L1/L2 state.
    
    localSteps.push({
      nodes: nodesToShow, // This ideally would show L1, L2 and Merged. Simplified here.
      headId: mergedHeadId, // Head of the merged list
      currentLine: line, message, auxiliaryPointers: aux, operation: `merge-${type}`
    });
  };

  if (type === 'iterative') {
    const lm = MERGE_ITERATIVE_LINE_MAP;
    addStep(lm.funcDeclare, "Start Iterative Merge.", { l1: l1HeadId, l2: l2HeadId });

    const dummyNodeId = generateNodeId('dummy');
    mergedListMap.set(dummyNodeId, { value: 'dummy', nextId: null });
    let tailId: string | null = dummyNodeId;
    addStep(lm.initDummy, "Create dummy head for merged list.", { l1: l1HeadId, l2: l2HeadId, dummy: dummyNodeId });
    addStep(lm.initTail, "Initialize tail pointer to dummy.", { l1: l1HeadId, l2: l2HeadId, tail: tailId });

    let currentL1Id = l1HeadId;
    let currentL2Id = l2HeadId;

    while (currentL1Id && currentL2Id) {
      addStep(lm.whileLoop, "Comparing elements from L1 and L2.", { l1: currentL1Id, l2: currentL2Id, tail: tailId });
      const l1Node = l1Map.get(currentL1Id)!;
      const l2Node = l2Map.get(currentL2Id)!;
      addStep(lm.compareL1L2, `Compare L1 (${l1Node.value}) and L2 (${l2Node.value}).`, { l1: currentL1Id, l2: currentL2Id, tail: tailId });

      if ((l1Node.value as number) < (l2Node.value as number)) {
        mergedListMap.get(tailId!)!.nextId = currentL1Id;
        mergedListMap.set(currentL1Id, l1Node); // Add to merged map
        addStep(lm.linkL1, `L1 is smaller. Link ${l1Node.value} to merged list.`, { l1: currentL1Id, l2: currentL2Id, tail: tailId });
        tailId = currentL1Id;
        currentL1Id = l1Node.nextId;
        addStep(lm.moveL1, `Move L1 pointer to ${currentL1Id ? l1Map.get(currentL1Id)?.value : 'null'}.`, { l1: currentL1Id, l2: currentL2Id, tail: tailId });
      } else {
        mergedListMap.get(tailId!)!.nextId = currentL2Id;
        mergedListMap.set(currentL2Id, l2Node); // Add to merged map
        addStep(lm.linkL2, `L2 is smaller or equal. Link ${l2Node.value} to merged list.`, { l1: currentL1Id, l2: currentL2Id, tail: tailId });
        tailId = currentL2Id;
        currentL2Id = l2Node.nextId;
        addStep(lm.moveL2, `Move L2 pointer to ${currentL2Id ? l2Map.get(currentL2Id)?.value : 'null'}.`, { l1: currentL1Id, l2: currentL2Id, tail: tailId });
      }
      if (mergedHeadId === null) mergedHeadId = mergedListMap.get(dummyNodeId)!.nextId; // First actual node
      addStep(lm.moveTail, `Move tail pointer to ${tailId ? mergedListMap.get(tailId)?.value : 'null'}.`, { l1: currentL1Id, l2: currentL2Id, tail: tailId });
    }
    
    const remainingId = currentL1Id || currentL2Id;
    const remainingMap = currentL1Id ? l1Map : l2Map;
    if (tailId) mergedListMap.get(tailId!)!.nextId = remainingId;
    // Add all remaining nodes from the non-empty list to mergedListMap
    let tempCurrent = remainingId;
    while(tempCurrent) {
        if(remainingMap.has(tempCurrent)) mergedListMap.set(tempCurrent, remainingMap.get(tempCurrent)!);
        else break; // Should not happen if maps are correct
        tempCurrent = remainingMap.get(tempCurrent)!.nextId;
    }

    addStep(lm.appendRemaining, `Append remaining nodes from ${currentL1Id ? 'L1' : (currentL2Id ? 'L2' : 'none')}.`, { l1: currentL1Id, l2: currentL2Id, tail: tailId });
    
    mergedHeadId = mergedListMap.get(dummyNodeId)!.nextId; // Final head of merged
    mergedListMap.delete(dummyNodeId); // Remove dummy

    addStep(lm.returnMerged, "Merge complete. Return merged list.", { mergedHead: mergedHeadId });
  } else { // Recursive (Highly conceptual steps for visualization)
    const lm = MERGE_RECURSIVE_LINE_MAP;
    
    function mergeRecursiveHelper(h1: string | null, h2: string | null): string | null {
        addStep(lm.funcDeclare, `mergeRecursive(${h1 ? l1Map.get(h1)?.value : 'null'}, ${h2 ? l2Map.get(h2)?.value : 'null'})`, { l1:h1, l2:h2 });
        if (!h1) { addStep(lm.baseL1Null, `L1 is null, return L2 (${h2 ? l2Map.get(h2)?.value : 'null'})`, {l1:h1,l2:h2}); return h2; }
        if (!h2) { addStep(lm.baseL2Null, `L2 is null, return L1 (${h1 ? l1Map.get(h1)?.value : 'null'})`, {l1:h1,l2:h2}); return h1; }

        const n1 = l1Map.get(h1)!;
        const n2 = l2Map.get(h2)!;
        addStep(lm.compareL1L2, `Compare L1 (${n1.value}) and L2 (${n2.value})`, {l1:h1,l2:h2});
        
        let resultNodeId: string | null;
        if ((n1.value as number) < (n2.value as number)) {
            addStep(lm.linkL1Recurse, `L1 smaller. Set L1.next = merge(L1.next, L2). Recurse.`, {l1:h1,l2:h2});
            const nextMergeHead = mergeRecursiveHelper(n1.nextId, h2);
            l1Map.get(h1)!.nextId = nextMergeHead;
            // Update mergedListMap as we go
            if (!mergedListMap.has(h1)) mergedListMap.set(h1, l1Map.get(h1)!);
            if (nextMergeHead && !mergedListMap.has(nextMergeHead) && (l1Map.has(nextMergeHead) || l2Map.has(nextMergeHead))) {
                 mergedListMap.set(nextMergeHead, (l1Map.get(nextMergeHead) || l2Map.get(nextMergeHead))!);
            }
            resultNodeId = h1;
            addStep(lm.returnL1, `Return L1 (${n1.value}) as current merged head.`, {l1:h1,l2:h2, currentMerged: resultNodeId});
        } else {
            addStep(lm.linkL2Recurse, `L2 smaller/equal. Set L2.next = merge(L1, L2.next). Recurse.`, {l1:h1,l2:h2});
            const nextMergeHead = mergeRecursiveHelper(h1, n2.nextId);
            l2Map.get(h2)!.nextId = nextMergeHead;
            if (!mergedListMap.has(h2)) mergedListMap.set(h2, l2Map.get(h2)!);
             if (nextMergeHead && !mergedListMap.has(nextMergeHead) && (l1Map.has(nextMergeHead) || l2Map.has(nextMergeHead))) {
                 mergedListMap.set(nextMergeHead, (l1Map.get(nextMergeHead) || l2Map.get(nextMergeHead))!);
            }
            resultNodeId = h2;
            addStep(lm.returnL2, `Return L2 (${n2.value}) as current merged head.`, {l1:h1,l2:h2, currentMerged: resultNodeId});
        }
        return resultNodeId;
    }
    mergedHeadId = mergeRecursiveHelper(l1HeadId, l2HeadId);
    addStep(lm.funcDeclare, "Recursive merge complete.", { mergedHead: mergedHeadId });
  }
  return localSteps;
};
