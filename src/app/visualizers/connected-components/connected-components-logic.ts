
import type { GraphAlgorithmStep, GraphNode, GraphEdge } from './types'; // Local import
import { parseGraphInput as baseParseGraphInput } from '@/app/visualizers/dfs/dfs-logic'; // Reuse parser

export const CONNECTED_COMPONENTS_LINE_MAP_UNDIRECTED = {
  mainFuncStart: 1, initVisited: 2, initComponents: 3, getNodes: 4,
  mainLoopNodes: 5, checkIfNotVisited: 6, initCurrentComponent: 7, callDfs: 8, addComponentToList: 9,
  dfsFuncStart: 10, dfsMarkVisited: 11, dfsAddComponent: 12, dfsLoopNeighbors: 13,
  dfsCheckNeighborNotVisited: 14, dfsRecursiveCall: 15, returnComponents: 16,
};

export const CONNECTED_COMPONENTS_LINE_MAP_DIRECTED_KOSARAJU = {
  mainFuncStart: 1,
  initVisited1: 2,
  initFinishStack: 3,
  firstDfsLoop: 4, 
  dfs1FuncStart: 5,
  dfs1MarkVisited: 6,
  dfs1LoopNeighbors: 7,
  dfs1CheckNeighborNotVisited: 8,
  dfs1RecursiveCall: 9,
  dfs1PushToStack: 10,
  computeTransposeStart: 11, 
  computeTransposeLoopU: 12,
  computeTransposeLoopV: 13, 
  initVisited2: 14,
  initSccsList: 15,
  secondDfsLoopOuter: 16, 
  popFromStack: 17,
  checkNodeNotVisitedOuter2: 18,
  initCurrentScc: 19,
  callDfs2: 20, 
  addSccToList: 21,
  dfs2FuncStart: 22,
  dfs2MarkVisited: 23,
  dfs2AddNodeToScc: 24,
  dfs2LoopNeighborsTranspose: 25,
  dfs2CheckNeighborNotVisitedInner: 26,
  dfs2RecursiveCallInner: 27,
  returnSccs: 28,
};


const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  visitingDfs: "hsl(var(--primary))",
  visitedCurrentComponent: "hsl(var(--accent))",
  visitedOtherComponent: "hsl(var(--muted-foreground))",
  sccColors: [ 
    "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
    "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--ring))",
    "hsl(var(--destructive))", "hsl(var(--blue-500))", "hsl(var(--green-500))", "hsl(var(--yellow-500))"
  ],
};

const EDGE_COLORS = {
  default: "hsl(var(--muted-foreground))",
  traversedDfs: "hsl(var(--primary))",
  transpose: "hsl(var(--purple-500))", 
};

interface ParsedGraphForSCC {
  numNodes: number;
  adj: Map<number, number[]>; 
  adjT?: Map<number, number[]>; 
  nodeLabelToIdx: Map<string, number>;
  nodeIdxToLabel: Map<number, string>;
  initialNodes: {id:string, label:string}[]; 
}

