
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const KNAPSACK_01_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "function knapsack01(weights, values, capacity) {",
    "  const n = weights.length;",
    "  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));",
    "  for (let i = 1; i <= n; i++) {",
    "    for (let w = 1; w <= capacity; w++) {",
    "      if (weights[i-1] <= w) {",
    "        dp[i][w] = Math.max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w]);",
    "      } else {",
    "        dp[i][w] = dp[i-1][w];",
    "      }",
    "    }",
    "  }",
    "  return dp[n][capacity];",
    "}",
  ],
  Python: [
    "def knapsack_01(weights, values, capacity):",
    "    n = len(weights)",
    "    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]",
    "    for i in range(1, n + 1):",
    "        for w in range(1, capacity + 1):",
    "            if weights[i-1] <= w:",
    "                dp[i][w] = max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w])",
    "            else:",
    "                dp[i][w] = dp[i-1][w]",
    "    return dp[n][capacity]",
  ],
  Java: [
    "class Knapsack {",
    "    public int solveKnapsack(int[] weights, int[] values, int capacity) {",
    "        int n = weights.length;",
    "        int[][] dp = new int[n + 1][capacity + 1];",
    "        for (int i = 1; i <= n; i++) {",
    "            for (int w = 1; w <= capacity; w++) {",
    "                if (weights[i-1] <= w) {",
    "                    dp[i][w] = Math.max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w]);",
    "                } else {",
    "                    dp[i][w] = dp[i-1][w];",
    "                }",
    "            }",
    "        }",
    "        return dp[n][capacity];",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::max",
    "int knapsack01(const std::vector<int>& weights, const std::vector<int>& values, int capacity) {",
    "    int n = weights.size();",
    "    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(capacity + 1, 0));",
    "    for (int i = 1; i <= n; ++i) {",
    "        for (int w = 1; w <= capacity; ++w) {",
    "            if (weights[i-1] <= w) {",
    "                dp[i][w] = std::max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w]);",
    "            } else {",
    "                dp[i][w] = dp[i-1][w];",
    "            }",
    "        }",
    "    }",
    "    return dp[n][capacity];",
    "}",
  ],
};

interface KnapsackCodePanelProps {
  currentLine: number | null;
}

export function KnapsackCodePanel({ currentLine }: KnapsackCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(KNAPSACK_01_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = KNAPSACK_01_CODE_SNIPPETS[selectedLanguage]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} 0/1 Knapsack Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> 0/1 Knapsack Code
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
              {KNAPSACK_01_CODE_SNIPPETS[selectedLanguage]?.map((line, index) => (
                <div
                  key={`knapsack-${selectedLanguage}-line-${index}`}
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

    