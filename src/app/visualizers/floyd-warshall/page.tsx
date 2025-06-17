
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, DPAlgorithmStep } from '@/types'; // DPAlgorithmStep is suitable
import { algorithmMetadata } from './metadata';
import { FloydWarshallVisualizationPanel } from './FloydWarshallVisualizationPanel';
import { FloydWarshallCodePanel } from './FloydWarshallCodePanel';
import { generateFloydWarshallSteps, parseAdjacencyMatrix } from './floyd-warshall-logic';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from "@/components/ui/slider";

const FLOYD_WARSHALL_CODE_SNIPPETS = {
  JavaScript: [
    "function floydWarshall(graphMatrix) { // graphMatrix: adjacency matrix with weights",
    "  const V = graphMatrix.length;",
    "  const dist = Array.from(Array(V), () => new Array(V).fill(Infinity));",
    "  for (let i = 0; i < V; i++) {",
    "    for (let j = 0; j < V; j++) {",
    "      if (i === j) dist[i][j] = 0;",
    "      else if (graphMatrix[i][j] !== undefined && graphMatrix[i][j] !== Infinity) {", // Check for direct edge
    "        dist[i][j] = graphMatrix[i][j];",
    "      }",
    "    }",
    "  }",
    "  // Main loops",
    "  for (let k = 0; k < V; k++) { // Intermediate vertex",
    "    for (let i = 0; i < V; i++) { // Source vertex",
    "      for (let j = 0; j < V; j++) { // Destination vertex",
    "        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity &&",
    "            dist[i][k] + dist[k][j] < dist[i][j]) {",
    "          dist[i][j] = dist[i][k] + dist[k][j];",
    "        }",
    "      }",
    "    }",
    "  }",
    "  // Optional: Check for negative cycles",
    "  for (let i = 0; i < V; i++) {",
    "    if (dist[i][i] < 0) return { error: 'Negative cycle detected' };",
    "  }",
    "  return dist;",
    "}",
  ],
  Python: [
    "INF = float('inf')",
    "def floyd_warshall(graph_matrix): # graph_matrix: adjacency matrix",
    "    V = len(graph_matrix)",
    "    dist = [row[:] for row in graph_matrix] # Deep copy",
    "    # Ensure self-loops are 0 if not already set",
    "    for i in range(V): dist[i][i] = 0 if dist[i][i] == INF else min(0, dist[i][i])",
    "",
    "    for k in range(V):",
    "        for i in range(V):",
    "            for j in range(V):",
    "                if dist[i][k] != INF and dist[k][j] != INF and \\",
    "                   dist[i][k] + dist[k][j] < dist[i][j]:",
    "                    dist[i][j] = dist[i][k] + dist[k][j]",
    "",
    "    # Check for negative cycles",
    "    for i in range(V):",
    "        if dist[i][i] < 0:",
    "            # print(\"Negative cycle detected\")",
    "            return None # Or raise an error/return specific indicator",
    "    return dist",
  ],
  Java: [
    "import java.util.Arrays;",
    "class FloydWarshall {",
    "    final static int INF = Integer.MAX_VALUE / 2; // Avoid overflow when adding",
    "    public int[][] solve(int V, int[][] graphMatrix) {",
    "        int[][] dist = new int[V][V];",
    "        for (int i = 0; i < V; i++) {",
    "            for (int j = 0; j < V; j++) {",
    "                if (i == j) dist[i][j] = 0;",
    "                else if (graphMatrix[i][j] != 0) dist[i][j] = graphMatrix[i][j]; // Assuming 0 means no edge if not INF",
    "                else dist[i][j] = INF;",
    "                 // Or more directly: dist[i][j] = graphMatrix[i][j]; (if graphMatrix uses INF)",
    "            }",
    "        }",
    "",
    "        for (int k = 0; k < V; k++) {",
    "            for (int i = 0; i < V; i++) {",
    "                for (int j = 0; j < V; j++) {",
    "                    if (dist[i][k] != INF && dist[k][j] != INF &&",
    "                        dist[i][k] + dist[k][j] < dist[i][j]) {",
    "                        dist[i][j] = dist[i][k] + dist[k][j];",
    "                    }",
    "                }",
    "            }",
    "        }",
    "",
    "        for (int i = 0; i < V; i++) {",
    "            if (dist[i][i] < 0) {",
    "                // System.out.println(\"Negative cycle detected\");",
    "                return null; // Indicate error",
    "            }",
    "        }",
    "        return dist;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::min",
    "#include <limits>    // For std::numeric_limits",
    "const int INF = std::numeric_limits<int>::max() / 2; // Avoid overflow",
    "std::vector<std::vector<int>> floydWarshall(int V, std::vector<std::vector<int>>& graphMatrix) {",
    "    std::vector<std::vector<int>> dist = graphMatrix;",
    "    for (int i = 0; i < V; ++i) {",
    "        for (int j = 0; j < V; ++j) {",
    "            if (i == j) dist[i][j] = 0;",
    "            // Assume graphMatrix uses INF for no edge, or a convention like 0",
    "        }",
    "    }",
    "",
    "    for (int k = 0; k < V; ++k) {",
    "        for (int i = 0; i < V; ++i) {",
    "            for (int j = 0; j < V; ++j) {",
    "                if (dist[i][k] != INF && dist[k][j] != INF &&",
    "                    dist[i][k] + dist[k][j] < dist[i][j]) {",
    "                    dist[i][j] = dist[i][k] + dist[k][j];",
    "                }",
    "            }",
    "        }",
    "    }",
    "",
    "    for (int i = 0; i < V; ++i) {",
    "        if (dist[i][i] < 0) {",
    "            // std::cerr << \"Negative cycle detected\" << std::endl;",
    "            return {}; // Return empty vector to indicate error",
    "        }",
    "    }",
    "    return dist;",
    "}",
  ],
};


