
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KADANES_ALGORITHM_LINE_MAP } from './kadanes-algorithm-logic';


// Adjusted JavaScript snippet to match the refined KADANES_ALGORITHM_LINE_MAP
export const KADANES_ALGORITHM_CODE_SNIPPETS_REFINED = {
  JavaScript: [
    "function kadanesAlgorithm(arr) {",                            // 1 (functionDeclaration)
    "  let maxSoFar = -Infinity;",                                // 2 (initMaxSoFar_NegativeInfinity)
    "  let currentMax = 0;",                                      // 3 (initCurrentMax_Zero)
    "  for (let i = 0; i < arr.length; i++) {",                   // 4 (loopStart)
    "    currentMax += arr[i];",                                 // 5 (addToCurrentMax)
    "    if (currentMax > maxSoFar) {",                           // 6 (checkCurrentMaxGreaterThanMaxSoFar)
    "      maxSoFar = currentMax;",                               // 7 (updateMaxSoFar)
    "    }",
    "    if (currentMax < 0) {",                                  // 8 (checkCurrentMaxNegative)
    "      currentMax = 0;",                                      // 9 (resetCurrentMax)
    "    }",
    "  }",                                                        // 10 (loopEnd)
    "  if (maxSoFar === -Infinity && arr.length > 0) return Math.max(...arr);", // 11 (handleAllNegativeOrEmpty)
    "  return arr.length === 0 ? 0 : maxSoFar;",                  // 12 (returnMaxSoFar)
    "}",                                                          // 13 (functionEnd)
  ],
   Python: [ // Simplified Python to match JS structure for line mapping
    "def kadanes_algorithm(arr):",
    "    if not arr: return 0",
    "    max_so_far = -float('inf')",
    "    current_max = 0",
    "    for x in arr:",
    "        current_max += x",
    "        if current_max > max_so_far:",
    "            max_so_far = current_max",
    "        if current_max < 0:",
    "            current_max = 0",
    "    if max_so_far == -float('inf'): return max(arr) if arr else 0",
    "    return max_so_far",
  ],
};


interface KadanesAlgorithmCodePanelProps {
  codeSnippets: { [language: string]: string[] };
  currentLine: number | null;
}

export function KadanesAlgorithmCodePanel({ codeSnippets, currentLine }: KadanesAlgorithmCodePanelProps) {
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
                <ScrollArea key={`${lang}-scrollarea`} className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
                  <pre className="font-code text-sm p-4">
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

