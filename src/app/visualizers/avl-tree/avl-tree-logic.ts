
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual, AVLNodeInternal, AVLTreeGraph, AVLOperationType } from './types';

export const NODE_COLORS_AVL = {
  DEFAULT: "hsl(var(--secondary))", 
  ACTIVE_COMPARISON: "hsl(var(--primary))",    
  PATH_TRAVERSED: "hsl(var(--primary)/0.6)",  
  NEWLY_INSERTED: "hsl(var(--accent))",
  TO_BE_DELETED: "hsl(var(--destructive)/0.8)",
  INORDER_SUCCESSOR: "hsl(var(--chart-5))",
  UNBALANCED_NODE_RED: "hsl(var(--destructive))", 
  ROTATION_PIVOT_YELLOW: "hsl(var(--chart-4))", 
  BALANCED_GREEN: "hsl(var(--chart-2))",       
  SLIGHTLY_UNBALANCED_YELLOW: "hsl(var(--chart-4))", 
};

const EDGE_COLORS_AVL = {
  DEFAULT: "hsl(var(--muted-foreground))",
  PATH_TRAVERSED: "hsl(var(--primary))",
};

export const AVL_TREE_LINE_MAP = {
    getHeightFunc: 1, getHeightReturn: 2,
    getBalanceFunc: 3, getBalanceCalc: 4,
    updateHeightFunc: 5, updateHeightCalc: 6,
    rotateRightFuncStart: 7, rotateRightSetup: 8, rotateRightPointers: 9, rotateRightUpdateHeights: 10, rotateRightReturnNewRoot: 11, rotateRightFuncEnd: 12,
    rotateLeftFuncStart: 13, rotateLeftSetup: 14, rotateLeftPointers: 15, rotateLeftUpdateHeights: 16, rotateLeftReturnNewRoot: 17, rotateLeftFuncEnd: 18,
    insertMainCall: 19, insertRecFunc: 20,
    insertBaseCaseNull: 21, insertGoLeft: 22, insertRecurseLeft: 23,
    insertGoRight: 24, insertRecurseRight: 25, insertDuplicate: 26,
    insertUpdateHeightAfterRec: 27, insertGetBalanceAfterRec: 28,
    llCaseCheck: 29, llCaseAction: 30, // Right Rotation
    rrCaseCheck: 31, rrCaseAction: 32, // Left Rotation
    lrCaseCheck: 33, lrCaseAction1: 34, lrCaseAction2: 35, // Left on LeftChild, then Right on Grandparent
    rlCaseCheck: 36, rlCaseAction1: 37, rlCaseAction2: 38, // Right on RightChild, then Left on Grandparent
    insertReturnNode: 39, insertRecEnd: 40,
    deleteMainCall: 41, deleteRecFunc: 42,
    deleteBaseCaseNull: 43, deleteGoLeftRec: 44, deleteGoRightRec: 45,
    deleteNodeFound: 46, deleteHandleOneOrZeroChild: 47, deleteHandleTwoChildren: 48,
    deleteFindSuccessor: 49, deleteCopySuccessorVal: 50, deleteRecurseOnSuccessor: 51,
    deleteIfTreeBecameEmpty: 52, deleteUpdateHeightAfterDel: 53, deleteGetBalanceAfterDel: 54,
    deleteRotationNeeded: 55, 
    deleteReturnNode: 56, deleteRecEnd: 57,
    searchMainCall: 58, searchRecFunc: 59, searchBaseCaseNullOrFound: 60,
    searchGoLeftRec: 61, searchGoRightRec: 62,
};

let globalAvlNodeIdCounter = 0;
const generateAvlNodeId = (value: number) => `avl-node-${value}-${globalAvlNodeIdCounter++}`;

function getNode(graph: AVLTreeGraph, nodeId: string | null): AVLNodeInternal | null {
  if (!nodeId) return null;
  return graph.nodesMap.get(nodeId) || null;
}

function getHeight(graph: AVLTreeGraph, nodeId: string | null): number {
  const node = getNode(graph, nodeId);
  return node ? node.height : 0; 
}

function updateHeight(graph: AVLTreeGraph, nodeId: string, localSteps?: TreeAlgorithmStep[], pathForContext?: string[]) {
  const node = getNode(graph, nodeId)!;
  const newHeight = 1 + Math.max(getHeight(graph, node.leftId), getHeight(graph, node.rightId));
  if (node.height !== newHeight) {
    node.height = newHeight;
    graph.nodesMap.set(nodeId, node); 
    if(localSteps) addStep(localSteps, graph, AVL_TREE_LINE_MAP.updateHeightCalc, `Updated height of Node ${node.value} to ${node.height}.`, [nodeId], {}, pathForContext);
  }
}

