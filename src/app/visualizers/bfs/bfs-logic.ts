
import type { GraphAlgorithmStep, GraphNode, GraphEdge } from '@/types';

export const BFS_LINE_MAP = {
  functionDeclaration: 1,
  initQueueAndVisited: 2,
  enqueueStartNode: 3,
  markStartNodeVisited: 4,
  whileQueueNotEmpty: 5,
  dequeueNode: 6,
  processNode: 7, // Placeholder for "current node being processed"
  forLoopNeighbor: 8,
  ifNeighborNotVisited: 9,
  markNeighborVisited: 10,
  enqueueNeighbor: 11,
  endIf: 12,
  endForLoop: 13,
  endWhileLoop: 14,
  functionEnd: 15,
};

// Colors for node states
const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  visiting: "hsl(var(--primary))", // Node currently being dequeued and processed
  visited: "hsl(var(--muted-foreground))", // Node already visited
  inQueue: "hsl(var(--accent))", // Node in the queue
  start: "hsl(var(--accent))", // Start node distinct color
};

const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  traversed: "hsl(var(--primary))",
};

interface ParsedGraph {
  nodes: { id: string; label: string }[];
  adj: Map<string, string[]>;
}

export function parseGraphInput(input: string): ParsedGraph | null {
  const adj = new Map<string, string[]>();
  const nodeSet = new Set<string>();
  const entries = input.trim().split(';').filter(Boolean);

  if (entries.length === 0 && input.trim() !== "") return null; // Invalid format if not empty but no entries
  if (input.trim() === "") return { nodes: [], adj: new Map() };


  for (const entry of entries) {
    const parts = entry.split(':');
    if (parts.length !== 2) return null; // Invalid format

    const nodeId = parts[0].trim();
    if (!nodeId) return null; // Node ID cannot be empty
    nodeSet.add(nodeId);

    const neighbors = parts[1].split(',').map(n => n.trim()).filter(Boolean);
    adj.set(nodeId, neighbors);
    neighbors.forEach(neighbor => nodeSet.add(neighbor)); // Add neighbors to node set as well
  }

  // Ensure all mentioned neighbors also have entries if they are source nodes
  // For this visualizer, we assume graph is defined by explicit adjacency entries.
  // If a node is only a neighbor and not a source, it's still a valid node.
  
  const nodes = Array.from(nodeSet).map(id => ({ id, label: id })).sort((a,b) => a.id.localeCompare(b.id));
  return { nodes, adj };
}

function calculateCircularLayout(nodes: { id: string; label: string }[], svgWidth: number, svgHeight: number, radiusMultiplier: number = 0.8): GraphNode[] {
  const numNodes = nodes.length;
  if (numNodes === 0) return [];

  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const layoutRadius = Math.min(svgWidth, svgHeight) / 2 * radiusMultiplier;

  return nodes.map((node, index) => {
    const angle = (index / numNodes) * 2 * Math.PI - (Math.PI /2); // Start from top
    return {
      id: node.id,
      label: node.label,
      x: centerX + layoutRadius * Math.cos(angle),
      y: centerY + layoutRadius * Math.sin(angle),
      color: NODE_COLORS.default,
      isStartNode: false,
    };
  });
}


