
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Conceptual code for finding connected components using DFS
export const CONNECTED_COMPONENTS_CODE_SNIPPETS = {
  JavaScript: {
    undirected: [
      "// Connected Components in Undirected Graph (DFS)",
      "function findConnectedComponents(graph) { // graph: {nodeId: [neighbors...]}",
      "  const visited = new Set();",
      "  const components = [];",
      "  const nodes = Object.keys(graph);",
      "",
      "  function dfs(node, currentComponent) {",
      "    visited.add(node);",
      "    currentComponent.push(node);",
      "    for (const neighbor of graph[node] || []) {",
      "      if (!visited.has(neighbor)) {",
      "        dfs(neighbor, currentComponent);",
      "      }",
      "    }",
      "  }",
      "",
      "  for (const node of nodes) {",
      "    if (!visited.has(node)) {",
      "      const currentComponent = [];",
      "      dfs(node, currentComponent);",
      "      components.push(currentComponent);",
      "    }",
      "  }",
      "  return components;",
      "}",
    ],
    directed: [
      "// Strongly Connected Components (Kosaraju's Algorithm - Conceptual JS)",
      "function kosarajuSCC(numNodes, adjList) { // adjList: Map<number, number[]>",
      "  const visited = new Array(numNodes).fill(false);",
      "  const finishStack = []; // Stores nodes by finishing times",
      "  // Step 1: DFS on original graph to fill finishStack",
      "  function dfs1(u) {",
      "    visited[u] = true;",
      "    for (const v of adjList.get(u) || []) {",
      "      if (!visited[v]) dfs1(v);",
      "    }",
      "    finishStack.push(u);",
      "  }",
      "  for (let i = 0; i < numNodes; i++) if (!visited[i]) dfs1(i);",
      "",
      "  // Step 2: Compute transpose graph (adjListT)",
      "  const adjListT = new Map(); for(let i=0; i<numNodes; i++) adjListT.set(i, []);",
      "  adjList.forEach((neighbors, u) => {",
      "    neighbors.forEach(v => (adjListT.get(v) || []).push(u));",
      "  });",
      "",
      "  // Step 3: DFS on transpose graph in order of finishStack",
      "  visited.fill(false);",
      "  const sccs = [];",
      "  function dfs2(u, currentSCC) {",
      "    visited[u] = true; currentSCC.push(u);",
      "    for (const v of adjListT.get(u) || []) {",
      "      if (!visited[v]) dfs2(v, currentSCC);",
      "    }",
      "  }",
      "  while (finishStack.length > 0) {",
      "    const u = finishStack.pop();",
      "    if (!visited[u]) {",
      "      const currentSCC = []; dfs2(u, currentSCC); sccs.push(currentSCC);",
      "    }",
      "  }",
      "  return sccs;",
      "}",
    ],
  },
  Python: {
    undirected: [
      "# Connected Components in Undirected Graph (DFS)",
      "def find_connected_components(graph): # graph: {node_id: [neighbors...]}",
      "    visited = set()",
      "    components = []",
      "    nodes = list(graph.keys())",
      "    def dfs(node, current_component):",
      "        visited.add(node)",
      "        current_component.append(node)",
      "        for neighbor in graph.get(node, []):",
      "            if neighbor not in visited:",
      "                dfs(neighbor, current_component)",
      "    for node in nodes:",
      "        if node not in visited:",
      "            current_component = []",
      "            dfs(node, current_component)",
      "            components.append(current_component)",
      "    return components",
    ],
    directed: [
      "# Strongly Connected Components (Kosaraju's Algorithm - Conceptual Python)",
      "from collections import defaultdict",
      "def kosaraju_scc(num_nodes, adj_list): # adj_list: dict of lists {u: [v1, v2]}",
      "    visited = [False] * num_nodes",
      "    finish_stack = []",
      "    def dfs1(u):",
      "        visited[u] = True",
      "        for v in adj_list.get(u, []):",
      "            if not visited[v]: dfs1(v)",
      "        finish_stack.append(u)",
      "    for i in range(num_nodes):",
      "        if not visited[i]: dfs1(i)",
      "",
      "    adj_list_t = defaultdict(list)",
      "    for u in adj_list:",
      "        for v in adj_list[u]:",
      "            adj_list_t[v].append(u)",
      "",
      "    visited = [False] * num_nodes",
      "    sccs = []",
      "    def dfs2(u, current_scc):",
      "        visited[u] = True",
      "        current_scc.append(u)",
      "        for v in adj_list_t.get(u, []):",
      "            if not visited[v]: dfs2(v, current_scc)",
      "    while finish_stack:",
      "        u = finish_stack.pop()",
      "        if not visited[u]:",
      "            current_scc = []",
      "            dfs2(u, current_scc)",
      "            sccs.append(current_scc)",
      "    return sccs",
    ],
  },
  Java: {
    undirected: [
      "// Connected Components (Undirected, DFS)",
      "import java.util.*;",
      "public class ConnectedComponentsUndirected {",
      "    public List<List<Integer>> find(int numNodes, Map<Integer, List<Integer>> adj) {",
      "        boolean[] visited = new boolean[numNodes];",
      "        List<List<Integer>> components = new ArrayList<>();",
      "        for (int i = 0; i < numNodes; i++) {",
      "            if (!visited[i]) {",
      "                List<Integer> current = new ArrayList<>();",
      "                dfs(i, adj, visited, current);",
      "                components.add(current);",
      "            }",
      "        }",
      "        return components;",
      "    }",
      "    private void dfs(int u, Map<Integer, List<Integer>> adj, boolean[] visited, List<Integer> comp) {",
      "        visited[u] = true; comp.add(u);",
      "        for (int v : adj.getOrDefault(u, Collections.emptyList())) {",
      "            if (!visited[v]) dfs(v, adj, visited, comp);",
      "        }",
      "    }",
      "}",
    ],
    directed: [
      "// SCCs (Kosaraju's Algorithm - Conceptual Java)",
      "import java.util.*;",
      "public class KosarajuSCC {",
      "    void dfs1(int u, List<List<Integer>> adj, boolean[] visited, Stack<Integer> stack) {",
      "        visited[u] = true;",
      "        for (int v : adj.get(u)) {",
      "            if (!visited[v]) dfs1(v, adj, visited, stack);",
      "        }",
      "        stack.push(u);",
      "    }",
      "    List<List<Integer>> getTranspose(int V, List<List<Integer>> adj) {",
      "        List<List<Integer>> adjT = new ArrayList<>();",
      "        for (int i = 0; i < V; i++) adjT.add(new ArrayList<>());",
      "        for (int u = 0; u < V; u++) {",
      "            for (int v : adj.get(u)) adjT.get(v).add(u);",
      "        }",
      "        return adjT;",
      "    }",
      "    void dfs2(int u, List<List<Integer>> adjT, boolean[] visited, List<Integer> scc) {",
      "        visited[u] = true; scc.add(u);",
      "        for (int v : adjT.get(u)) {",
      "            if (!visited[v]) dfs2(v, adjT, visited, scc);",
      "        }",
      "    }",
      "",
      "    public List<List<Integer>> findSCCs(int V, List<List<Integer>> adj) {",
      "        Stack<Integer> stack = new Stack<>();",
      "        boolean[] visited = new boolean[V];",
      "        for (int i = 0; i < V; i++) if (!visited[i]) dfs1(i, adj, visited, stack);",
      "",
      "        List<List<Integer>> adjT = getTranspose(V, adj);",
      "        Arrays.fill(visited, false);",
      "        List<List<Integer>> sccs = new ArrayList<>();",
      "        while (!stack.isEmpty()) {",
      "            int u = stack.pop();",
      "            if (!visited[u]) {",
      "                List<Integer> currentSCC = new ArrayList<>();",
      "                dfs2(u, adjT, visited, currentSCC);",
      "                sccs.add(currentSCC);",
      "            }",
      "        }",
      "        return sccs;",
      "    }",
      "}",
    ],
  },
  "C++": {
    undirected: [
      "// Connected Components (Undirected, DFS)",
      "#include <vector>",
      "#include <map>",
      "void dfs_undirected(int u, const std::map<int, std::vector<int>>& adj, std::vector<bool>& visited, std::vector<int>& component) {",
      "    visited[u] = true; component.push_back(u);",
      "    if (adj.count(u)) {",
      "        for (int v : adj.at(u)) if (!visited[v]) dfs_undirected(v, adj, visited, component);",
      "    }",
      "}",
      "std::vector<std::vector<int>> findCC(int numNodes, const std::map<int, std::vector<int>>& adj) {",
      "    std::vector<bool> visited(numNodes, false);",
      "    std::vector<std::vector<int>> components;",
      "    for (int i = 0; i < numNodes; ++i) {",
      "        if (!visited[i]) {",
      "            std::vector<int> current; dfs_undirected(i, adj, visited, current); components.push_back(current);",
      "        }",
      "    }",
      "    return components;",
      "}",
    ],
    directed: [
      "// SCCs (Kosaraju's Algorithm - Conceptual C++)",
      "#include <vector>",
      "#include <stack>",
      "#include <map>",
      "#include <algorithm>",
      "void dfs1(int u, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited, std::stack<int>& st) {",
      "    visited[u] = true;",
      "    for (int v : adj[u]) {",
      "        if (!visited[v]) dfs1(v, adj, visited, st);",
      "    }",
      "    st.push(u);",
      "}",
      "std::vector<std::vector<int>> getTranspose(int V, const std::vector<std::vector<int>>& adj) {",
      "    std::vector<std::vector<int>> adjT(V);",
      "    for (int u = 0; u < V; ++u) {",
      "        for (int v : adj[u]) adjT[v].push_back(u);",
      "    }",
      "    return adjT;",
      "}",
      "void dfs2(int u, const std::vector<std::vector<int>>& adjT, std::vector<bool>& visited, std::vector<int>& scc) {",
      "    visited[u] = true; scc.push_back(u);",
      "    for (int v : adjT[u]) {",
      "        if (!visited[v]) dfs2(v, adjT, visited, scc);",
      "    }",
      "}",
      "",
      "std::vector<std::vector<int>> kosarajuSCC(int V, const std::vector<std::vector<int>>& adj) {",
      "    std::stack<int> st;",
      "    std::vector<bool> visited(V, false);",
      "    for (int i = 0; i < V; ++i) if (!visited[i]) dfs1(i, adj, visited, st);",
      "",
      "    std::vector<std::vector<int>> adjT = getTranspose(V, adj);",
      "    std::fill(visited.begin(), visited.end(), false);",
      "    std::vector<std::vector<int>> sccs;",
      "    while (!st.empty()) {",
      "        int u = st.top(); st.pop();",
      "        if (!visited[u]) {",
      "            std::vector<int> currentSCC; dfs2(u, adjT, visited, currentSCC); sccs.push_back(currentSCC);",
      "        }",
      "    }",
      "    return sccs;",
      "}",
    ],
  }
};