function getBalanceFactor(graph: AVLTreeGraph, nodeId: string | null): number {
  if (!nodeId) return 0;
  const node = getNode(graph, nodeId)!;
  return getHeight(graph, node.leftId) - getHeight(graph, node.rightId);
}

function getNodeVisualColor(balanceFactor: number, isNewlyInserted = false, isUnbalancedForRotation = false): string {
  if (isUnbalancedForRotation) return NODE_COLORS_AVL.UNBALANCED_NODE_RED;
  if (isNewlyInserted) return NODE_COLORS_AVL.NEWLY_INSERTED;
  if (balanceFactor < -1 || balanceFactor > 1) return NODE_COLORS_AVL.UNBALANCED_NODE_RED;
  if (balanceFactor === -1 || balanceFactor === 1) return NODE_COLORS_AVL.SLIGHTLY_UNBALANCED_YELLOW;
  return NODE_COLORS_AVL.BALANCED_GREEN;
}

function mapAVLToVisual(
    graph: AVLTreeGraph, activeNodeIds: string[], pathNodeIds: string[],
    specialColors: Record<string, string>, unbalancedNodeIdForVisual?: string | null
): { visualNodes: BinaryTreeNodeVisual[], visualEdges: BinaryTreeEdgeVisual[] } {
    const visualNodes: BinaryTreeNodeVisual[] = [];
    const visualEdges: BinaryTreeEdgeVisual[] = [];
    if (!graph.rootId) return { visualNodes, visualEdges };

    const X_SPACING_BASE = 70; const Y_SPACING = 70; const SVG_WIDTH = 600;

    function positionNode(nodeId: string, x: number, y: number, xOffsetMultiplier: number, depth: number) {
        const node = graph.nodesMap.get(nodeId);
        if (!node) return;
        const bf = getBalanceFactor(graph, nodeId);
        let baseColor = getNodeVisualColor(bf, false, nodeId === unbalancedNodeIdForVisual);
        let textColor = (nodeId === unbalancedNodeIdForVisual || bf < -1 || bf > 1) ? "hsl(var(--destructive-foreground))" : (bf === 0 ? "hsl(var(--secondary-foreground))" : "hsl(var(--accent-foreground))");
        if (baseColor === NODE_COLORS_AVL.BALANCED_GREEN) textColor = "hsl(var(--primary-foreground))";

        let displayColor = specialColors[nodeId] || baseColor;
        let displayTextColor = textColor;

        if (activeNodeIds.includes(nodeId) && !specialColors[nodeId]) {
            displayColor = NODE_COLORS_AVL.ACTIVE_COMPARISON; displayTextColor = "hsl(var(--primary-foreground))";
        } else if (pathNodeIds.includes(nodeId) && !specialColors[nodeId] && !activeNodeIds.includes(nodeId)){
            displayColor = NODE_COLORS_AVL.PATH_TRAVERSED; displayTextColor = "hsl(var(--primary-foreground))";
        }
        if(specialColors[nodeId] === NODE_COLORS_AVL.NEWLY_INSERTED) { displayColor = NODE_COLORS_AVL.NEWLY_INSERTED; displayTextColor = "hsl(var(--accent-foreground))"; }
        if(specialColors[nodeId] === NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW) { displayColor = NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW; displayTextColor = "hsl(var(--accent-foreground))"; }
        
        visualNodes.push({
            id: nodeId, value: `${node.value}(H:${node.height},BF:${bf})`, x, y, color: displayColor, textColor: displayTextColor,
            height: node.height, balanceFactor: bf, leftId: node.leftId, rightId: node.rightId,
        });
        const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.6, depth);
        if (node.leftId) {
            visualEdges.push({ id: `edge-${nodeId}-${node.leftId}`, sourceId: nodeId, targetId: node.leftId, color: EDGE_COLORS_AVL.DEFAULT });
            positionNode(node.leftId, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
        }
        if (node.rightId) {
            visualEdges.push({ id: `edge-${nodeId}-${node.rightId}`, sourceId: nodeId, targetId: node.rightId, color: EDGE_COLORS_AVL.DEFAULT });
            positionNode(node.rightId, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
        }
    }
    positionNode(graph.rootId, SVG_WIDTH / 2, 50, 0.8, 0);
    if (visualNodes.length > 0) { /* Centering Logic */ }
    return { visualNodes, visualEdges };
}

function addStep(
  localSteps: TreeAlgorithmStep[], graph: AVLTreeGraph, line: number | null, message: string,
  activeNodeIds: string[] = [], specialColors: Record<string, string> = {}, pathNodeIds: string[] = [],
  rotationType?: TreeAlgorithmStep['rotationType'], unbalancedNodeIdForVisual?: string | null
) {
  const { visualNodes, visualEdges } = mapAVLToVisual(graph, activeNodeIds, pathNodeIds, specialColors, unbalancedNodeIdForVisual);
  localSteps.push({
    nodes: visualNodes, edges: visualEdges,
    traversalPath: pathNodeIds.map(id => getNode(graph, id)?.value ?? id),
    currentLine: line, message,
    currentProcessingNodeId: activeNodeIds.length > 0 ? activeNodeIds[0] : null,
    unbalancedNodeId: unbalancedNodeIdForVisual, rotationType: rotationType || null,
    auxiliaryData: { finalGraphState: {rootId: graph.rootId, nodesMap: new Map(graph.nodesMap)} }
  });
}

function rotateRight(graph: AVLTreeGraph, yId: string, localSteps: TreeAlgorithmStep[]): string { /* ... as before, uses addStep ... */ 
  const y = getNode(graph, yId)!; const xId = y.leftId!; const x = getNode(graph, xId)!;
  const T2Id = x.rightId; const parentOfYId = y.parentId;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightFuncStart, `Rotate Right around ${y.value}`, [yId, xId], {[yId]: NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW, [xId]: NODE_COLORS_AVL.ACTIVE_COMPARISON});
  x.rightId = yId; if (yId) getNode(graph,yId)!.parentId = xId;
  y.leftId = T2Id; if (T2Id) getNode(graph,T2Id)!.parentId = yId;
  x.parentId = parentOfYId;
  if (!parentOfYId) graph.rootId = xId; else {
    const parentOfY = getNode(graph,parentOfYId)!;
    if (parentOfY.leftId === yId) parentOfY.leftId = xId; else parentOfY.rightId = xId;
    graph.nodesMap.set(parentOfYId, parentOfY);
  }
  graph.nodesMap.set(xId, x); graph.nodesMap.set(yId, y);
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightPointers, `Pointers updated. ${x.value} is new root of this subtree.`, [xId, yId]);
  updateHeight(graph, yId, localSteps); updateHeight(graph, xId, localSteps);
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightReturnNewRoot, `Rotation complete. Return ${x.value}.`, [xId]);
  return xId;
}
function rotateLeft(graph: AVLTreeGraph, xId: string, localSteps: TreeAlgorithmStep[]): string { /* ... as before, uses addStep ... */ 
  const x = getNode(graph,xId)!; const yId = x.rightId!; const y = getNode(graph,yId)!;
  const T2Id = y.leftId; const parentOfXId = x.parentId;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftFuncStart, `Rotate Left around ${x.value}`, [xId, yId], {[xId]: NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW, [yId]: NODE_COLORS_AVL.ACTIVE_COMPARISON});
  y.leftId = xId; if (xId) getNode(graph,xId)!.parentId = yId;
  x.rightId = T2Id; if (T2Id) getNode(graph,T2Id)!.parentId = xId;
  y.parentId = parentOfXId;
  if (!parentOfXId) graph.rootId = yId; else {
    const parentOfX = getNode(graph,parentOfXId)!;
    if (parentOfX.leftId === xId) parentOfX.leftId = yId; else parentOfX.rightId = yId;
    graph.nodesMap.set(parentOfXId, parentOfX);
  }
  graph.nodesMap.set(yId,y); graph.nodesMap.set(xId,x);
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftPointers, `Pointers updated. ${y.value} is new root of this subtree.`, [yId, xId]);
  updateHeight(graph, xId, localSteps); updateHeight(graph, yId, localSteps);
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftReturnNewRoot, `Rotation complete. Return ${y.value}.`, [yId]);
  return yId;
}

