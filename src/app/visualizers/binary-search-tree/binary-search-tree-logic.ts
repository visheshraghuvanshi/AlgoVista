
import type { BinaryTreeNodeVisual, BinaryTreeEdgeVisual, TreeAlgorithmStep, BSTNodeInternal, RBTreeGraph /* Using RBTreeGraph for its finalGraphState structure */ } from '@/types';
import type { BSTOperationType } from './types'; // Local import for operation type

// Line maps for each operation
export const BST_OPERATION_LINE_MAPS: Record<BSTOperationType | 'structure', Record<string, number>> = {
  structure: { // For showing basic node/tree class structure
    nodeClassStart: 1, nodeConstructor: 2, nodeProps: 3, nodeClassEnd: 6,
    treeClassStart: 7, treeConstructor: 8, treeRoot: 9, treeClassEnd: 11,
  },
  insert: {
    mainFunc: 1, callRec: 2, recFunc: 3, baseCaseNull: 4, goLeft: 5, assignLeft: 6, goRight: 7, assignRight: 8, returnNode: 9,
  },
  search: {
    mainFunc: 1, callRec: 2, recFunc: 3, baseCaseNullOrFound: 4, goLeft: 5, returnLeftSearch: 6, goRight: 7, returnRightSearch: 8,
  },
  delete: {
    mainFunc: 1, callRec: 2, recFunc: 3, baseCaseNull: 4, goLeft: 5, assignLeft:6, goRight: 7, assignRight:8, nodeFound: 9,
    case1LeftNull: 10, returnRightChild: 11, case1RightNull: 12, returnLeftChild: 13,
    case2TwoChildren: 14, findMinValue: 15, copyMinValue: 16, deleteInorderSuccessor: 17, returnNode: 18,
    helperMinValue: 19, loopMinLeft: 20, returnMin: 21,
  },
  build: { /* No specific lines for simple build via repeated inserts */ },
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  visiting: "hsl(var(--primary))", // Node being compared or focused
  found: "hsl(var(--accent))",     // Node found (search/delete target)
  inserted: "hsl(var(--accent))", // Newly inserted node (can be same as found)
  path: "hsl(var(--primary)/0.7)", // Nodes on the path to target
  toBeDeleted: "hsl(var(--destructive))",
  successor: "hsl(var(--ring))",
};
const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  path: "hsl(var(--primary))",
};

let bstNodeIdCounter = 0;
const generateBSTNodeId = (value: number | string) => `bst-node-${String(value).replace(/[^a-zA-Z0-9-_]/g, '')}-${bstNodeIdCounter++}`;


export function parseBSTInput(inputStr: string): number[] {
  if (inputStr.trim() === '') return [];
  return inputStr.split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n) && n > -1000 && n < 1000); // Basic validation
}

