// src/app/visualizers/deque-operations/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, AlgorithmDetailsProps, DequeAlgorithmStep } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { useToast } from "@/hooks/use-toast";
import { Columns, Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import { DequeOperationsCodePanel } from './DequeOperationsCodePanel';
import { DequeOperationsVisualizationPanel } from './DequeOperationsVisualizationPanel';
import { generateDequeSteps, DEQUE_LINE_MAP } from './deque-logic';

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

  const [currentStep, setCurrentStep] = useState<DequeAlgorithmStep | null>(null);
  
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
    initializeStructure();
  }, [initializeStructure, selectedOperation]); // Re-initialize if structure type changes


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
    
    // Deque operations are typically discrete and don't generate multiple "steps" for animation
    // So, we directly apply the operation and show the result.
    const resultingSteps = generateDequeSteps([...dataStructureRef.current], selectedOperation, opValue);
    const finalStep = resultingSteps[resultingSteps.length - 1]; // The outcome of the operation
    
    if (finalStep) {
        dataStructureRef.current = [...finalStep.array]; // Persist the new state
        setCurrentStep(finalStep); // Display the final state
        toast({title: `${finalStep.lastOperation || 'Operation'} Complete`, description: finalStep.message});
    } else {
        // This case should ideally not happen if generateDequeSteps always returns at least one step.
        // If it does, it means an error in logic generation or an unhandled scenario.
        const currentArrayState = [...dataStructureRef.current];
        setCurrentStep({
            array: currentArrayState, activeIndices: [], swappingIndices: [], sortedIndices: [],
            currentLine: null, message: "Operation did not change state or an error occurred.",
            frontIndex: currentArrayState.length > 0 ? 0 : -1,
            rearIndex: currentArrayState.length > 0 ? currentArrayState.length - 1 : -1,
            operationType: 'deque'
        });
    }
  };

  const handleReset = () => {
    setInitialValuesInput("10,20,30");
    setOperationValueInput("40");
    setSelectedOperation('addRear');
    // initializeStructure will be called by initialValuesInput change if it's a dependency of its useEffect.
    // For direct re-init based on default values:
    const parsedDefaults = parseValues("10,20,30");
    dataStructureRef.current = parsedDefaults;
    const initialStepData: DequeAlgorithmStep = {
        array: [...parsedDefaults], activeIndices: [], swappingIndices: [], sortedIndices: [],
        currentLine: null, message: "Deque reset to default values.",
        frontIndex: parsedDefaults.length > 0 ? 0 : -1,
        rearIndex: parsedDefaults.length > 0 ? parsedDefaults.length - 1 : -1,
        operationType: 'deque', lastOperation: "Reset", processedValue: parsedDefaults.join(', ') || "empty"
    };
    setCurrentStep(initialStepData);
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
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
             Interactive Deque operations. Visualization steps are discrete per operation.
          </p>
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
             {/* Animation controls are removed as operations are discrete */}
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
