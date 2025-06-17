
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DPAlgorithmStep } from '@/types'; // Use specific DPAlgorithmStep
import { Badge } from "@/components/ui/badge";

interface KnapsackVisualizationPanelProps {
  step: DPAlgorithmStep | null;
}

export function KnapsackVisualizationPanel({ step }: KnapsackVisualizationPanelProps) {
  if (!step || !step.dpTable || !Array.isArray(step.dpTable) || !Array.isArray(step.dpTable[0])) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">0/1 Knapsack DP Table</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter items and capacity, then click "Solve".</p></CardContent>
      </Card>
    );
  }

  const { dpTable, dpTableDimensions, highlightedCells, message, auxiliaryData, resultValue, selectedItems } = step;
  const numRows = dpTableDimensions?.rows || dpTable.length;
  const numCols = dpTableDimensions?.cols || (dpTable[0] as number[]).length;

  const items = auxiliaryData?.items as {weight: number, value: number}[] || [];

  const getCellClass = (r: number, c: number) => {
    const highlight = highlightedCells?.find(cell => cell.row === r && cell.col === c);
    if (highlight) {
      if (highlight.type === 'current') return 'bg-accent text-accent-foreground scale-110 shadow-lg z-10';
      if (highlight.type === 'dependency') return 'bg-primary/30 dark:bg-primary/40';
      if (highlight.type === 'result') return 'bg-green-500/80 text-white';
    }
    if (r === 0 || c === 0) return 'bg-muted/50 text-muted-foreground'; // Base case cells
    return 'bg-card text-card-foreground';
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">0/1 Knapsack DP Table</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {auxiliaryData?.currentDecision && <p className="text-xs font-semibold">Decision: {auxiliaryData.currentDecision}</p>}
        {resultValue !== undefined && <p className="text-sm font-bold">Max Value: {resultValue}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto">
        <div className="overflow-auto flex-grow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="p-1 border text-xs text-muted-foreground sticky top-0 bg-card z-20">Item (w,v)</th>
                {Array.from({ length: numCols }, (_, j) => (
                  <th key={`col-h-${j}`} className="p-1 border text-xs text-muted-foreground sticky top-0 bg-card z-20">W={j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(dpTable as number[][]).map((row, i) => (
                <tr key={`row-${i}`}>
                  <td className="p-1 border text-xs text-muted-foreground sticky left-0 bg-card z-10">
                    {i === 0 ? 'None' : `Item ${i} (${items[i-1]?.weight}, ${items[i-1]?.value})`}
                  </td>
                  {row.map((cellValue, j) => (
                    <td
                      key={`cell-${i}-${j}`}
                      className={`p-1 border text-center text-xs min-w-[30px] ${getCellClass(i, j)} transition-all duration-150`}
                      title={`dp[${i}][${j}] = ${cellValue}`}
                    >
                      {cellValue}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedItems && selectedItems.length > 0 && (
          <div className="mt-4 p-2 border rounded-md bg-background shadow">
            <p className="text-sm font-semibold">Selected Items for Max Value:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedItems.map((item, idx) => (
                <Badge key={`sel-${idx}`} variant="secondary">W:{item.weight}, V:{item.value}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    