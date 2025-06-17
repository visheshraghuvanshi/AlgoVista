
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata'; // Import local metadata
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const HUFFMAN_CODING_CODE_SNIPPETS = {
  JavaScript: [
    "// Conceptual Huffman Coding Steps",
    "// 1. Calculate frequency of each character in the input string.",
    "// Example: 'aabbc' -> a:2, b:2, c:1",
    "function calculateFrequencies(str) { /* ... */ }",
    "",
    "// 2. Create a leaf node for each character and its frequency.",
    "// Add these nodes to a min-priority queue (min-heap based on frequency).",
    "class HuffmanNode {",
    "  constructor(char, freq, left = null, right = null) {",
    "    this.char = char;",
    "    this.freq = freq;",
    "    this.left = left;",
    "    this.right = right;",
    "  }",
    "}",
    "// PriorityQueue class (conceptual - typically implemented with a MinHeap)",
    "class PriorityQueue { /* enqueue(node), dequeue(), size() */ }",
    "",
    "// 3. While the priority queue has more than one node:",
    "function buildHuffmanTree(frequencies) {",
    "  const pq = new PriorityQueue();",
    "  for (const char in frequencies) {",
    "    pq.enqueue(new HuffmanNode(char, frequencies[char]));",
    "  }",
    "  while (pq.size() > 1) {",
    "    const left = pq.dequeue(); // Node with min frequency",
    "    const right = pq.dequeue(); // Node with next min frequency",
    "    const internalNode = new HuffmanNode(null, left.freq + right.freq, left, right);",
    "    pq.enqueue(internalNode);",
    "  }",
    "  return pq.dequeue(); // Root of the Huffman Tree",
    "}",
    "",
    "// 4. Traverse the Huffman Tree to assign codes:",
    "//    - Assign '0' to left branches, '1' to right branches (or vice-versa).",
    "//    - The code for each character is the path from the root to the leaf node.",
    "function generateHuffmanCodes(node, currentCode = '', codes = {}) {",
    "  if (!node) return;",
    "  if (node.char !== null) { // Leaf node",
    "    codes[node.char] = currentCode === '' ? '0' : currentCode; // Handle single node tree",
    "    return codes;",
    "  }",
    "  generateHuffmanCodes(node.left, currentCode + '0', codes);",
    "  generateHuffmanCodes(node.right, currentCode + '1', codes);",
    "  return codes;",
    "}",
    "",
    "// Example Usage:",
    "// let frequencies = calculateFrequencies('example string');",
    "// let root = buildHuffmanTree(frequencies);",
    "// let huffmanCodes = generateHuffmanCodes(root);",
  ],
};

const ALGORITHM_SLUG = 'huffman-coding';

export default function HuffmanCodingVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [inputSet, setInputSet] = useState("example string data compression");


  useEffect(() => {
    setIsClient(true);
    if (algorithmMetadata) { 
       toast({
            title: "Conceptual Overview",
            description: `Interactive Huffman Coding visualization (tree building, code generation) is currently under construction.`,
            variant: "default",
            duration: 6000,
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

  if (!algoDetails) { 
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
                The interactive visualizer for {algorithmMetadata.title}, demonstrating frequency calculation, Huffman Tree construction, and code assignment, is currently under construction.
                Please check back later! Review the concepts and code snippets below.
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
                        {HUFFMAN_CODING_CODE_SNIPPETS.JavaScript.map((line, index) => (
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

        <div className="w-full max-w-md mx-auto my-4 p-4 border rounded-lg shadow-md">
            <Label htmlFor="huffmanInput" className="text-sm font-medium">Input String (for frequencies)</Label>
            <Input id="huffmanInput" type="text" value={inputSet} onChange={(e) => setInputSet(e.target.value)} placeholder="Example: aabbbc" className="mt-1" disabled />
            <Button className="mt-2 w-full" disabled>Generate Huffman Tree (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    
