
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from './types'; // Local import
// Re-use tree parsing and initial building logic from binary-tree-traversal
import { parseTreeInput, buildTreeNodesAndEdges as initialBuildTree } from '@/app/visualizers/binary-tree-traversal/binary-tree-traversal-logic';

export const LCA_LINE_MAP = { // Conceptual lines for a recursive LCA approach (path-finding variant)
  findLCAFuncStart: 1,        // Corresponds to the main lowestCommonAncestor function call
  findPathToPStart: 2,
  findPathToQStart: 3,
  comparePathsStart: 4,
  commonNodeInPath: 5,
  lcaFoundReturn: 6,
  nodeNotFound: 7,           // If P or Q isn't found

  // DFS Path Finding sub-routine lines
  findPathFuncStart: 8,
  pathBaseCaseNull: 9,       // If current node is null
  pathPushCurrent: 10,       // Add current to path
  pathBaseCaseFound: 11,     // If target is current node
  pathTryLeft: 12,
  pathRecursiveCallLeft: 13, // Conceptual
  pathTryRight: 14,
  pathRecursiveCallRight: 15,// Conceptual
  pathPopBacktrack: 16,      // Backtracking
  pathReturnFalseBranch: 17,
};


// --- Global state for step generation ---
let localSteps: TreeAlgorithmStep[];
let treeNodesMap: Map<string, { id: string; value: string | number; leftId: string | null; rightId: string | null; parentId?: string | null }>; // Added parentId for easier path reconstruction if needed later
let treeRootId: string | null;
let nodeP_val_logic: string | number;
let nodeQ_val_logic: string | number;
let nodeP_id_logic: string | null = null;
let nodeQ_id_logic: string | null = null;
// -----------------------------------------

// Helper to build the visual representation of the tree for each step
function mapTreeToVisual(
    currentNodesMap: Map<string, { id: string; value: string | number; leftId: string | null; rightId: string | null }>,
    currentRootId: string | null,
    highlightedNodeIds: string[] = [], // P, Q, LCA
    pathNodeIds: string[] = [], // Nodes on paths being traced
    currentDfsNodeId?: string | null, // Node being actively visited by DFS
    specialColors?: Record<string, string> // e.g., { [lcaNodeId]: "hsl(var(--success))" }
): { visualNodes: BinaryTreeNodeVisual[], visualEdges: BinaryTreeEdgeVisual[] } {
    const visualNodes: BinaryTreeNodeVisual[] = [];
    const visualEdges: BinaryTreeEdgeVisual[] = [];
    if (!currentRootId) return { visualNodes, visualEdges };

    const X_SPACING_BASE = 70; 
    const Y_SPACING = 70;
    const SVG_WIDTH = 600; 

    function positionNode(nodeId: string, x: number, y: number, xOffsetMultiplier: number, depth: number) {
        const node = currentNodesMap.get(nodeId);
        if (!node) return;

        let color = "hsl(var(--secondary))"; // Default
        let textColor = "hsl(var(--secondary-foreground))";

        if (pathNodeIds.includes(nodeId)) {
             color = "hsl(var(--primary)/0.6)"; 
             textColor = "hsl(var(--primary-foreground))";
        }
        if (highlightedNodeIds.includes(nodeId)) { // P, Q, or final LCA
            color = "hsl(var(--accent))"; 
            textColor = "hsl(var(--accent-foreground))";
        }
        if (currentDfsNodeId === nodeId) {
            color = "hsl(var(--primary))"; 
            textColor = "hsl(var(--primary-foreground))";
        }
        if (specialColors && specialColors[nodeId]) {
            color = specialColors[nodeId];
            if (specialColors[nodeId] === "hsl(var(--success))" || specialColors[nodeId] === "hsl(var(--destructive))") {
                textColor = "hsl(var(--primary-foreground))"; 
            }
        }


        visualNodes.push({
            id: nodeId, value: node.value, x, y, color, textColor,
            leftId: node.leftId || null, rightId: node.rightId || null,
        });

        const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.6, depth);

        if (node.leftId && currentNodesMap.has(node.leftId)) {
            visualEdges.push({ 
                id: `edge-${nodeId}-${node.leftId}`, sourceId: nodeId, targetId: node.leftId, 
                color: (pathNodeIds.includes(nodeId) && pathNodeIds.includes(node.leftId)) || (highlightedNodeIds.includes(nodeId) && highlightedNodeIds.includes(node.leftId) && specialColors && (specialColors[nodeId] === "hsl(var(--success))" || specialColors[node.leftId] === "hsl(var(--success))") ) ? "hsl(var(--primary)/0.7)" : "hsl(var(--muted-foreground))"
            });
            positionNode(node.leftId, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
        }
        if (node.rightId && currentNodesMap.has(node.rightId)) {
            visualEdges.push({ 
                id: `edge-${nodeId}-${node.rightId}`, sourceId: nodeId, targetId: node.rightId, 
                color: (pathNodeIds.includes(nodeId) && pathNodeIds.includes(node.rightId)) || (highlightedNodeIds.includes(nodeId) && highlightedNodeIds.includes(node.rightId) && specialColors && (specialColors[nodeId] === "hsl(var(--success))" || specialColors[node.rightId] === "hsl(var(--success))")) ? "hsl(var(--primary)/0.7)" : "hsl(var(--muted-foreground))"
            });
            positionNode(node.rightId, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1);
        }
    }
    positionNode(currentRootId, SVG_WIDTH / 2, 50, 0.8, 0);

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
                    node.y = node.y; 
                }
            });
        }
    }
    return { visualNodes, visualEdges };
}


