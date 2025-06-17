
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

const LIS_CODE_SNIPPETS = {
  JavaScript: [
    "// Longest Increasing Subsequence (Dynamic Programming - O(N^2))",
    "function lengthOfLIS_N2(nums) {",
    "  if (nums.length === 0) return 0;",
    "  // dp[i] stores the length of the LIS ending at index i",
    "  const dp = new Array(nums.length).fill(1);",
    "  let maxLength = 1;",
    "  for (let i = 1; i < nums.length; i++) {",
    "    for (let j = 0; j < i; j++) {",
    "      if (nums[i] > nums[j]) {",
    "        dp[i] = Math.max(dp[i], dp[j] + 1);",
    "      }",
    "    }",
    "    maxLength = Math.max(maxLength, dp[i]);",
    "  }",
    "  return maxLength;",
    "}",
    "",
    "// Longest Increasing Subsequence (Patience Sorting / Binary Search - O(N log N))",
    "function lengthOfLIS_NLogN(nums) {",
    "  if (nums.length === 0) return 0;",
    "  // 'tails' array stores the smallest tail of all increasing subsequences with length i+1",
    "  const tails = [];",
    "  for (const num of nums) {",
    "    let i = 0, j = tails.length;",
    "    // Binary search for the first tail >= num",
    "    while (i < j) {",
    "      const mid = Math.floor((i + j) / 2);",
    "      if (tails[mid] < num) {",
    "        i = mid + 1;",
    "      } else {",
    "        j = mid;",
    "      }",
    "    }",
    "    if (i === tails.length) {",
    "      tails.push(num); // Extend the longest subsequence found so far",
    "    } else {",
    "      tails[i] = num; // Replace tail to potentially start a better LIS of this length",
    "    }",
    "  }",
    "  return tails.length;",
    "}",
  ],
};

export default function LISVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [arrayInput, setArrayInput] = useState("10,9,2,5,3,7,101,18");

  useEffect(() => {
    setIsClient(true);
    toast({
        title: "Conceptual Overview",
        description: `Interactive LIS visualization (DP table or patience sorting) is currently under construction.`,
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
                The interactive visualizer for {algorithmMetadata.title}, showing DP table or patience sorting steps, is currently under construction.
                Review the concepts and code below.
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
                        {LIS_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
                <Label htmlFor="arrayInputLIS" className="text-sm font-medium">Input Array (comma-separated numbers)</Label>
                <Input id="arrayInputLIS" type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="mt-1" disabled />
            </div>
            <Button className="mt-2 w-full" disabled>Find LIS (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    
