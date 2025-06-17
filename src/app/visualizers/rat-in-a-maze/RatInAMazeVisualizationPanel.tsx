
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RatInAMazeStep } from '@/types';
import { Target, Mouse } from 'lucide-react'; // Using Mouse for rat, Target for goal

interface RatInAMazeVisualizationPanelProps {
  step: RatInAMazeStep | null;
}

export function RatInAMazeVisualizationPanel({ step }: RatInAMazeVisualizationPanelProps) {
  if (!step || !step.maze) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Rat in a Maze</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter maze and start.</p></CardContent>
      </Card>
    );
  }

  const { maze, currentPosition, action, message } = step;
  const N = maze.length;
  const M = N > 0 ? maze[0].length : 0;

  // Dynamically calculate cell size based on panel width and maze dimensions
  const panelWidth = 400; // Approximate width available
  const maxDimension = Math.max(N, M, 1); // Avoid division by zero
  const cellSize = Math.max(16, Math.floor((panelWidth - (maxDimension + 1) * 1) / maxDimension)); // 1px gap

  const getCellBgColor = (cellValue: number, r: number, c: number) => {
    if (currentPosition && currentPosition.row === r && currentPosition.col === c) {
      if (action === 'try_move' || action === 'mark_path') return "bg-yellow-400/40 dark:bg-yellow-600/40"; // Trying or on path
      if (action === 'backtrack') return "bg-orange-400/40 dark:bg-orange-600/40"; // Backtracking from here
      if (action === 'stuck') return "bg-red-400/40 dark:bg-red-600/40"; // Stuck
    }
    if (cellValue === 0) return "bg-slate-700 dark:bg-slate-800"; // Wall
    if (cellValue === 2) return "bg-green-500/70 dark:bg-green-600/70"; // Path
    return "bg-card"; // Open path (1)
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Rat in a Maze ({N}x{M})</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-muted/10 dark:bg-muted/5 p-2 md:p-4 rounded-b-lg">
        {N > 0 && M > 0 ? (
          <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `repeat(${M}, minmax(0, 1fr))` }}>
            {maze.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`flex items-center justify-center ${getCellBgColor(cell, rIdx, cIdx)}`}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  title={`Cell [${rIdx},${cIdx}] - Value: ${cell}`}
                >
                  {rIdx === N - 1 && cIdx === M - 1 && maze[rIdx][cIdx] !== 0 && (
                    <Target className="w-3/4 h-3/4 text-red-500" />
                  )}
                  {currentPosition && currentPosition.row === rIdx && currentPosition.col === cIdx && (
                    <Mouse className="w-3/4 h-3/4 text-primary dark:text-accent" />
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">Invalid maze dimensions.</p>
        )}
      </CardContent>
    </Card>
  );
}
