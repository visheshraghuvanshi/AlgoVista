
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { LinkedListOperation } from '@/components/algo-vista/LinkedListControlsPanel';

export const DOUBLY_LINKED_LIST_OPERATIONS_CODE: Record<string, string[]> = {
  insertHead: [
    "class Node { constructor(data) { this.data = data; this.next = null; this.prev = null; } }",
    "class DoublyLinkedList {",
    "  constructor() { this.head = null; this.tail = null; }",
    "  insertHead(data) {",
    "    const newNode = new Node(data);",
    "    if (!this.head) {",
    "      this.head = newNode;",
    "      this.tail = newNode;",
    "    } else {",
    "      newNode.next = this.head;",
    "      this.head.prev = newNode;",
    "      this.head = newNode;",
    "    }",
    "  }",
    "}",
  ],
  insertTail: [
    "// ... (Node class and DLL constructor as above)",
    "  insertTail(data) {",
    "    const newNode = new Node(data);",
    "    if (!this.tail) {",
    "      this.head = newNode;",
    "      this.tail = newNode;",
    "    } else {",
    "      newNode.prev = this.tail;",
    "      this.tail.next = newNode;",
    "      this.tail = newNode;",
    "    }",
    "  }",
    "}",
  ],
  deleteByValue: [
    "// ... (Node class and DLL constructor as above)",
    "  deleteByValue(data) {",
    "    let current = this.head;",
    "    while (current) {",
    "      if (current.data === data) {",
    "        if (current.prev) current.prev.next = current.next;",
    "        else this.head = current.next; // Deleting head",
    "        if (current.next) current.next.prev = current.prev;",
    "        else this.tail = current.prev; // Deleting tail",
    "        return data;",
    "      }",
    "      current = current.next;",
    "    }",
    "    return null; // Not found",
    "  }",
    "}",
  ],
  traverse: [
    "// ... (Node class and DLL constructor as above)",
    "  traverseForward() {",
    "    let current = this.head; const result = [];",
    "    while (current) { result.push(current.data); current = current.next; }",
    "    return result;",
    "  }",
    "  traverseBackward() {",
    "    let current = this.tail; const result = [];",
    "    while (current) { result.push(current.data); current = current.prev; }",
    "    return result;",
    "  }",
    "}",
  ],
   init: [
    "// Initializing a Doubly Linked List",
    "function initializeList(values) {",
    "  const list = new DoublyLinkedList();",
    "  if (!values || values.length === 0) return list;",
    "  for (const val of values) { list.insertTail(val); }",
    "  return list;",
    "}",
  ],
};

interface DoublyLinkedListCodePanelProps {
  currentLine: number | null;
  currentOperation: LinkedListOperation | null;
}

export function DoublyLinkedListCodePanel({ currentLine, currentOperation }: DoublyLinkedListCodePanelProps) {
  const { toast } = useToast();
  const effectiveOperation = currentOperation || 'init';
  const codeToDisplay = DOUBLY_LINKED_LIST_OPERATIONS_CODE[effectiveOperation] || DOUBLY_LINKED_LIST_OPERATIONS_CODE.init;

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
