
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, GraphNode, GraphEdge, GraphAlgorithmStep } from '@/types';
import { algorithmMetadata } from './metadata';
import { GraphControlsPanel } from '@/components/algo-vista/GraphControlsPanel';
import { GraphVisualizationPanel } from '@/components/algo-vista/GraphVisualizationPanel';
import { KruskalsAlgorithmCodePanel } from './KruskalsAlgorithmCodePanel';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Workflow } from 'lucide-react'; // Using Workflow for MST
import { generateKruskalsSteps, parseKruskalInput } from './kruskals-algorithm-logic';

const KRUSKALS_CODE_SNIPPETS = {
  JavaScript: [
    "// Kruskal's Algorithm (using DSU)",
    "class DSU {",
    "  constructor(n) { this.parent = Array(n).fill(0).map((_, i) => i); /* rank/size optional */ }",
    "  find(i) { if (this.parent[i] === i) return i; return this.parent[i] = this.find(this.parent[i]); }",
    "  union(i, j) { let rootI = this.find(i); let rootJ = this.find(j); if (rootI !== rootJ) { this.parent[rootI] = rootJ; return true; } return false; }",
    "}",
    "function kruskalsMST(numVertices, edges) { // edges: [{u, v, weight}, ...]",
    "  edges.sort((a, b) => a.weight - b.weight); // Sort edges by weight",
    "  const mst = []; const dsu = new DSU(numVertices);",
    "  let edgeCount = 0;",
    "  for (const edge of edges) {",
    "    if (dsu.union(edge.u, edge.v)) { // If not forming a cycle",
    "      mst.push(edge);",
    "      edgeCount++;",
    "      if (edgeCount === numVertices - 1) break;",
    "    }",
    "  }",
    "  return (edgeCount === numVertices - 1 || numVertices === 0) ? mst : null; // Null if not connected for V > 0",
    "}",
  ],
  Python: [
    "class DSU:",
    "    def __init__(self, n): self.parent = list(range(n))",
    "    def find(self, i):",
    "        if self.parent[i] == i: return i",
    "        self.parent[i] = self.find(self.parent[i])",
    "        return self.parent[i]",
    "    def union(self, i, j):",
    "        root_i, root_j = self.find(i), self.find(j)",
    "        if root_i != root_j: self.parent[root_i] = root_j; return True",
    "        return False",
    "",
    "def kruskals_mst(num_vertices, edges): # edges: list of (weight, u, v) tuples",
    "    edges.sort() # Sort by weight (first element of tuple)",
    "    mst = []",
    "    dsu = DSU(num_vertices)",
    "    edge_count = 0",
    "    for weight, u, v in edges:",
    "        if dsu.union(u, v):",
    "            mst.append({'u': u, 'v': v, 'weight': weight})",
    "            edge_count += 1",
    "            if edge_count == num_vertices - 1: break",
    "    return mst if edge_count == num_vertices - 1 or num_vertices == 0 else None",
  ],
  Java: [
    "import java.util.*;",
    "class DSU {",
    "    int[] parent;",
    "    public DSU(int n) { parent = new int[n]; for(int i=0; i<n; i++) parent[i]=i; }",
    "    public int find(int i) { if (parent[i]==i) return i; return parent[i]=find(parent[i]); }",
    "    public boolean union(int i, int j) { int rI=find(i), rJ=find(j); if(rI!=rJ){parent[rI]=rJ;return true;}return false;}",
    "}",
    "class Edge implements Comparable<Edge> { int u,v,weight; Edge(int u,int v,int w){this.u=u;this.v=v;this.weight=w;} @Override public int compareTo(Edge o){return this.weight-o.weight;}}",
    "class KruskalMST {",
    "    List<Edge> findMST(int numVertices, List<Edge> edges) {",
    "        Collections.sort(edges);",
    "        List<Edge> mst = new ArrayList<>();",
    "        DSU dsu = new DSU(numVertices); int edgeCount = 0;",
    "        for (Edge edge : edges) {",
    "            if (dsu.union(edge.u, edge.v)) {",
    "                mst.add(edge); edgeCount++;",
    "                if (edgeCount == numVertices - 1) break;",
    "            }",
    "        }",
    "        return (edgeCount == numVertices - 1 || numVertices == 0) ? mst : null;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <numeric> // For std::iota",
    "#include <algorithm> // For std::sort",
    "struct DSU {",
    "    std::vector<int> parent;",
    "    DSU(int n) { parent.resize(n); std::iota(parent.begin(), parent.end(), 0); }",
    "    int find(int i) { if (parent[i]==i) return i; return parent[i]=find(parent[i]); }",
    "    bool unite(int i, int j) { int rI=find(i),rJ=find(j); if(rI!=rJ){parent[rI]=rJ;return true;}return false;}",
    "};",
    "struct Edge { int u, v, weight; bool operator<(const Edge& o) const { return weight < o.weight; } };",
    "std::vector<Edge> kruskalsMST(int numVertices, std::vector<Edge>& edges) {",
    "    std::sort(edges.begin(), edges.end());",
    "    std::vector<Edge> mst;",
    "    DSU dsu(numVertices); int edgeCount = 0;",
    "    for (const auto& edge : edges) {",
    "        if (dsu.unite(edge.u, edge.v)) {",
    "            mst.push_back(edge); edgeCount++;",
    "            if (edgeCount == numVertices - 1) break;",
    "        }",
    "    }",
    "    return (edgeCount == numVertices - 1 || numVertices == 0) ? mst : std::vector<Edge>(); // Empty if no MST",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;
const DEFAULT_NUM_VERTICES = "5";
const DEFAULT_EDGE_LIST = "0-1(2);0-3(6);1-2(3);1-3(8);1-4(5);2-4(7);3-4(9)"; // Example for 5 vertices

export default function KruskalsVisualizerPage() {
  const { toast } = useToast();
  
  const [numVerticesInput, setNumVerticesInput] = useState(DEFAULT_NUM_VERTICES);
  const [edgeListInputValue, setEdgeListInputValue] = useState(DEFAULT_EDGE_LIST);
  
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
    
    const parsedData = parseKruskalInput(numVerticesInput, edgeListInputValue);
    if (!parsedData) {
      toast({ title: "Invalid Graph Input", description: "Format: u-v(weight);... Check num vertices and edge indices.", variant: "destructive" });
      setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      return;
    }
    if (parsedData.numVertices === 0 && edgeListInputValue.trim() !== "") {
        toast({ title: "Invalid Input", description: "Number of vertices must be > 0 if edges are provided.", variant: "destructive" });
        return;
    }


    const newSteps = generateKruskalsSteps(parsedData.numVertices, parsedData.edges, parsedData.initialNodes);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
      updateStateFromStep(0);
    } else {
      setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null);
    }
  }, [numVerticesInput, edgeListInputValue, toast, updateStateFromStep]);


  useEffect(() => {
    generateSteps();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numVerticesInput, edgeListInputValue]); // Re-generate if graph input changes

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
    setNumVerticesInput(DEFAULT_NUM_VERTICES);
    setEdgeListInputValue(DEFAULT_EDGE_LIST);
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
          <p className="text-muted-foreground text-lg">Could not load data for Kruskal's Algorithm.</p>
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
          <Workflow className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
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
            <KruskalsAlgorithmCodePanel
              codeSnippets={KRUSKALS_CODE_SNIPPETS}
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
            showStartNodeInput={false} 
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
            graphInputPlaceholder="Edges: 0-1(wt);1-2(wt);... (undirected)"
            numVerticesInputPlaceholder="Num Vertices"
            onExecute={generateSteps} 
            executeButtonText="Find MST"
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
