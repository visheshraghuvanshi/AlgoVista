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

export function parseTreeInput(input: string): (string | number | null)[] | null {
  if (input.trim() === '') return [];
  const values = input.split(',').map(valStr => {
    const trimmed = valStr.trim();
    if (trimmed.toLowerCase() === 'null' || trimmed === '') return null;
    const num = Number(trimmed);
    if (isNaN(num)) throw new Error(`Invalid number in tree input: ${trimmed}`);
    if (num > 999 || num < -999) throw new Error(`Node value out of range (-999 to 999): ${num}`);
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
  let rootId: string | null = null;

  const tempNodes: ({ value: string | number | null, id: string, leftId?: string, rightId?: string, depth: number, horizontalPos: number })[] = [];

  // First pass: create node objects with basic info
  values.forEach((value, index) => {
    if (value !== null) {
      tempNodes[index] = { value, id: `node-${index}`, depth: 0, horizontalPos: 0 };
    }
  });

  if (tempNodes[0]) rootId = tempNodes[0].id;

  // Calculate depth and horizontal position for layout (simple binary tree layout)
  const calculatePositions = (index: number, depth: number, xOffset: number, siblingCountAtLevel: number) => {
    if (!tempNodes[index]) return;

    tempNodes[index].depth = depth;
    
    // Basic X positioning: center root, then spread children
    // This is a very simplified layout algorithm
    const levelWidth = Math.pow(2, depth) * 60; // Approximate width needed at this level
    const nodeSpacing = levelWidth / (Math.pow(2, depth));
    
    let currentX = xOffset;
    if (depth > 0) {
       const parentIndex = Math.floor((index - 1) / 2);
       if(tempNodes[parentIndex]){
            const isLeftChild = (2 * parentIndex + 1) === index;
            currentX = tempNodes[parentIndex].horizontalPos + (isLeftChild ? -nodeSpacing / (depth +1) : nodeSpacing/ (depth+1));
       }
    }
    tempNodes[index].horizontalPos = currentX;


    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;

    if (leftChildIndex < values.length && tempNodes[leftChildIndex]) {
      calculatePositions(leftChildIndex, depth + 1, currentX, Math.pow(2, depth+1));
      tempNodes[index].leftId = tempNodes[leftChildIndex].id;
      visualEdges.push({
        id: `edge-${tempNodes[index].id}-${tempNodes[leftChildIndex].id}`,
        sourceId: tempNodes[index].id,
        targetId: tempNodes[leftChildIndex].id,
        color: "hsl(var(--muted-foreground))",
      });
    }
    if (rightChildIndex < values.length && tempNodes[rightChildIndex]) {
      calculatePositions(rightChildIndex, depth + 1, currentX, Math.pow(2, depth+1));
      tempNodes[index].rightId = tempNodes[rightChildIndex].id;
      visualEdges.push({
        id: `edge-${tempNodes[index].id}-${tempNodes[rightChildIndex].id}`,
        sourceId: tempNodes[index].id,
        targetId: tempNodes[rightChildIndex].id,
        color: "hsl(var(--muted-foreground))",
      });
    }
  };
  
  if (tempNodes[0]) calculatePositions(0, 0, 250, 1); // Start with root at (250, some_y)

  // Convert to BinaryTreeNodeVisual
  tempNodes.forEach(tn => {
    if (tn) { // Ensure tn is not undefined (sparse array from values with nulls)
        visualNodes.push({
            id: tn.id,
            value: tn.value,
            x: tn.horizontalPos, // Use calculated horizontalPos
            y: 50 + tn.depth * 60, // Y based on depth
            color: NODE_COLORS.default,
            leftId: tn.leftId,
            rightId: tn.rightId,
        });
    }
  });


  return { nodes: visualNodes, edges: visualEdges, rootId };
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
             (traversalPath.includes(n.value!) ? NODE_COLORS.visited : NODE_COLORS.default) // simplified visited check
    }));
    localSteps.push({
      nodes: stepNodes,
      edges: initialEdges, // Edges don't change color in this simple version
      traversalPath: [...traversalPath],
      currentLine: line,
      message: message || (currentProcessingNodeId ? `Processing node ${nodesMap.get(currentProcessingNodeId)?.value}` : "Traversal step"),
      currentProcessingNodeId,
    });
  }
  
  addStep(null, lineMap.funcDeclare, `Starting ${traversalType} traversal.`);

  function doTraversal(nodeId: string | null | undefined) {
    if (!nodeId) {
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
      addStep(node.id, lineMap.visitNode, `Path: ${traversalPath.join(', ')}`);
    }

    if (node.leftId) {
      addStep(node.id, lineMap.recursiveLeft, `Recursive call on left child of ${node.value}.`);
      doTraversal(node.leftId);
      addStep(node.id, lineMap.recursiveLeft, `Returned from left child of ${node.value}.`);
    }

    if (traversalType === TRAVERSAL_TYPES.INORDER) {
      addStep(node.id, lineMap.visitNode, `Visit node ${node.value}.`);
      traversalPath.push(node.value!);
      addStep(node.id, lineMap.visitNode, `Path: ${traversalPath.join(', ')}`);
    }

    if (node.rightId) {
      addStep(node.id, lineMap.recursiveRight, `Recursive call on right child of ${node.value}.`);
      doTraversal(node.rightId);
      addStep(node.id, lineMap.recursiveRight, `Returned from right child of ${node.value}.`);
    }

    if (traversalType === TRAVERSAL_TYPES.POSTORDER) {
      addStep(node.id, lineMap.visitNode, `Visit node ${node.value}.`);
      traversalPath.push(node.value!);
      addStep(node.id, lineMap.visitNode, `Path: ${traversalPath.join(', ')}`);
    }
    addStep(node.id, lineMap.funcEnd, `Finished processing node ${node.value}.`);
  }

  if (rootId) {
    doTraversal(rootId);
  } else {
    addStep(null, lineMap.baseCase, "Tree is empty.");
  }
  
  addStep(null, lineMap.funcEnd, `${traversalType} traversal complete. Final path: ${traversalPath.join(', ')}`);
  return localSteps;
};
