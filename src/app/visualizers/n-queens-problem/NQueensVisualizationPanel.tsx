
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NQueensStep } from './types'; // Local import
import { Target } from 'lucide-react'; // Using Target as a placeholder for Queen

interface NQueensVisualizationPanelProps {
  step: NQueensStep | null;
  boardSize?: number; // N from N-Queens, optional as step.board will also have it
}

export function NQueensVisualizationPanel({ step, boardSize }: NQueensVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">N-Queens Board</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter board size (N) and start simulation.</p></CardContent>
      </Card>
    );
  }

  const { board, currentQueen, message } = step;
  const N = boardSize && boardSize > 0 ? boardSize : (board.length > 0 ? board.length : 4); // Fallback for board size

  // Dynamically calculate cell size
  const panelWidth = 400; // Fixed width for the panel content area
  const cellSize = Math.max(20, Math.floor((panelWidth - (N + 1) * 2) / N)); // Ensure some minimum size

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">N-Queens Board ({N}x{N})</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-muted/10 dark:bg-muted/5 p-2 md:p-4 rounded-b-lg">
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
          {board.map((rowArr, rowIndex) =>
            rowArr.map((cell, colIndex) => {
              const isLightSquare = (rowIndex + colIndex) % 2 === 0;
              let cellBgColor = isLightSquare ? "bg-card" : "bg-muted";
              let queenColor = "text-primary dark:text-accent";

              if (currentQueen) {
                if (currentQueen.row === rowIndex && currentQueen.col === colIndex) {
                  if (currentQueen.action === 'place') cellBgColor = "bg-green-500/30";
                  else if (currentQueen.action === 'remove') cellBgColor = "bg-red-500/30";
                  else if (currentQueen.action === 'checking_safe') cellBgColor = "bg-yellow-500/30";
                }
              }
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`flex items-center justify-center border border-border/50 ${cellBgColor}`}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                >
                  {cell === 1 && (
                     <Target className="w-3/4 h-3/4" style={{ color: queenColor }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
