
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from './types';
// Re-use tree parsing and initial building logic
import { parseTreeInput, buildTreeNodesAndEdges as initialBuildTree } from '@/app/visualizers/binary-tree-traversal/binary-tree-traversal-logic';

export const MORRIS_INORDER_LINE_MAP = {
  funcDeclare: 1,
  initCurrentAndResult: 2,
  whileCurrentNotNull: 3,
  ifLeftChildNull: 4,
  visitCurrentNoLeft: 5,
  moveRightNoLeft: 6,
  elseHasLeftChild: 7, // Conceptual start of else block
  findPredecessorStart: 8,
  predecessorLoopCondition: 9,
  predecessorMoveRight: 10,
  ifThreadNull: 11, // No thread yet
  makeThread: 12,
  currentMoveLeft: 13,
  elseThreadExists: 14, // Thread exists
  removeThread: 15,
  visitCurrentThreaded: 16,
  currentMoveRightThreaded: 17,
  whileLoopEnd: 18, // End of main while
  returnResult: 19,
  funcEnd: 20,
};

let morrisNodeIdCounter = 0; // Keep local counter if tree building IDs conflict
const generateMorrisNodeId = (value: string | number | null, index: number): string => {
  if (value === null) return `morris-null-${index}-${morrisNodeIdCounter++}`;
  return `morris-node-${String(value).replace(/[^a-zA-Z0-9-_]/g, '')}-${index}-${morrisNodeIdCounter++}`;
}

interface MorrisNodeInternal {
  id: string;
  value: string | number;
  leftId: string | null;
  rightId: string | null;
  originalRightId?: string | null; // To store original right child when a thread is made
}

// Global state for step generation
let localSteps: TreeAlgorithmStep[];
let treeNodesInternalMap: Map<string, MorrisNodeInternal>;
let treeRootIdInternal: string | null;
let inorderResult: (string | number)[];

function mapMorrisTreeToVisual(
  activeCurrentId?: string | null,
  activePredecessorId?: string | null
): { visualNodes: BinaryTreeNodeVisual[], visualEdges: BinaryTreeEdgeVisual[] } {
  const visualNodes: BinaryTreeNodeVisual[] = [];
  const visualEdges: BinaryTreeEdgeVisual[] = [];
  if (!treeRootIdInternal || !treeNodesInternalMap.has(treeRootIdInternal)) return { visualNodes, visualEdges };

  const X_SPACING_BASE = 60; 
  const Y_SPACING = 70;
  const SVG_WIDTH = 600;

  function positionNode(nodeId: string, x: number, y: number, xOffsetMultiplier: number, depth: number) {
    const node = treeNodesInternalMap.get(nodeId);
    if (!node) return;

    let color = "hsl(var(--secondary))";
    let textColor = "hsl(var(--secondary-foreground))";
    if (nodeId === activeCurrentId) { color = "hsl(var(--primary))"; textColor = "hsl(var(--primary-foreground))"; }
    else if (nodeId === activePredecessorId) { color = "hsl(var(--accent))"; textColor = "hsl(var(--accent-foreground))"; }
    else if (inorderResult.includes(node.value)) { color = "hsl(var(--muted-foreground))"; textColor = "hsl(var(--muted-foreground))"; }


    visualNodes.push({
      id: nodeId, value: node.value, x, y, color, textColor,
      leftId: node.leftId || null, rightId: node.rightId || null,
      isCurrent: nodeId === activeCurrentId,
      isPredecessor: nodeId === activePredecessorId
    });

    const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.6, depth);

    if (node.leftId && treeNodesInternalMap.has(node.leftId)) {
      visualEdges.push({ id: `edge-${nodeId}-${node.leftId}`, sourceId: nodeId, targetId: node.leftId, color: "hsl(var(--muted-foreground))" });
      positionNode(node.leftId, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
    }
    // For rightId, check if it's a thread or a normal child
    if (node.rightId && treeNodesInternalMap.has(node.rightId)) {
        const isThread = node.originalRightId !== undefined && node.rightId !== node.originalRightId;
        visualEdges.push({ 
            id: `edge-${nodeId}-${node.rightId}`, sourceId: nodeId, targetId: node.rightId, 
            color: isThread ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))",
            isThread: isThread
        });
        if(!isThread) { // Only recurse if it's not a thread pointing upwards
             positionNode(node.rightId, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
        } else if (isThread && node.rightId === activeCurrentId) {
            // Special case: if thread points to current, draw it, but don't recurse layout
        }
    }
  }
  positionNode(treeRootIdInternal, SVG_WIDTH / 2, 50, 0.8, 0);

  if (visualNodes.length > 0) {
        const minX = Math.min(...visualNodes.map(n => n.x).filter(x => x !== undefined && !isNaN(x)));
        const maxX = Math.max(...visualNodes.map(n => n.x).filter(x => x !== undefined && !isNaN(x)));
        if(isFinite(minX) && isFinite(maxX)) {
            const treeWidth = maxX - minX;
            const currentCenterX = minX + treeWidth / 2;
            const desiredCenterX = SVG_WIDTH / 2;
            const shiftX = desiredCenterX - currentCenterX;
            let scaleFactor = 1;
            if (treeWidth > SVG_WIDTH * 0.95 && treeWidth > 0) { 
                scaleFactor = (SVG_WIDTH * 0.95) / treeWidth;
            }
            visualNodes.forEach(node => {
                if (node.x !== undefined) node.x = desiredCenterX + (node.x - currentCenterX) * scaleFactor;
                if(node.y !== undefined) node.y = node.y * Math.min(1, scaleFactor * 1.2) + (SVG_WIDTH * (1-scaleFactor) * 0.05);
            });
        }
    }
  return { visualNodes, visualEdges };
}


