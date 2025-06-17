
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
  structure: [ 
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
    "// insertHead(data) {",              
    "  const newNode = new Node(data);",  
    "  newNode.next = this.head;",         
    "  this.head = newNode;",              
    "// }",                               
  ],
  insertTail: [
    "// insertTail(data) {",               
    "  const newNode = new Node(data);",   
    "  if (!this.head) {",                 
    "    this.head = newNode; return;",    
    "  }",
    "  let current = this.head;",          
    "  while (current.next) {",            
    "    current = current.next;",         
    "  }",
    "  current.next = newNode;",           
    "// }",                                
  ],
  insertAtPosition: [
    "// insertAtPosition(data, position) {",
    "  const newNode = new Node(data);",
    "  if (position === 0) { /* Use insertHead logic */ return; }",
    "  let current = this.head, prev = null, count = 0;",
    "  while (current && count < position) {",
    "    prev = current; current = current.next; count++;",
    "  }",
    "  if (prev) { prev.next = newNode; newNode.next = current; }",
    "  else { /* Handle empty list or invalid position */ }",
    "// }",
  ],
  deleteByValue: [
    "// deleteByValue(data) {",               
    "  if (!this.head) return null;",       
    "  if (this.head.data === data) {",    
    "    this.head = this.head.next; return data;", 
    "  }",
    "  let current = this.head, prev = null;", 
    "  while (current && current.data !== data) {", 
    "    prev = current; current = current.next;",   
    "  }",
    "  if (current) {",                        
    "    prev.next = current.next;",           
    "    return data;",                       
    "  }",
    "  return null;",                           
    "// }",                                    
  ],
  deleteAtPosition: [
    "// deleteAtPosition(position) {",
    "  if (!this.head || position < 0) return null;",
    "  if (position === 0) { this.head = this.head.next; return; }",
    "  let current = this.head, prev = null, count = 0;",
    "  while (current && count < position) {",
    "    prev = current; current = current.next; count++;",
    "  }",
    "  if (current && prev) { prev.next = current.next; }",
    "  // else position out of bounds or list too short",
    "// }",
  ],
   search: [
    "// search(data) {",                       
    "  let current = this.head, index = 0;", 
    "  while (current) {",                     
    "    if (current.data === data) {",      
    "      return { node: current, index };", 
    "    }",
    "    current = current.next;",             
    "    index++;",                           
    "  }",
    "  return null;",                           
    "// }",                                    
  ],
  traverse: [
    "// traverse() {",                         
    "  let current = this.head, result = [];",
    "  while (current) {",                     
    "    result.push(current.data);",         
    "    current = current.next;",             
    "  }",
    "  return result;",                         
    "// }",                                    
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
                    index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"
                  }`}
                  aria-current={index + 1 === currentLine ? "step" : undefined}
                >
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                    {index + 1} 
                  </span>
                  {line.startsWith("//") ? line : `    ${line}`} 
                </div>
              ))}
            </pre>
          </ScrollArea>
      </CardContent>
    </Card>
  );
}

