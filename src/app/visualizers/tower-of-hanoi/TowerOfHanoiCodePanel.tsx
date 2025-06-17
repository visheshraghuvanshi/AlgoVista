
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { TOWER_OF_HANOI_LINE_MAP } from './tower-of-hanoi-logic';

const TOWER_OF_HANOI_JS_CODE = [
  "function towerOfHanoi(n, source, auxiliary, target) {", // 1
  "  if (n === 1) {",                                      // 2
  "    console.log(`Move disk 1 from ${source} to ${target}`);", // 3
  "    return;",                                            // 4
  "  }",
  "  towerOfHanoi(n - 1, source, target, auxiliary);",      // 5
  "  console.log(`Move disk ${n} from ${source} to ${target}`);", // 6
  "  towerOfHanoi(n - 1, auxiliary, source, target);",      // 7
  "}",                                                      // 8
];

interface TowerOfHanoiCodePanelProps {
  currentLine: number | null;
}

export function TowerOfHanoiCodePanel({ currentLine }: TowerOfHanoiCodePanelProps) {
  const { toast } = useToast();

  const handleCopyCode = () => {
    const codeString = TOWER_OF_HANOI_JS_CODE.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `Tower of Hanoi Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code (JavaScript)
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {TOWER_OF_HANOI_JS_CODE.map((line, index) => (
              <div key={`toh-line-${index}`}
                className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
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

