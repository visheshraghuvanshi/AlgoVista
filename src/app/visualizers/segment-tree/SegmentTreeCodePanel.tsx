
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { SegmentTreeOperation } from './segment-tree-logic'; // Assuming type is exported

export const SEGMENT_TREE_CODE_SNIPPETS: Record<SegmentTreeOperation, string[]> = {
  build: [
    "// Iterative Segment Tree Build (Sum Query)",
    "// In constructor or separate build method:",
    "this.n = inputArray.length;",
    "this.tree = new Array(2 * this.n).fill(0);",
    "// Insert leaf nodes in tree:",
    "for (let i = 0; i < this.n; i++) {",          // LINE_MAP.buildLeafLoop
    "  this.tree[this.n + i] = inputArray[i];",   // LINE_MAP.buildSetLeaf
    "}",
    "// Build the tree by calculating parents:",
    "for (let i = this.n - 1; i > 0; --i) {",      // LINE_MAP.buildInternalLoop
    "  this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];", // LINE_MAP.buildSetInternal
    "}",
  ],
  query: [
    "// Iterative Segment Tree Query (Sum on [left, right) )",
    "query(left, right) { // left inclusive, right exclusive", // queryFuncStart (12)
    "  let result = 0;", // queryInitResult (13)
    "  left += this.n; right += this.n;", // queryAdjustLR (14)
    "  for (; left < right; left = Math.floor(left/2), right = Math.floor(right/2)) {", // queryLoop (15)
    "    if (left % 2 === 1) { // queryIfLeftOdd (16)",
    "      result += this.tree[left++];", // queryAddLeft (17)
    "    }",
    "    if (right % 2 === 1) { // queryIfRightOdd (18)",
    "      result += this.tree[--right];", // queryAddRight (19)
    "    }",
    "  }",
    "  return result;", // queryReturnResult (20)
    "}", // queryFuncEnd (21)
  ],
  update: [
    "// Iterative Segment Tree Update (Point Update)",
    "update(index, value) {", // updateFuncStart (22)
    "  let pos = index + this.n;", // updateGoToLeaf (23)
    "  this.tree[pos] = value;", // updateSetLeaf (24)
    "  while (pos > 1) {", // updateLoopToRoot (25)
    "    pos = Math.floor(pos / 2);", // updateMoveToParent (26)
    "    this.tree[pos] = this.tree[pos * 2] + this.tree[pos * 2 + 1];", // updateSetParent (27)
    "  }",
    "}", // updateFuncEnd (28)
  ]
};

interface SegmentTreeCodePanelProps {
  currentLine: number | null;
  selectedOperation: SegmentTreeOperation;
}

export function SegmentTreeCodePanel({ currentLine, selectedOperation }: SegmentTreeCodePanelProps) {
  const { toast } = useToast();
  const codeToDisplay = SEGMENT_TREE_CODE_SNIPPETS[selectedOperation] || SEGMENT_TREE_CODE_SNIPPETS.build;
  const operationLabel = selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1);

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${operationLabel} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Segment Tree Code: {operationLabel}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {codeToDisplay.map((line, index) => (
              <div key={`${operationLabel}-line-${index}`}
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

