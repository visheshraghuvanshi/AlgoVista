"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Conceptual Prim's Algorithm Code Snippets
export const PRIMS_CODE_SNIPPETS = {
  JavaScript: [
    "function primsMST(graph, numVertices) { // graph: adj list {node: [{neighbor, weight}, ...]}",
    "  const parent = new Array(numVertices).fill(-1);",
    "  const key = new Array(numVertices).fill(Infinity); // Min weight to connect to MST",
    "  const mstSet = new Array(numVertices).fill(false); // Nodes included in MST",
    "  const mstEdges = [];",
    "",
    "  key[0] = 0; // Start with the first vertex",
    "",
    "  for (let count = 0; count < numVertices - 1; count++) {",
    "    let u = -1, minKey = Infinity;",
    "    // Pick the minimum key vertex from the set of vertices not yet included in MST",
    "    for (let v = 0; v < numVertices; v++) {",
    "      if (!mstSet[v] && key[v] < minKey) {",
    "        minKey = key[v]; u = v;",
    "      }",
    "    }",
    "    if (u === -1) break; // Graph not connected or error",
    "    mstSet[u] = true;",
    "    if (parent[u] !== -1) mstEdges.push({u: parent[u], v: u, weight: key[u]});",
    "",
    "    // Update key value and parent index of the adjacent vertices of u",
    "    (graph[u] || []).forEach(edge => {",
    "      const v = edge.neighbor; const weight = edge.weight;",
    "      if (!mstSet[v] && weight < key[v]) {",
    "        parent[v] = u; key[v] = weight;",
    "      }",
    "    });",
    "  }",
    "  return mstEdges;",
    "}",
  ],
  Python: [
    "import heapq",
    "def prims_mst(graph, num_vertices): # graph: adj list {node: [(neighbor, weight), ...]}",
    "    parent = [-1] * num_vertices",
    "    key = [float('inf')] * num_vertices",
    "    mst_set = [False] * num_vertices",
    "    mst_edges = []",
    "    pq = [] # (key, vertex, from_vertex)",
    "",
    "    key[0] = 0",
    "    heapq.heappush(pq, (0, 0, -1)) # Start with vertex 0, no parent",
    "",
    "    while pq and len(mst_edges) < num_vertices - 1:",
    "        weight, u, from_node = heapq.heappop(pq)",
    "",
    "        if mst_set[u]: continue",
    "        mst_set[u] = True",
    "        if from_node != -1: mst_edges.append({'u': from_node, 'v': u, 'weight': weight})",
    "",
    "        for neighbor_info in graph.get(u, []):",
    "            v, edge_weight = neighbor_info['neighbor'], neighbor_info['weight']",
    "            if not mst_set[v] and edge_weight < key[v]:",
    "                key[v] = edge_weight",
    "                parent[v] = u",
    "                heapq.heappush(pq, (edge_weight, v, u))",
    "    return mst_edges if len(mst_edges) == num_vertices - 1 else None",
  ],
  Java: [
    "import java.util.*;",
    "class Edge implements Comparable<Edge> { int to, weight; Edge(int t, int w){to=t;weight=w;} @Override public int compareTo(Edge o){return this.weight-o.weight;}}",
    "class PrimsMST {",
    "    List<Map<String, Integer>> findMST(int numVertices, List<List<Map<String, Integer>>> adj) { // adj: list of lists of maps {neighbor:N, weight:W}",
    "        int[] parent = new int[numVertices]; Arrays.fill(parent, -1);",
    "        int[] key = new int[numVertices]; Arrays.fill(key, Integer.MAX_VALUE);",
    "        boolean[] mstSet = new boolean[numVertices];",
    "        List<Map<String, Integer>> mstEdges = new ArrayList<>();",
    "        PriorityQueue<Edge> pq = new PriorityQueue<>();",
    "",
    "        key[0] = 0;",
    "        pq.add(new Edge(0, 0)); // (vertex, key_value)",
    "",
    "        while(!pq.isEmpty() && mstEdges.size() < numVertices -1) {",
    "            Edge currentEdge = pq.poll(); int u = currentEdge.to;",
    "            if(mstSet[u]) continue;",
    "            mstSet[u] = true;",
    "            if(parent[u] != -1) { Map<String,Integer> edge = new HashMap<>(); edge.put(\"u\",parent[u]); edge.put(\"v\",u); edge.put(\"weight\",key[u]); mstEdges.add(edge);}",
    "",
    "            for(Map<String, Integer> neighborEdge : adj.get(u)) {",
    "                int v = neighborEdge.get(\"neighbor\"); int weight = neighborEdge.get(\"weight\");",
    "                if(!mstSet[v] && weight < key[v]) {",
    "                    key[v] = weight; parent[v] = u;",
    "                    pq.add(new Edge(v, key[v]));",
    "                }",
    "            }",
    "        }",
    "        return (mstEdges.size() == numVertices - 1) ? mstEdges : null;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <queue>",
    "#include <limits>",
    "const int INF = std::numeric_limits<int>::max();",
    "struct Edge { int to; int weight; bool operator>(const Edge& other) const { return weight > other.weight; }};",
    "struct MSTEdge { int u, v, weight; };",
    "std::vector<MSTEdge> primsMST(int numVertices, const std::vector<std::vector<std::pair<int, int>>>& adj) { // adj[u] = {{v1,w1}, {v2,w2}}",
    "    std::vector<int> parent(numVertices, -1);",
    "    std::vector<int> key(numVertices, INF);",
    "    std::vector<bool> mstSet(numVertices, false);",
    "    std::vector<MSTEdge> mstEdges;",
    "    std::priority_queue<Edge, std::vector<Edge>, std::greater<Edge>> pq;",
    "",
    "    key[0] = 0;",
    "    pq.push({0, 0}); // {key, vertex}",
    "",
    "    while(!pq.empty() && mstEdges.size() < numVertices - 1) {",
    "        Edge current = pq.top(); pq.pop();",
    "        int u = current.to;",
    "        if(mstSet[u]) continue;",
    "        mstSet[u] = true;",
    "        if(parent[u] != -1) mstEdges.push_back({parent[u], u, key[u]});",
    "",
    "        for(const auto& edge : adj[u]) {",
    "            int v = edge.first; int weight = edge.second;",
    "            if(!mstSet[v] && weight < key[v]) {",
    "                key[v] = weight; parent[v] = u;",
    "                pq.push({key[v], v});",
    "            }",
    "        }",
    "    }",
    "    return (mstEdges.size() == numVertices -1 || numVertices == 0) ? mstEdges : std::vector<MSTEdge>(); // Return empty if no full MST",
    "}",
  ],
};

interface PrimsAlgorithmCodePanelProps {
  currentLine: number | null;
}

export function PrimsAlgorithmCodePanel({ currentLine }: PrimsAlgorithmCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(PRIMS_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = PRIMS_CODE_SNIPPETS[selectedLanguage as keyof typeof PRIMS_CODE_SNIPPETS]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for Prim's Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const currentCodeLines = PRIMS_CODE_SNIPPETS[selectedLanguage as keyof typeof PRIMS_CODE_SNIPPETS] || [];

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: Prim's Algorithm
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
                  {PRIMS_CODE_SNIPPETS[lang as keyof typeof PRIMS_CODE_SNIPPETS]?.map((line, index) => (
                    <div
                      key={`prim-${lang}-line-${index}`}
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
