
"use client";

import React, {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const CYCLE_DETECTION_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "// Floyd's Tortoise and Hare Algorithm",
    "function hasCycle(head) {",                 // 1
    "  if (!head || !head.next) {",             // 2
    "    return false;",                       // 3
    "  }",
    "  let slow = head;",                       // 4
    "  let fast = head;",                       // 5
    "  while (fast !== null && fast.next !== null) {", // 6
    "    slow = slow.next;",                    // 7
    "    fast = fast.next.next;",               // 8
    "    if (slow === fast) {",                 // 9
    "      return true; // Cycle detected",    // 10
    "    }",
    "  }",
    "  return false; // No cycle found",         // 11
    "}",
  ],
  Python: [
    "# Floyd's Tortoise and Hare Algorithm",
    "def has_cycle(head):",
    "    if not head or not head.next:",
    "        return False",
    "    slow = head",
    "    fast = head",
    "    while fast and fast.next:",
    "        slow = slow.next",
    "        fast = fast.next.next",
    "        if slow == fast:",
    "            return True",
    "    return False",
  ],
  Java: [
    "// Floyd's Tortoise and Hare Algorithm",
    "// class ListNode { int val; ListNode next; ... }",
    "public class Solution {",
    "    public boolean hasCycle(ListNode head) {",
    "        if (head == null || head.next == null) {",
    "            return false;",
    "        }",
    "        ListNode slow = head;",
    "        ListNode fast = head;",
    "        while (fast != null && fast.next != null) {",
    "            slow = slow.next;",
    "            fast = fast.next.next;",
    "            if (slow == fast) {",
    "                return true;",
    "            }",
    "        }",
    "        return false;",
    "    }",
    "}",
  ],
  "C++": [
    "// Floyd's Tortoise and Hare Algorithm",
    "// struct ListNode { int val; ListNode *next; ... };",
    "class Solution {",
    "public:",
    "    bool hasCycle(ListNode *head) {",
    "        if (!head || !head->next) {",
    "            return false;",
    "        }",
    "        ListNode *slow = head;",
    "        ListNode *fast = head;",
    "        while (fast != nullptr && fast->next != nullptr) {",
    "            slow = slow->next;",
    "            fast = fast->next->next;",
    "            if (slow == fast) {",
    "                return true;",
    "            }",
    "        }",
    "        return false;",
    "    }",
    "};",
  ],
};

interface LinkedListCycleDetectionCodePanelProps {
  currentLine: number | null;
}

export function LinkedListCycleDetectionCodePanel({ currentLine }: LinkedListCycleDetectionCodePanelProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = React.useState('JavaScript');
  const languages = Object.keys(CYCLE_DETECTION_CODE_SNIPPETS);
  const codeToDisplay = CYCLE_DETECTION_CODE_SNIPPETS[selectedLanguage as keyof typeof CYCLE_DETECTION_CODE_SNIPPETS] || [];

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} Cycle Detection Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: Floyd's Algorithm
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
              <div key={`cycle-${selectedLanguage}-line-${index}`}
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
