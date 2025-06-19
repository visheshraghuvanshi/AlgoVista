
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
  sortedIndices = [],
  processingSubArrayRange = null,
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
    // Dutch National Flag specific colors for 0, 1, 2
    // The activeIndices will represent low, mid, high pointers
    // The sortedIndices will represent the 0s and 2s sections
    // Swapping indices for visual effect of swap

    if (swappingIndices.includes(index)) return "bg-yellow-400"; // Use a distinct yellow for swapping

    // Highlight pointers
    const [low, mid, high] = activeIndices; // Assuming activeIndices = [low, mid, high] from logic
    if (index === low && index === mid && index === high) return "bg-purple-500"; // All pointers on one element
    if (index === low && index === mid) return "bg-pink-500"; // Low and Mid together
    if (index === mid && index === high) return "bg-teal-500"; // Mid and High together
    if (index === low) return "bg-red-500";   // Low pointer
    if (index === mid) return "bg-blue-500";  // Mid pointer
    if (index === high) return "bg-orange-500"; // High pointer
    
    // Colors for 0, 1, 2 based on their final/semi-final position
    if (sortedIndices.includes(index)) {
        if (data[index] === 0) return "bg-red-600"; // Sorted 0s (Dutch Red)
        if (data[index] === 2) return "bg-blue-600"; // Sorted 2s (Dutch Blue)
    }
    if (data[index] === 1 && index > (activeIndices[0] || -1) && index < (activeIndices[2] === undefined ? data.length : activeIndices[2])) {
        // If mid has passed this 1, and it's not yet in a sorted region
        if (index < (activeIndices[1] || 0)) {
             return "bg-white border-2 border-gray-400 text-black"; // Sorted 1s (Dutch White)
        }
    }
    
    // Fallback colors based on value for unsorted part or general elements
    if (data[index] === 0) return "bg-red-300";
    if (data[index] === 1) return "bg-gray-300 text-black";
    if (data[index] === 2) return "bg-blue-300";
    
    return "bg-gray-400"; // Default for any other case or un-initialized
  };

  const getBarHeight = (value: number) => {
    // For DNF, values are 0, 1, 2. Height can be fixed or slightly varied.
    // Let's use a fixed moderate height for all, color is more important.
    return '100px'; 
  };

  const isDimmed = (index: number) => {
    // No dimming for DNF, all parts are relevant
    return false;
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px]">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-center h-full pb-10 space-x-1 overflow-x-auto bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg">
        {data.length === 0 ? (
          <p className="text-muted-foreground self-center">Enter data (0s, 1s, 2s) to visualize.</p>
        ) : (
          data.map((value, index) => (
            <div
              key={index}
              className={`flex items-center justify-center font-bold text-lg transition-all duration-300 ease-in-out ${getBarColor(index)} rounded-md ${isDimmed(index) ? 'opacity-30' : 'opacity-100'}`}
              style={{
                height: getBarHeight(value),
                width: `${BAR_WIDTH*1.5}px`, // Make bars a bit wider for clarity
                marginLeft: `${BAR_MARGIN}px`,
                marginRight: `${BAR_MARGIN}px`,
              }}
              title={`Value: ${value}`}
              aria-label={`Element ${value} at index ${index}`}
            >
              {value}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

