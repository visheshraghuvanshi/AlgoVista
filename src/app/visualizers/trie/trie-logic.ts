
import type { TrieStep, TrieNodeInternal, TrieNodeVisual, TrieEdgeVisual } from '@/types';

export const TRIE_LINE_MAP = {
  // Conceptual structure lines
  classNodeStart: 1,
  nodeConstructor: 2,
  classTrieStart: 3,
  trieConstructor: 4,
  // Insert
  insertFuncStart: 5,
  insertLoopChar: 6,
  insertCheckChildExists: 7,
  insertCreateChild: 8,
  insertMoveToChild: 9,
  insertMarkEndOfWord: 10,
  insertFuncEnd: 11,
  // Search
  searchFuncStart: 12,
  searchLoopChar: 13,
  searchCheckChildExists: 14,
  searchMoveToChild: 15,
  searchReturnFound: 16, // current.isEndOfWord
  searchFuncEnd: 17,
  // StartsWith
  startsWithFuncStart: 18,
  startsWithLoopChar: 19,
  startsWithCheckChildExists: 20,
  startsWithMoveToChild: 21,
  startsWithReturnTrue: 22, // Found prefix
  startsWithFuncEnd: 23,
};

let globalTrieNodeIdCounter = 0;
const generateTrieNodeId = (char: string | null, depth: number): string => `trie-${char === null ? 'root' : char}-${depth}-${globalTrieNodeIdCounter++}`;

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  active: "hsl(var(--primary))",
  path: "hsl(var(--accent))",
  endOfWord: "hsl(var(--ring))", // A distinct color for EOW nodes
  created: "hsl(var(--chart-2))", // Newly created node
};
const TEXT_COLORS = {
    default: "hsl(var(--secondary-foreground))",
    active: "hsl(var(--primary-foreground))",
    path: "hsl(var(--accent-foreground))",
    endOfWord: "hsl(var(--primary-foreground))",
};

function addStep(
  steps: TrieStep[],
  nodesMap: Map<string, TrieNodeInternal>,
  rootId: string,
  line: number | null,
  operation: TrieStep['operation'],
  message: string,
  currentWord?: string,
  currentCharIndex?: number,
  currentNodeId?: string | null,
  pathTakenIds?: string[],
  found?: boolean,
  auxData?: TrieStep['auxiliaryData']
) {
  const { visualNodes, visualEdges } = mapTrieToVisual(nodesMap, rootId, currentNodeId, pathTakenIds, []);
  steps.push({
    nodes: visualNodes,
    edges: visualEdges,
    operation, currentWord, currentCharIndex, currentNodeId, pathTakenIds, message, found,
    currentLine: line,
    auxiliaryData,
  });
}

