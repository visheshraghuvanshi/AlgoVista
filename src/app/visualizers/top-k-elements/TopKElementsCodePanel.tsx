
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Line map not directly used here, but logic file refers to conceptual lines in these snippets

export const TOP_K_ELEMENTS_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "// Find K Largest Elements using a Min-Heap",
    "function findKLargest(nums, k) {",
    "  const minHeap = new MinPriorityQueue(); // Conceptual Min-Heap",
    "  for (const num of nums) {",
    "    if (minHeap.size() < k) {",
    "      minHeap.enqueue(num);",
    "    } else if (num > minHeap.front().element) { // Compare with min element in heap",
    "      minHeap.dequeue(); // Remove smallest",
    "      minHeap.enqueue(num); // Add current larger element",
    "    }",
    "  }",
    "  return minHeap.toArray().map(item => item.element).sort((a,b)=>b-a); // Return elements",
    "}",
    "// MinPriorityQueue class would need to be implemented (enqueue, dequeue, front, size)",
  ],
  Python: [
    "import heapq",
    "def find_k_largest(nums, k):",
    "    min_heap = []",
    "    for num in nums:",
    "        if len(min_heap) < k:",
    "            heapq.heappush(min_heap, num)",
    "        elif num > min_heap[0]:",
    "            heapq.heapreplace(min_heap, num) # Pop smallest, push new",
    "    return sorted(list(min_heap), reverse=True)",
  ],
  Java: [
    "import java.util.PriorityQueue;",
    "import java.util.ArrayList;",
    "import java.util.Collections;",
    "import java.util.List;",
    "class Solution {",
    "    public List<Integer> findKLargest(int[] nums, int k) {",
    "        PriorityQueue<Integer> minHeap = new PriorityQueue<>(); // Min-heap by default",
    "        for (int num : nums) {",
    "            if (minHeap.size() < k) {",
    "                minHeap.offer(num);",
    "            } else if (num > minHeap.peek()) {",
    "                minHeap.poll();",
    "                minHeap.offer(num);",
    "            }",
    "        }",
    "        List<Integer> result = new ArrayList<>(minHeap);",
    "        Collections.sort(result, Collections.reverseOrder()); // For descending order",
    "        return result;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <queue>      // For std::priority_queue",
    "#include <functional> // For std::greater",
    "#include <algorithm>  // For std::sort",
    "std::vector<int> findKLargest(const std::vector<int>& nums, int k) {",
    "    // Min-heap: std::priority_queue<int, std::vector<int>, std::greater<int>>",
    "    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;",
    "    for (int num : nums) {",
    "        if (minHeap.size() < k) {",
    "            minHeap.push(num);",
    "        } else if (num > minHeap.top()) {",
    "            minHeap.pop();",
    "            minHeap.push(num);",
    "        }",
    "    }",
    "    std::vector<int> result;",
    "    while (!minHeap.empty()) {",
    "        result.push_back(minHeap.top());",
    "        minHeap.pop();",
    "    }",
    "    std::sort(result.rbegin(), result.rend()); // Sort in descending order",
    "    return result;",
    "}",
  ],
};


interface TopKElementsCodePanelProps {
  codeSnippets: Record<string, string[]>;
  currentLine: number | null;
}

export function TopKElementsCodePanel({ codeSnippets, currentLine }: TopKElementsCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(codeSnippets), [codeSnippets]);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = codeSnippets[selectedLanguage]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Top K Elements Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Top K Elements Code
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
            <pre className="font-code text-sm p-4">
              {codeSnippets[selectedLanguage]?.map((line, index) => (
                <div
                  key={`topk-${selectedLanguage}-line-${index}`}
                  className={`px-2 py-0.5 rounded whitespace-pre-wrap ${ index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground" }`}
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

    