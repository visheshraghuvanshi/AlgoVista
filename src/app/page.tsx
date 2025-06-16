"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { CodePanel } from '@/components/algo-vista/code-panel';
import { ControlsPanel } from '@/components/algo-vista/controls-panel';
import { useToast } from "@/hooks/use-toast";

const BUBBLE_SORT_CODE = [
  "function bubbleSort(arr) {",
  "  let n = arr.length;",
  "  let swapped;",
  "  do {",
  "    swapped = false;",
  "    for (let i = 0; i < n - 1; i++) {",
  "      if (arr[i] > arr[i+1]) {",
  "        [arr[i], arr[i+1]] = [arr[i+1], arr[i]];",
  "        swapped = true;",
  "      }",
  "    }",
  "    n--;",
  "  } while (swapped);",
  "  return arr;",
  "}",
];

// Define algorithm step types
interface AlgorithmStep {
  data: number[];
  currentLine: number | null;
  activeIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  logMessage?: string;
}

function* bubbleSortGenerator(initialArr: number[]): Generator<AlgorithmStep, number[], undefined> {
  const arr = [...initialArr];
  const n = arr.length;
  let swapped;

  yield { data: [...arr], currentLine: 2, sortedIndices: [] }; // let n = arr.length;

  let sortedCount = 0;

  do {
    yield { data: [...arr], currentLine: 4, sortedIndices: arr.slice(n - sortedCount).map((_, i) => n - 1 - i) }; // do {
    swapped = false;
    yield { data: [...arr], currentLine: 5, sortedIndices: arr.slice(n - sortedCount).map((_, i) => n - 1 - i) }; // swapped = false;

    for (let i = 0; i < n - 1 - sortedCount; i++) {
      yield { data: [...arr], currentLine: 6, activeIndices: [i, i + 1], sortedIndices: arr.slice(n - sortedCount).map((_, k) => n - 1 - k) }; // for loop
      yield { data: [...arr], currentLine: 7, activeIndices: [i, i + 1], sortedIndices: arr.slice(n - sortedCount).map((_, k) => n - 1 - k) }; // if (arr[i] > arr[i+1])

      if (arr[i] > arr[i+1]) {
        yield { data: [...arr], currentLine: 8, swappingIndices: [i, i + 1], sortedIndices: arr.slice(n - sortedCount).map((_, k) => n - 1 - k) }; // [arr[i], arr[i+1]] = ...
        [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
        swapped = true;
        yield { data: [...arr], currentLine: 8, activeIndices: [i, i + 1], sortedIndices: arr.slice(n - sortedCount).map((_, k) => n - 1 - k) }; // after swap
        yield { data: [...arr], currentLine: 9, activeIndices: [i, i + 1], sortedIndices: arr.slice(n - sortedCount).map((_, k) => n - 1 - k) }; // swapped = true;
      }
    }
    yield { data: [...arr], currentLine: 12, sortedIndices: arr.slice(n - sortedCount).map((_, k) => n - 1 - k) }; // n--; (effectively, as loop limit decreases)
    sortedCount++;

  } while (swapped);
  yield { data: [...arr], currentLine: 13, sortedIndices: arr.slice(n - sortedCount).map((_, k) => n - 1 - k) }; // } while (swapped);

  const finalSortedIndices = Array.from({ length: n }, (_, i) => i);
  yield { data: [...arr], currentLine: 14, sortedIndices: finalSortedIndices, logMessage: "Sort complete!" }; // return arr;
  return arr;
}


export default function Home() {
  const [data, setData] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  
  const [inputValue, setInputValue] = useState<string>("8,3,5,1,9,2");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  
  const [algorithmGenerator, setAlgorithmGenerator] = useState<Generator<AlgorithmStep, number[], undefined> | null>(null);
  const { toast } = useToast();

  const parseInput = useCallback((): number[] => {
    return inputValue.split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));
  }, [inputValue]);

  const initializeAlgorithm = useCallback(() => {
    const parsedData = parseInput();
    if (parsedData.length === 0 && inputValue.trim() !== '') {
      toast({ title: "Invalid Input", description: "Please enter comma-separated numbers.", variant: "destructive" });
      return;
    }
    setData(parsedData);
    const generator = bubbleSortGenerator(parsedData);
    setAlgorithmGenerator(generator);
    
    // Set initial state from first step
    const firstStep = generator.next();
    if (!firstStep.done && firstStep.value) {
        setData(firstStep.value.data);
        setCurrentLine(firstStep.value.currentLine);
        setActiveIndices(firstStep.value.activeIndices || []);
        setSwappingIndices(firstStep.value.swappingIndices || []);
        setSortedIndices(firstStep.value.sortedIndices || []);
    }

    setIsPlaying(false);
    setIsFinished(false);
  }, [parseInput, toast, inputValue]);


  useEffect(() => {
    initializeAlgorithm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initialize on mount with default input

  const handleStep = useCallback(() => {
    if (!algorithmGenerator) {
      initializeAlgorithm(); // Initialize if not already
      return;
    }

    const nextStep = algorithmGenerator.next();
    if (nextStep.done) {
      setIsPlaying(false);
      setIsFinished(true);
      if (nextStep.value) { // Final state
         setData(nextStep.value); // Final sorted array
         setCurrentLine(14); // Corresponds to 'return arr'
         setActiveIndices([]);
         setSwappingIndices([]);
         setSortedIndices(Array.from({ length: nextStep.value.length }, (_, i) => i)); // All sorted
      }
      toast({ title: "Algorithm Finished", description: "The sorting algorithm has completed." });
    } else {
      const stepValue = nextStep.value;
      setData(stepValue.data);
      setCurrentLine(stepValue.currentLine);
      setActiveIndices(stepValue.activeIndices || []);
      setSwappingIndices(stepValue.swappingIndices || []);
      setSortedIndices(stepValue.sortedIndices || []);
      if(stepValue.logMessage) {
        toast({ title: "Algorithm Log", description: stepValue.logMessage });
      }
    }
  }, [algorithmGenerator, initializeAlgorithm, toast]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (isPlaying && !isFinished) {
      timerId = setTimeout(() => {
        handleStep();
      }, 700); // Animation speed
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isPlaying, isFinished, handleStep]);

  const handlePlay = () => {
    if (isFinished) { // If finished, re-initialize
      initializeAlgorithm();
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    initializeAlgorithm();
    setInputValue("8,3,5,1,9,2"); // Reset input to default or keep current
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Debounce or explicit button to apply new input
    // For now, new input is applied on reset or play if finished
    if (!isPlaying) { // If not playing, re-initialize with new input value immediately
        const parsedData = value.split(',')
            .map(s => parseInt(s.trim(), 10))
            .filter(n => !isNaN(n));
        
        setData(parsedData.length > 0 ? parsedData : []); // Update visualization preview
        const generator = bubbleSortGenerator(parsedData);
        setAlgorithmGenerator(generator);
        const firstStep = generator.next(); // Get first step to reset visualization state
         if (!firstStep.done && firstStep.value) {
            setData(firstStep.value.data);
            setCurrentLine(firstStep.value.currentLine);
            setActiveIndices(firstStep.value.activeIndices || []);
            setSwappingIndices(firstStep.value.swappingIndices || []);
            setSortedIndices(firstStep.value.sortedIndices || []);
        } else {
            setCurrentLine(null);
            setActiveIndices([]);
            setSwappingIndices([]);
            setSortedIndices([]);
        }
        setIsFinished(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <VisualizationPanel data={data} activeIndices={activeIndices} swappingIndices={swappingIndices} sortedIndices={sortedIndices} />
          <CodePanel codeLines={BUBBLE_SORT_CODE} currentLine={currentLine} />
        </div>
        <ControlsPanel
          onPlay={handlePlay}
          onPause={handlePause}
          onStep={handleStep}
          onReset={handleReset}
          onInputChange={handleInputChange}
          inputValue={inputValue}
          isPlaying={isPlaying}
          isFinished={isFinished}
        />
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm border-t">
        AlgoVista - Interactive Algorithm Visualizer
      </footer>
    </div>
  );
}
