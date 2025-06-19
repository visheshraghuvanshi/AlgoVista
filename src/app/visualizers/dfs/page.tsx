
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GraphVisualizationPanel } from './GraphVisualizationPanel'; // Local import
import { DfsCodePanel } from './DfsCodePanel'; 
import { GraphControlsPanel } from './GraphControlsPanel'; // Local import
import type { AlgorithmMetadata, GraphNode, GraphEdge, GraphAlgorithmStep, AlgorithmDetailsProps } from './types'; // Local import
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { DFS_LINE_MAP, generateDfsSteps, parseGraphInput } from './dfs-logic';
import { algorithmMetadata } from './metadata'; 

const DFS_CODE_SNIPPETS = {
  JavaScript: [
    "function dfsIterative(graph, startNode) {",      // 1
    "  let stack = [];",                             // 2
    "  let visited = new Set();",
    "  stack.push(startNode);",                       // 3
    "  while (stack.length > 0) {",                  // 4
    "    let u = stack.pop();",                       // 5
    "    if (!visited.has(u)) {",                    // 6
    "      visited.add(u);",                          // 7
    "      // Process node u (e.g., print it)",       // 8
    "      // Add unvisited neighbors to stack (reverse for classic DFS order)",
    "      let neighbors = graph[u] || [];",
    "      for (let i = neighbors.length - 1; i >= 0; i--) {", // 9 (Iterating reversed for stack)
    "        let v = neighbors[i];",
    "        if (!visited.has(v)) {",                // 10
    "          stack.push(v);",
    "        }",                                      // 11
    "      }",                                        // 12
    "    }",                                          // 13
    "  }",                                            // 14
    "}",                                              // 15
  ],
  Python: [
    "def dfs_iterative(graph, start_node):",
    "    stack = []",
    "    visited = set()",
    "    stack.append(start_node)",
    "    while stack:",
    "        u = stack.pop()",
    "        if u not in visited:",
    "            visited.add(u)",
    "            # Process node u",
    "            # Add unvisited neighbors (iterate reversed to mimic recursion)",
    "            for v in reversed(graph.get(u, [])):",
    "                # if v not in visited: # Not strictly needed if check on pop",
    "                stack.append(v)",
    "    # return visited # or path",
  ],
  Java: [
    "import java.util.*;",
    "public class DFS {",
    "    public void dfsIterative(Map<Integer, List<Integer>> graph, int startNode) {",
    "        Stack<Integer> stack = new Stack<>();",
    "        Set<Integer> visited = new HashSet<>();",
    "        stack.push(startNode);",
    "        while (!stack.isEmpty()) {",
    "            int u = stack.pop();",
    "            if (!visited.contains(u)) {",
    "                visited.add(u);",
    "                // Process node u",
    "                System.out.print(u + \" \");",
    "                List<Integer> neighbors = graph.getOrDefault(u, Collections.emptyList());",
    "                // Add unvisited neighbors to stack (reverse order for typical DFS path)",
    "                for (int i = neighbors.size() - 1; i >= 0; i--) {",
    "                    int v = neighbors.get(i);",
    "                    if (!visited.contains(v)) {",
    "                        stack.push(v);",
    "                    }",
    "                }",
    "            }",
    "        }",
    "    }",
    "}",
  ],
  "C++": [
    "#include <iostream>",
    "#include <vector>",
    "#include <stack>",
    "#include <set>",
    "#include <map>",
    "#include <algorithm> // For std::reverse for neighbors",
    "void dfsIterative(const std::map<int, std::vector<int>>& graph, int startNode) {",
    "    std::stack<int> s;",
    "    std::set<int> visited;",
    "    s.push(startNode);",
    "    while (!s.empty()) {",
    "        int u = s.top();",
    "        s.pop();",
    "        if (visited.find(u) == visited.end()) {",
    "            visited.insert(u);",
    "            // Process node u",
    "            std::cout << u << \" \";",
    "            auto it = graph.find(u);",
    "            if (it != graph.end()) {",
    "                std::vector<int> neighbors = it->second;",
    "                std::reverse(neighbors.begin(), neighbors.end()); // To mimic recursive DFS stack order",
    "                for (int v : neighbors) {",
    "                    if (visited.find(v) == visited.end()) {",
    "                        s.push(v);",
    "                    }",
    "                }",
    "            }",
    "        }",
    "    }",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function DfsVisualizerPage() {
  const { toast } = useToast();

  const [graphInputValue, setGraphInputValue] = useState('0:1,2;1:0,3;2:0,4;3:1;4:2,5;5:4'); 
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
    
    const parsedData = parseGraphInput(graphInputValue);
    if (!parsedData) {
      toast({ title: "Invalid Graph Input", description: "Graph format is incorrect. Use 'node:neighbor1,neighbor2;...'", variant: "destructive" });
      setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      return;
    }
     if(parsedData.nodes.length === 0 && graphInputValue.trim() !== ""){
        toast({ title: "Invalid Graph Input", description: "Graph appears to be malformed or empty despite input.", variant: "destructive" });
        setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
        return;
    }

    if (startNodeValue.trim() === '') {
      toast({ title: "Missing Start Node", description: "Please enter a start node ID.", variant: "destructive" });
       setSteps([]); setCurrentNodes(parseGraphInput(graphInputValue)?.nodes.map(n => ({...n, x:0,y:0,color:'gray'})) || []); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      return;
    }

    const newSteps = generateDfsSteps(parsedData, startNodeValue);
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
      setCurrentNodes(parsedData.nodes.map(n=>({...n, x:0, y:0, color:'grey'})));
      setCurrentEdges([]);
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
          <p className="text-muted-foreground text-lg">Could not load data for DFS.</p>
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
            <DfsCodePanel
              codeSnippets={DFS_CODE_SNIPPETS}
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
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

