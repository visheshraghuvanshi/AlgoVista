
"use client";

import React, {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Added Tabs

export const MERGE_CODE_SNIPPETS: Record<string, Record<string, string[]>> = {
  JavaScript : {
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
  },
  Python: {
    iterative: [
      "# Iterative Merge",
      "# class Node: def __init__(self, data=0, next=None): self.data = data; self.next = next",
      "def merge_two_lists_iterative(l1, l2):",
      "    dummy = Node(0)",
      "    tail = dummy",
      "    while l1 and l2:",
      "        if l1.data < l2.data:",
      "            tail.next = l1",
      "            l1 = l1.next",
      "        else:",
      "            tail.next = l2",
      "            l2 = l2.next",
      "        tail = tail.next",
      "    tail.next = l1 or l2",
      "    return dummy.next",
    ],
    recursive: [
      "# Recursive Merge",
      "def merge_two_lists_recursive(l1, l2):",
      "    if not l1: return l2",
      "    if not l2: return l1",
      "    if l1.data < l2.data:",
      "        l1.next = merge_two_lists_recursive(l1.next, l2)",
      "        return l1",
      "    else:",
      "        l2.next = merge_two_lists_recursive(l1, l2.next)",
      "        return l2",
    ],
    init: ["# Select merge type"]
  },
  Java: {
    iterative: [
      "// Iterative Merge",
      "// class ListNode { int val; ListNode next; ... }",
      "public ListNode mergeTwoListsIterative(ListNode l1, ListNode l2) {",
      "    ListNode dummyHead = new ListNode(0);",
      "    ListNode tail = dummyHead;",
      "    while (l1 != null && l2 != null) {",
      "        if (l1.val < l2.val) {",
      "            tail.next = l1;",
      "            l1 = l1.next;",
      "        } else {",
      "            tail.next = l2;",
      "            l2 = l2.next;",
      "        }",
      "        tail = tail.next;",
      "    }",
      "    tail.next = (l1 != null) ? l1 : l2;",
      "    return dummyHead.next;",
      "}",
    ],
    recursive: [
      "// Recursive Merge",
      "public ListNode mergeTwoListsRecursive(ListNode l1, ListNode l2) {",
      "    if (l1 == null) return l2;",
      "    if (l2 == null) return l1;",
      "    if (l1.val < l2.val) {",
      "        l1.next = mergeTwoListsRecursive(l1.next, l2);",
      "        return l1;",
      "    } else {",
      "        l2.next = mergeTwoListsRecursive(l1, l2.next);",
      "        return l2;",
      "    }",
      "}",
    ],
    init: ["// Select merge type"]
  },
  "C++": {
     iterative: [
      "// Iterative Merge",
      "// struct ListNode { int val; ListNode *next; ... };",
      "ListNode* mergeTwoListsIterative(ListNode* l1, ListNode* l2) {",
      "    ListNode dummy(0);",
      "    ListNode* tail = &dummy;",
      "    while (l1 && l2) {",
      "        if (l1->val < l2->val) {",
      "            tail->next = l1;",
      "            l1 = l1->next;",
      "        } else {",
      "            tail->next = l2;",
      "            l2 = l2->next;",
      "        }",
      "        tail = tail->next;",
      "    }",
      "    tail->next = l1 ? l1 : l2;",
      "    return dummy.next;",
      "}",
    ],
    recursive: [
      "// Recursive Merge",
      "ListNode* mergeTwoListsRecursive(ListNode* l1, ListNode* l2) {",
      "    if (!l1) return l2;",
      "    if (!l2) return l1;",
      "    if (l1->val < l2->val) {",
      "        l1->next = mergeTwoListsRecursive(l1->next, l2);",
      "        return l1;",
      "    } else {",
      "        l2->next = mergeTwoListsRecursive(l1, l2->next);",
      "        return l2;",
      "    }",
      "}",
    ],
    init: ["// Select merge type"]
  }
};


interface MergeSortedLinkedListsCodePanelProps {
  currentLine: number | null;
  mergeType: 'iterative' | 'recursive' | 'init';
}

export function MergeSortedLinkedListsCodePanel({ currentLine, mergeType }: MergeSortedLinkedListsCodePanelProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = React.useState('JavaScript');
  const languages = Object.keys(MERGE_CODE_SNIPPETS);

  const codeToDisplay = MERGE_CODE_SNIPPETS[selectedLanguage]?.[mergeType] || MERGE_CODE_SNIPPETS[selectedLanguage]?.init || [];


  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} code for ${mergeType} Merge Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {mergeType.charAt(0).toUpperCase() + mergeType.slice(1)} Merge
        </CardTitle>
         <div className="flex items-center gap-2">
            <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 h-8 text-xs p-0.5"> {/* Adjusted grid-cols */}
                    {languages.map(lang => (
                        <TabsTrigger key={lang} value={lang} className="text-xs px-1.5 py-0.5 h-auto">
                            {lang}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
            {codeToDisplay.map((line, index) => (
              <div key={`${mergeType}-${selectedLanguage}-line-${index}`}
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

  