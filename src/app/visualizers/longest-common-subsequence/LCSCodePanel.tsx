
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LCS_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "function longestCommonSubsequence(text1, text2) {",
    "  const m = text1.length; const n = text2.length;",
    "  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));",
    "  for (let i = 1; i <= m; i++) {",
    "    for (let j = 1; j <= n; j++) {",
    "      if (text1[i - 1] === text2[j - 1]) {",
    "        dp[i][j] = 1 + dp[i - 1][j - 1];",
    "      } else {",
    "        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);",
    "      }",
    "    }",
    "  }",
    "  return dp[m][n]; // Length of LCS",
    "  // To reconstruct LCS string: backtrack from dp[m][n]",
    "}",
  ],
  Python: [
    "def longest_common_subsequence(text1, text2):",
    "    m, n = len(text1), len(text2)",
    "    dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]",
    "    for i in range(1, m + 1):",
    "        for j in range(1, n + 1):",
    "            if text1[i-1] == text2[j-1]:",
    "                dp[i][j] = 1 + dp[i-1][j-1]",
    "            else:",
    "                dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
    "    return dp[m][n]",
  ],
  Java: [
    "class Solution {",
    "    public int longestCommonSubsequence(String text1, String text2) {",
    "        int m = text1.length(); int n = text2.length();",
    "        int[][] dp = new int[m + 1][n + 1];",
    "        for (int i = 1; i <= m; i++) {",
    "            for (int j = 1; j <= n; j++) {",
    "                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {",
    "                    dp[i][j] = 1 + dp[i - 1][j - 1];",
    "                } else {",
    "                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);",
    "                }",
    "            }",
    "        }",
    "        return dp[m][n];",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <string>",
    "#include <algorithm> // For std::max",
    "int longestCommonSubsequence(const std::string& text1, const std::string& text2) {",
    "    int m = text1.length(); int n = text2.length();",
    "    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));",
    "    for (int i = 1; i <= m; ++i) {",
    "        for (int j = 1; j <= n; ++j) {",
    "            if (text1[i - 1] == text2[j - 1]) {",
    "                dp[i][j] = 1 + dp[i - 1][j - 1];",
    "            } else {",
    "                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);",
    "            }",
    "        }",
    "    }",
    "    return dp[m][n];",
    "}",
  ],
};

interface LCSCodePanelProps {
  currentLine: number | null;
}

export function LCSCodePanel({ currentLine }: LCSCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(LCS_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = LCS_CODE_SNIPPETS[selectedLanguage]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} LCS Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> LCS Code
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
              {LCS_CODE_SNIPPETS[selectedLanguage]?.map((line, index) => (
                <div
                  key={`lcs-${selectedLanguage}-line-${index}`}
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
    
