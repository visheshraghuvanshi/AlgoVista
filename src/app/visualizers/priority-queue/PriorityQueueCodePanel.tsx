
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRIORITY_QUEUE_LINE_MAP } from './priority-queue-logic';

// Conceptual code snippets for a Min-Priority Queue (heap-based)
const PRIORITY_QUEUE_OPERATIONS_CODE: Record<string, Record<string, string[]>> = {
  JavaScript: {
    structure: [
      "class PriorityQueue {",
      "  constructor() { this.heap = []; /* Min-Heap */ }",
      "  getParent(i) { return Math.floor((i - 1) / 2); }",
      "  getLeft(i) { return 2 * i + 1; }",
      "  getRight(i) { return 2 * i + 2; }",
      "  swap(i, j) { [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]; }",
      "  // ... operations below ...",
      "}",
    ],
    enqueue: [
      "enqueue(item, priority) {",
      "  this.heap.push({ item, priority });",
      "  this._heapifyUp(this.heap.length - 1);",
      "}",
      "_heapifyUp(index) {",
      "  let parent = this.getParent(index);",
      "  while (index > 0 && this.heap[index].priority < this.heap[parent].priority) {",
      "    this.swap(index, parent);",
      "    index = parent;",
      "    parent = this.getParent(index);",
      "  }",
      "}",
    ],
    dequeue: [
      "dequeue() { // Extracts element with min priority",
      "  if (this.heap.length === 0) return null;",
      "  if (this.heap.length === 1) return this.heap.pop();",
      "  const minItem = this.heap[0];",
      "  this.heap[0] = this.heap.pop();",
      "  this._heapifyDown(0);",
      "  return minItem;",
      "}",
      "_heapifyDown(index) {",
      "  let smallest = index;",
      "  const left = this.getLeft(index); const right = this.getRight(index);",
      "  if (left < this.heap.length && this.heap[left].priority < this.heap[smallest].priority) {",
      "    smallest = left;",
      "  }",
      "  if (right < this.heap.length && this.heap[right].priority < this.heap[smallest].priority) {",
      "    smallest = right;",
      "  }",
      "  if (smallest !== index) {",
      "    this.swap(index, smallest);",
      "    this._heapifyDown(smallest);",
      "  }",
      "}",
    ],
    peek: [
      "peek() {",
      "  if (this.heap.length === 0) return null;",
      "  return this.heap[0];",
      "}",
    ],
  },
  Python: {
    structure: [
        "import heapq",
        "class PriorityQueue:",
        "    def __init__(self):",
        "        self._heap = []  # Stores (priority, item) tuples",
        "        self._index = 0 # To handle tie-breaking for same priority",
    ],
    enqueue: [
        "    def enqueue(self, item, priority):",
        "        heapq.heappush(self._heap, (priority, self._index, item))",
        "        self._index += 1",
    ],
    dequeue: [
        "    def dequeue(self): # Extracts element with min priority",
        "        if not self._heap: return None",
        "        return heapq.heappop(self._heap)[2] # Return item part of tuple",
    ],
    peek: [
        "    def peek(self):",
        "        if not self._heap: return None",
        "        return self._heap[0][2] # Return item part of tuple",
    ],
  },
  Java: {
     structure: [
      "import java.util.PriorityQueue;",
      "// Using Java's built-in PriorityQueue (Min-Heap by default)",
      "// To store custom objects, they need to be Comparable or provide a Comparator.",
      "// Example with simple Integers (priorities are the values themselves)",
      "// PriorityQueue<Integer> pq = new PriorityQueue<>();",
      "",
      "// For custom items with priority:",
      "class PQEntry implements Comparable<PQEntry> {",
      "    Object item;",
      "    int priority;",
      "    public PQEntry(Object item, int priority) { this.item = item; this.priority = priority; }",
      "    @Override",
      "    public int compareTo(PQEntry other) { return this.priority - other.priority; }",
      "}",
      "PriorityQueue<PQEntry> pq = new PriorityQueue<>();",
    ],
    enqueue: [
      "// Enqueue (add)",
      "// pq.add(new PQEntry(itemValue, itemPriority));",
    ],
    dequeue: [
      "// Dequeue (poll - removes and returns head, min element)",
      "// if (!pq.isEmpty()) { PQEntry minEntry = pq.poll(); }",
    ],
    peek: [
      "// Peek (element - retrieves but does not remove head)",
      "// if (!pq.isEmpty()) { PQEntry minEntry = pq.peek(); }",
    ],
  },
  "C++": {
    structure: [
      "#include <queue> // For std::priority_queue",
      "#include <vector>",
      "#include <functional> // For std::greater",
      "// std::priority_queue is a Max-Heap by default.",
      "// To make it a Min-Heap for integers:",
      "// std::priority_queue<int, std::vector<int>, std::greater<int>> pq;",
      "",
      "// For custom items with priority:",
      "struct PQEntry {",
      "    // Your item type here, e.g., std::string item;",
      "    int priority;",
      "    bool operator>(const PQEntry& other) const { return priority > other.priority; } // For Min-Heap",
      "};",
      "std::priority_queue<PQEntry, std::vector<PQEntry>, std::greater<PQEntry>> pq;",
    ],
    enqueue: [
      "// Enqueue (push)",
      "// pq.push({itemValue, itemPriority});",
    ],
    dequeue: [
      "// Dequeue (pop - removes top, which is min for std::greater)",
      "// if (!pq.empty()) { PQEntry minEntry = pq.top(); pq.pop(); }",
    ],
    peek: [
      "// Peek (top - returns const ref to top element)",
      "// if (!pq.empty()) { PQEntry minEntry = pq.top(); }",
    ],
  },
};

