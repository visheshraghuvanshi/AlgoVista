
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SubarraySumProblemType } from './subarray-sum-logic';

// Moved code snippets here as they are static for this component
const SUBARRAY_SUM_CODE_SNIPPETS: Record<SubarraySumProblemType, Record<string, string[]>> = {
  positiveOnly: {
    JavaScript: [
      "function findSubarrayWithSumPositive(arr, targetSum) {", // 1
      "  let currentSum = 0; let start = 0;",                 // 2
      "  for (let end = 0; end < arr.length; end++) {",       // 3
      "    currentSum += arr[end];",                          // 4
      "    while (currentSum > targetSum && start <= end) {", // 5
      "      currentSum -= arr[start];",                      // 6
      "      start++;",                                       // 7
      "    }",
      "    if (currentSum === targetSum && start <= end) {", // 8
      "      return arr.slice(start, end + 1);",             // 9
      "    }",
      "  }",
      "  return null;",                                       // 10
      "}",                                                    // 11
    ],
    Python: [
      "def find_subarray_with_sum_positive(arr, target_sum):",
      "    current_sum = 0",
      "    start = 0",
      "    for end in range(len(arr)):",
      "        current_sum += arr[end]",
      "        while current_sum > target_sum and start <= end:",
      "            current_sum -= arr[start]",
      "            start += 1",
      "        if current_sum == target_sum and start <= end:",
      "            return arr[start : end + 1]",
      "    return None",
    ],
    Java: [
      "import java.util.*;",
      "class Solution {",
      "    public int[] findSubarrayWithSumPositive(int[] arr, int targetSum) {",
      "        int currentSum = 0, start = 0;",
      "        for (int end = 0; end < arr.length; end++) {",
      "            currentSum += arr[end];",
      "            while (currentSum > targetSum && start <= end) {",
      "                currentSum -= arr[start];",
      "                start++;",
      "            }",
      "            if (currentSum == targetSum && start <= end) {",
      "                return Arrays.copyOfRange(arr, start, end + 1);",
      "            }",
      "        }",
      "        return null;",
      "    }",
      "}",
    ],
    "C++": [
      "#include <vector>",
      "#include <numeric> // For std::accumulate, though not used in sliding window",
      "std::vector<int> findSubarrayWithSumPositive(const std::vector<int>& arr, int targetSum) {",
      "    int currentSum = 0, start = 0;",
      "    for (int end = 0; end < arr.size(); ++end) {",
      "        currentSum += arr[end];",
      "        while (currentSum > targetSum && start <= end) {",
      "            currentSum -= arr[start];",
      "            start++;",
      "        }",
      "        if (currentSum == targetSum && start <= end) {",
      "            return std::vector<int>(arr.begin() + start, arr.begin() + end + 1);",
      "        }",
      "    }",
      "    return {}; // Return empty vector if not found",
      "}",
    ],
  },
  anyNumbers: {
    JavaScript: [
      "function findSubarrayWithSumAny(arr, targetSum) {",    // 1
      "  let currentSum = 0; const prefixSums = new Map();", // 2
      "  prefixSums.set(0, -1);",                            // 3
      "  for (let i = 0; i < arr.length; i++) {",             // 4
      "    currentSum += arr[i];",                            // 5
      "    if (prefixSums.has(currentSum - targetSum)) {",   // 6
      "      return arr.slice(prefixSums.get(currentSum - targetSum) + 1, i + 1);", // 7
      "    }",
      "    prefixSums.set(currentSum, i);",                   // 8
      "  }",
      "  return null;",                                       // 9
      "}",                                                    // 10
    ],
    Python: [
      "def find_subarray_with_sum_any(arr, target_sum):",
      "    current_sum = 0",
      "    prefix_sums = {0: -1} # Sum -> index",
      "    for i, num in enumerate(arr):",
      "        current_sum += num",
      "        if current_sum - target_sum in prefix_sums:",
      "            start_index = prefix_sums[current_sum - target_sum] + 1",
      "            return arr[start_index : i + 1]",
      "        prefix_sums[current_sum] = i",
      "    return None",
    ],
    Java: [
      "import java.util.*;",
      "class Solution {",
      "    public int[] findSubarrayWithSumAny(int[] arr, int targetSum) {",
      "        int currentSum = 0;",
      "        Map<Integer, Integer> prefixSums = new HashMap<>();",
      "        prefixSums.put(0, -1);",
      "        for (int i = 0; i < arr.length; i++) {",
      "            currentSum += arr[i];",
      "            if (prefixSums.containsKey(currentSum - targetSum)) {",
      "                int startIndex = prefixSums.get(currentSum - targetSum) + 1;",
      "                return Arrays.copyOfRange(arr, startIndex, i + 1);",
      "            }",
      "            prefixSums.put(currentSum, i);",
      "        }",
      "        return null;",
      "    }",
      "}",
    ],
    "C++": [
      "#include <vector>",
      "#include <unordered_map>",
      "std::vector<int> findSubarrayWithSumAny(const std::vector<int>& arr, int targetSum) {",
      "    long long currentSum = 0; // Use long long for sum to avoid overflow with many numbers",
      "    std::unordered_map<long long, int> prefixSums;",
      "    prefixSums[0] = -1;",
      "    for (int i = 0; i < arr.size(); ++i) {",
      "        currentSum += arr[i];",
      "        if (prefixSums.count(currentSum - targetSum)) {",
      "            int startIndex = prefixSums[currentSum - targetSum] + 1;",
      "            return std::vector<int>(arr.begin() + startIndex, arr.begin() + i + 1);",
      "        }",
      "        prefixSums[currentSum] = i;",
      "    }",
      "    return {}; // Return empty vector if not found",
      "}",
    ],
  },
};


