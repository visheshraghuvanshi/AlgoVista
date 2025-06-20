
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, AVLNodeInternal, AVLTreeGraph, AVLOperationType } from './types';
import { NODE_COLORS_AVL, TEXT_COLORS_AVL } from './avl-node-colors'; 

// --- AVL Tree Specific Constants ---
let globalAvlNodeIdCounter = 0;
const generateAvlNodeId = (value: number) => `avl-node-${value}-${globalAvlNodeIdCounter++}`;

function createNode(id: string, value: number, parentId: string | null = null): AVLNodeInternal {
  return { id, value, height: 0, balanceFactor: 0, leftId: null, rightId: null, parentId };
}

function getNode(graph: AVLTreeGraph, nodeId: string | null): AVLNodeInternal | null {
  if (!nodeId) return null;
  return graph.nodesMap.get(nodeId) || null;
}

function getHeight(node: AVLNodeInternal | null): number {
  return node ? node.height : -1; 
}

function updateHeightAndBF(graph: AVLTreeGraph, nodeId: string, localSteps?: TreeAlgorithmStep[], pathForContext: (string|number)[] = [], messagePrefix = "") {
  const node = getNode(graph, nodeId);
  if (!node) return;

  const oldHeight = node.height;
  const oldBf = node.balanceFactor;

  const leftChild = getNode(graph, node.leftId);
  const rightChild = getNode(graph, node.rightId);

  node.height = 1 + Math.max(getHeight(leftChild), getHeight(rightChild));
  node.balanceFactor = getHeight(leftChild) - getHeight(rightChild);
  
  graph.nodesMap.set(nodeId, node);

  if (localSteps && (node.height !== oldHeight || node.balanceFactor !== oldBf)) {
    const pathValues = pathForContext.map(idOrVal => typeof idOrVal === 'string' ? graph.nodesMap.get(idOrVal)?.value ?? '?' : idOrVal).join('->');
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.updateHeightCalc, `${messagePrefix}Node ${node.value}: H=${node.height}, BF=${node.balanceFactor}. Path: ${pathValues}`, [nodeId], {}, pathForContext.map(String), undefined, node.balanceFactor < -1 || node.balanceFactor > 1 ? nodeId : null);
  }
}

