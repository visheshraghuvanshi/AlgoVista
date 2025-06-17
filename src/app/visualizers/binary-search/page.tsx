
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { BinarySearchCodePanel } from './BinarySearchCodePanel'; 
import { SearchingControlsPanel } from '@/components/algo-vista/searching-controls-panel';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlgorithmMetadata, AlgorithmStep } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { BINARY_SEARCH_LINE_MAP, generateBinarySearchSteps } from './binary-search-logic';

const BINARY_SEARCH_CODE_SNIPPETS = {
  JavaScript: [
    "function binarySearch(sortedArr, target) {",         // 1
    "  let low = 0, high = sortedArr.length - 1;",      // 2
    "  while (low <= high) {",                          // 3
    "    let mid = Math.floor(low + (high - low) / 2);",// 4
    "    if (sortedArr[mid] === target) {",             // 5
    "      return mid; // Found",                       // 6
    "    } else if (sortedArr[mid] < target) {",        // 7
    "      low = mid + 1;",                             // 8
    "    } else {",                                     // 9
    "      high = mid - 1;",                            // 10
    "    }",                                            // 11
    "  }",                                              // 12
    "  return -1; // Not found",                        // 13
    "}",                                                // 14
    "// Note: Input array must be sorted.",             // 15
  ],
  Python: [
    "def binary_search(sorted_arr, target):",
    "    low, high = 0, len(sorted_arr) - 1",
    "    while low <= high:",
    "        mid = low + (high - low) // 2",
    "        if sorted_arr[mid] == target:",
    "            return mid  # Found",
    "        elif sorted_arr[mid] < target:",
    "            low = mid + 1",
    "        else:",
    "            high = mid - 1",
    "    return -1  # Not found",
    "# Note: Input array must be sorted.",
  ],
  Java: [
    "public class BinarySearch {",
    "    public static int search(int[] sortedArr, int target) {",
    "        int low = 0, high = sortedArr.length - 1;",
    "        while (low <= high) {",
    "            int mid = low + (high - low) / 2;",
    "            if (sortedArr[mid] == target) {",
    "                return mid; // Found",
    "            } else if (sortedArr[mid] < target) {",
    "                low = mid + 1;",
    "            } else {",
    "                high = mid - 1;",
    "            }",
    "        }",
    "        return -1; // Not found",
    "    }",
    "    // Note: Input array must be sorted.",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::sort if needed",
    "int binarySearch(const std::vector<int>& sortedArr, int target) {",
    "    int low = 0, high = sortedArr.size() - 1;",
    "    while (low <= high) {",
    "        int mid = low + (high - low) / 2;",
    "        if (sortedArr[mid] == target) {",
    "            return mid; // Found",
    "        } else if (sortedArr[mid] < target) {",
    "            low = mid + 1;",
    "        } else {",
    "            high = mid - 1;",
    "        }",
    "    }",
    "    return -1; // Not found",
    "}",
    "// Note: Input array must be sorted.",
  ],
};

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;
const ALGORITHM_SLUG = 'binary-search';

interface AlgorithmDetailsProps {
  title: string;
  description: string;
  timeComplexities: { best: string; average: string; worst: string };
  spaceComplexity: string;
}

function AlgorithmDetailsCard({ title, description, timeComplexities, spaceComplexity }: AlgorithmDetailsProps) {
  return (
    <Card className="mt-8 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary dark:text-accent">
          About {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <div>
          <h3 className="font-semibold text-lg mb-1">Time Complexity:</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Best Case: {timeComplexities.best}</li>
            <li>Average Case: {timeComplexities.average}</li>
            <li>Worst Case: {timeComplexities.worst}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">Space Complexity:</h3>
          <p className="text-muted-foreground">{spaceComplexity}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BinarySearchVisualizerPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);

  const [inputValue, setInputValue] = useState('1,2,3,4,5,6,7,8,9'); 
  const [targetValue, setTargetValue] = useState('7');
  
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
        toast({ title: "Input Array Sorted", description: "Binary Search requires a sorted array. Your input has been sorted.", variant: "default" });
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
        setInputValue(parsedArray.join(','));
      }
      lastProcessedInputValueRef.current = parsedArray.join(',');

      const newSteps = generateBinarySearchSteps(parsedArray, parsedTarget);
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
        setDisplayedData(parsedArray); 
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null);
      }
    } else {
      setSteps([]);
      setCurrentStepIndex(0);
      setDisplayedData(parsedArray || []);
      setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
      setProcessingSubArrayRange(null); setPivotActualIndex(null);
      setIsPlaying(false);
      setIsFinished(false);
    }
  }, [inputValue, targetValue, parseInput, parseTarget, toast]);


  useEffect(() => {
    generateSteps(false); 
  }, [targetValue, generateSteps]); 

  useEffect(() => {
    if (inputValue !== lastProcessedInputValueRef.current) {
        const parsedArray = parseInput(inputValue, true); 
        if (parsedArray) {
            const newInputValueStr = parsedArray.join(',');
            if (inputValue !== newInputValueStr) {
                // This will trigger the other useEffect via setInputValue -> state change
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
  }, [inputValue, parseInput, generateSteps]);

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
    generateSteps(true); 
  };

  const handleSpeedChange = (speedValue: number) => setAnimationSpeed(speedValue);

  const algoDetails = {
    title: "Binary Search",
    description: "Efficiently finds an item from a sorted list by repeatedly dividing the search interval in half. Introduces logarithmic time complexity.",
    timeComplexities: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1) (Iterative)",
  };

  if (!algorithm) {
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
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{algorithm.description}</p>
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
            <BinarySearchCodePanel
              codeSnippets={BINARY_SEARCH_CODE_SNIPPETS}
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
         <AlgorithmDetailsCard 
            title={algoDetails.title}
            description={algoDetails.description}
            timeComplexities={algoDetails.timeComplexities}
            spaceComplexity={algoDetails.spaceComplexity}
        />
      </main>
      <Footer />
    </div>
  );
}
