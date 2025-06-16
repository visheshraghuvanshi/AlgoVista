
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

// Specific line number mappings for Bubble Sort (JS version based)
// These conceptual line numbers guide the step generation logic.
const BUBBLE_SORT_LINE_MAP = {
  functionDeclaration: 1,
  getN: 2,
  declareSwappedVar: 3,
  doWhileStart: 4,
  setSwappedFalse: 5,
  forLoopStart: 6,
  compareComment: 7,
  ifCondition: 8,
  swapComment: 9,
  tempAssignment: 10,
  firstSwapAssign: 11,
  secondSwapAssign: 12,
  setSwappedTrue: 13,
  ifEnd: 14,
  forLoopEnd: 15,
  decrementN: 16,
  doWhileEndCondition: 17,
  returnArr: 18,
  functionEnd: 19,
};


type AlgorithmStep = {
  array: number[];
  activeIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  currentLine: number | null;
  message?: string; 
};

const DEFAULT_ANIMATION_SPEED = 700; 
const MIN_SPEED = 100; 
const MAX_SPEED = 2000; 

export default function AlgorithmVisualizerPage() {
  const params = useParams();
  const { toast } = useToast();
  const algorithmSlug = typeof params.algorithm === 'string' ? params.algorithm : '';
  
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === algorithmSlug);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
      if (foundAlgorithm.slug !== 'bubble-sort') {
        toast({ title: "Visualizer Not Implemented", description: `The visualizer for ${foundAlgorithm.title} is coming soon!`, variant: "default" });
      }
    } else {
      console.error("Algorithm not found:", algorithmSlug);
      // Potentially redirect or show a more permanent error message
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
    const lm = BUBBLE_SORT_LINE_MAP; // Use line map

    const addStep = (line: number, active: number[] = [], swapping: number[] = []) => {
      localSteps.push({
        array: [...arr],
        activeIndices: [...active],
        swappingIndices: [...swapping],
        sortedIndices: [...localSortedIndices].sort((a,b)=>a-b),
        currentLine: line,
      });
    };

    addStep(lm.functionDeclaration); 
    if (n === 0) {
      addStep(lm.returnArr); 
      addStep(lm.functionEnd); 
      return localSteps;
    }
    
    addStep(lm.getN); 
    addStep(lm.declareSwappedVar);

    do {
      addStep(lm.doWhileStart); 
      swapped = false;
      addStep(lm.setSwappedFalse); 

      for (let i = 0; i < n - 1; i++) {
        addStep(lm.forLoopStart, [i, i + 1]); 
        addStep(lm.compareComment, [i, i + 1]); 
        addStep(lm.ifCondition, [i, i + 1]); 
        if (arr[i] > arr[i + 1]) {
          addStep(lm.swapComment, [i, i + 1], [i, i + 1]); 
          
          addStep(lm.tempAssignment, [i, i + 1], [i, i + 1]); 
          let temp = arr[i];
          
          arr[i] = arr[i + 1];
          addStep(lm.firstSwapAssign, [i, i + 1], [i, i + 1]); 
          
          arr[i + 1] = temp;
          addStep(lm.secondSwapAssign, [i, i + 1], [i, i + 1]); 
          
          swapped = true;
          addStep(lm.setSwappedTrue); 
        }
        addStep(lm.ifEnd); 
      }
      addStep(lm.forLoopEnd); 

      if (n - 1 >= 0 && n -1 < arr.length) { // Ensure index is valid
        localSortedIndices.push(n - 1);
      }
      
      n--;
      addStep(lm.decrementN); 
    } while (swapped && n > 0);
    addStep(lm.doWhileEndCondition); 

    const remainingUnsortedCount = arr.length - localSortedIndices.length;
    for(let k = 0; k < remainingUnsortedCount; k++) { // Use k to avoid conflict with outer i if it existed
        if(!localSortedIndices.includes(k)) localSortedIndices.push(k);
    }
    localSortedIndices.sort((a,b) => a-b);


    addStep(lm.returnArr); 
    addStep(lm.functionEnd); 
    
     localSteps.push({ // Final sorted state
        array: [...arr],
        activeIndices: [],
        swappingIndices: [],
        sortedIndices: [...arr.map((_,idx) => idx)],
        currentLine: lm.returnArr, 
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
    }
     if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, parseInput, generateBubbleSortSteps, algorithm]); 


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
     if (algorithm?.slug !== 'bubble-sort') {
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

  const codeSnippetsToDisplay = algorithm.codeSnippets || { "Info": ["// Code snippets not available for this algorithm yet."] };
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
              codeSnippets={codeSnippetsToDisplay} 
              currentLine={currentLine}
              defaultLanguage={isAlgoImplemented ? "JavaScript" : undefined}
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
