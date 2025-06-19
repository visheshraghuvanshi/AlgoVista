
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SegmentTreeOperation } from './types'; // Local import

export const SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG: Record<SegmentTreeOperation, Record<string, string[]>> = {
  build: {
    JavaScript: [
      "// Iterative Segment Tree Build (Sum Query)",
      "// In constructor or separate build method:",
      "this.n = inputArray.length;",
      "this.tree = new Array(2 * this.n).fill(0);",
      "// Insert leaf nodes in tree:",
      "for (let i = 0; i < this.n; i++) {",
      "  this.tree[this.n + i] = inputArray[i];",
      "}",
      "// Build the tree by calculating parents:",
      "for (let i = this.n - 1; i > 0; --i) {",
      "  this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];",
      "}",
    ],
    Python: [
        "# Iterative Segment Tree Build (Sum Query)",
        "def build(self, input_array):",
        "    self.n = len(input_array)",
        "    self.tree = [0] * (2 * self.n)",
        "    for i in range(self.n):",
        "        self.tree[self.n + i] = input_array[i]",
        "    for i in range(self.n - 1, 0, -1):",
        "        self.tree[i] = self.tree[i * 2] + self.tree[i * 2 + 1]",
    ],
    Java: [
        "// Iterative Segment Tree Build (Sum Query)",
        "private int[] tree;",
        "private int n;",
        "public SegmentTree(int[] inputArray) {",
        "    this.n = inputArray.length;",
        "    this.tree = new int[2 * n];",
        "    for (int i = 0; i < n; i++) {",
        "        tree[n + i] = inputArray[i];",
        "    }",
        "    for (int i = n - 1; i > 0; --i) {",
        "        tree[i] = tree[i * 2] + tree[i * 2 + 1];",
        "    }",
        "}",
    ],
    "C++": [
        "// Iterative Segment Tree Build (Sum Query)",
        "#include <vector>",
        "class SegmentTree {",
        "public:",
        "    std::vector<int> tree;",
        "    int n;",
        "    SegmentTree(const std::vector<int>& inputArray) {",
        "        n = inputArray.size();",
        "        tree.assign(2 * n, 0);",
        "        for (int i = 0; i < n; ++i) {",
        "            tree[n + i] = inputArray[i];",
        "        }",
        "        for (int i = n - 1; i > 0; --i) {",
        "            tree[i] = tree[i * 2] + tree[i * 2 + 1];",
        "        }",
        "    }",
        "};",
    ],
  },
  query: {
    JavaScript: [
      "// Iterative Segment Tree Query (Sum on [left, right) )",
      "query(left, right) { // left inclusive, right exclusive",
      "  let result = 0;",
      "  left += this.n; right += this.n;",
      "  for (; left < right; left = Math.floor(left/2), right = Math.floor(right/2)) {",
      "    if (left % 2 === 1) {",
      "      result += this.tree[left++];",
      "    }",
      "    if (right % 2 === 1) {",
      "      result += this.tree[--right];",
      "    }",
      "  }",
      "  return result;",
      "}",
    ],
     Python: [
        "def query(self, left, right): # [left, right)",
        "    result = 0",
        "    left += self.n",
        "    right += self.n",
        "    while left < right:",
        "        if left % 2 == 1:",
        "            result += self.tree[left]",
        "            left += 1",
        "        if right % 2 == 1:",
        "            right -= 1",
        "            result += self.tree[right]",
        "        left //= 2",
        "        right //= 2",
        "    return result",
    ],
    Java: [
        "public int query(int left, int right) { // [left, right)",
        "    int result = 0;",
        "    left += n;",
        "    right += n;",
        "    for (; left < right; left /= 2, right /= 2) {",
        "        if ((left % 2) == 1) result += tree[left++];",
        "        if ((right % 2) == 1) result += tree[--right];",
        "    }",
        "    return result;",
        "}",
    ],
    "C++": [
        "int query(int left, int right) { // [left, right)",
        "    int result = 0;",
        "    left += n;",
        "    right += n;",
        "    for (; left < right; left /= 2, right /= 2) {",
        "        if (left % 2 == 1) result += tree[left++];",
        "        if (right % 2 == 1) result += tree[--right];",
        "    }",
        "    return result;",
        "}",
    ],
  },
  update: {
    JavaScript: [
      "// Iterative Segment Tree Update (Point Update)",
      "update(index, value) {",
      "  let pos = index + this.n;",
      "  this.tree[pos] = value;",
      "  while (pos > 1) {",
      "    pos = Math.floor(pos / 2);",
      "    this.tree[pos] = this.tree[pos * 2] + this.tree[pos * 2 + 1];",
      "  }",
      "}",
    ],
    Python: [
        "def update(self, index, value):",
        "    pos = index + self.n",
        "    self.tree[pos] = value",
        "    while pos > 1:",
        "        pos //= 2",
        "        self.tree[pos] = self.tree[pos * 2] + self.tree[pos * 2 + 1]",
    ],
    Java: [
        "public void update(int index, int value) {",
        "    int pos = index + n;",
        "    tree[pos] = value;",
        "    while (pos > 1) {",
        "        pos /= 2;",
        "        tree[pos] = tree[pos * 2] + tree[pos * 2 + 1];",
        "    }",
        "}",
    ],
    "C++": [
        "void update(int index, int value) {",
        "    int pos = index + n;",
        "    tree[pos] = value;",
        "    while (pos > 1) {",
        "        pos /= 2;",
        "        tree[pos] = tree[pos * 2] + tree[pos * 2 + 1];",
        "    }",
        "}",
    ],
  }
};

