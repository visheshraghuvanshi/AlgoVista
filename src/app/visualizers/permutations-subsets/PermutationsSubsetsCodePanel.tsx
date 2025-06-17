
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PermutationsSubsetsProblemType } from './permutations-subsets-logic';

export const PERMUTATIONS_SUBSETS_CODE_SNIPPETS: Record<PermutationsSubsetsProblemType, Record<string, string[]>> = {
  permutations: {
    JavaScript: [
      "function getAllPermutations(elements) {",
      "  const result = [];",
      "  function backtrack(currentPermutation, remaining) {",
      "    if (remaining.length === 0) {",
      "      result.push([...currentPermutation]);",
      "      return;",
      "    }",
      "    for (let i = 0; i < remaining.length; i++) {",
      "      currentPermutation.push(remaining[i]);",
      "      const nextRemaining = remaining.filter((_, idx) => idx !== i);",
      "      backtrack(currentPermutation, nextRemaining);",
      "      currentPermutation.pop(); // Backtrack",
      "    }",
      "  }",
      "  backtrack([], elements);",
      "  return result;",
      "}",
    ],
    Python: [
      "def get_all_permutations(elements):",
      "    result = []",
      "    def backtrack(current_permutation, remaining):",
      "        if not remaining:",
      "            result.append(list(current_permutation))",
      "            return",
      "        for i in range(len(remaining)):",
      "            current_permutation.append(remaining[i])",
      "            next_remaining = remaining[:i] + remaining[i+1:]",
      "            backtrack(current_permutation, next_remaining)",
      "            current_permutation.pop() # Backtrack",
      "    backtrack([], elements)",
      "    return result",
    ],
    Java: [
      "import java.util.*;",
      "class Solution {",
      "    public List<List<Integer>> permute(int[] nums) {",
      "        List<List<Integer>> result = new ArrayList<>();",
      "        backtrack(new ArrayList<>(), nums, new boolean[nums.length], result);",
      "        return result;",
      "    }",
      "    private void backtrack(List<Integer> currentPermutation, int[] nums, boolean[] used, List<List<Integer>> result) {",
      "        if (currentPermutation.size() == nums.length) {",
      "            result.add(new ArrayList<>(currentPermutation));",
      "            return;",
      "        }",
      "        for (int i = 0; i < nums.length; i++) {",
      "            if (used[i]) continue;",
      "            used[i] = true;",
      "            currentPermutation.add(nums[i]);",
      "            backtrack(currentPermutation, nums, used, result);",
      "            currentPermutation.remove(currentPermutation.size() - 1);",
      "            used[i] = false;",
      "        }",
      "    }",
      "}",
    ],
    "C++": [
      "#include <vector>",
      "#include <algorithm> // For std::next_permutation (alternative) or manual backtrack",
      "void backtrack(std::vector<int>& nums, int start, std::vector<std::vector<int>>& result) {",
      "    if (start == nums.size()) {",
      "        result.push_back(nums);",
      "        return;",
      "    }",
      "    for (int i = start; i < nums.size(); ++i) {",
      "        std::swap(nums[start], nums[i]);",
      "        backtrack(nums, start + 1, result);",
      "        std::swap(nums[start], nums[i]); // Backtrack",
      "    }",
      "}",
      "std::vector<std::vector<int>> getAllPermutations(std::vector<int>& nums) {",
      "    std::vector<std::vector<int>> result;",
      "    backtrack(nums, 0, result);",
      "    return result;",
      "}",
    ],
  },
  subsets: {
    JavaScript: [
      "function getAllSubsets(elements) {",
      "  const result = [];",
      "  function backtrack(startIndex, currentSubset) {",
      "    result.push([...currentSubset]);",
      "    for (let i = startIndex; i < elements.length; i++) {",
      "      currentSubset.push(elements[i]);",
      "      backtrack(i + 1, currentSubset);",
      "      currentSubset.pop(); // Backtrack",
      "    }",
      "  }",
      "  backtrack(0, []);",
      "  return result;",
      "}",
    ],
    Python: [
      "def get_all_subsets(elements):",
      "    result = []",
      "    def backtrack(start_index, current_subset):",
      "        result.append(list(current_subset))",
      "        for i in range(start_index, len(elements)):",
      "            current_subset.append(elements[i])",
      "            backtrack(i + 1, current_subset)",
      "            current_subset.pop() # Backtrack",
      "    backtrack(0, [])",
      "    return result",
    ],
    Java: [
      "import java.util.*;",
      "class Solution {",
      "    public List<List<Integer>> subsets(int[] nums) {",
      "        List<List<Integer>> result = new ArrayList<>();",
      "        backtrack(0, new ArrayList<>(), nums, result);",
      "        return result;",
      "    }",
      "    private void backtrack(int startIndex, List<Integer> currentSubset, int[] nums, List<List<Integer>> result) {",
      "        result.add(new ArrayList<>(currentSubset));",
      "        for (int i = startIndex; i < nums.length; i++) {",
      "            currentSubset.add(nums[i]);",
      "            backtrack(i + 1, currentSubset, nums, result);",
      "            currentSubset.remove(currentSubset.size() - 1);",
      "        }",
      "    }",
      "}",
    ],
    "C++": [
      "#include <vector>",
      "void backtrack(int startIndex, std::vector<int>& currentSubset, std::vector<int>& nums, std::vector<std::vector<int>>& result) {",
      "    result.push_back(currentSubset);",
      "    for (int i = startIndex; i < nums.size(); ++i) {",
      "        currentSubset.push_back(nums[i]);",
      "        backtrack(i + 1, currentSubset, nums, result);",
      "        currentSubset.pop_back(); // Backtrack",
      "    }",
      "}",
      "std::vector<std::vector<int>> getAllSubsets(std::vector<int>& nums) {",
      "    std::vector<std::vector<int>> result;",
      "    std::vector<int> currentSubset;",
      "    backtrack(0, currentSubset, nums, result);",
      "    return result;",
      "}",
    ],
  },
};

