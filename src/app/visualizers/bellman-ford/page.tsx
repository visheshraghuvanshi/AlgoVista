
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GraphVisualizationPanel } from './GraphVisualizationPanel'; // Local import
import { BellmanFordCodePanel } from './BellmanFordCodePanel'; 
import { GraphControlsPanel } from './GraphControlsPanel'; // Local import
import type { AlgorithmMetadata, GraphNode, GraphEdge, GraphAlgorithmStep } from './types'; // Local import
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { generateBellmanFordSteps, parseWeightedGraphInputWithEdgeList } from './bellman-ford-logic'; // Local import
import { algorithmMetadata } from './metadata'; // Local import

// Define code snippets here or import from BellmanFordCodePanel if separated
const BELLMAN_FORD_CODE_SNIPPETS = {
  JavaScript: [
    "function bellmanFord(edges, numVertices, startNode) {", // 1
    "  const distances = {}; const predecessors = {};",    // 2
    "  for (let i = 0; i < numVertices; i++) {",           // 3
    "    distances[i] = Infinity; predecessors[i] = null;", // 4
    "  }",
    "  distances[startNode] = 0;",                         // 5
    "",
    "  // Relax edges |V| - 1 times",
    "  for (let i = 0; i < numVertices - 1; i++) {",       // 6
    "    for (const edge of edges) { // {u, v, weight}",  // 7
    "      if (distances[edge.u] !== Infinity && ",
    "          distances[edge.u] + edge.weight < distances[edge.v]) {", // 8
    "        distances[edge.v] = distances[edge.u] + edge.weight;", // 9
    "        predecessors[edge.v] = edge.u;",              // 10
    "      }",                                             // 11
    "    }",                                               // 12
    "  }",                                                 // 13
    "",
    "  // Check for negative-weight cycles",
    "  for (const edge of edges) {",                       // 14
    "    if (distances[edge.u] !== Infinity && ",
    "        distances[edge.u] + edge.weight < distances[edge.v]) {", // 15
    "      return { error: 'Negative cycle detected' };",   // 16
    "    }",                                               // 17
    "  }",                                                 // 18
    "  return { distances, predecessors };",               // 19
    "}",                                                   // 20
  ],
  Python: [
    "def bellman_ford(edges, num_vertices, start_node): # edges: list of (u, v, weight)",
    "    distances = {i: float('inf') for i in range(num_vertices)}",
    "    predecessors = {i: None for i in range(num_vertices)}",
    "    distances[start_node] = 0",
    "",
    "    for _ in range(num_vertices - 1):",
    "        for u, v, weight in edges:",
    "            if distances[u] != float('inf') and distances[u] + weight < distances[v]:",
    "                distances[v] = distances[u] + weight",
    "                predecessors[v] = u",
    "",
    "    for u, v, weight in edges:",
    "        if distances[u] != float('inf') and distances[u] + weight < distances[v]:",
    "            return {'error': 'Negative cycle detected'}",
    "    return {'distances': distances, 'predecessors': predecessors}",
  ],
  Java: [
    "import java.util.*;",
    "class BellmanFord {",
    "    static class Edge { int u, v, weight; Edge(int u,int v,int w){this.u=u;this.v=v;this.weight=w;} }",
    "    // Note: numVertices should be used to initialize maps/arrays appropriately if nodes are 0 to N-1",
    "    public Map<String, Object> findShortestPaths(List<Edge> edges, int numVertices, int startNode) {",
    "        Map<Integer, Double> distances = new HashMap<>();",
    "        Map<Integer, Integer> predecessors = new HashMap<>();",
    "",
    "        for (int i = 0; i < numVertices; i++) {",
    "            distances.put(i, Double.POSITIVE_INFINITY);",
    "            predecessors.put(i, null);",
    "        }",
    "        distances.put(startNode, 0.0);",
    "",
    "        for (int i = 0; i < numVertices - 1; i++) {",
    "            for (Edge edge : edges) {",
    "                if (distances.get(edge.u) != Double.POSITIVE_INFINITY &&",
    "                    distances.get(edge.u) + edge.weight < distances.get(edge.v)) {",
    "                    distances.put(edge.v, distances.get(edge.u) + edge.weight);",
    "                    predecessors.put(edge.v, edge.u);",
    "                }",
    "            }",
    "        }",
    "",
    "        for (Edge edge : edges) {",
    "            if (distances.get(edge.u) != Double.POSITIVE_INFINITY &&",
    "                distances.get(edge.u) + edge.weight < distances.get(edge.v)) {",
    "                Map<String, Object> errorResult = new HashMap<>();",
    "                errorResult.put(\"error\", \"Negative cycle detected\");",
    "                return errorResult;",
    "            }",
    "        }",
    "        Map<String, Object> result = new HashMap<>();",
    "        result.put(\"distances\", distances);",
    "        result.put(\"predecessors\", predecessors);",
    "        return result;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <map>",
    "#include <limits>",
    "struct Edge { int u, v, weight; };",
    "struct BellmanFordResult {",
    "    std::map<int, double> distances;",
    "    std::map<int, int> predecessors;",
    "    bool has_negative_cycle = false;",
    "    std::string error_message = \"\";",
    "};",
    "BellmanFordResult bellmanFord(const std::vector<Edge>& edges, int numVertices, int startNode) {",
    "    BellmanFordResult res;",
    "    for (int i = 0; i < numVertices; ++i) {",
    "        res.distances[i] = std::numeric_limits<double>::infinity();",
    "    }",
    "    res.distances[startNode] = 0;",
    "",
    "    for (int i = 0; i < numVertices - 1; ++i) {",
    "        for (const auto& edge : edges) {",
    "            if (res.distances[edge.u] != std::numeric_limits<double>::infinity() &&",
    "                res.distances[edge.u] + edge.weight < res.distances[edge.v]) {",
    "                res.distances[edge.v] = res.distances[edge.u] + edge.weight;",
    "                res.predecessors[edge.v] = edge.u;",
    "            }",
    "        }",
    "    }",
    "",
    "    for (const auto& edge : edges) {",
    "        if (res.distances[edge.u] != std::numeric_limits<double>::infinity() &&",
    "            res.distances[edge.u] + edge.weight < res.distances[edge.v]) {",
    "            res.has_negative_cycle = true;",
    "            res.error_message = \"Negative cycle detected\";",
    "            return res;",
    "        }",
    "    }",
    "    return res;",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 1000;
const MIN_SPEED = 150;
const MAX_SPEED = 2500;

export default function BellmanFordVisualizerPage() {
  const { toast } = useToast();
  
  const [graphInputValue, setGraphInputValue] = useState('0:1(6),2(7);1:2(8),3(-4),4(5);2:3(9),4(-3);3:0(2),4(7);4:');
  const [startNodeValue, setStartNodeValue] = useState('0');
  
  const [steps, setSteps] = useState<GraphAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<GraphNode[]>([]);
  const [currentEdges, setCurrentEdges] = useState<GraphEdge[]>([]);
  const [currentAuxiliaryData, setCurrentAuxiliaryData] = useState<GraphAlgorithmStep['auxiliaryData']>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [negativeCycleDetected, setNegativeCycleDetected] = useState(false);

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
      if (currentS.message && currentS.message.toLowerCase().includes("negative cycle detected")) {
        setNegativeCycleDetected(true);
        toast({ title: "Negative Cycle Detected!", description: "Bellman-Ford cannot find shortest paths.", variant: "destructive", duration: 5000});
      }
    }
  }, [steps, toast]);
  
  const generateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    setNegativeCycleDetected(false);
    
    const parsedData = parseWeightedGraphInputWithEdgeList(graphInputValue);
    if (!parsedData) {
      toast({ title: "Invalid Graph Input", description: "Format: 'node:neighbor1(weight1),neighbor2(weight2);...'", variant: "destructive" });
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
       setSteps([]); setCurrentNodes(parseWeightedGraphInputWithEdgeList(graphInputValue)?.nodes.map(n => ({...n, x:0,y:0,color:'gray', distance: Infinity})) || []); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      return;
    }

    const newSteps = generateBellmanFordSteps(parsedData, startNodeValue);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
      updateStateFromStep(0);
      if (newSteps[0].message && (newSteps[0].message.includes("not found") || newSteps[0].message.includes("empty")) ){
           toast({ title: "Graph Error", description: newSteps[0].message, variant: "destructive" });
      }
    } else {
      setCurrentNodes(parsedData.nodes.map(n=>({...n, x:0, y:0, color:'grey', distance: Infinity})));
      setCurrentEdges(parsedData.edgeList.map(e => ({id: `${e.u}-${e.v}-${e.weight}`, source: e.u.toString(), target:e.v.toString(), weight: e.weight, color: "grey", isDirected: true})));
      setCurrentAuxiliaryData([]);
      setCurrentLine(null);
    }
  }, [graphInputValue, startNodeValue, toast, updateStateFromStep]);


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
    setNegativeCycleDetected(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    generateSteps();
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
          <p className="text-muted-foreground text-lg">Could not load data for Bellman-Ford.</p>
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
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {steps[currentStepIndex]?.message || algorithmMetadata.description}
          </p>
           {negativeCycleDetected && (
            <p className="mt-2 text-destructive font-bold text-lg">
                Negative weight cycle detected! Shortest paths are not well-defined.
            </p>
          )}
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
            <BellmanFordCodePanel
              codeSnippets={BELLMAN_FORD_CODE_SNIPPETS}
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
            graphInputPlaceholder="e.g., 0:1(-2),2(5);1:2(3)... (negative weights allowed)"
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
