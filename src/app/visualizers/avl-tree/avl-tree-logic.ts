
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, AVLNodeInternal, AVLTreeGraph, AVLOperationType } from './types';
import { RBT_NODE_COLORS } from '../red-black-tree/rbt-node-colors'; // For NIL node color if used

// Node colors aligned with PRD for AVL
export const NODE_COLORS_AVL = {
  DEFAULT: "hsl(var(--secondary))", 
  ACTIVE_COMPARISON: "hsl(var(--primary))", 
  PATH_TRAVERSED: "hsl(var(--primary)/0.6)", 
  NEWLY_INSERTED: "hsl(var(--accent))", 
  TO_BE_DELETED: "hsl(var(--destructive)/0.7)",
  INORDER_SUCCESSOR: "hsl(var(--chart-5)/0.8)",
  
  BALANCED_GREEN: "hsl(var(--chart-2))", 
  SLIGHTLY_UNBALANCED_YELLOW: "hsl(var(--chart-4))",
  UNBALANCED_NODE_RED: "hsl(var(--destructive))",
  ROTATION_PIVOT_YELLOW: "hsl(var(--chart-4))", 
};

const EDGE_COLORS_AVL = {
  DEFAULT: "hsl(var(--muted-foreground))",
  PATH_TRAVERSED: "hsl(var(--primary))",
};

export const AVL_TREE_LINE_MAP = {
    // Class & Helpers
    classDef: 1, constructor: 3, nodeDef: 2, // Map to conceptual Node class inside AVLTree class
    getHeightFunc: 10, getHeightBase: 11, getHeightReturn: 12,
    updateHeightFunc: 13, updateHeightCalc: 14, updateBalanceFactorInHeight: 14.1, // BF is part of updateHeight
    getBalanceFunc: 15, getBalanceBase: 16, getBalanceCalc: 17,
    
    // Rotations
    rotateLeftFunc: 20, rotateLeftSetupY: 21, rotateLeftXRightToYLeft: 22, rotateLeftYLeftParentUpdate: 23,
    rotateLeftYParentToXParent: 24, rotateLeftUpdateRootOrChild: 25, rotateLeftYLeftToX: 26, rotateLeftXParentToY: 27,
    rotateLeftUpdateHeights: 28, rotateLeftReturnY: 29,
    rotateRightFunc: 30, rotateRightSetupX: 31, rotateRightYLeftToXRight: 32, rotateRightXRightParentUpdate: 33,
    rotateRightXParentToYParent: 34, rotateRightUpdateRootOrChild: 35, rotateRightXRightToY: 36, rotateRightYParentToX: 37,
    rotateRightUpdateHeights: 38, rotateRightReturnX: 39,

    // Insert
    insertFunc: 40, insertCallRec: 41, insertFuncEnd: 63,
    insertRecFunc: 42, insertRecBaseCase: 43, insertRecNewNode: 44,
    insertRecGoLeft: 45, insertRecAssignLeft: 46,
    insertRecGoRight: 47, insertRecAssignRight: 48,
    insertRecDuplicate: 49,
    insertRecUpdateHeightAndBF: 50, insertRecGetBalance: 51, // BF is obtained after updateHeightAndBF
    insertRecCheckLL: 52, insertRecActionLL: 53,
    insertRecCheckRR: 54, insertRecActionRR: 55,
    insertRecCheckLR_Part1: 56, insertRecActionLR_RotateLeft: 57, insertRecActionLR_RotateRight: 58,
    insertRecCheckRL_Part1: 59, insertRecActionRL_RotateRight: 60, insertRecActionRL_RotateLeft: 61,
    insertRecReturnNode: 62,

    // Search
    searchFunc: 70, searchCallRec: 70.1, searchFuncEnd: 76,
    searchRecFunc: 71, searchBaseNull: 72, searchBaseFound: 73,
    searchGoLeft: 74, searchGoRight: 75,

    // Delete (Conceptual steps, detailed fixup is complex)
    deleteFunc: 80, deleteCallRec: 81, deleteFuncEnd: 97,
    deleteRecFunc: 82, deleteRecBaseNull: 83,
    deleteRecGoLeft: 84, deleteRecGoRight: 85,
    deleteRecNodeFound: 86,
    deleteRecHandleNoLeftChild: 87, deleteRecHandleNoRightChild: 88,
    deleteRecHandleTwoChildren: 89, deleteRecFindSuccessor: 90, deleteRecCopySuccessor: 91, deleteRecDeleteSuccessor: 92,
    deleteRecAfterDeleteUpdateHeightAndBF: 93, deleteRecAfterDeleteGetBalance: 94,
    deleteRecRebalanceCheck: 95, 
    deleteRecReturnNode: 96,
};


