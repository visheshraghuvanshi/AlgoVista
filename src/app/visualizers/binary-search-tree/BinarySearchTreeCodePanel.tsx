
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { BSTOperationType } from './binary-search-tree-logic';

export const BST_CODE_SNIPPETS: Record<BSTOperationType | 'structure', string[]> = {
  structure: [
    "class Node {",
    "  constructor(value) {",
    "    this.value = value;",
    "    this.left = null;",
    "    this.right = null;",
    "  }",
    "}",
    "class BinarySearchTree {",
    "  constructor() { this.root = null; }",
    "  // ... operations ...",
    "}",
  ],
  insert: [
    "// Insert (Recursive)",
    "insert(value) { this.root = this._insertRec(this.root, value); }",
    "_insertRec(node, value) {",
    "  if (node === null) return new Node(value);",
    "  if (value < node.value) {",
    "    node.left = this._insertRec(node.left, value);",
    "  } else if (value > node.value) {",
    "    node.right = this._insertRec(node.right, value);",
    "  }",
    "  return node; // Return unchanged node pointer (or new if null)",
    "}",
  ],
  search: [
    "// Search (Recursive)",
    "search(value) { return this._searchRec(this.root, value); }",
    "_searchRec(node, value) {",
    "  if (node === null || node.value === value) return node;",
    "  if (value < node.value) {",
    "    return this._searchRec(node.left, value);",
    "  } else {",
    "    return this._searchRec(node.right, value);",
    "  }",
    "}",
  ],
  delete: [
    "// Delete (Recursive)",
    "delete(value) { this.root = this._deleteRec(this.root, value); }",
    "_deleteRec(node, value) {",
    "  if (node === null) return null;",
    "  if (value < node.value) {",
    "    node.left = this._deleteRec(node.left, value);",
    "  } else if (value > node.value) {",
    "    node.right = this._deleteRec(node.right, value);",
    "  } else { // Node to be deleted found",
    "    // Case 1: No child or one child",
    "    if (node.left === null) return node.right;",
    "    if (node.right === null) return node.left;",
    "    // Case 2: Node with two children",
    "    // Get the inorder successor (smallest in the right subtree)",
    "    node.value = this._minValue(node.right);",
    "    // Delete the inorder successor",
    "    node.right = this._deleteRec(node.right, node.value);",
    "  }",
    "  return node;",
    "}",
    "_minValue(node) { // Helper to find min value in a subtree",
    "  let minv = node.value;",
    "  while (node.left !== null) { minv = node.left.value; node = node.left; }",
    "  return minv;",
    "}",
  ],
};

interface BinarySearchTreeCodePanelProps {
  currentLine: number | null;
  selectedOperation: BSTOperationType | null;
}

export function BinarySearchTreeCodePanel({ currentLine, selectedOperation }: BinarySearchTreeCodePanelProps) {
  const { toast } = useToast();
  const codeToDisplay = selectedOperation ? BST_CODE_SNIPPETS[selectedOperation] : BST_CODE_SNIPPETS.structure;
  const operationLabel = selectedOperation ? selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1) : "Structure";

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${operationLabel} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {operationLabel}
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
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
