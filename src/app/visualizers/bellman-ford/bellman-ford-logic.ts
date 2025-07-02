
import type { GraphAlgorithmStep, GraphNode, GraphEdge } from './types'; // Local import

export const BELLMAN_FORD_LINE_MAP = {
  functionDeclaration: 1,
  initDistPred: 2,
  initLoop: 3,
  setInfNull: 4,
  setStartDist: 5,
  relaxationLoopOuter: 6,
  relaxationLoopInnerEdges: 7,
  relaxationCondition: 8,
  updateDistance: 9,
  updatePredecessor: 10,
  endIfRelax: 11,
  endInnerEdgeLoop: 12,
  endOuterRelaxLoop: 13,
  negCycleCheckLoop: 14,
  negCycleCondition: 15,
  returnErrorNegCycle: 16,
  endIfNegCycle: 17,
  endNegCycleCheckLoop: 18,
  returnResults: 19,
  functionEnd: 20,
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  processed: "hsl(var(--muted-foreground))", 
  visiting: "hsl(var(--primary))", 
  start: "hsl(var(--accent))",
  pathHighlight: "hsl(var(--ring))", // For highlighting nodes in a path or affected by negative cycle
};

const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  relaxed: "hsl(var(--primary))",
  negativeCycle: "hsl(var(--destructive))",
};

export interface ParsedWeightedGraphWithEdgeList {
  nodes: { id: string; label: string }[];
  adj: Map<string, { target: string; weight: number }[]>;
  edgeList: { u: string; v: string; weight: number; id: string }[]; // Added ID to edge for unique keying
}

export function parseWeightedGraphInputWithEdgeList(input: string): ParsedWeightedGraphWithEdgeList | null {
  const adj = new Map<string, { target: string; weight: number }[]>();
  const nodeSet = new Set<string>();
  const edgeList: { u: string; v: string; weight: number; id: string }[] = [];
  const entries = input.trim().split(';').filter(Boolean);

  if (entries.length === 0 && input.trim() !== "") return null;
  if (input.trim() === "") return { nodes: [], adj: new Map(), edgeList: [] };

  for (const entry of entries) {
    const parts = entry.split(':');
    if (parts.length > 2) return null;
    
    const nodeId = parts[0].trim();
    if (!nodeId) return null;
    nodeSet.add(nodeId);

    if (parts.length === 1 || (parts.length === 2 && parts[1].trim() === "")) {
      if (!adj.has(nodeId)) adj.set(nodeId, []); // Ensure node is in adj map
      continue;
    }

    const neighborEntries = parts[1].split(',').map(n => n.trim()).filter(Boolean);
    const currentNeighbors: {target: string, weight: number}[] = [];

    for (const neighborEntry of neighborEntries) {
      const match = neighborEntry.match(/^(.+)\(([-]?\d+(\.\d+)?)\)$/); // Allow negative weights
      if (!match) return null; 

      const targetId = match[1].trim();
      const weight = parseFloat(match[2]);
      if (!targetId || isNaN(weight)) return null; 

      nodeSet.add(targetId);
      currentNeighbors.push({ target: targetId, weight });
      edgeList.push({ u: nodeId, v: targetId, weight, id: `${nodeId}-${targetId}-${weight}-${edgeList.length}` }); // Add unique ID
    }
    adj.set(nodeId, currentNeighbors);
  }

  const nodes = Array.from(nodeSet).map(id => ({ id, label: id })).sort((a,b) => a.id.localeCompare(b.id));
  nodes.forEach(node => {
      if (!adj.has(node.id)) adj.set(node.id, []);
  });
  return { nodes, adj, edgeList };
}

function calculateCircularLayout(nodes: { id: string; label: string }[], svgWidth: number, svgHeight: number, radiusMultiplier: number = 0.8): GraphNode[] {
  const numNodes = nodes.length;
  if (numNodes === 0) return [];
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const layoutRadius = Math.min(svgWidth, svgHeight) / 2 * radiusMultiplier;
  return nodes.map((node, index) => {
    const angle = (index / numNodes) * 2 * Math.PI - (Math.PI /2);
    return {
      id: node.id, label: node.label,
      x: centerX + layoutRadius * Math.cos(angle),
      y: centerY + layoutRadius * Math.sin(angle),
      color: NODE_COLORS.default, isStartNode: false, distance: Infinity,
    };
  });
}

