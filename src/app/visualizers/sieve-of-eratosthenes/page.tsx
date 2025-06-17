
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SIEVE_CODE_SNIPPETS = {
  JavaScript: [
    "// Sieve of Eratosthenes",
    "function sieveOfEratosthenes(n) {",
    "  // Create a boolean array 'prime[0..n]' and initialize",
    "  // all entries it as true. A value in prime[i] will",
    "  // finally be false if i is Not a prime, else true.",
    "  const prime = new Array(n + 1).fill(true);",
    "  prime[0] = prime[1] = false; // 0 and 1 are not prime numbers",
    "",
    "  for (let p = 2; p * p <= n; p++) {",
    "    // If prime[p] is not changed, then it is a prime",
    "    if (prime[p] === true) {",
    "      // Update all multiples of p greater than or equal to the square of it",
    "      // Numbers which are multiples of p and are less than p^2 are already been marked.",
    "      for (let i = p * p; i <= n; i += p) {",
    "        prime[i] = false;",
    "      }",
    "    }",
    "  }",
    "",
    "  // Collect all prime numbers",
    "  const primes = [];",
    "  for (let p = 2; p <= n; p++) {",
    "    if (prime[p]) {",
    "      primes.push(p);",
    "    }",
    "  }",
    "  return primes;",
    "}",
  ],
};

export default function SieveVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [limitN, setLimitN] = useState("30");

  useEffect(() => {
    setIsClient(true);
    toast({
      title: "Conceptual Overview",
      description: `Interactive Sieve of Eratosthenes visualization (number grid marking) is currently under construction. Review concepts and code below.`,
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
                The interactive visualizer for the {algorithmMetadata.title}, showing the marking of composite numbers on a grid, is currently under construction.
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
                        {SIEVE_CODE_SNIPPETS.JavaScript.map((line, index) => (
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

        <div className="w-full max-w-xs mx-auto my-4 p-4 border rounded-lg shadow-md space-y-4">
            <div>
                <Label htmlFor="limitNInput" className="text-sm font-medium">Find primes up to n:</Label>
                <Input id="limitNInput" type="number" value={limitN} onChange={(e) => setLimitN(e.target.value)} className="mt-1" disabled />
            </div>
            <Button className="mt-2 w-full" disabled>Generate Primes (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    