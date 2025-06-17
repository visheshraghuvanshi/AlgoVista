
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Construction, Code2, Merge, SearchCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DSU_CODE_SNIPPETS = {
  JavaScript: [
    "// Disjoint Set Union (DSU) with Path Compression and Union by Rank/Size",
    "class DSU {",
    "  constructor(n) {",
    "    this.parent = Array(n).fill(0).map((_, i) => i);",
    "    // For Union by Rank (or Height)",
    "    this.rank = Array(n).fill(0);",
    "    // Or for Union by Size:",
    "    // this.size = Array(n).fill(1);",
    "  }",
    "",
    "  find(i) { // With Path Compression",
    "    if (this.parent[i] === i) return i;",
    "    this.parent[i] = this.find(this.parent[i]); // Path compression",
    "    return this.parent[i];",
    "  }",
    "",
    "  union(i, j) { // Using Union by Rank",
    "    const rootI = this.find(i);",
    "    const rootJ = this.find(j);",
    "    if (rootI !== rootJ) {",
    "      if (this.rank[rootI] < this.rank[rootJ]) {",
    "        this.parent[rootI] = rootJ;",
    "      } else if (this.rank[rootI] > this.rank[rootJ]) {",
    "        this.parent[rootJ] = rootI;",
    "      } else {",
    "        this.parent[rootJ] = rootI;",
    "        this.rank[rootI]++;",
    "      }",
    "      return true; // Union successful",
    "    }",
    "    return false; // Already in the same set",
    "  }",
    "  // union(i,j) using Union by Size:",
    "  // if (rootI !== rootJ) {",
    "  //   if(this.size[rootI] < this.size[rootJ]) { this.parent[rootI] = rootJ; this.size[rootJ] += this.size[rootI]; }",
    "  //   else { this.parent[rootJ] = rootI; this.size[rootI] += this.size[rootJ]; }",
    "  //   return true;",
    "  // } return false;",
    "}",
  ],
};

export default function DSUVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [numElements, setNumElements] = useState(10);
  const [elementA, setElementA] = useState(1);
  const [elementB, setElementB] = useState(2);


  useEffect(() => {
    setIsClient(true);
    toast({
      title: "Conceptual Overview",
      description: `Interactive DSU (Union-Find) visualization is under construction. Review concepts and code below.`,
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
            <Merge className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
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
                The interactive visualizer for {algorithmMetadata.title}, showing set merging and path compression, is currently under construction.
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
                        {DSU_CODE_SNIPPETS.JavaScript.map((line, index) => (
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

        <div className="w-full max-w-lg mx-auto my-4 p-4 border rounded-lg shadow-md space-y-4">
            <div>
                <Label htmlFor="numElementsDSU" className="text-sm font-medium">Number of Elements (0 to N-1):</Label>
                <Input id="numElementsDSU" type="number" value={numElements} onChange={e => setNumElements(parseInt(e.target.value))} className="mt-1" disabled />
            </div>
             <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="elementADSUn" className="text-sm font-medium">Element A:</Label>
                    <Input id="elementADSUn" type="number" value={elementA} onChange={e => setElementA(parseInt(e.target.value))} className="mt-1" disabled />
                </div>
                <div>
                    <Label htmlFor="elementBDSU" className="text-sm font-medium">Element B:</Label>
                    <Input id="elementBDSU" type="number" value={elementB} onChange={e => setElementB(parseInt(e.target.value))} className="mt-1" disabled />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button className="mt-2 w-full" disabled><Merge className="mr-2 h-4 w-4"/>Union(A, B)</Button>
                <Button className="mt-2 w-full" disabled><SearchCheck className="mr-2 h-4 w-4"/>Find(A)</Button>
            </div>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    