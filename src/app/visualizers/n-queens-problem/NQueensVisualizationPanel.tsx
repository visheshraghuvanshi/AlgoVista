
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NQueensStep } from './types'; // Local import
import { Crown, X } from 'lucide-react'; 

interface NQueensVisualizationPanelProps {
  step: NQueensStep | null;
}

export function NQueensVisualizationPanel({ step }: NQueensVisualizationPanelProps) {
  if (!step || !step.board) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">N-Queens Board</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter board size (N) and start simulation.</p></CardContent>
      </Card>
    );
  }

  const { board, currentCell, message, isSafe, auxiliaryData } = step;
  const N = board.length > 0 ? board.length : 4; 

  const panelWidth = 400; 
  const cellSize = Math.max(20, Math.floor((panelWidth - (N + 1) * 2) / N));

  const getCellBgColor = (r: number, c: number) => {
    let bgColor = (r + c) % 2 === 0 ? "bg-card" : "bg-muted";
    if (currentCell) {
        if (currentCell.row === r && currentCell.col === c) {
            switch(currentCell.action) {
                case 'try_place':
                    bgColor = "bg-blue-400/30 dark:bg-blue-600/30";
                    break;
                case 'check_safe':
                    bgColor = isSafe ? "bg-yellow-400/40 dark:bg-yellow-600/40" : "bg-red-400/40 dark:bg-red-600/40";
                    break;
                case 'place_safe':
                    bgColor = "bg-green-500/30 dark:bg-green-600/30";
                    break;
                case 'backtrack_remove':
                    bgColor = "bg-orange-500/30 dark:bg-orange-600/30";
                    break;
            }
        }
    }
    return bgColor;
  };
  

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">N-Queens Board ({N}x{N})</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center bg-muted/10 dark:bg-muted/5 p-2 md:p-4 rounded-b-lg">
        {N > 0 ? (
          <div className="grid gap-px bg-border border-2 border-foreground/50" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
            {board.map((rowArr, rIdx) =>
              rowArr.map((cell, cIdx) => {
                const isThickRightBorder = (cIdx + 1) % 3 === 0 && cIdx < N - 1 && N > 3;
                const isThickBottomBorder = (rIdx + 1) % 3 === 0 && rIdx < N - 1 && N > 3;
                
                let cellClasses = `flex items-center justify-center ${getCellBgColor(rIdx, cIdx)}`;
                if (isThickRightBorder) cellClasses += " border-r-2 border-foreground/50";
                if (isThickBottomBorder) cellClasses += " border-b-2 border-foreground/50";

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={cellClasses}
                    style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                    title={`Cell [${rIdx},${cIdx}]`}
                  >
                    {cell === 1 && (
                     <Crown className="w-3/4 h-3/4 text-primary dark:text-accent" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">Invalid board size.</p>
        )}
        {auxiliaryData && (
          <div className="w-full mt-2 text-xs font-mono text-center text-muted-foreground">
            <p>cols: {JSON.stringify(auxiliaryData.cols.map(b => b ? 1:0))}</p>
            <p>diag1: {JSON.stringify(auxiliaryData.diag1.map(b => b ? 1:0))}</p>
            <p>diag2: {JSON.stringify(auxiliaryData.diag2.map(b => b ? 1:0))}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    