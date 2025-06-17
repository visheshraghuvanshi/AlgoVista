
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
  JavaScript: [
    "function findConnectedComponents(graph) { // graph: {node: [neighbors...]}",
    "  const visited = new Set();",
    "  const components = [];",
    "  const nodes = Object.keys(graph);",
    "",
    "  function dfs(node, currentComponent) {",
    "    visited.add(node);",
    "    currentComponent.push(node);",
    "    for (const neighbor of graph[node]) {",
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
    "// For SCCs in Directed Graphs, use Kosaraju's or Tarjan's.",
  ],
  Python: [
    "def find_connected_components(graph): # graph: {node: [neighbors...]}",
    "    visited = set()",
    "    components = []",
    "    nodes = list(graph.keys())",
    "",
    "    def dfs(node, current_component):",
    "        visited.add(node)",
    "        current_component.append(node)",
    "        for neighbor in graph.get(node, []):",
    "            if neighbor not in visited:",
    "                dfs(neighbor, current_component)",
    "",
    "    for node in nodes:",
    "        if node not in visited:",
    "            current_component = []",
    "            dfs(node, current_component)",
    "            components.append(current_component)",
    "    return components",
  ],
  Java: [
    "import java.util.*;",
    "public class ConnectedComponents {",
    "    public List<List<Integer>> findComponents(Map<Integer, List<Integer>> graph) {",
    "        Set<Integer> visited = new HashSet<>();",
    "        List<List<Integer>> components = new ArrayList<>();",
    "        for (Integer node : graph.keySet()) {",
    "            if (!visited.contains(node)) {",
    "                List<Integer> currentComponent = new ArrayList<>();",
    "                dfs(node, graph, visited, currentComponent);",
    "                components.add(currentComponent);",
    "            }",
    "        }",
    "        return components;",
    "    }",
    "    private void dfs(Integer node, Map<Integer, List<Integer>> graph, Set<Integer> visited, List<Integer> component) {",
    "        visited.add(node);",
    "        component.add(node);",
    "        for (Integer neighbor : graph.getOrDefault(node, Collections.emptyList())) {",
    "            if (!visited.contains(neighbor)) {",
    "                dfs(neighbor, graph, visited, component);",
    "            }",
    "        }",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <map>",
    "#include <set>",
    "#include <list>",
    "void dfs(int node, const std::map<int, std::vector<int>>& graph, std::set<int>& visited, std::vector<int>& component) {",
    "    visited.insert(node);",
    "    component.push_back(node);",
    "    auto it = graph.find(node);",
    "    if (it != graph.end()) {",
    "        for (int neighbor : it->second) {",
    "            if (visited.find(neighbor) == visited.end()) {",
    "                dfs(neighbor, graph, visited, component);",
    "            }",
    "        }",
    "    }",
    "}",
    "std::vector<std::vector<int>> findConnectedComponents(const std::map<int, std::vector<int>>& graph) {",
    "    std::set<int> visited;",
    "    std::vector<std::vector<int>> components;",
    "    std::vector<int> nodes;",
    "    for(auto const& [node, neighbors] : graph) { nodes.push_back(node); }",
    "    // Also add nodes that only appear as neighbors if graph isn't complete",
    "    // For simplicity, assume all nodes are keys in graph map.",
    "    for (int node : nodes) {",
    "        if (visited.find(node) == visited.end()) {",
    "            std::vector<int> currentComponent;",
    "            dfs(node, graph, visited, currentComponent);",
    "            components.push_back(currentComponent);",
    "        }",
    "    }",
    "    return components;",
    "}",
  ],
};

interface ConnectedComponentsCodePanelProps {
  currentLine: number | null; // This might be more complex to map for CCs
}

export function ConnectedComponentsCodePanel({ currentLine }: ConnectedComponentsCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(CONNECTED_COMPONENTS_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = CONNECTED_COMPONENTS_CODE_SNIPPETS[selectedLanguage as keyof typeof CONNECTED_COMPONENTS_CODE_SNIPPETS]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for Connected Components Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const currentCodeLines = CONNECTED_COMPONENTS_CODE_SNIPPETS[selectedLanguage as keyof typeof CONNECTED_COMPONENTS_CODE_SNIPPETS] || [];

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: Connected Components
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
                  {CONNECTED_COMPONENTS_CODE_SNIPPETS[lang as keyof typeof CONNECTED_COMPONENTS_CODE_SNIPPETS]?.map((line, index) => (
                    <div
                      key={`cc-${lang}-line-${index}`}
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
