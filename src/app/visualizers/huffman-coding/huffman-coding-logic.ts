
import type { HuffmanStep, HuffmanFrequencyItem, HuffmanNodeForPQ, HuffmanCodeItem, BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from '@/types';

export const HUFFMAN_CODING_LINE_MAP = {
  // Conceptual mapping based on common Huffman algorithm steps
  freqCalcStart: 1,
  freqCalcLoop: 2, // Inside loop of processing text for frequencies
  freqCalcEnd: 3,
  nodeClassStart: 4,
  nodeClassEnd: 5,
  buildTreeFuncStart: 6,
  initPQ: 7,
  pqAddLeafLoopStart: 8,
  pqAddLeafNode: 9,
  pqSort: 10, // Or heapify
  buildTreeLoopStart: 11, // while pq.size > 1
  dequeueLeft: 12,
  dequeueRight: 13,
  createInternalNode: 14,
  enqueueInternalNode: 15,
  pqReSort: 16, // Or heapify after insert
  returnTreeRoot: 17,
  buildTreeFuncEnd: 18,
  generateCodesFuncStart: 19,
  checkLeafNodeForCode: 20,
  assignCodeToChar: 21,
  recursiveCallLeftCode: 22,
  recursiveCallRightCode: 23,
  generateCodesFuncEnd: 24,
};

let huffmanNodeIdCounterLogic = 0;
const generateLogicNodeId = (val: string | null, freq: number): string => `huff-node-${val ? val : 'internal'}-${freq}-${huffmanNodeIdCounterLogic++}`;

function addStep(
  steps: HuffmanStep[],
  line: number | null,
  phase: HuffmanStep['phase'],
  message: string,
  treeNodes: BinaryTreeNodeVisual[] = [],
  treeEdges: BinaryTreeEdgeVisual[] = [],
  frequencies?: HuffmanFrequencyItem[],
  priorityQueueState?: HuffmanNodeForPQ[],
  huffmanCodes?: HuffmanCodeItem[],
  currentProcessingNodeId?: string | null,
  activeNodeIds?: string[],
  mergedNodeId?: string | null,
  currentPathForCode?: string
) {
  steps.push({
    phase, message, currentLine: line,
    nodes: treeNodes.map(n => ({...n})), // Ensure copies
    edges: treeEdges.map(e => ({...e})),
    frequencies: frequencies ? frequencies.map(f => ({...f})) : undefined,
    priorityQueueState: priorityQueueState ? priorityQueueState.map(p => ({...p})) : undefined,
    huffmanCodes: huffmanCodes ? huffmanCodes.map(c => ({...c})) : undefined,
    currentProcessingNodeId, activeNodeIds, mergedNodeId, currentPathForCode,
    // Unused common fields
    traversalPath: [],
  });
}

// Helper to convert HuffmanNodeForPQ to BinaryTreeNodeVisual structure for rendering
function buildVisualTree(
    nodesMap: Map<string, HuffmanNodeForPQ>, 
    rootId: string | null,
    activeIds: string[] = [],
    mergedId: string | null = null,
    currentCodeGenNodeId: string | null = null,
    pathForCodeGen: string = ""
): { visualNodes: BinaryTreeNodeVisual[], visualEdges: BinaryTreeEdgeVisual[] } {
    const visualNodes: BinaryTreeNodeVisual[] = [];
    const visualEdges: BinaryTreeEdgeVisual[] = [];
    if (!rootId) return { visualNodes, visualEdges };

    const X_SPACING_BASE = 50; 
    const Y_SPACING = 60;
    const SVG_WIDTH = 500;

    function positionNode(nodeId: string, x: number, y: number, xOffsetMultiplier: number, depth: number, currentCodePath: string) {
        const node = nodesMap.get(nodeId);
        if (!node) return;

        let color = "hsl(var(--secondary))";
        let textColor = "hsl(var(--secondary-foreground))";
        if(activeIds.includes(nodeId)) { color = "hsl(var(--primary))"; textColor = "hsl(var(--primary-foreground))"; }
        if(mergedId === nodeId) { color = "hsl(var(--accent))"; textColor = "hsl(var(--accent-foreground))"; }
        if(currentCodeGenNodeId === nodeId) { color = "hsl(var(--ring))"; textColor = "hsl(var(--primary-foreground))"; }


        visualNodes.push({
            id: nodeId,
            value: node.char ? `${node.char}:${node.freq}` : `Σ:${node.freq}`,
            char: node.char,
            freq: node.freq,
            x, y, color, textColor,
            leftId: node.leftId || null,
            rightId: node.rightId || null,
        });

        const childXOffset = X_SPACING_BASE * xOffsetMultiplier / Math.pow(1.6, depth);

        if (node.leftId) {
            visualEdges.push({ id: `edge-${nodeId}-${node.leftId}`, sourceId: nodeId, targetId: node.leftId, color: "hsl(var(--muted-foreground))" });
            positionNode(node.leftId, x - childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1, currentCodePath + "0");
        }
        if (node.rightId) {
            visualEdges.push({ id: `edge-${nodeId}-${node.rightId}`, sourceId: nodeId, targetId: node.rightId, color: "hsl(var(--muted-foreground))" });
            positionNode(node.rightId, x + childXOffset, y + Y_SPACING, xOffsetMultiplier, depth + 1, currentCodePath + "1");
        }
    }
    positionNode(rootId, SVG_WIDTH / 2, 50, 0.7, 0, "");

     // Simple centering adjustment
    if (visualNodes.length > 0) {
        const minX = Math.min(...visualNodes.map(n => n.x));
        const maxX = Math.max(...visualNodes.map(n => n.x));
        const treeWidth = maxX - minX;
        const currentCenterX = minX + treeWidth / 2;
        const desiredCenterX = SVG_WIDTH / 2; // SVG center
        const shiftX = desiredCenterX - currentCenterX;

        let scaleFactor = 1;
        if (treeWidth > SVG_WIDTH * 0.95) { 
            scaleFactor = (SVG_WIDTH * 0.95) / treeWidth;
        }
        visualNodes.forEach(node => {
            node.x = desiredCenterX + (node.x - currentCenterX) * scaleFactor;
            node.y = node.y * scaleFactor + (SVG_WIDTH * (1-scaleFactor) * 0.05);
        });
    }
    return { visualNodes, visualEdges };
}


export const generateHuffmanCodingSteps = (text: string): HuffmanStep[] => {
  const localSteps: HuffmanStep[] = [];
  huffmanNodeIdCounterLogic = 0; // Reset for each run
  const lm = HUFFMAN_CODING_LINE_MAP;

  addStep(localSteps, lm.freqCalcStart, 'frequency_calculation', "Starting Huffman Coding: Calculate Frequencies.");
  if (!text.trim()) {
    addStep(localSteps, null, 'frequency_calculation', "Input text is empty.", [], [], [], []);
    return localSteps;
  }

  const freqMap: Record<string, number> = {};
  for (const char of text) {
    freqMap[char] = (freqMap[char] || 0) + 1;
    // Add step for each char count could be too verbose, just one after loop.
  }
  const frequencies: HuffmanFrequencyItem[] = Object.entries(freqMap).map(([char, freq], idx) => ({ char, freq, id: `freq-${char}-${idx}`})).sort((a,b)=> a.freq - b.freq);
  addStep(localSteps, lm.freqCalcEnd, 'frequency_calculation', `Frequencies: ${frequencies.map(f => `'${f.char}':${f.freq}`).join(', ')}`, [], [], frequencies);

  // Priority Queue Initialization
  addStep(localSteps, lm.initPQ, 'pq_initialization', "Initialize Min-Priority Queue with leaf nodes.", [], [], frequencies);
  const pq: HuffmanNodeForPQ[] = frequencies.map(f => ({ id: generateLogicNodeId(f.char, f.freq), char: f.char, freq: f.freq, leftId: null, rightId: null }));
  pq.sort((a, b) => a.freq - b.freq || (a.id.localeCompare(b.id))); // Sort by freq, then id for stability
  
  // Keep a map of all nodes created for tree building and visualization
  const allNodesMap = new Map<string, HuffmanNodeForPQ>(pq.map(node => [node.id, node]));
  let currentTreeVis = buildVisualTree(allNodesMap, pq.length > 0 ? pq[0].id : null); // Initial tree might be just one node or empty
  addStep(localSteps, lm.pqSort, 'pq_initialization', `Priority Queue: [${pq.map(p => `${p.char ? `'${p.char}'` : 'Σ'}:${p.freq}`).join(', ')}]`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, pq);

  // Tree Construction
  if (pq.length === 1) { // Handle single unique character case
      const singleNode = pq[0];
      const finalCodes: HuffmanCodeItem[] = [{ char: singleNode.char!, code: "0" }];
      currentTreeVis = buildVisualTree(allNodesMap, singleNode.id);
      addStep(localSteps, lm.returnTreeRoot, 'tree_construction', `Only one unique character. Tree root is '${singleNode.char}'. Code is '0'.`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, [], finalCodes);
      addStep(localSteps, null, 'finished', `Huffman Coding complete.`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, [], finalCodes);
      return localSteps;
  }


  while (pq.length > 1) {
    addStep(localSteps, lm.buildTreeLoopStart, 'tree_construction', `Loop: PQ size > 1. Current PQ: [${pq.map(p => `${p.char || 'Σ'}:${p.freq}`).join(', ')}]`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, pq);
    
    const left = pq.shift()!;
    addStep(localSteps, lm.dequeueLeft, 'tree_construction', `Dequeue Left (min): ${left.char || 'Σ'}:${left.freq}`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, pq, undefined, [left.id]);
    
    const right = pq.shift()!;
    addStep(localSteps, lm.dequeueRight, 'tree_construction', `Dequeue Right (next min): ${right.char || 'Σ'}:${right.freq}`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, pq, undefined, [left.id, right.id]);

    const internalNodeId = generateLogicNodeId(null, left.freq + right.freq);
    const internalNode: HuffmanNodeForPQ = { id: internalNodeId, char: null, freq: left.freq + right.freq, leftId: left.id, rightId: right.id };
    allNodesMap.set(internalNodeId, internalNode); // Add new internal node to map

    addStep(localSteps, lm.createInternalNode, 'tree_construction', `Create internal node: freq=${internalNode.freq}`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, pq, undefined, [left.id, right.id], internalNodeId);
    
    pq.push(internalNode);
    pq.sort((a, b) => a.freq - b.freq || (a.id.localeCompare(b.id)));
    addStep(localSteps, lm.enqueueInternalNode, 'tree_construction', `Enqueue internal node. PQ: [${pq.map(p => `${p.char || 'Σ'}:${p.freq}`).join(', ')}]`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, pq, undefined, undefined, internalNodeId);
    currentTreeVis = buildVisualTree(allNodesMap, pq.length > 0 ? pq[0].id : null); // Rebuild tree for visualization
    // For the next step, we want to show the tree with the new internal node as part of the PQ conceptually
  }
  
  const rootId = pq.length > 0 ? pq[0].id : null;
  currentTreeVis = buildVisualTree(allNodesMap, rootId);
  addStep(localSteps, lm.returnTreeRoot, 'tree_construction', `Tree construction complete. Root freq: ${rootId ? allNodesMap.get(rootId)?.freq : 'N/A'}`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, []);

  // Code Generation
  const codes: HuffmanCodeItem[] = [];
  function generateCodesRecursive(nodeId: string | null, currentCode: string) {
    if (!nodeId) return;
    const node = allNodesMap.get(nodeId);
    if (!node) return;

    addStep(localSteps, lm.generateCodesFuncStart, 'code_generation', `generateCodes(node='${node.char || `Internal(${node.freq})`}', code='${currentCode}')`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, [], codes, nodeId, undefined, undefined, currentCode);

    if (node.char !== null) {
      addStep(localSteps, lm.checkLeafNodeForCode, 'code_generation', `Node '${node.char}' is a leaf.`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, [], codes, nodeId, undefined, undefined, currentCode);
      codes.push({ char: node.char, code: currentCode || (frequencies.length === 1 ? "0" : "") });
      addStep(localSteps, lm.assignCodeToChar, 'code_generation', `Assign code '${currentCode || (frequencies.length === 1 ? "0" : "")}' to char '${node.char}'. Codes: ${codes.map(c => `${c.char}:${c.code}`).join('; ')}`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, [], codes, nodeId, undefined, undefined, currentCode);
      return;
    }
    if (node.leftId) {
        addStep(localSteps, lm.recursiveCallLeftCode, 'code_generation', `Go Left from '${node.char || `Internal(${node.freq})`}'. Append '0'.`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, [], codes, node.leftId, undefined, undefined, currentCode + "0");
        generateCodesRecursive(node.leftId, currentCode + "0");
    }
    if (node.rightId) {
        addStep(localSteps, lm.recursiveCallRightCode, 'code_generation', `Go Right from '${node.char || `Internal(${node.freq})`}'. Append '1'.`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, [], codes, node.rightId, undefined, undefined, currentCode + "1");
        generateCodesRecursive(node.rightId, currentCode + "1");
    }
     addStep(localSteps, lm.generateCodesFuncEnd, 'code_generation', `Return from generateCodes for '${node.char || `Internal(${node.freq})`}'.`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, [], codes, nodeId);
  }

  if (rootId) {
    addStep(localSteps, lm.generateCodesFuncStart -1, 'code_generation', "Starting code generation traversal.", currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, [], codes);
    generateCodesRecursive(rootId, "");
  }
  
  addStep(localSteps, null, 'finished', `Huffman Coding complete. Final codes generated.`, currentTreeVis.visualNodes, currentTreeVis.visualEdges, frequencies, [], codes);
  return localSteps;
};

