
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlgorithmDetailsProps } from './types';

export function AlgorithmDetailsCard({ title, description, timeComplexities, spaceComplexity }: AlgorithmDetailsProps) {
  return (
    <Card className="mt-8 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary dark:text-accent">
          About {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground whitespace-pre-line">{description}</p>
        {timeComplexities && (
        <div>
          <h3 className="font-semibold text-lg mb-1">Time Complexity:</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Best Case: {timeComplexities.best}</li>
            <li>Average Case: {timeComplexities.average}</li>
            <li>Worst Case: {timeComplexities.worst}</li>
          </ul>
        </div>
        )}
        {spaceComplexity && (
        <div>
          <h3 className="font-semibold text-lg mb-1">Space Complexity:</h3>
          <p className="text-muted-foreground">{spaceComplexity}</p>
        </div>
        )}
      </CardContent>
    </Card>
  );
}

    