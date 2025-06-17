
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { TraversalType } from './binary-tree-traversal-logic'; // Assuming TRAVERSAL_TYPES is exported

interface BinaryTreeTraversalCodePanelProps {
  codeSnippets: Record<TraversalType, string[]>;
  currentLine: number | null;
  selectedTraversalType: TraversalType;
}

export function BinaryTreeTraversalCodePanel({
  codeSnippets,
  currentLine,
  selectedTraversalType,
}: BinaryTreeTraversalCodePanelProps) {
  const { toast } = useToast();

  const handleCopyCode = () => {
    const codeToCopy = codeSnippets[selectedTraversalType]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => {
          toast({ title: `${selectedTraversalType.toUpperCase()} Code Copied!`, description: "The code has been copied to your clipboard." });
        })
        .catch(err => {
          toast({ title: "Copy Failed", description: "Could not copy code to clipboard.", variant: "destructive" });
        });
    } else {
      toast({ title: "No Code to Copy", description: "No code available for selected traversal.", variant: "default" });
    }
  };

  const currentCodeLines = useMemo(() => {
    return codeSnippets[selectedTraversalType] || [];
  }, [selectedTraversalType, codeSnippets]);

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> {selectedTraversalType.charAt(0).toUpperCase() + selectedTraversalType.slice(1)} Traversal
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={currentCodeLines.length === 0}>
          <ClipboardCopy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea key={selectedTraversalType} className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {currentCodeLines.length > 0 ? currentCodeLines.map((line, index) => (
              <div
                key={`${selectedTraversalType}-line-${index}`}
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
            )) : (
                 <p className="text-muted-foreground p-4">Select a traversal type to see code.</p>
            )}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