function mapTrieToVisual(
  nodesMap: Map<string, TrieNodeInternal>,
  rootId: string,
  activeNodeId?: string | null,
  pathNodeIds: string[] = [],
  highlightedWordNodeIds: string[] = [] // Nodes that form a successfully searched word
): { visualNodes: TrieNodeVisual[], visualEdges: TrieEdgeVisual[] } {
  const visualNodes: TrieNodeVisual[] = [];
  const visualEdges: TrieEdgeVisual[] = [];
  if (!nodesMap.has(rootId)) return { visualNodes, visualEdges };

  const HORIZONTAL_SPACING = 50;
  const VERTICAL_SPACING = 60;
  const SVG_WIDTH_CENTER = 300;

  // BFS-like traversal to calculate positions
  const queue: { nodeId: string; x: number; y: number; depth: number }[] = [{ nodeId: rootId, x: SVG_WIDTH_CENTER, y: 50, depth: 0 }];
  const visitedForLayout = new Set<string>();

  while (queue.length > 0) {
    const { nodeId, x, y, depth } = queue.shift()!;
    if (visitedForLayout.has(nodeId)) continue;
    visitedForLayout.add(nodeId);

    const nodeInternal = nodesMap.get(nodeId)!;
    let nodeColor = NODE_COLORS.default;
    let textColor = TEXT_COLORS.default;

    if (pathNodeIds.includes(nodeId)) { nodeColor = NODE_COLORS.path; textColor = TEXT_COLORS.path; }
    if (activeNodeId === nodeId) { nodeColor = NODE_COLORS.active; textColor = TEXT_COLORS.active; }
    if (nodeInternal.isEndOfWord) { 
        nodeColor = NODE_COLORS.endOfWord; textColor = TEXT_COLORS.endOfWord;
        if(pathNodeIds.includes(nodeId) || activeNodeId === nodeId) { // If EOW and also on path/active
            nodeColor = NODE_COLORS.endOfWord; // EOW color takes precedence
            textColor = TEXT_COLORS.endOfWord;
        }
    }
     if (nodeInternal.visualColor) nodeColor = nodeInternal.visualColor; // For newly created nodes


    visualNodes.push({
      id: nodeId,
      label: nodeInternal.char === null ? 'ROOT' : nodeInternal.char,
      x, y, isEndOfWord: nodeInternal.isEndOfWord,
      color: nodeColor,
      textColor: textColor,
    });

    const childrenIds = Array.from(nodeInternal.children.values());
    const numChildren = childrenIds.length;
    // Calculate width needed for children
    const childrenSubtreeWidth = (numChildren -1) * HORIZONTAL_SPACING;
    let startX = x - childrenSubtreeWidth / 2;

    childrenIds.sort((a,b) => (nodesMap.get(a)?.char || "").localeCompare(nodesMap.get(b)?.char || "")).forEach((childId) => {
      if (nodesMap.has(childId) && !visitedForLayout.has(childId)) {
        visualEdges.push({ id: `edge-${nodeId}-${childId}`, sourceId: nodeId, targetId: childId, color: "hsl(var(--muted-foreground))" });
        queue.push({ nodeId: childId, x: startX, y: y + VERTICAL_SPACING, depth: depth + 1 });
        startX += HORIZONTAL_SPACING;
      }
    });
  }
  return { visualNodes, visualEdges };
}


