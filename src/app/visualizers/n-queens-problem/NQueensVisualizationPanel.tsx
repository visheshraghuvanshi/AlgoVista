
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NQueensStep } from './types';
import { Crown } from 'lucide-react'; 
import { cn } from '@/lib/utils';

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

  const { board, currentCell, isSafe, auxiliaryData } = step;
  const N = board.length > 0 ? board.length : 4; 

  const panelWidth = 400; 
  const cellSize = Math.max(20, Math.floor((panelWidth - (N + 1) * 2) / N));

  const getCellClasses = (r: number, c: number) => {
    // Base chessboard colors for a more classic look
    const baseColor = (r + c) % 2 === 0 
      ? 'bg-stone-100 dark:bg-stone-600' 
      : 'bg-stone-400 dark:bg-stone-800';
    
    let highlightRing = '';
    // Highlighting based on the algorithm's action using a ring outline
    if (currentCell && currentCell.row === r && currentCell.col === c) {
      switch(currentCell.action) {
        case 'try_place':
        case 'check_safe':
          highlightRing = isSafe === undefined 
            ? 'ring-2 ring-offset-1 ring-offset-background ring-blue-500' // Trying/Checking
            : (isSafe ? 'ring-2 ring-offset-1 ring-offset-background ring-yellow-400' // Safe check result
                      : 'ring-2 ring-offset-1 ring-offset-background ring-red-500');  // Unsafe check result
          break;
        case 'place_safe':
          highlightRing = 'ring-2 ring-offset-1 ring-offset-background ring-green-500'; // Placed
          break;
        case 'backtrack_remove':
          highlightRing = 'ring-2 ring-offset-1 ring-offset-background ring-orange-500'; // Backtracking
          break;
      }
    }
    return cn('flex items-center justify-center transition-all duration-200', baseColor, highlightRing);
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">N-Queens Board ({N}x{N})</CardTitle>
        {step.message && <p className="text-xs text-muted-foreground">{step.message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-muted/10 dark:bg-muted/5 p-2 md:p-4 rounded-b-lg">
        {N > 0 ? (
          <div className="grid gap-px bg-border shadow-lg" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
            {board.map((rowArr, rIdx) =>
              rowArr.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={getCellClasses(rIdx, cIdx)}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  title={`Cell [${rIdx},${cIdx}]`}
                >
                  {cell === 1 && (
                   <Crown className="w-5/6 h-5/6 text-yellow-400" stroke="black" strokeWidth={1} />
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">Invalid board size.</p>
        )}
      </CardContent>
       {step.auxiliaryData && (
          <div className="w-full text-xs font-mono text-center text-muted-foreground p-2 border-t">
            <p><strong>Attacked Columns:</strong> {JSON.stringify(step.auxiliaryData.cols.map(b => b ? 1:0))}</p>
            <p><strong>Attacked Diag1 (/):</strong> {JSON.stringify(step.auxiliaryData.diag1.map(b => b ? 1:0))}</p>
            <p><strong>Attacked Diag2 (\\):</strong> {JSON.stringify(step.auxiliaryData.diag2.map(b => b ? 1:0))}</p>
          </div>
        )}
    </Card>
  );
}
