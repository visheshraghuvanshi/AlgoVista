
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HASH_TABLE_LINE_MAP } from './hash-table-logic';

// Conceptual code for Hash Table with chaining
const HASH_TABLE_OPERATIONS_CODE: Record<string, Record<string, string[]>> = {
  JavaScript: {
    structure: [
      "class HashTable {",
      "  constructor(size = 10) {",
      "    this.buckets = new Array(size).fill(null).map(() => []);",
      "    this.size = size;",
      "  }",
      "  _hash(key) { // Simple hash function",
      "    let hashValue = 0; const stringKey = String(key);",
      "    for (let i = 0; i < stringKey.length; i++) {",
      "      hashValue = (hashValue + stringKey.charCodeAt(i) * (i+1)) % this.size;",
      "    }",
      "    return hashValue;",
      "  }",
      "  // Operations below...",
      "}",
    ],
    insert: [
      "insert(key, value) {",
      "  const index = this._hash(key);",
      "  const bucket = this.buckets[index];",
      "  for (let i = 0; i < bucket.length; i++) {",
      "    if (bucket[i][0] === key) {",
      "      bucket[i][1] = value; // Update existing key",
      "      return;",
      "    }",
      "  }",
      "  bucket.push([key, value]); // Add new key-value pair",
      "}",
    ],
    search: [
      "search(key) {",
      "  const index = this._hash(key);",
      "  const bucket = this.buckets[index];",
      "  for (let i = 0; i < bucket.length; i++) {",
      "    if (bucket[i][0] === key) {",
      "      return bucket[i][1]; // Return value",
      "    }",
      "  }",
      "  return undefined; // Key not found",
      "}",
    ],
    delete: [
      "delete(key) {",
      "  const index = this._hash(key);",
      "  const bucket = this.buckets[index];",
      "  for (let i = 0; i < bucket.length; i++) {",
      "    if (bucket[i][0] === key) {",
      "      bucket.splice(i, 1); // Remove pair",
      "      return true;",
      "    }",
      "  }",
      "  return false; // Key not found",
      "}",
    ],
  },
  Python: {
    structure: [
      "class HashTable:",
      "    def __init__(self, size=10):",
      "        self.size = size",
      "        self.buckets = [[] for _ in range(size)]",
      "",
      "    def _hash(self, key):",
      "        hash_value = 0",
      "        for char_code in map(ord, str(key)):",
      "            hash_value = (hash_value + char_code) % self.size",
      "        return hash_value",
    ],
    insert: [
      "    def insert(self, key, value):",
      "        index = self._hash(key)",
      "        bucket = self.buckets[index]",
      "        for i, (k, v) in enumerate(bucket):",
      "            if k == key:",
      "                bucket[i] = (key, value)",
      "                return",
      "        bucket.append((key, value))",
    ],
    search: [
      "    def search(self, key):",
      "        index = self._hash(key)",
      "        bucket = self.buckets[index]",
      "        for k, v in bucket:",
      "            if k == key:",
      "                return v",
      "        return None",
    ],
    delete: [
      "    def delete(self, key):",
      "        index = self._hash(key)",
      "        bucket = self.buckets[index]",
      "        for i, (k, v) in enumerate(bucket):",
      "            if k == key:",
      "                bucket.pop(i)",
      "                return True",
      "        return False",
    ],
  },
  Java: {
     structure: [
      "import java.util.LinkedList;",
      "import java.util.ArrayList;",
      "class HashTable<K, V> {",
      "    private class Entry { K key; V value; Entry(K k, V v){key=k;value=v;} }",
      "    private ArrayList<LinkedList<Entry>> buckets;",
      "    private int size;",
      "    public HashTable(int size) {",
      "        this.size = size;",
      "        this.buckets = new ArrayList<>(size);",
      "        for (int i = 0; i < size; i++) buckets.add(new LinkedList<>());",
      "    }",
      "    private int hash(K key) {",
      "        return Math.abs(key.toString().hashCode() % size);",
      "    }",
    ],
    insert: [
      "    public void insert(K key, V value) {",
      "        int index = hash(key);",
      "        LinkedList<Entry> bucket = buckets.get(index);",
      "        for (Entry entry : bucket) {",
      "            if (entry.key.equals(key)) { entry.value = value; return; }",
      "        }",
      "        bucket.add(new Entry(key, value));",
      "    }",
    ],
    search: [
      "    public V search(K key) {",
      "        int index = hash(key);",
      "        LinkedList<Entry> bucket = buckets.get(index);",
      "        for (Entry entry : bucket) {",
      "            if (entry.key.equals(key)) return entry.value;",
      "        }",
      "        return null;",
      "    }",
    ],
    delete: [
      "    public boolean delete(K key) {",
      "        int index = hash(key);",
      "        LinkedList<Entry> bucket = buckets.get(index);",
      "        for (Entry entry : bucket) {",
      "            if (entry.key.equals(key)) { bucket.remove(entry); return true; }",
      "        }",
      "        return false;",
      "    }",
      "}",
    ],
  },
  "C++": {
    structure: [
      "#include <vector>",
      "#include <list>",
      "#include <string>",
      "#include <functional> // For std::hash",
      "template<typename K, typename V>",
      "class HashTable {",
      "private:",
      "    struct Entry { K key; V value; };",
      "    std::vector<std::list<Entry>> buckets;",
      "    int table_size;",
      "    int hash_function(K key) {",
      "        // Simple string conversion for hash; better hashing for non-strings needed",
      "        return std::hash<std::string>{}(std::to_string(key)) % table_size;",
      "    }",
      "public:",
      "    HashTable(int size = 10) : table_size(size) {",
      "        buckets.resize(table_size);",
      "    }",
    ],
    insert: [
      "    void insert(K key, V value) {",
      "        int index = hash_function(key);",
      "        for (auto& entry : buckets[index]) {",
      "            if (entry.key == key) { entry.value = value; return; }",
      "        }",
      "        buckets[index].push_back({key, value});",
      "    }",
    ],
    search: [
      "    V search(K key, bool& found) {",
      "        int index = hash_function(key);",
      "        for (const auto& entry : buckets[index]) {",
      "            if (entry.key == key) { found = true; return entry.value; }",
      "        }",
      "        found = false; return V{}; // Default value if not found",
      "    }",
    ],
    delete: [
      "    bool remove(K key) {",
      "        int index = hash_function(key);",
      "        auto& bucket = buckets[index];",
      "        for (auto it = bucket.begin(); it != bucket.end(); ++it) {",
      "            if (it->key == key) { bucket.erase(it); return true; }",
      "        }",
      "        return false;",
      "    }",
      "};",
    ],
  }
};