function parseGraphForSCC(input: string): ParsedGraphForSCC | null {
    const parsedBase = baseParseGraphInput(input);
    if (!parsedBase) return null;

    const allNodeIds = new Set<string>();
    parsedBase.nodes.forEach(n => allNodeIds.add(n.id));
    parsedBase.adj.forEach((neighbors, sourceNodeId) => {
        allNodeIds.add(sourceNodeId);
        neighbors.forEach(n => allNodeIds.add(n));
    });
    
    const nodeLabels = Array.from(allNodeIds).sort((a,b) => a.localeCompare(b));
    const nodeLabelToIdx = new Map(nodeLabels.map((label, index) => [label, index]));
    const nodeIdxToLabel = new Map(nodeLabels.map((label, index) => [index, label]));
    const numNodes = nodeLabels.length;

    const adjNumeric = new Map<number, number[]>();
    for (let i = 0; i < numNodes; i++) adjNumeric.set(i, []); 

    parsedBase.adj.forEach((neighbors, sourceLabel) => {
        const sourceIdx = nodeLabelToIdx.get(sourceLabel)!;
        // Ensure adjNumeric.get(sourceIdx) exists before pushing
        if (!adjNumeric.has(sourceIdx)) adjNumeric.set(sourceIdx, []);
        adjNumeric.get(sourceIdx)!.push(...neighbors.map(nLabel => nodeLabelToIdx.get(nLabel)!));
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

export const generateConnectedComponentsSteps = (graphInput: string, isDirected: boolean): GraphAlgorithmStep[] => {
  const localSteps: GraphAlgorithmStep[] = [];
  const parsedData = parseGraphForSCC(graphInput); 

  if (!parsedData) {
    localSteps.push({ nodes: [], edges: [], currentLine: null, message: "Invalid graph input." });
    return localSteps;
  }
  
  const { numNodes, adj: adjNumericOriginal, nodeLabelToIdx, nodeIdxToLabel, initialNodes } = parsedData;
  
  if (numNodes === 0) {
    localSteps.push({ nodes: [], edges: [], currentLine: null, message: "Graph is empty." });
    return localSteps;
  }

  let graphNodesVisual = calculateCircularLayout(initialNodes, 500, 300);
  
  const buildGraphEdgesVisual = (currentAdjMap: Map<number, number[]>, isTranspose = false) => {
    const edgesVisual: GraphEdge[] = [];
    const addedEdgesForUndirected = new Set<string>();
    currentAdjMap.forEach((neighbors, u_idx) => {
        const u_label = nodeIdxToLabel.get(u_idx)!;
        neighbors.forEach(v_idx => {
            const v_label = nodeIdxToLabel.get(v_idx)!;
            const edgeId1 = `${u_label}-${v_label}`;
            const edgeId2 = `${v_label}-${u_label}`;
            if(isDirected || !addedEdgesForUndirected.has(edgeId1) && !addedEdgesForUndirected.has(edgeId2)) {
                 edgesVisual.push({
                    id: isTranspose ? `T-${edgeId1}` : edgeId1, 
                    source: u_label, target: v_label, 
                    color: isTranspose ? EDGE_COLORS.transpose : EDGE_COLORS.default, 
                    isDirected
                });
                if(!isDirected){ addedEdgesForUndirected.add(edgeId1); addedEdgesForUndirected.add(edgeId2); }
            }
        });
    });
    return edgesVisual;
  };
  let currentGraphEdgesVisual = buildGraphEdgesVisual(adjNumericOriginal, false);


  const visited = new Array(numNodes).fill(false);
  let componentColorIndex = 0;
  const nodeComponentMap = new Map<number, number>(); 

  const addStep = (
    lineMap: Record<string, number>, 
    lineKey: keyof typeof lineMap,
    message: string,
    auxiliaryDataUpdates?: Record<string, any>, // Store specific aux data like finishStack, sccs, current component
    activeNode_idx?: number,
    activeEdge_uv_indices?: [number, number],
    useTransposeVisuals?: boolean
  ) => {
    const stepNodes = graphNodesVisual.map(gn => {
      const nodeIdx = nodeLabelToIdx.get(gn.id)!;
      let color = NODE_COLORS.default;
      if (nodeComponentMap.has(nodeIdx)) {
          color = NODE_COLORS.sccColors[nodeComponentMap.get(nodeIdx)! % NODE_COLORS.sccColors.length];
      } else if (auxiliaryDataUpdates?.finishStack?.includes(nodeIdx) && isDirected) { // Highlight nodes in finish stack differently
          color = NODE_COLORS.visitedOtherComponent;
      } else if (visited[nodeIdx]) {
          color = NODE_COLORS.visitedCurrentComponent; 
      }
      if (activeNode_idx === nodeIdx) color = NODE_COLORS.visitingDfs;
      return { ...gn, color };
    });

    const currentEdgesToDisplay = useTransposeVisuals && parsedData.adjT 
                                ? buildGraphEdgesVisual(parsedData.adjT, true) 
                                : currentGraphEdgesVisual;

    const stepEdgesCloned = currentEdgesToDisplay.map(e => ({...e, color: e.color || EDGE_COLORS.default}));
    if(activeEdge_uv_indices) {
        const uLabel = nodeIdxToLabel.get(activeEdge_uv_indices[0])!;
        const vLabel = nodeIdxToLabel.get(activeEdge_uv_indices[1])!;
        const edgeIdToFind = useTransposeVisuals ? `T-${uLabel}-${vLabel}` : `${uLabel}-${vLabel}`;
        const edge = stepEdgesCloned.find(e => e.id === edgeIdToFind);
        if(edge) edge.color = EDGE_COLORS.traversedDfs;
    }
    
    let currentAuxData: GraphAlgorithmStep['auxiliaryData'] = [
        { type: 'set', label: 'Visited', values: initialNodes.filter(n => visited[nodeLabelToIdx.get(n.id)!]).map(n => n.id).sort() },
    ];
    if (auxiliaryDataUpdates) {
        if(auxiliaryDataUpdates.finishStack) currentAuxData.push({type:'stack', label:'Finish Order (Stack Top)', values: auxiliaryDataUpdates.finishStack.map((idx:number)=>nodeIdxToLabel.get(idx)!).reverse()});
        if(auxiliaryDataUpdates.sccsList) currentAuxData.push({type:'list', label:'SCCs Found', values: auxiliaryDataUpdates.sccsList.map((scc: string[], i: number) => `SCC${i+1}: {${scc.join(',')}}`)});
        if(auxiliaryDataUpdates.currentComponentList) currentAuxData.push({type:'set', label:'Current Component', values: [auxiliaryDataUpdates.currentComponentList]});
    }

    localSteps.push({
      nodes: stepNodes, edges: stepEdgesCloned, currentLine: lineMap[lineKey], message, auxiliaryData: currentAuxData,
    });
  };


  if (!isDirected) { 
    const lmUndirected = CONNECTED_COMPONENTS_LINE_MAP_UNDIRECTED;
    const components: string[][] = [];
    addStep(lmUndirected, 'mainFuncStart', "Finding Connected Components (Undirected DFS).");
    
    function dfsUndirected(u_idx: number, currentComponent: string[]) {
        const u_label = nodeIdxToLabel.get(u_idx)!;
        addStep(lmUndirected, 'dfsFuncStart', `DFS from ${u_label}.`, {components: components.map((c,i)=>`C${i+1}:{${c.join(',')}}`) }, u_idx);
        visited[u_idx] = true;
        nodeComponentMap.set(u_idx, components.length);
        currentComponent.push(u_label);
        addStep(lmUndirected, 'dfsMarkVisited', `Marked ${u_label} visited. Added to component.`, {components: components.map((c,i)=>`C${i+1}:{${c.join(',')}}`), currentComponentList: currentComponent.join(',') }, u_idx);

        for (const v_idx of adjNumericOriginal.get(u_idx) || []) {
            addStep(lmUndirected, 'dfsLoopNeighbors', `Checking neighbor ${nodeIdxToLabel.get(v_idx)!} of ${u_label}.`, {components: components.map((c,i)=>`C${i+1}:{${c.join(',')}}`), currentComponentList: currentComponent.join(',') }, u_idx, [u_idx, v_idx]);
            if (!visited[v_idx]) {
                addStep(lmUndirected, 'dfsCheckNeighborNotVisited', `${nodeIdxToLabel.get(v_idx)!} not visited. Recursive call.`, {components: components.map((c,i)=>`C${i+1}:{${c.join(',')}}`), currentComponentList: currentComponent.join(',') }, u_idx, [u_idx, v_idx]);
                dfsUndirected(v_idx, currentComponent);
            }
        }
    }
    for (let i = 0; i < numNodes; i++) {
        addStep(lmUndirected, 'mainLoopNodes', `Main loop: node ${nodeIdxToLabel.get(i)!}. Visited: ${visited[i]}.`, {components: components.map((c,idx)=>`C${idx+1}:{${c.join(',')}}`) }, i);
        if (!visited[i]) {
            const currentComponent: string[] = [];
            addStep(lmUndirected, 'checkIfNotVisited', `Node ${nodeIdxToLabel.get(i)!} not visited. Start new component DFS.`, {components: components.map((c,idx)=>`C${idx+1}:{${c.join(',')}}`) }, i);
            dfsUndirected(i, currentComponent);
            components.push(currentComponent);
            addStep(lmUndirected, 'addComponentToList', `Component found: [${currentComponent.join(', ')}].`, {components: components.map((c,idx)=>`C${idx+1}:{${c.join(',')}}`) }, i);
        }
    }
    addStep(lmUndirected, 'returnComponents', `All nodes processed. Found ${components.length} components.`, {components: components.map((c,i)=>`C${i+1}:{${c.join(',')}}`) });

  } else { 
    const lmDirected = CONNECTED_COMPONENTS_LINE_MAP_DIRECTED_KOSARAJU;
    const finishStack: number[] = [];
    addStep(lmDirected, 'mainFuncStart', "Kosaraju's for SCCs. Step 1: DFS for finishing times.", {finishStack: []});

    function dfs1(u_idx: number) {
        const u_label = nodeIdxToLabel.get(u_idx)!;
        addStep(lmDirected, 'dfs1FuncStart', `DFS1 from ${u_label}.`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!)} , u_idx);
        visited[u_idx] = true;
        addStep(lmDirected, 'dfs1MarkVisited', `DFS1: Marked ${u_label} visited.`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!)} , u_idx);
        for (const v_idx of adjNumericOriginal.get(u_idx) || []) {
            addStep(lmDirected, 'dfs1LoopNeighbors', `DFS1: Checking neighbor ${nodeIdxToLabel.get(v_idx)!} of ${u_label}.`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!)} , u_idx, [u_idx, v_idx]);
            if (!visited[v_idx]) {
                 addStep(lmDirected, 'dfs1CheckNeighborNotVisited', `DFS1: ${nodeIdxToLabel.get(v_idx)!} not visited. Recursive call.`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!)} , u_idx, [u_idx, v_idx]);
                dfs1(v_idx);
            }
        }
        finishStack.push(u_idx);
        addStep(lmDirected, 'dfs1PushToStack', `DFS1: Finished ${u_label}, pushed to stack. Stack top: ${u_label}`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!)} , u_idx);
    }
    for (let i = 0; i < numNodes; i++) {
         addStep(lmDirected, 'firstDfsLoop', `DFS1 Main Loop: node ${nodeIdxToLabel.get(i)!}. Visited: ${visited[i]}`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!)} , i);
        if (!visited[i]) dfs1(i);
    }
    addStep(lmDirected, 'firstDfsLoop', "DFS1 complete. Finish stack created.", {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!) });

    addStep(lmDirected, 'computeTransposeStart', "Step 2: Compute Transpose Graph.", {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!)});
    const adjTranspose = new Map<number, number[]>();
    for(let i=0; i<numNodes; ++i) adjTranspose.set(i, []);
    adjNumericOriginal.forEach((neighbors, u_idx) => {
         addStep(lmDirected, 'computeTransposeLoopU', `Transposing edges from node ${nodeIdxToLabel.get(u_idx)!}.`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!)} , u_idx);
        neighbors.forEach(v_idx => {
            (adjTranspose.get(v_idx) || []).push(u_idx);
            addStep(lmDirected, 'computeTransposeLoopV', `Added transpose edge ${nodeIdxToLabel.get(v_idx)!} -> ${nodeIdxToLabel.get(u_idx)!}.`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!)} , u_idx, [v_idx, u_idx]);
        });
    });
    parsedData.adjT = adjTranspose; 
    addStep(lmDirected, 'computeTransposeStart', "Transpose graph computed. Switching visualization to Transpose Graph.", {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!)}, undefined, undefined, true);


    visited.fill(false);
    nodeComponentMap.clear(); 
    const sccs: string[][] = [];
    componentColorIndex = 0;
    addStep(lmDirected, 'initVisited2', "Step 3: DFS on Transpose. Visited array reset.", {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!), sccsList: []}, undefined, undefined, true);
    
    function dfs2(u_idx: number, currentSCCList: string[]) {
        const u_label = nodeIdxToLabel.get(u_idx)!;
        addStep(lmDirected, 'dfs2FuncStart', `DFS2 from ${u_label}.`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!), sccsList: sccs.map((c,i)=>`SCC${i+1}:{${c.join(',')}}`), currentComponentList: currentSCCList.join(',') }, u_idx, undefined, true);
        visited[u_idx] = true;
        nodeComponentMap.set(u_idx, sccs.length); 
        currentSCCList.push(u_label);
        addStep(lmDirected, 'dfs2MarkVisited', `DFS2: Marked ${u_label} visited. Added to current SCC.`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!), sccsList: sccs.map((c,i)=>`SCC${i+1}:{${c.join(',')}}`), currentComponentList: currentSCCList.join(',') }, u_idx, undefined, true);
        for (const v_idx of adjTranspose.get(u_idx) || []) {
             addStep(lmDirected, 'dfs2LoopNeighborsTranspose', `DFS2: Checking neighbor ${nodeIdxToLabel.get(v_idx)!} of ${u_label} in transpose.`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!), sccsList: sccs.map((c,i)=>`SCC${i+1}:{${c.join(',')}}`), currentComponentList: currentSCCList.join(',') }, u_idx, [u_idx, v_idx], true);
            if (!visited[v_idx]) {
                 addStep(lmDirected, 'dfs2CheckNeighborNotVisitedInner', `DFS2: ${nodeIdxToLabel.get(v_idx)!} not visited. Recursive call.`, {finishStack: [...finishStack].map(idx => nodeIdxToLabel.get(idx)!), sccsList: sccs.map((c,i)=>`SCC${i+1}:{${c.join(',')}}`), currentComponentList: currentSCCList.join(',') }, u_idx, [u_idx, v_idx], true);
                dfs2(v_idx, currentSCCList);
            }
        }
    }
    const stackCopyForIteration = [...finishStack];
    while (stackCopyForIteration.length > 0) {
        const u_idx = stackCopyForIteration.pop()!; 
        const u_label_iter = nodeIdxToLabel.get(u_idx)!;
        addStep(lmDirected, 'popFromStack', `Popped ${u_label_iter} from stack. Visited: ${visited[u_idx]}.`, {finishStack: stackCopyForIteration.map(idx=>nodeIdxToLabel.get(idx)!), sccsList: sccs.map((c,i)=>`SCC${i+1}:{${c.join(',')}}`) }, u_idx, undefined, true);
        if (!visited[u_idx]) {
            const currentSCC: string[] = [];
            addStep(lmDirected, 'initCurrentScc', `Node ${u_label_iter} not visited. Start DFS2 for new SCC.`, {finishStack: stackCopyForIteration.map(idx=>nodeIdxToLabel.get(idx)!), sccsList: sccs.map((c,i)=>`SCC${i+1}:{${c.join(',')}}`) }, u_idx, undefined, true);
            dfs2(u_idx, currentSCC);
            sccs.push(currentSCC);
            currentSCC.forEach(nodeLabel => {
                const nodeNumericId = nodeLabelToIdx.get(nodeLabel)!;
                nodeComponentMap.set(nodeNumericId, componentColorIndex);
            });
            componentColorIndex++;
            addStep(lmDirected, 'addSccToList', `SCC found: [${currentSCC.join(', ')}].`, {finishStack: stackCopyForIteration.map(idx=>nodeIdxToLabel.get(idx)!), sccsList: sccs.map((c,i)=>`SCC${i+1}:{${c.join(',')}}`) }, u_idx, undefined, true);
        }
    }
    addStep(lmDirected, 'returnSccs', `Kosaraju's complete. Found ${sccs.length} SCCs.`, {sccsList: sccs.map((c,i)=>`SCC${i+1}:{${c.join(',')}}`) }, undefined, undefined, true);
  }
  return localSteps;
};
