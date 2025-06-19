// src/app/visualizers/stack-queue/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, AlgorithmDetailsProps } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
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
  
  const dataStructureRef = useRef<(string | number)[]>([]);

  useEffect(() => {
    setIsClient(true);
    initializeStructure();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [initialValuesInput, selectedStructure]);


  useEffect(() => {
    initializeStructure();
  }, [initializeStructure, selectedStructure]); // Re-initialize if structure type changes


  const handleInitialValuesChange = (value: string) => {
    setInitialValuesInput(value);
    const parsed = parseValues(value);
    dataStructureRef.current = parsed;
    const initialStepMessage = `${selectedStructure.charAt(0).toUpperCase() + selectedStructure.slice(1)} updated with new initial values.`;
     const updatedInitialStep: StackQueueAlgorithmStep = {
        array: [...parsed], activeIndices: [], swappingIndices: [], sortedIndices: [],
        currentLine: null, message: initialStepMessage,
        topIndex: selectedStructure === 'stack' ? (parsed.length > 0 ? parsed.length - 1 : -1) : undefined,
        frontIndex: selectedStructure === 'queue' ? (parsed.length > 0 ? 0 : -1) : undefined,
        rearIndex: selectedStructure === 'queue' ? (parsed.length > 0 ? parsed.length - 1 : -1) : undefined,
        operationType: selectedStructure, lastOperation: "Set Initial Values", processedValue: parsed.join(', ') || "empty"
    };
    setCurrentStep(updatedInitialStep);
    setSteps([updatedInitialStep]);
  };
  
  const handleExecuteOperation = () => {
    let opValue: string | number | undefined = operationValueInput.trim();
    if (opValue && !isNaN(Number(opValue))) opValue = Number(opValue);

    const needsValue = (selectedStructure === 'stack' && selectedStackOp === 'push') || (selectedStructure === 'queue' && selectedQueueOp === 'enqueue');
    if (needsValue && opValue?.toString().trim() === "") {
        toast({title: "Input Needed", description: "Please provide a value for this operation.", variant: "destructive"});
        return;
    }
    
    let operationResultStep: StackQueueAlgorithmStep | undefined;

    if (selectedStructure === 'stack') {
      const tempSteps = generateStackSteps([...dataStructureRef.current], selectedStackOp, opValue);
      operationResultStep = tempSteps[tempSteps.length -1]; 
      if(operationResultStep) dataStructureRef.current = [...operationResultStep.array];
    } else { 
      const tempSteps = generateQueueSteps([...dataStructureRef.current], selectedQueueOp, opValue);
      operationResultStep = tempSteps[tempSteps.length -1];
      if(operationResultStep) dataStructureRef.current = [...operationResultStep.array];
    }
    
    if (operationResultStep) {
        setCurrentStep(operationResultStep);
        setSteps([operationResultStep]); 
        toast({title: `${operationResultStep.lastOperation || 'Operation'} Complete`, description: operationResultStep.message});
    } else {
        const currentArrayState = [...dataStructureRef.current];
        setCurrentStep({
            array: currentArrayState, activeIndices: [], swappingIndices: [], sortedIndices: [],
            currentLine: null, message: "Operation resulted in no change or an error.",
            topIndex: selectedStructure === 'stack' ? (currentArrayState.length > 0 ? currentArrayState.length - 1 : -1) : undefined,
            frontIndex: selectedStructure === 'queue' ? (currentArrayState.length > 0 ? 0 : -1) : undefined,
            rearIndex: selectedStructure === 'queue' ? (currentArrayState.length > 0 ? currentArrayState.length - 1 : -1) : undefined,
            operationType: selectedStructure
        });
        setSteps(currentStep ? [currentStep] : []);
    }
  };

  const handleReset = () => {
    setInitialValuesInput("10,20,30");
    setOperationValueInput("40");
    setSelectedStackOp('push');
    setSelectedQueueOp('enqueue');
    // initializeStructure will be called by initialValuesInput change / selectedStructure change
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
             Interactive Stack and Queue operations. Visualization steps are discrete per operation.
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
                <Input id="initialValues" value={initialValuesInput} onChange={(e) => handleInitialValuesChange(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="structureType">Structure Type</Label>
                <Select value={selectedStructure} onValueChange={(val) => {
                    setSelectedStructure(val as StructureType);
                }}>
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
                  <Select value={selectedStackOp} onValueChange={(val) => setSelectedStackOp(val as StackOperation)}>
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
                  <Select value={selectedQueueOp} onValueChange={(val) => setSelectedQueueOp(val as QueueOperation)}>
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
                <Input id="opValue" value={operationValueInput} onChange={(e) => setOperationValueInput(e.target.value)} />
              </div>
            )}
            <Button onClick={handleExecuteOperation} className="w-full md:w-auto">Execute Operation</Button>

            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleReset} variant="outline"><RotateCcw className="mr-2 h-4 w-4" /> Reset Structure & Controls</Button>
            </div>
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
