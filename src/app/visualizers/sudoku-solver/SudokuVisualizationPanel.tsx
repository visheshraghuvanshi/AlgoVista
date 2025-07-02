
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SudokuStep } from './types'; // Local import
import { cn } from '@/lib/utils';

interface SudokuVisualizationPanelProps {
  step: SudokuStep | null;
}

export function SudokuVisualizationPanel({ step }: SudokuVisualizationPanelProps) {
  if (!step || !step.board) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Sudoku Board</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter puzzle and start solving.</p></CardContent>
      </Card>
    );
  }

  const { board, currentCell, message, isSafe, initialBoard, solutionFound } = step;
  const N = 9; 

  const panelWidth = 400; 
  const cellSize = Math.max(24, Math.floor((panelWidth - (N + 1) * 1 - 2 * 2) / N));

  const getCellClasses = (r: number, c: number) => {
    const baseColor = (Math.floor(r/3) + Math.floor(c/3)) % 2 === 0 
      ? 'bg-card' 
      : 'bg-muted/40';
    
    let highlightRing = '';
    
    if (currentCell && currentCell.row === r && currentCell.col === c) {
      switch(currentCell.action) {
        case 'find_empty':
          highlightRing = 'ring-2 ring-offset-1 ring-offset-background ring-blue-500'; // Finding next empty cell
          break;
        case 'try_num':
        case 'check_safe':
          highlightRing = isSafe === undefined 
            ? 'ring-2 ring-offset-1 ring-offset-background ring-yellow-500' // Trying/Checking
            : (isSafe ? 'ring-2 ring-offset-1 ring-offset-background ring-green-500' // Safe check result
                      : 'ring-2 ring-offset-1 ring-offset-background ring-red-500');  // Unsafe check result
          break;
        case 'place_num':
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
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Sudoku Board</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-muted/10 dark:bg-muted/5 p-2 md:p-4 rounded-b-lg">
        <div className="grid grid-cols-9 gap-px bg-border/50 border-2 border-foreground/50 shadow-lg" style={{ width: N * (cellSize + 1), height: N * (cellSize + 1)}}>
          {board.map((row, rIdx) =>
            row.map((cellValue, cIdx) => {
              const isThickRightBorder = (cIdx + 1) % 3 === 0 && cIdx < N - 1;
              const isThickBottomBorder = (rIdx + 1) % 3 === 0 && rIdx < N - 1;
              
              let cellClasses = getCellClasses(rIdx, cIdx);
              if (isThickRightBorder) cellClasses += " border-r-2 border-foreground/50";
              if (isThickBottomBorder) cellClasses += " border-b-2 border-foreground/50";
              
              let textColorClass = "text-foreground";
              if (initialBoard && initialBoard[rIdx][cIdx] !== 0) {
                textColorClass = "font-bold text-foreground/80 dark:text-foreground/90";
              } else if (cellValue !== 0) {
                 textColorClass = solutionFound ? "text-green-600 dark:text-green-400" : "text-primary dark:text-accent"; // Guessed numbers
              }

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={cn(cellClasses, 'text-lg')}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  title={`Cell [${rIdx},${cIdx}]`}
                >
                   <span className={textColorClass}>
                    {cellValue !== 0 ? cellValue : ''}
                   </span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
