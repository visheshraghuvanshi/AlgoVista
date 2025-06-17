
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PriorityQueueStep, PriorityQueueItem } from '@/types';
import { Badge } from "@/components/ui/badge";

interface PriorityQueueVisualizationPanelProps {
  step: PriorityQueueStep | null;
}

const ELEMENT_WIDTH = 70; // Wider to show value & priority
const ELEMENT_HEIGHT = 40;
const ELEMENT_MARGIN = 5;

export function PriorityQueueVisualizationPanel({ step }: PriorityQueueVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Priority Queue</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Initialize or perform an operation.</p></CardContent>
      </Card>
    );
  }

  const { heapArray, operation, processedItem, message, activeHeapIndices } = step;

  // Simple array representation for now (heap visualization can be complex)
  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Priority Queue (Min-Heap Array)</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
         {processedItem && (
            <p className="text-xs text-muted-foreground">
                Last Processed: Value: {processedItem.value}, Priority: {processedItem.priority}
            </p>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-start bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg overflow-auto">
        {heapArray.length === 0 ? (
          <p className="text-muted-foreground self-center">Priority Queue is empty.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {heapArray.map((item, index) => {
              const isActive = activeHeapIndices?.includes(index);
              return (
                <div
                  key={`pq-item-${index}`}
                  className={`flex flex-col items-center justify-center rounded text-xs font-medium transition-all duration-300 ease-in-out
                              border-2 p-1
                              ${isActive ? 'border-primary scale-105 shadow-lg bg-primary/20' : 'border-secondary bg-card'}`}
                  style={{
                    minWidth: `${ELEMENT_WIDTH}px`,
                    height: `${ELEMENT_HEIGHT}px`,
                    margin: `${ELEMENT_MARGIN}px`,
                  }}
                  title={`Index: ${index}`}
                >
                  <Badge variant={isActive ? "default" : "secondary"} className="text-xs mb-0.5">P: {item.priority}</Badge>
                  <span>V: {String(item.value)}</span>
                </div>
              );
            })}
          </div>
        )}
         <p className="text-xs text-muted-foreground mt-auto pt-2">
            Note: Visualized as an array representing a Min-Heap. Index 0 is the root (highest priority).
        </p>
      </CardContent>
    </Card>
  );
}
