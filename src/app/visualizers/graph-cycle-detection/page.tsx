
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, GraphNode, GraphEdge, GraphAlgorithmStep } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { GraphControlsPanel } from './GraphControlsPanel'; // Local import
import { GraphVisualizationPanel } from './GraphVisualizationPanel'; // Local import
import { GraphCycleDetectionCodePanel } from './GraphCycleDetectionCodePanel';
import { useToast } from "@/hooks/use-toast";
import { AlertOctagon, RefreshCwCcw } from 'lucide-react'; // RefreshCwCcw for cycle
import { generateGraphCycleDetectionSteps } from './graph-cycle-detection-logic';
import { parseGraphInput as baseParseGraphInput } from '@/app/visualizers/dfs/dfs-logic'; 
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Moved from CodePanel and expanded
const CYCLE_DETECTION_CODE_SNIPPETS = {
  JavaScript: {
    undirected: [
      "// Cycle Detection in Undirected Graph using DFS",
      "function hasCycleUndirected(graph, numNodes) { // graph: {nodeId: [neighbors...]}",
      "  const visited = new Array(numNodes).fill(false);",
      "  function dfs(u, parent) {",
      "    visited[u] = true;",
      "    for (const v_str of graph[String(u)] || []) {", // Convert u to string for graph lookup
      "      const v = parseInt(v_str);",
      "      if (!visited[v]) {",
      "        if (dfs(v, u)) return true;",
      "      } else if (v !== parent) {",
      "        return true; // Found a back edge",
      "      }",
      "    }",
      "    return false;",
      "  }",
      "  for (let i = 0; i < numNodes; i++) {",
      "    if (!visited[i]) {",
      "      if (dfs(i, -1)) return true;", // -1 for no parent
      "    }",
      "  }",
      "  return false;",
      "}",
    ],
    directed: [
      "// Cycle Detection in Directed Graph using DFS",
      "function hasCycleDirected(graph, numNodes) { // graph: {nodeId: [neighbors...]}",
      "  const visited = new Array(numNodes).fill(false);",
      "  const recursionStack = new Array(numNodes).fill(false);",
      "  function dfs(u) {",
      "    visited[u] = true; recursionStack[u] = true;",
      "    for (const v_str of graph[String(u)] || []) {", // Convert u to string
      "      const v = parseInt(v_str);",
      "      if (!visited[v]) {",
      "        if (dfs(v)) return true;",
      "      } else if (recursionStack[v]) {",
      "        return true; // Found a back edge to node in recursion stack",
      "      }",
      "    }",
      "    recursionStack[u] = false;",
      "    return false;",
      "  }",
      "  for (let i = 0; i < numNodes; i++) {",
      "    if (!visited[i]) {",
      "      if (dfs(i)) return true;",
      "    }",
      "  }",
      "  return false;",
      "}",
    ],
  },
  Python: {
    undirected: [
      "# Cycle Detection in Undirected Graph using DFS",
      "def has_cycle_undirected(graph, num_nodes): # graph: dict {node_idx: [neighbor_indices...]}",
      "    visited = [False] * num_nodes",
      "    def dfs(u, parent):",
      "        visited[u] = True",
      "        for v in graph.get(u, []):", # Assume keys are already int
      "            if not visited[v]:",
      "                if dfs(v, u): return True",
      "            elif v != parent:",
      "                return True",
      "        return False",
      "    for i in range(num_nodes):",
      "        if not visited[i]:",
      "            if dfs(i, -1): return True",
      "    return False",
    ],
    directed: [
      "# Cycle Detection in Directed Graph using DFS",
      "def has_cycle_directed(graph, num_nodes): # graph: dict {node_idx: [neighbor_indices...]}",
      "    visited = [False] * num_nodes",
      "    recursion_stack = [False] * num_nodes",
      "    def dfs(u):",
      "        visited[u] = True",
      "        recursion_stack[u] = True",
      "        for v in graph.get(u, []):", # Assume keys are already int
      "            if not visited[v]:",
      "                if dfs(v): return True",
      "            elif recursion_stack[v]:",
      "                return True",
      "        recursion_stack[u] = False",
      "        return False",
      "    for i in range(num_nodes):",
      "        if not visited[i]:",
      "            if dfs(i): return True",
      "    return False",
    ],
  },
  Java: {
     undirected: [
      "import java.util.*;",
      "class GraphCycleUndirected {",
      "    // adj: List<List<Integer>> representing adjacency list for nodes 0 to numNodes-1",
      "    boolean hasCycle(int numNodes, List<List<Integer>> adj) {",
      "        boolean[] visited = new boolean[numNodes];",
      "        for (int i = 0; i < numNodes; i++) {",
      "            if (!visited[i]) {",
      "                if (dfs(i, -1, visited, adj)) return true;",
      "            }",
      "        }",
      "        return false;",
      "    }",
      "    boolean dfs(int u, int parent, boolean[] visited, List<List<Integer>> adj) {",
      "        visited[u] = true;",
      "        for (int v : adj.get(u)) {",
      "            if (!visited[v]) {",
      "                if (dfs(v, u, visited, adj)) return true;",
      "            } else if (v != parent) {",
      "                return true;",
      "            }",
      "        }",
      "        return false;",
      "    }",
      "}",
    ],
    directed: [
      "import java.util.*;",
      "class GraphCycleDirected {",
      "    // adj: List<List<Integer>>",
      "    boolean hasCycle(int numNodes, List<List<Integer>> adj) {",
      "        boolean[] visited = new boolean[numNodes];",
      "        boolean[] recursionStack = new boolean[numNodes];",
      "        for (int i = 0; i < numNodes; i++) {",
      "            if (!visited[i]) {",
      "                if (dfs(i, visited, recursionStack, adj)) return true;",
      "            }",
      "        }",
      "        return false;",
      "    }",
      "    boolean dfs(int u, boolean[] visited, boolean[] recStack, List<List<Integer>> adj) {",
      "        visited[u] = true; recStack[u] = true;",
      "        for (int v : adj.get(u)) {",
      "            if (!visited[v]) {",
      "                if (dfs(v, visited, recStack, adj)) return true;",
      "            } else if (recStack[v]) {",
      "                return true;",
      "            }",
      "        }",
      "        recStack[u] = false;",
      "        return false;",
      "    }",
      "}",
    ],
  },
  "C++": {
    undirected: [
      "#include <vector>",
      "// adj: std::vector<std::vector<int>> for nodes 0 to numNodes-1",
      "bool dfs_undirected_cpp(int u, int parent, std::vector<bool>& visited, const std::vector<std::vector<int>>& adj) {",
      "    visited[u] = true;",
      "    if (u < adj.size()) { // Bounds check",
      "        for (int v : adj[u]) {",
      "            if (!visited[v]) {",
      "                if (dfs_undirected_cpp(v, u, visited, adj)) return true;",
      "            } else if (v != parent) {",
      "                return true;",
      "            }",
      "        }",
      "    }",
      "    return false;",
      "}",
      "bool hasCycleUndirected(int numNodes, const std::vector<std::vector<int>>& adj) {",
      "    std::vector<bool> visited(numNodes, false);",
      "    for (int i = 0; i < numNodes; ++i) {",
      "        if (!visited[i]) {",
      "            if (dfs_undirected_cpp(i, -1, visited, adj)) return true;",
      "        }",
      "    }",
      "    return false;",
      "}",
    ],
    directed: [
      "#include <vector>",
      "// adj: std::vector<std::vector<int>>",
      "bool dfs_directed_cpp(int u, std::vector<bool>& visited, std::vector<bool>& recStack, const std::vector<std::vector<int>>& adj) {",
      "    visited[u] = true; recStack[u] = true;",
      "    if (u < adj.size()) { // Bounds check",
      "        for (int v : adj[u]) {",
      "            if (!visited[v]) {",
      "                if (dfs_directed_cpp(v, visited, recStack, adj)) return true;",
      "            } else if (recStack[v]) {",
      "                return true;",
      "            }",
      "        }",
      "    }",
      "    recStack[u] = false;",
      "    return false;",
      "}",
      "bool hasCycleDirected(int numNodes, const std::vector<std::vector<int>>& adj) {",
      "    std::vector<bool> visited(numNodes, false);",
      "    std::vector<bool> recStack(numNodes, false);",
      "    for (int i = 0; i < numNodes; ++i) {",
      "        if (!visited[i]) {",
      "            if (dfs_directed_cpp(i, visited, recStack, adj)) return true;",
      "        }",
      "    }",
      "    return false;",
      "}",
    ],
  }
};


