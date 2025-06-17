
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const BUCKET_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "// Bucket Sort (using Insertion Sort for buckets)",    // Conceptual Line
    "function bucketSort(arr, numBuckets = 5) {",         // 1
    "  if (arr.length === 0) return arr;",                // 2
    "  const buckets = Array.from({ length: numBuckets }, () => []);", // 3, 4
    "  const maxVal = Math.max(...arr);", // Needed for scaling
    "  // Distribute elements into buckets",
    "  for (let i = 0; i < arr.length; i++) {",            // 5
    "    let bucketIdx = Math.floor((arr[i] / (maxVal + 1)) * numBuckets);", // 6
    "    bucketIdx = Math.min(bucketIdx, numBuckets - 1);",
    "    buckets[bucketIdx].push(arr[i]);",               // 7
    "  }",
    "  // Sort individual buckets and concatenate",
    "  const result = [];",
    "  for (let i = 0; i < numBuckets; i++) {",            // 8
    "    insertionSort(buckets[i]); // Helper function", // 9 (Conceptual)
    "    result.push(...buckets[i]);",                   // (Conceptual for gather step)
    "  }",
    "  return result;",                                   // 16 (Conceptual: main return)
    "}",                                                  // 17
    "// Helper: insertionSort(bucketArr) { /* ... */ }",
  ],
  Python: [
    "def insertion_sort_for_bucket(bucket):",
    "    for i in range(1, len(bucket)):",
    "        key = bucket[i]",
    "        j = i - 1",
    "        while j >= 0 and key < bucket[j]:",
    "            bucket[j + 1] = bucket[j]",
    "            j -= 1",
    "        bucket[j + 1] = key",
    "    return bucket",
    "",
    "def bucket_sort(arr, num_buckets=5):",
    "    if not arr: return arr",
    "    max_val = max(arr)",
    "    min_val = min(arr) # For handling non-zero min ranges if needed",
    "    if max_val == min_val: return arr # All elements are same",
    "",
    "    bucket_range = (max_val - min_val + 1) / num_buckets",
    "    buckets = [[] for _ in range(num_buckets)]",
    "    for x in arr:",
    "        # Ensure index is within bounds [0, num_buckets-1]",
    "        idx = min(num_buckets - 1, int((x - min_val) // bucket_range))",
    "        buckets[idx].append(x)",
    "",
    "    result = []",
    "    for i in range(num_buckets):",
    "        insertion_sort_for_bucket(buckets[i])",
    "        result.extend(buckets[i])",
    "    return result",
  ],
  Java: [
    "import java.util.*;",
    "class BucketSort {",
    "    void insertionSort(List<Integer> bucket) { Collections.sort(bucket); } // Simplified",
    "    public int[] sort(int[] arr, int numBuckets) {",
    "        if (arr.length == 0) return arr;",
    "        int maxVal = arr[0]; for (int val : arr) maxVal = Math.max(maxVal, val);",
    "        List<List<Integer>> buckets = new ArrayList<>(numBuckets);",
    "        for (int i = 0; i < numBuckets; i++) buckets.add(new ArrayList<>());",
    "        for (int val : arr) {",
    "            int bucketIdx = (int) ((double)val / (maxVal + 1) * numBuckets);",
    "            bucketIdx = Math.min(bucketIdx, numBuckets - 1);",
    "            buckets.get(bucketIdx).add(val);",
    "        }",
    "        int index = 0;",
    "        for (List<Integer> bucket : buckets) {",
    "            insertionSort(bucket);",
    "            for (int val : bucket) arr[index++] = val;",
    "        }",
    "        return arr;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::sort, std::max_element",
    "void insertionSortBucket(std::vector<int>& bucket) { std::sort(bucket.begin(), bucket.end()); }",
    "std::vector<int> bucketSort(std::vector<int>& arr, int numBuckets) {",
    "    if (arr.empty()) return arr;",
    "    int maxVal = 0; if (!arr.empty()) maxVal = *std::max_element(arr.begin(), arr.end());",
    "    std::vector<std::vector<int>> buckets(numBuckets);",
    "    for (int val : arr) {",
    "        int bucketIdx = static_cast<int>(static_cast<double>(val) / (maxVal + 1) * numBuckets);",
    "        bucketIdx = std::min(bucketIdx, numBuckets - 1);",
    "        buckets[bucketIdx].push_back(val);",
    "    }",
    "    int index = 0;",
    "    for (auto& bucket : buckets) {",
    "        insertionSortBucket(bucket);",
    "        for (int val : bucket) arr[index++] = val;",
    "    }",
    "    return arr;",
    "}",
  ],
};

