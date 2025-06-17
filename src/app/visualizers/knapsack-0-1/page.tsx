
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
import { Textarea } from '@/components/ui/textarea';

const KNAPSACK_CODE_SNIPPETS = {
  JavaScript: [
    "// 0/1 Knapsack Problem (Dynamic Programming - Iterative)",
    "function knapsack01(weights, values, capacity) {",
    "  const n = weights.length;",
    "  // dp[i][w] will store the maximum value that can be obtained",
    "  // using items up to index i-1 with a total weight of w",
    "  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));",
    "",
    "  for (let i = 1; i <= n; i++) {",
    "    for (let w = 1; w <= capacity; w++) {",
    "      if (weights[i-1] <= w) { // If current item can be included",
    "        // Max of (including current item, not including current item)",
    "        dp[i][w] = Math.max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w]);",
    "      } else { // Current item is too heavy, cannot include it",
    "        dp[i][w] = dp[i-1][w];",
    "      }",
    "    }",
    "  }",
    "  return dp[n][capacity]; // Max value for given capacity",
    "  // To reconstruct items: backtrack through dp table.",
    "}",
  ],
};

export default function KnapsackVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [itemInput, setItemInput] = useState("w:3,v:10; w:4,v:40; w:5,v:30; w:6,v:50"); // Format: w:weight,v:value; ...
  const [capacityInput, setCapacityInput] = useState("10");


  useEffect(() => {
    setIsClient(true);
    toast({
        title: "Conceptual Overview",
        description: `Interactive 0/1 Knapsack visualization (DP table) is currently under construction.`,
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
                The interactive visualizer for {algorithmMetadata.title}, showing DP table construction, is currently under construction.
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
                        {KNAPSACK_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
                <Label htmlFor="itemInput" className="text-sm font-medium">Items (Format: w:weight,v:value; ...)</Label>
                <Textarea id="itemInput" value={itemInput} onChange={(e) => setItemInput(e.target.value)} className="mt-1 font-code" rows={3} disabled />
            </div>
            <div>
                <Label htmlFor="capacityInput" className="text-sm font-medium">Knapsack Capacity</Label>
                <Input id="capacityInput" type="number" value={capacityInput} onChange={(e) => setCapacityInput(e.target.value)} className="mt-1" disabled />
            </div>
            <Button className="mt-2 w-full" disabled>Solve (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    
