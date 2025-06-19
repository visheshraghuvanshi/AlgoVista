
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, GraphNode, GraphEdge, GraphAlgorithmStep } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { GraphControlsPanel } from './GraphControlsPanel'; // Local import
import { GraphVisualizationPanel } from './GraphVisualizationPanel'; // Local import
import { ConnectedComponentsCodePanel } from './ConnectedComponentsCodePanel';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, SigmaSquare } from 'lucide-react';
import { generateConnectedComponentsSteps } from './connected-components-logic';
import { parseGraphInput as baseParseGraphInput } from '@/app/visualizers/dfs/dfs-logic'; // Reusing a compatible parser for initial check
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Moved from CodePanel and expanded
const CONNECTED_COMPONENTS_CODE_SNIPPETS = {
  JavaScript: {
    undirected: [
      "// Connected Components in Undirected Graph (DFS)",
      "function findConnectedComponents(graph, numNodes) { // graph: {nodeId: [neighbors...]}",
      "  const visited = new Array(numNodes).fill(false);",
      "  const components = [];",
      "  // const nodes = Object.keys(graph); // Assuming nodes are 0 to numNodes-1",
      "",
      "  function dfs(u_idx, currentComponent) { // u_idx is numeric index",
      "    visited[u_idx] = true;",
      "    currentComponent.push(String(u_idx)); // Store original label if available",
      "    const neighbors_str = graph[String(u_idx)] || [];",
      "    for (const neighbor_str of neighbors_str) {",
      "      const v_idx = parseInt(neighbor_str); // Convert label to index if needed",
      "      if (!visited[v_idx]) {",
      "        dfs(v_idx, currentComponent);",
      "      }",
      "    }",
      "  }",
      "",
      "  for (let i = 0; i < numNodes; i++) {",
      "    if (!visited[i]) {",
      "      const currentComponent = [];",
      "      dfs(i, currentComponent);",
      "      components.push(currentComponent);",
      "    }",
      "  }",
      "  return components;",
      "}",
    ],
    directed: [
      "// Strongly Connected Components (Kosaraju's Algorithm - Conceptual JS)",
      "// Assumes graph is represented as adjacency list map {node_idx: [neighbor_indices...]}",
      "function kosarajuSCC(numNodes, adjListOriginal) {",
      "  const visited = new Array(numNodes).fill(false);",
      "  const finishStack = []; ",
      "  function dfs1(u) {",
      "    visited[u] = true;",
      "    for (const v of adjListOriginal.get(u) || []) {",
      "      if (!visited[v]) dfs1(v);",
      "    }",
      "    finishStack.push(u);",
      "  }",
      "  for (let i = 0; i < numNodes; i++) if (!visited[i]) dfs1(i);",
      "",
      "  const adjListT = new Map(); for(let i=0; i<numNodes; i++) adjListT.set(i, []);",
      "  adjListOriginal.forEach((neighbors, u) => {",
      "    neighbors.forEach(v => (adjListT.get(v) || []).push(u));",
      "  });",
      "",
      "  visited.fill(false);",
      "  const sccs = [];",
      "  function dfs2(u, currentSCC) {",
      "    visited[u] = true; currentSCC.push(u);",
      "    for (const v of adjListT.get(u) || []) {",
      "      if (!visited[v]) dfs2(v, currentSCC);",
      "    }",
      "  }",
      "  while (finishStack.length > 0) {",
      "    const u = finishStack.pop();",
      "    if (!visited[u]) {",
      "      const currentSCC = []; dfs2(u, currentSCC); sccs.push(currentSCC);",
      "    }",
      "  }",
      "  return sccs;",
      "}",
    ],
  },
  Python: {
    undirected: [
      "# Connected Components in Undirected Graph (DFS)",
      "def find_connected_components(graph, num_nodes): # graph: dict {node_idx: [neighbor_indices...]}",
      "    visited = [False] * num_nodes",
      "    components = []",
      "    def dfs(u, current_component):",
      "        visited[u] = True",
      "        current_component.append(u)",
      "        for v in graph.get(u, []):", // Assume keys are already int
      "            if not visited[v]:",
      "                dfs(v, current_component)",
      "    for i in range(num_nodes):",
      "        if not visited[i]:",
      "            current_component = []",
      "            dfs(i, current_component)",
      "            components.append(current_component)",
      "    return components",
    ],
    directed: [
      "# Strongly Connected Components (Kosaraju's Algorithm - Conceptual Python)",
      "from collections import defaultdict",
      "def kosaraju_scc(num_nodes, adj_list_original): # adj_list_original: dict {u: [v1, v2]}",
      "    visited = [False] * num_nodes",
      "    finish_stack = []",
      "    def dfs1(u):",
      "        visited[u] = True",
      "        for v in adj_list_original.get(u, []):",
      "            if not visited[v]: dfs1(v)",
      "        finish_stack.append(u)",
      "    for i in range(num_nodes):",
      "        if not visited[i]: dfs1(i)",
      "",
      "    adj_list_t = defaultdict(list)",
      "    for u in adj_list_original:",
      "        for v in adj_list_original[u]:",
      "            adj_list_t[v].append(u)",
      "",
      "    visited = [False] * num_nodes",
      "    sccs = []",
      "    def dfs2(u, current_scc):",
      "        visited[u] = True",
      "        current_scc.append(u)",
      "        for v in adj_list_t.get(u, []):",
      "            if not visited[v]: dfs2(v, current_scc)",
      "    while finish_stack:",
      "        u = finish_stack.pop()",
      "        if not visited[u]:",
      "            current_scc = []",
      "            dfs2(u, current_scc)",
      "            sccs.append(current_scc)",
      "    return sccs",
    ],
  },
  Java: {
    undirected: [
      "import java.util.*;",
      "public class ConnectedComponentsUndirected {",
      "    // adj: List<List<Integer>> for nodes 0 to numNodes-1",
      "    public List<List<Integer>> find(int numNodes, List<List<Integer>> adj) {",
      "        boolean[] visited = new boolean[numNodes];",
      "        List<List<Integer>> components = new ArrayList<>();",
      "        for (int i = 0; i < numNodes; i++) {",
      "            if (!visited[i]) {",
      "                List<Integer> current = new ArrayList<>();",
      "                dfs(i, adj, visited, current);",
      "                components.add(current);",
      "            }",
      "        }",
      "        return components;",
      "    }",
      "    private void dfs(int u, List<List<Integer>> adj, boolean[] visited, List<Integer> comp) {",
      "        visited[u] = true; comp.add(u);",
      "        for (int v : adj.get(u)) {", // Assumes adj.get(u) is valid
      "            if (!visited[v]) dfs(v, adj, visited, comp);",
      "        }",
      "    }",
      "}",
    ],
    directed: [
      "import java.util.*;",
      "public class KosarajuSCC {",
      "    // adj: List<List<Integer>> for nodes 0 to V-1",
      "    void dfs1(int u, List<List<Integer>> adj, boolean[] visited, Stack<Integer> stack) {",
      "        visited[u] = true;",
      "        for (int v : adj.get(u)) {",
      "            if (!visited[v]) dfs1(v, adj, visited, stack);",
      "        }",
      "        stack.push(u);",
      "    }",
      "    List<List<Integer>> getTranspose(int V, List<List<Integer>> adj) {",
      "        List<List<Integer>> adjT = new ArrayList<>();",
      "        for (int i = 0; i < V; i++) adjT.add(new ArrayList<>());",
      "        for (int u = 0; u < V; u++) {",
      "            for (int v : adj.get(u)) adjT.get(v).add(u);",
      "        }",
      "        return adjT;",
      "    }",
      "    void dfs2(int u, List<List<Integer>> adjT, boolean[] visited, List<Integer> scc) {",
      "        visited[u] = true; scc.add(u);",
      "        for (int v : adjT.get(u)) {",
      "            if (!visited[v]) dfs2(v, adjT, visited, scc);",
      "        }",
      "    }",
      "",
      "    public List<List<Integer>> findSCCs(int V, List<List<Integer>> adj) {",
      "        Stack<Integer> stack = new Stack<>();",
      "        boolean[] visited = new boolean[V];",
      "        for (int i = 0; i < V; i++) if (!visited[i]) dfs1(i, adj, visited, stack);",
      "",
      "        List<List<Integer>> adjT = getTranspose(V, adj);",
      "        Arrays.fill(visited, false);",
      "        List<List<Integer>> sccs = new ArrayList<>();",
      "        while (!stack.isEmpty()) {",
      "            int u = stack.pop();",
      "            if (!visited[u]) {",
      "                List<Integer> currentSCC = new ArrayList<>();",
      "                dfs2(u, adjT, visited, currentSCC);",
      "                sccs.add(currentSCC);",
      "            }",
      "        }",
      "        return sccs;",
      "    }",
      "}",
    ],
  },
  "C++": {
    undirected: [
      "#include <vector>",
      "#include <map>", // Or use vector<vector<int>> if nodes are 0 to N-1
      "// adj: std::vector<std::vector<int>> for nodes 0 to numNodes-1",
      "void dfs_undirected_cpp(int u, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited, std::vector<int>& component) {",
      "    visited[u] = true; component.push_back(u);",
      "    if (u < adj.size()) { // Bounds check",
      "        for (int v : adj[u]) if (!visited[v]) dfs_undirected_cpp(v, adj, visited, component);",
      "    }",
      "}",
      "std::vector<std::vector<int>> findCC(int numNodes, const std::vector<std::vector<int>>& adj) {",
      "    std::vector<bool> visited(numNodes, false);",
      "    std::vector<std::vector<int>> components;",
      "    for (int i = 0; i < numNodes; ++i) {",
      "        if (!visited[i]) {",
      "            std::vector<int> current; dfs_undirected_cpp(i, adj, visited, current); components.push_back(current);",
      "        }",
      "    }",
      "    return components;",
      "}",
    ],
    directed: [
      "#include <vector>",
      "#include <stack>",
      "#include <algorithm> // For std::fill",
      "// adj: std::vector<std::vector<int>> for nodes 0 to V-1",
      "void dfs1_cpp(int u, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited, std::stack<int>& st) {",
      "    visited[u] = true;",
      "    if (u < adj.size()) {",
      "      for (int v : adj[u]) {",
      "          if (!visited[v]) dfs1_cpp(v, adj, visited, st);",
      "      }",
      "    }",
      "    st.push(u);",
      "}",
      "std::vector<std::vector<int>> getTranspose_cpp(int V, const std::vector<std::vector<int>>& adj) {",
      "    std::vector<std::vector<int>> adjT(V);",
      "    for (int u = 0; u < V; ++u) {",
      "        if (u < adj.size()) {",
      "          for (int v : adj[u]) {",
      "              if (v < adjT.size()) adjT[v].push_back(u);", // Bounds check
      "          }",
      "        }",
      "    }",
      "    return adjT;",
      "}",
      "void dfs2_cpp(int u, const std::vector<std::vector<int>>& adjT, std::vector<bool>& visited, std::vector<int>& scc) {",
      "    visited[u] = true; scc.push_back(u);",
      "    if (u < adjT.size()) {",
      "      for (int v : adjT[u]) {",
      "          if (!visited[v]) dfs2_cpp(v, adjT, visited, scc);",
      "      }",
      "    }",
      "}",
      "",
      "std::vector<std::vector<int>> kosarajuSCC_cpp(int V, const std::vector<std::vector<int>>& adj) {",
      "    std::stack<int> st;",
      "    std::vector<bool> visited(V, false);",
      "    for (int i = 0; i < V; ++i) if (!visited[i]) dfs1_cpp(i, adj, visited, st);",
      "",
      "    std::vector<std::vector<int>> adjT = getTranspose_cpp(V, adj);",
      "    std::fill(visited.begin(), visited.end(), false);",
      "    std::vector<std::vector<int>> sccs;",
      "    while (!st.empty()) {",
      "        int u = st.top(); st.pop();",
      "        if (!visited[u]) {",
      "            std::vector<int> currentSCC; dfs2_cpp(u, adjT, visited, currentSCC); sccs.push_back(currentSCC);",
      "        }",
      "    }",
      "    return sccs;",
      "}",
    ],
  }
};


