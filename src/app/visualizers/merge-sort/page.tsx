
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

const MERGE_SORT_LINE_MAP = {
  mergeSortBase: 1, 
  baseCaseReturn: 2, 
  calculateMiddle: 3, 
  recursiveCallLeft: 4, 
  recursiveCallRight: 5, 
  callMerge: 6, 
  mergeSortEnd: 7, 
  mergeFunction: 8, 
  calcLeftSize: 9, 
  calcRightSize: 10, 
  createLeftArray: 11, 
  createRightArray: 12, 
  copyToLeftArray: 13, 
  copyToRightArray: 14, 
  initMergePointers: 15, 
  mergeLoopStart: 16, 
  compareLvsR: 17, 
  copyFromL: 18, 
  elseBlock: 19, 
  copyFromR: 20, 
  endIfElse: 21, 
  incrementK: 22, 
  mergeLoopEnd: 23, 
  copyRemainingL: 24, 
  copyRemainingR: 25, 
  mergeFunctionEnd: 26, 
  initialCallComment: 27, 
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
const ALGORITHM_SLUG = 'merge-sort';

export default function MergeSortVisualizerPage() {
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

 const generateMergeSortSteps = useCallback((arrToSort: number[]): AlgorithmStep[] => {
    const localSteps: AlgorithmStep[] = [];
    if (!arrToSort || arrToSort.length === 0) {
      localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
      return localSteps;
    }
    
    const arr = [...arrToSort];
    const lm = MERGE_SORT_LINE_MAP;

    function addStep(
        line: number,
        currentArrState: number[],
        active: number[] = [],
        swapping: number[] = [],
        sorted: number[] = [],
        message: string = "",
        processingRange: [number, number] | null = null,
    ) {
        localSteps.push({
            array: [...currentArrState],
            activeIndices: active,
            swappingIndices: swapping,
            sortedIndices: sorted,
            currentLine: line,
            message,
            processingSubArrayRange: processingRange,
        });
    }

    function merge(currentArr: number[], low: number, mid: number, high: number, currentSortedGlobal: number[]) {
        addStep(lm.mergeFunction, currentArr, [], [], [...currentSortedGlobal], `Merging subarray [${low}..${high}]`, [low, high]);
        
        const leftSize = mid - low + 1;
        addStep(lm.calcLeftSize, currentArr, [], [], [...currentSortedGlobal], `Left half size: ${leftSize}`, [low, high]);
        const rightSize = high - mid;
        addStep(lm.calcRightSize, currentArr, [], [], [...currentSortedGlobal], `Right half size: ${rightSize}`, [low, high]);

        const L = new Array(leftSize);
        const R = new Array(rightSize);
        addStep(lm.createLeftArray, currentArr, [], [], [...currentSortedGlobal], `Creating temp left array`, [low, high]);
        addStep(lm.createRightArray, currentArr, [], [], [...currentSortedGlobal], `Creating temp right array`, [low, high]);

        for (let i = 0; i < leftSize; i++) L[i] = currentArr[low + i];
        addStep(lm.copyToLeftArray, currentArr, Array.from({length: leftSize}, (_,k)=>low+k), [], [...currentSortedGlobal], `Copying to temp left array`, [low, high]);
        
        for (let j = 0; j < rightSize; j++) R[j] = currentArr[mid + 1 + j];
        addStep(lm.copyToRightArray, currentArr, Array.from({length: rightSize}, (_,k)=>mid+1+k), [], [...currentSortedGlobal], `Copying to temp right array`, [low, high]);

        let i = 0, j = 0, k = low;
        addStep(lm.initMergePointers, currentArr, [low+i, mid+1+j], [], [...currentSortedGlobal], `Initializing merge pointers i=${i}, j=${j}, k=${k}`, [low, high]);

        while (i < leftSize && j < rightSize) {
            addStep(lm.mergeLoopStart, currentArr, [low + i, mid + 1 + j], [], [...currentSortedGlobal], `Comparing L[${i}] (${L[i]}) and R[${j}] (${R[j]})`, [low, high]);
            addStep(lm.compareLvsR, currentArr, [low+i, mid+1+j], [], [...currentSortedGlobal], `Is L[${i}] (${L[i]}) <= R[${j}] (${R[j]})?`, [low,high]);
            if (L[i] <= R[j]) {
                currentArr[k] = L[i];
                addStep(lm.copyFromL, currentArr, [low+i], [k], [...currentSortedGlobal], `Copying L[${i}] (${L[i]}) to arr[${k}]`, [low, high]);
                i++;
            } else {
                addStep(lm.elseBlock, currentArr, [low+i, mid+1+j], [], [...currentSortedGlobal], `No, L[${i}] > R[${j}]`, [low,high]);
                currentArr[k] = R[j];
                addStep(lm.copyFromR, currentArr, [mid+1+j], [k], [...currentSortedGlobal], `Copying R[${j}] (${R[j]}) to arr[${k}]`, [low, high]);
                j++;
            }
            addStep(lm.endIfElse, currentArr, [], [k], [...currentSortedGlobal], `arr[${k}] is now ${currentArr[k]}`, [low,high]);
            k++;
            addStep(lm.incrementK, currentArr, [], [], [...currentSortedGlobal], `Increment k to ${k}`, [low, high]);
        }
        addStep(lm.mergeLoopEnd, currentArr, [], [], [...currentSortedGlobal], `Merge loop finished`, [low, high]);

        while (i < leftSize) {
            currentArr[k] = L[i];
            addStep(lm.copyRemainingL, currentArr, [low+i], [k], [...currentSortedGlobal], `Copying remaining L[${i}] (${L[i]}) to arr[${k}]`, [low, high]);
            i++; k++;
        }
        while (j < rightSize) {
            currentArr[k] = R[j];
            addStep(lm.copyRemainingR, currentArr, [mid+1+j], [k], [...currentSortedGlobal], `Copying remaining R[${j}] (${R[j]}) to arr[${k}]`, [low, high]);
            j++; k++;
        }
        
        for(let l_idx = low; l_idx <= high; l_idx++) {
            if (!currentSortedGlobal.includes(l_idx)) currentSortedGlobal.push(l_idx);
        }
        currentSortedGlobal.sort((a,b)=>a-b);
        addStep(lm.mergeFunctionEnd, currentArr, [], [], [...currentSortedGlobal], `Subarray [${low}..${high}] merged and sorted`, [low, high]);
    }

    function mergeSortRecursive(currentArr: number[], low: number, high: number, currentSortedGlobal: number[]) {
        addStep(lm.mergeSortBase, currentArr, [], [], [...currentSortedGlobal], `mergeSort(arr, ${low}, ${high})`, [low, high]);
        if (low >= high) {
            addStep(lm.baseCaseReturn, currentArr, [], [], [...currentSortedGlobal], `Base case: low (${low}) >= high (${high}). Return.`, [low, high]);
            if(low === high && !currentSortedGlobal.includes(low)) currentSortedGlobal.push(low); 
            return;
        }
        const middle = Math.floor(low + (high - low) / 2);
        addStep(lm.calculateMiddle, currentArr, [], [], [...currentSortedGlobal], `Middle calculated: ${middle}`, [low, high]);
        
        addStep(lm.recursiveCallLeft, currentArr, [], [], [...currentSortedGlobal], `Recursive call for left half: [${low}..${middle}]`, [low, high]);
        mergeSortRecursive(currentArr, low, middle, currentSortedGlobal);
        
        addStep(lm.recursiveCallRight, currentArr, [], [], [...currentSortedGlobal], `Recursive call for right half: [${middle + 1}..${high}]`, [low, high]);
        mergeSortRecursive(currentArr, middle + 1, high, currentSortedGlobal);
        
        addStep(lm.callMerge, currentArr, [], [], [...currentSortedGlobal], `Call merge for [${low}..${high}]`, [low, high]);
        merge(currentArr, low, middle, high, currentSortedGlobal);
        addStep(lm.mergeSortEnd, currentArr, [], [], [...currentSortedGlobal], `Finished mergeSort for [${low}..${high}]`, [low,high]);
    }
    
    const globalSortedIndices: number[] = [];
    addStep(lm.initialCallComment, arr, [], [], [], "Initial call to Merge Sort for the whole array", [0, arr.length - 1]);
    mergeSortRecursive(arr, 0, arr.length - 1, globalSortedIndices);
    addStep(lm.mergeFunctionEnd, arr, [], [], arr.map((_, i) => i), "Array is sorted", null); 
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
        newSteps = generateMergeSortSteps(parsedData);
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
  }, [inputValue, parseInput, generateMergeSortSteps, isAlgoImplemented]); 


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
        newSteps = generateMergeSortSteps(parsedData);
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
