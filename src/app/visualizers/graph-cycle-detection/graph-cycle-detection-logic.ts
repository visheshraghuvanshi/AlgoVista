
import type { GraphAlgorithmStep, GraphNode, GraphEdge } from '@/types';
// Re-use DFS parser for basic adjacency list string format
import { parseGraphInput as baseParseGraphInput } from '@/app/visualizers/dfs/dfs-logic';

export const CYCLE_DETECTION_LINE_MAP_UNDIRECTED = {
  mainFuncStart: 1,
  initVisited: 2,
  mainLoopNodes: 3, // For iterating through all nodes for disconnected graphs
  checkNodeNotVisitedOuter: 4,
  callDfsOuter: 5,
  dfsFuncStart: 6,
  markVisited: 7,
  loopNeighbors: 8,
  checkNeighborNotVisitedInner: 9,
  recursiveCallDfsInner: 10,
  checkNeighborIsParent: 11, // else if (v !== parent)
  cycleDetectedReturnTrue: 12,
  returnFalseNoCycleFromDfs: 13,
  returnFalseNoCycleMain: 14,
};

export const CYCLE_DETECTION_LINE_MAP_DIRECTED = {
  mainFuncStart: 1,
  initVisitedRecStack: 2,
  mainLoopNodes: 3,
  checkNodeNotVisitedOuter: 4,
  callDfsOuter: 5,
  dfsFuncStart: 6,
  markVisitedAndRecStack: 7,
  loopNeighbors: 8,
  checkNeighborNotVisitedInner: 9,
  recursiveCallDfsInner: 10,
  checkNeighborInRecStack: 11, // else if (recursionStack[v])
  cycleDetectedReturnTrue: 12,
  unmarkRecStack: 13,
  returnFalseNoCycleFromDfs: 14,
  returnFalseNoCycleMain: 15,
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  visiting: "hsl(var(--primary))",
  visited: "hsl(var(--muted-foreground))",
  inRecursionStack: "hsl(var(--accent))", // For directed graph's recursion stack
  cycleNode: "hsl(var(--destructive))", // Node part of a detected cycle
};

const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  traversed: "hsl(var(--primary))",
  backEdge: "hsl(var(--destructive))", // Edge forming a cycle
};

