
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SUDOKU_LINE_MAP } from './sudoku-solver-logic'; // Local import


export const SUDOKU_SOLVER_CODE_SNIPPETS = {
  JavaScript: [
    "function solveSudoku(board) {",                            // 1
    "  function findEmpty() { /* ... */ }",                     // 2
    "  function isSafe(row, col, num) { /* ... */ }",           // 3
    "  function solve() {",                                     // 4
    "    const emptySpot = findEmpty();",                       // 5
    "    if (!emptySpot) return true; // Solved",              // 6
    "    const [row, col] = emptySpot;",                       // 7
    "    for (let num = 1; num <= 9; num++) {",                // 8
    "      if (isSafe(row, col, num)) {",                      // 9
    "        board[row][col] = num; // Place number",           // 10
    "        if (solve()) return true; // Recurse",            // 11
    "        board[row][col] = 0; // Backtrack",               // 12
    "      }",
    "    }",
    "    return false; // No number works, trigger backtrack",  // 13
    "  }",
    "  if (solve()) return board; else return null;",          // 14
    "}",
    "// isSafe detailed:",
    "function isSafe(board, row, col, num) {",                 // 15
    "  // Check row",                                          
    "  for (let x = 0; x < 9; x++) if (board[row][x] === num) return false;", // 16
    "  // Check column",                                       
    "  for (let x = 0; x < 9; x++) if (board[x][col] === num) return false;", // 17
    "  // Check 3x3 subgrid",                                  
    "  const startRow = row - row % 3, startCol = col - col % 3;", // 18
    "  for (let i = 0; i < 3; i++) {",                         // 19
    "    for (let j = 0; j < 3; j++) {",
    "      if (board[i + startRow][j + startCol] === num) return false;",
    "    }",
    "  }",
    "  return true;",                                          // 20
    "}",
  ],
  Python: [
    "def solve_sudoku(board):",
    "    def find_empty():",
    "        for r in range(9):",
    "            for c in range(9):",
    "                if board[r][c] == 0: return (r, c)",
    "        return None",
    "",
    "    def is_safe(row, col, num):",
    "        # Check row, column, and 3x3 box",
    "        for x in range(9):",
    "            if board[row][x] == num or board[x][col] == num: return False",
    "        start_row, start_col = row - row % 3, col - col % 3",
    "        for i in range(3):",
    "            for j in range(3):",
    "                if board[i + start_row][j + start_col] == num: return False",
    "        return True",
    "",
    "    def solve():",
    "        empty_spot = find_empty()",
    "        if not empty_spot: return True",
    "        row, col = empty_spot",
    "        for num in range(1, 10):",
    "            if is_safe(row, col, num):",
    "                board[row][col] = num",
    "                if solve(): return True",
    "                board[row][col] = 0 # Backtrack",
    "        return False",
    "",
    "    if solve(): return board",
    "    return None",
  ],
  Java: [
    "class SudokuSolver {",
    "    public boolean solveSudoku(int[][] board) {",
    "        return solve(board);",
    "    }",
    "    private int[] findEmpty(int[][] board) { /* ... */ }",
    "    private boolean isSafe(int[][] board, int row, int col, int num) { /* ... */ }",
    "",
    "    private boolean solve(int[][] board) {",
    "        int[] emptySpot = findEmpty(board);",
    "        if (emptySpot == null) return true; // Solved",
    "        int row = emptySpot[0]; int col = emptySpot[1];",
    "        for (int num = 1; num <= 9; num++) {",
    "            if (isSafe(board, row, col, num)) {",
    "                board[row][col] = num;",
    "                if (solve(board)) return true;",
    "                board[row][col] = 0; // Backtrack",
    "            }",
    "        }",
    "        return false;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "bool findEmpty(const std::vector<std::vector<int>>& board, int& row, int& col);",
    "bool isSafe(const std::vector<std::vector<int>>& board, int row, int col, int num);",
    "",
    "bool solveSudokuUtil(std::vector<std::vector<int>>& board) {",
    "    int row, col;",
    "    if (!findEmpty(board, row, col)) return true; // Solved",
    "    for (int num = 1; num <= 9; ++num) {",
    "        if (isSafe(board, row, col, num)) {",
    "            board[row][col] = num;",
    "            if (solveSudokuUtil(board)) return true;",
    "            board[row][col] = 0; // Backtrack",
    "        }",
    "    }",
    "    return false;",
    "}",
    "bool solveSudoku(std::vector<std::vector<int>>& board) {",
    "    return solveSudokuUtil(board);",
    "}",
  ],
};

interface SudokuCodePanelProps {
  currentLine: number | null;
}

export function SudokuCodePanel({ currentLine }: SudokuCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(SUDOKU_SOLVER_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = SUDOKU_SOLVER_CODE_SNIPPETS[selectedLanguage as keyof typeof SUDOKU_SOLVER_CODE_SNIPPETS]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for Sudoku Solver Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  const currentCodeLines = SUDOKU_SOLVER_CODE_SNIPPETS[selectedLanguage as keyof typeof SUDOKU_SOLVER_CODE_SNIPPETS] || [];

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: Sudoku Solver
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
            <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code">
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
            {currentCodeLines.map((line, index) => (
              <div key={`sudoku-${selectedLanguage}-line-${index}`}
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

