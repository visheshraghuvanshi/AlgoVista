
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from './VisualizationPanel'; // Local import
import { CocktailSortCodePanel } from './CocktailSortCodePanel'; 
import { SortingControlsPanel } from './SortingControlsPanel'; // Local import
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, AlgorithmStep, AlgorithmDetailsProps } from './types'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { generateCocktailSortSteps } from './cocktail-sort-logic';
import { algorithmMetadata } from './metadata'; // Local import

const COCKTAIL_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "function cocktailSort(arr) {",                        // 1
    "  let swapped = true; let start = 0; let end = arr.length - 1;", // 2
    "  do {",                                              // 3
    "    swapped = false;",                                // 4
    "    // Forward pass",
    "    for (let i = start; i < end; i++) {",             // 5
    "      if (arr[i] > arr[i + 1]) {",                    // 6
    "        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];", // 7
    "        swapped = true;",                             // 8
    "      }",                                             // 9
    "    }",                                               // 10
    "    if (!swapped) break;",                            // 11 
    "    // If no swaps, array is sorted",                 // 12 (conceptually part of break line)
    "    swapped = false;",                                // 13
    "    end--;",                                          // 14
    "    // Backward pass",
    "    for (let i = end - 1; i >= start; i--) {",        // 15
    "      if (arr[i] > arr[i + 1]) {",                    // 16
    "        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];", // 17
    "        swapped = true;",                             // 18
    "      }",                                             // 19
    "    }",                                               // 20
    "    start++;",                                        // 21
    "  } while (swapped);",                                // 22
    "  return arr;",                                       // 23
    "}",                                                   // 24
  ],
  Python: [
    "def cocktail_sort(arr):",
    "    n = len(arr)",
    "    swapped = True",
    "    start = 0",
    "    end = n - 1",
    "    while swapped:",
    "        swapped = False",
    "        for i in range(start, end):",
    "            if arr[i] > arr[i + 1]:",
    "                arr[i], arr[i + 1] = arr[i + 1], arr[i]",
    "                swapped = True",
    "        if not swapped:",
    "            break",
    "        swapped = False",
    "        end -= 1",
    "        for i in range(end - 1, start - 1, -1):",
    "            if arr[i] > arr[i + 1]:",
    "                arr[i], arr[i + 1] = arr[i + 1], arr[i]",
    "                swapped = True",
    "        start += 1",
    "    return arr",
  ],
  Java: [
    "public class CocktailSort {",
    "    void cocktailSort(int arr[]) {",
    "        boolean swapped = true;",
    "        int start = 0;",
    "        int end = arr.length - 1;",
    "        while (swapped) {",
    "            swapped = false;",
    "            for (int i = start; i < end; ++i) {",
    "                if (arr[i] > arr[i + 1]) {",
    "                    int temp = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = temp;",
    "                    swapped = true;",
    "                }",
    "            }",
    "            if (!swapped) break;",
    "            swapped = false;",
    "            end = end - 1;",
    "            for (int i = end - 1; i >= start; --i) {",
    "                if (arr[i] > arr[i + 1]) {",
    "                    int temp = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = temp;",
    "                    swapped = true;",
    "                }",
    "            }",
    "            start = start + 1;",
    "        }",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::swap",
    "void cocktailSort(std::vector<int>& arr) {",
    "    bool swapped = true;",
    "    int start = 0;",
    "    int end = arr.size() - 1;",
    "    while (swapped) {",
    "        swapped = false;",
    "        for (int i = start; i < end; ++i) {",
    "            if (arr[i] > arr[i + 1]) {",
    "                std::swap(arr[i], arr[i + 1]);",
    "                swapped = true;",
    "            }",
    "        }",
    "        if (!swapped) break;",
    "        swapped = false;",
    "        end = end - 1;",
    "        for (int i = end - 1; i >= start; --i) {",
    "            if (arr[i] > arr[i + 1]) {",
    "                std::swap(arr[i], arr[i + 1]);",
    "                swapped = true;",
    "            }",
    "        }",
    "        start = start + 1;",
    "    }",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 700; 
const MIN_SPEED = 100; 
const MAX_SPEED = 2000;

export default function CocktailSortVisualizerPage() {
  const { toast } = useToast();
  
  const [inputValue, setInputValue] = useState('5,1,9,3,7,4,6,2,8');

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
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }
    if (parsedData !== null) {
      let newSteps: AlgorithmStep[] = generateCocktailSortSteps(parsedData);
      
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsFinished(false);

      if (newSteps.length > 0) {
        const firstStep = newSteps[0];
        setDisplayedData(firstStep.array);
        setActiveIndices(firstStep.activeIndices);
        setSwappingIndices(firstStep.swappingIndices);
        setSortedIndices(firstStep.sortedIndices);
        setCurrentLine(firstStep.currentLine);
        setProcessingSubArrayRange(firstStep.processingSubArrayRange || null);
        setPivotActualIndex(firstStep.pivotActualIndex || null);
      } else { 
        setDisplayedData(parsedData);
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null);
      }
    } else {
        setSteps([]);
        setCurrentStepIndex(0);
        setDisplayedData([]); 
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null);
        setIsPlaying(false); setIsFinished(false);
    }
  }, [inputValue, parseInput]);

  useEffect(() => {
    generateSteps();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]); 


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
              Could not load data for Cocktail Shaker Sort.
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
            <CocktailSortCodePanel 
              codeSnippets={COCKTAIL_SORT_CODE_SNIPPETS} 
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
        {localAlgoDetails && <AlgorithmDetailsCard {...localAlgoDetails} />}
      </main>
      <Footer />
    </div>
  );
}

