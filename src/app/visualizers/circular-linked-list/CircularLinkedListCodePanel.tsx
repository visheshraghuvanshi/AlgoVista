
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LinkedListOperation } from './types'; // Local import

// Updated to include Python, Java, C++
export const CIRCULAR_LINKED_LIST_OPERATIONS_CODE: Record<string, Record<string, string[]>> = {
  JavaScript: {
    structure: [
      "class Node { constructor(data) { this.data = data; this.next = null; } }",
      "class CircularLinkedList {",
      "  constructor() { this.head = null; }",
      "  // ... operations below ...",
      "}",
    ],
    insertHead: [
      "insertHead(data) {",
      "  const newNode = new Node(data);",
      "  if (!this.head) { this.head = newNode; newNode.next = this.head; }",
      "  else { newNode.next = this.head; let current = this.head;",
      "    while (current.next !== this.head) { current = current.next; }",
      "    current.next = newNode; this.head = newNode; }",
      "}",
    ],
    insertAtPosition: [
      "insertAtPosition(data, position) {",
      "  const newNode = new Node(data);",
      "  if (!this.head) { /* handle empty or pos 0 */ if(position===0){this.head=newNode; newNode.next=newNode;} return; }",
      "  if (position === 0) { this.insertHead(data); return; }",
      "  let current = this.head; let count = 0; let prev = null;",
      "  do {",
      "    if (count === position) break;",
      "    prev = current; current = current.next;",
      "    count++;",
      "  } while (current !== this.head && count < position);",
      "  if (prev && count === position) { prev.next = newNode; newNode.next = current; }",
      "  else if (count === position && current === this.head) { /* Insert at end */ prev.next = newNode; newNode.next = this.head; }",
      "}",
    ],
    deleteAtPosition: [
      "deleteAtPosition(position) {",
      "  if (!this.head) return null;",
      "  let current = this.head, prev = null, tail = this.head;",
      "  while(tail.next !== this.head) tail = tail.next;",
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
      "  if (current !== this.head && count === position && prev) { prev.next = current.next; }", // Ensure prev is not null
      "  else if (current === this.head && count < position) { /* Pos out of bounds */ }",
      "}",
    ],
    traverse: [
      "traverse() {",
      "  if (!this.head) return []; const result = []; let current = this.head;",
      "  do { result.push(current.data); current = current.next; } while (current !== this.head);",
      "  return result;",
      "}",
    ],
    init: [ "// Select an operation" ]
  },
  Python: {
    structure: [
      "class Node:",
      "    def __init__(self, data): self.data = data; self.next = None",
      "class CircularLinkedList:",
      "    def __init__(self): self.head = None",
    ],
    insertHead: [
      "    def insert_head(self, data):",
      "        new_node = Node(data)",
      "        if not self.head: self.head = new_node; new_node.next = self.head",
      "        else:",
      "            new_node.next = self.head",
      "            current = self.head",
      "            while current.next != self.head: current = current.next",
      "            current.next = new_node",
      "            self.head = new_node",
    ],
    insertAtPosition: [
      "    def insert_at_position(self, data, position): # Simplified",
      "        # ... Handle empty, pos 0 (insertHead), and traversal ...",
    ],
    deleteAtPosition: [
      "    def delete_at_position(self, position): # Simplified",
      "        # ... Handle empty, pos 0, and finding node ...",
    ],
    traverse: [
      "    def traverse(self):",
      "        if not self.head: return []",
      "        result, current = [], self.head",
      "        while True:",
      "            result.append(current.data)",
      "            current = current.next",
      "            if current == self.head: break",
      "        return result",
    ],
    init: [ "# Select an operation" ]
  },
  Java: {
     structure: [
      "class Node { int data; Node next; Node(int d){data=d;} }",
      "class CircularLinkedList { Node head; }",
    ],
    insertHead: [
      "    public void insertHead(int data) { /* ... */ }",
    ],
    insertAtPosition: [
      "    public void insertAtPosition(int data, int pos) { /* ... */ }",
    ],
    deleteAtPosition: [
      "    public void deleteAtPosition(int pos) { /* ... */ }",
    ],
    traverse: [
      "    public void traverse() { /* ... */ }",
    ],
    init: [ "// Select an operation" ]
  },
  "C++": {
    structure: [
      "struct Node{ int data; Node* next; Node(int d):data(d),next(nullptr){} };",
      "class CircularLinkedList{ public: Node* head; CircularLinkedList():head(nullptr){} };",
    ],
    insertHead: [
      "    void insertHead(int data) { /* ... */ }",
    ],
    insertAtPosition: [
      "    void insertAtPosition(int data, int pos) { /* ... */ }",
    ],
    deleteAtPosition: [
      "    void deleteAtPosition(int pos) { /* ... */ }",
    ],
    traverse: [
      "    void traverse() { /* ... */ }",
    ],
    init: [ "// Select an operation" ]
  }
};

interface CircularLinkedListCodePanelProps {
  currentLine: number | null;
  currentOperation: LinkedListOperation | null;
}

export function CircularLinkedListCodePanel({ currentLine, currentOperation }: CircularLinkedListCodePanelProps) {
  const { toast } = useToast();
  const effectiveOperation = currentOperation || 'init';
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const languages = Object.keys(CIRCULAR_LINKED_LIST_OPERATIONS_CODE);

  const structureCode = CIRCULAR_LINKED_LIST_OPERATIONS_CODE[selectedLanguage]?.structure || [];
  const operationCode = CIRCULAR_LINKED_LIST_OPERATIONS_CODE[selectedLanguage]?.[effectiveOperation] || [];
  
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
        .then(() => toast({ title: `${selectedLanguage} CLL Code Copied!` }))
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
                    if (index >= structureLength + separatorLines) {
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
