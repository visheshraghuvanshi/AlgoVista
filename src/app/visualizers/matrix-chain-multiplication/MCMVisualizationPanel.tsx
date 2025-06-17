
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DPAlgorithmStep } from '@/types';

interface MCMVisualizationPanelProps {
  step: DPAlgorithmStep | null;
}

export function MCMVisualizationPanel({ step }: MCMVisualizationPanelProps) {
  if (!step || !step.dpTable || !Array.isArray(step.dpTable) || !Array.isArray(step.dpTable[0])) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">MCM DP Table</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter dimensions and start.</p></CardContent>
      </Card>
    );
  }

  const { dpTable, dpTableDimensions, highlightedCells, message, auxiliaryData, resultValue } = step;
  const pArray = auxiliaryData?.pArray as number[] || [];
  const nMatrices = auxiliaryData?.nMatrices as number || 0;
  
  // DP table is 1-indexed for matrices A1...An
  const numRows = nMatrices + 1; 
  const numCols = nMatrices + 1;

  const getCellClass = (r: number, c: number) => {
    const highlight = highlightedCells?.find(cell => cell.row === r && cell.col === c);
    if (highlight) {
      if (highlight.type === 'current') return 'bg-accent text-accent-foreground scale-110 shadow-lg z-10';
      if (highlight.type === 'dependency') return 'bg-primary/30 dark:bg-primary/40';
      if (highlight.type === 'result') return 'bg-green-500/80 text-white';
    }
    if (r >= c) return 'bg-muted/30 text-muted-foreground'; // Lower triangle + diagonal are base cases (0 or invalid)
    return 'bg-card text-card-foreground';
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Matrix Chain Multiplication DP Table</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {auxiliaryData?.costCalculation && <p className="text-xs font-semibold">Cost Calc: {auxiliaryData.costCalculation}</p>}
        {resultValue !== undefined && <p className="text-sm font-bold">Min Multiplications: {resultValue}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto">
        <div className="overflow-auto flex-grow">
          {nMatrices > 0 ? (
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-1 border text-xs text-muted-foreground sticky top-0 bg-card z-20">i \ j</th>
                  {Array.from({ length: nMatrices }, (_, j) => (
                    <th key={`col-h-${j+1}`} className="p-1 border text-xs text-muted-foreground sticky top-0 bg-card z-20">A<sub>{j+1}</sub></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: nMatrices }).map((_, i_idx) => {
                  const i = i_idx + 1; // 1-based index
                  return (
                    <tr key={`row-${i}`}>
                      <td className="p-1 border text-xs text-muted-foreground sticky left-0 bg-card z-10">A<sub>{i}</sub></td>
                      {(dpTable as number[][])[i]?.map((cellValue, j_idx) => {
                        const j = j_idx; // dpTable is 0-indexed for array, but we use 1-indexed for meaning
                        if (j === 0) return null; // Skip 0th column as table is for 1..n
                        return (
                          <td
                            key={`cell-${i}-${j}`}
                            className={`p-1 border text-center text-xs min-w-[35px] ${getCellClass(i, j)} transition-all duration-150`}
                            title={`dp[${i}][${j}] = ${cellValue === Infinity ? '∞' : cellValue}`}
                          >
                            {cellValue === Infinity ? '∞' : (i >= j ? (i===j ? 0 : '-') : cellValue) }
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-muted-foreground self-center">Enter matrix dimensions to build table.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
    