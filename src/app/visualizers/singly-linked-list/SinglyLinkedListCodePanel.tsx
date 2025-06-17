
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
export const SINGLY_LINKED_LIST_OPERATIONS_CODE: Record<string, Record<string, string[]>> = {
  JavaScript: {
    structure: [
      "class Node {",
      "  constructor(data) { this.data = data; this.next = null; }",
      "}",
      "class SinglyLinkedList {",
      "  constructor() { this.head = null; }",
      "  // ... operations below ...",
      "}",
    ],
    insertHead: [
      "insertHead(data) {",
      "  const newNode = new Node(data);",
      "  newNode.next = this.head;",
      "  this.head = newNode;",
      "}",
    ],
    insertTail: [
      "insertTail(data) {",
      "  const newNode = new Node(data);",
      "  if (!this.head) { this.head = newNode; return; }",
      "  let current = this.head;",
      "  while (current.next) { current = current.next; }",
      "  current.next = newNode;",
      "}",
    ],
    insertAtPosition: [
      "insertAtPosition(data, position) {",
      "  const newNode = new Node(data);",
      "  if (position === 0) { this.insertHead(data); return; }",
      "  let current = this.head, prev = null, count = 0;",
      "  while (current && count < position) {",
      "    prev = current; current = current.next; count++;",
      "  }",
      "  if (prev) { prev.next = newNode; newNode.next = current; }",
      "  else if (position === 0) { /* handled above */ }", // Or if list was empty and pos > 0
      "}",
    ],
    deleteByValue: [
      "deleteByValue(data) {",
      "  if (!this.head) return null;",
      "  if (this.head.data === data) { this.head = this.head.next; return data; }",
      "  let current = this.head, prev = null;",
      "  while (current && current.data !== data) {",
      "    prev = current; current = current.next;",
      "  }",
      "  if (current && prev) { prev.next = current.next; return data; }", // Ensure prev is not null
      "  return null;",
      "}",
    ],
    deleteAtPosition: [
      "deleteAtPosition(position) {",
      "  if (!this.head || position < 0) return null;",
      "  if (position === 0) { this.head = this.head.next; return; }",
      "  let current = this.head, prev = null, count = 0;",
      "  while (current && count < position) {",
      "    prev = current; current = current.next; count++;",
      "  }",
      "  if (current && prev) { prev.next = current.next; }",
      "}",
    ],
    search: [
      "search(data) {",
      "  let current = this.head, index = 0;",
      "  while (current) {",
      "    if (current.data === data) return { node: current, index };",
      "    current = current.next; index++;",
      "  }",
      "  return null;",
      "}",
    ],
    traverse: [
      "traverse() {",
      "  let current = this.head, result = [];",
      "  while (current) { result.push(current.data); current = current.next; }",
      "  return result;",
      "}",
    ],
    init: [ "// Select an operation to see its code." ]
  },
  Python: {
    structure: [
      "class Node:",
      "    def __init__(self, data):",
      "        self.data = data",
      "        self.next = None",
      "class SinglyLinkedList:",
      "    def __init__(self):",
      "        self.head = None",
    ],
    insertHead: [
      "    def insert_head(self, data):",
      "        new_node = Node(data)",
      "        new_node.next = self.head",
      "        self.head = new_node",
    ],
    insertTail: [
      "    def insert_tail(self, data):",
      "        new_node = Node(data)",
      "        if not self.head:",
      "            self.head = new_node",
      "            return",
      "        current = self.head",
      "        while current.next:",
      "            current = current.next",
      "        current.next = new_node",
    ],
    insertAtPosition: [
      "    def insert_at_position(self, data, position):",
      "        new_node = Node(data)",
      "        if position == 0:",
      "            self.insert_head(data)",
      "            return",
      "        current = self.head",
      "        prev_node = None", 
      "        count = 0",
      "        while current and count < position:",
      "            prev_node = current",
      "            current = current.next",
      "            count += 1",
      "        if prev_node:",
      "            prev_node.next = new_node",
      "            new_node.next = current",
    ],
    deleteByValue: [
      "    def delete_by_value(self, data):",
      "        if not self.head: return None",
      "        if self.head.data == data:",
      "            self.head = self.head.next",
      "            return data",
      "        current = self.head",
      "        prev_node = None", 
      "        while current and current.data != data:",
      "            prev_node = current",
      "            current = current.next",
      "        if current and prev_node: # Ensure prev_node exists",
      "            prev_node.next = current.next",
      "            return data",
      "        return None",
    ],
    deleteAtPosition: [
      "    def delete_at_position(self, position):",
      "        if not self.head or position < 0: return",
      "        if position == 0:",
      "            self.head = self.head.next",
      "            return",
      "        current = self.head",
      "        prev_node = None",
      "        count = 0",
      "        while current and count < position:",
      "            prev_node = current",
      "            current = current.next",
      "            count += 1",
      "        if current and prev_node:",
      "            prev_node.next = current.next",
    ],
    search: [
      "    def search(self, data):",
      "        current = self.head",
      "        index = 0",
      "        while current:",
      "            if current.data == data:",
      "                return {'node_value': current.data, 'index': index} # Returning value instead of node object for simplicity",
      "            current = current.next",
      "            index += 1",
      "        return None",
    ],
    traverse: [
      "    def traverse(self):",
      "        current = self.head",
      "        result = []",
      "        while current:",
      "            result.append(current.data)",
      "            current = current.next",
      "        return result",
    ],
    init: [ "# Select an operation" ]
  },
  Java: {
    structure: [
      "class Node {",
      "    int data; Node next;",
      "    Node(int d) { data = d; next = null; }",
      "}",
      "class SinglyLinkedList {",
      "    Node head;",
    ],
    insertHead: [
      "    public void insertHead(int data) {",
      "        Node newNode = new Node(data);",
      "        newNode.next = head;",
      "        head = newNode;",
      "    }",
    ],
    insertTail: [
      "    public void insertTail(int data) {",
      "        Node newNode = new Node(data);",
      "        if (head == null) { head = newNode; return; }",
      "        Node current = head;",
      "        while (current.next != null) { current = current.next; }",
      "        current.next = newNode;",
      "    }",
    ],
     insertAtPosition: [
      "    public void insertAtPosition(int data, int position) {",
      "        Node newNode = new Node(data);",
      "        if (position == 0) { insertHead(data); return; }",
      "        Node current = head; Node prev = null; int count = 0;",
      "        while (current != null && count < position) {",
      "            prev = current; current = current.next; count++;",
      "        }",
      "        if (prev != null) { prev.next = newNode; newNode.next = current; }",
      "        else if (position == 0) { /* Handled */ }",
      "    }",
    ],
    deleteByValue: [
      "    public Integer deleteByValue(int data) {",
      "        if (head == null) return null;",
      "        if (head.data == data) { head = head.next; return data; }",
      "        Node current = head; Node prev = null;",
      "        while (current != null && current.data != data) {",
      "            prev = current; current = current.next;",
      "        }",
      "        if (current != null && prev != null) { prev.next = current.next; return data; }", // Ensure prev is not null
      "        return null;",
      "    }",
    ],
    deleteAtPosition: [
      "    public void deleteAtPosition(int position) {",
      "        if (head == null || position < 0) return;",
      "        if (position == 0) { head = head.next; return; }",
      "        Node current = head; Node prev = null; int count = 0;",
      "        while (current != null && count < position) {",
      "            prev = current; current = current.next; count++;",
      "        }",
      "        if (current != null && prev != null) { prev.next = current.next; }",
      "    }",
    ],
    search: [
      "    public Node search(int data) { // Returns node if found",
      "        Node current = head; // int index = 0; (if returning index)",
      "        while (current != null) {",
      "            if (current.data == data) return current; // Or return index",
      "            current = current.next; // index++;",
      "        }",
      "        return null;",
      "    }",
    ],
    traverse: [
      "    public void traverse() { // Example: prints elements",
      "        Node current = head;",
      "        while (current != null) {",
      "            System.out.print(current.data + \" -> \");",
      "            current = current.next;",
      "        }",
      "        System.out.println(\"null\");",
      "    }",
    ],
    init: [ "// Select an operation" ]
  },
  "C++": {
    structure: [
      "struct Node {",
      "    int data; Node* next;",
      "    Node(int d) : data(d), next(nullptr) {}",
      "};",
      "class SinglyLinkedList {",
      "public:",
      "    Node* head;",
      "    SinglyLinkedList() : head(nullptr) {}",
      "    // Destructor to free memory would be needed here",
    ],
    insertHead: [
      "    void insertHead(int data) {",
      "        Node* newNode = new Node(data);",
      "        newNode->next = head;",
      "        head = newNode;",
      "    }",
    ],
    insertTail: [
      "    void insertTail(int data) {",
      "        Node* newNode = new Node(data);",
      "        if (!head) { head = newNode; return; }",
      "        Node* current = head;",
      "        while (current->next) { current = current->next; }",
      "        current->next = newNode;",
      "    }",
    ],
    insertAtPosition: [
      "    void insertAtPosition(int data, int position) {",
      "        Node* newNode = new Node(data);",
      "        if (position == 0) { insertHead(data); return; }",
      "        Node* current = head; Node* prev = nullptr; int count = 0;",
      "        while (current && count < position) {",
      "            prev = current; current = current->next; count++;",
      "        }",
      "        if (prev) { prev->next = newNode; newNode->next = current; }",
      "        else if (position == 0) { /* Handled */ }",
      "    }",
    ],
    deleteByValue: [
      "    bool deleteByValue(int data) {",
      "        if (!head) return false;",
      "        if (head->data == data) { Node* temp = head; head = head->next; delete temp; return true; }",
      "        Node* current = head; Node* prev = nullptr;",
      "        while (current && current->data != data) {",
      "            prev = current; current = current->next;",
      "        }",
      "        if (current && prev) { prev->next = current->next; delete current; return true; }", // Ensure prev is not null
      "        return false;",
      "    }",
    ],
    deleteAtPosition: [
      "    void deleteAtPosition(int position) {",
      "        if (!head || position < 0) return;",
      "        Node* temp = head;",
      "        if (position == 0) { head = head->next; delete temp; return; }",
      "        Node* prev = nullptr; int count = 0;",
      "        while (temp && count < position) {",
      "            prev = temp; temp = temp->next; count++;",
      "        }",
      "        if (temp && prev) { prev->next = temp->next; delete temp; }",
      "    }",
    ],
    search: [
      "    Node* search(int data) { // Returns node pointer",
      "        Node* current = head;",
      "        while (current) {",
      "            if (current->data == data) return current;",
      "            current = current->next;",
      "        }",
      "        return nullptr;",
      "    }",
    ],
    traverse: [
      "    void traverse() { // Example: prints elements",
      "        Node* current = head;",
      "        while (current) {",
      "            // std::cout << current->data << \" -> \";",
      "            current = current->next;",
      "        }",
      "        // std::cout << \"null\" << std::endl;",
      "    }",
    ],
    init: [ "// Select an operation" ]
  }
};


