
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, AVLNodeInternal, AVLTreeGraph, AVLOperationType } from './types';

// Node colors aligned with PRD
export const NODE_COLORS_AVL = {
  DEFAULT: "hsl(var(--secondary))", // General node color
  ACTIVE_COMPARISON: "hsl(var(--primary))", // Node being compared during search/insert
  PATH_TRAVERSED: "hsl(var(--primary)/0.6)", // Nodes on search/insert path
  NEWLY_INSERTED: "hsl(var(--accent))", // Bright color for new node
  TO_BE_DELETED: "hsl(var(--destructive)/0.7)", // Node marked for deletion
  INORDER_SUCCESSOR: "hsl(var(--chart-5)/0.8)", // Node chosen as successor
  
  BALANCED_GREEN: "hsl(var(--chart-2))", // BF is 0
  SLIGHTLY_UNBALANCED_YELLOW: "hsl(var(--chart-4))", // BF is -1 or +1
  UNBALANCED_NODE_RED: "hsl(var(--destructive))", // BF is -2 or +2 (needs rotation)
  ROTATION_PIVOT_YELLOW: "hsl(var(--chart-4))", // Pivot node for rotation (can be same as slightly_unbalanced)
};

const EDGE_COLORS_AVL = {
  DEFAULT: "hsl(var(--muted-foreground))",
  PATH_TRAVERSED: "hsl(var(--primary))",
};

// Align line numbers conceptually with a more detailed JS snippet
export const AVL_TREE_LINE_MAP = {
    // Class & Helpers
    classDef: 1, constructor: 2, nodeDef:3,
    getHeightFunc: 10, getHeightBase: 11, getHeightReturn: 12,
    updateHeightFunc: 13, updateHeightCalc: 14,
    getBalanceFunc: 15, getBalanceBase: 16, getBalanceCalc: 17,
    
    // Rotations
    rotateLeftFunc: 20, rotateLeftSetupY: 21, rotateLeftXRightToYLeft: 22, rotateLeftYLeftParentUpdate: 23,
    rotateLeftYParentToXParent: 24, rotateLeftUpdateRootOrChild: 25, rotateLeftYLeftToX: 26, rotateLeftXParentToY: 27,
    rotateLeftUpdateHeights: 28, rotateLeftReturnY: 29,
    rotateRightFunc: 30, rotateRightSetupX: 31, rotateRightYLeftToXRight: 32, rotateRightXRightParentUpdate: 33,
    rotateRightXParentToYParent: 34, rotateRightUpdateRootOrChild: 35, rotateRightXRightToY: 36, rotateRightYParentToX: 37,
    rotateRightUpdateHeights: 38, rotateRightReturnX: 39,

    // Insert
    insertFunc: 40, insertCallRec: 41,
    insertRecFunc: 42, insertRecBaseCase: 43, insertRecNewNode: 44,
    insertRecGoLeft: 45, insertRecAssignLeft: 46,
    insertRecGoRight: 47, insertRecAssignRight: 48,
    insertRecDuplicate: 49,
    insertRecUpdateHeight: 50, insertRecGetBalance: 51,
    insertRecCheckLL: 52, insertRecActionLL: 53,
    insertRecCheckRR: 54, insertRecActionRR: 55,
    insertRecCheckLR_Part1: 56, insertRecActionLR_RotateLeft: 57, insertRecActionLR_RotateRight: 58,
    insertRecCheckRL_Part1: 59, insertRecActionRL_RotateRight: 60, insertRecActionRL_RotateLeft: 61,
    insertRecReturnNode: 62,

    // Search
    searchFunc: 70, searchRecFunc: 71, searchBaseNull: 72, searchBaseFound: 73,
    searchGoLeft: 74, searchGoRight: 75,

    // Delete (Conceptual steps, more detailed than before but fixup is still high-level)
    deleteFunc: 80, deleteCallRec: 81,
    deleteRecFunc: 82, deleteRecBaseNull: 83,
    deleteRecGoLeft: 84, deleteRecGoRight: 85,
    deleteRecNodeFound: 86,
    deleteRecHandleNoLeftChild: 87, deleteRecHandleNoRightChild: 88,
    deleteRecHandleTwoChildren: 89, deleteRecFindSuccessor: 90, deleteRecCopySuccessor: 91, deleteRecDeleteSuccessor: 92,
    deleteRecAfterDeleteUpdateHeight: 93, deleteRecAfterDeleteGetBalance: 94,
    deleteRecRebalanceCheck: 95, // Identifies type, but full fixup not detailed step-by-step
    deleteRecReturnNode: 96,
};


