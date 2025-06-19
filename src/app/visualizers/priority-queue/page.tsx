
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, AlgorithmDetailsProps, PriorityQueueStep, PriorityQueueItem } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, ListOrdered, PlusCircle, MinusCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PriorityQueueVisualizationPanel } from './PriorityQueueVisualizationPanel';
import { PriorityQueueCodePanel } from './PriorityQueueCodePanel';
import { generatePriorityQueueSteps, createInitialPriorityQueue, PRIORITY_QUEUE_LINE_MAP } from './priority-queue-logic';

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 1800;

type PQOperationType = 'enqueue' | 'dequeue' | 'peek' | 'init';

export default function PriorityQueueVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [itemValueInput, setItemValueInput] = useState<string | number>("TaskA");
  const [itemPriorityInput, setItemPriorityInput] = useState<number>(5);
  const [selectedOperation, setSelectedOperation] = useState<PQOperationType>('init'); // Start with 'init'
  
  const [steps, setSteps] = useState<PriorityQueueStep[]>([]);
  const [currentStep, setCurrentStep] = useState<PriorityQueueStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pqRef = useRef<PriorityQueueItem[]>(createInitialPriorityQueue());

  useEffect(() => { 
    setIsClient(true); 
    initializePQ();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initializePQ = useCallback(() => {
    pqRef.current = createInitialPriorityQueue();
    const initialStep: PriorityQueueStep = {
        heapArray: [], operation: 'init', message: "Priority Queue (Min-Heap) initialized. It's empty.", currentLine: null,
        activeIndices: [], swappingIndices: [], sortedIndices: [], activeHeapIndices: []
    };
    setCurrentStep(initialStep);
    setSteps([initialStep]);
    setIsFinished(true);
    setCurrentStepIndex(0);
  }, []);


  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) setCurrentStep(steps[stepIndex]);
  }, [steps]);
  
  const handleExecuteOperation = () => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    if (selectedOperation === 'init') {
        initializePQ();
        toast({title: "Priority Queue Initialized", description: "The PQ is now empty."});
        return;
    }

    const needsValueAndPrio = selectedOperation === 'enqueue';
    if (needsValueAndPrio && (String(itemValueInput).trim() === "" || itemPriorityInput === undefined || isNaN(itemPriorityInput))) {
        toast({title: "Invalid Input", description: "Please provide item value and a numeric priority for enqueue.", variant: "destructive"}); return;
    }

    const newSteps = generatePriorityQueueSteps([...pqRef.current], selectedOperation as 'enqueue'|'dequeue'|'peek', itemValueInput, itemPriorityInput);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) {
        updateStateFromStep(0);
        if(newSteps[newSteps.length - 1].heapArray) {
            pqRef.current = [...newSteps[newSteps.length - 1].heapArray];
        }
        const lastStep = newSteps[newSteps.length - 1];
        if (lastStep.message && lastStep.operation !== 'init') {
             toast({title: `${lastStep.lastOperation || 'Operation'} Status`, description: lastStep.message});
        }
    } else {
        setCurrentStep({ ...currentStep!, message: "Operation did not produce steps." });
    }
  };

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateStateFromStep(nextIdx);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false); setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep]);

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => { setIsPlaying(false); setIsFinished(true); initializePQ(); };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <ListOrdered className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <PriorityQueueVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <PriorityQueueCodePanel currentLine={currentStep?.currentLine ?? null} selectedOperation={selectedOperation} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="pqOperationSelect">Operation</Label>
                <Select value={selectedOperation} onValueChange={v => setSelectedOperation(v as PQOperationType)} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="init">Initialize/Clear PQ</SelectItem>
                    <SelectItem value="enqueue">Enqueue (Value, Priority)</SelectItem>
                    <SelectItem value="dequeue">Dequeue (Extract Min)</SelectItem>
                    <SelectItem value="peek">Peek (Min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedOperation === 'enqueue' && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="itemValueInputPQ">Item Value (string/number)</Label>
                    <Input id="itemValueInputPQ" value={itemValueInput.toString()} onChange={e => setItemValueInput(e.target.value)} disabled={isPlaying} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="itemPriorityInputPQ">Priority (number)</Label>
                    <Input id="itemPriorityInputPQ" type="number" value={itemPriorityInput} onChange={e => setItemPriorityInput(parseInt(e.target.value,10))} disabled={isPlaying} />
                  </div>
                </>
              )}
            </div>
            <Button onClick={handleExecuteOperation} disabled={isPlaying} className="w-full md:w-auto">
                {selectedOperation === 'enqueue' ? <PlusCircle /> : selectedOperation === 'dequeue' ? <MinusCircle /> : selectedOperation === 'peek' ? <Eye /> : <RotateCcw />}
                Execute {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}
            </Button>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset PQ & Controls</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1} size="lg"><Play className="mr-2"/>Play</Button> 
                             : <Button onClick={handlePause} size="lg"><Pause className="mr-2"/>Pause</Button>}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1} size="lg"><SkipForward className="mr-2"/>Step</Button>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
                <Label htmlFor="speedControl">Animation Speed</Label>
                <Slider id="speedControl" min={MIN_SPEED} max={MAX_SPEED} step={50} value={[animationSpeed]} onValueChange={(v) => setAnimationSpeed(v[0])} disabled={isPlaying} />
                <p className="text-xs text-muted-foreground text-center">{animationSpeed} ms delay</p>
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

  
