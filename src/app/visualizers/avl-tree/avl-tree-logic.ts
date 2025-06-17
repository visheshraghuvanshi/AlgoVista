
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from '@/types';

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
  insertFuncMain: 42, // Main insert function in class
  insertRecFunc: 43, // Recursive helper _insertRec
  insertBaseCaseNull: 44, // if (!node) return new AVLNode(value);
  insertGoLeft: 45, // if (value < node.value)
  insertAssignLeft: 46, // node.left = this._insertRec(node.left, value);
  insertGoRight: 47, // else if (value > node.value)
  insertAssignRight: 48, // node.right = this._insertRec(node.right, value);
  insertDuplicateReturn: 49, // else return node (duplicate)
  insertUpdateHeight: 51, // this.updateHeight(node);
  insertGetBalance: 54, // let balance = this.getBalanceFactor(node);
  // Balancing cases
  llCaseCondition: 57, // Left Left Case: if (balance > 1 && value < node.left.value)
  llCaseAction: 57, // return this.rotateRight(node);
  rrCaseCondition: 59, // Right Right Case: if (balance < -1 && value > node.right.value)
  rrCaseAction: 59, // return this.rotateLeft(node);
  lrCaseCondition: 61, // Left Right Case: if (balance > 1 && value > node.left.value)
  lrCaseAction1: 62, // node.left = this.rotateLeft(node.left);
  lrCaseAction2: 63, // return this.rotateRight(node);
  rlCaseCondition: 66, // Right Left Case: if (balance < -1 && value < node.right.value)
  rlCaseAction1: 67, // node.right = this.rotateRight(node.right);
  rlCaseAction2: 68, // return this.rotateLeft(node);
  insertReturnNode: 70, // return node;
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  active: "hsl(var(--primary))",
  inserted: "hsl(var(--accent))",
  path: "hsl(var(--primary)/0.7)",
  rotated: "hsl(var(--ring))",
};
const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  path: "hsl(var(--primary))",
};

export interface AVLNodeInternal { // Renamed to export
  id: string;
  value: number;
  height: number;
  leftId: string | null;
  rightId: string | null;
  parentId: string | null; 
}

let avlNodeIdCounter = 0;
const generateAVLNodeId = (value: number) => `avl-node-${value}-${avlNodeIdCounter++}`;

const nodesMap = new Map<string, AVLNodeInternal>();
let rootId: string | null = null;
const localSteps: TreeAlgorithmStep[] = [];

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
  return `${node.value} (H:${node.height}, B:${getBalanceFactor(node.id)})`;
}