interface PriorityQueueCodePanelProps {
  currentLine: number | null;
  selectedOperation: 'enqueue' | 'dequeue' | 'peek' | 'init';
}

export function PriorityQueueCodePanel({ currentLine, selectedOperation }: PriorityQueueCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(PRIORITY_QUEUE_OPERATIONS_CODE), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const effectiveOp = selectedOperation === 'init' ? 'structure' : selectedOperation;
  const codeSnippetsForLang = PRIORITY_QUEUE_OPERATIONS_CODE[selectedLanguage] || PRIORITY_QUEUE_OPERATIONS_CODE.JavaScript;
  const codeToDisplay = codeSnippetsForLang[effectiveOp] || [];
  const structureCode = codeSnippetsForLang.structure || [];

  const handleCopyCode = () => {
    const opCodeString = codeToDisplay.join('\n');
    let fullCode = "";
    if (effectiveOp !== 'structure') {
        const baseStructure = structureCode.join('\n');
        // Smart indentation based on language
        const indent = (selectedLanguage === "Python" || selectedLanguage === "Java" || selectedLanguage === "C++") ? "    " : "  ";
        const operationIndented = opCodeString.split('\n').map(line => `${indent}${line}`).join('\n');
        
        if (selectedLanguage === "JavaScript" || selectedLanguage === "Java" || selectedLanguage === "C++") {
             fullCode = `${baseStructure}\n${operationIndented}\n}`; // Close class
        } else if (selectedLanguage === "Python") {
             fullCode = `${baseStructure}\n${operationIndented}`; 
        }
    } else {
        fullCode = structureCode.join('\n');
    }
    
    if (fullCode.trim()) {
      navigator.clipboard.writeText(fullCode)
        .then(() => toast({ title: `${selectedLanguage} Priority Queue Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    } else {
      toast({ title: "Nothing to Copy", description: "No code available for selection.", variant:"default"});
    }
  };
  
  const operationTitle = effectiveOp.charAt(0).toUpperCase() + effectiveOp.slice(1);

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: {operationTitle}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code">
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="flex flex-col flex-grow overflow-hidden">
          <TabsList className="mx-4 mb-1 self-start shrink-0">
            {languages.map((lang) => (
              <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-1 h-auto">
                {lang}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
            <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
              {effectiveOp !== 'structure' && structureCode.length > 0 && (
                <>
                  {structureCode.map((line, index) => (
                    <div key={`struct-${selectedLanguage}-${index}`} className="px-2 py-0.5 rounded text-muted-foreground/70 opacity-70">
                      <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                      {line}
                    </div>
                  ))}
                  <div className="my-1 border-b border-dashed border-muted-foreground/30"></div>
                </>
              )}
              {codeToDisplay.map((line, index) => (
                <div
                  key={`op-${selectedLanguage}-${index}`}
                  className={`px-2 py-0.5 rounded ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}
                >
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                    {index + 1 + (effectiveOp !== 'structure' && structureCode.length > 0 ? structureCode.length +1 : 0) } 
                  </span>
                   {line}
                </div>
              ))}
            </pre>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

  