function getBalanceFactor(node: AVLNodeInternal | null): number {
  if (!node) return 0; // BF of a null node is 0
  return node.balanceFactor;
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

    const X_SPACING_BASE = 70; 
    const Y_SPACING = 80; 
    const SVG_WIDTH_CENTER = 300; 

    function positionNode(nodeId: string | null, x: number, y: number, xOffsetMultiplier: number, depth: number) {
        if (!nodeId) return;
        const nodeInternal = graph.nodesMap.get(nodeId);
        if (!nodeInternal) return;

        let nodeColor: string;
        let nodeTextColor: string;
        const bf = nodeInternal.balanceFactor;
        
        if (specialColors[nodeId]) {
            nodeColor = specialColors[nodeId];
            if(nodeColor === NODE_COLORS_AVL.FOUND_HIGHLIGHT || nodeColor === NODE_COLORS_AVL.NEWLY_INSERTED || nodeColor === NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW || nodeColor === NODE_COLORS_AVL.SLIGHTLY_UNBALANCED_YELLOW) {
                nodeTextColor = TEXT_COLORS_AVL.SLIGHTLY_UNBALANCED_YELLOW_TEXT; 
            } else if (nodeColor === NODE_COLORS_AVL.UNBALANCED_NODE_RED || nodeColor === NODE_COLORS_AVL.TO_BE_DELETED) {
                nodeTextColor = TEXT_COLORS_AVL.UNBALANCED_NODE_RED_TEXT;
            } else if (nodeColor === NODE_COLORS_AVL.BALANCED_GREEN) {
                nodeTextColor = TEXT_COLORS_AVL.BALANCED_GREEN_TEXT;
            } else if (nodeColor === NODE_COLORS_AVL.ACTIVE_COMPARISON || nodeColor === NODE_COLORS_AVL.PATH_TRAVERSED) {
                 nodeTextColor = TEXT_COLORS_AVL.ACTIVE_COMPARISON_TEXT;
            } else {
                 nodeTextColor = TEXT_COLORS_AVL.DEFAULT_TEXT; 
            }
        } else if (nodeId === unbalancedNodeIdForVisual || bf < -1 || bf > 1) {
            nodeColor = NODE_COLORS_AVL.UNBALANCED_NODE_RED;
            nodeTextColor = TEXT_COLORS_AVL.UNBALANCED_NODE_RED_TEXT;
        } else if (bf === -1 || bf === 1) {
            nodeColor = NODE_COLORS_AVL.SLIGHTLY_UNBALANCED_YELLOW;
            nodeTextColor = TEXT_COLORS_AVL.SLIGHTLY_UNBALANCED_YELLOW_TEXT;
        } else { 
            nodeColor = NODE_COLORS_AVL.BALANCED_GREEN;
            nodeTextColor = TEXT_COLORS_AVL.BALANCED_GREEN_TEXT;
        }
        
        if (activeNodeIds.includes(nodeId) && !specialColors[nodeId] && nodeId !== unbalancedNodeIdForVisual) {
            nodeColor = NODE_COLORS_AVL.ACTIVE_COMPARISON;
            nodeTextColor = TEXT_COLORS_AVL.ACTIVE_COMPARISON_TEXT;
        } else if (pathNodeIds.includes(nodeId) && !specialColors[nodeId] && nodeId !== unbalancedNodeIdForVisual && !activeNodeIds.includes(nodeId)) {
            nodeColor = NODE_COLORS_AVL.PATH_TRAVERSED;
            nodeTextColor = TEXT_COLORS_AVL.PATH_TRAVERSED_TEXT;
        }

        visualNodes.push({
            id: nodeId, 
            value: nodeInternal.value, 
            height: nodeInternal.height, 
            balanceFactor: nodeInternal.balanceFactor,
            x, y, color: nodeColor, textColor: nodeTextColor,
            leftId: nodeInternal.leftId, rightId: nodeInternal.rightId,
        });
        
        const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.7, depth); 
        if (nodeInternal.leftId) {
            visualEdges.push({ id: `edge-${nodeId}-${nodeInternal.leftId}`, sourceId: nodeId, targetId: nodeInternal.leftId });
            positionNode(nodeInternal.leftId, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
        }
        if (nodeInternal.rightId) {
            visualEdges.push({ id: `edge-${nodeId}-${nodeInternal.rightId}`, sourceId: nodeId, targetId: nodeInternal.rightId });
            positionNode(nodeInternal.rightId, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
        }
    }
    positionNode(graph.rootId, SVG_WIDTH_CENTER, 60, 0.8, 0);

    if (visualNodes.length > 0) {
        const minX = Math.min(...visualNodes.map(n => n.x).filter(x => x !== undefined && !isNaN(x)));
        const maxX = Math.max(...visualNodes.map(n => n.x).filter(x => x !== undefined && !isNaN(x)));
        if (isFinite(minX) && isFinite(maxX)) {
            const treeWidth = maxX - minX;
            const currentCenterX = minX + treeWidth / 2;
            const desiredCenterX = SVG_WIDTH_CENTER;
            const shiftX = desiredCenterX - currentCenterX;

            let scaleFactor = 1;
            if (treeWidth > SVG_WIDTH_CENTER * 1.9 && treeWidth > 0) { 
                scaleFactor = (SVG_WIDTH_CENTER * 1.9) / treeWidth;
            }
            visualNodes.forEach(node => {
                if(node.x !== undefined) node.x = desiredCenterX + (node.x - currentCenterX) * scaleFactor;
            });
        }
    }
    return { visualNodes, visualEdges };
}


function addStep(
  localSteps: TreeAlgorithmStep[], graph: AVLTreeGraph, line: number | null, message: string,
  activeNodeIds: string[] = [], specialColors: Record<string, string> = {}, pathNodeIds: string[] = [],
  rotationType?: TreeAlgorithmStep['rotationType'], unbalancedNodeIdForVisual?: string | null,
  nodesInvolvedInRotation?: (string|null)[]
) {
  const { visualNodes, visualEdges } = mapAVLToVisual(graph, activeNodeIds, pathNodeIds, specialColors, unbalancedNodeIdForVisual);
  const currentPathValues = pathNodeIds
      .map(id => graph.nodesMap.get(id)?.value)
      .filter(value => value !== undefined && value !== null) as (string | number)[];

  localSteps.push({
    nodes: visualNodes, edges: visualEdges,
    traversalPath: currentPathValues,
    currentLine: line, message,
    currentProcessingNodeId: activeNodeIds.length > 0 ? activeNodeIds[0] : null,
    unbalancedNodeId: unbalancedNodeIdForVisual, rotationType, 
    nodesInvolvedInRotation: nodesInvolvedInRotation?.filter(id => id !== null) as string[] | undefined,
    auxiliaryData: { finalGraphState: getFinalAVLGraph(graph) }
  });
}


// --- Rotation Functions ---
function rotateRight(graph: AVLTreeGraph, yId: string, localSteps: TreeAlgorithmStep[], path:(string|number)[]): string {
  const y = getNode(graph, yId)!; const xId = y.leftId!; const x = getNode(graph, xId)!;
  const T2Id = x.rightId; const parentOfYId = y.parentId;
  const involvedNodes = [yId, xId, T2Id].filter(id => id !== null) as string[];
  addStep(localSteps, graph, RBT_LINE_MAP.rotateRightStart, `Rotate Right around Node ${y.value}. Pivot Y=${y.value}, New Root X=${x.value}. Path: ${path.map(p => typeof p === 'string' ? graph.nodesMap.get(p)?.value : p).join('->')}`, [yId, xId], {[yId]: NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW, [xId]: NODE_COLORS_AVL.ACTIVE_COMPARISON}, path.map(String), 'RR', yId, involvedNodes);
  
  y.leftId = T2Id; if (T2Id) getNode(graph,T2Id)!.parentId = yId;
  x.rightId = yId; y.parentId = xId;
  x.parentId = parentOfYId;
  if (!parentOfYId) graph.rootId = xId;
  else { const parentOfY = getNode(graph,parentOfYId)!; if (parentOfY.leftId === yId) parentOfY.leftId = xId; else parentOfY.rightId = xId; }
  
  graph.nodesMap.set(yId, y); graph.nodesMap.set(xId, x); if(T2Id) graph.nodesMap.set(T2Id, getNode(graph, T2Id)!);
  if(parentOfYId) graph.nodesMap.set(parentOfYId, getNode(graph, parentOfYId)!);

  addStep(localSteps, graph, RBT_LINE_MAP.rotateRightUpdatePointers, `Pointers updated for Right Rotation.`, [xId, yId], {}, path.map(String), undefined, undefined, involvedNodes);
  updateHeightAndBF(graph, yId, localSteps, path.map(String), "  Post-Rotation: "); updateHeightAndBF(graph, xId, localSteps, path.map(String), "  Post-Rotation: ");
  addStep(localSteps, graph, RBT_LINE_MAP.rotateRightReturnX, `Rotate Right complete. New subtree root: ${x.value}.`, [xId], {}, path.map(String), undefined, undefined, involvedNodes);
  return xId;
}

function rotateLeft(graph: AVLTreeGraph, xId: string, localSteps: TreeAlgorithmStep[], path:(string|number)[]): string {
  const x = getNode(graph,xId)!; const yId = x.rightId!; const y = getNode(graph,yId)!;
  const T2Id = y.leftId; const parentOfXId = x.parentId;
  const involvedNodes = [xId, yId, T2Id].filter(id => id !== null) as string[];
  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftStart, `Rotate Left around Node ${x.value}. Pivot X=${x.value}, New Root Y=${y.value}. Path: ${path.map(p => typeof p === 'string' ? graph.nodesMap.get(p)?.value : p).join('->')}`, [xId, yId], {[xId]: NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW, [yId]: NODE_COLORS_AVL.ACTIVE_COMPARISON}, path.map(String), 'LL', xId, involvedNodes);

  x.rightId = T2Id; if (T2Id) getNode(graph,T2Id)!.parentId = xId;
  y.leftId = xId; x.parentId = yId;
  y.parentId = parentOfXId;
  if (!parentOfXId) graph.rootId = yId;
  else { const parentOfX = getNode(graph,parentOfXId)!; if (parentOfX.leftId === xId) parentOfX.leftId = yId; else parentOfX.rightId = yId; }

  graph.nodesMap.set(xId, x); graph.nodesMap.set(yId, y); if(T2Id) graph.nodesMap.set(T2Id, getNode(graph, T2Id)!);
  if(parentOfXId) graph.nodesMap.set(parentOfXId, getNode(graph, parentOfXId)!);

  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftUpdatePointers, `Pointers updated for Left Rotation.`, [xId, yId], {}, path.map(String), undefined, undefined, involvedNodes);
  updateHeightAndBF(graph, xId, localSteps, path.map(String), "  Post-Rotation: "); updateHeightAndBF(graph, yId, localSteps, path.map(String), "  Post-Rotation: ");
  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftReturnY, `Rotate Left complete. New subtree root: ${y.value}.`, [yId], {}, path.map(String), undefined, undefined, involvedNodes);
  return yId;
}

