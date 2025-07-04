
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from './VisualizationPanel'; 
import { BubbleSortCodePanel } from './BubbleSortCodePanel'; 
import { SortingControlsPanel } from './SortingControlsPanel'; 
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; 
import type { ArrayAlgorithmStep, AlgorithmMetadata, AlgorithmDetailsProps } from './types'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { BUBBLE_SORT_LINE_MAP, generateBubbleSortSteps } from './bubble-sort-logic';
import { algorithmMetadata } from './metadata';

const BUBBLE_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "function bubbleSort(arr) {",        // 1
    "  let n = arr.length;",              // 2
    "  let swapped;",                     // 3
    "  do {",                             // 4
    "    swapped = false;",               // 5
    "    for (let i = 0; i < n - 1; i++) {",// 6
    "      // Compare arr[i] and arr[i+1]", // 7 
    "      if (arr[i] > arr[i + 1]) {",   // 8
    "        // Swap arr[i] and arr[i+1]", // 9 
    "        let temp = arr[i];",          // 10
    "        arr[i] = arr[i + 1];",        // 11
    "        arr[i + 1] = temp;",         // 12
    "        swapped = true;",            // 13
    "      }",                            // 14
    "    }",                              // 15
    "    n--; // Optimization",            // 16
    "  } while (swapped && n > 0);",      // 17
    "  return arr;",                     // 18
    "}",                                  // 19
  ],
  Python: [
    "def bubble_sort(arr):",
    "    n = len(arr)",
    "    # Outer loop for passes",
    "    for i in range(n - 1):",
    "        swapped_in_pass = False",
    "        # Inner loop for comparisons",
    "        for j in range(n - 1 - i):",
    "            # Compare arr[j] and arr[j+1]",
    "            if arr[j] > arr[j+1]:",
    "                # Swap arr[j] and arr[j+1]",
    "                arr[j], arr[j+1] = arr[j+1], arr[j]",
    "                swapped_in_pass = True",
    "            # End if",
    "        # End inner loop",
    "        # Optimization: if no swaps, array is sorted",
    "        if not swapped_in_pass:",
    "            break",
    "    return arr",
  ],
  Java: [
    "public class BubbleSort {",
    "  public static void bubbleSort(int[] arr) {",
    "    int n = arr.length;",
    "    boolean swapped;",
    "    do {",
    "      swapped = false;",
    "      for (int i = 0; i < n - 1; i++) {",
    "        // Compare arr[i] and arr[i+1]",
    "        if (arr[i] > arr[i + 1]) {",
    "          // Swap arr[i] and arr[i+1]",
    "          int temp = arr[i];",
    "          arr[i] = arr[i + 1];",
    "          arr[i + 1] = temp;",
    "          swapped = true;",
    "        }",
    "      }",
    "      n--; // Optimization",
    "    } while (swapped && n > 0);",
    "  }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::swap",
    "void bubbleSort(std::vector<int>& arr) {",
    "  int n = arr.size();",
    "  bool swapped;",
    "  do {",
    "    swapped = false;",
    "    for (int i = 0; i < n - 1; ++i) {",
    "      // Compare arr[i] and arr[i+1]",
    "      if (arr[i] > arr[i+1]) {",
    "        // Swap arr[i] and arr[i+1]",
    "        std::swap(arr[i], arr[i+1]);",
    "        swapped = true;",
    "      }",
    "    }",
    "    n--; // Optimization",
    "  } while (swapped && n > 0);",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 700; 
const MIN_SPEED = 100; 
const MAX_SPEED = 2000;

export default function BubbleSortVisualizerPage() {
  const { toast } = useToast();
    
  const [inputValue, setInputValue] = useState('5,1,9,3,7,4,6,2,8');

  const [steps, setSteps] = useState<ArrayAlgorithmStep[]>([]); 
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [displayedData, setDisplayedData] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [processingSubArrayRange, setProcessingSubArrayRange] = useState<[number, number] | null>(null);
  const [pivotActualIndex, setPivotActualIndex] = useState<number | null>(null);
  const [auxiliaryData, setAuxiliaryData] = useState<ArrayAlgorithmStep['auxiliaryData']>(null);


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
      setAuxiliaryData(currentS.auxiliaryData || null);
    }
  }, [steps]);

  const generateSteps = useCallback(() => {
    const parsedData = parseInput(inputValue);
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }
    if (parsedData !== null) {
      let newSteps: ArrayAlgorithmStep[] = generateBubbleSortSteps(parsedData);
      
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsFinished(newSteps.length <= 1);

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
        setDisplayedData(parsedData);
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null); setAuxiliaryData(null);
      }
    } else {
        setSteps([]);
        setCurrentStepIndex(0);
        setDisplayedData([]); 
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null); setAuxiliaryData(null);
        setIsPlaying(false); setIsFinished(true);
    }
  }, [inputValue, parseInput, setDisplayedData, setActiveIndices, setSwappingIndices, setSortedIndices, setCurrentLine, setProcessingSubArrayRange, setPivotActualIndex, setAuxiliaryData]);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]); 


  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length -1 ) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        updateStateFromStep(nextStepIndex);
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
    if (isFinished || currentStepIndex >= steps.length -1) {
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

  const localAlgoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
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
              Could not load data for Bubble Sort.
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
            {steps[currentStepIndex]?.message || algorithmMetadata.description}
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
            <BubbleSortCodePanel 
              codeSnippets={BUBBLE_SORT_CODE_SNIPPETS} 
              currentLine={currentLine}
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
        {localAlgoDetails && <AlgorithmDetailsCard 
            title={localAlgoDetails.title}
            description={localAlgoDetails.description}
            timeComplexities={localAlgoDetails.timeComplexities}
            spaceComplexity={localAlgoDetails.spaceComplexity}
        />}
      </main>
      <Footer />
    </div>
  );
}