let globalAvlNodeIdCounter = 0;
const generateAvlNodeId = (value: number) => `avl-node-${value}-${globalAvlNodeIdCounter++}`;

function getNode(graph: AVLTreeGraph, nodeId: string | null): AVLNodeInternal | null {
  if (!nodeId) return null;
  return graph.nodesMap.get(nodeId) || null;
}

function getHeight(node: AVLNodeInternal | null): number {
  return node ? node.height : -1; // Height of null node is -1 for easier balance factor calc
}

function updateHeightAndBF(graph: AVLTreeGraph, nodeId: string, localSteps?: TreeAlgorithmStep[], pathForContext?: string[], messagePrefix = "") {
  const node = getNode(graph, nodeId);
  if (!node) return;

  const oldHeight = node.height;
  const oldBf = node.balanceFactor;

  node.height = 1 + Math.max(getHeight(getNode(graph, node.leftId)), getHeight(getNode(graph, node.rightId)));
  node.balanceFactor = getHeight(getNode(graph, node.leftId)) - getHeight(getNode(graph, node.rightId));
  graph.nodesMap.set(nodeId, node); 

  if(localSteps && (node.height !== oldHeight || node.balanceFactor !== oldBf)) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.updateHeightCalc, `${messagePrefix}Updated Node ${node.value}: H=${node.height}, BF=${node.balanceFactor}.`, [nodeId], {}, pathForContext);
  }
}

function getBalanceFactor(node: AVLNodeInternal | null): number {
  return node ? node.balanceFactor! : 0;
}


