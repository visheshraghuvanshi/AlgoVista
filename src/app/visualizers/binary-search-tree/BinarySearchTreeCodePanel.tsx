
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BSTOperationType } from './binary-search-tree-logic';
import { BST_OPERATION_LINE_MAPS } from './binary-search-tree-logic';

// Combined structure and operations into one map for easier language switching
export const BST_CODE_SNIPPETS_ALL_LANG: Record<BSTOperationType | 'structure', Record<string, string[]>> = {
  structure: {
    JavaScript: [
      "class Node {",
      "  constructor(value) {",
      "    this.value = value; this.left = null; this.right = null;",
      "  }",
      "}",
      "class BinarySearchTree {",
      "  constructor() { this.root = null; }",
      "  // ... operations below ...",
      "}",
    ],
    Python: [
      "class Node:",
      "    def __init__(self, value):",
      "        self.value = value",
      "        self.left = None",
      "        self.right = None",
      "",
      "class BinarySearchTree:",
      "    def __init__(self):",
      "        self.root = None",
      "    # ... operations below ...",
    ],
    Java: [
      "class Node {",
      "    int value;",
      "    Node left, right;",
      "    public Node(int item) {",
      "        value = item;",
      "        left = right = null;",
      "    }",
      "}",
      "class BinarySearchTree {",
      "    Node root;",
      "    BinarySearchTree() { root = null; }",
      "    // ... operations below ...",
      "}",
    ],
    "C++": [
      "struct Node {",
      "    int value;",
      "    Node *left, *right;",
      "    Node(int item) : value(item), left(nullptr), right(nullptr) {}",
      "};",
      "class BinarySearchTree {",
      "public:",
      "    Node *root;",
      "    BinarySearchTree() : root(nullptr) {}",
      "    // ... operations below ...",
      "};",
    ],
  },
  insert: {
    JavaScript: [
      "insert(value) {",
      "  this.root = this._insertRec(this.root, value);",
      "}",
      "_insertRec(node, value) {",
      "  if (node === null) return new Node(value);",
      "  if (value < node.value) {",
      "    node.left = this._insertRec(node.left, value);",
      "  } else if (value > node.value) {",
      "    node.right = this._insertRec(node.right, value);",
      "  }",
      "  return node;",
      "}",
    ],
    Python: [
      "    def insert(self, value):",
      "        self.root = self._insert_rec(self.root, value)",
      "    ",
      "    def _insert_rec(self, node, value):",
      "        if node is None:",
      "            return Node(value)",
      "        if value < node.value:",
      "            node.left = self._insert_rec(node.left, value)",
      "        elif value > node.value:",
      "            node.right = self._insert_rec(node.right, value)",
      "        return node",
    ],
    Java: [
      "    public void insert(int value) {",
      "        root = _insertRec(root, value);",
      "    }",
      "    private Node _insertRec(Node node, int value) {",
      "        if (node == null) {",
      "            return new Node(value);",
      "        }",
      "        if (value < node.value) {",
      "            node.left = _insertRec(node.left, value);",
      "        } else if (value > node.value) {",
      "            node.right = _insertRec(node.right, value);",
      "        }",
      "        return node;",
      "    }",
    ],
    "C++": [
      "    void insert(int value) {",
      "        root = _insertRec(root, value);",
      "    }",
      "    Node* _insertRec(Node* node, int value) {",
      "        if (node == nullptr) {",
      "            return new Node(value);",
      "        }",
      "        if (value < node->value) {",
      "            node->left = _insertRec(node->left, value);",
      "        } else if (value > node->value) {",
      "            node->right = _insertRec(node->right, value);",
      "        }",
      "        return node;",
      "    }",
    ],
  },
  search: {
    JavaScript: [
      "search(value) {",
      "  return this._searchRec(this.root, value);",
      "}",
      "_searchRec(node, value) {",
      "  if (node === null || node.value === value) return node;",
      "  if (value < node.value) {",
      "    return this._searchRec(node.left, value);",
      "  } else {",
      "    return this._searchRec(node.right, value);",
      "  }",
      "}",
    ],
     Python: [
      "    def search(self, value):",
      "        return self._search_rec(self.root, value)",
      "    ",
      "    def _search_rec(self, node, value):",
      "        if node is None or node.value == value:",
      "            return node",
      "        if value < node.value:",
      "            return self._search_rec(node.left, value)",
      "        else:",
      "            return self._search_rec(node.right, value)",
    ],
    Java: [
      "    public Node search(int value) {",
      "        return _searchRec(root, value);",
      "    }",
      "    private Node _searchRec(Node node, int value) {",
      "        if (node == null || node.value == value) {",
      "            return node;",
      "        }",
      "        if (value < node.value) {",
      "            return _searchRec(node.left, value);",
      "        } else {",
      "            return _searchRec(node.right, value);",
      "        }",
      "    }",
    ],
    "C++": [
      "    Node* search(int value) {",
      "        return _searchRec(root, value);",
      "    }",
      "    Node* _searchRec(Node* node, int value) {",
      "        if (node == nullptr || node->value == value) {",
      "            return node;",
      "        }",
      "        if (value < node->value) {",
      "            return _searchRec(node->left, value);",
      "        } else {",
      "            return _searchRec(node->right, value);",
      "        }",
      "    }",
    ],
  },
  delete: {
    JavaScript: [
      "delete(value) {",
      "  this.root = this._deleteRec(this.root, value);",
      "}",
      "_deleteRec(node, value) {",
      "  if (node === null) return null;",
      "  if (value < node.value) {",
      "    node.left = this._deleteRec(node.left, value);",
      "  } else if (value > node.value) {",
      "    node.right = this._deleteRec(node.right, value);",
      "  } else {",
      "    if (node.left === null) return node.right;",
      "    if (node.right === null) return node.left;",
      "    let successor = this._minValueNode(node.right);",
      "    node.value = successor.value;",
      "    node.right = this._deleteRec(node.right, successor.value);",
      "  }",
      "  return node;",
      "}",
      "_minValueNode(node) {",
      "  while (node.left !== null) { node = node.left; }",
      "  return node;",
      "}",
    ],
    Python: [
      "    def delete(self, value):",
      "        self.root = self._delete_rec(self.root, value)",
      "    ",
      "    def _delete_rec(self, node, value):",
      "        if node is None: return None",
      "        if value < node.value: node.left = self._delete_rec(node.left, value)",
      "        elif value > node.value: node.right = self._delete_rec(node.right, value)",
      "        else:",
      "            if node.left is None: return node.right",
      "            if node.right is None: return node.left",
      "            successor = self._min_value_node(node.right)",
      "            node.value = successor.value",
      "            node.right = self._delete_rec(node.right, successor.value)",
      "        return node",
      "    ",
      "    def _min_value_node(self, node):",
      "        current = node",
      "        while current.left is not None: current = current.left",
      "        return current",
    ],
    Java: [
      "    public void delete(int value) {",
      "        root = _deleteRec(root, value);",
      "    }",
      "    private Node _deleteRec(Node node, int value) {",
      "        if (node == null) return null;",
      "        if (value < node.value) node.left = _deleteRec(node.left, value);",
      "        else if (value > node.value) node.right = _deleteRec(node.right, value);",
      "        else {",
      "            if (node.left == null) return node.right;",
      "            if (node.right == null) return node.left;",
      "            Node successor = _minValueNode(node.right);",
      "            node.value = successor.value;",
      "            node.right = _deleteRec(node.right, successor.value);",
      "        }",
      "        return node;",
      "    }",
      "    private Node _minValueNode(Node node) {",
      "        Node current = node;",
      "        while (current.left != null) current = current.left;",
      "        return current;",
      "    }",
    ],
    "C++": [
      "    void remove(int value) { // 'delete' is a keyword",
      "        root = _deleteRec(root, value);",
      "    }",
      "    Node* _deleteRec(Node* node, int value) {",
      "        if (node == nullptr) return nullptr;",
      "        if (value < node->value) node->left = _deleteRec(node->left, value);",
      "        else if (value > node->value) node->right = _deleteRec(node->right, value);",
      "        else {",
      "            if (node->left == nullptr) { Node* temp = node->right; delete node; return temp; }",
      "            if (node->right == nullptr) { Node* temp = node->left; delete node; return temp; }",
      "            Node* successor = _minValueNode(node->right);",
      "            node->value = successor->value;",
      "            node->right = _deleteRec(node->right, successor->value);",
      "        }",
      "        return node;",
      "    }",
      "    Node* _minValueNode(Node* node) {",
      "        Node* current = node;",
      "        while (current && current->left != nullptr) current = current->left;",
      "        return current;",
      "    }",
    ],
  },
  build: {
    JavaScript: [
      "// Build Tree by repeated insertions:",
      "// For each value in input:",
      "//   tree.insert(value);",
      "// (See 'insert' methods for details)",
    ],
    Python: [
      "    # Build Tree by repeated insertions:",
      "    # For each value in input:",
      "    #   tree.insert(value)",
      "    # (See 'insert' methods for details)",
    ],
    Java: [
      "    // Build Tree by repeated insertions:",
      "    // For each value in input:",
      "    //   tree.insert(value);",
      "    // (See 'insert' methods for details)",
    ],
    "C++": [
      "    // Build Tree by repeated insertions:",
      "    // For each value in input:",
      "    //   tree.insert(value);",
      "    // (See 'insert' methods for details)",
    ],
  }
};

