
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const CYCLE_DETECTION_CODE: string[] = [
  "// Floyd's Tortoise and Hare Algorithm",
  "// Assumes Node class: { data, next }",
  "function hasCycle(head) {",                 // 1
  "  if (!head || !head.next) {",             // 2
  "    return false; // No cycle",           // 3
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
];

interface LinkedListCycleDetectionCodePanelProps {
  currentLine: number | null;
}

export function LinkedListCycleDetectionCodePanel({ currentLine }: LinkedListCycleDetectionCodePanelProps) {
  const { toast } = useToast();

  const handleCopyCode = () => {
    const codeString = CYCLE_DETECTION_CODE.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `Cycle Detection Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: Floyd's Algorithm
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {CYCLE_DETECTION_CODE.map((line, index) => (
              <div key={`cycle-line-${index}`}
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