function parseGraphInput(input: string): { nodes: { id: string; label: string }[]; adj: Map<string, string[]>; numNodes: number } | null {
    const parsed = baseParseGraphInput(input);
    if (!parsed) return null;

    const allNodeIds = new Set<string>(parsed.nodes.map(n => n.id));
    parsed.adj.forEach((neighbors, sourceNodeId) => {
        allNodeIds.add(sourceNodeId); // Ensure source node is in the set
        neighbors.forEach(n => allNodeIds.add(n));
    });
    
    const nodeLabels = Array.from(allNodeIds).sort((a,b) => a.localeCompare(b));
    const nodeMap = new Map(nodeLabels.map((label, index) => [label, index])); // Map string ID to numeric index 0 to N-1
    const numNodes = nodeLabels.length;

    // Convert adjacency list to use numeric indices
    const adjNumeric = new Map<number, number[]>();
    parsed.adj.forEach((neighbors, sourceLabel) => {
        const sourceIdx = nodeMap.get(sourceLabel)!;
        adjNumeric.set(sourceIdx, neighbors.map(nLabel => nodeMap.get(nLabel)!));
    });
    // Ensure all nodes have an entry in adjNumeric
    for(let i=0; i<numNodes; ++i){
        if(!adjNumeric.has(i)) adjNumeric.set(i, []);
    }

    const finalNodes = nodeLabels.map(label => ({ id: label, label })); // Keep original string IDs for display
    return { nodes: finalNodes, adj: parsed.adj, numNodes }; // Keep original adj for string IDs for step generation
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

export const generateGraphCycleDetectionSteps = (
  graphInput: string,
  isDirected: boolean
): GraphAlgorithmStep[] => {
  const localSteps: GraphAlgorithmStep[] = [];
  const parsedData = parseGraphInput(graphInput);
  if (!parsedData) {
    localSteps.push({ nodes: [], edges: [], currentLine: null, message: "Invalid graph input." });
    return localSteps;
  }

  const { nodes: initialNodeData, adj, numNodes } = parsedData;
  const lm = isDirected ? CYCLE_DETECTION_LINE_MAP_DIRECTED : CYCLE_DETECTION_LINE_MAP_UNDIRECTED;

  if (numNodes === 0) {
    localSteps.push({ nodes: [], edges: [], currentLine: null, message: "Graph is empty." });
    return localSteps;
  }

  let graphNodes = calculateCircularLayout(initialNodeData, 500, 300);
  const graphEdges: GraphEdge[] = [];
  const addedEdges = new Set<string>(); // To avoid duplicate edges for undirected graph display

  adj.forEach((neighbors, sourceId) => {
    neighbors.forEach(targetId => {
      const edgeId1 = `${sourceId}-${targetId}`;
      const edgeId2 = `${targetId}-${sourceId}`;
      if (isDirected || !addedEdges.has(edgeId1) && !addedEdges.has(edgeId2)) {
        graphEdges.push({ id: edgeId1, source: sourceId, target: targetId, color: EDGE_COLORS.default, isDirected });
        addedEdges.add(edgeId1);
        addedEdges.add(edgeId2);
      }
    });
  });
  
  const visited = new Array(numNodes).fill(false);
  const recursionStack = isDirected ? new Array(numNodes).fill(false) : undefined;
  const dfsPath: string[] = []; // For visualization of current DFS path
  let cycleFoundGlobally = false;

  const nodeLabelToIdx = new Map(initialNodeData.map((node, i) => [node.id, i]));
  const nodeIdxToLabel = new Map(initialNodeData.map((node, i) => [i, node.id]));

  const addStep = (
    line: number,
    message: string,
    currentU_label?: string, // Current node label
    currentV_label?: string, // Neighbor label
    pathHighlightNodeLabels?: string[], // Nodes in detected cycle path
    edgeHighlightId?: string | null // Specific edge to highlight (e.g., back-edge)
  ) => {
    const stepNodes = graphNodes.map(gn => {
      const nodeIdx = nodeLabelToIdx.get(gn.id)!;
      let color = NODE_COLORS.default;
      if (pathHighlightNodeLabels?.includes(gn.id)) color = NODE_COLORS.cycleNode;
      else if (currentU_label === gn.id) color = NODE_COLORS.visiting;
      else if (isDirected && recursionStack?.[nodeIdx]) color = NODE_COLORS.inRecursionStack;
      else if (visited[nodeIdx]) color = NODE_COLORS.visited;
      return { ...gn, color };
    });

    const stepEdges = graphEdges.map(ge => {
        let color = ge.color; // Keep existing color (e.g. if already marked as part of MST)
        if (edgeHighlightId === ge.id || (edgeHighlightId === `${ge.target}-${ge.source}` && !isDirected)) {
            color = EDGE_COLORS.backEdge;
        } else if (currentU_label && (ge.source === currentU_label && ge.target === currentV_label) || (!isDirected && ge.target === currentU_label && ge.source === currentV_label)) {
            color = EDGE_COLORS.traversed;
        } else if (color !== EDGE_COLORS.backEdge){ // Don't override backedge color
            color = EDGE_COLORS.default;
        }
        return {...ge, color};
    });
    
    const auxData = [
        { type: 'set' as 'set', label: 'Visited', values: initialNodeData.filter(n => visited[nodeLabelToIdx.get(n.id)!]).map(n => n.id).sort() },
    ];
    if (isDirected && recursionStack) {
        auxData.push({ type: 'set' as 'set', label: 'Recursion Stack', values: initialNodeData.filter(n => recursionStack[nodeLabelToIdx.get(n.id)!]).map(n => n.id).sort() });
    }
    if (dfsPath.length > 0) {
         auxData.push({ type: 'stack' as 'stack', label: 'DFS Path (viz)', values: [...dfsPath] });
    }


    localSteps.push({ nodes: stepNodes, edges: stepEdges, currentLine: line, message, auxiliaryData: auxData });
  };

  addStep(lm.mainFuncStart, `Cycle detection for ${isDirected ? 'Directed' : 'Undirected'} Graph.`, undefined, undefined, undefined, null);
  addStep(lm.initVisitedRecStack, "Initialize visited array (and recursion stack if directed).", undefined, undefined, undefined, null);

  function dfs(u_idx: number, parent_idx: number): boolean {
    const u_label = nodeIdxToLabel.get(u_idx)!;
    dfsPath.push(u_label);
    addStep(lm.dfsFuncStart, `DFS(${u_label}, parent=${parent_idx === -1 ? 'null' : nodeIdxToLabel.get(parent_idx)})`, u_label, undefined, undefined, null);
    
    visited[u_idx] = true;
    if (isDirected && recursionStack) recursionStack[u_idx] = true;
    addStep(lm.markVisitedAndRecStack, `Marked ${u_label} as visited. ${isDirected ? 'Added to recursion stack.' : ''}`, u_label, undefined, undefined, null);

    for (const v_label of adj.get(u_label) || []) {
      const v_idx = nodeLabelToIdx.get(v_label)!;
      addStep(lm.loopNeighbors, `Checking neighbor ${v_label} of ${u_label}.`, u_label, v_label, undefined, `${u_label}-${v_label}`);
      
      if (!visited[v_idx]) {
        addStep(lm.checkNeighborNotVisitedInner, `${v_label} not visited. Recursive call.`, u_label, v_label, undefined, `${u_label}-${v_label}`);
        if (dfs(v_idx, u_idx)) {
            // Cycle already logged by deeper call
            dfsPath.pop();
            return true;
        }
      } else if (isDirected && recursionStack?.[v_idx]) {
        addStep(lm.checkNeighborInRecStack, `${v_label} is visited AND in recursion stack. Cycle detected!`, u_label, v_label, [u_label, v_label], `${u_label}-${v_label}`);
        cycleFoundGlobally = true;
        dfsPath.pop();
        return true;
      } else if (!isDirected && v_idx !== parent_idx) {
        addStep(lm.checkNeighborIsParent, `${v_label} is visited AND not parent ${nodeIdxToLabel.get(parent_idx)}. Cycle detected!`, u_label, v_label, [u_label, v_label], `${u_label}-${v_label}`);
        cycleFoundGlobally = true;
        dfsPath.pop();
        return true;
      }
      addStep(lm.checkNeighborNotVisitedInner, `Finished check for neighbor ${v_label}.`, u_label, v_label, undefined, null); // Generic end for this neighbor check
    }

    if (isDirected && recursionStack) {
        recursionStack[u_idx] = false;
        addStep(lm.unmarkRecStack, `Finished with ${u_label}. Removed from recursion stack.`, u_label, undefined, undefined, null);
    }
    dfsPath.pop();
    addStep(lm.returnFalseNoCycleFromDfs, `No cycle found through ${u_label} in this DFS path. Return false.`, u_label, undefined, undefined, null);
    return false;
  }

  for (let i = 0; i < numNodes; i++) {
    const nodeLabel = nodeIdxToLabel.get(i)!;
    addStep(lm.mainLoopNodes, `Main loop: considering node ${nodeLabel}.`, undefined, undefined, undefined, null);
    if (!visited[i]) {
      addStep(lm.checkNodeNotVisitedOuter, `${nodeLabel} not visited. Start DFS.`, undefined, undefined, undefined, null);
      if (dfs(i, -1)) { // Start DFS; -1 for no parent
        // Cycle found message will be added by the DFS itself for clarity on the back-edge
        break; // Stop if a cycle is found (or continue if finding all cycles)
      }
    } else {
        addStep(lm.checkNodeNotVisitedOuter, `${nodeLabel} already visited. Skip.`, undefined, undefined, undefined, null);
    }
  }

  if (cycleFoundGlobally) {
    addStep(lm.returnFalseNoCycleMain, "Cycle detection complete. A cycle WAS found.", undefined, undefined, undefined, null); // Assuming line map implies a result return
  } else {
    addStep(lm.returnFalseNoCycleMain, "Cycle detection complete. NO cycle found.", undefined, undefined, undefined, null);
  }
  return localSteps;
};

