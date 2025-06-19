// src/app/visualizers/stack-queue/StackQueueCodeSnippets.tsx
"use client";

import React, {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { STACK_LINE_MAP, QUEUE_LINE_MAP } from './stack-queue-logic'; // Local import
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const STACK_QUEUE_CODE_SNIPPETS: Record<string, Record<string, string[]>> = {
  JavaScript: {
    stack: [
      "// --- Stack (LIFO) ---",
      "class Stack {",
      "  constructor() { this.items = []; }",
      "  push(element) { this.items.push(element); }",
      "  pop() {",
      "    if (this.isEmpty()) return null;",
      "    return this.items.pop();",
      "  }",
      "  peek() {",
      "    if (this.isEmpty()) return null;",
      "    return this.items[this.items.length - 1];",
      "  }",
      "  isEmpty() { return this.items.length === 0; }",
      "  size() { return this.items.length; }",
      "}",
    ],
    queue: [
      "// --- Queue (FIFO) ---",
      "class Queue {",
      "  constructor() { this.items = []; }",
      "  enqueue(element) { this.items.push(element); }",
      "  dequeue() {",
      "    if (this.isEmpty()) return null;",
      "    return this.items.shift();",
      "  }",
      "  front() {",
      "    if (this.isEmpty()) return null;",
      "    return this.items[0];",
      "  }",
      "  isEmpty() { return this.items.length === 0; }",
      "  size() { return this.items.length; }",
      "}",
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
      "    def dequeue(self):",
      "        if not self.items: return None",
      "        return self.items.popleft()",
      "    def front(self):",
      "        if not self.items: return None",
      "        return self.items[0]",
      "    def is_empty(self): return len(self.items) == 0",
      "    def size(self): return len(self.items)", 
    ]
  },
  Java: {
    stack: [
      "// --- Stack (LIFO) ---",
      "import java.util.ArrayList;",
      "public class MyStack<T> {",
      "    private ArrayList<T> items = new ArrayList<>();",
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
      "import java.util.LinkedList;",
      "import java.util.Queue;",
      "public class MyQueue<T> {",
      "    private Queue<T> items = new LinkedList<>();",
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
      "#include <stdexcept>",
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
      "#include <deque>",
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
          <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
            {codeToDisplay.map((line, index) => {
              let lineIsHighlighted = false;
              if(currentLine) {
                if (structureType === 'stack') {
                    if (index + 1 === currentLine) lineIsHighlighted = true;

                } else if (structureType === 'queue') {
                     if (index + 1 === (currentLine - (Object.keys(STACK_LINE_MAP).length + 1)) ) lineIsHighlighted = true; // Adjusted base for Queue lines
                }
              }

              return (
                <div key={`${structureType}-${selectedLanguage}-line-${index}`}
                  className={`px-2 py-0.5 rounded ${lineIsHighlighted ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
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