// --- Insert ---
function insertRec(graph: AVLTreeGraph, nodeId: string | null, value: number, parentId: string | null, path: string[], localSteps: TreeAlgorithmStep[]): string {
  const currentPathValuesForMsg = path.map(pId => graph.nodesMap.get(pId)?.value ?? '?');
  const currentNodeValForMsg = nodeId ? graph.nodesMap.get(nodeId)?.value : 'NIL (new node position)';
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecFunc, `InsertRec(${value}) at ${currentNodeValForMsg}. Path: ${currentPathValuesForMsg.join('->')}`, nodeId ? [nodeId] : [], {}, path);
  
  if (!nodeId) {
    const newNodeId = generateAvlNodeId(value);
    graph.nodesMap.set(newNodeId, createNode(newNodeId, value, parentId));
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecNewNode, `Created new node ${value}. H=0, BF=0.`, [newNodeId], {[newNodeId]:NODE_COLORS_AVL.NEWLY_INSERTED}, [...path, newNodeId]);
    return newNodeId;
  }

  const node = graph.nodesMap.get(nodeId)!;
  path.push(nodeId); 

  if (value < node.value!) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecGoLeft, `Value ${value} < node ${node.value}. Go left.`, [nodeId], {}, path);
    node.leftId = insertRec(graph, node.leftId, value, nodeId, path, localSteps);
  } else if (value > node.value!) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecGoRight, `Value ${value} > node ${node.value}. Go right.`, [nodeId], {}, path);
    node.rightId = insertRec(graph, node.rightId, value, nodeId, path, localSteps);
  } else {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecDuplicate, `Value ${value} already exists. No insertion.`, [nodeId], {[nodeId]:NODE_COLORS_AVL.FOUND_HIGHLIGHT}, path);
    path.pop(); 
    return nodeId; 
  }
  graph.nodesMap.set(nodeId, node); 

  updateHeightAndBF(graph, nodeId, localSteps, path, `Node ${node.value}: `);
  const balance = node.balanceFactor;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecGetBalance, `Node ${node.value} Balance Factor: ${balance}.`, [nodeId], {}, path, undefined, balance < -1 || balance > 1 ? nodeId : null);

  let newSubtreeRootId = nodeId;
  const currentPathForRotationMessage = path.map(pId => graph.nodesMap.get(pId)?.value ?? '?');

  if (balance > 1) { 
    const leftChild = graph.nodesMap.get(node.leftId!)!;
    addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertRecCheckLL, `Imbalance at ${node.value} (BF=${balance}). Left child ${leftChild.value}. Check LL or LR.`,[nodeId, leftChild.id],{},path,undefined,nodeId);
    if (value < leftChild.value!) { 
        addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertRecActionLL, `LL Case detected at ${node.value}. Perform Right Rotation.`,[nodeId, leftChild.id],{},path,'RR',nodeId, [nodeId, node.leftId!, leftChild.leftId].filter(id=>id) as string[]);
        newSubtreeRootId = rotateRight(graph, nodeId, localSteps, currentPathForRotationMessage);
    } else { 
        addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertRecActionLR_Part1, `LR Case detected at ${node.value}. Rotate Left on Left Child ${leftChild.value}.`,[nodeId, leftChild.id],{},path,'LR',nodeId, [nodeId, node.leftId!, leftChild.rightId].filter(id=>id) as string[]);
        node.leftId = rotateLeft(graph, node.leftId!, localSteps, currentPathForRotationMessage);
        updateHeightAndBF(graph, node.leftId!, localSteps, path, `After LR part 1, Left Child ${graph.nodesMap.get(node.leftId!)?.value}: `); updateHeightAndBF(graph, nodeId, localSteps, path, `After LR part 1, Node ${node.value}: `);
        addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertRecActionLR_Part2, `LR Case: Now Rotate Right on ${node.value}.`,[nodeId, node.leftId!],{},path,'RR',nodeId, [nodeId, node.leftId!, graph.nodesMap.get(node.leftId!)?.leftId].filter(id=>id) as string[]);
        newSubtreeRootId = rotateRight(graph, nodeId, localSteps, currentPathForRotationMessage);
    }
  } else if (balance < -1) { 
    const rightChild = graph.nodesMap.get(node.rightId!)!;
    addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertRecCheckRR, `Imbalance at ${node.value} (BF=${balance}). Right child ${rightChild.value}. Check RR or RL.`,[nodeId, rightChild.id],{},path,undefined,nodeId);
    if (value > rightChild.value!) { 
        addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertRecActionRR, `RR Case detected at ${node.value}. Perform Left Rotation.`,[nodeId, rightChild.id],{},path,'LL',nodeId, [nodeId, node.rightId!, rightChild.rightId].filter(id=>id) as string[]);
        newSubtreeRootId = rotateLeft(graph, nodeId, localSteps, currentPathForRotationMessage);
    } else { 
        addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertRecActionRL_Part1, `RL Case detected at ${node.value}. Rotate Right on Right Child ${rightChild.value}.`,[nodeId, rightChild.id],{},path,'RL',nodeId, [nodeId, node.rightId!, rightChild.leftId].filter(id=>id) as string[]);
        node.rightId = rotateRight(graph, node.rightId!, localSteps, currentPathForRotationMessage);
        updateHeightAndBF(graph, node.rightId!, localSteps, path, `After RL part 1, Right Child ${graph.nodesMap.get(node.rightId!)?.value}: `); updateHeightAndBF(graph, nodeId, localSteps, path, `After RL part 1, Node ${node.value}: `);
        addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertRecActionRL_Part2, `RL Case: Now Rotate Left on ${node.value}.`,[nodeId, node.rightId!],{},path,'LL',nodeId, [nodeId, node.rightId!, graph.nodesMap.get(node.rightId!)?.rightId].filter(id=>id) as string[]);
        newSubtreeRootId = rotateLeft(graph, nodeId, localSteps, currentPathForRotationMessage);
    }
  }
  path.pop();
  const finalSubtreeRootNodeVal = graph.nodesMap.get(newSubtreeRootId)?.value ?? 'NIL';
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertRecReturnNode, `Return from InsertRec for node ${node.value}. Subtree root after balancing: ${finalSubtreeRootNodeVal}.`, [newSubtreeRootId], {}, path);
  return newSubtreeRootId;
}

