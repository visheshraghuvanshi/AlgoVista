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

const DEFAULT_ANIMATION_SPEED = 600; // Not used for discrete operations
const MIN_SPEED = 100;
const MAX_SPEED = 1500;

type DequeOperation = 'addFront' | 'addRear' | 'removeFront' | 'removeRear' | 'peekFront' | 'peekRear';

export default function DequeOperationsVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [selectedOperation, setSelectedOperation] = useState<DequeOperation>('addRear');
  const [initialValuesInput, setInitialValuesInput] = useState("10,20,30");
  const [operationValueInput, setOperationValueInput] = useState("40");

  const [currentStep, setCurrentStep] = useState<DequeAlgorithmStep | null>(null);
  // Steps array and animation controls are not needed for fully discrete operations

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
    let initialStepMessage = `Deque initialized.`;
    if (parsed.length === 0) {
      initialStepMessage = `Deque is empty.`;
    }

    const initialStepData: DequeAlgorithmStep = {
        array: [...parsed],
        activeIndices: [], swappingIndices: [], sortedIndices: [],
        currentLine: null, message: initialStepMessage,
        frontIndex: parsed.length > 0 ? 0 : -1,
        rearIndex: parsed.length > 0 ? parsed.length - 1 : -1,
        operationType: 'deque',
        lastOperation: "Initialize",
        processedValue: parsed.join(', ') || "empty"
    };
    setCurrentStep(initialStepData);
  }, [initialValuesInput, selectedOperation]);


  useEffect(() => {
    setIsClient(true);
    initializeStructure();
  }, [initializeStructure]);


  const handleInitialValuesChange = (value: string) => {
    setInitialValuesInput(value);
    const parsed = parseValues(value);
    dataStructureRef.current = parsed;
    const initialStepMessage = `Deque updated with new initial values.`;
     const updatedInitialStep: DequeAlgorithmStep = {
        array: [...parsed], activeIndices: [], swappingIndices: [], sortedIndices: [],
        currentLine: null, message: initialStepMessage,
        frontIndex: parsed.length > 0 ? 0 : -1,
        rearIndex: parsed.length > 0 ? parsed.length - 1 : -1,
        operationType: 'deque', lastOperation: "Set Initial Values", processedValue: parsed.join(', ') || "empty"
    };
    setCurrentStep(updatedInitialStep);
  };
  
  const handleExecuteOperation = () => {
    let opValue: string | number | undefined = operationValueInput.trim();
    if (opValue && !isNaN(Number(opValue))) opValue = Number(opValue);

    const needsValue = selectedOperation === 'addFront' || selectedOperation === 'addRear';
    if (needsValue && opValue?.toString().trim() === "") {
        toast({title: "Input Needed", description: "Please provide a value for this operation.", variant: "destructive"});
        return;
    }

    // For discrete operations, we generate just one "step" representing the result
    const resultingSteps = generateDequeSteps([...dataStructureRef.current], selectedOperation, opValue);
    const finalStep = resultingSteps[resultingSteps.length - 1];
    
    if (finalStep) {
        dataStructureRef.current = [...finalStep.array];
        setCurrentStep(finalStep);
        toast({title: `${finalStep.lastOperation || 'Operation'} Complete`, description: finalStep.message});
    } else {
        const currentArrayState = [...dataStructureRef.current];
        setCurrentStep({
            array: currentArrayState, activeIndices: [], swappingIndices: [], sortedIndices: [],
            currentLine: null, message: "Operation resulted in no change or an error.",
            frontIndex: currentArrayState.length > 0 ? 0 : -1,
            rearIndex: currentArrayState.length > 0 ? currentArrayState.length - 1 : -1,
            operationType: 'deque'
        });
    }
  };

  const handleReset = () => {
    setInitialValuesInput("10,20,30");
    initializeStructure(); 
    setOperationValueInput("40");
    setSelectedOperation('addRear');
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
                <Input id="initialDequeValues" value={initialValuesInput} onChange={(e) => handleInitialValuesChange(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dequeOp">Deque Operation</Label>
                <Select value={selectedOperation} onValueChange={(val) => setSelectedOperation(val as DequeOperation)}>
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
                  <Input id="opValueDeque" value={operationValueInput} onChange={(e) => setOperationValueInput(e.target.value)} />
                </div>
              )}
            </div>
            <Button onClick={handleExecuteOperation} className="w-full md:w-auto">Execute Operation</Button>

            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleReset} variant="outline"><RotateCcw className="mr-2 h-4 w-4" /> Reset Deque & Controls</Button>
            </div>
            {/* Play/Pause/Step/Speed controls removed as they are not suitable for discrete operations */}
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

