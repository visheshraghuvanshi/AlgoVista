
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopKAlgorithmStep, PriorityQueueItem } from './types';
import { Badge } from '@/components/ui/badge';

interface TopKElementsVisualizationPanelProps {
  step: TopKAlgorithmStep | null;
}

const ELEMENT_WIDTH = 60; 
const ELEMENT_HEIGHT = 35;
const ELEMENT_MARGIN = 5;

export function TopKElementsVisualizationPanel({ step }: TopKElementsVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Top K Elements</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter data and K, then find Top K.</p></CardContent>
      </Card>
    );
  }

  const { inputArray, heap, currentElement, operation, message, comparison, result } = step;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Top K Elements (Min-Heap)</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {operation && <Badge variant="outline" className="mt-1">Operation: {operation}</Badge>}
        {currentElement !== undefined && <Badge variant="secondary" className="mt-1 ml-1">Processing Element: {currentElement}</Badge>}
        {comparison && <p className="text-xs italic mt-1">Comparison: {comparison}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4 p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto">
        
        <div>
          <p className="text-sm font-semibold mb-1">Input Array:</p>
          <div className="flex flex-wrap gap-2 p-2 border rounded bg-background/50 min-h-[40px]">
            {inputArray.map((val, idx) => (
              <div
                key={`input-${idx}`}
                className={`flex items-center justify-center rounded text-sm font-medium border
                            ${idx === step.activeIndices?.[0] ? 'bg-primary text-primary-foreground ring-2 ring-primary' : 'bg-card text-card-foreground border-border'}`}
                style={{ width: `${ELEMENT_WIDTH}px`, height: `${ELEMENT_HEIGHT}px` }}
                title={`Value: ${val}`}
              >
                {val}
              </div>
            ))}
            {inputArray.length === 0 && <span className="text-muted-foreground italic text-xs self-center">(empty)</span>}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-1">Min-Heap (Top K Candidates):</p>
          <div className="flex flex-wrap gap-2 p-2 border rounded bg-background/50 min-h-[60px]">
            {heap.map((item, idx) => (
              <div
                key={`heap-${idx}`}
                className={`flex items-center justify-center rounded text-sm font-medium border
                            ${step.activeHeapIndices?.includes(idx) ? 'bg-accent text-accent-foreground ring-2 ring-accent' : 'bg-card text-card-foreground border-border'}
                            ${(operation?.includes("Extract") && idx === 0 && step.processedItem?.value === item.value) ? 'opacity-50 line-through' : ''}
                            `}
                style={{ width: `${ELEMENT_WIDTH}px`, height: `${ELEMENT_HEIGHT}px` }}
                title={`Value: ${item.value} (Priority: ${item.priority})`}
              >
                {item.value}
              </div>
            ))}
            {heap.length === 0 && <span className="text-muted-foreground italic text-xs self-center">(empty)</span>}
          </div>
        </div>

        {result && result.length > 0 && (
          <div className="mt-4 p-3 bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/50 rounded-md w-full">
            <p className="text-sm font-semibold">Top {result.length} Largest Elements:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {result.map((val, index) => (
                <Badge key={`result-${index}`} variant="default" className="text-lg px-3 py-1 font-code bg-green-600 hover:bg-green-700">{val}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    