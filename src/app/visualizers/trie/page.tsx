
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TRIE_CODE_SNIPPETS = {
  JavaScript: [
    "class TrieNode {",
    "  constructor() {",
    "    this.children = {}; // or new Map() for more flexible charsets",
    "    this.isEndOfWord = false;",
    "  }",
    "}",
    "",
    "class Trie {",
    "  constructor() {",
    "    this.root = new TrieNode();",
    "  }",
    "",
    "  insert(word) {",
    "    let current = this.root;",
    "    for (const char of word) {",
    "      if (!current.children[char]) {",
    "        current.children[char] = new TrieNode();",
    "      }",
    "      current = current.children[char];",
    "    }",
    "    current.isEndOfWord = true;",
    "  }",
    "",
    "  search(word) {",
    "    let current = this.root;",
    "    for (const char of word) {",
    "      if (!current.children[char]) return false; // Word not found",
    "      current = current.children[char];",
    "    }",
    "    return current.isEndOfWord; // True if 'word' exists, false if only a prefix",
    "  }",
    "",
    "  startsWith(prefix) {",
    "    let current = this.root;",
    "    for (const char of prefix) {",
    "      if (!current.children[char]) return false; // Prefix not found",
    "      current = current.children[char];",
    "    }",
    "    return true; // Prefix exists",
    "  }",
    "",
    "  delete(word) { /* Recursive deletion, more complex to maintain integrity */ }",
    "}",
  ],
};

const ALGORITHM_SLUG = 'trie';

export default function TrieVisualizerPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
       toast({
            title: "Conceptual Overview",
            description: `Interactive Trie visualization (insert, search, startsWith) is currently under construction.`,
            variant: "default",
            duration: 6000,
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    }
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.longDescription || algorithm.description,
    timeComplexities: { 
      best: "Insert/Search/Delete: O(L)", // L = length of word
      average: "Insert/Search/Delete: O(L)", 
      worst: "Insert/Search/Delete: O(L)" 
    },
    spaceComplexity: "O(N*L_avg*A) where N is num words, L_avg is avg length, A is alphabet size (worst case). Efficient if many words share prefixes.",
  } : null;

  if (!isClient) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">Loading visualizer...</p>
            </main>
            <Footer />
        </div>
    );
  }

  if (!algorithm || !algoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
            <p className="text-muted-foreground text-lg">
              Could not load data for &quot;{ALGORITHM_SLUG}&quot;.
            </p>
            <Button asChild size="lg" className="mt-8">
                <Link href="/visualizers">Back to Visualizers</Link>
            </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithm.title}
          </h1>
        </div>

        <div className="text-center my-10 p-6 border rounded-lg shadow-lg bg-card">
            <Construction className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Interactive Visualization Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                The interactive visualizer for {algorithm.title}, demonstrating word insertion, search, and prefix search, is currently under construction.
                Please check back later! Review the concepts and code snippets below.
            </p>
        </div>
        
        <div className="lg:w-3/5 xl:w-2/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-auto flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code Snippets (JavaScript)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[600px]">
                    <pre className="font-code text-sm p-4">
                        {TRIE_CODE_SNIPPETS.JavaScript.map((line, index) => (
                        <div key={`js-line-${index}`} className="px-2 py-0.5 rounded text-foreground whitespace-pre-wrap">
                            <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                            {index + 1}
                            </span>
                            {line}
                        </div>
                        ))}
                    </pre>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>

        <div className="w-full max-w-md mx-auto my-4 p-4 border rounded-lg shadow-md">
            <Label htmlFor="trieInput" className="text-sm font-medium">Conceptual Trie Input (e.g., words to insert)</Label>
            <Input id="trieInput" type="text" placeholder="apple,app,apricot" className="mt-1" disabled />
            <Button className="mt-2 w-full" disabled>Perform Operation (Coming Soon)</Button>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

