
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AVL_TREE_LINE_MAP } from './avl-tree-logic'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// More detailed conceptual JS snippets aligned with AVL_TREE_LINE_MAP
export const AVL_TREE_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "// --- AVL Tree Class & Node Definition ---",         // 1 (classDef)
    "class AVLNode { constructor(value) { /* ... */ } }", // Conceptual, nodeDef is for the creation part
    "class AVLTree {",                                    // 2 (constructor for class)
    "  constructor() { this.root = null; }",              // Line related to constructor, root init
    "",
    "  // --- Helper Functions ---",
    "  getHeight(node) {",                                // 10 (getHeightFunc)
    "    if (node === null) return -1; /* Or 0 for some impl. */", // 11 (getHeightBase)
    "    return node.height;",                            // 12 (getHeightReturn)
    "  }",
    "  updateHeight(node) {",                             // 13 (updateHeightFunc)
    "    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));", // 14 (updateHeightCalc)
    "    node.balanceFactor = this.getBalanceFactor(node);", // Part of updateHeight logic
    "  }",
    "  getBalanceFactor(node) {",                         // 15 (getBalanceFunc)
    "    if (node === null) return 0;",                   // 16 (getBalanceBase)
    "    return this.getHeight(node.left) - this.getHeight(node.right);", // 17 (getBalanceCalc)
    "  }",
    "",
    "  // --- Rotations ---",
    "  rotateLeft(x) {",                                  // 20 (rotateLeftFunc)
    "    let y = x.right;",                               // 21 (rotateLeftSetupY)
    "    x.right = y.left;",                              // 22 (rotateLeftXRightToYLeft)
    "    if (y.left !== null) y.left.parent = x;",        // 23 (rotateLeftYLeftParentUpdate)
    "    y.parent = x.parent;",                           // 24 (rotateLeftYParentToXParent)
    "    if (x.parent === null) this.root = y;",          // 25 (rotateLeftUpdateRootOrChild - part 1)
    "    else if (x === x.parent.left) x.parent.left = y;", // 25 (part 2)
    "    else x.parent.right = y;",                       // 25 (part 3)
    "    y.left = x;",                                    // 26 (rotateLeftYLeftToX)
    "    x.parent = y;",                                  // 27 (rotateLeftXParentToY)
    "    this.updateHeight(x); this.updateHeight(y);",    // 28 (rotateLeftUpdateHeights)
    "    return y;",                                      // 29 (rotateLeftReturnY)
    "  }",
    "  rotateRight(y) {",                                 // 30 (rotateRightFunc)
    "    let x = y.left;",                                // 31 (rotateRightSetupX)
    "    y.left = x.right;",                              // 32 (rotateRightYLeftToXRight)
    "    if (x.right !== null) x.right.parent = y;",      // 33 (rotateRightXRightParentUpdate)
    "    x.parent = y.parent;",                           // 34 (rotateRightXParentToYParent)
    "    if (y.parent === null) this.root = x;",          // 35 (rotateRightUpdateRootOrChild - part 1)
    "    else if (y === y.parent.right) y.parent.right = x;", // 35 (part 2)
    "    else y.parent.left = x;",                        // 35 (part 3)
    "    x.right = y;",                                   // 36 (rotateRightXRightToY)
    "    y.parent = x;",                                  // 37 (rotateRightYParentToX)
    "    this.updateHeight(y); this.updateHeight(x);",    // 38 (rotateRightUpdateHeights)
    "    return x;",                                      // 39 (rotateRightReturnX)
    "  }",
    "",
    "  // --- Insert Operation ---",
    "  insert(value) { /* Call recursive insert */", // 40 (insertFunc)
    "    this.root = this._insertRec(this.root, value, null);", // 41 (insertCallRec)
    "  }",
    "  _insertRec(node, value, parent) {",                // 42 (insertRecFunc)
    "    if (node === null) {",                          // 43 (insertRecBaseCase)
    "      // Create new node: value, height 0, bf 0, parent link", // 44 (insertRecNewNode)
    "      return new AVLNode(value); // Simplified for snippet, real node has more fields",
    "    }",
    "    if (value < node.value) {",                       // 45 (insertRecGoLeft)
    "      node.left = this._insertRec(node.left, value, node);", // 46 (insertRecAssignLeft)
    "    } else if (value > node.value) {",                // 47 (insertRecGoRight)
    "      node.right = this._insertRec(node.right, value, node);", // 48 (insertRecAssignRight)
    "    } else return node; /* Duplicate value - ignore */", // 49 (insertRecDuplicate)
    "",
    "    this.updateHeight(node);",                        // 50 (insertRecUpdateHeight)
    "    let balance = node.balanceFactor; // From updateHeight", // 51 (insertRecGetBalance)
    "",
    "    // Left Left Case",
    "    if (balance > 1 && value < node.left.value) {",   // 52 (insertRecCheckLL)
    "      return this.rotateRight(node);",                // 53 (insertRecActionLL)
    "    }",
    "    // Right Right Case",
    "    if (balance < -1 && value > node.right.value) {", // 54 (insertRecCheckRR)
    "      return this.rotateLeft(node);",                 // 55 (insertRecActionRR)
    "    }",
    "    // Left Right Case",
    "    if (balance > 1 && value > node.left.value) {",   // 56 (insertRecCheckLR_Part1)
    "      node.left = this.rotateLeft(node.left);",      // 57 (insertRecActionLR_RotateLeft)
    "      return this.rotateRight(node);",                // 58 (insertRecActionLR_RotateRight)
    "    }",
    "    // Right Left Case",
    "    if (balance < -1 && value < node.right.value) {", // 59 (insertRecCheckRL_Part1)
    "      node.right = this.rotateRight(node.right);",   // 60 (insertRecActionRL_RotateRight)
    "      return this.rotateLeft(node);",                 // 61 (insertRecActionRL_RotateLeft)
    "    }",
    "    return node;",                                     // 62 (insertRecReturnNode)
    "  }", // insertFuncEnd (conceptual end of insert) is 63
    "",
    "  // --- Search Operation ---",
    "  search(value) { /* Call recursive search */", // 70 (searchFunc)
    "     return this._searchRec(this.root, value);", // Part of searchFunc logic
    "  }",
    "  _searchRec(node, value) {",                         // 71 (searchRecFunc)
    "    if (node === null || node.value === value) return node;",// 72 & 73 (searchBaseNull, searchBaseFound)
    "    if (value < node.value) return this._searchRec(node.left, value);", // 74 (searchGoLeft)
    "    else return this._searchRec(node.right, value);", // 75 (searchGoRight)
    "  }",
    "",
    "  // --- Delete Operation (Conceptual BST delete + rebalance trigger) ---",
    "  delete(value) { /* Call recursive delete */", // 80 (deleteFunc)
    "    this.root = this._deleteRec(this.root, value);", // 81 (deleteCallRec)
    "  }", 
    "  _deleteRec(node, value) {",                          // 82 (deleteRecFunc)
    "    // ... Standard BST delete logic ...",
    "    if (node === null) return null;",                 // 83 (deleteRecBaseNull)
    "    // ... (recursive calls for left/right for search) ...",     // 84, 85
    "    // ... (handle 0, 1, 2 children - find successor etc.) ...", // 86-92
    "    // After BST deletion, if node is not null:",
    "    this.updateHeight(node);",                     // 93 (deleteRecAfterDeleteUpdateHeight)
    "    let balance = node.balanceFactor;",            // 94 (deleteRecAfterDeleteGetBalance)
    "    // ... Rebalancing logic similar to insert, but can propagate ...", // 95 (deleteRecRebalanceCheck)
    "    // ... This part is complex as it can require multiple rotations ...",
    "    // ... For visualization, often one rotation is shown or messaged ...",
    "    return node; // Potentially new subtree root",    // 96 (deleteRecReturnNode)
    "  }",
    "}",                                             // 86 (TREE_CLASS_END)
  ],
  Python: ["# AVL Tree Python snippets - Placeholder"], 
  Java: ["// AVL Tree Java snippets - Placeholder"],
  "C++": ["// AVL Tree C++ snippets - Placeholder"],
};

interface AVLTreeCodePanelProps {
  currentLine: number | null;
}

export function AVLTreeCodePanel({ currentLine }: AVLTreeCodePanelProps) {
  const { toast } = useToast();
  const languages = React.useMemo(() => Object.keys(AVL_TREE_CODE_SNIPPETS), []);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("JavaScript");

  const codeToDisplay = AVL_TREE_CODE_SNIPPETS[selectedLanguage] || AVL_TREE_CODE_SNIPPETS.JavaScript;

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} AVL Tree Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> AVL Tree Code
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
              <div key={`avl-${selectedLanguage}-line-${index}`}
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
