
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AVL_TREE_LINE_MAP } from './avl-tree-logic'; // Assuming line map is here

export const AVL_TREE_CODE_SNIPPETS = {
  JavaScript: [
    "class AVLNode {",                                         // 1 Node Class
    "  constructor(value) {",                                // 2 Node Constructor
    "    this.value = value; this.height = 1;",              // 3 Node Props (value, height)
    "    this.left = null; this.right = null;",             // 4 Node Props (left, right)
    "  }",                                                   // 5
    "}",                                                       // 6
    "class AVLTree {",                                         // 7 Tree Class
    "  constructor() { this.root = null; }",                 // 8 Tree Constructor
    "",                                                        // 9
    "  getHeight(node) {",                                   // 10 Get Height Func
    "    return node ? node.height : 0;",                    // 11 Get Height Return
    "  }",                                                   // 12
    "  getBalanceFactor(node) {",                            // 13 Get Balance Func
    "    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;", // 14 Get Balance Return
    "  }",                                                   // 15
    "  updateHeight(node) {",                                // 16 Update Height Func
    "    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));", // 17 Update Height Calc
    "  }",                                                   // 18
    "",                                                        // 19
    "  rotateRight(y) {",                                    // 20 Rotate Right Func
    "    let x = y.left; let T2 = x.right;",                 // 21 Rotate Right Setup
    "    x.right = y; y.left = T2; /* Update parents */",    // 22 Rotate Right Perform
    "    this.updateHeight(y); this.updateHeight(x);",       // 23 Rotate Right Update Heights
    "    return x;",                                         // 24 Rotate Right Return
    "  }",                                                   // 25
    "  //   y           x",                                  // 26
    "  //  / \\         / \\",                               // 27
    "  // x   T3  =>  T1  y",                                // 28
    "  // / \\             / \\",                           // 29
    "  //T1 T2           T2 T3",                             // 30
    "  rotateLeft(x) {",                                     // 31 Rotate Left Func
    "    let y = x.right; let T2 = y.left;",                 // 32 Rotate Left Setup
    "    y.left = x; x.right = T2; /* Update parents */",    // 33 Rotate Left Perform
    "    this.updateHeight(x); this.updateHeight(y);",       // 34 Rotate Left Update Heights
    "    return y;",                                         // 35 Rotate Left Return
    "  }",                                                   // 36
    "  //   x           y",                                  // 37
    "  //  / \\         / \\",                               // 38
    "  // T1  y   =>  x   T3",                                // 39
    "  //    / \\     / \\",                                 // 40
    "  //   T2 T3   T1 T2",                                  // 41
    "  insert(value) { this.root = this._insertRec(this.root, value); }", // 42 Insert Func Main
    "  _insertRec(node, value) {",                           // 43 Insert Rec Func
    "    if (!node) return new AVLNode(value);",             // 44 Insert Base Case Null
    "    if (value < node.value) {",                         // 45 Insert Go Left
    "      node.left = this._insertRec(node.left, value);", // 46 Insert Assign Left
    "    } else if (value > node.value) {",                  // 47 Insert Go Right
    "      node.right = this._insertRec(node.right, value);",// 48 Insert Assign Right
    "    } else { return node; } // Duplicates not allowed",  // 49 Insert Duplicate Return
    "",                                                        // 50
    "    this.updateHeight(node);",                           // 51 Insert Update Height
    "    // ... get balance factor and perform rotations ...",// 52
    "    // ... (code lines for balance factor and rotations from map) ...", // 53
    "    let balance = this.getBalanceFactor(node);",          // 54 Insert Get Balance
    "",                                                        // 55
    "    // Left Left Case",                                   // 56
    "    if (balance > 1 && value < node.left.value) return this.rotateRight(node);", // 57 LL Case
    "    // Right Right Case",                                 // 58
    "    if (balance < -1 && value > node.right.value) return this.rotateLeft(node);", // 59 RR Case
    "    // Left Right Case",                                  // 60
    "    if (balance > 1 && value > node.left.value) {",      // 61 LR Case Condition
    "      node.left = this.rotateLeft(node.left);",          // 62 LR Case Action1
    "      return this.rotateRight(node);",                   // 63 LR Case Action2
    "    }",                                                   // 64
    "    // Right Left Case",                                  // 65
    "    if (balance < -1 && value < node.right.value) {",    // 66 RL Case Condition
    "      node.right = this.rotateRight(node.right);",        // 67 RL Case Action1
    "      return this.rotateLeft(node);",                    // 68 RL Case Action2
    "    }",                                                   // 69
    "    return node;",                                       // 70 Insert Return Node
    "  }",                                                   // 71
    "  // delete(value) { /* ... complex AVL delete logic ... */ }", // 72
    "}",                                                       // 73
  ],
};

interface AVLTreeCodePanelProps {
  currentLine: number | null;
}

export function AVLTreeCodePanel({ currentLine }: AVLTreeCodePanelProps) {
  const { toast } = useToast();
  const codeToDisplay = AVL_TREE_CODE_SNIPPETS.JavaScript; // Only JS for now

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: "AVL Tree Code Copied!" }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> AVL Tree Code (JavaScript)
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {codeToDisplay.map((line, index) => (
              <div key={`avl-line-${index}`}
                className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
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
