
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata'; // Import local metadata
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BinaryTreeControlsPanel } from '@/app/visualizers/binary-tree-traversal/BinaryTreeControlsPanel';
import { TRAVERSAL_TYPES, type TraversalType } from '@/app/visualizers/binary-tree-traversal/binary-tree-traversal-logic';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const LCA_CODE_SNIPPETS = {
  JavaScript: [
    "// Assuming a standard TreeNode class { value, left, right }",
    "",
    "// LCA in a Binary Tree (Recursive)",
    "function lowestCommonAncestor(root, p, q) {",
    "  // Base cases:",
    "  if (!root || root === p || root === q) {",
    "    return root;",
    "  }",
    "",
    "  // Look for keys in left and right subtrees",
    "  const leftLCA = lowestCommonAncestor(root.left, p, q);",
    "  const rightLCA = lowestCommonAncestor(root.right, p, q);",
    "",
    "  // If both leftLCA and rightLCA return a node, then root is the LCA",
    "  if (leftLCA && rightLCA) {",
    "    return root;",
    "  }",
    "",
    "  // Otherwise check if left subtree or right subtree contains LCA",
    "  return leftLCA ? leftLCA : rightLCA;",
    "}",
    "",
    "// LCA in a Binary Search Tree (BST) - Iterative for efficiency",
    "function lowestCommonAncestorBST(root, p, q) {",
    "  while (root) {",
    "    if (p.value < root.value && q.value < root.value) {",
    "      // Both p and q are in the left subtree",
    "      root = root.left;",
    "    } else if (p.value > root.value && q.value > root.value) {",
    "      // Both p and q are in the right subtree",
    "      root = root.right;",
    "    } else {",
    "      // Found the split point (or one node is an ancestor of other), this is the LCA",
    "      return root;",
    "    }",
    "  }",
    "  return null; // Should not happen if p and q are in the BST",
    "}",
  ],
};

export default function LCAVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [selectedTraversalType, setSelectedTraversalType] = useState<TraversalType>(TRAVERSAL_TYPES.INORDER);


  useEffect(() => {
    setIsClient(true);
    if (algorithmMetadata) {
       toast({
            title: "Conceptual Overview",
            description: `Interactive LCA visualization (path finding, comparison) is currently under construction.`,
            variant: "default",
            duration: 6000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for Lowest Common Ancestor not found.`, variant: "destructive" });
    }
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!isClient) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">Loading visualizer...</p>
            </main>
            <Footer />
        </div>
    );
  }

  if (!algorithmMetadata || !algoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
            <p className="text-muted-foreground text-lg">
              Could not load data for &quot;{algorithmMetadata?.slug || 'LCA'}&quot;.
            </p>
            <Button asChild size="lg" className="mt-8">
                <Link href="/visualizers">Back to Visualizers</Link>
            </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
        </div>

        <div className="text-center my-10 p-6 border rounded-lg shadow-lg bg-card">
            <Construction className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Interactive Visualization Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                The interactive visualizer for {algorithmMetadata.title}, demonstrating path traversals and comparisons, is currently under construction.
                Please check back later! Review the concepts and code snippets below.
            </p>
        </div>
        
        <div className="lg:w-3/5 xl:w-2/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-auto flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code Snippets (JavaScript)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[600px]">
                    <pre className="font-code text-sm p-4">
                        {LCA_CODE_SNIPPETS.JavaScript.map((line, index) => (
                        <div key={`js-line-${index}`} className="px-2 py-0.5 rounded text-foreground whitespace-pre-wrap">
                            <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                            {index + 1}
                            </span>
                            {line}
                        </div>
                        ))}
                    </pre>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>

        <div className="w-full">
          <BinaryTreeControlsPanel
            onPlay={() => {}}
            onPause={() => {}}
            onStep={() => {}}
            onReset={() => {}}
            onTreeInputChange={() => {}}
            treeInputValue={"(Tree input, e.g., 5,3,8,1,4,7,9)"}
            onTraversalTypeChange={setSelectedTraversalType} 
            selectedTraversalType={selectedTraversalType}
            isPlaying={false}
            isFinished={true}
            currentSpeed={500}
            onSpeedChange={() => {}}
            isAlgoImplemented={false}
            minSpeed={100}
            maxSpeed={2000}
          />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-w-lg mx-auto">
              <div>
                <Label htmlFor="nodePInput" className="text-sm font-medium">Node p value</Label>
                <Input id="nodePInput" type="text" placeholder="Enter value for node p" className="mt-1" disabled />
              </div>
              <div>
                <Label htmlFor="nodeQInput" className="text-sm font-medium">Node q value</Label>
                <Input id="nodeQInput" type="text" placeholder="Enter value for node q" className="mt-1" disabled />
              </div>
            </div>
             <Button className="mt-4 w-full max-w-xs mx-auto block" disabled>Find LCA (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

    
