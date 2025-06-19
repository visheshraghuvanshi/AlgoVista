
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlgorithmStep } from './types'; // Local import

interface RadixSortVisualizationPanelProps {
  step: AlgorithmStep | null; // Using generic AlgorithmStep, expecting auxiliaryData to contain Radix specific info
}

const BAR_WIDTH = 20;
const BAR_MARGIN = 2;
const ARRAY_PADDING = 10;

export function VisualizationPanel({ step }: RadixSortVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Radix Sort Visualization</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter data and start.</p></CardContent>
      </Card>
    );
  }

  const { array: inputArray, activeIndices, swappingIndices, sortedIndices, message, auxiliaryData } = step;
  const countArray = auxiliaryData?.countArray as number[] | undefined;
  const outputArray = auxiliaryData?.outputArray as number[] | undefined;
  const currentExponent = auxiliaryData?.exponent as number | undefined;
  const currentDigit = auxiliaryData?.currentDigitProcessing as number | undefined;

  const renderArray = (arr: number[] | undefined, label: string, highlightIndices?: number[], highlightType?: 'active' | 'swap' | 'digit') => {
    if (!arr) return null;
    return (
      <div className="mb-3">
        <p className="font-semibold text-sm mb-1">{label}{currentExponent && label.includes("Input") ? ` (Pass for exp=${currentExponent})`: ""}:</p>
        <div className="flex flex-wrap gap-1 p-2 border rounded bg-background/50 min-h-[36px]">
          {arr.map((val, idx) => {
            let cellClass = "bg-card text-card-foreground";
            if (highlightIndices?.includes(idx)) {
              if (highlightType === 'active') cellClass = "bg-primary text-primary-foreground scale-105";
              else if (highlightType === 'swap') cellClass = "bg-accent text-accent-foreground scale-105";
              else if (highlightType === 'digit' && val === currentDigit) cellClass = "bg-blue-500 text-white"; // Highlight current digit in count array
            }
            if (sortedIndices?.includes(idx) && label.toLowerCase().includes("input")) cellClass ="bg-green-500 text-white";

            return (
              <div
                key={`${label}-${idx}`}
                className={`flex flex-col items-center justify-center rounded text-xs font-medium border ${cellClass}`}
                style={{ width: `${BAR_WIDTH * 1.5}px`, minHeight: '30px', padding: '2px' }}
                title={`${label}[${idx}] = ${val === undefined ? '_' : val}`}
              >
                <span className="text-muted-foreground text-[9px]">{idx}</span>
                <span>{val === undefined ? '_' : val}</span>
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
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Radix Sort Steps</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto space-y-2">
        {renderArray(inputArray, "Input Array / Current Array State", activeIndices, 'active')}
        {auxiliaryData?.currentPassCountingSort && countArray && renderArray(countArray, `Count Array (for exp=${currentExponent})`, auxiliaryData.activeCountIndex !== undefined ? [auxiliaryData.activeCountIndex] : [], 'digit')}
        {auxiliaryData?.currentPassCountingSort && outputArray && renderArray(outputArray, `Output Array (for exp=${currentExponent})`, auxiliaryData.activeOutputIndex !== undefined ? [auxiliaryData.activeOutputIndex] : [])}
      </CardContent>
    </Card>
  );
}
