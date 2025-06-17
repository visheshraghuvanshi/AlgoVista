
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HUFFMAN_CODING_LINE_MAP } from './huffman-coding-logic'; // For line mapping

export const HUFFMAN_CODING_CODE_SNIPPETS_ALL_LANG: Record<string, string[]> = {
  JavaScript: [
    "// Huffman Coding Algorithm",
    "// 1. Calculate character frequencies",
    "function getFrequencies(text) { /* ... */ }",         // LINE_MAP.freqCalcStart to freqCalcEnd
    "",
    "// Node for Huffman Tree",
    "class HuffmanNode {",                                 // LINE_MAP.nodeClassStart
    "  constructor(char, freq, left = null, right = null) {",
    "    this.char = char; this.freq = freq;",
    "    this.left = left; this.right = right;",
    "  }",
    "}",                                                    // LINE_MAP.nodeClassEnd
    "",
    "// Build Huffman Tree using a Min-Priority Queue",
    "function buildHuffmanTree(frequencies) {",            // LINE_MAP.buildTreeFuncStart
    "  // Create leaf nodes and add to priority queue",
    "  const pq = []; // Conceptual: use a MinPriorityQueue", // LINE_MAP.initPQ
    "  for (const [char, freq] of Object.entries(frequencies)) {", // LINE_MAP.pqAddLeafLoopStart
    "    pq.push(new HuffmanNode(char, freq));",          // LINE_MAP.pqAddLeafNode
    "  }",
    "  // Sort pq by frequency (simulating min-heap behavior)",
    "  pq.sort((a, b) => a.freq - b.freq);",               // LINE_MAP.pqSort (Conceptual for Min-Heap)
    "",
    "  while (pq.length > 1) {",                           // LINE_MAP.buildTreeLoopStart
    "    const left = pq.shift(); // Dequeue min",        // LINE_MAP.dequeueLeft
    "    const right = pq.shift(); // Dequeue next min",   // LINE_MAP.dequeueRight
    "    const internalNode = new HuffmanNode(null, left.freq + right.freq, left, right);", // LINE_MAP.createInternalNode
    "    pq.push(internalNode);",                         // LINE_MAP.enqueueInternalNode
    "    pq.sort((a, b) => a.freq - b.freq); // Re-sort (Simulate Min-Heap property)", // LINE_MAP.pqReSort
    "  }",
    "  return pq[0]; // Root of Huffman Tree",              // LINE_MAP.returnTreeRoot
    "}",                                                    // LINE_MAP.buildTreeFuncEnd
    "",
    "// Generate Huffman codes by traversing the tree",
    "function generateCodes(node, currentCode, codesMap) {", // LINE_MAP.generateCodesFuncStart
    "  if (!node) return;",
    "  if (node.char !== null) {",                         // LINE_MAP.checkLeafNodeForCode
    "    codesMap[node.char] = currentCode || '0';",      // LINE_MAP.assignCodeToChar (Handle single node tree)
    "    return;",
    "  }",
    "  generateCodes(node.left, currentCode + '0', codesMap);", // LINE_MAP.recursiveCallLeftCode
    "  generateCodes(node.right, currentCode + '1', codesMap);",// LINE_MAP.recursiveCallRightCode
    "}",                                                    // LINE_MAP.generateCodesFuncEnd
  ],
  Python: [
    "# Huffman Coding Algorithm",
    "import heapq",
    "from collections import Counter",
    "",
    "class HuffmanNode:",
    "    def __init__(self, char, freq, left=None, right=None):",
    "        self.char = char",
    "        self.freq = freq",
    "        self.left = left",
    "        self.right = right",
    "    def __lt__(self, other): # For priority queue comparison",
    "        return self.freq < other.freq",
    "",
    "def build_huffman_tree(text):",
    "    frequencies = Counter(text)",
    "    pq = [HuffmanNode(char, freq) for char, freq in frequencies.items()]",
    "    heapq.heapify(pq) # Build min-heap",
    "",
    "    while len(pq) > 1:",
    "        left = heapq.heappop(pq)",
    "        right = heapq.heappop(pq)",
    "        internal_node = HuffmanNode(None, left.freq + right.freq, left, right)",
    "        heapq.heappush(pq, internal_node)",
    "    return pq[0] if pq else None",
    "",
    "def generate_codes(node, current_code='', codes_map=None):",
    "    if codes_map is None: codes_map = {}",
    "    if node is None: return",
    "    if node.char is not None:",
    "        codes_map[node.char] = current_code or '0'",
    "        return codes_map",
    "    generate_codes(node.left, current_code + '0', codes_map)",
    "    generate_codes(node.right, current_code + '1', codes_map)",
    "    return codes_map",
  ],
  // Conceptual Java and C++ would follow similar logic
};

interface HuffmanCodingCodePanelProps {
  currentLine: number | null;
}

export function HuffmanCodingCodePanel({ currentLine }: HuffmanCodingCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(HUFFMAN_CODING_CODE_SNIPPETS_ALL_LANG), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const codeToDisplay = HUFFMAN_CODING_CODE_SNIPPETS_ALL_LANG[selectedLanguage] || [];

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} Huffman Coding Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Conceptual Code Snippets
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={codeToDisplay.length === 0}>
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
            <pre className="font-code text-sm p-4">
              {codeToDisplay.map((line, index) => (
                <div
                  key={`huffman-${selectedLanguage}-line-${index}`}
                  className={`px-2 py-0.5 rounded whitespace-pre-wrap ${
                    index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"
                  }`}
                  aria-current={index + 1 === currentLine ? "step" : undefined}
                >
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                    {index + 1}
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