let globalAvlNodeIdCounter = 0;
const generateAvlNodeId = (value: number) => `avl-node-${value}-${globalAvlNodeIdCounter++}`;

function getNode(graph: AVLTreeGraph, nodeId: string | null): AVLNodeInternal | null {
  if (!nodeId) return null;
  return graph.nodesMap.get(nodeId) || null;
}

function getHeight(node: AVLNodeInternal | null): number {
  return node ? node.height : -1;
}

function updateHeightAndBF(graph: AVLTreeGraph, nodeId: string, localSteps?: TreeAlgorithmStep[], pathForContext: string[] = [], messagePrefix = "") {
  const node = getNode(graph, nodeId);
  if (!node) return;

  const oldHeight = node.height;
  const oldBf = node.balanceFactor;

  node.height = 1 + Math.max(getHeight(getNode(graph, node.leftId)), getHeight(getNode(graph, node.rightId)));
  node.balanceFactor = getHeight(getNode(graph, node.leftId)) - getHeight(getNode(graph, node.rightId));
  
  if (localSteps && (node.height !== oldHeight || node.balanceFactor !== oldBf)) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.updateHeightCalc, `${messagePrefix}Updated Node ${node.value}: H=${node.height}, BF=${node.balanceFactor}.`, [nodeId], {}, pathForContext, undefined, nodeId);
  }
}

function getBalanceFactor(graph: AVLTreeGraph, nodeId: string | null): number {
  const node = getNode(graph, nodeId);
  return node ? node.balanceFactor! : 0;
}

