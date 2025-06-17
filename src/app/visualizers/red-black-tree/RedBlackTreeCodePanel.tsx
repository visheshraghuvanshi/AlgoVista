
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { RBT_LINE_MAP } from './red-black-tree-logic'; 

export type RBTOperationType = 'insert' | 'search' | 'delete' | 'structure';

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
      "// rotateLeft(x) { ... }", // 32-40
      "// rotateRight(y) { ... }", // 41-49
    ],
    Python:[
      "def insert(self, value):",
      "    node = RBTNode(value, RED, self.NIL, self.NIL, self.NIL)",
      "    y, x = self.NIL, self.root",
      "    while x != self.NIL:",
      "        y = x",
      "        if node.value < x.value: x = x.left",
      "        else: x = x.right",
      "    node.parent = y",
      "    if y == self.NIL: self.root = node",
      "    elif node.value < y.value: y.left = node",
      "    else: y.right = node",
      "    self.insert_fixup(node)",
      "def insert_fixup(self, z):",
      "    while z.parent.color == RED:",
      "        if z.parent == z.parent.parent.left:",
      "            y = z.parent.parent.right # uncle",
      "            if y.color == RED: # Case 1",
      "                z.parent.color = BLACK; y.color = BLACK",
      "                z.parent.parent.color = RED; z = z.parent.parent",
      "            else:",
      "                if z == z.parent.right: # Case 2",
      "                    z = z.parent; self.rotate_left(z)",
      "                # Case 3",
      "                z.parent.color = BLACK; z.parent.parent.color = RED",
      "                self.rotate_right(z.parent.parent)",
      "        else: # Symmetric",
      "            y = z.parent.parent.left # uncle",
      "            if y.color == RED: # Case 1",
      "                z.parent.color = BLACK; y.color = BLACK",
      "                z.parent.parent.color = RED; z = z.parent.parent",
      "            else:",
      "                if z == z.parent.left: # Case 2",
      "                    z = z.parent; self.rotate_right(z)",
      "                # Case 3",
      "                z.parent.color = BLACK; z.parent.parent.color = RED",
      "                self.rotate_left(z.parent.parent)",
      "    self.root.color = BLACK",
    ],
    Java:[
      "public void insert(int value) {",
      "    RBTNode node = new RBTNode(value);",
      "    node.parent = NIL; node.left = NIL; node.right = NIL; node.color = Color.RED;",
      "    RBTNode y = NIL; RBTNode x = this.root;",
      "    while (x != NIL) {",
      "        y = x;",
      "        if (node.value < x.value) x = x.left;",
      "        else x = x.right;",
      "    }",
      "    node.parent = y;",
      "    if (y == NIL) this.root = node;",
      "    else if (node.value < y.value) y.left = node;",
      "    else y.right = node;",
      "    insertFixup(node);",
      "}",
      "private void insertFixup(RBTNode z) { /* ... similar logic ... */ }",
    ],
    "C++":[
      "void insert(int value) {",
      "    RBTNode* node = new RBTNode(value);",
      "    node->parent = NIL; node->left = NIL; node->right = NIL; node->color = RED;",
      "    RBTNode* y = NIL; RBTNode* x = this->root;",
      "    while (x != NIL) {",
      "        y = x;",
      "        if (node->value < x->value) x = x->left;",
      "        else x = x->right;",
      "    }",
      "    node->parent = y;",
      "    if (y == NIL) this->root = node;",
      "    else if (node->value < y->value) y->left = node;",
      "    else y->right = node;",
      "    insertFixup(node);",
      "}",
      "void insertFixup(RBTNode* z) { /* ... similar logic ... */ }",
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
      "def search(self, value):",
      "    current = self.root",
      "    while current != self.NIL:",
      "        if value == current.value: return current",
      "        if value < current.value: current = current.left",
      "        else: current = current.right",
      "    return self.NIL",
    ],
    Java: [
      "public RBTNode search(int value) {",
      "    RBTNode current = root;",
      "    while (current != NIL) {",
      "        if (value == current.value) return current;",
      "        if (value < current.value) current = current.left;",
      "        else current = current.right;",
      "    }",
      "    return NIL;",
      "}",
    ],
    "C++":[
      "RBTNode* search(int value) {",
      "    RBTNode* current = root;",
      "    while (current != NIL) {",
      "        if (value == current->value) return current;",
      "        if (value < current->value) current = current->left;",
      "        else current = current->right;",
      "    }",
      "    return NIL;",
      "}",
    ]
  },
  delete: {
    JavaScript: [
        "// Delete Operation (Conceptual)", // 58
        "deleteNode(zValue) {",
        "  // ... Find node z with zValue (BST search) ... ", // 59
        "  let y = z; let yOriginalColor = y.color;",
        "  let x; // Node that moves into y's original position",
        "  if (z.left === this.NIL) {",
        "    x = z.right; this.transplant(z, z.right);", // 60 (part 1), 61
        "  } else if (z.right === this.NIL) {",
        "    x = z.left; this.transplant(z, z.left);", // 60 (part 2), 61
        "  } else {",
        "    y = this.treeMinimum(z.right); // Successor",
        "    yOriginalColor = y.color;",
        "    x = y.right;",
        "    if (y.parent === z) { x.parent = y; } // If x is NIL, parent needs update",
        "    else { this.transplant(y, y.right); y.right = z.right; y.right.parent = y; }",
        "    this.transplant(z, y);",
        "    y.left = z.left; y.left.parent = y; y.color = z.color;",
        "  }", // 60 (part 3)
        "  if (yOriginalColor === BLACK) { this.deleteFixup(x); }", // 62
        "}", //63
        "deleteFixup(x) {", // 64
        "  while (x !== this.root && x.color === BLACK) {", // 65
        "    if (x === x.parent.left) { /* x is left child */",
        "      let w = x.parent.right; /* sibling */",
        "      if (w.color === RED) { /* Case 1 */", // 66
        "        w.color = BLACK; x.parent.color = RED; this.rotateLeft(x.parent); w = x.parent.right;",
        "      }",
        "      if (w.left.color === BLACK && w.right.color === BLACK) { /* Case 2 */", // 67
        "        w.color = RED; x = x.parent;",
        "      } else {",
        "        if (w.right.color === BLACK) { /* Case 3 */", // 68
        "          w.left.color = BLACK; w.color = RED; this.rotateRight(w); w = x.parent.right;",
        "        }",
        "        /* Case 4 */", // 69
        "        w.color = x.parent.color; x.parent.color = BLACK; w.right.color = BLACK; this.rotateLeft(x.parent); x = this.root;",
        "      }",
        "    } else { /* x is right child - symmetric cases */", // 70
        "       // ... similar logic, rotations swapped ...",
        "    }",
        "  }",
        "  x.color = BLACK;", // 71
        "}", // 72
    ],
    Python: ["# Delete and DeleteFixup are complex. Conceptual outline:" , "# 1. BST delete logic to find node and its replacement.", "# 2. If removed node (or its replacement if original was internal with 2 children) was BLACK,", "#    call delete_fixup on the child that took its place to restore R-B properties.", "# DeleteFixup involves multiple cases with recoloring and rotations."],
    Java: ["// Delete and DeleteFixup similar to JavaScript/C++, handling NIL nodes carefully.", "// Refer to CLRS for detailed pseudocode of deleteFixup cases."],
    "C++": ["// Delete involves finding the node, handling 0, 1, or 2 children cases,", "// potentially finding successor, transplanting nodes, and then calling deleteFixup.", "// deleteFixup has 4 main cases (and their symmetric counterparts) for balancing."]
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
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(initialLanguage);

  React.useEffect(() => {
    // If selectedOperation changes, reset selectedLanguage to default for that op
    const currentOpLanguages = Object.keys(RBT_CODE_SNIPPETS[selectedOperation] || RBT_CODE_SNIPPETS.structure);
    const defaultLangForOp = currentOpLanguages.includes("JavaScript") ? "JavaScript" : currentOpLanguages[0];
    setSelectedLanguage(defaultLangForOp);
  }, [selectedOperation]);


  const codeToDisplay = codeSnippetsForSelectedOp[selectedLanguage] || [];
  const structureCode = selectedOperation !== 'structure' ? (RBT_CODE_SNIPPETS.structure[selectedLanguage] || []) : [];
  const operationLabel = selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1);

  const handleCopyCode = () => {
    let codeString = "";
     if (selectedOperation !== 'structure' && structureCode.length > 0) {
        codeString = structureCode.join('\n') + '\n\n  // Operation: ' + operationLabel + '\n' + codeToDisplay.map(line => `  ${line}`).join('\n');
        if(selectedLanguage === 'JavaScript' || selectedLanguage === 'Java' || selectedLanguage === "C++") {
             // Add closing brace for the class if it's not already in structureCode's last line
             if(!structureCode[structureCode.length-1].trim().endsWith("}")) {
                 codeString += "\n}";
             } else if (codeToDisplay.length > 0 && !codeToDisplay[codeToDisplay.length-1].trim().startsWith("}")) {
                 // If op code itself needs a closing brace for a method, this is too simple.
                 // Assume structure is complete class, op is methods within.
             }
        }
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
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="p-1 text-xs border rounded bg-transparent">
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
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
                        <div key={`struct-${selectedLanguage}-line-${index}`} className="px-2 py-0.5 rounded text-muted-foreground/70 opacity-70 whitespace-pre-wrap">
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
                  {/* Line numbers map to RBT_LINE_MAP if currentLine is from there, else relative to snippet */}
                  {currentLine && Object.values(RBT_LINE_MAP).includes(currentLine) ? currentLine : index +1 + (selectedOperation !== 'structure' && structureCode.length > 0 ? structureCode.length +1 : 0)}
                </span>
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

