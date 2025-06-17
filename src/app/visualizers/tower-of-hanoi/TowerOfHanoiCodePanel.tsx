
"use client";

import React, {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { TOWER_OF_HANOI_LINE_MAP } from './tower-of-hanoi-logic';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';


const TOWER_OF_HANOI_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "function towerOfHanoi(n, source, auxiliary, target) {", // 1
    "  if (n === 1) {",                                      // 2
    "    console.log(`Move disk 1 from ${source} to ${target}`);", // 3
    "    return;",                                            // 4
    "  }",
    "  towerOfHanoi(n - 1, source, target, auxiliary);",      // 5
    "  console.log(`Move disk ${n} from ${source} to ${target}`);", // 6
    "  towerOfHanoi(n - 1, auxiliary, source, target);",      // 7
    "}",                                                      // 8
  ],
  Python: [
    "def tower_of_hanoi(n, source, auxiliary, target):",
    "    if n == 1:",
    "        print(f\"Move disk 1 from {source} to {target}\")",
    "        return",
    "    tower_of_hanoi(n - 1, source, target, auxiliary)",
    "    print(f\"Move disk {n} from {source} to {target}\")",
    "    tower_of_hanoi(n - 1, auxiliary, source, target)",
  ],
  Java: [
    "public class TowerOfHanoi {",
    "    public static void solve(int n, char source, char auxiliary, char target) {",
    "        if (n == 1) {",
    "            System.out.println(\"Move disk 1 from \" + source + \" to \" + target);",
    "            return;",
    "        }",
    "        solve(n - 1, source, target, auxiliary);",
    "        System.out.println(\"Move disk \" + n + \" from \" + source + \" to \" + target);",
    "        solve(n - 1, auxiliary, source, target);",
    "    }",
    "}",
  ],
  "C++": [
    "#include <iostream>",
    "void towerOfHanoi(int n, char source, char auxiliary, char target) {",
    "    if (n == 1) {",
    "        std::cout << \"Move disk 1 from \" << source << \" to \" << target << std::endl;",
    "        return;",
    "    }",
    "    towerOfHanoi(n - 1, source, target, auxiliary);",
    "    std::cout << \"Move disk \" << n << \" from \" << source << \" to \" << target << std::endl;",
    "    towerOfHanoi(n - 1, auxiliary, source, target);",
    "}",
  ],
};

interface TowerOfHanoiCodePanelProps {
  currentLine: number | null;
}

export function TowerOfHanoiCodePanel({ currentLine }: TowerOfHanoiCodePanelProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const languages = Object.keys(TOWER_OF_HANOI_CODE_SNIPPETS);
  const codeToDisplay = TOWER_OF_HANOI_CODE_SNIPPETS[selectedLanguage] || [];


  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} Tower of Hanoi Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code
        </CardTitle>
         <div className="flex items-center gap-2">
            <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 h-8 text-xs p-0.5">
                    {languages.map(lang => (
                        <TabsTrigger key={lang} value={lang} className="text-xs px-1.5 py-0.5 h-auto">
                            {lang}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
            {codeToDisplay.map((line, index) => (
              <div key={`toh-${selectedLanguage}-line-${index}`}
                className={`px-2 py-0.5 rounded ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                {line}
              </div>
            ))}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