function addMorrisStep(line: number | null, message: string, currentId?: string | null, predecessorId?: string | null, operation?: TreeAlgorithmStep['auxiliaryData']['operation']) {
  const {visualNodes, visualEdges} = mapMorrisTreeToVisual(currentId, predecessorId);
  localSteps.push({
      nodes: visualNodes,
      edges: visualEdges,
      traversalPath: [...inorderResult],
      currentLine: line,
      message,
      currentProcessingNodeId: currentId,
      predecessorNodeId: predecessorId,
      auxiliaryData: { operation }
  });
}

export const generateMorrisInorderSteps = (treeString: string): TreeAlgorithmStep[] => {
  localSteps = [];
  morrisNodeIdCounter = 0;
  inorderResult = [];
  
  const parsedInput = parseTreeInput(treeString);
  if (!parsedInput || parsedInput.length === 0) {
    addMorrisStep(null, "Error: Invalid tree input or empty tree.");
    return localSteps;
  }

  const { nodes: initialVisualNodes, rootId: initialVisualRootId } = initialBuildTree(parsedInput);
  if (!initialVisualRootId || initialVisualRootId.startsWith('null-')) {
    addMorrisStep(null, "Tree is empty or root is null.");
    return localSteps;
  }
  treeRootIdInternal = initialVisualRootId;

  treeNodesInternalMap = new Map();
  initialVisualNodes.forEach(vn => {
    if (vn.value !== null && !vn.id.startsWith('null-')) {
      treeNodesInternalMap.set(vn.id, {
        id: vn.id, value: vn.value!,
        leftId: vn.leftId || null, rightId: vn.rightId || null,
        originalRightId: vn.rightId || null // Store original right for thread restoration
      });
    }
  });
  
  const lm = MORRIS_INORDER_LINE_MAP;
  addMorrisStep(lm.funcDeclare, `Starting Morris Inorder Traversal. Tree built. Root: ${treeNodesInternalMap.get(treeRootIdInternal)?.value}.`);

  let currentId: string | null = treeRootIdInternal;
  addMorrisStep(lm.initCurrentAndResult, `Initialize current = root (${treeNodesInternalMap.get(currentId)?.value}). Result list empty.`, currentId);

  while (currentId !== null && treeNodesInternalMap.has(currentId)) {
    const currentNode = treeNodesInternalMap.get(currentId)!;
    addMorrisStep(lm.whileCurrentNotNull, `Loop: current is ${currentNode.value}.`, currentId);

    if (currentNode.leftId === null || !treeNodesInternalMap.has(currentNode.leftId)) {
      addMorrisStep(lm.ifLeftChildNull, `Current node ${currentNode.value} has no left child.`, currentId, undefined, 'visit_node');
      inorderResult.push(currentNode.value);
      addMorrisStep(lm.visitCurrentNoLeft, `Visit ${currentNode.value}. Result: [${inorderResult.join(', ')}]`, currentId, undefined, 'visit_node');
      currentId = currentNode.rightId;
      addMorrisStep(lm.moveRightNoLeft, `Move current to right child (${currentId ? treeNodesInternalMap.get(currentId)?.value : 'null'}).`, currentId, undefined, 'move_right');
    } else {
      addMorrisStep(lm.elseHasLeftChild, `Current node ${currentNode.value} has a left child. Find inorder predecessor.`, currentId, undefined, 'find_predecessor');
      let predecessorId: string | null = currentNode.leftId;
      let predecessorNode = treeNodesInternalMap.get(predecessorId)!;
      addMorrisStep(lm.findPredecessorStart, `Predecessor search starts at left child ${predecessorNode.value}.`, currentId, predecessorId, 'find_predecessor');
      
      while (predecessorNode.rightId !== null && predecessorNode.rightId !== currentId && treeNodesInternalMap.has(predecessorNode.rightId)) {
         addMorrisStep(lm.predecessorLoopCondition, `Predecessor's right (${predecessorNode.rightId ? treeNodesInternalMap.get(predecessorNode.rightId)?.value : 'null'}) is not null and not current.`, currentId, predecessorId, 'find_predecessor');
         predecessorId = predecessorNode.rightId;
         predecessorNode = treeNodesInternalMap.get(predecessorId)!;
         addMorrisStep(lm.predecessorMoveRight, `Move predecessor to its right child: ${predecessorNode.value}.`, currentId, predecessorId, 'find_predecessor');
      }
      addMorrisStep(lm.predecessorLoopCondition, `Predecessor loop finished. Predecessor is ${predecessorNode.value}.`, currentId, predecessorId, 'find_predecessor');


      if (predecessorNode.rightId === null) {
        addMorrisStep(lm.ifThreadNull, `Predecessor's right is null. Create thread.`, currentId, predecessorId, 'make_thread');
        predecessorNode.rightId = currentId; // Create thread
        treeNodesInternalMap.set(predecessorId!, predecessorNode);
        addMorrisStep(lm.makeThread, `Thread created: ${predecessorNode.value}.right -> ${currentNode.value}.`, currentId, predecessorId, 'make_thread');
        currentId = currentNode.leftId;
        addMorrisStep(lm.currentMoveLeft, `Move current to left child: ${currentId ? treeNodesInternalMap.get(currentId)?.value : 'null'}.`, currentId, predecessorId, 'move_left');
      } else { // predecessorNode.rightId === currentId (thread exists)
        addMorrisStep(lm.elseThreadExists, `Thread exists from ${predecessorNode.value} to ${currentNode.value}. Remove thread.`, currentId, predecessorId, 'remove_thread');
        predecessorNode.rightId = predecessorNode.originalRightId || null; // Remove thread, restore original
        treeNodesInternalMap.set(predecessorId!, predecessorNode);
        addMorrisStep(lm.removeThread, `Thread removed: ${predecessorNode.value}.right reset.`, currentId, predecessorId, 'remove_thread');
        
        inorderResult.push(currentNode.value);
        addMorrisStep(lm.visitCurrentThreaded, `Visit ${currentNode.value}. Result: [${inorderResult.join(', ')}]`, currentId, predecessorId, 'visit_node');
        currentId = currentNode.rightId;
        addMorrisStep(lm.currentMoveRightThreaded, `Move current to right child: ${currentId ? treeNodesInternalMap.get(currentId)?.value : 'null'}.`, currentId, predecessorId, 'move_right');
      }
    }
  }
  addMorrisStep(lm.whileLoopEnd, `Current is null. Traversal finished.`, null, null, 'complete');
  addMorrisStep(lm.returnResult, `Final inorder traversal: [${inorderResult.join(', ')}]`, null, null, 'complete');
  addMorrisStep(lm.funcEnd, `Morris Inorder Traversal complete.`, null, null, 'complete');
  return localSteps;
};


    