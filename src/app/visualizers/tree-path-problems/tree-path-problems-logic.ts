
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from './types'; // Local import
// Re-use tree parsing and initial building logic from binary-tree-traversal
import { parseTreeInput, buildTreeNodesAndEdges as initialBuildTree } from '@/app/visualizers/binary-tree-traversal/binary-tree-traversal-logic';

export const TREE_PATH_SUM_LINE_MAP = {
  funcDeclare: 1,
  baseCaseNull: 2,
  baseCaseLeafCheck: 3,
  baseCaseLeafSumMatch: 4,
  baseCaseLeafSumNoMatch: 5, // Conceptual, part of the else of sum match
  recursiveCallLeft: 6,
  recursiveCallRight: 7,
  returnRecursiveResult: 8, // For returning true if either child path found, or false if not
};

// --- Global state for step generation ---
let localSteps: TreeAlgorithmStep[];
let treeNodesMap: Map<string, { id: string; value: string | number; leftId: string | null; rightId: string | null; }>;
let treeRootId: string | null;
let targetSumGlobal: number;
let pathFoundGlobal: boolean = false;
let finalPathNodeIdsGlobal: string[] = [];
// -----------------------------------------


function mapTreeToVisualForPathSum(
    currentPathNodeIds: string[],
    successfulPathNodeIds: string[] = [], // Nodes in a successfully found path
    currentDfsNodeId?: string | null
): { visualNodes: BinaryTreeNodeVisual[], visualEdges: BinaryTreeEdgeVisual[] } {
    const visualNodes: BinaryTreeNodeVisual[] = [];
    const visualEdges: BinaryTreeEdgeVisual[] = [];
    if (!treeRootId || !treeNodesMap.has(treeRootId)) return { visualNodes, visualEdges };

    const X_SPACING_BASE = 70; 
    const Y_SPACING = 70;
    const SVG_WIDTH = 600; 

    function positionNode(nodeId: string, x: number, y: number, xOffsetMultiplier: number, depth: number) {
        const node = treeNodesMap.get(nodeId);
        if (!node) return;

        let color = "hsl(var(--secondary))"; // Default
        let textColor = "hsl(var(--secondary-foreground))";

        if (successfulPathNodeIds.includes(nodeId)) {
            color = "hsl(var(--success))"; // Green for successful path
            textColor = "hsl(var(--success-foreground))"; // Ensure text is visible on green
        } else if (currentPathNodeIds.includes(nodeId)) {
             color = "hsl(var(--primary)/0.7)"; 
             textColor = "hsl(var(--primary-foreground))";
        }
        if (currentDfsNodeId === nodeId && !successfulPathNodeIds.includes(nodeId)) { 
            color = "hsl(var(--primary))"; 
            textColor = "hsl(var(--primary-foreground))";
        }
        
        visualNodes.push({
            id: nodeId, value: node.value, x, y, color, textColor,
            leftId: node.leftId || null, rightId: node.rightId || null,
        });

        const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.6, depth);

        if (node.leftId && treeNodesMap.has(node.leftId)) {
            visualEdges.push({ 
                id: `edge-${nodeId}-${node.leftId}`, sourceId: nodeId, targetId: node.leftId, 
                color: (currentPathNodeIds.includes(nodeId) && currentPathNodeIds.includes(node.leftId)) || (successfulPathNodeIds.includes(nodeId) && successfulPathNodeIds.includes(node.leftId)) ? "hsl(var(--primary)/0.7)" : "hsl(var(--muted-foreground))"
            });
            positionNode(node.leftId, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
        }
        if (node.rightId && treeNodesMap.has(node.rightId)) {
            visualEdges.push({ 
                id: `edge-${nodeId}-${node.rightId}`, sourceId: nodeId, targetId: node.rightId, 
                color: (currentPathNodeIds.includes(nodeId) && currentPathNodeIds.includes(node.rightId)) || (successfulPathNodeIds.includes(nodeId) && successfulPathNodeIds.includes(node.rightId)) ? "hsl(var(--primary)/0.7)" : "hsl(var(--muted-foreground))"
            });
            positionNode(node.rightId, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
        }
    }
    positionNode(treeRootId, SVG_WIDTH / 2, 50, 0.8, 0);

    if (visualNodes.length > 0) {
        const minX = Math.min(...visualNodes.map(n => n.x).filter(x => x !== undefined && !isNaN(x)));
        const maxX = Math.max(...visualNodes.map(n => n.x).filter(x => x !== undefined && !isNaN(x)));
        if(isFinite(minX) && isFinite(maxX)) {
            const treeWidth = maxX - minX;
            const currentCenterX = minX + treeWidth / 2;
            const desiredCenterX = SVG_WIDTH / 2; // SVG center
            const shiftX = desiredCenterX - currentCenterX;

            let scaleFactor = 1;
            if (treeWidth > SVG_WIDTH * 0.95 && treeWidth > 0) { 
                scaleFactor = (SVG_WIDTH * 0.95) / treeWidth;
            }
            visualNodes.forEach(node => {
                if (node.x !== undefined) {
                     node.x = desiredCenterX + (node.x - currentCenterX) * scaleFactor;
                }
                if(node.y !== undefined) {
                    // Scale Y position slightly less aggressively or keep fixed levels if preferred
                    node.y = node.y; 
                }
            });
        }
    }
    return { visualNodes, visualEdges };
}

function addPathSumStep(
  line: number | null, 
  message: string, 
  currentDfsNodeId?: string | null, 
  currentPathElements: string[] = [], 
  currentPathSum?: number,
  pathIsFound?: boolean
) {
  const {visualNodes, visualEdges} = mapTreeToVisualForPathSum(
    currentPathElements,
    pathIsFound ? [...finalPathNodeIdsGlobal] : [],
    currentDfsNodeId
  );
  localSteps.push({
      nodes: visualNodes,
      edges: visualEdges,
      traversalPath: currentPathElements.map(id => treeNodesMap.get(id)?.value ?? '?'),
      currentLine: line,
      message,
      currentProcessingNodeId: currentDfsNodeId,
      auxiliaryData: {
          targetSum: targetSumGlobal,
          currentSum: currentPathSum,
          pathFound: pathIsFound || pathFoundGlobal, // Propagate if found
          currentPathNodeIds: [...currentPathElements], // For display
          finalPathNodeIds: pathIsFound ? [...finalPathNodeIdsGlobal] : undefined
      }
  });
}

function hasPathSumRecursive(nodeId: string | null, currentSum: number, path: string[]): boolean {
  const node = nodeId ? treeNodesMap.get(nodeId) : null;
  const currentPathSum = currentSum + (node ? Number(node.value) : 0);
  const currentPathNodeIds = node ? [...path, nodeId] : [...path];

  addPathSumStep(TREE_PATH_SUM_LINE_MAP.funcDeclare, `hasPathSum(node=${node?.value || 'null'}, currentPathSum=${currentPathSum}, remainingTarget=${targetSumGlobal - currentPathSum})`, nodeId, currentPathNodeIds, currentPathSum);

  if (!node) {
    addPathSumStep(TREE_PATH_SUM_LINE_MAP.baseCaseNull, "Base case: Node is null. Path does not sum to target.", nodeId, path, currentSum);
    return false;
  }
  
  if (!node.leftId && !node.rightId) { // Leaf node
    addPathSumStep(TREE_PATH_SUM_LINE_MAP.baseCaseLeafCheck, `Leaf node ${node.value}. Current path sum: ${currentPathSum}. Target: ${targetSumGlobal}.`, nodeId, currentPathNodeIds, currentPathSum);
    if (currentPathSum === targetSumGlobal) {
      pathFoundGlobal = true;
      finalPathNodeIdsGlobal = [...currentPathNodeIds];
      addPathSumStep(TREE_PATH_SUM_LINE_MAP.baseCaseLeafSumMatch, `Leaf sum matches target! Path: [${currentPathNodeIds.map(id => treeNodesMap.get(id)?.value).join('->')}]. Return true.`, nodeId, currentPathNodeIds, currentPathSum, true);
      return true;
    } else {
      addPathSumStep(TREE_PATH_SUM_LINE_MAP.baseCaseLeafSumNoMatch, `Leaf sum ${currentPathSum} != target ${targetSumGlobal}. Return false.`, nodeId, currentPathNodeIds, currentPathSum);
      return false;
    }
  }

  if (node.leftId) {
    addPathSumStep(TREE_PATH_SUM_LINE_MAP.recursiveCallLeft, `Try left child of ${node.value}. Path sum so far: ${currentPathSum}.`, node.leftId, currentPathNodeIds, currentPathSum);
    if (hasPathSumRecursive(node.leftId, currentPathSum, currentPathNodeIds)) {
      addPathSumStep(TREE_PATH_SUM_LINE_MAP.returnRecursiveResult, `Path found in left subtree of ${node.value}. Return true.`, nodeId, currentPathNodeIds, currentPathSum, true);
      return true;
    }
     addPathSumStep(TREE_PATH_SUM_LINE_MAP.returnRecursiveResult, `No path in left subtree of ${node.value}.`, nodeId, currentPathNodeIds, currentPathSum);
  }

  if (node.rightId) {
    addPathSumStep(TREE_PATH_SUM_LINE_MAP.recursiveCallRight, `Try right child of ${node.value}. Path sum so far: ${currentPathSum}.`, node.rightId, currentPathNodeIds, currentPathSum);
    if (hasPathSumRecursive(node.rightId, currentPathSum, currentPathNodeIds)) {
      addPathSumStep(TREE_PATH_SUM_LINE_MAP.returnRecursiveResult, `Path found in right subtree of ${node.value}. Return true.`, nodeId, currentPathNodeIds, currentPathSum, true);
      return true;
    }
    addPathSumStep(TREE_PATH_SUM_LINE_MAP.returnRecursiveResult, `No path in right subtree of ${node.value}.`, nodeId, currentPathNodeIds, currentPathSum);
  }
  
  addPathSumStep(TREE_PATH_SUM_LINE_MAP.returnRecursiveResult, `No path sum found through node ${node.value}. Backtracking from this node.`, nodeId, path, currentSum); 
  return false;
}

export const generatePathSumSteps = (treeString: string, targetSum: number): TreeAlgorithmStep[] => {
  localSteps = [];
  pathFoundGlobal = false;
  finalPathNodeIdsGlobal = [];
  targetSumGlobal = targetSum;

  const parsedInput = parseTreeInput(treeString);
  if (!parsedInput || parsedInput.length === 0) {
    addPathSumStep(null, "Error: Invalid tree input or empty tree.");
    return localSteps;
  }

  const { nodes: bttVisualNodes, rootId: bttRootId } = initialBuildTree(parsedInput);
  if (!bttRootId || bttRootId.startsWith('null-')) {
    addPathSumStep(null, "Tree is empty or root is null.");
    return localSteps;
  }
  treeRootId = bttRootId;

  treeNodesMap = new Map();
  bttVisualNodes.forEach(node => {
      if(node.value !== null && node.id !== 'null-0') {
          treeNodesMap.set(node.id, {
              id: node.id,
              value: node.value, 
              leftId: node.leftId || null,
              rightId: node.rightId || null,
          });
      }
  });
  
  addPathSumStep(null, `Checking for root-to-leaf path sum of ${targetSum}.`);
  hasPathSumRecursive(treeRootId, 0, []);

  if (pathFoundGlobal) {
    addPathSumStep(null, `Path sum ${targetSum} FOUND. Path: [${finalPathNodeIdsGlobal.map(id => treeNodesMap.get(id)?.value).join('->')}]`, undefined, finalPathNodeIdsGlobal, targetSum, true);
  } else {
    addPathSumStep(null, `No root-to-leaf path with sum ${targetSum} found.`, undefined, [], undefined, false);
  }
  addPathSumStep(null, "Path Sum Algorithm Complete.", undefined, pathFoundGlobal ? finalPathNodeIdsGlobal : []);
  return localSteps;
};