// --- Search (standard BST search) ---
function searchRec(graph: AVLTreeGraph, nodeId: string | null, value: number, path: string[], localSteps: TreeAlgorithmStep[]): string | null {
  const currentNodeVal = nodeId ? graph.nodesMap.get(nodeId)?.value : null;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchRecFunc, `SearchRec(${value}) at ${currentNodeVal ?? 'NIL'}. Path: ${path.map(pId => graph.nodesMap.get(pId)?.value).join('->')}`, nodeId ? [nodeId] : [], {}, path);

  if (!nodeId || !currentNodeVal) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchBaseNull, `Value ${value} not found (reached NIL).`, [], {}, path);
    return null;
  }
  path.push(nodeId);
  
  if (value === currentNodeVal) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchBaseFound, `Value ${value} FOUND at node ${currentNodeVal}.`, [nodeId], {[nodeId]: NODE_COLORS_AVL.FOUND_HIGHLIGHT}, path);
    path.pop();
    return nodeId;
  }

  let result: string | null = null;
  if (value < currentNodeVal) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchGoLeft, `Value ${value} < node ${currentNodeVal}. Go left.`, [nodeId], {}, path);
    result = searchRec(graph, graph.nodesMap.get(nodeId)!.leftId, value, path, localSteps);
  } else {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.searchGoRight, `Value ${value} > node ${currentNodeVal}. Go right.`, [nodeId], {}, path);
    result = searchRec(graph, graph.nodesMap.get(nodeId)!.rightId, value, path, localSteps);
  }
  path.pop();
  return result;
}

