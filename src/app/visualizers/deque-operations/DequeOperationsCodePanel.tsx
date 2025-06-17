
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DEQUE_LINE_MAP } from './deque-logic';

// Conceptual code based on simple array implementation
const DEQUE_OPERATIONS_CODE_SNIPPETS = {
  JavaScript: [
    "// Deque (Conceptual using Array)",                // 0
    "class Deque {",                                     // 1 (DEQUE_LINE_MAP.classDef)
    "  constructor() { this.items = []; }",              // 2 (DEQUE_LINE_MAP.constructor)
    "  addFront(element) {",                             // 3 (DEQUE_LINE_MAP.addFrontStart)
    "    this.items.unshift(element);",                  // 4 (DEQUE_LINE_MAP.addFrontOp)
    "  }",                                               // 5 (DEQUE_LINE_MAP.addFrontEnd)
    "  addRear(element) {",                              // 6 (DEQUE_LINE_MAP.addRearStart)
    "    this.items.push(element);",                     // 7 (DEQUE_LINE_MAP.addRearOp)
    "  }",                                               // 8 (DEQUE_LINE_MAP.addRearEnd)
    "  removeFront() {",                                 // 9 (DEQUE_LINE_MAP.removeFrontStart)
    "    if (this.isEmpty()) return null;",             // 10 (DEQUE_LINE_MAP.removeFrontCheckEmpty)
    "    return this.items.shift();",                    // 11 (DEQUE_LINE_MAP.removeFrontOp)
    "  }",                                               // 12 (DEQUE_LINE_MAP.removeFrontEnd)
    "  removeRear() {",                                  // 13 (DEQUE_LINE_MAP.removeRearStart)
    "    if (this.isEmpty()) return null;",             // 14 (DEQUE_LINE_MAP.removeRearCheckEmpty)
    "    return this.items.pop();",                      // 15 (DEQUE_LINE_MAP.removeRearOp)
    "  }",                                               // 16 (DEQUE_LINE_MAP.removeRearEnd)
    "  peekFront() {",                                   // 17 (DEQUE_LINE_MAP.peekFrontStart)
    "    if (this.isEmpty()) return null;",             // 18 (DEQUE_LINE_MAP.peekFrontCheckEmpty)
    "    return this.items[0];",                         // 19 (DEQUE_LINE_MAP.peekFrontReturn)
    "  }",                                               // 20 (DEQUE_LINE_MAP.peekFrontEnd)
    "  peekRear() {",                                    // 21 (DEQUE_LINE_MAP.peekRearStart)
    "    if (this.isEmpty()) return null;",             // 22 (DEQUE_LINE_MAP.peekRearCheckEmpty)
    "    return this.items[this.items.length - 1];",     // 23 (DEQUE_LINE_MAP.peekRearReturn)
    "  }",                                               // 24 (DEQUE_LINE_MAP.peekRearEnd)
    "  isEmpty() { return this.items.length === 0; }",  // 25 (DEQUE_LINE_MAP.isEmpty)
    "  size() { return this.items.length; }",           // 26 (DEQUE_LINE_MAP.size)
    "}",
  ],
};

interface DequeOperationsCodePanelProps {
  currentLine: number | null;
}

export function DequeOperationsCodePanel({ currentLine }: DequeOperationsCodePanelProps) {
  const { toast } = useToast();
  const codeToDisplay = DEQUE_OPERATIONS_CODE_SNIPPETS.JavaScript;

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    navigator.clipboard.writeText(codeString)
      .then(() => toast({ title: `Deque Code Copied!` }))
      .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
  };

  return (
    <Card className="shadow-lg rounded-lg h-[300px] md:h-[400px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code (Conceptual JS)
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {codeToDisplay.map((line, index) => (
              <div key={`deque-line-${index}`}
                className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
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
