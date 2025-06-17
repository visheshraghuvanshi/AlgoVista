"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Conceptual Topological Sort Code Snippets (Kahn's Algorithm)
export const TOPOLOGICAL_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "function topologicalSortKahn(graph, numNodes) { // graph: adj list {node: [neighbors...]}",
    "  const inDegree = new Array(numNodes).fill(0);",
    "  const adj = new Array(numNodes).fill(null).map(() => []);",
    "  Object.keys(graph).forEach(u => {",
    "    const uIdx = parseInt(u);",
    "    graph[u].forEach(vStr => {",
    "      const vIdx = parseInt(vStr);",
    "      adj[uIdx].push(vIdx);",
    "      inDegree[vIdx]++;",
    "    });",
    "  });",
    "",
    "  const queue = [];",
    "  for (let i = 0; i < numNodes; i++) {",
    "    if (inDegree[i] === 0) queue.push(i);",
    "  }",
    "",
    "  const sortedOrder = [];",
    "  let visitedCount = 0;",
    "  while (queue.length > 0) {",
    "    const u = queue.shift();",
    "    sortedOrder.push(u);",
    "    visitedCount++;",
    "    for (const v of adj[u]) {",
    "      inDegree[v]--;",
    "      if (inDegree[v] === 0) queue.push(v);",
    "    }",
    "  }",
    "  if (visitedCount !== numNodes) return { error: 'Graph has a cycle.' };",
    "  return sortedOrder;",
    "}",
  ],
  Python: [
    "from collections import deque",
    "def topological_sort_kahn(graph, num_nodes): # graph: {node_idx: [neighbor_indices...]}",
    "    in_degree = [0] * num_nodes",
    "    adj = [[] for _ in range(num_nodes)]",
    "    for u, neighbors in graph.items():",
    "        for v in neighbors:",
    "            adj[u].append(v)",
    "            in_degree[v] += 1",
    "",
    "    queue = deque()",
    "    for i in range(num_nodes):",
    "        if in_degree[i] == 0:",
    "            queue.append(i)",
    "",
    "    sorted_order = []",
    "    visited_count = 0",
    "    while queue:",
    "        u = queue.popleft()",
    "        sorted_order.append(u)",
    "        visited_count += 1",
    "        for v in adj[u]:",
    "            in_degree[v] -= 1",
    "            if in_degree[v] == 0:",
    "                queue.append(v)",
    "",
    "    if visited_count != num_nodes:",
    "        return {'error': 'Graph has a cycle.'}",
    "    return sorted_order",
  ],
  Java: [
    "import java.util.*;",
    "class TopologicalSort {",
    "    public List<Integer> kahnSort(int numNodes, List<List<Integer>> adj) {",
    "        int[] inDegree = new int[numNodes];",
    "        for(int u = 0; u < numNodes; u++) {",
    "            for(int v : adj.get(u)) { inDegree[v]++; }",
    "        }",
    "        Queue<Integer> queue = new LinkedList<>();",
    "        for(int i=0; i<numNodes; i++) {",
    "            if(inDegree[i] == 0) queue.add(i);",
    "        }",
    "        List<Integer> sortedOrder = new ArrayList<>();",
    "        int visitedCount = 0;",
    "        while(!queue.isEmpty()) {",
    "            int u = queue.poll();",
    "            sortedOrder.add(u);",
    "            visitedCount++;",
    "            for(int v : adj.get(u)) {",
    "                inDegree[v]--;",
    "                if(inDegree[v] == 0) queue.add(v);",
    "            }",
    "        }",
    "        if(visitedCount != numNodes) return null; // Cycle",
    "        return sortedOrder;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <queue>",
    "#include <map>",
    "std::vector<int> topologicalSortKahn(int numNodes, const std::map<int, std::vector<int>>& graph_map) {",
    "    std::vector<int> in_degree(numNodes, 0);",
    "    std::vector<std::vector<int>> adj(numNodes);",
    "    for(auto const& [u_str, neighbors] : graph_map) {",
    "        int u = u_str; // Assume keys are already int or parsable",
    "        for(int v : neighbors) {",
    "            adj[u].push_back(v);",
    "            in_degree[v]++;",
    "        }",
    "    }",
    "    std::queue<int> q;",
    "    for(int i=0; i<numNodes; ++i) {",
    "        if(in_degree[i] == 0) q.push(i);",
    "    }",
    "    std::vector<int> sorted_order;",
    "    int visited_count = 0;",
    "    while(!q.empty()) {",
    "        int u = q.front(); q.pop();",
    "        sorted_order.push_back(u);",
    "        visited_count++;",
    "        for(int v : adj[u]) {",
    "            in_degree[v]--;",
    "            if(in_degree[v] == 0) q.push(v);",
    "        }",
    "    }",
    "    if(visited_count != numNodes) return {}; // Cycle, return empty",
    "    return sorted_order;",
    "}",
  ],
};

interface TopologicalSortCodePanelProps {
  currentLine: number | null;
}

export function TopologicalSortCodePanel({ currentLine }: TopologicalSortCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(TOPOLOGICAL_SORT_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = TOPOLOGICAL_SORT_CODE_SNIPPETS[selectedLanguage as keyof typeof TOPOLOGICAL_SORT_CODE_SNIPPETS]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for Topological Sort Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const currentCodeLines = TOPOLOGICAL_SORT_CODE_SNIPPETS[selectedLanguage as keyof typeof TOPOLOGICAL_SORT_CODE_SNIPPETS] || [];

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: Topological Sort (Kahn's)
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
          {languages.map((lang) => (
            <TabsContent key={lang} value={lang} className="m-0 flex-grow overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
                <pre className="font-code text-sm p-4">
                  {TOPOLOGICAL_SORT_CODE_SNIPPETS[lang as keyof typeof TOPOLOGICAL_SORT_CODE_SNIPPETS]?.map((line, index) => (
                    <div
                      key={`topo-${lang}-line-${index}`}
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
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
