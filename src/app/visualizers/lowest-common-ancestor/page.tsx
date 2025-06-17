
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, TreeAlgorithmStep, BinaryTreeNodeVisual } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2, LocateFixed, Binary, PlayCircle } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BinaryTreeVisualizationPanel } from '@/app/visualizers/binary-tree-traversal/BinaryTreeVisualizationPanel';
import { parseTreeInput, buildTreeNodesAndEdges } from '@/app/visualizers/binary-tree-traversal/binary-tree-traversal-logic';

interface TreeNodeForLCA {
    id: string;
    value: number | string;
    leftId: string | null;
    rightId: string | null;
}

const LCA_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "// LCA in a Binary Tree (Recursive)",
    "function lowestCommonAncestor(root, p, q) {",
    "  if (!root || root.value === p.value || root.value === q.value) return root;",
    "  const leftLCA = lowestCommonAncestor(root.left, p, q);",
    "  const rightLCA = lowestCommonAncestor(root.right, p, q);",
    "  if (leftLCA && rightLCA) return root;",
    "  return leftLCA ? leftLCA : rightLCA;",
    "}",
    "",
    "// LCA in a Binary Search Tree (BST - Iterative)",
    "function lowestCommonAncestorBST(root, p, q) {",
    "  while (root) {",
    "    if (p.value < root.value && q.value < root.value) root = root.left;",
    "    else if (p.value > root.value && q.value > root.value) root = root.right;",
    "    else return root; // Found split point or one is ancestor",
    "  }",
    "  return null;",
    "}",
  ],
   Python: [
    "# LCA in a Binary Tree (Recursive)",
    "def lowest_common_ancestor(root, p, q):",
    "    if not root or root.val == p.val or root.val == q.val: return root",
    "    left_lca = lowest_common_ancestor(root.left, p, q)",
    "    right_lca = lowest_common_ancestor(root.right, p, q)",
    "    if left_lca and right_lca: return root",
    "    return left_lca if left_lca else right_lca",
    "",
    "# LCA in a BST (Iterative)",
    "def lowest_common_ancestor_bst(root, p, q):",
    "    while root:",
    "        if p.val < root.val and q.val < root.val: root = root.left",
    "        elif p.val > root.val and q.val > root.val: root = root.right",
    "        else: return root",
    "    return None",
  ],
  Java: [
    "// LCA in a Binary Tree (Recursive)",
    "class TreeNode { int val; TreeNode left, right; /*...*/ }",
    "public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {",
    "    if (root == null || root.val == p.val || root.val == q.val) return root;",
    "    TreeNode leftLCA = lowestCommonAncestor(root.left, p, q);",
    "    TreeNode rightLCA = lowestCommonAncestor(root.right, p, q);",
    "    if (leftLCA != null && rightLCA != null) return root;",
    "    return (leftLCA != null) ? leftLCA : rightLCA;",
    "}",
    "",
    "// LCA in a BST (Iterative)",
    "public TreeNode lowestCommonAncestorBST(TreeNode root, TreeNode p, TreeNode q) {",
    "    while (root != null) {",
    "        if (p.val < root.val && q.val < root.val) root = root.left;",
    "        else if (p.val > root.val && q.val > root.val) root = root.right;",
    "        else return root;",
    "    }",
    "    return null;",
    "}"
  ],
  "C++": [
    "// LCA in a Binary Tree (Recursive)",
    "struct TreeNode { int val; TreeNode *left, *right; /*...*/ };",
    "TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {",
    "    if (!root || root->val == p->val || root->val == q->val) return root;",
    "    TreeNode* leftLCA = lowestCommonAncestor(root->left, p, q);",
    "    TreeNode* rightLCA = lowestCommonAncestor(root->right, p, q);",
    "    if (leftLCA && rightLCA) return root;",
    "    return leftLCA ? leftLCA : rightLCA;",
    "}",
    "",
    "// LCA in a BST (Iterative)",
    "TreeNode* lowestCommonAncestorBST(TreeNode* root, TreeNode* p, TreeNode* q) {",
    "    while (root) {",
    "        if (p->val < root->val && q->val < root->val) root = root->left;",
    "        else if (p->val > root->val && q->val > root->val) root = root->right;",
    "        else return root;",
    "    }",
    "    return nullptr;",
    "}",
  ],
};


