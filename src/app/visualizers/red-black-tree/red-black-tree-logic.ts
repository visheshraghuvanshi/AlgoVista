
import type { TreeAlgorithmStep, BinaryTreeNodeVisual } from '@/types';
import { RBT_NODE_COLORS, RBT_TEXT_COLORS } from './rbt-node-colors';

const RED = true;
const BLACK = false;
export const NIL_ID = 'NIL';

export interface RBTNodeInternal {
  id: string;
  value: number | null; // NIL node has null value
  color: boolean; // true for RED, false for BLACK
  leftId: string | null;
  rightId: string | null;
  parentId: string | null;
}

export interface RBTreeGraph {
  rootId: string | null;
  nodesMap: Map<string, RBTNodeInternal>;
  nilNodeId: string; // To consistently refer to the NIL node
}

let nodeIdCounter = 0;
const generateNodeId = (value: number) => `rbt-node-${value}-${nodeIdCounter++}`;

export const RBT_LINE_MAP = {
  // Insert & Fixup (lines 1-29)
  insertFuncStart: 1,
  bstInsertLoop: 2,
  bstInsertGoLeft: 3,
  bstInsertGoRight: 4,
  bstInsertSetParent: 5,
  newNodeSetup: 6,
  callInsertFixup: 7,
  insertFuncEnd: 8,

  fixupLoopStart: 9, // while (z.parent.color === RED)
  fixupParentIsLeftChild: 10,
  fixupUncleIsRightChild: 11,
  fixupCase1UncleRed: 12, // if (uncle.color === RED)
  fixupCase1RecolorParent: 13,
  fixupCase1RecolorUncle: 14,
  fixupCase1RecolorGrandparent: 15,
  fixupCase1MoveZUp: 16,
  fixupCase2Triangle: 17, // else (uncle is BLACK) if (z === z.parent.right)
  fixupCase2MoveZToParent: 18,
  fixupCase2RotateParent: 19,
  fixupCase3LinePart1: 20, // z is now left child (or was originally)
  fixupCase3RecolorParent: 21,
  fixupCase3RecolorGrandparent: 22,
  fixupCase3RotateGrandparent: 23,
  fixupParentIsRightChild: 24, // Symmetric cases for parent being right child
  // Symmetric cases (25-28) would mirror 11-23 for the right side. For simplicity, grouped conceptually.
  fixupRootRecolor: 29, // this.root.color = BLACK
  fixupLoopEnd: 30,
  fixupFuncEnd: 31,

  // Rotations (lines 32-40)
  rotateLeftStart: 32,
  rotateLeftSetY: 33,
  rotateLeftXRightToYLeft: 34,
  rotateLeftYLeftParent: 35,
  rotateLeftYParentToXParent: 36,
  rotateLeftUpdateRootOrChild: 37,
  rotateLeftYLeftToX: 38,
  rotateLeftXParentToY: 39,
  rotateLeftEnd: 40,

  rotateRightStart: 41, // Similar structure for rotateRight
  rotateRightSetX: 42,
  rotateRightYLeftToXRight: 43,
  // ... other rotation lines up to rotateRightEnd: 49

  // Search (lines 50+)
  searchFuncStart: 50,
  searchLoopStart: 51,
  searchNodeCompare: 52,
  searchValueFound: 53,
  searchGoLeft: 54,
  searchGoRight: 55,
  searchValueNotFound: 56,
  searchFuncEnd: 57,
};

function createNode(id: string, value: number | null, color: boolean, parentId: string | null, leftId: string | null, rightId: string | null): RBTNodeInternal {
  return { id, value, color, parentId, leftId, rightId };
}

function isRed(nodeId: string | null, nodesMap: Map<string, RBTNodeInternal>, nilNodeId: string): boolean {
  if (!nodeId || nodeId === nilNodeId) return BLACK; // NIL nodes are BLACK
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
  });
}

