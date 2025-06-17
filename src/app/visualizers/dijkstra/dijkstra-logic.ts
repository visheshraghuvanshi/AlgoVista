
import type { GraphAlgorithmStep, GraphNode, GraphEdge } from '@/types';

export const DIJKSTRA_LINE_MAP = {
  functionDeclaration: 1,
  initDistances: 2,
  initPrevNodes: 3,
  initPriorityQueue: 4,
  setStartNodeDistance: 5,
  whileQueueNotEmpty: 6,
  extractMin: 7, // Node u with smallest distance
  markProcessed: 8, // Conceptually, u is now processed
  forLoopNeighbor: 9, // For each neighbor v of u
  calculateAltDistance: 10,
  ifAltShorter: 11,
  updateDistance: 12,
  updatePrevNode: 13,
  updatePriorityQueue: 14, // Decrease key of v in PQ
  endIfAlt: 15,
  endForLoop: 16,
  endWhileLoop: 17,
  returnResult: 18,
  functionEnd: 19,
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  processed: "hsl(var(--muted-foreground))", // Node whose shortest path is finalized
  visiting: "hsl(var(--primary))", // Node currently being extracted from PQ
  inQueue: "hsl(var(--accent))",    // Node in the priority queue with tentative distance
  start: "hsl(var(--accent))",
  path: "hsl(var(--primary)/0.7)", // Node part of the shortest path (for future use)
};

const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  relaxed: "hsl(var(--primary))", // Edge being considered for relaxation
  path: "hsl(var(--primary)/0.7)",  // Edge part of the shortest path (for future use)
};

export interface ParsedWeightedGraph {
  nodes: { id: string; label: string }[];
  adj: Map<string, { target: string; weight: number }[]>;
}

export function parseWeightedGraphInput(input: string): ParsedWeightedGraph | null {
  const adj = new Map<string, { target: string; weight: number }[]>();
  const nodeSet = new Set<string>();
  const entries = input.trim().split(';').filter(Boolean);

  if (entries.length === 0 && input.trim() !== "") return null;
  if (input.trim() === "") return { nodes: [], adj: new Map() };

  for (const entry of entries) {
    const parts = entry.split(':');
    if (parts.length > 2) return null; // node:n1(w1),n2(w2) or node: (for isolated)
    
    const nodeId = parts[0].trim();
    if (!nodeId) return null;
    nodeSet.add(nodeId);

    if (parts.length === 1 || (parts.length === 2 && parts[1].trim() === "")) { // Isolated node
      adj.set(nodeId, []);
      continue;
    }

    const neighborEntries = parts[1].split(',').map(n => n.trim()).filter(Boolean);
    const currentNeighbors: {target: string, weight: number}[] = [];

    for (const neighborEntry of neighborEntries) {
      const match = neighborEntry.match(/^(.+)\((\d+(\.\d+)?)\)$/); // NodeID(Weight)
      if (!match) return null; // Invalid neighbor format

      const targetId = match[1].trim();
      const weight = parseFloat(match[2]);
      if (!targetId || isNaN(weight) || weight < 0) return null; // Invalid target or weight

      nodeSet.add(targetId);
      currentNeighbors.push({ target: targetId, weight });
    }
    adj.set(nodeId, currentNeighbors);
  }

  const nodes = Array.from(nodeSet).map(id => ({ id, label: id })).sort((a,b) => a.id.localeCompare(b.id));
  // Ensure all nodes in nodeSet have an entry in adj, even if empty (for isolated nodes defined only as targets)
  nodes.forEach(node => {
      if (!adj.has(node.id)) {
          adj.set(node.id, []);
      }
  });
  return { nodes, adj };
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
      id: node.id,
      label: node.label,
      x: centerX + layoutRadius * Math.cos(angle),
      y: centerY + layoutRadius * Math.sin(angle),
      color: NODE_COLORS.default,
      isStartNode: false,
      distance: Infinity,
    };
  });
}