interface SubarraySumCodePanelProps {
  currentLine: number | null;
  selectedProblem: SubarraySumProblemType;
}

export function SubarraySumCodePanel({ currentLine, selectedProblem }: SubarraySumCodePanelProps) {
  const { toast } = useToast();
  
  const problemSpecificSnippets = SUBARRAY_SUM_CODE_SNIPPETS[selectedProblem] || {};
  const languages = useMemo(() => Object.keys(problemSpecificSnippets), [problemSpecificSnippets]);
  
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : (languages[0] || "Info");
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  React.useEffect(() => {
    const currentProblemLangs = Object.keys(SUBARRAY_SUM_CODE_SNIPPETS[selectedProblem] || {});
    if (currentProblemLangs.length > 0 && !currentProblemLangs.includes(selectedLanguage)) {
      setSelectedLanguage(currentProblemLangs.includes("JavaScript") ? "JavaScript" : currentProblemLangs[0]);
    } else if (currentProblemLangs.length === 0 && selectedLanguage !== "Info") {
        setSelectedLanguage("Info");
    }
  }, [selectedProblem, selectedLanguage]);


  const codeToDisplay = problemSpecificSnippets[selectedLanguage] || [];
  const problemLabel = selectedProblem === 'positiveOnly' ? 'Given Sum (Positive Nums)' : 'Given Sum (Any Nums)';

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString && selectedLanguage !== 'Info') {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} ${problemLabel} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    } else {
      toast({ title: "No Code to Copy", variant: "default" });
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {problemLabel}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={codeToDisplay.length === 0 || selectedLanguage === 'Info'}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        {languages.length > 0 ? (
        <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="flex flex-col flex-grow overflow-hidden">
          <TabsList className="mx-4 mb-1 self-start shrink-0">
            {languages.map((lang) => (
              <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-1 h-auto">
                {lang}
              </TabsTrigger>
            ))}
          </TabsList>
            <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
              <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
                {codeToDisplay.map((line, index) => (
                  <div key={`${selectedProblem}-${selectedLanguage}-line-${index}`}
                    className={`px-2 py-0.5 rounded ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                    <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                    {line}
                  </div>
                ))}
              </pre>
            </ScrollArea>
        </Tabs>
         ) : (
          <div className="flex-grow overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
              <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
                 <p className="text-muted-foreground p-4">No code snippets available for this problem type/language.</p>
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
