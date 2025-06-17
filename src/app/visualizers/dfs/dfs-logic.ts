
import type { GraphAlgorithmStep, GraphNode, GraphEdge } from '@/types';

export const DFS_LINE_MAP = {
  // Iterative DFS using a stack
  functionDeclaration: 1,
  initStackAndVisited: 2,
  pushStartNode: 3,
  whileStackNotEmpty: 4,
  popNode: 5,
  ifNodeNotVisited: 6,
  markNodeVisited: 7,
  processNode: 8, // Placeholder for "current node being processed"
  forLoopNeighbor: 9,
  ifNeighborNotProcessedPush: 10, // Iterative DFS pushes unvisited neighbors
  endIfNeighbor: 11,
  endForLoop: 12,
  endIfNodeNotVisited: 13,
  endWhileLoop: 14,
  functionEnd: 15,
};

// Colors for node states
const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  visiting: "hsl(var(--primary))", // Node currently being popped and processed
  visited: "hsl(var(--muted-foreground))", // Node already processed (fully explored from)
  inStack: "hsl(var(--accent))", // Node in the stack
  start: "hsl(var(--accent))",
};

const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  traversed: "hsl(var(--primary))",
};

interface ParsedGraph {
  nodes: { id: string; label: string }[];
  adj: Map<string, string[]>;
}

// Re-using the same parser as BFS
export function parseGraphInput(input: string): ParsedGraph | null {
  const adj = new Map<string, string[]>();
  const nodeSet = new Set<string>();
  const entries = input.trim().split(';').filter(Boolean);

  if (entries.length === 0 && input.trim() !== "") return null;
  if (input.trim() === "") return { nodes: [], adj: new Map() };

  for (const entry of entries) {
    const parts = entry.split(':');
    if (parts.length !== 2) return null;

    const nodeId = parts[0].trim();
    if (!nodeId) return null;
    nodeSet.add(nodeId);

    const neighbors = parts[1].split(',').map(n => n.trim()).filter(Boolean);
    // For DFS, reverse neighbors to mimic classic recursive call order when using iterative stack
    adj.set(nodeId, neighbors.reverse()); 
    neighbors.forEach(neighbor => nodeSet.add(neighbor));
  }
  
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
    const angle = (index / numNodes) * 2 * Math.PI - (Math.PI /2);
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

export const generateDfsSteps = (parsedGraph: ParsedGraph, startNodeId: string): GraphAlgorithmStep[] => {
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
  adj.forEach((originalNeighbors, sourceId) => {
    // adj already stores reversed neighbors for iterative DFS logic
    // but for drawing, we use the logical connection
    originalNeighbors.slice().reverse().forEach(targetId => { // Iterate over copy if needed, or ensure adj is not mutated
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
    currentStack: string[] = [],
    visitedSet: string[] = [],
    currentProcessingNodeId: string | null = null,
    highlightedEdgeId: string | null = null
  ) => {
    const stepNodes = graphNodes.map(n => ({
      ...n,
      color: n.id === startNodeId && !visitedSet.includes(n.id) && !currentStack.includes(n.id) && currentProcessingNodeId !== n.id ? NODE_COLORS.start : 
            (n.id === currentProcessingNodeId ? NODE_COLORS.visiting : 
             (currentStack.includes(n.id) ? NODE_COLORS.inStack : 
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
        { type: 'stack', label: 'Stack', values: [...currentStack].reverse() }, // Show top of stack first
        { type: 'set', label: 'Visited', values: [...visitedSet].sort() }
      ],
      currentLine: line,
      message,
    });
  };

  addStep(DFS_LINE_MAP.functionDeclaration, "DFS initialized (iterative).");

  const stack: string[] = [];
  const visited = new Set<string>();

  addStep(DFS_LINE_MAP.initStackAndVisited, "Initialize stack and visited set.", [], Array.from(visited));
  
  stack.push(startNodeId);
  addStep(DFS_LINE_MAP.pushStartNode, `Push start node: ${startNodeId} to stack.`, [...stack], Array.from(visited));
  
  while (stack.length > 0) {
    addStep(DFS_LINE_MAP.whileStackNotEmpty, "Stack is not empty. Continue.", [...stack], Array.from(visited));
    
    const u = stack.pop()!;
    addStep(DFS_LINE_MAP.popNode, `Pop node: ${u}.`, [...stack], Array.from(visited), u);
    
    addStep(DFS_LINE_MAP.ifNodeNotVisited, `Is ${u} visited?`, [...stack], Array.from(visited), u);
    if (!visited.has(u)) {
      visited.add(u);
      addStep(DFS_LINE_MAP.markNodeVisited, `Mark ${u} as visited. Processing its neighbors.`, [...stack], Array.from(visited), u);
      addStep(DFS_LINE_MAP.processNode, `Processing node ${u}.`, [...stack], Array.from(visited), u);

      const neighborsOfU = adj.get(u) || []; // adj.get(u) provides already reversed neighbors
      for (const v of neighborsOfU) { // Iterating in this order ensures deeper nodes are added to stack first
        addStep(DFS_LINE_MAP.forLoopNeighbor, `Neighbor: ${v} of ${u}.`, [...stack], Array.from(visited), u, `${u}-${v}`);
        // For iterative DFS, we push to stack if not visited, actual visit happens when popped.
        // The condition "if neighbor not processed" here means "if neighbor not visited *yet*".
        addStep(DFS_LINE_MAP.ifNeighborNotProcessedPush, `Is ${v} visited? (To decide push)`, [...stack], Array.from(visited), u, `${u}-${v}`);
        if (!visited.has(v)) {
          stack.push(v);
          addStep(DFS_LINE_MAP.ifNeighborNotProcessedPush, `Push ${v} to stack (not visited yet).`, [...stack], Array.from(visited), u, `${u}-${v}`);
        } else {
           addStep(DFS_LINE_MAP.ifNeighborNotProcessedPush, `${v} already visited. Skip push.`, [...stack], Array.from(visited), u, `${u}-${v}`);
        }
        addStep(DFS_LINE_MAP.endIfNeighbor, `End if for neighbor ${v}.`, [...stack], Array.from(visited), u);
      }
      addStep(DFS_LINE_MAP.endForLoop, `Finished checking neighbors of ${u}.`, [...stack], Array.from(visited), u);
    } else {
        addStep(DFS_LINE_MAP.ifNodeNotVisited, `${u} already visited. Skip processing.`, [...stack], Array.from(visited), u);
    }
    addStep(DFS_LINE_MAP.endIfNodeNotVisited, `End if for node ${u} visited check.`, [...stack], Array.from(visited), u);
  }
  
  addStep(DFS_LINE_MAP.endWhileLoop, "Stack is empty. DFS finished.", [...stack], Array.from(visited));
  addStep(DFS_LINE_MAP.functionEnd, "DFS complete.", [], Array.from(visited));
  
  return localSteps;
};
