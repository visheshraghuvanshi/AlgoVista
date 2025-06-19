
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from './VisualizationPanel'; // Local import
import { LinearSearchCodePanel } from './LinearSearchCodePanel'; 
import { SearchingControlsPanel } from './SearchingControlsPanel'; // Local import
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { ArrayAlgorithmStep, AlgorithmMetadata, AlgorithmDetailsProps } from './types'; // Local import
import { useToast } from "@/hooks/use-toast";
import { LINEAR_SEARCH_LINE_MAP, generateLinearSearchSteps } from './linear-search-logic';
import { algorithmMetadata } from './metadata'; 

const LINEAR_SEARCH_CODE_SNIPPETS = {
  JavaScript: [
    "function linearSearch(arr, target) {",      // 1
    "  for (let i = 0; i < arr.length; i++) {", // 2
    "    if (arr[i] === target) {",             // 3
    "      return i; // Found",                 // 4
    "    }",                                      // 5
    "  }",                                      // 6
    "  return -1; // Not found",                // 7
    "}",
  ],
  Python: [
    "def linear_search(arr, target):",
    "    for i in range(len(arr)):",
    "        if arr[i] == target:",
    "            return i  # Found",
    "    return -1  # Not found",
  ],
  Java: [
    "public class LinearSearch {",
    "    public static int search(int[] arr, int target) {",
    "        for (int i = 0; i < arr.length; i++) {",
    "            if (arr[i] == target) {",
    "                return i; // Found",
    "            }",
    "        }",
    "        return -1; // Not found",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "int linearSearch(const std::vector<int>& arr, int target) {",
    "    for (int i = 0; i < arr.size(); ++i) {",
    "        if (arr[i] == target) {",
    "            return i; // Found",
    "        }",
    "    }",
    "    return -1; // Not found",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function LinearSearchVisualizerPage() {
  const { toast } = useToast();
  
  const [inputValue, setInputValue] = useState('5,1,9,3,7,4,6,2,8');
  const [targetValue, setTargetValue] = useState('7');
  
  const [steps, setSteps] = useState<ArrayAlgorithmStep[]>([]); // Use local type
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
    const parsed = value.split(',').map(s => s.trim()).filter(s => s !== '').map(s => parseInt(s, 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated numbers only for the array.", variant: "destructive" });
      return null;
    }
    if (parsed.some(n => n > 999 || n < -999)) {
      toast({ title: "Input out of range", description: "Array numbers must be between -999 and 999.", variant: "destructive" });
      return null;
    }
    return parsed;
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

   const generateSteps = useCallback(() => {
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }

    const parsedArray = parseInput(inputValue);
    const parsedTarget = parseTarget(targetValue);

    if (parsedArray !== null && parsedTarget !== null) {
      const newSteps = generateLinearSearchSteps(parsedArray, parsedTarget);
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
        setDisplayedData(parsedArray || []);
        setActiveIndices([]);
        setSwappingIndices([]);
        setSortedIndices([]);
        setCurrentLine(null);
        setProcessingSubArrayRange(null);
        setPivotActualIndex(null);
        setAuxiliaryData(null);
      }
    } else {
      setSteps([]);
      setCurrentStepIndex(0);
      setDisplayedData(parsedArray || []); 
      setActiveIndices([]);
      setSwappingIndices([]);
      setSortedIndices([]);
      setCurrentLine(null);
      setProcessingSubArrayRange(null);
      setPivotActualIndex(null);
      setAuxiliaryData(null);
      setIsPlaying(false);
      setIsFinished(true);
    }
  }, [inputValue, targetValue, parseInput, parseTarget, setDisplayedData, setActiveIndices, setSwappingIndices, setSortedIndices, setCurrentLine, setProcessingSubArrayRange, setPivotActualIndex, setAuxiliaryData]);


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
  const handleTargetChange = (value: string) => setTargetValue(value);

  const handlePlay = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play again." : "No data or steps. Check input.", variant: "default" });
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
      toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished. Reset to step." : "No data/steps.", variant: "default" });
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
    generateSteps();
  };

  const handleSpeedChange = (speedValue: number) => setAnimationSpeed(speedValue);

  const localAlgoDetails: AlgorithmDetailsProps = {
      title: algorithmMetadata.title,
      description: algorithmMetadata.longDescription || algorithmMetadata.description,
      timeComplexities: algorithmMetadata.timeComplexities!,
      spaceComplexity: algorithmMetadata.spaceComplexity!,
  };


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
            <LinearSearchCodePanel
              codeSnippets={LINEAR_SEARCH_CODE_SNIPPETS}
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

