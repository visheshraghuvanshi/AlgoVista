
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, RBTNodeInternal, RBTreeGraph } from './types'; // Local import
import { RBT_NODE_COLORS, RBT_TEXT_COLORS } from './rbt-node-colors';

const RED = true;
const BLACK = false;
export const NIL_ID = 'NIL_SENTINEL'; // More descriptive NIL ID

let nodeIdCounter = 0;
const generateNodeId = (value: number) => `rbt-node-${value}-${nodeIdCounter++}`;

export const RBT_LINE_MAP = {
  // Insert & Fixup
  insertFuncStart: 1,
  bstInsertLoop: 2,
  bstInsertGoLeft: 3,
  bstInsertGoRight: 4,
  bstInsertSetParent: 5,
  newNodeSetup: 6,
  callInsertFixup: 7,
  insertFuncEnd: 8,

  fixupLoopStart: 9, 
  fixupParentIsLeftChild: 10,
  fixupUncleIsRightChild: 11,
  fixupCase1UncleRed: 12, 
  fixupCase1RecolorParent: 13,
  fixupCase1RecolorUncle: 14,
  fixupCase1RecolorGrandparent: 15,
  fixupCase1MoveZUp: 16,
  fixupCase2Triangle: 17, 
  fixupCase2MoveZToParent: 18,
  fixupCase2RotateParent: 19,
  fixupCase3LinePart1: 20, 
  fixupCase3RecolorParent: 21,
  fixupCase3RecolorGrandparent: 22,
  fixupCase3RotateGrandparent: 23,
  fixupParentIsRightChild: 24, 
  fixupRootRecolor: 29, 
  fixupLoopEnd: 30,
  fixupFuncEnd: 31,

  // Rotations
  rotateLeftStart: 32,
  rotateLeftSetY: 33,
  rotateLeftXRightToYLeft: 34,
  rotateLeftYLeftParent: 35,
  rotateLeftYParentToXParent: 36,
  rotateLeftUpdateRootOrChild: 37,
  rotateLeftYLeftToX: 38,
  rotateLeftXParentToY: 39,
  rotateLeftEnd: 40,

  rotateRightStart: 41, 
  rotateRightSetX: 42,
  rotateRightYLeftToXRight: 43,
  rotateRightXRightParent: 44,
  rotateRightXParentToYParent: 45,
  rotateRightUpdateRootOrChild: 46,
  rotateRightXRightToY: 47,
  rotateRightYParentToX: 48,
  rotateRightEnd: 49,

  // Search 
  searchFuncStart: 50,
  searchLoopStart: 51,
  searchNodeCompare: 52,
  searchValueFound: 53,
  searchGoLeft: 54,
  searchGoRight: 55,
  searchValueNotFound: 56,
  searchFuncEnd: 57,

  // Delete & Fixup (Conceptual lines for high-level steps)
  deleteFuncStart: 58,
  deleteFindNodeZ: 59,
  deleteIdentifyYAndX: 60, 
  deleteTransplant: 61,    
  deleteCheckYColorCallFixup: 62, 
  deleteFuncEnd: 63,

  deleteFixupFuncStart: 64,
  deleteFixupLoop: 65,      
  deleteFixupLeftChildCase1: 66, 
  deleteFixupLeftChildCase2: 67, 
  deleteFixupLeftChildCase3: 68, 
  deleteFixupLeftChildCase4: 69, 
  deleteFixupRightChildCases: 70, 
  deleteFixupSetXBlack: 71, 
  deleteFixupFuncEnd: 72,
};


function createNode(id: string, value: number | null, color: boolean, parentId: string | null, leftId: string | null, rightId: string | null): RBTNodeInternal {
  return { id, value, color, parentId, leftId, rightId };
}

function isRed(nodeId: string | null, nodesMap: Map<string, RBTNodeInternal>, nilNodeId: string): boolean {
  if (!nodeId || nodeId === nilNodeId) return BLACK; 
  return nodesMap.get(nodeId)!.color === RED;
}

function setColor(nodeId: string | null, color: boolean, nodesMap: Map<string, RBTNodeInternal>, nilNodeId: string) {
  if (nodeId && nodeId !== nilNodeId) {
    const node = nodesMap.get(nodeId)!;
    node.color = color;
    nodesMap.set(nodeId, node);
  }
}