function mapAVLToVisual(
    graph: AVLTreeGraph,
    activeNodeIds: string[],
    pathNodeIds: string[],
    specialColors: Record<string, string>,
    unbalancedNodeIdForVisual?: string | null
): { visualNodes: BinaryTreeNodeVisual[], visualEdges: BinaryTreeEdgeVisual[] } {
    const visualNodes: BinaryTreeNodeVisual[] = [];
    const visualEdges: BinaryTreeEdgeVisual[] = [];
    if (!graph.rootId) return { visualNodes, visualEdges };

    const X_SPACING_BASE = 70; const Y_SPACING = 80; const SVG_WIDTH = 600;

    function positionNode(nodeId: string, x: number, y: number, xOffsetMultiplier: number, depth: number) {
        const nodeInternal = graph.nodesMap.get(nodeId);
        if (!nodeInternal) return;

        let nodeColor: string;
        const bf = nodeInternal.balanceFactor!;
        if (nodeId === unbalancedNodeIdForVisual || bf < -1 || bf > 1) nodeColor = NODE_COLORS_AVL.UNBALANCED_NODE_RED;
        else if (bf === -1 || bf === 1) nodeColor = NODE_COLORS_AVL.SLIGHTLY_UNBALANCED_YELLOW;
        else nodeColor = NODE_COLORS_AVL.BALANCED_GREEN;
        
        if (specialColors[nodeId]) nodeColor = specialColors[nodeId];
        else if (activeNodeIds.includes(nodeId)) nodeColor = NODE_COLORS_AVL.ACTIVE_COMPARISON;
        else if (pathNodeIds.includes(nodeId)) nodeColor = NODE_COLORS_AVL.PATH_TRAVERSED;

        let textColor = "hsl(var(--primary-foreground))"; 
        if (nodeColor === NODE_COLORS_AVL.SLIGHTLY_UNBALANCED_YELLOW || nodeColor === NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW || nodeColor === NODE_COLORS_AVL.NEWLY_INSERTED) {
            textColor = "hsl(var(--accent-foreground))"; 
        }

        visualNodes.push({
            id: nodeId, value: nodeInternal.value,
            height: nodeInternal.height, balanceFactor: nodeInternal.balanceFactor!,
            x, y, color: nodeColor, textColor: textColor,
            leftId: nodeInternal.leftId, rightId: nodeInternal.rightId,
        });
        
        const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.7, depth); // Slightly increased spread
        if (nodeInternal.leftId) {
            const edgeColor = (pathNodeIds.includes(nodeId) && pathNodeIds.includes(nodeInternal.leftId)) ? EDGE_COLORS_AVL.PATH_TRAVERSED : EDGE_COLORS_AVL.DEFAULT;
            visualEdges.push({ id: `edge-${nodeId}-${nodeInternal.leftId}`, sourceId: nodeId, targetId: nodeInternal.leftId, color: edgeColor });
            positionNode(nodeInternal.leftId, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
        }
        if (nodeInternal.rightId) {
             const edgeColor = (pathNodeIds.includes(nodeId) && pathNodeIds.includes(nodeInternal.rightId)) ? EDGE_COLORS_AVL.PATH_TRAVERSED : EDGE_COLORS_AVL.DEFAULT;
            visualEdges.push({ id: `edge-${nodeId}-${nodeInternal.rightId}`, sourceId: nodeId, targetId: nodeInternal.rightId, color: edgeColor });
            positionNode(nodeInternal.rightId, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
        }
    }
    positionNode(graph.rootId, SVG_WIDTH / 2, 60, 0.8, 0);

    if (visualNodes.length > 0) {
        const minX = Math.min(...visualNodes.map(n => n.x));
        const maxX = Math.max(...visualNodes.map(n => n.x));
        const treeWidth = maxX - minX;
        const currentCenterX = minX + treeWidth / 2;
        const desiredCenterX = SVG_WIDTH / 2;
        const shiftX = desiredCenterX - currentCenterX;

        let scaleFactor = 1;
        if (treeWidth > SVG_WIDTH * 0.95 && treeWidth > 0) { // If tree is wider than viewport
            scaleFactor = (SVG_WIDTH * 0.95) / treeWidth;
        }
        visualNodes.forEach(node => {
            node.x = desiredCenterX + (node.x - currentCenterX) * scaleFactor;
            node.y = node.y; // Keep Y spacing consistent unless scaling everything
        });
    }
    return { visualNodes, visualEdges };
}

function addStep(
  localSteps: TreeAlgorithmStep[], graph: AVLTreeGraph, line: number | null, message: string,
  activeNodeIds: string[] = [], specialColors: Record<string, string> = {}, pathNodeIds: string[] = [],
  rotationType?: TreeAlgorithmStep['rotationType'], unbalancedNodeIdForVisual?: string | null,
  nodesInvolvedInRotation?: string[]
) {
  const { visualNodes, visualEdges } = mapAVLToVisual(graph, activeNodeIds, pathNodeIds, specialColors, unbalancedNodeIdForVisual);
  localSteps.push({
    nodes: visualNodes, edges: visualEdges,
    traversalPath: pathNodeIds.map(id => getNode(graph, id)?.value ?? id),
    currentLine: line, message,
    currentProcessingNodeId: activeNodeIds.length > 0 ? activeNodeIds[0] : null,
    unbalancedNodeId: unbalancedNodeIdForVisual, rotationType, nodesInvolvedInRotation,
    auxiliaryData: { finalGraphState: {rootId: graph.rootId, nodesMap: new Map(graph.nodesMap)} }
  });
}

function rotateRight(graph: AVLTreeGraph, yId: string, localSteps: TreeAlgorithmStep[]): string {
  const y = getNode(graph, yId)!; const xId = y.leftId!; const x = getNode(graph, xId)!;
  const T2Id = x.rightId; const parentOfYId = y.parentId;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightFunc, `Rotate Right around Node ${y.value}. Pivot Y=${y.value}, New Root X=${x.value}.`, [yId, xId], {[yId]: NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW, [xId]: NODE_COLORS_AVL.ACTIVE_COMPARISON}, [], 'RR', yId, [yId, xId, T2Id || 'NIL']);
  
  y.leftId = T2Id; if (T2Id) getNode(graph,T2Id)!.parentId = yId;
  x.rightId = yId; y.parentId = xId;
  x.parentId = parentOfYId;
  if (!parentOfYId) graph.rootId = xId;
  else { const parentOfY = getNode(graph,parentOfYId)!; if (parentOfY.leftId === yId) parentOfY.leftId = xId; else parentOfY.rightId = xId; }
  
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightYLeftToXRight, `Pointers updated for Right Rotation.`, [xId, yId]);
  updateHeightAndBF(graph, yId, localSteps, [], "  Post-Rotation: "); updateHeightAndBF(graph, xId, localSteps, [], "  Post-Rotation: ");
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightReturnX, `Rotate Right complete. New subtree root: ${x.value}.`, [xId]);
  return xId;
}