interface BucketSortCodePanelProps {
  currentLine: number | null;
}

export function BucketSortCodePanel({ currentLine }: BucketSortCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(BUCKET_SORT_CODE_SNIPPETS), []);
  
  const initialLanguage = languages.length > 0 && languages.includes("JavaScript") ? "JavaScript" : (languages.length > 0 ? languages[0] : "Info");
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  React.useEffect(() => {
    if (languages.length > 0 && !languages.includes(selectedLanguage)) {
      setSelectedLanguage(languages.includes("JavaScript") ? "JavaScript" : languages[0]);
    } else if (languages.length === 0 && selectedLanguage !== "Info") {
        setSelectedLanguage("Info");
    }
  }, [languages, selectedLanguage]);

  const handleSelectedLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const handleCopyCode = () => {
    const codeToCopy = BUCKET_SORT_CODE_SNIPPETS[selectedLanguage]?.join('\n') || '';
    if (codeToCopy && selectedLanguage !== 'Info') {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => {
          toast({ title: `${selectedLanguage} Code Copied!`, description: "The code has been copied to your clipboard." });
        })
        .catch(err => {
          toast({ title: "Copy Failed", description: "Could not copy code to clipboard.", variant: "destructive" });
        });
    } else {
        toast({ title: "No Code to Copy", description: "No code available for selected language.", variant: "default" });
    }
  };

  const currentCodeLines = useMemo(() => {
    return selectedLanguage === 'Info' ? [] : (BUCKET_SORT_CODE_SNIPPETS[selectedLanguage] || []);
  }, [selectedLanguage]);

  const tabValue = languages.includes(selectedLanguage) 
                   ? selectedLanguage 
                   : (languages.length > 0 ? (languages.includes("JavaScript") ? "JavaScript" : languages[0]) : 'Info');

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={currentCodeLines.length === 0 || selectedLanguage === 'Info'}>
          <ClipboardCopy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        {languages.length > 0 ? (
          <Tabs value={tabValue} onValueChange={handleSelectedLanguageChange} className="flex flex-col flex-grow overflow-hidden">
            <TabsList className="mx-4 mb-1 self-start shrink-0">
              {languages.map((lang) => (
                <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-1 h-auto">
                  {lang}
                </TabsTrigger>
              ))}
            </TabsList>
            {languages.map((lang) => (
              <TabsContent key={lang} value={lang} className="m-0 flex-grow overflow-hidden flex flex-col">
                <ScrollArea key={`${lang}-scrollarea`} className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
                  <pre className="font-code text-sm p-4">
                    {(BUCKET_SORT_CODE_SNIPPETS[lang] || []).map((line, index) => (
                      <div
                        key={`${lang}-line-${index}`}
                        className={`px-2 py-0.5 rounded transition-colors duration-150 ${
                          index + 1 === currentLine && lang === tabValue ? "bg-accent text-accent-foreground" : "text-foreground"
                        }`}
                        aria-current={index + 1 === currentLine && lang === tabValue ? "step" : undefined}
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
        ) : (
          <div className="flex-grow overflow-hidden flex flex-col">
            <ScrollArea key={`${tabValue}-scrollarea-single`} className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
              <pre className="font-code text-sm p-4">
                 <p className="text-muted-foreground p-4">No code snippets available for this visualizer.</p>
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