interface PermutationsSubsetsCodePanelProps {
  currentLine: number | null;
  selectedProblemType: PermutationsSubsetsProblemType;
}

export function PermutationsSubsetsCodePanel({ currentLine, selectedProblemType }: PermutationsSubsetsCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(PERMUTATIONS_SUBSETS_CODE_SNIPPETS[selectedProblemType]), [selectedProblemType]);
  
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  React.useEffect(() => { // Reset language if problem type changes and current language not available
    const currentProblemLanguages = Object.keys(PERMUTATIONS_SUBSETS_CODE_SNIPPETS[selectedProblemType]);
    if (!currentProblemLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(currentProblemLanguages.includes("JavaScript") ? "JavaScript" : currentProblemLanguages[0]);
    }
  }, [selectedProblemType, selectedLanguage]);

  const handleCopyCode = () => {
    const codeToCopy = PERMUTATIONS_SUBSETS_CODE_SNIPPETS[selectedProblemType][selectedLanguage]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for ${selectedProblemType} Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  const currentCodeLines = PERMUTATIONS_SUBSETS_CODE_SNIPPETS[selectedProblemType][selectedLanguage] || [];

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: {selectedProblemType.charAt(0).toUpperCase() + selectedProblemType.slice(1)}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={currentCodeLines.length === 0}>
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
          {languages.map((lang) => (
            <TabsContent key={lang} value={lang} className="m-0 flex-grow overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
                <pre className="font-code text-sm p-4">
                  {PERMUTATIONS_SUBSETS_CODE_SNIPPETS[selectedProblemType][lang]?.map((line, index) => (
                    <div
                      key={`${selectedProblemType}-${lang}-line-${index}`}
                      className={`px-2 py-0.5 rounded transition-colors duration-150 ${
                        index + 1 === currentLine && lang === selectedLanguage ? "bg-accent text-accent-foreground" : "text-foreground"
                      }`}
                      aria-current={index + 1 === currentLine && lang === selectedLanguage ? "step" : undefined}
                    >
                      <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                        {index + 1}
                      </span>
                      {line}
                    </div>
                  ))}
                </pre>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
