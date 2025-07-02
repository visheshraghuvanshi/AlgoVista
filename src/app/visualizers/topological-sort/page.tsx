
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, GraphNode, GraphEdge, GraphAlgorithmStep } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { GraphControlsPanel } from './GraphControlsPanel'; // Local import
import { GraphVisualizationPanel } from './GraphVisualizationPanel'; // Local import
import { TopologicalSortCodePanel } from './TopologicalSortCodePanel';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, ListTree } from 'lucide-react';
import { generateTopologicalSortSteps } from './topological-sort-logic';
import { parseGraphInput as baseParseGraphInput } from '@/app/visualizers/dfs/dfs-logic'; // Reusing a compatible parser

const TOPOLOGICAL_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "function topologicalSortKahn(graph, numNodes) { // graph: adj list {nodeId: [neighborIds...]}", // 1
    "  const inDegree = new Array(numNodes).fill(0);", // 2 (part 1)
    "  const adj = new Array(numNodes).fill(null).map(() => []);", // 2 (part 2)
    "  Object.keys(graph).forEach(u => {",
    "    const uIdx = parseInt(u);",
    "    graph[u].forEach(vStr => {",
    "      const vIdx = parseInt(vStr);",
    "      adj[uIdx].push(vIdx);",
    "      inDegree[vIdx]++;",
    "    });",
    "  });",
    "",
    "  const queue = [];", // 3
    "  for (let i = 0; i < numNodes; i++) {", // 4
    "    if (inDegree[i] === 0) queue.push(i);", // 5
    "  }",
    "",
    "  const sortedOrder = []; let visitedCount = 0;", // 6
    "  while (queue.length > 0) {", // 7
    "    const u = queue.shift();", // 8
    "    sortedOrder.push(u);", // 9
    "    visitedCount++;", // 10
    "    for (const v of adj[u]) {", // 11
    "      inDegree[v]--;", // 12
    "      if (inDegree[v] === 0) queue.push(v);", // 13 & 14
    "    }",
    "  }",
    "  if (visitedCount !== numNodes) return { error: 'Graph has a cycle.' };", // 15 & 16
    "  return sortedOrder;", // 17
    "}",
  ],
  Python: [
    "from collections import deque",
    "def topological_sort_kahn(graph, num_nodes): # graph: {node_idx: [neighbor_indices...]}",
    "    in_degree = [0] * num_nodes",
    "    adj = [[] for _ in range(num_nodes)]",
    "    # Assuming graph keys are integers 0 to num_nodes-1",
    "    for u_idx_str, neighbors_str in graph.items():",
    "        u = int(u_idx_str)",
    "        for v_str in neighbors_str:",
    "            v = int(v_str)",
    "            adj[u].append(v)",
    "            in_degree[v] += 1",
    "",
    "    queue = deque()",
    "    for i in range(num_nodes):",
    "        if in_degree[i] == 0:",
    "            queue.append(i)",
    "",
    "    sorted_order = []",
    "    visited_count = 0",
    "    while queue:",
    "        u = queue.popleft()",
    "        sorted_order.append(u)",
    "        visited_count += 1",
    "        for v in adj[u]:",
    "            in_degree[v] -= 1",
    "            if in_degree[v] == 0:",
    "                queue.append(v)",
    "",
    "    if visited_count != num_nodes:",
    "        return None # Indicates a cycle",
    "    return sorted_order",
  ],
  Java: [
    "import java.util.*;",
    "class TopologicalSort {",
    "    // graph: Adjacency list, e.g., List<List<Integer>> where adj.get(u) gives neighbors of u",
    "    public List<Integer> kahnSort(int numNodes, List<List<Integer>> adj) {",
    "        int[] inDegree = new int[numNodes];",
    "        for(int u = 0; u < numNodes; u++) {",
    "            for(int v : adj.get(u)) { inDegree[v]++; }",
    "        }",
    "        Queue<Integer> queue = new LinkedList<>();",
    "        for(int i=0; i<numNodes; i++) {",
    "            if(inDegree[i] == 0) queue.add(i);",
    "        }",
    "        List<Integer> sortedOrder = new ArrayList<>();",
    "        int visitedCount = 0;",
    "        while(!queue.isEmpty()) {",
    "            int u = queue.poll();",
    "            sortedOrder.add(u);",
    "            visitedCount++;",
    "            for(int v : adj.get(u)) {",
    "                inDegree[v]--;",
    "                if(inDegree[v] == 0) queue.add(v);",
    "            }",
    "        }",
    "        if(visitedCount != numNodes) return null; // Cycle detected",
    "        return sortedOrder;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <queue>",
    "#include <map>", // If input graph is map-like, otherwise vector of vectors
    "// Assume adj is std::vector<std::vector<int>> adj(numNodes);",
    "std::vector<int> topologicalSortKahn(int numNodes, const std::vector<std::vector<int>>& adj) {",
    "    std::vector<int> in_degree(numNodes, 0);",
    "    for(int u = 0; u < numNodes; ++u) {",
    "        for(int v : adj[u]) {",
    "            in_degree[v]++;",
    "        }",
    "    }",
    "    std::queue<int> q;",
    "    for(int i=0; i<numNodes; ++i) {",
    "        if(in_degree[i] == 0) q.push(i);",
    "    }",
    "    std::vector<int> sorted_order;",
    "    int visited_count = 0;",
    "    while(!q.empty()) {",
    "        int u = q.front(); q.pop();",
    "        sorted_order.push_back(u);",
    "        visited_count++;",
    "        for(int v : adj[u]) {",
    "            in_degree[v]--;",
    "            if(in_degree[v] == 0) q.push(v);",
    "        }",
    "    }",
    "    if(visited_count != numNodes) return {}; // Cycle, return empty vector",
    "    return sorted_order;",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function TopologicalSortVisualizerPage() {
  const { toast } = useToast();
  
  const [graphInputValue, setGraphInputValue] = useState('0:1,2;1:3;2:3;3:4;4:'); 
  
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
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const parsedData = baseParseGraphInput(graphInputValue); 
    if (!parsedData) {
      toast({ title: "Invalid Graph Input", description: "Format: 'node:neighbor1,neighbor2;...'", variant: "destructive" });
      setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      setCurrentMessage("Invalid graph input.");
      return;
    }
    if(parsedData.nodes.length === 0 && graphInputValue.trim() !== ""){
        toast({ title: "Invalid Graph Input", description: "Graph malformed or empty despite input.", variant: "destructive" });
        setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
        setCurrentMessage("Graph malformed or empty.");
        return;
    }

    const newSteps = generateTopologicalSortSteps(graphInputValue);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
      const firstStep = newSteps[0];
      setCurrentNodes(firstStep.nodes);
      setCurrentEdges(firstStep.edges);
      setCurrentAuxiliaryData(firstStep.auxiliaryData || []);
      setCurrentLine(firstStep.currentLine);
      setCurrentMessage(firstStep.message);
      if (firstStep.message && (firstStep.message.includes("Invalid") || firstStep.message.includes("empty")) ){
           toast({ title: "Graph Error", description: firstStep.message, variant: "destructive" });
      }
      const lastStepMsg = newSteps[newSteps.length-1]?.message || "";
      if (lastStepMsg.includes("Cycle detected")) {
           toast({title:"Cycle Detected!", description: "Topological sort not possible.", variant: "destructive"});
      } else if (lastStepMsg.includes("Topological sort complete")) {
           toast({title:"Topological Sort Complete", description: "Linear ordering found."});
      }

    } else {
      setCurrentNodes(parsedData.nodes.map(n=>({...n, x:0, y:0, color:'grey'}))); 
      setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null);
      setCurrentMessage("No steps generated.");
    }
  }, [graphInputValue, toast, setCurrentNodes, setCurrentEdges, setCurrentAuxiliaryData, setCurrentLine, setCurrentMessage, setSteps, setCurrentStepIndex, setIsPlaying, setIsFinished]);


  useEffect(() => {
    handleGenerateSteps();
  }, [handleGenerateSteps]); 

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
    setGraphInputValue('0:1,2;1:3;2:3;3:4;4:'); 
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
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
          <p className="text-muted-foreground text-lg">Could not load data for Topological Sort.</p>
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
          <ListTree className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentMessage}
          </p>
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
            <TopologicalSortCodePanel
              codeSnippets={TOPOLOGICAL_SORT_CODE_SNIPPETS}
              currentLine={currentLine}
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
            showStartNodeInput={false}
            isPlaying={isPlaying}
            isFinished={isFinished}
            currentSpeed={animationSpeed}
            onSpeedChange={handleSpeedChange}
            isAlgoImplemented={isAlgoImplemented}
            minSpeed={MIN_SPEED}
            maxSpeed={MAX_SPEED}
            graphInputPlaceholder="e.g., 0:1;1:2;2: (Directed Acyclic Graph)"
            onExecute={handleGenerateSteps} 
            executeButtonText="Generate Topological Sort"
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