function addLCAStep(line: number | null, message: string, currentDfsNodeId?: string | null, currentPathElements: string[] = [], lcaHighlightNodes: string[] = [], specialColors?: Record<string, string>) {
    const {visualNodes, visualEdges} = mapTreeToVisual(treeNodesMap, treeRootId, lcaHighlightNodes, currentPathElements, currentDfsNodeId, specialColors);
    localSteps.push({
        nodes: visualNodes,
        edges: visualEdges,
        traversalPath: currentPathElements.map(id => treeNodesMap.get(id)?.value ?? '?'),
        currentLine: line,
        message,
        currentProcessingNodeId: currentDfsNodeId,
        auxiliaryData: { 
            lcaValue: lcaHighlightNodes.length === 3 ? treeNodesMap.get(lcaHighlightNodes[2])?.value : null,
            lcaHighlightIds: lcaHighlightNodes
        }
    });
}

// DFS to find path from root to targetNodeValue
function findPathDfsLogic(currentId: string | null, targetValue: string | number, pathArray: string[]): boolean {
    const node = currentId ? treeNodesMap.get(currentId) : null;
    const currentValStr = node ? node.value.toString() : 'null';
    const targetValStr = targetValue.toString();

    addLCAStep(LCA_LINE_MAP.findPathFuncStart, `DFS for path to ${targetValStr}: Visiting ${currentValStr}. Current path: [${pathArray.map(id => treeNodesMap.get(id)?.value).join('->')}]`, currentId, [...pathArray]);
    
    if (!currentId || currentId.startsWith('null-') || !node) {
        addLCAStep(LCA_LINE_MAP.pathBaseCaseNull, `DFS for path: Reached null or invalid node. Target ${targetValStr} not in this branch. Backtrack.`, currentId, [...pathArray]);
        return false;
    }

    pathArray.push(currentId);
    addLCAStep(LCA_LINE_MAP.pathPushCurrent, `DFS for path: Added ${node.value} to path. Path: [${pathArray.map(id => treeNodesMap.get(id)?.value).join('->')}]`, currentId, [...pathArray]);

    if (node.value == targetValue) { // Loose comparison for string/number
        addLCAStep(LCA_LINE_MAP.pathBaseCaseFound, `DFS for path: Target ${targetValue} found at node ${node.value}! Path: [${pathArray.map(id => treeNodesMap.get(id)?.value).join('->')}]`, currentId, [...pathArray], node.id === nodeP_id_logic || node.id === nodeQ_id_logic ? [node.id] : []);
        if (targetValue == nodeP_val_logic) nodeP_id_logic = currentId;
        if (targetValue == nodeQ_val_logic) nodeQ_id_logic = currentId;
        return true;
    }

    if (node.leftId) {
        addLCAStep(LCA_LINE_MAP.pathTryLeft, `DFS for path: Try left child of ${node.value}.`, node.leftId, [...pathArray]);
        if (findPathDfsLogic(node.leftId, targetValue, pathArray)) {
            return true;
        }
    }
    if (node.rightId) {
        addLCAStep(LCA_LINE_MAP.pathTryRight, `DFS for path: Try right child of ${node.value}.`, node.rightId, [...pathArray]);
        if (findPathDfsLogic(node.rightId, targetValue, pathArray)) {
            return true;
        }
    }

    const poppedNodeValue = treeNodesMap.get(pathArray.pop()!)?.value;
    addLCAStep(LCA_LINE_MAP.pathPopBacktrack, `DFS for path: Target ${targetValue} not in subtree of ${node.value}. Backtrack. Popped ${poppedNodeValue}. Path: [${pathArray.map(id => treeNodesMap.get(id)?.value).join('->')}]`, currentId, [...pathArray]);
    return false;
}