// --- Rotation Functions ---
function rotateLeft(graph: RBTreeGraph, xId: string, localSteps: TreeAlgorithmStep[]) {
  const x = graph.nodesMap.get(xId)!;
  const yId = x.rightId;
  if (!yId || yId === graph.nilNodeId) return; // Cannot rotate if no right child
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
  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftUpdateRootOrChild, `Update parent of y. Root is now ${graph.rootId ? graph.nodesMap.get(graph.rootId)?.value : 'NIL'}`, [yId]);


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
  if (x.rightId !== graph.nilNodeId) {
    graph.nodesMap.get(x.rightId!)!.parentId = yId;
  }
  x.parentId = y.parentId;
  if (y.parentId === graph.nilNodeId) {
    graph.rootId = xId;
  } else if (yId === graph.nodesMap.get(y.parentId!)!.rightId) {
    graph.nodesMap.get(y.parentId!)!.rightId = xId;
  } else {
    graph.nodesMap.get(y.parentId!)!.leftId = xId;
  }
  x.rightId = yId;
  y.parentId = xId;

  graph.nodesMap.set(yId, y);
  graph.nodesMap.set(xId, x);
  addStep(localSteps, graph, RBT_LINE_MAP.rotateLeftEnd + 9, `Rotate Right around ${y.value} complete. New subtree root: ${x.value}`, [xId, yId]); // Placeholder line
}

