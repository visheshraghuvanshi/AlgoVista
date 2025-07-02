
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard';
import type { AlgorithmMetadata, AlgorithmStep } from './types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, BinaryIcon, PlusCircle, Sigma, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BITVisualizationPanel } from './BITVisualizationPanel';
import { BITCodePanel } from './BITCodePanel';
import { generateBITSteps, createInitialBIT, BIT_LINE_MAP } from './binary-indexed-tree-logic';
import type { SegmentTreeOperation } from './types';

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 1800;
const DEFAULT_BIT_INPUT_ARRAY = "1,3,5,7,9,11";
const MAX_BIT_ARRAY_SIZE = 16;

export default function BinaryIndexedTreePage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [inputValue, setInputValue] = useState(DEFAULT_BIT_INPUT_ARRAY);
  const [selectedOperation, setSelectedOperation] = useState<SegmentTreeOperation>('build');
  
  const [updateIndexInput, setUpdateIndexInput] = useState("2");
  const [updateValueInput, setUpdateValueInput] = useState("4");
  
  const [queryLInput, setQueryLInput] = useState("1");
  const [queryRInput, setQueryRInput] = useState("4");

  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const bitRef = useRef<{ bitArray: number[], originalArraySize: number }>({ bitArray: [], originalArraySize: 0});
  const [originalArray, setOriginalArray] = useState<number[]>([]);

  useEffect(() => { setIsClient(true); handleExecuteOperation('build'); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const parseInputArray = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',').map(s => parseInt(s.trim(), 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Array", description: "Please enter comma-separated numbers.", variant: "destructive" });
      return null;
    }
    if (parsed.length > MAX_BIT_ARRAY_SIZE) {
      toast({ title: "Input Too Large", description: `Max ${MAX_BIT_ARRAY_SIZE} elements for visualization.`, variant: "default" });
      return parsed.slice(0, MAX_BIT_ARRAY_SIZE);
    }
    return parsed;
  }, [toast]);
  
  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) setCurrentStep(steps[stepIndex]);
  }, [steps, setCurrentStep]);

  const handleExecuteOperation = useCallback((opToExecute?: SegmentTreeOperation) => {
    const operation = opToExecute || selectedOperation;
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let parsedInput = parseInputArray(inputValue);
    if (!parsedInput) {
      setSteps([]); setCurrentStep(null); setIsFinished(true); return;
    }

    if (operation === 'build') {
      bitRef.current.originalArraySize = parsedInput.length;
      bitRef.current.bitArray = createInitialBIT(parsedInput.length);
      setOriginalArray(parsedInput);
    }
    
    let newSteps: AlgorithmStep[] = [];
    if (operation === 'build') {
        newSteps = generateBITSteps(operation, parsedInput, [], parsedInput.length);
    } else if(operation === 'update') {
        const uIdx = parseInt(updateIndexInput, 10);
        const uVal = parseInt(updateValueInput, 10);
        if(isNaN(uIdx) || isNaN(uVal) || uIdx < 0 || uIdx >= bitRef.current.originalArraySize) {
            toast({title: "Invalid Update Input", description: `Index must be between 0 and ${bitRef.current.originalArraySize - 1}.`, variant:"destructive"}); return;
        }
        const updatedOriginalArray = [...originalArray];
        updatedOriginalArray[uIdx] = uVal;
        setOriginalArray(updatedOriginalArray); // Update displayed original array
        newSteps = generateBITSteps(operation, updatedOriginalArray, bitRef.current.bitArray, bitRef.current.originalArraySize, undefined, undefined, uIdx, uVal);
    } else if (operation === 'queryRange') {
        const qL = parseInt(queryLInput, 10);
        const qR = parseInt(queryRInput, 10);
        if(isNaN(qL) || isNaN(qR) || qL < 0 || qR < qL || qR >= bitRef.current.originalArraySize) {
            toast({title: "Invalid Query Range", description: `Range [${qL},${qR}] is invalid for array size ${bitRef.current.originalArraySize}.`, variant:"destructive"}); return;
        }
        newSteps = generateBITSteps(operation, originalArray, bitRef.current.bitArray, bitRef.current.originalArraySize, qL, qR);
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) {
      const finalStep = newSteps[newSteps.length - 1];
      if (finalStep.auxiliaryData?.finalTree) {
          bitRef.current.bitArray = finalStep.auxiliaryData.finalTree;
      }
      if(finalStep.auxiliaryData?.finalResult !== undefined){
          toast({title: "Query Result", description: `Sum for range [${queryLInput},${queryRInput}] is ${finalStep.auxiliaryData.finalResult}.`});
      }
      updateVisualStateFromStep(0);
    } else {
      setCurrentStep(null);
    }
  }, [selectedOperation, inputValue, updateIndexInput, updateValueInput, queryLInput, queryRInput, parseInputArray, toast, updateVisualStateFromStep, originalArray]);

  useEffect(() => { handleExecuteOperation('build'); }, [inputValue]); // Re-build if input value changes

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
  const handleReset = () => { setIsPlaying(false); setIsFinished(true); setInputValue(DEFAULT_BIT_INPUT_ARRAY); };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <BinaryIcon className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <BITVisualizationPanel data={currentStep?.array || []} activeIndices={currentStep?.activeIndices} originalInputArray={originalArray} originalArraySize={originalArraySizeRef.current} auxiliaryData={currentStep?.auxiliaryData} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <BITCodePanel currentLine={currentStep?.currentLine ?? null} selectedOperation={selectedOperation} />
          </div>
        </div>
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="bitArrayInput">Initial Array (max {MAX_BIT_ARRAY_SIZE})</Label>
                <Input id="bitArrayInput" value={inputValue} onChange={e => setInputValue(e.target.value)} disabled={isPlaying}/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="bitOperationSelect">Operation</Label>
                <Select value={selectedOperation} onValueChange={v => setSelectedOperation(v as SegmentTreeOperation)} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="build">Build Tree</SelectItem>
                    <SelectItem value="update">Update Value</SelectItem>
                    <SelectItem value="queryRange">Query Range Sum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleExecuteOperation()} disabled={isPlaying} className="w-full md:w-auto">Execute</Button>
            </div>
            {selectedOperation === 'update' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label htmlFor="updateIndexInput">Index (0-indexed)</Label><Input id="updateIndexInput" type="number" value={updateIndexInput} onChange={e=>setUpdateIndexInput(e.target.value)} disabled={isPlaying}/></div>
                    <div className="space-y-1"><Label htmlFor="updateValueInput">New Value</Label><Input id="updateValueInput" type="number" value={updateValueInput} onChange={e=>setUpdateValueInput(e.target.value)} disabled={isPlaying}/></div>
                </div>
            )}
            {selectedOperation === 'queryRange' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label htmlFor="queryLInput">Left Index (0-indexed, inclusive)</Label><Input id="queryLInput" type="number" value={queryLInput} onChange={e=>setQueryLInput(e.target.value)} disabled={isPlaying}/></div>
                    <div className="space-y-1"><Label htmlFor="queryRInput">Right Index (0-indexed, inclusive)</Label><Input id="queryRInput" type="number" value={queryRInput} onChange={e=>setQueryRInput(e.target.value)} disabled={isPlaying}/></div>
                </div>
            )}
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset All</Button>
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
