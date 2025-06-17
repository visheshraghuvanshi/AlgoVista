
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SudokuStep } from '@/types';

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

  const { board, currentCell, message, isSafe } = step;
  const N = 9; // Sudoku is 9x9

  const panelWidth = 400; 
  const cellSize = Math.max(24, Math.floor((panelWidth - (N + 1) * 1 - 2 * 2) / N)); // 1px gap, 2px borders thick

  const getCellBgColor = (r: number, c: number) => {
    if (currentCell) {
      if (currentCell.row === r && currentCell.col === c) {
        if (currentCell.action === 'find_empty') return "bg-blue-400/30 dark:bg-blue-600/30";
        if (currentCell.action === 'try_num' || currentCell.action === 'check_safe') return "bg-yellow-400/40 dark:bg-yellow-600/40";
        if (currentCell.action === 'place_num') return isSafe ? "bg-green-400/40 dark:bg-green-600/40" : "bg-red-400/40 dark:bg-red-600/40"; // Red if !isSafe
        if (currentCell.action === 'backtrack_remove') return "bg-orange-400/40 dark:bg-orange-600/40";
      }
    }
    const blockRow = Math.floor(r / 3);
    const blockCol = Math.floor(c / 3);
    return (blockRow + blockCol) % 2 === 0 ? "bg-card" : "bg-muted/50";
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Sudoku Board</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-muted/10 dark:bg-muted/5 p-2 md:p-4 rounded-b-lg">
        <div className="grid grid-cols-9 gap-px bg-border border-2 border-foreground/50" style={{ width: N * cellSize + (N/3 -1)*2 + 2, height: N * cellSize + (N/3-1)*2 +2}}>
          {board.map((rowArr, rIdx) =>
            rowArr.map((cellValue, cIdx) => {
              const isThickRightBorder = (cIdx + 1) % 3 === 0 && cIdx < N - 1;
              const isThickBottomBorder = (rIdx + 1) % 3 === 0 && rIdx < N - 1;
              
              let cellClasses = `flex items-center justify-center font-bold text-lg ${getCellBgColor(rIdx, cIdx)}`;
              if (isThickRightBorder) cellClasses += " border-r-2 border-foreground/50";
              if (isThickBottomBorder) cellClasses += " border-b-2 border-foreground/50";
              if (currentCell && currentCell.row === rIdx && currentCell.col === cIdx && currentCell.num !== undefined) {
                 // If current cell and a number is being tried/placed
                cellClasses += currentCell.action === 'place_num' && isSafe ? " text-green-600 dark:text-green-400" : (currentCell.action === 'place_num' && !isSafe ? " text-red-600 dark:text-red-400" : " text-blue-600 dark:text-blue-400");
              } else if (cellValue !== 0 && step.initialBoard && step.initialBoard[rIdx][cIdx] !== 0) {
                cellClasses += " text-foreground/70"; // Original numbers slightly dimmer
              } else if (cellValue !==0) {
                cellClasses += " text-primary dark:text-accent"; // Guessed numbers
              }


              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={cellClasses}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  title={`Cell [${rIdx},${cIdx}] - Value: ${cellValue === 0 ? 'Empty' : cellValue}`}
                >
                  {cellValue !== 0 ? cellValue : (currentCell && currentCell.row === rIdx && currentCell.col === cIdx && currentCell.num !== undefined ? currentCell.num : "")}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

    