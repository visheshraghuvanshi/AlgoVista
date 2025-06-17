
import type { BinaryTreeNodeVisual, BinaryTreeEdgeVisual, TreeAlgorithmStep } from '@/types';

export type BSTOperationType = 'insert' | 'search' | 'delete' | 'build'; // 'build' is an internal op

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
  inserted: "hsl(var(--accent))", // Newly inserted node
  path: "hsl(var(--primary)/0.7)", // Nodes on the path to target
  toBeDeleted: "hsl(var(--destructive))",
  successor: "hsl(var(--ring))",
};
const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  path: "hsl(var(--primary))",
};

let bstNodeIdCounter = 0;
const generateBSTNodeId = (value: number) => `bst-node-${value}-${bstNodeIdCounter++}`;

interface BSTNodeInternal {
  id: string;
  value: number;
  leftId: string | null;
  rightId: string | null;
}

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

  const X_SPACING = 40; // Horizontal spacing between nodes at same level
  const Y_SPACING = 60; // Vertical spacing between levels

  function positionNode(nodeId: string | null, x: number, y: number, xRange: [number, number]) {
    if (!nodeId || !nodesMap.has(nodeId)) return;

    const node = nodesMap.get(nodeId)!;
    let color = specialColors[nodeId] || NODE_COLORS.default;
    if (pathNodeIds.includes(nodeId) && !specialColors[nodeId]) color = NODE_COLORS.path;
    if (activeNodeIds.includes(nodeId) && !specialColors[nodeId]) color = NODE_COLORS.visiting;


    visualNodes.push({ id: nodeId, value: node.value, x, y, color, leftId: node.leftId, rightId: node.rightId });

    const childrenCount = (node.leftId ? 1 : 0) + (node.rightId ? 1 : 0);
    const childXOffsetBase = (xRange[1] - xRange[0]) / (childrenCount > 1 ? 4 : 2); // Distribute space for children


    if (node.leftId) {
      const childX = x - childXOffsetBase;
      const childY = y + Y_SPACING;
      visualEdges.push({
        id: `edge-${nodeId}-${node.leftId}`, sourceId: nodeId, targetId: node.leftId,
        color: (pathNodeIds.includes(nodeId) && pathNodeIds.includes(node.leftId)) ? EDGE_COLORS.path : EDGE_COLORS.default
      });
      positionNode(node.leftId, childX, childY, [xRange[0], x]);
    }
    if (node.rightId) {
      const childX = x + childXOffsetBase;
      const childY = y + Y_SPACING;
      visualEdges.push({
        id: `edge-${nodeId}-${node.rightId}`, sourceId: nodeId, targetId: node.rightId,
        color: (pathNodeIds.includes(nodeId) && pathNodeIds.includes(node.rightId)) ? EDGE_COLORS.path : EDGE_COLORS.default
      });
      positionNode(node.rightId, childX, childY, [x, xRange[1]]);
    }
  }

  const svgWidth = 500; // Assume a fixed SVG width for root positioning
  positionNode(currentRootId, svgWidth / 2, 50, [0, svgWidth]);
  return { visualNodes, visualEdges };
}

