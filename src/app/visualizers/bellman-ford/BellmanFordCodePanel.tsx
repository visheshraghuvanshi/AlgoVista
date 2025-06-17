
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Snippets should be passed from the page component
interface BellmanFordCodePanelProps {
  codeSnippets: { [language: string]: string[] };
  currentLine: number | null;
  defaultLanguage?: string;
}

export function BellmanFordCodePanel({ codeSnippets, currentLine, defaultLanguage = "JavaScript" }: BellmanFordCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(codeSnippets), [codeSnippets]);

  const getInitialLanguage = () => {
    if (languages.length === 0) return 'Info';
    return languages.includes(defaultLanguage) ? defaultLanguage : languages[0];
  };

  const [selectedLanguage, setSelectedLanguage] = useState<string>(getInitialLanguage);
  
  useEffect(() => {
    const initialLang = getInitialLanguage();
    if (selectedLanguage !== initialLang && languages.includes(initialLang)) {
      setSelectedLanguage(initialLang);
    }
  }, [languages, defaultLanguage, selectedLanguage]);


  const handleSelectedLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const handleCopyCode = () => {
    const codeToCopy = codeSnippets[selectedLanguage]?.join('\n') || '';
    if (codeToCopy && selectedLanguage !== 'Info') {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => {
          toast({ title: `${selectedLanguage} Bellman-Ford Code Copied!` });
        })
        .catch(err => {
          toast({ title: "Copy Failed", variant: "destructive" });
        });
    } else {
        toast({ title: "No Code to Copy", variant: "default" });
    }
  };
  
  const currentCodeLines = useMemo(() => {
    return selectedLanguage === 'Info' ? [] : (codeSnippets[selectedLanguage] || []);
  }, [selectedLanguage, codeSnippets]);

  const effectiveTabValue = languages.length === 0 ? 'Info' : (languages.includes(selectedLanguage) ? selectedLanguage : getInitialLanguage());

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Bellman-Ford Code
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={currentCodeLines.length === 0 || selectedLanguage === 'Info'}>
          <ClipboardCopy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        {languages.length > 0 ? (
          <Tabs value={effectiveTabValue} onValueChange={handleSelectedLanguageChange} className="flex flex-col flex-grow overflow-hidden">
            <TabsList className="mx-4 mb-1 self-start shrink-0">
              {languages.map((lang) => (
                <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-1 h-auto">
                  {lang}
                </TabsTrigger>
              ))}
            </TabsList>
            {languages.map((lang) => (
              <TabsContent key={`${lang}-content`} value={lang} className="m-0 flex-grow overflow-hidden flex flex-col">
                <ScrollArea key={`${lang}-scrollarea`} className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
                  <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
                    {(codeSnippets[lang] || []).map((line, index) => (
                      <div
                        key={`${lang}-line-${index}`}
                        className={`px-2 py-0.5 rounded transition-colors duration-150 ${
                          index + 1 === currentLine && lang === effectiveTabValue ? "bg-accent text-accent-foreground" : "text-foreground"
                        }`}
                        aria-current={index + 1 === currentLine && lang === effectiveTabValue ? "step" : undefined}
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
                 <p className="text-muted-foreground p-4">No code snippets available.</p>
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