function mapAVLToVisual(
    graph: AVLTreeGraph,
    activeNodeIds: string[], // Nodes being actively compared or processed
    pathNodeIds: string[],   // Nodes on the current recursion path (search/insert/delete)
    specialColors: Record<string, string>, // e.g., for highlighting unbalanced nodes, rotation pivots
    unbalancedNodeIdForVisual?: string | null // The specific node causing current imbalance
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
        
        // Override with special operational colors if applicable
        if (specialColors[nodeId]) nodeColor = specialColors[nodeId];
        else if (activeNodeIds.includes(nodeId)) nodeColor = NODE_COLORS_AVL.ACTIVE_COMPARISON;
        else if (pathNodeIds.includes(nodeId)) nodeColor = NODE_COLORS_AVL.PATH_TRAVERSED;

        let textColor = "hsl(var(--primary-foreground))"; // Default for light text on dark backgrounds
        if (nodeColor === NODE_COLORS_AVL.SLIGHTLY_UNBALANCED_YELLOW || nodeColor === NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW || nodeColor === NODE_COLORS_AVL.NEWLY_INSERTED) {
            textColor = "hsl(var(--accent-foreground))"; // Dark text for light yellow/accent
        }

        visualNodes.push({
            id: nodeId, value: nodeInternal.value,
            height: nodeInternal.height, balanceFactor: nodeInternal.balanceFactor!,
            x, y, color: nodeColor, textColor: textColor,
            leftId: nodeInternal.leftId, rightId: nodeInternal.rightId,
        });
        
        const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.6, depth); // Dynamic spacing
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

    // Center tree (simple horizontal centering for now)
    if (visualNodes.length > 0) {
        const minX = Math.min(...visualNodes.map(n => n.x));
        const maxX = Math.max(...visualNodes.map(n => n.x));
        const treeWidth = maxX - minX;
        const currentCenterX = minX + treeWidth / 2;
        const desiredCenterX = SVG_WIDTH / 2;
        const shiftX = desiredCenterX - currentCenterX;
        visualNodes.forEach(node => node.x += shiftX);
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

// --- Rotations ---
function rotateRight(graph: AVLTreeGraph, yId: string, localSteps: TreeAlgorithmStep[]): string {
  const y = getNode(graph, yId)!; const xId = y.leftId!; const x = getNode(graph, xId)!;
  const T2Id = x.rightId; const parentOfYId = y.parentId;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightFunc, `Rotate Right around Node ${y.value}. Pivot Y=${y.value}, New Root X=${x.value}.`, [yId, xId], {[yId]: NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW, [xId]: NODE_COLORS_AVL.ACTIVE_COMPARISON}, [], 'RR', yId, [yId, xId, T2Id || 'NIL']);
  
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightSetupX, `  Setup: x = y.left (${x.value}). T2 = x.right (${T2Id ? getNode(graph,T2Id)?.value : 'NIL'}).`, [xId, yId, T2Id||'NIL']);
  
  y.leftId = T2Id; if (T2Id) getNode(graph,T2Id)!.parentId = yId;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightYLeftToXRight, `  y.left = T2. ${T2Id? `Parent of ${getNode(graph,T2Id)?.value} is now ${y.value}.`:''}`, [yId, T2Id||'NIL']);
  
  x.rightId = yId; y.parentId = xId;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightXRightToY, `  x.right = y. Parent of ${y.value} is now ${x.value}.`, [xId, yId]);
  
  x.parentId = parentOfYId;
  if (!parentOfYId) graph.rootId = xId;
  else {
    const parentOfY = getNode(graph,parentOfYId)!;
    if (parentOfY.leftId === yId) parentOfY.leftId = xId; else parentOfY.rightId = xId;
    graph.nodesMap.set(parentOfYId, parentOfY);
  }
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightUpdateRootOrChild, `  Link x to y's original parent. ${parentOfYId? `Child of ${getNode(graph,parentOfYId)?.value} is now ${x.value}` : `New root is ${x.value}`}.`, [xId, parentOfYId||'NIL']);
  
  graph.nodesMap.set(xId, x); graph.nodesMap.set(yId, y);
  
  updateHeightAndBF(graph, yId, localSteps, [], "  Heights/BF after rotation: "); updateHeightAndBF(graph, xId, localSteps, [], "  Heights/BF after rotation: ");
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateRightReturnX, `Rotate Right complete. New subtree root: ${x.value}.`, [xId]);
  return xId;
}
function rotateLeft(graph: AVLTreeGraph, xId: string, localSteps: TreeAlgorithmStep[]): string {
  const x = getNode(graph,xId)!; const yId = x.rightId!; const y = getNode(graph,yId)!;
  const T2Id = y.leftId; const parentOfXId = x.parentId;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftFunc, `Rotate Left around Node ${x.value}. Pivot X=${x.value}, New Root Y=${y.value}.`, [xId, yId], {[xId]: NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW, [yId]: NODE_COLORS_AVL.ACTIVE_COMPARISON}, [], 'LL', xId, [xId, yId, T2Id||'NIL']);
  
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftSetupY, `  Setup: y = x.right (${y.value}). T2 = y.left (${T2Id ? getNode(graph,T2Id)?.value : 'NIL'}).`, [xId, yId, T2Id||'NIL']);

  x.rightId = T2Id; if (T2Id) getNode(graph,T2Id)!.parentId = xId;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftXRightToYLeft, `  x.right = T2. ${T2Id?`Parent of ${getNode(graph,T2Id)?.value} is now ${x.value}.`:''}`, [xId, T2Id||'NIL']);
  
  y.leftId = xId; x.parentId = yId;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftYLeftToX, `  y.left = x. Parent of ${x.value} is now ${y.value}.`, [xId, yId]);
  
  y.parentId = parentOfXId;
  if (!parentOfXId) graph.rootId = yId;
  else {
    const parentOfX = getNode(graph,parentOfXId)!;
    if (parentOfX.leftId === xId) parentOfX.leftId = yId; else parentOfX.rightId = yId;
    graph.nodesMap.set(parentOfXId, parentOfX);
  }
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftUpdateRootOrChild, `  Link y to x's original parent. ${parentOfXId? `Child of ${getNode(graph,parentOfXId)?.value} is now ${y.value}` : `New root is ${y.value}`}.`, [yId, parentOfXId||'NIL']);

  graph.nodesMap.set(yId,y); graph.nodesMap.set(xId,x);

  updateHeightAndBF(graph, xId, localSteps, [], "  Heights/BF after rotation: "); updateHeightAndBF(graph, yId, localSteps, [], "  Heights/BF after rotation: ");
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.rotateLeftReturnY, `Rotate Left complete. New subtree root: ${y.value}.`, [yId]);
  return yId;
}