export const generateTrieSteps = (
  currentTrie: { rootId: string; nodesMap: Map<string, TrieNodeInternal> },
  operation: 'insert' | 'search' | 'startsWith',
  word: string
): TrieStep[] => {
  const localSteps: TrieStep[] = [];
  const { rootId, nodesMap } = currentTrie;
  const lm = TRIE_LINE_MAP;
  let currentId = rootId;
  const pathTakenIds: string[] = [rootId];

  addStep(localSteps, nodesMap, rootId, null, operation, `Operation: ${operation}('${word}')`, word, -1, rootId, [...pathTakenIds]);

  if (operation === 'insert') {
    addStep(localSteps, nodesMap, rootId, lm.insertFuncStart, operation, `Insert: Start traversing for '${word}'.`, word, -1, rootId, [...pathTakenIds]);
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      addStep(localSteps, nodesMap, rootId, lm.insertLoopChar, operation, `Insert: Processing char '${char}'. Current node: ${nodesMap.get(currentId)?.char || 'ROOT'}.`, word, i, currentId, [...pathTakenIds]);
      
      let currentInternalNode = nodesMap.get(currentId)!;
      addStep(localSteps, nodesMap, rootId, lm.insertCheckChildExists, operation, `Insert: Does current node have child '${char}'?`, word, i, currentId, [...pathTakenIds]);
      if (!currentInternalNode.children.has(char)) {
        const newNodeId = generateTrieNodeId(char, currentInternalNode.depth! + 1);
        nodesMap.set(newNodeId, { id: newNodeId, char, isEndOfWord: false, children: new Map(), parentId: currentId, depth: currentInternalNode.depth! + 1, visualColor: NODE_COLORS.created });
        currentInternalNode.children.set(char, newNodeId);
        nodesMap.set(currentId, currentInternalNode); // Update parent's children map
        addStep(localSteps, nodesMap, rootId, lm.insertCreateChild, operation, `Insert: Child '${char}' not found. Created new node.`, word, i, currentId, [...pathTakenIds]);
         // Reset visualColor after creation step
        setTimeout(() => { if(nodesMap.has(newNodeId)) nodesMap.get(newNodeId)!.visualColor = undefined; }, 0);
      } else {
         addStep(localSteps, nodesMap, rootId, lm.insertCheckChildExists, operation, `Insert: Child '${char}' found.`, word, i, currentId, [...pathTakenIds]);
      }
      currentId = currentInternalNode.children.get(char)!;
      pathTakenIds.push(currentId);
      addStep(localSteps, nodesMap, rootId, lm.insertMoveToChild, operation, `Insert: Moved to node '${char}'.`, word, i, currentId, [...pathTakenIds]);
    }
    nodesMap.get(currentId)!.isEndOfWord = true;
    addStep(localSteps, nodesMap, rootId, lm.insertMarkEndOfWord, operation, `Insert: Marked node '${nodesMap.get(currentId)?.char}' as end of word for '${word}'.`, word, word.length -1, currentId, [...pathTakenIds]);
    addStep(localSteps, nodesMap, rootId, lm.insertFuncEnd, operation, `Insert for '${word}' complete.`, word, undefined, undefined, [...pathTakenIds], undefined, {insertedWords: Array.from(nodesMap.values()).filter(n=>n.isEndOfWord).map(n=>n.char!)});

  } else if (operation === 'search' || operation === 'startsWith') {
    const opStartLine = operation === 'search' ? lm.searchFuncStart : lm.startsWithFuncStart;
    const loopCharLine = operation === 'search' ? lm.searchLoopChar : lm.startsWithLoopChar;
    const checkChildLine = operation === 'search' ? lm.searchCheckChildExists : lm.startsWithCheckChildExists;
    const moveToChildLine = operation === 'search' ? lm.searchMoveToChild : lm.startsWithMoveToChild;
    const returnFoundLine = operation === 'search' ? lm.searchReturnFound : lm.startsWithReturnTrue;
    const opEndLine = operation === 'search' ? lm.searchFuncEnd : lm.startsWithFuncEnd;

    addStep(localSteps, nodesMap, rootId, opStartLine, operation, `${operation}: Start traversing for '${word}'.`, word, -1, rootId, [...pathTakenIds]);
    let found = true;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      addStep(localSteps, nodesMap, rootId, loopCharLine, operation, `${operation}: Processing char '${char}'. Current node: ${nodesMap.get(currentId)?.char || 'ROOT'}.`, word, i, currentId, [...pathTakenIds]);
      
      const currentInternalNode = nodesMap.get(currentId)!;
      addStep(localSteps, nodesMap, rootId, checkChildLine, operation, `${operation}: Does current node have child '${char}'?`, word, i, currentId, [...pathTakenIds]);
      if (!currentInternalNode.children.has(char)) {
        addStep(localSteps, nodesMap, rootId, checkChildLine, operation, `${operation}: Child '${char}' not found. ${word} does not exist.`, word, i, currentId, [...pathTakenIds], false);
        found = false;
        break;
      }
      addStep(localSteps, nodesMap, rootId, checkChildLine, operation, `${operation}: Child '${char}' found.`, word, i, currentId, [...pathTakenIds]);
      currentId = currentInternalNode.children.get(char)!;
      pathTakenIds.push(currentId);
      addStep(localSteps, nodesMap, rootId, moveToChildLine, operation, `${operation}: Moved to node '${char}'.`, word, i, currentId, [...pathTakenIds]);
    }

    if (found && operation === 'search') {
      found = nodesMap.get(currentId)!.isEndOfWord;
      addStep(localSteps, nodesMap, rootId, returnFoundLine, operation, `Search: Path for '${word}' exists. Is it marked as end of word? ${found}.`, word, word.length - 1, currentId, [...pathTakenIds], found);
    } else if (found && operation === 'startsWith') {
      addStep(localSteps, nodesMap, rootId, returnFoundLine, operation, `StartsWith: Prefix '${word}' found.`, word, word.length - 1, currentId, [...pathTakenIds], true);
    }
    addStep(localSteps, nodesMap, rootId, opEndLine, operation, `${operation} for '${word}' complete. Result: ${found}.`, word, undefined, undefined, [...pathTakenIds], found);
  }
  return localSteps;
};