const DEFAULT_ANIMATION_SPEED = 500;
const MIN_SPEED = 50;
const MAX_SPEED = 1500;
const DEFAULT_NUM_VERTICES = "4";
const DEFAULT_EDGE_LIST = "0-1(3);0-3(7);1-0(8);1-2(2);2-0(5);2-3(1);3-0(2)"; // Example for 4 vertices
const MAX_VERTICES = 10; // For visualization performance

export default function FloydWarshallVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [numVerticesInput, setNumVerticesInput] = useState(DEFAULT_NUM_VERTICES);
  const [edgeListInput, setEdgeListInput] = useState(DEFAULT_EDGE_LIST);
  
  const [steps, setSteps] = useState<DPAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<DPAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) setCurrentStep(steps[stepIndex]);
  }, [steps]);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const V = parseInt(numVerticesInput, 10);
    if (isNaN(V) || V <= 0 || V > MAX_VERTICES) {
      toast({ title: "Invalid Number of Vertices", description: `Please enter a number between 1 and ${MAX_VERTICES}.`, variant: "destructive" });
      setSteps([]); setCurrentStep(null); setIsFinished(true);
      return;
    }

    const initialMatrix = parseAdjacencyMatrix(V, edgeListInput);
    if (!initialMatrix) {
        toast({ title: "Invalid Edge List", description: "Format: u-v(weight);... Ensure vertex indices are < V.", variant: "destructive" });
        setSteps([]); setCurrentStep(null); setIsFinished(true);
        return;
    }
    
    const newSteps = generateFloydWarshallSteps(initialMatrix, V);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCurrentStep(newSteps[0] || null);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

  }, [numVerticesInput, edgeListInput, toast]);
  
  useEffect(() => { handleGenerateSteps(); }, [handleGenerateSteps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateStateFromStep(nextIdx);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false); setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep]);

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => { 
    setIsPlaying(false); setIsFinished(false); 
    setNumVerticesInput(DEFAULT_NUM_VERTICES);
    setEdgeListInput(DEFAULT_EDGE_LIST);
    // handleGenerateSteps will be called by useEffect on input changes
  };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Route className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <FloydWarshallVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <FloydWarshallCodePanel codeSnippets={FLOYD_WARSHALL_CODE_SNIPPETS} currentLine={currentStep?.currentLine ?? null} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Input</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-1">
                <Label htmlFor="numVerticesInputFW">Number of Vertices (1-{MAX_VERTICES})</Label>
                <Input id="numVerticesInputFW" type="number" value={numVerticesInput} 
                       onChange={e => setNumVerticesInput(e.target.value)} 
                       min="1" max={MAX_VERTICES.toString()} disabled={isPlaying}/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edgeListInputFW">Edge List (u-v(weight);...)</Label>
                <Textarea id="edgeListInputFW" value={edgeListInput} 
                          onChange={e => setEdgeListInput(e.target.value)} 
                          placeholder="e.g., 0-1(3);1-2(4)" 
                          rows={3} className="font-mono text-sm" disabled={isPlaying}/>
              </div>
            </div>
            <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto">Run Algorithm</Button>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Inputs & Simulation</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1} size="lg"><Play className="mr-2"/>Play</Button> 
                             : <Button onClick={handlePause} size="lg"><Pause className="mr-2"/>Pause</Button>}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1} size="lg"><SkipForward className="mr-2"/>Step</Button>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
                <Label htmlFor="speedControl">Animation Speed</Label>
                <Slider id="speedControl" min={MIN_SPEED} max={MAX_SPEED} step={50} value={[animationSpeed]} onValueChange={(v) => setAnimationSpeed(v[0])} disabled={isPlaying} />
                <p className="text-xs text-muted-foreground text-center">{animationSpeed} ms delay</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