export default function LCAVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [treeInputValue, setTreeInputValue] = useState("5,3,8,1,4,7,9,null,2"); 
  const [nodePValue, setNodePValue] = useState("1");
  const [nodeQValue, setNodeQValue] = useState("4");
  
  const [treeNodes, setTreeNodes] = useState<BinaryTreeNodeVisual[]>([]);
  const [treeEdges, setTreeEdges] = useState<TreeAlgorithmStep['edges']>([]);
  const [lcaResult, setLcaResult] = useState<string | number | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]); 

  useEffect(() => {
    setIsClient(true);
    if (algorithmMetadata) {
       toast({
            title: "Conceptual Overview & Code",
            description: `Interactive LCA pathfinding animation is complex and under construction. This page shows results based on tree input and provides conceptual code.`,
            variant: "default",
            duration: 6000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for Lowest Common Ancestor not found.`, variant: "destructive" });
    }
  }, [toast]);

  const buildTreeVisualization = useCallback(() => {
    try {
      const parsedValues = parseTreeInput(treeInputValue);
      if (!parsedValues) {
        setTreeNodes([]); setTreeEdges([]);
        toast({ title: "Invalid Tree Input", description: "Could not parse tree structure.", variant: "destructive" });
        return null;
      }
      const { nodes, edges, rootId } = buildTreeNodesAndEdges(parsedValues);
      setTreeNodes(nodes);
      setTreeEdges(edges);
      // Create a simplified map for LCA logic (value, leftId, rightId)
      const nodesMapForLca = new Map(nodes.map(n => [n.id, {id: n.id, value: n.value!, leftId: n.leftId || null, rightId: n.rightId || null}]));
      return { nodesMap: nodesMapForLca, rootIdFromBuild: rootId };
    } catch (error: any) {
      toast({ title: "Error Building Tree", description: error.message, variant: "destructive" });
      setTreeNodes([]); setTreeEdges([]);
      return null;
    }
  }, [treeInputValue, toast]);

  useEffect(() => {
    buildTreeVisualization();
    setLcaResult(null); 
    setHighlightedNodeIds([]);
  }, [buildTreeVisualization]);

  const findPath = (rootId: string | null, targetValue: string | number, currentPath: string[], nodesMap: Map<string, TreeNodeForLCA>): string[] | null => {
    if (!rootId || rootId.startsWith('null-')) return null;
    const node = nodesMap.get(rootId);
    if (!node) return null;

    currentPath.push(node.id);
    // Use == for loose comparison as targetValue might be string "1" and node.value number 1
    if (node.value == targetValue) return [...currentPath];

    if (node.leftId) {
      const leftResult = findPath(node.leftId, targetValue, currentPath, nodesMap);
      if (leftResult) return leftResult;
    }
    if (node.rightId) {
      const rightResult = findPath(node.rightId, targetValue, currentPath, nodesMap);
      if (rightResult) return rightResult;
    }
    currentPath.pop();
    return null;
  };

  const handleFindLCA = () => {
    setLcaResult(null); setHighlightedNodeIds([]);
    const treeData = buildTreeVisualization(); 
    if (!treeData || treeNodes.length === 0 || !treeData.rootIdFromBuild) {
      toast({ title: "No Tree", description: "Please ensure a valid tree structure is visualized.", variant: "destructive" });
      return;
    }
    const { nodesMap, rootIdFromBuild } = treeData;

    const pVal = isNaN(Number(nodePValue)) ? nodePValue.trim() : Number(nodePValue);
    const qVal = isNaN(Number(nodeQValue)) ? nodeQValue.trim() : Number(nodeQValue);
    
    if (nodePValue.trim() === "" || nodeQValue.trim() === "") {
        toast({title: "Input Missing", description: "Please enter values for both Node P and Node Q.", variant: "destructive"});
        return;
    }

    const pathP = findPath(rootIdFromBuild, pVal, [], nodesMap);
    const pathQ = findPath(rootIdFromBuild, qVal, [], nodesMap);

    const pNodeExists = treeNodes.some(n => n.value == pVal);
    const qNodeExists = treeNodes.some(n => n.value == qVal);

    if (!pNodeExists || !qNodeExists) {
      let missingNodes = [];
      if(!pNodeExists) missingNodes.push(`P ('${pVal}')`);
      if(!qNodeExists) missingNodes.push(`Q ('${qVal}')`);
      toast({ title: "Node(s) Not Found", description: `${missingNodes.join(' and ')} not found in the tree.`, variant: "destructive" });
      return;
    }
    if (!pathP || !pathQ) { 
      toast({ title: "Path Not Found", description: `Could not find path to one or both nodes (P: ${pVal}, Q: ${qVal}). Ensure they exist in the tree.`, variant: "destructive" });
      return;
    }
    
    let lcaNodeId: string | null = null;
    let i = 0;
    while (i < pathP.length && i < pathQ.length && pathP[i] === pathQ[i]) {
      lcaNodeId = pathP[i];
      i++;
    }
    
    if (lcaNodeId) {
      const lcaNodeData = nodesMap.get(lcaNodeId);
      setLcaResult(lcaNodeData?.value ?? "Error finding value");
      
      const pNodeVisual = treeNodes.find(n => n.value == pVal);
      const qNodeVisual = treeNodes.find(n => n.value == qVal);
      
      const highlights = [lcaNodeId];
      if(pNodeVisual) highlights.push(pNodeVisual.id);
      if(qNodeVisual) highlights.push(qNodeVisual.id);
      setHighlightedNodeIds(Array.from(new Set(highlights))); // Ensure unique IDs
      toast({ title: "LCA Found", description: `LCA of P='${pVal}' and Q='${qVal}' is node '${lcaNodeData?.value}'. Nodes P, Q, and LCA are highlighted.`, duration: 6000 });
    } else {
      toast({ title: "LCA Not Found", description: "Could not determine LCA (e.g., root is null or other issue).", variant: "destructive" });
    }
  };

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>;}
  if (!algoDetails) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle /></main><Footer /></div>;}

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <LocateFixed className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg">
                <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Setup & Find LCA</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="lcaTreeInput">Tree Input (comma-sep, level-order, 'null' for empty)</Label>
                        <Input id="lcaTreeInput" value={treeInputValue} onChange={e => setTreeInputValue(e.target.value)} placeholder="e.g., 5,3,8,1,4,null,9" />
                         <Button onClick={buildTreeVisualization} className="mt-2 text-xs py-1 h-auto" variant="outline">Refresh Tree Visualization</Button>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nodePInput">Node P Value</Label>
                            <Input id="nodePInput" value={nodePValue} onChange={e => setNodePValue(e.target.value)} placeholder="e.g., 1" />
                        </div>
                        <div>
                            <Label htmlFor="nodeQInput">Node Q Value</Label>
                            <Input id="nodeQInput" value={nodeQValue} onChange={e => setNodeQValue(e.target.value)} placeholder="e.g., 4" />
                        </div>
                    </div>
                    <Button onClick={handleFindLCA} className="w-full"><LocateFixed className="mr-2 h-4 w-4"/>Find Lowest Common Ancestor</Button>
                    {lcaResult !== null && (
                        <p className="text-center font-semibold text-lg">LCA Result: <span className="text-green-500">{lcaResult}</span></p>
                    )}
                </CardContent>
            </Card>
            <div className="min-h-[300px] md:min-h-[400px] md:max-h-[500px]">
              <BinaryTreeVisualizationPanel 
                nodes={treeNodes.map(n => ({...n, color: highlightedNodeIds.includes(n.id) ? "hsl(var(--accent))" : n.color}))} 
                edges={treeEdges} 
                traversalPath={[]} 
              />
            </div>
        </div>
        
        <div className="text-center my-10 p-6 border rounded-lg shadow-lg bg-card">
            <Construction className="mx-auto h-12 w-12 text-primary/80 dark:text-accent/80 mb-4" />
            <h2 className="font-headline text-xl font-bold tracking-tight mb-2">
                Step-by-Step Animation Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                The detailed, step-by-step interactive visualizer for LCA pathfinding and comparisons is under development.
            </p>
        </div>

        <Card className="shadow-lg rounded-lg h-auto flex flex-col mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                    <Code2 className="mr-2 h-5 w-5" /> Conceptual Code Snippets
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
               <Tabs defaultValue="JavaScript" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-2 px-2">
                  {Object.keys(LCA_CODE_SNIPPETS).map(lang => (
                    <TabsTrigger key={lang} value={lang} className="text-xs md:text-sm">{lang}</TabsTrigger>
                  ))}
                </TabsList>
                {Object.entries(LCA_CODE_SNIPPETS).map(([lang, snippet]) => (
                  <TabsContent key={lang} value={lang}>
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[400px] md:max-h-[500px]">
                      <pre className="font-code text-sm p-4">
                          {snippet.map((line, index) => (
                          <div key={`${lang}-line-${index}`} className="px-2 py-0.5 rounded text-foreground whitespace-pre-wrap">
                              <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                              {index + 1}
                              </span>
                              {line}
                          </div>
                          ))}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}


    