
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MODULAR_EXP_LINE_MAP } from './modular-exponentiation-logic';

const MODULAR_EXP_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "function modularExponentiation(base, exponent, modulus) {", // 1
    "  let result = 1;",                                         // 2
    "  base = base % modulus; // Handle base > modulus",        // 3
    "  while (exponent > 0) {",                                // 4
    "    if (exponent % 2 === 1) { // If exponent is odd",     // 5
    "      result = (result * base) % modulus;",               // 6
    "    }",
    "    exponent = Math.floor(exponent / 2); // exponent /= 2",// 7
    "    base = (base * base) % modulus;     // base = base^2",  // 8
    "  }",
    "  return result;",                                          // 9
    "}",                                                         // 10
  ],
  Python: [
    "def modular_exponentiation(base, exponent, modulus):",
    "    result = 1",
    "    base %= modulus",
    "    while exponent > 0:",
    "        if exponent % 2 == 1:",
    "            result = (result * base) % modulus",
    "        exponent //= 2",
    "        base = (base * base) % modulus",
    "    return result",
  ],
  Java: [
    "class Solution {",
    "    public long modularExponentiation(long base, long exponent, long modulus) {",
    "        long result = 1L;",
    "        base %= modulus;",
    "        while (exponent > 0) {",
    "            if (exponent % 2 == 1) {",
    "                result = (result * base) % modulus;",
    "            }",
    "            exponent /= 2;",
    "            base = (base * base) % modulus;",
    "        }",
    "        return result;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <cstdint>",
    "long long modularExponentiation(long long base, long long exponent, long long modulus) {",
    "    long long result = 1;",
    "    base %= modulus;",
    "    while (exponent > 0) {",
    "        if (exponent % 2 == 1) {",
    "            result = (result * base) % modulus;",
    "        }",
    "        exponent /= 2;",
    "        base = (base * base) % modulus;",
    "    }",
    "    return result;",
    "}",
  ],
};

interface ModularExponentiationCodePanelProps {
  currentLine: number | null;
}

export function ModularExponentiationCodePanel({ currentLine }: ModularExponentiationCodePanelProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = React.useState('JavaScript');
  const languages = Object.keys(MODULAR_EXP_CODE_SNIPPETS);
  const codeToDisplay = MODULAR_EXP_CODE_SNIPPETS[selectedLanguage] || [];

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
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
          <pre className="font-code text-sm p-4">
            {codeToDisplay.map((line, index) => (
              <div key={`modexp-${selectedLanguage}-line-${index}`}
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

