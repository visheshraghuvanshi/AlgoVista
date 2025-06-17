
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { JumpSearchCodePanel } from './JumpSearchCodePanel'; 
import { SearchingControlsPanel } from '@/components/algo-vista/searching-controls-panel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, AlgorithmStep } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { JUMP_SEARCH_LINE_MAP, generateJumpSearchSteps } from './jump-search-logic';

const JUMP_SEARCH_CODE_SNIPPETS = {
  JavaScript: [
    "function jumpSearch(sortedArr, target) {",                 // 1
    "  const n = sortedArr.length; if (n === 0) return -1;",    // 2
    "  let blockSize = Math.floor(Math.sqrt(n));",              // 3
    "  let prev = 0;",                                          // 4
    "  let step = blockSize;",                                  // 5
    "  // Finding the block where element is present (if it is)",
    "  while (sortedArr[Math.min(step, n) - 1] < target) {",    // 6 & 7
    "    prev = step;",                                         // 8
    "    step += blockSize;",                                   // 9
    "    if (prev >= n) return -1;",                             // 10
    "  }",
    "  // Doing a linear search for target in block beginning with prev.",
    "  while (sortedArr[prev] < target) {",                     // 11 & 12
    "    prev++;",                                               // 13
    "    if (prev === Math.min(step, n)) return -1;",            // 14
    "  }",
    "  // If element is found",
    "  if (sortedArr[prev] === target) return prev;",            // 15 & 16
    "  return -1;",                                             // 17
    "}",                                                        // 18
  ],
  Python: [
    "import math",
    "def jump_search(sorted_arr, target):",
    "    n = len(sorted_arr)",
    "    if n == 0: return -1",
    "    block_size = math.floor(math.sqrt(n))",
    "    prev = 0",
    "    step = block_size",
    "    while sorted_arr[min(step, n) - 1] < target:",
    "        prev = step",
    "        step += block_size",
    "        if prev >= n:",
    "            return -1",
    "    while sorted_arr[prev] < target:",
    "        prev += 1",
    "        if prev == min(step, n):",
    "            return -1",
    "    if prev < n and sorted_arr[prev] == target:",
    "        return prev",
    "    return -1",
  ],
};

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;
const ALGORITHM_SLUG = 'jump-search';

export default function JumpSearchVisualizerPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);

  const [inputValue, setInputValue] = useState('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16'); 
  const [targetValue, setTargetValue] = useState('13');
  
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [displayedData, setDisplayedData] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]); // Not used but part of AlgorithmStep
  const [sortedIndices, setSortedIndices] = useState<number[]>([]); // Used for found item
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [processingSubArrayRange, setProcessingSubArrayRange] = useState<[number, number] | null>(null);
  const [pivotActualIndex, setPivotActualIndex] = useState<number | null>(null); // Not used

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAlgoImplemented = true;
  const lastProcessedInputValueRef = useRef<string | null>(null);


  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) setAlgorithm(foundAlgorithm);
    else {
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    }
  }, [toast]);

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
        setInputValue(parsedArray.join(',')); // Update input field if sorted
      }
      lastProcessedInputValueRef.current = parsedArray.join(',');

      const newSteps = generateJumpSearchSteps(parsedArray, parsedTarget);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsFinished(false);

      if (newSteps.length > 0) {
        const firstStep = newSteps[0];
        updateStateFromStep(0); // Use helper to set all state vars from step
      } else {
        setDisplayedData(parsedArray); 
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null);
      }
    } else {
      setSteps([]); setCurrentStepIndex(0);
      setDisplayedData(parsedArray || []);
      setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
      setProcessingSubArrayRange(null); setPivotActualIndex(null);
      setIsPlaying(false); setIsFinished(false);
    }
  }, [inputValue, targetValue, parseInput, parseTarget, toast, updateStateFromStep]);


  useEffect(() => {
    generateSteps(false); // Initial generation without forcing sort notification for default value
  }, [targetValue, generateSteps]); 

  useEffect(() => {
    // This effect specifically handles changes to inputValue to re-sort and re-generate.
    if (inputValue !== lastProcessedInputValueRef.current) {
        const parsedArray = parseInput(inputValue, true); // Notify sort if input changes manually
        if (parsedArray) {
            const newInputValueStr = parsedArray.join(',');
            if (inputValue !== newInputValueStr) {
                // If sorting changed the input string, set it, which will trigger the other useEffect
                // via generateSteps dependency on inputValue.
                setInputValue(newInputValueStr); 
            } else {
                 // If string is same after sort (already sorted or empty), directly generate steps
                 generateSteps(true); 
            }
             lastProcessedInputValueRef.current = newInputValueStr;
        } else {
             // Handle case where parseInput returns null (invalid input)
             generateSteps(true); // Will likely show errors via toasts and reset visuals
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, parseInput]); // Note: generateSteps is not here to avoid loop with setInputValue

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        updateStateFromStep(nextStepIndex);
        if (nextStepIndex === steps.length - 1) {
          setIsPlaying(false);
          setIsFinished(true);
        }
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
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length - 1) {
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
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length - 1) {
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
    generateSteps(true); // True to ensure sorting notification if input was manually unsorted
  };

  const handleSpeedChange = (speedValue: number) => setAnimationSpeed(speedValue);

  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.description,
    timeComplexities: { best: "O(1)", average: "O(√n)", worst: "O(√n)" },
    spaceComplexity: "O(1)",
  } : null;

  if (!algorithm || !algoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
          <p className="text-muted-foreground text-lg">Could not load data for &quot;{ALGORITHM_SLUG}&quot;.</p>
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
            {algorithm.title}
          </h1>
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
         <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
