
import type { GraphAlgorithmStep, GraphNode, GraphEdge } from '@/types';
import { parseGraphInput as baseParseGraphInput } from '@/app/visualizers/dfs/dfs-logic'; // Reuse parser

export const CONNECTED_COMPONENTS_LINE_MAP = {
  mainFuncStart: 1,
  initVisited: 2,
  initComponents: 3,
  getNodes: 4,
  mainLoopNodes: 5,
  checkIfNotVisited: 6,
  initCurrentComponent: 7,
  callDfs: 8,
  addComponentToList: 9,
  dfsFuncStart: 10,
  dfsMarkVisited: 11,
  dfsAddComponent: 12,
  dfsLoopNeighbors: 13,
  dfsCheckNeighborNotVisited: 14,
  dfsRecursiveCall: 15,
  returnComponents: 16,
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  visitingDfs: "hsl(var(--primary))",
  visitedCurrentComponent: "hsl(var(--accent))",
  visitedOtherComponent: "hsl(var(--muted-foreground))",
  componentColors: [ // Cycle through these for different components
    "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
    "hsl(var(--chart-4))", "hsl(var(--chart-5))",
  ],
};

const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  traversedDfs: "hsl(var(--primary))",
};

// Wrapper to ensure consistent node list even if some nodes are only targets
function parseGraphInput(input: string): { nodes: { id: string; label: string }[]; adj: Map<string, string[]> } | null {
    const parsed = baseParseGraphInput(input);
    if (!parsed) return null;

    const allNodeIds = new Set<string>(parsed.nodes.map(n => n.id));
    parsed.adj.forEach(neighbors => {
        neighbors.forEach(n => allNodeIds.add(n));
    });
    
    const finalNodes = Array.from(allNodeIds).map(id => ({ id, label: id })).sort((a,b) => a.id.localeCompare(b.id));
    finalNodes.forEach(node => {
        if (!parsed.adj.has(node.id)) {
            parsed.adj.set(node.id, []); // Ensure all nodes are in adj map
        }
    });
    return { nodes: finalNodes, adj: parsed.adj };
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
      color: NODE_COLORS.default,
    };
  });
}

