"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, GraphNode, GraphEdge, GraphAlgorithmStep } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { GraphControlsPanel } from './GraphControlsPanel'; // Local import
import { GraphVisualizationPanel } from './GraphVisualizationPanel'; // Local import
import { PrimsAlgorithmCodePanel } from './PrimsAlgorithmCodePanel'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, GitCommit } from 'lucide-react';
import { generatePrimsSteps, parsePrimsInput } from './prims-algorithm-logic'; // Local import

const PRIMS_CODE_SNIPPETS = {
  JavaScript: [
    "// Prim's Algorithm using Adjacency List and Min-Priority Queue (conceptual)",
    "function primsMST(graph, numVertices, startNode = 0) { // graph: {node: [{neighbor, weight}, ...]}",
    "  const parent = new Array(numVertices).fill(-1);",
    "  const key = new Array(numVertices).fill(Infinity); // Min weight to connect to MST",
    "  const mstSet = new Array(numVertices).fill(false); // Nodes included in MST",
    "  const mstEdges = []; const pq = new PriorityQueue(); // {vertex, key}",
    "",
    "  key[startNode] = 0; pq.add(startNode, 0);",
    "",
    "  while (!pq.isEmpty() && mstEdges.length < numVertices - 1) {",
    "    const u = pq.extractMin().vertex; // Vertex with min key",
    "    if (mstSet[u]) continue;",
    "    mstSet[u] = true;",
    "    if (parent[u] !== -1) mstEdges.push({u: parent[u], v: u, weight: key[u]});",
    "",
    "    (graph[u] || []).forEach(edge => {",
    "      const v = edge.neighbor; const weight = edge.weight;",
    "      if (!mstSet[v] && weight < key[v]) {",
    "        parent[v] = u; key[v] = weight;",
    "        pq.addOrUpdate(v, key[v]); // Add to PQ or update priority",
    "      }",
    "    });",
    "  }",
    "  return (mstEdges.length === numVertices - 1 || numVertices === 0) ? mstEdges : null; // Null if not connected and V > 0",
    "}",
  ],
  Python: [
    "import heapq",
    "def prims_mst(graph, num_vertices, start_node=0): # graph: {node_idx: [(neighbor_idx, weight), ...]}",
    "    parent = [-1] * num_vertices",
    "    key = [float('inf')] * num_vertices",
    "    mst_set = [False] * num_vertices",
    "    mst_edges = []",
    "    pq = [] # (key_value, vertex, from_vertex_for_edge)",
    "",
    "    key[start_node] = 0",
    "    heapq.heappush(pq, (0, start_node, -1)) # (key, vertex, parent_in_mst_edge)",
    "",
    "    while pq and len(mst_edges) < num_vertices - 1:",
    "        weight, u, from_node = heapq.heappop(pq)",
    "",
    "        if mst_set[u]: continue",
    "        mst_set[u] = True",
    "        if from_node != -1: mst_edges.append({'u': from_node, 'v': u, 'weight': key[u]}) # Use key[u] for precise edge weight",
    "",
    "        for v, edge_weight in graph.get(u, []):",
    "            if not mst_set[v] and edge_weight < key[v]:",
    "                key[v] = edge_weight",
    "                parent[v] = u",
    "                heapq.heappush(pq, (edge_weight, v, u))",
    "    return mst_edges if len(mst_edges) == num_vertices - 1 or num_vertices == 0 else None",
  ],
  Java: [
    "import java.util.*;",
    "class Edge implements Comparable<Edge> { int to, weight; Edge(int t, int w){to=t;weight=w;} @Override public int compareTo(Edge o){return this.weight-o.weight;}}",
    "class PrimsMST {",
    "    // graph: List of Lists of Pairs, where Pair is {neighbor, weight}",
    "    // Example: adj.get(u) gives List<Map.Entry<Integer,Integer>>",
    "    List<Map<String, Integer>> findMST(int numVertices, List<List<Map.Entry<Integer,Integer>>> adj, int startNode) {",
    "        int[] parent = new int[numVertices]; Arrays.fill(parent, -1);",
    "        int[] key = new int[numVertices]; Arrays.fill(key, Integer.MAX_VALUE);",
    "        boolean[] mstSet = new boolean[numVertices];",
    "        List<Map<String, Integer>> mstEdges = new ArrayList<>();",
    "        PriorityQueue<Edge> pq = new PriorityQueue<>();",
    "",
    "        key[startNode] = 0;",
    "        pq.add(new Edge(startNode, 0)); // (vertex, key_value)",
    "",
    "        while(!pq.isEmpty() && mstEdges.size() < numVertices - 1) {",
    "            Edge currentEdge = pq.poll(); int u = currentEdge.to;",
    "            if(mstSet[u]) continue;",
    "            mstSet[u] = true;",
    "            if(parent[u] != -1) { ",
    "                Map<String,Integer> edge = new HashMap<>(); ",
    "                edge.put(\"u\",parent[u]); edge.put(\"v\",u); edge.put(\"weight\",key[u]); ",
    "                mstEdges.add(edge);",
    "            }",
    "",
    "            for(Map.Entry<Integer, Integer> neighborEntry : adj.get(u)) {",
    "                int v = neighborEntry.getKey(); int weight = neighborEntry.getValue();",
    "                if(!mstSet[v] && weight < key[v]) {",
    "                    key[v] = weight; parent[v] = u;",
    "                    pq.add(new Edge(v, key[v]));",
    "                }",
    "            }",
    "        }",
    "        return (mstEdges.size() == numVertices - 1 || numVertices == 0) ? mstEdges : null;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <queue>",
    "#include <limits>",
    "#include <map>", // For conceptual graph representation if needed
    "const int INF = std::numeric_limits<int>::max();",
    "struct EdgePQ { int to; int weight; bool operator>(const EdgePQ& other) const { return weight > other.weight; }};",
    "struct MSTEdge { int u, v, weight; };",
    "// Assume adj is std::vector<std::vector<std::pair<int, int>>> adj(numVertices);",
    "// where adj[u] = {{v1,w1}, {v2,w2}, ...}",
    "std::vector<MSTEdge> primsMST(int numVertices, const std::vector<std::vector<std::pair<int, int>>>& adj, int startNode = 0) {",
    "    std::vector<int> parent(numVertices, -1);",
    "    std::vector<int> key(numVertices, INF);",
    "    std::vector<bool> mstSet(numVertices, false);",
    "    std::vector<MSTEdge> mstEdges;",
    "    std::priority_queue<EdgePQ, std::vector<EdgePQ>, std::greater<EdgePQ>> pq;",
    "",
    "    key[startNode] = 0;",
    "    pq.push({startNode, 0}); // {vertex, key_value}",
    "",
    "    while(!pq.empty() && mstEdges.size() < numVertices - 1) {",
    "        EdgePQ current = pq.top(); pq.pop();",
    "        int u = current.to;",
    "",
    "        if(mstSet[u]) continue;",
    "        mstSet[u] = true;",
    "        if(parent[u] != -1) mstEdges.push_back({parent[u], u, key[u]});",
    "",
    "        if (u < adj.size()) { // Check bounds for adj[u]",
    "          for(const auto& edge : adj[u]) {",
    "              int v = edge.first; int weight = edge.second;",
    "              if(!mstSet[v] && weight < key[v]) {",
    "                  key[v] = weight; parent[v] = u;",
    "                  pq.push({v, key[v]});",
    "              }",
    "          }",
    "        }",
    "    }",
    "    return (mstEdges.size() == numVertices -1 || numVertices == 0) ? mstEdges : std::vector<MSTEdge>();",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;
const DEFAULT_NUM_VERTICES_PRIMS = "5";
const DEFAULT_EDGE_LIST_PRIMS = "0-1(2);0-3(6);1-2(3);1-3(8);1-4(5);2-4(7);3-4(9)";

export default function PrimsVisualizerPage() {
  const { toast } = useToast();
  
  const [numVerticesInput, setNumVerticesInput] = useState(DEFAULT_NUM_VERTICES_PRIMS);
  const [edgeListInputValue, setEdgeListInputValue] = useState(DEFAULT_EDGE_LIST_PRIMS);
  const [startNodeValue, setStartNodeValue] = useState('0'); 
  
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
    
    const parsedData = parsePrimsInput(numVerticesInput, edgeListInputValue);
    if (!parsedData) {
      toast({ title: "Invalid Graph Input", description: "Format: u-v(weight);... Check num vertices and edge indices. Weights must be non-negative.", variant: "destructive" });
      setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      setCurrentMessage("Invalid graph input.");
      return;
    }
     if (parsedData.numVertices === 0 && edgeListInputValue.trim() !== "") {
        toast({ title: "Invalid Input", description: "Number of vertices must be > 0 if edges are provided.", variant: "destructive" });
        setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
        setCurrentMessage("Number of vertices must be > 0 if edges are provided.");
        return;
    }
    const startNodeId = startNodeValue.trim() === '' ? '0' : startNodeValue.trim();
    const startNodeNum = parseInt(startNodeId, 10);
    if(isNaN(startNodeNum) || startNodeNum >= parsedData.numVertices || startNodeNum < 0) {
        toast({ title: "Invalid Start Node", description: `Start node must be between 0 and ${parsedData.numVertices - 1}.`, variant: "destructive" });
        setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
        setCurrentMessage("Invalid start node.");
        return;
    }

    const newSteps = generatePrimsSteps(parsedData.numVertices, parsedData.adj, parsedData.initialNodes, startNodeId);
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
    } else {
      setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null);
      setCurrentMessage("No steps generated.");
    }
  }, [numVerticesInput, edgeListInputValue, startNodeValue, toast, setCurrentNodes, setCurrentEdges, setCurrentAuxiliaryData, setCurrentLine, setCurrentMessage, setSteps, setCurrentStepIndex, setIsPlaying, setIsFinished]);


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

  const handleNumVerticesChange = (value: string) => setNumVerticesInput(value);
  const handleEdgeListInputChange = (value: string) => setEdgeListInputValue(value);
  const handleStartNodeChange = (value: string) => setStartNodeValue(value);

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
    setNumVerticesInput(DEFAULT_NUM_VERTICES_PRIMS);
    setEdgeListInputValue(DEFAULT_EDGE_LIST_PRIMS);
    setStartNodeValue('0');
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
          <p className="text-muted-foreground text-lg">Could not load data for Prim's Algorithm.</p>
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
          <GitCommit className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
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
            <PrimsAlgorithmCodePanel
              codeSnippets={PRIMS_CODE_SNIPPETS}
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
            onGraphInputChange={handleEdgeListInputChange} 
            graphInputValue={edgeListInputValue} 
            onStartNodeChange={handleStartNodeChange}
            startNodeValue={startNodeValue}
            showStartNodeInput={true} 
            onNumVerticesChange={handleNumVerticesChange} 
            numVerticesValue={numVerticesInput} 
            showNumVerticesInput={true} 
            isPlaying={isPlaying}
            isFinished={isFinished}
            currentSpeed={animationSpeed}
            onSpeedChange={handleSpeedChange}
            isAlgoImplemented={isAlgoImplemented}
            minSpeed={MIN_SPEED}
            maxSpeed={MAX_SPEED}
            graphInputPlaceholder="Edges: 0-1(wt);1-2(wt);... (undirected, non-negative)"
            startNodeInputPlaceholder="Start Node (0-indexed)"
            numVerticesInputPlaceholder="Num Vertices"
            onExecute={handleGenerateSteps} 
            executeButtonText="Find MST"
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

