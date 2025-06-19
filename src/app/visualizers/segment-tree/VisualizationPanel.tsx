
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlgorithmStep } from './types'; // Local import

interface VisualizationPanelProps {
  data: number[]; 
  activeIndices?: number[];
}

const ELEMENT_BOX_SIZE = 30; 
const ELEMENT_MARGIN = 4;

export function VisualizationPanel({ 
  data, 
  activeIndices = [],
}: VisualizationPanelProps) {
  
  const [maxVal, setMaxVal] = useState(1);

  useEffect(() => {
    if (data.length > 0) {
      const currentMaxVal = Math.max(...data.map(val => Math.abs(val)), 1); 
      setMaxVal(currentMaxVal);
    } else {
      setMaxVal(1); 
    }
  }, [data]);

  const getElementColor = (index: number) => {
    if (activeIndices.includes(index)) return "bg-primary text-primary-foreground"; 
    return "bg-secondary text-secondary-foreground"; 
  };
  
  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px]">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Segment Tree (Array Representation)</CardTitle>
      </CardHeader>
      <CardContent className="flex items-start justify-center h-full pt-10 space-x-1 overflow-x-auto bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg">
        {data.length === 0 ? (
          <p className="text-muted-foreground self-center">Build tree or perform operation.</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {data.map((value, index) => (
              <div
                key={`seg-tree-node-${index}`}
                className={`flex flex-col items-center justify-center rounded border text-xs font-medium transition-colors duration-150 ${getElementColor(index)}`}
                style={{
                  width: `${ELEMENT_BOX_SIZE * 1.5}px`, 
                  height: `${ELEMENT_BOX_SIZE}px`,
                  margin: `${ELEMENT_MARGIN}px`,
                }}
                title={`Tree[${index}] = ${value === Infinity ? '∞' : value}`}
              >
                <span className="text-muted-foreground text-[9px]">idx:{index}</span>
                <span>{value === Infinity ? '∞' : value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
