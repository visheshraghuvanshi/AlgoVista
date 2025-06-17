
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added Tabs
import type { LinkedListOperation } from '@/components/algo-vista/LinkedListControlsPanel';

type ReversalTypeInternal = 'iterative' | 'recursive' | 'init';

// Updated to include Python, Java, C++
export const REVERSAL_CODE_SNIPPETS: Record<string, Record<ReversalTypeInternal, string[]>> = {
  JavaScript: {
    iterative: [
      "// Iterative Reversal for Singly Linked List",
      "// Assumes Node class: { data, next }",
      "function reverseIterative(head) {",        // 1
      "  let prev = null;",                       // 2
      "  let current = head;",                    // 3
      "  let nextNode = null;",                   // 4
      "  while (current !== null) {",             // 5
      "    nextNode = current.next; // Store next", // 6
      "    current.next = prev;   // Reverse current node's pointer", // 7
      "    prev = current;        // Move prev one step forward",    // 8
      "    current = nextNode;      // Move current one step forward", // 9
      "  }",                                      // 10
      "  return prev; // New head",                // 11
      "}",
    ],
    recursive: [
      "// Recursive Reversal for Singly Linked List",
      "// Assumes Node class: { data, next }",
      "function reverseRecursive(head) {",        // 1
      "  if (head === null || head.next === null) {", // 2 (Base case)
      "    return head;",                           // 3
      "  }",
      "  let rest = reverseRecursive(head.next);", // 4 (Recursive call)
      "  head.next.next = head; // Reverse pointer of next node", // 5
      "  head.next = null; // Set original head's next to null",   // 6
      "  return rest; // New head (from base case propagation)",  // 7
      "}",
    ],
    init: [ "// Select 'Iterative' or 'Recursive' to see reversal code." ]
  },
  Python: {
    iterative: [
      "# Iterative Reversal",
      "# class Node: def __init__(self, data=0, next_node=None): self.data = data; self.next = next_node",
      "def reverse_iterative(head):",
      "    prev_node, current_node, next_node = None, head, None",
      "    while current_node:",
      "        next_node = current_node.next",
      "        current_node.next = prev_node",
      "        prev_node = current_node",
      "        current_node = next_node",
      "    return prev_node",
    ],
    recursive: [
      "# Recursive Reversal",
      "def reverse_recursive(head):",
      "    if not head or not head.next:",
      "        return head",
      "    rest = reverse_recursive(head.next)",
      "    head.next.next = head",
      "    head.next = None",
      "    return rest",
    ],
    init: [ "# Select reversal type" ]
  },
  Java: {
    iterative: [
      "// Iterative Reversal",
      "// class ListNode { int val; ListNode next; ... }",
      "public ListNode reverseIterative(ListNode head) {",
      "    ListNode prev = null, current = head, nextNode = null;",
      "    while (current != null) {",
      "        nextNode = current.next;",
      "        current.next = prev;",
      "        prev = current;",
      "        current = nextNode;",
      "    }",
      "    return prev;",
      "}",
    ],
    recursive: [
      "// Recursive Reversal",
      "public ListNode reverseRecursive(ListNode head) {",
      "    if (head == null || head.next == null) return head;",
      "    ListNode rest = reverseRecursive(head.next);",
      "    head.next.next = head;",
      "    head.next = null;",
      "    return rest;",
      "}",
    ],
    init: [ "// Select reversal type" ]
  },
  "C++": {
    iterative: [
      "// Iterative Reversal",
      "// struct ListNode { int val; ListNode *next; ... };",
      "ListNode* reverseIterative(ListNode* head) {",
      "    ListNode *prev = nullptr, *current = head, *nextNode = nullptr;",
      "    while (current != nullptr) {",
      "        nextNode = current->next;",
      "        current->next = prev;",
      "        prev = current;",
      "        current = nextNode;",
      "    }",
      "    return prev;",
      "}",
    ],
    recursive: [
      "// Recursive Reversal",
      "ListNode* reverseRecursive(ListNode* head) {",
      "    if (!head || !head->next) return head;",
      "    ListNode* rest = reverseRecursive(head->next);",
      "    head->next->next = head;",
      "    head->next = nullptr;",
      "    return rest;",
      "}",
    ],
    init: [ "// Select reversal type" ]
  }
};

interface LinkedListReversalCodePanelProps {
  currentLine: number | null;
  reversalType: ReversalTypeInternal; 
}

export function LinkedListReversalCodePanel({ currentLine, reversalType }: LinkedListReversalCodePanelProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const languages = Object.keys(REVERSAL_CODE_SNIPPETS);
  
  const codeToDisplay = REVERSAL_CODE_SNIPPETS[selectedLanguage]?.[reversalType] || REVERSAL_CODE_SNIPPETS[selectedLanguage]?.init || [];

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} code for ${reversalType} Reversal Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {reversalType.charAt(0).toUpperCase() + reversalType.slice(1)} Reversal
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
            <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0 || codeToDisplay[0].startsWith("// Select")}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
            {codeToDisplay.map((line, index) => (
              <div key={`${reversalType}-${selectedLanguage}-line-${index}`}
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
