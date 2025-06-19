
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual, AVLNodeInternal } from './types'; // Local import

export const AVL_TREE_LINE_MAP = {
  // Node Class
  nodeClass: 1, nodeConstructor: 2, nodeProps: 3,
  // Tree Class
  treeClass: 7, treeConstructor: 8,
  // Get Height
  getHeightFunc: 10, getHeightReturn: 11,
  // Get Balance Factor
  getBalanceFunc: 13, getBalanceReturn: 14,
  // Update Height
  updateHeightFunc: 16, updateHeightCalc: 17,
  // Rotations
  rotateRightFunc: 20, rotateRightSetup: 21, rotateRightPerform: 22, rotateRightUpdateHeights: 23, rotateRightReturn: 24,
  rotateLeftFunc: 31, rotateLeftSetup: 32, rotateLeftPerform: 33, rotateLeftUpdateHeights: 34, rotateLeftReturn: 35,
  // Insert
  insertFuncMain: 42,
  insertRecFunc: 43,
  insertBaseCaseNull: 44,
  insertGoLeft: 45,
  insertAssignLeft: 46,
  insertGoRight: 47,
  insertAssignRight: 48,
  insertDuplicateReturn: 49,
  insertUpdateHeight: 51,
  insertGetBalance: 54,
  // Balancing cases for Insert
  llCaseCondition: 57, llCaseAction: 57, // Combined line for condition and action
  rrCaseCondition: 59, rrCaseAction: 59,
  lrCaseCondition: 61, lrCaseAction1: 62, lrCaseAction2: 63,
  rlCaseCondition: 66, rlCaseAction1: 67, rlCaseAction2: 68,
  insertReturnNode: 70,

  // Delete
  deleteFuncMain: 74, // Main delete function
  deleteRecFunc: 75,  // Recursive _deleteRec
  deleteBaseCaseNull: 76, // if (!node) return null (not found)
  deleteGoLeft: 77,
  deleteAssignLeft: 78,
  deleteGoRight: 79,
  deleteAssignRight: 80,
  deleteNodeFound: 81, // else (node to delete is found)
  deleteCase1LeftNull: 82,
  deleteReturnRightChild: 83,
  deleteCase1RightNull: 84,
  deleteReturnLeftChild: 85,
  deleteCase2TwoChildren: 86,
  deleteFindMinValueNode: 87, // Call _minValueNode
  deleteCopySuccessorValue: 88,
  deleteRecCallOnSuccessor: 89,
  deleteNodeIsNILAfterDeletion: 90, // If subtree becomes null
  deleteUpdateHeight: 91,
  deleteGetBalance: 92,
  // Balancing cases for Delete (can reuse insert's or define new ones if logic differs slightly)
  delBalanceLL: 93, // balance > 1 && BF(left) >= 0
  delBalanceLR: 94, // balance > 1 && BF(left) < 0
  delBalanceRR: 95, // balance < -1 && BF(right) <= 0
  delBalanceRL: 96, // balance < -1 && BF(right) > 0
  deleteReturnBalancedNode: 97, // After rebalancing, return node

  // MinValueNode Helper (for delete)
  minValueNodeFunc: 98,
  minValueNodeLoop: 99,
  minValueNodeReturn: 100,
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  active: "hsl(var(--primary))",
  inserted: "hsl(var(--accent))",
  path: "hsl(var(--primary)/0.7)",
  rotated: "hsl(var(--ring))",
  deleted: "hsl(var(--destructive))",
  successor: "hsl(var(--chart-3))", // For inorder successor highlight
};
const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  path: "hsl(var(--primary))",
};


let avlNodeIdCounter = 0;
const generateAVLNodeId = (value: number) => `avl-node-${value}-${avlNodeIdCounter++}`;

const nodesMap = new Map<string, AVLNodeInternal>();
let rootId: string | null = null;
const localSteps: TreeAlgorithmStep[] = [];
let currentPathRec: string[] = [];


function getNode(nodeId: string | null): AVLNodeInternal | null {
  if (!nodeId) return null;
  return nodesMap.get(nodeId) || null;
}

function getHeight(nodeId: string | null): number {
  const node = getNode(nodeId);
  return node ? node.height : 0;
}

function getBalanceFactor(nodeId: string | null): number {
  if (!nodeId) return 0;
  const node = getNode(nodeId)!;
  return getHeight(node.leftId) - getHeight(node.rightId);
}

