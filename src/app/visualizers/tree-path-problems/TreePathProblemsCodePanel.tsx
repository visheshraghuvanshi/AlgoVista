
"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TREE_PATH_SUM_LINE_MAP } from './tree-path-problems-logic';

// Conceptual Path Sum (Root to Leaf) code
export const TREE_PATH_SUM_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "function hasPathSum(root, targetSum) {",                         // 1
    "  if (!root) return false;",                                     // 2
    "  if (!root.left && !root.right) { // Leaf node",                // 3
    "    return targetSum === root.value;",                           // 4
    "  }",                                                            // 5 (Conceptual end of leaf check)
    "  const remainingSum = targetSum - root.value;",                 // (Conceptual, part of recursion prep)
    "  return hasPathSum(root.left, remainingSum) ||",                // 6
    "         hasPathSum(root.right, remainingSum);",                 // 7
    "}",                                                              // 8
  ],
  Python: [
    "def hasPathSum(root, targetSum):",
    "    if not root: return False",
    "    if not root.left and not root.right: # Leaf node",
    "        return targetSum == root.val",
    "    remaining_sum = targetSum - root.val",
    "    return hasPathSum(root.left, remaining_sum) or \\",
    "           hasPathSum(root.right, remaining_sum)",
  ],
  Java: [
    "// class TreeNode { int val; TreeNode left, right; ... }",
    "public boolean hasPathSum(TreeNode root, int targetSum) {",
    "    if (root == null) return false;",
    "    if (root.left == null && root.right == null) { // Leaf node",
    "        return targetSum == root.val;",
    "    }",
    "    int remainingSum = targetSum - root.val;",
    "    return hasPathSum(root.left, remainingSum) ||",
    "           hasPathSum(root.right, remainingSum);",
    "}",
  ],
  "C++": [
    "// struct TreeNode { int val; TreeNode *left, *right; ... };",
    "bool hasPathSum(TreeNode* root, int targetSum) {",
    "    if (!root) return false;",
    "    if (!root->left && !root->right) { // Leaf node",
    "        return targetSum == root->val;",
    "    }",
    "    int remainingSum = targetSum - root->val;",
    "    return hasPathSum(root->left, remainingSum) ||",
    "           hasPathSum(root->right, remainingSum);",
    "}",
  ],
};

interface TreePathProblemsCodePanelProps {
  currentLine: number | null;
}

export function TreePathProblemsCodePanel({ currentLine }: TreePathProblemsCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(TREE_PATH_SUM_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const codeToDisplay = TREE_PATH_SUM_CODE_SNIPPETS[selectedLanguage] || [];

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} Path Sum Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Path Sum Code
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={codeToDisplay.length === 0}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="flex flex-col flex-grow overflow-hidden">
          <TabsList className="mx-4 mb-1 self-start shrink-0">
            {languages.map((lang) => (
              <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-1 h-auto">
                {lang}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
            <pre className="font-code text-sm p-4">
              {codeToDisplay.map((line, index) => (
                <div
                  key={`tpp-${selectedLanguage}-line-${index}`}
                  className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                  {line}
                </div>
              ))}
            </pre>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
