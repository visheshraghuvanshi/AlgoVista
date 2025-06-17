
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { ArrayAlgorithmStep } from '@/types'; // Using ArrayAlgorithmStep
import type { PermutationsSubsetsProblemType } from './permutations-subsets-logic';

interface PermutationsSubsetsVisualizationPanelProps {
  step: ArrayAlgorithmStep | null;
  problemType: PermutationsSubsetsProblemType;
  originalInputSet: (string | number)[];
}

export function PermutationsSubsetsVisualizationPanel({ step, problemType, originalInputSet }: PermutationsSubsetsVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Visualization</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter elements and start.</p></CardContent>
      </Card>
    );
  }

  const { array: currentCombination, auxiliaryData, message, activeIndices } = step;
  const results = auxiliaryData?.results as (string | number)[][] || [];
  const remaining = auxiliaryData?.remaining as (string | number)[] || []; // For permutations
  const nextToConsider = auxiliaryData?.nextToConsider as (string|number)[] || []; // For subsets

  const problemTitle = problemType.charAt(0).toUpperCase() + problemType.slice(1);

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">{problemTitle} Visualization</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4 p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg">
        
        <div className="p-3 border rounded-md bg-background shadow">
          <p className="text-sm font-semibold text-muted-foreground">Input Set:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {originalInputSet.map((el, idx) => (
              <Badge key={`input-${idx}`} variant="outline" className="text-lg font-code">{el}</Badge>
            ))}
          </div>
        </div>
        
        <div className="p-3 border rounded-md bg-background shadow">
          <p className="text-sm font-semibold text-muted-foreground">Current {problemType === 'permutations' ? 'Permutation' : 'Subset'} Being Built:</p>
          <div className="flex flex-wrap gap-2 mt-1 min-h-[2.5rem]">
            {currentCombination.map((el, idx) => (
              <Badge key={`current-${idx}`} variant="secondary" className="text-lg font-code bg-primary/20 text-primary dark:bg-accent/20 dark:text-accent">
                {el}
              </Badge>
            ))}
            {currentCombination.length === 0 && <span className="text-muted-foreground italic text-sm">(empty)</span>}
          </div>
        </div>

        {problemType === 'permutations' && auxiliaryData?.remaining && (
          <div className="p-3 border rounded-md bg-background shadow">
            <p className="text-sm font-semibold text-muted-foreground">Remaining Elements to Choose From:</p>
            <div className="flex flex-wrap gap-2 mt-1 min-h-[2.5rem]">
              {remaining.map((el, idx) => (
                <Badge key={`remaining-${idx}`} variant="outline" className="text-lg font-code">{el}</Badge>
              ))}
               {remaining.length === 0 && <span className="text-muted-foreground italic text-sm">(none)</span>}
            </div>
          </div>
        )}

        {problemType === 'subsets' && auxiliaryData?.nextToConsider && (
             <div className="p-3 border rounded-md bg-background shadow">
            <p className="text-sm font-semibold text-muted-foreground">Next Elements to Consider:</p>
             <div className="flex flex-wrap gap-2 mt-1 min-h-[2.5rem]">
              {nextToConsider.map((el, idx) => (
                <Badge key={`next-consider-${idx}`} variant="outline" className="text-lg font-code">{el}</Badge>
              ))}
               {nextToConsider.length === 0 && <span className="text-muted-foreground italic text-sm">(none)</span>}
            </div>
          </div>
        )}


        <div className="p-3 border rounded-md bg-background shadow flex-1 min-h-[100px]">
          <p className="text-sm font-semibold text-muted-foreground">Found {problemTitle} ({results.length}):</p>
          <ScrollArea className="h-32 mt-1">
            {results.length === 0 && <p className="text-muted-foreground italic text-sm">(None yet)</p>}
            {results.map((res, idx) => (
              <div key={`res-${idx}`} className="flex flex-wrap gap-1 my-1 p-1 border-b border-border/50">
                 <span className="text-muted-foreground text-xs mr-1">{idx+1}.</span>
                {res.map((el, elIdx) => (
                  <Badge key={`res-${idx}-${elIdx}`} variant={ activeIndices.includes(idx) && step.sortedIndices.length > 0 && JSON.stringify(res) === JSON.stringify(step.array) ? "default" : "outline"} className="font-code text-xs">
                    {el}
                  </Badge>
                ))}
                {res.length === 0 && <Badge variant="outline" className="font-code text-xs">(empty set)</Badge>}
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
