
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const EDIT_DISTANCE_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "function editDistance(str1, str2) {",
    "  const m = str1.length; const n = str2.length;",
    "  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));",
    "  // dp[i][j] = edit distance between str1[0..i-1] and str2[0..j-1]",
    "  for (let i = 0; i <= m; i++) dp[i][0] = i;",
    "  for (let j = 0; j <= n; j++) dp[0][j] = j;",
    "  for (let i = 1; i <= m; i++) {",
    "    for (let j = 1; j <= n; j++) {",
    "      if (str1[i - 1] === str2[j - 1]) {",
    "        dp[i][j] = dp[i - 1][j - 1];",
    "      } else {",
    "        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);",
    "      }",
    "    }",
    "  }",
    "  return dp[m][n];",
    "}",
  ],
  Python: [
    "def edit_distance(str1, str2):",
    "    m, n = len(str1), len(str2)",
    "    dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]",
    "    for i in range(m + 1): dp[i][0] = i",
    "    for j in range(n + 1): dp[0][j] = j",
    "    for i in range(1, m + 1):",
    "        for j in range(1, n + 1):",
    "            if str1[i-1] == str2[j-1]:",
    "                dp[i][j] = dp[i-1][j-1]",
    "            else:",
    "                dp[i][j] = 1 + min(dp[i-1][j],        # Deletion",
    "                                   dp[i][j-1],        # Insertion",
    "                                   dp[i-1][j-1])      # Replacement",
    "    return dp[m][n]",
  ],
  Java: [
    "class Solution {",
    "    public int editDistance(String str1, String str2) {",
    "        int m = str1.length(); int n = str2.length();",
    "        int[][] dp = new int[m + 1][n + 1];",
    "        for (int i = 0; i <= m; i++) dp[i][0] = i;",
    "        for (int j = 0; j <= n; j++) dp[0][j] = j;",
    "        for (int i = 1; i <= m; i++) {",
    "            for (int j = 1; j <= n; j++) {",
    "                if (str1.charAt(i - 1) == str2.charAt(j - 1)) {",
    "                    dp[i][j] = dp[i - 1][j - 1];",
    "                } else {",
    "                    dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));",
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
    "#include <algorithm> // For std::min",
    "int editDistance(const std::string& str1, const std::string& str2) {",
    "    int m = str1.length(); int n = str2.length();",
    "    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));",
    "    for (int i = 0; i <= m; ++i) dp[i][0] = i;",
    "    for (int j = 0; j <= n; ++j) dp[0][j] = j;",
    "    for (int i = 1; i <= m; ++i) {",
    "        for (int j = 1; j <= n; ++j) {",
    "            if (str1[i - 1] == str2[j - 1]) {",
    "                dp[i][j] = dp[i - 1][j - 1];",
    "            } else {",
    "                dp[i][j] = 1 + std::min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});",
    "            }",
    "        }",
    "    }",
    "    return dp[m][n];",
    "}",
  ],
};

interface EditDistanceCodePanelProps {
  currentLine: number | null;
}

export function EditDistanceCodePanel({ currentLine }: EditDistanceCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(EDIT_DISTANCE_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = EDIT_DISTANCE_CODE_SNIPPETS[selectedLanguage]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Edit Distance Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Edit Distance Code
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
              {EDIT_DISTANCE_CODE_SNIPPETS[selectedLanguage]?.map((line, index) => (
                <div
                  key={`ed-${selectedLanguage}-line-${index}`}
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
    