interface BinarySearchTreeCodePanelProps {
  currentLine: number | null;
  selectedOperation: BSTOperationType | 'structure';
}

export function BinarySearchTreeCodePanel({ currentLine, selectedOperation }: BinarySearchTreeCodePanelProps) {
  const { toast } = useToast();
  
  const languages = useMemo(() => Object.keys(BST_CODE_SNIPPETS_ALL_LANG.structure), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const structureSnippets = BST_CODE_SNIPPETS_ALL_LANG.structure[selectedLanguage] || [];
  const operationSnippets = BST_CODE_SNIPPETS_ALL_LANG[selectedOperation]?.[selectedLanguage] || [];

  const codeToDisplay = useMemo(() => {
    if (selectedOperation === 'structure') {
      return structureSnippets;
    }
    return [
      ...structureSnippets,
      ...(operationSnippets.length > 0 ? ["", `// --- ${selectedOperation.toUpperCase()} METHOD ---`] : []),
      ...operationSnippets,
    ];
  }, [structureSnippets, operationSnippets, selectedOperation]);

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} BST Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const operationTitle = selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1).replace(/([A-Z])/g, ' $1');

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {operationTitle}
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
            <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!codeToDisplay || codeToDisplay.length === 0}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4 whitespace-pre-wrap overflow-x-auto">
            {codeToDisplay.map((line, index) => {
              // Determine if this line is part of the structure or the operation for highlighting
              let lineIsHighlighted = false;
              if (currentLine !== null) {
                if (selectedOperation === 'structure' && index + 1 === currentLine) {
                  lineIsHighlighted = true;
                } else if (selectedOperation !== 'structure') {
                  // Adjust currentLine if it's for an operation snippet
                  const structureLength = structureSnippets.length;
                  const separatorLines = 2; // For "" and "// --- METHOD ---"
                  const operationLineNumber = currentLine; // Assuming currentLine maps directly to operation line map
                  
                  // Check if the 'line' is from the structure part
                  if (index < structureLength) {
                    // No highlight for structure when an operation is selected, unless currentLine points to structure part
                    // This logic can be refined if lineMap covers structure too.
                  } 
                  // Check if the 'line' is from the operation part
                  else if (index >= structureLength + separatorLines) {
                    const relativeOpLineIndex = index - (structureLength + separatorLines);
                    if (relativeOpLineIndex + 1 === operationLineNumber) {
                       lineIsHighlighted = true;
                    }
                  }
                }
              }
              return (
                <div key={`${selectedLanguage}-${selectedOperation}-line-${index}`}
                  className={`px-2 py-0.5 rounded ${lineIsHighlighted ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                  <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                    {index + 1}
                  </span>
                  {/* Indent operation methods for non-JS/Python languages like Java/C++ if they were part of a class block */}
                  {selectedOperation !== 'structure' && index >= structureSnippets.length + separatorLines && (selectedLanguage === 'Java' || selectedLanguage === 'C++') && !line.startsWith("//") ? `    ${line}` : line}
                </div>
              );
            })}
            {codeToDisplay.length === 0 && <p className="text-muted-foreground">Select an operation to view code.</p>}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

    