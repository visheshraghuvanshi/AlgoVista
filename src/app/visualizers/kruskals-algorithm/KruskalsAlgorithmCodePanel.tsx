
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const KRUSKALS_CODE_SNIPPETS = {
  JavaScript: [
    "// Kruskal's Algorithm (using DSU)",
    "class DSU {",
    "  constructor(n) { this.parent = Array(n).fill(0).map((_, i) => i); }",
    "  find(i) { if (this.parent[i] === i) return i; return this.parent[i] = this.find(this.parent[i]); }",
    "  union(i, j) { let rootI = this.find(i); let rootJ = this.find(j); if (rootI !== rootJ) { this.parent[rootI] = rootJ; return true; } return false; }",
    "}",
    "function kruskalsMST(numVertices, edges) { // edges: [{u, v, weight}, ...]",
    "  edges.sort((a, b) => a.weight - b.weight); // Sort edges by weight",
    "  const mst = []; const dsu = new DSU(numVertices);",
    "  let edgeCount = 0;",
    "  for (const edge of edges) {",
    "    if (dsu.union(edge.u, edge.v)) { // If not forming a cycle",
    "      mst.push(edge);",
    "      edgeCount++;",
    "      if (edgeCount === numVertices - 1) break;",
    "    }",
    "  }",
    "  return (edgeCount === numVertices - 1) ? mst : null; // Null if not connected",
    "}",
  ],
  Python: [
    "class DSU:",
    "    def __init__(self, n): self.parent = list(range(n))",
    "    def find(self, i):",
    "        if self.parent[i] == i: return i",
    "        self.parent[i] = self.find(self.parent[i])",
    "        return self.parent[i]",
    "    def union(self, i, j):",
    "        root_i, root_j = self.find(i), self.find(j)",
    "        if root_i != root_j: self.parent[root_i] = root_j; return True",
    "        return False",
    "",
    "def kruskals_mst(num_vertices, edges): # edges: list of (weight, u, v) tuples",
    "    edges.sort() # Sort by weight",
    "    mst = []",
    "    dsu = DSU(num_vertices)",
    "    edge_count = 0",
    "    for weight, u, v in edges:",
    "        if dsu.union(u, v):",
    "            mst.append({'u': u, 'v': v, 'weight': weight})",
    "            edge_count += 1",
    "            if edge_count == num_vertices - 1: break",
    "    return mst if edge_count == num_vertices - 1 else None",
  ],
  Java: [
    "import java.util.*;",
    "class DSU {",
    "    int[] parent;",
    "    public DSU(int n) { parent = new int[n]; for(int i=0; i<n; i++) parent[i]=i; }",
    "    public int find(int i) { if (parent[i]==i) return i; return parent[i]=find(parent[i]); }",
    "    public boolean union(int i, int j) { int rI=find(i), rJ=find(j); if(rI!=rJ){parent[rI]=rJ;return true;}return false;}",
    "}",
    "class Edge implements Comparable<Edge> { int u,v,w; Edge(int u,int v,int w){this.u=u;this.v=v;this.w=w;} @Override public int compareTo(Edge o){return this.w-o.w;}}",
    "class KruskalMST {",
    "    List<Edge> findMST(int numVertices, List<Edge> edges) {",
    "        Collections.sort(edges);",
    "        List<Edge> mst = new ArrayList<>();",
    "        DSU dsu = new DSU(numVertices); int edgeCount = 0;",
    "        for (Edge edge : edges) {",
    "            if (dsu.union(edge.u, edge.v)) {",
    "                mst.add(edge); edgeCount++;",
    "                if (edgeCount == numVertices - 1) break;",
    "            }",
    "        }",
    "        return (edgeCount == numVertices - 1) ? mst : null;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <numeric> // For std::iota",
    "#include <algorithm> // For std::sort",
    "struct DSU {",
    "    std::vector<int> parent;",
    "    DSU(int n) { parent.resize(n); std::iota(parent.begin(), parent.end(), 0); }",
    "    int find(int i) { if (parent[i]==i) return i; return parent[i]=find(parent[i]); }",
    "    bool unite(int i, int j) { int rI=find(i),rJ=find(j); if(rI!=rJ){parent[rI]=rJ;return true;}return false;}",
    "};",
    "struct Edge { int u, v, weight; bool operator<(const Edge& o) const { return weight < o.weight; } };",
    "std::vector<Edge> kruskalsMST(int numVertices, std::vector<Edge>& edges) {",
    "    std::sort(edges.begin(), edges.end());",
    "    std::vector<Edge> mst;",
    "    DSU dsu(numVertices); int edgeCount = 0;",
    "    for (const auto& edge : edges) {",
    "        if (dsu.unite(edge.u, edge.v)) {",
    "            mst.push_back(edge); edgeCount++;",
    "            if (edgeCount == numVertices - 1) break;",
    "        }",
    "    }",
    "    return (edgeCount == numVertices - 1) ? mst : std::vector<Edge>(); // Empty if no MST",
    "}",
  ],
};

interface KruskalsAlgorithmCodePanelProps {
  currentLine: number | null;
}

export function KruskalsAlgorithmCodePanel({ currentLine }: KruskalsAlgorithmCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(KRUSKALS_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = KRUSKALS_CODE_SNIPPETS[selectedLanguage as keyof typeof KRUSKALS_CODE_SNIPPETS]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for Kruskal's Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const currentCodeLines = KRUSKALS_CODE_SNIPPETS[selectedLanguage as keyof typeof KRUSKALS_CODE_SNIPPETS] || [];

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: Kruskal's Algorithm
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
                  {KRUSKALS_CODE_SNIPPETS[lang as keyof typeof KRUSKALS_CODE_SNIPPETS]?.map((line, index) => (
                    <div
                      key={`kruskal-${lang}-line-${index}`}
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

