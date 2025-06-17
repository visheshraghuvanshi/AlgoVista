
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Moved from page.tsx and expanded
export const SHELL_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "function shellSort(arr) {",                            // 1
    "  let n = arr.length;",                               // 2
    "  // Start with a big gap, then reduce the gap",
    "  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {", // 3
    "    // Do a gapped insertion sort for this gap size.",
    "    for (let i = gap; i < n; i += 1) {",            // 4
    "      let temp = arr[i];",                           // 5
    "      let j;",
    "      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {", // 6 & 7
    "        arr[j] = arr[j - gap];",                     // 8
    "      }",
    "      arr[j] = temp;",                                // 9
    "    }",                                               // 10
    "  }",                                                 // 11
    "  return arr;",                                       // 12
    "}",                                                   // 13
  ],
  Python: [
    "def shell_sort(arr):",
    "    n = len(arr)",
    "    gap = n // 2",
    "    while gap > 0:",
    "        for i in range(gap, n):",
    "            temp = arr[i]",
    "            j = i",
    "            # Gapped insertion sort for current gap",
    "            while j >= gap and arr[j - gap] > temp:",
    "                arr[j] = arr[j - gap]",
    "                j -= gap",
    "            arr[j] = temp",
    "        gap //= 2",
    "    return arr",
  ],
  Java: [
    "public class ShellSort {",
    "    public static void sort(int[] arr) {",
    "        int n = arr.length;",
    "        for (int gap = n / 2; gap > 0; gap /= 2) {",
    "            for (int i = gap; i < n; i++) {",
    "                int temp = arr[i];",
    "                int j;",
    "                for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {",
    "                    arr[j] = arr[j - gap];",
    "                }",
    "                arr[j] = temp;",
    "            }",
    "        }",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "// #include <algorithm> // Not strictly needed for this version",
    "void shellSort(std::vector<int>& arr) {",
    "    int n = arr.size();",
    "    for (int gap = n / 2; gap > 0; gap /= 2) {",
    "        for (int i = gap; i < n; ++i) {",
    "            int temp = arr[i];",
    "            int j;",
    "            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {",
    "                arr[j] = arr[j - gap];",
    "            }",
    "            arr[j] = temp;",
    "        }",
    "    }",
    "}",
  ],
};


interface ShellSortCodePanelProps {
  currentLine: number | null;
}

export function ShellSortCodePanel({ currentLine }: ShellSortCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(SHELL_SORT_CODE_SNIPPETS), []);
  
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
    const codeToCopy = SHELL_SORT_CODE_SNIPPETS[selectedLanguage]?.join('\n') || '';
    if (codeToCopy && selectedLanguage !== 'Info') {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => {
          toast({ title: `${selectedLanguage} Shell Sort Code Copied!` });
        })
        .catch(err => {
          toast({ title: "Copy Failed", variant: "destructive" });
        });
    } else {
        toast({ title: "No Code to Copy", variant: "default" });
    }
  };

  const currentCodeLines = useMemo(() => {
    return selectedLanguage === 'Info' ? [] : (SHELL_SORT_CODE_SNIPPETS[selectedLanguage] || []);
  }, [selectedLanguage]);

  const tabValue = languages.includes(selectedLanguage) 
                   ? selectedLanguage 
                   : (languages.length > 0 ? (languages.includes("JavaScript") ? "JavaScript" : languages[0]) : 'Info');

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Shell Sort Code
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
                    {(SHELL_SORT_CODE_SNIPPETS[lang] || []).map((line, index) => (
                      <div
                        key={`${lang}-shell-line-${index}`}
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
            <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
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