export const generateDijkstraSteps = (parsedGraph: ParsedWeightedGraph, startNodeId: string): GraphAlgorithmStep[] => {
  const localSteps: GraphAlgorithmStep[] = [];
  const { nodes: initialNodeData, adj } = parsedGraph;

  if (!initialNodeData.some(n => n.id === startNodeId) && initialNodeData.length > 0) {
    localSteps.push({
      nodes: calculateCircularLayout(initialNodeData, 500, 300).map(n => ({...n, distance: Infinity})),
      edges: [],
      currentLine: null,
      message: `Start node "${startNodeId}" not found in graph.`,
    });
    return localSteps;
  }
  if (initialNodeData.length === 0) {
    localSteps.push({ nodes: [], edges: [], currentLine: null, message: "Graph is empty." });
    return localSteps;
  }

  let graphNodes = calculateCircularLayout(initialNodeData, 500, 300);
  graphNodes.forEach(n => n.distance = Infinity); // Initialize distances for all nodes

  const startNodeObj = graphNodes.find(n => n.id === startNodeId);
  if (startNodeObj) {
    startNodeObj.isStartNode = true;
    startNodeObj.color = NODE_COLORS.start;
    startNodeObj.distance = 0;
  }

  let graphEdges: GraphEdge[] = [];
  adj.forEach((neighbors, sourceId) => {
    neighbors.forEach(({ target: targetId, weight }) => {
      // For Dijkstra, if graph is undirected, conceptual edges are bidirectional
      // but we usually represent directed edges if input format allows (our parser implies directed)
      const edgeId = `${sourceId}-${targetId}`;
      graphEdges.push({ id: edgeId, source: sourceId, target: targetId, weight, color: EDGE_COLORS.default, isDirected: true });
    });
  });
  
  const distances: { [key: string]: number } = {};
  const prev: { [key: string]: string | null } = {};
  let pq: { id: string, distance: number }[] = []; // Simple array as PQ

  const addStep = (
    line: number,
    message: string = "",
    currentProcessingNodeId: string | null = null,
    highlightedEdgeId: string | null = null,
    currentPqState?: { id: string, distance: number }[]
  ) => {
    const stepNodes = graphNodes.map(n => {
        const nodeDist = distances[n.id] === undefined ? Infinity : distances[n.id];
        let color = n.isStartNode && nodeDist === 0 && !prev[n.id] && currentProcessingNodeId !== n.id ? NODE_COLORS.start : NODE_COLORS.default;

        if (currentProcessingNodeId === n.id) color = NODE_COLORS.visiting;
        else if (prev[n.id] !== undefined || nodeDist === 0) { // Node has been processed or is start
            if (Object.values(prev).includes(n.id) || nodeDist === 0) { // Part of some path or is start
                 // Check if it's in PQ to determine 'inQueue' or 'processed'
                if (currentPqState && currentPqState.find(item => item.id === n.id)) {
                    color = NODE_COLORS.inQueue;
                } else if (n.id !== startNodeId && !currentPqState?.find(item => item.id === n.id) && distances[n.id] !== Infinity) {
                    // If not in PQ, it's considered processed (shortest path found or unreachable and processed)
                    color = NODE_COLORS.processed;
                } else if (n.id === startNodeId && !currentPqState?.find(item => item.id === n.id)) {
                     color = NODE_COLORS.processed; // Start node after first extraction
                }
            }
        }
        if (currentPqState && currentPqState.find(item => item.id === n.id) && n.id !== currentProcessingNodeId) {
            color = NODE_COLORS.inQueue;
        }
         if (n.id === startNodeId && distances[n.id] === 0 && !currentProcessingNodeId && (!currentPqState || currentPqState.find(item=>item.id === n.id))) {
             color = NODE_COLORS.start; // Ensure start node is distinct before processing starts
         }


        return {
            ...n,
            color,
            distance: nodeDist
        };
    });
    const stepEdges = graphEdges.map(e => ({
        ...e,
        color: e.id === highlightedEdgeId || `${e.source}-${e.target}` === highlightedEdgeId ? EDGE_COLORS.relaxed : EDGE_COLORS.default
    }));
    
    const pqForDisplay = (currentPqState || pq).map(item => `${item.id}(${item.distance === Infinity ? '∞' : item.distance})`).join(', ');
    const distForDisplay: { [key: string]: string | number } = {};
    Object.keys(distances).forEach(k => distForDisplay[k] = distances[k] === Infinity ? '∞' : distances[k]);

    localSteps.push({
      nodes: stepNodes,
      edges: stepEdges,
      auxiliaryData: [
        { type: 'set', label: 'Distances', values: distForDisplay },
        { type: 'queue', label: 'Priority Queue (Node,Dist)', values: [pqForDisplay || '(empty)'] },
      ],
      currentLine: line,
      message,
    });
  };

  addStep(DIJKSTRA_LINE_MAP.functionDeclaration, "Dijkstra's initialized.");

  graphNodes.forEach(node => {
    distances[node.id] = Infinity;
    prev[node.id] = null;
  });
  addStep(DIJKSTRA_LINE_MAP.initDistances, "Initialize distances to infinity.", null, null, [...pq]);
  addStep(DIJKSTRA_LINE_MAP.initPrevNodes, "Initialize previous nodes to null.", null, null, [...pq]);
  
  distances[startNodeId] = 0;
  graphNodes.find(n => n.id === startNodeId)!.distance = 0; 
  addStep(DIJKSTRA_LINE_MAP.setStartNodeDistance, `Set distance of start node ${startNodeId} to 0.`, null, null, [...pq]);

  pq = graphNodes.map(node => ({ id: node.id, distance: distances[node.id] }));
  addStep(DIJKSTRA_LINE_MAP.initPriorityQueue, "Initialize priority queue with all nodes.", null, null, [...pq]);

  while (pq.length > 0) {
    addStep(DIJKSTRA_LINE_MAP.whileQueueNotEmpty, "Priority queue is not empty.", null, null, [...pq]);
    
    // Sort PQ by distance to simulate extraction (simple PQ)
    pq.sort((a, b) => a.distance - b.distance);
    const u_obj = pq.shift(); // Extract min
    if (!u_obj || u_obj.distance === Infinity) {
        addStep(DIJKSTRA_LINE_MAP.extractMin, "No reachable unprocessed nodes left or all remaining have infinite distance.", null, null, [...pq]);
        break; // All remaining nodes are unreachable
    }
    const u = u_obj.id;
    
    addStep(DIJKSTRA_LINE_MAP.extractMin, `Extract node ${u} with smallest distance (${distances[u]}).`, u, null, [...pq]);
    addStep(DIJKSTRA_LINE_MAP.markProcessed, `Node ${u} is now processed.`, u, null, [...pq]);

    const neighborsOfU = adj.get(u) || [];
    for (const { target: v_id, weight } of neighborsOfU) {
      const edgeIdToHighlight = `${u}-${v_id}`;
      addStep(DIJKSTRA_LINE_MAP.forLoopNeighbor, `Considering neighbor ${v_id} of ${u} with edge weight ${weight}.`, u, edgeIdToHighlight, [...pq]);
      
      const alt = distances[u] + weight;
      addStep(DIJKSTRA_LINE_MAP.calculateAltDistance, `Calculate alternative distance to ${v_id} via ${u}: ${distances[u]} + ${weight} = ${alt}.`, u, edgeIdToHighlight, [...pq]);
      
      addStep(DIJKSTRA_LINE_MAP.ifAltShorter, `Is alt (${alt}) < current distance to ${v_id} (${distances[v_id]})?`, u, edgeIdToHighlight, [...pq]);
      if (alt < distances[v_id]) {
        distances[v_id] = alt;
        prev[v_id] = u;
        graphNodes.find(n => n.id === v_id)!.distance = alt; // Update visual distance
        addStep(DIJKSTRA_LINE_MAP.updateDistance, `Yes. Update distance of ${v_id} to ${alt}.`, u, edgeIdToHighlight, [...pq]);
        addStep(DIJKSTRA_LINE_MAP.updatePrevNode, `Set ${u} as previous node for ${v_id}.`, u, edgeIdToHighlight, [...pq]);
        
        const vInPq = pq.find(item => item.id === v_id);
        if (vInPq) vInPq.distance = alt; // Update PQ
        addStep(DIJKSTRA_LINE_MAP.updatePriorityQueue, `Update ${v_id} in priority queue with new distance ${alt}.`, u, edgeIdToHighlight, [...pq]);
      } else {
         addStep(DIJKSTRA_LINE_MAP.ifAltShorter, `No. Alternative distance ${alt} is not shorter than ${distances[v_id]}.`, u, edgeIdToHighlight, [...pq]);
      }
      addStep(DIJKSTRA_LINE_MAP.endIfAlt, `End if for neighbor ${v_id}.`, u, edgeIdToHighlight, [...pq]);
    }
    addStep(DIJKSTRA_LINE_MAP.endForLoop, `Finished neighbors of ${u}.`, u, null, [...pq]);
  }
  
  addStep(DIJKSTRA_LINE_MAP.endWhileLoop, "Priority queue is empty or all remaining nodes are unreachable. Dijkstra's finished.", null, null, [...pq]);
  addStep(DIJKSTRA_LINE_MAP.returnResult, "Algorithm complete. Final distances calculated.", null, null, [...pq]);
  addStep(DIJKSTRA_LINE_MAP.functionEnd, "Function end.", null, null, [...pq]);
  
  return localSteps;
};
