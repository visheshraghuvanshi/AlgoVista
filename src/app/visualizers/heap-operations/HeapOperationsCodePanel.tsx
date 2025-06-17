
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { HeapOperationType, HEAP_OPERATION_LINE_MAPS } from './heap-operations-logic';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; 

export const HEAP_CODE_SNIPPETS_ALL_LANG: Record<HeapOperationType | 'classDefinition', Record<string, string[]>> = {
  classDefinition: {
    JavaScript: [
      "// MinHeap Example (can be adapted for MaxHeap)",
      "class MinHeap {",
      "  constructor() { this.heap = []; }",
      "  getParentIndex(i) { return Math.floor((i - 1) / 2); }",
      "  getLeftChildIndex(i) { return 2 * i + 1; }",
      "  getRightChildIndex(i) { return 2 * i + 2; }",
      "  swap(i1, i2) { [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]]; }",
      "  // ... other methods below ...",
      "}",
    ],
    Python: [
      "class MinHeap:",
      "    def __init__(self): self.heap = []",
      "    def get_parent_index(self, i): return (i - 1) // 2",
      "    def get_left_child_index(self, i): return 2 * i + 1",
      "    def get_right_child_index(self, i): return 2 * i + 2",
      "    def swap(self, i1, i2): self.heap[i1], self.heap[i2] = self.heap[i2], self.heap[i1]",
      "    # ... other methods below ...",
    ],
    Java: [
      "import java.util.ArrayList;",
      "import java.util.Collections;",
      "class MinHeap {",
      "    private ArrayList<Integer> heap = new ArrayList<>();",
      "    private int getParentIndex(int i) { return (i - 1) / 2; }",
      "    private int getLeftChildIndex(int i) { return 2 * i + 1; }",
      "    private int getRightChildIndex(int i) { return 2 * i + 2; }",
      "    private void swap(int i1, int i2) { Collections.swap(heap, i1, i2); }",
      "    // ... other methods below ...",
      "}",
    ],
    "C++": [
      "#include <vector>",
      "#include <algorithm> // For std::swap",
      "class MinHeap {",
      "public:",
      "    std::vector<int> heap;",
      "    int getParentIndex(int i) { return (i - 1) / 2; }",
      "    int getLeftChildIndex(int i) { return 2 * i + 1; }",
      "    int getRightChildIndex(int i) { return 2 * i + 2; }",
      "    void swap(int i1, int i2) { std::swap(heap[i1], heap[i2]); }",
      "    // ... other methods below ...",
      "};",
    ],
  },
  insertMinHeap: {
    JavaScript: [
      "// Insert into MinHeap",
      "insert(value) {",
      "  this.heap.push(value);",
      "  this.heapifyUp(this.heap.length - 1);",
      "}",
      "heapifyUp(index) {",
      "  let parentIndex = this.getParentIndex(index);",
      "  while (index > 0 && this.heap[index] < this.heap[parentIndex]) {",
      "    this.swap(index, parentIndex);",
      "    index = parentIndex;",
      "    parentIndex = this.getParentIndex(index);",
      "  }",
      "}",
    ],
    Python: [
        "    def insert(self, value):",
        "        self.heap.append(value)",
        "        self.heapify_up(len(self.heap) - 1)",
        "",
        "    def heapify_up(self, index):",
        "        parent_index = self.get_parent_index(index)",
        "        while index > 0 and self.heap[index] < self.heap[parent_index]:",
        "            self.swap(index, parent_index)",
        "            index = parent_index",
        "            parent_index = self.get_parent_index(index)",
    ],
    Java: [
        "    public void insert(int value) {",
        "        heap.add(value);",
        "        heapifyUp(heap.size() - 1);",
        "    }",
        "    private void heapifyUp(int index) {",
        "        int parentIndex = getParentIndex(index);",
        "        while (index > 0 && heap.get(index) < heap.get(parentIndex)) {",
        "            swap(index, parentIndex);",
        "            index = parentIndex;",
        "            parentIndex = getParentIndex(index);",
        "        }",
        "    }",
    ],
    "C++": [
        "    void insert(int value) {",
        "        heap.push_back(value);",
        "        heapifyUp(heap.size() - 1);",
        "    }",
        "    void heapifyUp(int index) {",
        "        int parentIndex = getParentIndex(index);",
        "        while (index > 0 && heap[index] < heap[parentIndex]) {",
        "            swap(index, parentIndex);",
        "            index = parentIndex;",
        "            parentIndex = getParentIndex(index);",
        "        }",
        "    }",
    ],
  },
  extractMin: {
    JavaScript: [
      "// Extract Min from MinHeap",
      "extractMin() {",
      "  if (this.heap.length === 0) return null;",
      "  if (this.heap.length === 1) return this.heap.pop();",
      "  const min = this.heap[0];",
      "  this.heap[0] = this.heap.pop(); // Move last to root",
      "  this.heapifyDown(0);",
      "  return min;",
      "}",
      "heapifyDown(index) {",
      "  let smallest = index;",
      "  const left = this.getLeftChildIndex(index);",
      "  const right = this.getRightChildIndex(index);",
      "  if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {",
      "    smallest = left;",
      "  }",
      "  if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {",
      "    smallest = right;",
      "  }",
      "  if (smallest !== index) {",
      "    this.swap(index, smallest);",
      "    this.heapifyDown(smallest);",
      "  }",
      "}",
    ],
     Python: [
        "    def extract_min(self):",
        "        if not self.heap: return None",
        "        if len(self.heap) == 1: return self.heap.pop()",
        "        min_val = self.heap[0]",
        "        self.heap[0] = self.heap.pop()",
        "        self.heapify_down(0)",
        "        return min_val",
        "",
        "    def heapify_down(self, index):",
        "        smallest = index",
        "        left = self.get_left_child_index(index)",
        "        right = self.get_right_child_index(index)",
        "        if left < len(self.heap) and self.heap[left] < self.heap[smallest]:",
        "            smallest = left",
        "        if right < len(self.heap) and self.heap[right] < self.heap[smallest]:",
        "            smallest = right",
        "        if smallest != index:",
        "            self.swap(index, smallest)",
        "            self.heapify_down(smallest)",
    ],
    Java: [
        "    public Integer extractMin() {",
        "        if (heap.isEmpty()) return null;",
        "        if (heap.size() == 1) return heap.remove(0);",
        "        int min = heap.get(0);",
        "        heap.set(0, heap.remove(heap.size() - 1));",
        "        heapifyDown(0);",
        "        return min;",
        "    }",
        "    private void heapifyDown(int index) {",
        "        int smallest = index;",
        "        int left = getLeftChildIndex(index);",
        "        int right = getRightChildIndex(index);",
        "        if (left < heap.size() && heap.get(left) < heap.get(smallest)) smallest = left;",
        "        if (right < heap.size() && heap.get(right) < heap.get(smallest)) smallest = right;",
        "        if (smallest != index) {",
        "            swap(index, smallest);",
        "            heapifyDown(smallest);",
        "        }",
        "    }",
    ],
    "C++": [
        "    int extractMin() {",
        "        if (heap.empty()) throw std::runtime_error(\"Heap is empty\");",
        "        if (heap.size() == 1) { int val = heap.back(); heap.pop_back(); return val; }",
        "        int minVal = heap[0];",
        "        heap[0] = heap.back();",
        "        heap.pop_back();",
        "        heapifyDown(0);",
        "        return minVal;",
        "    }",
        "    void heapifyDown(int index) {",
        "        int smallest = index;",
        "        int left = getLeftChildIndex(index);",
        "        int right = getRightChildIndex(index);",
        "        if (left < heap.size() && heap[left] < heap[smallest]) smallest = left;",
        "        if (right < heap.size() && heap[right] < heap[smallest]) smallest = right;",
        "        if (smallest != index) {",
        "            swap(index, smallest);",
        "            heapifyDown(smallest);",
        "        }",
        "    }",
    ],
  },
  buildMinHeap: {
    JavaScript: [
      "// Build MinHeap from an array (O(n))",
      "buildHeapFromArray(array) {",
      "  this.heap = [...array]; // Copy array",
      "  // Start from the last non-leaf node and heapify down",
      "  const firstNonLeafIndex = Math.floor(this.heap.length / 2) - 1;",
      "  for (let i = firstNonLeafIndex; i >= 0; i--) {",
      "    this.heapifyDown(i);",
      "  }",
      "}",
      "// (heapifyDown is defined in 'extractMin' snippet)",
    ],
    Python: [
        "    def build_heap_from_array(self, array):",
        "        self.heap = list(array)",
        "        first_non_leaf_index = (len(self.heap) // 2) - 1",
        "        for i in range(first_non_leaf_index, -1, -1):",
        "            self.heapify_down(i)",
        "    # (heapify_down method should be defined)",
    ],
    Java: [
        "    public void buildHeapFromArray(int[] array) {",
        "        heap.clear();",
        "        for (int val : array) heap.add(val);",
        "        int firstNonLeafIndex = (heap.size() / 2) - 1;",
        "        for (int i = firstNonLeafIndex; i >= 0; i--) {",
        "            heapifyDown(i);",
        "        }",
        "    }",
        "    // (heapifyDown method should be defined)",
    ],
    "C++": [
        "    void buildHeapFromArray(const std::vector<int>& array) {",
        "        heap = array;",
        "        int firstNonLeafIndex = (heap.size() / 2) - 1;",
        "        for (int i = firstNonLeafIndex; i >= 0; --i) {",
        "            heapifyDown(i);",
        "        }",
        "    }",
        "    // (heapifyDown method should be defined)",
    ],
  },
};