function addStep(line: number | null, message: string, activeNodeIds: string[] = [], specialColors: Record<string, string> = {}, currentPath: string[] = []) {
  const visualNodes: BinaryTreeNodeVisual[] = [];
  const visualEdges: BinaryTreeEdgeVisual[] = [];
  
  function buildVisualTree(currentNodeId: string | null, x: number, y: number, xOffsetMultiplier: number, depth: number) {
    if (!currentNodeId) return;
    const node = getNode(currentNodeId);
    if (!node) return;

    let color = specialColors[node.id] || NODE_COLORS.default;
    if (activeNodeIds.includes(node.id)) color = NODE_COLORS.active;
    if (currentPath.includes(node.id) && !activeNodeIds.includes(node.id) && !specialColors[node.id]) color = NODE_COLORS.path;


    visualNodes.push({
      id: node.id,
      value: formatNodeLabel(node),
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
        color: (currentPath.includes(node.id) && currentPath.includes(node.leftId)) ? EDGE_COLORS.path : EDGE_COLORS.default,
      });
      buildVisualTree(node.leftId, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
    }
    if (node.rightId) {
      visualEdges.push({
        id: `edge-${node.id}-${node.rightId}`, sourceId: node.id, targetId: node.rightId,
        color: (currentPath.includes(node.id) && currentPath.includes(node.rightId)) ? EDGE_COLORS.path : EDGE_COLORS.default,
      });
      buildVisualTree(node.rightId, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
    }
  }

  if (rootId) buildVisualTree(rootId, 300, 50, 0.7, 0);

  localSteps.push({
    nodes: visualNodes,
    edges: visualEdges,
    traversalPath: currentPath.map(id => getNode(id)?.value ?? -1),
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
    else parentOfX.rightId = yId;
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

const pathRec: string[] = []; // Renamed to avoid conflict with global 'path'

function insertRec(nodeId: string | null, value: number, parentId: string | null): string {
  if(nodeId) pathRec.push(nodeId);
  addStep(AVL_TREE_LINE_MAP.insertRecFunc, `InsertRec(${value}) at node ${formatNodeLabel(getNode(nodeId))}`, nodeId ? [nodeId] : [], {}, [...pathRec]);

  if (!nodeId) {
    const newNodeId = generateAVLNodeId(value);
    nodesMap.set(newNodeId, { id: newNodeId, value, height: 1, leftId: null, rightId: null, parentId });
    addStep(AVL_TREE_LINE_MAP.insertBaseCaseNull, `Created new node ${value}`, [newNodeId], {[newNodeId]: NODE_COLORS.inserted}, [...pathRec]);
    if(pathRec.length > 0) pathRec.pop();
    return newNodeId;
  }

  const node = getNode(nodeId)!;
  if (value < node.value) {
    addStep(AVL_TREE_LINE_MAP.insertGoLeft, `Value ${value} < node ${node.value}. Go left.`, [nodeId], {}, [...pathRec]);
    const newLeftId = insertRec(node.leftId, value, nodeId);
    if (node.leftId !== newLeftId && newLeftId) { // If left child changed (rotation happened below)
      node.leftId = newLeftId;
      const newLeftNode = getNode(newLeftId);
      if(newLeftNode) newLeftNode.parentId = nodeId; // Ensure parent is correctly set after potential rotation
    }
    nodesMap.set(nodeId, node); 
    addStep(AVL_TREE_LINE_MAP.insertAssignLeft, `Link/update left child of ${node.value}.`, [nodeId], {}, [...pathRec]);
  } else if (value > node.value) {
    addStep(AVL_TREE_LINE_MAP.insertGoRight, `Value ${value} > node ${node.value}. Go right.`, [nodeId], {}, [...pathRec]);
    const newRightId = insertRec(node.rightId, value, nodeId);
     if (node.rightId !== newRightId && newRightId) {
      node.rightId = newRightId;
       const newRightNode = getNode(newRightId);
      if(newRightNode) newRightNode.parentId = nodeId;
    }
    nodesMap.set(nodeId, node); 
    addStep(AVL_TREE_LINE_MAP.insertAssignRight, `Link/update right child of ${node.value}.`, [nodeId], {}, [...pathRec]);
  } else {
    addStep(AVL_TREE_LINE_MAP.insertDuplicateReturn, `Value ${value} already exists. No insertion.`, [nodeId], {}, [...pathRec]);
    if(pathRec.length > 0) pathRec.pop();
    return nodeId; 
  }

  addStep(AVL_TREE_LINE_MAP.insertUpdateHeight, `Updating height of node ${node.value}`, [nodeId], {}, [...pathRec]);
  updateHeight(nodeId);
  
  const balance = getBalanceFactor(nodeId);
  addStep(AVL_TREE_LINE_MAP.insertGetBalance, `Balance factor of ${node.value} is ${balance}`, [nodeId], {}, [...pathRec]);

  let newSubtreeRootId = nodeId;
  // Left Left Case
  if (balance > 1 && node.leftId && value < getNode(node.leftId!)!.value) {
    addStep(AVL_TREE_LINE_MAP.llCaseCondition, `LL Case for ${node.value}. Rotating right.`, [nodeId], {}, [...pathRec]);
    newSubtreeRootId = rotateRight(nodeId);
  }
  // Right Right Case
  else if (balance < -1 && node.rightId && value > getNode(node.rightId!)!.value) {
    addStep(AVL_TREE_LINE_MAP.rrCaseCondition, `RR Case for ${node.value}. Rotating left.`, [nodeId], {}, [...pathRec]);
    newSubtreeRootId = rotateLeft(nodeId);
  }
  // Left Right Case
  else if (balance > 1 && node.leftId && value > getNode(node.leftId!)!.value) {
    addStep(AVL_TREE_LINE_MAP.lrCaseCondition, `LR Case for ${node.value}. Rotate left on left child, then right on current.`, [nodeId], {}, [...pathRec]);
    const currentLeftId = node.leftId!;
    const newLeftSubtreeRootId = rotateLeft(currentLeftId);
    node.leftId = newLeftSubtreeRootId; 
    getNode(newLeftSubtreeRootId)!.parentId = nodeId; // Update parent of new left child
    nodesMap.set(nodeId,node);
    addStep(AVL_TREE_LINE_MAP.lrCaseAction1, `After left rotation on left child of ${node.value}`, [nodeId], {}, [...pathRec]);
    newSubtreeRootId = rotateRight(nodeId);
    addStep(AVL_TREE_LINE_MAP.lrCaseAction2, `After right rotation on ${node.value}`, [newSubtreeRootId], {}, [...pathRec]);
  }
  // Right Left Case
  else if (balance < -1 && node.rightId && value < getNode(node.rightId!)!.value) {
    addStep(AVL_TREE_LINE_MAP.rlCaseCondition, `RL Case for ${node.value}. Rotate right on right child, then left on current.`, [nodeId], {}, [...pathRec]);
    const currentRightId = node.rightId!;
    const newRightSubtreeRootId = rotateRight(currentRightId);
    node.rightId = newRightSubtreeRootId; 
    getNode(newRightSubtreeRootId)!.parentId = nodeId; // Update parent of new right child
    nodesMap.set(nodeId,node);
    addStep(AVL_TREE_LINE_MAP.rlCaseAction1, `After right rotation on right child of ${node.value}`, [nodeId], {}, [...pathRec]);
    newSubtreeRootId = rotateLeft(nodeId);
    addStep(AVL_TREE_LINE_MAP.rlCaseAction2, `After left rotation on ${node.value}`, [newSubtreeRootId], {}, [...pathRec]);
  }
  
  addStep(AVL_TREE_LINE_MAP.insertReturnNode, `Return from insertRec for node ${getNode(newSubtreeRootId)!.value}. Path pop.`, [newSubtreeRootId], {}, [...pathRec]);
  if(pathRec.length > 0) pathRec.pop();
  return newSubtreeRootId;
}

export const generateAVLSteps = (
  operation: 'build' | 'insert',
  values: number[], 
  currentRootIdForInsert?: string | null, 
  currentNodesMapForInsert?: Map<string, AVLNodeInternal> 
): TreeAlgorithmStep[] => {
  localSteps.length = 0; 
  nodesMap.clear();
  
  if (operation === 'insert' && currentRootIdForInsert !== undefined && currentNodesMapForInsert) {
      currentNodesMapForInsert.forEach((val, key) => nodesMap.set(key, {...val})); 
      rootId = currentRootIdForInsert;
      avlNodeIdCounter = Array.from(nodesMap.keys()).reduce((max, id) => Math.max(max, parseInt(id.split('-').pop() || '0')), 0) + 1;
  } else { // build operation or first insert
      rootId = null;
      avlNodeIdCounter = 0;
  }


  if (operation === 'build') {
    addStep(null, `Building AVL Tree from values: [${values.join(', ')}]`);
    rootId = null; 
    nodesMap.clear(); 
    avlNodeIdCounter = 0;
    values.forEach(val => {
      pathRec.length = 0; 
      addStep(AVL_TREE_LINE_MAP.insertFuncMain, `Main call: insert(${val})`, rootId ? [rootId] : []);
      rootId = insertRec(rootId, val, null);
    });
    addStep(null, "Build complete.");
  } else if (operation === 'insert' && values.length > 0) {
    const valueToInsert = values[0];
    pathRec.length = 0; 
    addStep(AVL_TREE_LINE_MAP.insertFuncMain, `Main call: insert(${valueToInsert})`, rootId ? [rootId] : []);
    rootId = insertRec(rootId, valueToInsert, null);
    addStep(null, `Insertion of ${valueToInsert} complete.`);
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
    pathRec.length = 0;
};
