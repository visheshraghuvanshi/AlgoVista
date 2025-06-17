
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
  const [userHasInteractedWithTabs, setUserHasInteractedWithTabs] = useState(false);


  useEffect(() => {
    // This effect ensures selectedLanguage is valid if codeSnippets/defaultLanguage props change.
    // It should not run just because selectedLanguage itself was set.
    const newEffectiveInitialLang = getEffectiveInitialLanguage();

    if (languages.length === 0) {
      if (selectedLanguage !== 'Info') {
        setSelectedLanguage('Info');
      }
    } else { // Languages are available
      // If current selectedLanguage is no longer valid (e.g., was 'Info' and now we have langs, or was a lang that got removed)
      // then reset to the new effective initial language.
      // Or, if the user hasn't interacted and the defaultLanguage prop suggests a different initial language.
      if (!languages.includes(selectedLanguage) || (selectedLanguage === 'Info' && newEffectiveInitialLang !== 'Info')) {
        setSelectedLanguage(newEffectiveInitialLang);
        setUserHasInteractedWithTabs(false); // Reset interaction if language context fundamentally changed
      } else if (
        !userHasInteractedWithTabs &&
        defaultLanguage &&
        languages.includes(defaultLanguage) &&
        selectedLanguage !== defaultLanguage
      ) {
         // If user hasn't picked a tab yet, and the defaultLanguage from props is valid and different, sync to it.
         // This handles cases where defaultLanguage prop might change, though less common for this app.
        setSelectedLanguage(defaultLanguage);
      }
    }
  }, [languages, defaultLanguage, getEffectiveInitialLanguage]); // Key change: selectedLanguage removed from deps

  const handleSelectedLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setUserHasInteractedWithTabs(true);
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
          console.error('Failed to copy code: ', err);
        });
    } else {
        toast({ title: "No Code to Copy", description: "No code available for the selected language.", variant: "default" });
    }
  };

  const currentCodeLines = useMemo(() => {
    return selectedLanguage === 'Info' ? [] : (codeSnippets[selectedLanguage] || []);
  }, [selectedLanguage, codeSnippets]);


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
        {languages.length > 1 ? (
          <Tabs value={selectedLanguage} onValueChange={handleSelectedLanguageChange} className="flex flex-col flex-grow overflow-hidden">
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
            <ScrollArea key={selectedLanguage + "-scrollarea-single"} className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
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
                {currentCodeLines.length === 0 && selectedLanguage === 'Info' && (
                    <p className="text-muted-foreground p-4">No code available, or visualizer not fully implemented.</p>
                )}
                 {currentCodeLines.length === 0 && selectedLanguage !== 'Info' && (
                    <p className="text-muted-foreground p-4">Loading code for {selectedLanguage}...</p>
                )}
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
    
