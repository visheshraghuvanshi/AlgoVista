
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { RBT_LINE_MAP } from './red-black-tree-logic'; // For consistency, though not directly used for snippet keys here

type RBTOperationType = 'insert' | 'search' | 'delete' | 'structure'; // 'delete' is conceptual

const RBT_CODE_SNIPPETS: Record<RBTOperationType, string[]> = {
  structure: [
    "// Red-Black Tree Node and Class Structure (Conceptual)",
    "const RED = true; const BLACK = false;",
    "class RBTNode {",
    "  constructor(value, color = RED, parent = null, left = null, right = null) {",
    "    this.value = value; this.color = color;",
    "    this.parent = parent; this.left = left; this.right = right;",
    "  }",
    "}",
    "class RedBlackTree {",
    "  constructor() {",
    "    this.NIL = new RBTNode(null, BLACK); // Sentinel NIL node",
    "    this.NIL.parent = this.NIL; this.NIL.left = this.NIL; this.NIL.right = this.NIL;",
    "    this.root = this.NIL;",
    "  }",
    "  // ... operations like insert, search, delete, rotations ...",
    "}",
  ],
  insert: [
    "// Insert Operation (Conceptual - combines BST insert & fixup)",
    "insert(value) { // Line Map Start: " + RBT_LINE_MAP.insertFuncStart,
    "  let node = new RBTNode(value, RED, this.NIL, this.NIL, this.NIL);",
    "  // Standard BST insert logic...",
    "  let y = this.NIL; let x = this.root;",
    "  while (x !== this.NIL) { // Line " + RBT_LINE_MAP.bstInsertLoop,
    "    y = x;",
    "    if (node.value < x.value) x = x.left; // Line " + RBT_LINE_MAP.bstInsertGoLeft,
    "    else x = x.right; // Line " + RBT_LINE_MAP.bstInsertGoRight,
    "  }",
    "  node.parent = y; // Line " + RBT_LINE_MAP.bstInsertSetParent,
    "  if (y === this.NIL) this.root = node;",
    "  else if (node.value < y.value) y.left = node;",
    "  else y.right = node;",
    "  // New node is RED, color already set. Left/Right children are NIL.",
    "  this.insertFixup(node); // Line " + RBT_LINE_MAP.callInsertFixup,
    "} // Line " + RBT_LINE_MAP.insertFuncEnd,
    "",
    "insertFixup(z) { // Line " + RBT_LINE_MAP.callInsertFixup,
    "  while (z.parent.color === RED) { // Line " + RBT_LINE_MAP.fixupLoopStart,
    "    if (z.parent === z.parent.parent.left) { // Line " + RBT_LINE_MAP.fixupParentIsLeftChild,
    "      let y = z.parent.parent.right; // Uncle // Line " + RBT_LINE_MAP.fixupUncleIsRightChild,
    "      if (y.color === RED) { // Case 1 // Line " + RBT_LINE_MAP.fixupCase1UncleRed,
    "        z.parent.color = BLACK; y.color = BLACK; // Line " + (RBT_LINE_MAP.fixupCase1RecolorParent) + "-" + (RBT_LINE_MAP.fixupCase1RecolorUncle),
    "        z.parent.parent.color = RED; // Line " + RBT_LINE_MAP.fixupCase1RecolorGrandparent,
    "        z = z.parent.parent; // Line " + RBT_LINE_MAP.fixupCase1MoveZUp,
    "      } else {",
    "        if (z === z.parent.right) { // Case 2 // Line " + RBT_LINE_MAP.fixupCase2Triangle,
    "          z = z.parent; this.rotateLeft(z); // Line " + (RBT_LINE_MAP.fixupCase2MoveZToParent) + "-" + (RBT_LINE_MAP.fixupCase2RotateParent),
    "        }",
    "        // Case 3",
    "        z.parent.color = BLACK; // Line " + RBT_LINE_MAP.fixupCase3RecolorParent,
    "        z.parent.parent.color = RED; // Line " + RBT_LINE_MAP.fixupCase3RecolorGrandparent,
    "        this.rotateRight(z.parent.parent); // Line " + RBT_LINE_MAP.fixupCase3RotateGrandparent,
    "      }",
    "    } else { /* Symmetric to then clause (parent is right child) */", // Line RBT_LINE_MAP.fixupParentIsRightChild
    "       let y = z.parent.parent.left; // Uncle",
    "       if (y.color === RED) { /* Case 1 */ z.parent.color = BLACK; y.color = BLACK; z.parent.parent.color = RED; z = z.parent.parent; }",
    "       else { if (z === z.parent.left) { /* Case 2 */ z = z.parent; this.rotateRight(z); }",
    "              /* Case 3 */ z.parent.color = BLACK; z.parent.parent.color = RED; this.rotateLeft(z.parent.parent);",
    "       }",
    "    }",
    "  } // Line " + RBT_LINE_MAP.fixupLoopEnd,
    "  this.root.color = BLACK; // Line " + RBT_LINE_MAP.fixupRootRecolor,
    "} // Line " + RBT_LINE_MAP.fixupFuncEnd,
    "",
    "// Rotations (Conceptual - line numbers approximate)",
    "rotateLeft(x) { /* ... complex pointer changes ... */ } // Lines " + RBT_LINE_MAP.rotateLeftStart + "-" + RBT_LINE_MAP.rotateLeftEnd,
    "rotateRight(y) { /* ... complex pointer changes ... */ } // Lines " + RBT_LINE_MAP.rotateRightStart + "-49",
  ],
  search: [
    "// Search Operation (Standard BST Search)",
    "search(value) { // Line " + RBT_LINE_MAP.searchFuncStart,
    "  let current = this.root;",
    "  while (current !== this.NIL) { // Line " + RBT_LINE_MAP.searchLoopStart,
    "    // Comparing search value with current.value // Line " + RBT_LINE_MAP.searchNodeCompare,
    "    if (value === current.value) return current; // Found // Line " + RBT_LINE_MAP.searchValueFound,
    "    if (value < current.value) { // Line " + RBT_LINE_MAP.searchGoLeft,
    "      current = current.left;",
    "    } else { // Line " + RBT_LINE_MAP.searchGoRight,
    "      current = current.right;",
    "    }",
    "  }",
    "  return this.NIL; // Not found // Line " + RBT_LINE_MAP.searchValueNotFound,
    "} // Line " + RBT_LINE_MAP.searchFuncEnd,
  ],
  delete: [
    "// Delete Operation (Conceptual - Highly Complex)",
    "delete(value) {",
    "  // 1. Standard BST delete to find node to remove (z).",
    "  // 2. Handle cases based on children of z (0, 1, or 2).",
    "  //    If z has two children, replace z with successor, then delete successor.",
    "  // 3. Let y be the node actually removed or moved, x be its child that takes its place.",
    "  // 4. If y was BLACK, call deleteFixup(x) to restore R-B properties.",
    "}",
    "deleteFixup(x) {",
    "  // While x is not root and x is BLACK:",
    "  //   Complex cases involving sibling (w) of x, w's children's colors.",
    "  //   Perform recolorings and rotations to fix violations.",
    "  //   (Several distinct cases for when x is left or right child)",
    "  // x.color = BLACK (at the end)",
    "}",
  ],
};

interface RedBlackTreeCodePanelProps {
  currentLine: number | null;
  selectedOperation: RBTOperationType; 
}

export function RedBlackTreeCodePanel({ currentLine, selectedOperation }: RedBlackTreeCodePanelProps) {
  const { toast } = useToast();
  
  const codeToDisplay = RBT_CODE_SNIPPETS[selectedOperation] || RBT_CODE_SNIPPETS.structure;
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
            {selectedOperation !== 'structure' && selectedOperation !== 'delete' && (
                <>
                    {RBT_CODE_SNIPPETS.structure.slice(0, 12).map((line,index)=>( // Show structure for context
                        <div key={`struct-line-${index}`} className="px-2 py-0.5 rounded text-muted-foreground/70 opacity-70 whitespace-pre-wrap">
                             <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                             {line}
                        </div>
                    ))}
                    <div className="my-2 border-b border-dashed border-muted-foreground/30"></div>
                </>
            )}
            {codeToDisplay.map((line, index) => (
              <div key={`${operationLabel}-line-${index}`}
                className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
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
