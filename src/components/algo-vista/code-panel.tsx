
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodePanelProps {
  codeSnippets: { [language: string]: string[] };
  currentLine: number | null;
  defaultLanguage?: string;
}

export function CodePanel({ codeSnippets, currentLine, defaultLanguage }: CodePanelProps) {
  const { toast } = useToast();

  const languages = useMemo(() => Object.keys(codeSnippets), [codeSnippets]);

  const getEffectiveInitialLanguage = useCallback(() => {
    if (defaultLanguage && languages.includes(defaultLanguage)) {
      return defaultLanguage;
    }
    if (languages.length > 0) {
      return languages[0];
    }
    return 'Info'; // Fallback if no languages or snippets
  }, [defaultLanguage, languages]);

  const [selectedLanguage, setSelectedLanguage] = useState<string>(getEffectiveInitialLanguage());

  // Effect to update selectedLanguage if props (like codeSnippets or defaultLanguage) change,
  // or if the current selectedLanguage becomes invalid.
  useEffect(() => {
    const newEffectiveInitialLang = getEffectiveInitialLanguage();

    if (languages.length === 0) {
      // If there are no languages (e.g., codeSnippets is empty)
      if (selectedLanguage !== 'Info') {
        setSelectedLanguage('Info');
      }
    } else {
      // If there are languages
      if (!languages.includes(selectedLanguage)) {
        // If the current selectedLanguage is not in the new list of languages (e.g., it was removed)
        // OR if selectedLanguage was 'Info' and now we have actual languages.
        setSelectedLanguage(newEffectiveInitialLang);
      } else if (selectedLanguage === 'Info' && newEffectiveInitialLang !== 'Info') {
         // This handles the specific case where it was 'Info' (due to no snippets initially)
         // and now snippets are available, so we switch to the actual default/first language.
        setSelectedLanguage(newEffectiveInitialLang);
      }
      // If defaultLanguage prop itself changes and we want to reflect that:
      // This case is implicitly handled if the current selectedLanguage is NOT newEffectiveInitialLang
      // AND newEffectiveInitialLang is a valid language.
      // However, if selectedLanguage is already a valid language from the list,
      // and defaultLanguage prop changes to *another* valid language, this current logic
      // might not force a switch unless selectedLanguage became invalid.
      // For current use case, defaultLanguage prop is stable per algorithm page.
    }
  }, [languages, defaultLanguage, selectedLanguage, getEffectiveInitialLanguage]);


  const handleCopyCode = () => {
    const codeToCopy = codeSnippets[selectedLanguage]?.join('\n') || '';
    if (codeToCopy && selectedLanguage !== 'Info') {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => {
          toast({ title: `${selectedLanguage} Code Copied!`, description: "The code has been copied to your clipboard." });
        })
        .catch(err => {
          toast({ title: "Copy Failed", description: "Could not copy code to clipboard.", variant: "destructive" });
          console.error('Failed to copy code: ', err);
        });
    } else {
        toast({ title: "No Code to Copy", description: "No code available for the selected language.", variant: "default" });
    }
  };

  const currentCodeLines = selectedLanguage === 'Info' ? [] : (codeSnippets[selectedLanguage] || []);

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
                <ScrollArea key={`${lang}-scrollarea`} className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
                  <pre className="font-code text-sm p-4">
                    {(codeSnippets[lang] || []).map((line, index) => (
                      <div
                        key={`${lang}-${index}`}
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
        ) : (
          <div className="flex-grow overflow-hidden flex flex-col">
            <ScrollArea key={selectedLanguage} className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
              <pre className="font-code text-sm p-4">
                {currentCodeLines.map((line, index) => (
                  <div
                    key={`single-${index}`}
                    className={`px-2 py-0.5 rounded transition-colors duration-150 ${
                      index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"
                    }`}
                    aria-current={index + 1 === currentLine ? "step" : undefined}
                  >
                    <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                      {index + 1}
                    </span>
                    {line}
                  </div>
                ))}
                {currentCodeLines.length === 0 && <p className="text-muted-foreground p-4">No code available.</p>}
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
    
