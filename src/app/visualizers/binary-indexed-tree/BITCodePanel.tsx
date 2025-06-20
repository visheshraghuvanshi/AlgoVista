
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BITOperationType } from './types';

// BIT Code Snippets (Conceptual, 1-based indexing for BIT operations)
export const BIT_CODE_SNIPPETS: Record<string, Record<BITOperationType | 'structure', string[]>> = {
  JavaScript: {
    structure: [
      "class FenwickTree {",
      "  constructor(sizeOrArray) {",
      "    if (Array.isArray(sizeOrArray)) {",
      "      this.size = sizeOrArray.length;",
      "      this.tree = new Array(this.size + 1).fill(0);",
      "      // Call build method",
      "    } else {",
      "      this.size = sizeOrArray;",
      "      this.tree = new Array(this.size + 1).fill(0);",
      "    }",
      "  }",
      "  // ... operations below ...",
      "}",
    ],
    build: [
      "  // Build BIT from an array (iterative updates)",
      "  _buildFromArray(arr) {",
      "    for (let i = 0; i < arr.length; i++) {",
      "      this.update(i + 1, arr[i]); // BIT is 1-indexed",
      "    }",
      "  }",
    ],
    update: [
      "  update(index, delta) { // index is 1-based",
      "    while (index <= this.size) {",
      "      this.tree[index] += delta;",
      "      index += index & (-index); // Add LSB",
      "    }",
      "  }",
    ],
    query: [
      "  query(index) { // Prefix sum up to index (1-based)",
      "    let sum = 0;",
      "    while (index > 0) {",
      "      sum += this.tree[index];",
      "      index -= index & (-index); // Subtract LSB",
      "    }",
      "    return sum;",
      "  }",
    ],
    queryRange: [
      "  queryRange(left, right) { // Sum for [left, right] (1-based)",
      "    if (left > right) return 0;",
      "    return this.query(right) - this.query(left - 1);",
      "  }",
    ],
  },
  Python: {
    structure: [
        "class FenwickTree:",
        "    def __init__(self, size_or_array):",
        "        if isinstance(size_or_array, list):",
        "            self.size = len(size_or_array)",
        "            self.tree = [0] * (self.size + 1)",
        "            self._build_from_array(size_or_array)",
        "        else:",
        "            self.size = size_or_array",
        "            self.tree = [0] * (self.size + 1)",
    ],
    build: [
        "    def _build_from_array(self, arr):",
        "        for i, val in enumerate(arr):",
        "            self.update(i + 1, val)",
    ],
    update: [
        "    def update(self, index, delta): # index is 1-based",
        "        while index <= self.size:",
        "            self.tree[index] += delta",
        "            index += index & (-index)",
    ],
    query: [
        "    def query(self, index): # Prefix sum up to index (1-based)",
        "        s = 0",
        "        while index > 0:",
        "            s += self.tree[index]",
        "            index -= index & (-index)",
        "        return s",
    ],
    queryRange: [
        "    def query_range(self, left, right): # Sum for [left, right] (1-based)",
        "        if left > right: return 0",
        "        return self.query(right) - self.query(left - 1)",
    ],
  },
  // Java and C++ would be more verbose with class structure and 1-based indexing adjustments
};

interface BITCodePanelProps {
  currentLine: number | null;
  selectedOperation: BITOperationType;
}

export function BITCodePanel({ currentLine, selectedOperation }: BITCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(BIT_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const structureCode = BIT_CODE_SNIPPETS[selectedLanguage]?.structure || [];
  const operationCode = BIT_CODE_SNIPPETS[selectedLanguage]?.[selectedOperation] || [];
  
  const codeToDisplay = useMemo(() => {
    return [
      ...structureCode,
      ...(operationCode.length > 0 ? ["", `  // --- ${selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)} Method ---`] : []),
      ...operationCode,
      ...(structureCode.length > 0 && operationCode.length > 0 ? ["}"] : []) // Close class if methods shown
    ];
  }, [structureCode, operationCode, selectedOperation]);


  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} BIT Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const operationTitle = selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1);

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> BIT Code: {operationTitle}
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
              {codeToDisplay.map((line, index) => (
                <div
                  key={`bit-${selectedLanguage}-${selectedOperation}-${index}`}
                  className={`px-2 py-0.5 rounded ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}
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

    