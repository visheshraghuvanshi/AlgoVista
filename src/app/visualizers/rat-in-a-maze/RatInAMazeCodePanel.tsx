
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RAT_IN_MAZE_LINE_MAP } from './rat-in-a-maze-logic'; // Local import

export const RAT_IN_MAZE_CODE_SNIPPETS = {
  JavaScript: [
    "function findPaths(maze) {",
    "  const solutions = [], visited = maze.map(r => r.map(() => false));",
    "  if (maze[0][0] === 1) {",
    "    solve(0, 0, \"\");",
    "  }",
    "  function solve(r, c, path) {",
    "    if (r === N - 1 && c === M - 1) {",
    "      solutions.push(path);",
    "      return;",
    "    }",
    "    visited[r][c] = true;",
    "    // D, L, R, U",
    "    const dr = [1, 0, 0, -1]; const dc = [0, -1, 1, 0];",
    "    const dir = ['D', 'L', 'R', 'U'];",
    "    for (let i = 0; i < 4; i++) {",
    "      const nextR = r + dr[i]; const nextC = c + dc[i];",
    "      if (isSafe(nextR, nextC)) {",
    "        solve(nextR, nextC, path + dir[i]);",
    "      }",
    "    }",
    "    visited[r][c] = false; // Backtrack",
    "  }",
    "  function isSafe(r, c) {",
    "    return r >= 0 && r < N && c >= 0 && c < M &&",
    "           maze[r][c] === 1 && !visited[r][c];",
    "  }",
    "  return solutions;",
    "}",
  ],
  Python: [
    "def find_paths(maze):",
    "    N, M = len(maze), len(maze[0])",
    "    solutions = []",
    "    visited = [[False for _ in range(M)] for _ in range(N)]",
    "",
    "    def solve(r, c, path):",
    "        if r == N - 1 and c == M - 1:",
    "            solutions.append(path)",
    "            return",
    "",
    "        visited[r][c] = True",
    "        # D, L, R, U",
    "        for dr, dc, move in [(1,0,'D'), (0,-1,'L'), (0,1,'R'), (-1,0,'U')]:",
    "            next_r, next_c = r + dr, c + dc",
    "            if 0 <= next_r < N and 0 <= next_c < M and \\",
    "               maze[next_r][next_c] == 1 and not visited[next_r][next_c]:",
    "                solve(next_r, next_c, path + move)",
    "        visited[r][c] = False # Backtrack",
    "",
    "    if maze[0][0] == 1:",
    "        solve(0, 0, \"\")",
    "    return solutions",
  ],
  Java: [
    "import java.util.*;",
    "class RatInAMaze {",
    "    private List<String> solutions;",
    "    private boolean[][] visited;",
    "    private int N, M;",
    "",
    "    public List<String> findPaths(int[][] maze) {",
    "        N = maze.length; M = maze[0].length;",
    "        solutions = new ArrayList<>();",
    "        visited = new boolean[N][M];",
    "        if (maze[0][0] == 1) {",
    "            solve(0, 0, \"\");",
    "        }",
    "        return solutions;",
    "    }",
    "    private boolean isSafe(int r, int c) {",
    "        return (r >= 0 && r < N && c >= 0 && c < M && maze[r][c] == 1 && !visited[r][c]);",
    "    }",
    "    private void solve(int r, int c, String path) {",
    "        if (r == N - 1 && c == M - 1) {",
    "            solutions.add(path);",
    "            return;",
    "        }",
    "        visited[r][c] = true;",
    "        // D, L, R, U",
    "        int[] dr = {1, 0, 0, -1}; int[] dc = {0, -1, 1, 0};",
    "        char[] dir = {'D', 'L', 'R', 'U'};",
    "        for (int i = 0; i < 4; i++) {",
    "            int nextR = r + dr[i]; int nextC = c + dc[i];",
    "            if (isSafe(nextR, nextC)) {",
    "                solve(nextR, nextC, path + dir[i]);",
    "            }",
    "        }",
    "        visited[r][c] = false; // Backtrack",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <string>",
    "void solve(int r, int c, int N, int M, const auto& maze, auto& visited, std::string& path, auto& solutions) {",
    "    if (r == N - 1 && c == M - 1) {",
    "        solutions.push_back(path);",
    "        return;",
    "    }",
    "    visited[r][c] = true;",
    "    // D, L, R, U",
    "    int dr[] = {1, 0, 0, -1}; int dc[] = {0, -1, 1, 0};",
    "    char dir[] = {'D', 'L', 'R', 'U'};",
    "    for (int i = 0; i < 4; ++i) {",
    "        int nextR = r + dr[i]; int nextC = c + dc[i];",
    "        if (nextR >= 0 && nextR < N && nextC >= 0 && nextC < M &&",
    "            maze[nextR][nextC] == 1 && !visited[nextR][nextC]) {",
    "            path.push_back(dir[i]);",
    "            solve(nextR, nextC, N, M, maze, visited, path, solutions);",
    "            path.pop_back(); // Backtrack",
    "        }",
    "    }",
    "    visited[r][c] = false; // Backtrack",
    "}",
    "std::vector<std::string> findPaths(const std::vector<std::vector<int>>& maze) {",
    "    int N = maze.size(); int M = maze[0].size();",
    "    std::vector<std::string> solutions;",
    "    std::vector<std::vector<bool>> visited(N, std::vector<bool>(M, false));",
    "    std::string currentPath = \"\";",
    "    if (maze[0][0] == 1) {",
    "        solve(0, 0, N, M, maze, visited, currentPath, solutions);",
    "    }",
    "    return solutions;",
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
    const codeToCopy = RAT_IN_MAZE_CODE_SNIPPETS[selectedLanguage as keyof typeof RAT_IN_MAZE_CODE_SNIPPETS]?.join('\n') || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => toast({ title: `${selectedLanguage} Code for Rat in a Maze Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  const currentCodeLines = RAT_IN_MAZE_CODE_SNIPPETS[selectedLanguage as keyof typeof RAT_IN_MAZE_CODE_SNIPPETS] || [];

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: Rat in a Maze (All Paths)
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
              <div key={`ratmaze-${selectedLanguage}-line-${index}`}
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