export const createInitialTrie = (): { rootId: string; nodesMap: Map<string, TrieNodeInternal> } => {
  globalTrieNodeIdCounter = 0;
  const rootId = generateTrieNodeId(null, 0);
  const nodesMap = new Map<string, TrieNodeInternal>();
  nodesMap.set(rootId, { id: rootId, char: null, isEndOfWord: false, children: new Map(), depth: 0 });
  return { rootId, nodesMap };
};

```
  </change>
  <change>
    <file>/src/app/visualizers/trie/TrieCodePanel.tsx</file>
    <content><![CDATA[
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TRIE_LINE_MAP } from './trie-logic';

const TRIE_CODE_SNIPPETS: Record<string, Record<string, string[]>> = {
  JavaScript: {
    structure: [
      "class TrieNode {",
      "  constructor() {",
      "    this.children = new Map();",
      "    this.isEndOfWord = false;",
      "  }",
      "}",
      "class Trie {",
      "  constructor() {",
      "    this.root = new TrieNode();",
      "  }",
    ],
    insert: [
      "  insert(word) {",
      "    let current = this.root;",
      "    for (const char of word) {",
      "      if (!current.children.has(char)) {",
      "        current.children.set(char, new TrieNode());",
      "      }",
      "      current = current.children.get(char);",
      "    }",
      "    current.isEndOfWord = true;",
      "  }",
    ],
    search: [
      "  search(word) {",
      "    let current = this.root;",
      "    for (const char of word) {",
      "      if (!current.children.has(char)) return false;",
      "      current = current.children.get(char);",
      "    }",
      "    return current.isEndOfWord;",
      "  }",
    ],
    startsWith: [
      "  startsWith(prefix) {",
      "    let current = this.root;",
      "    for (const char of prefix) {",
      "      if (!current.children.has(char)) return false;",
      "      current = current.children.get(char);",
      "    }",
      "    return true;",
      "  }",
      "}", // Closing Trie class
    ],
  },
  Python: {
    structure: [
      "class TrieNode:",
      "    def __init__(self):",
      "        self.children = {}",
      "        self.is_end_of_word = False",
      "",
      "class Trie:",
      "    def __init__(self):",
      "        self.root = TrieNode()",
    ],
    insert: [
      "    def insert(self, word: str):",
      "        current = self.root",
      "        for char in word:",
      "            if char not in current.children:",
      "                current.children[char] = TrieNode()",
      "            current = current.children[char]",
      "        current.is_end_of_word = True",
    ],
    search: [
      "    def search(self, word: str) -> bool:",
      "        current = self.root",
      "        for char in word:",
      "            if char not in current.children:",
      "                return False",
      "            current = current.children[char]",
      "        return current.is_end_of_word",
    ],
    startsWith: [
      "    def starts_with(self, prefix: str) -> bool:",
      "        current = self.root",
      "        for char in prefix:",
      "            if char not in current.children:",
      "                return False",
      "            current = current.children[char]",
      "        return True",
    ],
  },
  Java: {
    structure: [
      "import java.util.HashMap;",
      "import java.util.Map;",
      "class TrieNode {",
      "    Map<Character, TrieNode> children = new HashMap<>();",
      "    boolean isEndOfWord = false;",
      "}",
      "class Trie {",
      "    TrieNode root;",
      "    public Trie() { root = new TrieNode(); }",
    ],
    insert: [
      "    public void insert(String word) {",
      "        TrieNode current = root;",
      "        for (char ch : word.toCharArray()) {",
      "            current.children.putIfAbsent(ch, new TrieNode());",
      "            current = current.children.get(ch);",
      "        }",
      "        current.isEndOfWord = true;",
      "    }",
    ],
    search: [
      "    public boolean search(String word) {",
      "        TrieNode current = root;",
      "        for (char ch : word.toCharArray()) {",
      "            TrieNode node = current.children.get(ch);",
      "            if (node == null) return false;",
      "            current = node;",
      "        }",
      "        return current.isEndOfWord;",
      "    }",
    ],
    startsWith: [
      "    public boolean startsWith(String prefix) {",
      "        TrieNode current = root;",
      "        for (char ch : prefix.toCharArray()) {",
      "            TrieNode node = current.children.get(ch);",
      "            if (node == null) return false;",
      "            current = node;",
      "        }",
      "        return true;",
      "    }",
      "}", // Closing Trie class
    ],
  },
  "C++": {
     structure: [
      "#include <string>",
      "#include <unordered_map>",
      "#include <memory>",
      "struct TrieNode {",
      "    std::unordered_map<char, std::unique_ptr<TrieNode>> children;",
      "    bool isEndOfWord = false;",
      "};",
      "class Trie {",
      "public:",
      "    std::unique_ptr<TrieNode> root;",
      "    Trie() : root(std::make_unique<TrieNode>()) {}",
    ],
    insert: [
      "    void insert(const std::string& word) {",
      "        TrieNode* current = root.get();",
      "        for (char ch : word) {",
      "            if (current->children.find(ch) == current->children.end()) {",
      "                current->children[ch] = std::make_unique<TrieNode>();",
      "            }",
      "            current = current->children[ch].get();",
      "        }",
      "        current->isEndOfWord = true;",
      "    }",
    ],
    search: [
      "    bool search(const std::string& word) {",
      "        TrieNode* current = root.get();",
      "        for (char ch : word) {",
      "            if (current->children.find(ch) == current->children.end()) {",
      "                return false;",
      "            }",
      "            current = current->children[ch].get();",
      "        }",
      "        return current->isEndOfWord;",
      "    }",
    ],
    startsWith: [
      "    bool startsWith(const std::string& prefix) {",
      "        TrieNode* current = root.get();",
      "        for (char ch : prefix) {",
      "            if (current->children.find(ch) == current->children.end()) {",
      "                return false;",
      "            }",
      "            current = current->children[ch].get();",
      "        }",
      "        return true;",
      "    }",
      "};", // Closing Trie class
    ],
  }
};


interface TrieCodePanelProps {
  currentLine: number | null;
  selectedOperation: 'insert' | 'search' | 'startsWith' | 'init';
}

export function TrieCodePanel({ currentLine, selectedOperation }: TrieCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(TRIE_CODE_SNIPPETS), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const effectiveOp = selectedOperation === 'init' ? 'structure' : selectedOperation;

  const codeToDisplay = TRIE_CODE_SNIPPETS[selectedLanguage]?.[effectiveOp] || [];
  const structureCode = TRIE_CODE_SNIPPETS[selectedLanguage]?.structure || [];


  const handleCopyCode = () => {
    const opCodeString = codeToDisplay.join('\n');
    let fullCode = "";
    if (effectiveOp !== 'structure') {
        const baseStructure = structureCode.join('\n');
        const operationIndented = opCodeString.split('\n').map(line => `    ${line}`).join('\n'); // Indent op methods
        if (selectedLanguage === "JavaScript" || selectedLanguage === "Java" || selectedLanguage === "C++") {
            fullCode = `${baseStructure}\n${operationIndented}\n}`; // Close class
        } else if (selectedLanguage === "Python") {
             fullCode = `${baseStructure}\n${operationIndented}`; // Python uses indentation
        }
    } else {
        fullCode = structureCode.join('\n');
    }
    
    if (fullCode) {
      navigator.clipboard.writeText(fullCode)
        .then(() => toast({ title: `${selectedLanguage} Trie Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const operationTitle = effectiveOp.charAt(0).toUpperCase() + effectiveOp.slice(1);

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: Trie {operationTitle}
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
          <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
            <pre className="font-code text-sm p-4 whitespace-pre-wrap">
              {effectiveOp !== 'structure' && structureCode.length > 0 && (
                <>
                  {structureCode.map((line, index) => (
                    <div key={`struct-${selectedLanguage}-${index}`} className="px-2 py-0.5 rounded text-muted-foreground/70 opacity-70">
                      <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                      {line}
                    </div>
                  ))}
                  <div className="my-1 border-b border-dashed border-muted-foreground/30"></div>
                </>
              )}
              {codeToDisplay.map((line, index) => (
                <div
                  key={`op-${selectedLanguage}-${index}`}
                  className={`px-2 py-0.5 rounded ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}
                >
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                    {/* Line numbers relative to the specific operation snippet for highlighting */}
                    {index + 1 + (effectiveOp !== 'structure' ? structureCode.length +1 : 0) } 
                  </span>
                  {line}
                </div>
              ))}
            </pre>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

