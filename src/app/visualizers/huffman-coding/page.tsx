
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2, Binary, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HuffmanNode {
  char: string | null;
  freq: number;
  left?: HuffmanNode | null;
  right?: HuffmanNode | null;
  id?: string; 
}

let huffmanNodeIdCounter = 0;

const HUFFMAN_CODING_CODE_SNIPPETS: Record<string, string[]> = {
  JavaScript: [
    "// Conceptual Huffman Coding Steps",
    "// 1. Calculate frequency of each character.",
    "function calculateFrequencies(str) { /* ... */ }",
    "// 2. Create a leaf node for each character and its frequency.",
    "//    Add these nodes to a min-priority queue.",
    "class HuffmanNode { /* char, freq, left, right */ }",
    "class PriorityQueue { /* enqueue(node), dequeue(), size() */ }",
    "// 3. While the priority queue has more than one node:",
    "function buildHuffmanTree(frequencies) {",
    "  // ... create pq ...",
    "  while (pq.size() > 1) {",
    "    const left = pq.dequeue();",
    "    const right = pq.dequeue();",
    "    const internalNode = new HuffmanNode(null, left.freq + right.freq, left, right);",
    "    pq.enqueue(internalNode);",
    "  }",
    "  return pq.dequeue(); // Root of Huffman Tree",
    "}",
    "// 4. Traverse the Huffman Tree to assign codes:",
    "function generateHuffmanCodes(node, currentCode = '', codes = {}) {",
    "  if (!node) return;",
    "  if (node.char !== null) { codes[node.char] = currentCode || '0'; return codes; }",
    "  generateHuffmanCodes(node.left, currentCode + '0', codes);",
    "  generateHuffmanCodes(node.right, currentCode + '1', codes);",
    "  return codes;",
    "}",
  ],
  Python: [
    "# Conceptual Huffman Coding Steps",
    "# 1. Calculate frequency",
    "def calculate_frequencies(s): # ...",
    "# 2. Create leaf nodes, add to min-heap",
    "import heapq",
    "class HuffmanNode:",
    "    def __init__(self, char, freq, left=None, right=None):",
    "        self.char = char; self.freq = freq; self.left = left; self.right = right",
    "    def __lt__(self, other): return self.freq < other.freq",
    "# 3. Build Huffman Tree",
    "def build_huffman_tree(frequencies):",
    "    pq = [HuffmanNode(char, freq) for char, freq in frequencies.items()]",
    "    heapq.heapify(pq)",
    "    while len(pq) > 1:",
    "        left = heapq.heappop(pq)",
    "        right = heapq.heappop(pq)",
    "        internal = HuffmanNode(None, left.freq + right.freq, left, right)",
    "        heapq.heappush(pq, internal)",
    "    return pq[0] if pq else None",
    "# 4. Generate codes by traversing tree",
    "def generate_codes(node, current_code='', codes={}):",
    "    if node is None: return",
    "    if node.char is not None: codes[node.char] = current_code or '0'; return codes",
    "    generate_codes(node.left, current_code + '0', codes)",
    "    generate_codes(node.right, current_code + '1', codes)",
    "    return codes",
  ],
  Java: [
    "// Conceptual Huffman Coding (Simplified)",
    "import java.util.*;",
    "class HuffmanNode implements Comparable<HuffmanNode> {",
    "    char character; int frequency; HuffmanNode left, right;",
    "    public HuffmanNode(char ch, int freq) { this.character = ch; this.frequency = freq; }",
    "    @Override public int compareTo(HuffmanNode other) { return this.frequency - other.frequency; }",
    "}",
    "public class HuffmanCoding {",
    "  public Map<Character, Integer> calculateFrequencies(String text) { /* ... */ }",
    "  public HuffmanNode buildTree(Map<Character, Integer> freqMap) {",
    "    PriorityQueue<HuffmanNode> pq = new PriorityQueue<>();",
    "    for (Map.Entry<Character, Integer> entry : freqMap.entrySet()) {",
    "      pq.add(new HuffmanNode(entry.getKey(), entry.getValue()));",
    "    }",
    "    while (pq.size() > 1) {",
    "        HuffmanNode left = pq.poll(); HuffmanNode right = pq.poll();",
    "        HuffmanNode internal = new HuffmanNode('\\0', left.frequency + right.frequency);",
    "        internal.left = left; internal.right = right;",
    "        pq.add(internal);",
    "    }",
    "    return pq.poll();",
    "  }",
    "  public void generateCodes(HuffmanNode root, String code, Map<Character, String> huffmanCodes) {",
    "    if (root == null) return;",
    "    if (root.character != '\\0') { huffmanCodes.put(root.character, code.isEmpty() ? \"0\" : code); return; }",
    "    generateCodes(root.left, code + \"0\", huffmanCodes);",
    "    generateCodes(root.right, code + \"1\", huffmanCodes);",
    "  }",
    "}",
  ],
  "C++": [
    "// Conceptual Huffman Coding",
    "#include <string>",
    "#include <vector>",
    "#include <queue>",
    "#include <map>",
    "struct HuffmanNode {",
    "    char data; unsigned freq;",
    "    HuffmanNode *left, *right;",
    "    HuffmanNode(char d, unsigned f) : data(d), freq(f), left(nullptr), right(nullptr) {}",
    "};",
    "struct compare { bool operator()(HuffmanNode* l, HuffmanNode* r) { return (l->freq > r->freq); } };",
    "// HuffmanNode* buildHuffmanTree(std::map<char, unsigned> freq) { /* ... */ }",
    "// void generateCodes(HuffmanNode* root, std::string str, std::map<char, std::string>& codes) { /* ... */ }",
  ],
};


