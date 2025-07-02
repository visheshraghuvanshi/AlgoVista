
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RatInAMazeStep } from './types'; // Local import
import { Target, Mouse } from 'lucide-react'; 
import { cn } from '@/lib/utils';

interface RatInAMazeVisualizationPanelProps {
  step: RatInAMazeStep | null;
}

export function RatInAMazeVisualizationPanel({ step }: RatInAMazeVisualizationPanelProps) {
  if (!step || !step.maze) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Rat in a Maze</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter maze and start solving.</p></CardContent>
      </Card>
    );
  }

  const { maze, currentPosition, action, message } = step;
  const N = maze.length;
  const M = N > 0 ? maze[0].length : 0;

  const panelWidth = 400; 
  const maxDimension = Math.max(N, M, 1); 
  const cellSize = Math.max(16, Math.floor((panelWidth - (maxDimension + 1) * 1 - 2 * 2) / maxDimension));

  const getCellClasses = (cellValue: number, r: number, c: number) => {
    // Base chessboard colors for a more classic look
    const baseColor = (r + c) % 2 === 0 
      ? 'bg-stone-100 dark:bg-stone-700/60' 
      : 'bg-stone-300 dark:bg-stone-800/80';
    
    let highlightRing = '';
    
    // Highlight based on the algorithm's action using a ring outline
    if (currentPosition && currentPosition.row === r && currentPosition.col === c) {
        highlightRing = 'ring-2 ring-offset-1 ring-offset-background ring-blue-500'; // Default for trying
        if (action === 'backtrack') highlightRing = 'ring-2 ring-offset-1 ring-offset-background ring-orange-500';
        if (action === 'goal_reached') highlightRing = 'ring-2 ring-offset-1 ring-offset-background ring-green-500';
        if (action === 'stuck') highlightRing = 'ring-2 ring-offset-1 ring-offset-background ring-red-500';
    }

    if (cellValue === 0) return cn('flex items-center justify-center bg-slate-700 dark:bg-slate-900', highlightRing); // Wall
    if (cellValue === 2) return cn('flex items-center justify-center bg-green-500/50 dark:bg-green-600/50', highlightRing); // Path
    
    return cn('flex items-center justify-center transition-all duration-200', baseColor, highlightRing);
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Rat in a Maze ({N}x{M})</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-muted/10 dark:bg-muted/5 p-2 md:p-4 rounded-b-lg">
        {N > 0 && M > 0 ? (
          <div className="grid gap-px bg-border border-2 border-foreground/50" style={{ gridTemplateColumns: `repeat(${M}, minmax(0, 1fr))` }}>
            {maze.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isThickRightBorder = (cIdx + 1) % 3 === 0 && cIdx < M - 1;
                const isThickBottomBorder = (rIdx + 1) % 3 === 0 && rIdx < N - 1;
                
                let cellClasses = getCellClasses(cell, rIdx, cIdx);
                // Subgrid borders (like sudoku)
                // if (isThickRightBorder) cellClasses += " border-r-2 border-foreground/50";
                // if (isThickBottomBorder) cellClasses += " border-b-2 border-foreground/50";

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={cellClasses}
                    style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                    title={`Cell [${rIdx},${cIdx}]`}
                  >
                    {rIdx === N - 1 && cIdx === M - 1 && maze[rIdx][cIdx] !== 0 && (
                      <Target className="w-3/4 h-3/4 text-red-500" />
                    )}
                    {currentPosition && currentPosition.row === rIdx && currentPosition.col === cIdx && (
                      <Mouse className="w-3/4 h-3/4 text-primary dark:text-accent" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">Invalid maze dimensions.</p>
        )}
      </CardContent>
    </Card>
  );
}
