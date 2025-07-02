
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VisualizationPanelProps } from './types';
import { Badge } from '@/components/ui/badge';

const ELEMENT_BOX_SIZE = 40; 
const ELEMENT_MARGIN = 4;

const InputArrayElement = ({ value, index, isHighlighted }: { value: number, index: number, isHighlighted: boolean }) => (
  <div
    className={`flex flex-col items-center justify-center rounded border text-xs font-medium 
                ${isHighlighted ? "bg-accent text-accent-foreground ring-2 ring-accent" : "bg-secondary text-secondary-foreground"}`}
    style={{ width: `${ELEMENT_BOX_SIZE * 1.2}px`, height: `${ELEMENT_BOX_SIZE}px` }}
    title={`Input[${index}] = ${value}`}
  >
    <span className="text-muted-foreground text-[9px]">{index}</span>
    <span>{value}</span>
  </div>
);

const BitArrayElement = ({ value, index, isHighlighted, lsb, binary }: { value: number, index: number, isHighlighted: boolean, lsb?: number, binary?: string }) => (
  <div
    className={`flex flex-col items-center justify-center rounded border-2 text-xs font-medium transition-all duration-150
                ${isHighlighted ? "bg-primary text-primary-foreground scale-110 shadow-lg border-primary" : "bg-card text-card-foreground border-border"}`}
    style={{ width: `${ELEMENT_BOX_SIZE * 1.5}px`, minHeight: `${ELEMENT_BOX_SIZE * 1.2}px`, padding: '2px' }}
    title={`BIT[${index}] = ${value}\nBinary: ${binary}\nLSB: ${lsb}`}
  >
    <span className="text-muted-foreground text-[9px]">{index}</span>
    <span className="font-bold text-sm">{value}</span>
  </div>
);


export function BITVisualizationPanel({ 
  data, 
  activeIndices = [],
  originalInputArray = [],
  auxiliaryData,
}: VisualizationPanelProps) {

  const tree = data;
  const n = originalInputArray.length;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">BIT Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-2 space-y-4 bg-muted/10 dark:bg-muted/5 overflow-auto">
        <div>
          <p className="font-semibold text-sm mb-1">Input Array (0-indexed):</p>
          <div className="flex flex-wrap gap-1 p-1 border rounded bg-background/30">
            {originalInputArray.map((val, idx) => (
              <InputArrayElement 
                key={`input-${idx}`} 
                value={val} 
                index={idx} 
                isHighlighted={activeIndices.includes(idx) && auxiliaryData?.operation === 'update'}
              />
            ))}
          </div>
        </div>
        
        <div>
          <p className="font-semibold text-sm mb-1">Binary Indexed Tree (1-indexed):</p>
          <div className="flex flex-wrap gap-1 p-1 border rounded bg-background/30">
            {tree.slice(1).map((val, idx) => {
                const bitIndex = idx + 1;
                return (
                  <BitArrayElement 
                    key={`bit-${bitIndex}`} 
                    value={val} 
                    index={bitIndex} 
                    isHighlighted={activeIndices.includes(bitIndex)}
                    binary={bitIndex.toString(2)}
                    lsb={bitIndex & -bitIndex}
                  />
                )
             })}
          </div>
        </div>
        
        {auxiliaryData?.bitIndex !== undefined && (
          <Card className="p-3">
             <CardHeader className="p-1 pb-2">
                <CardTitle className="text-base">Bitwise Breakdown</CardTitle>
             </CardHeader>
             <CardContent className="text-sm font-mono flex flex-col md:flex-row md:items-center md:justify-around gap-2 p-1">
                 <div><strong>Current Index:</strong> {auxiliaryData.bitIndex}</div>
                 <div><strong>Binary:</strong> {auxiliaryData.binaryString}</div>
                 <div><strong>LSB:</strong> {auxiliaryData.lsb}</div>
                 {auxiliaryData.currentSum !== undefined && <div><strong>Current Sum:</strong> {auxiliaryData.currentSum}</div>}
             </CardContent>
          </Card>
        )}

      </CardContent>
    </Card>
  );
}