interface SinglyLinkedListCodePanelProps {
  currentLine: number | null;
  currentOperation: LinkedListOperation | null;
}

export function SinglyLinkedListCodePanel({ currentLine, currentOperation }: SinglyLinkedListCodePanelProps) {
  const { toast } = useToast();
  const effectiveOperation = currentOperation || 'init'; 
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const languages = Object.keys(SINGLY_LINKED_LIST_OPERATIONS_CODE);

  const structureCode = SINGLY_LINKED_LIST_OPERATIONS_CODE[selectedLanguage]?.structure || [];
  const operationCode = SINGLY_LINKED_LIST_OPERATIONS_CODE[selectedLanguage]?.[effectiveOperation] || [];
  
  const codeToDisplay = useMemo(() => {
    if (effectiveOperation === 'init' || !operationCode.length) { // Show only structure for 'init' or if op code is missing
        return structureCode.length > 0 ? structureCode : ["// Please select an operation to view its code."];
    }
    return [
      ...structureCode,
      ...(operationCode.length > 0 ? ["", `// --- ${effectiveOperation.replace(/([A-Z])/g, ' $1').trim()} Method ---`] : []),
      ...operationCode
    ];
  }, [structureCode, operationCode, effectiveOperation]);


  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => {
          toast({ title: `${selectedLanguage} SLL Code Copied!`, description: "Structure and operation code copied." });
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
            <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={!codeToDisplay || codeToDisplay.length === 0 || (codeToDisplay.length === 1 && codeToDisplay[0].startsWith("// Please select"))}>
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
          <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
            <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
              {codeToDisplay.map((line, index) => {
                // Determine if this line is part of the structure or the operation for highlighting
                let lineIsHighlighted = false;
                if (currentLine !== null) {
                    const structureLength = structureCode.length;
                    const separatorLines = (effectiveOperation !== 'init' && operationCode.length > 0) ? 2 : 0; // For "" and "// --- METHOD ---"
                    const operationLineNumberForHighlight = currentLine; 

                    if (index < structureLength) { // Line is part of structure
                         // Highlight structure lines only if currentLine refers to them (e.g., op is 'init' or no op line map)
                         // This is tricky; assume structure lines aren't highlighted when specific op lines are
                    } else if (index >= structureLength + separatorLines) { // Line is part of operation
                        const relativeOpLineIndex = index - (structureLength + separatorLines);
                        if (relativeOpLineIndex + 1 === operationLineNumberForHighlight) {
                           lineIsHighlighted = true;
                        }
                    }
                }
                return (
                  <div
                    key={`${effectiveOperation}-${selectedLanguage}-line-${index}`}
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

