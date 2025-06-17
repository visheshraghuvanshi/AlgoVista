
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, AlgorithmStep } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { TwoPointersCodePanel } from './TwoPointersCodePanel';
import { generateTwoPointersPairSumSteps, TWO_POINTERS_LINE_MAP } from './two-pointers-logic';
import { SearchingControlsPanel } from '@/components/algo-vista/searching-controls-panel';


const TWO_POINTERS_CODE_SNIPPETS = {
  JavaScript: [
    "function findPairWithSum(sortedArr, targetSum) {",     // 1
    "  let left = 0, right = sortedArr.length - 1;",      // 2
    "  while (left < right) {",                           // 3
    "    const currentSum = sortedArr[left] + sortedArr[right];", // 4
    "    if (currentSum === targetSum) {",                // 5
    "      return [sortedArr[left], sortedArr[right]];",   // 6
    "    } else if (currentSum < targetSum) {",           // 7
    "      left++;",                                       // 8
    "    } else {",                                         // 9
    "      right--;",                                      // 10
    "    }",
    "  }",                                                  // 11
    "  return null; // No such pair found",                 // 12
    "}",                                                    // 13
  ],
  Python: [
    "def find_pair_with_sum(sorted_arr, target_sum):",
    "    left, right = 0, len(sorted_arr) - 1",
    "    while left < right:",
    "        current_sum = sorted_arr[left] + sorted_arr[right]",
    "        if current_sum == target_sum:",
    "            return [sorted_arr[left], sorted_arr[right]]",
    "        elif current_sum < target_sum:",
    "            left += 1",
    "        else:",
    "            right -= 1",
    "    return None",
  ],
};

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function TwoPointersVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [inputValue, setInputValue] = useState('1,2,3,4,6,8,9,10'); // Sorted array example
  const [targetSumValue, setTargetSumValue] = useState('10');

  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [displayedData, setDisplayedData] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]); // Used to highlight found pair
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [processingSubArrayRange, setProcessingSubArrayRange] = useState<[number, number] | null>(null);
  const [auxiliaryData, setAuxiliaryData] = useState<AlgorithmStep['auxiliaryData']>(null);


  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedInputValueRef = useRef<string | null>(null);


  useEffect(() => { setIsClient(true); }, []);

  const parseInputArray = useCallback((value: string, notifySort: boolean = true): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',').map(s => parseInt(s.trim(), 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Array Input", description: "Please enter comma-separated numbers.", variant: "destructive" });
      return null;
    }
    const sortedParsed = [...parsed].sort((a,b) => a - b);
    if (notifySort && JSON.stringify(parsed) !== JSON.stringify(sortedParsed)) {
        toast({ title: "Input Array Sorted", description: "Two Pointers (for pair sum) technique requires a sorted array. Your input has been sorted.", variant: "default" });
    }
    return sortedParsed;
  }, [toast]);
  
  const parseTargetSum = useCallback((value: string): number | null => {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      toast({ title: "Invalid Target Sum", description: "Target sum must be a number.", variant: "destructive" });
      return null;
    }
    return num;
  }, [toast]);


  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setDisplayedData(currentS.array);
      setActiveIndices(currentS.activeIndices);
      setSortedIndices(currentS.sortedIndices); // Will highlight the found pair
      setCurrentLine(currentS.currentLine);
      setProcessingSubArrayRange(currentS.processingSubArrayRange || null);
      setAuxiliaryData(currentS.auxiliaryData || null);
    }
  }, [steps]);
  
  const handleGenerateSteps = useCallback((notifySort: boolean = true) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const arr = parseInputArray(inputValue, notifySort);
    const target = parseTargetSum(targetSumValue);

    if (arr && target !== null) {
      if (notifySort) {
        // Update inputValue state only if sorting changed the string representation
        const sortedArrString = arr.join(',');
        if(inputValue !== sortedArrString) {
            setInputValue(sortedArrString); // This might trigger another re-render if inputValue is a dep of this useEffect
        }
      }
      lastProcessedInputValueRef.current = arr.join(',');

      const newSteps = generateTwoPointersPairSumSteps(arr, target);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsFinished(newSteps.length <= 1);
      if (newSteps.length > 0) updateStateFromStep(0);
      else { setDisplayedData(arr); setActiveIndices([]); setCurrentLine(null); setAuxiliaryData(null); }
    } else {
      setSteps([]); setDisplayedData(arr || []); setIsFinished(true);
    }
  }, [inputValue, targetSumValue, parseInputArray, parseTargetSum, updateStateFromStep, toast]);
  
  useEffect(() => { // Handles target sum changes
    handleGenerateSteps(false); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetSumValue]);

  useEffect(() => { // Handles initial load and input array changes
    if (inputValue !== lastProcessedInputValueRef.current) {
      handleGenerateSteps(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);


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
    setIsPlaying(false); 
    setIsFinished(false); 
    // setInputValue('1,2,3,4,6,8,9,10'); // Optional: reset input value too
    // setTargetSumValue('10');
    handleGenerateSteps(true); 
  };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Users2 className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{steps[currentStepIndex]?.message || "Example: Find pair with target sum in a sorted array."}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <VisualizationPanel data={displayedData} activeIndices={activeIndices} sortedIndices={sortedIndices} processingSubArrayRange={processingSubArrayRange} />
            {auxiliaryData && (
                <Card className="mt-4">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-center">Current State</CardTitle></CardHeader>
                    <CardContent className="text-sm flex flex-wrap justify-around gap-2">
                        {Object.entries(auxiliaryData).map(([key, value]) => (
                            <p key={key}><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value?.toString()}</p>
                        ))}
                    </CardContent>
                </Card>
            )}
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <TwoPointersCodePanel codeSnippets={TWO_POINTERS_CODE_SNIPPETS} currentLine={currentLine} />
          </div>
        </div>
        
        <SearchingControlsPanel
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            onInputChange={setInputValue}
            inputValue={inputValue}
            onTargetValueChange={setTargetSumValue}
            targetValue={targetSumValue}
            isPlaying={isPlaying}
            isFinished={isFinished}
            currentSpeed={animationSpeed}
            onSpeedChange={setAnimationSpeed}
            isAlgoImplemented={true}
            minSpeed={MIN_SPEED}
            maxSpeed={MAX_SPEED}
            targetInputLabel="Target Sum"
          />
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
