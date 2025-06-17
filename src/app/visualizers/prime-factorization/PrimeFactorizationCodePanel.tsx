"use client";

import React, {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { PRIME_FACTORIZATION_LINE_MAP } from './prime-factorization-logic';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const PRIME_FACTORIZATION_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "function primeFactorization(n) {",         // 1
    "  const factors = [];",                    // 2
    "  while (n % 2 === 0) {",                   // 3
    "    factors.push(2);",                     // 4
    "    n /= 2;",                               // 5
    "  }",
    "  for (let i = 3; i * i <= n; i += 2) {",   // 6
    "    while (n % i === 0) {",                 // 7
    "      factors.push(i);",                   // 8
    "      n /= i;",                             // 9
    "    }",
    "  }",
    "  if (n > 2) {",                            // 10
    "    factors.push(n);",                     // 11
    "  }",
    "  return factors;",                          // 12
    "}",
  ],
  Python: [
    "def prime_factorization(n):",
    "    factors = []",
    "    while n % 2 == 0:",
    "        factors.append(2)",
    "        n //= 2",
    "    i = 3",
    "    while i * i <= n:",
    "        while n % i == 0:",
    "            factors.append(i)",
    "            n //= i",
    "        i += 2",
    "    if n > 2:",
    "        factors.append(n)",
    "    return factors",
  ],
  Java: [
    "import java.util.ArrayList;",
    "import java.util.List;",
    "public class PrimeFactorization {",
    "    public static List<Integer> getFactors(int n) {",
    "        List<Integer> factors = new ArrayList<>();",
    "        while (n % 2 == 0) {",
    "            factors.add(2);",
    "            n /= 2;",
    "        }",
        "        for (int i = 3; i * i <= n; i += 2) {",
    "            while (n % i == 0) {",
    "                factors.add(i);",
    "                n /= i;",
    "            }",
    "        }",
    "        if (n > 2) {",
    "            factors.add(n);",
    "        }",
    "        return factors;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "std::vector<int> primeFactorization(int n) {",
    "    std::vector<int> factors;",
    "    while (n % 2 == 0) {",
    "        factors.push_back(2);",
    "        n /= 2;",
    "    }",
    "    for (int i = 3; i * i <= n; i += 2) {",
    "        while (n % i == 0) {",
    "            factors.push_back(i);",
    "            n /= i;",
    "        }",
    "    }",
    "    if (n > 2) {",
    "        factors.push_back(n);",
    "    }",
    "    return factors;",
    "}",
  ],
};

interface PrimeFactorizationCodePanelProps {
  currentLine: number | null;
}

export function PrimeFactorizationCodePanel({ currentLine }: PrimeFactorizationCodePanelProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const languages = Object.keys(PRIME_FACTORIZATION_CODE_SNIPPETS);
  const codeToDisplay = PRIME_FACTORIZATION_CODE_SNIPPETS[selectedLanguage] || [];

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} Prime Factorization Code Copied!` }))
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
              <div key={`pf-${selectedLanguage}-line-${index}`}
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
