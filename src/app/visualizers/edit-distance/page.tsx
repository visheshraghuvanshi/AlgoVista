
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

const EDIT_DISTANCE_CODE_SNIPPETS = {
  JavaScript: [
    "// Edit Distance (Levenshtein Distance - Dynamic Programming)",
    "function editDistance(str1, str2) {",
    "  const m = str1.length;",
    "  const n = str2.length;",
    "  // dp[i][j] will store the edit distance between str1[0..i-1] and str2[0..j-1]",
    "  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));",
    "",
    "  // Base cases: transforming an empty string to/from another string",
    "  for (let i = 0; i <= m; i++) dp[i][0] = i; // Cost of deleting i chars from str1",
    "  for (let j = 0; j <= n; j++) dp[0][j] = j; // Cost of inserting j chars into empty str1",
    "",
    "  for (let i = 1; i <= m; i++) {",
    "    for (let j = 1; j <= n; j++) {",
    "      if (str1[i - 1] === str2[j - 1]) {",
    "        // Characters match, no cost from previous diagonal",
    "        dp[i][j] = dp[i - 1][j - 1];",
    "      } else {",
    "        // Characters don't match, take min of insert, delete, or replace",
    "        dp[i][j] = 1 + Math.min(",
    "          dp[i][j - 1],    // Insertion into str1",
    "          dp[i - 1][j],    // Deletion from str1",
    "          dp[i - 1][j - 1] // Replacement",
    "        );",
    "      }",
    "    }",
    "  }",
    "  return dp[m][n]; // Edit distance between str1 and str2",
    "}",
  ],
};

export default function EditDistanceVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [string1, setString1] = useState("kitten");
  const [string2, setString2] = useState("sitting");

  useEffect(() => {
    setIsClient(true);
    toast({
        title: "Conceptual Overview",
        description: `Interactive Edit Distance visualization (DP table) is currently under construction.`,
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

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }
  
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
                        {EDIT_DISTANCE_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
                <Label htmlFor="string1InputED" className="text-sm font-medium">String 1</Label>
                <Input id="string1InputED" type="text" value={string1} onChange={(e) => setString1(e.target.value)} className="mt-1" disabled />
            </div>
            <div>
                <Label htmlFor="string2InputED" className="text-sm font-medium">String 2</Label>
                <Input id="string2InputED" type="text" value={string2} onChange={(e) => setString2(e.target.value)} className="mt-1" disabled />
            </div>
            <Button className="mt-2 w-full" disabled>Calculate Edit Distance (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    
