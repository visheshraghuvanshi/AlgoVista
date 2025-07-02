
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
    "  const solutions = [], cols = new Set(), diag1 = new Set(), diag2 = new Set();", // 2
    "  const board = Array(n).fill(0).map(() => Array(n).fill(0));",
    "  function solve(row) {",                                     // 4
    "    if (row === n) { solutions.push(board.map(r => [...r])); return; }", // 5 & 6
    "    for (let col = 0; col < n; col++) {",                     // 8
    "      if (!cols.has(col) && !diag1.has(row+col) && !diag2.has(row-col)) {", // 9
    "        board[row][col] = 1;",                              // 10
    "        cols.add(col); diag1.add(row+col); diag2.add(row-col);",
    "        solve(row + 1);",                                   // 11
    "        board[row][col] = 0; // Backtrack",                  // 12
    "        cols.delete(col); diag1.delete(row+col); diag2.delete(row-col);",
    "      }",
    "    }",
    "  }",
    "  solve(0);",                                              // 14 (conceptual)
    "  return solutions;",
    "}",
  ],
  Python: [
    "def solve_n_queens(n):",
    "    solutions = []",
    "    board = [['.'] * n for _ in range(n)]",
    "    cols = set()",
    "    diag1 = set()  # (r + c)",
    "    diag2 = set()  # (r - c)",
    "",
    "    def solve(row):",
    "        if row == n:",
    "            solutions.append([''.join(r) for r in board])",
    "            return",
    "        for col in range(n):",
    "            if col in cols or (row + col) in diag1 or (row - col) in diag2:",
    "                continue",
    "",
    "            board[row][col] = 'Q'",
    "            cols.add(col)",
    "            diag1.add(row + col)",
    "            diag2.add(row - col)",
    "",
    "            solve(row + 1)",
    "",
    "            # Backtrack",
    "            board[row][col] = '.'",
    "            cols.remove(col)",
    "            diag1.remove(row + col)",
    "            diag2.remove(row - col)",
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
    "    Set<Integer> cols = new HashSet<>();",
    "    Set<Integer> diag1 = new HashSet<>();",
    "    Set<Integer> diag2 = new HashSet<>();",
    "",
    "    public List<List<String>> solveNQueens(int n) {",
    "        this.n = n;",
    "        board = new char[n][n];",
    "        for (char[] row : board) Arrays.fill(row, '.');",
    "        solve(0);",
    "        return solutions;",
    "    }",
    "",
    "    private void solve(int row) {",
    "        if (row == n) {",
    "            List<String> currentSolution = new ArrayList<>();",
    "            for (char[] r : board) currentSolution.add(new String(r));",
    "            solutions.add(currentSolution);",
    "            return;",
    "        }",
    "        for (int col = 0; col < n; col++) {",
    "            if (cols.contains(col) || diag1.contains(row + col) || diag2.contains(row - col)) {",
    "                continue;",
    "            }",
    "            board[row][col] = 'Q';",
    "            cols.add(col); diag1.add(row + col); diag2.add(row - col);",
    "            solve(row + 1);",
    "            board[row][col] = '.'; // Backtrack",
    "            cols.remove(col); diag1.remove(row + col); diag2.remove(row - col);",
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
    "        std::vector<bool> cols(n, false), diag1(2*n-1, false), diag2(2*n-1, false);",
    "        solve(0, board, solutions, cols, diag1, diag2, n);",
    "        return solutions;",
    "    }",
    "private:",
    "    void solve(int row, std::vector<std::string>& board, std::vector<std::vector<std::string>>& solutions,", 
    "               std::vector<bool>& cols, std::vector<bool>& diag1, std::vector<bool>& diag2, int n) {",
    "        if (row == n) {",
    "            solutions.push_back(board);",
    "            return;",
    "        }",
    "        for (int col = 0; col < n; ++col) {",
    "            if (cols[col] || diag1[row + col] || diag2[row - col + n - 1]) continue;",
    "",
    "            board[row][col] = 'Q';",
    "            cols[col] = diag1[row + col] = diag2[row - col + n - 1] = true;",
    "",
    "            solve(row + 1, board, solutions, cols, diag1, diag2, n);",
    "",
    "            board[row][col] = '.'; // Backtrack",
    "            cols[col] = diag1[row + col] = diag2[row - col + n - 1] = false;",
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
          <Code2 className="mr-2 h-5 w-5" /> Code (Optimized Backtracking)
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

    