// --- Insert Operation with Rebalancing ---
function insertRec(graph: AVLTreeGraph, nodeId: string | null, value: number, parentId: string | null, path: string[], localSteps: TreeAlgorithmStep[]): string {
  const currentNodeValForMsg = nodeId ? getNode(graph, nodeId)?.value : 'NIL (new node position)';
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecFunc, `InsertRec(${value}) at ${currentNodeValForMsg}. Path: ${path.map(pId=>getNode(graph,pId)?.value).join('->')}`, nodeId ? [nodeId] : [], {}, path);
  
  if (!nodeId) {
    const newNodeId = generateAvlNodeId(value);
    const newNode: AVLNodeInternal = { id: newNodeId, value, height: 0, balanceFactor: 0, leftId: null, rightId: null, parentId };
    graph.nodesMap.set(newNodeId, newNode);
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecNewNode, `Created new node ${value}. H=0, BF=0.`, [newNodeId], {[newNodeId]:NODE_COLORS_AVL.NEWLY_INSERTED}, path);
    return newNodeId;
  }

  path.push(nodeId);
  const node = getNode(graph, nodeId)!;
  
  if (value < node.value) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecGoLeft, `Value ${value} < node ${node.value}. Go left.`, [nodeId], {}, path);
    node.leftId = insertRec(graph, node.leftId, value, nodeId, path, localSteps);
  } else if (value > node.value) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecGoRight, `Value ${value} > node ${node.value}. Go right.`, [nodeId], {}, path);
    node.rightId = insertRec(graph, node.rightId, value, nodeId, path, localSteps);
  } else {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecDuplicate, `Value ${value} already exists. No insertion.`, [nodeId], {[nodeId]:NODE_COLORS_AVL.ACTIVE_COMPARISON}, path);
    path.pop();
    return nodeId; // Duplicate value, no change
  }
  graph.nodesMap.set(nodeId, node); // Update node if children changed

  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecUpdateHeight, `Updating height and BF for node ${node.value} after recursive call.`, [nodeId], {}, path, undefined, nodeId);
  updateHeightAndBF(graph, nodeId, localSteps, path, `Node ${node.value}: `);
  
  const balance = node.balanceFactor!;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecGetBalance, `Node ${node.value} Balance Factor: ${balance}.`, [nodeId], {}, path, undefined, nodeId);

  let newSubtreeRootId = nodeId;
  let rotationPerformed: TreeAlgorithmStep['rotationType'] = null;

  if (balance > 1) { // Left heavy
    const leftChild = getNode(graph, node.leftId!)!;
    if (value < leftChild.value) { // LL Case
        rotationPerformed = 'LL';
        addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecCheckLL, `Node ${node.value} is Left-Left heavy (LL). Perform Right Rotation.`, [nodeId, node.leftId!, leftChild.leftId!], {}, path, rotationPerformed, nodeId, [nodeId, node.leftId!, leftChild.leftId!]);
        newSubtreeRootId = rotateRight(graph, nodeId, localSteps);
    } else { // LR Case
        rotationPerformed = 'LR';
        addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecCheckLR_Part1, `Node ${node.value} is Left-Right heavy (LR). Perform Left Rotation on ${leftChild.value}, then Right Rotation on ${node.value}.`, [nodeId, node.leftId!, leftChild.rightId!], {}, path, rotationPerformed, nodeId, [nodeId, node.leftId!, leftChild.rightId!]);
        node.leftId = rotateLeft(graph, node.leftId!, localSteps);
        updateHeightAndBF(graph, node.leftId!, localSteps, path, `Post LR-part1, Node ${getNode(graph,node.leftId!)?.value}: `);
        updateHeightAndBF(graph, nodeId, localSteps, path, `Post LR-part1, Node ${node.value}: `);
        newSubtreeRootId = rotateRight(graph, nodeId, localSteps);
    }
  } else if (balance < -1) { // Right heavy
    const rightChild = getNode(graph, node.rightId!)!;
    if (value > rightChild.value) { // RR Case
        rotationPerformed = 'RR';
        addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecCheckRR, `Node ${node.value} is Right-Right heavy (RR). Perform Left Rotation.`, [nodeId, node.rightId!, rightChild.rightId!], {}, path, rotationPerformed, nodeId, [nodeId, node.rightId!, rightChild.rightId!]);
        newSubtreeRootId = rotateLeft(graph, nodeId, localSteps);
    } else { // RL Case
        rotationPerformed = 'RL';
        addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecCheckRL_Part1, `Node ${node.value} is Right-Left heavy (RL). Perform Right Rotation on ${rightChild.value}, then Left Rotation on ${node.value}.`, [nodeId, node.rightId!, rightChild.leftId!], {}, path, rotationPerformed, nodeId, [nodeId, node.rightId!, rightChild.leftId!]);
        node.rightId = rotateRight(graph, node.rightId!, localSteps);
        updateHeightAndBF(graph, node.rightId!, localSteps, path, `Post RL-part1, Node ${getNode(graph,node.rightId!)?.value}: `);
        updateHeightAndBF(graph, nodeId, localSteps, path, `Post RL-part1, Node ${node.value}: `);
        newSubtreeRootId = rotateLeft(graph, nodeId, localSteps);
    }
  }

  if (rotationPerformed) {
    addStep(localSteps, graph, null, `Rotation ${rotationPerformed} at original node ${node.value} (now possibly child of ${getNode(graph,newSubtreeRootId)?.value}) complete. Subtree root for this level: ${getNode(graph,newSubtreeRootId)?.value}.`, [newSubtreeRootId], {}, path);
  }
  
  path.pop();
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecReturnNode, `Return from InsertRec for node ${node.value}. Subtree root after balancing: ${getNode(graph,newSubtreeRootId)?.value}.`, [newSubtreeRootId], {}, path);
  return newSubtreeRootId;
}


