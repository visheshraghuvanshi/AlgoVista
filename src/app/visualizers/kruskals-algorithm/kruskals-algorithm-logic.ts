
import type { GraphAlgorithmStep, GraphNode, GraphEdge } from '@/types';

export const KRUSKAL_LINE_MAP = {
  // Conceptual lines for Kruskal's with DSU
  funcKruskalStart: 1,
  sortEdges: 2,
  initMST_DSU: 3,
  initEdgeCount: 4,
  loopEdgesStart: 5,
  getEdgeUVWeight: 6, // Conceptual: Processing current edge
  checkCycleDSU: 7,  // if (dsu.union(u,v)) which internally calls find
  addEdgeToMST: 8,
  incrementEdgeCount: 9,
  checkMSTComplete: 10,
  breakIfComplete: 11,
  loopEdgesEnd: 12,
  returnMST: 13,
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  inSet: (setIndex: number) => {
    const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
    return colors[setIndex % colors.length];
  },
  considering: "hsl(var(--primary))",
};

const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  considered: "hsl(var(--accent))", // Edge being actively considered
  inMST: "hsl(var(--primary))",
  discardedCycle: "hsl(var(--destructive))",
};

interface DSU {
  parent: number[];
  rank: number[];
  find(i: number): number;
  union(i: number, j: number): boolean;
}

function createDSU(n: number): DSU {
  const parent = Array(n).fill(0).map((_, i) => i);
  const rank = Array(n).fill(0);

  function find(i: number): number {
    if (parent[i] === i) return i;
    return parent[i] = find(parent[i]); // Path compression
  }

  function union(i: number, j: number): boolean {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;
      else if (rank[rootI] > rank[rootJ]) parent[rootJ] = rootI;
      else { parent[rootJ] = rootI; rank[rootI]++; }
      return true; // Union successful
    }
    return false; // Already in the same set
  }
  return { parent, rank, find, union };
}

interface ParsedEdge { u: number; v: number; weight: number; id: string; }