// --- Delete (Conceptual BST delete + first rebalance) ---
function minValueNode(graph: AVLTreeGraph, nodeId: string, localSteps: TreeAlgorithmStep[], path: string[]): string {
  let currentId = nodeId;
  path.push(currentId);
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecFindSuccessor, `Finding successor: current is ${graph.nodesMap.get(currentId)?.value}, path: ${path.map(id=>graph.nodesMap.get(id)?.value).join('->')}`, [currentId], {}, path);
  while (graph.nodesMap.get(currentId)!.leftId) {
    currentId = graph.nodesMap.get(currentId)!.leftId!;
    path.push(currentId);
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecFindSuccessor, `Moved left to ${graph.nodesMap.get(currentId)?.value}. Path: ${path.map(id=>graph.nodesMap.get(id)?.value).join('->')}`, [currentId], {}, path);
  }
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecFindSuccessor, `Successor found: ${graph.nodesMap.get(currentId)?.value}`, [currentId], {[currentId]: NODE_COLORS_AVL.INORDER_SUCCESSOR}, path);
  return currentId;
}

function deleteRec(graph: AVLTreeGraph, nodeId: string | null, value: number, path: string[], localSteps: TreeAlgorithmStep[]): string | null {
  if (!nodeId) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecBaseNull, `Value ${value} not found for deletion (reached NIL).`, [], {}, path);
    return null;
  }
  
  const node = graph.nodesMap.get(nodeId)!;
  path.push(nodeId);
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecFunc, `DeleteRec(${value}) at node ${node.value}. Path: ${path.map(id=>graph.nodesMap.get(id)?.value).join('->')}`, [nodeId], {}, path);

  let newCurrentNodeId = nodeId; 

  if (value < node.value) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecGoLeft, `Value ${value} < node ${node.value}. Go left.`, [nodeId], {}, path);
    node.leftId = deleteRec(graph, node.leftId, value, path, localSteps);
    if(node.leftId) graph.nodesMap.get(node.leftId)!.parentId = nodeId;
  } else if (value > node.value) {
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecGoRight, `Value ${value} > node ${node.value}. Go right.`, [nodeId], {}, path);
    node.rightId = deleteRec(graph, node.rightId, value, path, localSteps);
    if(node.rightId) graph.nodesMap.get(node.rightId)!.parentId = nodeId;
  } else { 
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecNodeFound, `Node to delete (${value}) found.`, [nodeId], {[nodeId]: NODE_COLORS_AVL.TO_BE_DELETED}, path);
    if (!node.leftId || !node.rightId) { 
      const tempId = node.leftId || node.rightId;
      addStep(localSteps, graph, node.leftId ? AVL_TREE_LINE_MAP.deleteRecHandleNoRightChild : AVL_TREE_LINE_MAP.deleteRecHandleNoLeftChild, `Node has 0 or 1 child. Replace with ${tempId ? graph.nodesMap.get(tempId)?.value : 'NIL'}.`, [nodeId, tempId || 'NIL'].filter(id=>id!=='NIL') as string[], {[nodeId]:NODE_COLORS_AVL.TO_BE_DELETED});
      
      if (tempId) { 
        const childNode = graph.nodesMap.get(tempId)!;
        childNode.parentId = node.parentId;
        graph.nodesMap.set(tempId, childNode);
      }
      graph.nodesMap.delete(nodeId); 
      newCurrentNodeId = tempId!; 
    } else { 
      const successorPath: string[] = [];
      const successorId = minValueNode(graph, node.rightId!, localSteps, successorPath);
      node.value = graph.nodesMap.get(successorId)!.value; 
      addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecCopySuccessor, `Copied successor ${node.value} to node. Path to successor: ${successorPath.map(id=>graph.nodesMap.get(id)?.value).join('->')}`, [nodeId, successorId], {[nodeId]: NODE_COLORS_AVL.TO_BE_DELETED, [successorId]: NODE_COLORS_AVL.INORDER_SUCCESSOR}, path);
      node.rightId = deleteRec(graph, node.rightId, node.value, path, localSteps);
      if(node.rightId) graph.nodesMap.get(node.rightId)!.parentId = nodeId;
      newCurrentNodeId = nodeId; 
    }
  }
  if (graph.nodesMap.has(nodeId)) graph.nodesMap.set(nodeId, node); 

  if (!newCurrentNodeId) { 
    path.pop(); 
    addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecReturnNode, `Returned null (node deleted). Path: ${path.map(pId => graph.nodesMap.get(pId)?.value).join('->')}`, [], {}, path);
    return null; 
  }
  
  updateHeightAndBF(graph, newCurrentNodeId, localSteps, path, `After BST delete, Node ${graph.nodesMap.get(newCurrentNodeId)!.value}: `);
  const rebalancedNode = graph.nodesMap.get(newCurrentNodeId)!;
  const balance = rebalancedNode.balanceFactor;
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecAfterDeleteGetBalance, `Node ${rebalancedNode.value} Balance Factor: ${balance}. Checking rebalance.`, [newCurrentNodeId], {}, path, undefined, balance < -1 || balance > 1 ? newCurrentNodeId : null);
  
  const currentPathForRotationMessage = path.map(pId => graph.nodesMap.get(pId)?.value ?? '?');
  if (balance > 1) { 
    const leftChild = graph.nodesMap.get(rebalancedNode.leftId!)!;
    if (getBalanceFactor(leftChild) >= 0) { 
        newCurrentNodeId = rotateRight(graph, newCurrentNodeId, localSteps, currentPathForRotationMessage);
    } else { 
        rebalancedNode.leftId = rotateLeft(graph, leftChild.id, localSteps, currentPathForRotationMessage);
        updateHeightAndBF(graph, rebalancedNode.leftId!, localSteps, path); updateHeightAndBF(graph, newCurrentNodeId, localSteps, path);
        newCurrentNodeId = rotateRight(graph, newCurrentNodeId, localSteps, currentPathForRotationMessage);
    }
  } else if (balance < -1) { 
    const rightChild = graph.nodesMap.get(rebalancedNode.rightId!)!;
    if (getBalanceFactor(rightChild) <= 0) { 
        newCurrentNodeId = rotateLeft(graph, newCurrentNodeId, localSteps, currentPathForRotationMessage);
    } else { 
        rebalancedNode.rightId = rotateRight(graph, rightChild.id, localSteps, currentPathForRotationMessage);
        updateHeightAndBF(graph, rebalancedNode.rightId!, localSteps, path); updateHeightAndBF(graph, newCurrentNodeId, localSteps, path);
        newCurrentNodeId = rotateLeft(graph, newCurrentNodeId, localSteps, currentPathForRotationMessage);
    }
  }
  path.pop();
  const finalNodeVal = newCurrentNodeId ? graph.nodesMap.get(newCurrentNodeId)?.value : 'NIL';
  addStep(localSteps, graph, AVL_TREE_LINE_MAP.deleteRecReturnNode, `Return from DeleteRec for node ${finalNodeVal}. Path: ${path.map(pId => graph.nodesMap.get(pId)?.value).join('->')}`, newCurrentNodeId ? [newCurrentNodeId] : [], {}, path);
  return newCurrentNodeId;
}


