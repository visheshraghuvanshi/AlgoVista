
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const RAT_IN_MAZE_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "function solveMaze(maze) {",
    "  const N = maze.length; const M = maze[0].length;",
    "  const sol = Array(N).fill(0).map(() => Array(M).fill(0));",
    "  function isSafe(r, c) {",
    "    return r >= 0 && r < N && c >= 0 && c < M && maze[r][c] === 1 && sol[r][c] === 0;",
    "  }",
    "  function solveUtil(r, c) {",
    "    if (r === N - 1 && c === M - 1 && maze[r][c] === 1) {",
    "      sol[r][c] = 1; return true;",
    "    }",
    "    if (isSafe(r, c)) {",
    "      sol[r][c] = 1;",
    "      if (solveUtil(r + 1, c)) return true; // Down",
    "      if (solveUtil(r, c + 1)) return true; // Right",
    "      // Add other directions (Up, Left) if allowed:",
    "      // if (solveUtil(r - 1, c)) return true; // Up",
    "      // if (solveUtil(r, c - 1)) return true; // Left",
    "      sol[r][c] = 0; // Backtrack",
    "      return false;",
    "    }",
    "    return false;",
    "  }",
    "  if (solveUtil(0, 0)) return sol;",
    "  return null; // No solution",
    "}",
  ],
  Python: [
    "def solve_maze(maze):",
    "    N = len(maze)",
    "    M = len(maze[0])",
    "    sol = [[0 for _ in range(M)] for _ in range(N)]",
    "    def is_safe(r, c):",
    "        return 0 <= r < N and 0 <= c < M and maze[r][c] == 1 and sol[r][c] == 0",
    "    def solve_util(r, c):",
    "        if r == N - 1 and c == M - 1 and maze[r][c] == 1:",
    "            sol[r][c] = 1",
    "            return True",
    "        if is_safe(r, c):",
    "            sol[r][c] = 1",
    "            if solve_util(r + 1, c): return True # Down",
    "            if solve_util(r, c + 1): return True # Right",
    "            # Add other directions if allowed",
    "            sol[r][c] = 0 # Backtrack",
    "            return False",
    "        return False",
    "    if solve_util(0, 0):",
    "        return sol",
    "    return None",
  ],
  Java: [
    "import java.util.Arrays;",
    "class RatInAMaze {",
    "    int N, M;",
    "    boolean isSafe(int r, int c, int maze[][], int sol[][]) {",
    "        return (r >= 0 && r < N && c >= 0 && c < M && maze[r][c] == 1 && sol[r][c] == 0);",
    "    }",
    "    boolean solveMazeUtil(int r, int c, int maze[][], int sol[][]) {",
    "        if (r == N - 1 && c == M - 1 && maze[r][c] == 1) {",
    "            sol[r][c] = 1;",
    "            return true;",
    "        }",
    "        if (isSafe(r, c, maze, sol)) {",
    "            sol[r][c] = 1;",
    "            if (solveMazeUtil(r + 1, c, maze, sol)) return true; // Down",
    "            if (solveMazeUtil(r, c + 1, maze, sol)) return true; // Right",
    "            // Add other directions if allowed",
    "            sol[r][c] = 0; // Backtrack",
    "            return false;",
    "        }",
    "        return false;",
    "    }",
    "    int[][] solve(int maze[][]) {",
    "        N = maze.length; M = maze[0].length;",
    "        int sol[][] = new int[N][M];",
    "        for(int[] row : sol) Arrays.fill(row, 0);",
    "        if (solveMazeUtil(0, 0, maze, sol)) return sol;",
    "        return null;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "bool isSafe(int r, int c, int N, int M, const std::vector<std::vector<int>>& maze, std::vector<std::vector<int>>& sol) {",
    "    return (r >= 0 && r < N && c >= 0 && c < M && maze[r][c] == 1 && sol[r][c] == 0);",
    "}",
    "bool solveMazeUtil(int r, int c, int N, int M, const std::vector<std::vector<int>>& maze, std::vector<std::vector<int>>& sol) {",
    "    if (r == N - 1 && c == M - 1 && maze[r][c] == 1) {",
    "        sol[r][c] = 1; return true;",
    "    }",
    "    if (isSafe(r, c, N, M, maze, sol)) {",
    "        sol[r][c] = 1;",
    "        if (solveMazeUtil(r + 1, c, N, M, maze, sol)) return true; // Down",
    "        if (solveMazeUtil(r, c + 1, N, M, maze, sol)) return true; // Right",
    "        // Add other directions if allowed",
    "        sol[r][c] = 0; // Backtrack",
    "        return false;",
    "    }",
    "    return false;",
    "}",
    "std::vector<std::vector<int>> solveMaze(const std::vector<std::vector<int>>& maze) {",
    "    int N = maze.size();",
    "    if (N == 0) return {};",
    "    int M = maze[0].size();",
    "    std::vector<std::vector<int>> sol(N, std::vector<int>(M, 0));",
    "    if (solveMazeUtil(0, 0, N, M, maze, sol)) return sol;",
    "    return {}; // Return empty if no solution",
    "}",
  ],
};

interface RatInAMazeCodePanelProps {
  currentLine: number | null;
}

export function RatInAMazeCodePanel({ currentLine }: RatInAMazeCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(RAT_IN_MAZE_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const handleCopyCode = () => {
    const codeToCopy = RAT_IN_MAZE_CODE_SNIPPETS[selectedLanguage]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for Rat in a Maze Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: Rat in a Maze
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code">
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="flex flex-col flex-grow overflow-hidden">
          <TabsList className="mx-4 mb-1 self-start shrink-0">
            {languages.map((lang) => (
              <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-1 h-auto">
                {lang}
              </TabsTrigger>
            ))}
          </TabsList>
          {languages.map((lang) => (
            <TabsContent key={lang} value={lang} className="m-0 flex-grow overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
                <pre className="font-code text-sm p-4">
                  {RAT_IN_MAZE_CODE_SNIPPETS[lang]?.map((line, index) => (
                    <div
                      key={`ratmaze-${lang}-line-${index}`}
                      className={`px-2 py-0.5 rounded transition-colors duration-150 ${
                        index + 1 === currentLine && lang === selectedLanguage ? "bg-accent text-accent-foreground" : "text-foreground"
                      }`}
                      aria-current={index + 1 === currentLine && lang === selectedLanguage ? "step" : undefined}
                    >
                      <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                        {index + 1}
                      </span>
                      {line}
                    </div>
                  ))}
                </pre>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