function addStep(
  steps: TreeAlgorithmStep[],
  graph: RBTreeGraph,
  line: number | null,
  message: string,
  activeNodeIds: string[] = [],
  specialHighlightColors: Record<string, string> = {},
  currentPathNodeIds: string[] = []
) {
  const visualNodes = mapRBTNodesToVisual(graph.nodesMap, graph.rootId, graph.nilNodeId, activeNodeIds, specialHighlightColors, currentPathNodeIds);
  steps.push({
    nodes: visualNodes,
    edges: buildEdges(visualNodes, graph.nilNodeId),
    traversalPath: currentPathNodeIds.map(id => graph.nodesMap.get(id)?.value ?? id),
    currentLine: line,
    message,
    currentProcessingNodeId: activeNodeIds.length > 0 ? activeNodeIds[0] : null,
    auxiliaryData: { finalGraphState: getFinalRBTreeGraph(graph) } // Pass full graph state for ref update
  });
}

// --- Rotation Functions ---
function rotateLeft(graph: RBTreeGraph, xId: string, localSteps: TreeAlgorithmStep[]) {
  const x = graph.nodesMap.get(xId)!;
  const yId = x.rightId;
  if (!yId || yId === graph.nilNodeId) return; 
  const y = graph.nodesMap.get(yId)!;

  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftStart, `Rotate Left around ${x.value}`, [xId, yId]);

  x.rightId = y.leftId;
  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftXRightToYLeft, `x.right = y.left (${y.leftId !== graph.nilNodeId ? graph.nodesMap.get(y.leftId!)?.value : 'NIL'})`, [xId, yId]);
  if (y.leftId !== graph.nilNodeId) {
    graph.nodesMap.get(y.leftId!)!.parentId = xId;
    addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftYLeftParent, `y.left.parent = x`, [xId, yId, y.leftId!]);
  }

  y.parentId = x.parentId;
  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftYParentToXParent, `y.parent = x.parent (${x.parentId !== graph.nilNodeId ? graph.nodesMap.get(x.parentId!)?.value : 'ROOT_PARENT'})`, [xId, yId]);

  if (x.parentId === graph.nilNodeId) {
    graph.rootId = yId;
  } else if (xId === graph.nodesMap.get(x.parentId!)!.leftId) {
    graph.nodesMap.get(x.parentId!)!.leftId = yId;
  } else {
    graph.nodesMap.get(x.parentId!)!.rightId = yId;
  }
  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftUpdateRootOrChild, `Update parent of y. Root is now ${graph.rootId !== graph.nilNodeId ? graph.nodesMap.get(graph.rootId!)?.value : 'NIL'}`, [yId]);


  y.leftId = xId;
  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftYLeftToX, `y.left = x`, [xId, yId]);
  x.parentId = yId;
  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftXParentToY, `x.parent = y`, [xId, yId]);
  
  graph.nodesMap.set(xId, x);
  graph.nodesMap.set(yId, y);
  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftEnd, `Rotate Left around ${x.value} complete. New subtree root: ${y.value}`, [yId, xId]);
}

function rotateRight(graph: RBTreeGraph, yId: string, localSteps: TreeAlgorithmStep[]) {
  const y = graph.nodesMap.get(yId)!;
  const xId = y.leftId;
  if (!xId || xId === graph.nilNodeId) return;
  const x = graph.nodesMap.get(xId)!;
  
  addStep(localSteps, graph, RBT_LINE_MAP.rotateRightStart, `Rotate Right around ${y.value}`, [yId, xId]);

  y.leftId = x.rightId;
  addStep(localSteps, graph, RBT_LINE_MAP.rotateRightYLeftToXRight, `y.left = x.right (${x.rightId !== graph.nilNodeId ? graph.nodesMap.get(x.rightId!)?.value : 'NIL'})`, [xId, yId]);
  if (x.rightId !== graph.nilNodeId) {
    graph.nodesMap.get(x.rightId!)!.parentId = yId;
     addStep(localSteps, graph, RBT_LINE_MAP.rotateRightXRightParent, `x.right.parent = y`, [xId, yId, x.rightId!]);
  }
  x.parentId = y.parentId;
  addStep(localSteps, graph, RBT_LINE_MAP.rotateRightXParentToYParent, `x.parent = y.parent (${y.parentId !== graph.nilNodeId ? graph.nodesMap.get(y.parentId!)?.value : 'ROOT_PARENT'})`, [xId, yId]);
  if (y.parentId === graph.nilNodeId) {
    graph.rootId = xId;
  } else if (yId === graph.nodesMap.get(y.parentId!)!.rightId) {
    graph.nodesMap.get(y.parentId!)!.rightId = xId;
  } else {
    graph.nodesMap.get(y.parentId!)!.leftId = xId;
  }
  addStep(localSteps, graph, RBT_LINE_MAP.rotateRightUpdateRootOrChild, `Update parent of x. Root is now ${graph.rootId !== graph.nilNodeId ? graph.nodesMap.get(graph.rootId!)?.value : 'NIL'}`, [xId]);

  x.rightId = yId;
  addStep(localSteps, graph, RBT_LINE_MAP.rotateRightXRightToY, `x.right = y`, [xId, yId]);
  y.parentId = xId;
  addStep(localSteps, graph, RBT_LINE_MAP.rotateRightYParentToX, `y.parent = x`, [xId, yId]);

  graph.nodesMap.set(yId, y);
  graph.nodesMap.set(xId, x);
  addStep(localSteps, graph, RBT_LINE_MAP.rotateRightEnd, `Rotate Right around ${y.value} complete. New subtree root: ${x.value}`, [xId, yId]);
}