export const generateAVLSteps = (
  operation: AVLOperationType, initialValuesString?: string, valueToProcess?: number, currentGraphState?: AVLTreeGraph
): TreeAlgorithmStep[] => { 
  const localSteps: TreeAlgorithmStep[] = []; 
  
  let graph: AVLTreeGraph;
  if (currentGraphState && operation !== 'build') {
    graph = { 
      rootId: currentGraphState.rootId, 
      nodesMap: new Map(Array.from(currentGraphState.nodesMap.entries()).map(([id, node]) => [id, {...node}])),
    };
    globalAvlNodeIdCounter = Array.from(graph.nodesMap.keys()).reduce((max, id) => {
        const numPart = id.split('-').pop();
        return Math.max(max, numPart ? parseInt(numPart,10) : 0);
    }, 0) + 1;
  } else {
    graph = createInitialAVLTreeGraph();
    globalAvlNodeIdCounter = 0;
  }
  
  if (operation === 'build') {
    graph = createInitialAVLTreeGraph(); 
    const values = initialValuesString ? initialValuesString.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : [];
    addStep(localSteps,graph,AVL_TREE_LINE_MAP.constructor,`Building AVL Tree from: [${values.join(',')}]`);
    if (values.length > 0) {
        values.forEach(val => { 
          const path: string[] = [];
          graph.rootId = insertRec(graph,graph.rootId,val,null,path,localSteps);
          if (graph.rootId) graph.nodesMap.get(graph.rootId)!.parentId = null;
        });
        addStep(localSteps,graph,AVL_TREE_LINE_MAP.insertFuncEnd,`Build complete. Root: ${getNode(graph,graph.rootId)?.value ?? 'null'}. Final tree shown.`);
    } else {
        addStep(localSteps,graph,AVL_TREE_LINE_MAP.constructor,`Build complete: Empty tree (no values provided).`);
    }
  } else if (valueToProcess !== undefined) {
    const opDisplay = operation.charAt(0).toUpperCase() + operation.slice(1);
    addStep(localSteps, graph, null, `Operation: ${opDisplay}(${valueToProcess})`);
    const path: string[] = [];
    let duplicate = false;
    let valueFound = false;

    if (operation === 'insert') {
        const initialNodeCount = graph.nodesMap.size;
        graph.rootId = insertRec(graph, graph.rootId, valueToProcess, null, path, localSteps);
        if (graph.rootId) graph.nodesMap.get(graph.rootId)!.parentId = null;
        duplicate = graph.nodesMap.size === initialNodeCount && localSteps.some(step => step.message?.includes("already exists"));
        if (duplicate) {
          addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertFuncEnd, `Value ${valueToProcess} already exists. No insertion performed. Final tree shown.`, [graph.rootId!], {[graph.nodesMap.get(searchRec(graph, graph.rootId, valueToProcess, [], [])!)!.id]: NODE_COLORS_AVL.FOUND_HIGHLIGHT});
        } else {
          addStep(localSteps, graph, AVL_TREE_LINE_MAP.insertFuncEnd, `Insert operation for ${valueToProcess} complete. Root: ${getNode(graph, graph.rootId)?.value ?? 'null'}. Final tree shown.`, [graph.rootId!]);
        }
    } else if (operation === 'delete') {
        const nodeToDelete = searchRec(graph, graph.rootId, valueToProcess, [], []); // Check if node exists before delete
        if(nodeToDelete){
            graph.rootId = deleteRec(graph, graph.rootId, valueToProcess, path, localSteps);
            if (graph.rootId) graph.nodesMap.get(graph.rootId)!.parentId = null;
            addStep(localSteps,graph,AVL_TREE_LINE_MAP.deleteFuncEnd, `Delete operation for ${valueToProcess} complete. Root: ${getNode(graph,graph.rootId)?.value ?? 'null'}. Final tree shown.`, graph.rootId ? [graph.rootId] : []);
        } else {
             addStep(localSteps,graph,AVL_TREE_LINE_MAP.deleteFuncEnd, `Value ${valueToProcess} not found. Delete operation cannot proceed.`, [], {}, path);
        }
    } else if (operation === 'search') {
        const foundNodeId = searchRec(graph, graph.rootId, valueToProcess, path, localSteps);
        if (foundNodeId) {
             addStep(localSteps,graph,AVL_TREE_LINE_MAP.searchFuncEnd, `Search for ${valueToProcess} complete. Value FOUND.`, [foundNodeId], {[foundNodeId]: NODE_COLORS_AVL.FOUND_HIGHLIGHT});
        } else {
             addStep(localSteps,graph,AVL_TREE_LINE_MAP.searchFuncEnd, `Search for ${valueToProcess} complete. Value NOT FOUND.`);
        }
    }
  } else if (operation === 'structure') {
    addStep(localSteps, graph, null, "Displaying current AVL tree structure.");
  }
  
  if (localSteps.length > 0) {
    localSteps[localSteps.length - 1].auxiliaryData!.finalGraphState = getFinalAVLGraph(graph);
  } else if (operation !== 'structure') { 
     addStep(localSteps, graph, null, "Operation resulted in no changes or no steps.", [], {}, [], undefined, undefined, []);
     if (localSteps.length > 0) localSteps[0].auxiliaryData!.finalGraphState = getFinalAVLGraph(graph);
  }
  return localSteps;
};

