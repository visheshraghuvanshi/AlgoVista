
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BITAlgorithmStep } from './types';
import { Badge } from '@/components/ui/badge';

interface BITVisualizationPanelProps {
  step: BITAlgorithmStep | null;
  originalArray: number[]; // To display alongside the BIT
}

const ELEMENT_BOX_SIZE = 35; 
const ELEMENT_MARGIN = 4;

export function BITVisualizationPanel({ step, originalArray }: BITVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Binary Indexed Tree</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Initialize BIT or perform an operation.</p></CardContent>
      </Card>
    );
  }

  const { bitArray, operation, currentIndex, currentValue, delta, queryResult, range, message, activeBitIndices } = step;
  
  const renderArray = (arr: number[], label: string, highlightIndices?: number[], isBitArray: boolean = false) => {
    if (!arr) return null;
    return (
      <div className="mb-3">
        <p className="font-semibold text-sm mb-1">{label}:</p>
        <div className="flex flex-wrap gap-1 p-2 border rounded bg-background/50 min-h-[40px]">
          {arr.map((val, idx) => {
            const displayIndex = isBitArray ? idx + 1 : idx; // BIT is 1-indexed conceptually
            const isHighlighted = highlightIndices?.includes(isBitArray ? idx + 1 : idx);
            return (
              <div
                key={`${label}-${idx}`}
                className={`flex flex-col items-center justify-center rounded border text-xs font-medium
                            ${isHighlighted ? 'bg-accent text-accent-foreground ring-2 ring-accent scale-105' : 'bg-card text-card-foreground'}`}
                style={{ width: `${ELEMENT_BOX_SIZE * 1.5}px`, minHeight: '30px', padding: '2px' }}
                title={`${label}[${displayIndex}] = ${val}`}
              >
                <span className="text-muted-foreground text-[9px]">{displayIndex}</span>
                <span>{val}</span>
              </div>
            );
          })}
          {arr.length === 0 && <span className="text-muted-foreground italic text-xs self-center">(empty)</span>}
        </div>
      </div>
    );
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Binary Indexed Tree (Fenwick Tree)</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {operation && <Badge variant="outline" className="mt-1">Operation: {operation}</Badge>}
        {currentIndex !== undefined && <Badge variant="secondary" className="mt-1 ml-1">Index: {currentIndex}</Badge>}
        {(operation === 'update' && delta !== undefined) && <Badge variant="secondary" className="mt-1 ml-1">Delta: {delta}</Badge>}
        {(operation === 'query' || operation === 'queryRange') && queryResult !== undefined && 
          <p className="text-sm font-bold mt-1">Query Result: {queryResult}</p>
        }
         {operation === 'queryRange' && range && 
          <p className="text-xs italic">Query Range: [{range.start}, {range.end}]</p>
        }
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto space-y-3">
        {originalArray && originalArray.length > 0 && renderArray(originalArray, "Original Array (0-indexed)", currentIndex !== undefined ? [currentIndex] : [])}
        {renderArray(bitArray, "BIT Array (1-indexed values, 0-indexed for display)", activeBitIndices, true)}
      </CardContent>
    </Card>
  );
}

    