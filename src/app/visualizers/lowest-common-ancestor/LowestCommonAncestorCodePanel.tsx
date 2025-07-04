
"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LCA_LINE_MAP } from './lca-logic'; 

// Conceptual LCA code (Path finding variant for general binary tree)
export const LCA_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "// LCA in a Binary Tree (Path-finding approach)",                        // 1: findLCAFuncStart (Conceptual main function entry)
    "function findPath(root, targetValue, path) {",                         // 8: findPathFuncStart
    "  if (!root) return false;",                                           // 9: pathBaseCaseNull
    "  path.push(root); // Store node object or value",                     // 10: pathPushCurrent
    "  if (root.value === targetValue) return true;",                       // 11: pathBaseCaseFound
    "  if (root.left && findPath(root.left, targetValue, path)) return true;", // 12: pathTryLeft (recursive call implicit in 13)
    "  if (root.right && findPath(root.right, targetValue, path)) return true;",// 14: pathTryRight (recursive call implicit in 15)
    "  path.pop(); return false;",                                          // 16: pathPopBacktrack, 17: pathReturnFalseBranch
    "}",
    "function lowestCommonAncestor(root, pValue, qValue) {",
    "  const pathP = []; const pathQ = [];",
    "  const pFound = findPath(root, pValue, pathP);",                      // 2: findPathToPStart
    "  const qFound = findPath(root, qValue, pathQ);",                      // 3: findPathToQStart
    "  if (!pFound || !qFound) return null; // Node(s) not found",         // 7: nodeNotFound (conceptual)
    "",
    "  let lcaNode = null; let i = 0;",
    "  // Compare paths to find the last common node",                     // 4: comparePathsStart
    "  while (i < pathP.length && i < pathQ.length && pathP[i] === pathQ[i]) {",
    "    lcaNode = pathP[i]; // Update LCA candidate",                      // 5: commonNodeInPath
    "    i++;",
    "  }",
    "  return lcaNode; // This is the LCA",                                 // 6: lcaFoundReturn
    "}",
  ],
  Python: [
    "# LCA in a Binary Tree (Path-finding approach)",
    "class TreeNode: # Conceptual Node class",
    "    def __init__(self, value):",
    "        self.val = value",
    "        self.left = None",
    "        self.right = None",
    "",
    "def find_path(root, target_value, path):",
    "    if not root: return False",
    "    path.append(root) # Store node object or value",
    "    if root.val == target_value: return True",
    "    if (root.left and find_path(root.left, target_value, path)) or \\",
    "       (root.right and find_path(root.right, target_value, path)):",
    "        return True",
    "    path.pop()",
    "    return False",
    "",
    "def lowest_common_ancestor(root, p_node_val, q_node_val):",
    "    path_p, path_q = [], []",
    "    # Assume p_node and q_node are values to find, not node objects",
    "    p_found = find_path(root, p_node_val, path_p)",
    "    q_found = find_path(root, q_node_val, path_q)",
    "    if not p_found or not q_found: return None",
    "",
    "    lca_node = None",
    "    i = 0",
    "    # Compare paths by node objects if path stores them, or by value if values",
    "    while i < len(path_p) and i < len(path_q) and path_p[i].val == path_q[i].val:",
    "        lca_node = path_p[i]",
    "        i += 1",
    "    return lca_node",
  ],
  Java: [
    "import java.util.*;",
    "// class TreeNode { int val; TreeNode left, right; TreeNode(int x) { val = x; } }",
    "class Solution {",
    "    private boolean findPath(TreeNode root, int targetValue, List<TreeNode> path) {",
    "        if (root == null) return false;",
    "        path.add(root);",
    "        if (root.val == targetValue) return true;",
    "        if (root.left != null && findPath(root.left, targetValue, path)) return true;",
    "        if (root.right != null && findPath(root.right, targetValue, path)) return true;",
    "        path.remove(path.size() - 1); // Backtrack",
    "        return false;",
    "    }",
    "    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {",
    "        List<TreeNode> pathP = new ArrayList<>();",
    "        List<TreeNode> pathQ = new ArrayList<>();",
    "        // Assuming p and q are nodes whose values we need to find paths for",
    "        if (!findPath(root, p.val, pathP) || !findPath(root, q.val, pathQ)) return null;",
    "",
    "        TreeNode lca = null; int i = 0;",
    "        while (i < pathP.size() && i < pathQ.size() && pathP.get(i) == pathQ.get(i)) {",
    "            lca = pathP.get(i); i++;",
    "        }",
    "        return lca;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm>",
    "// struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };",
    "bool findPath(TreeNode* root, int targetValue, std::vector<TreeNode*>& path) {",
    "    if (!root) return false;",
    "    path.push_back(root);",
    "    if (root->val == targetValue) return true;",
    "    if (root->left && findPath(root->left, targetValue, path)) return true;",
    "    if (root->right && findPath(root->right, targetValue, path)) return true;",
    "    path.pop_back(); // Backtrack",
    "    return false;",
    "}",
    "",
    "TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {",
    "    std::vector<TreeNode*> pathP, pathQ;",
    "    // Assuming p and q are nodes whose values we need to find paths for",
    "    if (!findPath(root, p->val, pathP) || !findPath(root, q->val, pathQ)) return nullptr;",
    "",
    "    TreeNode* lca = nullptr; int i = 0;",
    "    while (i < pathP.size() && i < pathQ.size() && pathP[i] == pathQ[i]) {",
    "        lca = pathP[i]; i++;",
    "    }",
    "    return lca;",
    "}",
  ],
};

interface LowestCommonAncestorCodePanelProps {
  currentLine: number | null;
}

export function LowestCommonAncestorCodePanel({ currentLine }: LowestCommonAncestorCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(LCA_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const codeToDisplay = LCA_CODE_SNIPPETS[selectedLanguage] || [];

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} LCA Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> LCA Code (Path-finding)
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
                key={`lca-${selectedLanguage}-line-${index}`}
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

    