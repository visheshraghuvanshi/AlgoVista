
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DPAlgorithmStep } from './types'; // Local import

interface EditDistanceVisualizationPanelProps {
  step: DPAlgorithmStep | null;
}

export function EditDistanceVisualizationPanel({ step }: EditDistanceVisualizationPanelProps) {
  if (!step || !step.dpTable || !Array.isArray(step.dpTable) || !Array.isArray(step.dpTable[0])) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Edit Distance DP Table</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter strings and start.</p></CardContent>
      </Card>
    );
  }

  const { dpTable, dpTableDimensions, highlightedCells, message, auxiliaryData, resultValue } = step;
  const str1 = auxiliaryData?.str1 as string || "";
  const str2 = auxiliaryData?.str2 as string || "";
  const numRows = dpTableDimensions?.rows || dpTable.length;
  const numCols = dpTableDimensions?.cols || (dpTable[0] as number[]).length;

  const getCellClass = (r: number, c: number) => {
    const highlight = highlightedCells?.find(cell => cell.row === r && cell.col === c);
    if (highlight) {
      if (highlight.type === 'current') return 'bg-accent text-accent-foreground scale-110 shadow-lg z-10';
      if (highlight.type === 'dependency') return 'bg-primary/30 dark:bg-primary/40';
      if (highlight.type === 'result') return 'bg-green-500/80 text-white';
    }
    if (r === 0 && c === 0) return 'bg-muted/30 text-muted-foreground'; // Top-left corner
    if (r === 0 || c === 0) return 'bg-muted/50 text-muted-foreground'; // Base case cells
    return 'bg-card text-card-foreground';
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Edit Distance DP Table</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {resultValue !== undefined && <p className="text-sm font-bold">Edit Distance: {resultValue}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto">
        <div className="overflow-auto flex-grow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="p-1 border text-xs text-muted-foreground sticky top-0 left-0 bg-card z-30">""</th>
                <th className="p-1 border text-xs text-muted-foreground sticky top-0 bg-card z-20">"" (s2)</th>
                {Array.from({ length: str2.length }, (_, j) => (
                  <th key={`col-h-${j}`} className="p-1 border text-xs text-muted-foreground sticky top-0 bg-card z-20 font-mono">{str2[j]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: str1.length + 1 }).map((_, i) => (
                <tr key={`row-${i}`}>
                  <td className="p-1 border text-xs text-muted-foreground sticky left-0 bg-card z-10 font-mono">
                    {i === 0 ? '"" (s1)' : str1[i-1]}
                  </td>
                  {(dpTable as number[][])[i]?.map((cellValue, j) => (
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
      </CardContent>
    </Card>
  );
}
    
