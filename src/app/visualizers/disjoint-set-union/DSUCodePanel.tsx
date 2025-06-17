
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { DSU_LINE_MAP } from './dsu-logic'; // Line map can be used if highlighting is granular

export const DSU_CODE_SNIPPETS = {
  JavaScript: [
    "class DisjointSetUnion {",
    "  constructor(n) {",
    "    this.parent = Array(n).fill(0).map((_, i) => i);",
    "    this.rank = Array(n).fill(0); // For Union by Rank",
    "    // this.size = Array(n).fill(1); // For Union by Size",
    "  }",
    "",
    "  find(i) { // Path Compression",
    "    if (this.parent[i] === i) return i;",
    "    this.parent[i] = this.find(this.parent[i]);",
    "    return this.parent[i];",
    "  }",
    "",
    "  union(i, j) { // Union by Rank",
    "    const rootI = this.find(i);",
    "    const rootJ = this.find(j);",
    "    if (rootI !== rootJ) {",
    "      if (this.rank[rootI] < this.rank[rootJ]) {",
    "        this.parent[rootI] = rootJ;",
    "      } else if (this.rank[rootI] > this.rank[rootJ]) {",
    "        this.parent[rootJ] = rootI;",
    "      } else {",
    "        this.parent[rootJ] = rootI;",
    "        this.rank[rootI]++;",
    "      }",
    "      return true; // Union successful",
    "    }",
    "    return false; // Already in the same set",
    "  }",
    "}",
  ],
  Python: [
    "class DisjointSetUnion:",
    "    def __init__(self, n):",
    "        self.parent = list(range(n))",
    "        self.rank = [0] * n",
    "",
    "    def find(self, i): # Path Compression",
    "        if self.parent[i] == i:",
    "            return i",
    "        self.parent[i] = self.find(self.parent[i])",
    "        return self.parent[i]",
    "",
    "    def union(self, i, j): # Union by Rank",
    "        root_i = self.find(i)",
    "        root_j = self.find(j)",
    "        if root_i != root_j:",
    "            if self.rank[root_i] < self.rank[root_j]:",
    "                self.parent[root_i] = root_j",
    "            elif self.rank[root_i] > self.rank[root_j]:",
    "                self.parent[root_j] = root_i",
    "            else:",
    "                self.parent[root_j] = root_i",
    "                self.rank[root_i] += 1",
    "            return True",
    "        return False",
  ],
  Java: [
    "class DisjointSetUnion {",
    "    private int[] parent;",
    "    private int[] rank;",
    "",
    "    public DisjointSetUnion(int n) {",
    "        parent = new int[n];",
    "        rank = new int[n];",
    "        for (int i = 0; i < n; i++) {",
    "            parent[i] = i;",
    "            rank[i] = 0;",
    "        }",
    "    }",
    "",
    "    public int find(int i) { // Path Compression",
    "        if (parent[i] == i) return i;",
    "        parent[i] = find(parent[i]);",
    "        return parent[i];",
    "    }",
    "",
    "    public boolean union(int i, int j) { // Union by Rank",
    "        int rootI = find(i);",
    "        int rootJ = find(j);",
    "        if (rootI != rootJ) {",
    "            if (rank[rootI] < rank[rootJ]) {",
    "                parent[rootI] = rootJ;",
    "            } else if (rank[rootI] > rank[rootJ]) {",
    "                parent[rootJ] = rootI;",
    "            } else {",
    "                parent[rootJ] = rootI;",
    "                rank[rootI]++;",
    "            }",
    "            return true;",
    "        }",
    "        return false;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <numeric> // For std::iota",
    "class DisjointSetUnion {",
    "public:",
    "    std::vector<int> parent;",
    "    std::vector<int> rank;",
    "",
    "    DisjointSetUnion(int n) {",
    "        parent.resize(n);",
    "        std::iota(parent.begin(), parent.end(), 0); // Fill with 0, 1, ..., n-1",
    "        rank.assign(n, 0);",
    "    }",
    "",
    "    int find(int i) { // Path Compression",
    "        if (parent[i] == i) return i;",
    "        return parent[i] = find(parent[i]);",
    "    }",
    "",
    "    bool unite(int i, int j) { // Union by Rank (renamed to avoid keyword)",
    "        int rootI = find(i);",
    "        int rootJ = find(j);",
    "        if (rootI != rootJ) {",
    "            if (rank[rootI] < rank[rootJ]) {",
    "                parent[rootI] = rootJ;",
    "            } else if (rank[rootI] > rank[rootJ]) {",
    "                parent[rootJ] = rootI;",
    "            } else {",
    "                parent[rootJ] = rootI;",
    "                rank[rootI]++;",
    "            }",
    "            return true;",
    "        }",
    "        return false;",
    "    }",
    "};",
  ],
};

interface DSUCodePanelProps {
  currentLine: number | null;
}

export function DSUCodePanel({ currentLine }: DSUCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(DSU_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = DSU_CODE_SNIPPETS[selectedLanguage as keyof typeof DSU_CODE_SNIPPETS]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for DSU Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const currentCodeLines = DSU_CODE_SNIPPETS[selectedLanguage as keyof typeof DSU_CODE_SNIPPETS] || [];

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: DSU
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
                  {DSU_CODE_SNIPPETS[lang as keyof typeof DSU_CODE_SNIPPETS]?.map((line, index) => (
                    <div
                      key={`dsu-${lang}-line-${index}`}
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

    