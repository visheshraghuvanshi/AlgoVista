
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CountingSortVisualizationPanel } from './CountingSortVisualizationPanel';
import { CountingSortCodePanel } from './CountingSortCodePanel'; 
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { CountingSortStep } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { COUNTING_SORT_LINE_MAP, generateCountingSortSteps } from './counting-sort-logic';
import { algorithmMetadata } from './metadata'; 

const COUNTING_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "function countingSort(arr) {",                       // 1
    "  if (arr.length === 0) return arr;",                // 2
    "  const maxVal = Math.max(...arr);",                 // 3
    "  const count = new Array(maxVal + 1).fill(0);",     // 4
    "  for (let i = 0; i < arr.length; i++) {",            // 5
    "    count[arr[i]]++;",                               // 6
    "  }",
    "  for (let i = 1; i <= maxVal; i++) {",               // 7
    "    count[i] += count[i - 1];",                      // 8
    "  }",
    "  const output = new Array(arr.length);",            // 9
    "  for (let i = arr.length - 1; i >= 0; i--) {",       // 10
    "    output[count[arr[i]] - 1] = arr[i];",            // 11
    "    count[arr[i]]--;",                               // 12
    "  }",
    "  for (let i = 0; i < arr.length; i++) {",            // 13
    "    arr[i] = output[i];",                            // 14
    "  }",
    "  return arr;",                                      // 15
    "}",                                                  // 16
  ],
   Python: [
    "def counting_sort(arr):",
    "    if not arr: return arr",
    "    max_val = max(arr)",
    "    count = [0] * (max_val + 1)",
    "    output = [0] * len(arr)",
    "    for num in arr:",
    "        count[num] += 1",
    "    for i in range(1, max_val + 1):",
    "        count[i] += count[i-1]",
    "    # Iterate from end for stability (though not strictly needed for numbers)",
    "    for i in range(len(arr) - 1, -1, -1):", 
    "        output[count[arr[i]] - 1] = arr[i]",
    "        count[arr[i]] -= 1",
    "    for i in range(len(arr)):",
    "        arr[i] = output[i]",
    "    return arr",
  ],
  Java: [
    "import java.util.Arrays;",
    "class CountingSort {",
    "    public static void sort(int[] arr) {",
    "        if (arr.length == 0) return;",
    "        int maxVal = 0;",
    "        for(int num : arr) if(num > maxVal) maxVal = num;",
    "        int[] count = new int[maxVal + 1];",
    "        // Initialize count array with all zeros - default for new int[]",
    "        int[] output = new int[arr.length];",
    "        for (int num : arr) { count[num]++; }",
    "        for (int i = 1; i <= maxVal; i++) { count[i] += count[i-1]; }",
    "        for (int i = arr.length - 1; i >= 0; i--) {",
    "            output[count[arr[i]] - 1] = arr[i];",
    "            count[arr[i]]--;",
    "        }",
    "        System.arraycopy(output, 0, arr, 0, arr.length);",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::max_element, std::fill",
    "void countingSort(std::vector<int>& arr) {",
    "    if (arr.empty()) return;",
    "    int maxVal = 0;",
    "    if (!arr.empty()) maxVal = *std::max_element(arr.begin(), arr.end());",
    "    std::vector<int> count(maxVal + 1, 0);",
    "    std::vector<int> output(arr.size());",
    "    for (int num : arr) { count[num]++; }",
    "    for (int i = 1; i <= maxVal; ++i) { count[i] += count[i-1]; }",
    "    for (int i = arr.size() - 1; i >= 0; --i) {",
    "        output[count[arr[i]] - 1] = arr[i];",
    "        count[arr[i]]--;",
    "    }",
    "    arr = output;",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 600; 
const MIN_SPEED = 100; 
const MAX_SPEED = 1500;

export default function CountingSortVisualizerPage() {
  const { toast } = useToast();
    
  const [inputValue, setInputValue] = useState('4,2,2,8,3,3,1');

  const [steps, setSteps] = useState<CountingSortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [currentStepData, setCurrentStepData] = useState<CountingSortStep | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAlgoImplemented = true; 

  const parseInput = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseInt(s, 10));

    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated non-negative integers.", variant: "destructive" });
      return null;
    }
    if (parsed.some(n => n < 0 || n > 99)) { // Counting sort typically for non-negative, and small range for viz
       toast({ title: "Input out of range", description: "Please enter numbers between 0 and 99 for visualization.", variant: "destructive" });
      return null;
    }
    return parsed;
  }, [toast]);
  
  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      setCurrentStepData(steps[stepIndex]);
    }
  }, [steps]);

  const generateSteps = useCallback(() => {
    const parsedData = parseInput(inputValue);
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
    }
    if (parsedData !== null) {
      let newSteps: CountingSortStep[] = generateCountingSortSteps(parsedData);
      
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsFinished(newSteps.length <=1);

      if (newSteps.length > 0) {
        setCurrentStepData(newSteps[0]);
      } else { 
        setCurrentStepData({array: parsedData, activeIndices:[], swappingIndices:[], sortedIndices:[], currentLine: null, message:"Input processed"});
      }
    } else {
        setSteps([]);
        setCurrentStepIndex(0);
        setCurrentStepData(null);
        setIsPlaying(false); setIsFinished(false);
    }
  }, [inputValue, parseInput]);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]); 


  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length -1 ) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        updateStateFromStep(nextStepIndex);
        if (nextStepIndex === steps.length - 1) {
          setIsPlaying(false);
          setIsFinished(true);
        }
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length -1) {
        setIsPlaying(false);
        setIsFinished(true);
    }
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep]);


  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handlePlay = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length -1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play again." : "No data or steps to visualize.", variant: "default" });
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setIsFinished(false); 
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  };

  const handleStep = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length -1) {
       toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished. Reset to step again." : "No data or steps to visualize.", variant: "default" });
      return;
    }
    setIsPlaying(false); 
     if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStepIndex(nextStepIndex);
      updateStateFromStep(nextStepIndex);
      if (nextStepIndex === steps.length - 1) {
        setIsFinished(true);
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
    }
    generateSteps();
  };
  
  const handleSpeedChange = (speedValue: number) => {
    setAnimationSpeed(speedValue);
  };

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!algorithmMetadata) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
            <p className="text-muted-foreground text-lg">
              Could not load data for Counting Sort.
            </p>
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
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {algorithmMetadata.description} (Note: Input numbers must be non-negative and relatively small for effective visualization of count array).
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <CountingSortVisualizationPanel step={currentStepData} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <CountingSortCodePanel 
              currentLine={currentStepData?.currentLine ?? null}
            />
          </div>
        </div>
        
        <div className="w-full">
          <SortingControlsPanel
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
          />
        </div>
        {algoDetails && <AlgorithmDetailsCard {...algoDetails} />}
      </main>
      <Footer />
    </div>
  );
}
