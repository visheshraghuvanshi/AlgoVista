
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AVL_TREE_LINE_MAP } from './avl-tree-logic'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export const AVL_TREE_CODE_SNIPPETS: Record<string, string[]> = {
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
    "  rotateRight(y) { // Right rotation on y",             // 20 Rotate Right Func
    "    let x = y.left; let T2 = x.right;",                 // 21 Rotate Right Setup
    "    x.right = y; y.left = T2; /* Update parents */",    // 22 Rotate Right Perform
    "    this.updateHeight(y); this.updateHeight(x);",       // 23 Rotate Right Update Heights
    "    return x; // New root of subtree",                  // 24 Rotate Right Return
    "  }",                                                   // 25
    "  //   y           x",                                  // 26
    "  //  / \\         / \\",                               // 27
    "  // x   T3  =>  T1  y",                                // 28
    "  // / \\             / \\",                           // 29
    "  //T1 T2           T2 T3",                             // 30
    "  rotateLeft(x) { // Left rotation on x",               // 31 Rotate Left Func
    "    let y = x.right; let T2 = y.left;",                 // 32 Rotate Left Setup
    "    y.left = x; x.right = T2; /* Update parents */",    // 33 Rotate Left Perform
    "    this.updateHeight(x); this.updateHeight(y);",       // 34 Rotate Left Update Heights
    "    return y; // New root of subtree",                  // 35 Rotate Left Return
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
    "    // Get balance factor and perform rotations",        // 52
    "    // (Code lines for balance factor and rotations from AVL_TREE_LINE_MAP used here)", // 53
    "    let balance = this.getBalanceFactor(node);",          // 54 Insert Get Balance
    "",                                                        // 55
    "    // Left Left Case",                                   // 56
    "    if (balance > 1 && value < node.left.value) return this.rotateRight(node);", // 57 LL Case & Action
    "    // Right Right Case",                                 // 58
    "    if (balance < -1 && value > node.right.value) return this.rotateLeft(node);", // 59 RR Case & Action
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
    "  // delete(value) { /* ... AVL delete logic ... */ }", // 72
    "}",                                                       // 73
  ],
  Python: [
    "class AVLNode:",
    "    def __init__(self, value):",
    "        self.value = value; self.height = 1",
    "        self.left = None; self.right = None",
    "class AVLTree:",
    "    def __init__(self): self.root = None",
    "    def get_height(self, node): return node.height if node else 0",
    "    def get_balance_factor(self, node): return self.get_height(node.left) - self.get_height(node.right) if node else 0",
    "    def update_height(self, node): node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))",
    "    def rotate_right(self, y):",
    "        x = y.left; T2 = x.right",
    "        x.right = y; y.left = T2",
    "        self.update_height(y); self.update_height(x)",
    "        return x",
    "    def rotate_left(self, x):",
    "        y = x.right; T2 = y.left",
    "        y.left = x; x.right = T2",
    "        self.update_height(x); self.update_height(y)",
    "        return y",
    "    def insert(self, value): self.root = self._insert_rec(self.root, value)",
    "    def _insert_rec(self, node, value):",
    "        if not node: return AVLNode(value)",
    "        if value < node.value: node.left = self._insert_rec(node.left, value)",
    "        elif value > node.value: node.right = self._insert_rec(node.right, value)",
    "        else: return node",
    "        self.update_height(node)",
    "        balance = self.get_balance_factor(node)",
    "        if balance > 1 and value < node.left.value: return self.rotate_right(node)",
    "        if balance < -1 and value > node.right.value: return self.rotate_left(node)",
    "        if balance > 1 and value > node.left.value:",
    "            node.left = self.rotate_left(node.left)",
    "            return self.rotate_right(node)",
    "        if balance < -1 and value < node.right.value:",
    "            node.right = self.rotate_right(node.right)",
    "            return self.rotate_left(node)",
    "        return node",
  ],
  Java: [
    "class AVLNode { int value, height; AVLNode left, right; AVLNode(int v){value=v;height=1;}}",
    "class AVLTree { AVLNode root; int getHeight(AVLNode n){return n==null?0:n.height;}",
    "  int getBalance(AVLNode n){return n==null?0:getHeight(n.left)-getHeight(n.right);}",
    "  void updateHeight(AVLNode n){n.height=1+Math.max(getHeight(n.left),getHeight(n.right));}",
    "  AVLNode rotateRight(AVLNode y){AVLNode x=y.left;AVLNode T2=x.right;x.right=y;y.left=T2;updateHeight(y);updateHeight(x);return x;}",
    "  AVLNode rotateLeft(AVLNode x){AVLNode y=x.right;AVLNode T2=y.left;y.left=x;x.right=T2;updateHeight(x);updateHeight(y);return y;}",
    "  void insert(int val){root = insertRec(root,val);}",
    "  AVLNode insertRec(AVLNode node, int value){",
    "    if(node==null)return new AVLNode(value);",
    "    if(value<node.value)node.left=insertRec(node.left,value);",
    "    else if(value>node.value)node.right=insertRec(node.right,value);",
    "    else return node;",
    "    updateHeight(node); int balance=getBalance(node);",
    "    if(balance>1&&value<node.left.value)return rotateRight(node);",
    "    if(balance<-1&&value>node.right.value)return rotateLeft(node);",
    "    if(balance>1&&value>node.left.value){node.left=rotateLeft(node.left);return rotateRight(node);}",
    "    if(balance<-1&&value<node.right.value){node.right=rotateRight(node.right);return rotateLeft(node);}",
    "    return node;",
    "  }",
    "}",
  ],
  "C++": [
    "struct AVLNode { int value, height; AVLNode *left, *right; AVLNode(int v):value(v),height(1),left(nullptr),right(nullptr){} };",
    "class AVLTree { public: AVLNode *root=nullptr;",
    "  int getHeight(AVLNode* n){return n?n->height:0;}",
    "  int getBalance(AVLNode* n){return n?getHeight(n->left)-getHeight(n->right):0;}",
    "  void updateHeight(AVLNode* n){n->height=1+std::max(getHeight(n->left),getHeight(n->right));}",
    "  AVLNode* rotateRight(AVLNode* y){AVLNode*x=y->left;AVLNode*T2=x->right;x->right=y;y->left=T2;updateHeight(y);updateHeight(x);return x;}",
    "  AVLNode* rotateLeft(AVLNode* x){AVLNode*y=x->right;AVLNode*T2=y->left;y->left=x;x->right=T2;updateHeight(x);updateHeight(y);return y;}",
    "  void insert(int val){root = insertRec(root,val);}",
    "  AVLNode* insertRec(AVLNode* node, int value){",
    "    if(!node)return new AVLNode(value);",
    "    if(value<node->value)node->left=insertRec(node->left,value);",
    "    else if(value>node->value)node->right=insertRec(node->right,value);",
    "    else return node;",
    "    updateHeight(node); int balance=getBalance(node);",
    "    if(balance>1&&value<node->left->value)return rotateRight(node);",
    "    if(balance<-1&&value>node->right->value)return rotateLeft(node);",
    "    if(balance>1&&value>node->left->value){node->left=rotateLeft(node->left);return rotateRight(node);}",
    "    if(balance<-1&&value<node->right->value){node->right=rotateRight(node->right);return rotateLeft(node);}",
    "    return node;",
    "  }",
    "};",
  ]
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
                <TabsList className="grid w-full grid-cols-4 h-8 text-xs p-0.5"> {/* Adjust grid-cols based on num languages */}
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
            {codeToDisplay.map((line, index) => (
              <div key={`avl-${selectedLanguage}-line-${index}`}
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
