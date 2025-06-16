
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { CodePanel } from '@/components/algo-vista/code-panel';
import { ControlsPanel } from '@/components/algo-vista/controls-panel';
import type { AlgorithmMetadata } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';

// Mock code for Bubble Sort - ensure line numbers match generation logic
const BUBBLE_SORT_CODE = [
  "function bubbleSort(arr) {",        // 1
  "  let n = arr.length;",              // 2
  "  let swapped;",                     // 3
  "  do {",                             // 4
  "    swapped = false;",               // 5
  "    for (let i = 0; i < n - 1; i++) {",// 6
  "      // Compare arr[i] and arr[i+1]", // 7 (Conceptual line for comparison)
  "      if (arr[i] > arr[i + 1]) {",   // 8
  "        // Swap arr[i] and arr[i+1]", // 9 (Conceptual line for start of swap)
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
];

type AlgorithmStep = {
  array: number[];
  activeIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  currentLine: number | null;
  message?: string; // Optional: for explanations
};

const DEFAULT_ANIMATION_SPEED = 700; // ms
const MIN_SPEED = 100; // ms
const MAX_SPEED = 2000; // ms

export default function AlgorithmVisualizerPage() {
  const params = useParams();
  const { toast } = useToast();
  const algorithmSlug = typeof params.algorithm === 'string' ? params.algorithm : '';
  
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  
  // Input and initial data
  const [inputValue, setInputValue] = useState('5,1,9,3,7,4,6,2,8');
  const [initialData, setInitialData] = useState<number[]>([]);

  // Visualization state
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [displayedData, setDisplayedData] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);

  // Controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === algorithmSlug);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
      if (foundAlgorithm.slug !== 'bubble-sort') {
        // For now, only Bubble Sort is implemented
        toast({ title: "Visualizer Not Implemented", description: `The visualizer for ${foundAlgorithm.title} is coming soon!`, variant: "default" });
      }
    } else {
      console.error("Algorithm not found:", algorithmSlug);
    }
  }, [algorithmSlug, toast]);

  const parseInput = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseInt(s, 10));

    if (parsed.some(isNaN)) {
      toast({
          title: "Invalid Input",
          description: "Please enter comma-separated numbers only.",
          variant: "destructive",
      });
      return null;
    }
    if (parsed.some(n => n > 999 || n < -999)) {
       toast({
          title: "Input out of range",
          description: "Please enter numbers between -999 and 999.",
          variant: "destructive",
      });
      return null;
    }
    return parsed;
  }, [toast]);

  const generateBubbleSortSteps = useCallback((arrToSort: number[]): AlgorithmStep[] => {
    const localSteps: AlgorithmStep[] = [];
    const arr = [...arrToSort];
    let n = arr.length;
    let swapped;
    const localSortedIndices: number[] = [];

    const addStep = (line: number, active: number[] = [], swapping: number[] = []) => {
      localSteps.push({
        array: [...arr],
        activeIndices: [...active],
        swappingIndices: [...swapping],
        sortedIndices: [...localSortedIndices].sort((a,b)=>a-b),
        currentLine: line,
      });
    };

    addStep(1); // function bubbleSort(arr) {
    if (n === 0) {
      addStep(18); // return arr;
      addStep(19); // }
      return localSteps;
    }
    
    addStep(2); // let n = arr.length;
    addStep(3); // let swapped;

    do {
      addStep(4); // do {
      swapped = false;
      addStep(5); // swapped = false;

      for (let i = 0; i < n - 1; i++) {
        addStep(6, [i, i + 1]); // for loop with active comparison
        addStep(7, [i, i + 1]); // Conceptual: Compare arr[i] and arr[i+1]
        addStep(8, [i, i + 1]); // if (arr[i] > arr[i + 1]) {
        if (arr[i] > arr[i + 1]) {
          addStep(9, [i, i + 1], [i, i + 1]); // Conceptual: Start of swap
          
          addStep(10, [i, i + 1], [i, i + 1]); // let temp = arr[i];
          let temp = arr[i];
          
          arr[i] = arr[i + 1];
          addStep(11, [i, i + 1], [i, i + 1]); // arr[i] = arr[i + 1];
          
          arr[i + 1] = temp;
          addStep(12, [i, i + 1], [i, i + 1]); // arr[i + 1] = temp; (array is now swapped)
          
          swapped = true;
          addStep(13); // swapped = true;
        }
        addStep(14); // } (end of if)
      }
      addStep(15); // } (end of for)

      // Element at n-1 is now sorted
      if (n - 1 >= 0) {
        localSortedIndices.push(n - 1);
      }
      
      n--;
      addStep(16); // n--;
    } while (swapped && n > 0);
    addStep(17); // } while (swapped && n > 0);

    // All remaining elements are sorted if swapped is false or n is 0
    const remainingUnsortedCount = arr.length - localSortedIndices.length;
    for(let i = 0; i < remainingUnsortedCount; i++) {
        if(!localSortedIndices.includes(i)) localSortedIndices.push(i);
    }
    localSortedIndices.sort((a,b) => a-b);


    addStep(18); // return arr;
    addStep(19); // } (end of function)
    
    // Final state with all sorted
     localSteps.push({
        array: [...arr],
        activeIndices: [],
        swappingIndices: [],
        sortedIndices: [...arr.map((_,idx) => idx)],
        currentLine: 18, // return arr;
      });

    return localSteps;
  }, []);
  
  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setDisplayedData(currentS.array);
      setActiveIndices(currentS.activeIndices);
      setSwappingIndices(currentS.swappingIndices);
      setSortedIndices(currentS.sortedIndices);
      setCurrentLine(currentS.currentLine);
    }
  }, [steps]);

  // Effect to initialize or update steps when inputValue changes
  useEffect(() => {
    const parsedData = parseInput(inputValue);
    if (parsedData !== null) {
      setInitialData(parsedData);
      if (algorithm?.slug === 'bubble-sort') {
        const newSteps = generateBubbleSortSteps(parsedData);
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
        setIsFinished(false);
        if (newSteps.length > 0) {
          updateStateFromStep(0);
        } else {
          setDisplayedData(parsedData); // Show initial array if no steps (e.g. empty input)
          setActiveIndices([]);
          setSwappingIndices([]);
          setSortedIndices([]);
          setCurrentLine(null);
        }
      } else {
        // For other algorithms, just display initial data for now
        setDisplayedData(parsedData);
        setActiveIndices([]);
        setSwappingIndices([]);
        setSortedIndices([]);
        setCurrentLine(null);
        setSteps([]);
      }
    }
     if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, parseInput, generateBubbleSortSteps, algorithm]); // animationTimeoutRef not needed


  // Effect for playing animation
  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length -1 && algorithm?.slug === 'bubble-sort') {
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
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep, algorithm]);


  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Validation and step generation happens in useEffect
  };

  const handlePlay = () => {
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length -1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play again." : "No data or steps to visualize.", variant: "default" });
      setIsPlaying(false);
      return;
    }
    if (algorithm?.slug !== 'bubble-sort') {
      toast({ title: "Visualizer Not Active", description: "This algorithm's interactive visualizer is not implemented yet.", variant: "default" });
      return;
    }
    setIsPlaying(true);
    setIsFinished(false); // Reset finished if replaying from middle
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
     if (algorithm?.slug !== 'bubble-sort') {
      toast({ title: "Visualizer Not Active", description: "This algorithm's interactive visualizer is not implemented yet.", variant: "default" });
      return;
    }

    setIsPlaying(false); // Pause if was playing
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

    const parsedData = parseInput(inputValue) || initialData; // Use current input or last valid initial data
    if (algorithm?.slug === 'bubble-sort') {
        const newSteps = generateBubbleSortSteps(parsedData);
        setSteps(newSteps);
        setCurrentStepIndex(0);
        if (newSteps.length > 0) {
            updateStateFromStep(0);
        } else {
             setDisplayedData(parsedData);
             setActiveIndices([]);
             setSwappingIndices([]);
             setSortedIndices([]);
             setCurrentLine(null);
        }
    } else {
        setDisplayedData(parsedData);
        setActiveIndices([]);
        setSwappingIndices([]);
        setSortedIndices([]);
        setCurrentLine(null);
        setSteps([]);
    }
  };
  
  const handleSpeedChange = (speedValue: number) => {
    // Map slider value (e.g. 0-100) to actual speed (e.g. MAX_SPEED to MIN_SPEED)
    // For a slider from 0 to 100:
    // speed = MAX_SPEED - (speedValue / 100) * (MAX_SPEED - MIN_SPEED)
    // For shadcn Slider, value is typically an array like [50]
    const val = speedValue; // Assuming slider passes single value like 0.5, 1, 1.5, 2
    // Let's assume slider passes values that can be mapped to speed, e.g. 1x, 0.5x, 2x
    // If slider passes 1, speed is DEFAULT_ANIMATION_SPEED. If 0.5, speed is *2. If 2, speed is /2.
    // So, newSpeed = DEFAULT_ANIMATION_SPEED / val;
    // For this example, let's map slider value [0.5, 1, 1.5, 2, 2.5, 3] to animation delay
    // This assumes the slider is configured to output values like 0.5, 1, 1.5, ...
    // Lower slider value = faster animation (less delay)
    // Higher slider value = slower animation (more delay)
    // Let's use a simple direct mapping where slider value is inverted for speed.
    // Slider output: 0.5 (fast) to 3 (slow). We want delay from MIN_SPEED to MAX_SPEED.
    // If slider is 100 to 2000:
    setAnimationSpeed(speedValue);

  };


  if (!algorithm) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The visualizer for &quot;{algorithmSlug}&quot; could not be found.
            </p>
            <p className="text-muted-foreground mt-1">
              Please check the URL or navigate back to the visualizers page.
            </p>
        </main>
        <Footer />
      </div>
    );
  }

  const codeToDisplay = algorithm.slug === 'bubble-sort' ? BUBBLE_SORT_CODE : ["// Code not available for this algorithm yet."];
  const isAlgoImplemented = algorithm.slug === 'bubble-sort';


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

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/5">
            <VisualizationPanel 
              data={displayedData} 
              activeIndices={activeIndices}
              swappingIndices={swappingIndices}
              sortedIndices={sortedIndices}
            />
          </div>

          <div className="lg:w-2/5">
            <CodePanel 
              codeLines={codeToDisplay} 
              currentLine={currentLine} 
            />
          </div>
        </div>

        <div className="mt-6">
          <ControlsPanel
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
