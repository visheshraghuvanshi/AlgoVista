
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from './VisualizationPanel'; // Local import
import { JumpSearchCodePanel } from './JumpSearchCodePanel'; 
import { SearchingControlsPanel } from './SearchingControlsPanel'; // Local import
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, AlgorithmStep, AlgorithmDetailsProps } from './types'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { JUMP_SEARCH_LINE_MAP, generateJumpSearchSteps } from './jump-search-logic';
import { algorithmMetadata } from './metadata'; // Local import

const JUMP_SEARCH_CODE_SNIPPETS = {
  JavaScript: [
    "function jumpSearch(sortedArr, target) {",                 // 1
    "  const n = sortedArr.length; if (n === 0) return -1;",    // 2&3 (Combined for n=0)
    "  let blockSize = Math.floor(Math.sqrt(n));",              // 4
    "  let prev = 0;",                                          // 5
    "  let step = blockSize;",                                  // 6 (Conceptual for block end)
    "  // Finding the block where element is present (if it is)",
    "  while (sortedArr[Math.min(step, n) - 1] < target) {",    // 7 (Loop Condition)
    "    // Element at block end < target",                       // 8 (Block Check)
    "    prev = step;",                                         // 9
    "    step += blockSize;",                                   // 10
    "    if (prev >= n) return -1;",                             // 11
    "  }",
    "  // Doing a linear search for target in block beginning with prev.",
    "  while (sortedArr[prev] < target) {",                     // 12 (Linear Search Loop)
    "    // Element at prev < target",                            // 13 (Linear Element Check)
    "    prev++;",                                               // 14
    "    if (prev === Math.min(step, n)) return -1;",            // 15 (Linear Boundary Check)
    "  }",
    "  // If element is found",
    "  if (prev < n && sortedArr[prev] === target) return prev;",// 16 (Final Check) & 17 (Return Found)
    "  return -1;",                                             // 18 (Return Not Found)
    "}",                                                        // 19 (Function End)
  ],
  Python: [
    "import math",
    "def jump_search(sorted_arr, target):",
    "    n = len(sorted_arr)",
    "    if n == 0: return -1",
    "    block_size = math.floor(math.sqrt(n))",
    "    prev = 0",
    "    step = block_size",
    "    # Finding the block where element is present",
    "    while sorted_arr[min(step, n) - 1] < target:",
    "        prev = step",
    "        step += block_size",
    "        if prev >= n:",
    "            return -1",
    "    # Linear search in block starting from prev",
    "    while sorted_arr[prev] < target:",
    "        prev += 1",
    "        if prev == min(step, n):",
    "            return -1",
    "    if prev < n and sorted_arr[prev] == target:",
    "        return prev",
    "    return -1",
  ],
  Java: [
    "import java.lang.Math;",
    "public class JumpSearch {",
    "    public static int search(int[] sortedArr, int target) {",
    "        int n = sortedArr.length;",
    "        if (n == 0) return -1;",
    "        int blockSize = (int) Math.floor(Math.sqrt(n));",
    "        int prev = 0;",
    "        int step = blockSize;",
    "        while (step < n && sortedArr[step -1] < target) {", // Adjusted loop condition for safety
    "            prev = step;",
    "            step += blockSize;",
    "        }",
    "        // Ensure step doesn't go out of bounds for the first condition check",
    "        // This part is tricky: while (sortedArr[Math.min(step, n) - 1] < target)",
    "        // The original JS used Math.min in the loop condition directly, so this is simpler:",
    "        for (int i = prev; i < Math.min(step, n); i++) {", // Linear search from prev to min(step,n)
    "             if (sortedArr[i] == target) return i;",
    "             if (sortedArr[i] > target) break; // Optimization for sorted array",
    "        }",
    "        return -1;",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <cmath>   // For std::sqrt, std::floor",
    "#include <algorithm> // For std::min",
    "int jumpSearch(const std::vector<int>& sortedArr, int target) {",
    "    int n = sortedArr.size();",
    "    if (n == 0) return -1;",
    "    int blockSize = static_cast<int>(std::floor(std::sqrt(n)));",
    "    int prev = 0;",
    "    int step = blockSize;",
    "    while (step < n && sortedArr[step - 1] < target) {", // Safer loop to avoid step exceeding n prematurely inside condition
    "        prev = step;",
    "        step += blockSize;",
    "    }",
    "    // Linear search in block [prev, min(step, n))",
    "    for (int i = prev; i < std::min(step, n); ++i) {",
    "        if (sortedArr[i] == target) return i;",
    "        if (sortedArr[i] > target) break; // Optimization for sorted array",
    "    }",
    "    return -1;",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function JumpSearchVisualizerPage() {
  const { toast } = useToast();

  const [inputValue, setInputValue] = useState('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16'); 
  const [targetValue, setTargetValue] = useState('13');
  
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [displayedData, setDisplayedData] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]); 
  const [sortedIndices, setSortedIndices] = useState<number[]>([]); 
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [processingSubArrayRange, setProcessingSubArrayRange] = useState<[number, number] | null>(null);
  const [pivotActualIndex, setPivotActualIndex] = useState<number | null>(null); 
  const [auxiliaryData, setAuxiliaryData] = useState<AlgorithmStep['auxiliaryData']>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAlgoImplemented = true;
  const lastProcessedInputValueRef = useRef<string | null>(null);


  const parseInput = useCallback((value: string, notifySort: boolean = false): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',').map(s => s.trim()).filter(s => s !== '').map(s => parseInt(s, 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated numbers only for the array.", variant: "destructive" });
      return null;
    }
    if (parsed.some(n => n > 999 || n < -999)) {
      toast({ title: "Input out of range", description: "Array numbers must be between -999 and 999.", variant: "destructive" });
      return null;
    }
    const sortedParsed = [...parsed].sort((a, b) => a - b);
    if (notifySort && JSON.stringify(parsed) !== JSON.stringify(sortedParsed)) {
        toast({ title: "Input Array Sorted", description: "Jump Search requires a sorted array. Your input has been sorted.", variant: "default" });
    }
    return sortedParsed;
  }, [toast]);

  const parseTarget = useCallback((value: string): number | null => {
    if (value.trim() === '') {
      toast({ title: "Invalid Target", description: "Target value cannot be empty.", variant: "destructive" });
      return null;
    }
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      toast({ title: "Invalid Target", description: "Target value must be a number.", variant: "destructive" });
      return null;
    }
     if (num > 999 || num < -999) {
      toast({ title: "Target out of range", description: "Target number must be between -999 and 999.", variant: "destructive" });
      return null;
    }
    return num;
  }, [toast]);

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setDisplayedData(currentS.array);
      setActiveIndices(currentS.activeIndices);
      setSwappingIndices(currentS.swappingIndices);
      setSortedIndices(currentS.sortedIndices);
      setCurrentLine(currentS.currentLine);
      setProcessingSubArrayRange(currentS.processingSubArrayRange || null);
      setPivotActualIndex(currentS.pivotActualIndex || null);
      setAuxiliaryData(currentS.auxiliaryData || null);
    }
  }, [steps]);
  
  const generateSteps = useCallback((notifySort: boolean = false) => {
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }
    const parsedArray = parseInput(inputValue, notifySort); 
    const parsedTarget = parseTarget(targetValue);

    if (parsedArray !== null && parsedTarget !== null) {
      if (notifySort) { 
        setInputValue(parsedArray.join(',')); 
      }
      lastProcessedInputValueRef.current = parsedArray.join(',');

      const newSteps = generateJumpSearchSteps(parsedArray, parsedTarget);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsFinished(newSteps.length <=1);

      if (newSteps.length > 0) {
        const firstStep = newSteps[0];
        setDisplayedData(firstStep.array);
        setActiveIndices(firstStep.activeIndices);
        setSwappingIndices(firstStep.swappingIndices);
        setSortedIndices(firstStep.sortedIndices);
        setCurrentLine(firstStep.currentLine);
        setProcessingSubArrayRange(firstStep.processingSubArrayRange || null);
        setPivotActualIndex(firstStep.pivotActualIndex || null);
        setAuxiliaryData(firstStep.auxiliaryData || null);
      } else {
        setDisplayedData(parsedArray); 
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null); setAuxiliaryData(null);
      }
    } else {
      setSteps([]); setCurrentStepIndex(0);
      setDisplayedData(parsedArray || []);
      setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
      setProcessingSubArrayRange(null); setPivotActualIndex(null); setAuxiliaryData(null);
      setIsPlaying(false); setIsFinished(true);
    }
  }, [inputValue, targetValue, parseInput, parseTarget, toast, setInputValue, setDisplayedData, setActiveIndices, setSwappingIndices, setSortedIndices, setCurrentLine, setProcessingSubArrayRange, setPivotActualIndex, setAuxiliaryData]);


  useEffect(() => {
    generateSteps(false); 
  }, [targetValue, generateSteps]); 

  useEffect(() => { 
    if (inputValue !== lastProcessedInputValueRef.current) {
        const parsedArray = parseInput(inputValue, true); 
        if (parsedArray) {
            const newInputValueStr = parsedArray.join(',');
            if (inputValue !== newInputValueStr) {
                setInputValue(newInputValueStr); 
            } else {
                 generateSteps(true); 
            }
             lastProcessedInputValueRef.current = newInputValueStr;
        } else {
             generateSteps(true);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, parseInput]); 


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

  const handleInputChange = (value: string) => setInputValue(value);
  const handleTargetChange = (value: string) => setTargetValue(value);

  const handlePlay = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play." : "No steps. Check input.", variant: "default" });
      setIsPlaying(false); return;
    }
    setIsPlaying(true); setIsFinished(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
  };

  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished. Reset to step." : "No steps.", variant: "default" });
      return;
    }
    setIsPlaying(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStepIndex(nextStepIndex);
      updateStateFromStep(nextStepIndex);
      if (nextStepIndex === steps.length - 1) setIsFinished(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false); setIsFinished(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    generateSteps(true);
  };

  const handleSpeedChange = (speedValue: number) => setAnimationSpeed(speedValue);

  const localAlgoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? { 
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!algorithmMetadata || !localAlgoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
          <p className="text-muted-foreground text-lg">Could not load data for Jump Search.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{steps[currentStepIndex]?.message || algorithmMetadata.description}</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <VisualizationPanel
              data={displayedData}
              activeIndices={activeIndices}
              swappingIndices={swappingIndices}
              sortedIndices={sortedIndices}
              processingSubArrayRange={processingSubArrayRange}
              pivotActualIndex={pivotActualIndex}
            />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <JumpSearchCodePanel
              codeSnippets={JUMP_SEARCH_CODE_SNIPPETS}
              currentLine={currentLine}
            />
          </div>
        </div>
        <div className="w-full">
          <SearchingControlsPanel
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            onInputChange={handleInputChange}
            inputValue={inputValue}
            isPlaying={isPlaying}
            isFinished={isFinished}
            currentSpeed={animationSpeed}
            onSpeedChange={handleSpeedChange}
            isAlgoImplemented={isAlgoImplemented}
            minSpeed={MIN_SPEED}
            maxSpeed={MAX_SPEED}
            targetValue={targetValue}
            onTargetValueChange={handleTargetChange}
            targetInputLabel="Target Value to Find"
            targetInputPlaceholder="Enter number"
          />
        </div>
         <AlgorithmDetailsCard {...localAlgoDetails} />
      </main>
      <Footer />
    </div>
  );
}

