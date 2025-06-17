
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
import { BinaryTreeControlsPanel } from '@/app/visualizers/binary-tree-traversal/BinaryTreeControlsPanel'; // Re-using for basic layout
import { TRAVERSAL_TYPES, type TraversalType } from '@/app/visualizers/binary-tree-traversal/binary-tree-traversal-logic';


const RBT_CODE_SNIPPETS = {
  JavaScript: [
    "// Red-Black Tree Node and Class Structure (Conceptual)",
    "const RED = true;",
    "const BLACK = false;",
    "",
    "class RBTNode {",
    "  constructor(value, color = RED, parent = null, left = null, right = null) {",
    "    this.value = value;",
    "    this.color = color; // New nodes are typically RED",
    "    this.parent = parent;",
    "    this.left = left;   // Leaf nodes (NIL) will be BLACK",
    "    this.right = right;  // Leaf nodes (NIL) will be BLACK",
    "  }",
    "}",
    "",
    "class RedBlackTree {",
    "  constructor() {",
    "    // NIL node is a sentinel, black, and used for all leaves.",
    "    this.NIL = new RBTNode(null, BLACK); ",
    "    this.NIL.parent = this.NIL;",
    "    this.NIL.left = this.NIL;",
    "    this.NIL.right = this.NIL;",
    "    this.root = this.NIL;",
    "  }",
    "",
    "  rotateLeft(x) {",
    "    //   x (original root of subtree)      y (new root)",
    "    //  / \\                               / \\",
    "    // T1  y            becomes          x   T3",
    "    //    / \\                           / \\",
    "    //   T2 T3                         T1 T2",
    "    let y = x.right;                   // Set y",
    "    x.right = y.left;                  // Turn y's left subtree into x's right subtree",
    "    if (y.left !== this.NIL) { y.left.parent = x; }",
    "    y.parent = x.parent;               // Link y's parent to x's parent",
    "    if (x.parent === this.NIL) { this.root = y; }",
    "    else if (x === x.parent.left) { x.parent.left = y; }",
    "    else { x.parent.right = y; }",
    "    y.left = x;                        // Put x on y's left",
    "    x.parent = y;",
    "    // Note: Heights/subtree sizes would also be updated in augmented RBTs",
    "  }",
    "",
    "  rotateRight(y) {",
    "    //     y (original root of subtree)   x (new root)",
    "    //    / \\                             / \\",
    "    //   x  T3           becomes       T1  y",
    "    //  / \\                               / \\",
    "    // T1 T2                             T2 T3",
    "    let x = y.left;                    // Set x",
    "    y.left = x.right;                  // Turn x's right subtree into y's left subtree",
    "    if (x.right !== this.NIL) { x.right.parent = y; }",
    "    x.parent = y.parent;               // Link x's parent to y's parent",
    "    if (y.parent === this.NIL) { this.root = x; }",
    "    else if (y === y.parent.right) { y.parent.right = x; }",
    "    else { y.parent.left = x; }",
    "    x.right = y;                       // Put y on x's right",
    "    y.parent = x;",
    "  }",
    "",
    "  insert(value) {",
    "    let node = new RBTNode(value, RED, this.NIL, this.NIL, this.NIL);",
    "    // Standard BST insert:",
    "    let y = this.NIL; // Parent of x",
    "    let x = this.root; // Current node",
    "    while (x !== this.NIL) {",
    "      y = x;",
    "      if (node.value < x.value) x = x.left;",
    "      else x = x.right;",
    "    }",
    "    node.parent = y;",
    "    if (y === this.NIL) this.root = node; // Tree was empty",
    "    else if (node.value < y.value) y.left = node;",
    "    else y.right = node;",
    "    // After BST insert, call insertFixup to restore R-B properties.",
    "    this.insertFixup(node);",
    "  }",
    "",
    "  insertFixup(z) {",
    "    // This function restores Red-Black properties after insertion.",
    "    // While z's parent is RED (property violation as new node z is RED):",
    "    //   Case 1: Uncle is RED -> Recolor parent, uncle, grandparent. Move z to grandparent.",
    "    //   Case 2: Uncle is BLACK & z is an inner child (triangle) -> Rotate parent. Turns into Case 3.",
    "    //   Case 3: Uncle is BLACK & z is an outer child (line) -> Recolor parent, grandparent. Rotate grandparent.",
    "    // (Simplified logic description - actual code is more detailed with side checks)",
    "    while (z.parent.color === RED && z !== this.root && z.parent !== this.root) {",
    "      if (z.parent === z.parent.parent.left) { /* Parent is left child */",
    "        let y = z.parent.parent.right; // Uncle",
    "        if (y.color === RED) { /* Case 1: Uncle RED */",
    "          z.parent.color = BLACK; y.color = BLACK;",
    "          z.parent.parent.color = RED; z = z.parent.parent;",
    "        } else { /* Uncle BLACK */",
    "          if (z === z.parent.right) { /* Case 2: Triangle */",
    "            z = z.parent; this.rotateLeft(z);",
    "          }",
    "          /* Case 3: Line */",
    "          z.parent.color = BLACK; z.parent.parent.color = RED;",
    "          this.rotateRight(z.parent.parent);",
    "        }",
    "      } else { /* Symmetric: Parent is right child */",
    "        let y = z.parent.parent.left; // Uncle",
    "        if (y.color === RED) { /* Case 1 */",
    "          z.parent.color = BLACK; y.color = BLACK;",
    "          z.parent.parent.color = RED; z = z.parent.parent;",
    "        } else { /* Uncle BLACK */",
    "          if (z === z.parent.left) { /* Case 2 */",
    "            z = z.parent; this.rotateRight(z);",
    "          }",
    "          /* Case 3 */",
    "          z.parent.color = BLACK; z.parent.parent.color = RED;",
    "          this.rotateLeft(z.parent.parent);",
    "        }",
    "      }",
    "    }",
    "    this.root.color = BLACK; // Root must always be black.",
    "  }",
    "",
    "  // delete(value) { /* ... Very complex logic involving BST delete + deleteFixup ... */ }",
    "  // deleteFixup(x) { /* ... Equally complex fixup logic for deletion ... */ }",
    "}",
  ],
};

const ALGORITHM_SLUG = 'red-black-tree';

export default function RedBlackTreeVisualizerPage() {
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
            description: `Interactive Red-Black Tree operations visualization is highly complex due to rotations, color changes, and numerous fixup cases. It is currently under construction.`,
            variant: "default",
            duration: 7000,
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
      worst: "O(log n) for search, insert, delete (guaranteed)" 
    },
    spaceComplexity: "O(n) for storage.",
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
                The interactive visualizer for {algorithm.title}, demonstrating node coloring, rotations, and fixup operations for insert and delete, is a highly complex feature and currently under construction.
                This structure requires specialized UI components to clearly show color changes and animated rotations.
                Please check back later! Review the concepts and code snippets below for a better understanding.
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
                        {RBT_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
            treeInputValue={"(e.g., 10,5,15,3,7,12,18)"} 
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
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

