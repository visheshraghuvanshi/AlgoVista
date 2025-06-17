
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { STACK_LINE_MAP, QUEUE_LINE_MAP } from './stack-queue-logic';

export const STACK_QUEUE_CODE_SNIPPETS = {
  JavaScript: [
    "// --- Stack (LIFO) ---",                          // 0
    "class Stack {",                                     // 1 (STACK_LINE_MAP.classDef)
    "  constructor() { this.items = []; }",              // 2 (STACK_LINE_MAP.constructor)
    "  push(element) { this.items.push(element); }",     // 3 (STACK_LINE_MAP.pushStart -> pushToArray -> pushEnd)
    "  pop() {",                                         // 4 (STACK_LINE_MAP.popStart)
    "    if (this.isEmpty()) return null;",             // 5 (STACK_LINE_MAP.popCheckEmpty)
    "    return this.items.pop();",                      // 6 (STACK_LINE_MAP.popFromArray)
    "  }",                                               // 7 (STACK_LINE_MAP.popEnd)
    "  peek() {",                                        // 8 (STACK_LINE_MAP.peekStart)
    "    if (this.isEmpty()) return null;",             // 9 (STACK_LINE_MAP.peekCheckEmpty)
    "    return this.items[this.items.length - 1];",     // 10 (STACK_LINE_MAP.peekReturnTop)
    "  }",                                               // 11 (STACK_LINE_MAP.peekEnd)
    "  isEmpty() { return this.items.length === 0; }",  // 12 (STACK_LINE_MAP.isEmpty)
    "  size() { return this.items.length; }",           // 13 (STACK_LINE_MAP.size)
    "}",                                                 // 14
    "",
    "// --- Queue (FIFO) ---",                          // 15
    "class Queue {",                                     // 16 (QUEUE_LINE_MAP.classDef)
    "  constructor() { this.items = []; }",              // 17 (QUEUE_LINE_MAP.constructor)
    "  enqueue(element) { this.items.push(element); }",  // 18 (enqueueStart -> enqueueToArray -> enqueueEnd)
    "  dequeue() {",                                     // 19 (dequeueStart)
    "    if (this.isEmpty()) return null;",             // 20 (dequeueCheckEmpty)
    "    return this.items.shift();",                    // 21 (dequeueFromArray)
    "  }",                                               // 22 (dequeueEnd)
    "  front() {",                                       // 23 (frontStart)
    "    if (this.isEmpty()) return null;",             // 24 (frontCheckEmpty)
    "    return this.items[0];",                         // 25 (frontReturnFirst)
    "  }",                                               // 26 (frontEnd)
    "  isEmpty() { return this.items.length === 0; }",  // 27 (isEmpty)
    "  size() { return this.items.length; }",           // 28 (size)
    "}",                                                 // 29
  ],
};


interface StackQueueCodeSnippetsPanelProps {
  currentLine: number | null;
  structureType: 'stack' | 'queue';
}

export function StackQueueCodeSnippetsPanel({ currentLine, structureType }: StackQueueCodeSnippetsPanelProps) {
  const { toast } = useToast();

  const getRelevantLineMap = () => {
    return structureType === 'stack' ? STACK_LINE_MAP : QUEUE_LINE_MAP;
  };
  
  // Determine which part of the snippet to emphasize based on structureType
  const codeSlice = structureType === 'stack' 
    ? STACK_QUEUE_CODE_SNIPPETS.JavaScript.slice(1, 15) // Lines 1-14 for Stack
    : STACK_QUEUE_CODE_SNIPPETS.JavaScript.slice(16, 30); // Lines 16-29 for Queue
  
  const title = structureType === 'stack' ? "Stack Code (Conceptual)" : "Queue Code (Conceptual)";


  const handleCopyCode = () => {
    // Copy only the relevant part or the whole snippet
    const codeToCopy = structureType === 'stack' 
      ? STACK_QUEUE_CODE_SNIPPETS.JavaScript.slice(0, 15).join('\n')
      : STACK_QUEUE_CODE_SNIPPETS.JavaScript.slice(15).join('\n');
      
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${structureType.charAt(0).toUpperCase() + structureType.slice(1)} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  return (
    <Card className="shadow-lg rounded-lg h-[300px] md:h-[400px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> {title}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy {structureType}
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {codeSlice.map((line, index) => {
              // Need to map relative snippet line index to absolute line in full snippet for currentLine check
              const absoluteLineNumberInFullSnippet = structureType === 'stack' ? index + 1 + 1 : index + 1 + 16;
              return (
                <div key={`${structureType}-line-${index}`}
                  className={`px-2 py-0.5 rounded whitespace-pre-wrap ${absoluteLineNumberInFullSnippet === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                  {line}
                </div>
              );
            })}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

