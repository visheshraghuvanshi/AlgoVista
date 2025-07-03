
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SegmentTreeOperation } from './types'; // Local import

// Iterative Segment Tree Code Snippets
export const SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG: Record<SegmentTreeOperation, Record<string, string[]>> = {
  build: {
    JavaScript: [
      "// Constructor and Iterative Build (Sum Query)",
      "constructor(inputArray) {",                                
      "  this.n = inputArray.length;",                          
      "  this.tree = new Array(2 * this.n);",                     
      "  // Call build method (or inline build logic)",          
      "  this._build(inputArray);",
      "}",
      "_build(inputArray) {",                                     
      "  // Insert leaf nodes in tree:",
      "  for (let i = 0; i < this.n; i++) {",                     
      "    this.tree[this.n + i] = inputArray[i];",             
      "  }",
      "  // Build the tree by calculating parents:",
      "  for (let i = this.n - 1; i > 0; --i) {",                 
      "    this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];",
      "  }",
      "}",                                                         
    ],
    Python: [
        "// Iterative Segment Tree Build (Sum Query)",
        "class SegmentTree:",
        "  def __init__(self, input_array):",
        "    self.n = len(input_array)",
        "    self.tree = [0] * (2 * self.n) // Initialize with appropriate identity",
        "    self._build(input_array)",
        "",
        "  def _build(self, input_array):",
        "    for i in range(self.n):",
        "        self.tree[self.n + i] = input_array[i]",
        "    for i in range(self.n - 1, 0, -1):",
        "        self.tree[i] = self.tree[i * 2] + self.tree[i * 2 + 1]",
    ],
    Java: [
        "// Iterative Segment Tree Build (Sum Query)",
        "class SegmentTree {",
        "    private int[] tree;",
        "    private int n;",
        "    public SegmentTree(int[] inputArray) {",
        "        this.n = inputArray.length;",
        "        this.tree = new int[2 * n];",
        "        build(inputArray);",
        "    }",
        "    private void build(int[] inputArray) {",
        "        for (int i = 0; i < n; i++) {",
        "            tree[n + i] = inputArray[i];",
        "        }",
        "        for (int i = n - 1; i > 0; --i) {",
        "            tree[i] = tree[i * 2] + tree[i * 2 + 1];",
        "        }",
        "    }",
        "// ... query and update methods ...",
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
        "        build(inputArray);",
        "    }",
        "private:",
        "    void build(const std::vector<int>& inputArray) {",
        "        for (int i = 0; i < n; ++i) {",
        "            tree[n + i] = inputArray[i];",
        "        }",
        "        for (int i = n - 1; i > 0; --i) {",
        "            tree[i] = tree[i * 2] + tree[i * 2 + 1];",
        "        }",
        "    }",
        "// ... query and update methods ...",
        "};",
    ],
  },
  query: {
    JavaScript: [
      "query(left, right) { // Range [left, right) sum", 
      "  let result = 0;",                             
      "  left += this.n; right += this.n;",            
      "  for (; left < right; left >>= 1, right >>= 1) {", 
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
        "  def query(self, left, right): # [left, right) sum",
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
        "    public int query(int left, int right) { // [left, right) sum",
        "        int result = 0;",
        "        left += n;",
        "        right += n;",
        "        for (; left < right; left /= 2, right /= 2) {",
        "            if ((left % 2) == 1) result += tree[left++];",
        "            if ((right % 2) == 1) result += tree[--right];",
        "        }",
        "        return result;",
        "    }",
    ],
    "C++": [
        "    int query(int left, int right) { // [left, right) sum",
        "        int result = 0;",
        "        left += n;",
        "        right += n;",
        "        for (; left < right; left /= 2, right /= 2) {",
        "            if (left % 2 == 1) result += tree[left++];",
        "            if (right % 2 == 1) result += tree[--right];",
        "        }",
        "        return result;",
        "    }",
    ],
  },
  update: {
    JavaScript: [
      "update(index, value) { // Point update", 
      "  let pos = index + this.n;",          
      "  this.tree[pos] = value;",            
      "  while (pos > 1) {",                  
      "    pos = Math.floor(pos / 2);",      
      "    this.tree[pos] = this.tree[pos * 2] + this.tree[pos * 2 + 1];", 
      "  }",
      "}",                                     
    ],
    Python: [
        "  def update(self, index, value):",
        "    pos = index + self.n",
        "    self.tree[pos] = value",
        "    while pos > 1:",
        "        pos //= 2",
        "        self.tree[pos] = self.tree[pos * 2] + self.tree[pos * 2 + 1]",
    ],
    Java: [
        "    public void update(int index, int value) {",
        "        int pos = index + n;",
        "        tree[pos] = value;",
        "        while (pos > 1) {",
        "            pos /= 2;",
        "            tree[pos] = tree[pos * 2] + tree[pos * 2 + 1];",
        "        }",
        "    }",
    ],
    "C++": [
        "    void update(int index, int value) {",
        "        int pos = index + n;",
        "        tree[pos] = value;",
        "        while (pos > 1) {",
        "            pos /= 2;",
        "            tree[pos] = tree[pos * 2] + tree[pos * 2 + 1];",
        "        }",
        "    }",
    ],
  }
};

