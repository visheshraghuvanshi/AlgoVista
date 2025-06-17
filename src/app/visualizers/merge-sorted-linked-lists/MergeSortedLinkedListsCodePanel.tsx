
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const MERGE_CODE_SNIPPETS: Record<string, string[]> = {
  iterative: [
    "// Iterative Merge for Two Sorted Singly Linked Lists",
    "// Assumes Node class: { data, next }",
    "function mergeTwoListsIterative(l1, l2) {", // 1
    "  const dummyHead = new Node(0);",          // 2
    "  let tail = dummyHead;",                   // 3
    "  while (l1 && l2) {",                      // 4
    "    if (l1.data < l2.data) {",              // 5
    "      tail.next = l1;",                     // 6
    "      l1 = l1.next;",                       // 7
    "    } else {",
    "      tail.next = l2;",                     // 8
    "      l2 = l2.next;",                       // 9
    "    }",
    "    tail = tail.next;",                     // 10
    "  }",
    "  tail.next = l1 || l2; // Append remaining", // 11
    "  return dummyHead.next;",                  // 12
    "}",
  ],
  recursive: [
    "// Recursive Merge for Two Sorted Singly Linked Lists",
    "// Assumes Node class: { data, next }",
    "function mergeTwoListsRecursive(l1, l2) {", // 1
    "  if (!l1) return l2;",                      // 2 (Base case 1)
    "  if (!l2) return l1;",                      // 3 (Base case 2)
    "  if (l1.data < l2.data) {",                // 4
    "    l1.next = mergeTwoListsRecursive(l1.next, l2);", // 5 (Recursive call)
    "    return l1;",                             // 6
    "  } else {",
    "    l2.next = mergeTwoListsRecursive(l1, l2.next);", // 7 (Recursive call)
    "    return l2;",                             // 8
    "  }",
    "}",
  ],
  init: [
    "// Initializing lists for merge operation.",
    "// Select 'Iterative' or 'Recursive' to see merge code.",
  ]
};

interface MergeSortedLinkedListsCodePanelProps {
  currentLine: number | null;
  mergeType: 'iterative' | 'recursive' | 'init';
}

export function MergeSortedLinkedListsCodePanel({ currentLine, mergeType }: MergeSortedLinkedListsCodePanelProps) {
  const { toast } = useToast();
  const codeToDisplay = MERGE_CODE_SNIPPETS[mergeType] || MERGE_CODE_SNIPPETS.init;

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `Code for ${mergeType} Merge Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {mergeType.charAt(0).toUpperCase() + mergeType.slice(1)} Merge
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {codeToDisplay.map((line, index) => (
              <div key={`${mergeType}-line-${index}`}
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