function getLayout(
  currentRootId: string | null,
  nodesMap: Map<string, BSTNodeInternal>,
  activeNodeIds: string[] = [],
  pathNodeIds: string[] = [],
  specialColors: Record<string, string> = {} // { nodeId: colorString }
): { visualNodes: BinaryTreeNodeVisual[], visualEdges: BinaryTreeEdgeVisual[] } {
  const visualNodes: BinaryTreeNodeVisual[] = [];
  const visualEdges: BinaryTreeEdgeVisual[] = [];
  if (!currentRootId) return { visualNodes, visualEdges };

  const X_SPACING_BASE = 70; 
  const Y_SPACING = 70; 
  const SVG_WIDTH_CENTER = 300; 

  function positionNode(nodeId: string | null, x: number, y: number, xOffsetMultiplier: number, depth: number) {
    if (!nodeId || !nodesMap.has(nodeId)) return;

    const nodeInternal = nodesMap.get(nodeId)!;
    let color = specialColors[nodeId] || NODE_COLORS.default;
    let textColor = specialColors[nodeId] ? (specialColors[nodeId] === NODE_COLORS.found || specialColors[nodeId] === NODE_COLORS.inserted ? "hsl(var(--accent-foreground))" : "hsl(var(--primary-foreground))") : "hsl(var(--secondary-foreground))";
    
    if (pathNodeIds.includes(nodeId) && !specialColors[nodeId]) { color = NODE_COLORS.path; textColor = "hsl(var(--primary-foreground))"; }
    if (activeNodeIds.includes(nodeId) && !specialColors[nodeId]) { color = NODE_COLORS.visiting; textColor = "hsl(var(--primary-foreground))"; }


    visualNodes.push({ id: nodeId, value: nodeInternal.value, x, y, color, textColor, leftId: nodeInternal.leftId, rightId: nodeInternal.rightId });
    
    const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.7, depth); 

    if (nodeInternal.leftId && nodesMap.has(nodeInternal.leftId)) {
      visualEdges.push({
        id: `edge-${nodeId}-${nodeInternal.leftId}`, sourceId: nodeId, targetId: nodeInternal.leftId,
        color: (pathNodeIds.includes(nodeId) && pathNodeIds.includes(nodeInternal.leftId)) ? EDGE_COLORS.path : EDGE_COLORS.default
      });
      positionNode(nodeInternal.leftId, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
    }
    if (nodeInternal.rightId && nodesMap.has(nodeInternal.rightId)) {
      visualEdges.push({
        id: `edge-${nodeId}-${nodeInternal.rightId}`, sourceId: nodeId, targetId: nodeInternal.rightId,
        color: (pathNodeIds.includes(nodeId) && pathNodeIds.includes(nodeInternal.rightId)) ? EDGE_COLORS.path : EDGE_COLORS.default
      });
      positionNode(nodeInternal.rightId, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
    }
  }
  positionNode(currentRootId, SVG_WIDTH_CENTER, 50, 0.8, 0); // Use a factor for xOffsetMultiplier
   if (visualNodes.length > 0) {
        const minX = Math.min(...visualNodes.map(n => n.x).filter(x => x !== undefined && !isNaN(x)));
        const maxX = Math.max(...visualNodes.map(n => n.x).filter(x => x !== undefined && !isNaN(x)));
        if(isFinite(minX) && isFinite(maxX)) {
            const treeWidth = maxX - minX;
            const currentCenterX = minX + treeWidth / 2;
            const desiredCenterX = SVG_WIDTH_CENTER;
            const shiftX = desiredCenterX - currentCenterX;

            let scaleFactor = 1;
            if (treeWidth > SVG_WIDTH_CENTER * 1.9 && treeWidth > 0) { 
                scaleFactor = (SVG_WIDTH_CENTER * 1.9) / treeWidth;
            }
            visualNodes.forEach(node => {
                if (node.x !== undefined) {
                     node.x = desiredCenterX + (node.x - currentCenterX) * scaleFactor;
                }
            });
        }
    }
  return { visualNodes, visualEdges };
}


export const generateBSTSteps = (
  currentBSTRef: React.MutableRefObject<{ rootId: string | null, nodes: Map<string, BSTNodeInternal> }>,
  operation: BSTOperationType,
  value?: number,
  initialValuesString?: string
): TreeAlgorithmStep[] => {
  const localSteps: TreeAlgorithmStep[] = [];
  const operationLineMap = BST_OPERATION_LINE_MAPS[operation] || BST_OPERATION_LINE_MAPS.structure; // Fallback

  const workingNodes = new Map<string, BSTNodeInternal>();
  currentBSTRef.current.nodes.forEach((node, id) => {
    workingNodes.set(id, { ...node }); 
  });
  let rootId = currentBSTRef.current.rootId;
  
  const currentPathNodeIds: string[] = []; // Track path for current DFS-like operation
  let lastInsertedNodeId: string | null = null; // To highlight newly inserted node in final step
  let wasDuplicateInInsert: boolean = false;
  let foundNodeIdInSearch: string | null = null;
  let nodeWasActuallyDeleted: boolean = false;
  
  function addStep(
    line: number | null,
    message: string,
    activeIds: string[] = [],
    specialColors: Record<string, string> = {},
    pathForStep: string[] = currentPathNodeIds, // Allow overriding path for specific steps
    opStatus?: 'success' | 'failure' | 'info'
  ) {
    const { visualNodes, visualEdges } = getLayout(rootId, workingNodes, activeIds, pathForStep, specialColors);
    localSteps.push({
      nodes: visualNodes,
      edges: visualEdges,
      traversalPath: pathForStep.map(id => workingNodes.get(id)?.value?.toString() ?? '?'),
      currentLine: line,
      message,
      currentProcessingNodeId: activeIds.length > 0 ? activeIds[0] : (pathForStep.length > 0 ? pathForStep[pathForStep.length - 1] : null),
      status: opStatus,
      auxiliaryData: {} // Will be set for the final step
    });
  }

  function insertRec(nodeId: string | null, val: number): string {
    currentPathNodeIds.push(nodeId!); // Assume nodeId is not null here for path construction
    addStep(operationLineMap.recFunc, `InsertRec(${val}) at node ${nodeId ? workingNodes.get(nodeId)?.value : 'null'}. Path: ${currentPathNodeIds.map(id=>workingNodes.get(id)?.value).join('->')}`, nodeId ? [nodeId] : []);
    
    if (nodeId === null) {
      const newNodeId = generateBSTNodeId(val);
      workingNodes.set(newNodeId, { id: newNodeId, value: val, leftId: null, rightId: null });
      lastInsertedNodeId = newNodeId; // Track the ID of the truly new node
      wasDuplicateInInsert = false;
      addStep(operationLineMap.baseCaseNull, `Create new node ${val}.`, [newNodeId], {[newNodeId]: NODE_COLORS.inserted});
      currentPathNodeIds.pop();
      return newNodeId;
    }
    const node = workingNodes.get(nodeId)!;
    if (val < node.value!) {
      addStep(operationLineMap.goLeft, `Value ${val} < node ${node.value}. Go left.`, [nodeId]);
      node.leftId = insertRec(node.leftId, val);
      addStep(operationLineMap.assignLeft, `Link left child of ${node.value}.`, [nodeId]);
    } else if (val > node.value!) {
      addStep(operationLineMap.goRight, `Value ${val} > node ${node.value}. Go right.`, [nodeId]);
      node.rightId = insertRec(node.rightId, val);
      addStep(operationLineMap.assignRight, `Link right child of ${node.value}.`, [nodeId]);
    } else {
      wasDuplicateInInsert = true;
      lastInsertedNodeId = nodeId; // It "found" the existing node
      addStep(operationLineMap.returnNode, `Value ${val} already exists. No insertion.`, [nodeId], {[nodeId]: NODE_COLORS.found});
    }
    currentPathNodeIds.pop();
    addStep(operationLineMap.returnNode, `Return from insertRec call for node ${node.value}.`, [nodeId]);
    return nodeId;
  }

  function searchRec(nodeId: string | null, val: number): {foundNodeId: string | null} {
    if (nodeId) currentPathNodeIds.push(nodeId);
    addStep(operationLineMap.recFunc, `SearchRec(${val}) at node ${nodeId ? workingNodes.get(nodeId)?.value : 'null'}. Path: ${currentPathNodeIds.map(id=>workingNodes.get(id)?.value).join('->')}`, nodeId ? [nodeId] : []);

    if (nodeId === null || workingNodes.get(nodeId)?.value === val) {
      foundNodeIdInSearch = nodeId;
      const foundColor = nodeId ? { [nodeId]: NODE_COLORS.found } : {};
      addStep(operationLineMap.baseCaseNullOrFound, nodeId ? `Value ${val} found.` : `Value ${val} not found (reached null).`, nodeId ? [nodeId] : [], foundColor, [...currentPathNodeIds]);
      if (nodeId) currentPathNodeIds.pop();
      return {foundNodeId};
    }
    const node = workingNodes.get(nodeId)!;
    let result: {foundNodeId: string | null} = {foundNodeId: null};
    if (val < node.value!) {
      addStep(operationLineMap.goLeft, `Value ${val} < node ${node.value}. Go left.`, [nodeId]);
      result = searchRec(node.leftId, val);
    } else {
      addStep(operationLineMap.goRight, `Value ${val} > node ${node.value}. Go right.`, [nodeId]);
      result = searchRec(node.rightId, val);
    }
    currentPathNodeIds.pop();
    addStep(operationLineMap.returnNode, `Return from searchRec for node ${node.value}.`, [nodeId]);
    return result;
  }
  
  function minValueNode(nodeId: string): BSTNodeInternal {
    let current = workingNodes.get(nodeId)!;
    addStep(operationLineMap.helperMinValue, `Finding min value in subtree of ${current.value}.`, [current.id], {[current.id]: NODE_COLORS.successor});
    while (current.leftId !== null) {
      currentPathNodeIds.push(current.id); // Track path to successor
      current = workingNodes.get(current.leftId)!;
      addStep(operationLineMap.loopMinLeft, `Current min candidate: ${current.value}. Path: ${currentPathNodeIds.map(id=>workingNodes.get(id)?.value).join('->')}`, [current.id], {[current.id]: NODE_COLORS.successor});
    }
    addStep(operationLineMap.returnMin, `Min value in subtree is ${current.value}.`, [current.id], {[current.id]: NODE_COLORS.successor});
    return current;
  }

  function deleteRec(nodeId: string | null, val: number): {newSubtreeRootId: string | null, deleted: boolean} {
    if (nodeId) currentPathNodeIds.push(nodeId);
    addStep(operationLineMap.recFunc, `DeleteRec(${val}) at node ${nodeId ? workingNodes.get(nodeId)?.value : 'null'}. Path: ${currentPathNodeIds.map(id=>workingNodes.get(id)?.value).join('->')}`, nodeId ? [nodeId] : []);

    if (nodeId === null) {
      addStep(operationLineMap.baseCaseNull, `Value ${val} not found (reached null).`, []);
      if (nodeId) currentPathNodeIds.pop();
      return {newSubtreeRootId: null, deleted: false};
    }
    const node = workingNodes.get(nodeId)!;
    let deletedHere = false;

    if (val < node.value!) {
      addStep(operationLineMap.goLeft, `Value ${val} < node ${node.value}. Go left.`, [nodeId]);
      const leftResult = deleteRec(node.leftId, val);
      node.leftId = leftResult.newSubtreeRootId;
      deletedHere = leftResult.deleted;
      addStep(operationLineMap.assignLeft, `Update left child of ${node.value}.`, [nodeId]);
    } else if (val > node.value!) {
      addStep(operationLineMap.goRight, `Value ${val} > node ${node.value}. Go right.`, [nodeId]);
      const rightResult = deleteRec(node.rightId, val);
      node.rightId = rightResult.newSubtreeRootId;
      deletedHere = rightResult.deleted;
      addStep(operationLineMap.assignRight, `Update right child of ${node.value}.`, [nodeId]);
    } else { 
      deletedHere = true;
      nodeWasActuallyDeleted = true; // Set global flag
      addStep(operationLineMap.nodeFound, `Node to delete (${val}) found.`, [nodeId], {[nodeId]: NODE_COLORS.toBeDeleted});
      if (node.leftId === null) {
        const rightChildId = node.rightId;
        addStep(operationLineMap.case1LeftNull, `Node has no left child. Return right child ${rightChildId ? workingNodes.get(rightChildId)?.value : 'null'}.`, [nodeId], {[nodeId]: NODE_COLORS.toBeDeleted});
        workingNodes.delete(nodeId); 
        currentPathNodeIds.pop();
        return {newSubtreeRootId: rightChildId, deleted: true};
      }
      if (node.rightId === null) {
        const leftChildId = node.leftId;
        addStep(operationLineMap.case1RightNull, `Node has no right child. Return left child ${leftChildId ? workingNodes.get(leftChildId)?.value : 'null'}.`, [nodeId], {[nodeId]: NODE_COLORS.toBeDeleted});
        workingNodes.delete(nodeId);
        currentPathNodeIds.pop();
        return {newSubtreeRootId: leftChildId, deleted: true};
      }
      
      addStep(operationLineMap.case2TwoChildren, `Node has two children. Find inorder successor.`, [nodeId], {[nodeId]: NODE_COLORS.toBeDeleted});
      // Clear current path before finding successor to show successor path clearly
      const oldPath = [...currentPathNodeIds]; currentPathNodeIds.length = 0;
      const successor = minValueNode(node.rightId!); 
      currentPathNodeIds.push(...oldPath); // Restore path for context of deleteRec

      addStep(operationLineMap.findMinValue, `Inorder successor is ${successor.value}.`, [successor.id], {[nodeId]: NODE_COLORS.toBeDeleted, [successor.id]: NODE_COLORS.successor});
      
      node.value = successor.value; 
      workingNodes.set(nodeId, {...node}); 
      addStep(operationLineMap.copyMinValue, `Copied successor value ${successor.value} to node ${node.id}.`, [nodeId], {[nodeId]: NODE_COLORS.toBeDeleted, [successor.id]:NODE_COLORS.successor});

      addStep(operationLineMap.deleteInorderSuccessor, `Delete original inorder successor (${successor.value}) from right subtree.`, [node.rightId!]);
      const deleteSuccessorResult = deleteRec(node.rightId, successor.value); // Delete the successor
      node.rightId = deleteSuccessorResult.newSubtreeRootId;
    }
    if (nodeId) currentPathNodeIds.pop();
    addStep(operationLineMap.returnNode, `Return from deleteRec call for node ${node.value}.`, [nodeId]);
    return {newSubtreeRootId: nodeId, deleted: deletedHere};
  }

  // ----- Operation Dispatch -----
  bstNodeIdCounter = Array.from(workingNodes.keys()).reduce((max, id) => Math.max(max, parseInt(id.split('-').pop() || '0')), 0) + 1;
  const opDisplay = operation.charAt(0).toUpperCase() + operation.slice(1);
  let finalStatus: 'success' | 'failure' | 'info' = 'info';

  if (operation === 'build') {
    const valuesToInsert = parseBSTInput(initialValuesString || "");
    rootId = null; 
    workingNodes.clear();
    bstNodeIdCounter = 0; 
    const buildOpMap = BST_OPERATION_LINE_MAPS.insert; 
    addStep(null, `Building tree from: ${valuesToInsert.join(', ')}`);
    if (valuesToInsert.length > 0) {
      valuesToInsert.forEach(v => {
        currentPathNodeIds.length = 0; // Reset path for each insert in build
        addStep(buildOpMap.mainFunc, `Build: insert(${v})`, []);
        rootId = insertRec(rootId, v); // insertRec adds its own steps and updates lastInsertedNodeId/wasDuplicate
        addStep(buildOpMap.callRec, `Root is now ${rootId ? workingNodes.get(rootId)?.value : 'null'} after inserting ${v}.`, []);
      });
    }
    finalStatus = 'success';
    addStep(null, `Build complete. Root is ${rootId ? workingNodes.get(rootId)?.value : 'null'}.`, rootId ? [rootId] : [], {}, [], finalStatus);
  } else if (value !== undefined) {
    currentPathNodeIds.length = 0; 
    addStep(operationLineMap.mainFunc, `Main call: ${opDisplay}(${value})`, []);
    if (operation === 'insert') {
      rootId = insertRec(rootId, value);
      const msg = wasDuplicateInInsert ? `Value ${value} already exists. No new insertion.` : `Insert of ${value} complete.`;
      finalStatus = wasDuplicateInInsert ? 'info' : 'success';
      addStep(null, msg, lastInsertedNodeId ? [lastInsertedNodeId] : (rootId ? [rootId] : []), lastInsertedNodeId ? {[lastInsertedNodeId]: wasDuplicateInInsert ? NODE_COLORS.found : NODE_COLORS.inserted} : {}, [], finalStatus);
    } else if (operation === 'search') {
      const searchResult = searchRec(rootId, value);
      // The last step of searchRec is conclusive.
      if (localSteps.length > 0) localSteps[localSteps.length -1].status = searchResult.foundNodeId ? 'success' : 'failure';
    } else if (operation === 'delete') {
      nodeWasActuallyDeleted = false; // Reset before delete operation
      const deleteResult = deleteRec(rootId, value);
      rootId = deleteResult.newSubtreeRootId;
      finalStatus = nodeWasActuallyDeleted ? 'success' : 'failure';
      const msg = nodeWasActuallyDeleted ? `Deletion of ${value} complete.` : `Value ${value} not found for deletion.`;
      addStep(null, msg, rootId ? [rootId] : [], {}, [], finalStatus);
    }
  } else if (operation === 'structure') {
    finalStatus = 'info';
    addStep(null, "Displaying current tree structure.", rootId ? [rootId] : [], {}, [], finalStatus);
  }
  
  if (localSteps.length > 0) {
    localSteps[localSteps.length - 1].auxiliaryData = {
      ...(localSteps[localSteps.length - 1].auxiliaryData || {}),
      finalGraphState: { rootId, nodes: new Map(workingNodes) } as unknown as RBTreeGraph // Cast for compatibility
    };
  }
  currentBSTRef.current = { rootId, nodes: new Map(workingNodes) };
  return localSteps;
};


