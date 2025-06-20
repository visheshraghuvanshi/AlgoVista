"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { RBT_LINE_MAP } from './red-black-tree-logic'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RBTOperationType } from './types';

const RBT_CODE_SNIPPETS: Record<RBTOperationType, Record<string,string[]>> = {
  structure: {
    JavaScript:[
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
    Python:[
      "RED, BLACK = True, False",
      "class RBTNode:",
      "    def __init__(self, value, color=RED, parent=None, left=None, right=None):",
      "        self.value = value; self.color = color",
      "        self.parent = parent; self.left = left; self.right = right",
      "class RedBlackTree:",
      "    def __init__(self):",
      "        self.NIL = RBTNode(None, BLACK)",
      "        self.NIL.parent = self.NIL; self.NIL.left = self.NIL; self.NIL.right = self.NIL",
      "        self.root = self.NIL",
    ],
    Java:[
      "enum Color { RED, BLACK }",
      "class RBTNode {",
      "    int value; Color color; RBTNode parent, left, right;",
      "    RBTNode(int val) { this.value = val; this.color = Color.RED; /* Set NILs */ }",
      "}",
      "class RedBlackTree {",
      "    RBTNode NIL = new RBTNode(0); // Special NIL node, value irrelevant",
      "    RBTNode root = NIL;",
      "    public RedBlackTree() { NIL.color = Color.BLACK; NIL.parent = NIL; NIL.left = NIL; NIL.right = NIL; }",
      "}",
    ],
    "C++":[
      "enum Color { RED, BLACK };",
      "struct RBTNode {",
      "    int value; Color color; RBTNode *parent, *left, *right;",
      "    RBTNode(int val, Color c=RED) : value(val), color(c), parent(nullptr), left(nullptr), right(nullptr) {}",
      "};",
      "class RedBlackTree {",
      "public:",
      "    RBTNode* NIL;",
      "    RBTNode* root;",
      "    RedBlackTree() { NIL = new RBTNode(0, BLACK); NIL->parent=NIL; NIL->left=NIL; NIL->right=NIL; root = NIL; }",
      "};",
    ]
  },
  insert: {
    JavaScript:[
      "// Insert Operation", // 1
      "insert(value) {",
      "  let node = new RBTNode(value, RED, this.NIL, this.NIL, this.NIL);", // 6
      "  let y = this.NIL; let x = this.root;",
      "  while (x !== this.NIL) {", // 2
      "    y = x;",
      "    if (node.value < x.value) x = x.left;", // 3
      "    else x = x.right;", // 4
      "  }",
      "  node.parent = y;", // 5
      "  if (y === this.NIL) this.root = node;",
      "  else if (node.value < y.value) y.left = node;",
      "  else y.right = node;",
      "  this.insertFixup(node);", // 7
      "}", // 8
      "insertFixup(z) {", // 7 (call is line, func start maps here)
      "  while (z.parent.color === RED) {", // 9
      "    if (z.parent === z.parent.parent.left) {", // 10
      "      let y = z.parent.parent.right; /* Uncle */", // 11
      "      if (y.color === RED) { /* Case 1 */", // 12
      "        z.parent.color = BLACK;", // 13
      "        y.color = BLACK;", // 14
      "        z.parent.parent.color = RED;", // 15
      "        z = z.parent.parent;", // 16
      "      } else {",
      "        if (z === z.parent.right) { /* Case 2 */", // 17
      "          z = z.parent;", // 18
      "          this.rotateLeft(z);", // 19
      "        }",
      "        /* Case 3 */", // 20
      "        z.parent.color = BLACK;", // 21
      "        z.parent.parent.color = RED;", // 22
      "        this.rotateRight(z.parent.parent);", // 23
      "      }",
      "    } else { /* Symmetric (parent is right child) */", // 24
      "      let y = z.parent.parent.left; /* Uncle */",
      "      if (y.color === RED) { /* Case 1 (Symmetric) */ z.parent.color = BLACK; y.color = BLACK; z.parent.parent.color = RED; z = z.parent.parent; }",
      "      else { if (z === z.parent.left) { /* Case 2 (Symmetric) */ z = z.parent; this.rotateRight(z); }",
      "             /* Case 3 (Symmetric) */ z.parent.color = BLACK; z.parent.parent.color = RED; this.rotateLeft(z.parent.parent);",
      "      }",
      "    }",
      "  }", // 30
      "  this.root.color = BLACK;", // 29
      "}", // 31
      "// rotateLeft(x) { /* ... */ }", // 32-40 (Conceptual mapping)
      "// rotateRight(y) { /* ... */ }", // 41-49 (Conceptual mapping)
    ],
    Python:[
      "    def insert(self, value):",
      "        node = RBTNode(value, RED, self.NIL, self.NIL, self.NIL)",
      "        y, x = self.NIL, self.root",
      "        while x != self.NIL:",
      "            y = x",
      "            if node.value < x.value: x = x.left",
      "            else: x = x.right",
      "        node.parent = y",
      "        if y == self.NIL: self.root = node",
      "        elif node.value < y.value: y.left = node",
      "        else: y.right = node",
      "        self.insert_fixup(node)",
      "    def insert_fixup(self, z):",
      "        while z.parent.color == RED:",
      "            if z.parent == z.parent.parent.left:",
      "                y = z.parent.parent.right # uncle",
      "                if y.color == RED: # Case 1",
      "                    z.parent.color = BLACK; y.color = BLACK",
      "                    z.parent.parent.color = RED; z = z.parent.parent",
      "                else:",
      "                    if z == z.parent.right: # Case 2",
      "                        z = z.parent; self.rotate_left(z)",
      "                    # Case 3",
      "                    z.parent.color = BLACK; z.parent.parent.color = RED",
      "                    self.rotate_right(z.parent.parent)",
      "            else: # Symmetric",
      "                y = z.parent.parent.left # uncle",
      "                if y.color == RED: # Case 1",
      "                    z.parent.color = BLACK; y.color = BLACK",
      "                    z.parent.parent.color = RED; z = z.parent.parent",
      "                else:",
      "                    if z == z.parent.left: # Case 2",
      "                        z = z.parent; self.rotate_right(z)",
      "                    # Case 3",
      "                    z.parent.color = BLACK; z.parent.parent.color = RED",
      "                    self.rotate_left(z.parent.parent)",
      "        self.root.color = BLACK",
    ],
    Java:[
      "    public void insert(int value) {",
      "        RBTNode node = new RBTNode(value);",
      "        node.parent = NIL; node.left = NIL; node.right = NIL; node.color = Color.RED;",
      "        RBTNode y = NIL; RBTNode x = this.root;",
      "        while (x != NIL) {",
      "            y = x;",
      "            if (node.value < x.value) x = x.left;",
      "            else x = x.right;",
      "        }",
      "        node.parent = y;",
      "        if (y == NIL) this.root = node;",
      "        else if (node.value < y.value) y.left = node;",
      "        else y.right = node;",
      "        insertFixup(node);",
      "    }",
      "    private void insertFixup(RBTNode z) { /* ... similar logic ... */ }",
    ],
    "C++":[
      "    void insert(int value) {",
      "        RBTNode* node = new RBTNode(value);",
      "        node->parent = NIL; node->left = NIL; node->right = NIL; node->color = RED;",
      "        RBTNode* y = NIL; RBTNode* x = this->root;",
      "        while (x != NIL) {",
      "            y = x;",
      "            if (node->value < x->value) x = x->left;",
      "            else x = x->right;",
      "        }",
      "        node->parent = y;",
      "        if (y == NIL) this->root = node;",
      "        else if (node->value < y->value) y->left = node;",
      "        else y->right = node;",
      "        insertFixup(node);",
      "    }",
      "    void insertFixup(RBTNode* z) { /* ... similar logic ... */ }",
    ]
  },
  search: {
    JavaScript:[
      "search(value) {", // 50
      "  let current = this.root;",
      "  while (current !== this.NIL) {", // 51
      "    if (value === current.value) return current;", // 52, 53
      "    if (value < current.value) current = current.left;", // 54
      "    else current = current.right;", // 55
      "  }",
      "  return this.NIL; // Not found", // 56
      "}", // 57
    ],
    Python: [
      "    def search(self, value):",
      "        current = self.root",
      "        while current != self.NIL:",
      "            if value == current.value: return current",
      "            if value < current.value: current = current.left",
      "            else: current = current.right",
      "        return self.NIL",
    ],
    Java: [
      "    public RBTNode search(int value) {",
      "        RBTNode current = root;",
      "        while (current != NIL) {",
      "            if (value == current.value) return current;",
      "            if (value < current.value) current = current.left;",
      "            else current = current.right;",
      "        }",
      "        return NIL;",
      "    }",
    ],
    "C++":[
      "    RBTNode* search(int value) {",
      "        RBTNode* current = root;",
      "        while (current != NIL) {",
      "            if (value == current->value) return current;",
      "            if (value < current->value) current = current->left;",
      "            else current = current->right;",
      "        }",
      "        return NIL;",
      "    }",
    ]
  },
  delete: { // Conceptual placeholder lines
    JavaScript: [
        "// Delete Operation (Highly Conceptual - Full RBT delete is complex)", // 58
        "deleteNode(value) {",
        "  let z = this.search(value); // Find node (like line 59)",
        "  if (z === this.NIL) return; // Node not found",
        "  // ... (complex BST deletion logic with successor/predecessor) ...", // Conceptual for 60
        "  // ... (identify y - node to splice out, and x - child that replaces y) ...",
        "  // ... (perform transplant operation) ...", // Conceptual for 61
        "  // if (yOriginalColor === BLACK) { this.deleteFixup(x); }", // Conceptual for 62
        "}",
        "deleteFixup(x) {", // Conceptual for 64
        "  // ... (Multiple cases with rotations and recoloring) ...", // Conceptual for 65-70
        "  // x.color = BLACK; // Conceptual for 71",
        "}", // Conceptual for 72
    ],
    Python: ["# Delete and DeleteFixup are complex. Conceptual outline:", 
             "# 1. Standard BST delete logic (handling 0, 1, 2 children, finding successor).",
             "# 2. Determine 'y' (node actually removed/moved) and 'x' (child taking y's place).",
             "# 3. If y.color was BLACK, call delete_fixup(x) to restore R-B properties.",
             "# DeleteFixup involves 4 main cases (and their symmetric versions) using rotations and recoloring."
            ],
    Java: ["// Full Red-Black Tree deletion is intricate.",
           "// It involves standard BST deletion, identifying the node 'x' that replaces the physically removed node 'y',",
           "// and if 'y' was BLACK, calling a deleteFixup(x) method.",
           "// deleteFixup has several cases to restore R-B properties via recoloring and rotations."
          ],
    "C++": ["// RBT Deletion: Locate node. Standard BST deletion logic.",
            "// If the deleted/moved node was black, call deleteFixup.",
            "// DeleteFixup logic is extensive, handling multiple cases to rebalance."
           ]
  },
  build: { // Conceptual, as build is just repeated inserts
    JavaScript: ["// Build RBT: Perform insert() for each value in the input array."],
    Python: ["# Build RBT: Perform insert() for each value."],
    Java: ["// Build RBT: Perform insert() for each value."],
    "C++": ["// Build RBT: Perform insert() for each value."],
  },
};


interface RedBlackTreeCodePanelProps {
  currentLine: number | null;
  selectedOperation: RBTOperationType; 
}

export function RedBlackTreeCodePanel({ currentLine, selectedOperation }: RedBlackTreeCodePanelProps) {
  const { toast } = useToast();
  
  const codeSnippetsForSelectedOp = RBT_CODE_SNIPPETS[selectedOperation] || RBT_CODE_SNIPPETS.structure;
  const languages = React.useMemo(() => Object.keys(codeSnippetsForSelectedOp), [codeSnippetsForSelectedOp]);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0] || "JavaScript"; // Fallback for safety
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(initialLanguage);

  React.useEffect(() => {
    const currentOpLanguages = Object.keys(RBT_CODE_SNIPPETS[selectedOperation] || RBT_CODE_SNIPPETS.structure);
    const defaultLangForOp = currentOpLanguages.includes("JavaScript") ? "JavaScript" : currentOpLanguages[0] || "JavaScript";
    if (!currentOpLanguages.includes(selectedLanguage)) {
        setSelectedLanguage(defaultLangForOp);
    }
  }, [selectedOperation, selectedLanguage]);


  const codeToDisplay = codeSnippetsForSelectedOp[selectedLanguage] || [];
  const structureCode = selectedOperation !== 'structure' ? (RBT_CODE_SNIPPETS.structure[selectedLanguage] || []) : [];
  const operationLabel = selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1);

  const handleCopyCode = () => {
    let codeString = "";
     if (selectedOperation !== 'structure' && structureCode.length > 0) {
        // Simple concatenation, assuming structure code is a complete class/setup
        // And operation code is a method to be conceptually part of that class
        let tempStructure = structureCode.join('\n');
        const opCodeIndented = codeToDisplay.map(line => `  ${line}`).join('\n'); // Indent operation

        if (selectedLanguage === "JavaScript" || selectedLanguage === "Java" || selectedLanguage === "C++") {
            // Try to insert before the last '}' of the class structure
            const lastBraceIndex = tempStructure.lastIndexOf('}');
            if (lastBraceIndex !== -1) {
                tempStructure = tempStructure.substring(0, lastBraceIndex) + 
                                `\n  // --- ${operationLabel} Operation ---\n` +
                                opCodeIndented + 
                                '\n' + tempStructure.substring(lastBraceIndex);
            } else { // Fallback: just append
                tempStructure += `\n  // --- ${operationLabel} Operation ---\n${opCodeIndented}\n}`;
            }
        } else if (selectedLanguage === "Python") {
            tempStructure += `\n    # --- ${operationLabel} Operation ---\n${opCodeIndented}`;
        }
        codeString = tempStructure;
    } else {
        codeString = codeToDisplay.join('\n');
    }
    
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} ${operationLabel} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {operationLabel}
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
          <pre className="font-code text-sm p-4">
            {selectedOperation !== 'structure' && structureCode.length > 0 && (
                <>
                    {structureCode.map((line,index)=>(
                        <div key={`struct-${selectedLanguage}-${index}`} className="px-2 py-0.5 rounded text-muted-foreground/70 opacity-70 whitespace-pre-wrap">
                             <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                             {line}
                        </div>
                    ))}
                    <div className="my-2 border-b border-dashed border-muted-foreground/30"></div>
                </>
            )}
            {codeToDisplay.map((line, index) => (
              <div key={`${operationLabel}-${selectedLanguage}-line-${index}`}
                className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                  {/* Adjust line number display based on whether structure code is shown */}
                  {index +1 + (selectedOperation !== 'structure' && structureCode.length > 0 ? structureCode.length +1 : 0)}
                </span>
                {line}
              </div>
            ))}
            {codeToDisplay.length === 0 && selectedOperation !== 'structure' && <p className="text-muted-foreground">Conceptual code for {operationLabel}. Details omitted for brevity or vary by implementation.</p>}
            {codeToDisplay.length === 0 && selectedOperation === 'structure' && <p className="text-muted-foreground">Select an operation to view code.</p>}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
