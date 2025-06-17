
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { CodePanel } from '@/components/algo-vista/code-panel';
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel';
import type { AlgorithmMetadata } from '@/types';
import type { AlgorithmStep } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { INSERTION_SORT_LINE_MAP, generateInsertionSortSteps } from './insertion-sort-logic';

const INSERTION_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "function insertionSort(arr) {",           // 1
    "  let n = arr.length;",                   // 2
    "  for (let i = 1; i < n; i++) {",         // 3
    "    let key = arr[i];",                  // 4
    "    let j = i - 1;",                      // 5
    "    // Move elements of arr[0..i-1] that are", // 6
    "    // greater than key, to one position ahead", // 7
    "    while (j >= 0 && arr[j] > key) {",    // 8
    "      arr[j + 1] = arr[j];",             // 9
    "      j = j - 1;",                        // 10
    "    }",                                   // 11
    "    arr[j + 1] = key;",                   // 12
    "  }",                                     // 13
    "  return arr;",                          // 14
    "}",                                       // 15
  ],
  Python: [
    "def insertion_sort(arr):",
    "    n = len(arr)",
    "    for i in range(1, n):",
    "        key = arr[i]",
    "        j = i - 1",
    "        # Move elements of arr[0..i-1] that are",
    "        # greater than key, to one position ahead",
    "        while j >= 0 and arr[j] > key:",
    "            arr[j + 1] = arr[j]",
    "            j -= 1",
    "        arr[j + 1] = key",
    "    return arr",
  ],
  Java: [
    "public class InsertionSort {",
    "    public static void sort(int[] arr) {",
    "        int n = arr.length;",
    "        for (int i = 1; i < n; ++i) {",
    "            int key = arr[i];",
    "            int j = i - 1;",
    "            // Move elements of arr[0..i-1], that are",
    "            // greater than key, to one position ahead",
    "            while (j >= 0 && arr[j] > key) {",
    "                arr[j + 1] = arr[j];",
    "                j = j - 1;",
    "            }",
    "            arr[j + 1] = key;",
    "        }",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "void insertionSort(std::vector<int>& arr) {",
    "    int n = arr.size();",
    "    for (int i = 1; i < n; i++) {",
    "        int key = arr[i];",
    "        int j = i - 1;",
    "        // Move elements of arr[0..i-1], that are",
    "        // greater than key, to one position ahead",
    "        while (j >= 0 && arr[j] > key) {",
    "            arr[j + 1] = arr[j];",
    "            j = j - 1;",
    "        }",
    "        arr[j + 1] = key;",
    "    }",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 700; 
const MIN_SPEED = 100; 
const MAX_SPEED = 2000;
const ALGORITHM_SLUG = 'insertion-sort';

export default function InsertionSortVisualizerPage() {
  const { toast } = useToast();
  
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  
  const [inputValue, setInputValue] = useState('5,1,9,3,7,4,6,2,8');
  const [initialData, setInitialData] = useState<number[]>([]);

  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [displayedData, setDisplayedData] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [processingSubArrayRange, setProcessingSubArrayRange] = useState<[number, number] | null>(null);
  const [pivotActualIndex, setPivotActualIndex] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAlgoImplemented = true;

  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
    } else {
      console.error("Algorithm not found:", ALGORITHM_SLUG);
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    }
  }, [toast]);

  const parseInput = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseInt(s, 10));

    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated numbers only.", variant: "destructive" });
      return null;
    }
     if (parsed.some(n => n > 999 || n < -999)) {
       toast({ title: "Input out of range", description: "Please enter numbers between -999 and 999.", variant: "destructive" });
      return null;
    }
    return parsed;
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

  const generateSteps = useCallback(() => {
    const parsedData = parseInput(inputValue);
    if (parsedData !== null) {
      setInitialData(parsedData);
      let newSteps: AlgorithmStep[] = generateInsertionSortSteps(parsedData);
      
      if (newSteps.length > 0) {
        setSteps(newSteps);
        setCurrentStepIndex(0);
        updateStateFromStep(0);
      } else { 
        setSteps([]);
        setDisplayedData(parsedData);
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null);
      }
      setIsPlaying(false);
      setIsFinished(false);
    }
     if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }
  }, [inputValue, parseInput, updateStateFromStep]);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]); 


  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length -1) {
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
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length -1) {
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
      animationTimeoutRef.current = null;
    }
  };

  const handleStep = () => {
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length -1) {
       toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished. Reset to step again." : "No data or steps to visualize.", variant: "default" });
      return;
    }
    setIsPlaying(false); 
     if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
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
        animationTimeoutRef.current = null;
    }
    generateSteps();
  };
  
  const handleSpeedChange = (speedValue: number) => {
    setAnimationSpeed(speedValue);
  };

  if (!algorithm) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
            <p className="text-muted-foreground text-lg">
              Could not load data for &quot;{ALGORITHM_SLUG}&quot;.
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
            {algorithm.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {algorithm.description}
          </p>
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
            <CodePanel 
              codeSnippets={INSERTION_SORT_CODE_SNIPPETS} 
              currentLine={currentLine}
              defaultLanguage={"JavaScript"}
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
      </main>
      <Footer />
    </div>
  );
}
