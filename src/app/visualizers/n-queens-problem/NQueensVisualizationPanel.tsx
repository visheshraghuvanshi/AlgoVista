
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NQueensStep } from './types'; // Local import
import { Target, X } from 'lucide-react'; 

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

  const { board, currentCell, message } = step;
  const N = board.length > 0 ? board.length : 4; // Fallback for board size

  const panelWidth = 400; 
  const cellSize = Math.max(20, Math.floor((panelWidth - (N + 1) * 2) / N));

  const getCellBgColor = (r: number, c: number) => {
    let bgColor = (r + c) % 2 === 0 ? "bg-card" : "bg-muted";
    if (currentCell) {
        if (currentCell.row === r && currentCell.col === c) {
            switch(currentCell.action) {
                case 'try_move':
                    bgColor = "bg-blue-400/30 dark:bg-blue-600/30";
                    break;
                case 'checking_safe':
                    bgColor = "bg-yellow-400/40 dark:bg-yellow-600/40";
                    break;
                case 'place':
                    bgColor = "bg-green-500/30 dark:bg-green-600/30";
                    break;
                case 'remove':
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
      <CardContent className="flex-grow flex items-center justify-center bg-muted/10 dark:bg-muted/5 p-2 md:p-4 rounded-b-lg">
        {N > 0 ? (
          <div className="grid gap-0.5 bg-border border-2 border-foreground/50" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
            {board.map((rowArr, rIdx) =>
              rowArr.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`flex items-center justify-center ${getCellBgColor(rIdx, cIdx)}`}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  title={`Cell [${rIdx},${cIdx}]`}
                >
                  {cell === 1 && (
                     <Target className="w-3/4 h-3/4 text-primary dark:text-accent" />
                  )}
                  {/* Visualization for conflicts or checks can be added here */}
                  {currentCell && currentCell.row === rIdx && currentCell.col === cIdx && currentCell.action === 'checking_safe' && !step.isSafe && (
                      <X className="w-1/2 h-1/2 text-destructive opacity-80" />
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">Invalid board size.</p>
        )}
      </CardContent>
    </Card>
  );
}

