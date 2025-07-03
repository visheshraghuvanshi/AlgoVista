
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard';
import type { AlgorithmMetadata, AlgorithmStep, AlgorithmDetailsProps } from './types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, BoxSelect } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { VisualizationPanel } from './VisualizationPanel';
import { SlidingWindowCodePanel } from './SlidingWindowCodePanel';
import { generateMaxSumFixedKSteps, generateMinLengthSumTargetSteps, SUBARRAY_SUM_LINE_MAPS } from './sliding-window-logic';
import type { SlidingWindowProblemType } from './sliding-window-logic';

const SLIDING_WINDOW_CODE_SNIPPETS: Record<SlidingWindowProblemType, Record<string, string[]>> = {
  maxSumFixedK: {
    JavaScript: [
      "function maxSumSubarrayFixedK(arr, k) {",                   // 1
      "  if (k <= 0 || k > arr.length) return 0;",                // 2
      "  let maxSum = -Infinity;",                                 // 3
      "  let windowSum = 0;",                                      // 4
      "  for (let i = 0; i < k; i++) {",                           // 5
      "    windowSum += arr[i];",                                 // 6
      "  }",
      "  maxSum = windowSum;",                                     // 8
      "  for (let i = k; i < arr.length; i++) {",                  // 9
      "    windowSum += arr[i] - arr[i - k];",                      // 10
      "    maxSum = Math.max(maxSum, windowSum);",                  // 11
      "  }",
      "  return maxSum;",                                          // 13
      "}",                                                         // 14
    ],
    Python: [
      "def max_sum_subarray_fixed_k(arr, k):",
      "    if k <= 0 or k > len(arr): return 0",
      "    max_sum = float('-inf')",
      "    window_sum = 0",
      "    for i in range(k):",
      "        window_sum += arr[i]",
      "    max_sum = window_sum",
      "    for i in range(k, len(arr)):",
      "        window_sum += arr[i] - arr[i-k]",
      "        max_sum = max(max_sum, window_sum)",
      "    return max_sum if max_sum != float('-inf') else 0",
    ],
    Java: [
      "public class SlidingWindow {",
      "    public static int maxSumSubarrayFixedK(int[] arr, int k) {",
      "        if (k <= 0 || k > arr.length) return 0;",
      "        int maxSum = Integer.MIN_VALUE;",
      "        int windowSum = 0;",
      "        for (int i = 0; i < k; i++) {",
      "            windowSum += arr[i];",
      "        }",
      "        maxSum = windowSum;",
      "        for (int i = k; i < arr.length; i++) {",
      "            windowSum += arr[i] - arr[i - k];",
      "            maxSum = Math.max(maxSum, windowSum);",
      "        }",
      "        return maxSum == Integer.MIN_VALUE ? 0 : maxSum;",
      "    }",
      "}",
    ],
    "C++": [
      "#include <vector>",
      "#include <numeric>",
      "#include <algorithm>",
      "#include <limits>",
      "int maxSumSubarrayFixedK(const std::vector<int>& arr, int k) {",
      "    if (k <= 0 || k > arr.size()) return 0;",
      "    int maxSum = std::numeric_limits<int>::min();",
      "    int windowSum = 0;",
      "    for (int i = 0; i < k; ++i) {",
      "        windowSum += arr[i];",
      "    }",
      "    maxSum = windowSum;",
      "    for (int i = k; i < arr.size(); ++i) {",
      "        windowSum += arr[i] - arr[i - k];",
      "        maxSum = std::max(maxSum, windowSum);",
      "    }",
      "    return maxSum == std::numeric_limits<int>::min() ? 0 : maxSum;",
      "}",
    ],
  },
  minLengthSumTarget: {
    JavaScript: [
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
      "  return minLength === Infinity ? 0 : minLength;", // 13
      "}",                                                // 14
    ],
    Python: [
      "def min_length_subarray_sum_target(arr, target):",
      "    min_length = float('inf')",
      "    window_sum = 0",
      "    window_start = 0",
      "    for window_end in range(len(arr)):",
      "        window_sum += arr[window_end]",
      "        while window_sum >= target:",
      "            min_length = min(min_length, window_end - window_start + 1)",
      "            window_sum -= arr[window_start]",
      "            window_start += 1",
      "    return min_length if min_length != float('inf') else 0",
    ],
    Java: [
      "public class SlidingWindow {",
      "    public static int minLengthSubarraySumTarget(int[] arr, int target) {",
      "        int minLength = Integer.MAX_VALUE;",
      "        int windowSum = 0;",
      "        int windowStart = 0;",
      "        for (int windowEnd = 0; windowEnd < arr.length; windowEnd++) {",
      "            windowSum += arr[windowEnd];",
      "            while (windowSum >= target) {",
      "                minLength = Math.min(minLength, windowEnd - windowStart + 1);",
      "                windowSum -= arr[windowStart];",
      "                windowStart++;",
      "            }",
      "        }",
      "        return minLength == Integer.MAX_VALUE ? 0 : minLength;",
      "    }",
      "}",
    ],
    "C++": [
      "#include <vector>",
      "#include <algorithm>",
      "#include <limits>",
      "int minLengthSubarraySumTarget(const std::vector<int>& arr, int target) {",
      "    int minLength = std::numeric_limits<int>::max();",
      "    int windowSum = 0;",
      "    int windowStart = 0;",
      "    for (int windowEnd = 0; windowEnd < arr.size(); ++windowEnd) {",
      "        windowSum += arr[windowEnd];",
      "        while (windowSum >= target) {",
      "            minLength = std::min(minLength, windowEnd - windowStart + 1);",
      "            windowSum -= arr[windowStart];",
      "            windowStart++;",
      "        }",
      "    }",
      "    return minLength == std::numeric_limits<int>::max() ? 0 : minLength;",
      "}",
    ],
  },
};

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function SlidingWindowVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [inputValue, setInputValue] = useState('2,1,5,2,3,2');
  const [problemType, setProblemType] = useState<SlidingWindowProblemType>('maxSumFixedK');
  const [kValue, setKValue] = useState('3');
  const [targetSumValue, setTargetSumValue] = useState('7');

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
    if (problemType === 'minLengthSumTarget' && parsed.some(n => n < 0)) {
        toast({ title: "Invalid Input", description: "The 'Min Length Subarray' variant currently requires non-negative numbers for simpler logic.", variant: "default" });
        return null;
    }
    return parsed;
  }, [toast, problemType]);
  
  const parseTargetValue = useCallback((value: string): number | null => {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      toast({ title: "Invalid Target/K Value", description: "Target/K must be a number.", variant: "destructive" });
      return null;
    }
    return num;
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
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }
    
    const arr = parseInputArray(inputValue);
    if (!arr) {
      setSteps([]); setDisplayedData([]); setIsFinished(true); return;
    }

    let newSteps: AlgorithmStep[] = [];
    if (problemType === 'maxSumFixedK') {
      const k = parseTargetValue(kValue);
      if (k === null || k <= 0) {
        toast({ title: "Invalid K Value", description: "K must be a positive integer.", variant: "destructive" });
        setSteps([]); setDisplayedData(arr); setIsFinished(true); return;
      }
      newSteps = generateMaxSumFixedKSteps(arr, k);
    } else if (problemType === 'minLengthSumTarget') {
      const target = parseTargetValue(targetSumValue);
      if (target === null) {
        toast({ title: "Invalid Target Sum", description: "Target sum must be a valid number.", variant: "destructive" });
        setSteps([]); setDisplayedData(arr); setIsFinished(true); return;
      }
      newSteps = generateMinLengthSumTargetSteps(arr, target);
    }
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) {
        updateStateFromStep(0);
    } else { 
        setDisplayedData(arr); setActiveIndices([]); setCurrentLine(null); setAuxiliaryData(null); 
    }

  }, [inputValue, problemType, kValue, targetSumValue, parseInputArray, parseTargetValue, toast, updateStateFromStep]);
  
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
                    <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm font-medium text-center">Window State</CardTitle></CardHeader>
                    <CardContent className="text-sm flex flex-wrap justify-around gap-2 p-3">
                        {Object.entries(auxiliaryData).filter(([key]) => !['inputArray', 'foundSubarrayIndices'].includes(key)).map(([key, value]) => {
                             const readableKey = key.replace(/([A-Z])/g, ' $1').trim().replace(/\b\w/g, l => l.toUpperCase());
                            return (
                                <p key={key}><strong>{readableKey}:</strong> {value?.toString()}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="problemTypeSelect">Problem Variant</Label>
                <Select value={problemType} onValueChange={v => setProblemType(v as SlidingWindowProblemType)} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maxSumFixedK">Max Sum of Subarray (Fixed Size K)</SelectItem>
                    <SelectItem value="minLengthSumTarget">Min Length Subarray (Sum &gt;= Target)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="arrayInput">Input Array</Label>
                <Input id="arrayInput" value={inputValue} onChange={e => setInputValue(e.target.value)} disabled={isPlaying} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              {problemType === 'maxSumFixedK' && (
                <div className="space-y-2">
                  <Label htmlFor="kValueInput">Window Size (K)</Label>
                  <Input id="kValueInput" type="number" value={kValue} onChange={e => setKValue(e.target.value)} disabled={isPlaying} />
                </div>
              )}
              {problemType === 'minLengthSumTarget' && (
                <div className="space-y-2">
                  <Label htmlFor="targetSumInputSW">Target Sum</Label>
                  <Input id="targetSumInputSW" type="number" value={targetSumValue} onChange={e => setTargetSumValue(e.target.value)} disabled={isPlaying}/>
                </div>
              )}
               <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto self-end">Run Algorithm</Button>
            </div>
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