const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function ConnectedComponentsVisualizerPage() {
  const { toast } = useToast();
  
  const [graphInputValue, setGraphInputValue] = useState('0:1;1:2;2:0;3:4;4:5;5:3;6'); // Example with multiple components
  const [isDirected, setIsDirected] = useState(false); // Default to undirected
  
  const [steps, setSteps] = useState<GraphAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<GraphNode[]>([]);
  const [currentEdges, setCurrentEdges] = useState<GraphEdge[]>([]);
  const [currentAuxiliaryData, setCurrentAuxiliaryData] = useState<GraphAlgorithmStep['auxiliaryData']>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string | undefined>(algorithmMetadata.description);


  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAlgoImplemented = true;

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentNodes(currentS.nodes);
      setCurrentEdges(currentS.edges);
      setCurrentAuxiliaryData(currentS.auxiliaryData || []);
      setCurrentLine(currentS.currentLine);
      setCurrentMessage(currentS.message);
    }
  }, [steps]);
  
  const generateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const parsedData = baseParseGraphInput(graphInputValue); 
    if (!parsedData) {
      toast({ title: "Invalid Graph Input", description: "Format: 'node:neighbor1,neighbor2;...'", variant: "destructive" });
      setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      return;
    }
    if(parsedData.nodes.length === 0 && graphInputValue.trim() !== ""){
        toast({ title: "Invalid Graph Input", description: "Graph malformed or empty despite input.", variant: "destructive" });
        setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
        return;
    }

    const newSteps = generateConnectedComponentsSteps(graphInputValue, isDirected);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
      updateStateFromStep(0);
      if (newSteps[0].message && (newSteps[0].message.includes("Invalid") || newSteps[0].message.includes("empty")) ){
           toast({ title: "Graph Error", description: newSteps[0].message, variant: "destructive" });
      }
      const lastStepMsg = newSteps[newSteps.length-1]?.message || "";
      if (lastStepMsg.includes("Found")) { // Check for "Found X components" or "Found X SCCs"
           toast({title:"Components Found!", description: lastStepMsg});
      }

    } else {
      setCurrentNodes(parsedData.nodes.map(n=>({...n, x:0, y:0, color:'grey'}))); 
      setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null);
    }
  }, [graphInputValue, isDirected, toast, updateStateFromStep]);


  useEffect(() => {
    generateSteps();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphInputValue, isDirected]); 

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        updateStateFromStep(nextStepIndex);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep]);

  const handleGraphInputChange = (value: string) => setGraphInputValue(value);

  const handlePlay = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play." : "No steps. Generate first.", variant: "default" });
      setIsPlaying(false); return;
    }
    setIsPlaying(true); setIsFinished(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
  };

  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished." : "No steps.", variant: "default" });
      return;
    }
    setIsPlaying(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStepIndex(nextStepIndex);
      updateStateFromStep(nextStepIndex);
      if (nextStepIndex === steps.length - 1) setIsFinished(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false); setIsFinished(false);
    setGraphInputValue('0:1;1:2;2:0;3:4;4:5;5:3;6');
    setIsDirected(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    // generateSteps will be called by useEffect due to graphInputValue or isDirected change
  };

  const handleSpeedChange = (speedValue: number) => setAnimationSpeed(speedValue);

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!algoDetails) { 
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
          <p className="text-muted-foreground text-lg">Could not load data for Connected Components.</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <SigmaSquare className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentMessage}
          </p>
        </div>
        <div className="flex items-center space-x-2 mb-4 justify-center">
          <Switch
            id="directed-toggle-cc"
            checked={isDirected}
            onCheckedChange={setIsDirected}
            disabled={isPlaying}
          />
          <Label htmlFor="directed-toggle-cc">Directed Graph (for SCCs via Kosaraju's)</Label>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <GraphVisualizationPanel
              nodes={currentNodes}
              edges={currentEdges}
              auxiliaryData={currentAuxiliaryData}
            />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <ConnectedComponentsCodePanel
              codeSnippets={CONNECTED_COMPONENTS_CODE_SNIPPETS}
              currentLine={currentLine}
              graphType={isDirected ? 'directed' : 'undirected'}
            />
          </div>
        </div>
        <div className="w-full">
          <GraphControlsPanel
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            onGraphInputChange={handleGraphInputChange}
            graphInputValue={graphInputValue}
            showStartNodeInput={false} // Not strictly needed for CC/SCC as it processes all nodes
            isPlaying={isPlaying}
            isFinished={isFinished}
            currentSpeed={animationSpeed}
            onSpeedChange={handleSpeedChange}
            isAlgoImplemented={isAlgoImplemented}
            minSpeed={MIN_SPEED}
            maxSpeed={MAX_SPEED}
            graphInputPlaceholder="e.g., 0:1;1:2;3:4 (adj list)"
            onExecute={generateSteps} 
            executeButtonText={isDirected ? "Find SCCs" : "Find Components"}
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
