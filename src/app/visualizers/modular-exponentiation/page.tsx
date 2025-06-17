
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata'; // Local import
import { useToast } from "@/hooks/use-toast";
import { Construction, Code2 } from 'lucide-react'; // Removed AlertTriangle as it's a placeholder
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MODULAR_EXP_CODE_SNIPPETS = {
  JavaScript: [
    "// Modular Exponentiation (Exponentiation by Squaring - Iterative)",
    "function modularExponentiation(base, exponent, modulus) {",
    "  if (modulus === 1) return 0; // Edge case: result is always 0 mod 1",
    "  let result = 1;",
    "  base = base % modulus;",
    "  while (exponent > 0) {",
    "    // If exponent is odd, multiply base with result",
    "    if (exponent % 2 === 1) {",
    "      result = (result * base) % modulus;",
    "    }",
    "    // exponent must be even now (or became 0)",
    "    exponent = Math.floor(exponent / 2); // or exponent >>= 1;",
    "    base = (base * base) % modulus; // Change base to base^2",
    "  }",
    "  return result;",
    "}",
  ],
};

export default function ModularExponentiationVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [base, setBase] = useState("3");
  const [exponent, setExponent] = useState("5");
  const [modulus, setModulus] = useState("7");

  useEffect(() => {
    setIsClient(true);
    toast({
      title: "Conceptual Overview",
      description: `Interactive Modular Exponentiation visualization (step-by-step calculation) is currently under construction. Review concepts and code below.`,
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
                The interactive visualizer for {algorithmMetadata.title}, showing the step-by-step calculations of (base^exponent) % modulus, is currently under construction.
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
                        {MODULAR_EXP_CODE_SNIPPETS.JavaScript.map((line, index) => (
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

        <div className="w-full max-w-md mx-auto my-4 p-4 border rounded-lg shadow-md space-y-4">
            <div>
                <Label htmlFor="baseInput" className="text-sm font-medium">Base</Label>
                <Input id="baseInput" type="number" value={base} onChange={(e) => setBase(e.target.value)} className="mt-1" disabled />
            </div>
            <div>
                <Label htmlFor="exponentInput" className="text-sm font-medium">Exponent</Label>
                <Input id="exponentInput" type="number" value={exponent} onChange={(e) => setExponent(e.target.value)} className="mt-1" disabled />
            </div>
            <div>
                <Label htmlFor="modulusInput" className="text-sm font-medium">Modulus</Label>
                <Input id="modulusInput" type="number" value={modulus} onChange={(e) => setModulus(e.target.value)} className="mt-1" disabled />
            </div>
            <Button className="mt-2 w-full" disabled>Calculate (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    