export const generateConnectedComponentsSteps = (graphInput: string): GraphAlgorithmStep[] => {
  const localSteps: GraphAlgorithmStep[] = [];
  const parsedData = parseGraphInput(graphInput);
  if (!parsedData) {
    localSteps.push({ nodes: [], edges: [], currentLine: null, message: "Invalid graph input." });
    return localSteps;
  }

  const { nodes: initialNodeData, adj } = parsedData;
  if (initialNodeData.length === 0) {
    localSteps.push({ nodes: [], edges: [], currentLine: null, message: "Graph is empty." });
    return localSteps;
  }

  let graphNodes = calculateCircularLayout(initialNodeData, 500, 300);
  const graphEdges: GraphEdge[] = [];
  adj.forEach((neighbors, sourceId) => {
    neighbors.forEach(targetId => {
      if (!graphEdges.some(e => (e.source === sourceId && e.target === targetId) || (e.source === targetId && e.target === sourceId))) {
        graphEdges.push({ id: `${sourceId}-${targetId}`, source: sourceId, target: targetId, color: EDGE_COLORS.default });
      }
    });
  });

  const visited = new Set<string>();
  const components: string[][] = [];
  let componentColorIndex = 0;
  const nodeComponentMap = new Map<string, number>(); // node_id -> component_index

  const addStep = (
    line: number,
    message: string,
    activeNodeId?: string | null,
    activeEdgeId?: string | null,
    dfsStackForDisplay?: string[]
  ) => {
    const stepNodes = graphNodes.map(n => {
      let color = NODE_COLORS.default;
      if (visited.has(n.id)) {
          if (nodeComponentMap.has(n.id)) {
              color = NODE_COLORS.componentColors[nodeComponentMap.get(n.id)! % NODE_COLORS.componentColors.length];
          } else {
             color = NODE_COLORS.visitedCurrentComponent; // Visited in current DFS but component not finalized
          }
      }
      if (activeNodeId === n.id) color = NODE_COLORS.visitingDfs;
      return { ...n, color };
    });

    const stepEdges = graphEdges.map(e => ({
      ...e,
      color: (e.id === activeEdgeId || `${e.target}-${e.source}` === activeEdgeId) ? EDGE_COLORS.traversedDfs : EDGE_COLORS.default
    }));
    
    const auxDataDisplay = [
        { type: 'set' as 'set', label: 'Visited Globally', values: Array.from(visited).sort() },
        { type: 'set' as 'set', label: 'Components Found', values: components.map((c,i) => `C${i+1}: {${c.join(',')}}`) }
    ];
    if (dfsStackForDisplay && dfsStackForDisplay.length > 0) {
        auxDataDisplay.unshift({type: 'stack' as 'stack', label: 'DFS Stack', values: [...dfsStackForDisplay].reverse()});
    }


    localSteps.push({
      nodes: stepNodes,
      edges: stepEdges,
      currentLine: line,
      message,
      auxiliaryData: auxDataDisplay,
    });
  };

  addStep(CONNECTED_COMPONENTS_LINE_MAP.mainFuncStart, "Finding Connected Components.");
  addStep(CONNECTED_COMPONENTS_LINE_MAP.initVisited, "Initialize 'visited' set (empty).");
  addStep(CONNECTED_COMPONENTS_LINE_MAP.initComponents, "Initialize 'components' list (empty).");
  addStep(CONNECTED_COMPONENTS_LINE_MAP.getNodes, `Graph nodes: [${initialNodeData.map(n => n.id).join(', ')}].`);

  function dfs(nodeId: string, currentComponent: string[], dfsStack: string[]) {
    dfsStack.push(nodeId);
    addStep(CONNECTED_COMPONENTS_LINE_MAP.dfsFuncStart, `DFS started for component from node ${nodeId}. Stack: [${dfsStack.join(',')}]`, nodeId);
    visited.add(nodeId);
    nodeComponentMap.set(nodeId, components.length); // Tentatively assign to current component being built
    addStep(CONNECTED_COMPONENTS_LINE_MAP.dfsMarkVisited, `Marked ${nodeId} as visited. Stack: [${dfsStack.join(',')}]`, nodeId);
    currentComponent.push(nodeId);
    addStep(CONNECTED_COMPONENTS_LINE_MAP.dfsAddComponent, `Added ${nodeId} to current component. Current component: [${currentComponent.join(',')}]. Stack: [${dfsStack.join(',')}]`, nodeId);

    const neighbors = adj.get(nodeId) || [];
    for (const neighbor of neighbors) {
      addStep(CONNECTED_COMPONENTS_LINE_MAP.dfsLoopNeighbors, `Checking neighbor ${neighbor} of ${nodeId}. Stack: [${dfsStack.join(',')}]`, nodeId, `${nodeId}-${neighbor}`);
      addStep(CONNECTED_COMPONENTS_LINE_MAP.dfsCheckNeighborNotVisited, `Is ${neighbor} visited? Stack: [${dfsStack.join(',')}]`, nodeId, `${nodeId}-${neighbor}`);
      if (!visited.has(neighbor)) {
        addStep(CONNECTED_COMPONENTS_LINE_MAP.dfsRecursiveCall, `No. Recursive DFS call for ${neighbor}. Stack: [${dfsStack.join(',')}]`, neighbor, `${nodeId}-${neighbor}`);
        dfs(neighbor, currentComponent, dfsStack);
         addStep(CONNECTED_COMPONENTS_LINE_MAP.dfsRecursiveCall, `Returned from DFS for ${neighbor}. Stack: [${dfsStack.join(',')}]`, nodeId, `${nodeId}-${neighbor}`);
      } else {
         addStep(CONNECTED_COMPONENTS_LINE_MAP.dfsCheckNeighborNotVisited, `Yes, ${neighbor} already visited. Stack: [${dfsStack.join(',')}]`, nodeId, `${nodeId}-${neighbor}`);
      }
    }
    dfsStack.pop();
    addStep(CONNECTED_COMPONENTS_LINE_MAP.dfsFuncStart, `Finished DFS for node ${nodeId}. Stack: [${dfsStack.join(',')}]`, nodeId); // Re-using line map for end of DFS for a node
  }

  for (const node of initialNodeData) {
    addStep(CONNECTED_COMPONENTS_LINE_MAP.mainLoopNodes, `Main loop: considering node ${node.id}.`);
    addStep(CONNECTED_COMPONENTS_LINE_MAP.checkIfNotVisited, `Is ${node.id} visited?`);
    if (!visited.has(node.id)) {
      addStep(CONNECTED_COMPONENTS_LINE_MAP.initCurrentComponent, `No. Start new component search from ${node.id}.`);
      const currentComponent: string[] = [];
      const dfsStack: string[] = [];
      addStep(CONNECTED_COMPONENTS_LINE_MAP.callDfs, `Call DFS for ${node.id}.`);
      dfs(node.id, currentComponent, dfsStack);
      components.push(currentComponent);
      // Update component map for all nodes in this newly found component
      currentComponent.forEach(nId => nodeComponentMap.set(nId, components.length - 1));
      componentColorIndex++;
      addStep(CONNECTED_COMPONENTS_LINE_MAP.addComponentToList, `Component found: [${currentComponent.join(', ')}]. Added to components list.`);
    } else {
       addStep(CONNECTED_COMPONENTS_LINE_MAP.checkIfNotVisited, `Yes, ${node.id} already visited (part of component ${nodeComponentMap.get(node.id)! + 1}).`);
    }
  }
  addStep(CONNECTED_COMPONENTS_LINE_MAP.returnComponents, `All nodes processed. Found ${components.length} connected components.`);
  return localSteps;
};
