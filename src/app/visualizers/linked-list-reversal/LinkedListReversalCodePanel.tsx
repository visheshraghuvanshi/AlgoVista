
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { LinkedListOperation } from '@/components/algo-vista/LinkedListControlsPanel';


export const REVERSAL_CODE_SNIPPETS: Record<string, string[]> = {
  iterative: [
    "// Iterative Reversal for Singly Linked List",
    "// Assumes Node class: { data, next }",
    "function reverseIterative(head) {",        // 1
    "  let prev = null;",                       // 2
    "  let current = head;",                    // 3
    "  let nextNode = null;",                   // 4
    "  while (current !== null) {",             // 5
    "    nextNode = current.next; // Store next", // 6
    "    current.next = prev;   // Reverse current node's pointer", // 7
    "    prev = current;        // Move prev one step forward",    // 8
    "    current = nextNode;      // Move current one step forward", // 9
    "  }",                                      // 10
    "  return prev; // New head",                // 11
    "}",
  ],
  recursive: [
    "// Recursive Reversal for Singly Linked List",
    "// Assumes Node class: { data, next }",
    "function reverseRecursive(head) {",        // 1
    "  if (head === null || head.next === null) {", // 2 (Base case)
    "    return head;",                           // 3
    "  }",
    "  let rest = reverseRecursive(head.next);", // 4 (Recursive call)
    "  head.next.next = head; // Reverse pointer of next node", // 5
    "  head.next = null; // Set original head's next to null",   // 6
    "  return rest; // New head (from base case propagation)",  // 7
    "}",
  ],
  init: [
    "// Initializing a list from input values",
    "function initializeList(values) { /* ... */ }",
    "// Select 'Iterative' or 'Recursive' to see reversal code.",
  ],
};

interface LinkedListReversalCodePanelProps {
  currentLine: number | null;
  reversalType: 'iterative' | 'recursive' | 'init'; // Or a broader op type if panel is generic
}

export function LinkedListReversalCodePanel({ currentLine, reversalType }: LinkedListReversalCodePanelProps) {
  const { toast } = useToast();
  const codeToDisplay = REVERSAL_CODE_SNIPPETS[reversalType] || REVERSAL_CODE_SNIPPETS.init;

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `Code for ${reversalType} Reversal Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {reversalType.charAt(0).toUpperCase() + reversalType.slice(1)} Reversal
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {codeToDisplay.map((line, index) => (
              <div key={`${reversalType}-line-${index}`}
                className={`px-2 py-0.5 rounded ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                {line}
              </div>
            ))}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