function balance(graph: AVLTreeGraph, nodeId: string, localSteps: TreeAlgorithmStep[], path: string[], opValueForContext?: number): string {
    updateHeight(graph, nodeId, localSteps, path);
    const balanceFactor = getBalanceFactor(graph, nodeId);
    const node = getNode(graph, nodeId)!;
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertGetBalanceAfterRec, `Node ${node.value} Height: ${node.height}, Balance Factor: ${balanceFactor}.`, [nodeId], {}, path, undefined, nodeId);

    let newSubtreeRootId = nodeId;
    let rotationPerformed: TreeAlgorithmStep['rotationType'] = null;

    if (balanceFactor > 1) { // Left heavy
        const leftChild = getNode(graph, node.leftId!)!;
        const conditionForLL = opValueForContext !== undefined ? opValueForContext < leftChild.value : getBalanceFactor(graph, node.leftId) >= 0;
        if (conditionForLL) { rotationPerformed = 'LL'; addStep(localSteps,graph,AVL_TREE_LINE_MAP.llCaseCheck,`LL Case at ${node.value}. Right Rotate.`,[nodeId],{},path,rotationPerformed,nodeId); newSubtreeRootId=rotateRight(graph,nodeId,localSteps); }
        else { rotationPerformed = 'LR'; addStep(localSteps,graph,AVL_TREE_LINE_MAP.lrCaseCheck,`LR Case at ${node.value}. Left-Rotate Left Child, then Right-Rotate ${node.value}.`,[nodeId],{},path,rotationPerformed,nodeId); node.leftId=rotateLeft(graph,node.leftId!,localSteps); graph.nodesMap.set(nodeId,node); updateHeight(graph,node.leftId!,localSteps,path); updateHeight(graph,nodeId,localSteps,path); newSubtreeRootId=rotateRight(graph,nodeId,localSteps); }
    } else if (balanceFactor < -1) { // Right heavy
        const rightChild = getNode(graph, node.rightId!)!;
        const conditionForRR = opValueForContext !== undefined ? opValueForContext > rightChild.value : getBalanceFactor(graph, node.rightId) <= 0;
        if (conditionForRR) { rotationPerformed = 'RR'; addStep(localSteps,graph,AVL_TREE_LINE_MAP.rrCaseCheck,`RR Case at ${node.value}. Left Rotate.`,[nodeId],{},path,rotationPerformed,nodeId); newSubtreeRootId=rotateLeft(graph,nodeId,localSteps); }
        else { rotationPerformed = 'RL'; addStep(localSteps,graph,AVL_TREE_LINE_MAP.rlCaseCheck,`RL Case at ${node.value}. Right-Rotate Right Child, then Left-Rotate ${node.value}.`,[nodeId],{},path,rotationPerformed,nodeId); node.rightId=rotateRight(graph,node.rightId!,localSteps); graph.nodesMap.set(nodeId,node); updateHeight(graph,node.rightId!,localSteps,path); updateHeight(graph,nodeId,localSteps,path); newSubtreeRootId=rotateLeft(graph,nodeId,localSteps); }
    }
    if(rotationPerformed) addStep(localSteps,graph,0,`Rotation ${rotationPerformed} complete. Subtree root ${getNode(graph,newSubtreeRootId)!.value}.`,[newSubtreeRootId],{},path, undefined, newSubtreeRootId);
    return newSubtreeRootId;
}