// --- Search Operation ---
function searchRec(graph: AVLTreeGraph, nodeId: string | null, value: number, path: string[], localSteps: TreeAlgorithmStep[]): string | null {
  const currentNodeValForMsg = nodeId ? getNode(graph, nodeId)?.value : 'NIL';
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchRecFunc, `SearchRec(${value}) at ${currentNodeValForMsg}. Path: ${path.map(pId => getNode(graph, pId)?.value).join('->')}`, nodeId ? [nodeId] : [], {}, path);

  if (!nodeId) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchBaseNull, `Value ${value} not found (reached NIL).`, [], {}, path);
    return null;
  }
  path.push(nodeId);
  const node = getNode(graph, nodeId)!;

  if (value === node.value) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchBaseFound, `Value ${value} FOUND at node ${node.value}.`, [nodeId], {[nodeId]: NODE_COLORS_AVL.ACTIVE_COMPARISON}, path);
    path.pop();
    return nodeId;
  }
  if (value < node.value) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchGoLeft, `Search value ${value} < node ${node.value}. Go left.`, [nodeId], {}, path);
    const result = searchRec(graph, node.leftId, value, path, localSteps);
    path.pop();
    return result;
  } else {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchGoRight, `Search value ${value} > node ${node.value}. Go right.`, [nodeId], {}, path);
    const result = searchRec(graph, node.rightId, value, path, localSteps);
    path.pop();
    return result;
  }
}

