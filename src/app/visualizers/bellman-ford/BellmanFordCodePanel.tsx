"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BellmanFordCodePanelProps {
  codeSnippets: { [language: string]: string[] };
  currentLine: number | null;
  defaultLanguage?: string;
}

export const BELLMAN_FORD_CODE_SNIPPETS = {
  JavaScript: [
    "function bellmanFord(edges, numVertices, startNode) {", // 1
    "  const distances = {}; const predecessors = {};",    // 2
    "  for (let i = 0; i < numVertices; i++) {",           // 3
    "    distances[i] = Infinity; predecessors[i] = null;", // 4
    "  }",
    "  distances[startNode] = 0;",                         // 5
    "",
    "  // Relax edges |V| - 1 times",
    "  for (let i = 0; i < numVertices - 1; i++) {",       // 6
    "    for (const edge of edges) { // {u, v, weight}",  // 7
    "      if (distances[edge.u] !== Infinity && ",
    "          distances[edge.u] + edge.weight < distances[edge.v]) {", // 8
    "        distances[edge.v] = distances[edge.u] + edge.weight;", // 9
    "        predecessors[edge.v] = edge.u;",              // 10
    "      }",                                             // 11
    "    }",                                               // 12
    "  }",                                                 // 13
    "",
    "  // Check for negative-weight cycles",
    "  for (const edge of edges) {",                       // 14
    "    if (distances[edge.u] !== Infinity && ",
    "        distances[edge.u] + edge.weight < distances[edge.v]) {", // 15
    "      return { error: 'Negative cycle detected' };",   // 16
    "    }",                                               // 17
    "  }",                                                 // 18
    "  return { distances, predecessors };",               // 19
    "}",                                                   // 20
  ],
  Python: [
    "def bellman_ford(edges, num_vertices, start_node):",
    "    distances = {i: float('inf') for i in range(num_vertices)}",
    "    predecessors = {i: None for i in range(num_vertices)}",
    "    distances[start_node] = 0",
    "",
    "    for _ in range(num_vertices - 1):",
    "        for u, v, weight in edges:",
    "            if distances[u] != float('inf') and distances[u] + weight < distances[v]:",
    "                distances[v] = distances[u] + weight",
    "                predecessors[v] = u",
    "",
    "    for u, v, weight in edges:",
    "        if distances[u] != float('inf') and distances[u] + weight < distances[v]:",
    "            return {'error': 'Negative cycle detected'}",
    "    return {'distances': distances, 'predecessors': predecessors}",
  ],
  Java: [
    "import java.util.*;",
    "class BellmanFord {",
    "    static class Edge { int u, v, weight; Edge(int u,int v,int w){this.u=u;this.v=v;this.weight=w;} }",
    "    Map<Integer, Double> distances = new HashMap<>();",
    "    Map<Integer, Integer> predecessors = new HashMap<>();",
    "",
    "    public Map<String, Object> findShortestPaths(List<Edge> edges, int numVertices, int startNode) {",
    "        for (int i = 0; i < numVertices; i++) {",
    "            distances.put(i, Double.POSITIVE_INFINITY);",
    "            predecessors.put(i, null);",
    "        }",
    "        distances.put(startNode, 0.0);",
    "",
    "        for (int i = 0; i < numVertices - 1; i++) {",
    "            for (Edge edge : edges) {",
    "                if (distances.get(edge.u) != Double.POSITIVE_INFINITY &&",
    "                    distances.get(edge.u) + edge.weight < distances.get(edge.v)) {",
    "                    distances.put(edge.v, distances.get(edge.u) + edge.weight);",
    "                    predecessors.put(edge.v, edge.u);",
    "                }",
    "            }",
    "        }",
    "",
    "        for (Edge edge : edges) {",
    "            if (distances.get(edge.u) != Double.POSITIVE_INFINITY &&",
    "                distances.get(edge.u) + edge.weight < distances.get(edge.v)) {",
    "                Map<String, Object> errorResult = new HashMap<>();",
    "                errorResult.put(\"error\", \"Negative cycle detected\");",
    "                return errorResult;",
    "            }",
    "        }",
    "        Map<String, Object> result = new HashMap<>();",
    "        result.put(\"distances\", distances);",
    "        result.put(\"predecessors\", predecessors);",
    "        return result;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <map>",
    "#include <limits>",
    "struct Edge { int u, v, weight; };",
    "struct BellmanFordResult {",
    "    std::map<int, double> distances;",
    "    std::map<int, int> predecessors;",
    "    bool has_negative_cycle = false;",
    "};",
    "BellmanFordResult bellmanFord(const std::vector<Edge>& edges, int numVertices, int startNode) {",
    "    BellmanFordResult res;",
    "    for (int i = 0; i < numVertices; ++i) {",
    "        res.distances[i] = std::numeric_limits<double>::infinity();",
    "        // predecessors can be implicitly null or use a special value like -1",
    "    }",
    "    res.distances[startNode] = 0;",
    "",
    "    for (int i = 0; i < numVertices - 1; ++i) {",
    "        for (const auto& edge : edges) {",
    "            if (res.distances[edge.u] != std::numeric_limits<double>::infinity() &&",
    "                res.distances[edge.u] + edge.weight < res.distances[edge.v]) {",
    "                res.distances[edge.v] = res.distances[edge.u] + edge.weight;",
    "                res.predecessors[edge.v] = edge.u;",
    "            }",
    "        }",
    "    }",
    "",
    "    for (const auto& edge : edges) {",
    "        if (res.distances[edge.u] != std::numeric_limits<double>::infinity() &&",
    "            res.distances[edge.u] + edge.weight < res.distances[edge.v]) {",
    "            res.has_negative_cycle = true;",
    "            return res; // Negative cycle",
    "        }",
    "    }",
    "    return res;",
    "}",
  ],
};


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
                  <pre className="font-code text-sm p-4">
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
              <pre className="font-code text-sm p-4">
                 <p className="text-muted-foreground p-4">No code snippets available.</p>
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
