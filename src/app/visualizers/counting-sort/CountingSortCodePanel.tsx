
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const COUNTING_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "function countingSort(arr) {",                       // 1
    "  if (arr.length === 0) return arr;",                // 2
    "  const maxVal = Math.max(...arr);",                 // 3
    "  const count = new Array(maxVal + 1).fill(0);",     // 4
    "  for (let i = 0; i < arr.length; i++) {",            // 5
    "    count[arr[i]]++;",                               // 6
    "  }",
    "  for (let i = 1; i <= maxVal; i++) {",               // 7
    "    count[i] += count[i - 1];",                      // 8
    "  }",
    "  const output = new Array(arr.length);",            // 9
    "  for (let i = arr.length - 1; i >= 0; i--) {",       // 10
    "    output[count[arr[i]] - 1] = arr[i];",            // 11
    "    count[arr[i]]--;",                               // 12
    "  }",
    "  for (let i = 0; i < arr.length; i++) {",            // 13
    "    arr[i] = output[i];",                            // 14
    "  }",
    "  return arr;",                                      // 15
    "}",                                                  // 16
  ],
  Python: [
    "def counting_sort(arr):",
    "    if not arr: return arr",
    "    max_val = max(arr)",
    "    count = [0] * (max_val + 1)",
    "    output = [0] * len(arr)",
    "    for num in arr:",
    "        count[num] += 1",
    "    for i in range(1, max_val + 1):",
    "        count[i] += count[i-1]",
    "    for i in range(len(arr) - 1, -1, -1):",
    "        output[count[arr[i]] - 1] = arr[i]",
    "        count[arr[i]] -= 1",
    "    for i in range(len(arr)):",
    "        arr[i] = output[i]",
    "    return arr",
  ],
  Java: [
    "import java.util.Arrays;",
    "class CountingSort {",
    "    public static void sort(int[] arr) {",
    "        if (arr.length == 0) return;",
    "        int maxVal = Arrays.stream(arr).max().getAsInt();",
    "        int[] count = new int[maxVal + 1];",
    "        int[] output = new int[arr.length];",
    "        for (int num : arr) { count[num]++; }",
    "        for (int i = 1; i <= maxVal; i++) { count[i] += count[i-1]; }",
    "        for (int i = arr.length - 1; i >= 0; i--) {",
    "            output[count[arr[i]] - 1] = arr[i];",
    "            count[arr[i]]--;",
    "        }",
    "        System.arraycopy(output, 0, arr, 0, arr.length);",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::max_element, std::fill",
    "void countingSort(std::vector<int>& arr) {",
    "    if (arr.empty()) return;",
    "    int maxVal = 0; if (!arr.empty()) maxVal = *std::max_element(arr.begin(), arr.end());",
    "    std::vector<int> count(maxVal + 1, 0);",
    "    std::vector<int> output(arr.size());",
    "    for (int num : arr) { count[num]++; }",
    "    for (int i = 1; i <= maxVal; ++i) { count[i] += count[i-1]; }",
    "    for (int i = arr.size() - 1; i >= 0; --i) {",
    "        output[count[arr[i]] - 1] = arr[i];",
    "        count[arr[i]]--;",
    "    }",
    "    arr = output;",
    "}",
  ],
};

interface CountingSortCodePanelProps {
  currentLine: number | null;
}

export function CountingSortCodePanel({ currentLine }: CountingSortCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(COUNTING_SORT_CODE_SNIPPETS), []);
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    const initialLangs = Object.keys(COUNTING_SORT_CODE_SNIPPETS);
    if (initialLangs.length > 0) {
      return initialLangs.includes("JavaScript") ? "JavaScript" : initialLangs[0];
    }
    return "Info";
  });

  useEffect(() => {
    setSelectedLanguage(prevSelectedLang => {
      if (languages.length > 0) {
        if (languages.includes(prevSelectedLang)) {
          return prevSelectedLang; 
        }
        return languages.includes("JavaScript") ? "JavaScript" : languages[0];
      } else {
        return "Info";
      }
    });
  }, [languages]);

  const handleSelectedLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const handleCopyCode = () => {
    const codeToCopy = COUNTING_SORT_CODE_SNIPPETS[selectedLanguage as keyof typeof COUNTING_SORT_CODE_SNIPPETS]?.join('\n') || '';
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

  const tabValue = useMemo(() => {
    if (languages.includes(selectedLanguage)) {
      return selectedLanguage;
    }
    if (languages.length > 0) {
      return languages.includes("JavaScript") ? "JavaScript" : languages[0];
    }
    return "Info";
  }, [languages, selectedLanguage]);

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={selectedLanguage === 'Info'}>
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
                    {(COUNTING_SORT_CODE_SNIPPETS[lang as keyof typeof COUNTING_SORT_CODE_SNIPPETS] || []).map((line, index) => (
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
              <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
                 <p className="text-muted-foreground p-4">No code snippets available for this visualizer.</p>
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

