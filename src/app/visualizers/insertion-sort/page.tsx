
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { CodePanel } from '@/components/algo-vista/code-panel';
import { ControlsPanel } from '@/components/algo-vista/controls-panel';
import type { AlgorithmMetadata } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';

const INSERTION_SORT_LINE_MAP = { 
  functionDeclaration: 1, getN: 2, outerLoopStart: 3, keyAssignment: 4,  jAssignment: 5, whileLoopComment1: 6, whileLoopComment2: 7,  whileCondition: 8, shiftElement: 9, decrementJ: 10, whileLoopEnd: 11, placeKey: 12, outerLoopEnd: 13, returnArr: 14, functionEnd: 15,
};

type AlgorithmStep = {
  array: number[];
  activeIndices: number[]; 
  swappingIndices: number[]; 
  sortedIndices: number[]; 
  currentLine: number | null;
  message?: string; 
  processingSubArrayRange?: [number, number] | null; 
  pivotActualIndex?: number | null;
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

  const isAlgoImplemented = useMemo(() => {
    return ['bubble-sort', 'insertion-sort', 'merge-sort', 'quick-sort'].includes(algorithm?.slug || '');
  }, [algorithm]);

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

  const generateInsertionSortSteps = useCallback((arrToSort: number[]): AlgorithmStep[] => {
    const localSteps: AlgorithmStep[] = [];
    if (!arrToSort || arrToSort.length === 0) return localSteps;
    const arr = [...arrToSort];
    const n = arr.length;
    const lm = INSERTION_SORT_LINE_MAP;
    let localSortedIndices: number[] = [];

    const addStep = (line: number, active: number[] = [], swapping: number[] = [], message?: string, currentArrState = [...arr], processingRange:[number,number]|null = null, pivotIdx: number|null = null) => {
      localSteps.push({
        array: currentArrState,
        activeIndices: [...active],
        swappingIndices: [...swapping],
        sortedIndices: [...localSortedIndices].sort((a,b)=>a-b),
        currentLine: line,
        message,
        processingSubArrayRange: processingRange,
        pivotActualIndex: pivotIdx
      });
    };
    
    addStep(lm.functionDeclaration, [], [], "Start Insertion Sort");
    if (n === 0) {
      addStep(lm.returnArr); addStep(lm.functionEnd); return localSteps;
    }
    addStep(lm.getN);
    if (n > 0) localSortedIndices.push(0);

    for (let i = 1; i < n; i++) {
      addStep(lm.outerLoopStart, [i], [], `Iterating for element at index ${i}`);
      let key = arr[i];
      addStep(lm.keyAssignment, [i], [i], `key = arr[${i}] (value: ${key})`);
      let j = i - 1;
      addStep(lm.jAssignment, [i, j], [i], `j = ${j}`);
      addStep(lm.whileLoopComment1, [i,j], [i]); 
      addStep(lm.whileLoopComment2, [i,j], [i]);
      while (j >= 0 && arr[j] > key) {
        addStep(lm.whileCondition, [j, i], [i], `Comparing arr[${j}] (${arr[j]}) > key (${key})`);
        arr[j + 1] = arr[j];
        addStep(lm.shiftElement, [j, i], [j, j + 1], `Shift arr[${j}] (${arr[j]}) to arr[${j + 1}]`);
        j = j - 1;
        addStep(lm.decrementJ, [j < 0 ? i : j, i], [i], `Decrement j to ${j}`);
      }
      addStep(lm.whileLoopEnd, [j+1, i], [i], `End of while. Insert position for key (${key}) is index ${j+1}`);
      arr[j + 1] = key;
      addStep(lm.placeKey, [], [i, j + 1], `Place key (${key}) at arr[${j + 1}]`);
      localSortedIndices = Array.from({length: i + 1}, (_, k) => k);
      addStep(lm.outerLoopEnd, [], [], `Element at index ${i} sorted. Sorted: 0-${i}`);
    }
    localSortedIndices = arr.map((_, idx) => idx);
    addStep(lm.returnArr, [], [], "Array is sorted");
    addStep(lm.functionEnd, [], [], "Algorithm finished");
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
      setProcessingSubArrayRange(currentS.processingSubArrayRange || null);
      setPivotActualIndex(currentS.pivotActualIndex || null);
    }
  }, [steps]);

  useEffect(() => {
    const parsedData = parseInput(inputValue);
    if (parsedData !== null) {
      setInitialData(parsedData);
      let newSteps: AlgorithmStep[] = [];

      if (isAlgoImplemented) { 
        newSteps = generateInsertionSortSteps(parsedData);
      } else {
        setDisplayedData(parsedData);
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null);
        setSteps([]); 
      }
      
      if (isAlgoImplemented && newSteps.length > 0) {
        setSteps(newSteps);
        setCurrentStepIndex(0);
        updateStateFromStep(0);
      } else if (!isAlgoImplemented) {
         setDisplayedData(parsedData); 
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, parseInput, generateInsertionSortSteps, isAlgoImplemented]); 


  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length -1 && isAlgoImplemented) {
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
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep, isAlgoImplemented]);


  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handlePlay = () => {
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length -1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play again." : "No data or steps to visualize.", variant: "default" });
      setIsPlaying(false);
      return;
    }
    if (!isAlgoImplemented) {
      toast({ title: "Visualizer Not Active", description: "This algorithm's interactive visualizer is not implemented yet.", variant: "default" });
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
     if (!isAlgoImplemented) {
      toast({ title: "Visualizer Not Active", description: "This algorithm's interactive visualizer is not implemented yet.", variant: "default" });
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

    const parsedData = parseInput(inputValue) || initialData; 
    let newSteps: AlgorithmStep[] = [];

    if (isAlgoImplemented) { 
        newSteps = generateInsertionSortSteps(parsedData);
    }

    if (isAlgoImplemented && newSteps.length > 0) {
        setSteps(newSteps);
        setCurrentStepIndex(0);
        updateStateFromStep(0);
    } else { 
        setDisplayedData(parsedData); setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null); setSteps([]);
    }
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

  const codeSnippetsToDisplay = algorithm.codeSnippets || { "Info": ["// Code snippets not available for this algorithm yet."] };

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
              codeSnippets={codeSnippetsToDisplay} 
              currentLine={currentLine}
              defaultLanguage={"JavaScript"}
            />
          </div>
        </div>
        
        <div className="w-full">
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