// --- Insert and Fixup ---
function insertFixup(graph: RBTreeGraph, zId: string, localSteps: TreeAlgorithmStep[]) {
  let currentZId = zId;
  addStep(localSteps, graph, RBT_LINE_MAP.callInsertFixup, `Called insertFixup for node ${graph.nodesMap.get(currentZId)?.value}`, [currentZId]);

  while (isRed(graph.nodesMap.get(currentZId)!.parentId, graph.nodesMap, graph.nilNodeId)) {
    const zNode = graph.nodesMap.get(currentZId)!;
    const parentNode = graph.nodesMap.get(zNode.parentId!)!;
    if (parentNode.parentId === graph.nilNodeId) { // Parent is root, which must be black, this shouldn't happen if root is black initially
      break; 
    }
    const grandparentNode = graph.nodesMap.get(parentNode.parentId!)!; 

    addStep(localSteps, graph, RBT_LINE_MAP.fixupLoopStart, `Fixup loop: z=${zNode.value}(${zNode.color === RED ? 'R' : 'B'}), parent=${parentNode.value}(${parentNode.color === RED ? 'R' : 'B'}) is RED. Grandparent=${grandparentNode.value}`, [currentZId, parentNode.id, grandparentNode.id]);

    if (zNode.parentId === grandparentNode.leftId) { 
      addStep(localSteps, graph, RBT_LINE_MAP.fixupParentIsLeftChild, `Parent ${parentNode.value} is LEFT child of grandparent ${grandparentNode.value}`, [currentZId, parentNode.id, grandparentNode.id]);
      const uncleId = grandparentNode.rightId!;
      const uncleNode = graph.nodesMap.get(uncleId)!;
      addStep(localSteps, graph, RBT_LINE_MAP.fixupUncleIsRightChild, `Uncle y=${uncleNode.value}(${uncleNode.color === RED ? 'R' : 'B'}) is RIGHT child`, [currentZId, parentNode.id, grandparentNode.id, uncleId]);

      if (isRed(uncleId, graph.nodesMap, graph.nilNodeId)) { 
        addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1UncleRed, `Case 1: Uncle ${uncleNode.value} is RED. Recolor.`, [parentNode.id, uncleId, grandparentNode.id]);
        setColor(parentNode.id, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorParent, `Recolor Parent ${parentNode.value} to BLACK.`);
        setColor(uncleId, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorUncle, `Recolor Uncle ${uncleNode.value} to BLACK.`);
        setColor(grandparentNode.id, RED, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorGrandparent, `Recolor Grandparent ${grandparentNode.value} to RED.`);
        currentZId = grandparentNode.id; addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1MoveZUp, `Move z to Grandparent ${graph.nodesMap.get(currentZId)?.value}. Loop again.`);
      } else { 
        if (currentZId === parentNode.rightId) { 
          addStep(localSteps, graph, RBT_LINE_MAP.fixupCase2Triangle, `Case 2: Uncle ${uncleNode.value} is BLACK, z ${zNode.value} is RIGHT child (triangle). Rotate parent left.`, [currentZId, parentNode.id]);
          currentZId = parentNode.id; 
          addStep(localSteps, graph, RBT_LINE_MAP.fixupCase2MoveZToParent, `Set z to parent ${graph.nodesMap.get(currentZId)?.value}.`);
          rotateLeft(graph, currentZId, localSteps);
        }
        // After case 2, z is now the original parent, and code falls through to case 3
        // Need to re-fetch nodes as pointers might have changed after rotation
        const zForCase3 = graph.nodesMap.get(currentZId)!;
        const parentForCase3 = graph.nodesMap.get(zForCase3.parentId!)!;
        const grandparentForCase3 = graph.nodesMap.get(parentForCase3.parentId!)!;

        addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3LinePart1, `Case 3: Uncle is BLACK, z ${zForCase3.value} is LEFT child (line). Recolor & Rotate grandparent.`, [zForCase3.id, parentForCase3.id, grandparentForCase3.id]);
        setColor(parentForCase3.id, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3RecolorParent, `Recolor Parent ${parentForCase3.value} to BLACK.`);
        setColor(grandparentForCase3.id, RED, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3RecolorGrandparent, `Recolor Grandparent ${grandparentForCase3.value} to RED.`);
        rotateRight(graph, grandparentForCase3.id, localSteps);
      }
    } else { 
      addStep(localSteps, graph, RBT_LINE_MAP.fixupParentIsRightChild, `Parent ${parentNode.value} is RIGHT child of grandparent ${grandparentNode.value}`, [currentZId, parentNode.id, grandparentNode.id]);
      const uncleId = grandparentNode.leftId!;
      const uncleNode = graph.nodesMap.get(uncleId)!;
      addStep(localSteps, graph, RBT_LINE_MAP.fixupUncleIsRightChild +1, `Uncle y=${uncleNode.value}(${uncleNode.color === RED ? 'R' : 'B'}) is LEFT child`, [currentZId, parentNode.id, grandparentNode.id, uncleId]); 

      if (isRed(uncleId, graph.nodesMap, graph.nilNodeId)) { 
         addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1UncleRed, `Case 1 (Symmetric): Uncle ${uncleNode.value} is RED. Recolor.`, [parentNode.id, uncleId, grandparentNode.id]);
        setColor(parentNode.id, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorParent, `Recolor Parent ${parentNode.value} to BLACK.`);
        setColor(uncleId, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorUncle, `Recolor Uncle ${uncleNode.value} to BLACK.`);
        setColor(grandparentNode.id, RED, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorGrandparent, `Recolor Grandparent ${grandparentNode.value} to RED.`);
        currentZId = grandparentNode.id; addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1MoveZUp, `Move z to Grandparent ${graph.nodesMap.get(currentZId)?.value}. Loop again.`);
      } else { 
        if (currentZId === parentNode.leftId) { 
          addStep(localSteps, graph, RBT_LINE_MAP.fixupCase2Triangle, `Case 2 (Symmetric): Uncle ${uncleNode.value} is BLACK, z ${zNode.value} is LEFT child (triangle). Rotate parent right.`, [currentZId, parentNode.id]);
          currentZId = parentNode.id;
          addStep(localSteps, graph, RBT_LINE_MAP.fixupCase2MoveZToParent, `Set z to parent ${graph.nodesMap.get(currentZId)?.value}.`);
          rotateRight(graph, currentZId, localSteps);
        }
        const zForCase3 = graph.nodesMap.get(currentZId)!;
        const parentForCase3 = graph.nodesMap.get(zForCase3.parentId!)!;
        const grandparentForCase3 = graph.nodesMap.get(parentForCase3.parentId!)!;

        addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3LinePart1, `Case 3 (Symmetric): Uncle is BLACK, z ${zForCase3.value} is RIGHT child (line). Recolor & Rotate grandparent.`, [zForCase3.id, parentForCase3.id, grandparentForCase3.id]);
        setColor(parentForCase3.id, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3RecolorParent, `Recolor Parent ${parentForCase3.value} to BLACK.`);
        setColor(grandparentForCase3.id, RED, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3RecolorGrandparent, `Recolor Grandparent ${grandparentForCase3.value} to RED.`);
        rotateLeft(graph, grandparentForCase3.id, localSteps);
      }
    }
  }
  addStep(localSteps, graph, RBT_LINE_MAP.fixupLoopEnd, `Fixup loop condition false or z is root. Parent of z(${graph.nodesMap.get(currentZId)?.value}) is BLACK or z is root.`, [currentZId]);
  if (graph.rootId && graph.rootId !== graph.nilNodeId) {
    setColor(graph.rootId, BLACK, graph.nodesMap, graph.nilNodeId);
    addStep(localSteps, graph, RBT_LINE_MAP.fixupRootRecolor, `Ensure root ${graph.nodesMap.get(graph.rootId)?.value} is BLACK.`);
  }
  addStep(localSteps, graph, RBT_LINE_MAP.fixupFuncEnd, `insertFixup complete.`);
}

