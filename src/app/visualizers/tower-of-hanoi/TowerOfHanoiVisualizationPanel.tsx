
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TowerOfHanoiStep } from './tower-of-hanoi-logic';

interface TowerOfHanoiVisualizationPanelProps {
  step: TowerOfHanoiStep | null;
}

const PEG_WIDTH = 20;
const PEG_BASE_HEIGHT = 20;
const DISK_HEIGHT = 20;
const MIN_DISK_WIDTH = 40;
const DISK_WIDTH_STEP = 15;
const PEG_SPACING = 150;
const SVG_PADDING_Y = 40;
const SVG_PADDING_X = 50;

export function TowerOfHanoiVisualizationPanel({ step }: TowerOfHanoiVisualizationPanelProps) {
  if (!step || !step.pegStates) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Tower of Hanoi</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter number of disks and start simulation.</p></CardContent>
      </Card>
    );
  }

  const { pegStates, numDisks, lastMove, message } = step;
  const pegNames = ['A', 'B', 'C'];
  const maxPegHeight = (numDisks * DISK_HEIGHT) + PEG_BASE_HEIGHT + 20; // Extra space for disk on top
  const svgHeight = maxPegHeight + SVG_PADDING_Y * 2;
  const svgWidth = SVG_PADDING_X * 2 + PEG_SPACING * (pegNames.length -1) + PEG_WIDTH;


  const diskColors = [
    "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", 
    "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--ring))",
    "hsl(var(--primary))", "hsl(var(--secondary))"
  ];


  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Tower of Hanoi</CardTitle>
         {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-muted/10 dark:bg-muted/5 p-2 rounded-b-lg relative">
        <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet">
          {/* Peg Bases */}
          {pegNames.map((pegName, index) => (
            <rect
              key={`base-${pegName}`}
              x={SVG_PADDING_X + index * PEG_SPACING - (PEG_WIDTH * 2)}
              y={svgHeight - SVG_PADDING_Y - PEG_BASE_HEIGHT}
              width={PEG_WIDTH * 5}
              height={PEG_BASE_HEIGHT}
              fill="hsl(var(--border))"
              rx="3"
            />
          ))}
          {pegNames.map((pegName, index) => {
            const pegX = SVG_PADDING_X + index * PEG_SPACING + (PEG_WIDTH / 2);
            const disksOnPeg = pegStates[pegName] || [];
            
            return (
              <g key={`peg-group-${pegName}`}>
                {/* Peg Pole */}
                <line
                  x1={pegX}
                  y1={svgHeight - SVG_PADDING_Y - PEG_BASE_HEIGHT}
                  x2={pegX}
                  y2={SVG_PADDING_Y}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Disks */}
                {disksOnPeg.map((diskSize, diskIndex) => {
                  const diskWidth = MIN_DISK_WIDTH + (diskSize - 1) * DISK_WIDTH_STEP;
                  const diskY = svgHeight - SVG_PADDING_Y - PEG_BASE_HEIGHT - (diskIndex + 1) * DISK_HEIGHT;
                  const isBeingMoved = lastMove && lastMove.disk === diskSize && (lastMove.fromPeg === pegName || lastMove.toPeg === pegName);
                  
                  return (
                    <rect
                      key={`disk-${pegName}-${diskSize}`}
                      x={pegX - diskWidth / 2}
                      y={diskY}
                      width={diskWidth}
                      height={DISK_HEIGHT - 2} // Small gap between disks
                      fill={diskColors[diskSize % diskColors.length]}
                      stroke={isBeingMoved ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth={isBeingMoved ? 2 : 1}
                      rx="2"
                      className={isBeingMoved ? "animate-pulse" : ""}
                    />
                  );
                })}
                 {/* Peg Label */}
                <text x={pegX} y={svgHeight - SVG_PADDING_Y/2} textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))">
                    {pegName}
                </text>
              </g>
            );
          })}
        </svg>
      </CardContent>
    </Card>
  );
}