interface SegmentTreeCodePanelProps {
  currentLine: number | null;
  selectedOperation: SegmentTreeOperation;
}

export function SegmentTreeCodePanel({ currentLine, selectedOperation }: SegmentTreeCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG.build), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);
  
  const codeToDisplay = SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG[selectedOperation]?.[selectedLanguage] || [];
  const operationLabel = selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1);

  const handleCopyCode = () => {
    const structureSnippets = SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG.build[selectedLanguage] || [];
    let fullCode = "";

    if (selectedOperation === 'build') {
        fullCode = codeToDisplay.join('\n');
    } else {
        const classStructureLines = {
            JavaScript: [
                "class SegmentTree {",
                "  constructor(inputArray) {",
                "    this.n = inputArray.length;",
                "    this.tree = new Array(2 * this.n).fill(0);",
                "    for (let i = 0; i < this.n; i++) this.tree[this.n + i] = inputArray[i];",
                "    for (let i = this.n - 1; i > 0; --i) this.tree[i] = this.tree[i*2] + this.tree[i*2+1];",
                "  }",
            ],
            Python: [
                "class SegmentTree:",
                "  def __init__(self, input_array):",
                "    self.n = len(input_array)",
                "    self.tree = [0] * (2 * self.n)",
                "    for i in range(self.n): self.tree[self.n + i] = input_array[i]",
                "    for i in range(self.n - 1, 0, -1): self.tree[i] = self.tree[i*2] + self.tree[i*2+1]",
            ],
            Java: [
                 "class SegmentTree {",
                 "  private int[] tree;",
                 "  private int n;",
                 "  public SegmentTree(int[] inputArray) { /* ... build logic ... */ }",
            ],
            "C++": [
                 "#include <vector>",
                 "class SegmentTree {",
                 "public:",
                 "  std::vector<int> tree;",
                 "  int n;",
                 "  SegmentTree(const std::vector<int>& inputArray) { /* ... build logic ... */ }",
            ]
        };
        const structurePrefix = classStructureLines[selectedLanguage as keyof typeof classStructureLines]?.join('\n') || "";
        const operationIndented = codeToDisplay.map(line => `    ${line}`).join('\n');
        fullCode = `${structurePrefix}\n${operationIndented}\n}`; 
    }

    if (fullCode) {
      navigator.clipboard.writeText(fullCode)
        .then(() => toast({ title: `${selectedLanguage} ${operationLabel} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Segment Tree: {operationLabel}
        </CardTitle>
        <div className="flex items-center gap-2">
            <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 h-8 text-xs p-0.5">
                    {languages.map(lang => (
                        <TabsTrigger key={lang} value={lang} className="text-xs px-1.5 py-0.5 h-auto">
                            {lang}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
            {codeToDisplay.map((line, index) => (
              <div key={`${operationLabel}-${selectedLanguage}-line-${index}`}
                className={`px-2 py-0.5 rounded ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                {line}
              </div>
            ))}
            {codeToDisplay.length === 0 && <p className="text-muted-foreground">Select an operation to view code.</p>}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
