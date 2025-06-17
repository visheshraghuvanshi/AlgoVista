
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata'; // Import local metadata
import { GraphControlsPanel } from '@/components/algo-vista/GraphControlsPanel';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const TOPOLOGICAL_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "// Topological Sort using Kahn's Algorithm (BFS-based)",
    "function topologicalSortKahn(graph) { // graph = adjacency list {node: [neighbors...]}",
    "  const inDegree = {}; // Stores in-degree of each node",
    "  const adj = graph; // Assuming graph is already the adjacency list",
    "  const sortedOrder = [];",
    "  const queue = [];",
    "  const numNodes = Object.keys(adj).length;",
    "",
    "  // Initialize in-degrees and add all nodes to inDegree map",
    "  for (const node in adj) {",
    "    inDegree[node] = inDegree[node] || 0; // Ensure node exists in inDegree",
    "    for (const neighbor of adj[node]) {",
    "      inDegree[neighbor] = (inDegree[neighbor] || 0) + 1;",
    "    }",
    "  }",
    "",
    "  // Enqueue nodes with in-degree 0",
    "  for (const node in adj) { // Iterate over known nodes to check their in-degree",
    "    if (inDegree[node] === 0) {",
    "      queue.push(node);",
    "    }",
    "  }",
    "",
    "  // Process nodes from the queue",
    "  while (queue.length > 0) {",
    "    const u = queue.shift();",
    "    sortedOrder.push(u);",
    "    for (const v of adj[u]) {",
    "      inDegree[v]--;",
    "      if (inDegree[v] === 0) {",
    "        queue.push(v);",
    "      }",
    "    }",
    "  }",
    "",
    "  // Check if graph had a cycle",
    "  if (sortedOrder.length !== numNodes) {",
    "    return { error: 'Graph has a cycle, topological sort not possible.' };",
    "  }",
    "  return sortedOrder;",
    "}",
    "",
    "// Topological Sort using DFS (Conceptual)",
    "// 1. Perform DFS traversal.",
    "// 2. After visiting all descendants of a node, add the node to the front of a list.",
    "// 3. Reverse the list to get the topological sort.",
    "//    (Alternatively, add to end of list, then reverse, or add to front of linked list).",
  ],
};

export default function TopologicalSortVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (algorithmMetadata) {
       toast({
            title: "Conceptual Overview",
            description: `Interactive Topological Sort visualization (Kahn's or DFS-based) is under construction.`,
            variant: "default",
            duration: 5000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for topological-sort not found.`, variant: "destructive" });
    }
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
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

  if (!algorithmMetadata || !algoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
            <p className="text-muted-foreground text-lg">
              Could not load data for &quot;topological-sort&quot;.
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
            {algorithmMetadata.title}
          </h1>
        </div>

        <div className="text-center my-10 p-6 border rounded-lg shadow-lg bg-card">
            <Construction className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Interactive Visualization Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                The interactive visualizer for {algorithmMetadata.title}, showing how a linear ordering of a DAG is achieved, is under construction.
                Please check back later! Review the concepts and code snippets below.
            </p>
        </div>
        
        <div className="lg:w-3/5 xl:w-2/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-auto flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code (JavaScript - Kahn's Algorithm)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[600px]">
                    <pre className="font-code text-sm p-4">
                        {TOPOLOGICAL_SORT_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
            graphInputValue={"(e.g., Directed Acyclic Graph input)"}
            onStartNodeChange={() => {}} // Topological sort usually considers all nodes
            startNodeValue={""} // Not typically a single start node for the whole process
            isPlaying={false}
            isFinished={true}
            currentSpeed={500}
            onSpeedChange={() => {}}
            isAlgoImplemented={false}
            minSpeed={100}
            maxSpeed={2000}
            graphInputPlaceholder="e.g., 0:1,2;1:3;2:3... (DAG)"
            startNodeInputPlaceholder="N/A for Topological Sort"
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    
