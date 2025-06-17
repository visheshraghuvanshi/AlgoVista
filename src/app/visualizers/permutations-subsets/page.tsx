
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PERMUTATIONS_SUBSETS_CODE_SNIPPETS = {
  JavaScript: [
    "// Generate All Permutations of an Array (Backtracking)",
    "function permute(nums) {",
    "  const result = [];",
    "  function backtrack(currentPermutation, remainingElements) {",
    "    if (remainingElements.length === 0) {",
    "      result.push([...currentPermutation]);",
    "      return;",
    "    }",
    "    for (let i = 0; i < remainingElements.length; i++) {",
    "      currentPermutation.push(remainingElements[i]);",
    "      const nextRemaining = remainingElements.filter((_, index) => index !== i);",
    "      backtrack(currentPermutation, nextRemaining);",
    "      currentPermutation.pop(); // Backtrack",
    "    }",
    "  }",
    "  backtrack([], nums);",
    "  return result;",
    "}",
    "// Example: permute([1,2,3]);",
    "",
    "// Generate All Subsets (Powerser) of an Array (Backtracking)",
    "function subsets(nums) {",
    "  const result = [];",
    "  function backtrack(index, currentSubset) {",
    "    result.push([...currentSubset]); // Add current subset",
    "    for (let i = index; i < nums.length; i++) {",
    "      currentSubset.push(nums[i]); // Include nums[i]",
    "      backtrack(i + 1, currentSubset); // Recurse",
    "      currentSubset.pop(); // Backtrack: Exclude nums[i]",
    "    }",
    "  }",
    "  backtrack(0, []);",
    "  return result;",
    "}",
    "// Example: subsets([1,2,3]);"
  ],
};

const ALGORITHM_SLUG = 'permutations-subsets';

export default function PermutationsSubsetsVisualizerPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [inputSet, setInputSet] = useState("1,2,3");


  useEffect(() => {
    setIsClient(true);
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
       toast({
            title: "Conceptual Overview",
            description: `Interactive Permutations & Subsets visualization is under construction. Review concepts and code.`,
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
      best: "Permutations: O(N*N!), Subsets: O(N*2^N)", 
      average: "Permutations: O(N*N!), Subsets: O(N*2^N)", 
      worst: "Permutations: O(N*N!), Subsets: O(N*2^N)" 
    },
    spaceComplexity: "Permutations: O(N) for recursion stack (excluding output), Subsets: O(N) for recursion stack (excluding output). Output storage is O(N*N!) and O(N*2^N) respectively.",
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
                The interactive visualizer for {algorithm.title}, showing how permutations or subsets are generated step-by-step, is currently under construction.
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
                        {PERMUTATIONS_SUBSETS_CODE_SNIPPETS.JavaScript.map((line, index) => (
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

        <div className="w-full max-w-xs mx-auto my-4 p-4 border rounded-lg shadow-md">
            <Label htmlFor="inputSetInput" className="text-sm font-medium">Input Set (comma-separated, e.g., 1,2,3)</Label>
            <Input id="inputSetInput" type="text" value={inputSet} onChange={(e) => setInputSet(e.target.value)} className="mt-1" disabled />
            <Button className="mt-2 w-full" disabled>Generate (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    
