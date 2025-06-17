
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, DSUStep } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, Merge, SearchCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { DSUVisualizationPanel } from './DSUVisualizationPanel';
import { DSUCodePanel } from './DSUCodePanel';
import { generateDSUSteps, DSU_LINE_MAP } from './dsu-logic';

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 1800;
const DEFAULT_NUM_ELEMENTS = 10;
const MAX_NUM_ELEMENTS = 20;

type DSUOperationType = 'find' | 'union';

export default function DSUVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [numElements, setNumElements] = useState(DEFAULT_NUM_ELEMENTS);
  const [elementAInput, setElementAInput] = useState("1");
  const [elementBInput, setElementBInput] = useState("2"); // For union
  const [currentOperation, setCurrentOperation] = useState<DSUOperationType>('union');
  
  const [steps, setSteps] = useState<DSUStep[]>([]);
  const [currentStep, setCurrentStep] = useState<DSUStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dsuStructureRef = useRef<{ parent: number[], rank: number[] }>({ parent: [], rank: [] });

  useEffect(() => { setIsClient(true); }, []);
  
  const initializeDSU = useCallback(() => {
    if (numElements < 1 || numElements > MAX_NUM_ELEMENTS) {
        toast({ title: "Invalid Size", description: `Number of elements must be between 1 and ${MAX_NUM_ELEMENTS}.`, variant: "destructive" });
        return;
    }
    const initialSteps = generateDSUSteps(numElements, 'initial', 0, 0); // Dummy ops for init
    if (initialSteps.length > 0) {
        const initState = initialSteps[0];
        dsuStructureRef.current = { parent: [...initState.parentArray], rank: [...(initState.rankArray || [])] };
        setCurrentStep(initState);
        setSteps([initState]); // Only show initial state
        setIsFinished(true); // No animation for init
        setCurrentStepIndex(0);
    }
  }, [numElements, toast]);

  useEffect(() => {
    initializeDSU();
  }, [numElements, initializeDSU]);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      setCurrentStep(steps[stepIndex]);
    }
  }, [steps]);
  
  const handleExecuteOperation = () => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const elA = parseInt(elementAInput, 10);
    const elB = currentOperation === 'union' ? parseInt(elementBInput, 10) : -1; // -1 if not union

    if (isNaN(elA) || (currentOperation === 'union' && isNaN(elB))) {
      toast({ title: "Invalid Input", description: "Element(s) must be numbers.", variant: "destructive" });
      return;
    }
    if (elA < 0 || elA >= numElements || (currentOperation === 'union' && (elB < 0 || elB >= numElements))) {
      toast({ title: "Invalid Element", description: `Elements must be between 0 and ${numElements - 1}.`, variant: "destructive" });
      return;
    }
    if (currentOperation === 'union' && elA === elB) {
      toast({ title: "Same Elements", description: "Cannot union an element with itself in this context.", variant: "default" });
      return;
    }


    const newSteps = generateDSUSteps(numElements, currentOperation, elA, elB, dsuStructureRef.current);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) {
        updateVisualStateFromStep(0);
        // Update the ref with the final state from the operation
        const lastStep = newSteps[newSteps.length - 1];
        dsuStructureRef.current = { parent: [...lastStep.parentArray], rank: [...(lastStep.rankArray || [])] };
    } else {
        // Re-show current DSU state if op didn't produce steps (e.g. error)
        setCurrentStep({
            parentArray: [...dsuStructureRef.current.parent],
            rankArray: [...dsuStructureRef.current.rank],
            operation: 'initial', elementsInvolved: [], message: "Error in operation.", currentLine: null, activeIndices: [],
        });
    }
  };

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateVisualStateFromStep(nextIdx);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false); setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateVisualStateFromStep]);

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateVisualStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(true);
    setNumElements(DEFAULT_NUM_ELEMENTS); // This triggers re-initialization via useEffect
    setElementAInput("1");
    setElementBInput("2");
    setCurrentOperation('union');
  };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Merge className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <DSUVisualizationPanel step={currentStep} numElements={numElements} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <DSUCodePanel currentLine={currentStep?.currentLine ?? null} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="numElementsDSU">Number of Elements (0 to N-1, max {MAX_NUM_ELEMENTS})</Label>
                <Input id="numElementsDSU" type="number" value={numElements} 
                       onChange={e => setNumElements(Math.min(MAX_NUM_ELEMENTS, Math.max(1, parseInt(e.target.value) || 1)))} 
                       min="1" max={MAX_NUM_ELEMENTS.toString()} disabled={isPlaying} />
              </div>
               <div className="space-y-1">
                <Label htmlFor="dsuOperationSelect">Operation</Label>
                <Select value={currentOperation} onValueChange={v => setCurrentOperation(v as DSUOperationType)} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="union">Union(A, B)</SelectItem>
                    <SelectItem value="find">Find(A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                 <div className="space-y-1">
                    <Label htmlFor="elementADSUn">Element A (0 to N-1)</Label>
                    <Input id="elementADSUn" type="number" value={elementAInput} onChange={e => setElementAInput(e.target.value)} min="0" max={(numElements-1).toString()} disabled={isPlaying} />
                </div>
                {currentOperation === 'union' && (
                    <div className="space-y-1">
                        <Label htmlFor="elementBDSU">Element B (0 to N-1)</Label>
                        <Input id="elementBDSU" type="number" value={elementBInput} onChange={e => setElementBInput(e.target.value)} min="0" max={(numElements-1).toString()} disabled={isPlaying} />
                    </div>
                )}
            </div>
            <Button onClick={handleExecuteOperation} disabled={isPlaying} className="w-full md:w-auto">
                {currentOperation === 'union' ? <Merge className="mr-2 h-4 w-4"/> : <SearchCheck className="mr-2 h-4 w-4"/>}
                Execute {currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)}
            </Button>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset DSU & Controls</Button>
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

    