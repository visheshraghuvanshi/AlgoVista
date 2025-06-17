
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LinkedListOperation } from '@/components/algo-vista/LinkedListControlsPanel';

export const SINGLY_LINKED_LIST_OPERATIONS_CODE: Record<string, string[]> = {
  structure: [ // Added a common structure snippet
    "class Node {",
    "  constructor(data) {",
    "    this.data = data;",
    "    this.next = null;",
    "  }",
    "}",
    "class SinglyLinkedList {",
    "  constructor() {",
    "    this.head = null;",
    "  }",
    "  // ... operations below ...",
    "}",
  ],
  insertHead: [
    "// insertHead(data) {",              // Line 3 in SLL_LINE_MAPS
    "  const newNode = new Node(data);",  // Line 4
    "  newNode.next = this.head;",         // Line 5
    "  this.head = newNode;",              // Line 6
    "// }",                               // Line 7
  ],
  insertTail: [
    "// insertTail(data) {",               // Line 1
    "  const newNode = new Node(data);",   // Line 2
    "  if (!this.head) {",                 // Line 3
    "    this.head = newNode; return;",    // Line 4
    "  }",
    "  let current = this.head;",          // Line 5
    "  while (current.next) {",            // Line 6
    "    current = current.next;",         // Line 7
    "  }",
    "  current.next = newNode;",           // Line 8
    "// }",                                // Line 9
  ],
  deleteByValue: [
    "// deleteByValue(data) {",               // Line 1
    "  if (!this.head) return null;",       // Line 2
    "  if (this.head.data === data) {",    // Line 3
    "    this.head = this.head.next; return data;", // Line 4
    "  }",
    "  let current = this.head, prev = null;", // Line 5
    "  while (current && current.data !== data) {", // Line 6
    "    prev = current; current = current.next;",   // Line 10 (conceptual for prev/current move)
    "  }",
    "  if (current) {",                        // Line 7 (Conceptual: if found)
    "    prev.next = current.next;",           // Line 8
    "    return data;",                       // Line 9
    "  }",
    "  return null;",                           // Line 11
    "// }",                                    // Line 12
  ],
   search: [
    "// search(data) {",                       // Line 1
    "  let current = this.head, index = 0;", // Line 2
    "  while (current) {",                     // Line 3
    "    if (current.data === data) {",      // Line 4
    "      return { node: current, index };", // Line 5
    "    }",
    "    current = current.next;",             // Line 6
    "    index++;",                           // Line 7
    "  }",
    "  return null;",                           // Line 8
    "// }",                                    // Line 9
  ],
  traverse: [
    "// traverse() {",                         // Line 1
    "  let current = this.head, result = [];",// Line 2
    "  while (current) {",                     // Line 3
    "    result.push(current.data);",         // Line 4
    "    current = current.next;",             // Line 5
    "  }",
    "  return result;",                         // Line 6
    "// }",                                    // Line 7
  ],
  init: [
    "// Initializing a list from input values",
    "// (See other operations for detailed logic)",
  ],
};


interface SinglyLinkedListCodePanelProps {
  currentLine: number | null;
  currentOperation: LinkedListOperation | null;
}

export function SinglyLinkedListCodePanel({ currentLine, currentOperation }: SinglyLinkedListCodePanelProps) {
  const { toast } = useToast();
  const effectiveOperation = currentOperation || 'init'; 

  const codeToDisplay = SINGLY_LINKED_LIST_OPERATIONS_CODE[effectiveOperation] || SINGLY_LINKED_LIST_OPERATIONS_CODE.init;
  const structureCode = SINGLY_LINKED_LIST_OPERATIONS_CODE.structure;

  const handleCopyCode = () => {
    const fullCode = structureCode.join('\n') + '\n\n  ' + codeToDisplay.map(line => line.startsWith("//") ? line : `  ${line}`).join('\n  ');
    if (fullCode) {
      navigator.clipboard.writeText(fullCode)
        .then(() => {
          toast({ title: `SLL Code Copied!`, description: "Structure and operation code copied." });
        })
        .catch(err => {
          toast({ title: "Copy Failed", description: "Could not copy code.", variant: "destructive" });
        });
    }
  };
  
  const operationTitle = effectiveOperation.charAt(0).toUpperCase() + effectiveOperation.slice(1).replace(/([A-Z])/g, ' $1');


  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: {operationTitle}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={!codeToDisplay || codeToDisplay.length === 0}>
          <ClipboardCopy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
          <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
            <pre className="font-code text-sm p-4 whitespace-pre-wrap">
              {structureCode.map((line, index) => (
                 <div key={`struct-line-${index}`} className={`px-2 py-0.5 rounded text-muted-foreground/70 opacity-70`}>
                    <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                    {line}
                 </div>
              ))}
              {effectiveOperation !== 'init' && <div className="my-2 border-b border-dashed border-muted-foreground/30"></div>}
              {(codeToDisplay).map((line, index) => (
                <div
                  key={`${effectiveOperation}-line-${index}`}
                  className={`px-2 py-0.5 rounded ${
                    // Adjust line numbers for display based on currentOperation's map
                    index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"
                  }`}
                  aria-current={index + 1 === currentLine ? "step" : undefined}
                >
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                    {/* This line number is relative to the snippet being displayed */}
                    {index + 1} 
                  </span>
                  {line.startsWith("//") ? line : `    ${line}`} {/* Indent non-comment lines */}
                </div>
              ))}
            </pre>
          </ScrollArea>
      </CardContent>
    </Card>
  );
}

