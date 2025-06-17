
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const SEGMENT_TREE_CODE_SNIPPETS = {
  build: [
    "// Iterative Segment Tree Build (Sum Query)",
    "class SegmentTree {",
    "  constructor(inputArray) {",
    "    this.n = inputArray.length;",
    "    this.tree = new Array(2 * this.n).fill(0);",
    "    this.build(inputArray);",
    "  }",
    "  build(arr) {",
    "    // Insert leaf nodes in tree",
    "    for (let i = 0; i < this.n; i++) {",          // LINE_MAP.buildLeafLoop
    "      this.tree[this.n + i] = arr[i];",         // LINE_MAP.buildSetLeaf
    "    }",
    "    // Build the tree by calculating parents",
    "    for (let i = this.n - 1; i > 0; --i) {",      // LINE_MAP.buildInternalLoop
    "      this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];", // LINE_MAP.buildSetInternal
    "    }",
    "  }",
    "  // query(left, right) { ... } // For range [left, right)",
    "  // update(index, value) { ... }",
    "}",
  ],
  query: [
    "// Iterative Segment Tree Query (Sum on [left, right) )",
    "query(left, right) { // left inclusive, right exclusive",
    "  let result = 0;",
    "  // Loop to find the sum in the range",
    "  left += this.n; // Adjust to leaf positions",
    "  right += this.n;",
    "  for (; left < right; left = Math.floor(left/2), right = Math.floor(right/2)) {",
    "    if (left % 2 === 1) { // If left is odd, it's a right child",
    "      result += this.tree[left++];",
    "    }",
    "    if (right % 2 === 1) { // If right is odd, it's a right child",
    "      result += this.tree[--right]; // (its left sibling is in range)",
    "    }",
    "  }",
    "  return result;",
    "}",
  ],
  update: [
    "// Iterative Segment Tree Update (Point Update)",
    "update(index, value) {",
    "  let pos = index + this.n; // Go to leaf node position",
    "  this.tree[pos] = value;",
    "  // Update parents by traversing up",
    "  while (pos > 1) {",
    "    pos = Math.floor(pos / 2); // Move to parent",
    "    this.tree[pos] = this.tree[pos * 2] + this.tree[pos * 2 + 1];",
    "  }",
    "}",
  ]
};

interface SegmentTreeCodePanelProps {
  currentLine: number | null;
  // Could add prop for selected operation if panel showed different snippets
}

export function SegmentTreeCodePanel({ currentLine }: SegmentTreeCodePanelProps) {
  const { toast } = useToast();
  // For now, always show 'build' code as it's the only interactive part.
  const codeToDisplay = SEGMENT_TREE_CODE_SNIPPETS.build;
  const operationLabel = "Build Process";

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
          <Code2 className="mr-2 h-5 w-5" /> Segment Tree Code ({operationLabel})
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