export const generateBfsSteps = (parsedGraph: ParsedGraph, startNodeId: string): GraphAlgorithmStep[] => {
  const localSteps: GraphAlgorithmStep[] = [];
  const { nodes: initialNodeData, adj } = parsedGraph;

  if (!adj.has(startNodeId) && initialNodeData.find(n=>n.id === startNodeId) === undefined && initialNodeData.length > 0) {
     localSteps.push({
      nodes: calculateCircularLayout(initialNodeData, 500, 300), edges: [], currentLine: null, message: `Start node "${startNodeId}" not found in graph.`
    });
    return localSteps;
  }
   if (initialNodeData.length === 0) {
     localSteps.push({
      nodes: [], edges: [], currentLine: null, message: `Graph is empty.`
    });
    return localSteps;
  }


  let graphNodes = calculateCircularLayout(initialNodeData, 500, 300);
  const startNodeIndex = graphNodes.findIndex(n => n.id === startNodeId);
  if (startNodeIndex !== -1) {
    graphNodes[startNodeIndex].isStartNode = true;
    graphNodes[startNodeIndex].color = NODE_COLORS.start;
  }

  let graphEdges: GraphEdge[] = [];
  adj.forEach((neighbors, sourceId) => {
    neighbors.forEach(targetId => {
      // Add edge only once for undirected representation
      const edgeId1 = `${sourceId}-${targetId}`;
      const edgeId2 = `${targetId}-${sourceId}`;
      if (!graphEdges.some(e => e.id === edgeId1 || e.id === edgeId2)) {
        graphEdges.push({ id: edgeId1, source: sourceId, target: targetId, color: EDGE_COLORS.default });
      }
    });
  });
  
  const addStep = (
    line: number,
    message: string = "",
    currentQueue: string[] = [],
    visitedSet: string[] = [],
    currentProcessingNodeId: string | null = null,
    highlightedEdgeId: string | null = null
  ) => {
    const stepNodes = graphNodes.map(n => ({
      ...n,
      color: n.id === startNodeId && !visitedSet.includes(n.id) && !currentQueue.includes(n.id) && currentProcessingNodeId !== n.id ? NODE_COLORS.start : 
             (n.id === currentProcessingNodeId ? NODE_COLORS.visiting : 
             (currentQueue.includes(n.id) ? NODE_COLORS.inQueue : 
             (visitedSet.includes(n.id) ? NODE_COLORS.visited : NODE_COLORS.default)))
    }));
    const stepEdges = graphEdges.map(e => ({
        ...e,
        color: e.id === highlightedEdgeId || `${e.target}-${e.source}` === highlightedEdgeId ? EDGE_COLORS.traversed : EDGE_COLORS.default
    }));

    localSteps.push({
      nodes: stepNodes,
      edges: stepEdges,
      auxiliaryData: [
        { type: 'queue', label: 'Queue', values: [...currentQueue] },
        { type: 'set', label: 'Visited', values: [...visitedSet].sort() }
      ],
      currentLine: line,
      message,
    });
  };

  addStep(BFS_LINE_MAP.functionDeclaration, "BFS initialized.");

  const queue: string[] = [];
  const visited = new Set<string>();

  addStep(BFS_LINE_MAP.initQueueAndVisited, "Initialize queue and visited set.", [], Array.from(visited));
  
  queue.push(startNodeId);
  addStep(BFS_LINE_MAP.enqueueStartNode, `Enqueue start node: ${startNodeId}.`, [...queue], Array.from(visited));
  
  visited.add(startNodeId);
  addStep(BFS_LINE_MAP.markStartNodeVisited, `Mark ${startNodeId} as visited.`, [...queue], Array.from(visited));

  while (queue.length > 0) {
    addStep(BFS_LINE_MAP.whileQueueNotEmpty, "Queue is not empty. Continue.", [...queue], Array.from(visited));
    
    const u = queue.shift()!; // Assert non-null as queue.length > 0
    addStep(BFS_LINE_MAP.dequeueNode, `Dequeue node: ${u}. Processing its neighbors.`, [...queue], Array.from(visited), u);
    addStep(BFS_LINE_MAP.processNode, `Processing node ${u}.`, [...queue], Array.from(visited), u);

    const neighborsOfU = adj.get(u) || [];
    for (const v of neighborsOfU) {
      addStep(BFS_LINE_MAP.forLoopNeighbor, `Neighbor: ${v} of ${u}.`, [...queue], Array.from(visited), u, `${u}-${v}`);
      addStep(BFS_LINE_MAP.ifNeighborNotVisited, `Is ${v} visited?`, [...queue], Array.from(visited), u, `${u}-${v}`);
      if (!visited.has(v)) {
        visited.add(v);
        addStep(BFS_LINE_MAP.markNeighborVisited, `Mark ${v} as visited.`, [...queue], Array.from(visited), u, `${u}-${v}`);
        
        queue.push(v);
        addStep(BFS_LINE_MAP.enqueueNeighbor, `Enqueue ${v}.`, [...queue], Array.from(visited), u, `${u}-${v}`);
      } else {
         addStep(BFS_LINE_MAP.ifNeighborNotVisited, `${v} already visited. Skip.`, [...queue], Array.from(visited), u, `${u}-${v}`);
      }
      addStep(BFS_LINE_MAP.endIf, `End if for neighbor ${v}.`, [...queue], Array.from(visited), u);
    }
    addStep(BFS_LINE_MAP.endForLoop, `Finished neighbors of ${u}.`, [...queue], Array.from(visited), u);
  }
  
  addStep(BFS_LINE_MAP.endWhileLoop, "Queue is empty. BFS finished.", [...queue], Array.from(visited));
  addStep(BFS_LINE_MAP.functionEnd, "BFS complete.", [], Array.from(visited));
  
  return localSteps;
};
