
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { HeapSortCodePanel } from './HeapSortCodePanel'; 
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import type { AlgorithmStep } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { HEAP_SORT_LINE_MAP, generateHeapSortSteps } from './heap-sort-logic';

const HEAP_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "function heapSort(arr) {",                            // 1
    "  let n = arr.length;",                               // 2
    "  // Build heap (rearrange array)",
    "  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {", // 3
    "    heapify(arr, n, i);",                             // 4
    "  }",                                                 // 5
    "  // One by one extract an element from heap",
    "  for (let i = n - 1; i > 0; i--) {",                 // 6
    "    // Move current root to end",
    "    [arr[0], arr[i]] = [arr[i], arr[0]];",            // 7
    "    // arr[i] is now sorted (implicitly visualized)",  // 8
    "    // call max heapify on the reduced heap",
    "    heapify(arr, i, 0);",                             // 9
    "  }",                                                 // 10
    "  return arr;",                                       // 11
    "}",                                                   // 12
    "function heapify(arr, n, i) {",                       // 13
    "  let largest = i;",                                  // 14
    "  let l = 2 * i + 1;",                                // 15
    "  let r = 2 * i + 2;",                                // 16
    "  // If left child is larger than root",
    "  if (l < n && arr[l] > arr[largest]) {",             // 17
    "    largest = l;",                                  // 18
    "  }",                                                 // 19
    "  // If right child is larger than largest so far",
    "  if (r < n && arr[r] > arr[largest]) {",             // 20
    "    largest = r;",                                  // 21
    "  }",                                                 // 22
    "  // If largest is not root",
    "  if (largest !== i) {",                              // 23
    "    [arr[i], arr[largest]] = [arr[largest], arr[i]];",// 24
    "    // Recursively heapify the affected sub-tree",
    "    heapify(arr, n, largest);",                       // 25
    "  }",                                                 // 26
    "}",                                                   // 27
  ],
  Python: [
    "def heap_sort(arr):",
    "    n = len(arr)",
    "    # Build a maxheap.",
    "    for i in range(n // 2 - 1, -1, -1):",
    "        heapify(arr, n, i)",
    "    # One by one extract elements",
    "    for i in range(n - 1, 0, -1):",
    "        arr[i], arr[0] = arr[0], arr[i]  # swap",
    "        heapify(arr, i, 0)",
    "    return arr",
    "",
    "def heapify(arr, n, i):",
    "    largest = i  # Initialize largest as root",
    "    l = 2 * i + 1  # left = 2*i + 1",
    "    r = 2 * i + 2  # right = 2*i + 2",
    "    # See if left child of root exists and is",
    "    # greater than root",
    "    if l < n and arr[l] > arr[largest]:",
    "        largest = l",
    "    # See if right child of root exists and is",
    "    # greater than root",
    "    if r < n and arr[r] > arr[largest]:",
    "        largest = r",
    "    # Change root, if needed",
    "    if largest != i:",
    "        arr[i], arr[largest] = arr[largest], arr[i]  # swap",
    "        # Heapify the root.",
    "        heapify(arr, n, largest)",
  ],
  Java: [
    "public class HeapSort {",
    "    public void sort(int arr[]) {",
    "        int n = arr.length;",
    "        // Build heap (rearrange array)",
    "        for (int i = n / 2 - 1; i >= 0; i--)",
    "            heapify(arr, n, i);",
    "        // One by one extract an element from heap",
    "        for (int i = n - 1; i > 0; i--) {",
    "            // Move current root to end",
    "            int temp = arr[0];",
    "            arr[0] = arr[i];",
    "            arr[i] = temp;",
    "            // call max heapify on the reduced heap",
    "            heapify(arr, i, 0);",
    "        }",
    "    }",
    "    // To heapify a subtree rooted with node i which is",
    "    // an index in arr[]. n is size of heap",
    "    void heapify(int arr[], int n, int i) {",
    "        int largest = i; // Initialize largest as root",
    "        int l = 2 * i + 1; // left = 2*i + 1",
    "        int r = 2 * i + 2; // right = 2*i + 2",
    "        // If left child is larger than root",
    "        if (l < n && arr[l] > arr[largest])",
    "            largest = l;",
    "        // If right child is larger than largest so far",
    "        if (r < n && arr[r] > arr[largest])",
    "            largest = r;",
    "        // If largest is not root",
    "        if (largest != i) {",
    "            int swap = arr[i];",
    "            arr[i] = arr[largest];",
    "            arr[largest] = swap;",
    "            // Recursively heapify the affected sub-tree",
    "            heapify(arr, n, largest);",
    "        }",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::swap",
    "// To heapify a subtree rooted with node i which is an index in arr[].",
    "// n is size of heap.",
    "void heapify(std::vector<int>& arr, int n, int i) {",
    "    int largest = i; // Initialize largest as root",
    "    int l = 2 * i + 1; // left = 2*i + 1",
    "    int r = 2 * i + 2; // right = 2*i + 2",
    "    // If left child is larger than root",
    "    if (l < n && arr[l] > arr[largest])",
    "        largest = l;",
    "    // If right child is larger than largest so far",
    "    if (r < n && arr[r] > arr[largest])",
    "        largest = r;",
    "    // If largest is not root",
    "    if (largest != i) {",
    "        std::swap(arr[i], arr[largest]);",
    "        // Recursively heapify the affected sub-tree",
    "        heapify(arr, n, largest);",
    "    }",
    "}",
    "void heapSort(std::vector<int>& arr) {",
    "    int n = arr.size();",
    "    // Build heap (rearrange array)",
    "    for (int i = n / 2 - 1; i >= 0; i--)",
    "        heapify(arr, n, i);",
    "    // One by one extract an element from heap",
    "    for (int i = n - 1; i > 0; i--) {",
    "        // Move current root to end",
    "        std::swap(arr[0], arr[i]);",
    "        // call max heapify on the reduced heap",
    "        heapify(arr, i, 0);",
    "    }",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 700; 
const MIN_SPEED = 100; 
const MAX_SPEED = 2000;
const ALGORITHM_SLUG = 'heap-sort';

export default function HeapSortVisualizerPage() {
  const { toast } = useToast();
  
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  
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
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
    }
    if (parsedData !== null) {
      let newSteps: AlgorithmStep[] = generateHeapSortSteps(parsedData);
      
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

  const algoDetails: AlgorithmDetailsProps = {
    title: "Heap Sort",
    description: "A comparison-based sorting technique based on a Binary Heap data structure. In-place with O(n log n) complexity.",
    timeComplexities: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(1)",
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
            <HeapSortCodePanel 
              codeSnippets={HEAP_SORT_CODE_SNIPPETS} 
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