export const generateBellmanFordSteps = (parsedData: ParsedWeightedGraphWithEdgeList, startNodeId: string): GraphAlgorithmStep[] => {
  const localSteps: GraphAlgorithmStep[] = [];
  const { nodes: initialNodeData, adj, edgeList } = parsedData;
  const numVertices = initialNodeData.length;

  if (!initialNodeData.some(n => n.id === startNodeId) && numVertices > 0) {
    localSteps.push({
      nodes: calculateCircularLayout(initialNodeData, 500, 300).map(n=>({...n, distance: Infinity})),
      edges: [], currentLine: null, message: `Start node "${startNodeId}" not found.`,
    });
    return localSteps;
  }
  if (numVertices === 0) {
    localSteps.push({ nodes: [], edges: [], currentLine: null, message: "Graph is empty." });
    return localSteps;
  }

  let graphNodes = calculateCircularLayout(initialNodeData, 500, 300);
  const visualEdges: GraphEdge[] = edgeList.map(e => ({
    id: e.id, source: e.u, target: e.v, weight: e.weight, color: EDGE_COLORS.default, isDirected: true
  }));

  const distances: { [key: string]: number } = {};
  const predecessors: { [key: string]: string | null } = {};
  
  const addStep = (line: number, message: string, activeEdgeId?: string, specialNodeHighlights?: {[nodeId: string]: string}, isNegCycleEdge?: boolean ) => {
    const stepNodes = graphNodes.map(n => ({
      ...n,
      distance: distances[n.id] === undefined ? Infinity : distances[n.id],
      color: specialNodeHighlights?.[n.id] || (n.id === startNodeId && distances[n.id] === 0 ? NODE_COLORS.start : (distances[n.id] === Infinity ? NODE_COLORS.default : NODE_COLORS.processed)),
    }));
    const stepEdges = visualEdges.map(e => ({
      ...e,
      color: e.id === activeEdgeId ? (isNegCycleEdge ? EDGE_COLORS.negativeCycle : EDGE_COLORS.relaxed) : e.color,
    }));

    const distForDisplay: { [key: string]: string | number } = {};
     initialNodeData.forEach(n => distForDisplay[n.id] = distances[n.id] === Infinity ? '∞' : (distances[n.id] === undefined ? '∞' : distances[n.id]));
    const predForDisplay: { [key: string]: string | null } = {};
    initialNodeData.forEach(n => predForDisplay[n.id] = predecessors[n.id] === undefined ? null : predecessors[n.id]);

    localSteps.push({
      nodes: stepNodes, edges: stepEdges, currentLine: line, message,
      auxiliaryData: [
        { type: 'set', label: 'Distances', values: distForDisplay },
        { type: 'set', label: 'Predecessors', values: predForDisplay },
      ],
    });
  };

  addStep(BELLMAN_FORD_LINE_MAP.functionDeclaration, "Bellman-Ford initialized.");
  
  initialNodeData.forEach(node => {
    distances[node.id] = Infinity;
    predecessors[node.id] = null;
  });
  addStep(BELLMAN_FORD_LINE_MAP.initDistPred, "Initialize distances to ∞, predecessors to null.");
  
  distances[startNodeId] = 0;
  addStep(BELLMAN_FORD_LINE_MAP.setStartDist, `Distance to start node ${startNodeId} set to 0.`);

  for (let i = 0; i < numVertices - 1; i++) {
    addStep(BELLMAN_FORD_LINE_MAP.relaxationLoopOuter, `Iteration ${i + 1} of V-1 relaxations.`);
    let relaxedThisIteration = false;
    for (const edge of edgeList) {
      addStep(BELLMAN_FORD_LINE_MAP.relaxationLoopInnerEdges, `Considering edge ${edge.u} -> ${edge.v} (weight ${edge.weight}).`, edge.id);
      if (distances[edge.u] !== Infinity && distances[edge.u] + edge.weight < distances[edge.v]) {
        addStep(BELLMAN_FORD_LINE_MAP.relaxationCondition, `Relaxation: dist[${edge.u}](${distances[edge.u] === Infinity ? '∞' : distances[edge.u]}) + ${edge.weight} < dist[${edge.v}](${distances[edge.v] === Infinity ? '∞' : distances[edge.v]})`, edge.id);
        distances[edge.v] = distances[edge.u] + edge.weight;
        predecessors[edge.v] = edge.u;
        relaxedThisIteration = true;
        addStep(BELLMAN_FORD_LINE_MAP.updateDistance, `Relaxed ${edge.u}->${edge.v}. New dist[${edge.v}]=${distances[edge.v]}. Pred[${edge.v}]=${edge.u}.`, edge.id);
      } else {
         addStep(BELLMAN_FORD_LINE_MAP.relaxationCondition, `No relaxation for ${edge.u}->${edge.v}. Condition not met.`, edge.id);
      }
    }
     addStep(BELLMAN_FORD_LINE_MAP.endOuterRelaxLoop, `End of iteration ${i+1}. ${relaxedThisIteration ? 'Relaxations occurred.' : 'No relaxations.'}`);
  }

  addStep(BELLMAN_FORD_LINE_MAP.negCycleCheckLoop, "Checking for negative-weight cycles (final iteration).");
  for (const edge of edgeList) {
    addStep(BELLMAN_FORD_LINE_MAP.negCycleCheckLoop, `Check edge ${edge.u}->${edge.v} for neg cycle.`, edge.id, undefined, true);
    if (distances[edge.u] !== Infinity && distances[edge.u] + edge.weight < distances[edge.v]) {
        const highlights: {[nodeId: string]: string} = {};
        let curr = edge.v; let pathCount = 0;
        while(curr && pathCount < numVertices && !highlights[curr]){ 
            highlights[curr] = NODE_COLORS.pathHighlight; 
            curr = predecessors[curr]!;
            pathCount++;
        }
        if(predecessors[edge.u]) highlights[predecessors[edge.u]!] = NODE_COLORS.pathHighlight;
        highlights[edge.u] = NODE_COLORS.pathHighlight;
        highlights[edge.v] = NODE_COLORS.pathHighlight;

      addStep(BELLMAN_FORD_LINE_MAP.returnErrorNegCycle, `Negative cycle detected via edge ${edge.u}->${edge.v}! Further relaxation possible. Shortest paths ill-defined.`, edge.id, highlights, true);
      localSteps[localSteps.length-1].message = "Negative cycle detected! Algorithm terminated.";
      return localSteps;
    }
  }
  addStep(BELLMAN_FORD_LINE_MAP.endNegCycleCheckLoop, "No negative cycles detected. Shortest paths are valid.");
  addStep(BELLMAN_FORD_LINE_MAP.returnResults, "Algorithm complete. Final distances and predecessors found (no negative cycles).");
  return localSteps;
};