// --- Delete Operation (Conceptual Rebalancing) ---
// Returns the new root of the subtree rooted at nodeId after deletion and balancing
function deleteRec(graph: AVLTreeGraph, nodeId: string | null, value: number, path: string[], localSteps: TreeAlgorithmStep[]): string | null {
  const currentNodeValForMsg = nodeId ? getNode(graph, nodeId)?.value : 'NIL';
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecFunc, `DeleteRec(${value}) at ${currentNodeValForMsg}. Path: ${path.map(pId=>getNode(graph,pId)?.value).join('->')}`, nodeId ? [nodeId] : [], {}, path);

  if (!nodeId) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecBaseNull, `Value ${value} not found.`, [], {}, path);
    return null;
  }
  path.push(nodeId);
  let node = getNode(graph, nodeId)!; // Make mutable for value copy case

  if (value < node.value) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecGoLeft, `Value ${value} < node ${node.value}. Go left.`, [nodeId], {}, path);
    node.leftId = deleteRec(graph, node.leftId, value, path, localSteps);
    if (node.leftId) getNode(graph, node.leftId)!.parentId = nodeId; // Re-link parent
  } else if (value > node.value) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecGoRight, `Value ${value} > node ${node.value}. Go right.`, [nodeId], {}, path);
    node.rightId = deleteRec(graph, node.rightId, value, path, localSteps);
    if (node.rightId) getNode(graph, node.rightId)!.parentId = nodeId; // Re-link parent
  } else { // Node to delete found
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecNodeFound, `Node to delete (${value}) found.`, [nodeId], {[nodeId]: NODE_COLORS_AVL.TO_BE_DELETED}, path);
    if (!node.leftId || !node.rightId) { // Node with 0 or 1 child
      const tempId = node.leftId || node.rightId;
      const childVal = tempId ? getNode(graph, tempId)!.value : 'NIL';
      addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecHandleNoLeftChild, `Node ${value} has ${tempId ? 'one' : 'zero'} child. Replace with ${childVal}.`, [nodeId], {[nodeId]: NODE_COLORS_AVL.TO_BE_DELETED}, path);
      if (tempId) getNode(graph, tempId)!.parentId = node.parentId; // Child's new parent
      graph.nodesMap.delete(nodeId); // Remove node
      path.pop(); // Current node is gone
      addStep(localSteps, graph, 0, `Node ${value} deleted. Subtree root is now ${childVal}.`, tempId ? [tempId] : [], {}, path);
      nodeId = tempId; // This is the new root of this subtree for balancing checks
    } else { // Node with two children
      addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecHandleTwoChildren, `Node ${value} has two children. Find inorder successor.`, [nodeId], {[nodeId]: NODE_COLORS_AVL.TO_BE_DELETED}, path);
      let successorId = node.rightId!;
      const successorPath: string[] = [];
      while (getNode(graph, successorId)!.leftId) {
        successorPath.push(successorId);
        successorId = getNode(graph, successorId)!.leftId!;
      }
      const successorNode = getNode(graph, successorId)!;
      addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecFindSuccessor, `Inorder successor is ${successorNode.value}. Path to successor: ${successorPath.map(id=>getNode(graph,id)?.value).join('->')}`, [successorId], {[successorId]:NODE_COLORS_AVL.INORDER_SUCCESSOR}, [...path, ...successorPath, successorId]);
      
      node.value = successorNode.value; // Copy successor's value to this node
      graph.nodesMap.set(nodeId, node); // Update the current node in map
      addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecCopySuccessor, `Copied successor value ${node.value} to node originally holding ${value}.`, [nodeId], {[nodeId]:NODE_COLORS_AVL.TO_BE_DELETED, [successorId]: NODE_COLORS_AVL.INORDER_SUCCESSOR}, path);
      
      addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecDeleteSuccessor, `Delete original successor node ${successorNode.value} from right subtree.`, [node.rightId!], {}, path);
      node.rightId = deleteRec(graph, node.rightId, successorNode.value, path, localSteps); // Delete the successor
      if(node.rightId) getNode(graph,node.rightId)!.parentId = nodeId;
    }
  }

  if (!nodeId) { path.pop(); return null; } // If tree/subtree became empty
  
  node = getNode(graph, nodeId)!; // Re-fetch node as its children/value might have changed
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecAfterDeleteUpdateHeight, `Updating height & BF for node ${node.value} after deletion/recursion.`, [nodeId], {}, path, undefined, nodeId);
  updateHeightAndBF(graph, nodeId, localSteps, path, `Node ${node.value}: `);
  
  const balance = node.balanceFactor!;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecAfterDeleteGetBalance, `Node ${node.value} Balance Factor: ${balance}.`, [nodeId], {}, path, undefined, nodeId);
  
  let newSubtreeRootId = nodeId;
  let rotationPerformed: TreeAlgorithmStep['rotationType'] = null;

  if (balance > 1) { // Left heavy
    const leftChild = getNode(graph, node.leftId!)!;
    // For delete, determine rotation type based on child's balance factor
    if (getBalanceFactor(getNode(graph, leftChild.leftId)) >= 0) { // LL Case or L0 if leftChild.left is balanced (height 0)
      rotationPerformed = 'LL';
      addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecRebalanceCheck, `Node ${node.value} is Left-Left heavy (LL). Perform Right Rotation. (Delete fixup may need more)`, [nodeId], {}, path, rotationPerformed, nodeId);
      newSubtreeRootId = rotateRight(graph, nodeId, localSteps);
    } else { // LR Case
      rotationPerformed = 'LR';
      addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecRebalanceCheck, `Node ${node.value} is Left-Right heavy (LR). Perform L-R rotations. (Delete fixup may need more)`, [nodeId], {}, path, rotationPerformed, nodeId);
      node.leftId = rotateLeft(graph, node.leftId!, localSteps);
      updateHeightAndBF(graph, node.leftId!, localSteps, path); updateHeightAndBF(graph, nodeId, localSteps, path);
      newSubtreeRootId = rotateRight(graph, nodeId, localSteps);
    }
  } else if (balance < -1) { // Right heavy
    const rightChild = getNode(graph, node.rightId!)!;
    if (getBalanceFactor(getNode(graph, rightChild.rightId)) <= 0) { // RR Case or R0
      rotationPerformed = 'RR';
      addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecRebalanceCheck, `Node ${node.value} is Right-Right heavy (RR). Perform Left Rotation. (Delete fixup may need more)`, [nodeId], {}, path, rotationPerformed, nodeId);
      newSubtreeRootId = rotateLeft(graph, nodeId, localSteps);
    } else { // RL Case
      rotationPerformed = 'RL';
      addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecRebalanceCheck, `Node ${node.value} is Right-Left heavy (RL). Perform R-L rotations. (Delete fixup may need more)`, [nodeId], {}, path, rotationPerformed, nodeId);
      node.rightId = rotateRight(graph, node.rightId!, localSteps);
      updateHeightAndBF(graph, node.rightId!, localSteps, path); updateHeightAndBF(graph, nodeId, localSteps, path);
      newSubtreeRootId = rotateLeft(graph, nodeId, localSteps);
    }
  }
  if (rotationPerformed) {
    addStep(localSteps, graph, null, `Rotation ${rotationPerformed} at original node ${node.value} complete. Subtree root: ${getNode(graph,newSubtreeRootId)?.value}.`, [newSubtreeRootId], {}, path);
  }
  
  path.pop();
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecReturnNode, `Return from DeleteRec for node ${node.value}. Subtree root after balancing: ${getNode(graph,newSubtreeRootId)?.value}.`, [newSubtreeRootId], {}, path);
  return newSubtreeRootId;
}


