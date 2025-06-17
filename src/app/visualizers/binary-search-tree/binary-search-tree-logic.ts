
import type { BinaryTreeNodeVisual, BinaryTreeEdgeVisual, TreeAlgorithmStep } from '@/types';

export type BSTOperationType = 'insert' | 'search' | 'delete' | 'build'; // 'build' is an internal op

// Line maps for each operation
export const BST_OPERATION_LINE_MAPS: Record<BSTOperationType, Record<string, number>> = {
  build: { /* No specific lines for simple build via repeated inserts */ },
  insert: {
    func: 1, baseCase: 2, goLeft: 3, goRight: 4, returnNode: 5,
  },
  search: {
    func: 1, baseCaseNull: 2, baseCaseFound: 3, goLeft: 4, goRight: 5,
  },
  delete: {
    func: 1, baseCaseNull: 2, goLeft: 3, goRight: 4, nodeFound: 5,
    caseNoChildOrOneChildLeft: 6, caseNoChildOrOneChildRight: 7,
    caseTwoChildren: 8, getMinValue: 9, deleteSuccessor: 10, returnNode: 11,
  },
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  visiting: "hsl(var(--primary))", // Node being compared or focused
  found: "hsl(var(--accent))",     // Node found (search/delete target)
  inserted: "hsl(var(--accent))", // Newly inserted node
  deleted: "hsl(var(--destructive))", // Node marked for deletion (conceptually)
  path: "hsl(var(--primary)/0.7)", // Nodes on the path to target
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
  // Visual properties will be added when creating TreeAlgorithmStep
}

// Parses initial comma-separated string for 'build' or single value for other ops
export function parseBSTInput(inputStr: string): number[] {
  if (inputStr.trim() === '') return [];
  return inputStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
}

// Helper to build the visual nodes and edges from the current internal BST structure for a step
export function buildBSTNodesAndEdgesFromSteps(
  nodes: BinaryTreeNodeVisual[] // Assuming steps directly provide visual nodes
): { rootId: string | null, nodes: Map<string, { value: number, leftId: string | null, rightId: string | null }> } {
    const internalNodesMap = new Map<string, { value: number, leftId: string | null, rightId: string | null }>();
    let rootId: string | null = null;

    if (nodes.length > 0) {
        // Find the root: usually the first node if built level-order, or the one with no parent conceptually
        // This part is tricky without parent pointers or a clear root indicator in the input `nodes`
        // For BST, the step generation logic should maintain the rootId.
        // Here, we reconstruct based on the `nodes` array passed, assuming it represents a valid tree state.
        // The `generateBSTSteps` will handle root tracking. This function is more for if we only have visual nodes.
        
        // A simplified assumption: if nodes are somehow ordered, first could be root.
        // This function's main purpose is to convert visual nodes back to an internal-like map if needed,
        // but for BST, it's better if `generateBSTSteps` directly manipulates and returns the internal structure.
        // For now, let's assume the `generateBSTSteps` will provide `bstStructureRef.current` which holds the true root.
        // This function might not be directly used if `generateBSTSteps` directly updates `bstStructureRef.current.nodes`.
    }
    // This function is more conceptual if visual nodes are primary. For BST, `bstStructureRef` in `page.tsx`
    // will hold the actual structure. This function is a placeholder if needed for other contexts.
    
    // A better way is for generateBSTSteps to manage the internal structure and this function to
    // purely convert that internal structure (passed to it) to visual nodes.
    // Let's redefine: it takes internal map and rootId, returns visual nodes.

    // Let's assume the calling function (generateBSTSteps) maintains the bstStructure (map of internal nodes and rootId)
    // This function would then be:
    // export function layoutBST(internalNodesMap, rootId, activeNodeId, pathNodeIds): { nodes: BinaryTreeNodeVisual[], edges: BinaryTreeEdgeVisual[] } { ... }
    // The current step object in `generateBSTSteps` will directly contain the `nodes` and `edges` for visualization.
    // So, this function might be redundant if steps are well-formed.

    // Let's refine its purpose: given a flat list of visual nodes, derive an internal map.
    // This is generally not how it should work; the logic should drive the visual.
    // Assume `generateBSTSteps` will build the `nodes` and `edges` arrays directly for each step.
    // This helper is thus not strictly needed in that flow.

    // For the sake of completing the structure, let's assume generateBSTSteps provides the internal map.
    // And this function (or a similar one in logic.ts) would create Visuals.
    // The current structure of TreeAlgorithmStep means `nodes` and `edges` are already visual.
    
    // This function becomes more of a utility to get the current state of internal nodes if needed from visual.
    // However, it's better if the logic file maintains the true state.

    // Let's assume this is about finding the root from a flat list of visual nodes.
    // This is non-trivial without parent pointers or specific root markers.
    // For our BST, `bstStructureRef.current.rootId` will be the source of truth for the root.

    // This function is not strictly needed if `generateBSTSteps` properly creates the visual `nodes` and `edges` for each step.
    // The `bstStructureRef` in `page.tsx` will hold the "true" state.

    return { rootId: null, nodes: internalNodesMap }; // Placeholder if not fully utilized as described.
}