export const generateLCASteps = (treeString: string, pValue: string | number, qValue: string | number): TreeAlgorithmStep[] => {
    localSteps = [];
    nodeP_val_logic = pValue;
    nodeQ_val_logic = qValue;
    nodeP_id_logic = null;
    nodeQ_id_logic = null;

    const parsedInput = parseTreeInput(treeString); 
    if (!parsedInput || parsedInput.length === 0) {
        addLCAStep(null, "Error: Invalid tree input string or empty tree.");
        return localSteps;
    }

    const { nodes: bttVisualNodes, rootId: bttRootId } = initialBuildTree(parsedInput);

    if (!bttRootId || bttRootId === 'null-0') { 
        addLCAStep(null, "Error: Tree is effectively empty or could not be built.");
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
    addLCAStep(LCA_LINE_MAP.findLCAFuncStart, `Tree built. Finding LCA of P='${pValue}' and Q='${qValue}'.`);

    const pathP: string[] = [];
    addLCAStep(LCA_LINE_MAP.findPathToPStart, `Finding path to P=${pValue}...`);
    const foundP = findPathDfsLogic(treeRootId, pValue, pathP);
    if (!foundP) {
        addLCAStep(LCA_LINE_MAP.nodeNotFound, `Node P='${pValue}' not found in the tree.`);
        return localSteps;
    }
     addLCAStep(null, `Path to P='${pValue}' found: [${pathP.map(id=>treeNodesMap.get(id)?.value).join(' -> ')}]`, undefined, [...pathP], nodeP_id_logic ? [nodeP_id_logic] : []);


    const pathQ: string[] = [];
    addLCAStep(LCA_LINE_MAP.findPathToQStart, `Finding path to Q=${qValue}...`);
    const foundQ = findPathDfsLogic(treeRootId, qValue, pathQ);
    if (!foundQ) {
        addLCAStep(LCA_LINE_MAP.nodeNotFound, `Node Q='${qValue}' not found in the tree.`);
        return localSteps;
    }
     addLCAStep(null, `Path to Q='${qValue}' found: [${pathQ.map(id=>treeNodesMap.get(id)?.value).join(' -> ')}]`, undefined, [...pathQ], nodeP_id_logic && nodeQ_id_logic ? [nodeP_id_logic, nodeQ_id_logic] : (nodeP_id_logic ? [nodeP_id_logic] : (nodeQ_id_logic ? [nodeQ_id_logic] : [])));


    let lcaNodeId: string | null = null;
    let i = 0;
    const finalHighlightIds = nodeP_id_logic && nodeQ_id_logic ? [nodeP_id_logic, nodeQ_id_logic] : (nodeP_id_logic ? [nodeP_id_logic] : (nodeQ_id_logic ? [nodeQ_id_logic] : []));
    addLCAStep(LCA_LINE_MAP.comparePathsStart, "Comparing paths to find LCA...", undefined, [], finalHighlightIds);
    while (i < pathP.length && i < pathQ.length && pathP[i] === pathQ[i]) {
        lcaNodeId = pathP[i];
        const commonNodeValue = treeNodesMap.get(lcaNodeId)?.value;
        addLCAStep(LCA_LINE_MAP.commonNodeInPath, `Paths share node ${commonNodeValue}. Current LCA candidate: ${commonNodeValue}.`, lcaNodeId, [...pathP.slice(0,i+1)], [...finalHighlightIds, lcaNodeId]);
        i++;
    }

    const specialColorsForLCA: Record<string, string> = {};
    if(nodeP_id_logic) specialColorsForLCA[nodeP_id_logic] = "hsl(var(--accent))";
    if(nodeQ_id_logic) specialColorsForLCA[nodeQ_id_logic] = "hsl(var(--accent))";
    if(lcaNodeId) specialColorsForLCA[lcaNodeId] = "hsl(var(--success))";


    if (lcaNodeId) {
        const lcaNodeValue = treeNodesMap.get(lcaNodeId)?.value;
        addLCAStep(LCA_LINE_MAP.lcaFoundReturn, `LCA found: ${lcaNodeValue}. Path P: [${pathP.map(id=>treeNodesMap.get(id)?.value).join('->')}]. Path Q: [${pathQ.map(id=>treeNodesMap.get(id)?.value).join('->')}]`, lcaNodeId, [...pathP, ...pathQ], lcaNodeId ? [...finalHighlightIds, lcaNodeId] : finalHighlightIds, specialColorsForLCA);
    } else {
        addLCAStep(LCA_LINE_MAP.lcaFoundReturn, "No common ancestor found (this shouldn't happen if P and Q are in the same tree and root exists).", undefined, [...pathP, ...pathQ], finalHighlightIds);
    }
    addLCAStep(null, "LCA Finding Algorithm Complete.", undefined, [], lcaNodeId ? [...finalHighlightIds, lcaNodeId] : finalHighlightIds, specialColorsForLCA);
    return localSteps;
};

