
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { TraversalType } from './types'; // Local import
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; 

const TRAVERSAL_CODE_SNIPPETS_ALL_LANG: Record<TraversalType, Record<string, string[]>> = {
  inorder: {
    JavaScript: [
      "function inorder(node) {",
      "  if (node === null) return;",
      "  inorder(node.left);",
      "  visit(node); // Process node",
      "  inorder(node.right);",
      "}",
    ],
    Python: [
      "def inorder(node):",
      "    if node is None: return",
      "    inorder(node.left)",
      "    visit(node) # Process node",
      "    inorder(node.right)",
    ],
    Java: [
      "void inorder(TreeNode node) {",
      "    if (node == null) return;",
      "    inorder(node.left);",
      "    visit(node); // Process node",
      "    inorder(node.right);",
      "}",
    ],
    "C++": [
      "void inorder(TreeNode* node) {",
      "    if (node == nullptr) return;",
      "    inorder(node->left);",
      "    visit(node); // Process node",
      "    inorder(node->right);",
      "}",
    ],
  },
  preorder: {
    JavaScript: [
      "function preorder(node) {",
      "  if (node === null) return;",
      "  visit(node); // Process node",
      "  preorder(node.left);",
      "  preorder(node.right);",
      "}",
    ],
    Python: [
      "def preorder(node):",
      "    if node is None: return",
      "    visit(node) # Process node",
      "    preorder(node.left)",
      "    preorder(node.right)",
    ],
    Java: [
      "void preorder(TreeNode node) {",
      "    if (node == null) return;",
      "    visit(node); // Process node",
      "    preorder(node.left);",
      "    preorder(node.right);",
      "}",
    ],
    "C++": [
      "void preorder(TreeNode* node) {",
      "    if (node == nullptr) return;",
      "    visit(node); // Process node",
      "    preorder(node->left);",
      "    preorder(node->right);",
      "}",
    ],
  },
  postorder: {
    JavaScript: [
      "function postorder(node) {",
      "  if (node === null) return;",
      "  postorder(node.left);",
      "  postorder(node.right);",
      "  visit(node); // Process node",
      "}",
    ],
    Python: [
      "def postorder(node):",
      "    if node is None: return",
      "    postorder(node.left)",
      "    postorder(node.right)",
      "    visit(node) # Process node",
    ],
    Java: [
      "void postorder(TreeNode node) {",
      "    if (node == null) return;",
      "    postorder(node.left);",
      "    postorder(node.right);",
      "    visit(node); // Process node",
      "}",
    ],
    "C++": [
      "void postorder(TreeNode* node) {",
      "    if (node == nullptr) return;",
      "    postorder(node->left);",
      "    postorder(node->right);",
      "    visit(node); // Process node",
      "}",
    ],
  },
};


interface BinaryTreeTraversalCodePanelProps {
  currentLine: number | null;
  selectedTraversalType: TraversalType;
}

export function BinaryTreeTraversalCodePanel({
  currentLine,
  selectedTraversalType,
}: BinaryTreeTraversalCodePanelProps) {
  const { toast } = useToast();
  
  const codeSnippetsForTraversal = TRAVERSAL_CODE_SNIPPETS_ALL_LANG[selectedTraversalType] || {};
  const languages = useMemo(() => Object.keys(codeSnippetsForTraversal), [codeSnippetsForTraversal]);
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    const initialLangs = Object.keys(codeSnippetsForTraversal);
    if (initialLangs.length > 0) {
      return initialLangs.includes("JavaScript") ? "JavaScript" : initialLangs[0];
    }
    return "Info";
  });

  useEffect(() => {
    setSelectedLanguage(prevSelectedLang => {
      const currentOpLanguages = Object.keys(TRAVERSAL_CODE_SNIPPETS_ALL_LANG[selectedTraversalType] || {});
      if (currentOpLanguages.length > 0) {
        if (currentOpLanguages.includes(prevSelectedLang)) {
          return prevSelectedLang; 
        }
        return currentOpLanguages.includes("JavaScript") ? "JavaScript" : currentOpLanguages[0];
      } else {
        return "Info";
      }
    });
  }, [selectedTraversalType]);

  const codeToDisplay = useMemo(() => {
    return codeSnippetsForTraversal[selectedLanguage] || [];
  }, [selectedLanguage, codeSnippetsForTraversal]);

  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => {
          toast({ title: `${selectedLanguage} ${selectedTraversalType.toUpperCase()} Code Copied!`, description: "The code has been copied to your clipboard." });
        })
        .catch(err => {
          toast({ title: "Copy Failed", description: "Could not copy code to clipboard.", variant: "destructive" });
        });
    } else {
      toast({ title: "No Code to Copy", description: "No code available for selected traversal/language.", variant: "default" });
    }
  };

  const tabValue = useMemo(() => {
    if (languages.includes(selectedLanguage)) {
      return selectedLanguage;
    }
    if (languages.length > 0) {
      return languages.includes("JavaScript") ? "JavaScript" : languages[0];
    }
    return "Info";
  }, [languages, selectedLanguage]);


  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> {selectedTraversalType.charAt(0).toUpperCase() + selectedTraversalType.slice(1)} Traversal
        </CardTitle>
        <div className="flex items-center gap-2">
            <Tabs value={tabValue} onValueChange={setSelectedLanguage} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 h-8 text-xs p-0.5">
                    {languages.map(lang => (
                        <TabsTrigger key={lang} value={lang} className="text-xs px-1.5 py-0.5 h-auto">
                            {lang}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" onClick={handleCopyCode} aria-label="Copy code" disabled={codeToDisplay.length === 0 || selectedLanguage === 'Info'}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea key={`${selectedTraversalType}-${selectedLanguage}`} className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {codeToDisplay.length > 0 ? codeToDisplay.map((line, index) => (
              <div
                key={`${selectedTraversalType}-${selectedLanguage}-line-${index}`}
                className={`px-2 py-0.5 rounded transition-colors duration-150 ${
                  index + 1 === currentLine && selectedLanguage === tabValue ? "bg-accent text-accent-foreground" : "text-foreground"
                }`}
                aria-current={index + 1 === currentLine && selectedLanguage === tabValue ? "step" : undefined}
              >
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                  {index + 1}
                </span>
                {line}
              </div>
            )) : (
                 <p className="text-muted-foreground p-4">Select a traversal type to see code.</p>
            )}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

