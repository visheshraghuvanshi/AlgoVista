
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LIS_CODE_SNIPPETS_N2: Record<string, string[]> = {
  JavaScript: [
    "function lengthOfLIS_N2(nums) {",                         // 1
    "  if (nums.length === 0) return 0;",                     // 2
    "  const dp = new Array(nums.length).fill(1);",          // 3
    "  let maxLength = 1;",                                   // 4
    "  for (let i = 0; i < nums.length; i++) {",              // 5
    "    for (let j = 0; j < i; j++) {",                      // 6
    "      if (nums[i] > nums[j] && dp[i] < dp[j] + 1) {",    // 7 (Combined check)
    "        dp[i] = dp[j] + 1;",                             // 8
    "      }",
    "    }",
    "    maxLength = Math.max(maxLength, dp[i]);",             // 9
    "  }",
    "  return maxLength;",                                    // 10
    "}",                                                       // 11
  ],
  Python: [
    "def length_of_lis_n2(nums):",
    "    if not nums: return 0",
    "    dp = [1] * len(nums)",
    "    max_length = 1",
    "    for i in range(len(nums)):",
    "        for j in range(i):",
    "            if nums[i] > nums[j] and dp[i] < dp[j] + 1:",
    "                dp[i] = dp[j] + 1",
    "        max_length = max(max_length, dp[i])",
    "    return max_length",
  ],
  Java: [
    "import java.util.Arrays;",
    "class Solution {",
    "    public int lengthOfLIS_N2(int[] nums) {",
    "        if (nums.length == 0) return 0;",
    "        int[] dp = new int[nums.length];",
    "        Arrays.fill(dp, 1);",
    "        int maxLength = 1;",
    "        for (int i = 0; i < nums.length; i++) {",
    "            for (int j = 0; j < i; j++) {",
    "                if (nums[i] > nums[j] && dp[i] < dp[j] + 1) {",
    "                    dp[i] = dp[j] + 1;",
    "                }",
    "            }",
    "            maxLength = Math.max(maxLength, dp[i]);",
    "        }",
    "        return maxLength;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::max and std::fill",
    "int lengthOfLIS_N2(const std::vector<int>& nums) {",
    "    if (nums.empty()) return 0;",
    "    std::vector<int> dp(nums.size(), 1);",
    "    int maxLength = 1;",
    "    for (int i = 0; i < nums.size(); ++i) {",
    "        for (int j = 0; j < i; ++j) {",
    "            if (nums[i] > nums[j] && dp[i] < dp[j] + 1) {",
    "                dp[i] = dp[j] + 1;",
    "            }",
    "        }",
    "        maxLength = std::max(maxLength, dp[i]);",
    "    }",
    "    return maxLength;",
    "}",
  ],
};

interface LISCodePanelProps {
  currentLine: number | null;
}

export function LISCodePanel({ currentLine }: LISCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(LIS_CODE_SNIPPETS_N2), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = LIS_CODE_SNIPPETS_N2[selectedLanguage]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} LIS (O(N^2)) Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> LIS Code (O(N<sup>2</sup>) DP)
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
              {LIS_CODE_SNIPPETS_N2[selectedLanguage]?.map((line, index) => (
                <div
                  key={`lis-${selectedLanguage}-line-${index}`}
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
    