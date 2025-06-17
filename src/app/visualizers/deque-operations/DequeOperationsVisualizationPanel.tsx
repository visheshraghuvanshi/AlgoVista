
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DequeAlgorithmStep } from './deque-logic'; // Assuming this type exists

const ELEMENT_WIDTH = 50;
const ELEMENT_HEIGHT = 30;
const ELEMENT_MARGIN_X = 5;
const PANEL_PADDING = 20;

interface DequeOperationsVisualizationPanelProps {
  step: DequeAlgorithmStep | null;
}

export function DequeOperationsVisualizationPanel({ step }: DequeOperationsVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Deque Visualization</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">No operation selected or no steps.</p></CardContent>
      </Card>
    );
  }

  const { array: data, frontIndex, rearIndex, activeIndices, lastOperation, processedValue } = step;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Deque Visualization</CardTitle>
        {step.message && <p className="text-xs text-muted-foreground">{step.message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg relative overflow-x-auto">
        <div className="flex items-center justify-start min-w-max">
          {data.length === 0 && <p className="text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Deque is empty</p>}
          {data.map((value, index) => {
            const isActive = activeIndices?.includes(index);
            const isFront = index === frontIndex;
            const isRear = index === rearIndex;
            
            let bgColor = "bg-card text-card-foreground";
            if(isFront && isRear) bgColor = "bg-purple-500 text-white"; // Single element
            else if(isFront) bgColor = "bg-accent text-accent-foreground";
            else if(isRear) bgColor = "bg-primary/80 text-primary-foreground";

            return (
              <div
                key={`deque-el-${index}`}
                className={`flex items-center justify-center rounded text-sm font-medium transition-all duration-300 ease-in-out
                            border-2
                            ${isActive ? 'border-primary scale-105 shadow-lg' : 'border-secondary'}
                            ${bgColor}`}
                style={{
                  minWidth: `${ELEMENT_WIDTH}px`,
                  height: `${ELEMENT_HEIGHT}px`,
                  marginRight: `${ELEMENT_MARGIN_X}px`,
                }}
                title={`Value: ${value}${isFront ? ' (Front)' : ''}${isRear ? ' (Rear)' : ''}`}
              >
                {value}
              </div>
            );
          })}
        </div>
      </CardContent>
       {lastOperation && (
        <div className="p-2 text-center text-xs border-t bg-background/80">
          Last Operation: <span className="font-semibold text-primary dark:text-accent">{lastOperation}</span>
          {processedValue !== undefined && processedValue !== null && (
            <span> (Value: <span className="font-semibold">{processedValue.toString()}</span>)</span>
          )}
        </div>
      )}
    </Card>
  );
}
