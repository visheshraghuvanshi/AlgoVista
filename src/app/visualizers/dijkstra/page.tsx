
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GraphVisualizationPanel } from '@/components/algo-vista/GraphVisualizationPanel';
import { DijkstraCodePanel } from './DijkstraCodePanel'; 
import { GraphControlsPanel } from '@/components/algo-vista/GraphControlsPanel';
import type { AlgorithmMetadata, GraphNode, GraphEdge, GraphAlgorithmStep } from '@/types';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard'; 
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { DIJKSTRA_LINE_MAP, generateDijkstraSteps, parseWeightedGraphInput } from './dijkstra-logic';
import { algorithmMetadata } from './metadata'; 

const DIJKSTRA_CODE_SNIPPETS = {
  JavaScript: [
    "function dijkstra(graph, startNode) {",                            // 1
    "  const dist = {}; const prev = {}; const pq = new PriorityQueue();",// 2 
    "  for (let node in graph) { dist[node] = Infinity; prev[node] = null; }", // 3
    "  dist[startNode] = 0;",                                           // 4
    "  pq.add(startNode, 0);",                                           // 5
    "  while (!pq.isEmpty()) {",                                        // 6
    "    let u = pq.extractMin();",                                     // 7
    "    // Mark u as processed (conceptually)",                       // 8
    "    for (let neighbor of graph[u]) {",                             // 9
    "      let v = neighbor.node; let weight = neighbor.weight;",
    "      let alt = dist[u] + weight;",                                // 10
    "      if (alt < dist[v]) {",                                       // 11
    "        dist[v] = alt;",                                           // 12
    "        prev[v] = u;",                                             // 13
    "        pq.decreaseKey(v, alt);",                                 // 14
    "      }",                                                         // 15
    "    }",                                                           // 16
    "  }",                                                               // 17
    "  return { dist, prev };",                                         // 18
    "}",                                                                 // 19
  ],
  Python: [
    "import heapq",
    "def dijkstra(graph, start_node):",
    "    dist = {node: float('inf') for node in graph}",
    "    prev = {node: None for node in graph}",
    "    dist[start_node] = 0",
    "    pq = [(0, start_node)]  # (distance, node)",
    "    while pq:",
    "        d, u = heapq.heappop(pq)",
    "        if d > dist[u]: continue # Already found shorter path",
    "        # Mark u as processed (implicitly)",
    "        for neighbor_info in graph.get(u, []):",
    "            v, weight = neighbor_info['node'], neighbor_info['weight']",
    "            alt = dist[u] + weight",
    "            if alt < dist[v]:",
    "                dist[v] = alt",
    "                prev[v] = u",
    "                heapq.heappush(pq, (alt, v))",
    "    return dist, prev",
  ],
  Java: [
    "import java.util.*;",
    "class Dijkstra {",
    "    static class Node implements Comparable<Node> {",
    "        String id; int distance;",
    "        Node(String id, int dist) { this.id = id; this.distance = dist; }",
    "        @Override public int compareTo(Node other) { return Integer.compare(this.distance, other.distance); }",
    "    }",
    "    static class Edge { String target; int weight; Edge(String t, int w){target=t;weight=w;} }",
    "    public Map<String, Integer> findShortestPaths(Map<String, List<Edge>> graph, String startNode) {",
    "        Map<String, Integer> distances = new HashMap<>();",
    "        Map<String, String> previous = new HashMap<>();",
    "        PriorityQueue<Node> pq = new PriorityQueue<>();",
    "        for (String node : graph.keySet()) distances.put(node, Integer.MAX_VALUE);",
    "        distances.put(startNode, 0);",
    "        pq.add(new Node(startNode, 0));",
    "        while (!pq.isEmpty()) {",
    "            Node current = pq.poll();",
    "            if (current.distance > distances.get(current.id)) continue;",
    "            for (Edge edge : graph.getOrDefault(current.id, Collections.emptyList())) {",
    "                int newDist = distances.get(current.id) + edge.weight;",
    "                if (newDist < distances.get(edge.target)) {",
    "                    distances.put(edge.target, newDist);",
    "                    previous.put(edge.target, current.id);",
    "                    pq.add(new Node(edge.target, newDist));",
    "                }",
    "            }",
    "        }",
    "        return distances;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <map>",
    "#include <queue>",
    "#include <limits>",
    "using namespace std;",
    "const int INF = numeric_limits<int>::max();",
    "map<string, int> dijkstra(const map<string, vector<pair<string, int>>>& adj, const string& startNode) {",
    "    map<string, int> dist;",
    "    map<string, string> prev;",
    "    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;",
    "    for (auto const& [node, _] : adj) dist[node] = INF;",
    "    // Also add nodes that are only targets if graph keys don't cover all nodes",
    "    dist[startNode] = 0;",
    "    pq.push({0, startNode});",
    "    while (!pq.empty()) {",
    "        int d = pq.top().first;",
    "        string u = pq.top().second;",
    "        pq.pop();",
    "        if (d > dist[u]) continue;",
    "        if (adj.count(u)) {",
    "            for (auto const& edge : adj.at(u)) {",
    "                string v = edge.first;",
    "                int weight = edge.second;",
    "                if (dist[u] != INF && dist[u] + weight < dist[v]) {",
    "                    dist[v] = dist[u] + weight;",
    "                    prev[v] = u;",
    "                    pq.push({dist[v], v});",
    "                }",
    "            }",
    "        }",
    "    }",
    "    return dist;",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 1000;
const MIN_SPEED = 150;
const MAX_SPEED = 2500;

export default function DijkstraVisualizerPage() {
  const { toast } = useToast();
  
  const [graphInputValue, setGraphInputValue] = useState('0:1(4),2(1);1:3(1);2:1(2),3(5);3:'); 
  const [startNodeValue, setStartNodeValue] = useState('0');
  
  const [steps, setSteps] = useState<GraphAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<GraphNode[]>([]);
  const [currentEdges, setCurrentEdges] = useState<GraphEdge[]>([]);
  const [currentAuxiliaryData, setCurrentAuxiliaryData] = useState<GraphAlgorithmStep['auxiliaryData']>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);

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
    }
  }, [steps]);
  
  const generateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const parsedData = parseWeightedGraphInput(graphInputValue);
    if (!parsedData) {
      toast({ title: "Invalid Graph Input", description: "Graph format incorrect. Use 'node:n1(w1),n2(w2);...'", variant: "destructive" });
      setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      return;
    }
     if(parsedData.nodes.length === 0 && graphInputValue.trim() !== ""){
        toast({ title: "Invalid Graph Input", description: "Graph malformed or empty despite input.", variant: "destructive" });
        setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
        return;
    }

    if (startNodeValue.trim() === '') {
      toast({ title: "Missing Start Node", description: "Please enter a start node ID.", variant: "destructive" });
       setSteps([]); setCurrentNodes(parseWeightedGraphInput(graphInputValue)?.nodes.map(n => ({...n, x:0,y:0,color:'gray', distance: Infinity})) || []); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      return;
    }
    // Check for negative weights
    let hasNegativeWeight = false;
    parsedData.adj.forEach(edges => {
        edges.forEach(edge => {
            if(edge.weight < 0) hasNegativeWeight = true;
        });
    });
    if(hasNegativeWeight){
        toast({ title: "Negative Weights Detected", description: "Dijkstra's algorithm may not work correctly with negative edge weights. Consider Bellman-Ford.", variant: "destructive", duration: 7000 });
        // Optionally, prevent step generation or allow with warning
    }


    const newSteps = generateDijkstraSteps(parsedData, startNodeValue);
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
      if (firstStep.message && (firstStep.message.includes("not found") || firstStep.message.includes("empty")) ){
           toast({ title: "Graph Error", description: firstStep.message, variant: "destructive" });
      }
    } else {
      setCurrentNodes(parsedData.nodes.map(n=>({...n, x:0, y:0, color:'grey', distance: Infinity})));
      // Construct edges from adj map if needed for display, even if no steps
      const edgesFromAdj: GraphEdge[] = [];
      parsedData.adj.forEach((neighbors, sourceId) => {
        neighbors.forEach(({target, weight}) => edgesFromAdj.push({id: `${sourceId}-${target}`, source:sourceId, target, weight, color: 'grey', isDirected: true}));
      });
      setCurrentEdges(edgesFromAdj);
      setCurrentAuxiliaryData([]);
      setCurrentLine(null);
    }
  }, [graphInputValue, startNodeValue, toast]);


  useEffect(() => {
    generateSteps();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphInputValue, startNodeValue]); 

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
  const handleStartNodeChange = (value: string) => setStartNodeValue(value);

  const handlePlay = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play." : "No steps generated. Check input.", variant: "default" });
      setIsPlaying(false); return;
    }
    setIsPlaying(true); setIsFinished(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
  };

  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) { // Check currentStepIndex to prevent overshooting
      toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished. Reset to step." : "No steps generated or already at end.", variant: "default" });
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
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    generateSteps();
  };

  const handleSpeedChange = (speedValue: number) => setAnimationSpeed(speedValue);

  if (!algorithmMetadata) { 
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
          <p className="text-muted-foreground text-lg">Could not load data for Dijkstra's Algorithm.</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  const algoDetails: AlgorithmDetailsProps = {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{steps[currentStepIndex]?.message || algorithmMetadata.description}</p>
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
            <DijkstraCodePanel
              codeSnippets={DIJKSTRA_CODE_SNIPPETS}
              currentLine={currentLine}
              defaultLanguage="JavaScript"
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
            onStartNodeChange={handleStartNodeChange}
            startNodeValue={startNodeValue}
            isPlaying={isPlaying}
            isFinished={isFinished}
            currentSpeed={animationSpeed}
            onSpeedChange={handleSpeedChange}
            isAlgoImplemented={isAlgoImplemented}
            minSpeed={MIN_SPEED}
            maxSpeed={MAX_SPEED}
            graphInputPlaceholder="e.g., 0:1(4),2(1);1:2(2) (non-negative weights)"
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
