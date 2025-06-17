
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { LinkedListOperation } from '@/components/algo-vista/LinkedListControlsPanel';

export const CIRCULAR_LINKED_LIST_OPERATIONS_CODE: Record<string, string[]> = {
  structure: [
    "class Node { constructor(data) { this.data = data; this.next = null; } }",
    "class CircularLinkedList {",
    "  constructor() { this.head = null; }",
    "  // ... operations below ...",
    "}",
  ],
  insertHead: [
    "// insertHead(data) {",
    "  const newNode = new Node(data);",
    "  if (!this.head) {",
    "    this.head = newNode;",
    "    newNode.next = this.head; // Points to itself",
    "  } else {",
    "    newNode.next = this.head;",
    "    let current = this.head;",
    "    while (current.next !== this.head) {",
    "      current = current.next;",
    "    }",
    "    current.next = newNode; // Last node points to new head",
    "    this.head = newNode;",
    "  }",
    "// }",
  ],
  insertAtPosition: [
    "// insertAtPosition(data, position) {",
    "  const newNode = new Node(data);",
    "  if (!this.head) { /* handle empty list or pos 0 */ return; }",
    "  if (position === 0) { /* Use insertHead logic */ return; }",
    "  let current = this.head; let count = 0; let prev = null;",
    "  do {",
    "    if (count === position) break;",
    "    prev = current; current = current.next;",
    "    count++;",
    "  } while (current !== this.head && count < position);",
    "  if (prev && count === position) {",
    "    prev.next = newNode; newNode.next = current;",
    "  } else { /* Position out of bounds or insert at tail logic */ }",
    "// }",
  ],
  deleteAtPosition: [
    "// deleteAtPosition(position) {",
    "  if (!this.head) return null;",
    "  let current = this.head, prev = null, tail = this.head;",
    "  while(tail.next !== this.head) tail = tail.next; // Find tail",
    "  if (position === 0) {",
    "    if (this.head === this.head.next) this.head = null; // Single node",
    "    else { tail.next = this.head.next; this.head = this.head.next; }",
    "    return;",
    "  }",
    "  let count = 0;",
    "  do {",
    "    if (count === position) break;",
    "    prev = current; current = current.next;",
    "    count++;",
    "  } while (current !== this.head && count < position);",
    "  if (current !== this.head && count === position) { // Found node",
    "    prev.next = current.next;",
    "  } else if (current === this.head && count === position) { /* Position is head via wrap, should be caught by pos=0 */ }",
    "// }",
  ],
  traverse: [
    "// traverse() {",
    "  if (!this.head) return [];",
    "  const result = [];",
    "  let current = this.head;",
    "  do {",
    "    result.push(current.data);",
    "    current = current.next;",
    "  } while (current !== this.head);",
    "  return result;",
    "// }",
  ],
  init: [
    "// Initializing a Circular Linked List",
    "// (See other operations for detailed logic)",
  ],
};

interface CircularLinkedListCodePanelProps {
  currentLine: number | null;
  currentOperation: LinkedListOperation | null;
}

export function CircularLinkedListCodePanel({ currentLine, currentOperation }: CircularLinkedListCodePanelProps) {
  const { toast } = useToast();
  const effectiveOperation = currentOperation || 'init';
  const codeToDisplay = CIRCULAR_LINKED_LIST_OPERATIONS_CODE[effectiveOperation] || CIRCULAR_LINKED_LIST_OPERATIONS_CODE.init;
  const structureCode = CIRCULAR_LINKED_LIST_OPERATIONS_CODE.structure;

  const handleCopyCode = () => {
    const fullCode = structureCode.join('\n') + '\n\n  ' + codeToDisplay.map(line => line.startsWith("//") ? line : `  ${line}`).join('\n  ');
    if (fullCode) {
      navigator.clipboard.writeText(fullCode)
        .then(() => toast({ title: `CLL Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const operationTitle = effectiveOperation.charAt(0).toUpperCase() + effectiveOperation.slice(1).replace(/([A-Z])/g, ' $1');

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {operationTitle}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap">
            {structureCode.map((line, index) => (
                 <div key={`cll-struct-line-${index}`} className={`px-2 py-0.5 rounded text-muted-foreground/70 opacity-70`}>
                    <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                    {line}
                 </div>
            ))}
            {effectiveOperation !== 'init' && <div className="my-2 border-b border-dashed border-muted-foreground/30"></div>}
            {codeToDisplay.map((line, index) => (
              <div key={`${effectiveOperation}-line-${index}`}
                className={`px-2 py-0.5 rounded ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                {line.startsWith("//") ? line : `    ${line}`}
              </div>
            ))}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