export const generateBSTSteps = (
  currentBSTRef: React.MutableRefObject<{ rootId: string | null, nodes: Map<string, BSTNodeInternal> }>,
  operation: BSTOperationType,
  value?: number,
  initialValuesString?: string
): TreeAlgorithmStep[] => {
  const localSteps: TreeAlgorithmStep[] = [];
  const lineMapStructure = BST_OPERATION_LINE_MAPS.structure;
  let operationLineMap = BST_OPERATION_LINE_MAPS[operation];

  const workingNodes = new Map<string, BSTNodeInternal>();
  currentBSTRef.current.nodes.forEach((node, id) => {
    workingNodes.set(id, { ...node }); // Deep clone node properties
  });
  let rootId = currentBSTRef.current.rootId;
  
  const currentPathNodeIds: string[] = [];
  
  function addStep(
    line: number | null,
    message: string,
    activeIds: string[] = [],
    specialColors: Record<string, string> = {}
  ) {
    const { visualNodes, visualEdges } = getLayout(rootId, workingNodes, activeIds, [...currentPathNodeIds], specialColors);
    localSteps.push({
      nodes: visualNodes,
      edges: visualEdges,
      traversalPath: [...currentPathNodeIds],
      currentLine: line,
      message,
      currentProcessingNodeId: activeIds.length > 0 ? activeIds[0] : null,
    });
  }

  function insertRec(nodeId: string | null, val: number): string {
    currentPathNodeIds.push(nodeId!);
    addStep(operationLineMap.recFunc, `Insert(${val}) at node ${nodeId ? workingNodes.get(nodeId)?.value : 'null'}. Path: ${currentPathNodeIds.join('->')}`, nodeId ? [nodeId] : []);
    
    if (nodeId === null) {
      const newNodeId = generateBSTNodeId(val);
      workingNodes.set(newNodeId, { id: newNodeId, value: val, leftId: null, rightId: null });
      addStep(operationLineMap.baseCaseNull, `Create new node ${val}.`, [], {[newNodeId]: NODE_COLORS.inserted});
      currentPathNodeIds.pop();
      return newNodeId;
    }
    const node = workingNodes.get(nodeId)!;
    if (val < node.value) {
      addStep(operationLineMap.goLeft, `Value ${val} < node ${node.value}. Go left.`, [nodeId]);
      node.leftId = insertRec(node.leftId, val);
      addStep(operationLineMap.assignLeft, `Link left child of ${node.value}.`, [nodeId]);
    } else if (val > node.value) {
      addStep(operationLineMap.goRight, `Value ${val} > node ${node.value}. Go right.`, [nodeId]);
      node.rightId = insertRec(node.rightId, val);
      addStep(operationLineMap.assignRight, `Link right child of ${node.value}.`, [nodeId]);
    } else {
      addStep(0, `Value ${val} already exists. No insertion.`, [nodeId], {[nodeId]: NODE_COLORS.found});
    }
    currentPathNodeIds.pop();
    addStep(operationLineMap.returnNode, `Return from insertRec call for node ${node.value}.`, [nodeId]);
    return nodeId;
  }

  function searchRec(nodeId: string | null, val: number): string | null {
    currentPathNodeIds.push(nodeId!);
    addStep(operationLineMap.recFunc, `Search(${val}) at node ${nodeId ? workingNodes.get(nodeId)?.value : 'null'}. Path: ${currentPathNodeIds.join('->')}`, nodeId ? [nodeId] : []);

    if (nodeId === null || workingNodes.get(nodeId)?.value === val) {
      const foundColor = nodeId ? { [nodeId]: NODE_COLORS.found } : {};
      addStep(operationLineMap.baseCaseNullOrFound, nodeId ? `Value ${val} found.` : `Value ${val} not found (reached null).`, nodeId ? [nodeId] : [], foundColor);
      currentPathNodeIds.pop();
      return nodeId;
    }
    const node = workingNodes.get(nodeId)!;
    if (val < node.value) {
      addStep(operationLineMap.goLeft, `Value ${val} < node ${node.value}. Go left.`, [nodeId]);
      const result = searchRec(node.leftId, val);
      currentPathNodeIds.pop();
      addStep(operationLineMap.returnLeftSearch, `Return from left search for node ${node.value}.`, [nodeId]);
      return result;
    } else {
      addStep(operationLineMap.goRight, `Value ${val} > node ${node.value}. Go right.`, [nodeId]);
      const result = searchRec(node.rightId, val);
      currentPathNodeIds.pop();
      addStep(operationLineMap.returnRightSearch, `Return from right search for node ${node.value}.`, [nodeId]);
      return result;
    }
  }
  
  function minValueNode(nodeId: string): BSTNodeInternal {
    let current = workingNodes.get(nodeId)!;
    addStep(operationLineMap.helperMinValue, `Finding min value in subtree of ${current.value}.`, [current.id], {[current.id]: NODE_COLORS.successor});
    while (current.leftId !== null) {
      current = workingNodes.get(current.leftId)!;
      addStep(operationLineMap.loopMinLeft, `Current min candidate: ${current.value}.`, [current.id], {[current.id]: NODE_COLORS.successor});
    }
    addStep(operationLineMap.returnMin, `Min value in subtree is ${current.value}.`, [current.id], {[current.id]: NODE_COLORS.successor});
    return current;
  }

  function deleteRec(nodeId: string | null, val: number): string | null {
    currentPathNodeIds.push(nodeId!);
    addStep(operationLineMap.recFunc, `Delete(${val}) at node ${nodeId ? workingNodes.get(nodeId)?.value : 'null'}. Path: ${currentPathNodeIds.join('->')}`, nodeId ? [nodeId] : []);

    if (nodeId === null) {
      addStep(operationLineMap.baseCaseNull, `Value ${val} not found (reached null).`, []);
      currentPathNodeIds.pop();
      return null;
    }
    const node = workingNodes.get(nodeId)!;

    if (val < node.value) {
      addStep(operationLineMap.goLeft, `Value ${val} < node ${node.value}. Go left.`, [nodeId]);
      node.leftId = deleteRec(node.leftId, val);
      addStep(operationLineMap.assignLeft, `Update left child of ${node.value}.`, [nodeId]);
    } else if (val > node.value) {
      addStep(operationLineMap.goRight, `Value ${val} > node ${node.value}. Go right.`, [nodeId]);
      node.rightId = deleteRec(node.rightId, val);
      addStep(operationLineMap.assignRight, `Update right child of ${node.value}.`, [nodeId]);
    } else { // Node to be deleted found
      addStep(operationLineMap.nodeFound, `Node to delete (${val}) found.`, [nodeId], {[nodeId]: NODE_COLORS.toBeDeleted});
      if (node.leftId === null) {
        const rightChildId = node.rightId;
        addStep(operationLineMap.case1LeftNull, `Node has no left child. Return right child ${rightChildId ? workingNodes.get(rightChildId)?.value : 'null'}.`, [nodeId], {[nodeId]: NODE_COLORS.toBeDeleted});
        workingNodes.delete(nodeId); // Conceptually remove, visual update handles it
        currentPathNodeIds.pop();
        addStep(operationLineMap.returnRightChild, `Deleted. Return ${rightChildId ? workingNodes.get(rightChildId)?.value : 'null'}.`, rightChildId ? [rightChildId] : []);
        return rightChildId;
      }
      if (node.rightId === null) {
        const leftChildId = node.leftId;
        addStep(operationLineMap.case1RightNull, `Node has no right child. Return left child ${leftChildId ? workingNodes.get(leftChildId)?.value : 'null'}.`, [nodeId], {[nodeId]: NODE_COLORS.toBeDeleted});
        workingNodes.delete(nodeId);
        currentPathNodeIds.pop();
        addStep(operationLineMap.returnLeftChild, `Deleted. Return ${leftChildId ? workingNodes.get(leftChildId)?.value : 'null'}.`, leftChildId ? [leftChildId] : []);
        return leftChildId;
      }
      
      addStep(operationLineMap.case2TwoChildren, `Node has two children. Find inorder successor.`, [nodeId], {[nodeId]: NODE_COLORS.toBeDeleted});
      const successor = minValueNode(node.rightId); // Find min in right subtree
      addStep(operationLineMap.findMinValue, `Inorder successor is ${successor.value}.`, [successor.id], {[successor.id]: NODE_COLORS.successor});
      
      node.value = successor.value; // Copy successor's value
      workingNodes.set(nodeId, {...node}); // Update node in map with new value
      addStep(operationLineMap.copyMinValue, `Copied successor value ${successor.value} to node ${node.id}.`, [nodeId], {[nodeId]: NODE_COLORS.toBeDeleted, [successor.id]:NODE_COLORS.successor});

      addStep(operationLineMap.deleteInorderSuccessor, `Delete original inorder successor (${successor.value}) from right subtree.`, [node.rightId!]);
      node.rightId = deleteRec(node.rightId, successor.value); // Delete the successor
    }
    currentPathNodeIds.pop();
    addStep(operationLineMap.returnNode, `Return from deleteRec call for node ${node.value}.`, [nodeId]);
    return nodeId;
  }

  // ----- Operation Dispatch -----
  bstNodeIdCounter = Array.from(workingNodes.keys()).reduce((max, id) => Math.max(max, parseInt(id.split('-').pop() || '0')), 0) + 1;
  
  if (operation === 'build') {
    const valuesToInsert = parseBSTInput(initialValuesString || "");
    rootId = null; 
    workingNodes.clear();
    bstNodeIdCounter = 0; // Reset for fresh build
    operationLineMap = BST_OPERATION_LINE_MAPS.insert; // Use insert's line map for build steps
    addStep(null, `Building tree from: ${valuesToInsert.join(', ')}`);
    if (valuesToInsert.length > 0) {
      valuesToInsert.forEach(v => {
        currentPathNodeIds.length = 0;
        addStep(operationLineMap.mainFunc, `Main call: insert(${v})`, []);
        rootId = insertRec(rootId, v);
        addStep(operationLineMap.callRec, `Root is now ${rootId ? workingNodes.get(rootId)?.value : 'null'} after inserting ${v}.`, []);
      });
    }
    addStep(null, "Build complete.");
  } else if (value !== undefined) {
    currentPathNodeIds.length = 0; 
    addStep(operationLineMap.mainFunc, `Main call: ${operation}(${value})`, []);
    if (operation === 'insert') {
      rootId = insertRec(rootId, value);
      addStep(operationLineMap.callRec, `Root is now ${rootId ? workingNodes.get(rootId)?.value : 'null'} after ${operation} ${value}.`, []);
    } else if (operation === 'search') {
      searchRec(rootId, value);
    } else if (operation === 'delete') {
      rootId = deleteRec(rootId, value);
      addStep(operationLineMap.callRec, `Root is now ${rootId ? workingNodes.get(rootId)?.value : 'null'} after ${operation} ${value}.`, []);
    }
    addStep(null, `${operation} ${value} complete.`);
  } else {
     addStep(null, `Operation ${operation} initiated (no value).`);
  }

  currentBSTRef.current = { rootId, nodes: workingNodes };
  return localSteps;
};

