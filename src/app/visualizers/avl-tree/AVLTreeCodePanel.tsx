
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
    "// --- AVL Helper Functions ---",
    "getHeight(node) { return node ? node.height : 0; }", // 1, 2
    "getBalanceFactor(node) { /* ... height(left) - height(right) ... */ }", // 3, 4
    "updateHeight(node) { node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right)); }", // 5, 6
    "// --- Rotations ---",
    "rotateRight(y) { /* Detailed: x=y.left; T2=x.right; x.right=y; y.left=T2; update heights(y,x); return x; */ }", // 7-12
    "rotateLeft(x) { /* Detailed: y=x.right; T2=y.left; y.left=x; x.right=T2; update heights(x,y); return y; */ }",   // 13-18
    "// --- Insertion ---",
    "insert(value) { this.root = this._insertRec(this.root, value, null); }", // 19
    "_insertRec(node, value, parent) {", // 20
    "  if (!node) return new AVLNode(value, parent); /* Set parent */", // 21
    "  if (value < node.value) node.left = this._insertRec(node.left, value, node);", // 22, 23
    "  else if (value > node.value) node.right = this._insertRec(node.right, value, node);", // 24, 25
    "  else return node; /* Duplicate */", // 26
    "  this.updateHeight(node);", // 27
    "  let balance = this.getBalanceFactor(node);", // 28
    "  if (balance > 1 && value < node.left.value) return this.rotateRight(node); // LL Case", // 29, 30
    "  if (balance < -1 && value > node.right.value) return this.rotateLeft(node); // RR Case", // 31, 32
    "  if (balance > 1 && value > node.left.value) { /* LR Case */", // 33
    "    node.left = this.rotateLeft(node.left); return this.rotateRight(node);", // 34, 35
    "  }",
    "  if (balance < -1 && value < node.right.value) { /* RL Case */", // 36
    "    node.right = this.rotateRight(node.right); return this.rotateLeft(node);", // 37, 38
    "  }",
    "  return node;", // 39
    "}", // 40
    "// --- Deletion (Conceptual - highlights BST part & first rebalance check) ---",
    "delete(value) { this.root = this._deleteRec(this.root, value); }", // 41
    "_deleteRec(node, value) {", // 42
    "  if (!node) return null; /* Not found */", // 43
    "  if (value < node.value) node.left = this._deleteRec(node.left, value);", // 44
    "  else if (value > node.value) node.right = this._deleteRec(node.right, value);", // 45
    "  else { /* Node to delete found */", // 46
    "    if (!node.left || !node.right) node = (node.left ? node.left : node.right); /* 0/1 child */", // 47
    "    else { /* 2 children: get successor, copy, delete successor */", // 48
    "      let succ = this._minValueNode(node.right); node.value = succ.value;", // 49, 50
    "      node.right = this._deleteRec(node.right, succ.value);", // 51
    "    }",
    "  }",
    "  if (!node) return null; /* Tree/subtree empty */", // 52
    "  this.updateHeight(node);", // 53
    "  let balance = this.getBalanceFactor(node);", // 54
    "  // Simplified: Check balance & identify type. Actual rotations for delete can be complex.",
    "  if (balance > 1 || balance < -1) { /* Rotation Needed, type based on child balance */ }", // 55
    "  return node; /* Potentially after rebalancing */", // 56
    "}", // 57
    "// --- Search ---",
    "search(value) { return this._searchRec(this.root, value); }", // 58
    "_searchRec(node, value) {", // 59
    "  if (!node || node.value === value) return node;", // 60
    "  if (value < node.value) return this._searchRec(node.left, value);", // 61
    "  else return this._searchRec(node.right, value);", // 62
    "}",
  ],
  Python: ["# AVL Tree conceptual Python snippets..."],
  Java: ["// AVL Tree conceptual Java snippets..."],
  "C++": ["// AVL Tree conceptual C++ snippets..."],
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
