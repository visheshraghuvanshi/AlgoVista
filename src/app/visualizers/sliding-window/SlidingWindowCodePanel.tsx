"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SlidingWindowProblemType } from './sliding-window-logic';

interface SlidingWindowCodePanelProps {
  codeSnippets: Record<SlidingWindowProblemType, Record<string, string[]>>; // Language -> Snippet Array
  currentLine: number | null;
  selectedProblem: SlidingWindowProblemType;
}

export function SlidingWindowCodePanel({ codeSnippets, currentLine, selectedProblem }: SlidingWindowCodePanelProps) {
  const { toast } = useToast();
  
  const problemSpecificSnippets = codeSnippets[selectedProblem] || {};
  const languages = useMemo(() => Object.keys(problemSpecificSnippets), [problemSpecificSnippets]);
  
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : (languages[0] || "Info");
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  React.useEffect(() => {
    const currentProblemLangs = Object.keys(codeSnippets[selectedProblem] || {});
    if (currentProblemLangs.length > 0 && !currentProblemLangs.includes(selectedLanguage)) {
      setSelectedLanguage(currentProblemLangs.includes("JavaScript") ? "JavaScript" : currentProblemLangs[0]);
    } else if (currentProblemLangs.length === 0 && selectedLanguage !== "Info") {
        setSelectedLanguage("Info");
    }
  }, [selectedProblem, selectedLanguage, codeSnippets]);


  const codeToDisplay = problemSpecificSnippets[selectedLanguage] || [];
  const problemLabel = selectedProblem === 'maxSumFixedK' ? 'Max Sum (Fixed K)' : 'Min Length (Target Sum)';

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString && selectedLanguage !== 'Info') {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} ${problemLabel} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    } else {
      toast({ title: "No Code to Copy", variant: "default" });
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {problemLabel}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={codeToDisplay.length === 0 || selectedLanguage === 'Info'}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
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
            <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
              <pre className="font-code text-sm p-4">
                {codeToDisplay.map((line, index) => (
                  <div key={`${selectedProblem}-${selectedLanguage}-line-${index}`}
                    className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                    <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                    {line}
                  </div>
                ))}
              </pre>
            </ScrollArea>
        </Tabs>
         ) : (
          <div className="flex-grow overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
              <pre className="font-code text-sm p-4">
                 <p className="text-muted-foreground p-4">No code snippets available for this problem type/language.</p>
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
