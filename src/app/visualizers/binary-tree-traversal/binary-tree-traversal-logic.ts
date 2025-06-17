import type { BinaryTreeNodeVisual, BinaryTreeEdgeVisual, TreeAlgorithmStep } from '@/types';

export const TRAVERSAL_TYPES = {
  INORDER: 'inorder',
  PREORDER: 'preorder',
  POSTORDER: 'postorder',
} as const;

export type TraversalType = typeof TRAVERSAL_TYPES[keyof typeof TRAVERSAL_TYPES];

export const TRAVERSAL_LINE_MAPS: Record<TraversalType, Record<string, number>> = {
  [TRAVERSAL_TYPES.INORDER]: {
    funcDeclare: 1,
    baseCase: 2,
    recursiveLeft: 3,
    visitNode: 4,
    recursiveRight: 5,
    funcEnd: 6,
  },
  [TRAVERSAL_TYPES.PREORDER]: {
    funcDeclare: 1,
    baseCase: 2,
    visitNode: 3,
    recursiveLeft: 4,
    recursiveRight: 5,
    funcEnd: 6,
  },
  [TRAVERSAL_TYPES.POSTORDER]: {
    funcDeclare: 1,
    baseCase: 2,
    recursiveLeft: 3,
    recursiveRight: 4,
    visitNode: 5,
    funcEnd: 6,
  },
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  visiting: "hsl(var(--primary))",
  visited: "hsl(var(--muted-foreground))",
};

// Node ID generation can be simpler if values are unique and small, or use a counter
let globalNodeIdCounter = 0;
const generateNodeIdForTree = (value: string | number | null, index: number): string => {
  if (value === null) return `null-${index}-${globalNodeIdCounter++}`;
  return `node-${String(value).replace(/[^a-zA-Z0-9-_]/g, '')}-${index}-${globalNodeIdCounter++}`; // Sanitize value for ID
}

export function parseTreeInput(input: string): (string | number | null)[] | null {
  if (input.trim() === '') return [];
  globalNodeIdCounter = 0; // Reset counter for each parse
  const values = input.split(',').map(valStr => {
    const trimmed = valStr.trim();
    if (trimmed.toLowerCase() === 'null' || trimmed === '') return null;
    const num = Number(trimmed);
    // Keep as string if NaN, otherwise use number
    if (isNaN(num)) { 
        if (trimmed.length > 10) throw new Error(`Node value string too long (max 10 chars): "${trimmed}"`);
        return trimmed;
    }
    if (num > 9999 || num < -9999) throw new Error(`Node value out of range (-9999 to 9999): ${num}`);
    return num;
  });
  return values;
}

export function buildTreeNodesAndEdges(
  values: (string | number | null)[]
): { nodes: BinaryTreeNodeVisual[], edges: BinaryTreeEdgeVisual[], rootId: string | null } {
  if (!values || values.length === 0 || values[0] === null) {
    return { nodes: [], edges: [], rootId: null };
  }

  const visualNodes: BinaryTreeNodeVisual[] = [];
  const visualEdges: BinaryTreeEdgeVisual[] = [];
  
  const rootValue = values[0];
  const rootId = generateNodeIdForTree(rootValue,0);
  
  const nodesToProcess: { id: string; value: string | number | null; index: number; depth: number; x: number, xRange: [number, number] }[] = [];
  if(rootValue !== null) { // Check if rootValue itself is null
      nodesToProcess.push({ id: rootId, value: rootValue, index: 0, depth: 0, x: 300, xRange: [0, 600] });
      visualNodes.push({ id: rootId, value: rootValue, x: 300, y: 50, color: NODE_COLORS.default, leftId: null, rightId: null });
  } else {
       return { nodes: [], edges: [], rootId: null }; // Tree is effectively empty if root is null
  }


  let head = 0;
  while(head < nodesToProcess.length){
      const current = nodesToProcess[head++];
      if(!current || current.value === null) continue; // Skip if current node is null conceptually

      const leftChildIndex = 2 * current.index + 1;
      const rightChildIndex = 2 * current.index + 2;
      const Y_SPACING = 70; // Increased spacing
      const X_BASE_OFFSET_FACTOR = 0.7; // Factor to control spread

      const childrenAtThisLevel = Math.pow(2, current.depth + 1);
      const spacePerChild = (current.xRange[1] - current.xRange[0]) / childrenAtThisLevel;
      const childXOffset = spacePerChild * X_BASE_OFFSET_FACTOR * (childrenAtThisLevel / 2);


      if (leftChildIndex < values.length && values[leftChildIndex] !== null) {
          const leftVal = values[leftChildIndex];
          const leftId = generateNodeIdForTree(leftVal, leftChildIndex);
          const childX = current.x - childXOffset;
          const childY = (current.depth + 1) * Y_SPACING + 50;
          
          visualNodes.push({ id: leftId, value: leftVal, x: childX, y: childY, color: NODE_COLORS.default, leftId: null, rightId: null });
          const currentVisualNode = visualNodes.find(n => n.id === current.id);
          if(currentVisualNode) currentVisualNode.leftId = leftId;
          
          visualEdges.push({id: `edge-${current.id}-${leftId}`, sourceId: current.id, targetId: leftId, color: "hsl(var(--muted-foreground))"});
          nodesToProcess.push({id: leftId, value: leftVal, index: leftChildIndex, depth: current.depth + 1, x: childX, xRange: [current.xRange[0], current.x]});
      }

      if (rightChildIndex < values.length && values[rightChildIndex] !== null) {
          const rightVal = values[rightChildIndex];
          const rightId = generateNodeIdForTree(rightVal, rightChildIndex);
          const childX = current.x + childXOffset;
          const childY = (current.depth + 1) * Y_SPACING + 50;

          visualNodes.push({id: rightId, value: rightVal, x: childX, y: childY, color: NODE_COLORS.default, leftId: null, rightId: null});
          const currentVisualNode = visualNodes.find(n => n.id === current.id);
          if(currentVisualNode) currentVisualNode.rightId = rightId;

          visualEdges.push({id: `edge-${current.id}-${rightId}`, sourceId: current.id, targetId: rightId, color: "hsl(var(--muted-foreground))"});
          nodesToProcess.push({id: rightId, value: rightVal, index: rightChildIndex, depth: current.depth + 1, x: childX, xRange: [current.x, current.xRange[1]]});
      }
  }
  // Simple centering adjustment based on actual node positions
    if (visualNodes.length > 0) {
        const minX = Math.min(...visualNodes.map(n => n.x));
        const maxX = Math.max(...visualNodes.map(n => n.x));
        const treeWidth = maxX - minX;
        const currentCenterX = minX + treeWidth / 2;
        const desiredCenterX = 300; // SVG center
        const shiftX = desiredCenterX - currentCenterX;

        visualNodes.forEach(node => {
            node.x += shiftX;
        });
    }

  return { nodes: visualNodes, edges: visualEdges, rootId: visualNodes[0]?.id || null };
}


