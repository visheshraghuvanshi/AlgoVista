
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FLOYD_WARSHALL_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "function floydWarshall(graphMatrix) {",
    "  const V = graphMatrix.length;",
    "  const dist = Array.from(Array(V), () => new Array(V).fill(Infinity));",
    "  for (let i = 0; i < V; i++) {",
    "    for (let j = 0; j < V; j++) {",
    "      if (i === j) dist[i][j] = 0;",
    "      else if (graphMatrix[i][j] !== undefined && graphMatrix[i][j] !== Infinity) {",
    "        dist[i][j] = graphMatrix[i][j];",
    "      }",
    "    }",
    "  }",
    "  for (let k = 0; k < V; k++) {",
    "    for (let i = 0; i < V; i++) {",
    "      for (let j = 0; j < V; j++) {",
    "        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity &&",
    "            dist[i][k] + dist[k][j] < dist[i][j]) {",
    "          dist[i][j] = dist[i][k] + dist[k][j];",
    "        }",
    "      }",
    "    }",
    "  }",
    "  // Check for negative cycles (optional)",
    "  for (let i = 0; i < V; i++) {",
    "    if (dist[i][i] < 0) return { error: 'Negative cycle' };",
    "  }",
    "  return dist;",
    "}",
  ],
  Python: [
    "def floyd_warshall(graph_matrix):",
    "    V = len(graph_matrix)",
    "    dist = [row[:] for row in graph_matrix] # Deep copy",
    "    # Initialize distances: graph_matrix should have INF for no direct edge, 0 for self",
    "    for k in range(V):",
    "        for i in range(V):",
    "            for j in range(V):",
    "                if dist[i][k] != float('inf') and dist[k][j] != float('inf') and \\",
    "                   dist[i][k] + dist[k][j] < dist[i][j]:",
    "                    dist[i][j] = dist[i][k] + dist[k][j]",
    "    # Check for negative cycles",
    "    for i in range(V):",
    "        if dist[i][i] < 0:",
    "            return {'error': 'Negative cycle'}",
    "    return dist",
  ],
  Java: [
    "class FloydWarshall {",
    "    final static int INF = Integer.MAX_VALUE / 2; // Avoid overflow",
    "    public int[][] solve(int V, int[][] graphMatrix) { // graphMatrix: direct weights, INF if no edge",
    "        int[][] dist = new int[V][V];",
    "        for (int i = 0; i < V; i++) {",
    "            for (int j = 0; j < V; j++) {",
    "                dist[i][j] = graphMatrix[i][j];",
    "                if (i == j) dist[i][j] = 0;",
    "            }",
    "        }",
    "        for (int k = 0; k < V; k++) {",
    "            for (int i = 0; i < V; i++) {",
    "                for (int j = 0; j < V; j++) {",
    "                    if (dist[i][k] != INF && dist[k][j] != INF &&",
    "                        dist[i][k] + dist[k][j] < dist[i][j]) {",
    "                        dist[i][j] = dist[i][k] + dist[k][j];",
    "                    }",
    "                }",
    "            }",
    "        }",
    "        // Check for negative cycles (optional)",
    "        for (int i = 0; i < V; i++) {",
    "            if (dist[i][i] < 0) { /* Handle error */ }",
    "        }",
    "        return dist;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::min",
    "#include <limits>    // For std::numeric_limits",
    "const int INF = std::numeric_limits<int>::max() / 2;",
    "std::vector<std::vector<int>> floydWarshall(int V, std::vector<std::vector<int>>& graphMatrix) {",
    "    std::vector<std::vector<int>> dist = graphMatrix;",
    "    for (int i = 0; i < V; ++i) dist[i][i] = 0;",
    "    for (int k = 0; k < V; ++k) {",
    "        for (int i = 0; i < V; ++i) {",
    "            for (int j = 0; j < V; ++j) {",
    "                if (dist[i][k] != INF && dist[k][j] != INF &&",
    "                    dist[i][k] + dist[k][j] < dist[i][j]) {",
    "                    dist[i][j] = dist[i][k] + dist[k][j];",
    "                }",
    "            }",
    "        }",
    "    }",
    "    // Check for negative cycles",
    "    for (int i = 0; i < V; ++i) {",
    "        if (dist[i][i] < 0) { /* Handle error */ }",
    "    }",
    "    return dist;",
    "}",
  ],
};

interface FloydWarshallCodePanelProps {
  currentLine: number | null;
}

export function FloydWarshallCodePanel({ currentLine }: FloydWarshallCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(FLOYD_WARSHALL_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = FLOYD_WARSHALL_CODE_SNIPPETS[selectedLanguage]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Floyd-Warshall Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Floyd-Warshall Code
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code">
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="flex flex-col flex-grow overflow-hidden">
          <TabsList className="mx-4 mb-1 self-start shrink-0">
            {languages.map((lang) => (
              <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-1 h-auto">
                {lang}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
            <pre className="font-code text-sm p-4 whitespace-pre-wrap">
              {FLOYD_WARSHALL_CODE_SNIPPETS[selectedLanguage]?.map((line, index) => (
                <div
                  key={`fw-${selectedLanguage}-line-${index}`}
                  className={`px-2 py-0.5 rounded ${ index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground" }`}
                >
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                  {line}
                </div>
              ))}
            </pre>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
