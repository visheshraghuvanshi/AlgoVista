
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel'; // Using SortingControls for array-like input

const HEAP_OPERATIONS_CODE_SNIPPETS = {
  JavaScript: [
    "// MinHeap Example (can be adapted for MaxHeap)",
    "class MinHeap {",
    "  constructor() { this.heap = []; }",
    "",
    "  getParentIndex(i) { return Math.floor((i - 1) / 2); }",
    "  getLeftChildIndex(i) { return 2 * i + 1; }",
    "  getRightChildIndex(i) { return 2 * i + 2; }",
    "",
    "  swap(i1, i2) { [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]]; }",
    "",
    "  insert(value) {",
    "    this.heap.push(value);",
    "    this.heapifyUp(this.heap.length - 1);",
    "  }",
    "  heapifyUp(index) { /* ... */ }",
    "  // Bubble up from index until heap property is satisfied",
    "",
    "  extractMin() {",
    "    if (this.heap.length === 0) return null;",
    "    if (this.heap.length === 1) return this.heap.pop();",
    "    const min = this.heap[0];",
    "    this.heap[0] = this.heap.pop();",
    "    this.heapifyDown(0);",
    "    return min;",
    "  }",
    "  heapifyDown(index) { /* ... */ }",
    "  // Bubble down from index until heap property is satisfied",
    "",
    "  peek() { return this.heap.length > 0 ? this.heap[0] : null; }",
    "  size() { return this.heap.length; }",
    "}",
    "",
    "// Building a heap from an array (O(n))",
    "function buildHeap(array) {",
    "  const heap = new MinHeap(); // or MaxHeap",
    "  heap.heap = [...array];",
    "  for (let i = Math.floor(heap.heap.length / 2) - 1; i >= 0; i--) {",
    "    heap.heapifyDown(i);",
    "  }",
    "  return heap;",
    "}",
  ],
};

const ALGORITHM_SLUG = 'heap-operations';

export default function HeapOperationsVisualizerPage() {
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
            description: `Interactive Heap operations (insert, extract-min/max, heapify) visualization is currently under construction.`,
            variant: "default",
            duration: 6000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    }
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.description,
    timeComplexities: { 
      best: "Insert: O(1) (amortized if no heapifyUp), Extract-Min/Max: O(log n)", 
      average: "Insert: O(log n), Extract-Min/Max: O(log n), BuildHeap: O(n)", 
      worst: "Insert: O(log n), Extract-Min/Max: O(log n), BuildHeap: O(n)" 
    },
    spaceComplexity: "O(n) for storing elements. O(1) or O(log n) for operations depending on recursion.",
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
                The interactive visualizer for {algorithm.title}, demonstrating operations like insert, extract-min/max, and heapify (both up and down), is currently under construction.
                Please check back later! Review the concepts and code snippets below.
            </p>
        </div>
        
        <div className="lg:w-3/5 xl:w-2/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-auto flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code Snippets (JavaScript - MinHeap)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[600px]">
                    <pre className="font-code text-sm p-4">
                        {HEAP_OPERATIONS_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
          <SortingControlsPanel // Using this for general array input
            onPlay={() => {}}
            onPause={() => {}}
            onStep={() => {}}
            onReset={() => {}}
            onInputChange={() => {}}
            inputValue={"(e.g., values to insert/build heap from)"}
            isPlaying={false}
            isFinished={true}
            currentSpeed={500}
            onSpeedChange={() => {}}
            isAlgoImplemented={false}
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

