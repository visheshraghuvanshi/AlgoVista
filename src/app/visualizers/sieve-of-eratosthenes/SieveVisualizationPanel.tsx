
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SieveAlgorithmStep } from './sieve-logic';

interface SieveVisualizationPanelProps {
  step: SieveAlgorithmStep | null;
}

export function SieveVisualizationPanel({ step }: SieveVisualizationPanelProps) {
  if (!step || !step.array) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Sieve Grid</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter a limit and start simulation.</p></CardContent>
      </Card>
    );
  }

  const { array: sieveState, auxiliaryData, message } = step;
  const limitN = auxiliaryData?.limitN || 0;
  const currentP = auxiliaryData?.currentP;
  const currentMultiple = auxiliaryData?.currentMultiple;
  const primesFound = auxiliaryData?.primesFound;

  const numbersToDisplay = sieveState.slice(0, limitN + 1);

  const getCellColor = (index: number, value: number) => {
    if (index === currentP) return "bg-blue-500 text-white"; // Current prime p
    if (index === currentMultiple) return "bg-yellow-500 text-black"; // Current multiple being marked
    if (value === 1) return "bg-green-200 dark:bg-green-700"; // Prime
    if (value === 0) return "bg-red-200 dark:bg-red-700 line-through opacity-60"; // Composite
    return "bg-card"; // Default or unvisited
  };
  
  const cellSize = limitN <= 50 ? "w-8 h-8 text-xs" : limitN <=100 ? "w-7 h-7 text-[10px]" : "w-6 h-6 text-[9px]";


  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Sieve of Eratosthenes Grid (up to {limitN})</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-start bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg overflow-auto">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(1.5rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-1 w-full">
          {numbersToDisplay.map((state, index) => {
            if (index < 2) return null; // Skip 0 and 1
            return (
              <div
                key={index}
                className={`flex items-center justify-center rounded border aspect-square
                            ${getCellColor(index, state)}
                            ${cellSize}`}
                title={`Number: ${index}, State: ${state === 1 ? 'Prime' : (state === 0 ? 'Composite' : 'Processing')}`}
              >
                {index}
              </div>
            );
          })}
        </div>
        {primesFound && (
          <div className="mt-4 w-full">
            <p className="font-semibold text-sm">Primes Found ({primesFound.length}):</p>
            <p className="text-xs font-code break-all max-h-20 overflow-y-auto p-1 border rounded bg-background">
              {primesFound.join(', ') || 'None yet'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