// --- Insert and Fixup ---
function insertFixup(graph: RBTreeGraph, zId: string, localSteps: TreeAlgorithmStep[]) {
  let currentZId = zId;
  addStep(localSteps, graph, RBT_LINE_MAP.callInsertFixup, `Called insertFixup for node ${graph.nodesMap.get(currentZId)?.value}`, [currentZId]);

  while (isRed(graph.nodesMap.get(currentZId)!.parentId, graph.nodesMap, graph.nilNodeId)) {
    const zNode = graph.nodesMap.get(currentZId)!;
    const parentNode = graph.nodesMap.get(zNode.parentId!)!;
    const grandparentNode = graph.nodesMap.get(parentNode.parentId!)!; // Parent is RED, so grandparent must exist and not be NIL (unless root's child, handled by root color)

    addStep(localSteps, graph, RBT_LINE_MAP.fixupLoopStart, `Fixup loop: z=${zNode.value}(${zNode.color === RED ? 'R' : 'B'}), parent=${parentNode.value}(${parentNode.color === RED ? 'R' : 'B'}) is RED. Grandparent=${grandparentNode.value}`, [currentZId, parentNode.id, grandparentNode.id]);

    if (zNode.parentId === grandparentNode.leftId) { // Parent is left child
      addStep(localSteps, graph, RBT_LINE_MAP.fixupParentIsLeftChild, `Parent ${parentNode.value} is LEFT child of grandparent ${grandparentNode.value}`, [currentZId, parentNode.id, grandparentNode.id]);
      const uncleId = grandparentNode.rightId!;
      const uncleNode = graph.nodesMap.get(uncleId)!;
      addStep(localSteps, graph, RBT_LINE_MAP.fixupUncleIsRightChild, `Uncle y=${uncleNode.value}(${uncleNode.color === RED ? 'R' : 'B'}) is RIGHT child`, [currentZId, parentNode.id, grandparentNode.id, uncleId]);

      if (isRed(uncleId, graph.nodesMap, graph.nilNodeId)) { // Case 1: Uncle is RED
        addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1UncleRed, `Case 1: Uncle ${uncleNode.value} is RED. Recolor.`, [parentNode.id, uncleId, grandparentNode.id]);
        setColor(parentNode.id, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorParent, `Recolor Parent ${parentNode.value} to BLACK.`);
        setColor(uncleId, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorUncle, `Recolor Uncle ${uncleNode.value} to BLACK.`);
        setColor(grandparentNode.id, RED, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorGrandparent, `Recolor Grandparent ${grandparentNode.value} to RED.`);
        currentZId = grandparentNode.id; addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1MoveZUp, `Move z to Grandparent ${graph.nodesMap.get(currentZId)?.value}. Loop again.`);
      } else { // Uncle is BLACK
        if (currentZId === parentNode.rightId) { // Case 2: z is right child (triangle)
          addStep(localSteps, graph, RBT_LINE_MAP.fixupCase2Triangle, `Case 2: Uncle ${uncleNode.value} is BLACK, z ${zNode.value} is RIGHT child (triangle). Rotate parent left.`, [currentZId, parentNode.id]);
          currentZId = parentNode.id; // Move z up to parent
          addStep(localSteps, graph, RBT_LINE_MAP.fixupCase2MoveZToParent, `Set z to parent ${graph.nodesMap.get(currentZId)?.value}.`);
          rotateLeft(graph, currentZId, localSteps);
          // zNode, parentNode, grandparentNode might be invalid after rotation, re-fetch if needed
          const newZNodeAfterRotate = graph.nodesMap.get(currentZId)!; // currentZId points to original parent
          const newParentNodeAfterRotate = graph.nodesMap.get(newZNodeAfterRotate.parentId!)!;
           // Fall through to Case 3, z is now outer child
           addStep(localSteps, graph, RBT_LINE_MAP.fixupCase2Triangle, `After rotation, z is ${newZNodeAfterRotate.value}, parent is ${newParentNodeAfterRotate.value}. Falls to Case 3.`);

        }
        // Case 3: z is left child (line) - or became one after Case 2
        // Need to re-fetch parent and grandparent if Case 2 happened
        const finalZNode = graph.nodesMap.get(currentZId)!;
        const finalParentNode = graph.nodesMap.get(finalZNode.parentId!)!;
        const finalGrandparentNode = graph.nodesMap.get(finalParentNode.parentId!)!;

        addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3LinePart1, `Case 3: Uncle is BLACK, z ${finalZNode.value} is LEFT child (line). Recolor & Rotate grandparent.`, [finalZNode.id, finalParentNode.id, finalGrandparentNode.id]);
        setColor(finalParentNode.id, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3RecolorParent, `Recolor Parent ${finalParentNode.value} to BLACK.`);
        setColor(finalGrandparentNode.id, RED, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3RecolorGrandparent, `Recolor Grandparent ${finalGrandparentNode.value} to RED.`);
        rotateRight(graph, finalGrandparentNode.id, localSteps);
      }
    } else { // Symmetric: Parent is right child
      addStep(localSteps, graph, RBT_LINE_MAP.fixupParentIsRightChild, `Parent ${parentNode.value} is RIGHT child of grandparent ${grandparentNode.value}`, [currentZId, parentNode.id, grandparentNode.id]);
      const uncleId = grandparentNode.leftId!;
      const uncleNode = graph.nodesMap.get(uncleId)!;
      addStep(localSteps, graph, RBT_LINE_MAP.fixupUncleIsRightChild +1, `Uncle y=${uncleNode.value}(${uncleNode.color === RED ? 'R' : 'B'}) is LEFT child`, [currentZId, parentNode.id, grandparentNode.id, uncleId]); // Re-use similar line for message context

      if (isRed(uncleId, graph.nodesMap, graph.nilNodeId)) { // Case 1 (Symmetric)
         addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1UncleRed, `Case 1 (Symmetric): Uncle ${uncleNode.value} is RED. Recolor.`, [parentNode.id, uncleId, grandparentNode.id]);
        setColor(parentNode.id, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorParent, `Recolor Parent ${parentNode.value} to BLACK.`);
        setColor(uncleId, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorUncle, `Recolor Uncle ${uncleNode.value} to BLACK.`);
        setColor(grandparentNode.id, RED, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1RecolorGrandparent, `Recolor Grandparent ${grandparentNode.value} to RED.`);
        currentZId = grandparentNode.id; addStep(localSteps, graph, RBT_LINE_MAP.fixupCase1MoveZUp, `Move z to Grandparent ${graph.nodesMap.get(currentZId)?.value}. Loop again.`);
      } else { // Uncle is BLACK
        if (currentZId === parentNode.leftId) { // Case 2 (Symmetric): z is left child (triangle)
          addStep(localSteps, graph, RBT_LINE_MAP.fixupCase2Triangle, `Case 2 (Symmetric): Uncle ${uncleNode.value} is BLACK, z ${zNode.value} is LEFT child (triangle). Rotate parent right.`, [currentZId, parentNode.id]);
          currentZId = parentNode.id;
          addStep(localSteps, graph, RBT_LINE_MAP.fixupCase2MoveZToParent, `Set z to parent ${graph.nodesMap.get(currentZId)?.value}.`);
          rotateRight(graph, currentZId, localSteps);
          const newZNodeAfterRotate = graph.nodesMap.get(currentZId)!;
          const newParentNodeAfterRotate = graph.nodesMap.get(newZNodeAfterRotate.parentId!)!;
          addStep(localSteps, graph, RBT_LINE_MAP.fixupCase2Triangle, `After rotation, z is ${newZNodeAfterRotate.value}, parent is ${newParentNodeAfterRotate.value}. Falls to Case 3.`);
        }
        // Case 3 (Symmetric): z is right child (line)
        const finalZNode = graph.nodesMap.get(currentZId)!;
        const finalParentNode = graph.nodesMap.get(finalZNode.parentId!)!;
        const finalGrandparentNode = graph.nodesMap.get(finalParentNode.parentId!)!;

        addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3LinePart1, `Case 3 (Symmetric): Uncle is BLACK, z ${finalZNode.value} is RIGHT child (line). Recolor & Rotate grandparent.`, [finalZNode.id, finalParentNode.id, finalGrandparentNode.id]);
        setColor(finalParentNode.id, BLACK, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3RecolorParent, `Recolor Parent ${finalParentNode.value} to BLACK.`);
        setColor(finalGrandparentNode.id, RED, graph.nodesMap, graph.nilNodeId); addStep(localSteps, graph, RBT_LINE_MAP.fixupCase3RecolorGrandparent, `Recolor Grandparent ${finalGrandparentNode.value} to RED.`);
        rotateLeft(graph, finalGrandparentNode.id, localSteps);
      }
    }
  }
  addStep(localSteps, graph, RBT_LINE_MAP.fixupLoopEnd, `Fixup loop condition false or z is root. Parent of z(${graph.nodesMap.get(currentZId)?.value}) is BLACK or z is root.`, [currentZId]);
  if (graph.rootId) {
    setColor(graph.rootId, BLACK, graph.nodesMap, graph.nilNodeId);
    addStep(localSteps, graph, RBT_LINE_MAP.fixupRootRecolor, `Ensure root ${graph.nodesMap.get(graph.rootId)?.value} is BLACK.`);
  }
  addStep(localSteps, graph, RBT_LINE_MAP.fixupFuncEnd, `insertFixup complete.`);
}

