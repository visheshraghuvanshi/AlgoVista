
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CoinChangeProblemType } from './coin-change-logic';

export const COIN_CHANGE_CODE_SNIPPETS: Record<CoinChangeProblemType, Record<string, string[]>> = {
  minCoins: {
    JavaScript: [
      "function minCoins(coins, amount) {",
      "  const dp = new Array(amount + 1).fill(Infinity);",
      "  dp[0] = 0;",
      "  for (let i = 1; i <= amount; i++) {",
      "    for (const coin of coins) {",
      "      if (coin <= i && dp[i - coin] !== Infinity) {",
      "        dp[i] = Math.min(dp[i], dp[i - coin] + 1);",
      "      }",
      "    }",
      "  }",
      "  return dp[amount] === Infinity ? -1 : dp[amount];",
      "}",
    ],
    Python: [
      "def min_coins(coins, amount):",
      "    dp = [float('inf')] * (amount + 1)",
      "    dp[0] = 0",
      "    for i in range(1, amount + 1):",
      "        for coin in coins:",
      "            if coin <= i:",
      "                if dp[i - coin] != float('inf'):",
      "                    dp[i] = min(dp[i], dp[i - coin] + 1)",
      "    return dp[amount] if dp[amount] != float('inf') else -1",
    ],
    Java: [
      "import java.util.Arrays;",
      "class CoinChange {",
      "    public int minCoins(int[] coins, int amount) {",
      "        int[] dp = new int[amount + 1];",
      "        Arrays.fill(dp, amount + 1); // Use amount + 1 as Infinity",
      "        dp[0] = 0;",
      "        for (int i = 1; i <= amount; i++) {",
      "            for (int coin : coins) {",
      "                if (coin <= i && dp[i - coin] != amount + 1) {",
      "                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);",
      "                }",
      "            }",
      "        }",
      "        return dp[amount] > amount ? -1 : dp[amount];",
      "    }",
      "}",
    ],
    "C++": [
      "#include <vector>",
      "#include <algorithm> // For std::min",
      "#include <limits>    // For std::numeric_limits",
      "int minCoins(const std::vector<int>& coins, int amount) {",
      "    std::vector<int> dp(amount + 1, amount + 1); // Use amount + 1 as Infinity",
      "    dp[0] = 0;",
      "    for (int i = 1; i <= amount; ++i) {",
      "        for (int coin : coins) {",
      "            if (coin <= i && dp[i - coin] != amount + 1) {",
      "                dp[i] = std::min(dp[i], dp[i - coin] + 1);",
      "            }",
      "        }",
      "    }",
      "    return dp[amount] > amount ? -1 : dp[amount];",
      "}",
    ],
  },
  numWays: {
    JavaScript: [
      "function countWays(coins, amount) {",
      "  const dp = new Array(amount + 1).fill(0);",
      "  dp[0] = 1;",
      "  for (const coin of coins) {",
      "    for (let i = coin; i <= amount; i++) {",
      "      dp[i] += dp[i - coin];",
      "    }",
      "  }",
      "  return dp[amount];",
      "}",
    ],
    Python: [
      "def count_ways(coins, amount):",
      "    dp = [0] * (amount + 1)",
      "    dp[0] = 1",
      "    for coin in coins:",
      "        for i in range(coin, amount + 1):",
      "            dp[i] += dp[i - coin]",
      "    return dp[amount]",
    ],
    Java: [
      "class CoinChange {",
      "    public int countWays(int[] coins, int amount) {",
      "        int[] dp = new int[amount + 1];",
      "        dp[0] = 1;",
      "        for (int coin : coins) {",
      "            for (int i = coin; i <= amount; i++) {",
      "                dp[i] += dp[i - coin];",
      "            }",
      "        }",
      "        return dp[amount];",
      "    }",
      "}",
    ],
    "C++": [
      "#include <vector>",
      "int countWays(const std::vector<int>& coins, int amount) {",
      "    std::vector<unsigned int> dp(amount + 1, 0); // Use unsigned for large counts",
      "    dp[0] = 1;",
      "    for (int coin : coins) {",
      "        for (int i = coin; i <= amount; ++i) {",
      "            dp[i] += dp[i - coin];",
      "        }",
      "    }",
      "    return dp[amount];",
      "}",
    ],
  },
};

interface CoinChangeCodePanelProps {
  currentLine: number | null;
  selectedProblem: CoinChangeProblemType;
}

export function CoinChangeCodePanel({ currentLine, selectedProblem }: CoinChangeCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(COIN_CHANGE_CODE_SNIPPETS[selectedProblem]), [selectedProblem]);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  // Update language if problem type changes and current language isn't available for new type
  React.useEffect(() => {
    const currentProblemLanguages = Object.keys(COIN_CHANGE_CODE_SNIPPETS[selectedProblem]);
    if (!currentProblemLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(currentProblemLanguages.includes("JavaScript") ? "JavaScript" : currentProblemLanguages[0]);
    }
  }, [selectedProblem, selectedLanguage]);

  const handleCopyCode = () => {
    const codeToCopy = COIN_CHANGE_CODE_SNIPPETS[selectedProblem][selectedLanguage]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Coin Change (${selectedProblem}) Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  const problemLabel = selectedProblem === 'minCoins' ? 'Minimum Coins' : 'Number of Ways';

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Coin Change: {problemLabel}
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
            <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code">
              <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap">
            {COIN_CHANGE_CODE_SNIPPETS[selectedProblem][selectedLanguage]?.map((line, index) => (
              <div
                key={`cc-${selectedProblem}-${selectedLanguage}-line-${index}`}
                className={`px-2 py-0.5 rounded ${ index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground" }`}
              >
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
    
