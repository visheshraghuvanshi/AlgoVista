
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BaseConversionStep } from './base-conversions-logic'; // Ensure this type is correctly defined
import { Badge } from '@/components/ui/badge';

interface BaseConversionsVisualizationPanelProps {
  step: BaseConversionStep | null;
}

export function BaseConversionsVisualizationPanel({ step }: BaseConversionsVisualizationPanelProps) {
  if (!step || !step.auxiliaryData) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Conversion Steps</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter numbers and bases, then click "Convert".</p></CardContent>
      </Card>
    );
  }

  const { 
    originalNumber, fromBase, toBase, 
    currentValue, intermediateResult, finalResult, 
    equation, message: auxMessage 
  } = step.auxiliaryData;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">
          Convert "{originalNumber}"<sub>{fromBase}</sub> to Base {toBase}
        </CardTitle>
        {step.message && <p className="text-xs text-muted-foreground">{step.message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg space-y-3">
        
        <div className="text-center p-3 border rounded-md bg-background shadow w-full max-w-md">
          <p className="text-sm text-muted-foreground">Current Value Being Processed:</p>
          <p className="text-2xl font-bold text-primary font-code">{currentValue.toString()}</p>
        </div>

        {equation && (
          <div className="text-center p-2 border rounded-md bg-secondary/10 w-full max-w-md">
            <p className="text-xs text-muted-foreground">Current Calculation:</p>
            <p className="text-md font-code text-foreground">{equation}</p>
          </div>
        )}
        
        {intermediateResult && (
          <div className="text-center p-3 border rounded-md bg-background shadow w-full max-w-md">
            <p className="text-sm text-muted-foreground">Intermediate Result / State:</p>
            <p className="text-xl font-bold text-accent font-code">{intermediateResult}</p>
          </div>
        )}
        
        {finalResult && (
          <div className="mt-4 p-3 bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/50 rounded-md w-full max-w-md">
            <p className="text-sm font-semibold">Final Result:</p>
            <p className="text-2xl font-bold">{finalResult}<sub>{toBase}</sub></p>
          </div>
        )}
         {auxMessage && step.message !== auxMessage && ( // Display auxMessage if different from main step message
             <p className="text-sm text-center text-muted-foreground italic mt-2">{auxMessage}</p>
         )}
      </CardContent>
    </Card>
  );
}