function rotateLeft(graph: AVLTreeGraph, xId: string, localSteps: TreeAlgorithmStep[]): string {
  const x = getNode(graph,xId)!; const yId = x.rightId!; const y = getNode(graph,yId)!;
  const T2Id = y.leftId; const parentOfXId = x.parentId;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftFunc, `Rotate Left around Node ${x.value}. Pivot X=${x.value}, New Root Y=${y.value}.`, [xId, yId], {[xId]: NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW, [yId]: NODE_COLORS_AVL.ACTIVE_COMPARISON}, [], 'LL', xId, [xId, yId, T2Id||'NIL']);

  x.rightId = T2Id; if (T2Id) getNode(graph,T2Id)!.parentId = xId;
  y.leftId = xId; x.parentId = yId;
  y.parentId = parentOfXId;
  if (!parentOfXId) graph.rootId = yId;
  else { const parentOfX = getNode(graph,parentOfXId)!; if (parentOfX.leftId === xId) parentOfX.leftId = yId; else parentOfX.rightId = yId; }

  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftXRightToYLeft, `Pointers updated for Left Rotation.`, [xId, yId]);
  updateHeightAndBF(graph, xId, localSteps, [], "  Post-Rotation: "); updateHeightAndBF(graph, yId, localSteps, [], "  Post-Rotation: ");
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftReturnY, `Rotate Left complete. New subtree root: ${y.value}.`, [yId]);
  return yId;
}

function insertRec(graph: AVLTreeGraph, nodeId: string | null, value: number, parentId: string | null, path: string[], localSteps: TreeAlgorithmStep[]): string {
  if (nodeId) path.push(nodeId);
  const currentNodeValForMsg = nodeId ? getNode(graph, nodeId)?.value : 'NIL (new node position)';
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecFunc, `InsertRec(${value}) at ${currentNodeValForMsg}. Path: ${path.map(pId=>getNode(graph,pId)?.value).join('->')}`, nodeId ? [nodeId] : [], {}, path);
  
  if (!nodeId) {
    const newNodeId = generateAvlNodeId(value);
    graph.nodesMap.set(newNodeId, { id: newNodeId, value, height: 0, balanceFactor: 0, leftId: null, rightId: null, parentId });
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecNewNode, `Created new node ${value}. H=0, BF=0.`, [newNodeId], {[newNodeId]:NODE_COLORS_AVL.NEWLY_INSERTED}, path);
    if (nodeId && path.length > 0) path.pop();
    return newNodeId;
  }

  const node = getNode(graph, nodeId)!;
  if (value < node.value) {
    node.leftId = insertRec(graph, node.leftId, value, nodeId, path, localSteps);
  } else if (value > node.value) {
    node.rightId = insertRec(graph, node.rightId, value, nodeId, path, localSteps);
  } else {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecDuplicate, `Value ${value} already exists. No insertion.`, [nodeId], {[nodeId]:NODE_COLORS_AVL.ACTIVE_COMPARISON}, path);
    if (nodeId && path.length > 0) path.pop();
    return nodeId; 
  }

  updateHeightAndBF(graph, nodeId, localSteps, path, `Node ${node.value}: `);
  const balance = node.balanceFactor!;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecGetBalance, `Node ${node.value} Balance Factor: ${balance}.`, [nodeId], {}, path, undefined, nodeId);

  let newSubtreeRootId = nodeId;
  if (balance > 1) { // Left heavy
    const leftChild = getNode(graph, node.leftId!)!;
    if (value < leftChild.value) { // LL Case
        newSubtreeRootId = rotateRight(graph, nodeId, localSteps);
    } else { // LR Case
        node.leftId = rotateLeft(graph, node.leftId!, localSteps);
        updateHeightAndBF(graph, node.leftId!, localSteps, path); updateHeightAndBF(graph, nodeId, localSteps, path); // Update after first rotation
        newSubtreeRootId = rotateRight(graph, nodeId, localSteps);
    }
  } else if (balance < -1) { // Right heavy
    const rightChild = getNode(graph, node.rightId!)!;
    if (value > rightChild.value) { // RR Case
        newSubtreeRootId = rotateLeft(graph, nodeId, localSteps);
    } else { // RL Case
        node.rightId = rotateRight(graph, node.rightId!, localSteps);
        updateHeightAndBF(graph, node.rightId!, localSteps, path); updateHeightAndBF(graph, nodeId, localSteps, path); // Update after first rotation
        newSubtreeRootId = rotateLeft(graph, nodeId, localSteps);
    }
  }
  
  if (nodeId && path.length > 0) path.pop();
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecReturnNode, `Return from InsertRec for node ${node.value}. Subtree root after balancing: ${getNode(graph,newSubtreeRootId)?.value}.`, [newSubtreeRootId], {}, path);
  return newSubtreeRootId;
}

