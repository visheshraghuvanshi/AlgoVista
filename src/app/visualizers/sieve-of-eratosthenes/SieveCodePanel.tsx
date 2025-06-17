
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { SIEVE_LINE_MAP } from './sieve-logic';

const SIEVE_JS_CODE = [
  "function sieveOfEratosthenes(n) {",                          // 1
  "  const prime = new Array(n + 1).fill(true);",             // 2
  "  prime[0] = prime[1] = false;",                            // 3
  "  for (let p = 2; p * p <= n; p++) {",                      // 4
  "    if (prime[p] === true) {",                              // 5
  "      for (let i = p * p; i <= n; i += p) {",               // 6
  "        prime[i] = false;",                                 // 7
  "      }",
  "    }",
  "  }",
  "  const primes = [];",
  "  for (let p = 2; p <= n; p++) {",                          // 8
  "    if (prime[p]) { primes.push(p); }",                     // 9
  "  }",
  "  return primes;",                                           // 10
  "}",
];

interface SieveCodePanelProps {
  currentLine: number | null;
}

export function SieveCodePanel({ currentLine }: SieveCodePanelProps) {
  const { toast } = useToast();

  const handleCopyCode = () => {
    const codeString = SIEVE_JS_CODE.join('\n');
    navigator.clipboard.writeText(codeString)
      .then(() => toast({ title: `Sieve Code Copied!` }))
      .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
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
            {SIEVE_JS_CODE.map((line, index) => (
              <div key={`sieve-line-${index}`}
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
