
import type { GraphAlgorithmStep, GraphNode, GraphEdge } from '@/types';

export const PRIMS_LINE_MAP = {
  // Conceptual lines for Prim's using adjacency list and min-priority queue (conceptually)
  funcPrimStart: 1,
  initParentKeyMstSet: 2, // Covers parent, key, mstSet arrays
  initMstEdges: 3,
  setKeyStartNode: 4,
  // If using PQ: addToPQ_StartNode: 5,
  loopOuter: 5, // Main loop (V-1 times or while PQ not empty)
  extractMinU: 6, // Or for-loop to find min key if not using explicit PQ for viz
  checkAlreadyInMST: 7, // if (mstSet[u]) continue;
  markInMST: 8,
  addEdgeToMST: 9, // if parent[u] != -1
  loopNeighborsV: 10, // For each neighbor v of u
  checkIfNotInMSTAndWeightSmaller: 11,
  updateKeyV: 12,
  updateParentV: 13,
  // If using PQ: addToOrUpdatePQ_V: 14,
  returnMSTEdges: 14,
};

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  inMST: "hsl(var(--primary))", // Node included in the MST
  candidate: "hsl(var(--accent))", // Node whose key is being considered/updated (in conceptual PQ)
  currentMin: "hsl(var(--ring))", // Node just extracted as minimum
};

const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  considered: "hsl(var(--accent))", // Edge being examined
  inMST: "hsl(var(--primary))",    // Edge part of the MST
};

interface PrimEdge { u: string; v: string; weight: number; id: string; }

export function parsePrimsInput(numVerticesStr: string, edgeListStr: string): { numVertices: number, adj: Map<string, { neighbor: string; weight: number; id: string }[]>, initialNodes: {id: string, label:string}[] } | null {
  const numVertices = parseInt(numVerticesStr, 10);
  if (isNaN(numVertices) || numVertices <= 0) return null;

  const adj = new Map<string, { neighbor: string; weight: number; id: string }[]>();
  const nodeSet = new Set<string>();
  
  // Ensure all vertices from 0 to numVertices-1 exist in adj map and nodeSet
  for (let i = 0; i < numVertices; i++) {
    const nodeId = i.toString();
    adj.set(nodeId, []);
    nodeSet.add(nodeId);
  }
  
  if (edgeListStr.trim() !== "") {
      const entries = edgeListStr.trim().split(';').filter(Boolean);
      for (const entry of entries) {
          const match = entry.match(/(\d+)\s*-\s*(\d+)\s*\((\-?\d+(\.\d+)?)\)/);
          if (!match) return null;
          const u = parseInt(match[1], 10);
          const v = parseInt(match[2], 10);
          const weight = parseFloat(match[3]);
          if (isNaN(u) || isNaN(v) || isNaN(weight) || weight < 0 || // Prim's generally for non-negative
              u < 0 || u >= numVertices || v < 0 || v >= numVertices) {
              return null;
          }
          const uStr = u.toString();
          const vStr = v.toString();
          // Undirected graph, add edge in both directions
          adj.get(uStr)!.push({ neighbor: vStr, weight, id: `${uStr}-${vStr}-${weight}` });
          adj.get(vStr)!.push({ neighbor: uStr, weight, id: `${vStr}-${uStr}-${weight}` });
      }
  }
  const initialNodes = Array.from(nodeSet).sort((a,b)=>parseInt(a,10)-parseInt(b,10)).map(nStr => ({ id: nStr, label: nStr }));
  return { numVertices, adj, initialNodes };
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
      color: NODE_COLORS.default, distance: Infinity,
    };
  });
}

