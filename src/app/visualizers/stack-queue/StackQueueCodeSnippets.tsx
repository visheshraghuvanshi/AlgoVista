"use client";

import React, {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { STACK_LINE_MAP, QUEUE_LINE_MAP } from './stack-queue-logic';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const STACK_QUEUE_CODE_SNIPPETS: Record<string, Record<string, string[]>> = {
  JavaScript: {
    stack: [
      "// --- Stack (LIFO) ---",                          // 0
      "class Stack {",                                     // 1 (STACK_LINE_MAP.classDef)
      "  constructor() { this.items = []; }",              // 2 (STACK_LINE_MAP.constructor)
      "  push(element) { this.items.push(element); }",     // 3 (STACK_LINE_MAP.pushStart -> pushToArray -> pushEnd)
      "  pop() {",                                         // 4 (STACK_LINE_MAP.popStart)
      "    if (this.isEmpty()) return null;",             // 5 (STACK_LINE_MAP.popCheckEmpty)
      "    return this.items.pop();",                      // 6 (STACK_LINE_MAP.popFromArray)
      "  }",                                               // 7 (STACK_LINE_MAP.popEnd)
      "  peek() {",                                        // 8 (STACK_LINE_MAP.peekStart)
      "    if (this.isEmpty()) return null;",             // 9 (STACK_LINE_MAP.peekCheckEmpty)
      "    return this.items[this.items.length - 1];",     // 10 (STACK_LINE_MAP.peekReturnTop)
      "  }",                                               // 11 (STACK_LINE_MAP.peekEnd)
      "  isEmpty() { return this.items.length === 0; }",  // 12 (STACK_LINE_MAP.isEmpty)
      "  size() { return this.items.length; }",           // 13 (STACK_LINE_MAP.size)
      "}",                                                 // 14
    ],
    queue: [
      "// --- Queue (FIFO) ---",                          // 15
      "class Queue {",                                     // 16 (QUEUE_LINE_MAP.classDef)
      "  constructor() { this.items = []; }",              // 17 (QUEUE_LINE_MAP.constructor)
      "  enqueue(element) { this.items.push(element); }",  // 18 (enqueueStart -> enqueueToArray -> enqueueEnd)
      "  dequeue() {",                                     // 19 (dequeueStart)
      "    if (this.isEmpty()) return null;",             // 20 (dequeueCheckEmpty)
      "    return this.items.shift();",                    // 21 (dequeueFromArray)
      "  }",                                               // 22 (dequeueEnd)
      "  front() {",                                       // 23 (frontStart)
      "    if (this.isEmpty()) return null;",             // 24 (frontCheckEmpty)
      "    return this.items[0];",                         // 25 (frontReturnFirst)
      "  }",                                               // 26 (frontEnd)
      "  isEmpty() { return this.items.length === 0; }",  // 27 (isEmpty)
      "  size() { return this.items.length; }",           // 28 (size)
      "}",                                                 // 29
    ]
  },
  Python: {
    stack: [
      "# --- Stack (LIFO) ---",
      "class Stack:",
      "    def __init__(self): self.items = []",
      "    def push(self, element): self.items.append(element)",
      "    def pop(self):",
      "        if self.is_empty(): return None",
      "        return self.items.pop()",
      "    def peek(self):",
      "        if self.is_empty(): return None",
      "        return self.items[-1]",
      "    def is_empty(self): return len(self.items) == 0",
      "    def size(self): return len(self.items)",
    ],
    queue: [
      "# --- Queue (FIFO) ---",
      "from collections import deque",
      "class Queue:",
      "    def __init__(self): self.items = deque()",
      "    def enqueue(self, element): self.items.append(element)",
      "    def dequeue():",
      "        if self.is_empty(): return None",
      "        return self.items.popleft()",
      "    def front(self):",
      "        if self.is_empty(): return None",
      "        return self.items[0]",
      "    def is_empty(): return len(self.items) == 0",
      "    def size(): return len(self.items)",
    ]
  },
  Java: {
    stack: [
      "// --- Stack (LIFO) ---",
      "import java.util.Stack; // Or use ArrayList/LinkedList",
      "public class MyStack<T> {",
      "    private java.util.ArrayList<T> items = new java.util.ArrayList<>();",
      "    public void push(T element) { items.add(element); }",
      "    public T pop() {",
      "        if (isEmpty()) return null;",
      "        return items.remove(items.size() - 1);",
      "    }",
      "    public T peek() {",
      "        if (isEmpty()) return null;",
      "        return items.get(items.size() - 1);",
      "    }",
      "    public boolean isEmpty() { return items.isEmpty(); }",
      "    public int size() { return items.size(); }",
      "}",
    ],
    queue: [
      "// --- Queue (FIFO) ---",
      "import java.util.LinkedList; // Implements Queue interface",
      "public class MyQueue<T> {",
      "    private java.util.Queue<T> items = new LinkedList<>();",
      "    public void enqueue(T element) { items.add(element); }",
      "    public T dequeue() {",
      "        if (isEmpty()) return null;",
      "        return items.poll();",
      "    }",
      "    public T front() {",
      "        if (isEmpty()) return null;",
      "        return items.peek();",
      "    }",
      "    public boolean isEmpty() { return items.isEmpty(); }",
      "    public int size() { return items.size(); }",
      "}",
    ]
  },
  "C++": {
    stack: [
      "// --- Stack (LIFO) ---",
      "#include <vector>",
      "#include <stdexcept> // For exceptions if preferred",
      "template<typename T>",
      "class Stack {",
      "private: std::vector<T> items;",
      "public:",
      "    void push(T element) { items.push_back(element); }",
      "    T pop() {",
      "        if (isEmpty()) throw std::out_of_range(\"Stack is empty\");",
      "        T top = items.back(); items.pop_back(); return top;",
      "    }",
      "    T peek() {",
      "        if (isEmpty()) throw std::out_of_range(\"Stack is empty\");",
      "        return items.back();",
      "    }",
      "    bool isEmpty() const { return items.empty(); }",
      "    int size() const { return items.size(); }",
      "};",
    ],
    queue: [
      "// --- Queue (FIFO) ---",
      "#include <deque> // Or use std::list",
      "#include <stdexcept>",
      "template<typename T>",
      "class Queue {",
      "private: std::deque<T> items;",
      "public:",
      "    void enqueue(T element) { items.push_back(element); }",
      "    T dequeue() {",
      "        if (isEmpty()) throw std::out_of_range(\"Queue is empty\");",
      "        T front_val = items.front(); items.pop_front(); return front_val;",
      "    }",
      "    T front() {",
      "        if (isEmpty()) throw std::out_of_range(\"Queue is empty\");",
      "        return items.front();",
      "    }",
      "    bool isEmpty() const { return items.empty(); }",
      "    int size() const { return items.size(); }",
      "};",
    ]
  }
};


interface StackQueueCodeSnippetsPanelProps {
  currentLine: number | null;
  structureType: 'stack' | 'queue';
}

export function StackQueueCodeSnippetsPanel({ currentLine, structureType }: StackQueueCodeSnippetsPanelProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const languages = Object.keys(STACK_QUEUE_CODE_SNIPPETS);

  const codeToDisplay = STACK_QUEUE_CODE_SNIPPETS[selectedLanguage]?.[structureType] || [];
  const title = structureType === 'stack' ? "Stack Code (Conceptual)" : "Queue Code (Conceptual)";

  const handleCopyCode = () => {
    const codeToCopy = codeToDisplay.join('\n');
      
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} ${structureType.charAt(0).toUpperCase() + structureType.slice(1)} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  return (
    <Card className="shadow-lg rounded-lg h-[300px] md:h-[400px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> {title}
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
            <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {codeToDisplay.map((line, index) => {
              // Line highlighting needs context of combined snippet if used, or relative to displayed part.
              // For simplicity, assume currentLine is relative to the specific structure's snippet part.
              let lineIsHighlighted = false;
              if(currentLine) {
                if (structureType === 'stack' && currentLine >= STACK_LINE_MAP.classDef && currentLine <= STACK_LINE_MAP.size + 1) {
                    lineIsHighlighted = (index + STACK_LINE_MAP.classDef === currentLine);
                } else if (structureType === 'queue' && currentLine >= QUEUE_LINE_MAP.classDef && currentLine <= QUEUE_LINE_MAP.size + 1) {
                    lineIsHighlighted = (index + QUEUE_LINE_MAP.classDef === currentLine);
                }
              }

              return (
                <div key={`${structureType}-${selectedLanguage}-line-${index}`}
                  className={`px-2 py-0.5 rounded whitespace-pre-wrap ${lineIsHighlighted ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
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