const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function GraphCycleDetectionVisualizerPage() {
  const { toast } = useToast();
  
  const [graphInputValue, setGraphInputValue] = useState('0:1;1:2;2:0,3;3:4;4:5;5:3'); // Example with cycle
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

    const newSteps = generateGraphCycleDetectionSteps(graphInputValue, isDirected);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
      updateStateFromStep(0);
      const lastStepMsg = newSteps[newSteps.length-1]?.message || "";
      if (lastStepMsg.includes("Cycle WAS found")) {
          toast({title:"Cycle Detected!", description: "The algorithm found a cycle in the graph.", variant: "destructive"});
      } else if (lastStepMsg.includes("NO cycle found")){
          toast({title:"No Cycle Found", description: "The algorithm did not find any cycles."});
      } else if (newSteps[0].message && (newSteps[0].message.includes("Invalid") || newSteps[0].message.includes("empty")) ){
           toast({ title: "Graph Error", description: newSteps[0].message, variant: "destructive" });
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
    setGraphInputValue('0:1;1:2;2:0,3;3:4;4:5;5:3');
    setIsDirected(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    // generateSteps will be called by useEffect due to input changes
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
          <p className="text-muted-foreground text-lg">Could not load data for Graph Cycle Detection.</p>
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
          <RefreshCwCcw className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentMessage}
          </p>
        </div>
        <div className="flex items-center space-x-2 mb-4 justify-center">
          <Switch
            id="directed-toggle"
            checked={isDirected}
            onCheckedChange={setIsDirected}
            disabled={isPlaying}
          />
          <Label htmlFor="directed-toggle">Directed Graph</Label>
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
            <GraphCycleDetectionCodePanel
              codeSnippets={CYCLE_DETECTION_CODE_SNIPPETS}
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
            showStartNodeInput={false} // Cycle detection starts from all unvisited nodes
            isPlaying={isPlaying}
            isFinished={isFinished}
            currentSpeed={animationSpeed}
            onSpeedChange={handleSpeedChange}
            isAlgoImplemented={isAlgoImplemented}
            minSpeed={MIN_SPEED}
            maxSpeed={MAX_SPEED}
            graphInputPlaceholder="e.g., 0:1;1:2;2:0 (adj list)"
            onExecute={generateSteps} 
            executeButtonText="Detect Cycles"
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