function searchRec(graph: AVLTreeGraph, nodeId: string | null, value: number, path: string[], localSteps: TreeAlgorithmStep[]): string | null {
  if(nodeId) path.push(nodeId);
  const currentNodeValForMsg = nodeId ? getNode(graph, nodeId)?.value : 'NIL';
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchRecFunc, `SearchRec(${value}) at ${currentNodeValForMsg}. Path: ${path.map(pId => getNode(graph, pId)?.value).join('->')}`, nodeId ? [nodeId] : [], {}, path);

  if (!nodeId) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchBaseNull, `Value ${value} not found (reached NIL).`, [], {}, path);
    if (nodeId && path.length > 0) path.pop();
    return null;
  }
  const node = getNode(graph, nodeId)!;
  if (value === node.value) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchBaseFound, `Value ${value} FOUND at node ${node.value}.`, [nodeId], {[nodeId]: NODE_COLORS_AVL.ACTIVE_COMPARISON}, path);
    if (nodeId && path.length > 0) path.pop();
    return nodeId;
  }
  let result = null;
  if (value < node.value) {
    result = searchRec(graph, node.leftId, value, path, localSteps);
  } else {
    result = searchRec(graph, node.rightId, value, path, localSteps);
  }
  if (nodeId && path.length > 0) path.pop();
  return result;
}

function minValueNode(graph: AVLTreeGraph, nodeId: string, localSteps: TreeAlgorithmStep[], path: string[]): string {
  let currentId = nodeId;
  while (getNode(graph, currentId)!.leftId) {
    path.push(currentId);
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecFindSuccessor, `Finding successor: current is ${getNode(graph, currentId)?.value}, moving left. Path: ${path.join('->')}`, [currentId], {}, path);
    currentId = getNode(graph, currentId)!.leftId!;
  }
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecFindSuccessor, `Successor found: ${getNode(graph, currentId)?.value}`, [currentId], {[currentId]: NODE_COLORS_AVL.INORDER_SUCCESSOR}, path);
  return currentId;
}

function deleteRec(graph: AVLTreeGraph, nodeId: string | null, value: number, path: string[], localSteps: TreeAlgorithmStep[]): string | null {
  if (nodeId) path.push(nodeId);
  const currentNodeValForMsg = nodeId ? getNode(graph, nodeId)?.value : 'NIL';
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecFunc, `DeleteRec(${value}) at ${currentNodeValForMsg}. Path: ${path.map(pId=>getNode(graph,pId)?.value).join('->')}`, nodeId ? [nodeId] : [], {}, path);

  if (!nodeId) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecBaseNull, `Value ${value} not found.`, [], {}, path);
    if (nodeId && path.length > 0) path.pop();
    return null;
  }
  let node = getNode(graph, nodeId)!;

  if (value < node.value) {
    node.leftId = deleteRec(graph, node.leftId, value, path, localSteps);
    if(node.leftId) getNode(graph, node.leftId)!.parentId = nodeId;
  } else if (value > node.value) {
    node.rightId = deleteRec(graph, node.rightId, value, path, localSteps);
    if(node.rightId) getNode(graph, node.rightId)!.parentId = nodeId;
  } else {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecNodeFound, `Node to delete (${value}) found.`, [nodeId], {[nodeId]: NODE_COLORS_AVL.TO_BE_DELETED}, path);
    if (!node.leftId || !node.rightId) {
      const tempId = node.leftId || node.rightId;
      graph.nodesMap.delete(nodeId);
      nodeId = tempId;
      if (nodeId) getNode(graph, nodeId)!.parentId = node.parentId;
    } else {
      const successorPath: string[] = [];
      const successorId = minValueNode(graph, node.rightId!, localSteps, successorPath);
      node.value = getNode(graph, successorId)!.value;
      node.rightId = deleteRec(graph, node.rightId, node.value, path, localSteps);
      if(node.rightId) getNode(graph, node.rightId)!.parentId = nodeId;
    }
  }

  if (!nodeId) { if (path.length > 0) path.pop(); return null; }
  
  updateHeightAndBF(graph, nodeId, localSteps, path, `Node ${getNode(graph, nodeId)?.value}: `);
  const balance = getNode(graph, nodeId)!.balanceFactor!;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecAfterDeleteGetBalance, `Node ${getNode(graph,nodeId)?.value} Balance Factor: ${balance}. Checking for rebalance.`, [nodeId], {}, path, undefined, nodeId);
  
  let newSubtreeRootId = nodeId;
  if (balance > 1) { // Left heavy
    const leftChild = getNode(graph, getNode(graph, nodeId)!.leftId!)!;
    if (getBalanceFactor(graph, leftChild.leftId) >= 0) { // LL Case
        newSubtreeRootId = rotateRight(graph, nodeId, localSteps);
    } else { // LR Case
        getNode(graph, nodeId)!.leftId = rotateLeft(graph, leftChild.id, localSteps);
        updateHeightAndBF(graph, getNode(graph, nodeId)!.leftId!, localSteps, path); updateHeightAndBF(graph, nodeId, localSteps, path);
        newSubtreeRootId = rotateRight(graph, nodeId, localSteps);
    }
  } else if (balance < -1) { // Right heavy
    const rightChild = getNode(graph, getNode(graph, nodeId)!.rightId!)!;
    if (getBalanceFactor(graph, rightChild.rightId) <= 0) { // RR Case
        newSubtreeRootId = rotateLeft(graph, nodeId, localSteps);
    } else { // RL Case
        getNode(graph, nodeId)!.rightId = rotateRight(graph, rightChild.id, localSteps);
        updateHeightAndBF(graph, getNode(graph, nodeId)!.rightId!, localSteps, path); updateHeightAndBF(graph, nodeId, localSteps, path);
        newSubtreeRootId = rotateLeft(graph, nodeId, localSteps);
    }
  }
  if (path.length > 0) path.pop();
  return newSubtreeRootId;
}


