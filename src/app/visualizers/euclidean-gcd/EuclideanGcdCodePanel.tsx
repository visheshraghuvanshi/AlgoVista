"use client";

import React, {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { EUCLIDEAN_GCD_LINE_MAP } from './euclidean-gcd-logic';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';


const EUCLIDEAN_GCD_CODE_SNIPPETS: Record<string, Record<string, string[]>> = {
  JavaScript: {
    iterative: [
      "function gcdIterative(a, b) {", // 1
      "  while (b !== 0) {",           // 2
      "    let temp = b;",             // 3
      "    b = a % b;",                // 4
      "    a = temp;",                 // 5
      "  }",                           // 6
      "  return a;",                   // 7
      "}",                             // 8
    ],
    recursive: [
      "function gcdRecursive(a, b) {",
      "  if (b === 0) {",
      "    return a;",
      "  }",
      "  return gcdRecursive(b, a % b);",
      "}",
    ],
  },
  Python: {
    iterative: [
      "def gcd_iterative(a, b):",
      "    while b != 0:",
      "        temp = b",
      "        b = a % b",
      "        a = temp",
      "    return a",
    ],
    recursive: [
      "def gcd_recursive(a, b):",
      "    if b == 0:",
      "        return a",
      "    return gcd_recursive(b, a % b)",
    ],
  },
  Java: {
    iterative: [
      "public class EuclideanGCD {",
      "    public static int gcdIterative(int a, int b) {",
      "        while (b != 0) {",
      "            int temp = b;",
      "            b = a % b;",
      "            a = temp;",
      "        }",
      "        return a;",
      "    }",
      "}",
    ],
    recursive: [
      "public class EuclideanGCDRecursive {",
      "    public static int gcdRecursive(int a, int b) {",
      "        if (b == 0) {",
      "            return a;",
      "        }",
      "        return gcdRecursive(b, a % b);",
      "    }",
      "}",
    ],
  },
  "C++": {
    iterative: [
      "#include <numeric> // For std::gcd in C++17, or implement manually",
      "int gcdIterative(int a, int b) {",
      "    while (b != 0) {",
      "        int temp = b;",
      "        b = a % b;",
      "        a = temp;",
      "    }",
      "    return a;",
      "}",
    ],
    recursive: [
      "#include <numeric>",
      "int gcdRecursive(int a, int b) {",
      "    if (b == 0) {",
      "        return a;",
      "    }",
      "    return gcdRecursive(b, a % b)",
    ],
  },
};

interface EuclideanGcdCodePanelProps {
  currentLine: number | null;
}

export function EuclideanGcdCodePanel({ currentLine }: EuclideanGcdCodePanelProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const languages = Object.keys(EUCLIDEAN_GCD_CODE_SNIPPETS);

  const iterativeCodeToDisplay = EUCLIDEAN_GCD_CODE_SNIPPETS[selectedLanguage]?.iterative || [];
  const recursiveCodeToDisplay = EUCLIDEAN_GCD_CODE_SNIPPETS[selectedLanguage]?.recursive || [];


  const handleCopyCode = (type: 'iterative' | 'recursive') => {
    const codeString = type === 'iterative' 
      ? (EUCLIDEAN_GCD_CODE_SNIPPETS[selectedLanguage]?.iterative.join('\n') || '')
      : (EUCLIDEAN_GCD_CODE_SNIPPETS[selectedLanguage]?.recursive.join('\n') || '');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} ${type.charAt(0).toUpperCase() + type.slice(1)} GCD Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Euclidean Algorithm Code
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
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <div className="p-4">
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-sm">Iterative Version (Visualized):</h3>
                    <Button variant="ghost" size="sm" onClick={() => handleCopyCode('iterative')} className="text-xs">
                        <ClipboardCopy className="h-3 w-3 mr-1" /> Copy Iterative
                    </Button>
                </div>
                <pre className="font-code text-sm">
                {iterativeCodeToDisplay.map((line, index) => (
                    <div key={`iter-${selectedLanguage}-line-${index}`}
                    className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                    <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                    {line}
                    </div>
                ))}
                </pre>
            </div>
            
            <div>
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-sm">Recursive Version:</h3>
                    <Button variant="ghost" size="sm" onClick={() => handleCopyCode('recursive')} className="text-xs">
                        <ClipboardCopy className="h-3 w-3 mr-1" /> Copy Recursive
                    </Button>
                </div>
                <pre className="font-code text-sm">
                {recursiveCodeToDisplay.map((line, index) => (
                    <div key={`recur-${selectedLanguage}-line-${index}`}
                    className={`px-2 py-0.5 rounded whitespace-pre-wrap text-foreground`}>
                    <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                    {line}
                    </div>
                ))}
                </pre>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
