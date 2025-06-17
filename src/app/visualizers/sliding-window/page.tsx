
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, AlgorithmStep } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, BoxSelect } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { SlidingWindowCodePanel } from './SlidingWindowCodePanel';
import { generateMaxSumFixedKSteps, generateMinLengthSumTargetSteps, SLIDING_WINDOW_LINE_MAPS } from './sliding-window-logic';
import type { SlidingWindowProblemType } from './sliding-window-logic';

const SLIDING_WINDOW_CODE_SNIPPETS: Record<SlidingWindowProblemType, string[]> = {
  maxSumFixedK: [
    "function maxSumSubarrayFixedK(arr, k) {",        // 1
    "  if (k <= 0 || k > arr.length) return 0;",      // 2
    "  let maxSum = -Infinity;",                       // 3
    "  let windowSum = 0;",                            // 4
    "  for (let i = 0; i < k; i++) {",                 // 5
    "    windowSum += arr[i];",                         // 6
    "  }",
    "  maxSum = windowSum;",                           // 7
    "  for (let i = k; i < arr.length; i++) {",        // 8
    "    windowSum += arr[i] - arr[i - k];",          // 9
    "    maxSum = Math.max(maxSum, windowSum);",       // 10
    "  }",
    "  return maxSum;",                                 // 11
    "}",                                               // 12
  ],
  minLengthSumTarget: [
    "function minLengthSubarraySumTarget(arr, target) {", // 1
    "  let minLength = Infinity;",                      // 2
    "  let windowSum = 0;",                             // 3
    "  let windowStart = 0;",                           // 4
    "  for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {", // 5
    "    windowSum += arr[windowEnd];",                  // 6
    "    while (windowSum >= target) {",                // 7
    "      minLength = Math.min(minLength, windowEnd - windowStart + 1);", // 8
    "      windowSum -= arr[windowStart];",              // 9
    "      windowStart++;",                              // 10
    "    }",
    "  }",
    "  return minLength === Infinity ? 0 : minLength;", // 11
    "}",                                                // 12
  ],
};


const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function SlidingWindowVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [inputValue, setInputValue] = useState('2,1,5,2,3,2');
  const [problemType, setProblemType] = useState<SlidingWindowProblemType>('maxSumFixedK');
  const [kValue, setKValue] = useState('3'); // For maxSumFixedK
  const [targetSumValue, setTargetSumValue] = useState('7'); // For minLengthSumTarget

  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [displayedData, setDisplayedData] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [processingSubArrayRange, setProcessingSubArrayRange] = useState<[number, number] | null>(null);
  const [auxiliaryData, setAuxiliaryData] = useState<AlgorithmStep['auxiliaryData']>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const parseInputArray = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',').map(s => parseInt(s.trim(), 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Array Input", description: "Please enter comma-separated numbers.", variant: "destructive" });
      return null;
    }
    return parsed;
  }, [toast]);

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setDisplayedData(currentS.array);
      setActiveIndices(currentS.activeIndices);
      setSortedIndices(currentS.sortedIndices);
      setCurrentLine(currentS.currentLine);
      setProcessingSubArrayRange(currentS.processingSubArrayRange || null);
      setAuxiliaryData(currentS.auxiliaryData || null);
    }
  }, [steps]);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const arr = parseInputArray(inputValue);
    if (!arr) {
      setSteps([]); setDisplayedData([]); setIsFinished(true); return;
    }

    let newSteps: AlgorithmStep[] = [];
    if (problemType === 'maxSumFixedK') {
      const k = parseInt(kValue, 10);
      if (isNaN(k) || k <= 0) {
        toast({ title: "Invalid K Value", description: "K must be a positive integer.", variant: "destructive" });
        setSteps([]); setDisplayedData(arr); setIsFinished(true); return;
      }
      newSteps = generateMaxSumFixedKSteps(arr, k);
    } else if (problemType === 'minLengthSumTarget') {
      const target = parseInt(targetSumValue, 10);
      if (isNaN(target)) {
        toast({ title: "Invalid Target Sum", description: "Target sum must be a number.", variant: "destructive" });
        setSteps([]); setDisplayedData(arr); setIsFinished(true); return;
      }
      newSteps = generateMinLengthSumTargetSteps(arr, target);
    }
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) updateStateFromStep(0);
    else { setDisplayedData(arr); setActiveIndices([]); setCurrentLine(null); setAuxiliaryData(null); }

  }, [inputValue, problemType, kValue, targetSumValue, parseInputArray, toast, updateStateFromStep]);
  
  useEffect(() => { handleGenerateSteps(); }, [handleGenerateSteps]);

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
  const handleReset = () => { setIsPlaying(false); setIsFinished(false); handleGenerateSteps(); };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <BoxSelect className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{steps[currentStepIndex]?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <VisualizationPanel data={displayedData} activeIndices={activeIndices} sortedIndices={sortedIndices} processingSubArrayRange={processingSubArrayRange} />
            {auxiliaryData && (
                <Card className="mt-4">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-center">Current State</CardTitle></CardHeader>
                    <CardContent className="text-sm flex flex-wrap justify-around gap-2">
                        {Object.entries(auxiliaryData).map(([key, value]) => {
                            if(key === 'foundSubarrayIndices') return null; // Don't display this in text
                            return (
                                <p key={key}><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value?.toString()}</p>
                            )
                        })}
                    </CardContent>
                </Card>
            )}
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <SlidingWindowCodePanel codeSnippets={SLIDING_WINDOW_CODE_SNIPPETS} currentLine={currentLine} selectedProblem={problemType} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Problem Setup</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="arrayInput">Input Array</Label>
                <Input id="arrayInput" value={inputValue} onChange={e => setInputValue(e.target.value)} disabled={isPlaying} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="problemTypeSelect">Problem Type</Label>
                <Select value={problemType} onValueChange={v => setProblemType(v as SlidingWindowProblemType)} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maxSumFixedK">Max Sum Subarray (Fixed Size K)</SelectItem>
                    <SelectItem value="minLengthSumTarget">Min Length Subarray (Sum >= Target)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {problemType === 'maxSumFixedK' && (
                <div className="space-y-2">
                  <Label htmlFor="kValueInput">Window Size (K)</Label>
                  <Input id="kValueInput" type="number" value={kValue} onChange={e => setKValue(e.target.value)} disabled={isPlaying} />
                </div>
              )}
              {problemType === 'minLengthSumTarget' && (
                <div className="space-y-2">
                  <Label htmlFor="targetSumInput">Target Sum</Label>
                  <Input id="targetSumInput" type="number" value={targetSumValue} onChange={e => setTargetSumValue(e.target.value)} disabled={isPlaying} />
                </div>
              )}
            </div>
            <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto">Run Algorithm</Button>
             <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Problem</Button>
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
    