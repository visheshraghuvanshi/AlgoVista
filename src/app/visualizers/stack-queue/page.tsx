
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Layers, Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { STACK_QUEUE_CODE_SNIPPETS, StackQueueCodeSnippetsPanel } from './StackQueueCodeSnippets';
import { StackQueueVisualizationPanel } from './StackQueueVisualizationPanel';
import { generateStackSteps, generateQueueSteps, type StackQueueAlgorithmStep, STACK_LINE_MAP, QUEUE_LINE_MAP } from './stack-queue-logic';

const DEFAULT_ANIMATION_SPEED = 600;
const MIN_SPEED = 100;
const MAX_SPEED = 1500;

type StructureType = 'stack' | 'queue';
type StackOperation = 'push' | 'pop' | 'peek';
type QueueOperation = 'enqueue' | 'dequeue' | 'front';

export default function StackQueueVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [selectedStructure, setSelectedStructure] = useState<StructureType>('stack');
  const [selectedStackOp, setSelectedStackOp] = useState<StackOperation>('push');
  const [selectedQueueOp, setSelectedQueueOp] = useState<QueueOperation>('enqueue');
  
  const [initialValuesInput, setInitialValuesInput] = useState("10,20,30");
  const [operationValueInput, setOperationValueInput] = useState("40");

  const [steps, setSteps] = useState<StackQueueAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<StackQueueAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dataStructureRef = useRef<(string | number)[]>([]);

  const parseValues = (input: string): (string|number)[] => {
    if (input.trim() === '') return [];
    return input.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => isNaN(Number(s)) ? s : Number(s));
  };

  const initializeStructure = useCallback(() => {
    const parsed = parseValues(initialValuesInput);
    dataStructureRef.current = parsed;
    let initialStepMessage = `${selectedStructure.charAt(0).toUpperCase() + selectedStructure.slice(1)} initialized.`;
    if (parsed.length === 0) {
      initialStepMessage = `${selectedStructure.charAt(0).toUpperCase() + selectedStructure.slice(1)} is empty.`;
    }

    const initialStepData: StackQueueAlgorithmStep = {
        array: [...parsed],
        activeIndices: [], swappingIndices: [], sortedIndices: [],
        currentLine: null, message: initialStepMessage,
        topIndex: selectedStructure === 'stack' ? (parsed.length > 0 ? parsed.length - 1 : -1) : undefined,
        frontIndex: selectedStructure === 'queue' ? (parsed.length > 0 ? 0 : -1) : undefined,
        rearIndex: selectedStructure === 'queue' ? (parsed.length > 0 ? parsed.length - 1 : -1) : undefined,
        operationType: selectedStructure,
        lastOperation: "Initialize",
        processedValue: parsed.join(', ') || "empty"
    };
    setCurrentStep(initialStepData);
    setSteps([initialStepData]); 
    setIsFinished(true);
    setCurrentStepIndex(0);
  }, [initialValuesInput, selectedStructure]);


  useEffect(() => {
    setIsClient(true);
    initializeStructure();
  }, [initializeStructure]);


  const handleInitialValuesChange = (value: string) => {
    setInitialValuesInput(value);
  };
  
  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      setCurrentStep(steps[stepIndex]);
    }
  }, [steps]);

  const handleExecuteOperation = () => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let newSteps: StackQueueAlgorithmStep[] = [];
    let opValue: string | number | undefined = operationValueInput.trim();
    if (opValue && !isNaN(Number(opValue))) opValue = Number(opValue);

    const needsValue = (selectedStructure === 'stack' && selectedStackOp === 'push') || (selectedStructure === 'queue' && selectedQueueOp === 'enqueue');
    if (needsValue && opValue?.toString().trim() === "") {
        toast({title: "Input Needed", description: "Please provide a value for this operation.", variant: "destructive"});
        return;
    }

    if (selectedStructure === 'stack') {
      newSteps = generateStackSteps([...dataStructureRef.current], selectedStackOp, opValue);
      if (newSteps.length > 0) {
          dataStructureRef.current = [...newSteps[newSteps.length-1].array];
      }
    } else { 
      newSteps = generateQueueSteps([...dataStructureRef.current], selectedQueueOp, opValue);
       if (newSteps.length > 0) {
          dataStructureRef.current = [...newSteps[newSteps.length-1].array];
      }
    }
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) updateStateFromStep(0);
    else { // If no steps (e.g., error in logic or op not changing state)
        setCurrentStep({ // Show current state
            array: [...dataStructureRef.current],
            activeIndices: [], swappingIndices: [], sortedIndices: [],
            currentLine: null, message: "Operation did not produce new steps or state.",
            topIndex: selectedStructure === 'stack' ? (dataStructureRef.current.length > 0 ? dataStructureRef.current.length - 1 : -1) : undefined,
            frontIndex: selectedStructure === 'queue' ? (dataStructureRef.current.length > 0 ? 0 : -1) : undefined,
            rearIndex: selectedStructure === 'queue' ? (dataStructureRef.current.length > 0 ? dataStructureRef.current.length - 1 : -1) : undefined,
            operationType: selectedStructure
        });
    }
  };

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        updateStateFromStep(nextStepIndex);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep]);

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false);
    const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(true);
    setInitialValuesInput("10,20,30");
    initializeStructure(); // This will use the new initialValuesInput due to state update cycle
    setOperationValueInput("40");
  };

  const algoDetails: AlgorithmDetailsProps = {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  };

  if (!isClient) { 
    return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Layers className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
             Interactive Stack and Queue operations.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-2/5 xl:w-1/3">
            <StackQueueVisualizationPanel step={currentStep} structureType={selectedStructure} />
          </div>
          <div className="lg:w-3/5 xl:w-2/3">
             <StackQueueCodeSnippetsPanel currentLine={currentStep?.currentLine ?? null} structureType={selectedStructure}/>
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="initialValues">Initial Values (comma-sep)</Label>
                <Input id="initialValues" value={initialValuesInput} onChange={(e) => handleInitialValuesChange(e.target.value)} disabled={isPlaying}/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="structureType">Structure Type</Label>
                <Select value={selectedStructure} onValueChange={(val) => {
                    setSelectedStructure(val as StructureType);
                    // dataStructureRef.current = parseValues(initialValuesInput); // Ensure ref is updated
                    initializeStructure(); 
                }} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stack">Stack</SelectItem>
                    <SelectItem value="queue">Queue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedStructure === 'stack' && (
                <div className="space-y-1">
                  <Label htmlFor="stackOp">Stack Operation</Label>
                  <Select value={selectedStackOp} onValueChange={(val) => setSelectedStackOp(val as StackOperation)} disabled={isPlaying}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">Push</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="peek">Peek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedStructure === 'queue' && (
                <div className="space-y-1">
                  <Label htmlFor="queueOp">Queue Operation</Label>
                  <Select value={selectedQueueOp} onValueChange={(val) => setSelectedQueueOp(val as QueueOperation)} disabled={isPlaying}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enqueue">Enqueue</SelectItem>
                      <SelectItem value="dequeue">Dequeue</SelectItem>
                      <SelectItem value="front">Front</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            {((selectedStructure === 'stack' && selectedStackOp === 'push') || (selectedStructure === 'queue' && selectedQueueOp === 'enqueue') )&& (
              <div className="space-y-1 max-w-xs">
                <Label htmlFor="opValue">Value to {selectedStructure === 'stack' ? 'Push' : 'Enqueue'}</Label>
                <Input id="opValue" value={operationValueInput} onChange={(e) => setOperationValueInput(e.target.value)} disabled={isPlaying} />
              </div>
            )}
            <Button onClick={handleExecuteOperation} disabled={isPlaying}>Execute Operation</Button>

            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Structure & Controls</Button>
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
