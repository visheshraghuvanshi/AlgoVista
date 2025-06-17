
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const SUDOKU_SOLVER_CODE_SNIPPETS = {
  JavaScript: [
    "// Sudoku Solver using Backtracking (Conceptual)",
    "function solveSudoku(board) { // board is a 9x9 array of numbers (0 for empty)",
    "  function findEmpty(board) {",
    "    for (let r = 0; r < 9; r++) {",
    "      for (let c = 0; c < 9; c++) {",
    "        if (board[r][c] === 0) return [r, c]; // Empty cell",
    "      }",
    "    }",
    "    return null; // No empty cells, puzzle solved",
    "  }",
    "",
    "  function isSafe(board, row, col, num) {",
    "    // Check row",
    "    for (let x = 0; x < 9; x++) if (board[row][x] === num) return false;",
    "    // Check column",
    "    for (let x = 0; x < 9; x++) if (board[x][col] === num) return false;",
    "    // Check 3x3 subgrid",
    "    const startRow = row - row % 3, startCol = col - col % 3;",
    "    for (let i = 0; i < 3; i++) {",
    "      for (let j = 0; j < 3; j++) {",
    "        if (board[i + startRow][j + startCol] === num) return false;",
    "      }",
    "    }",
    "    return true;",
    "  }",
    "",
    "  function solve() {",
    "    const emptySpot = findEmpty(board);",
    "    if (!emptySpot) return true; // Solved",
    "    const [row, col] = emptySpot;",
    "",
    "    for (let num = 1; num <= 9; num++) {",
    "      if (isSafe(board, row, col, num)) {",
    "        board[row][col] = num; // Try placing number",
    "        if (solve()) return true; // Recurse",
    "        board[row][col] = 0; // Backtrack: undo placement",
    "      }",
    "    }",
    "    return false; // No number works for this spot, trigger backtrack",
    "  }",
    "",
    "  if (solve()) return board;",
    "  return null; // No solution exists",
    "}",
    "// Example: const puzzle = [[...], ...]; solveSudoku(puzzle);"
  ],
};

const ALGORITHM_SLUG = 'sudoku-solver';

export default function SudokuSolverVisualizerPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [sudokuInput, setSudokuInput] = useState(
    "5,3,0,0,7,0,0,0,0\n" +
    "6,0,0,1,9,5,0,0,0\n" +
    "0,9,8,0,0,0,0,6,0\n" +
    "8,0,0,0,6,0,0,0,3\n" +
    "4,0,0,8,0,3,0,0,1\n" +
    "7,0,0,0,2,0,0,0,6\n" +
    "0,6,0,0,0,0,2,8,0\n" +
    "0,0,0,4,1,9,0,0,5\n" +
    "0,0,0,0,8,0,0,7,9"
  );


  useEffect(() => {
    setIsClient(true);
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
       toast({
            title: "Conceptual Overview",
            description: `Interactive Sudoku Solver visualization is under construction. Review concepts and code.`,
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
      best: "O(1) if solved, or up to O(9^m) where m is empty cells (worst case)", 
      average: "Hard to define precisely", 
      worst: "O(9^m)" 
    },
    spaceComplexity: "O(N^2) for board, O(N^2) for recursion stack (N=9).",
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
                The interactive visualizer for {algorithm.title}, showing how numbers are tried and backtracking occurs, is currently under construction.
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
                        {SUDOKU_SOLVER_CODE_SNIPPETS.JavaScript.map((line, index) => (
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
            <Label htmlFor="sudokuInput" className="text-sm font-medium">Sudoku Puzzle (9x9, 0 for empty, rows separated by newline)</Label>
            <Textarea 
                id="sudokuInput" 
                value={sudokuInput} 
                onChange={(e) => setSudokuInput(e.target.value)} 
                className="mt-1 font-code" 
                rows={9}
                disabled 
            />
            <Button className="mt-2 w-full" disabled>Solve Sudoku (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    
