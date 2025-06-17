
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
        // Indent operation methods correctly based on language syntax
        const indent = (selectedLanguage === "Python") ? "    " : "  "; // Python uses 4 spaces, others 2 for methods
        const operationIndented = opCodeString.split('\n').map(line => {
            // Avoid indenting comments or preprocessor directives at the start of the operation snippet block
            if (line.trim().startsWith("#") || line.trim().startsWith("//")) return line;
            return `${indent}${line}`;
        }).join('\n');
        
        if (selectedLanguage === "JavaScript" || selectedLanguage === "Java" || selectedLanguage === "C++") {
            // Find the last line of structure code to insert operation methods before the class closing brace
            let lastStructBraceIndex = -1;
            for(let i = structureCode.length -1; i >= 0; i--) {
                if(structureCode[i].trim() === "}") {
                    lastStructBraceIndex = i;
                    break;
                }
            }
            if(lastStructBraceIndex !== -1) {
                fullCode = structureCode.slice(0, lastStructBraceIndex).join('\n') + 
                           "\n" + operationIndented + "\n" + 
                           structureCode.slice(lastStructBraceIndex).join('\n');
            } else { // Fallback if no closing brace found (should not happen with current snippets)
                fullCode = `${baseStructure}\n${operationIndented}\n}`; 
            }
        } else if (selectedLanguage === "Python") {
             fullCode = `${baseStructure}\n${operationIndented}`; 
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
            <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
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
                    {index + 1 + (effectiveOp !== 'structure' && structureCode.length > 0 ? structureCode.length + 1 : 0) } 
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