function insertRec(graph: AVLTreeGraph, nodeId: string | null, value: number, parentId: string | null, path: string[], localSteps: TreeAlgorithmStep[]): string {
  path.push(nodeId || `insert-target-${value}`); 
  const node = nodeId ? getNode(graph, nodeId) : null;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecFunc, `InsertRec(${value}) at ${node ? node.value : 'NIL'}.`, nodeId ? [nodeId] : [], {}, path);
  if (!nodeId) { /* ... base case as before ... */ 
    const newNodeId = generateAvlNodeId(value);
    graph.nodesMap.set(newNodeId, { id: newNodeId, value, height: 1, leftId: null, rightId: null, parentId });
    addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertBaseCaseNull,`Created new node ${value}.`,[newNodeId],{[newNodeId]:NODE_COLORS_AVL.NEWLY_INSERTED},path);
    path.pop(); return newNodeId;
  }
  if (value < node.value) node.leftId = insertRec(graph, node.leftId, value, nodeId, path, localSteps);
  else if (value > node.value) node.rightId = insertRec(graph, node.rightId, value, nodeId, path, localSteps);
  else { addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertDuplicate,`Value ${value} exists. No insert.`,[nodeId],{},path); path.pop(); return nodeId; }
  graph.nodesMap.set(nodeId, node);
  const balancedNodeId = balance(graph, nodeId, localSteps, path, value);
  path.pop();
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertReturnNode, `Return from InsertRec for ${node.value}. Subtree root: ${getNode(graph,balancedNodeId)!.value}.`, [balancedNodeId], {}, path);
  return balancedNodeId;
}