export const generateAVLSteps = (
  operation: AVLOperationType, initialValuesString?: string, valueToProcess?: number, currentGraphState?: AVLTreeGraph
): TreeAlgorithmStep[] => { 
  globalAvlNodeIdCounter = 0; const localSteps: TreeAlgorithmStep[] = []; 
  let graph: AVLTreeGraph = currentGraphState ? 
        { rootId: currentGraphState.rootId, nodesMap: new Map(currentGraphState.nodesMap), nilNodeId: NIL_ID } : 
        createInitialAVLTreeGraph();
  
  if (operation === 'build' || (currentGraphState && currentGraphState.nodesMap.size === 0 && initialValuesString)) {
    graph = createInitialAVLTreeGraph(); // Reset for build
    const values = initialValuesString ? initialValuesString.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : [];
    addStep(localSteps,graph,AVL_TREE_LINE_MAP.constructor,`Building AVL Tree from: [${values.join(',')}]`);
    values.forEach(val => { 
      graph.rootId = insertRec(graph,graph.rootId,val,null,[],localSteps);
      if (graph.rootId) getNode(graph, graph.rootId)!.parentId = null; // Root's parent is null
    });
    addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertFuncEnd,`Build complete. Root: ${getNode(graph,graph.rootId)?.value ?? 'null'}`);
  } else if (valueToProcess !== undefined) {
    const opDisplay = operation.charAt(0).toUpperCase() + operation.slice(1);
    addStep(localSteps, graph, null, `Operation: ${opDisplay}(${valueToProcess})`);
    if (operation === 'insert') {
        graph.rootId = insertRec(graph, graph.rootId, valueToProcess, null, [], localSteps);
        if (graph.rootId) getNode(graph, graph.rootId)!.parentId = null;
    } else if (operation === 'delete') {
        graph.rootId = deleteRec(graph, graph.rootId, valueToProcess, [], localSteps);
        if (graph.rootId) getNode(graph, graph.rootId)!.parentId = null;
    } else if (operation === 'search') {
        searchRec(graph, graph.rootId, valueToProcess, [], localSteps);
    }
     addStep(localSteps,graph,null,`${opDisplay} ${valueToProcess} steps generated.`);
  } else if (operation === 'structure') {
    addStep(localSteps, graph, null, "Displaying current AVL tree structure.");
  }
  
  if (localSteps.length > 0 && operation !== 'structure') {
    const lastStepMsg = localSteps[localSteps.length-1].message;
    addStep(localSteps,graph,null, `Final tree state after: ${lastStepMsg || operation}.`);
  }
  return localSteps;
};

export const createInitialAVLTreeGraph = (): AVLTreeGraph => {
  globalAvlNodeIdCounter = 0;
  return { rootId: null, nodesMap: new Map(), nilNodeId: NIL_ID };
};
