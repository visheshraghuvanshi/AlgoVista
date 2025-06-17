"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, HashTableStep, HashTableEntry, HashValue } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, KeyRound, TabletSmartphone, PlusCircle, SearchIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { HashTableVisualizationPanel } from './HashTableVisualizationPanel';
import { HashTableCodePanel } from './HashTableCodePanel';
import { generateHashTableSteps, createInitialHashTable, HASH_TABLE_LINE_MAP } from './hash-table-logic';

const DEFAULT_ANIMATION_SPEED = 700; // Not used as operations are discrete
const MIN_SPEED = 100;
const MAX_SPEED = 1500;
const DEFAULT_TABLE_SIZE = 7;

type HashTableOperationType = 'insert' | 'search' | 'delete' | 'init';

export default function HashTableVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [tableSize, setTableSize] = useState(DEFAULT_TABLE_SIZE);
  const [keyInput, setKeyInput] = useState<HashValue>("name");
  const [valueInput, setValueInput] = useState<HashValue>("Alice");
  const [selectedOperation, setSelectedOperation] = useState<HashTableOperationType>('insert');
  
  const [currentStep, setCurrentStep] = useState<HashTableStep | null>(null);
  // Steps array and animation controls are less relevant for discrete operations

  const hashTableRef = useRef<HashTableEntry[][]>(createInitialHashTable(DEFAULT_TABLE_SIZE));
  const [insertedWords, setInsertedWords] = useState<string[]>([]); // For displaying current state

  useEffect(() => { 
    setIsClient(true); 
    initializeTable();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeTable = useCallback(() => {
    if (tableSize < 1 || tableSize > 20) {
        toast({title: "Invalid Table Size", description: "Size must be between 1 and 20.", variant: "destructive"});
        return;
    }
    hashTableRef.current = createInitialHashTable(tableSize);
    const initialStep: HashTableStep = {
        buckets: [...hashTableRef.current], tableSize, operation: 'init', message: `Hash Table (size ${tableSize}) initialized.`, currentLine: null,
        activeIndices: [], swappingIndices: [], sortedIndices: [],
    };
    setCurrentStep(initialStep);
    setInsertedWords([]); // Clear displayed words on re-init
  }, [tableSize, toast]);

  useEffect(() => {
    initializeTable();
  }, [tableSize, initializeTable]);
  
  const handleExecuteOperation = () => {
    const currentKeyStr = String(keyInput).trim();
    const currentValueStr = String(valueInput).trim();

    if (currentKeyStr === "") {
        toast({title: "Invalid Key", description: "Key cannot be empty.", variant: "destructive"}); return;
    }
    const currentKey: HashValue = isNaN(Number(currentKeyStr)) ? currentKeyStr : Number(currentKeyStr);
    
    let currentValue: HashValue | undefined;
    if (selectedOperation === 'insert') {
        if (currentValueStr === "") {
            toast({title: "Invalid Value", description: "Value cannot be empty for insert.", variant: "destructive"}); return;
        }
        currentValue = isNaN(Number(currentValueStr)) ? currentValueStr : Number(currentValueStr);
    }

    // For discrete operations, we just generate the final state after the operation
    const resultingSteps = generateHashTableSteps(hashTableRef.current, tableSize, selectedOperation as 'insert'|'search'|'delete', currentKey, currentValue);
    const finalStep = resultingSteps[resultingSteps.length - 1]; // The outcome of the operation
    
    if (finalStep) {
        hashTableRef.current = [...finalStep.buckets]; // Persist the new state
        setCurrentStep(finalStep); // Display the final state
        
        if (selectedOperation === 'insert') {
            const wordKey = String(finalStep.currentKey);
            if (!insertedWords.includes(wordKey) || (insertedWords.includes(wordKey) && finalStep.message?.includes("Updated"))) {
               const newInserted = new Set(insertedWords);
               newInserted.add(wordKey);
               setInsertedWords(Array.from(newInserted).sort());
            }
        } else if (selectedOperation === 'delete' && finalStep.message?.includes("Removed")) {
            const wordKey = String(finalStep.currentKey);
            setInsertedWords(prev => prev.filter(w => w !== wordKey));
        }

        toast({title: `${selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)} Complete`, description: finalStep.message});
    } else {
        // Show current state if operation failed or produced no steps
        const currentTableState = [...hashTableRef.current];
         setCurrentStep({
            buckets: currentTableState, tableSize, operation: selectedOperation,
            message: "Operation did not change state or an error occurred.", currentLine: null,
            activeIndices: [], swappingIndices: [], sortedIndices: []
        });
    }
  };

  const handleReset = () => { 
    setTableSize(DEFAULT_TABLE_SIZE); // This will trigger initializeTable via useEffect
    setKeyInput("name");
    setValueInput("Alice");
    setSelectedOperation('insert');
  };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <KeyRound className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <HashTableVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <HashTableCodePanel currentLine={currentStep?.currentLine ?? null} selectedOperation={selectedOperation} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="tableSizeInput">Table Size (1-20)</Label>
                <Input id="tableSizeInput" type="number" value={tableSize} onChange={e => setTableSize(Math.min(20, Math.max(1, parseInt(e.target.value) || 1 )))} min="1" max="20"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="htOperationSelect">Operation</Label>
                <Select value={selectedOperation} onValueChange={v => setSelectedOperation(v as HashTableOperationType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insert">Insert (Key, Value)</SelectItem>
                    <SelectItem value="search">Search (Key)</SelectItem>
                    <SelectItem value="delete">Delete (Key)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="keyInputHT">Key (string/number)</Label>
                <Input id="keyInputHT" value={keyInput.toString()} onChange={e => setKeyInput(e.target.value)} />
              </div>
              {selectedOperation === 'insert' && (
                <div className="space-y-1">
                  <Label htmlFor="valueInputHT">Value (string/number)</Label>
                  <Input id="valueInputHT" value={valueInput.toString()} onChange={e => setValueInput(e.target.value)} />
                </div>
              )}
            </div>
            <Button onClick={handleExecuteOperation} className="w-full md:w-auto">
                {selectedOperation === 'insert' ? <PlusCircle className="mr-2 h-4 w-4" /> : selectedOperation === 'search' ? <SearchIcon className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Execute {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}
            </Button>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline"><RotateCcw className="mr-2 h-4 w-4" /> Reset Hash Table & Controls</Button>
            </div>
             <div className="mt-2 p-2 border rounded-md bg-background">
                <p className="text-xs font-semibold text-muted-foreground">Current Keys in Table:</p>
                <div className="flex flex-wrap gap-1 text-xs">
                    {insertedWords.length > 0 ? insertedWords.map((w, i) => <Badge key={i} variant="secondary">{w}</Badge>) : "(empty)"}
                </div>
            </div>
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

