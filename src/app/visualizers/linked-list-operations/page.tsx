
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
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel'; // Using this as a generic control placeholder

const LINKED_LIST_CODE_SNIPPETS = {
  JavaScript: [
    "// Singly Linked List Node",
    "class Node {",
    "  constructor(data) {",
    "    this.data = data;",
    "    this.next = null;",
    "  }",
    "}",
    "",
    "// Doubly Linked List Node",
    "class DoublyNode {",
    "  constructor(data) {",
    "    this.data = data;",
    "    this.next = null;",
    "    this.prev = null;",
    "  }",
    "}",
    "",
    "// Example: Insert at Head (Singly)",
    "function insertAtHead(head, data) {",
    "  const newNode = new Node(data);",
    "  newNode.next = head;",
    "  return newNode;",
    "}",
    "",
    "// Example: Reverse a Singly Linked List (Iterative)",
    "function reverseList(head) {",
    "  let prev = null;",
    "  let current = head;",
    "  while (current !== null) {",
    "    let nextNode = current.next;",
    "    current.next = prev;",
    "    prev = current;",
    "    current = nextNode;",
    "  }",
    "  return prev;",
    "}",
    "",
    "// Example: Detect Loop (Floyd's Tortoise and Hare)",
    "function hasCycle(head) {",
    "  let slow = head, fast = head;",
    "  while (fast !== null && fast.next !== null) {",
    "    slow = slow.next;",
    "    fast = fast.next.next;",
    "    if (slow === fast) return true; // Cycle detected",
    "  }",
    "  return false; // No cycle",
    "}",
    "",
    "// Example: Merge Two Sorted Singly Linked Lists",
    "function mergeSortedLists(l1, l2) {",
    "  if (!l1) return l2;",
    "  if (!l2) return l1;",
    "  if (l1.data < l2.data) {",
    "    l1.next = mergeSortedLists(l1.next, l2);",
    "    return l1;",
    "  } else {",
    "    l2.next = mergeSortedLists(l1, l2.next);",
    "    return l2;",
    "  }",
    "}",
  ],
};

const ALGORITHM_SLUG = 'linked-list-operations';

export default function LinkedListOperationsVisualizerPage() {
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
            description: `Linked List operations are varied. Interactive visualization is complex and under construction.`,
            variant: "default",
            duration: 5000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    }
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.description, // This will now be the detailed description from MOCK_ALGORITHMS
    timeComplexities: { 
      best: "Varies (e.g., O(1) for head ops)", 
      average: "Varies (e.g., O(n) for search/access)", 
      worst: "Varies (e.g., O(n) for most ops)" 
    },
    spaceComplexity: "O(n) for storing elements. Some ops O(1) or O(n) space.",
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
                Visualizing the diverse operations and types of Linked Lists requires a specialized interface.
                This section is currently under construction. Review the concepts and code snippets below.
            </p>
        </div>
        
        <div className="lg:w-3/5 xl:w-2/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-auto flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code Snippets (JavaScript)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[600px]">
                    <pre className="font-code text-sm p-4">
                        {LINKED_LIST_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
          <SortingControlsPanel // Using sorting controls as a generic placeholder for array-like input conceptually
            onPlay={() => {}}
            onPause={() => {}}
            onStep={() => {}}
            onReset={() => {}}
            onInputChange={() => {}}
            inputValue={"(Under Construction - e.g., list nodes)"}
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
