
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CYCLE_DETECTION_CODE_SNIPPETS = {
  JavaScript: {
    undirected: [
      "// Cycle Detection in Undirected Graph using DFS",
      "function hasCycleUndirected(graph, numNodes) {",
      "  const visited = new Array(numNodes).fill(false);",
      "  function dfs(u, parent) {",
      "    visited[u] = true;",
      "    for (const v of graph[u]) {", // graph[u] is list of neighbors of u
      "      if (!visited[v]) {",
      "        if (dfs(v, u)) return true;",
      "      } else if (v !== parent) {",
      "        return true; // Found a back edge",
      "      }",
      "    }",
      "    return false;",
      "  }",
      "  for (let i = 0; i < numNodes; i++) {",
      "    if (!visited[i]) {",
      "      if (dfs(i, -1)) return true;", // -1 for no parent
      "    }",
      "  }",
      "  return false;",
      "}",
    ],
    directed: [
      "// Cycle Detection in Directed Graph using DFS",
      "function hasCycleDirected(graph, numNodes) {",
      "  const visited = new Array(numNodes).fill(false);",
      "  const recursionStack = new Array(numNodes).fill(false);",
      "  function dfs(u) {",
      "    visited[u] = true; recursionStack[u] = true;",
      "    for (const v of graph[u]) {", // graph[u] is list of neighbors of u
      "      if (!visited[v]) {",
      "        if (dfs(v)) return true;",
      "      } else if (recursionStack[v]) {",
      "        return true; // Found a back edge to node in recursion stack",
      "      }",
      "    }",
      "    recursionStack[u] = false;",
      "    return false;",
      "  }",
      "  for (let i = 0; i < numNodes; i++) {",
      "    if (!visited[i]) {",
      "      if (dfs(i)) return true;",
      "    }",
      "  }",
      "  return false;",
      "}",
    ],
  },
  Python: {
    undirected: [
      "# Cycle Detection in Undirected Graph using DFS",
      "def has_cycle_undirected(graph, num_nodes):",
      "    visited = [False] * num_nodes",
      "    def dfs(u, parent):",
      "        visited[u] = True",
      "        for v in graph.get(u, []):",
      "            if not visited[v]:",
      "                if dfs(v, u): return True",
      "            elif v != parent:",
      "                return True",
      "        return False",
      "    for i in range(num_nodes):",
      "        if not visited[i]:",
      "            if dfs(i, -1): return True",
      "    return False",
    ],
    directed: [
      "# Cycle Detection in Directed Graph using DFS",
      "def has_cycle_directed(graph, num_nodes):",
      "    visited = [False] * num_nodes",
      "    recursion_stack = [False] * num_nodes",
      "    def dfs(u):",
      "        visited[u] = True",
      "        recursion_stack[u] = True",
      "        for v in graph.get(u, []):",
      "            if not visited[v]:",
      "                if dfs(v): return True",
      "            elif recursion_stack[v]:",
      "                return True",
      "        recursion_stack[u] = False",
      "        return False",
      "    for i in range(num_nodes):",
      "        if not visited[i]:",
      "            if dfs(i): return True",
      "    return False",
    ],
  },
  Java: {
     undirected: [
      "import java.util.*;",
      "class GraphCycleUndirected {",
      "    boolean hasCycle(int numNodes, List<List<Integer>> adj) {",
      "        boolean[] visited = new boolean[numNodes];",
      "        for (int i = 0; i < numNodes; i++) {",
      "            if (!visited[i]) {",
      "                if (dfs(i, -1, visited, adj)) return true;",
      "            }",
      "        }",
      "        return false;",
      "    }",
      "    boolean dfs(int u, int parent, boolean[] visited, List<List<Integer>> adj) {",
      "        visited[u] = true;",
      "        for (int v : adj.get(u)) {",
      "            if (!visited[v]) {",
      "                if (dfs(v, u, visited, adj)) return true;",
      "            } else if (v != parent) {",
      "                return true;",
      "            }",
      "        }",
      "        return false;",
      "    }",
      "}",
    ],
    directed: [
      "import java.util.*;",
      "class GraphCycleDirected {",
      "    boolean hasCycle(int numNodes, List<List<Integer>> adj) {",
      "        boolean[] visited = new boolean[numNodes];",
      "        boolean[] recursionStack = new boolean[numNodes];",
      "        for (int i = 0; i < numNodes; i++) {",
      "            if (!visited[i]) {",
      "                if (dfs(i, visited, recursionStack, adj)) return true;",
      "            }",
      "        }",
      "        return false;",
      "    }",
      "    boolean dfs(int u, boolean[] visited, boolean[] recStack, List<List<Integer>> adj) {",
      "        visited[u] = true; recStack[u] = true;",
      "        for (int v : adj.get(u)) {",
      "            if (!visited[v]) {",
      "                if (dfs(v, visited, recStack, adj)) return true;",
      "            } else if (recStack[v]) {",
      "                return true;",
      "            }",
      "        }",
      "        recStack[u] = false;",
      "        return false;",
      "    }",
      "}",
    ],
  },
  "C++": {
    undirected: [
      "#include <vector>",
      "bool dfs_undirected(int u, int parent, std::vector<bool>& visited, const std::vector<std::vector<int>>& adj) {",
      "    visited[u] = true;",
      "    for (int v : adj[u]) {",
      "        if (!visited[v]) {",
      "            if (dfs_undirected(v, u, visited, adj)) return true;",
      "        } else if (v != parent) {",
      "            return true;",
      "        }",
      "    }",
      "    return false;",
      "}",
      "bool hasCycleUndirected(int numNodes, const std::vector<std::vector<int>>& adj) {",
      "    std::vector<bool> visited(numNodes, false);",
      "    for (int i = 0; i < numNodes; ++i) {",
      "        if (!visited[i]) {",
      "            if (dfs_undirected(i, -1, visited, adj)) return true;",
      "        }",
      "    }",
      "    return false;",
      "}",
    ],
    directed: [
      "#include <vector>",
      "bool dfs_directed(int u, std::vector<bool>& visited, std::vector<bool>& recStack, const std::vector<std::vector<int>>& adj) {",
      "    visited[u] = true; recStack[u] = true;",
      "    for (int v : adj[u]) {",
      "        if (!visited[v]) {",
      "            if (dfs_directed(v, visited, recStack, adj)) return true;",
      "        } else if (recStack[v]) {",
      "            return true;",
      "        }",
      "    }",
      "    recStack[u] = false;",
      "    return false;",
      "}",
      "bool hasCycleDirected(int numNodes, const std::vector<std::vector<int>>& adj) {",
      "    std::vector<bool> visited(numNodes, false);",
      "    std::vector<bool> recStack(numNodes, false);",
      "    for (int i = 0; i < numNodes; ++i) {",
      "        if (!visited[i]) {",
      "            if (dfs_directed(i, visited, recStack, adj)) return true;",
      "        }",
      "    }",
      "    return false;",
      "}",
    ],
  }
};

interface GraphCycleDetectionCodePanelProps {
  currentLine: number | null;
  graphType: 'directed' | 'undirected';
}

export function GraphCycleDetectionCodePanel({ currentLine, graphType }: GraphCycleDetectionCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(CYCLE_DETECTION_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = CYCLE_DETECTION_CODE_SNIPPETS[selectedLanguage as keyof typeof CYCLE_DETECTION_CODE_SNIPPETS]?.[graphType]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for ${graphType} Cycle Detection Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const currentCodeLines = CYCLE_DETECTION_CODE_SNIPPETS[selectedLanguage as keyof typeof CYCLE_DETECTION_CODE_SNIPPETS]?.[graphType] || [];

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: {graphType.charAt(0).toUpperCase() + graphType.slice(1)} Cycle Detection
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
            <pre className="font-code text-sm p-4">
              {currentCodeLines.map((line, index) => (
                <div
                  key={`cycle-${graphType}-${selectedLanguage}-line-${index}`}
                  className={`px-2 py-0.5 rounded whitespace-pre-wrap ${
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
        </Tabs>
      </CardContent>
    </Card>
  );
}