export function parseKruskalInput(numVerticesStr: string, edgeListStr: string): { numVertices: number, edges: ParsedEdge[], initialNodes: {id: string, label:string}[] } | null {
  const numVertices = parseInt(numVerticesStr, 10);
  if (isNaN(numVertices) || numVertices <= 0) return null;

  const edges: ParsedEdge[] = [];
  const nodeSet = new Set<number>();

  if (edgeListStr.trim() !== "") {
      const entries = edgeListStr.trim().split(';').filter(Boolean);
      for (const entry of entries) {
          const match = entry.match(/(\d+)\s*-\s*(\d+)\s*\((\-?\d+(\.\d+)?)\)/);
          if (!match) return null; // Invalid format
          const u = parseInt(match[1], 10);
          const v = parseInt(match[2], 10);
          const weight = parseFloat(match[3]);
          if (isNaN(u) || isNaN(v) || isNaN(weight) || 
              u < 0 || u >= numVertices || v < 0 || v >= numVertices) {
              return null; // Invalid node index or weight
          }
          edges.push({ u, v, weight, id: `${u}-${v}-${weight}` });
          nodeSet.add(u);
          nodeSet.add(v);
      }
  }
  
  // Ensure all vertices up to numVertices are conceptually present
  for(let i = 0; i < numVertices; i++) nodeSet.add(i);
  const initialNodes = Array.from(nodeSet).sort((a,b)=>a-b).map(n => ({ id: n.toString(), label: n.toString() }));

  return { numVertices, edges, initialNodes };
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


export const generateKruskalsSteps = (numVertices: number, edges: ParsedEdge[], initialNodeData: {id:string, label:string}[]): GraphAlgorithmStep[] => {
  const localSteps: GraphAlgorithmStep[] = [];
  const lm = KRUSKAL_LINE_MAP;

  let graphNodes = calculateCircularLayout(initialNodeData, 500, 300);
  const dsu = createDSU(numVertices);
  
  const updateNodeColorsBasedOnDSU = () => {
      const rootColors = new Map<number, string>();
      let colorIdx = 0;
      graphNodes = graphNodes.map(gn => {
          const nodeNumericId = parseInt(gn.id, 10);
          const root = dsu.find(nodeNumericId);
          if (!rootColors.has(root)) {
              rootColors.set(root, NODE_COLORS.inSet(colorIdx++));
          }
          return { ...gn, color: rootColors.get(root)! };
      });
  };
  updateNodeColorsBasedOnDSU();


  const addStep = (
    line: number,
    message: string,
    currentEdgesState: GraphEdge[],
    consideredEdgeIds: string[] = [], // For highlighting current edge
    auxData?: Record<string, any>
  ) => {
    updateNodeColorsBasedOnDSU(); // Update node colors based on current DSU sets
    const stepEdges = currentEdgesState.map(e => {
        let color = e.color;
        if (consideredEdgeIds.includes(e.id)) color = EDGE_COLORS.considered;
        return {...e, color};
    });

    localSteps.push({
      nodes: [...graphNodes],
      edges: stepEdges,
      currentLine: line,
      message,
      auxiliaryData: [
          {type: 'set', label: 'DSU Parent Array', values: dsu.parent.reduce((obj, p, i) => ({...obj, [i]: p}), {})},
          {type: 'set', label: 'Edges in MST', values: auxData?.mstEdges || [] },
          {type: 'set', label: 'Total MST Cost', values: {'Cost': auxData?.mstCost || 0}},
          ...(auxData?.currentEdge ? [{type: 'set' as 'set', label: 'Considering Edge', values: { [`${auxData.currentEdge.u}-${auxData.currentEdge.v}`]: `w:${auxData.currentEdge.weight}` }}] : []),
          ...(auxData?.status ? [{type: 'set' as 'set', label: 'Status', values: { Action: auxData.status }}] : []),
      ],
    });
  };

  addStep(lm.funcKruskalStart, `Kruskal's Algorithm started. ${numVertices} vertices.`, edges.map(e => ({id:e.id, source:e.u.toString(), target:e.v.toString(), weight:e.weight, color:EDGE_COLORS.default, isDirected: false})));
  
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  addStep(lm.sortEdges, `Edges sorted by weight. Count: ${sortedEdges.length}.`, sortedEdges.map(e => ({id:e.id, source:e.u.toString(), target:e.v.toString(), weight:e.weight, color:EDGE_COLORS.default, isDirected: false})), [], {mstEdges: []});

  const mst: ParsedEdge[] = [];
  let mstEdgesVisual: GraphEdge[] = [];
  let mstCost = 0;
  let edgeCount = 0;

  addStep(lm.initMST_DSU, "MST initialized. DSU structure created (all nodes in own set).", mstEdgesVisual, [], {mstEdges: [], mstCost});

  for (const edge of sortedEdges) {
    addStep(lm.loopEdgesStart, `Considering edge ${edge.u}-${edge.v} with weight ${edge.weight}.`, mstEdgesVisual, [edge.id], {currentEdge: edge, mstEdges: mst.map(e => `${e.u}-${e.v}(${e.weight})`), mstCost});
    
    const rootU = dsu.find(edge.u);
    const rootV = dsu.find(edge.v);
    let statusMsg = `Roots: find(${edge.u})=${rootU}, find(${edge.v})=${rootV}. `;

    if (rootU !== rootV) {
      statusMsg += `Different sets. Add edge to MST. Union(${edge.u}, ${edge.v}).`;
      dsu.union(edge.u, edge.v); // This modifies dsu.parent
      mst.push(edge);
      mstEdgesVisual.push({id: edge.id, source: edge.u.toString(), target: edge.v.toString(), weight: edge.weight, color: EDGE_COLORS.inMST, isDirected: false});
      mstCost += edge.weight;
      edgeCount++;
      addStep(lm.addEdgeToMST, statusMsg, mstEdgesVisual, [edge.id], {currentEdge: edge, status: "Edge Added", mstEdges: mst.map(e => `${e.u}-${e.v}(${e.weight})`), mstCost});
      if (edgeCount === numVertices - 1) {
        addStep(lm.checkMSTComplete, "MST complete (V-1 edges added).", mstEdgesVisual, [], {status: "MST Complete", mstEdges: mst.map(e => `${e.u}-${e.v}(${e.weight})`), mstCost});
        break;
      }
    } else {
      statusMsg += `Same set. Edge ${edge.u}-${edge.v} forms a cycle. Discard.`;
       // Visually mark edge as discarded
      const tempEdgesDiscard = mstEdgesVisual.map(e => e.id === edge.id ? {...e, color: EDGE_COLORS.discardedCycle} : e);
      if(!tempEdgesDiscard.find(e=>e.id === edge.id)) tempEdgesDiscard.push({id: edge.id, source: edge.u.toString(), target: edge.v.toString(), weight: edge.weight, color: EDGE_COLORS.discardedCycle, isDirected: false});

      addStep(lm.checkCycleDSU, statusMsg, tempEdgesDiscard, [edge.id], {currentEdge: edge, status: "Edge Discarded (Cycle)", mstEdges: mst.map(e => `${e.u}-${e.v}(${e.weight})`), mstCost});
    }
  }
  
  if (edgeCount < numVertices - 1 && numVertices > 0) {
     addStep(lm.returnMST, "Finished iterating edges. Graph might not be connected, MST not formed for all vertices.", mstEdgesVisual, [], {mstEdges: mst.map(e => `${e.u}-${e.v}(${e.weight})`), mstCost});
  } else if (numVertices === 0) {
     addStep(lm.returnMST, "Graph has 0 vertices.", mstEdgesVisual, [], {mstEdges: [], mstCost: 0});
  }
  else {
     addStep(lm.returnMST, "Kruskal's Algorithm complete.", mstEdgesVisual, [], {mstEdges: mst.map(e => `${e.u}-${e.v}(${e.weight})`), mstCost});
  }
  return localSteps;
};

