
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SIEVE_LINE_MAP } from './sieve-logic';

const SIEVE_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
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
  ],
  Python: [
    "def sieve_of_eratosthenes(n):",
    "    prime = [True for _ in range(n + 1)]",
    "    prime[0] = prime[1] = False",
    "    p = 2",
    "    while (p * p <= n):",
    "        if (prime[p] == True):",
    "            for i in range(p * p, n + 1, p):",
    "                prime[i] = False",
    "        p += 1",
    "    primes_list = []",
    "    for p_num in range(2, n + 1):",
    "        if prime[p_num]:",
    "            primes_list.append(p_num)",
    "    return primes_list",
  ],
  Java: [
    "import java.util.ArrayList;",
    "import java.util.List;",
    "import java.util.Arrays;",
    "class Sieve {",
    "    public List<Integer> sieveOfEratosthenes(int n) {",
    "        boolean[] prime = new boolean[n + 1];",
    "        Arrays.fill(prime, true);",
    "        if (n >= 0) prime[0] = false;",
    "        if (n >= 1) prime[1] = false;",
    "        for (int p = 2; p * p <= n; p++) {",
    "            if (prime[p]) {",
    "                for (int i = p * p; i <= n; i += p) {",
    "                    prime[i] = false;",
    "                }",
    "            }",
    "        }",
    "        List<Integer> primesList = new ArrayList<>();",
    "        for (int p = 2; p <= n; p++) {",
    "            if (prime[p]) { primesList.add(p); }",
    "        }",
    "        return primesList;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <cmath> // For sqrt or p*p",
    "std::vector<int> sieveOfEratosthenes(int n) {",
    "    std::vector<bool> prime(n + 1, true);",
    "    if (n >= 0) prime[0] = false;",
    "    if (n >= 1) prime[1] = false;",
    "    for (int p = 2; p * p <= n; p++) {",
    "        if (prime[p]) {",
    "            for (int i = p * p; i <= n; i += p) {",
    "                prime[i] = false;",
    "            }",
    "        }",
    "    }",
    "    std::vector<int> primes_list;",
    "    for (int p = 2; p <= n; p++) {",
    "        if (prime[p]) { primes_list.push_back(p); }",
    "    }",
    "    return primes_list;",
    "}",
  ],
};


interface SieveCodePanelProps {
  currentLine: number | null;
}

export function SieveCodePanel({ currentLine }: SieveCodePanelProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = React.useState('JavaScript');
  const languages = Object.keys(SIEVE_CODE_SNIPPETS);
  const codeToDisplay = SIEVE_CODE_SNIPPETS[selectedLanguage] || [];


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
              <div key={`sieve-${selectedLanguage}-line-${index}`}
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

