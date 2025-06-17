
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StackQueueAlgorithmStep } from './stack-queue-logic';

const ELEMENT_WIDTH = 50;
const ELEMENT_HEIGHT = 30;
const ELEMENT_MARGIN_Y = 5; // Vertical margin for stack
const ELEMENT_MARGIN_X = 5; // Horizontal margin for queue
const PANEL_PADDING = 20;
const MAX_VISIBLE_ELEMENTS = 10; // Limit visible elements for performance/display

interface StackQueueVisualizationPanelProps {
  step: StackQueueAlgorithmStep | null;
  structureType: 'stack' | 'queue';
}

export function StackQueueVisualizationPanel({ step, structureType }: StackQueueVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Visualization</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">No operation selected or no steps.</p></CardContent>
      </Card>
    );
  }

  const { array: data, topIndex, frontIndex, rearIndex, activeIndices, lastOperation, processedValue } = step;
  
  const visibleData = data.slice(-MAX_VISIBLE_ELEMENTS); // Show last N elements for stack
  const visibleTopIndex = topIndex !== undefined && topIndex >= data.length - MAX_VISIBLE_ELEMENTS 
                          ? topIndex - (data.length - visibleData.length) 
                          : (visibleData.length > 0 ? visibleData.length -1 : -1);


  const renderStack = () => (
    <div className="flex flex-col-reverse items-center justify-start w-full h-full pt-4 overflow-y-auto">
      {visibleData.length === 0 && <p className="text-muted-foreground">Stack is empty</p>}
      {visibleData.map((value, index) => {
        const originalIndex = data.length - visibleData.length + index; // Map back to original array index for highlighting
        const isActive = activeIndices?.includes(originalIndex);
        const isTop = originalIndex === topIndex;
        
        return (
          <div
            key={`stack-el-${originalIndex}`}
            className={`flex items-center justify-center rounded text-sm font-medium transition-all duration-300 ease-in-out
                        border-2
                        ${isActive ? 'border-primary scale-105 shadow-lg' : 'border-secondary'}
                        ${isTop ? 'bg-accent text-accent-foreground' : 'bg-card text-card-foreground'}`}
            style={{
              width: `${ELEMENT_WIDTH * 1.5}px`,
              height: `${ELEMENT_HEIGHT}px`,
              marginBottom: `${ELEMENT_MARGIN_Y}px`,
              opacity: 1,
            }}
            title={`Value: ${value}${isTop ? ' (Top)' : ''}`}
          >
            {value}
          </div>
        );
      })}
      {visibleData.length > 0 && (
         <div className="text-xs text-muted-foreground mt-2">Top &rarr;</div>
      )}
    </div>
  );

  const renderQueue = () => (
    <div className="flex items-center justify-start w-full h-full px-4 overflow-x-auto">
      {data.length === 0 && <p className="text-muted-foreground">Queue is empty</p>}
      {data.map((value, index) => {
         const isActive = activeIndices?.includes(index);
         const isFront = index === frontIndex;
         const isRear = index === rearIndex;
        return (
          <div
            key={`queue-el-${index}`}
            className={`flex items-center justify-center rounded text-sm font-medium transition-all duration-300 ease-in-out
                        border-2
                        ${isActive ? 'border-primary scale-105 shadow-lg' : 'border-secondary'}
                        ${isFront ? 'bg-accent text-accent-foreground' : isRear ? 'bg-primary/70 text-primary-foreground' : 'bg-card text-card-foreground'}`}
            style={{
              minWidth: `${ELEMENT_WIDTH}px`, // minWidth for queue elements
              height: `${ELEMENT_HEIGHT}px`,
              marginRight: `${ELEMENT_MARGIN_X}px`,
            }}
            title={`Value: ${value}${isFront ? ' (Front)' : ''}${isRear ? ' (Rear)' : ''}`}
          >
            {value}
          </div>
        );
      })}
      {data.length > 0 && (
        <>
          <div className="text-xs text-muted-foreground ml-2">&larr; Front</div>
          <div className="text-xs text-muted-foreground mx-2">|</div>
          <div className="text-xs text-muted-foreground">Rear &rarr;</div>
        </>
      )}
    </div>
  );

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">
          {structureType === 'stack' ? 'Stack Visualization' : 'Queue Visualization'}
        </CardTitle>
        {step.message && <p className="text-xs text-muted-foreground">{step.message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-muted/10 dark:bg-muted/5 p-2 rounded-b-lg relative">
        {structureType === 'stack' ? renderStack() : renderQueue()}
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
