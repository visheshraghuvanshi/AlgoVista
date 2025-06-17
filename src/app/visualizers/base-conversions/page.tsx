
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react'; // Removed AlertTriangle
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BASE_CONVERSION_CODE_SNIPPETS = {
  JavaScript: [
    "// Convert Decimal to Base B (Integer part)",
    "function decimalToBaseB(decimalNum, baseB) {",
    "  if (decimalNum === 0) return '0';",
    "  let result = '';",
    "  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Up to base 36",
    "  while (decimalNum > 0) {",
    "    result = digits[decimalNum % baseB] + result;",
    "    decimalNum = Math.floor(decimalNum / baseB);",
    "  }",
    "  return result;",
    "}",
    "",
    "// Convert Base B to Decimal (Integer part)",
    "function baseBToDecimal(baseBNumStr, baseB) {",
    "  let decimalNum = 0;",
    "  let power = 0;",
    "  const digitsMap = {}; // {'0':0, '1':1, ..., 'A':10, ...}",
    "  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((char, idx) => digitsMap[char] = idx);",
    "",
    "  for (let i = baseBNumStr.length - 1; i >= 0; i--) {",
    "    const digitValue = digitsMap[baseBNumStr[i].toUpperCase()];",
    "    if (digitValue === undefined || digitValue >= baseB) {",
    "      throw new Error('Invalid digit for base ' + baseB);",
    "    }",
    "    decimalNum += digitValue * Math.pow(baseB, power);",
    "    power++;",
    "  }",
    "  return decimalNum;",
    "}",
  ],
};

export default function BaseConversionsVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [numberInput, setNumberInput] = useState("42");
  const [fromBase, setFromBase] = useState("10");
  const [toBase, setToBase] = useState("2");

  useEffect(() => {
    setIsClient(true);
    toast({
      title: "Conceptual Overview",
      description: `Interactive Base Conversion visualization is currently under construction. Review concepts and code below.`,
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
                The interactive visualizer for {algorithmMetadata.title}, showing the step-by-step conversion process (division for decimal-to-base, multiplication/summation for base-to-decimal), is currently under construction.
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
                        {BASE_CONVERSION_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
                <Label htmlFor="numberInputBC" className="text-sm font-medium">Number to Convert</Label>
                <Input id="numberInputBC" type="text" value={numberInput} onChange={(e) => setNumberInput(e.target.value)} className="mt-1" disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="fromBaseInput" className="text-sm font-medium">From Base (2-36)</Label>
                    <Input id="fromBaseInput" type="number" value={fromBase} onChange={(e) => setFromBase(e.target.value)} min="2" max="36" className="mt-1" disabled />
                </div>
                <div>
                    <Label htmlFor="toBaseInput" className="text-sm font-medium">To Base (2-36)</Label>
                    <Input id="toBaseInput" type="number" value={toBase} onChange={(e) => setToBase(e.target.value)} min="2" max="36" className="mt-1" disabled />
                </div>
            </div>
            <Button className="mt-2 w-full" disabled>Convert (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    