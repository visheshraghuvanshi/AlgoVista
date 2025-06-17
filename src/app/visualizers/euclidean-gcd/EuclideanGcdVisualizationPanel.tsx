
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EuclideanGcdStep } from './euclidean-gcd-logic';

interface EuclideanGcdVisualizationPanelProps {
  step: EuclideanGcdStep | null;
}

export function EuclideanGcdVisualizationPanel({ step }: EuclideanGcdVisualizationPanelProps) {
  if (!step || !step.auxiliaryData) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">GCD Calculation Steps</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter numbers and click "Calculate GCD".</p></CardContent>
      </Card>
    );
  }

  const { a, b, remainder, equation, gcd, message: auxMessage } = step.auxiliaryData;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">GCD Calculation Steps</CardTitle>
        {step.message && <p className="text-xs text-muted-foreground">{step.message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg space-y-3">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Current Values:</p>
          <p className="text-2xl font-bold font-code">
            a = <span className={step.currentLine === 5 || step.currentLine === 7 ? "text-accent" : "text-primary"}>{a}</span>, 
            b = <span className={step.currentLine === 4 ? "text-accent" : "text-primary"}>{b}</span>
          </p>
        </div>

        {equation && (
          <div className="text-center p-3 border rounded-md bg-background shadow">
            <p className="text-sm text-muted-foreground">Equation:</p>
            <p className="text-lg font-code text-foreground">{equation}</p>
          </div>
        )}

        {remainder !== undefined && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Remainder:</p>
            <p className="text-xl font-bold text-accent font-code">{remainder}</p>
          </div>
        )}
        
        {gcd !== undefined && (
          <div className="mt-4 p-3 bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/50 rounded-md">
            <p className="text-sm font-semibold">Result:</p>
            <p className="text-2xl font-bold">GCD = {gcd}</p>
          </div>
        )}
         {auxMessage && step.message !== auxMessage && (
             <p className="text-sm text-center text-muted-foreground italic mt-2">{auxMessage}</p>
         )}
      </CardContent>
    </Card>
  );
}