function insert(graph: RBTreeGraph, value: number, localSteps: TreeAlgorithmStep[]) {
  addStep(localSteps, graph, RBT_LINE_MAP.insertFuncStart, `Inserting value: ${value}`, []);
  const newNodeId = generateNodeId(value);
  graph.nodesMap.set(newNodeId, createNode(newNodeId, value, RED, graph.nilNodeId, graph.nilNodeId, graph.nilNodeId));
  addStep(localSteps, graph, RBT_LINE_MAP.newNodeSetup, `Created new RED node ${value}`, [newNodeId]);

  let yId: string | null = graph.nilNodeId;
  let xId: string | null = graph.rootId;

  while (xId !== graph.nilNodeId) {
    yId = xId;
    const xNode = graph.nodesMap.get(xId!)!;
    addStep(localSteps, graph, RBT_LINE_MAP.bstInsertLoop, `BST Insert: current x=${xNode.value}, y=${yId !== graph.nilNodeId ? graph.nodesMap.get(yId!)?.value : 'NIL'}. Compare ${value} with ${xNode.value}.`, [xId!, yId !== graph.nilNodeId ? yId! : '']);
    if (value < xNode.value!) {
      addStep(localSteps, graph, RBT_LINE_MAP.bstInsertGoLeft, `Value ${value} < ${xNode.value}. Go left.`, [xId!, yId !== graph.nilNodeId ? yId! : '']);
      xId = xNode.leftId;
    } else {
      addStep(localSteps, graph, RBT_LINE_MAP.bstInsertGoRight, `Value ${value} >= ${xNode.value}. Go right.`, [xId!, yId !== graph.nilNodeId ? yId! : '']);
      xId = xNode.rightId;
    }
  }
  
  const newNode = graph.nodesMap.get(newNodeId)!;
  newNode.parentId = yId;
  addStep(localSteps, graph, RBT_LINE_MAP.bstInsertSetParent, `Set parent of new node ${value} to ${yId !== graph.nilNodeId ? graph.nodesMap.get(yId!)?.value : 'NIL'}.`, [newNodeId, yId !== graph.nilNodeId ? yId! : '']);

  if (yId === graph.nilNodeId) {
    graph.rootId = newNodeId;
    addStep(localSteps, graph, 0, `Tree was empty. New node ${value} is root.`, [newNodeId]); // Line 0 for generic message
  } else {
    const yNode = graph.nodesMap.get(yId!)!;
    if (value < yNode.value!) {
      yNode.leftId = newNodeId;
    } else {
      yNode.rightId = newNodeId;
    }
    graph.nodesMap.set(yId!, yNode);
    addStep(localSteps, graph, 0, `Link new node ${value} as child of ${yNode.value}.`, [newNodeId, yId!]);
  }
  graph.nodesMap.set(newNodeId, newNode);
  
  insertFixup(graph, newNodeId, localSteps);
  addStep(localSteps, graph, RBT_LINE_MAP.insertFuncEnd, `Insertion of ${value} complete.`);
}

