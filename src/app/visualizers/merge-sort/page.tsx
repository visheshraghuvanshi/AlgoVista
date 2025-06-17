
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { MergeSortCodePanel } from './MergeSortCodePanel'; 
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmStep } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { MERGE_SORT_LINE_MAP, generateMergeSortSteps } from './merge-sort-logic';
import { algorithmMetadata } from './metadata'; // Import local metadata

const MERGE_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "function mergeSort(arr, low, high) { // Rec helper", // 1
    "  if (low >= high) return; // Base case",        // 2
    "  const middle = Math.floor(low + (high - low) / 2);",// 3
    "  mergeSort(arr, low, middle); // Sort left",     // 4
    "  mergeSort(arr, middle + 1, high); // Sort right",// 5
    "  merge(arr, low, middle, high); // Merge halves", // 6
    "}",                                               // 7
    "function merge(arr, low, mid, high) {",          // 8
    "  const leftSize = mid - low + 1;",               // 9
    "  const rightSize = high - mid;",                 // 10
    "  const L = new Array(leftSize);",                // 11
    "  const R = new Array(rightSize);",               // 12
    "  for (let i = 0; i < leftSize; i++) L[i] = arr[low + i];", // 13
    "  for (let j = 0; j < rightSize; j++) R[j] = arr[mid + 1 + j];", //14
    "  let i = 0, j = 0, k = low;",                    // 15
    "  while (i < leftSize && j < rightSize) {",       // 16
    "    if (L[i] <= R[j]) {",                         // 17
    "      arr[k] = L[i]; i++;",                       // 18
    "    } else {",                                    // 19
    "      arr[k] = R[j]; j++;",                       // 20
    "    }",                                           // 21
    "    k++;",                                        // 22
    "  }",                                             // 23
    "  while (i < leftSize) arr[k++] = L[i++];",       // 24
    "  while (j < rightSize) arr[k++] = R[j++];",      // 25
    "}",                                               // 26
    "// Initial call: mergeSort(arr, 0, arr.length - 1);", // 27
  ],
  Python: [
    "def merge_sort(arr, low, high):",
    "    if low < high:",
    "        middle = low + (high - low) // 2",
    "        merge_sort(arr, low, middle)",
    "        merge_sort(arr, middle + 1, high)",
    "        merge(arr, low, middle, high)",
    "",
    "def merge(arr, low, mid, high):",
    "    left_size = mid - low + 1",
    "    right_size = high - mid",
    "    L = [0] * left_size",
    "    R = [0] * right_size",
    "    for i in range(left_size): L[i] = arr[low + i]",
    "    for j in range(right_size): R[j] = arr[mid + 1 + j]",
    "    i, j, k = 0, 0, low",
    "    while i < left_size and j < right_size:",
    "        if L[i] <= R[j]:",
    "            arr[k] = L[i]; i += 1",
    "        else:",
    "            arr[k] = R[j]; j += 1",
    "        k += 1",
    "    while i < left_size: arr[k] = L[i]; i += 1; k += 1",
    "    while j < right_size: arr[k] = R[j]; j += 1; k += 1",
    "",
    "# Initial call: merge_sort(arr, 0, len(arr) - 1)",
  ],
  Java: [
    "public class MergeSort {",
    "    void merge(int arr[], int l, int m, int r) {",
    "        int n1 = m - l + 1;",
    "        int n2 = r - m;",
    "        int L[] = new int[n1];",
    "        int R[] = new int[n2];",
    "        for (int i = 0; i < n1; ++i) L[i] = arr[l + i];",
    "        for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];",
    "        int i = 0, j = 0, k = l;",
    "        while (i < n1 && j < n2) {",
    "            if (L[i] <= R[j]) {",
    "                arr[k] = L[i]; i++;",
    "            } else {",
    "                arr[k] = R[j]; j++;",
    "            }",
    "            k++;",
    "        }",
    "        while (i < n1) arr[k++] = L[i++];",
    "        while (j < n2) arr[k++] = R[j++];",
    "    }",
    "    void sort(int arr[], int l, int r) {",
    "        if (l < r) {",
    "            int m = l + (r - l) / 2;",
    "            sort(arr, l, m);",
    "            sort(arr, m + 1, r);",
    "            merge(arr, l, m, r);",
    "        }",
    "    }",
    "    // Initial call: new MergeSort().sort(arr, 0, arr.length - 1);",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "void merge(std::vector<int>& arr, int l, int m, int r) {",
    "    int n1 = m - l + 1;",
    "    int n2 = r - m;",
    "    std::vector<int> L(n1), R(n2);",
    "    for (int i = 0; i < n1; i++) L[i] = arr[l + i];",
    "    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];",
    "    int i = 0, j = 0, k = l;",
    "    while (i < n1 && j < n2) {",
    "        if (L[i] <= R[j]) {",
    "            arr[k] = L[i]; i++;",
    "        } else {",
    "            arr[k] = R[j]; j++;",
    "        }",
    "        k++;",
    "    }",
    "    while (i < n1) arr[k++] = L[i++];",
    "    while (j < n2) arr[k++] = R[j++];",
    "}",
    "void mergeSort(std::vector<int>& arr, int l, int r) {",
    "    if (l < r) {",
    "        int m = l + (r - l) / 2;",
    "        mergeSort(arr, l, m);",
    "        mergeSort(arr, m + 1, r);",
    "        merge(arr, l, m, r);",
    "    }",
    "}",
    "// Initial call: mergeSort(arr, 0, arr.size() - 1);",
  ],
};

const DEFAULT_ANIMATION_SPEED = 700; 
const MIN_SPEED = 100; 
const MAX_SPEED = 2000;

export default function MergeSortVisualizerPage() {
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
    }
    if (parsedData !== null) {
      let newSteps: AlgorithmStep[] = generateMergeSortSteps(parsedData);
      
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
              Could not load data for Merge Sort.
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
            {algorithmMetadata.description}
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
            <MergeSortCodePanel 
              codeSnippets={MERGE_SORT_CODE_SNIPPETS} 
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
         {algoDetails && <AlgorithmDetailsCard 
            title={algoDetails.title}
            description={algoDetails.description}
            timeComplexities={algoDetails.timeComplexities}
            spaceComplexity={algoDetails.spaceComplexity}
        />}
      </main>
      <Footer />
    </div>
  );
}