interface HashTableCodePanelProps {
  currentLine: number | null;
  selectedOperation: 'insert' | 'search' | 'delete' | 'init';
}

export function HashTableCodePanel({ currentLine, selectedOperation }: HashTableCodePanelProps) {
  const { toast } = useToast();
  const languages = useMemo(() => Object.keys(HASH_TABLE_OPERATIONS_CODE), []);
  const initialLanguage = languages.includes("JavaScript") ? "JavaScript" : languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  const effectiveOp = selectedOperation === 'init' ? 'structure' : selectedOperation;

  const codeToDisplay = HASH_TABLE_OPERATIONS_CODE[selectedLanguage]?.[effectiveOp] || [];
  const structureCode = HASH_TABLE_OPERATIONS_CODE[selectedLanguage]?.structure || [];


  const handleCopyCode = () => {
    const opCodeString = codeToDisplay.join('\n');
    const fullCode = (effectiveOp !== 'structure' ? (structureCode.join('\n') + '\n\n  // Operation:\n  ' + opCodeString.split('\n').map(line => `  ${line}`).join('\n') + '\n}') : structureCode.join('\n') );

    if (fullCode) {
      navigator.clipboard.writeText(fullCode)
        .then(() => toast({ title: `${selectedLanguage} HashTable Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };
  
  const operationTitle = effectiveOp.charAt(0).toUpperCase() + effectiveOp.slice(1);

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
            <Code2 className="mr-2 h-5 w-5" /> Code: {operationTitle}
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
                    {index + 1} 
                  </span>
                  {effectiveOp !== 'structure' && !line.startsWith("}") && !line.startsWith("public") && !line.startsWith("private") && !line.startsWith("#include") && !line.startsWith("template") && !line.startsWith("class") ? `    ${line}` : line}
                </div>
              ))}
            </pre>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

