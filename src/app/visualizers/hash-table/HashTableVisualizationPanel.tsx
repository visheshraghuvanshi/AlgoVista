
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { HashTableStep, HashTableEntry } from '@/types';

interface HashTableVisualizationPanelProps {
  step: HashTableStep | null;
}

export function HashTableVisualizationPanel({ step }: HashTableVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Hash Table</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Initialize or perform an operation.</p></CardContent>
      </Card>
    );
  }

  const { buckets, tableSize, operation, currentKey, hashIndex, activeBucketIndex, activeEntry, foundValue, message } = step;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Hash Table State</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {hashIndex !== undefined && <p className="text-xs text-muted-foreground">Key: "{currentKey}" &rarr; Hash Index: {hashIndex}</p>}
        {operation === 'search' && foundValue !== undefined && (
            <p className={`text-sm font-semibold ${foundValue !== null ? 'text-green-500' : 'text-red-500'}`}>
                Search Result: {foundValue !== null ? `Found value "${foundValue}"` : "Not Found"}
            </p>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-2 p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(100px, 1fr))` }}>
          {buckets.map((bucket, index) => (
            <div
              key={`bucket-${index}`}
              className={`p-2 border rounded-md min-h-[60px] ${index === activeBucketIndex ? 'bg-primary/20 border-primary shadow-md' : 'bg-card border-border'}`}
            >
              <Badge variant="secondary" className="mb-1">Bucket {index}</Badge>
              <ScrollArea className="h-20"> {/* Fixed height for scrollable buckets */}
                {bucket.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">(empty)</p>
                ) : (
                  bucket.map((entry, entryIndex) => (
                    <div
                      key={`entry-${index}-${entryIndex}`}
                      className={`text-xs p-1 my-0.5 border-b border-dashed 
                                  ${activeEntry && activeEntry[0] === entry[0] && activeEntry[1] === entry[1] ? 'bg-accent text-accent-foreground rounded' : ''}`}
                    >
                      <span className="font-semibold">K:</span> {String(entry[0])}, <span className="font-semibold">V:</span> {String(entry[1])}
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