function search(graph: RBTreeGraph, searchValue: number, localSteps: TreeAlgorithmStep[]): RBTNodeInternal | null {
  addStep(localSteps, graph, RBT_LINE_MAP.searchFuncStart, `Searching for value: ${searchValue}`, []);
  let currentId: string | null = graph.rootId;
  const pathNodeIds: string[] = [];

  while (currentId && currentId !== graph.nilNodeId) {
    const currentNode = graph.nodesMap.get(currentId)!;
    pathNodeIds.push(currentId);
    addStep(localSteps, graph, RBT_LINE_MAP.searchNodeCompare, `Comparing search value ${searchValue} with node ${currentNode.value}`, [currentId], {}, [...pathNodeIds]);

    if (searchValue === currentNode.value) {
      addStep(localSteps, graph, RBT_LINE_MAP.searchValueFound, `Value ${searchValue} found at node ${currentNode.value}`, [currentId], {[currentId]: RBT_NODE_COLORS.FOUND_HIGHLIGHT}, [...pathNodeIds]);
      addStep(localSteps, graph, RBT_LINE_MAP.searchFuncEnd, `Search complete.`);
      return currentNode;
    }
    if (searchValue < currentNode.value!) {
      addStep(localSteps, graph, RBT_LINE_MAP.searchGoLeft, `Search value ${searchValue} < node ${currentNode.value}. Going left.`, [currentId], {}, [...pathNodeIds]);
      currentId = currentNode.leftId;
    } else {
      addStep(localSteps, graph, RBT_LINE_MAP.searchGoRight, `Search value ${searchValue} > node ${currentNode.value}. Going right.`, [currentId], {}, [...pathNodeIds]);
      currentId = currentNode.rightId;
    }
  }
  addStep(localSteps, graph, RBT_LINE_MAP.searchValueNotFound, `Value ${searchValue} not found. Reached NIL or empty tree.`, [], {}, pathNodeIds);
  addStep(localSteps, graph, RBT_LINE_MAP.searchFuncEnd, `Search complete.`);
  return null;
}

