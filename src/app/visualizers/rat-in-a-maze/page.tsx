
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const RAT_IN_MAZE_CODE_SNIPPETS = {
  JavaScript: [
    "// Rat in a Maze using Backtracking (Conceptual)",
    "function solveMaze(maze) { // maze is N x M matrix, 1 for path, 0 for wall",
    "  const N = maze.length; if (N === 0) return null;",
    "  const M = maze[0].length; if (M === 0) return null;",
    "  const solution = Array(N).fill(0).map(() => Array(M).fill(0));",
    "",
    "  function isSafe(row, col) {",
    "    return row >= 0 && row < N && col >= 0 && col < M && maze[row][col] === 1 && solution[row][col] === 0;",
    "  }",
    "",
    "  function solveMazeUtil(row, col) {",
    "    // If (row, col is goal) return true",
    "    if (row === N - 1 && col === M - 1 && maze[row][col] === 1) {",
    "      solution[row][col] = 1; // Mark goal as part of path",
    "      return true;",
    "    }",
    "",
    "    if (isSafe(row, col)) {",
    "      solution[row][col] = 1; // Mark cell as part of solution path",
    "",
    "      // Move forward in x direction (Right)",
    "      if (solveMazeUtil(row, col + 1)) return true;",
    "      // If moving in x direction doesn't give solution then Move down in y direction",
    "      if (solveMazeUtil(row + 1, col)) return true;",
    "      // Add other directions if allowed (e.g., Left, Up)",
    "      // if (solveMazeUtil(row, col - 1)) return true; // Left",
    "      // if (solveMazeUtil(row - 1, col)) return true; // Up",
    "",
    "      // If none of the above movements work then BACKTRACK:",
    "      // unmark x, y as part of solution path",
    "      solution[row][col] = 0;",
    "      return false;",
    "    }",
    "    return false;",
    "  }",
    "",
    "  if (solveMazeUtil(0, 0)) return solution;",
    "  return null; // No solution exists",
    "}",
    "// Example: const maze = [[1,0,0,0],[1,1,0,1],[0,1,0,0],[1,1,1,1]]; solveMaze(maze);"
  ],
};

export default function RatInAMazeVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [mazeInput, setMazeInput] = useState(
    "1,0,0,0\n" +
    "1,1,0,1\n" +
    "0,1,0,0\n" +
    "1,1,1,1"
  );

  useEffect(() => {
    setIsClient(true);
    toast({
        title: "Conceptual Overview",
        description: `Interactive Rat in a Maze visualization is under construction. Review concepts and code.`,
        variant: "default",
        duration: 5000,
    });
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities, 
    spaceComplexity: algorithmMetadata.spaceComplexity,
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
              Could not load data for &quot;rat-in-a-maze&quot;.
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
                The interactive visualizer for {algorithmMetadata.title}, showing path exploration and backtracking in a grid, is currently under construction.
                Please check back later! Review the concepts and code snippets below.
            </p>
        </div>
        
        <div className="lg:w-3/5 xl:w-2/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-auto flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code (JavaScript)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[600px]">
                    <pre className="font-code text-sm p-4">
                        {RAT_IN_MAZE_CODE_SNIPPETS.JavaScript.map((line, index) => (
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

        <div className="w-full max-w-md mx-auto my-4 p-4 border rounded-lg shadow-md">
            <Label htmlFor="mazeInput" className="text-sm font-medium">Maze Input (0 for wall, 1 for path, comma-sep, rows on newlines)</Label>
            <Textarea 
                id="mazeInput" 
                value={mazeInput} 
                onChange={(e) => setMazeInput(e.target.value)} 
                className="mt-1 font-code" 
                rows={4}
                disabled 
            />
            <Button className="mt-2 w-full" disabled>Solve Maze (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    
