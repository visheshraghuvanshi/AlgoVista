"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LinkedListOperation } from '@/components/algo-vista/LinkedListControlsPanel';

// Updated to include Python, Java, C++
export const DOUBLY_LINKED_LIST_OPERATIONS_CODE: Record<string, Record<string, string[]>> = {
  JavaScript: {
    structure: [
      "class Node {",
      "  constructor(data) { this.data = data; this.next = null; this.prev = null; }",
      "}",
      "class DoublyLinkedList {",
      "  constructor() { this.head = null; this.tail = null; }",
      "  // ... operations below ...",
      "}",
    ],
    insertHead: [
      "insertHead(data) {",
      "  const newNode = new Node(data);",
      "  if (!this.head) { this.head = newNode; this.tail = newNode; }",
      "  else { newNode.next = this.head; this.head.prev = newNode; this.head = newNode; }",
      "}",
    ],
    insertTail: [
      "insertTail(data) {",
      "  const newNode = new Node(data);",
      "  if (!this.tail) { this.head = newNode; this.tail = newNode; }",
      "  else { newNode.prev = this.tail; this.tail.next = newNode; this.tail = newNode; }",
      "}",
    ],
    insertAtPosition: [
      "insertAtPosition(data, position) {",
      "  const newNode = new Node(data);",
      "  if (position === 0) { this.insertHead(data); return; }",
      "  let current = this.head; let count = 0;",
      "  while (current && count < position) { current = current.next; count++; }",
      "  if (current) { // Insert before current",
      "    newNode.next = current; newNode.prev = current.prev;",
      "    if (current.prev) current.prev.next = newNode;",
      "    else this.head = newNode; // current was head, new node becomes head",
      "    current.prev = newNode;",
      "  } else if (count === position) { this.insertTail(data); } // Insert at end",
      "}",
    ],
    deleteByValue: [
      "deleteByValue(data) {",
      "  let current = this.head;",
      "  while (current) {",
      "    if (current.data === data) {",
      "      if (current.prev) current.prev.next = current.next;",
      "      else this.head = current.next; // Deleting head",
      "      if (current.next) current.next.prev = current.prev;",
      "      else this.tail = current.prev; // Deleting tail",
      "      return data;",
      "    }",
      "    current = current.next;",
      "  }",
      "  return null;",
      "}",
    ],
    deleteAtPosition: [
      "deleteAtPosition(position) {",
      "  if (!this.head || position < 0) return null;",
      "  let current = this.head; let count = 0;",
      "  while (current && count < position) { current = current.next; count++; }",
      "  if (current) { // Node at position found",
      "    if (current.prev) current.prev.next = current.next;",
      "    else this.head = current.next;",
      "    if (current.next) current.next.prev = current.prev;",
      "    else this.tail = current.prev;",
      "    if (this.head === null) this.tail = null; // List became empty",
      "    // return current.data;",
      "  }",
      "}",
    ],
    traverse: [
      "traverseForward() { /* ... */ }",
      "traverseBackward() { /* ... */ }",
    ],
    init: [ "// Select an operation" ]
  },
  Python: {
    structure: [
      "class Node:",
      "    def __init__(self, data):",
      "        self.data = data; self.next = None; self.prev = None",
      "class DoublyLinkedList:",
      "    def __init__(self):",
      "        self.head = None; self.tail = None",
    ],
    insertHead: [
      "    def insert_head(self, data):",
      "        new_node = Node(data)",
      "        if not self.head: self.head = self.tail = new_node",
      "        else: new_node.next = self.head; self.head.prev = new_node; self.head = new_node",
    ],
    insertTail: [
      "    def insert_tail(self, data):",
      "        new_node = Node(data)",
      "        if not self.tail: self.head = self.tail = new_node",
      "        else: new_node.prev = self.tail; self.tail.next = new_node; self.tail = new_node",
    ],
    insertAtPosition: [
      "    def insert_at_position(self, data, position):",
      "        # ... Similar logic, handle edge cases for head/tail/empty ...",
    ],
    deleteByValue: [
      "    def delete_by_value(self, data):",
      "        # ... Traversal and pointer updates ...",
    ],
    deleteAtPosition: [
      "    def delete_at_position(self, position):",
      "        # ... Traversal and pointer updates, handle head/tail ...",
    ],
    traverse: [
      "    def traverse_forward(self): # ...",
      "    def traverse_backward(self): # ...",
    ],
    init: [ "# Select an operation" ]
  },
  Java: {
     structure: [
      "class Node { int data; Node next, prev; Node(int d) { data = d; } }",
      "class DoublyLinkedList { Node head, tail; }",
    ],
    insertHead: [
      "    public void insertHead(int data) { /* ... */ }",
    ],
    insertTail: [
      "    public void insertTail(int data) { /* ... */ }",
    ],
    insertAtPosition: [
      "    public void insertAtPosition(int data, int position) { /* ... */ }",
    ],
    deleteByValue: [
      "    public boolean deleteByValue(int data) { /* ... */ }",
    ],
    deleteAtPosition: [
      "    public Integer deleteAtPosition(int position) { /* ... */ }",
    ],
    traverse: [
      "    public void traverseForward() { /* ... */ }",
    ],
    init: [ "// Select an operation" ]
  },
  "C++": {
    structure: [
      "struct Node { int data; Node *next, *prev; Node(int d):data(d),next(nullptr),prev(nullptr){} };",
      "class DoublyLinkedList { public: Node *head, *tail; DoublyLinkedList():head(nullptr),tail(nullptr){} };",
    ],
    insertHead: [
      "    void insertHead(int data) { /* ... */ }",
    ],
    insertTail: [
      "    void insertTail(int data) { /* ... */ }",
    ],
    insertAtPosition: [
      "    void insertAtPosition(int data, int position) { /* ... */ }",
    ],
    deleteByValue: [
      "    bool deleteByValue(int data) { /* ... */ }",
    ],
    deleteAtPosition: [
      "    int deleteAtPosition(int position) { /* ... */ }",
    ],
    traverse: [
      "    void traverseForward() { /* ... */ }",
    ],
    init: [ "// Select an operation" ]
  }
};