function minValueNode(graph: AVLTreeGraph, nodeId: string, localSteps: TreeAlgorithmStep[], path: string[]): string { /* ... as before ... */ 
    let currentId = nodeId; path.push(currentId);
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteFindSuccessor, `Finding min value (successor) in subtree of ${getNode(graph,currentId)!.value}.`, [currentId], {}, path);
    while (getNode(graph, currentId)!.leftId) {
        currentId = getNode(graph, currentId)!.leftId!; path.push(currentId);
        addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteFindSuccessor, `Current min candidate: ${getNode(graph,currentId)!.value}. Go left.`, [currentId], {}, path);
    }
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteFindSuccessor, `Min value (successor) is ${getNode(graph,currentId)!.value}.`, [currentId], {}, path);
    return currentId;
}

function deleteRec(graph: AVLTreeGraph, nodeId: string | null, value: number, path: string[], localSteps: TreeAlgorithmStep[]): string | null {
    path.push(nodeId || `delete-target-${value}`);
    const node = nodeId ? getNode(graph, nodeId) : null;
    addStep(localSteps,graph,AVL_TREE_LINE_MAP.deleteRecFunc,`DeleteRec(${value}) at ${node ? node.value : 'NIL'}.`,nodeId ? [nodeId] : [], {}, path);
    if (!node) { addStep(localSteps,graph,AVL_TREE_LINE_MAP.deleteBaseCaseNull,`Value ${value} not found.`,[],{},path); path.pop(); return null; }

    let newCurrentNodeId = nodeId; 
    if (value < node.value) node.leftId = deleteRec(graph, node.leftId, value, path, localSteps);
    else if (value > node.value) node.rightId = deleteRec(graph, node.rightId, value, path, localSteps);
    else {
        addStep(localSteps,graph,AVL_TREE_LINE_MAP.deleteNodeFound,`Node to delete (${value}) found.`,[nodeId],{[nodeId]: NODE_COLORS_AVL.TO_BE_DELETED},path);
        if (!node.leftId || !node.rightId) {
            const tempId = node.leftId || node.rightId;
            if(tempId) getNode(graph,tempId)!.parentId = node.parentId;
            graph.nodesMap.delete(nodeId); path.pop(); newCurrentNodeId = tempId;
            addStep(localSteps,graph,0,`Node ${value} removed. Return ${tempId ? getNode(graph,tempId)?.value : 'NIL'}.`, newCurrentNodeId ? [newCurrentNodeId] : [], {}, path);
        } else {
            const successorId = minValueNode(graph, node.rightId!, localSteps, path);
            node.value = getNode(graph,successorId)!.value; graph.nodesMap.set(nodeId, node);
            addStep(localSteps,graph,AVL_TREE_LINE_MAP.deleteCopySuccessorVal,`Copied successor ${node.value} to node.`,[nodeId],{[nodeId]:NODE_COLORS_AVL.TO_BE_DELETED,[successorId]:NODE_COLORS_AVL.INORDER_SUCCESSOR},path);
            node.rightId = deleteRec(graph, node.rightId, node.value, path, localSteps); // Delete original successor
        }
    }
    if (!newCurrentNodeId) { path.pop(); return null; } // Node was deleted and was a leaf
    
    graph.nodesMap.set(newCurrentNodeId, getNode(graph, newCurrentNodeId)!); // Ensure any changes to node (value copy) are on the map for balance
    const balancedNodeId = balance(graph, newCurrentNodeId, localSteps, path); // Pass undefined for opValue, so it uses child BF
    path.pop();
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteReturnNode, `Return from DeleteRec for ${getNode(graph,balancedNodeId)!.value}.`, [balancedNodeId], {}, path);
    return balancedNodeId;
}

