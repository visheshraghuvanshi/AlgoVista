"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodePanelProps {
  codeLines: string[];
  currentLine: number | null;
}

export function CodePanel({ codeLines, currentLine }: CodePanelProps) {
  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[300px] md:h-auto">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Code</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] md:h-[calc(100%-4rem)] w-full rounded-md border p-2 bg-muted/20">
          <pre className="font-code text-sm">
            {codeLines.map((line, index) => (
              <div
                key={index}
                className={`px-2 py-0.5 rounded ${
                  index + 1 === currentLine ? "bg-accent text-accent-foreground" : ""
                }`}
                aria-current={index + 1 === currentLine ? "step" : undefined}
              >
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                  {index + 1}
                </span>
                {line}
              </div>
            ))}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