export const generatePrimsSteps = (numVertices: number, adjMap: Map<string, { neighbor: string; weight: number; id: string }[]>, initialNodeData: {id:string, label:string}[], startNodeId: string = '0'): GraphAlgorithmStep[] => {
  const localSteps: GraphAlgorithmStep[] = [];
  const lm = PRIMS_LINE_MAP;

  let graphNodes = calculateCircularLayout(initialNodeData, 500, 300);
  
  const parent: (string | null)[] = new Array(numVertices).fill(null);
  const key: number[] = new Array(numVertices).fill(Infinity);
  const mstSet: boolean[] = new Array(numVertices).fill(false);
  const mstEdgesResult: PrimEdge[] = [];
  let mstCost = 0;

  const startNodeIdx = parseInt(startNodeId, 10);
  if (isNaN(startNodeIdx) || startNodeIdx < 0 || startNodeIdx >= numVertices) {
    addStep(null, "Invalid start node.", [], [], [], {});
    return localSteps;
  }
  key[startNodeIdx] = 0;
  
  const nodeLabelToIdx = new Map(initialNodeData.map((node, i) => [node.id, i]));
  const nodeIdxToLabel = new Map(initialNodeData.map((node, i) => [i, node.id]));


  function addStep(
    line: number | null,
    message: string,
    activeNodeIds: string[] = [],
    activeEdgeIds: string[] = [],
    currentMstEdges: PrimEdge[] = mstEdgesResult,
    auxDataOverride?: Record<string, any>
  ) {
    const stepNodes = graphNodes.map(gn => {
      const nodeIdx = nodeLabelToIdx.get(gn.id)!;
      let color = NODE_COLORS.default;
      if (mstSet[nodeIdx]) color = NODE_COLORS.inMST;
      else if (key[nodeIdx] !== Infinity) color = NODE_COLORS.candidate;
      if (activeNodeIds.includes(gn.id)) color = NODE_COLORS.currentMin; // If it's the u being processed
      return { ...gn, color, distance: key[nodeIdx] };
    });
    
    const stepEdges: GraphEdge[] = [];
    adjMap.forEach((edgesFromU, uStr) => {
        edgesFromU.forEach(edge => {
            // Ensure edges are added once for undirected graph visualization
            if(parseInt(uStr,10) < parseInt(edge.neighbor,10)){
                 stepEdges.push({id:edge.id, source:uStr, target:edge.neighbor, weight: edge.weight, color: EDGE_COLORS.default, isDirected:false});
            }
        });
    });
    currentMstEdges.forEach(mstEdge => {
        const foundEdge = stepEdges.find(e => (e.source === mstEdge.u.toString() && e.target === mstEdge.v.toString()) || (e.source === mstEdge.v.toString() && e.target === mstEdge.u.toString()));
        if(foundEdge) foundEdge.color = EDGE_COLORS.inMST;
        else { // Should not happen if mstEdges are derived from adjMap keys
            stepEdges.push({id: mstEdge.id, source: mstEdge.u.toString(), target: mstEdge.v.toString(), weight: mstEdge.weight, color: EDGE_COLORS.inMST, isDirected: false});
        }
    });
    activeEdgeIds.forEach(activeId => {
        const foundEdge = stepEdges.find(e=>e.id === activeId);
        if(foundEdge && foundEdge.color !== EDGE_COLORS.inMST) foundEdge.color = EDGE_COLORS.considered;
    });


    const pqConceptual: string[] = [];
    key.forEach((kVal, idx) => {
        if(!mstSet[idx] && kVal !== Infinity) pqConceptual.push(`${nodeIdxToLabel.get(idx)}(${kVal})`);
    });
    pqConceptual.sort((a,b) => parseInt(a.split('(')[1]) - parseInt(b.split('(')[1]));


    localSteps.push({
      nodes: stepNodes,
      edges: stepEdges,
      currentLine: line,
      message,
      auxiliaryData: auxDataOverride !== undefined ? [auxDataOverride] : [
          {type: 'set', label: 'Key Values (Min Weights to MST)', values: key.reduce((obj,k,i)=> ({...obj, [nodeIdxToLabel.get(i)!]: k===Infinity ? '∞' : k}), {})},
          {type: 'queue', label: 'Conceptual PQ (Node,Key)', values: [pqConceptual.join(', ') || '(empty)'] },
          {type: 'set', label: 'Parent in MST', values: parent.reduce((obj,p,i)=> ({...obj, [nodeIdxToLabel.get(i)!]: p===null ? 'null' : p.toString()}), {})},
          {type: 'set', label: 'MST Edges', values: currentMstEdges.map(e => `${e.u}-${e.v}(${e.weight})`)},
          {type: 'set', label: 'MST Cost', values: {'Cost': mstCost}}
      ],
    });
  }

  addStep(lm.funcPrimStart, `Prim's Algorithm started. Start node: ${startNodeId}.`);
  addStep(lm.initParentKeyMstSet, `Initialized parent, key, mstSet arrays.`);
  addStep(lm.setKeyStartNode, `Key for start node ${startNodeId} set to 0.`);

  for (let count = 0; count < numVertices; count++) {
    let u_idx = -1, minKey = Infinity;
    addStep(lm.loopOuter, `Outer loop iteration ${count + 1}. Finding min key vertex not in MST.`, [], [], mstEdgesResult);
    
    for (let v_idx = 0; v_idx < numVertices; v_idx++) {
      if (!mstSet[v_idx] && key[v_idx] < minKey) {
        minKey = key[v_idx];
        u_idx = v_idx;
      }
    }
    
    if (u_idx === -1) {
      addStep(lm.extractMinU, "No reachable vertex found or MST complete for connected component.", [], [], mstEdgesResult);
      break; 
    }
    const u_label = nodeIdxToLabel.get(u_idx)!;
    addStep(lm.extractMinU, `Vertex ${u_label} (index ${u_idx}) with min key ${minKey} extracted.`, [u_label], [], mstEdgesResult);

    mstSet[u_idx] = true;
    addStep(lm.markInMST, `Added ${u_label} to MST.`, [u_label], [], mstEdgesResult);

    if (parent[u_idx] !== null) {
      const parentLabel = nodeIdxToLabel.get(parent[u_idx]! )!;
      mstEdgesResult.push({ u: parseInt(parentLabel,10), v: parseInt(u_label,10), weight: key[u_idx], id: `${parentLabel}-${u_label}-${key[u_idx]}` });
      mstCost += key[u_idx];
      addStep(lm.addEdgeToMST, `Edge (${parentLabel}-${u_label}, weight ${key[u_idx]}) added to MST. Cost: ${mstCost}.`, [u_label], [`${parentLabel}-${u_label}-${key[u_idx]}`], mstEdgesResult);
    }

    const neighborsOfU = adjMap.get(u_label) || [];
    for (const edge of neighborsOfU) {
      const v_label = edge.neighbor;
      const v_idx = nodeLabelToIdx.get(v_label)!;
      const weight = edge.weight;
      const edgeIdToHighlight = edge.id;

      addStep(lm.loopNeighborsV, `Considering neighbor ${v_label} of ${u_label}. Edge weight: ${weight}.`, [u_label, v_label], [edgeIdToHighlight], mstEdgesResult);
      addStep(lm.checkIfNotInMSTAndWeightSmaller, `Is ${v_label} not in MST AND edge weight ${weight} < key[${v_idx}] (${key[v_idx] === Infinity ? '∞': key[v_idx]})?`, [u_label,v_label], [edgeIdToHighlight], mstEdgesResult);
      if (!mstSet[v_idx] && weight < key[v_idx]) {
        parent[v_idx] = u_idx; // Store index
        key[v_idx] = weight;
        addStep(lm.updateKeyV, `Yes. Update key[${v_idx}] = ${weight}.`, [u_label, v_label], [edgeIdToHighlight], mstEdgesResult);
        addStep(lm.updateParentV, `Set parent[${v_idx}] = ${u_label}.`, [u_label, v_label], [edgeIdToHighlight], mstEdgesResult);
      } else {
         addStep(lm.checkIfNotInMSTAndWeightSmaller, `No. Condition not met.`, [u_label,v_label], [edgeIdToHighlight], mstEdgesResult);
      }
    }
  }
  
  if (mstEdgesResult.length < numVertices - 1 && numVertices > 1) {
    addStep(lm.returnMSTEdges, `Algorithm finished. Graph may not be connected. MST found has ${mstEdgesResult.length} edges. Cost: ${mstCost}.`, [], [], mstEdgesResult, {result: "MST (Possibly Incomplete)", cost: mstCost});
  } else if (numVertices <=1) {
    addStep(lm.returnMSTEdges, `Algorithm finished. Graph has ${numVertices} vertex/vertices. MST cost: ${mstCost}.`, [], [], mstEdgesResult, {result: "MST", cost: mstCost});
  } else {
    addStep(lm.returnMSTEdges, `Algorithm finished. MST found. Total cost: ${mstCost}.`, [], [], mstEdgesResult, {result: "MST Complete", cost: mstCost});
  }
  return localSteps;
};

