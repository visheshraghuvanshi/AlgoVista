
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { BucketSortStep, BucketSortBucket } from '@/types';

interface BucketSortVisualizationPanelProps {
  step: BucketSortStep | null;
}

const ELEMENT_WIDTH = 25;
const ELEMENT_HEIGHT = 20;
const ELEMENT_MARGIN = 2;
const BUCKET_MIN_HEIGHT = 60;
const BUCKET_PADDING = 4;

export function BucketSortVisualizationPanel({ step }: BucketSortVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Bucket Sort Visualization</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter data and start.</p></CardContent>
      </Card>
    );
  }

  const { array: mainArray, buckets, currentElement, currentBucketIndex, phase, message, activeIndices, sortedIndices } = step;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Bucket Sort Visualization</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {phase && <Badge variant="outline" className="mt-1">Phase: {phase}</Badge>}
        {currentElement !== undefined && <Badge variant="outline" className="mt-1 ml-1">Processing: {currentElement}</Badge>}
        {currentBucketIndex !== undefined && <Badge variant="secondary" className="mt-1 ml-1">Active Bucket: {currentBucketIndex}</Badge>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-3 p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto">
        
        {/* Main Array Display */}
        <div>
          <p className="font-semibold text-sm mb-1">
            {phase === 'gathering' ? 'Output Array (Gathering)' : 'Input Array'}
          </p>
          <div className="flex flex-wrap gap-1 p-2 border rounded bg-background/50 min-h-[40px]">
            {mainArray.map((val, idx) => (
              <div
                key={`main-arr-${idx}`}
                className={`flex items-center justify-center rounded text-xs font-medium border 
                            ${activeIndices.includes(idx) ? 'bg-accent text-accent-foreground scale-105' : 'bg-card text-card-foreground'}
                            ${sortedIndices.includes(idx) ? 'border-green-500 border-2' : 'border-border'}`}
                style={{ width: `${ELEMENT_WIDTH*1.2}px`, height: `${ELEMENT_HEIGHT*1.2}px`}}
                title={`Value: ${val}`}
              >
                {val}
              </div>
            ))}
            {mainArray.length === 0 && <span className="text-muted-foreground italic text-xs self-center">(empty)</span>}
          </div>
        </div>

        {/* Buckets Display */}
        {buckets && buckets.length > 0 && (
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1">Buckets:</p>
            <ScrollArea className="h-full max-h-[250px] md:max-h-[300px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {buckets.map((bucket) => (
                  <div
                    key={`bucket-cont-${bucket.id}`}
                    className={`p-1.5 border rounded-md ${bucket.id === currentBucketIndex ? 'bg-primary/10 border-primary shadow-md' : 'bg-card border-border/50'}`}
                    style={{ minHeight: `${BUCKET_MIN_HEIGHT}px` }}
                  >
                    <Badge variant={bucket.id === currentBucketIndex ? "default" : "secondary"} className="mb-1 text-xs">
                      Bucket {bucket.id} {bucket.isSorted ? "(Sorted)" : ""}
                    </Badge>
                    <div className="flex flex-wrap gap-0.5 items-end min-h-[30px]">
                      {bucket.elements.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground italic w-full text-center">(empty)</p>
                      ) : (
                        bucket.elements.map((el, elIdx) => (
                          <div
                            key={`bucket-el-${bucket.id}-${elIdx}`}
                            className={`flex items-center justify-center rounded text-[10px] font-medium border bg-background`}
                            style={{ width: `${ELEMENT_WIDTH}px`, height: `${ELEMENT_HEIGHT}px`, borderColor: "hsl(var(--border))"}}
                            title={`Value: ${el}`}
                          >
                            {el}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
