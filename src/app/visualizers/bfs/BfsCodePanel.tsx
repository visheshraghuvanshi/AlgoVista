
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BfsCodePanelProps {
  codeSnippets: { [language: string]: string[] };
  currentLine: number | null;
  defaultLanguage?: string;
}

export const BFS_CODE_SNIPPETS_ALL_LANG = {
  JavaScript: [
    "function bfs(graph, startNode) {",                 // 1
    "  let queue = []; let visited = new Set();",       // 2 (Combined init)
    "  queue.push(startNode);",                        // 3
    "  visited.add(startNode);",                       // 4
    "  while (queue.length > 0) {",                   // 5
    "    let u = queue.shift();",                      // 6
    "    // Process node u (e.g., print it)",          // 7
    "    for (let v of graph[u]) {",                  // 8
    "      if (!visited.has(v)) {",                   // 9
    "        visited.add(v);",                         // 10
    "        queue.push(v);",                          // 11
    "      }",                                         // 12
    "    }",                                           // 13
    "  }",                                             // 14
    "}",                                               // 15
  ],
  Python: [
    "from collections import deque",
    "def bfs(graph, start_node):",
    "    queue = deque()",
    "    visited = set()",
    "    queue.append(start_node)",
    "    visited.add(start_node)",
    "    while queue:",
    "        u = queue.popleft()",
    "        # Process node u",
    "        for v in graph.get(u, []):",
    "            if v not in visited:",
    "                visited.add(v)",
    "                queue.append(v)",
  ],
  Java: [
    "import java.util.*;",
    "public class BFS {",
    "    public void bfs(Map<Integer, List<Integer>> graph, int startNode) {",
    "        Queue<Integer> queue = new LinkedList<>();",
    "        Set<Integer> visited = new HashSet<>();",
    "        queue.add(startNode);",
    "        visited.add(startNode);",
    "        while (!queue.isEmpty()) {",
    "            int u = queue.poll();",
    "            // Process node u",
    "            System.out.print(u + \" \");",
    "            List<Integer> neighbors = graph.getOrDefault(u, Collections.emptyList());",
    "            for (int v : neighbors) {",
    "                if (!visited.contains(v)) {",
    "                    visited.add(v);",
    "                    queue.add(v);",
    "                }",
    "            }",
    "        }",
    "    }",
    "}",
  ],
  "C++": [
    "#include <iostream>",
    "#include <vector>",
    "#include <queue>",
    "#include <set>",
    "#include <map>",
    "void bfs(const std::map<int, std::vector<int>>& graph, int startNode) {",
    "    std::queue<int> q;",
    "    std::set<int> visited;",
    "    q.push(startNode);",
    "    visited.insert(startNode);",
    "    while (!q.empty()) {",
    "        int u = q.front();",
    "        q.pop();",
    "        // Process node u",
    "        std::cout << u << \" \";",
    "        auto it = graph.find(u);",
    "        if (it != graph.end()) {",
    "            for (int v : it->second) {",
    "                if (visited.find(v) == visited.end()) {",
    "                    visited.insert(v);",
    "                    q.push(v);",
    "                }",
    "            }",
    "        }",
    "    }",
    "}",
  ],
};


export function BfsCodePanel({ codeSnippets, currentLine, defaultLanguage = "JavaScript" }: BfsCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(codeSnippets), [codeSnippets]);

  const getInitialLanguage = () => {
    if (languages.length === 0) return 'Info';
    return languages.includes(defaultLanguage) ? defaultLanguage : languages[0];
  };

  const [selectedLanguage, setSelectedLanguage] = useState<string>(getInitialLanguage);
  const [userHasInteractedWithTabs, setUserHasInteractedWithTabs] = useState(false);

  useEffect(() => {
    const initialLang = getInitialLanguage();
    if (!userHasInteractedWithTabs && selectedLanguage !== initialLang) {
      setSelectedLanguage(initialLang);
    }
  }, [languages, defaultLanguage, userHasInteractedWithTabs, selectedLanguage]);


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
        });
    } else {
        toast({ title: "No Code to Copy", description: "No code available for selected language.", variant: "default" });
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
            <Code2 className="mr-2 h-5 w-5" /> BFS Code
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
              <TabsContent key={`${lang}-content`} value={lang} className="m-0 flex-grow overflow-hidden flex flex-col"> {/* Unique key for TabsContent */}
                <ScrollArea key={`${lang}-scrollarea`} className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5"> {/* Unique key for ScrollArea */}
                  <pre className="font-code text-sm p-4">
                    {(codeSnippets[lang] || []).map((line, index) => (
                      <div
                        key={`${lang}-line-${index}`} // Unique key for each line div
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

