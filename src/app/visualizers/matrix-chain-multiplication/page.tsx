
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

const MCM_CODE_SNIPPETS = {
  JavaScript: [
    "// Matrix Chain Multiplication (Dynamic Programming)",
    "// p is an array of dimensions, p[i-1] x p[i] is dimension of matrix A_i",
    "function matrixChainOrder(p) {",
    "  const n = p.length - 1; // Number of matrices",
    "  // dp[i][j] = Minimum number of scalar multiplications needed to compute A_i...A_j",
    "  const dp = Array(n + 1).fill(null).map(() => Array(n + 1).fill(0));",
    "  // s[i][j] = Optimal split point k for A_i...A_j",
    "  // const s = Array(n + 1).fill(null).map(() => Array(n + 1).fill(0)); // For reconstructing optimal parenthesization",
    "",
    "  // L is chain length. L varies from 2 to n.",
    "  for (let L = 2; L <= n; L++) {",
    "    for (let i = 1; i <= n - L + 1; i++) {",
    "      let j = i + L - 1;",
    "      dp[i][j] = Infinity;",
    "      for (let k = i; k < j; k++) {",
    "        // Cost to multiply (A_i...A_k) and (A_{k+1}...A_j)",
    "        // plus cost of multiplying the two resulting matrices.",
    "        const cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j];",
    "        if (cost < dp[i][j]) {",
    "          dp[i][j] = cost;",
    "          // s[i][j] = k; // Store split point",
    "        }",
    "      }",
    "    }",
    "  }",
    "  return dp[1][n]; // Minimum scalar multiplications for A_1...A_n",
    "}",
  ],
};

export default function MCMVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [dimensionsInput, setDimensionsInput] = useState("10,30,5,60"); // e.g., A1:10x30, A2:30x5, A3:5x60

  useEffect(() => {
    setIsClient(true);
    if (algorithmMetadata) {
       toast({
            title: "Conceptual Overview",
            description: `Interactive MCM visualization (DP table and parenthesization) is currently under construction.`,
            variant: "default",
            duration: 5000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for ${algorithmMetadata.slug} not found.`, variant: "destructive" });
    }
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }
  if (!algoDetails) { 
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
            <p className="text-muted-foreground text-lg">
              Could not load data for &quot;{algorithmMetadata?.slug || 'Matrix Chain Multiplication'}&quot;.
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
                The interactive visualizer for {algoDetails.title}, showing DP table construction and optimal parenthesization, is currently under construction.
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
                        {MCM_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
                <Label htmlFor="dimensionsInput" className="text-sm font-medium">Matrix Dimensions (p array, comma-sep, e.g., 10,30,5,60 for 3 matrices)</Label>
                <Input id="dimensionsInput" type="text" value={dimensionsInput} onChange={(e) => setDimensionsInput(e.target.value)} className="mt-1" disabled />
            </div>
            <Button className="mt-2 w-full" disabled>Solve (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
