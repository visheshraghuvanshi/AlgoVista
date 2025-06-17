
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Construction, Code2, KeyRound, TabletSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const HASH_TABLE_CODE_SNIPPETS = {
  JavaScript: [
    "// Hash Table (Conceptual - using chaining with arrays for buckets)",
    "class HashTable {",
    "  constructor(size = 10) {",
    "    this.buckets = new Array(size).fill(null).map(() => []);",
    "    this.size = size;",
    "  }",
    "",
    "  _hash(key) { // Simple hash function (not for production)",
    "    let hashValue = 0;",
    "    for (let i = 0; i < key.length; i++) {",
    "      hashValue = (hashValue + key.charCodeAt(i) * (i + 1)) % this.size;",
    "    }",
    "    return hashValue;",
    "  }",
    "",
    "  insert(key, value) {",
    "    const index = this._hash(key);",
    "    const bucket = this.buckets[index];",
    "    // Check if key already exists in bucket, update if so",
    "    for (let i = 0; i < bucket.length; i++) {",
    "      if (bucket[i][0] === key) {",
    "        bucket[i][1] = value; return;",
    "      }",
    "    }",
    "    bucket.push([key, value]); // Add new key-value pair",
    "  }",
    "",
    "  search(key) {",
    "    const index = this._hash(key);",
    "    const bucket = this.buckets[index];",
    "    for (let i = 0; i < bucket.length; i++) {",
    "      if (bucket[i][0] === key) return bucket[i][1]; // Return value",
    "    }",
    "    return undefined; // Key not found",
    "  }",
    "",
    "  delete(key) {",
    "    const index = this._hash(key);",
    "    const bucket = this.buckets[index];",
    "    for (let i = 0; i < bucket.length; i++) {",
    "      if (bucket[i][0] === key) {",
    "        bucket.splice(i, 1); // Remove pair",
    "        return true;",
    "      }",
    "    }",
    "    return false; // Key not found",
    "  }",
    "  // Rehashing would be needed for production quality when load factor is high.",
    "}",
  ],
};

export default function HashTableVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [keyInput, setKeyInput] = useState("name");
  const [valueInput, setValueInput] = useState("Alice");


  useEffect(() => {
    setIsClient(true);
    toast({
      title: "Conceptual Overview",
      description: `Interactive Hash Table visualization (hashing, collision resolution) is currently under construction.`,
      variant: "default",
      duration: 5000,
    });
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps = {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  };

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
            <TabletSmartphone className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" /> {/* Using TabletSmartphone as a placeholder icon */}
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
        </div>

        <div className="text-center my-10 p-6 border rounded-lg shadow-lg bg-card">
            <Construction className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Interactive Visualization Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                The interactive visualizer for {algorithmMetadata.title}, demonstrating hash function calculations, bucket assignments, and collision resolution strategies (like chaining or open addressing), is currently under construction.
                Please check back later! Review the concepts and code snippets below.
            </p>
        </div>
        
        <div className="lg:w-3/5 xl:w-2/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-auto flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code (JavaScript - Chaining)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5 max-h-[600px]">
                    <pre className="font-code text-sm p-4">
                        {HASH_TABLE_CODE_SNIPPETS.JavaScript.map((line, index) => (
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

        <div className="w-full max-w-lg mx-auto my-4 p-4 border rounded-lg shadow-md space-y-4">
             <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="keyInputHT" className="text-sm font-medium">Key (string):</Label>
                    <Input id="keyInputHT" type="text" value={keyInput} onChange={e => setKeyInput(e.target.value)} className="mt-1" disabled />
                </div>
                <div>
                    <Label htmlFor="valueInputHT" className="text-sm font-medium">Value (string):</Label>
                    <Input id="valueInputHT" type="text" value={valueInput} onChange={e => setValueInput(e.target.value)} className="mt-1" disabled />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <Button className="mt-2 w-full" disabled>Insert</Button>
                <Button className="mt-2 w-full" disabled>Search</Button>
                <Button className="mt-2 w-full" disabled>Delete</Button>
            </div>
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
    