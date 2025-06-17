"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, AlgorithmStep } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2, Sigma } from 'lucide-react'; // Using Sigma for Sum
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { SegmentTreeCodePanel, SEGMENT_TREE_CODE_SNIPPETS_ALL_LANG } from './SegmentTreeCodePanel';
import { generateSegmentTreeSteps, SEGMENT_TREE_LINE_MAP, type SegmentTreeOperation } from './segment-tree-logic';
import { algorithmMetadata } from './metadata'; 
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from "lucide-react";
import { Slider } from "@/components/ui/slider";


const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;


export default function SegmentTreeVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [inputValue, setInputValue] = useState("1,3,5,7,9,11"); 
  const [selectedOperation, setSelectedOperation] = useState<SegmentTreeOperation>('build');
  
  const [queryLeft, setQueryLeft] = useState("1");
  const [queryRight, setQueryRight] = useState("4"); 

  const [updateIndex, setUpdateIndex] = useState("2");
  const [updateValue, setUpdateValue] = useState("10");
  
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedData, setDisplayedData] = useState<number[]>([]); 
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [auxiliaryDisplay, setAuxiliaryDisplay] = useState<Record<string, string|number> | null>(null);


  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(isFinished);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const segmentTreeArrayRef = useRef<number[]>([]); 
  const originalArraySizeRef = useRef<number>(0); 

  useEffect(() => {
    setIsClient(true);
  }, []);

  const parseInput = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',').map(s => s.trim()).filter(s => s !== '').map(s => parseInt(s, 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated numbers.", variant: "destructive" });
      return null;
    }
    if (parsed.length > 12) { // Limit size for better visualization
        toast({ title: "Input Too Long", description: "Max 12 numbers for optimal visualization.", variant: "default"});
    }
    if (parsed.some(n => n > 999 || n < -999)) {
      toast({ title: "Input out of range", description: "Numbers must be between -999 and 999.", variant: "destructive" });
      return null;
    }
    return parsed;
  }, [toast]);

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setDisplayedData(currentS.array); // This is the segment tree array
      setActiveIndices(currentS.activeIndices);
      setCurrentLine(currentS.currentLine);
      setAuxiliaryDisplay(currentS.auxiliaryData || null);
    }
  }, [steps]);

  const handleExecuteOperation = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let newSteps: AlgorithmStep[] = [];
    const parsedInitialArray = parseInput(inputValue);

    if (selectedOperation === 'build') {
        if (!parsedInitialArray) { setSteps([]); setDisplayedData([]); return; }
        if (parsedInitialArray.length === 0) {
            toast({title: "Input Empty", description: "Provide array for build.", variant: "default"});
            setSteps([]); setDisplayedData([]); segmentTreeArrayRef.current = []; originalArraySizeRef.current = 0;
            return;
        }
        originalArraySizeRef.current = parsedInitialArray.length;
        newSteps = generateSegmentTreeSteps('build', parsedInitialArray, [], originalArraySizeRef.current);
        if (newSteps.length > 0) segmentTreeArrayRef.current = [...newSteps[newSteps.length -1].array];
         toast({title: "Segment Tree Build", description: "Steps generated for building."});
    } else { 
        if (segmentTreeArrayRef.current.length === 0 || originalArraySizeRef.current === 0) {
            toast({title: "Build Tree First", description: "Please build the segment tree before querying or updating.", variant: "destructive"});
            return;
        }
        if (selectedOperation === 'query') {
            const qL = parseInt(queryLeft, 10);
            const qR = parseInt(queryRight, 10);
            if (isNaN(qL) || isNaN(qR) || qL < 0 || qR <= qL || qR > originalArraySizeRef.current) {
                toast({title: "Invalid Query Range", description: `Range [${qL}, ${qR}) is invalid for original array size ${originalArraySizeRef.current}.`, variant: "destructive"});
                return;
            }
            newSteps = generateSegmentTreeSteps('query', [], segmentTreeArrayRef.current, originalArraySizeRef.current, qL, qR);
            toast({title: "Query Operation", description: "Steps generated for query."});
        } else if (selectedOperation === 'update') {
            const uIdx = parseInt(updateIndex, 10);
            const uVal = parseInt(updateValue, 10);
            if (isNaN(uIdx) || isNaN(uVal) || uIdx < 0 || uIdx >= originalArraySizeRef.current) {
                 toast({title: "Invalid Update Input", description: `Index ${uIdx} or value ${uVal} is invalid for original array size ${originalArraySizeRef.current}.`, variant: "destructive"});
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
    if (newSteps.length > 0) updateStateFromStep(0);
    else { setDisplayedData(selectedOperation === 'build' ? [] : segmentTreeArrayRef.current); setActiveIndices([]); setCurrentLine(null); setAuxiliaryDisplay(null); }

  }, [inputValue, selectedOperation, queryLeft, queryRight, updateIndex, updateValue, parseInput, toast, updateStateFromStep]);

  useEffect(() => { 
    if (selectedOperation === 'build') handleExecuteOperation();
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
    setInputValue("1,3,5,7,9,11");
    setSelectedOperation('build');
    setQueryLeft("1"); setQueryRight("4");
    setUpdateIndex("2"); setUpdateValue("10");
    segmentTreeArrayRef.current = []; originalArraySizeRef.current = 0;
  };

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow container p-4"><p>Loading...</p></main><Footer /></div>; }
  if (!algoDetails) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow container p-4"><AlertTriangle /></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Sigma className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" /> {/* Sigma for Sum */}
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualizing array representation: Build, Query (Sum), Update. Tree is 1-indexed conceptually, array is 0-indexed with leaves at N to 2N-1.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="lg:w-3/5 xl:w-2/3">
                <VisualizationPanel
                    data={displayedData} // This will show the segment tree array
                    activeIndices={activeIndices}
                    swappingIndices={[]} sortedIndices={[]}
                />
                 {auxiliaryDisplay && (
                    <Card className="mt-4">
                        <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm font-medium text-center">Operation Details</CardTitle></CardHeader>
                        <CardContent className="text-sm flex flex-wrap justify-around gap-2 p-3">
                            {Object.entries(auxiliaryDisplay).map(([key, value]) => {
                                if (key === 'pArray' || key === 'nMatrices') return null; // Don't re-display input array
                                return (
                                <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {value.toString()}</p>
                            );})}
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
                <Label htmlFor="arrayInput">Initial Array (comma-sep, max 12)</Label>
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
                    <div className="space-y-2"> <Label htmlFor="queryLeft">Query Left Index (incl.)</Label> <Input id="queryLeft" type="number" value={queryLeft} onChange={e=>setQueryLeft(e.target.value)} disabled={isPlaying}/> </div>
                    <div className="space-y-2"> <Label htmlFor="queryRight">Query Right Index (excl.)</Label> <Input id="queryRight" type="number" value={queryRight} onChange={e=>setQueryRight(e.target.value)} disabled={isPlaying}/> </div>
                </div>
            )}
            {selectedOperation === 'update' && (
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"> <Label htmlFor="updateIndex">Index to Update (original array)</Label> <Input id="updateIndex" type="number" value={updateIndex} onChange={e=>setUpdateIndex(e.target.value)} disabled={isPlaying}/> </div>
                    <div className="space-y-2"> <Label htmlFor="updateValue">New Value</Label> <Input id="updateValue" type="number" value={updateValue} onChange={e=>setUpdateValue(e.target.value)} disabled={isPlaying}/> </div>
                </div>
            )}
             <Button onClick={handleExecuteOperation} disabled={isPlaying} className="w-full md:w-auto mt-2">Execute {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}</Button>

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
        {algoDetails && <AlgorithmDetailsCard {...algoDetails} />}
      </main>
      <Footer />
    </div>
  );
}

