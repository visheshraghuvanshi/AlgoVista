
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

const COIN_CHANGE_CODE_SNIPPETS = {
  JavaScript: [
    "// Coin Change - Minimum Coins (Dynamic Programming)",
    "function minCoins(coins, amount) {",
    "  // dp[i] will store the minimum number of coins required for amount i",
    "  // Initialize dp array with Infinity, dp[0] = 0",
    "  const dp = new Array(amount + 1).fill(Infinity);",
    "  dp[0] = 0;",
    "",
    "  for (let i = 1; i <= amount; i++) {",
    "    for (const coin of coins) {",
    "      if (coin <= i) {",
    "        dp[i] = Math.min(dp[i], dp[i - coin] + 1);",
    "      }",
    "    }",
    "  }",
    "  return dp[amount] === Infinity ? -1 : dp[amount]; // -1 if not possible",
    "}",
    "",
    "// Coin Change - Number of Ways (Dynamic Programming)",
    "function countWays(coins, amount) {",
    "  // dp[i] will store the number of ways to make amount i",
    "  const dp = new Array(amount + 1).fill(0);",
    "  dp[0] = 1; // One way to make amount 0 (by choosing no coins)",
    "",
    "  for (const coin of coins) { // Iterate through coins first to count combinations",
    "    for (let i = coin; i <= amount; i++) {",
    "      dp[i] += dp[i - coin];",
    "    }",
    "  }",
    "  return dp[amount];",
    "}",
  ],
};

export default function CoinChangeVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [coinsInput, setCoinsInput] = useState("1,2,5");
  const [amountInput, setAmountInput] = useState("11");

  useEffect(() => {
    setIsClient(true);
    if (algorithmMetadata) {
       toast({
            title: "Conceptual Overview",
            description: `Interactive Coin Change (DP table for min coins or ways) is currently under construction.`,
            variant: "default",
            duration: 5000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for Coin Change Problem not found.`, variant: "destructive" });
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
              Could not load data for "coin-change".
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
                The interactive visualizer for {algorithmMetadata.title}, showing DP table construction for min coins or number of ways, is currently under construction.
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
                        {COIN_CHANGE_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
                <Label htmlFor="coinsInput" className="text-sm font-medium">Coin Denominations (comma-separated)</Label>
                <Input id="coinsInput" type="text" value={coinsInput} onChange={(e) => setCoinsInput(e.target.value)} className="mt-1" disabled />
            </div>
            <div>
                <Label htmlFor="amountInput" className="text-sm font-medium">Target Amount</Label>
                <Input id="amountInput" type="number" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} className="mt-1" disabled />
            </div>
            <Button className="mt-2 w-full" disabled>Calculate (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
