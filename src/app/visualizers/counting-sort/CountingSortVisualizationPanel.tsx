
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CountingSortStep } from '@/types';

interface CountingSortVisualizationPanelProps {
  step: CountingSortStep | null;
}

const BAR_WIDTH = 20;
const BAR_MARGIN = 2;
const ARRAY_PADDING = 10;

export function CountingSortVisualizationPanel({ step }: CountingSortVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Counting Sort Visualization</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter data and start.</p></CardContent>
      </Card>
    );
  }

  const { array: inputArray, countArray, outputArray, activeIndices, currentElement, currentIndex, currentCountIndex, message } = step;

  const renderArray = (arr: number[] | undefined, label: string, highlightIndex?: number, elementBeingProcessed?: number) => {
    if (!arr) return null;
    return (
      <div className="mb-4">
        <p className="font-semibold text-sm mb-1">{label}:</p>
        <div className="flex flex-wrap gap-1 p-2 border rounded bg-background/50" style={{ minHeight: '40px'}}>
          {arr.map((val, idx) => (
            <div
              key={`${label}-${idx}`}
              className={`flex flex-col items-center justify-center rounded text-xs font-medium border 
                          ${idx === highlightIndex ? 'bg-accent text-accent-foreground scale-105 shadow-md' : 'bg-card text-card-foreground'}
                          ${label.includes("Input") && activeIndices.includes(idx) ? 'border-primary border-2' : 'border-border'}`}
              style={{ width: `${BAR_WIDTH*1.5}px`, minHeight: '30px', padding: '2px' }}
              title={`${label}[${idx}] = ${val}`}
            >
              <span className="text-muted-foreground text-[10px]">{idx}</span>
              <span>{val === undefined ? '_' : val}</span>
            </div>
          ))}
           {arr.length === 0 && <span className="text-muted-foreground italic text-xs self-center"> (empty)</span>}
        </div>
      </div>
    );
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Counting Sort Steps</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {currentElement !== undefined && <p className="text-xs text-muted-foreground">Processing Element: {currentElement}</p>}
        {currentIndex !== undefined && <p className="text-xs text-muted-foreground">Current Index (Input/Output): {currentIndex}</p>}
        {currentCountIndex !== undefined && <p className="text-xs text-muted-foreground">Current Index (Count Array): {currentCountIndex}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto space-y-3">
        {renderArray(inputArray, "Input Array / Current Array State", currentIndex, currentElement)}
        {renderArray(countArray, "Count Array", currentCountIndex)}
        {renderArray(outputArray, "Output Array", currentIndex)}
      </CardContent>
    </Card>
  );
}
