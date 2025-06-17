
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
// import { CountingSortCodePanel } from './CountingSortCodePanel'; // To be created if needed
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata'; // Changed to local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";


// Placeholder for Counting Sort specific code snippets
const COUNTING_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "// Counting Sort (JavaScript - Conceptual)",
    "function countingSort(arr, maxVal) {",
    "  const n = arr.length;",
    "  const count = new Array(maxVal + 1).fill(0);",
    "  const output = new Array(n);",
    "",
    "  // Store count of each character",
    "  for (let i = 0; i < n; i++) count[arr[i]]++;",
    "",
    "  // Store cumulative count",
    "  for (let i = 1; i <= maxVal; i++) count[i] += count[i - 1];",
    "",
    "  // Build the output array",
    "  for (let i = n - 1; i >= 0; i--) {",
    "    output[count[arr[i]] - 1] = arr[i];",
    "    count[arr[i]]--;",
    "  }",
    "",
    "  // Copy output to original array",
    "  for (let i = 0; i < n; i++) arr[i] = output[i];",
    "  return arr;",
    "}",
  ],
  Python: [
    "# Counting Sort (Python - Conceptual)",
    "def counting_sort(arr, max_val):",
    "    n = len(arr)",
    "    count = [0] * (max_val + 1)",
    "    output = [0] * n",
    "",
    "    # Store count of each character",
    "    for i in range(n):",
    "        count[arr[i]] += 1",
    "",
    "    # Store cumulative count",
    "    for i in range(1, max_val + 1):",
    "        count[i] += count[i-1]",
    "",
    "    # Build the output array",
    "    i = n - 1",
    "    while i >= 0:",
    "        output[count[arr[i]] - 1] = arr[i]",
    "        count[arr[i]] -= 1",
    "        i -= 1",
    "",
    "    # Copy output to original array",
    "    for i in range(n):",
    "        arr[i] = output[i]",
    "    return arr",
  ],
};

const ALGORITHM_SLUG = 'counting-sort';

export default function CountingSortVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (algorithmMetadata) {
       toast({
            title: "Visualization Under Construction",
            description: `The interactive visualizer for ${algorithmMetadata.title} is not yet fully implemented. Showing details only.`,
            variant: "default",
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
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
            {algorithmMetadata.title}
          </h1>
        </div>

        <div className="text-center my-10 p-6 border rounded-lg shadow-lg bg-card">
            <Construction className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Interactive Visualization Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                The interactive visualizer for {algorithmMetadata.title} is currently under construction.
                We are working on a more specialized visualization to best demonstrate its unique mechanics (like count arrays and output construction).
                Please check back later for the full interactive experience! In the meantime, you can review the algorithm details below.
            </p>
        </div>
        
        {/* Basic Code Panel - To be replaced/enhanced with a specific CountingSortCodePanel if needed */}
         <div className="lg:w-2/5 xl:w-1/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code (JavaScript)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
                    <pre className="font-code text-sm p-4">
                        {COUNTING_SORT_CODE_SNIPPETS.JavaScript.map((line, index) => (
                        <div key={`js-line-${index}`} className="px-2 py-0.5 rounded text-foreground">
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
          <SortingControlsPanel
            onPlay={() => {}}
            onPause={() => {}}
            onStep={() => {}}
            onReset={() => {}}
            onInputChange={() => {}}
            inputValue={"(Under Construction)"}
            isPlaying={false}
            isFinished={true} // To disable controls
            currentSpeed={500}
            onSpeedChange={() => {}}
            isAlgoImplemented={false} // Disables controls
            minSpeed={100}
            maxSpeed={2000}
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