function searchRec(graph: AVLTreeGraph, nodeId: string | null, value: number, path: string[], localSteps: TreeAlgorithmStep[]): string | null { /* ... as before ... */ 
    path.push(nodeId || `search-target-${value}`);
    const node = nodeId ? getNode(graph,nodeId) : null;
    addStep(localSteps,graph,AVL_TREE_LINE_MAP.searchRecFunc,`SearchRec(${value}) at ${node ? node.value : 'NIL'}.`,nodeId ? [nodeId] : [], {},path);
    if(!node) {addStep(localSteps,graph,AVL_TREE_LINE_MAP.searchBaseCaseNullOrFound,`Value ${value} not found (NIL).`,[],{},path); path.pop(); return null;}
    if(value === node.value) {addStep(localSteps,graph,AVL_TREE_LINE_MAP.searchBaseCaseNullOrFound,`Value ${value} found.`,[nodeId],{[nodeId]:NODE_COLORS_AVL.BALANCED_GREEN},path); path.pop(); return nodeId;}
    const nextNodeId = value < node.value ? node.leftId : node.rightId;
    const direction = value < node.value ? "left" : "right";
    addStep(localSteps,graph, value < node.value ? AVL_TREE_LINE_MAP.searchGoLeftRec : AVL_TREE_LINE_MAP.searchGoRightRec, `Search ${value} is ${direction} of ${node.value}. Go ${direction}.`,[nodeId],{},path);
    const result = searchRec(graph, nextNodeId, value, path, localSteps);
    path.pop(); return result;
}


export const generateAVLSteps = (
  operation: AVLOperationType, initialValuesString?: string, valueToProcess?: number, currentGraphState?: AVLTreeGraph
): TreeAlgorithmStep[] => { /* ... main dispatch logic as before ... */ 
  globalAvlNodeIdCounter = 0; const localSteps: TreeAlgorithmStep[] = []; let graph: AVLTreeGraph;
  if (operation === 'build' || !currentGraphState) graph = createInitialAVLTreeGraph();
  else {
    const newNodesMap = new Map<string, AVLNodeInternal>();
    currentGraphState.nodesMap.forEach((node, id) => newNodesMap.set(id, { ...node }));
    graph = { rootId: currentGraphState.rootId, nodesMap: newNodesMap };
    globalAvlNodeIdCounter = Array.from(graph.nodesMap.keys()).reduce((max, id) => Math.max(max, parseInt(id.split('-').pop() || '0')), 0) + 1;
  }
  const currentPath: string[] = [];
  if (operation === 'build') { /* ... build logic ... */ 
    const values = initialValuesString ? initialValuesString.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : [];
    addStep(localSteps, graph, null, `Building AVL Tree from: [${values.join(',')}]`);
    if (values.length === 0) addStep(localSteps,graph,null,"Tree empty (no values).");
    values.forEach(val => { currentPath.length=0; addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertMainCall,`Insert(${val})`); graph.rootId = insertRec(graph,graph.rootId,val,null,currentPath,localSteps);});
    addStep(localSteps, graph, null, "Build complete.");
  } else if (valueToProcess !== undefined) { /* ... insert/delete/search logic ... */ 
    currentPath.length = 0;
    const opLine = operation === 'insert' ? AVL_TREE_LINE_MAP.insertMainCall : (operation === 'delete' ? AVL_TREE_LINE_MAP.deleteMainCall : AVL_TREE_LINE_MAP.searchMainCall);
    addStep(localSteps, graph, opLine, `Operation: ${operation}(${valueToProcess})`);
    if (operation === 'insert') graph.rootId = insertRec(graph, graph.rootId, valueToProcess, null, currentPath, localSteps);
    else if (operation === 'delete') graph.rootId = deleteRec(graph, graph.rootId, valueToProcess, currentPath, localSteps);
    else if (operation === 'search') searchRec(graph, graph.rootId, valueToProcess, currentPath, localSteps);
    addStep(localSteps, graph, 0, `${operation} ${valueToProcess} complete.`);
  } else if (operation === 'structure') addStep(localSteps, graph, null, "Displaying current AVL tree structure.");
  if (localSteps.length > 0) {
    const lastStep = localSteps[localSteps.length - 1];
    const finalNodesMapObj = Object.fromEntries(graph.nodesMap.entries());
    lastStep.auxiliaryData = { ...lastStep.auxiliaryData, finalGraphState: { rootId: graph.rootId, nodesMap: graph.nodesMap } };
  }
  return localSteps;
};

export const createInitialAVLTreeGraph = (): AVLTreeGraph => {
  globalAvlNodeIdCounter = 0;
  return { rootId: null, nodesMap: new Map() };
};
