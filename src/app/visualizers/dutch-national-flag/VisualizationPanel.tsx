
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VisualizationPanelProps } from './types'; // Local import

const BALL_SIZE = 32; // px
const BALL_MARGIN = 4; // px

export function VisualizationPanel({ 
  data, 
  activeIndices = [], // [low, mid, high]
  swappingIndices = [],
  sortedIndices = [], // Not directly used for DNF color, color based on value & pointer regions
  processingSubArrayRange, // [low, high] for DNF
  auxiliaryData,
}: VisualizationPanelProps) {

  const getBallColor = (value: number, index: number): string => {
    const low = auxiliaryData?.low ?? -1;
    const mid = auxiliaryData?.mid ?? -1;
    const high = auxiliaryData?.high ?? -1;
    
    if (swappingIndices.includes(index)) return "bg-yellow-400 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-400 text-black";
    if (index === mid) return "bg-purple-500 text-white border-purple-700"; // Mid pointer is primary focus

    if (value === 0) return "bg-red-500 text-white border-red-700"; // Red for 0
    if (value === 1) return "bg-white text-black border-gray-400";   // White for 1
    if (value === 2) return "bg-blue-500 text-white border-blue-700"; // Blue for 2
    return "bg-gray-300 text-black border-gray-500"; // Should not happen for valid DNF input
  };

  const getPointerPosition = (pointerValue: number | undefined) => {
    if (pointerValue === undefined || pointerValue < 0 || pointerValue >= data.length) {
      return { display: 'none' }; // Hide pointer if out of bounds
    }
    const leftOffset = pointerValue * (BALL_SIZE + BALL_MARGIN * 2) + BALL_MARGIN + (BALL_SIZE / 2);
    return { left: `${leftOffset}px` };
  };
  
  const lowPtrStyle = getPointerPosition(auxiliaryData?.low);
  const midPtrStyle = getPointerPosition(auxiliaryData?.mid);
  const highPtrStyle = getPointerPosition(auxiliaryData?.high);

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-grow pb-10 bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg overflow-x-auto">
        {data.length === 0 ? (
          <p className="text-muted-foreground">Enter data (0s, 1s, 2s) to visualize.</p>
        ) : (
          <div className="relative pt-8"> {/* Added padding-top for pointer space */}
            <div className="flex justify-center items-center space-x-2 mb-6">
              {data.map((value, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center font-bold rounded-full border-2 transition-all duration-300 ease-in-out
                              ${getBallColor(value, index)}`}
                  style={{
                    width: `${BALL_SIZE}px`,
                    height: `${BALL_SIZE}px`,
                  }}
                  title={`Value: ${value} (Index: ${index})`}
                >
                  {value}
                </div>
              ))}
            </div>
            {/* Pointers Visualization */}
            <div className="relative h-6 w-full mt-1"> {/* Container for pointers */}
              {auxiliaryData?.low !== undefined && auxiliaryData.low < data.length && (
                <div className="absolute bottom-0 transform -translate-x-1/2 text-xs font-mono text-red-600" style={lowPtrStyle}>
                  L<span className="block text-[8px]">({auxiliaryData.low})</span>
                </div>
              )}
              {auxiliaryData?.mid !== undefined && auxiliaryData.mid < data.length && (
                 <div className="absolute bottom-0 transform -translate-x-1/2 text-xs font-mono text-blue-600" style={midPtrStyle}>
                  M<span className="block text-[8px]">({auxiliaryData.mid})</span>
                </div>
              )}
              {auxiliaryData?.high !== undefined && auxiliaryData.high < data.length && (
                <div className="absolute bottom-0 transform -translate-x-1/2 text-xs font-mono text-orange-600" style={highPtrStyle}>
                  H<span className="block text-[8px]">({auxiliaryData.high})</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

