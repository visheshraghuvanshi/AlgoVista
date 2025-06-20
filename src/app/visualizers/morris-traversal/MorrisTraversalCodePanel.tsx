
"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MORRIS_INORDER_LINE_MAP } from './morris-traversal-logic';

export const MORRIS_TRAVERSAL_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "function morrisInorderTraversal(root) {",               // 1
    "  let current = root; const result = [];",             // 2
    "  while (current !== null) {",                         // 3
    "    if (current.left === null) {",                     // 4
    "      result.push(current.value); // Visit current",   // 5
    "      current = current.right; // Move right",         // 6
    "    } else {",
    "      // Find inorder predecessor of current",
    "      let predecessor = current.left;",                // 7
    "      while (predecessor.right !== null && predecessor.right !== current) {", // 8
    "        predecessor = predecessor.right;",             // 9
    "      }",
    "      if (predecessor.right === null) { // Make current the right child of predecessor (thread)", // 10
    "        predecessor.right = current;",                 // 11
    "        current = current.left; // Move to left child",// 12
    "      } else { // Revert the changes (remove thread)",
    "        predecessor.right = null;",                    // 13
    "        result.push(current.value); // Visit current", // 14
    "        current = current.right; // Move right",      // 15
    "      }",
    "    }",
    "  }",                                                   // 16
    "  return result;",                                      // 17
    "}",                                                     // 18
  ],
  Python: [
    "def morris_inorder_traversal(root):",
    "    current = root",
    "    result = []",
    "    while current:",
    "        if current.left is None:",
    "            result.append(current.val) # Visit",
    "            current = current.right",
    "        else:",
    "            predecessor = current.left",
    "            while predecessor.right and predecessor.right != current:",
    "                predecessor = predecessor.right",
    "            if predecessor.right is None: # Make thread",
    "                predecessor.right = current",
    "                current = current.left",
    "            else: # Revert thread",
    "                predecessor.right = None",
    "                result.append(current.val) # Visit",
    "                current = current.right",
    "    return result",
  ],
  Java: [
    "// class TreeNode { int val; TreeNode left, right; ... }",
    "public List<Integer> morrisInorderTraversal(TreeNode root) {",
    "    TreeNode current = root;",
    "    List<Integer> result = new ArrayList<>();",
    "    while (current != null) {",
    "        if (current.left == null) {",
    "            result.add(current.val); // Visit",
    "            current = current.right;",
    "        } else {",
    "            TreeNode predecessor = current.left;",
    "            while (predecessor.right != null && predecessor.right != current) {",
    "                predecessor = predecessor.right;",
    "            }",
    "            if (predecessor.right == null) { // Make thread",
    "                predecessor.right = current;",
    "                current = current.left;",
    "            } else { // Revert thread",
    "                predecessor.right = null;",
    "                result.add(current.val); // Visit",
    "                current = current.right;",
    "            }",
    "        }",
    "    }",
    "    return result;",
    "}",
  ],
  "C++": [
    "// struct TreeNode { int val; TreeNode *left, *right; ... };",
    "#include <vector>",
    "std::vector<int> morrisInorderTraversal(TreeNode* root) {",
    "    TreeNode* current = root;",
    "    std::vector<int> result;",
    "    while (current != nullptr) {",
    "        if (current->left == nullptr) {",
    "            result.push_back(current->val); // Visit",
    "            current = current->right;",
    "        } else {",
    "            TreeNode* predecessor = current->left;",
    "            while (predecessor->right != nullptr && predecessor->right != current) {",
    "                predecessor = predecessor->right;",
    "            }",
    "            if (predecessor->right == nullptr) { // Make thread",
    "                predecessor->right = current;",
    "                current = current->left;",
    "            } else { // Revert thread",
    "                predecessor->right = nullptr;",
    "                result.push_back(current->val); // Visit",
    "                current = current->right;",
    "            }",
    "        }",
    "    }",
    "    return result;",
    "}",
  ],
};

interface MorrisTraversalCodePanelProps {
  currentLine: number | null;
}

export function MorrisTraversalCodePanel({ currentLine }: MorrisTraversalCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(MORRIS_TRAVERSAL_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const codeToDisplay = MORRIS_TRAVERSAL_CODE_SNIPPETS[selectedLanguage] || [];

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} Morris Traversal Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Morris Inorder Traversal Code
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
            <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={codeToDisplay.length === 0}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
            {codeToDisplay.map((line, index) => (
              <div
                key={`morris-${selectedLanguage}-line-${index}`}
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

    