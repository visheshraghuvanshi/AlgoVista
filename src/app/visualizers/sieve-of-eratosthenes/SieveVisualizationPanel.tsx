
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

  const getCellClasses = (index: number, value: number) => {
    let classes = "bg-white dark:bg-card"; // Unmarked
    if (value === 0) {
      classes = "bg-red-200/60 dark:bg-red-900/60 text-muted-foreground line-through"; // Composite
    } else if (value === 1 && step.currentLine === 10) { // Final prime state
      classes = "bg-green-200 dark:bg-green-800/80";
    }

    if (index === currentP) {
      classes += " ring-4 ring-yellow-400 dark:ring-yellow-500 z-10";
    }
    if (index === currentMultiple) {
      classes += " ring-4 ring-destructive/70 dark:ring-destructive/90 z-10 scale-110";
    }
    return classes;
  };
  
  const cellSizeClass = limitN <= 50 ? "w-10 h-10 text-sm" : limitN <=100 ? "w-8 h-8 text-xs" : "w-7 h-7 text-[10px]";

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Sieve of Eratosthenes Grid (up to {limitN})</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-start bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg overflow-auto space-y-3">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-1.5 w-full">
          {numbersToDisplay.map((state, index) => {
            if (index < 2) return null; // Skip 0 and 1
            return (
              <div
                key={index}
                className={`flex items-center justify-center rounded-lg border font-bold transition-all duration-200 aspect-square ${getCellClasses(index, state)} ${cellSizeClass}`}
                title={`Number: ${index}, State: ${state === 1 ? 'Prime' : 'Composite'}`}
              >
                {index}
              </div>
            );
          })}
        </div>
        {primesFound && (
          <div className="mt-auto w-full p-2 border rounded-md bg-background shadow">
            <p className="font-semibold text-sm">Primes Found ({primesFound.length}):</p>
            <p className="text-xs font-code break-all max-h-20 overflow-y-auto p-1">
              {primesFound.join(', ') || 'None yet'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
