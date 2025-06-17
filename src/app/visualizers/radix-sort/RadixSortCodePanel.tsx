"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RADIX_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "// Radix Sort (JavaScript - LSD, using Counting Sort as helper)", 
    "function radixSort(arr) {",                                
    "  if (arr.length === 0) return arr;",
    "  const maxVal = Math.max(...arr);",                       
    "  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {", 
    "    countingSortForRadix(arr, exp);",                      
    "  }",
    "  return arr;",                                            
    "}",                                                        
    "",
    "function countingSortForRadix(arr, exp) {",                 
    "  const n = arr.length;",                                  
    "  const output = new Array(n);",                           
    "  const count = new Array(10).fill(0);",                   
    "",
    "  for (let i = 0; i < n; i++) {",                           
    "    const digit = Math.floor(arr[i] / exp) % 10;",         
    "    count[digit]++;",                                      
    "  }",                                                      
    "",
    "  for (let i = 1; i < 10; i++) {",                          
    "    count[i] += count[i - 1];",                            
    "  }",                                                      
    "",
    "  for (let i = n - 1; i >= 0; i--) {",                      
    "    const digit = Math.floor(arr[i] / exp) % 10;",         
    "    output[count[digit] - 1] = arr[i];",                   
    "    count[digit]--;",                                      
    "  }",                                                      
    "",
    "  for (let i = 0; i < n; i++) {",                           
    "    arr[i] = output[i];",                                  
    "  }",                                                      
    "}",                                                        
  ],
  Python: [
    "def counting_sort_for_radix(arr, exp):",
    "    n = len(arr)",
    "    output = [0] * n",
    "    count = [0] * 10",
    "    for i in range(n):",
    "        index = arr[i] // exp",
    "        count[index % 10] += 1",
    "    for i in range(1, 10):",
    "        count[i] += count[i - 1]",
    "    i = n - 1",
    "    while i >= 0:",
    "        index = arr[i] // exp",
    "        output[count[index % 10] - 1] = arr[i]",
    "        count[index % 10] -= 1",
    "        i -= 1",
    "    for i in range(n):",
    "        arr[i] = output[i]",
    "",
    "def radix_sort(arr):",
    "    if not arr: return arr",
    "    max_val = max(arr)",
    "    exp = 1",
    "    while max_val // exp > 0:",
    "        counting_sort_for_radix(arr, exp)",
    "        exp *= 10",
    "    return arr",
  ],
   Java: [
    "import java.util.Arrays;",
    "class RadixSort {",
    "    static void countingSort(int arr[], int n, int exp) {",
    "        int output[] = new int[n];",
    "        int count[] = new int[10];",
    "        Arrays.fill(count, 0);",
    "        for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;",
    "        for (int i = 1; i < 10; i++) count[i] += count[i - 1];",
    "        for (int i = n - 1; i >= 0; i--) {",
    "            output[count[(arr[i] / exp) % 10] - 1] = arr[i];",
    "            count[(arr[i] / exp) % 10]--;",
    "        }",
    "        for (int i = 0; i < n; i++) arr[i] = output[i];",
    "    }",
    "    static void radixSort(int arr[]) {",
    "        if (arr.length == 0) return;",
    "        int maxVal = arr[0];",
    "        for (int i = 1; i < arr.length; i++) if (arr[i] > maxVal) maxVal = arr[i];",
    "        for (int exp = 1; maxVal / exp > 0; exp *= 10)",
    "            countingSort(arr, arr.length, exp);",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::max_element",
    "void countingSortForRadix(std::vector<int>& arr, int exp) {",
    "    int n = arr.size();",
    "    std::vector<int> output(n);",
    "    std::vector<int> count(10, 0);",
    "    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;",
    "    for (int i = 1; i < 10; i++) count[i] += count[i - 1];",
    "    for (int i = n - 1; i >= 0; i--) {",
    "        output[count[(arr[i] / exp) % 10] - 1] = arr[i];",
    "        count[(arr[i] / exp) % 10]--;",
    "    }",
    "    for (int i = 0; i < n; i++) arr[i] = output[i];",
    "}",
    "void radixSort(std::vector<int>& arr) {",
    "    if (arr.empty()) return;",
    "    int maxVal = 0;",
    "    if (!arr.empty()) maxVal = *std::max_element(arr.begin(), arr.end());",
    "    for (int exp = 1; maxVal / exp > 0; exp *= 10)",
    "        countingSortForRadix(arr, exp);",
    "}",
  ],
};

interface RadixSortCodePanelProps {
  codeSnippets: { [language: string]: string[] };
  currentLine: number | null;
}

export function RadixSortCodePanel({ codeSnippets, currentLine }: RadixSortCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(codeSnippets), [codeSnippets]);
  
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
    const codeToCopy = codeSnippets[selectedLanguage]?.join('\n') || '';
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
    return selectedLanguage === 'Info' ? [] : (codeSnippets[selectedLanguage] || []);
  }, [selectedLanguage, codeSnippets]);

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
                <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
                  <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
                    {(codeSnippets[lang] || []).map((line, index) => (
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

