
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


const TREE_PATH_CODE_SNIPPETS = {
  JavaScript: [
    "// Example: Path Sum (Root to Leaf)",
    "// Given a binary tree and a sum, determine if the tree has a root-to-leaf path",
    "// such that adding up all the values along the path equals the given sum.",
    "function hasPathSum(root, targetSum) {",
    "  if (!root) return false; // Base case: empty tree or path ended",
    "",
    "  // If it's a leaf node, check if its value equals the remaining sum",
    "  if (!root.left && !root.right) {",
    "    return targetSum === root.value;",
    "  }",
    "",
    "  // Recursively check left and right subtrees with updated target sum",
    "  const remainingSum = targetSum - root.value;",
    "  return hasPathSum(root.left, remainingSum) ||",
    "         hasPathSum(root.right, remainingSum);",
    "}",
    "",
    "// Example: Tree Diameter (Conceptual - find longest path between any two nodes)",
    "// The diameter of a tree is the number of nodes on the longest path",
    "// between any two leaf nodes. This path may or may not pass through the root.",
    "function diameterOfBinaryTree(root) {",
    "  let diameter = 0;",
    "",
    "  function depthFirstSearch(node) {",
    "    if (!node) return 0; // Height of an empty tree is 0",
    "",
    "    const leftPath = depthFirstSearch(node.left);",
    "    const rightPath = depthFirstSearch(node.right);",
    "",
    "    // Diameter at current node is leftPath + rightPath",
    "    // Update global diameter if current path is longer",
    "    diameter = Math.max(diameter, leftPath + rightPath);",
    "",
    "    // Return the height of the current node's subtree",
    "    // (max path from this node down to a leaf)",
    "    return Math.max(leftPath, rightPath) + 1;",
    "  }",
    "",
    "  depthFirstSearch(root);",
    "  return diameter;",
    "}",
  ],
};

export default function TreePathProblemsVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [selectedTraversalType, setSelectedTraversalType] = useState<TraversalType>(TRAVERSAL_TYPES.INORDER);


  useEffect(() => {
    setIsClient(true);
    if (algorithmMetadata) {
       toast({
            title: "Conceptual Overview",
            description: `Interactive Tree Path Problems (e.g., Path Sum, Diameter) visualization is currently under construction.`,
            variant: "default",
            duration: 6000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for tree-path-problems not found.`, variant: "destructive" });
    }
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!, // Use defined complexities
    spaceComplexity: algorithmMetadata.spaceComplexity!,   // Use defined complexity
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

  if (!algoDetails) { // Check algoDetails which depends on algorithmMetadata
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
            <p className="text-muted-foreground text-lg">
              Could not load data for &quot;tree-path-problems&quot;.
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
                Interactive visualizers for specific {algorithmMetadata.title} (like Path Sum, Diameter) are currently under construction.
                Please check back later! Review the concepts and example code snippets below.
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
                        {TREE_PATH_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
            onTraversalTypeChange={setSelectedTraversalType} // Dummy
            selectedTraversalType={selectedTraversalType}
            isPlaying={false}
            isFinished={true}
            currentSpeed={500}
            onSpeedChange={() => {}}
            isAlgoImplemented={false}
            minSpeed={100}
            maxSpeed={2000}
          />
           <div className="mt-4 max-w-md mx-auto">
             <Label htmlFor="targetSumInput" className="text-sm font-medium">Example: Target Sum (for Path Sum)</Label>
             <Input id="targetSumInput" type="text" placeholder="Enter target sum" className="mt-1" disabled />
             <Button className="mt-2 w-full" disabled>Find Path (Coming Soon)</Button>
            </div>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