export const generateTraversalSteps = (
  initialNodes: BinaryTreeNodeVisual[],
  initialEdges: BinaryTreeEdgeVisual[],
  rootId: string | null,
  traversalType: TraversalType
): TreeAlgorithmStep[] => {
  const localSteps: TreeAlgorithmStep[] = [];
  const traversalPath: (string | number)[] = [];
  const lineMap = TRAVERSAL_LINE_MAPS[traversalType];

  const nodesMap = new Map(initialNodes.map(n => [n.id, n]));

  function addStep(currentProcessingNodeId: string | null, line: number, message?: string) {
    const stepNodes = initialNodes.map(n => ({
      ...n,
      color: n.id === currentProcessingNodeId ? NODE_COLORS.visiting : 
             (traversalPath.includes(n.value!) ? NODE_COLORS.visited : NODE_COLORS.default)
    }));
    localSteps.push({
      nodes: stepNodes,
      edges: initialEdges, 
      traversalPath: [...traversalPath],
      currentLine: line,
      message: message || (currentProcessingNodeId ? `Processing node ${nodesMap.get(currentProcessingNodeId)?.value}` : "Traversal step"),
      currentProcessingNodeId,
    });
  }
  
  addStep(null, lineMap.funcDeclare, `Starting ${traversalType} traversal.`);

  function doTraversal(nodeId: string | null | undefined) {
    if (!nodeId || nodeId.startsWith('null-')) { 
      addStep(null, lineMap.baseCase, "Base case: Node is null, returning.");
      return;
    }
    const node = nodesMap.get(nodeId);
    if(!node) {
        addStep(null, lineMap.baseCase, `Base case: Node with id ${nodeId} not found, returning.`);
        return;
    }

    addStep(node.id, lineMap.funcDeclare, `Called ${traversalType} on node ${node.value}`);

    if (traversalType === TRAVERSAL_TYPES.PREORDER) {
      addStep(node.id, lineMap.visitNode, `Visit node ${node.value}.`);
      traversalPath.push(node.value!);
      addStep(node.id, lineMap.visitNode, `Path: ${traversalPath.join(' \u2192 ')}`);
    }

    if (node.leftId) {
      addStep(node.id, lineMap.recursiveLeft, `Recursive call on left child of ${node.value}.`);
      doTraversal(node.leftId);
      addStep(node.id, lineMap.recursiveLeft, `Returned from left child of ${node.value}.`);
    }

    if (traversalType === TRAVERSAL_TYPES.INORDER) {
      addStep(node.id, lineMap.visitNode, `Visit node ${node.value}.`);
      traversalPath.push(node.value!);
      addStep(node.id, lineMap.visitNode, `Path: ${traversalPath.join(' \u2192 ')}`);
    }

    if (node.rightId) {
      addStep(node.id, lineMap.recursiveRight, `Recursive call on right child of ${node.value}.`);
      doTraversal(node.rightId);
      addStep(node.id, lineMap.recursiveRight, `Returned from right child of ${node.value}.`);
    }

    if (traversalType === TRAVERSAL_TYPES.POSTORDER) {
      addStep(node.id, lineMap.visitNode, `Visit node ${node.value}.`);
      traversalPath.push(node.value!);
      addStep(node.id, lineMap.visitNode, `Path: ${traversalPath.join(' \u2192 ')}`);
    }
    addStep(node.id, lineMap.funcEnd, `Finished processing node ${node.value}.`);
  }

  if (rootId && !rootId.startsWith('null-')) {
    doTraversal(rootId);
  } else {
    addStep(null, lineMap.baseCase, "Tree is empty or root is null.");
  }
  
  addStep(null, lineMap.funcEnd, `${traversalType} traversal complete. Final path: ${traversalPath.join(' \u2192 ')}`);
  return localSteps;
};

