
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VisualizationPanelProps {
  data: number[];
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
}

const BAR_MAX_HEIGHT = 200; // Max height for bars in px
const BAR_WIDTH = 20; // Width of each bar in px
const BAR_MARGIN = 2; // Margin between bars

export function VisualizationPanel({ data, activeIndices = [], swappingIndices = [], sortedIndices = [] }: VisualizationPanelProps) {
  const [maxVal, setMaxVal] = useState(1);

  useEffect(() => {
    if (data.length > 0) {
      const positiveData = data.map(val => Math.abs(val));
      setMaxVal(Math.max(...positiveData, 1));
    } else {
      setMaxVal(1);
    }
  }, [data]);

  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) return "bg-green-500"; // Sorted elements
    if (swappingIndices.includes(index)) return "bg-accent"; // Elements being swapped (yellow)
    if (activeIndices.includes(index)) return "bg-primary"; // Active elements being compared (burgundy)
    return "bg-secondary"; // Default bar color
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-[400px]">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-center h-full pb-10 space-x-1 overflow-x-auto bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg">
        {data.length === 0 ? (
          <p className="text-muted-foreground self-center">Enter data to visualize.</p>
        ) : (
          data.map((value, index) => (
            <div
              key={index}
              className={`transition-all duration-300 ease-in-out ${getBarColor(index)} rounded-t-sm`}
              style={{
                height: `${Math.max(5, (Math.abs(value) / maxVal) * BAR_MAX_HEIGHT)}px`,
                width: `${BAR_WIDTH}px`,
                marginLeft: `${BAR_MARGIN}px`,
                marginRight: `${BAR_MARGIN}px`,
              }}
              title={`Value: ${value}`}
              aria-label={`Bar representing value ${value} at index ${index}`}
            >
              {/* Optional: Display value inside or above bar if space allows and design requires */}
              {/* <span className="text-xs text-center block text-white">{value}</span> */}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
