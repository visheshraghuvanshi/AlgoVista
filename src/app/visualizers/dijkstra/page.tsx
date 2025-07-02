
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GraphVisualizationPanel } from './GraphVisualizationPanel'; // Local import
import { DijkstraCodePanel } from './DijkstraCodePanel'; 
import { GraphControlsPanel } from './GraphControlsPanel'; // Local import
import type { AlgorithmMetadata, GraphNode, GraphEdge, GraphAlgorithmStep } from './types'; // Local import
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { DIJKSTRA_LINE_MAP, generateDijkstraSteps, parseWeightedGraphInput } from './dijkstra-logic';
import { algorithmMetadata } from './metadata'; 

const DIJKSTRA_CODE_SNIPPETS = {
  JavaScript: [
    "// Conceptual Dijkstra using Priority Queue (min-heap)",
    "function dijkstra(graph, startNode) {",                            // 1
    "  const dist = {}; const prev = {}; const pq = new PriorityQueue();",// 2 
    "  for (let node in graph) { dist[node] = Infinity; prev[node] = null; }", // 3
    "  dist[startNode] = 0;",                                           // 4
    "  pq.add(startNode, 0);",                                           // 5
    "  while (!pq.isEmpty()) {",                                        // 6
    "    let u = pq.extractMin().vertex;",                                     // 7
    "    // Mark u as processed (conceptually)",                       // 8
    "    for (let neighbor of graph[u]) { // {node, weight}",           // 9
    "      let v = neighbor.node; let weight = neighbor.weight;",
    "      let alt = dist[u] + weight;",                                // 10
    "      if (alt < dist[v]) {",                                       // 11
    "        dist[v] = alt;",                                           // 12
    "        prev[v] = u;",                                             // 13
    "        pq.decreaseKey(v, alt); // Or add with new priority",      // 14
    "      }",                                                         // 15
    "    }",                                                           // 16
    "  }",                                                               // 17
    "  return { dist, prev };",                                         // 18
    "}",                                                                 // 19
  ],
  Python: [
    "import heapq",
    "def dijkstra(graph, start_node): # graph: {node: [{'node': neighbor, 'weight': w}, ...]}",
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
    "    // Assume graph: Map<String, List<Map.Entry<String, Integer>>> where Entry is target,weight",
    "    public Map<String, Integer> findShortestPaths(Map<String, List<Map.Entry<String, Integer>>> graph, String startNode) {",
    "        Map<String, Integer> distances = new HashMap<>();",
    "        Map<String, String> previous = new HashMap<>();",
    "        PriorityQueue<Node> pq = new PriorityQueue<>();",
    "        for (String node : graph.keySet()) distances.put(node, Integer.MAX_VALUE);",
    "        distances.put(startNode, 0);",
    "        pq.add(new Node(startNode, 0));",
    "        while (!pq.isEmpty()) {",
    "            Node current = pq.poll(); // u",
    "            if (current.distance > distances.get(current.id)) continue;",
    "            for (Map.Entry<String, Integer> edge : graph.getOrDefault(current.id, Collections.emptyList())) {",
    "                String v = edge.getKey(); int weight = edge.getValue();",
    "                int newDist = distances.get(current.id) + weight;",
    "                if (newDist < distances.get(v)) {",
    "                    distances.put(v, newDist);",
    "                    previous.put(v, current.id);",
    "                    pq.add(new Node(v, newDist));",
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
    "// Assume graph: map<string, vector<pair<string, int>>> where pair is {neighbor, weight}",
    "map<string, int> dijkstra(const map<string, vector<pair<string, int>>>& adj, const string& startNode) {",
    "    map<string, int> dist;",
    "    map<string, string> prev;",
    "    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;",
    "",
    "    for (auto const& [node_label, _] : adj) { dist[node_label] = INF; }",
    "    // Need to ensure all nodes mentioned (even as targets only) are in dist map",
    "    for (auto const& [source_label, neighbors] : adj) {",
    "        for (auto const& edge : neighbors) {",
    "            if (dist.find(edge.first) == dist.end()) dist[edge.first] = INF;",
    "        }",
    "    }",
    "    if (dist.find(startNode) == dist.end()) dist[startNode] = INF; // Ensure startNode is in dist",
    "",
    "    dist[startNode] = 0;",
    "    pq.push({0, startNode}); // {distance, node_label}",
    "",
    "    while (!pq.empty()) {",
    "        int d = pq.top().first;",
    "        string u = pq.top().second;",
    "        pq.pop();",
    "",
    "        if (d > dist[u]) continue;",
    "        if (adj.count(u)) {",
    "            for (auto const& edge : adj.at(u)) {",
    "                string v = edge.first;",
    "                int weight = edge.second;",
    "                if (dist.count(v) && dist[u] != INF && dist[u] + weight < dist[v]) {",
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
  const [currentMessage, setCurrentMessage] = useState<string | undefined>(algorithmMetadata.description); // Added for message display

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
      setCurrentMessage(currentS.message); // Update message
    }
  }, [steps]);
  
  const generateNewSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const parsedData = parseWeightedGraphInput(graphInputValue);
    if (!parsedData) {
      toast({ title: "Invalid Graph Input", description: "Format incorrect. Use 'node:n1(w1),n2(w2);...'", variant: "destructive" });
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

    if (startNodeValue.trim() === '') {
      toast({ title: "Missing Start Node", description: "Please enter a start node ID.", variant: "destructive" });
       setSteps([]); 
       setCurrentNodes(parseWeightedGraphInput(graphInputValue)?.nodes.map(n => ({...n, x:0,y:0,color:'gray', distance: Infinity})) || []); 
       setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
       setCurrentMessage("Missing start node.");
      return;
    }

    const newSteps = generateDijkstraSteps(parsedData, startNodeValue);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    
    if (newSteps.length > 0) {
      const firstStep = newSteps[0];
      setCurrentNodes(firstStep.nodes);
      setCurrentEdges(firstStep.edges);
      setCurrentAuxiliaryData(firstStep.auxiliaryData || []);
      setCurrentLine(firstStep.currentLine);
      setCurrentMessage(firstStep.message);
      if (firstStep.message && (firstStep.message.includes("not found") || firstStep.message.includes("empty")) ){
           toast({ title: "Graph Error", description: firstStep.message, variant: "destructive" });
      }
    } else {
      setCurrentNodes(parsedData.nodes.map(n=>({...n, x:0, y:0, color:'grey', distance: Infinity})));
      const edgesFromAdj: GraphEdge[] = [];
      parsedData.adj.forEach((neighbors, sourceId) => {
        neighbors.forEach(({target, weight}) => edgesFromAdj.push({id: `${sourceId}-${target}`, source:sourceId, target, weight, color: "grey", isDirected: true}));
      });
      setCurrentEdges(edgesFromAdj);
      setCurrentAuxiliaryData([]);
      setCurrentLine(null);
    }
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

  }, [graphInputValue, startNodeValue, toast, setCurrentNodes, setCurrentEdges, setCurrentAuxiliaryData, setCurrentLine, setSteps, setCurrentStepIndex, setIsPlaying, setIsFinished]);


  useEffect(() => {
    generateNewSteps();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphInputValue, startNodeValue, generateNewSteps]); // Removed generateSteps from here to break cycle, now it's stable

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
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play." : "No steps generated or already at end. Check input.", variant: "default" });
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
    generateNewSteps();
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
          <p className="text-muted-foreground text-lg">Could not load data for Dijkstra's Algorithm.</p>
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
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentMessage}</p>
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
