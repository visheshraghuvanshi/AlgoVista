
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SegmentTreeOperation } from './types';
import { BIT_LINE_MAP } from './binary-indexed-tree-logic';

const BIT_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "// BIT with 1-based indexing for internal logic",
    "class BinaryIndexedTree {",
    "  constructor(size) {",
    "    this.bit = new Array(size + 1).fill(0);",
    "  }",
    "",
    "  // 0-based index for user, delta is the change",
    "  update(index, delta) {",
    "    index++; // Convert to 1-based",
    "    while (index < this.bit.length) {",
    "      this.bit[index] += delta;",
    "      index += index & -index; // Move to parent",
    "    }",
    "  }",
    "",
    "  // 0-based index for user, gets sum up to index",
    "  query(index) {",
    "    index++; // Convert to 1-based",
    "    let sum = 0;",
    "    while (index > 0) {",
    "      sum += this.bit[index];",
    "      index -= index & -index; // Move to ancestor",
    "    }",
    "    return sum;",
    "  }",
    "}",
  ],
  Python: [
    "# BIT with 1-based indexing for internal logic",
    "class BinaryIndexedTree:",
    "    def __init__(self, size):",
    "        self.bit = [0] * (size + 1)",
    "",
    "    def update(self, index, delta):",
    "        index += 1",
    "        while index < len(self.bit):",
    "            self.bit[index] += delta",
    "            index += index & -index",
    "",
    "    def query(self, index):",
    "        index += 1",
    "        sum = 0",
    "        while index > 0:",
    "            sum += self.bit[index]",
    "            index -= index & -index",
    "        return sum",
  ],
  Java: [
    "class BinaryIndexedTree {",
    "    int[] bit;",
    "    public BinaryIndexedTree(int size) {",
    "        bit = new int[size + 1];",
    "    }",
    "",
    "    public void update(int index, int delta) {",
    "        index++;",
    "        while (index < bit.length) {",
    "            bit[index] += delta;",
    "            index += index & -index;",
    "        }",
    "    }",
    "",
    "    public int query(int index) {",
    "        index++;",
    "        int sum = 0;",
    "        while (index > 0) {",
    "            sum += bit[index];",
    "            index -= index & -index;",
    "        }",
    "        return sum;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "class BinaryIndexedTree {",
    "private:",
    "    std::vector<int> bit;",
    "public:",
    "    BinaryIndexedTree(int size) : bit(size + 1, 0) {}",
    "",
    "    void update(int index, int delta) {",
    "        index++;",
    "        while (index < bit.size()) {",
    "            bit[index] += delta;",
    "            index += index & -index;",
    "        }",
    "    }",
    "",
    "    int query(int index) {",
    "        index++;",
    "        int sum = 0;",
    "        while (index > 0) {",
    "            sum += bit[index];",
    "            index -= index & -index;",
    "        }",
    "        return sum;",
    "    }",
    "};",
  ],
};


interface BITCodePanelProps {
  currentLine: number | null;
  selectedOperation: SegmentTreeOperation;
}

export function BITCodePanel({ currentLine, selectedOperation }: BITCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(BIT_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const codeToDisplay = BIT_CODE_SNIPPETS[selectedLanguage] || [];

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
            <Code2 className="mr-2 h-5 w-5" /> BIT Code
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
