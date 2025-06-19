
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VisualizationPanelProps } from './types'; // Local import

const BAR_MAX_HEIGHT_BASE = 200; 
const BAR_WIDTH = 20; 
const BAR_MARGIN = 2; 
const MIN_NON_ZERO_BAR_HEIGHT = 10; 

export function VisualizationPanel({ 
  data, 
  activeIndices = [], 
  swappingIndices = [], 
  sortedIndices = [], // For Kadane's, this can highlight the max subarray
  processingSubArrayRange = null, // For Kadane's, this can highlight the current subarray being considered
  pivotActualIndex = null 
}: VisualizationPanelProps) {
  const [maxVal, setMaxVal] = useState(1);
  const [sqrtMaxVal, setSqrtMaxVal] = useState(1);

  const BAR_MAX_HEIGHT = BAR_MAX_HEIGHT_BASE * 2; 

  useEffect(() => {
    if (data.length > 0) {
      const absoluteData = data.map(val => Math.abs(val));
      const currentMaxVal = Math.max(...absoluteData, 1); 
      setMaxVal(currentMaxVal);
      setSqrtMaxVal(Math.sqrt(currentMaxVal));
    } else {
      setMaxVal(1); 
      setSqrtMaxVal(1);
    }
  }, [data]);

  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) return "bg-green-500"; // Max subarray
    if (processingSubArrayRange && index >= processingSubArrayRange[0] && index <= processingSubArrayRange[1]) {
        return "bg-accent"; // Current contiguous subarray being summed
    }
    if (activeIndices.includes(index)) return "bg-primary"; // Current element being processed
    return "bg-secondary"; 
  };

  const getBarHeight = (value: number) => {
    // For Kadane's, negative values are important. We can show them below a baseline
    // or just use their absolute value for height and rely on color/text for sign.
    // Here, using absolute for height.
    if (value === 0) return `${MIN_NON_ZERO_BAR_HEIGHT}px`; // Min height for zero for visibility
    
    const scaledHeight = sqrtMaxVal > 0 
      ? (Math.sqrt(Math.abs(value)) / sqrtMaxVal) * BAR_MAX_HEIGHT * 0.8 // Scale down a bit
      : BAR_MAX_HEIGHT * 0.8; 

    return `${Math.min(BAR_MAX_HEIGHT, Math.max(MIN_NON_ZERO_BAR_HEIGHT, scaledHeight))}px`;
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px]">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-center h-full pb-10 space-x-1 overflow-x-auto bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg">
        {data.length === 0 ? (
          <p className="text-muted-foreground self-center">Enter data to visualize.</p>
        ) : (
          data.map((value, index) => (
            <div className="flex flex-col items-center">
              <div
                key={index}
                className={`transition-all duration-300 ease-in-out ${getBarColor(index)} rounded-t-sm`}
                style={{
                  height: getBarHeight(value),
                  width: `${BAR_WIDTH}px`,
                  marginLeft: `${BAR_MARGIN}px`,
                  marginRight: `${BAR_MARGIN}px`,
                  // transform: value < 0 ? 'scaleY(-1)' : 'scaleY(1)', // If showing negative below baseline
                }}
                title={`Value: ${value}`}
                aria-label={`Bar representing value ${value} at index ${index}`}
              >
              </div>
              <span className="text-xs mt-1">{value}</span> {/* Display value below bar */}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
