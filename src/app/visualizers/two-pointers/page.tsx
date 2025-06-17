
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
import { SearchingControlsPanel } from '@/components/algo-vista/searching-controls-panel';

const TWO_POINTERS_CODE_SNIPPETS = {
  JavaScript: [
    "// Example 1: Find a pair with a given sum in a SORTED array",
    "function findPairWithSum(sortedArr, targetSum) {",
    "  let left = 0;",
    "  let right = sortedArr.length - 1;",
    "  while (left < right) {",
    "    const currentSum = sortedArr[left] + sortedArr[right];",
    "    if (currentSum === targetSum) {",
    "      return [sortedArr[left], sortedArr[right]]; // Pair found",
    "    } else if (currentSum < targetSum) {",
    "      left++; // Need a larger sum, move left pointer",
    "    } else { // currentSum > targetSum",
    "      right--; // Need a smaller sum, move right pointer",
    "    }",
    "  }",
    "  return null; // No such pair found",
    "}",
    "",
    "// Example 2: Reverse an array/string in-place",
    "function reverseArray(arr) {",
    "  let left = 0;",
    "  let right = arr.length - 1;",
    "  while (left < right) {",
    "    [arr[left], arr[right]] = [arr[right], arr[left]]; // Swap",
    "    left++;",
    "    right--;",
    "  }",
    "  return arr;",
    "}",
  ],
};

export default function TwoPointersVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    toast({
        title: "Conceptual Overview",
        description: `The Two Pointers technique is versatile. Interactive visualization coming soon for specific examples.`,
        variant: "default",
        duration: 5000,
    });
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
              Could not load data for &quot;{algorithmMetadata?.slug || 'Two Pointers'}&quot;.
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
            {algoDetails.title}
          </h1>
        </div>

        <div className="text-center my-10 p-6 border rounded-lg shadow-lg bg-card">
            <Construction className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Interactive Visualization Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                The Two Pointers technique applies to various problems. An interactive visualizer for specific applications (like finding pairs or reversing arrays) is under construction.
                Please check back later! In the meantime, review the concept and example code.
            </p>
        </div>
        
        <div className="lg:w-3/5 xl:w-2/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-auto flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Example Code Snippets (JavaScript)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[600px]">
                    <pre className="font-code text-sm p-4">
                        {TWO_POINTERS_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
          <SearchingControlsPanel
            onPlay={() => {}}
            onPause={() => {}}
            onStep={() => {}}
            onReset={() => {}}
            onInputChange={() => {}}
            inputValue={"(e.g., sorted array for pair sum)"}
            onTargetValueChange={() => {}}
            targetValue={""}
            targetInputLabel="Example: Target Sum (for pair sum)"
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