function insert(graph: RBTreeGraph, value: number, localSteps: TreeAlgorithmStep[]) {
  addStep(localSteps, graph, RBT_LINE_MAP.insertFuncStart, `Inserting value: ${value}`, []);
  const newNodeId = generateNodeId(value);
  // New node is RED, parent is NIL, children are NIL
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
    addStep(localSteps, graph, 0, `Tree was empty. New node ${value} is root.`, [newNodeId]);
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

// --- Search Function ---
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


// --- Main Step Generation Orchestrator ---
export const generateRBTreeSteps = (
  operation: 'build' | 'insert' | 'search',
  initialValuesString?: string, // For build from comma-separated string
  valueToProcess?: number,    // For single insert or search
  currentGraph?: RBTreeGraph    // To operate on existing tree
): TreeAlgorithmStep[] => {
  const localSteps: TreeAlgorithmStep[] = [];
  nodeIdCounter = 0; // Reset for deterministic IDs per operation run

  let graph: RBTreeGraph;

  if (currentGraph && operation !== 'build') {
    // Clone the existing graph to avoid modifying the ref directly during step generation
    const newNodesMap = new Map<string, RBTNodeInternal>();
    currentGraph.nodesMap.forEach((node, id) => newNodesMap.set(id, {...node}));
    graph = { 
      rootId: currentGraph.rootId, 
      nodesMap: newNodesMap, 
      nilNodeId: currentGraph.nilNodeId || NIL_ID 
    };
  } else {
    // Initialize a new graph for 'build' or if no currentGraph is provided
    const nilNode = createNode(NIL_ID, null, BLACK, NIL_ID, NIL_ID, NIL_ID);
    const nodesMap = new Map<string, RBTNodeInternal>();
    nodesMap.set(NIL_ID, nilNode);
    graph = { rootId: NIL_ID, nodesMap, nilNodeId: NIL_ID };
  }


  if (operation === 'build') {
    const values = initialValuesString ? initialValuesString.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : [];
    addStep(localSteps, graph, null, `Building Red-Black Tree from values: [${values.join(', ')}]`);
    if(values.length === 0) {
        graph.rootId = graph.nilNodeId; // Ensure empty tree if no values
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
  }
  
  // Add a final step representing the stable state of the tree
  if (localSteps.length > 0) {
      const lastOpMessage = localSteps[localSteps.length-1].message;
      addStep(localSteps, graph, null, `Final tree state after: ${lastOpMessage || operation}.`);
  } else if (operation === 'build' && (!initialValuesString || initialValuesString.trim() === '')) {
      addStep(localSteps, graph, null, "Tree is empty after build attempt with no values.");
  }


  // Update the ref in the page component AFTER all steps are generated for this operation
  // The calling component (`page.tsx`) will handle this.
  // We return the final state of the graph for the calling component.
  return localSteps;
};

// --- Visualization Mapping ---
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

  const X_SPACING_BASE = 60; // Increased for RBTs
  const Y_SPACING = 70;
  const SVG_WIDTH = 600;

  function positionNode(nodeId: string, x: number, y: number, xOffsetMultiplier: number, depth: number) {
    if (nodeId === nilNodeId || !nodesMap.has(nodeId)) return;

    const node = nodesMap.get(nodeId)!;
    let baseColor = node.color === RED ? RBT_NODE_COLORS.RED : RBT_NODE_COLORS.BLACK;
    let currentTextColor = node.color === RED ? RBT_TEXT_COLORS.RED_TEXT : RBT_TEXT_COLORS.BLACK_TEXT;

    // Apply special highlights if any
    let displayColor = specialHighlightColors[nodeId] || baseColor;
    if (activeNodeIds.includes(nodeId) && !specialHighlightColors[nodeId]) {
        // Use a generic active color different from RBT RED/BLACK for clarity
        displayColor = "hsl(var(--primary))"; 
        currentTextColor = "hsl(var(--primary-foreground))";
    } else if (pathNodeIds.includes(nodeId) && !specialHighlightColors[nodeId] && !activeNodeIds.includes(nodeId)) {
        // Use a generic path color
        displayColor = "hsl(var(--primary)/0.6)"; 
        // Text color for path might need adjustment based on path color choice
    }
     if (specialHighlightColors[nodeId] === RBT_NODE_COLORS.FOUND_HIGHLIGHT){
        currentTextColor = RBT_TEXT_COLORS.FOUND_HIGHLIGHT_TEXT;
     }


    visualNodes.push({
      id: node.id,
      value: node.value,
      x, y,
      nodeColor: node.color === RED ? 'RED' : 'BLACK', // Store RBT color
      color: displayColor, // This is for the visual fill, including highlights
      textColor: currentTextColor,
      leftId: node.leftId !== nilNodeId ? node.leftId : null,
      rightId: node.rightId !== nilNodeId ? node.rightId : null,
    });
    
    const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.7, depth); // Adjusted for RBTs

    if (node.leftId !== nilNodeId) {
      positionNode(node.leftId!, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
    }
    if (node.rightId !== nilNodeId) {
      positionNode(node.rightId!, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
    }
  }

  positionNode(rootId, SVG_WIDTH / 2, 50, 0.8, 0); // Initial xOffsetMultiplier adjusted
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
        color: (node.color === "hsl(var(--primary)/0.6)" && nodeMap.get(node.leftId)?.color === "hsl(var(--primary)/0.6)") ? "hsl(var(--primary)/0.6)" : "hsl(var(--muted-foreground))"
      });
    }
    if (node.rightId && node.rightId !== nilNodeId && nodeMap.has(node.rightId)) {
      edges.push({
        id: `edge-${node.id}-${node.rightId}`,
        sourceId: node.id,
        targetId: node.rightId,
        color: (node.color === "hsl(var(--primary)/0.6)" && nodeMap.get(node.rightId)?.color === "hsl(var(--primary)/0.6)") ? "hsl(var(--primary)/0.6)" : "hsl(var(--muted-foreground))"
      });
    }
  });
  return edges;
}

// Helper to get the final graph state for the page component
export const getFinalRBTreeGraph = (graph: RBTreeGraph): RBTreeGraph => {
  const newNodesMap = new Map<string, RBTNodeInternal>();
  graph.nodesMap.forEach((node, id) => newNodesMap.set(id, {...node}));
  return { 
    rootId: graph.rootId, 
    nodesMap: newNodesMap,
    nilNodeId: graph.nilNodeId 
  };
};
export const createInitialRBTreeGraph = (): RBTreeGraph => {
  const nilNode = createNode(NIL_ID, null, BLACK, NIL_ID, NIL_ID, NIL_ID);
  const nodesMap = new Map<string, RBTNodeInternal>();
  nodesMap.set(NIL_ID, nilNode);
  return { rootId: NIL_ID, nodesMap, nilNodeId: NIL_ID };
};

