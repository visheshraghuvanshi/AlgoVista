
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
  insertHead: [
    "class Node { constructor(data) { this.data = data; this.next = null; } }",
    "class SinglyLinkedList {",
    "  constructor() { this.head = null; }",
    "  insertHead(data) {",
    "    const newNode = new Node(data);",
    "    newNode.next = this.head;",
    "    this.head = newNode;",
    "  }",
    "}",
  ],
  insertTail: [
    "// ... (Node class and LinkedList constructor as above)",
    "  insertTail(data) {",
    "    const newNode = new Node(data);",
    "    if (!this.head) {",
    "      this.head = newNode;",
    "      return;",
    "    }",
    "    let current = this.head;",
    "    while (current.next) {",
    "      current = current.next;",
    "    }",
    "    current.next = newNode;",
    "  }",
    "}",
  ],
  deleteByValue: [
    "// ... (Node class and LinkedList constructor as above)",
    "  deleteByValue(data) {",
    "    if (!this.head) return null; // List is empty",
    "    if (this.head.data === data) {",
    "      this.head = this.head.next;",
    "      return data; // Deleted head",
    "    }",
    "    let current = this.head;",
    "    while (current.next && current.next.data !== data) {",
    "      current = current.next;",
    "    }",
    "    if (current.next) { // Found node to delete",
    "      const deletedNode = current.next;",
    "      current.next = current.next.next;",
    "      return deletedNode.data;",
    "    }",
    "    return null; // Value not found",
    "  }",
    "}",
  ],
   search: [
    "// ... (Node class and LinkedList constructor as above)",
    "  search(data) {",
    "    let current = this.head;",
    "    let index = 0;",
    "    while (current) {",
    "      if (current.data === data) {",
    "        return { node: current, index }; // Found",
    "      }",
    "      current = current.next;",
    "      index++;",
    "    }",
    "    return null; // Not found",
    "  }",
    "}",
  ],
  traverse: [
    "// ... (Node class and LinkedList constructor as above)",
    "  traverse() {",
    "    let current = this.head;",
    "    const result = [];",
    "    while (current) {",
    "      result.push(current.data);",
    "      current = current.next;",
    "    }",
    "    return result;",
    "  }",
    "}",
  ],
  init: [
    "// Initializing a list from input values",
    "// (Conceptual - actual implementation depends on how input is parsed)",
    "function initializeList(values) {",
    "  const list = new SinglyLinkedList();",
    "  if (!values || values.length === 0) return list;",
    "  // Typically insert values one by one (e.g., insertTail)",
    "  for (const val of values.reverse()) { // Reverse for insertHead to maintain order",
    "     list.insertHead(val);",
    "  }",
    "  return list;",
    "}",
  ],
};


interface SinglyLinkedListCodePanelProps {
  currentLine: number | null;
  currentOperation: LinkedListOperation | null;
}

export function SinglyLinkedListCodePanel({ currentLine, currentOperation }: SinglyLinkedListCodePanelProps) {
  const { toast } = useToast();
  const effectiveOperation = currentOperation || 'init'; // Default to 'init' if no op selected

  const codeToDisplay = SINGLY_LINKED_LIST_OPERATIONS_CODE[effectiveOperation] || SINGLY_LINKED_LIST_OPERATIONS_CODE.init;

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => {
          toast({ title: `Code for ${effectiveOperation} Copied!`, description: "The code has been copied to your clipboard." });
        })
        .catch(err => {
          toast({ title: "Copy Failed", description: "Could not copy code to clipboard.", variant: "destructive" });
        });
    } else {
        toast({ title: "No Code to Copy", description: "No code available for selected operation.", variant: "default" });
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: {effectiveOperation.replace(/([A-Z])/g, ' $1').trim()}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={!codeToDisplay || codeToDisplay.length === 0}>
          <ClipboardCopy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
          <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
            <pre className="font-code text-sm p-4">
              {(codeToDisplay).map((line, index) => (
                <div
                  key={`${effectiveOperation}-line-${index}`}
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