interface HeapOperationsCodePanelProps {
  currentLine: number | null;
  selectedOperation: HeapOperationType; 
}

export function HeapOperationsCodePanel({ currentLine, selectedOperation }: HeapOperationsCodePanelProps) {
  const { toast } = useToast();
  const languages = React.useMemo(() => Object.keys(HEAP_CODE_SNIPPETS_ALL_LANG.classDefinition), []);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(languages[0] || "JavaScript");
  
  const codeToDisplay = HEAP_CODE_SNIPPETS_ALL_LANG[selectedOperation]?.[selectedLanguage] || HEAP_CODE_SNIPPETS_ALL_LANG.classDefinition[selectedLanguage];
  const structureCode = HEAP_CODE_SNIPPETS_ALL_LANG.classDefinition[selectedLanguage];
  const operationLabel = selectedOperation.replace(/([A-Z])/g, ' $1').trim();

  const handleCopyCode = () => {
    let codeString = "";
     if (selectedOperation !== 'classDefinition' && structureCode) {
        codeString = structureCode.join('\n') + '\n\n  // Operation:\n  ' + codeToDisplay.map(line => `  ${line}`).join('\n');
        if(selectedLanguage === 'JavaScript' || selectedLanguage === 'Java' || selectedLanguage === 'C++') {
           // Add closing brace for class if not present in structureCode's last line (it is)
           // and if the operation code doesn't end with one (it typically won't if it's just methods)
        }
    } else if (structureCode) {
        codeString = structureCode.join('\n');
    }
    
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} ${operationLabel} Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Code: {operationLabel}
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
            {selectedOperation !== 'classDefinition' && structureCode && (
                <>
                    {structureCode.map((line,index)=>(
                        <div key={`class-def-line-${selectedLanguage}-${index}`} className="px-2 py-0.5 rounded text-muted-foreground/70 opacity-70 whitespace-pre-wrap">
                             <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                             {line}
                        </div>
                    ))}
                    <div className="my-2 border-b border-dashed border-muted-foreground/30"></div>
                </>
            )}
            {codeToDisplay.map((line, index) => (
              <div key={`${operationLabel}-${selectedLanguage}-line-${index}`}
                className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                  {/* Adjust line number for display if structure code is prepended */}
                  {index + 1 + (selectedOperation !== 'classDefinition' && structureCode ? structureCode.length + 2 : 0)}
                </span>
                {/* Indent operation methods for languages like Java/C++ if they are inside a class block */}
                {selectedOperation !== 'classDefinition' && (selectedLanguage === 'Java' || selectedLanguage === 'C++') && !line.startsWith("//") && !line.startsWith("public") && !line.startsWith("private") && !line.startsWith("void") && !line.startsWith("int") && !line.startsWith("boolean") && !line.startsWith("class") && !line.startsWith("import") && !line.startsWith("#include") ? `    ${line}` : line}
                {selectedOperation !== 'classDefinition' && (selectedLanguage === 'Python') && !line.startsWith("#") && !line.startsWith("def") && !line.startsWith("class") && !line.startsWith("import") ? `    ${line}` : line}
                {selectedOperation !== 'classDefinition' && (selectedLanguage === 'JavaScript') && !line.startsWith("//") && !line.startsWith("class") && !line.startsWith("constructor") ? `  ${line}` : line}
                {selectedOperation === 'classDefinition' && line}
              </div>
            ))}
            {codeToDisplay.length === 0 && <p className="text-muted-foreground">Select an operation to view code.</p>}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

    