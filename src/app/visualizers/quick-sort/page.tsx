
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

const QUICK_SORT_LINE_MAP = {
  quickSortBase: 1, 
  quickSortCondition: 2, 
  callPartition: 3, 
  recursiveCallLeft: 4, 
  recursiveCallRight: 5, 
  quickSortConditionEnd: 6, 
  quickSortEnd: 7, 
  partitionBase: 8, 
  setPivot: 9, 
  setI: 10, 
  partitionLoopStart: 11, 
  compareElementWithPivot: 12, 
  incrementI: 13, 
  swapIJ: 14, 
  compareElementEnd: 15, 
  partitionLoopEnd: 16, 
  swapPivotToMiddle: 17, 
  returnPI: 18, 
  partitionEnd: 19, 
  initialCallComment: 20, 
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
const ALGORITHM_SLUG = 'quick-sort';

export default function QuickSortVisualizerPage() {
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

  const generateQuickSortSteps = useCallback((arrToSort: number[]): AlgorithmStep[] => {
    const localSteps: AlgorithmStep[] = [];
    if (!arrToSort || arrToSort.length === 0) {
      localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
      return localSteps;
    }

    const arr = [...arrToSort];
    const lm = QUICK_SORT_LINE_MAP;
    const currentGlobalSortedIndices: number[] = [];

    function addStep(
        line: number,
        currentArrState: number[],
        active: number[] = [],
        swapping: number[] = [],
        message: string = "",
        processingRange: [number, number] | null = null,
        pivotIdx: number | null = null
    ) {
        localSteps.push({
            array: [...currentArrState],
            activeIndices: active,
            swappingIndices: swapping,
            sortedIndices: [...currentGlobalSortedIndices].sort((a,b)=>a-b),
            currentLine: line,
            message,
            processingSubArrayRange: processingRange,
            pivotActualIndex: pivotIdx,
        });
    }

    function partition(currentArr: number[], low: number, high: number) {
        addStep(lm.partitionBase, currentArr, [], [], `Partitioning subarray [${low}..${high}]`, [low, high]);
        const pivotValue = currentArr[high];
        addStep(lm.setPivot, currentArr, [high], [], `Pivot selected: arr[${high}] = ${pivotValue}`, [low, high], high);
        
        let i = low - 1;
        addStep(lm.setI, currentArr, [high], [], `i initialized to ${i}`, [low, high], high);

        for (let j = low; j < high; j++) {
            addStep(lm.partitionLoopStart, currentArr, [j, high], [], `Comparing arr[${j}] (${currentArr[j]}) with pivot (${pivotValue})`, [low, high], high);
            addStep(lm.compareElementWithPivot, currentArr, [j, high], [], `Is arr[${j}] (${currentArr[j]}) < pivot (${pivotValue})?`, [low,high], high);
            if (currentArr[j] < pivotValue) {
                i++;
                addStep(lm.incrementI, currentArr, [j, high], [], `Yes. Increment i to ${i}`, [low, high], high);
                
                addStep(lm.swapIJ, currentArr, [i,j,high], [i,j], `Swap arr[${i}] (${currentArr[i]}) and arr[${j}] (${currentArr[j]})`, [low, high], high);
                [currentArr[i], currentArr[j]] = [currentArr[j], currentArr[i]];
                addStep(lm.swapIJ, currentArr, [i,j,high], [i,j], `Swapped. Array: [${currentArr.slice(low, high+1).join(',')}]`, [low, high], high); 
            } else {
                 addStep(lm.compareElementWithPivot, currentArr, [j, high], [], `No. arr[${j}] (${currentArr[j]}) not < pivot.`, [low, high], high);
            }
            addStep(lm.compareElementEnd, currentArr, [j,high], [], `End of comparison for j=${j}`, [low,high],high);
        }
        addStep(lm.partitionLoopEnd, currentArr, [high], [], `Partition loop finished. i = ${i}`, [low, high], high);

        addStep(lm.swapPivotToMiddle, currentArr, [i+1, high], [i+1, high], `Swap pivot arr[${high}] (${currentArr[high]}) with arr[${i+1}] (${currentArr[i+1]})`, [low, high], high);
        [currentArr[i + 1], currentArr[high]] = [currentArr[high], currentArr[i + 1]];
        const partitionIndex = i + 1;
        addStep(lm.swapPivotToMiddle, currentArr, [partitionIndex], [partitionIndex], `Pivot swapped. Partition index pi = ${partitionIndex}. Array: [${currentArr.slice(low,high+1).join(',')}]`, [low, high], partitionIndex);
        
        if (!currentGlobalSortedIndices.includes(partitionIndex)) currentGlobalSortedIndices.push(partitionIndex);
        addStep(lm.returnPI, currentArr, [], [], `Pivot at ${partitionIndex} is in sorted position.`, [low, high], partitionIndex);
        addStep(lm.partitionEnd, currentArr, [], [], `End partition for [${low}..${high}]`, [low,high], partitionIndex);
        return partitionIndex;
    }

    function quickSortRecursive(currentArr: number[], low: number, high: number) {
        addStep(lm.quickSortBase, currentArr, [], [], `quickSort(arr, ${low}, ${high})`, [low, high]);
        if (low < high) {
            addStep(lm.quickSortCondition, currentArr, [], [], `low (${low}) < high (${high}). Proceed.`, [low, high]);
            
            const pi = partition(currentArr, low, high);
            addStep(lm.callPartition, currentArr, [], [], `Partition index pi = ${pi}`, [low, high], pi);

            addStep(lm.recursiveCallLeft, currentArr, [], [], `Recursive call for left part: [${low}..${pi-1}]`, [low, pi-1], null);
            quickSortRecursive(currentArr, low, pi - 1);
            
            addStep(lm.recursiveCallRight, currentArr, [], [], `Recursive call for right part: [${pi+1}..${high}]`, [pi+1, high], null);
            quickSortRecursive(currentArr, pi + 1, high);
        } else {
            addStep(lm.quickSortCondition, currentArr, [], [], `Base case: low (${low}) not < high (${high}). Return.`, [low, high]);
            for (let k_idx = low; k_idx <= high; k_idx++) {
                if (k_idx >=0 && k_idx < currentArr.length && !currentGlobalSortedIndices.includes(k_idx)) {
                    currentGlobalSortedIndices.push(k_idx);
                }
            }
        }
        addStep(lm.quickSortEnd, currentArr, [], [], `Finished quickSort for [${low}..${high}]`, [low, high]);
    }
    
    addStep(lm.initialCallComment, arr, [], [], "Initial call to Quick Sort for the whole array", [0, arr.length - 1]);
    quickSortRecursive(arr, 0, arr.length - 1);
    
    for(let k=0; k < arr.length; k++) {
        if(!currentGlobalSortedIndices.includes(k)) currentGlobalSortedIndices.push(k);
    }
    currentGlobalSortedIndices.sort((a,b)=>a-b);
    addStep(lm.quickSortEnd, arr, [], [], "Array is sorted", null, null);
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
        newSteps = generateQuickSortSteps(parsedData);
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
  }, [inputValue, parseInput, generateQuickSortSteps, isAlgoImplemented]); 


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
        newSteps = generateQuickSortSteps(parsedData);
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
