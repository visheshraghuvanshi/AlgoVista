
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define and export code snippets directly within this file
export const DUTCH_NATIONAL_FLAG_CODE_SNIPPETS = {
  JavaScript: [
    "function dutchNationalFlagSort(arr) {",             // 1
    "  let low = 0, mid = 0, high = arr.length - 1;",    // 2
    "  while (mid <= high) {",                           // 3
    "    switch (arr[mid]) {",
    "      case 0: // Element is 0",                     // 4
    "        [arr[low], arr[mid]] = [arr[mid], arr[low]];", // 5
    "        low++; mid++; break;",                       // 6
    "      case 1: // Element is 1",                     // 8
    "        mid++; break;",                             // 9
    "      case 2: // Element is 2",                     // 11
    "        [arr[mid], arr[high]] = [arr[high], arr[mid]];", // 12
    "        high--; break;",                            // 13
    "    }",                                             // (End switch) maps to 15 conceptually
    "  }",                                               // 16
    "  return arr;",                                      // 17
    "}",                                                  // 18
  ],
  Python: [
    "def dutch_national_flag_sort(arr):",
    "    low, mid, high = 0, 0, len(arr) - 1",
    "    while mid <= high:",
    "        if arr[mid] == 0:",
    "            arr[low], arr[mid] = arr[mid], arr[low]",
    "            low += 1",
    "            mid += 1",
    "        elif arr[mid] == 1:",
    "            mid += 1",
    "        else: # arr[mid] == 2",
    "            arr[mid], arr[high] = arr[high], arr[mid]",
    "            high -= 1",
    "    return arr",
  ],
  Java: [
    "public class DutchNationalFlag {",
    "    public static void sort(int[] arr) {",
    "        int low = 0, mid = 0, high = arr.length - 1;",
    "        int temp;",
    "        while (mid <= high) {",
    "            switch (arr[mid]) {",
    "                case 0:",
    "                    temp = arr[low]; arr[low] = arr[mid]; arr[mid] = temp;",
    "                    low++; mid++; break;",
    "                case 1:",
    "                    mid++; break;",
    "                case 2:",
    "                    temp = arr[mid]; arr[mid] = arr[high]; arr[high] = temp;",
    "                    high--; break;",
    "            }",
    "        }",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::swap",
    "void dutchNationalFlagSort(std::vector<int>& arr) {",
    "    int low = 0, mid = 0, high = arr.size() - 1;",
    "    while (mid <= high) {",
    "        switch (arr[mid]) {",
    "            case 0:",
    "                std::swap(arr[low++], arr[mid++]);",
    "                break;",
    "            case 1:",
    "                mid++;",
    "                break;",
    "            case 2:",
    "                std::swap(arr[mid], arr[high--]);",
    "                break;",
    "        }",
    "    }",
    "}",
  ],
};


interface DutchNationalFlagCodePanelProps {
  // codeSnippets prop is removed as it's now internal
  currentLine: number | null;
}

export function DutchNationalFlagCodePanel({ currentLine }: DutchNationalFlagCodePanelProps) {
  const { toast } = useToast();
  // Use the internally defined snippets
  const languages = useMemo(() => Object.keys(DUTCH_NATIONAL_FLAG_CODE_SNIPPETS), []);
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    if (languages.length > 0) {
      return languages.includes("JavaScript") ? "JavaScript" : languages[0];
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
    // Use internal snippets
    const codeToCopy = DUTCH_NATIONAL_FLAG_CODE_SNIPPETS[selectedLanguage as keyof typeof DUTCH_NATIONAL_FLAG_CODE_SNIPPETS]?.join('\n') || '';
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
  
  const currentCodeLines = useMemo(() => {
    return selectedLanguage === 'Info' ? [] : (DUTCH_NATIONAL_FLAG_CODE_SNIPPETS[selectedLanguage as keyof typeof DUTCH_NATIONAL_FLAG_CODE_SNIPPETS] || []);
  }, [selectedLanguage]);

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
                    {(DUTCH_NATIONAL_FLAG_CODE_SNIPPETS[lang as keyof typeof DUTCH_NATIONAL_FLAG_CODE_SNIPPETS] || []).map((line, index) => (
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
