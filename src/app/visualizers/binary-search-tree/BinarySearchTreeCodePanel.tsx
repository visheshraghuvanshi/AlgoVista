
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { BSTOperationType } from './binary-search-tree-logic';
import { BST_OPERATION_LINE_MAPS } from './binary-search-tree-logic';


export const BST_CODE_SNIPPETS_MAP: Record<BSTOperationType | 'structure', string[]> = {
  structure: [
    "class Node {",                            // 1
    "  constructor(value) {",                  // 2
    "    this.value = value;",                 // 3
    "    this.left = null;",                   // 4
    "    this.right = null;",                  // 5
    "  }",                                     // 6
    "}",                                       // 7
    "class BinarySearchTree {",                // 8
    "  constructor() { this.root = null; }",   // 9
    "  // ... operations below ...",           // 10
    "}",                                       // 11
  ],
  insert: [
    "insert(value) {", // Main function wrapper   // 1
    "  this.root = this._insertRec(this.root, value);", // 2
    "}", 
    "_insertRec(node, value) {", // Recursive helper // 3
    "  if (node === null) return new Node(value);", // 4
    "  if (value < node.value) {",                 // 5
    "    node.left = this._insertRec(node.left, value);", // 6
    "  } else if (value > node.value) {",          // 7
    "    node.right = this._insertRec(node.right, value);", // 8
    "  }",
    "  return node;", // Return unchanged (or new) node pointer // 9
    "}",
  ],
  search: [
    "search(value) {", // Main function wrapper  // 1
    "  return this._searchRec(this.root, value);", // 2
    "}",
    "_searchRec(node, value) {", // Recursive helper // 3
    "  if (node === null || node.value === value) return node;", // 4
    "  if (value < node.value) {",                 // 5
    "    return this._searchRec(node.left, value);", // 6
    "  } else {",                                  // 7
    "    return this._searchRec(node.right, value);", // 8
    "  }",
    "}",
  ],
  delete: [
    "delete(value) {", // Main function wrapper // 1
    "  this.root = this._deleteRec(this.root, value);", // 2
    "}",
    "_deleteRec(node, value) {", // Recursive helper // 3
    "  if (node === null) return null;",         // 4
    "  if (value < node.value) {",              // 5
    "    node.left = this._deleteRec(node.left, value);", // 6
    "  } else if (value > node.value) {",       // 7
    "    node.right = this._deleteRec(node.right, value);", // 8
    "  } else { // Node to delete found",         // 9
    "    // Case 1 & 2: Node with 0 or 1 child",
    "    if (node.left === null) {",            // 10
    "      return node.right;",                 // 11
    "    }",
    "    if (node.right === null) {",           // 12
    "      return node.left;",                  // 13
    "    }",
    "    // Case 3: Node with two children",      // 14
    "    // Get inorder successor (smallest in right subtree)",
    "    let successor = this._minValueNode(node.right);", // 15
    "    node.value = successor.value;",       // 16
    "    // Delete the inorder successor",
    "    node.right = this._deleteRec(node.right, successor.value);", // 17
    "  }",
    "  return node;",                           // 18
    "}",
    "_minValueNode(node) { // Helper for delete // 19
    "  while (node.left !== null) { node = node.left; }", // 20
    "  return node;",                           // 21
    "}",
  ],
  build: [ // Build uses insert, so often shown with insert code
    "// Build Tree by repeated insertions:",
    "// For each value in input:",
    "//   tree.insert(value);",
    "// (See 'insert' tab for insertion logic details)",
  ]
};

interface BinarySearchTreeCodePanelProps {
  currentLine: number | null;
  selectedOperation: BSTOperationType | 'structure'; // Allow 'structure' to show class definitions
}

export function BinarySearchTreeCodePanel({ currentLine, selectedOperation }: BinarySearchTreeCodePanelProps) {
  const { toast } = useToast();
  
  const codeToDisplay = BST_CODE_SNIPPETS_MAP[selectedOperation] || BST_CODE_SNIPPETS_MAP.structure;
  const operationLabel = selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1);

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${operationLabel} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  // Determine actual line number based on selected operation and global currentLine from step
  // This is a bit of a conceptual mapping. If currentLine is from a specific op's map, show it.
  // Otherwise, if line number makes sense in the current snippet, show it.
  // For simplicity, we'll just pass currentLine and let the coloring logic handle it.

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
            {codeToDisplay.length === 0 && <p className="text-muted-foreground">Select an operation to view code.</p>}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