function updateHeight(nodeId: string | null) {
  if (!nodeId) return;
  const node = getNode(nodeId)!;
  node.height = 1 + Math.max(getHeight(node.leftId), getHeight(node.rightId));
  nodesMap.set(nodeId, node);
}

function formatNodeLabel(node: AVLNodeInternal | null): string {
  if (!node) return "NIL";
  // Format value as "value (H:height, B:balanceFactor)"
  return `${node.value} (H:${node.height}, B:${getBalanceFactor(node.id)})`;
}

function addStep(line: number | null, message: string, activeNodeIds: string[] = [], specialColors: Record<string, string> = {}) {
  const visualNodes: BinaryTreeNodeVisual[] = [];
  const visualEdges: BinaryTreeEdgeVisual[] = [];
  
  function buildVisualTree(currentNodeId: string | null, x: number, y: number, xOffsetMultiplier: number, depth: number) {
    if (!currentNodeId) return;
    const node = getNode(currentNodeId);
    if (!node) return;

    let color = specialColors[node.id] || NODE_COLORS.default;
    if (activeNodeIds.includes(node.id)) color = NODE_COLORS.active;
    if (currentPathRec.includes(node.id) && !activeNodeIds.includes(node.id) && !specialColors[node.id]) {
        color = NODE_COLORS.path;
    }

    visualNodes.push({
      id: node.id,
      value: formatNodeLabel(node), // Use formatted label
      x, y, color,
      leftId: node.leftId,
      rightId: node.rightId,
    });

    const X_SPACING_BASE = 80;
    const Y_SPACING = 70;
    const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.8, depth);

    if (node.leftId) {
      visualEdges.push({
        id: `edge-${node.id}-${node.leftId}`, sourceId: node.id, targetId: node.leftId,
        color: (currentPathRec.includes(node.id) && currentPathRec.includes(node.leftId)) ? EDGE_COLORS.path : EDGE_COLORS.default,
      });
      buildVisualTree(node.leftId, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
    }
    if (node.rightId) {
      visualEdges.push({
        id: `edge-${node.id}-${node.rightId}`, sourceId: node.id, targetId: node.rightId,
        color: (currentPathRec.includes(node.id) && currentPathRec.includes(node.rightId)) ? EDGE_COLORS.path : EDGE_COLORS.default,
      });
      buildVisualTree(node.rightId, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
    }
  }

  if (rootId) buildVisualTree(rootId, 300, 50, 0.7, 0);

  localSteps.push({
    nodes: visualNodes,
    edges: visualEdges,
    traversalPath: currentPathRec.map(id => getNode(id)?.value ?? -1), 
    currentLine: line,
    message,
    currentProcessingNodeId: activeNodeIds.length > 0 ? activeNodeIds[0] : null,
  });
}


function rotateRight(yId: string): string {
  const y = getNode(yId)!;
  const xId = y.leftId!;
  const x = getNode(xId)!;
  const T2Id = x.rightId;
  const parentOfYId = y.parentId;

  addStep(AVL_TREE_LINE_MAP.rotateRightFunc, `Rotate Right around ${y.value}`, [yId, xId]);
  addStep(AVL_TREE_LINE_MAP.rotateRightSetup, `x=${x.value}, y=${y.value}, T2=${T2Id ? getNode(T2Id)!.value : 'NIL'}`, [yId, xId]);

  x.rightId = yId; y.parentId = xId;
  y.leftId = T2Id; if (T2Id) getNode(T2Id)!.parentId = yId;
  
  x.parentId = parentOfYId;
  if (parentOfYId) {
    const parentOfY = getNode(parentOfYId)!;
    if (parentOfY.leftId === yId) parentOfY.leftId = xId;
    else parentOfY.rightId = xId;
    nodesMap.set(parentOfYId, parentOfY);
  } else {
    rootId = xId; 
  }
  nodesMap.set(xId, x);
  nodesMap.set(yId, y);

  addStep(AVL_TREE_LINE_MAP.rotateRightPerform, `Rotation complete. ${x.value} is new root of this subtree.`, [xId, yId], {[xId]:NODE_COLORS.rotated, [yId]:NODE_COLORS.rotated});
  updateHeight(yId); addStep(AVL_TREE_LINE_MAP.rotateRightUpdateHeights, `Updated height of ${y.value}`, [yId]);
  updateHeight(xId); addStep(AVL_TREE_LINE_MAP.rotateRightUpdateHeights, `Updated height of ${x.value}`, [xId]);
  addStep(AVL_TREE_LINE_MAP.rotateRightReturn, `Return ${x.value} as new root of subtree.`, [xId]);
  return xId;
}

function rotateLeft(xId: string): string {
  const x = getNode(xId)!;
  const yId = x.rightId!;
  const y = getNode(yId)!;
  const T2Id = y.leftId;
  const parentOfXId = x.parentId;

  addStep(AVL_TREE_LINE_MAP.rotateLeftFunc, `Rotate Left around ${x.value}`, [xId, yId]);
  addStep(AVL_TREE_LINE_MAP.rotateLeftSetup, `x=${x.value}, y=${y.value}, T2=${T2Id ? getNode(T2Id)!.value : 'NIL'}`, [xId, yId]);
  
  y.leftId = xId; x.parentId = yId;
  x.rightId = T2Id; if (T2Id) getNode(T2Id)!.parentId = xId;

  y.parentId = parentOfXId;
  if (parentOfXId) {
    const parentOfX = getNode(parentOfXId)!;
    if (parentOfX.leftId === xId) parentOfX.leftId = yId;
    else parentOfX.rightId = xId;
    nodesMap.set(parentOfXId, parentOfX);
  } else {
    rootId = yId; 
  }
  nodesMap.set(yId, y);
  nodesMap.set(xId, x);

  addStep(AVL_TREE_LINE_MAP.rotateLeftPerform, `Rotation complete. ${y.value} is new root of this subtree.`, [yId, xId], {[yId]:NODE_COLORS.rotated, [xId]:NODE_COLORS.rotated});
  updateHeight(xId); addStep(AVL_TREE_LINE_MAP.rotateLeftUpdateHeights, `Updated height of ${x.value}`, [xId]);
  updateHeight(yId); addStep(AVL_TREE_LINE_MAP.rotateLeftUpdateHeights, `Updated height of ${y.value}`, [yId]);
  addStep(AVL_TREE_LINE_MAP.rotateLeftReturn, `Return ${y.value} as new root of subtree.`, [yId]);
  return yId;
}

function balanceNode(nodeId: string, valueForPathContext?: number): string {
    updateHeight(nodeId);
    addStep(AVL_TREE_LINE_MAP.insertUpdateHeight, `Updating height for node ${getNode(nodeId)!.value} after recursive call.`, [nodeId]);

    const balance = getBalanceFactor(nodeId);
    addStep(AVL_TREE_LINE_MAP.insertGetBalance, `Balance factor of ${getNode(nodeId)!.value} is ${balance}.`, [nodeId]);

    let newSubtreeRootId = nodeId;

    if (balance > 1) {
        const leftChildId = getNode(nodeId)!.leftId!;
        const conditionForLL = valueForPathContext !== undefined ? valueForPathContext < getNode(leftChildId)!.value : getBalanceFactor(leftChildId) >= 0;

        if (conditionForLL) { 
            addStep(AVL_TREE_LINE_MAP.llCaseCondition, `LL Case for ${getNode(nodeId)!.value}. Rotating right.`, [nodeId]);
            newSubtreeRootId = rotateRight(nodeId);
        } else { 
            addStep(AVL_TREE_LINE_MAP.lrCaseCondition, `LR Case for ${getNode(nodeId)!.value}. Rotate left on left child, then right on current.`, [nodeId]);
            const currentLeftId = getNode(nodeId)!.leftId!;
            const newLeftSubtreeRootId = rotateLeft(currentLeftId);
            getNode(nodeId)!.leftId = newLeftSubtreeRootId;
            getNode(newLeftSubtreeRootId)!.parentId = nodeId;
            nodesMap.set(nodeId, getNode(nodeId)!);
            addStep(AVL_TREE_LINE_MAP.lrCaseAction1, `After left rotation on left child of ${getNode(nodeId)!.value}`, [nodeId]);
            newSubtreeRootId = rotateRight(nodeId);
            addStep(AVL_TREE_LINE_MAP.lrCaseAction2, `After right rotation on ${getNode(nodeId)?.value || 'original node'}. New root: ${getNode(newSubtreeRootId)!.value}`, [newSubtreeRootId]);
        }
    }
    else if (balance < -1) {
        const rightChildId = getNode(nodeId)!.rightId!;
        const conditionForRR = valueForPathContext !== undefined ? valueForPathContext > getNode(rightChildId)!.value : getBalanceFactor(rightChildId) <= 0;

        if (conditionForRR) { 
            addStep(AVL_TREE_LINE_MAP.rrCaseCondition, `RR Case for ${getNode(nodeId)!.value}. Rotating left.`, [nodeId]);
            newSubtreeRootId = rotateLeft(nodeId);
        } else { 
            addStep(AVL_TREE_LINE_MAP.rlCaseCondition, `RL Case for ${getNode(nodeId)!.value}. Rotate right on right child, then left on current.`, [nodeId]);
            const currentRightId = getNode(nodeId)!.rightId!;
            const newRightSubtreeRootId = rotateRight(currentRightId);
            getNode(nodeId)!.rightId = newRightSubtreeRootId;
            getNode(newRightSubtreeRootId)!.parentId = nodeId;
             nodesMap.set(nodeId, getNode(nodeId)!);
            addStep(AVL_TREE_LINE_MAP.rlCaseAction1, `After right rotation on right child of ${getNode(nodeId)!.value}`, [nodeId]);
            newSubtreeRootId = rotateLeft(nodeId);
            addStep(AVL_TREE_LINE_MAP.rlCaseAction2, `After left rotation on ${getNode(nodeId)?.value || 'original node'}. New root: ${getNode(newSubtreeRootId)!.value}`, [newSubtreeRootId]);
        }
    }
    return newSubtreeRootId;
}

function insertRec(nodeId: string | null, value: number, parentId: string | null): string {
  if (nodeId) currentPathRec.push(nodeId);
  addStep(AVL_TREE_LINE_MAP.insertRecFunc, `InsertRec(${value}) at node ${formatNodeLabel(getNode(nodeId))}`, nodeId ? [nodeId] : []);

  if (!nodeId) {
    const newNodeId = generateAVLNodeId(value);
    nodesMap.set(newNodeId, { id: newNodeId, value, height: 1, leftId: null, rightId: null, parentId });
    addStep(AVL_TREE_LINE_MAP.insertBaseCaseNull, `Created new node ${value}`, [newNodeId], {[newNodeId]: NODE_COLORS.inserted});
    if (currentPathRec.length > 0 && currentPathRec[currentPathRec.length -1] === nodeId) currentPathRec.pop();
    return newNodeId;
  }

  const node = getNode(nodeId)!;
  let newChildId;
  if (value < node.value) {
    addStep(AVL_TREE_LINE_MAP.insertGoLeft, `Value ${value} < node ${node.value}. Go left.`, [nodeId]);
    newChildId = insertRec(node.leftId, value, nodeId);
    if (node.leftId !== newChildId) { 
        node.leftId = newChildId;
        if(getNode(newChildId)) getNode(newChildId)!.parentId = nodeId;
    }
    addStep(AVL_TREE_LINE_MAP.insertAssignLeft, `Link/update left child of ${node.value}.`, [nodeId]);
  } else if (value > node.value) {
    addStep(AVL_TREE_LINE_MAP.insertGoRight, `Value ${value} > node ${node.value}. Go right.`, [nodeId]);
    newChildId = insertRec(node.rightId, value, nodeId);
    if (node.rightId !== newChildId) {
        node.rightId = newChildId;
        if(getNode(newChildId)) getNode(newChildId)!.parentId = nodeId;
    }
    addStep(AVL_TREE_LINE_MAP.insertAssignRight, `Link/update right child of ${node.value}.`, [nodeId]);
  } else {
    addStep(AVL_TREE_LINE_MAP.insertDuplicateReturn, `Value ${value} already exists. No insertion.`, [nodeId]);
    if (currentPathRec.length > 0 && currentPathRec[currentPathRec.length -1] === nodeId) currentPathRec.pop();
    return nodeId; 
  }
  nodesMap.set(nodeId, node);

  const balancedNodeId = balanceNode(nodeId, value);
  
  addStep(AVL_TREE_LINE_MAP.insertReturnNode, `Return from insertRec for (sub)tree rooted at ${getNode(balancedNodeId)!.value}.`, [balancedNodeId]);
  if (currentPathRec.length > 0 && currentPathRec[currentPathRec.length -1] === nodeId) currentPathRec.pop();
  return balancedNodeId;
}

function _minValueNode(nodeId: string): AVLNodeInternal {
    let current = getNode(nodeId)!;
    currentPathRec.push(current.id);
    addStep(AVL_TREE_LINE_MAP.minValueNodeFunc, `Finding min value in subtree of ${current.value}. Start at ${current.value}.`, [current.id], {[current.id]:NODE_COLORS.successor});
    while (current.leftId !== null) {
        currentPathRec.push(current.leftId);
        current = getNode(current.leftId)!;
        addStep(AVL_TREE_LINE_MAP.minValueNodeLoop, `Current min candidate: ${current.value}. Go left.`, [current.id], {[current.id]:NODE_COLORS.successor});
    }
    addStep(AVL_TREE_LINE_MAP.minValueNodeReturn, `Min value in subtree is ${current.value}.`, [current.id], {[current.id]:NODE_COLORS.successor});
    return current;
}

function deleteRec(nodeId: string | null, value: number): string | null {
    if (nodeId) currentPathRec.push(nodeId);
    addStep(AVL_TREE_LINE_MAP.deleteRecFunc, `DeleteRec(${value}) at node ${formatNodeLabel(getNode(nodeId))}`, nodeId ? [nodeId] : []);

    if (!nodeId) {
        addStep(AVL_TREE_LINE_MAP.deleteBaseCaseNull, `Value ${value} not found (reached null). Return.`, []);
        if (currentPathRec.length > 0 && currentPathRec[currentPathRec.length -1] === nodeId) currentPathRec.pop();
        return null;
    }

    let node = getNode(nodeId)!;
    let newSubtreeRootAfterDeleteOrRecurse = nodeId;

    if (value < node.value) {
        addStep(AVL_TREE_LINE_MAP.deleteGoLeft, `Value ${value} < node ${node.value}. Go left.`, [nodeId]);
        const newLeftId = deleteRec(node.leftId, value);
        if (node.leftId !== newLeftId) {
            node.leftId = newLeftId;
            if (getNode(newLeftId)) getNode(newLeftId)!.parentId = nodeId;
        }
        addStep(AVL_TREE_LINE_MAP.deleteAssignLeft, `Link/update left child of ${node.value}.`, [nodeId]);
    } else if (value > node.value) {
        addStep(AVL_TREE_LINE_MAP.deleteGoRight, `Value ${value} > node ${node.value}. Go right.`, [nodeId]);
        const newRightId = deleteRec(node.rightId, value);
        if (node.rightId !== newRightId) {
            node.rightId = newRightId;
            if (getNode(newRightId)) getNode(newRightId)!.parentId = nodeId;
        }
        addStep(AVL_TREE_LINE_MAP.deleteAssignRight, `Link/update right child of ${node.value}.`, [nodeId]);
    } else { 
        addStep(AVL_TREE_LINE_MAP.deleteNodeFound, `Node to delete (${value}) found.`, [nodeId], {[nodeId]: NODE_COLORS.deleted});
        if (!node.leftId || !node.rightId) { 
            const tempId = node.leftId ? node.leftId : node.rightId;
            if (!tempId) { 
                addStep(AVL_TREE_LINE_MAP.deleteCase1LeftNull, `Node ${node.value} is a leaf. Will be removed.`, [nodeId], {[nodeId]:NODE_COLORS.deleted});
                newSubtreeRootAfterDeleteOrRecurse = null;
            } else { 
                 addStep(AVL_TREE_LINE_MAP.deleteCase1LeftNull, `Node ${node.value} has one child. Replace with child ${getNode(tempId)!.value}.`, [nodeId, tempId], {[nodeId]:NODE_COLORS.deleted});
                const childNode = getNode(tempId)!;
                childNode.parentId = node.parentId; 
                nodesMap.set(tempId, childNode);
                newSubtreeRootAfterDeleteOrRecurse = tempId;
            }
             nodesMap.delete(nodeId); 
        } else { 
            addStep(AVL_TREE_LINE_MAP.deleteCase2TwoChildren, `Node ${node.value} has two children. Find inorder successor.`, [nodeId], {[nodeId]:NODE_COLORS.deleted});
            const tempSuccessor = _minValueNode(node.rightId!);
            addStep(AVL_TREE_LINE_MAP.deleteFindMinValueNode, `Inorder successor is ${tempSuccessor.value}.`, [tempSuccessor.id], {[tempSuccessor.id]:NODE_COLORS.successor, [nodeId]:NODE_COLORS.deleted});
            
            node.value = tempSuccessor.value; 
            nodesMap.set(nodeId, node); 
            addStep(AVL_TREE_LINE_MAP.deleteCopySuccessorValue, `Copied successor value ${tempSuccessor.value} to node ${node.id}.`, [nodeId, tempSuccessor.id], {[nodeId]:NODE_COLORS.deleted, [tempSuccessor.id]:NODE_COLORS.successor});
            
            const originalPathRecLength = currentPathRec.length;
            addStep(AVL_TREE_LINE_MAP.deleteRecCallOnSuccessor, `Delete original inorder successor (${tempSuccessor.value}) from right subtree.`, [node.rightId!]);
            node.rightId = deleteRec(node.rightId!, tempSuccessor.value); 
            if(getNode(node.rightId)) getNode(node.rightId!)!.parentId = nodeId; 
            nodesMap.set(nodeId, node);
            currentPathRec.length = originalPathRecLength - (currentPathRec.length - originalPathRecLength);
            newSubtreeRootAfterDeleteOrRecurse = nodeId;
        }
    }
    nodesMap.set(nodeId, node);

    if (newSubtreeRootAfterDeleteOrRecurse === null) {
        addStep(AVL_TREE_LINE_MAP.deleteNodeIsNILAfterDeletion, `Subtree became null. No balancing needed for this spot.`, []);
        if (currentPathRec.length > 0 && currentPathRec[currentPathRec.length -1] === nodeId) currentPathRec.pop();
        return null;
    }
    
    const balancedNodeId = balanceNode(newSubtreeRootAfterDeleteOrRecurse); 

    addStep(AVL_TREE_LINE_MAP.deleteReturnBalancedNode, `Return from deleteRec for (sub)tree rooted at ${getNode(balancedNodeId)!.value}.`, [balancedNodeId]);
    if (currentPathRec.length > 0 && currentPathRec[currentPathRec.length -1] === nodeId) currentPathRec.pop();
    return balancedNodeId;
}


export const generateAVLSteps = (
  operation: 'build' | 'insert' | 'delete',
  values: number[], 
  currentRootIdForOp?: string | null, 
  currentNodesMapForOp?: Map<string, AVLNodeInternal> 
): TreeAlgorithmStep[] => {
  localSteps.length = 0; 
  currentPathRec.length = 0;
  nodesMap.clear();
  
  if ((operation === 'insert' || operation === 'delete') && currentRootIdForOp !== undefined && currentNodesMapForOp) {
      currentNodesMapForOp.forEach((val, key) => nodesMap.set(key, {...val})); 
      rootId = currentRootIdForOp;
      avlNodeIdCounter = Array.from(nodesMap.keys()).reduce((max, id) => Math.max(max, parseInt(id.split('-').pop() || '0')), 0) + 1;
  } else { 
      rootId = null;
      avlNodeIdCounter = 0;
  }

  if (operation === 'build') {
    addStep(null, `Building AVL Tree from values: [${values.join(', ')}]`);
    rootId = null; 
    nodesMap.clear(); 
    avlNodeIdCounter = 0;
    values.forEach(val => {
      currentPathRec.length = 0; 
      addStep(AVL_TREE_LINE_MAP.insertFuncMain, `Main call: insert(${val})`, rootId ? [rootId] : []);
      rootId = insertRec(rootId, val, null);
    });
    addStep(null, "Build complete.");
  } else if (operation === 'insert' && values.length > 0) {
    const valueToInsert = values[0];
    currentPathRec.length = 0; 
    addStep(AVL_TREE_LINE_MAP.insertFuncMain, `Main call: insert(${valueToInsert})`, rootId ? [rootId] : []);
    rootId = insertRec(rootId, valueToInsert, null);
    addStep(null, `Insertion of ${valueToInsert} complete.`);
  } else if (operation === 'delete' && values.length > 0) {
    const valueToDelete = values[0];
    if (!nodesMap.has(Array.from(nodesMap.keys()).find(key => nodesMap.get(key)?.value === valueToDelete) || '')) {
         addStep(null, `Value ${valueToDelete} not found in tree. Nothing to delete.`);
         return [...localSteps];
    }
    currentPathRec.length = 0;
    addStep(AVL_TREE_LINE_MAP.deleteFuncMain, `Main call: delete(${valueToDelete})`, rootId ? [rootId] : []);
    rootId = deleteRec(rootId, valueToDelete);
    addStep(null, `Deletion of ${valueToDelete} complete.`);
  }
  
  return [...localSteps];
};

export const getFinalAVLTreeState = (): { rootId: string | null, nodes: Map<string, AVLNodeInternal> } => {
  return { rootId: rootId, nodes: new Map(nodesMap) };
};

export const resetAVLTreeState = () => {
    rootId = null;
    nodesMap.clear();
    localSteps.length = 0;
    avlNodeIdCounter = 0;
    currentPathRec.length = 0;
};
