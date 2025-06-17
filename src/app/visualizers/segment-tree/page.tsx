
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
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel'; // For array input concept

const SEGMENT_TREE_CODE_SNIPPETS = {
  JavaScript: [
    "// Segment Tree (Conceptual - for sum queries, 1-based indexing for tree array)",
    "class SegmentTree {",
    "  constructor(arr) {",
    "    this.n = arr.length;",
    "    // Size of segment tree array is typically 2n or 4n for recursive version",
    "    this.tree = new Array(2 * this.n).fill(0); // For iterative version, 2n is enough",
    "    this.build(arr);",
    "  }",
    "",
    "  // Iterative Build (bottom-up from leaves)",
    "  build(arr) {",
    "    // Place leaf nodes (original array elements)",
    "    for (let i = 0; i < this.n; i++) {",
    "      this.tree[this.n + i] = arr[i];",
    "    }",
    "    // Build internal nodes by summing children",
    "    // Start from the parent of the last leaf and go up to the root (index 1)",
    "    for (let i = this.n - 1; i > 0; --i) {",
    "      // Parent at index i has children at 2*i and 2*i+1",
    "      this.tree[i] = this.tree[2 * i] + this.tree[2 * i + 1];",
    "    }",
    "  }",
    "",
    "  // Iterative Update (point update)",
    "  update(index, value) {",
    "    let pos = index + this.n; // Go to leaf node position",
    "    this.tree[pos] = value;",
    "    // Update parents by traversing up",
    "    while (pos > 1) {",
    "      pos = Math.floor(pos / 2); // Move to parent",
    "      this.tree[pos] = this.tree[2 * pos] + this.tree[2 * pos + 1]; // Update parent sum",
    "    }",
    "  }",
    "",
    "  // Iterative Query (range sum on [left, right) - left inclusive, right exclusive )",
    "  query(left, right) { ",
    "    let res = 0;",
    "    left += this.n;  // Adjust to leaf positions in the tree array",
    "    right += this.n;",
    "    // Loop while left and right pointers don't cross",
    "    for (; left < right; left = Math.floor(left/2), right = Math.floor(right/2)) {",
    "      // If left pointer is odd, it's a right child. Its interval is fully covered.",
    "      if (left % 2 === 1) { ",
    "        res += this.tree[left++]; // Add its value and move left to its parent's right sibling (conceptually)",
    "      }",
    "      // If right pointer is odd, it's a right child. Its left sibling's interval is fully covered.",
    "      if (right % 2 === 1) { ",
    "        res += this.tree[--right]; // Add its left sibling's value and move right to its parent's left sibling",
    "      }",
    "    }",
    "    return res;",
    "  }",
    "}",
    "// Example usage:",
    "// const arr = [1, 3, 5, 7, 9, 11];",
    "// const segTree = new SegmentTree(arr);",
    "// console.log(segTree.query(1, 4)); // Sum of arr[1] to arr[3] (0-indexed original) -> 3+5+7 = 15",
    "// segTree.update(2, 6); // Update arr[2] from 5 to 6",
    "// console.log(segTree.query(1, 4)); // Sum of arr[1] to arr[3] -> 3+6+7 = 16",
  ],
};

const ALGORITHM_SLUG = 'segment-tree';

export default function SegmentTreeVisualizerPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
       toast({
            title: "Conceptual Overview",
            description: `Interactive Segment Tree visualization (build, query, update) is complex and under construction.`,
            variant: "default",
            duration: 6000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    }
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.longDescription || algorithm.description,
    timeComplexities: { 
      best: "Build: O(n), Query: O(log n), Update: O(log n)", 
      average: "Build: O(n), Query: O(log n), Update: O(log n)", 
      worst: "Build: O(n), Query: O(log n), Update: O(log n)" 
    },
    spaceComplexity: "O(n) for the tree structure (typically 2n or 4n elements in array representation).",
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
                The interactive visualizer for {algorithm.title}, showing tree construction based on an array, range queries (sum, min, max), and point updates, is currently under construction.
                Please check back later! Review the concepts and code snippets below.
            </p>
        </div>
        
        <div className="lg:w-3/5 xl:w-2/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-auto flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code Snippets (JavaScript - Sum Queries)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[600px]">
                    <pre className="font-code text-sm p-4">
                        {SEGMENT_TREE_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
          <SortingControlsPanel // Using this for general array input for build
            onPlay={() => {}}
            onPause={() => {}}
            onStep={() => {}}
            onReset={() => {}}
            onInputChange={() => {}}
            inputValue={"(e.g., 1,3,5,7,9,11 for segment tree construction)"} // Example input
            isPlaying={false}
            isFinished={true} // Disables play/pause/step
            currentSpeed={500}
            onSpeedChange={() => {}}
            isAlgoImplemented={false} // Disables most controls
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
