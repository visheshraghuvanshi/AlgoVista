
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AVL_TREE_LINE_MAP } from './avl-tree-logic'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// Conceptual AVL Tree Code Snippets - Expanded for clarity
export const AVL_TREE_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "// AVL Node Class",                             // 1 NODE_CLASS_START
    "class AVLNode {",
    "  constructor(value) {",                       // 2 NODE_CONSTRUCTOR_START
    "    this.value = value;",
    "    this.height = 1;",                           // 3 NODE_HEIGHT_INIT
    "    this.left = null; // Represents NIL",
    "    this.right = null; // Represents NIL",
    "  }",                                           // 4 NODE_CONSTRUCTOR_END
    "}",                                             // 5 NODE_CLASS_END
    "",
    "// AVL Tree Class",                             // 6 TREE_CLASS_START
    "class AVLTree {",
    "  constructor() { this.root = null; }",         // 7 TREE_CONSTRUCTOR
    "",
    "  getHeight(node) {",                           // 8 GET_HEIGHT_FUNC
    "    return node ? node.height : 0;",            // 9 GET_HEIGHT_RETURN
    "  }",
    "  getBalanceFactor(node) {",                    // 10 GET_BALANCE_FUNC
    "    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;", // 11 GET_BALANCE_CALC
    "  }",
    "  updateHeight(node) {",                        // 12 UPDATE_HEIGHT_FUNC
    "    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));", // 13 UPDATE_HEIGHT_CALC
    "  }",
    "",
    "  rotateRight(y) { /* ... */ }",                // 14 ROTATE_RIGHT_STUB (Detailed below)
    "  rotateLeft(x) { /* ... */ }",                 // 15 ROTATE_LEFT_STUB (Detailed below)
    "",
    "  // INSERTION",                                // 16 INSERT_SECTION
    "  insert(value) { this.root = this._insertRec(this.root, value, null); }", // 17 INSERT_MAIN_CALL
    "  _insertRec(node, value, parent) {",           // 18 INSERT_REC_FUNC
    "    // 1. Standard BST Insertion",
    "    if (!node) return new AVLNode(value);",     // 19 INSERT_BASE_CASE_NULL
    "    if (value < node.value) {",                 // 20 INSERT_GO_LEFT
    "      node.left = this._insertRec(node.left, value, node);", // 21 INSERT_RECURSE_LEFT
    "    } else if (value > node.value) {",          // 22 INSERT_GO_RIGHT
    "      node.right = this._insertRec(node.right, value, node);",// 23 INSERT_RECURSE_RIGHT
    "    } else { return node; } // No duplicates",   // 24 INSERT_DUPLICATE
    "",
    "    // 2. Update height of current node",
    "    this.updateHeight(node);",                   // 25 INSERT_UPDATE_HEIGHT
    "",
    "    // 3. Get balance factor",
    "    let balance = this.getBalanceFactor(node);", // 26 INSERT_GET_BALANCE
    "",
    "    // 4. If unbalanced, perform rotations",
    "    // Left-Left Case (LL)",                    // 27 LL_CASE_COMMENT
    "    if (balance > 1 && value < node.left.value) {", // 28 LL_CASE_CHECK
    "      return this.rotateRight(node);",          // 29 LL_CASE_ACTION
    "    }",
    "    // Right-Right Case (RR)",                  // 30 RR_CASE_COMMENT
    "    if (balance < -1 && value > node.right.value) {",// 31 RR_CASE_CHECK
    "      return this.rotateLeft(node);",           // 32 RR_CASE_ACTION
    "    }",
    "    // Left-Right Case (LR)",                   // 33 LR_CASE_COMMENT
    "    if (balance > 1 && value > node.left.value) {", // 34 LR_CASE_CHECK
    "      node.left = this.rotateLeft(node.left);", // 35 LR_CASE_ACTION1
    "      return this.rotateRight(node);",          // 36 LR_CASE_ACTION2
    "    }",
    "    // Right-Left Case (RL)",                   // 37 RL_CASE_COMMENT
    "    if (balance < -1 && value < node.right.value) {",// 38 RL_CASE_CHECK
    "      node.right = this.rotateRight(node.right);",// 39 RL_CASE_ACTION1
    "      return this.rotateLeft(node);",           // 40 RL_CASE_ACTION2
    "    }",
    "    return node;",                               // 41 INSERT_RETURN_NODE
    "  }",                                           // 42 INSERT_REC_END
    "",
    "  // DELETION (Conceptual - Full fixup logic is extensive)", // 43 DELETE_SECTION
    "  delete(value) { this.root = this._deleteRec(this.root, value); }", // 44 DELETE_MAIN_CALL
    "  _deleteRec(node, value) {",                   // 45 DELETE_REC_FUNC
    "    if (!node) return null;",                  // 46 DELETE_BASE_CASE_NULL
    "    if (value < node.value) node.left = this._deleteRec(node.left, value);", // 47-48
    "    else if (value > node.value) node.right = this._deleteRec(node.right, value);", // 49-50
    "    else { /* Node to delete found */",          // 51 DELETE_NODE_FOUND
    "      if (!node.left || !node.right) { /* 0 or 1 child */", // 52
    "        let temp = node.left ? node.left : node.right;", // 53
    "        if (!temp) node = null; else node = temp;", // 54
    "      } else { /* 2 children */",                // 55
    "        let temp = this._minValueNode(node.right);", // 56
    "        node.value = temp.value;",              // 57
    "        node.right = this._deleteRec(node.right, temp.value);", // 58
    "      }",
    "    }",
    "    if (!node) return null; // If tree became empty", // 59
    "    this.updateHeight(node);",                   // 60 DELETE_UPDATE_HEIGHT
    "    let balance = this.getBalanceFactor(node);",  // 61 DELETE_GET_BALANCE
    "    // Balancing after deletion (more complex cases than insert)",
    "    // LL or L0 Case",                            // 62 DEL_LL_L0_CASE_COMMENT
    "    if (balance > 1 && this.getBalanceFactor(node.left) >= 0) return this.rotateRight(node);", // 63
    "    // LR Case",                                  // 64 DEL_LR_CASE_COMMENT
    "    if (balance > 1 && this.getBalanceFactor(node.left) < 0) { node.left = this.rotateLeft(node.left); return this.rotateRight(node); }", // 65
    "    // RR or R0 Case",                            // 66 DEL_RR_R0_CASE_COMMENT
    "    if (balance < -1 && this.getBalanceFactor(node.right) <= 0) return this.rotateLeft(node);", // 67
    "    // RL Case",                                  // 68 DEL_RL_CASE_COMMENT
    "    if (balance < -1 && this.getBalanceFactor(node.right) > 0) { node.right = this.rotateRight(node.right); return this.rotateLeft(node); }", // 69
    "    return node;",                               // 70 DELETE_RETURN_NODE
    "  }",                                           // 71 DELETE_REC_END
    "  _minValueNode(node) { /* Find min value in subtree (for deletion) */", // 72
    "    let current = node;",
    "    while (current.left !== null) current = current.left;",
    "    return current;",
    "  }",
    "",
    "  // ROTATIONS (Detailed)",                     // 73 ROTATIONS_SECTION
    "  rotateRight(y) {",                            // 74 ROTATE_RIGHT_FUNC_START
    "    let x = y.left; let T2 = x.right;",         // 75 ROTATE_RIGHT_SETUP
    "    x.right = y; y.left = T2;",                 // 76 ROTATE_RIGHT_POINTERS
    "    // Update parents if they exist and are tracked",
    "    this.updateHeight(y); this.updateHeight(x);",// 77 ROTATE_RIGHT_UPDATE_HEIGHTS
    "    return x;",                                 // 78 ROTATE_RIGHT_RETURN_NEW_ROOT
    "  }",                                           // 79 ROTATE_RIGHT_FUNC_END
    "  rotateLeft(x) {",                             // 80 ROTATE_LEFT_FUNC_START
    "    let y = x.right; let T2 = y.left;",          // 81 ROTATE_LEFT_SETUP
    "    y.left = x; x.right = T2;",                 // 82 ROTATE_LEFT_POINTERS
    "    // Update parents if they exist and are tracked",
    "    this.updateHeight(x); this.updateHeight(y);",// 83 ROTATE_LEFT_UPDATE_HEIGHTS
    "    return y;",                                 // 84 ROTATE_LEFT_RETURN_NEW_ROOT
    "  }",                                           // 85 ROTATE_LEFT_FUNC_END
    "}",                                             // 86 TREE_CLASS_END
  ],
  Python: [
    "# Python AVL Tree code snippet (conceptual)",
    "# Detailed implementation similar to JavaScript",
    "# with Python syntax for classes, methods, etc.",
    "class AVLNode:",
    "    # ... (Node definition) ...",
    "class AVLTree:",
    "    # ... (Tree methods: insert, delete, rotations) ..."
  ],
  Java: [
    "// Java AVL Tree code snippet (conceptual)",
    "// class AVLNode { ... }",
    "// class AVLTree { ... }",
    "// Detailed implementation using Java syntax."
  ],
  "C++": [
    "// C++ AVL Tree code snippet (conceptual)",
    "// struct AVLNode { ... };",
    "// class AVLTree { ... };",
    "// Detailed implementation using C++ syntax."
  ],
};

interface AVLTreeCodePanelProps {
  currentLine: number | null;
}

export function AVLTreeCodePanel({ currentLine }: AVLTreeCodePanelProps) {
  const { toast } = useToast();
  const languages = React.useMemo(() => Object.keys(AVL_TREE_CODE_SNIPPETS), []);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(languages[0] || "JavaScript");

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

