
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Construction, Code2, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PRIORITY_QUEUE_CODE_SNIPPETS = {
  JavaScript: [
    "// Priority Queue (Conceptual using Min-Heap for Min-Priority Queue)",
    "// (See Heap Operations visualizer for detailed Heap implementation)",
    "class PriorityQueue {",
    "  constructor() {",
    "    // this.heap = new MinHeap(); // Or MaxHeap depending on needs",
    "    this.elements = []; // Simplified array representation for concept",
    "  }",
    "",
    "  enqueue(element, priority) {",
    "    // In a heap implementation, this would be heap.insert({element, priority})",
    "    // and heapifyUp would maintain order based on priority.",
    "    this.elements.push({ element, priority });",
    "    this.elements.sort((a, b) => a.priority - b.priority); // Simple sort for conceptual demo",
    "    console.log(`Enqueued ${element} with priority ${priority}`);",
    "  }",
    "",
    "  dequeue() {",
    "    // In a heap implementation, this would be heap.extractMin() or extractMax().",
    "    if (this.isEmpty()) return null;",
    "    const item = this.elements.shift(); // Removes element with highest priority (lowest number here)",
    "    console.log(`Dequeued ${item.element} (priority ${item.priority})`);",
    "    return item.element;",
    "  }",
    "",
    "  peek() {",
    "    // In a heap, heap.peek().",
    "    return this.isEmpty() ? null : this.elements[0];",
    "  }",
    "",
    "  isEmpty() { return this.elements.length === 0; }",
    "  size() { return this.elements.length; }",
    "}",
  ],
};

export default function PriorityQueueVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [valueInput, setValueInput] = useState("Data");
  const [priorityInput, setPriorityInput] = useState("1");


  useEffect(() => {
    setIsClient(true);
    toast({
      title: "Conceptual Overview",
      description: `Interactive Priority Queue (often Heap-based) visualization is under construction. Review concepts.`,
      variant: "default",
      duration: 5000,
    });
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps = {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  };

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
            <ListOrdered className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
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
                The interactive visualizer for {algorithmMetadata.title}, often implemented with a Heap (see Heap Operations visualizer), is currently under construction. It would show enqueueing with priority and dequeuing the highest/lowest priority element.
                Please check back later! Review the concepts and code snippets below.
            </p>
        </div>
        
        <div className="lg:w-3/5 xl:w-2/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-auto flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code (JavaScript - Simplified Array)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[600px]">
                    <pre className="font-code text-sm p-4">
                        {PRIORITY_QUEUE_CODE_SNIPPETS.JavaScript.map((line, index) => (
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

        <div className="w-full max-w-md mx-auto my-4 p-4 border rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-2 gap-2">
                 <div>
                    <Label htmlFor="valueInputPQ" className="text-sm font-medium">Value:</Label>
                    <Input id="valueInputPQ" type="text" value={valueInput} onChange={e => setValueInput(e.target.value)} className="mt-1" disabled />
                </div>
                 <div>
                    <Label htmlFor="priorityInputPQ" className="text-sm font-medium">Priority (number):</Label>
                    <Input id="priorityInputPQ" type="number" value={priorityInput} onChange={e => setPriorityInput(e.target.value)} className="mt-1" disabled />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button className="mt-2 w-full" disabled>Enqueue</Button>
                <Button className="mt-2 w-full" disabled>Dequeue</Button>
            </div>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    