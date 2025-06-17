
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { N_QUEENS_LINE_MAP } from './n-queens-logic';


export const N_QUEENS_CODE_SNIPPETS = {
  JavaScript: [
    "function solveNQueens(n) {",                         // 1 (solveNQueensFunc)
    "  // Helper: isSafe(board, row, col, n)",            // (Conceptual start for isSafe, matches isSafeFuncStart: 5)
    "  // Helper: solve(board, col, n, solutions)",       // (Conceptual start for solveUtil, matches solveUtilFuncStart: 18)
    "  // ... full implementation ...",
    "  /* Detailed isSafe function */",                   // 5 (isSafeFuncStart)
    "  function isSafe(board, row, col, n) {",
    "    for (let i = 0; i < col; i++) { /* Check row */", // 6 (checkRowConflict)
    "      if (board[row][i] === 1) return false;",
    "    }",
    "    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) { /* Check upper diag */", // 7 (checkUpperDiagonalConflict)
    "      if (board[i][j] === 1) return false;",
    "    }",
    "    for (let i = row, j = col; i < n && j >= 0; i++, j--) { /* Check lower diag */", // 8 (checkLowerDiagonalConflict)
    "      if (board[i][j] === 1) return false;",
    "    }",
    "    return true;",                                     // 9 (isSafeReturnTrue), also concept of 15
    "  }",                                                  // (Conceptual end of isSafe: 16)
    "",
    "  /* Main recursive solver function */",
    "  function solve(board, col, n, solutions) {",         // 18 (solveUtilFuncStart)
    "    if (col === n) {",                                // 19 (baseCaseColEqualsN)
    "      solutions.push(board.map(r => [...r]));",      // 20 (addSolutionAndReturnTrue part 1)
    "      return true;",                                   // 20 (addSolutionAndReturnTrue part 2)
    "    }",
    "    for (let i = 0; i < n; i++) {",                   // 21 (loopTryRowsInCol)
    "      if (isSafe(board, i, col, n)) {",               // 22 (callIsSafe)
    "        board[i][col] = 1; // Place Queen",           // 23 (placeQueenOnBoard)
    "        if (solve(board, col + 1, n, solutions)) {",  // 24 (recursiveCallSolveUtil)
    "          // return true; // If only one solution needed",
    "        }",
    "        board[i][col] = 0; // Backtrack",             // 26 (backtrackRemoveQueen)
    "      }",                                              // 27 (endIfIsSafe)
    "    }",
    "    return false;",                                    // 29 (returnFalseFromSolveUtil)
    "  }",                                                  // (Conceptual end of solveUtil)
    "",
    "  const board = Array(n).fill(0).map(() => Array(n).fill(0));",
    "  const solutions = [];",
    "  solve(board, 0, n, solutions);",                    // 31 (initialSolveCall)
    "  return solutions;",                                  // 32 (returnFinalSolutions)
    "}",
  ],
};

interface NQueensCodePanelProps {
  currentLine: number | null;
}

export function NQueensCodePanel({ currentLine }: NQueensCodePanelProps) {
  const { toast } = useToast();
  const codeToDisplay = N_QUEENS_CODE_SNIPPETS.JavaScript;

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    navigator.clipboard.writeText(codeString)
      .then(() => toast({ title: `N-Queens Code Copied!` }))
      .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code (JavaScript - Backtracking)
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {codeToDisplay.map((line, index) => (
              <div key={`nqueens-line-${index}`}
                className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
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
