
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { GraphControlsPanel } from '@/components/algo-vista/GraphControlsPanel';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const PRIMS_CODE_SNIPPETS = {
  JavaScript: [
    "// Prim's Algorithm for MST (Conceptual - using Adjacency List and Priority Queue)",
    "function primsMST(graph) { // graph = { 'A': [{node: 'B', weight: 7}, ...], ... }",
    "  const mst = []; // Array to store edges of MST",
    "  const visited = new Set();",
    "  const pq = new PriorityQueue(); // Min-priority queue: stores [weight, fromNode, toNode]",
    "  const startNode = Object.keys(graph)[0]; // Arbitrary start node",
    "",
    "  if (!startNode) return mst; // Empty graph",
    "",
    "  visited.add(startNode);",
    "  // Add all edges from startNode to PQ",
    "  (graph[startNode] || []).forEach(edge => {",
    "    pq.enqueue([edge.weight, startNode, edge.node]);",
    "  });",
    "",
    "  while (!pq.isEmpty() && visited.size < Object.keys(graph).length) {",
    "    const [weight, fromNode, toNode] = pq.dequeue(); // Get edge with min weight",
    "",
    "    if (visited.has(toNode)) {",
    "      continue; // Skip if 'toNode' is already in MST (forms a cycle)",
    "    }",
    "",
    "    visited.add(toNode);",
    "    mst.push({ from: fromNode, to: toNode, weight: weight });",
    "",
    "    // Add all edges from the newly added 'toNode' to PQ",
    "    (graph[toNode] || []).forEach(neighborEdge => {",
    "      if (!visited.has(neighborEdge.node)) {",
    "        pq.enqueue([neighborEdge.weight, toNode, neighborEdge.node]);",
    "      }",
    "    });",
    "  }",
    "  return mst;",
    "}",
    "// PriorityQueue class would need implementation (e.g., using a MinHeap)",
  ],
};

const ALGORITHM_SLUG = 'prims-algorithm';

export default function PrimsVisualizerPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
       toast({
            title: "Conceptual Overview",
            description: `Interactive Prim's Algorithm visualization (MST construction) is under construction.`,
            variant: "default",
            duration: 5000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    }
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.longDescription || algorithm.description,
    timeComplexities: { 
      best: "O(E log V) with binary heap, O(E + V log V) with Fibonacci heap", 
      average: "O(E log V) with binary heap", 
      worst: "O(E log V) with binary heap / O(V^2) with adjacency matrix" 
    },
    spaceComplexity: "O(V+E) for storing graph, O(V) for priority queue/visited set.",
  } : null;

  if (!isClient) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">Loading visualizer...</p>
            </main>
            <Footer />
        </div>
    );
  }

  if (!algorithm || !algoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
            <p className="text-muted-foreground text-lg">
              Could not load data for &quot;{ALGORITHM_SLUG}&quot;.
            </p>
            <Button asChild size="lg" className="mt-8">
                <Link href="/visualizers">Back to Visualizers</Link>
            </Button>
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
            {algorithm.title}
          </h1>
        </div>

        <div className="text-center my-10 p-6 border rounded-lg shadow-lg bg-card">
            <Construction className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Interactive Visualization Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                The interactive visualizer for {algorithm.title}, showing how the Minimum Spanning Tree is built edge by edge, is under construction.
                Please check back later! Review the concepts and code snippets below.
            </p>
        </div>
        
        <div className="lg:w-3/5 xl:w-2/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-auto flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code (JavaScript)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[600px]">
                    <pre className="font-code text-sm p-4">
                        {PRIMS_CODE_SNIPPETS.JavaScript.map((line, index) => (
                        <div key={`js-line-${index}`} className="px-2 py-0.5 rounded text-foreground whitespace-pre-wrap">
                            <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                            {index + 1}
                            </span>
                            {line}
                        </div>
                        ))}
                    </pre>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>

        <div className="w-full">
          <GraphControlsPanel
            onPlay={() => {}}
            onPause={() => {}}
            onStep={() => {}}
            onReset={() => {}}
            onGraphInputChange={() => {}}
            graphInputValue={"(e.g., node:neighbor(weight);...)"}
            onStartNodeChange={() => {}} // Prim's can start from any node
            startNodeValue={""} // Or provide a default if desired
            isPlaying={false}
            isFinished={true}
            currentSpeed={500}
            onSpeedChange={() => {}}
            isAlgoImplemented={false}
            minSpeed={100}
            maxSpeed={2000}
            graphInputPlaceholder="e.g., 0:1(4),2(1);1:2(2)... (weighted undirected)"
            startNodeInputPlaceholder="Start Node (optional)"
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    