export const generateAVLSteps = (
  operation: AVLOperationType, initialValuesString?: string, valueToProcess?: number, currentGraphState?: AVLTreeGraph
): TreeAlgorithmStep[] => { 
  globalAvlNodeIdCounter = 0; const localSteps: TreeAlgorithmStep[] = []; let graph: AVLTreeGraph;

  if (operation === 'build' || !currentGraphState || currentGraphState.nodesMap.size === 0) {
    graph = createInitialAVLTreeGraph();
  } else {
    const newNodesMap = new Map<string, AVLNodeInternal>();
    currentGraphState.nodesMap.forEach((node, id) => newNodesMap.set(id, { ...node }));
    graph = { rootId: currentGraphState.rootId, nodesMap: newNodesMap };
    globalAvlNodeIdCounter = Array.from(graph.nodesMap.keys()).reduce((max, id) => {
        const numPart = id.split('-').pop();
        return Math.max(max, parseInt(numPart || '0', 10));
    }, 0) + 1;
  }
  
  const currentPath: string[] = [];
  if (operation === 'build') {
    const values = initialValuesString ? initialValuesString.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : [];
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.constructor, `Building AVL Tree from: [${values.join(',')}]`);
    if (values.length === 0) {
      addStep(localSteps,graph,null,"Tree empty (no values to build).");
    }
    values.forEach(val => { 
      currentPath.length=0; 
      addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertFunc,`Main call: Insert(${val}) into current tree.`); 
      graph.rootId = insertRec(graph,graph.rootId,val,null,currentPath,localSteps);
      addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertFuncEnd,`Root is now ${graph.rootId ? getNode(graph,graph.rootId)?.value : 'null'} after inserting ${val}.`);
    });
    addStep(localSteps, graph, null, "Build complete.");
  } else if (valueToProcess !== undefined) {
    currentPath.length = 0;
    const opLineMap = operation === 'insert' ? AVL_TREE_LINE_MAP.insertFunc : 
                      (operation === 'delete' ? AVL_TREE_LINE_MAP.deleteFunc : AVL_TREE_LINE_MAP.searchFunc);
    addStep(localSteps, graph, opLineMap, `Operation: ${operation}(${valueToProcess})`);
    if (operation === 'insert') graph.rootId = insertRec(graph, graph.rootId, valueToProcess, null, currentPath, localSteps);
    else if (operation === 'delete') graph.rootId = deleteRec(graph, graph.rootId, valueToProcess, currentPath, localSteps);
    else if (operation === 'search') searchRec(graph, graph.rootId, valueToProcess, currentPath, localSteps);
    addStep(localSteps, graph, 0, `${operation} ${valueToProcess} complete.`);
  } else if (operation === 'structure') {
    addStep(localSteps, graph, null, "Displaying current AVL tree structure.");
  }
  
  if (localSteps.length > 0) {
    const lastStep = localSteps[localSteps.length - 1];
    const finalGraphStateNodes = new Map<string, AVLNodeInternal>();
    graph.nodesMap.forEach((node, id) => finalGraphStateNodes.set(id, {...node}));
    lastStep.auxiliaryData = { 
        ...lastStep.auxiliaryData, 
        finalGraphState: { rootId: graph.rootId, nodesMap: finalGraphStateNodes } 
    };
  }
  return localSteps;
};

export const createInitialAVLTreeGraph = (): AVLTreeGraph => {
  globalAvlNodeIdCounter = 0;
  return { rootId: null, nodesMap: new Map() };
};
```