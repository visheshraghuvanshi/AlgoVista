
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { HeapOperationType, HEAP_OPERATION_LINE_MAPS } from './heap-operations-logic';

export const HEAP_CODE_SNIPPETS: Record<HeapOperationType | 'classDefinition', string[]> = {
  classDefinition: [
    "// MinHeap Example (can be adapted for MaxHeap)",
    "class MinHeap {",
    "  constructor() { this.heap = []; }",
    "  getParentIndex(i) { return Math.floor((i - 1) / 2); }",
    "  getLeftChildIndex(i) { return 2 * i + 1; }",
    "  getRightChildIndex(i) { return 2 * i + 2; }",
    "  swap(i1, i2) { [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]]; }",
    "  // ... other methods below ...",
    "}",
  ],
  insertMinHeap: [
    "// Insert into MinHeap",
    "insert(value) {",
    "  this.heap.push(value);",
    "  this.heapifyUp(this.heap.length - 1);",
    "}",
    "heapifyUp(index) {",
    "  let parentIndex = this.getParentIndex(index);",
    "  while (index > 0 && this.heap[index] < this.heap[parentIndex]) {",
    "    this.swap(index, parentIndex);",
    "    index = parentIndex;",
    "    parentIndex = this.getParentIndex(index);",
    "  }",
    "}",
  ],
  extractMin: [
    "// Extract Min from MinHeap",
    "extractMin() {",
    "  if (this.heap.length === 0) return null;",
    "  if (this.heap.length === 1) return this.heap.pop();",
    "  const min = this.heap[0];",
    "  this.heap[0] = this.heap.pop(); // Move last to root",
    "  this.heapifyDown(0);",
    "  return min;",
    "}",
    "heapifyDown(index) {",
    "  let smallest = index;",
    "  const left = this.getLeftChildIndex(index);",
    "  const right = this.getRightChildIndex(index);",
    "  if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {",
    "    smallest = left;",
    "  }",
    "  if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {",
    "    smallest = right;",
    "  }",
    "  if (smallest !== index) {",
    "    this.swap(index, smallest);",
    "    this.heapifyDown(smallest);",
    "  }",
    "}",
  ],
  buildMinHeap: [
    "// Build MinHeap from an array (O(n))",
    "buildHeapFromArray(array) {",
    "  this.heap = [...array]; // Copy array",
    "  // Start from the last non-leaf node and heapify down",
    "  const firstNonLeafIndex = Math.floor(this.heap.length / 2) - 1;",
    "  for (let i = firstNonLeafIndex; i >= 0; i--) {",
    "    this.heapifyDown(i);",
    "  }",
    "}",
    "// (heapifyDown is defined in 'extractMin' snippet)",
  ],
};

interface HeapOperationsCodePanelProps {
  currentLine: number | null;
  selectedOperation: HeapOperationType; 
}

export function HeapOperationsCodePanel({ currentLine, selectedOperation }: HeapOperationsCodePanelProps) {
  const { toast } = useToast();
  
  const codeToDisplay = HEAP_CODE_SNIPPETS[selectedOperation] || HEAP_CODE_SNIPPETS.classDefinition;
  const operationLabel = selectedOperation.replace(/([A-Z])/g, ' $1').trim();

  const handleCopyCode = () => {
    // For a more complete copy, one might combine classDef with operation, but for simplicity, just copy current view.
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${operationLabel} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {operationLabel}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {/* Optionally show class definition first if not the selected operation */}
            {selectedOperation !== 'classDefinition' && (
                <>
                    {HEAP_CODE_SNIPPETS.classDefinition.map((line,index)=>(
                        <div key={`class-def-line-${index}`} className="px-2 py-0.5 rounded text-muted-foreground/70 opacity-70">
                             <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                             {line}
                        </div>
                    ))}
                    <div className="my-2 border-b border-dashed border-muted-foreground/30"></div>
                </>
            )}
            {codeToDisplay.map((line, index) => (
              <div key={`${operationLabel}-line-${index}`}
                className={`px-2 py-0.5 rounded ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                {line}
              </div>
            ))}
            {codeToDisplay.length === 0 && <p className="text-muted-foreground">Select an operation to view code.</p>}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

