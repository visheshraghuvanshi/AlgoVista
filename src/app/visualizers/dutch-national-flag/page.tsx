"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { DutchNationalFlagCodePanel } from './DutchNationalFlagCodePanel'; 
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, AlgorithmStep } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { DUTCH_NATIONAL_FLAG_LINE_MAP, generateDutchNationalFlagSteps } from './dutch-national-flag-logic';
import { algorithmMetadata } from './metadata'; 

const DUTCH_NATIONAL_FLAG_CODE_SNIPPETS = {
  JavaScript: [
    "function dutchNationalFlagSort(arr) {",                // 1
    "  let low = 0, mid = 0, high = arr.length - 1;",       // 2
    "  while (mid <= high) {",                              // 3
    "    switch (arr[mid]) {",
    "      case 0:",                                         // 4
    "        [arr[low], arr[mid]] = [arr[mid], arr[low]];",  // 5
    "        low++; mid++;",                                // 6
    "        break;",                                       // 7
    "      case 1:",                                         // 8
    "        mid++;",                                        // 9
    "        break;",                                       // 10
    "      case 2:",                                         // 11
    "        [arr[mid], arr[high]] = [arr[high], arr[mid]];",// 12
    "        high--;",                                       // 13
    "        break;",                                       // 14
    "    }",                                                // 15 (End Switch)
    "  }",                                                  // 16 (End While)
    "  return arr;",                                        // 17
    "}",                                                    // 18
  ],
  Python: [
    "def dutch_national_flag_sort(arr):",
    "    low, mid, high = 0, 0, len(arr) - 1",
    "    while mid <= high:",
    "        if arr[mid] == 0:",
    "            arr[low], arr[mid] = arr[mid], arr[low]",
    "            low += 1",
    "            mid += 1",
    "        elif arr[mid] == 1:",
    "            mid += 1",
    "        else:  # arr[mid] == 2",
    "            arr[mid], arr[high] = arr[high], arr[mid]",
    "            high -= 1",
    "    return arr",
  ],
  Java: [
    "public class DutchNationalFlag {",
    "    public static void sort(int[] arr) {",
    "        int low = 0, mid = 0;",
    "        int high = arr.length - 1;",
    "        int temp;",
    "        while (mid <= high) {",
    "            switch (arr[mid]) {",
    "                case 0:",
    "                    temp = arr[low]; arr[low] = arr[mid]; arr[mid] = temp;",
    "                    low++; mid++;",
    "                    break;",
    "                case 1:",
    "                    mid++;",
    "                    break;",
    "                case 2:",
    "                    temp = arr[mid]; arr[mid] = arr[high]; arr[high] = temp;",
    "                    high--;",
    "                    break;",
    "            }",
    "        }",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::swap",
    "void dutchNationalFlagSort(std::vector<int>& arr) {",
    "    int low = 0, mid = 0;",
    "    int high = arr.size() - 1;",
    "    while (mid <= high) {",
    "        switch (arr[mid]) {",
    "            case 0:",
    "                std::swap(arr[low++], arr[mid++]);",
    "                break;",
    "            case 1:",
    "                mid++;",
    "                break;",
    "            case 2:",
    "                std::swap(arr[mid], arr[high--]);",
    "                break;",
    "        }",
    "    }",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function DutchNationalFlagVisualizerPage() {
  const { toast } = useToast();
  
  const [inputValue, setInputValue] = useState('0,1,2,0,1,1,2,0,2,1,0'); 
  
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
    const parsed = value.split(',').map(s => s.trim()).filter(s => s !== '').map(s => parseInt(s, 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated numbers (0, 1, or 2).", variant: "destructive" });
      return null;
    }
    if (parsed.some(n => ![0,1,2].includes(n))) {
       toast({ title: "Invalid Values", description: "Array must contain only 0s, 1s, and 2s.", variant: "destructive" });
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
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }
    const parsedArray = parseInput(inputValue);

    if (parsedArray !== null) {
      const newSteps = generateDutchNationalFlagSteps(parsedArray);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsFinished(newSteps.length <= 1);

      if (newSteps.length > 0) {
        updateStateFromStep(0);
      } else { 
        setDisplayedData(parsedArray); 
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null);
      }
    } else { 
      setSteps([]); setCurrentStepIndex(0);
      setDisplayedData([]);
      setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
      setProcessingSubArrayRange(null); setPivotActualIndex(null);
      setIsPlaying(false); setIsFinished(false);
    }
  }, [inputValue, parseInput, updateStateFromStep]);


  useEffect(() => {
    generateSteps();
  }, [generateSteps]); 

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
    setInputValue('0,1,2,0,1,1,2,0,2,1,0'); // Reset to default or trigger generateSteps if inputValue is a dependency
    // generateSteps will be called by useEffect due to inputValue change if it's a dependency of generateSteps or its own useEffect.
    // If generateSteps is not automatically called, explicitly call it:
    // generateSteps(); // if inputValue was already default, this ensures regeneration.
  };

  const handleSpeedChange = (speedValue: number) => setAnimationSpeed(speedValue);

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!algorithmMetadata || !algoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
          <p className="text-muted-foreground text-lg">Could not load data for Dutch National Flag.</p>
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
            <DutchNationalFlagCodePanel
              codeSnippets={DUTCH_NATIONAL_FLAG_CODE_SNIPPETS}
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
         <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
