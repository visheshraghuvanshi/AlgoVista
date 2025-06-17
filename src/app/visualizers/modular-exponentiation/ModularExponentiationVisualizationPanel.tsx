
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModularExponentiationStep } from './modular-exponentiation-logic'; 
import { Badge } from '@/components/ui/badge';

interface ModularExponentiationVisualizationPanelProps {
  step: ModularExponentiationStep | null;
}

export function ModularExponentiationVisualizationPanel({ step }: ModularExponentiationVisualizationPanelProps) {
  if (!step || !step.auxiliaryData) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Modular Exponentiation</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter numbers and click "Calculate".</p></CardContent>
      </Card>
    );
  }

  const { base, exponent, modulus, result, currentOperationDescription } = step.auxiliaryData;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">
          Modular Exponentiation
        </CardTitle>
        {step.message && <p className="text-xs text-muted-foreground">{step.message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg space-y-4">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-lg text-center">
            <StateDisplay label="Base" value={base} isHighlighted={currentOperationDescription?.includes("base * base")} />
            <StateDisplay label="Exponent" value={exponent} isHighlighted={currentOperationDescription?.includes("exponent / 2")} />
            <StateDisplay label="Result" value={result} isHighlighted={currentOperationDescription?.includes("result * base")} />
            <StateDisplay label="Modulus" value={modulus} />
        </div>

        {currentOperationDescription && (
          <div className="mt-3 p-3 border rounded-md bg-background shadow w-full max-w-md">
            <p className="text-sm text-muted-foreground">Current Operation:</p>
            <p className="text-md font-semibold text-foreground font-code">{currentOperationDescription}</p>
          </div>
        )}
        
        {step.currentLine === 9 && ( // Corresponds to returnResult line
          <div className="mt-4 p-3 bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/50 rounded-md w-full max-w-md">
            <p className="text-sm font-semibold">Final Result:</p>
            <p className="text-2xl font-bold">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StateDisplayProps {
    label: string;
    value: number;
    isHighlighted?: boolean;
}

const StateDisplay: React.FC<StateDisplayProps> = ({ label, value, isHighlighted }) => (
    <div className={`p-3 border rounded-md shadow transition-all duration-200 ${isHighlighted ? 'bg-accent text-accent-foreground scale-105' : 'bg-background'}`}>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold font-code">{value}</p>
    </div>
);

