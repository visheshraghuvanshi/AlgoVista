
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; 
import type { AlgorithmMetadata, AlgorithmStep, AlgorithmDetailsProps } from './types'; 
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Sigma } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SegmentTreeVisualizationPanel } from './SegmentTreeVisualizationPanel'; 
import { SegmentTreeCodePanel } from './SegmentTreeCodePanel'; 
import { generateSegmentTreeSteps, type SegmentTreeOperation } from './segment-tree-logic'; 
import { algorithmMetadata } from './metadata'; 
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from "lucide-react";
import { Slider } from "@/components/ui/slider";


const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;
const DEFAULT_INPUT_ARRAY = "1,3,5,7,9,11"; 
const MAX_INPUT_SIZE = 12;


export default function SegmentTreeVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [inputValue, setInputValue] = useState(DEFAULT_INPUT_ARRAY); 
  const [originalInputForDisplay, setOriginalInputForDisplay] = useState<number[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<SegmentTreeOperation>('build');
  
  const [queryLeft, setQueryLeft] = useState("1"); // 0-indexed for user input
  const [queryRight, setQueryRight] = useState("4"); // 0-indexed for user input, exclusive for logic

  const [updateIndex, setUpdateIndex] = useState("2"); // 0-indexed for user input
  const [updateValue, setUpdateValue] = useState("10");
  
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedData, setDisplayedData] = useState<number[]>([]); // This will be the segment tree array
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [auxiliaryDisplay, setAuxiliaryDisplay] = useState<Record<string, string|number|null> | null>(null);
  const [message, setMessage] = useState<string | undefined>(algorithmMetadata.description);
  const [currentProcessingRange, setCurrentProcessingRange] = useState<[number,number] | null>(null);


  const [isPlaying, setIsPlaying] = useState(isPlaying);
  const [isFinished, setIsFinished] = useState(true); 
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const segmentTreeArrayRef = useRef<number[]>([]); 
  const originalArraySizeRef = useRef<number>(0); 

  useEffect(() => {
    setIsClient(true);
    handleExecuteOperation('build'); // Initial build
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const parseInput = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',').map(s => s.trim()).filter(s => s !== '').map(s => parseInt(s, 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated numbers.", variant: "destructive" });
      return null;
    }
    if (parsed.length > MAX_INPUT_SIZE) { 
        toast({ title: "Input Too Long", description: `Max ${MAX_INPUT_SIZE} numbers for optimal visualization.`, variant: "default"});
        return parsed.slice(0, MAX_INPUT_SIZE); // Truncate for now
    }
    if (parsed.some(n => n > 999 || n < -999)) {
      toast({ title: "Input out of range", description: "Numbers must be between -999 and 999.", variant: "destructive" });
      return null;
    }
    setOriginalInputForDisplay(parsed); // Keep a copy of the original input for display
    return parsed;
  }, [toast]);

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setDisplayedData(currentS.array); 
      setActiveIndices(currentS.activeIndices);
      setCurrentLine(currentS.currentLine);
      setAuxiliaryDisplay(currentS.auxiliaryData || null);
      setMessage(currentS.message || "");
      setCurrentProcessingRange(currentS.processingSubArrayRange || null);
    }
  }, [steps]);

  const handleExecuteOperation = useCallback((opToExecute?: SegmentTreeOperation) => {
    const operationToRun = opToExecute || selectedOperation;
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let newSteps: AlgorithmStep[] = [];
    const parsedInitialArray = parseInput(inputValue);

    if (operationToRun === 'build') {
        if (!parsedInitialArray) { 
            setSteps([]); setDisplayedData([]); setIsFinished(true); setMessage("Error: Invalid input array for build."); 
            return; 
        }
        if (parsedInitialArray.length === 0) {
            toast({title: "Input Empty", description: "Provide array for build.", variant: "default"});
            setSteps([]); setDisplayedData([]); segmentTreeArrayRef.current = []; originalArraySizeRef.current = 0; setIsFinished(true);
            setMessage("Input array is empty. Cannot build tree.");
            return;
        }
        originalArraySizeRef.current = parsedInitialArray.length;
        newSteps = generateSegmentTreeSteps('build', parsedInitialArray, [], originalArraySizeRef.current);
        if (newSteps.length > 0) segmentTreeArrayRef.current = [...newSteps[newSteps.length -1].array];
         toast({title: "Segment Tree Build", description: "Steps generated for building."});
    } else { 
        if (segmentTreeArrayRef.current.length === 0 || originalArraySizeRef.current === 0) {
            toast({title: "Build Tree First", description: "Please build the segment tree before querying or updating.", variant: "destructive"});
            setSteps([]); setDisplayedData([]); setIsFinished(true);
            setMessage("Tree not built. Please build first.");
            return;
        }
        if (operationToRun === 'query') {
            const qL = parseInt(queryLeft, 10);
            const qR = parseInt(queryRight, 10); // User inputs exclusive right, logic expects exclusive
            if (isNaN(qL) || isNaN(qR) || qL < 0 || qR <= qL || qR > originalArraySizeRef.current) {
                toast({title: "Invalid Query Range", description: `Range [${qL}, ${qR}) is invalid for original array size ${originalArraySizeRef.current}.`, variant: "destructive"});
                setSteps([]); setDisplayedData(segmentTreeArrayRef.current); setIsFinished(true);
                setMessage(`Error: Invalid query range [${qL}, ${qR}).`);
                return;
            }
            newSteps = generateSegmentTreeSteps('query', [], segmentTreeArrayRef.current, originalArraySizeRef.current, qL, qR);
            toast({title: "Query Operation", description: "Steps generated for query."});
        } else if (operationToRun === 'update') {
            const uIdx = parseInt(updateIndex, 10);
            const uVal = parseInt(updateValue, 10);
            if (isNaN(uIdx) || isNaN(uVal) || uIdx < 0 || uIdx >= originalArraySizeRef.current) {
                 toast({title: "Invalid Update Input", description: `Index ${uIdx} or value ${uVal} is invalid for original array size ${originalArraySizeRef.current}.`, variant: "destructive"});
                setSteps([]); setDisplayedData(segmentTreeArrayRef.current); setIsFinished(true);
                 setMessage(`Error: Invalid update input. Index: ${uIdx}, Value: ${uVal}.`);
                return;
            }
            newSteps = generateSegmentTreeSteps('update', [], segmentTreeArrayRef.current, originalArraySizeRef.current, undefined, undefined, uIdx, uVal);
             if (newSteps.length > 0) segmentTreeArrayRef.current = [...newSteps[newSteps.length-1].array]; 
            toast({title: "Update Operation", description: "Steps generated for update."});
        }
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) {
        updateStateFromStep(0);
    } else { 
        setDisplayedData(operationToRun === 'build' && parsedInitialArray ? []; : segmentTreeArrayRef.current); 
        setActiveIndices([]); 
        setCurrentLine(null); 
        setAuxiliaryDisplay(null); 
        setIsFinished(true); 
        setMessage(operationToRun === 'build' && !parsedInitialArray ? "Error: Could not build tree." : "No steps to visualize for this operation.");
    }

  }, [inputValue, selectedOperation, queryLeft, queryRight, updateIndex, updateValue, parseInput, toast, updateStateFromStep]);
  
  useEffect(() => { 
    if (selectedOperation === 'build') {
      handleExecuteOperation('build');
    }
  }, [selectedOperation, inputValue, handleExecuteOperation]); 

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
    const nextStepIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextStepIndex);
    updateStateFromStep(nextStepIndex);
    if (nextStepIndex === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(false);
    setInputValue(DEFAULT_INPUT_ARRAY);
    setSelectedOperation('build');
    setQueryLeft("1"); setQueryRight("4");
    setUpdateIndex("2"); setUpdateValue("10");
    segmentTreeArrayRef.current = []; originalArraySizeRef.current = 0;
    setSteps([]); setDisplayedData([]); setActiveIndices([]); setCurrentLine(null); setAuxiliaryDisplay(null); setIsFinished(true);
    setMessage(algorithmMetadata.description);
    // Trigger initial build by changing inputValue or selectedOperation if useEffect is set up for it
    // For now, a manual re-trigger might be needed or let the useEffect for inputValue handle it.
    handleExecuteOperation('build');
  };

  const localAlgoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow container p-4"><p>Loading...</p></main><Footer /></div>; }
  if (!localAlgoDetails) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow container p-4"><AlertTriangle /></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Sigma className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" /> 
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {message}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="lg:w-3/5 xl:w-2/3">
                <SegmentTreeVisualizationPanel
                    data={displayedData} 
                    activeIndices={activeIndices}
                    originalInputArray={originalInputForDisplay}
                    processingSubArrayRange={currentProcessingRange}
                    originalArraySize={originalArraySizeRef.current}
                />
                 {auxiliaryDisplay && (selectedOperation === 'query' || selectedOperation === 'update') && (
                    <Card className="mt-4">
                        <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm font-medium text-center">Operation Details</CardTitle></CardHeader>
                        <CardContent className="text-xs flex flex-wrap justify-around gap-2 p-3">
                            {selectedOperation === 'query' && auxiliaryDisplay.queryResult !== undefined && <p><strong>Query Result:</strong> {auxiliaryDisplay.queryResult}</p>}
                            {selectedOperation === 'update' && auxiliaryDisplay.updateIndex !== undefined && <p><strong>Updated Index:</strong> {auxiliaryDisplay.updateIndex}</p>}
                            {selectedOperation === 'update' && auxiliaryDisplay.updateValue !== undefined && <p><strong>New Value:</strong> {auxiliaryDisplay.updateValue}</p>}
                            {auxiliaryDisplay.currentL !== undefined && <p><strong>L Pointer (tree):</strong> {auxiliaryDisplay.currentL}</p>}
                            {auxiliaryDisplay.currentR !== undefined && <p><strong>R Pointer (tree):</strong> {auxiliaryDisplay.currentR}</p>}
                            {auxiliaryDisplay.currentQueryResult !== undefined && <p><strong>Current Query Sum:</strong> {auxiliaryDisplay.currentQueryResult}</p>}
                        </CardContent>
                    </Card>
                )}
            </div>
            <div className="lg:w-2/5 xl:w-1/3">
                <SegmentTreeCodePanel currentLine={currentLine} selectedOperation={selectedOperation} />
            </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="arrayInput">Initial Array (comma-sep, max {MAX_INPUT_SIZE})</Label>
                <Input id="arrayInput" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="e.g., 1,3,5,7" disabled={isPlaying && selectedOperation !== 'build'} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationSelect">Operation</Label>
                <Select value={selectedOperation} onValueChange={op => setSelectedOperation(op as SegmentTreeOperation)} disabled={isPlaying}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="build">Build Tree Array</SelectItem>
                        <SelectItem value="query">Query Range Sum</SelectItem>
                        <SelectItem value="update">Update Value</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>

            {selectedOperation === 'query' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"> <Label htmlFor="queryLeft">Query Left Index (0-indexed, inclusive)</Label> <Input id="queryLeft" type="number" value={queryLeft} onChange={e=>setQueryLeft(e.target.value)} disabled={isPlaying}/> </div>
                    <div className="space-y-2"> <Label htmlFor="queryRight">Query Right Index (0-indexed, exclusive)</Label> <Input id="queryRight" type="number" value={queryRight} onChange={e=>setQueryRight(e.target.value)} disabled={isPlaying}/> </div>
                </div>
            )}
            {selectedOperation === 'update' && (
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"> <Label htmlFor="updateIndex">Index to Update (0-indexed)</Label> <Input id="updateIndex" type="number" value={updateIndex} onChange={e=>setUpdateIndex(e.target.value)} disabled={isPlaying}/> </div>
                    <div className="space-y-2"> <Label htmlFor="updateValue">New Value</Label> <Input id="updateValue" type="number" value={updateValue} onChange={e=>setUpdateValue(e.target.value)} disabled={isPlaying}/> </div>
                </div>
            )}
             <Button onClick={() => handleExecuteOperation()} disabled={isPlaying || selectedOperation === 'build'} className="w-full md:w-auto mt-2">Execute {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}</Button>

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
        {localAlgoDetails && <AlgorithmDetailsCard {...localAlgoDetails} />}
      </main>
      <Footer />
    </div>
  );
}


    