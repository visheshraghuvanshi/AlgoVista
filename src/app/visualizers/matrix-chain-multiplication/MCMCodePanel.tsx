
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MCM_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "function matrixChainOrder(p) {",                            // 1
    "  const n = p.length - 1;",                               // 2
    "  const dp = Array(n + 1).fill(null).map(() => Array(n + 1).fill(0));", // 3
    "  // dp[i][j] = min ops for A_i...A_j",
    "  // dp[i][i] = 0 is implicit by fill(0)",                  // 5 (conceptual)
    "  for (let L = 2; L <= n; L++) {",                         // 6
    "    for (let i = 1; i <= n - L + 1; i++) {",               // 7
    "      let j = i + L - 1;",                                // 8
    "      dp[i][j] = Infinity;",                              // 9
    "      for (let k = i; k < j; k++) {",                     // 10
    "        const cost = dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j];", // 11
    "        if (cost < dp[i][j]) {",                          // 12
    "          dp[i][j] = cost;",                              // 13
    "        }",
    "      }",                                                  // 15
    "    }",                                                    // 16
    "  }",                                                      // 17
    "  return dp[1][n];",                                      // 18
    "}",                                                        // 19
  ],
  Python: [
    "def matrix_chain_order(p):",
    "    n = len(p) - 1",
    "    dp = [[0 for _ in range(n + 1)] for _ in range(n + 1)]",
    "    for L in range(2, n + 1):",
    "        for i in range(1, n - L + 2):",
    "            j = i + L - 1",
    "            dp[i][j] = float('inf')",
    "            for k in range(i, j):",
    "                cost = dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]",
    "                if cost < dp[i][j]:",
    "                    dp[i][j] = cost",
    "    return dp[1][n]",
  ],
  Java: [
    "import java.util.Arrays;",
    "class MatrixChainMultiplication {",
    "    public int matrixChainOrder(int[] p) {",
    "        int n = p.length - 1;",
    "        int[][] dp = new int[n + 1][n + 1];",
    "        // dp[i][i] is 0, already initialized by Java",
    "        for (int L = 2; L <= n; L++) {",
    "            for (int i = 1; i <= n - L + 1; i++) {",
    "                int j = i + L - 1;",
    "                dp[i][j] = Integer.MAX_VALUE;",
    "                for (int k = i; k < j; k++) {",
    "                    int cost = dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j];",
    "                    if (cost < dp[i][j]) {",
    "                        dp[i][j] = cost;",
    "                    }",
    "                }",
    "            }",
    "        }",
    "        return dp[1][n];",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::min",
    "#include <limits>    // For std::numeric_limits",
    "int matrixChainOrder(const std::vector<int>& p) {",
    "    int n = p.size() - 1;",
    "    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(n + 1, 0));",
    "    for (int L = 2; L <= n; ++L) {",
    "        for (int i = 1; i <= n - L + 1; ++i) {",
    "            int j = i + L - 1;",
    "            dp[i][j] = std::numeric_limits<int>::max();",
    "            for (int k = i; k < j; ++k) {",
    "                int cost = dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j];",
    "                if (cost < dp[i][j]) {",
    "                    dp[i][j] = cost;",
    "                }",
    "            }",
    "        }",
    "    }",
    "    return dp[1][n];",
    "}",
  ],
};

interface MCMCodePanelProps {
  currentLine: number | null;
}

export function MCMCodePanel({ currentLine }: MCMCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(MCM_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = MCM_CODE_SNIPPETS[selectedLanguage]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} MCM Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> MCM Code
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code">
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="flex flex-col flex-grow overflow-hidden">
          <TabsList className="mx-4 mb-1 self-start shrink-0">
            {languages.map((lang) => (
              <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-1 h-auto">
                {lang}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
            <pre className="font-code text-sm p-4 whitespace-pre-wrap">
              {MCM_CODE_SNIPPETS[selectedLanguage]?.map((line, index) => (
                <div
                  key={`mcm-${selectedLanguage}-line-${index}`}
                  className={`px-2 py-0.5 rounded ${ index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground" }`}
                >
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                  {line}
                </div>
              ))}
            </pre>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
    
