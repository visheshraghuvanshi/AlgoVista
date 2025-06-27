
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const N_QUEENS_CODE_SNIPPETS = {
  JavaScript: [
    "function solveNQueens(n) {",                            // 1
    "  const solutions = [];",
    "  const board = Array(n).fill(0).map(() => Array(n).fill(0));",
    "",
    "  function isSafe(row, col) {",                         // 5
    "    for (let i = 0; i < row; i++) if (board[i][col]) return false;", // 6
    "    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false;", // 7
    "    for (let i = row, j = col; i >= 0 && j < n; i--, j++) if (board[i][j]) return false;", // 8
    "    return true;",                                      // 9
    "  }",
    "",
    "  function solve(row) {",                                // 18
    "    if (row === n) {",                                 // 19
    "      solutions.push(board.map(r => [...r]));",       // 20
    "      return; // Continue finding all solutions",
    "    }",
    "    for (let col = 0; col < n; col++) {",              // 21
    "      if (isSafe(row, col)) {",                        // 22
    "        board[row][col] = 1;",                         // 23
    "        solve(row + 1);",                               // 24
    "        board[row][col] = 0; // Backtrack",            // 26
    "      }",
    "    }",
    "  }",
    "",
    "  solve(0);",                                          // 31
    "  return solutions;",                                   // 32
    "}",
  ],
  Python: [
    "def solve_n_queens(n):",
    "    solutions = []",
    "    board = [[0] * n for _ in range(n)]",
    "",
    "    def is_safe(row, col):",
    "        # Check column upwards",
    "        for i in range(row):",
    "            if board[i][col] == 1: return False",
    "        # Check upper-left diagonal",
    "        for i, j in zip(range(row, -1, -1), range(col, -1, -1)):",
    "            if board[i][j] == 1: return False",
    "        # Check upper-right diagonal",
    "        for i, j in zip(range(row, -1, -1), range(col, n)):",
    "            if board[i][j] == 1: return False",
    "        return True",
    "",
    "    def solve(row):",
    "        if row == n:",
    "            solutions.append([list(r) for r in board])",
    "            return",
    "        for col in range(n):",
    "            if is_safe(row, col):",
    "                board[row][col] = 1",
    "                solve(row + 1)",
    "                board[row][col] = 0 # Backtrack",
    "",
    "    solve(0)",
    "    return solutions",
  ],
  Java: [
    "import java.util.*;",
    "class Solution {",
    "    List<List<String>> solutions = new ArrayList<>();",
    "    int n;",
    "    char[][] board;",
    "    public List<List<String>> solveNQueens(int n) {",
    "        this.n = n;",
    "        board = new char[n][n];",
    "        for (char[] row : board) Arrays.fill(row, '.');",
    "        solve(0);",
    "        return solutions;",
    "    }",
    "    private boolean isSafe(int row, int col) { /* ... check upwards ... */ return true; }",
    "    private void solve(int row) {",
    "        if (row == n) {",
    "            List<String> currentSolution = new ArrayList<>();",
    "            for (char[] r : board) currentSolution.add(new String(r));",
    "            solutions.add(currentSolution);",
    "            return;",
    "        }",
    "        for (int col = 0; col < n; col++) {",
    "            if (isSafe(row, col)) {",
    "                board[row][col] = 'Q';",
    "                solve(row + 1);",
    "                board[row][col] = '.'; // Backtrack",
    "            }",
    "        }",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <string>",
    "class Solution {",
    "public:",
    "    std::vector<std::vector<std::string>> solveNQueens(int n) {",
    "        std::vector<std::vector<std::string>> solutions;",
    "        std::vector<std::string> board(n, std::string(n, '.'));",
    "        solve(0, board, solutions);",
    "        return solutions;",
    "    }",
    "private:",
    "    bool isSafe(int row, int col, const std::vector<std::string>& board, int n) { /* ... */ return true; }",
    "    void solve(int row, std::vector<std::string>& board, std::vector<std::vector<std::string>>& solutions) {",
    "        if (row == board.size()) {",
    "            solutions.push_back(board);",
    "            return;",
    "        }",
    "        for (int col = 0; col < board.size(); ++col) {",
    "            if (isSafe(row, col, board, board.size())) {",
    "                board[row][col] = 'Q';",
    "                solve(row + 1, board, solutions);",
    "                board[row][col] = '.'; // Backtrack",
    "            }",
    "        }",
    "    }",
    "};",
  ],
};

interface NQueensCodePanelProps {
  currentLine: number | null;
}

export function NQueensCodePanel({ currentLine }: NQueensCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(N_QUEENS_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = N_QUEENS_CODE_SNIPPETS[selectedLanguage as keyof typeof N_QUEENS_CODE_SNIPPETS]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for N-Queens Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  const currentCodeLines = N_QUEENS_CODE_SNIPPETS[selectedLanguage as keyof typeof N_QUEENS_CODE_SNIPPETS] || [];

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code (Backtracking)
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
            <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
            {currentCodeLines.map((line, index) => (
              <div key={`nqueens-line-${selectedLanguage}-${index}`}
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
