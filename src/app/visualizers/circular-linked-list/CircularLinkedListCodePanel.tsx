
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { LinkedListOperation } from '@/components/algo-vista/LinkedListControlsPanel';

export const CIRCULAR_LINKED_LIST_OPERATIONS_CODE: Record<string, string[]> = {
  insertHead: [
    "class Node { constructor(data) { this.data = data; this.next = null; } }",
    "class CircularLinkedList {",
    "  constructor() { this.head = null; }",
    "  insertHead(data) {",
    "    const newNode = new Node(data);",
    "    if (!this.head) {",
    "      this.head = newNode;",
    "      newNode.next = this.head; // Points to itself",
    "    } else {",
    "      newNode.next = this.head;",
    "      let current = this.head;",
    "      while (current.next !== this.head) {",
    "        current = current.next;",
    "      }",
    "      current.next = newNode; // Last node points to new head",
    "      this.head = newNode;",
    "    }",
    "  }",
    "}",
  ],
  traverse: [
    "// ... (Node class and CLL constructor as above)",
    "  traverse() {",
    "    if (!this.head) return [];",
    "    const result = [];",
    "    let current = this.head;",
    "    do {",
    "      result.push(current.data);",
    "      current = current.next;",
    "    } while (current !== this.head);",
    "    return result;",
    "  }",
    "}",
  ],
  init: [
    "// Initializing a Circular Linked List",
    "function initializeList(values) {",
    "  const list = new CircularLinkedList();",
    "  if (!values || values.length === 0) return list;",
    "  // Insert in reverse to maintain input order if using insertHead",
    "  for (const val of values.reverse()) { list.insertHead(val); }",
    "  return list;",
    "}",
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

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `Code for ${effectiveOperation} Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {effectiveOperation.replace(/([A-Z])/g, ' $1').trim()}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {codeToDisplay.map((line, index) => (
              <div key={`${effectiveOperation}-line-${index}`}
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
