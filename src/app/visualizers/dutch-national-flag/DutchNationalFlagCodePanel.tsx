
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DutchNationalFlagCodePanelProps {
  codeSnippets: { [language: string]: string[] };
  currentLine: number | null;
}

export function DutchNationalFlagCodePanel({ codeSnippets, currentLine }: DutchNationalFlagCodePanelProps) {
  const { toast } = useToast();

  // Memoize the languages array to ensure stability unless codeSnippets prop changes
  const languages = useMemo(() => Object.keys(codeSnippets || {}), [codeSnippets]);

  // Initialize selectedLanguage using a function to ensure it's set correctly on mount
  // based on the initial codeSnippets prop.
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    const initialLangs = Object.keys(codeSnippets || {});
    if (initialLangs.length > 0) {
      return initialLangs.includes("JavaScript") ? "JavaScript" : initialLangs[0];
    }
    return "Info"; // Default if no languages
  });

  // This useEffect synchronizes selectedLanguage if the `languages` array changes
  // (e.g., if codeSnippets prop was dynamic, though it's constant here).
  // It ensures selectedLanguage is always valid.
  useEffect(() => {
    setSelectedLanguage(prevSelectedLang => {
      if (languages.length > 0) {
        if (languages.includes(prevSelectedLang)) {
          return prevSelectedLang; // Current selection is still valid
        }
        // Current selection is invalid, pick a new default
        return languages.includes("JavaScript") ? "JavaScript" : languages[0];
      } else {
        // No languages available
        return "Info";
      }
    });
  }, [languages]); // ONLY depends on the 'languages' array

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
  
  // This derived value determines which tab is active.
  // It falls back to a default if selectedLanguage is somehow invalid.
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
