
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DPAlgorithmStep } from '@/types'; // Re-using DPAlgorithmStep

interface FloydWarshallVisualizationPanelProps {
  step: DPAlgorithmStep | null;
}

export function FloydWarshallVisualizationPanel({ step }: FloydWarshallVisualizationPanelProps) {
  if (!step || !step.dpTable || !Array.isArray(step.dpTable) || !Array.isArray(step.dpTable[0])) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Distance Matrix</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter graph data and start.</p></CardContent>
      </Card>
    );
  }

  const { dpTable, dpTableDimensions, highlightedCells, message, auxiliaryData, resultValue } = step;
  const numVertices = dpTableDimensions?.rows || dpTable.length; // Assuming square matrix for dist
  const currentK = auxiliaryData?.k; // Iteration k

  const getCellClass = (r: number, c: number) => {
    const highlight = highlightedCells?.find(cell => cell.row === r && cell.col === c);
    if (highlight) {
      if (highlight.type === 'current') return 'bg-accent text-accent-foreground scale-110 shadow-lg z-10'; // dist[i][j]
      if (highlight.type === 'dependency') return 'bg-primary/30 dark:bg-primary/40'; // dist[i][k] or dist[k][j]
    }
    if (r === c && dpTable[r][c] === 0) return 'bg-muted/50 text-muted-foreground'; // Diagonal base case
    if (r === currentK || c === currentK) return 'bg-blue-200 dark:bg-blue-800'; // Highlight current k row/column
    return 'bg-card text-card-foreground';
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Floyd-Warshall Distance Matrix</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {currentK !== undefined && <p className="text-sm font-semibold">Current Intermediate Vertex (k): {currentK}</p>}
        {auxiliaryData?.costCalculation && <p className="text-xs font-semibold">Path considered: {auxiliaryData.costCalculation}</p>}
        {resultValue === -1 && <p className="text-sm font-bold text-red-500">Negative Cycle Detected!</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto">
        {numVertices > 0 ? (
          <div className="overflow-auto flex-grow">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-1 border text-xs text-muted-foreground sticky top-0 bg-card z-20">i\\j</th>
                  {Array.from({ length: numVertices }).map((_, j) => (
                    <th key={`col-h-${j}`} className="p-1 border text-xs text-muted-foreground sticky top-0 bg-card z-20">{j}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(dpTable as number[][]).map((row, i) => (
                  <tr key={`row-${i}`}>
                    <td className="p-1 border text-xs text-muted-foreground sticky left-0 bg-card z-10">{i}</td>
                    {row.map((cellValue, j) => (
                      <td
                        key={`cell-${i}-${j}`}
                        className={`p-1 border text-center text-xs min-w-[35px] ${getCellClass(i, j)} transition-all duration-150`}
                        title={`dist[${i}][${j}] = ${cellValue === Infinity ? '∞' : cellValue}`}
                      >
                        {cellValue === Infinity ? '∞' : cellValue}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
            <p className="text-muted-foreground self-center">Initialize graph to see distance matrix.</p>
        )}
      </CardContent>
    </Card>
  );
}
