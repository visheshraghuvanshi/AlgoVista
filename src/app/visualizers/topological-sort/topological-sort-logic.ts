
import type { GraphAlgorithmStep, GraphNode, GraphEdge } from '@/types';
import { parseGraphInput as baseParseGraphInput } from '@/app/visualizers/dfs/dfs-logic'; // Reuse parser

export const TOPOLOGICAL_SORT_LINE_MAP = { // Kahn's Algorithm
  funcKahnStart: 1,
  initInDegreeAdj: 2, // Covers lines 2-9 in JS
  initQueue: 3, // Line 11 in JS
  populateInitialQueueLoop: 4, // Lines 12-14 in JS
  checkInDegreeZero: 5, // Line 13 in JS (if condition)
  initSortedOrderVisitedCount: 6, // Lines 16-17 in JS
  whileQueueNotEmpty: 7, // Line 18
  dequeueU: 8, // Line 19
  addToSortedOrder: 9, // Line 20
  incrementVisitedCount: 10, // Line 21
  loopNeighborsV: 11, // Line 22
  decrementInDegreeV: 12, // Line 23
  checkInDegreeVZero: 13, // Line 24 (if condition)
  enqueueV: 14, // Line 24 (queue.push(v))
  checkCycle: 15, // Line 27 (if visitedCount !== numNodes)
  returnErrorCycle: 16, // Line 28
  returnSortedOrder: 17, // Line 29
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  inQueue: "hsl(var(--accent))",
  processing: "hsl(var(--primary))",
  processed: "hsl(var(--muted-foreground))",
  cycleDetected: "hsl(var(--destructive))",
};

const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  considered: "hsl(var(--primary))",
};

// Wrapper to ensure consistent node list even if some nodes are only targets
// Also maps string node IDs to 0-indexed integers for easier array use
function parseGraphForTopoSort(input: string): { numNodes: number; adj: Map<number, number[]>; nodeLabelToIdx: Map<string,number>; nodeIdxToLabel: Map<number,string>, initialNodes: {id:string, label:string}[] } | null {
    const parsed = baseParseGraphInput(input); // This returns {nodes: {id,label}[], adj: Map<string, string[]>}
    if (!parsed) return null;

    const allNodeIds = new Set<string>();
    parsed.nodes.forEach(n => allNodeIds.add(n.id));
    parsed.adj.forEach((neighbors, sourceNodeId) => {
        allNodeIds.add(sourceNodeId);
        neighbors.forEach(n => allNodeIds.add(n));
    });
    
    const nodeLabels = Array.from(allNodeIds).sort((a,b) => a.localeCompare(b));
    const nodeLabelToIdx = new Map(nodeLabels.map((label, index) => [label, index]));
    const nodeIdxToLabel = new Map(nodeLabels.map((label, index) => [index, label]));
    const numNodes = nodeLabels.length;

    const adjNumeric = new Map<number, number[]>();
    for (let i = 0; i < numNodes; i++) adjNumeric.set(i, []); // Initialize for all nodes

    parsed.adj.forEach((neighbors, sourceLabel) => {
        const sourceIdx = nodeLabelToIdx.get(sourceLabel)!;
        (adjNumeric.get(sourceIdx) || []).push(...neighbors.map(nLabel => nodeLabelToIdx.get(nLabel)!));
    });
    
    const initialNodes = nodeLabels.map(label => ({ id: label, label }));

    return { numNodes, adj: adjNumeric, nodeLabelToIdx, nodeIdxToLabel, initialNodes };
}


function calculateCircularLayout(nodes: { id: string; label: string }[], svgWidth: number, svgHeight: number): GraphNode[] {
  const numNodes = nodes.length;
  if (numNodes === 0) return [];
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const layoutRadius = Math.min(svgWidth, svgHeight) / 2 * 0.8;
  return nodes.map((node, index) => {
    const angle = (index / numNodes) * 2 * Math.PI - (Math.PI /2);
    return {
      id: node.id, label: node.label,
      x: centerX + layoutRadius * Math.cos(angle),
      y: centerY + layoutRadius * Math.sin(angle),
      color: NODE_COLORS.default,
    };
  });
}