// Main step generation logic
export const generateBSTSteps = (
  currentBST: { rootId: string | null, nodes: Map<string, BSTNodeInternal> },
  operation: BSTOperationType,
  value?: number, // For insert, search, delete
  initialValuesString?: string // For 'build' operation
): TreeAlgorithmStep[] => {
  const localSteps: TreeAlgorithmStep[] = [];
  const lineMap = BST_OPERATION_LINE_MAPS[operation];

  // Clone the current BST structure to modify it for the operation
  const nodes = new Map(currentBST.nodes.forEach((v,k) => new Map().set(k, {...v}))); // Deep clone needed
  // A proper deep clone for the map values:
  const workingNodes = new Map<string, BSTNodeInternal>();
  currentBST.nodes.forEach((node, id) => {
    workingNodes.set(id, { ...node });
  });
  let rootId = currentBST.rootId;
  
  // Path tracking for visualization (node IDs on the current operation path)
  const pathNodeIds: string[] = [];
  
  // ----- Layout function (simple top-down) -----
  function getLayout(currentRootId: string | null, currentNodesMap: Map<string, BSTNodeInternal>): { visualNodes: BinaryTreeNodeVisual[], visualEdges: BinaryTreeEdgeVisual[] } {
    const visualNodes: BinaryTreeNodeVisual[] = [];
    const visualEdges: BinaryTreeEdgeVisual[] = [];
    if (!currentRootId) return { visualNodes, visualEdges };

    const placeNodes = (nodeId: string | null, x: number, y: number, xOffset: number) => {
      if (!nodeId || !currentNodesMap.has(nodeId)) return;
      const node = currentNodesMap.get(nodeId)!;
      
      let color = NODE_COLORS.default;
      if (pathNodeIds.includes(nodeId)) color = NODE_COLORS.path;
      // Operation-specific coloring will be overlaid in addStep

      visualNodes.push({ id: nodeId, value: node.value, x, y, color, leftId: node.leftId, rightId: node.rightId });

      if (node.leftId) {
        const leftChild = currentNodesMap.get(node.leftId)!;
        const newX = x - xOffset;
        const newY = y + 60;
        visualEdges.push({ id: `edge-${nodeId}-${node.leftId}`, sourceId: nodeId, targetId: node.leftId, color: pathNodeIds.includes(nodeId) && pathNodeIds.includes(node.leftId) ? EDGE_COLORS.path : EDGE_COLORS.default });
        placeNodes(node.leftId, newX, newY, xOffset / 2);
      }
      if (node.rightId) {
        const rightChild = currentNodesMap.get(node.rightId)!;
        const newX = x + xOffset;
        const newY = y + 60;
        visualEdges.push({ id: `edge-${nodeId}-${node.rightId}`, sourceId: nodeId, targetId: node.rightId, color: pathNodeIds.includes(nodeId) && pathNodeIds.includes(node.rightId) ? EDGE_COLORS.path : EDGE_COLORS.default});
        placeNodes(node.rightId, newX, newY, xOffset / 2);
      }
    };
    placeNodes(currentRootId, 300, 50, 100); // Initial call: (root, x, y, x_offset_for_children)
    return { visualNodes, visualEdges };
  }
  
  // ----- Add Step Helper -----
  function addStep(lMapEntry: number | null, message: string, activeNodeId?: string | null, specialNodeId?: string | null, specialColor?: string) {
    let { visualNodes, visualEdges } = getLayout(rootId, workingNodes);

    if (activeNodeId) {
        const node = visualNodes.find(n => n.id === activeNodeId);
        if (node) node.color = NODE_COLORS.visiting;
    }
    if (specialNodeId && specialColor) {
        const node = visualNodes.find(n => n.id === specialNodeId);
        if (node) node.color = specialColor;
    }

    localSteps.push({
      nodes: visualNodes,
      edges: visualEdges,
      traversalPath: [...pathNodeIds], // Using traversalPath to show search/insert path
      currentLine: lMapEntry,
      message,
      currentProcessingNodeId: activeNodeId,
    });
  }

  // ----- Insert Operation -----
  function insertRec(nodeId: string | null, val: number): string | null {
    pathNodeIds.push(nodeId!); // Add to path even if null initially for root call
    const currentLineMap = BST_OPERATION_LINE_MAPS.insert;
    addStep(currentLineMap.func, `insertRec(${nodeId ? workingNodes.get(nodeId)?.value : 'null'}, ${val})`, nodeId);
    
    if (nodeId === null || !workingNodes.has(nodeId)) {
      const newNodeId = generateBSTNodeId(val);
      workingNodes.set(newNodeId, { id: newNodeId, value: val, leftId: null, rightId: null });
      addStep(currentLineMap.baseCase, `Base case: Create new node ${val}`, null, newNodeId, NODE_COLORS.inserted);
      pathNodeIds.pop();
      return newNodeId;
    }

    const node = workingNodes.get(nodeId)!;
    if (val < node.value) {
      addStep(currentLineMap.goLeft, `Value ${val} < ${node.value}. Go left.`, nodeId);
      node.leftId = insertRec(node.leftId, val);
    } else if (val > node.value) {
      addStep(currentLineMap.goRight, `Value ${val} > ${node.value}. Go right.`, nodeId);
      node.rightId = insertRec(node.rightId, val);
    } else {
      // Value already exists, do nothing or update. For simplicity, do nothing.
      addStep(0, `Value ${val} already exists. No insertion.`, nodeId);
    }
    addStep(currentLineMap.returnNode, `Return from insertRec(${node.value})`, nodeId);
    pathNodeIds.pop();
    return nodeId;
  }

  // ----- Search Operation -----
  function searchRec(nodeId: string | null, val: number): string | null {
    pathNodeIds.push(nodeId!);
    const currentLineMap = BST_OPERATION_LINE_MAPS.search;
    addStep(currentLineMap.func, `searchRec(${nodeId ? workingNodes.get(nodeId)?.value : 'null'}, ${val})`, nodeId);

    if (nodeId === null || !workingNodes.has(nodeId)) {
      addStep(currentLineMap.baseCaseNull, `Base case: Not found. Reached null.`, nodeId);
      pathNodeIds.pop();
      return null;
    }
    const node = workingNodes.get(nodeId)!;
    if (node.value === val) {
      addStep(currentLineMap.baseCaseFound, `Found value ${val}.`, nodeId, nodeId, NODE_COLORS.found);
      pathNodeIds.pop();
      return nodeId;
    }
    if (val < node.value) {
      addStep(currentLineMap.goLeft, `Value ${val} < ${node.value}. Go left.`, nodeId);
      const result = searchRec(node.leftId, val);
      pathNodeIds.pop();
      return result;
    } else {
      addStep(currentLineMap.goRight, `Value ${val} > ${node.value}. Go right.`, nodeId);
      const result = searchRec(node.rightId, val);
      pathNodeIds.pop();
      return result;
    }
  }
  
  // ----- Delete Operation -----
  function findMinValueNode(nodeId: string): BSTNodeInternal {
      let current = workingNodes.get(nodeId)!;
      while(current.leftId !== null && workingNodes.has(current.leftId)) {
          current = workingNodes.get(current.leftId)!;
      }
      return current;
  }

  function deleteRec(nodeId: string | null, val: number): string | null {
    pathNodeIds.push(nodeId!);
    const currentLineMap = BST_OPERATION_LINE_MAPS.delete;
    addStep(currentLineMap.func, `deleteRec(${nodeId ? workingNodes.get(nodeId)?.value : 'null'}, ${val})`, nodeId);

    if (nodeId === null || !workingNodes.has(nodeId)) {
        addStep(currentLineMap.baseCaseNull, `Value ${val} not found (reached null).`, nodeId);
        pathNodeIds.pop();
        return null;
    }
    let node = workingNodes.get(nodeId)!;

    if (val < node.value) {
        addStep(currentLineMap.goLeft, `Value ${val} < ${node.value}. Go left.`, nodeId);
        node.leftId = deleteRec(node.leftId, val);
    } else if (val > node.value) {
        addStep(currentLineMap.goRight, `Value ${val} > ${node.value}. Go right.`, nodeId);
        node.rightId = deleteRec(node.rightId, val);
    } else { // Node to delete found
        addStep(currentLineMap.nodeFound, `Node to delete found: ${node.value}`, nodeId, nodeId, NODE_COLORS.deleted);
        if (node.leftId === null) {
            addStep(currentLineMap.caseNoChildOrOneChildRight, `Node has no left child. Return right child.`, nodeId);
            const rightChildId = node.rightId;
            workingNodes.delete(nodeId); // Remove node
            pathNodeIds.pop();
            return rightChildId;
        }
        if (node.rightId === null) {
            addStep(currentLineMap.caseNoChildOrOneChildLeft, `Node has no right child. Return left child.`, nodeId);
            const leftChildId = node.leftId;
            workingNodes.delete(nodeId); // Remove node
            pathNodeIds.pop();
            return leftChildId;
        }
        
        // Node with two children
        addStep(currentLineMap.caseTwoChildren, `Node has two children. Find inorder successor.`, nodeId);
        const successor = findMinValueNode(node.rightId!);
        addStep(currentLineMap.getMinValue, `Inorder successor is ${successor.value}`, successor.id, successor.id, NODE_COLORS.found);
        
        node.value = successor.value; // Copy successor's value to this node
        workingNodes.set(nodeId, node); // Update node in map
        addStep(currentLineMap.getMinValue, `Copied successor value ${successor.value} to node ${node.id}`, nodeId);

        addStep(currentLineMap.deleteSuccessor, `Delete inorder successor ${successor.value} from right subtree.`, node.rightId);
        node.rightId = deleteRec(node.rightId, successor.value); // Delete the successor
    }
    addStep(currentLineMap.returnNode, `Return from deleteRec for subtree rooted at ${node.value}`, nodeId);
    pathNodeIds.pop();
    return nodeId;
  }


  // ----- Operation Dispatch -----
  bstNodeIdCounter = 0; // Reset ID counter for deterministic IDs per operation run
  if (operation === 'build') {
    const valuesToInsert = parseBSTInput(initialValuesString || "");
    rootId = null; // Start with an empty tree for build
    workingNodes.clear();
    addStep(null, `Building tree from: ${valuesToInsert.join(', ')}`);
    valuesToInsert.forEach(v => {
      pathNodeIds.length = 0; // Clear path for each insert
      rootId = insertRec(rootId, v);
    });
    addStep(null, "Build complete.");
    currentBST.rootId = rootId; // Update the ref in page.tsx
    currentBST.nodes = new Map(workingNodes);
  } else if (value !== undefined) {
    pathNodeIds.length = 0; // Clear path for the operation
    if (operation === 'insert') {
      addStep(null, `Starting Insert: ${value}`);
      rootId = insertRec(rootId, value);
      currentBST.rootId = rootId; // Update ref
      currentBST.nodes = new Map(workingNodes);
      addStep(null, `Insert ${value} complete.`);
    } else if (operation === 'search') {
      addStep(null, `Starting Search: ${value}`);
      searchRec(rootId, value);
      addStep(null, `Search for ${value} complete.`);
    } else if (operation === 'delete') {
      addStep(null, `Starting Delete: ${value}`);
      rootId = deleteRec(rootId, value);
      currentBST.rootId = rootId; // Update ref
      currentBST.nodes = new Map(workingNodes);
      addStep(null, `Delete ${value} complete.`);
    }
  }

  return localSteps;
};