interface SegmentTreeCodePanelProps {
  currentLine: number | null;
  selectedOperation: SegmentTreeOperation;
}

export function SegmentTreeCodePanel({ currentLine, selectedOperation }: SegmentTreeCodePanelProps) {
  const { toast } = useToast();
  
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  
  const languagesForTabs = useMemo(() => {
    const opKey = selectedOperation as keyof typeof SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG;
    const currentOpSnippets = SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG[opKey] || {};
    const keys = Object.keys(currentOpSnippets);
    return keys.length > 0 ? keys : ["Info"];
  }, [selectedOperation]);

  const effectiveLanguage = languagesForTabs.includes(selectedLanguage)
    ? selectedLanguage
    : languagesForTabs[0] || 'Info';

  useEffect(() => {
    // This effect handles resetting the language if it becomes invalid for the new operation.
    const opKey = selectedOperation as keyof typeof SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG;
    const snippetsForOp = SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG[opKey] || {};
    const availableLangs = Object.keys(snippetsForOp);
    
    if (!availableLangs.includes(selectedLanguage)) {
      setSelectedLanguage(availableLangs.includes("JavaScript") ? "JavaScript" : (availableLangs[0] || "Info"));
    }
  }, [selectedOperation, selectedLanguage]);


  const codeToDisplay = useMemo(() => {
    const opKey = selectedOperation as keyof typeof SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG;
    return (SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG[opKey]?.[effectiveLanguage]) || [];
  }, [selectedOperation, effectiveLanguage]);

  const structureCode = useMemo(() => {
    return (SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG.build?.[effectiveLanguage]) || [];
  }, [effectiveLanguage]);
  
  const operationLabel = selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1);

  const handleCopyCode = () => {
    let codeStringToCopy = "";
    if (selectedOperation === 'build') {
        codeStringToCopy = codeToDisplay.join('\n');
    } else {
        const classStructureLines = SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG.build[effectiveLanguage] || [];
        let insertPoint = classStructureLines.findIndex(line => line.trim().includes("// ... query and update methods ..."));
        if (insertPoint === -1) insertPoint = classStructureLines.length -1; 

        const classStart = classStructureLines.slice(0, insertPoint).join('\n');
        const classEnd = classStructureLines.slice(insertPoint).join('\n');
        
        const indent = (effectiveLanguage === "Python") ? "    " : "  ";
        const operationCodeIndented = codeToDisplay.map(line => `${indent}${line}`).join('\n');
        codeStringToCopy = `${classStart}\n${operationCodeIndented}\n${classEnd}`;
    }

    if (codeStringToCopy.trim()) {
      navigator.clipboard.writeText(codeStringToCopy)
        .then(() => toast({ title: `${effectiveLanguage} ${operationLabel} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    } else {
        toast({ title: "Nothing to Copy", variant: "default" });
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Segment Tree: {operationLabel}
        </CardTitle>
        <div className="flex items-center gap-2">
            <Tabs value={effectiveLanguage} onValueChange={setSelectedLanguage} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 h-8 text-xs p-0.5">
                    {languagesForTabs.map(lang => (
                        <TabsTrigger key={lang} value={lang} className="text-xs px-1.5 py-0.5 h-auto">
                            {lang}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={codeToDisplay.length === 0 || effectiveLanguage === "Info"}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
            {selectedOperation !== 'build' && structureCode.length > 0 && (
              <>
                {structureCode.map((line, index) => (
                  <div key={`struct-${effectiveLanguage}-${index}`} className="px-2 py-0.5 rounded text-muted-foreground/70 opacity-70">
                    <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                    {line}
                  </div>
                ))}
                <div className="my-1 border-b border-dashed border-muted-foreground/30"></div>
              </>
            )}
            {codeToDisplay.map((line, index) => (
              <div key={`${operationLabel}-${effectiveLanguage}-line-${index}`}
                className={`px-2 py-0.5 rounded ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                  {index + 1 + (selectedOperation !== 'build' && structureCode.length > 0 ? structureCode.length + 1 : 0) } 
                </span>
                {line}
              </div>
            ))}
            {codeToDisplay.length === 0 && effectiveLanguage !== "Info" && <p className="text-muted-foreground">Select an operation to view relevant code.</p>}
            {effectiveLanguage === "Info" && <p className="text-muted-foreground">No code snippets for 'Info' tab.</p>}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
