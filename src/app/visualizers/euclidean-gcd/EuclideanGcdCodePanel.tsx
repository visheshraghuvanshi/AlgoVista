
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { EUCLIDEAN_GCD_LINE_MAP } from './euclidean-gcd-logic';

const EUCLIDEAN_GCD_ITERATIVE_CODE = [
  "function gcdIterative(a, b) {", // 1
  "  while (b !== 0) {",           // 2
  "    let temp = b;",             // 3
  "    b = a % b;",                // 4
  "    a = temp;",                 // 5
  "  }",                           // 6
  "  return a;",                   // 7
  "}",                             // 8
];

const EUCLIDEAN_GCD_RECURSIVE_CODE = [
  "function gcdRecursive(a, b) {",
  "  if (b === 0) {",
  "    return a;",
  "  }",
  "  return gcdRecursive(b, a % b);",
  "}",
];

interface EuclideanGcdCodePanelProps {
  currentLine: number | null;
}

export function EuclideanGcdCodePanel({ currentLine }: EuclideanGcdCodePanelProps) {
  const { toast } = useToast();

  const handleCopyCode = (type: 'iterative' | 'recursive') => {
    const codeString = type === 'iterative' ? EUCLIDEAN_GCD_ITERATIVE_CODE.join('\n') : EUCLIDEAN_GCD_RECURSIVE_CODE.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} GCD Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Euclidean Algorithm Code
        </CardTitle>
        {/* Add copy buttons if needed, or tabs for iterative/recursive */}
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <div className="p-4">
            <h3 className="font-semibold mb-2 text-sm">Iterative Version (Visualized):</h3>
            <pre className="font-code text-sm">
              {EUCLIDEAN_GCD_ITERATIVE_CODE.map((line, index) => (
                <div key={`iter-line-${index}`}
                  className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                  {line}
                </div>
              ))}
            </pre>
            <Button variant="ghost" size="sm" onClick={() => handleCopyCode('iterative')} className="mt-1">
              <ClipboardCopy className="h-3 w-3 mr-1" /> Copy Iterative
            </Button>

            <h3 className="font-semibold mb-2 mt-4 text-sm">Recursive Version:</h3>
            <pre className="font-code text-sm">
              {EUCLIDEAN_GCD_RECURSIVE_CODE.map((line, index) => (
                <div key={`recur-line-${index}`}
                  className={`px-2 py-0.5 rounded whitespace-pre-wrap text-foreground`}>
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                  {line}
                </div>
              ))}
            </pre>
             <Button variant="ghost" size="sm" onClick={() => handleCopyCode('recursive')} className="mt-1">
              <ClipboardCopy className="h-3 w-3 mr-1" /> Copy Recursive
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