export default function HuffmanCodingVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [inputText, setInputText] = useState("ABBCBCADEFGH");
  const [frequencies, setFrequencies] = useState<Record<string, number>>({});
  const [huffmanCodes, setHuffmanCodes] = useState<Record<string, string>>({});
  const [huffmanTreeString, setHuffmanTreeString] = useState<string>(""); 

  useEffect(() => {
    setIsClient(true);
    if (algorithmMetadata) { 
       toast({
            title: "Conceptual Overview & Code",
            description: `Interactive Huffman Tree building animation is complex and under construction. This page shows results and conceptual code.`,
            variant: "default",
            duration: 6000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for ${algorithmMetadata?.slug || 'Huffman Coding'} not found.`, variant: "destructive" });
    }
  }, [toast]);
  
  const generateHuffmanData = () => {
    huffmanNodeIdCounter = 0; 
    if (!inputText.trim()) {
      toast({ title: "Input Empty", description: "Please enter a string to encode.", variant: "destructive"});
      setFrequencies({}); setHuffmanCodes({}); setHuffmanTreeString("");
      return;
    }

    const freqs: Record<string, number> = {};
    for (const char of inputText) {
      freqs[char] = (freqs[char] || 0) + 1;
    }
    setFrequencies(freqs);

    const pq: HuffmanNode[] = Object.entries(freqs)
      .map(([char, freq]) => ({ char, freq, left: null, right: null, id: `node-${char}-${huffmanNodeIdCounter++}` }))
      .sort((a, b) => a.freq - b.freq || a.char!.localeCompare(b.char!)); 

    if (pq.length === 0) { 
        setHuffmanCodes({}); setHuffmanTreeString("No characters to encode.");
        return;
    }
     if (pq.length === 1) { 
        const singleCharNode = pq[0];
        setHuffmanCodes({ [singleCharNode.char!]: "0" });
        setHuffmanTreeString(`( ${singleCharNode.char}:${singleCharNode.freq} )`);
        toast({title: "Huffman Data Generated", description: "Frequencies and codes calculated."});
        return;
    }


    while (pq.length > 1) {
      pq.sort((a, b) => a.freq - b.freq || (a.id && b.id ? a.id.localeCompare(b.id) : 0)); 
      const left = pq.shift()!;
      const right = pq.shift()!;
      const internalNode: HuffmanNode = { 
          char: null, 
          freq: left.freq + right.freq, 
          left, 
          right,
          id: `internal-${huffmanNodeIdCounter++}`
        };
      pq.push(internalNode);
    }
    const treeRoot = pq[0] || null;
    
    const generateTreeString = (node: HuffmanNode | null | undefined, prefix = "", isLeft = true): string => {
        if (!node) return "";
        let str = prefix;
        if (prefix) {
            str += (isLeft ? "├── " : "└── ");
        }
        str += node.char !== null ? `(${node.char}:${node.freq})` : `[${node.freq}]`;
        str += "\n";
        
        const children = [];
        if(node.left) children.push(node.left);
        if(node.right) children.push(node.right);

        for(let i=0; i < children.length; i++){
            const child = children[i];
            const isLastChild = i === children.length -1;
            // Determine if the current child is the left child for the next prefix
            str += generateTreeString(child, prefix + (isLeft && prefix.endsWith("├── ") ? "│   " : (isLeft ? "    " : "    ") ) , node.left === child && node.right !== null);
        }
        return str;
    };
    setHuffmanTreeString(treeRoot ? generateTreeString(treeRoot) : "Tree could not be built.");


    const codes: Record<string, string> = {};
    function getCodes(node: HuffmanNode | null | undefined, currentCode: string) {
      if (!node) return;
      if (node.char !== null) {
        codes[node.char] = currentCode || (Object.keys(freqs).length === 1 ? "0" : "");
        return;
      }
      getCodes(node.left, currentCode + "0");
      getCodes(node.right, currentCode + "1");
    }
    if (treeRoot) getCodes(treeRoot, "");
    setHuffmanCodes(codes);
    
    toast({title: "Huffman Data Generated", description: "Frequencies and codes calculated."});
  };

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!isClient) {
    return (
        <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>
    );
  }
  if (!algoDetails) { 
    return (
      <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Binary className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Input & Controls</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="huffmanInputString">Input String:</Label>
                <Input id="huffmanInputString" type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="e.g., aabbc" />
              </div>
              <Button onClick={generateHuffmanData} className="w-full">
                <PlayCircle className="mr-2 h-4 w-4"/> Generate Frequencies & Codes
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Results</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-muted-foreground">Character Frequencies:</h3>
                <ScrollArea className="h-20 mt-1 border p-2 rounded-md bg-muted/20">
                  {Object.entries(frequencies).length > 0 ? (
                    <ul className="text-sm">
                      {Object.entries(frequencies).map(([char, freq]) => (
                        <li key={char}>'{char}': {freq}</li>
                      ))}
                    </ul>
                  ) : <p className="text-xs text-muted-foreground italic">No input processed.</p>}
                </ScrollArea>
              </div>
              <div>
                <h3 className="font-semibold text-muted-foreground">Huffman Codes:</h3>
                <ScrollArea className="h-20 mt-1 border p-2 rounded-md bg-muted/20">
                  {Object.entries(huffmanCodes).length > 0 ? (
                    <ul className="text-sm font-code">
                      {Object.entries(huffmanCodes).map(([char, code]) => (
                        <li key={char}>'{char}': {code}</li>
                      ))}
                    </ul>
                  ) : <p className="text-xs text-muted-foreground italic">No codes generated.</p>}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
         <Card className="shadow-lg mb-8">
            <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Conceptual Huffman Tree</CardTitle></CardHeader>
            <CardContent>
                <ScrollArea className="h-48 border p-2 rounded-md bg-muted/20">
                    <pre className="font-code text-xs">{huffmanTreeString || "Enter text and generate to see conceptual tree."}</pre>
                </ScrollArea>
                <p className="text-xs text-muted-foreground mt-1">Note: This is a textual representation. Interactive tree visualization is under construction.</p>
            </CardContent>
        </Card>
        
        <div className="text-center my-10 p-6 border rounded-lg shadow-lg bg-card">
            <Construction className="mx-auto h-12 w-12 text-primary/80 dark:text-accent/80 mb-4" />
            <h2 className="font-headline text-xl font-bold tracking-tight mb-2">
                Interactive Tree Visualization Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                The step-by-step interactive visualizer for Huffman Tree construction and code assignment is under development.
            </p>
        </div>

        <Card className="shadow-lg rounded-lg h-auto flex flex-col mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                    <Code2 className="mr-2 h-5 w-5" /> Conceptual Code Snippets
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
              <Tabs defaultValue="JavaScript" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-2 px-2">
                  {Object.keys(HUFFMAN_CODING_CODE_SNIPPETS).map(lang => (
                    <TabsTrigger key={lang} value={lang} className="text-xs md:text-sm">{lang}</TabsTrigger>
                  ))}
                </TabsList>
                {Object.entries(HUFFMAN_CODING_CODE_SNIPPETS).map(([lang, snippet]) => (
                  <TabsContent key={lang} value={lang}>
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[400px] md:max-h-[500px]">
                      <pre className="font-code text-sm p-4">
                          {snippet.map((line, index) => (
                          <div key={`${lang}-line-${index}`} className="px-2 py-0.5 rounded text-foreground whitespace-pre-wrap">
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
        
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    

    