"use client";

import React, {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DEQUE_LINE_MAP } from './deque-logic';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const DEQUE_OPERATIONS_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "// Deque (Conceptual using Array)",
    "class Deque {",
    "  constructor() { this.items = []; }",
    "  addFront(element) {",
    "    this.items.unshift(element);",
    "  }",
    "  addRear(element) {",
    "    this.items.push(element);",
    "  }",
    "  removeFront() {",
    "    if (this.isEmpty()) return null;",
    "    return this.items.shift();",
    "  }",
    "  removeRear() {",
    "    if (this.isEmpty()) return null;",
    "    return this.items.pop();",
    "  }",
    "  peekFront() {",
    "    if (this.isEmpty()) return null;",
    "    return this.items[0];",
    "  }",
    "  peekRear() {",
    "    if (this.isEmpty()) return null;",
    "    return this.items[this.items.length - 1];",
    "  }",
    "  isEmpty() { return this.items.length === 0; }",
    "  size() { return this.items.length; }",
    "}",
  ],
  Python: [
    "# Deque (using collections.deque for efficiency)",
    "from collections import deque",
    "class Deque:",
    "    def __init__(self): self.items = deque()",
    "    def addFront(self, element): self.items.appendleft(element)",
    "    def addRear(self, element): self.items.append(element)",
    "    def removeFront(self):",
    "        if not self.items: return None",
    "        return self.items.popleft()",
    "    def removeRear(self):",
    "        if not self.items: return None",
    "        return self.items.pop()",
    "    def peekFront(self):",
    "        if not self.items: return None",
    "        return self.items[0]",
    "    def peekRear(self):",
    "        if not self.items: return None",
    "        return self.items[-1]",
    "    def isEmpty(self): return len(self.items) == 0",
    "    def size(self): return len(self.items)",
  ],
  Java: [
    "// Deque (using java.util.ArrayDeque)",
    "import java.util.ArrayDeque;",
    "import java.util.Deque;",
    "public class MyDeque<T> {",
    "    private Deque<T> items = new ArrayDeque<>();",
    "    public void addFront(T element) { items.addFirst(element); }",
    "    public void addRear(T element) { items.addLast(element); }",
    "    public T removeFront() {",
    "        if (isEmpty()) return null;",
    "        return items.removeFirst();",
    "    }",
    "    public T removeRear() {",
    "        if (isEmpty()) return null;",
    "        return items.removeLast();",
    "    }",
    "    public T peekFront() { return items.peekFirst(); }",
    "    public T peekRear() { return items.peekLast(); }",
    "    public boolean isEmpty() { return items.isEmpty(); }",
    "    public int size() { return items.size(); }",
    "}",
  ],
  "C++": [
    "// Deque (using std::deque)",
    "#include <deque>",
    "#include <stdexcept> // For exceptions (optional)",
    "template<typename T>",
    "class Deque {",
    "private: std::deque<T> items;",
    "public:",
    "    void addFront(T element) { items.push_front(element); }",
    "    void addRear(T element) { items.push_back(element); }",
    "    T removeFront() {",
    "        if (isEmpty()) throw std::out_of_range(\"Deque is empty\");",
    "        T val = items.front(); items.pop_front(); return val;",
    "    }",
    "    T removeRear() {",
    "        if (isEmpty()) throw std::out_of_range(\"Deque is empty\");",
    "        T val = items.back(); items.pop_back(); return val;",
    "    }",
    "    T peekFront() {",
    "        if (isEmpty()) throw std::out_of_range(\"Deque is empty\");",
    "        return items.front();",
    "    }",
    "    T peekRear() {",
    "        if (isEmpty()) throw std::out_of_range(\"Deque is empty\");",
    "        return items.back();",
    "    }",
    "    bool isEmpty() const { return items.empty(); }",
    "    int size() const { return items.size(); }",
    "};",
  ],
};

interface DequeOperationsCodePanelProps {
  currentLine: number | null;
}

export function DequeOperationsCodePanel({ currentLine }: DequeOperationsCodePanelProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const languages = Object.keys(DEQUE_OPERATIONS_CODE_SNIPPETS);
  const codeToDisplay = DEQUE_OPERATIONS_CODE_SNIPPETS[selectedLanguage] || [];


  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} Deque Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[300px] md:h-[400px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code
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
            {codeToDisplay.map((line, index) => (
              <div key={`deque-${selectedLanguage}-line-${index}`}
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

