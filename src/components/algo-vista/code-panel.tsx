
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CodePanelProps {
  codeLines: string[];
  currentLine: number | null;
}

export function CodePanel({ codeLines, currentLine }: CodePanelProps) {
  const { toast } = useToast();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeLines.join('\n'))
      .then(() => {
        toast({ title: "Code Copied!", description: "The code has been copied to your clipboard." });
      })
      .catch(err => {
        toast({ title: "Copy Failed", description: "Could not copy code to clipboard.", variant: "destructive" });
        console.error('Failed to copy code: ', err);
      });
  };

  return (
    <Card className="shadow-lg rounded-lg h-[300px] md:h-[400px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Code</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code">
          <ClipboardCopy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full w-full rounded-b-md border-t">
          <pre className="font-code text-sm p-4 bg-muted/20 dark:bg-muted/5">
            {codeLines.map((line, index) => (
              <div
                key={index}
                className={`px-2 py-0.5 rounded transition-colors duration-150 ${
                  index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"
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
