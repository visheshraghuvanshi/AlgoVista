
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DPAlgorithmStep } from '@/types'; 
import { Badge } from '@/components/ui/badge';

interface LISVisualizationPanelProps {
  step: DPAlgorithmStep | null;
}

export function LISVisualizationPanel({ step }: LISVisualizationPanelProps) {
  if (!step || !step.dpTable || !Array.isArray(step.dpTable)) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">LIS DP Table</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter numbers and start.</p></CardContent>
      </Card>
    );
  }

  const { dpTable, highlightedCells, message, auxiliaryData, resultValue } = step;
  const inputArray = auxiliaryData?.inputArray as number[] || [];
  const maxLength = auxiliaryData?.maxLength as number | string | undefined;
  
  const currentI = step.currentIndices?.i as number | undefined;
  const currentJ = step.currentIndices?.j as number | undefined;

  const getCellClass = (index: number, type: 'input' | 'dp') => {
    if (type === 'dp') {
        const highlight = highlightedCells?.find(cell => cell.col === index); // col used as index for 1D array
        if (highlight) {
            if (highlight.type === 'current') return 'bg-accent text-accent-foreground scale-110 shadow-lg z-10';
            if (highlight.type === 'dependency') return 'bg-primary/30 dark:bg-primary/40';
        }
        if (index === currentI) return 'bg-blue-300 dark:bg-blue-700'; // Current dp[i] being calculated
    } else if (type === 'input') {
        if (index === currentI) return 'bg-purple-300 dark:bg-purple-700'; // Current element nums[i]
        if (index === currentJ) return 'bg-orange-300 dark:bg-orange-700'; // Element nums[j] being compared
    }
    return 'bg-card text-card-foreground';
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Longest Increasing Subsequence (O(N<sup>2</sup>) DP)</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {maxLength !== undefined && <p className="text-sm font-bold">Current Max LIS Length: {maxLength.toString()}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4 p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto">
        
        <div>
            <p className="text-sm font-semibold mb-1">Input Array (nums):</p>
            <div className="flex flex-wrap gap-1">
                {inputArray.map((value, index) => (
                    <div key={`input-${index}`} className={`flex flex-col items-center justify-center p-1 border rounded min-w-[35px] min-h-[35px] text-xs ${getCellClass(index, 'input')} transition-all duration-150`}>
                        <span className="text-xs text-muted-foreground -mb-0.5">{index}</span>
                        <span className="font-bold text-sm">{value}</span>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <p className="text-sm font-semibold mb-1">DP Array (dp[i] = LIS length ending at nums[i]):</p>
            <div className="flex flex-wrap gap-1">
                {(dpTable as number[]).map((value, index) => (
                <div
                    key={`dp-cell-${index}`}
                    className={`flex flex-col items-center justify-center p-1 border rounded min-w-[35px] min-h-[35px] text-xs ${getCellClass(index, 'dp')} transition-all duration-150`}
                    title={`dp[${index}] (LIS ending with ${inputArray[index]}): ${value}`}
                >
                    <span className="text-xs text-muted-foreground -mb-0.5">{index}</span>
                    <span className="font-bold text-sm">{value}</span>
                </div>
                ))}
            </div>
        </div>
         {resultValue !== undefined && (
            <p className="text-center text-lg font-bold mt-3 text-green-600 dark:text-green-400">Final LIS Length: {resultValue}</p>
        )}

      </CardContent>
    </Card>
  );
}
    