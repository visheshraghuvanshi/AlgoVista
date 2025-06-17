
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
    return 'Info';
  }, [defaultLanguage, languages]);

  const [selectedLanguage, setSelectedLanguage] = useState<string>(getEffectiveInitialLanguage);
  const [userHasInteractedWithTabs, setUserHasInteractedWithTabs] = useState(false);

  useEffect(() => {
    let newTargetLanguage: string;

    if (userHasInteractedWithTabs) {
      if (languages.includes(selectedLanguage)) {
        newTargetLanguage = selectedLanguage; // User's choice is valid
      } else {
        // User's choice became invalid (e.g. languages changed)
        newTargetLanguage = getEffectiveInitialLanguage();
        setUserHasInteractedWithTabs(false); // Reset interaction
      }
    } else {
      newTargetLanguage = getEffectiveInitialLanguage();
    }

    if (selectedLanguage !== newTargetLanguage) {
      setSelectedLanguage(newTargetLanguage);
    }
  }, [languages, defaultLanguage, selectedLanguage, userHasInteractedWithTabs, getEffectiveInitialLanguage]);


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

  // Ensure 'value' for Tabs is always one of the available 'languages' or a sensible default if empty.
  const tabValue = languages.includes(selectedLanguage) 
                   ? selectedLanguage 
                   : (languages.length > 0 ? languages[0] : 'Info');

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
            {/* Ensure selectedLanguage is used for key if it's the only one, or 'Info' */}
            <ScrollArea key={`${tabValue}-scrollarea-single`} className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
              <pre className="font-code text-sm p-4">
                {currentCodeLines.map((line, index) => (
                  <div
                    key={`${tabValue}-line-${index}`}
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
                {currentCodeLines.length === 0 && tabValue === 'Info' && (
                    <p className="text-muted-foreground p-4">No code available, or visualizer not fully implemented.</p>
                )}
                 {currentCodeLines.length === 0 && tabValue !== 'Info' && languages.length > 0 && (
                    <p className="text-muted-foreground p-4">Loading code for {tabValue}...</p>
                )}
                 {currentCodeLines.length === 0 && languages.length === 0 && tabValue === 'Info' && ( // Adjusted this condition
                     <p className="text-muted-foreground p-4">No languages available for display.</p>
                 )}
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
