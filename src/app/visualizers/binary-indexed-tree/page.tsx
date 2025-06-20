
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard';
import type { AlgorithmMetadata, AlgorithmDetailsProps, BITAlgorithmStep } from './types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, BinaryIcon, PlusCircle, MinusCircle, Sigma } from 'lucide-react'; // BinaryIcon or similar
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BITVisualizationPanel } from './BITVisualizationPanel';
import { BITCodePanel, BIT_CODE_SNIPPETS } from './BITCodePanel';
import { generateBITSteps, createInitialBIT, BIT_LINE_MAP } from './binary-indexed-tree-logic';
import type { BITOperationType } from './types';

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 1500;
const DEFAULT_BIT_INPUT_ARRAY = "1,3,5,7,9,11";
const MAX_BIT_ARRAY_SIZE = 16;

export default function BinaryIndexedTreePage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [inputValue, setInputValue] = useState(DEFAULT_BIT_INPUT_ARRAY);
  const [selectedOperation, setSelectedOperation] = useState<BITOperationType>('build');
  const [operationIndexInput, setOperationIndexInput] = useState("2"); // For update/query
  const [operationValueInput, setOperationValueInput] = useState("5"); // For update delta
  const [queryRangeEndInput, setQueryRangeEndInput] = useState("4"); // For range query

  const [steps, setSteps] = useState<BITAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<BITAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const bitRef = useRef<{ bitArray: number[], originalArraySize: number }>(createInitialBIT(0));

  useEffect(() => { setIsClient(true); }, []);

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

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) setCurrentStep(steps[stepIndex]);
  }, [steps]);
  
  const handleExecuteOperation = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const arr = parseInputArray(inputValue);
    if (!arr && selectedOperation === 'build') {
      setSteps([]); setCurrentStep(null); setIsFinished(true); return;
    }
    
    let newSteps: BITAlgorithmStep[] = [];
    let opIndex = parseInt(operationIndexInput, 10);
    let opValue = parseInt(operationValueInput, 10);
    let qRangeEnd = parseInt(queryRangeEndInput, 10);

    switch(selectedOperation) {
      case 'build':
        if (!arr) return;
        bitRef.current = createInitialBIT(arr.length);
        newSteps = generateBITSteps(bitRef.current, 'build', arr);
        if (newSteps.length > 0) bitRef.current = { bitArray: [...newSteps[newSteps.length - 1].bitArray], originalArraySize: arr.length };
        break;
      case 'update':
        if (isNaN(opIndex) || isNaN(opValue) || opIndex < 0 || opIndex >= bitRef.current.originalArraySize) {
          toast({title: "Invalid Update Input", description: "Index out of bounds or invalid value.", variant: "destructive"}); return;
        }
        newSteps = generateBITSteps(bitRef.current, 'update', undefined, opIndex, opValue);
        if (newSteps.length > 0) bitRef.current = { bitArray: [...newSteps[newSteps.length - 1].bitArray], originalArraySize: bitRef.current.originalArraySize };
        break;
      case 'query':
        if (isNaN(opIndex) || opIndex < 0 || opIndex >= bitRef.current.originalArraySize) {
          toast({title: "Invalid Query Index", description: "Index out of bounds.", variant: "destructive"}); return;
        }
        newSteps = generateBITSteps(bitRef.current, 'query', undefined, opIndex);
        // No BIT modification, no need to update bitRef.current
        break;
      case 'queryRange':
         if (isNaN(opIndex) || isNaN(qRangeEnd) || opIndex < 0 || qRangeEnd < opIndex || qRangeEnd >= bitRef.current.originalArraySize) {
          toast({title: "Invalid Query Range", description: "Range indices out of bounds or invalid.", variant: "destructive"}); return;
        }
        newSteps = generateBITSteps(bitRef.current, 'queryRange', undefined, opIndex, undefined, qRangeEnd);
        break;
    }
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCurrentStep(newSteps[0] || null);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) {
        const lastStep = newSteps[newSteps.length-1];
        if(lastStep.auxiliaryData?.queryResult !== undefined) {
            toast({title: "Query Result", description: `${selectedOperation === 'queryRange' ? `Sum(${operationIndexInput}..${queryRangeEndInput})` : `PrefixSum(${operationIndexInput})`} = ${lastStep.auxiliaryData.queryResult}`})
        }
    }

  }, [inputValue, selectedOperation, operationIndexInput, operationValueInput, queryRangeEndInput, parseInputArray, toast, updateStateFromStep]);
  
  useEffect(() => { handleExecuteOperation(); }, [selectedOperation, inputValue, operationIndexInput, operationValueInput, queryRangeEndInput, handleExecuteOperation]);

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
  const handleReset = () => { 
    setIsPlaying(false); setIsFinished(false); 
    setInputValue(DEFAULT_BIT_INPUT_ARRAY);
    setSelectedOperation('build');
    setOperationIndexInput("2");
    setOperationValueInput("5");
    setQueryRangeEndInput("4");
    bitRef.current = createInitialBIT(0);
  };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  const showOpValueInput = selectedOperation === 'update';
  const showOpIndexInput = selectedOperation === 'update' || selectedOperation === 'query' || selectedOperation === 'queryRange';
  const showQueryRangeEndInput = selectedOperation === 'queryRange';

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
            <BITVisualizationPanel step={currentStep} originalArray={parseInputArray(inputValue) || []} />
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
                <Label htmlFor="bitArrayInput">Input Array (for Build, max {MAX_BIT_ARRAY_SIZE})</Label>
                <Input id="bitArrayInput" value={inputValue} onChange={e => setInputValue(e.target.value)} disabled={isPlaying || selectedOperation !== 'build'}/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="bitOperationSelect">Operation</Label>
                <Select value={selectedOperation} onValueChange={v => setSelectedOperation(v as BITOperationType)} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="build">Build BIT</SelectItem>
                    <SelectItem value="update">Update (Index, Delta)</SelectItem>
                    <SelectItem value="query">Query Prefix Sum (Index)</SelectItem>
                    <SelectItem value="queryRange">Query Range Sum (Start, End)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showOpIndexInput && (
                <div className="space-y-1">
                  <Label htmlFor="opIndexInputBIT">{selectedOperation === 'queryRange' ? "Start Index" : "Index (0-based)"}</Label>
                  <Input id="opIndexInputBIT" type="number" value={operationIndexInput} onChange={e => setOperationIndexInput(e.target.value)} disabled={isPlaying || selectedOperation === 'build'}/>
                </div>
              )}
               {showOpValueInput && (
                <div className="space-y-1">
                  <Label htmlFor="opValueInputBIT">Value / Delta (for Update)</Label>
                  <Input id="opValueInputBIT" type="number" value={operationValueInput} onChange={e => setOperationValueInput(e.target.value)} disabled={isPlaying || selectedOperation !== 'update'}/>
                </div>
              )}
              {showQueryRangeEndInput && (
                <div className="space-y-1">
                  <Label htmlFor="queryRangeEndInputBIT">End Index (for Range Query, inclusive)</Label>
                  <Input id="queryRangeEndInputBIT" type="number" value={queryRangeEndInput} onChange={e => setQueryRangeEndInput(e.target.value)} disabled={isPlaying || selectedOperation !== 'queryRange'}/>
                </div>
              )}
            </div>
            <Button onClick={handleExecuteOperation} disabled={isPlaying || selectedOperation === 'build'} className="w-full md:w-auto">
                {selectedOperation === 'update' ? <PlusCircle/> : <Sigma/> }
                Execute {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}
            </Button>
            
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

    