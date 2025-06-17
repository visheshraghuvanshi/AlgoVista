
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BinaryTreeControlsPanel } from '@/app/visualizers/binary-tree-traversal/BinaryTreeControlsPanel';
import { TRAVERSAL_TYPES, type TraversalType } from '@/app/visualizers/binary-tree-traversal/binary-tree-traversal-logic';

const AVL_TREE_CODE_SNIPPETS = {
  JavaScript: [
    "class AVLNode {",
    "  constructor(value) {",
    "    this.value = value;",
    "    this.left = null;",
    "    this.right = null;",
    "    this.height = 1; // Height of node",
    "  }",
    "}",
    "",
    "class AVLTree {",
    "  constructor() { this.root = null; }",
    "",
    "  getHeight(node) { return node ? node.height : 0; }",
    "  getBalanceFactor(node) {",
    "    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;",
    "  }",
    "  updateHeight(node) {",
    "     node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));",
    "  }",
    "",
    "  rotateRight(y) {",
    "    let x = y.left;",
    "    let T2 = x.right;",
    "    // Perform rotation",
    "    x.right = y;",
    "    y.left = T2;",
    "    // Update heights",
    "    this.updateHeight(y);",
    "    this.updateHeight(x);",
    "    return x; // New root of this subtree",
    "  }",
    "  //   y           x",
    "  //  / \\         / \\",
    "  // x   T3  =>  T1  y",
    "  // / \\             / \\",
    "  //T1 T2           T2 T3",
    "",
    "  rotateLeft(x) {",
    "    let y = x.right;",
    "    let T2 = y.left;",
    "    // Perform rotation",
    "    y.left = x;",
    "    x.right = T2;",
    "    // Update heights",
    "    this.updateHeight(x);",
    "    this.updateHeight(y);",
    "    return y; // New root of this subtree",
    "  }",
    "  //   x           y",
    "  //  / \\         / \\",
    "  // T1  y   =>  x   T3",
    "  //    / \\     / \\",
    "  //   T2 T3   T1 T2",
    "",
    "  insert(node, value) {",
    "    // 1. Perform standard BST insert",
    "    if (!node) return new AVLNode(value);",
    "    if (value < node.value) node.left = this.insert(node.left, value);",
    "    else if (value > node.value) node.right = this.insert(node.right, value);",
    "    else return node; // Duplicate values not allowed",
    "",
    "    // 2. Update height of current node",
    "    this.updateHeight(node);",
    "",
    "    // 3. Get balance factor",
    "    let balance = this.getBalanceFactor(node);",
    "",
    "    // 4. If unbalanced, perform rotations (LL, RR, LR, RL cases)",
    "    // Left Left Case",
    "    if (balance > 1 && value < node.left.value) return this.rotateRight(node);",
    "    // Right Right Case",
    "    if (balance < -1 && value > node.right.value) return this.rotateLeft(node);",
    "    // Left Right Case",
    "    if (balance > 1 && value > node.left.value) {",
    "      node.left = this.rotateLeft(node.left);",
    "      return this.rotateRight(node);",
    "    }",
    "    // Right Left Case",
    "    if (balance < -1 && value < node.right.value) {",
    "      node.right = this.rotateRight(node.right);",
    "      return this.rotateLeft(node);",
    "    }",
    "    return node; // Return unchanged (or balanced) node pointer",
    "  }",
    "  // To use: this.root = this.insert(this.root, value);",
    "",
    "  delete(node, value) { /* ... complex logic similar to insert with balancing ... */ }",
    "}",
  ],
};

const ALGORITHM_SLUG = 'avl-tree';

export default function AVLTreeVisualizerPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedTraversalType, setSelectedTraversalType] = useState<TraversalType>(TRAVERSAL_TYPES.INORDER);


  useEffect(() => {
    setIsClient(true);
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
       toast({
            title: "Conceptual Overview",
            description: `Interactive AVL Tree operations (rotations, balancing) visualization is complex and under construction.`,
            variant: "default",
            duration: 5000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    }
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.longDescription || algorithm.description,
    timeComplexities: { 
      best: "O(log n) for search, insert, delete", 
      average: "O(log n) for search, insert, delete", 
      worst: "O(log n) for search, insert, delete (guaranteed due to balancing)" 
    },
    spaceComplexity: "O(n) for storage, O(log n) for recursive calls during operations.",
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

  if (!algorithm || !algoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
            <p className="text-muted-foreground text-lg">
              Could not load data for &quot;{ALGORITHM_SLUG}&quot;.
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
            {algorithm.title}
          </h1>
        </div>

        <div className="text-center my-10 p-6 border rounded-lg shadow-lg bg-card">
            <Construction className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Interactive Visualization Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                The interactive visualizer for {algorithm.title}, including rotations (LL, RR, LR, RL), is currently under construction.
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
                        {AVL_TREE_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
            treeInputValue={"(e.g., 30,20,40,10,25,35,50)"}
            onTraversalTypeChange={setSelectedTraversalType} // Dummy, as not used for AVL structure itself
            selectedTraversalType={selectedTraversalType}
            isPlaying={false}
            isFinished={true}
            currentSpeed={500}
            onSpeedChange={() => {}}
            isAlgoImplemented={false}
            minSpeed={100}
            maxSpeed={2000}
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