interface DoublyLinkedListCodePanelProps {
  currentLine: number | null;
  currentOperation: LinkedListOperation | null;
}

export function DoublyLinkedListCodePanel({ currentLine, currentOperation }: DoublyLinkedListCodePanelProps) {
  const { toast } = useToast();
  const effectiveOperation = currentOperation || 'init'; 
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const languages = Object.keys(DOUBLY_LINKED_LIST_OPERATIONS_CODE);

  const structureCode = DOUBLY_LINKED_LIST_OPERATIONS_CODE[selectedLanguage]?.structure || [];
  const operationCode = DOUBLY_LINKED_LIST_OPERATIONS_CODE[selectedLanguage]?.[effectiveOperation] || [];
  
  const codeToDisplay = useMemo(() => {
    if (effectiveOperation === 'init' || !operationCode.length) {
        return structureCode.length > 0 ? structureCode : ["// Please select an operation."];
    }
    return [
      ...structureCode,
      ...(operationCode.length > 0 ? ["", `// --- ${effectiveOperation.replace(/([A-Z])/g, ' $1').trim()} Method ---`] : []),
      ...operationCode,
    ];
  }, [structureCode, operationCode, effectiveOperation]);

  const handleCopyCode = () => {
     const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} DLL Code Copied!` }))
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
        <div className="flex items-center gap-2">
            <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 h-8 text-xs p-0.5">
                    {languages.map(lang => (
                        <TabsTrigger key={lang} value={lang} className="text-xs px-1.5 py-0.5 h-auto">
                            {lang}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0 || (codeToDisplay.length === 1 && codeToDisplay[0].startsWith("// Please select"))}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
             {codeToDisplay.map((line, index) => {
                let lineIsHighlighted = false;
                if (currentLine !== null) {
                    const structureLength = structureCode.length;
                    const separatorLines = (effectiveOperation !== 'init' && operationCode.length > 0) ? 2 : 0;
                    const operationLineNumberForHighlight = currentLine; 

                    if (index < structureLength) {
                        // No special highlight for structure lines during operations for now
                    } else if (index >= structureLength + separatorLines) {
                        const relativeOpLineIndex = index - (structureLength + separatorLines);
                        if (relativeOpLineIndex + 1 === operationLineNumberForHighlight) {
                           lineIsHighlighted = true;
                        }
                    }
                }
                return (
                  <div key={`${effectiveOperation}-${selectedLanguage}-line-${index}`}
                    className={`px-2 py-0.5 rounded ${
                      lineIsHighlighted ? "bg-accent text-accent-foreground" : "text-foreground"
                    }`}
                    aria-current={lineIsHighlighted ? "step" : undefined}
                  >
                    <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                      {index + 1} 
                    </span>
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