interface ConnectedComponentsCodePanelProps {
  currentLine: number | null;
  graphType: 'directed' | 'undirected';
}

export function ConnectedComponentsCodePanel({ currentLine, graphType }: ConnectedComponentsCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(CONNECTED_COMPONENTS_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = CONNECTED_COMPONENTS_CODE_SNIPPETS[selectedLanguage as keyof typeof CONNECTED_COMPONENTS_CODE_SNIPPETS]?.[graphType]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for ${graphType} Components Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const currentCodeLines = CONNECTED_COMPONENTS_CODE_SNIPPETS[selectedLanguage as keyof typeof CONNECTED_COMPONENTS_CODE_SNIPPETS]?.[graphType] || [];
  const panelTitle = graphType === 'directed' ? "SCCs (Kosaraju's)" : "Connected Components (DFS)";

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: {panelTitle}
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
                  {CONNECTED_COMPONENTS_CODE_SNIPPETS[lang as keyof typeof CONNECTED_COMPONENTS_CODE_SNIPPETS]?.[graphType]?.map((line, index) => (
                    <div
                      key={`cc-${graphType}-${lang}-line-${index}`}
                      className={`px-2 py-0.5 rounded whitespace-pre-wrap ${
                        // currentLine mapping will need to be adjusted based on the active algorithm
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