// --- Delete (Conceptual placeholder) ---
function deleteNodeConceptual(graph: RBTreeGraph, value: number, localSteps: TreeAlgorithmStep[]) {
    addStep(localSteps, graph, RBT_LINE_MAP.deleteFuncStart, `Attempting to delete value: ${value}`);
    let zId: string | null = null;
    let current = graph.rootId;
    
    while(current && current !== graph.nilNodeId){
        const cNode = graph.nodesMap.get(current)!;
        if(value === cNode.value) { zId = current; break; }
        else if (value < cNode.value!) current = cNode.leftId;
        else current = cNode.rightId;
    }

    if (!zId || zId === graph.nilNodeId) {
        addStep(localSteps, graph, RBT_LINE_MAP.deleteFindNodeZ, `Value ${value} not found in tree. Cannot delete.`);
        addStep(localSteps, graph, RBT_LINE_MAP.deleteFuncEnd, `Delete operation for ${value} ended (not found).`);
        return;
    }
    const zNode = graph.nodesMap.get(zId)!;
    addStep(localSteps, graph, RBT_LINE_MAP.deleteFindNodeZ, `Node to delete, z = ${zNode.value}, found.`, [zId]);
    
    let yId = zId; 
    let yOriginalColor = graph.nodesMap.get(yId)!.color;
    let xId: string | null; 

    if (zNode.leftId === graph.nilNodeId) {
        xId = zNode.rightId;
        addStep(localSteps, graph, RBT_LINE_MAP.deleteIdentifyYAndX, `Node ${zNode.value} has no left child. Successor x is right child.`, [zId, xId !== graph.nilNodeId ? xId : graph.nilNodeId]);
    } else if (zNode.rightId === graph.nilNodeId) {
        xId = zNode.leftId;
        addStep(localSteps, graph, RBT_LINE_MAP.deleteIdentifyYAndX, `Node ${zNode.value} has no right child. Successor x is left child.`, [zId, xId !== graph.nilNodeId ? xId : graph.nilNodeId]);
    } else {
        yId = treeMinimum(graph, zNode.rightId!);
        const yNodeSuccessor = graph.nodesMap.get(yId)!;
        yOriginalColor = yNodeSuccessor.color;
        xId = yNodeSuccessor.rightId; 
        addStep(localSteps, graph, RBT_LINE_MAP.deleteIdentifyYAndX, `Node ${zNode.value} has two children. Successor y is ${yNodeSuccessor.value}. Child x is ${xId !== graph.nilNodeId ? graph.nodesMap.get(xId)?.value : 'NIL'}.`, [zId, yId, xId !== graph.nilNodeId ? xId : graph.nilNodeId]);
    }
    
    const zParentId = zNode.parentId;
    if(zParentId !== graph.nilNodeId){
        const zParentNode = graph.nodesMap.get(zParentId!)!;
        if(zParentNode.leftId === zId) zParentNode.leftId = xId; // Simplified "transplant" part 1
        else zParentNode.rightId = xId; // Simplified "transplant" part 1
        graph.nodesMap.set(zParentId!, zParentNode);
    } else {
        graph.rootId = xId; // Simplified "transplant" part 1
    }
    if(xId !== graph.nilNodeId && graph.nodesMap.has(xId)) { // Ensure xId is valid before accessing
        graph.nodesMap.get(xId!)!.parentId = zParentId; // Simplified "transplant" part 2
    }
    graph.nodesMap.delete(zId); // The actual removal

    addStep(localSteps, graph, RBT_LINE_MAP.deleteTransplant, `Node for value ${value} (or its successor) removed. Tree might be invalid.`, xId && xId !== graph.nilNodeId ? [xId] : []);
    
    if (yOriginalColor === BLACK) {
      addStep(localSteps, graph, RBT_LINE_MAP.deleteCheckYColorCallFixup, `Removed/moved node was BLACK. deleteFixup(${xId !== graph.nilNodeId ? graph.nodesMap.get(xId!)?.value : 'NIL'}) would be called. (Fixup visualization is conceptual).`);
      addStep(localSteps, graph, RBT_LINE_MAP.deleteFixupFuncStart, `Conceptual deleteFixup starts for x.`);
      addStep(localSteps, graph, RBT_LINE_MAP.deleteFixupLoop, `Fixup loop would run if x is black and not root.`);
      addStep(localSteps, graph, RBT_LINE_MAP.deleteFixupSetXBlack, `Conceptual: x.color set to BLACK at end of fixup.`);
      addStep(localSteps, graph, RBT_LINE_MAP.deleteFixupFuncEnd, `Conceptual deleteFixup ends.`);
    } else {
      addStep(localSteps, graph, RBT_LINE_MAP.deleteCheckYColorCallFixup, `Removed/moved node was RED. No fixup needed. Tree properties should hold (conceptually).`);
    }
    addStep(localSteps, graph, RBT_LINE_MAP.deleteFuncEnd, `Delete operation for ${value} (conceptually) complete.`);
}