export const createInitialAVLTreeGraph = (): AVLTreeGraph => {
  globalAvlNodeIdCounter = 0;
  return { rootId: null, nodesMap: new Map() };
};

export const getFinalAVLGraph = (graph: AVLTreeGraph): AVLTreeGraph => {
  const newNodesMap = new Map<string, AVLNodeInternal>();
  graph.nodesMap.forEach((node, id) => newNodesMap.set(id, {...node})); 
  return { rootId: graph.rootId, nodesMap: newNodesMap };
};

export const AVL_TREE_LINE_MAP = {
  // Constructor and Helpers
  constructor: 1, nodeDef: 2, 
  getHeightFunc: 10, getHeightBase: 11, getHeightReturn: 12,
  updateHeightFunc: 13, updateHeightCalc: 14, 
  getBalanceFunc: 15, getBalanceBase: 16, getBalanceCalc: 17,
  
  // Rotations
  rotateLeftFunc: 20, rotateLeftUpdatePointers: 22, /* Simplified mapping */ rotateLeftUpdateHeights: 28, rotateLeftReturnY: 29,
  rotateRightFunc: 30, rotateRightUpdatePointers: 32, /* Simplified */ rotateRightUpdateHeights: 38, rotateRightReturnX: 39,
  
  // Insert
  insertFunc: 40, insertCallRec: 41,
  insertRecFunc: 42, insertRecBaseCase: 43, insertRecNewNode: 44,
  insertRecGoLeft: 45, insertRecAssignLeft: 46, insertRecGoRight: 47, insertRecAssignRight: 48, insertRecDuplicate: 49,
  insertRecUpdateHeight: 50, insertRecGetBalance: 51,
  insertRecCheckLL: 52, insertRecActionLL: 53, 
  insertRecCheckRR: 54, insertRecActionRR: 55, 
  insertRecActionLR_Part1: 56, insertRecActionLR_RotateLeft: 57, insertRecActionLR_Part2:57, insertRecActionLR_RotateRight: 58, // Combined steps conceptualy for LR/RL
  insertRecActionRL_Part1: 59, insertRecActionRL_RotateRight: 60, insertRecActionRL_Part2:60, insertRecActionRL_RotateLeft: 61,
  insertRecReturnNode: 62, insertFuncEnd: 63,

  // Search
  searchFunc: 70, searchCallRec: 70, 
  searchRecFunc: 71, searchBaseNull: 72, searchBaseFound: 73,
  searchGoLeft: 74, searchGoRight: 75, searchFuncEnd: 75, // Last possible actual code line for search logic

  // Delete
  deleteFunc: 80, deleteCallRec: 81, deleteRecFunc: 82, deleteRecBaseNull: 83,
  deleteRecGoLeft: 84, deleteRecGoRight: 85, deleteRecNodeFound: 86,
  deleteRecHandleNoLeftChild: 87, deleteRecHandleNoRightChild: 88,
  deleteRecHandleTwoChildren: 89, deleteRecFindSuccessor: 90, deleteRecCopySuccessor: 91,
  deleteRecAfterDeleteUpdateHeight: 93, deleteRecAfterDeleteGetBalance: 94,
  deleteRecRebalanceCheck: 95, // General check for any rebalance case
  deleteRecReturnNode: 96, deleteFuncEnd: 96, // Simplified end for delete
};


// Placeholder for RBT line map until it's fully defined locally in RBT files
// This is to prevent breaking current file if RBT_LINE_MAP was expected from here before.
export const RBT_LINE_MAP = { 
    rotateLeftStart: 32, rotateLeftUpdatePointers: 33, rotateLeftEnd: 40,
    rotateRightStart: 41, rotateRightUpdatePointers: 42, rotateRightEnd: 49,
    // Add other RBT specific conceptual lines if needed by current AVL logic as placeholders
};