export const generateTopologicalSortSteps = (graphInput: string): GraphAlgorithmStep[] => {
  const localSteps: GraphAlgorithmStep[] = [];
  const parsedData = parseGraphForTopoSort(graphInput);
  if (!parsedData) {
    localSteps.push({ nodes: [], edges: [], currentLine: null, message: "Invalid graph input." });
    return localSteps;
  }
  
  const { numNodes, adj: adjNumeric, nodeIdxToLabel, initialNodes } = parsedData;
  const lm = TOPOLOGICAL_SORT_LINE_MAP;

  if (numNodes === 0) {
    localSteps.push({ nodes: [], edges: [], currentLine: null, message: "Graph is empty." });
    return localSteps;
  }

  let graphNodes = calculateCircularLayout(initialNodes, 500, 300);
  const graphEdges: GraphEdge[] = [];
  adjNumeric.forEach((neighbors, u_idx) => {
    const u_label = nodeIdxToLabel.get(u_idx)!;
    neighbors.forEach(v_idx => {
        const v_label = nodeIdxToLabel.get(v_idx)!;
        graphEdges.push({id: `${u_label}-${v_label}`, source: u_label, target: v_label, color: EDGE_COLORS.default, isDirected: true});
    });
  });

  const inDegree = new Array(numNodes).fill(0);
  adjNumeric.forEach((neighbors, _) => {
    neighbors.forEach(v_idx => inDegree[v_idx]++);
  });

  const addStep = (
    line: number,
    message: string,
    currentQueueState: number[], // Store indices
    currentSortedOrderState: number[], // Store indices
    activeU_idx?: number,
    activeV_idx?: number
  ) => {
    const stepNodes = graphNodes.map(gn => {
      const nodeIdx = parsedData.nodeLabelToIdx.get(gn.id)!;
      let color = NODE_COLORS.default;
      if(currentSortedOrderState.includes(nodeIdx)) color = NODE_COLORS.processed;
      else if (currentQueueState.includes(nodeIdx)) color = NODE_COLORS.inQueue;
      if (activeU_idx === nodeIdx) color = NODE_COLORS.processing;
      return { ...gn, color, distance: inDegree[nodeIdx] }; // Use distance field to show in-degree
    });
    
    const stepEdgesCloned = graphEdges.map(e => ({...e, color: EDGE_COLORS.default}));
    if(activeU_idx !== undefined && activeV_idx !== undefined) {
        const uLabel = nodeIdxToLabel.get(activeU_idx)!;
        const vLabel = nodeIdxToLabel.get(activeV_idx)!;
        const edge = stepEdgesCloned.find(e => e.source === uLabel && e.target === vLabel);
        if(edge) edge.color = EDGE_COLORS.considered;
    }


    localSteps.push({
      nodes: stepNodes,
      edges: stepEdgesCloned,
      currentLine: line,
      message,
      auxiliaryData: [
          {type: 'queue', label: 'Queue (Processing Order)', values: currentQueueState.map(idx => nodeIdxToLabel.get(idx)!)},
          {type: 'set', label: 'Topological Sort', values: currentSortedOrderState.map(idx => nodeIdxToLabel.get(idx)!)},
          {type: 'set', label: 'In-Degrees', values: inDegree.reduce((obj,deg,i)=> ({...obj, [nodeIdxToLabel.get(i)!]: deg}), {})},
      ],
    });
  };

  addStep(lm.funcKahnStart, "Kahn's Algorithm started.", [], []);
  addStep(lm.initInDegreeAdj, "Initialized in-degree array and adjacency list.", [], []);

  const queue: number[] = [];
  addStep(lm.initQueue, "Initialize queue.", queue, []);
  for (let i = 0; i < numNodes; i++) {
    addStep(lm.populateInitialQueueLoop, `Checking node ${nodeIdxToLabel.get(i)!} for initial queue. In-degree: ${inDegree[i]}.`, queue, []);
    if (inDegree[i] === 0) {
      queue.push(i);
      addStep(lm.checkInDegreeZero, `Node ${nodeIdxToLabel.get(i)!} has in-degree 0. Added to queue.`, queue, []);
    }
  }
  addStep(lm.initQueue, "Initial queue populated.", queue, []);


  const sortedOrder: number[] = [];
  let visitedCount = 0;
  addStep(lm.initSortedOrderVisitedCount, "Initialize sortedOrder list and visitedCount.", queue, sortedOrder);

  while (queue.length > 0) {
    addStep(lm.whileQueueNotEmpty, "Queue is not empty.", queue, sortedOrder);
    const u_idx = queue.shift()!;
    const u_label = nodeIdxToLabel.get(u_idx)!;
    addStep(lm.dequeueU, `Dequeued node ${u_label}.`, queue, sortedOrder, u_idx);

    sortedOrder.push(u_idx);
    visitedCount++;
    addStep(lm.addToSortedOrder, `Added ${u_label} to sorted order. Visited: ${visitedCount}.`, queue, sortedOrder, u_idx);

    for (const v_idx of adjNumeric.get(u_idx) || []) {
      const v_label = nodeIdxToLabel.get(v_idx)!;
      addStep(lm.loopNeighborsV, `Processing neighbor ${v_label} of ${u_label}.`, queue, sortedOrder, u_idx, v_idx);
      inDegree[v_idx]--;
      addStep(lm.decrementInDegreeV, `Decremented in-degree of ${v_label} to ${inDegree[v_idx]}.`, queue, sortedOrder, u_idx, v_idx);
      if (inDegree[v_idx] === 0) {
        queue.push(v_idx);
        addStep(lm.enqueueV, `In-degree of ${v_label} is 0. Enqueue ${v_label}.`, queue, sortedOrder, u_idx, v_idx);
      }
    }
  }
  addStep(lm.whileQueueNotEmpty, "Queue is empty.", queue, sortedOrder);

  if (visitedCount !== numNodes) {
    addStep(lm.checkCycle, `Cycle detected: Visited count (${visitedCount}) !== Number of nodes (${numNodes}).`, queue, sortedOrder);
    localSteps[localSteps.length-1].nodes.forEach(n => n.color = NODE_COLORS.cycleDetected); // Mark all nodes red
    addStep(lm.returnErrorCycle, "Topological sort not possible due to cycle.", queue, sortedOrder);
  } else {
    addStep(lm.checkCycle, `No cycle: Visited count (${visitedCount}) === Number of nodes (${numNodes}).`, queue, sortedOrder);
    addStep(lm.returnSortedOrder, `Topological sort complete. Order: [${sortedOrder.map(idx => nodeIdxToLabel.get(idx)!).join(', ')}].`, queue, sortedOrder);
  }
  return localSteps;
};