function treeMinimum(graph: RBTreeGraph, nodeId: string): string {
    let currentId = nodeId;
    while(graph.nodesMap.get(currentId)?.leftId !== graph.nilNodeId){
        currentId = graph.nodesMap.get(currentId)!.leftId!;
    }
    return currentId;
}


export const generateRBTreeSteps = (
  operation: 'build' | 'insert' | 'search' | 'delete' | 'structure',
  initialValuesString?: string,
  valueToProcess?: number,    
  currentGraphRef?: RBTreeGraph    
): TreeAlgorithmStep[] => {
  const localSteps: TreeAlgorithmStep[] = [];
  nodeIdCounter = 0; 

  let graph: RBTreeGraph;

  if (currentGraphRef && operation !== 'build') {
    const newNodesMap = new Map<string, RBTNodeInternal>();
    currentGraphRef.nodesMap.forEach((node, id) => newNodesMap.set(id, {...node}));
    graph = { 
      rootId: currentGraphRef.rootId, 
      nodesMap: newNodesMap, 
      nilNodeId: currentGraphRef.nilNodeId || NIL_ID 
    };
  } else {
    graph = createInitialRBTreeGraph();
  }


  if (operation === 'build') {
    const values = initialValuesString ? initialValuesString.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : [];
    addStep(localSteps, graph, null, `Building Red-Black Tree from values: [${values.join(', ')}]`);
    if(values.length === 0) {
        graph.rootId = graph.nilNodeId; 
    }
    values.forEach(val => {
      insert(graph, val, localSteps);
    });
    addStep(localSteps, graph, null, "Build complete.");
  } else if (operation === 'insert') {
    if (valueToProcess === undefined) {
      addStep(localSteps, graph, null, "Error: No value provided for insert.");
    } else {
      insert(graph, valueToProcess, localSteps);
    }
  } else if (operation === 'search') {
    if (valueToProcess === undefined) {
      addStep(localSteps, graph, null, "Error: No value provided for search.");
    } else {
      search(graph, valueToProcess, localSteps);
    }
  } else if (operation === 'delete') {
    if (valueToProcess === undefined) {
      addStep(localSteps, graph, null, "Error: No value provided for delete.");
    } else {
      deleteNodeConceptual(graph, valueToProcess, localSteps);
    }
  } else if (operation === 'structure') {
     addStep(localSteps, graph, null, "Displaying current tree structure.");
  }
  
  if (localSteps.length > 0 && operation !== 'structure') {
      const lastOpMessage = localSteps[localSteps.length-1].message;
      addStep(localSteps, graph, null, `Final tree state after: ${lastOpMessage || operation}.`);
  } else if (operation === 'build' && (!initialValuesString || initialValuesString.trim() === '')) {
      addStep(localSteps, graph, null, "Tree is empty after build attempt with no values.");
  } else if (operation === 'structure' && localSteps.length === 1){
      // If only "Displaying current..." message, add a final state step
      addStep(localSteps, graph, null, "Current tree structure displayed.");
  }


  // Update the ref in the page component AFTER all steps are generated for this operation
  if (currentGraphRef) {
    currentGraphRef.rootId = graph.rootId;
    currentGraphRef.nodesMap = graph.nodesMap;
    currentGraphRef.nilNodeId = graph.nilNodeId;
  }

  return localSteps;
};

