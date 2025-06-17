
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Columns, Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import { algorithmMetadata } from './metadata';
import { DequeOperationsCodePanel } from './DequeOperationsCodePanel';
import { DequeOperationsVisualizationPanel } from './DequeOperationsVisualizationPanel';
import { generateDequeSteps, type DequeAlgorithmStep, DEQUE_LINE_MAP } from './deque-logic';

const DEFAULT_ANIMATION_SPEED = 600;
const MIN_SPEED = 100;
const MAX_SPEED = 1500;

type DequeOperation = 'addFront' | 'addRear' | 'removeFront' | 'removeRear' | 'peekFront' | 'peekRear';

export default function DequeOperationsVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [selectedOperation, setSelectedOperation] = useState<DequeOperation>('addRear');
  const [initialValuesInput, setInitialValuesInput] = useState("10,20,30");
  const [operationValueInput, setOperationValueInput] = useState("40");

  const [steps, setSteps] = useState<DequeAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<DequeAlgorithmStep | null>(null);
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
    const initialStepMessage = `Deque initialized with [${parsed.join(', ') || 'empty'}]`;
    setCurrentStep({
        array: [...parsed],
        activeIndices: [], swappingIndices: [], sortedIndices: [],
        currentLine: null, message: initialStepMessage,
        frontIndex: parsed.length > 0 ? 0 : -1,
        rearIndex: parsed.length > 0 ? parsed.length - 1 : -1,
        operationType: 'deque',
        lastOperation: "Initialize",
        processedValue: parsed.join(', ') || "empty"
    });
    setSteps([]); 
    setIsFinished(true);
    setCurrentStepIndex(0);
  }, [initialValuesInput]);

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
    
    let newSteps: DequeAlgorithmStep[] = [];
    let opValue: string | number | undefined = operationValueInput.trim();
    if (opValue && !isNaN(Number(opValue))) opValue = Number(opValue);

    const needsValue = selectedOperation === 'addFront' || selectedOperation === 'addRear';
    if (needsValue && opValue?.toString().trim() === "") {
        toast({title: "Input Needed", description: "Please provide a value for this operation.", variant: "destructive"});
        return;
    }

    newSteps = generateDequeSteps([...dataStructureRef.current], selectedOperation, opValue);
    if (newSteps.length > 0) {
        dataStructureRef.current = [...newSteps[newSteps.length-1].array];
    }
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) updateStateFromStep(0);
    else { 
        setCurrentStep({ 
            array: [...dataStructureRef.current],
            activeIndices: [], swappingIndices: [], sortedIndices: [],
            currentLine: null, message: "Operation did not produce new steps or state.",
            frontIndex: dataStructureRef.current.length > 0 ? 0 : -1,
            rearIndex: dataStructureRef.current.length > 0 ? dataStructureRef.current.length - 1 : -1,
            operationType: 'deque'
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
    // initializeStructure will be called by initialValuesInput change.
    setOperationValueInput("40");
    const parsed = parseValues("10,20,30");
     dataStructureRef.current = parsed;
     setCurrentStep({
        array: [...parsed],
        activeIndices: [], swappingIndices: [], sortedIndices: [],
        currentLine: null, message: `Deque reset to default.`,
        frontIndex: parsed.length > 0 ? 0 : -1,
        rearIndex: parsed.length > 0 ? parsed.length - 1 : -1,
        operationType: 'deque'
    });
    setSteps([]);
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
          <Columns className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-2/5 xl:w-1/3">
            <DequeOperationsVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-3/5 xl:w-2/3">
             <DequeOperationsCodePanel currentLine={currentStep?.currentLine ?? null}/>
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="initialDequeValues">Initial Values (comma-sep)</Label>
                <Input id="initialDequeValues" value={initialValuesInput} onChange={(e) => handleInitialValuesChange(e.target.value)} disabled={isPlaying}/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="dequeOp">Deque Operation</Label>
                <Select value={selectedOperation} onValueChange={(val) => setSelectedOperation(val as DequeOperation)} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addFront">Add Front</SelectItem>
                    <SelectItem value="addRear">Add Rear</SelectItem>
                    <SelectItem value="removeFront">Remove Front</SelectItem>
                    <SelectItem value="removeRear">Remove Rear</SelectItem>
                    <SelectItem value="peekFront">Peek Front</SelectItem>
                    <SelectItem value="peekRear">Peek Rear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(selectedOperation === 'addFront' || selectedOperation === 'addRear') && (
                <div className="space-y-1">
                  <Label htmlFor="opValueDeque">Value to Add</Label>
                  <Input id="opValueDeque" value={operationValueInput} onChange={(e) => setOperationValueInput(e.target.value)} disabled={isPlaying} />
                </div>
              )}
            </div>
            <Button onClick={handleExecuteOperation} disabled={isPlaying}>Execute Operation</Button>

            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Deque & Controls</Button>
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
