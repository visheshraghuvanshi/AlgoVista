
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

const FLOYD_WARSHALL_CODE_SNIPPETS = {
  JavaScript: [
    "// Floyd-Warshall Algorithm (Conceptual)",
    "function floydWarshall(graph) { // graph represented as adjacency matrix",
    "  const numVertices = graph.length;",
    "  const dist = Array.from(Array(numVertices), () => new Array(numVertices).fill(Infinity));",
    "",
    "  // Initialize distances based on direct edges",
    "  for (let i = 0; i < numVertices; i++) {",
    "    for (let j = 0; j < numVertices; j++) {",
    "      if (i === j) dist[i][j] = 0;",
    "      else if (graph[i][j] !== undefined && graph[i][j] !== Infinity) { // Assuming direct edge weight",
    "        dist[i][j] = graph[i][j];",
    "      }",
    "    }",
    "  }",
    "",
    "  // Main algorithm: Iterate through all possible intermediate vertices k",
    "  for (let k = 0; k < numVertices; k++) {",
    "    // Pick all vertices as source one by one",
    "    for (let i = 0; i < numVertices; i++) {",
    "      // Pick all vertices as destination for the above picked source",
    "      for (let j = 0; j < numVertices; j++) {",
    "        // If vertex k is on the shortest path from i to j,",
    "        // then update the value of dist[i][j]",
    "        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity && dist[i][k] + dist[k][j] < dist[i][j]) {",
    "          dist[i][j] = dist[i][k] + dist[k][j];",
    "        }",
    "      }",
    "    }",
    "  }",
    "",
    "  // Check for negative-weight cycles (optional, after main loops)",
    "  for (let i = 0; i < numVertices; i++) {",
    "    if (dist[i][i] < 0) {",
    "      return { error: 'Graph contains a negative-weight cycle' };",
    "    }",
    "  }",
    "  return dist; // Matrix of shortest paths",
    "}",
  ],
};

export default function FloydWarshallVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (algorithmMetadata) {
       toast({
            title: "Conceptual Overview",
            description: `Interactive Floyd-Warshall visualization (matrix updates) is under construction. Review concepts and code.`,
            variant: "default",
            duration: 5000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for 'floyd-warshall' not found.`, variant: "destructive" });
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
              Could not load data for "floyd-warshall".
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
                The interactive visualizer for {algorithmMetadata.title}, which would typically show the distance matrix updates through iterations, is under construction.
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
                        {FLOYD_WARSHALL_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
          {/* GraphControlsPanel might not be the best fit here as input is often an adjacency matrix */}
          <GraphControlsPanel
            onPlay={() => {}}
            onPause={() => {}}
            onStep={() => {}}
            onReset={() => {}}
            onGraphInputChange={() => {}}
            graphInputValue={"(Input as Adjacency Matrix or List of Edges)"}
            onStartNodeChange={() => {}} // Not applicable for all-pairs
            startNodeValue={""} // Not applicable
            isPlaying={false}
            isFinished={true}
            currentSpeed={500}
            onSpeedChange={() => {}}
            isAlgoImplemented={false}
            minSpeed={100}
            maxSpeed={2000}
            graphInputPlaceholder="e.g., Adjacency Matrix or Edge List"
            startNodeInputPlaceholder="N/A for All-Pairs"
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