export function mapRBTNodesToVisual(
  nodesMap: Map<string, RBTNodeInternal>,
  rootId: string | null,
  nilNodeId: string,
  activeNodeIds: string[] = [],
  specialHighlightColors: Record<string, string> = {},
  pathNodeIds: string[] = []
): BinaryTreeNodeVisual[] {
  const visualNodes: BinaryTreeNodeVisual[] = [];
  if (!rootId || rootId === nilNodeId) return visualNodes;

  const X_SPACING_BASE = 60; 
  const Y_SPACING = 70;
  const SVG_WIDTH_CENTER = 300; 

  function positionNode(nodeId: string, x: number, y: number, xOffsetMultiplier: number, depth: number) {
    if (nodeId === nilNodeId || !nodesMap.has(nodeId)) return;

    const node = nodesMap.get(nodeId)!;
    let baseColor = node.color === RED ? RBT_NODE_COLORS.RED : RBT_NODE_COLORS.BLACK;
    let currentTextColor = node.color === RED ? RBT_TEXT_COLORS.RED_TEXT : RBT_TEXT_COLORS.BLACK_TEXT;

    let displayColor = specialHighlightColors[nodeId] || baseColor;
    let displayTextColor = currentTextColor;

    if (activeNodeIds.includes(nodeId) && !specialHighlightColors[nodeId]) {
        displayColor = "hsl(var(--primary))"; 
        displayTextColor = "hsl(var(--primary-foreground))";
    } else if (pathNodeIds.includes(nodeId) && !specialHighlightColors[nodeId] && !activeNodeIds.includes(nodeId)) {
        displayColor = "hsl(var(--primary)/0.6)";
        displayTextColor = "hsl(var(--primary-foreground))"; // Ensure contrast on path highlight
    }
     if (specialHighlightColors[nodeId] === RBT_NODE_COLORS.FOUND_HIGHLIGHT){
        displayTextColor = RBT_TEXT_COLORS.FOUND_HIGHLIGHT_TEXT;
     }


    visualNodes.push({
      id: node.id,
      value: node.value,
      x, y,
      nodeColor: node.color === RED ? 'RED' : 'BLACK', 
      color: displayColor, 
      textColor: displayTextColor,
      leftId: node.leftId !== nilNodeId ? node.leftId : null,
      rightId: node.rightId !== nilNodeId ? node.rightId : null,
    });
    
    const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.7, depth); 

    if (node.leftId !== nilNodeId) {
      positionNode(node.leftId!, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
    }
    if (node.rightId !== nilNodeId) {
      positionNode(node.rightId!, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
    }
  }

  positionNode(rootId, SVG_WIDTH_CENTER, 50, 0.8, 0); 
  return visualNodes;
}

function buildEdges(visualNodes: BinaryTreeNodeVisual[], nilNodeId: string): TreeAlgorithmStep['edges'] {
  const edges: TreeAlgorithmStep['edges'] = [];
  const nodeMap = new Map(visualNodes.map(vn => [vn.id, vn]));

  visualNodes.forEach(node => {
    if (node.leftId && node.leftId !== nilNodeId && nodeMap.has(node.leftId)) {
      edges.push({
        id: `edge-${node.id}-${node.leftId}`,
        sourceId: node.id,
        targetId: node.leftId,
        color: "hsl(var(--muted-foreground))"
      });
    }
    if (node.rightId && node.rightId !== nilNodeId && nodeMap.has(node.rightId)) {
      edges.push({
        id: `edge-${node.id}-${node.rightId}`,
        sourceId: node.id,
        targetId: node.rightId,
        color: "hsl(var(--muted-foreground))"
      });
    }
  });
  return edges;
}

export const createInitialRBTreeGraph = (): RBTreeGraph => {
  nodeIdCounter = 0; // Reset counter for new graph
  const nilNode = createNode(NIL_ID, null, BLACK, NIL_ID, NIL_ID, NIL_ID);
  const nodesMap = new Map<string, RBTNodeInternal>();
  nodesMap.set(NIL_ID, nilNode);
  return { rootId: NIL_ID, nodesMap, nilNodeId: NIL_ID };
};

export const getFinalRBTreeGraph = (graph: RBTreeGraph): RBTreeGraph => {
  const newNodesMap = new Map<string, RBTNodeInternal>();
  graph.nodesMap.forEach((node, id) => newNodesMap.set(id, {...node}));
  return { 
    rootId: graph.rootId, 
    nodesMap: newNodesMap,
    nilNodeId: graph.nilNodeId 
  };
};
