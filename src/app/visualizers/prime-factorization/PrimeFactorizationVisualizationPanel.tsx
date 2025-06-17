
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrimeFactorizationStep } from './prime-factorization-logic';
import { Badge } from '@/components/ui/badge';

interface PrimeFactorizationVisualizationPanelProps {
  step: PrimeFactorizationStep | null;
}

export function PrimeFactorizationVisualizationPanel({ step }: PrimeFactorizationVisualizationPanelProps) {
  if (!step || !step.auxiliaryData) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Factorization Process</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter a number and click "Factorize".</p></CardContent>
      </Card>
    );
  }

  const { originalN, currentN, currentDivisor, factors, message: auxMessage } = step.auxiliaryData;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Factorizing: {originalN}</CardTitle>
        {step.message && <p className="text-xs text-muted-foreground">{step.message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg space-y-4">
        
        <div className="text-center p-3 border rounded-md bg-background shadow w-full max-w-md">
          <p className="text-sm text-muted-foreground">Current Number (n):</p>
          <p className="text-3xl font-bold text-primary font-code">{currentN}</p>
        </div>

        {currentDivisor !== null && (
          <div className="text-center p-3 border rounded-md bg-background shadow w-full max-w-md">
            <p className="text-sm text-muted-foreground">Current Divisor (p or i):</p>
            <p className="text-2xl font-bold text-accent font-code">{currentDivisor}</p>
          </div>
        )}
        
        <div className="text-center p-3 border rounded-md bg-background shadow w-full max-w-md">
          <p className="text-sm text-muted-foreground">Prime Factors Found:</p>
          {factors.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {factors.map((factor, index) => (
                <Badge key={index} variant="secondary" className="text-lg px-3 py-1 font-code">{factor}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-lg font-code text-muted-foreground italic">(None yet)</p>
          )}
        </div>
        
        {auxMessage && step.message !== auxMessage && (
             <p className="text-sm text-center text-muted-foreground italic mt-2">{auxMessage}</p>
         )}
      </CardContent>
    </Card>
  );
}
